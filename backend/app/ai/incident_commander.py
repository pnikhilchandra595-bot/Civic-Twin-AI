from typing import List, Dict, Any
import datetime
from app.models.schemas import (
    IncidentActionPlan, InfrastructureNode, RoadEdge, SensorReading,
    CascadeLink, EvacuationRoute, NodeStatus, RoadStatus, NodeType
)

class AIIncidentCommander:
    """
    AI Incident Commander Co-Pilot compliant with FEMA ICS-201/202 standards.
    Continuously analyzes digital twin telemetry and issues strategic response plans.
    """

    def __init__(self):
        pass

    def generate_incident_action_plan(
        self,
        city_name: str,
        timeline_hour: float,
        rain_intensity_mmhr: float,
        nodes: List[InfrastructureNode],
        roads: List[RoadEdge],
        sensors: List[SensorReading],
        cascade_links: List[CascadeLink],
        evacuation_routes: List[EvacuationRoute],
        levee_breached: bool,
        substation_tripped: bool
    ) -> IncidentActionPlan:
        # Determine threat level
        impassable_roads = [r for r in roads if r.status in [RoadStatus.IMPASSABLE, RoadStatus.CLOSED_EMERGENCY]]
        critical_nodes = [n for n in nodes if n.status in [NodeStatus.CRITICAL, NodeStatus.SUBMERGED, NodeStatus.ISOLATED]]
        compromised_routes = [r for r in evacuation_routes if r.status == "compromised"]

        if len(critical_nodes) > 5 or levee_breached or len(compromised_routes) > 0:
            threat_level = "CATASTROPHIC"
        elif len(critical_nodes) > 2 or rain_intensity_mmhr >= 40.0:
            threat_level = "CRITICAL"
        elif rain_intensity_mmhr >= 15.0 or len(impassable_roads) > 0:
            threat_level = "ELEVATED"
        else:
            threat_level = "MONITOR"

        # Strategic Objectives
        objectives = [
            f"1. Establish life safety priority corridors for {len(evacuation_routes)} residential evacuation sectors.",
            f"2. Maintain auxiliary power and water diversion for critical medical trauma facilities.",
            f"3. Deploy tactical dewatering pump units to protect power substations and bridge underpasses.",
            f"4. Coordinate multi-agency traffic control at {len(impassable_roads)} blocked road intersections."
        ]

        if levee_breached:
            objectives.insert(0, "EMERGENCY: Immediate mass evacuation of River Basin Lowlands due to levee breach.")

        # Multi-Agency Tasks
        agency_tasks = {
            "Fire & Rescue": [
                f"Deploy high-water rescue assets to Lowland District sectors with depth >= 0.4m.",
                "Standby with inflatable rescue rafts near Waterfront Promenade and Riverview Bridge.",
                "Conduct door-to-door welfare checks in isolated senior residential zones."
            ],
            "Emergency Medical Services (EMS)": [
                "Establish triage casualty collection point at North Ridge High School Shelter.",
                "Re-route all Class-1 ambulance transports away from submerged Riverside Expressway.",
                "Monitor backup oxygen & ICU power reserves at Metro General Hospital."
            ],
            "Public Works & Utilities": [
                "Deploy 4x 12-inch high-capacity mobile dewatering pumps to Substation Alpha.",
                "Install temporary flood barriers along East Canal levee wall perimeter.",
                "Clear blocked storm sewer grates on Central Avenue and 5th Boulevard."
            ],
            "Police & Traffic Operations": [
                f"Enforce mandatory road closure barricades across {len(impassable_roads)} flooded road segments.",
                "Manually cycle traffic light timing on North Evacuation Arterial to green priority.",
                "Clear stalled vehicles and prevent civilian re-entry into submerged lowlands."
            ],
            "Red Cross & Shelter Operations": [
                "Open secondary emergency shelter at Hillcrest Civic Arena (Capacity: 2,500).",
                "Distribute 15,000 emergency ration kits, potable water, and pediatric blankets.",
                "Register incoming evacuees from flood-threatened residential districts."
            ]
        }

        # Active Evacuation Zones
        active_zones = [
            r.source_name for r in evacuation_routes if r.status in ["optimal", "alternative", "compromised"]
        ]

        # Allocated Resources
        allocated_resources = {
            "High-Water Rescue Trucks": 8 if threat_level in ["CRITICAL", "CATASTROPHIC"] else 4,
            "Swift-Water Rescue Boats": 6 if levee_breached else 3,
            "Mobile Dewatering Pumps": 12 if rain_intensity_mmhr > 30 else 5,
            "Active Ambulances": 14,
            "Evacuation Coach Buses": 20,
            "Traffic Control Units": 16,
            "Emergency Generators": 6
        }

        # Public Emergency Alert
        alert_header = f"🚨 CIVIC EMERGENCY ALERT: {city_name.upper()} EMERGENCY MANAGEMENT"
        if threat_level == "CATASTROPHIC":
            alert_body = (
                f"FLASH FLOOD EMERGENCY & LEVEE ALERT. Rainfall rate is {rain_intensity_mmhr}mm/hr. "
                f"Immediate evacuation is ORDERED for all low-elevation districts. "
                f"Do NOT drive through flooded roads. Proceed immediately via designated green evacuation corridors to active shelters."
            )
        elif threat_level == "CRITICAL":
            alert_body = (
                f"SEVERE WEATHER & FLOOD WARNING. Rapidly rising flood waters detected across {len(impassable_roads)} road corridors. "
                f"Lowland residents must prepare to relocate to designated high-ground shelters. Avoid non-essential travel."
            )
        else:
            alert_body = (
                f"FLASH FLOOD ADVISORY. Elevated rainfall ({rain_intensity_mmhr}mm/hr) detected. "
                f"Public safety crews are monitoring storm drainage and low-lying underpasses. Stay tuned for official updates."
            )

        public_alert = f"{alert_header}\n\n{alert_body}\n\nLive Safe Route map is updated in real time by CivicTwin AI."

        # Incident Commander Executive Summary
        commander_summary = (
            f"Digital Twin telemetry indicates an active {threat_level} hazard state at T+{timeline_hour:.1f}h. "
            f"Rainfall intensity is recorded at {rain_intensity_mmhr:.1f} mm/hr. "
            f"There are currently {len(critical_nodes)} compromised infrastructure nodes and {len(impassable_roads)} impassable road segments. "
            f"A total of {len(cascade_links)} cascade vulnerability links have been detected across power, water, and emergency logistics networks. "
            f"AI dynamic routing has computed safe evacuation paths for {len(evacuation_routes)} urban sectors."
        )

        now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        return IncidentActionPlan(
            iap_id=f"IAP-{int(timeline_hour*10):03d}",
            incident_name=f"Operation Resilient Delta - {city_name}",
            operational_period=f"T+00:00 to T+{timeline_hour+4.0:.1f}h",
            overall_threat_level=threat_level,
            incident_commander_summary=commander_summary,
            strategic_objectives=objectives,
            agency_tasks=agency_tasks,
            active_evacuation_zones=active_zones[:6],
            allocated_resources=allocated_resources,
            public_emergency_alert=public_alert,
            timestamp=now_str
        )
