import math
from typing import List, Dict, Tuple
from app.models.schemas import InfrastructureNode, RoadEdge, SensorReading, SensorType, NodeStatus, RoadStatus

class HydrologySimulationEngine:
    """
    Simulates 2D urban surface water accumulation, hydrological runoff,
    storm drain saturation, and coastal/river surge propagation.
    """

    def __init__(self, base_drainage_capacity_mmhr: float = 35.0):
        # Base drainage absorption capacity in mm/hr
        self.base_drainage_capacity = base_drainage_capacity_mmhr

    def calculate_flood_depths(
        self,
        timeline_hour: float,
        rain_intensity_mmhr: float,
        storm_surge_m: float,
        levee_breached: bool,
        nodes: List[InfrastructureNode],
        roads: List[RoadEdge],
        sensors: List[SensorReading],
        drain_clog_factor: float = 0.25
    ) -> Tuple[List[InfrastructureNode], List[RoadEdge], List[SensorReading]]:
        """
        Updates flood depths and statuses for nodes, roads, and IoT sensors.
        """
        # Net rainfall accumulation (mm) over duration
        effective_rain_rate = max(0.0, rain_intensity_mmhr - (self.base_drainage_capacity * (1.0 - drain_clog_factor)))
        # Cumulative rain volume scaling factor
        accumulated_rain_m = (effective_rain_rate * (timeline_hour + 0.1) * 0.001)

        # Update Nodes
        for node in nodes:
            # Lower elevation accumulates more water
            elevation_factor = max(0.0, (15.0 - node.elevation_m) / 15.0)
            
            # Levee breach surge if in flood basin
            levee_surge = 0.0
            if levee_breached and node.elevation_m < 8.0:
                levee_surge = (8.0 - node.elevation_m) * 0.25 + 0.35

            # River/coastal surge factor
            coastal_factor = 0.0
            if storm_surge_m > 0 and node.elevation_m < 6.0:
                coastal_factor = storm_surge_m * max(0.0, (6.0 - node.elevation_m) / 6.0)

            # Combined calculated water depth
            depth = (accumulated_rain_m * 1.8 * (1.0 + elevation_factor * 1.5)) + coastal_factor + levee_surge
            depth = max(0.0, round(depth, 3))
            
            node.flood_depth_m = depth

            # Determine Node Status based on depth
            if depth >= 0.6:
                node.status = NodeStatus.SUBMERGED
            elif depth >= 0.25:
                node.status = NodeStatus.CRITICAL
            elif depth >= 0.1:
                node.status = NodeStatus.WARNING
            elif node.status in [NodeStatus.SUBMERGED, NodeStatus.CRITICAL, NodeStatus.WARNING]:
                node.status = NodeStatus.OPERATIONAL

        # Update Roads
        for road in roads:
            elevation_factor = max(0.0, (14.0 - road.elevation_m) / 14.0)
            
            levee_surge = 0.0
            if levee_breached and road.elevation_m < 7.0:
                levee_surge = (7.0 - road.elevation_m) * 0.22 + 0.25

            coastal_factor = 0.0
            if storm_surge_m > 0 and road.elevation_m < 5.0:
                coastal_factor = storm_surge_m * max(0.0, (5.0 - road.elevation_m) / 5.0)

            depth = (accumulated_rain_m * 1.6 * (1.0 + elevation_factor * 1.4)) + coastal_factor + levee_surge
            depth = max(0.0, round(depth, 3))
            road.flood_depth_m = depth

            # Determine Road Status & Speed
            if road.status == RoadStatus.CLOSED_EMERGENCY:
                # Keep emergency closure intact
                road.current_speed_kmh = 0.0
            elif depth >= 0.35:
                road.status = RoadStatus.IMPASSABLE
                road.current_speed_kmh = 0.0
            elif depth >= 0.15:
                road.status = RoadStatus.FLOODED_WARNING
                road.current_speed_kmh = max(10.0, road.max_speed_kmh * 0.35)
            elif depth > 0.05:
                road.status = RoadStatus.CONGESTED
                road.current_speed_kmh = max(20.0, road.max_speed_kmh * 0.65)
            else:
                road.status = RoadStatus.CLEAR
                road.current_speed_kmh = road.max_speed_kmh

        # Update IoT Sensors
        for sensor in sensors:
            if sensor.sensor_type == SensorType.WATER_LEVEL_GAUGE:
                # Find matching or nearest elevation
                gauge_val = accumulated_rain_m * 100.0 + (storm_surge_m * 60.0 if storm_surge_m else 0.0)
                if levee_breached:
                    gauge_val += 45.0
                gauge_val = round(gauge_val + (math.sin(sensor.lat * 100) * 5.0), 1)
                sensor.current_value = max(0.0, gauge_val)
                sensor.unit = "cm"
                
                # Update trend and history
                sensor.trend = "rising" if rain_intensity_mmhr > 20 else "stable"
                if not sensor.history:
                    sensor.history = [max(0.0, gauge_val - i * 4.0) for i in range(10, 0, -1)]
                sensor.history.append(sensor.current_value)
                if len(sensor.history) > 20:
                    sensor.history.pop(0)

                if sensor.current_value >= sensor.threshold_critical:
                    sensor.status = NodeStatus.CRITICAL
                elif sensor.current_value >= sensor.threshold_warning:
                    sensor.status = NodeStatus.WARNING
                else:
                    sensor.status = NodeStatus.OPERATIONAL

            elif sensor.sensor_type == SensorType.STORM_DRAIN_FLOW:
                # Drain saturation percentage
                flow_pct = min(100.0, (rain_intensity_mmhr / 80.0) * 100.0 + (15.0 if levee_breached else 0.0))
                flow_pct = round(max(5.0, flow_pct + math.cos(sensor.lng * 50) * 6.0), 1)
                sensor.current_value = flow_pct
                sensor.unit = "%"
                sensor.history.append(sensor.current_value)
                if len(sensor.history) > 20:
                    sensor.history.pop(0)

                if sensor.current_value >= sensor.threshold_critical:
                    sensor.status = NodeStatus.CRITICAL
                elif sensor.current_value >= sensor.threshold_warning:
                    sensor.status = NodeStatus.WARNING
                else:
                    sensor.status = NodeStatus.OPERATIONAL

            elif sensor.sensor_type == SensorType.SOIL_MOISTURE:
                # Soil saturation
                moisture_pct = min(100.0, 35.0 + (timeline_hour * rain_intensity_mmhr * 0.45))
                sensor.current_value = round(moisture_pct, 1)
                sensor.unit = "%"
                sensor.history.append(sensor.current_value)
                if len(sensor.history) > 20:
                    sensor.history.pop(0)
                if sensor.current_value >= sensor.threshold_critical:
                    sensor.status = NodeStatus.CRITICAL
                elif sensor.current_value >= sensor.threshold_warning:
                    sensor.status = NodeStatus.WARNING
                else:
                    sensor.status = NodeStatus.OPERATIONAL

            elif sensor.sensor_type == SensorType.WIND_WEATHER:
                # Wind speed with turbulence
                sensor.current_value = round(15.0 + (rain_intensity_mmhr * 0.6) + math.sin(sensor.lat * 50) * 8.0, 1)
                sensor.unit = "km/h"
                sensor.history.append(sensor.current_value)
                if len(sensor.history) > 20:
                    sensor.history.pop(0)

        return nodes, roads, sensors
