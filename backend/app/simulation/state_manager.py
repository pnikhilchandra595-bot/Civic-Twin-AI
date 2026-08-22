from typing import Dict, Optional, List, Any
import copy
from app.models.schemas import (
    CityDigitalTwinState, SimulationControlCommand, DispatchUnit, RoadStatus
)
from app.data.indian_cities import load_indian_city_scenario
from app.simulation.hydrology import HydrologySimulationEngine
from app.simulation.cascade import CascadeFailureEngine
from app.simulation.routing import DynamicEvacuationRouter
from app.ai.incident_commander import AIIncidentCommander
from app.services.satellite_ingestion import satellite_sar_engine
from app.services.alert_system import alert_hub
from app.services.sms_gateway import sms_alert_gateway

class DigitalTwinStateManager:
    """
    Manages the live running state of the CivicTwin digital twin for Indian cities,
    processes control commands, recalculates physics/cascade/routing,
    syncs real satellite/weather feeds, and dispatches real SMS alerts to user-entered numbers.
    """

    def __init__(self):
        self.state: CityDigitalTwinState = load_indian_city_scenario("mumbai_monsoon")
        self.hydro = HydrologySimulationEngine()
        self.cascade = CascadeFailureEngine()
        self.router = DynamicEvacuationRouter()
        self.ai_cmd = AIIncidentCommander()
        self.is_playing = False
        self.playback_speed = 1.0

    def get_current_state(self) -> CityDigitalTwinState:
        return self.state

    def reset_scenario(self, city_id: str = "mumbai_monsoon") -> CityDigitalTwinState:
        self.state = load_indian_city_scenario(city_id)
        self.recompute_all()
        return self.state

    def switch_city(self, city_id: str) -> CityDigitalTwinState:
        self.state = load_indian_city_scenario(city_id)
        self.recompute_all()
        return self.state

    def sync_live_weather(self, weather_data: Dict[str, Any]) -> CityDigitalTwinState:
        rain_rate = weather_data.get("rain_rate_mmhr", 0.0)
        wind_speed = weather_data.get("wind_speed_kmh", 15.0)
        wind_dir = weather_data.get("wind_direction_deg", 45.0)

        self.state.rain_intensity_mmhr = max(0.0, min(150.0, rain_rate))
        self.state.wind_speed_kmh = wind_speed
        self.state.wind_direction_deg = wind_dir
        
        if self.state.rain_intensity_mmhr > 10:
            self.state.timeline_hour = max(1.0, self.state.timeline_hour)

        self.recompute_all()
        return self.state

    def get_sar_report(self) -> Dict[str, Any]:
        return satellite_sar_engine.process_sar_flood_extent(
            center_lat=self.state.center_coords[0],
            center_lng=self.state.center_coords[1],
            rainfall_mmhr=self.state.rain_intensity_mmhr,
            surge_m=self.state.storm_surge_m,
            levee_breached=self.state.levee_breached
        )

    def get_radio_messages(self) -> List[Dict[str, Any]]:
        return [m.model_dump() for m in alert_hub.radio_log]

    def send_radio_message(self, channel: str, sender: str, message: str, priority: str = "ROUTINE") -> Dict[str, Any]:
        trans = alert_hub.add_radio_message(
            channel=channel,
            sender=sender,
            recipient="All Units",
            message=message,
            priority=priority
        )
        return trans.model_dump()

    def transmit_eas_broadcast(
        self,
        alert_type: str,
        threat_level: str,
        target_zones: List[str],
        message_text: str,
        translations: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        record = alert_hub.transmit_broadcast(
            alert_type=alert_type,
            threat_level=threat_level,
            target_zones=target_zones,
            message_text=message_text,
            translations=translations
        )
        return record.model_dump()

    async def send_live_mobile_alert(
        self,
        phone_numbers: List[str],
        alert_title: str,
        message: str,
        language: str = "EN"
    ) -> Dict[str, Any]:
        """
        Sends real SMS / Mobile Alert to the phone numbers entered by user.
        """
        result = await sms_alert_gateway.send_emergency_sms(
            phone_numbers=phone_numbers,
            alert_title=alert_title,
            message=message,
            city_name=self.state.city_name,
            language=language
        )
        # Log to tactical radio comms
        alert_hub.add_radio_message(
            channel="TAC-1 NDMA Command",
            sender="SMS Gateway Dispatch",
            recipient="Control Room",
            message=f"Dispatched Real Mobile Alert to {len(phone_numbers)} numbers: [{alert_title}]",
            priority="EMERGENCY"
        )
        return result

    def apply_control_command(self, cmd: SimulationControlCommand) -> CityDigitalTwinState:
        if cmd.timeline_hour is not None:
            self.state.timeline_hour = max(0.0, min(12.0, cmd.timeline_hour))

        if cmd.rain_intensity_mmhr is not None:
            self.state.rain_intensity_mmhr = max(0.0, min(150.0, cmd.rain_intensity_mmhr))

        if cmd.storm_surge_m is not None:
            self.state.storm_surge_m = max(0.0, min(5.0, cmd.storm_surge_m))

        if cmd.wind_speed_kmh is not None:
            self.state.wind_speed_kmh = max(0.0, min(160.0, cmd.wind_speed_kmh))

        if cmd.wind_direction_deg is not None:
            self.state.wind_direction_deg = cmd.wind_direction_deg

        if cmd.toggle_levee_breach is not None:
            self.state.levee_breached = cmd.toggle_levee_breach

        if cmd.toggle_substation_trip is not None:
            self.state.substation_tripped = cmd.toggle_substation_trip

        if cmd.custom_block_road_id is not None:
            for road in self.state.roads:
                if road.id == cmd.custom_block_road_id:
                    road.status = RoadStatus.CLOSED_EMERGENCY

        if cmd.custom_unblock_road_id is not None:
            for road in self.state.roads:
                if road.id == cmd.custom_unblock_road_id:
                    road.status = RoadStatus.CLEAR

        if cmd.dispatch_unit_command is not None:
            self._handle_dispatch_command(cmd.dispatch_unit_command)

        self.recompute_all()
        return self.state

    def _handle_dispatch_command(self, cmd_data: dict):
        unit_id = cmd_data.get("unit_id")
        target_node_id = cmd_data.get("target_node_id")
        mission = cmd_data.get("mission", "Deploying to critical zone")

        target_node = next((n for n in self.state.nodes if n.id == target_node_id), None)
        unit = next((u for u in self.state.dispatch_units if u.id == unit_id), None)

        if unit and target_node:
            unit.target_node_id = target_node.id
            unit.target_lat = target_node.lat
            unit.target_lng = target_node.lng
            unit.status = "en_route"
            unit.assigned_mission = mission
            unit.path_progress = 0.0
            unit.current_path = [
                [unit.lng, unit.lat],
                [(unit.lng + target_node.lng) / 2.0, (unit.lat + target_node.lat) / 2.0],
                [target_node.lng, target_node.lat]
            ]
            unit.eta_min = 12.0

            alert_hub.add_radio_message(
                channel=f"TAC-{unit.agency}",
                sender=unit.callsign,
                recipient="EOC Command",
                message=f"Acknowledged order. En route to {target_node.name} for mission: {mission}",
                priority="PRIORITY"
            )

    def tick_step(self, delta_hours: float = 0.1):
        if self.state.timeline_hour < 12.0:
            self.state.timeline_hour = min(12.0, self.state.timeline_hour + delta_hours)
            
            for unit in self.state.dispatch_units:
                if unit.status == "en_route":
                    unit.path_progress = min(1.0, unit.path_progress + 0.15)
                    if unit.eta_min is not None and unit.eta_min > 0:
                        unit.eta_min = max(0.0, unit.eta_min - (delta_hours * 60.0))

                    if unit.current_path and len(unit.current_path) >= 2:
                        idx = int(unit.path_progress * (len(unit.current_path) - 1))
                        next_idx = min(len(unit.current_path) - 1, idx + 1)
                        sub_prog = (unit.path_progress * (len(unit.current_path) - 1)) - idx
                        
                        p1 = unit.current_path[idx]
                        p2 = unit.current_path[next_idx]
                        unit.lng = p1[0] + (p2[0] - p1[0]) * sub_prog
                        unit.lat = p1[1] + (p2[1] - p1[1]) * sub_prog

                    if unit.path_progress >= 1.0:
                        unit.status = "on_scene"
                        unit.assigned_mission = f"Operating on-scene at {unit.target_node_id}"

            self.recompute_all()

    def recompute_all(self):
        self.state.nodes, self.state.roads, self.state.sensors = self.hydro.calculate_flood_depths(
            timeline_hour=self.state.timeline_hour,
            rain_intensity_mmhr=self.state.rain_intensity_mmhr,
            storm_surge_m=self.state.storm_surge_m,
            levee_breached=self.state.levee_breached,
            nodes=self.state.nodes,
            roads=self.state.roads,
            sensors=self.state.sensors
        )

        self.state.nodes, self.state.cascade_links, self.state.metrics = self.cascade.evaluate_cascade_effects(
            nodes=self.state.nodes,
            roads=self.state.roads,
            substation_tripped=self.state.substation_tripped,
            levee_breached=self.state.levee_breached,
            timeline_hour=self.state.timeline_hour
        )

        self.state.evacuation_routes = self.router.calculate_evacuation_routes(
            self.state.nodes,
            self.state.roads
        )

        self.state.iap = self.ai_cmd.generate_incident_action_plan(
            city_name=self.state.city_name,
            timeline_hour=self.state.timeline_hour,
            rain_intensity_mmhr=self.state.rain_intensity_mmhr,
            nodes=self.state.nodes,
            roads=self.state.roads,
            sensors=self.state.sensors,
            cascade_links=self.state.cascade_links,
            evacuation_routes=self.state.evacuation_routes,
            levee_breached=self.state.levee_breached,
            substation_tripped=self.state.substation_tripped
        )

state_manager = DigitalTwinStateManager()
