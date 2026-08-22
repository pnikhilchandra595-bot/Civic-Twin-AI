from typing import Dict, List, Tuple
from app.models.schemas import (
    CityDigitalTwinState, InfrastructureNode, RoadEdge, SensorReading,
    DispatchUnit, NodeType, NodeStatus, RoadStatus, SensorType, IncidentActionPlan
)
from app.simulation.hydrology import HydrologySimulationEngine
from app.simulation.cascade import CascadeFailureEngine
from app.simulation.routing import DynamicEvacuationRouter
from app.ai.incident_commander import AIIncidentCommander

def generate_metropolis_bay_scenario() -> CityDigitalTwinState:
    # Center around a coastal city delta (e.g. lat 37.7749, lng -122.4194 style)
    center_lat = 37.775
    center_lng = -122.418

    # Create Infrastructure Nodes
    nodes: List[InfrastructureNode] = [
        # Hospitals & Medical Centers
        InfrastructureNode(
            id="node-hosp-1",
            name="Metro Central Trauma Hospital",
            node_type=NodeType.HOSPITAL,
            lat=37.782,
            lng=-122.410,
            elevation_m=12.5,  # Higher ground
            status=NodeStatus.OPERATIONAL,
            vulnerability_index=0.25,
            capacity_total=650,
            capacity_used=480,
            backup_power_hours=36.0,
            backup_power_active=False,
            population_density=1200,
            details={"trauma_level": "Level 1", "icu_beds": 85, "access_roads": ["road-4", "road-9"]}
        ),
        InfrastructureNode(
            id="node-hosp-2",
            name="Bayfront Memorial Hospital",
            node_type=NodeType.HOSPITAL,
            lat=37.765,
            lng=-122.402,
            elevation_m=3.2,  # Low ground near water
            status=NodeStatus.OPERATIONAL,
            vulnerability_index=0.85,
            capacity_total=320,
            capacity_used=240,
            backup_power_hours=18.0,
            backup_power_active=False,
            population_density=600,
            details={"trauma_level": "Level 2", "icu_beds": 30, "access_roads": ["road-2", "road-7"]}
        ),
        # Emergency Shelters
        InfrastructureNode(
            id="node-shelter-1",
            name="North Ridge High School (Primary Shelter)",
            node_type=NodeType.SHELTER,
            lat=37.792,
            lng=-122.425,
            elevation_m=18.0,  # Safe high ground
            status=NodeStatus.OPERATIONAL,
            vulnerability_index=0.15,
            capacity_total=1800,
            capacity_used=350,
            backup_power_hours=48.0,
            population_density=0,
            details={"base_occupancy": 350, "medical_station": True, "supplies_days": 14}
        ),
        InfrastructureNode(
            id="node-shelter-2",
            name="Hillcrest Civic Convention Center",
            node_type=NodeType.SHELTER,
            lat=37.788,
            lng=-122.405,
            elevation_m=14.5,  # High ground
            status=NodeStatus.OPERATIONAL,
            vulnerability_index=0.2,
            capacity_total=3000,
            capacity_used=420,
            backup_power_hours=72.0,
            population_density=0,
            details={"base_occupancy": 420, "generator_kw": 1200, "supplies_days": 21}
        ),
        InfrastructureNode(
            id="node-shelter-3",
            name="East Marina Community Center",
            node_type=NodeType.SHELTER,
            lat=37.760,
            lng=-122.395,
            elevation_m=2.8,  # Coastal low ground - vulnerable!
            status=NodeStatus.OPERATIONAL,
            vulnerability_index=0.9,
            capacity_total=800,
            capacity_used=150,
            backup_power_hours=12.0,
            population_density=0,
            details={"base_occupancy": 150, "flood_barrier_deployed": False}
        ),
        # Power Substations
        InfrastructureNode(
            id="node-sub-alpha",
            name="Substation Alpha (Riverside)",
            node_type=NodeType.SUBSTATION,
            lat=37.768,
            lng=-122.415,
            elevation_m=4.1,  # Low ground near river basin
            status=NodeStatus.OPERATIONAL,
            vulnerability_index=0.78,
            capacity_total=150,
            capacity_used=120,
            details={"output_mw": 150, "connected_assets": ["node-hosp-2", "node-res-1", "node-water-1"]}
        ),
        InfrastructureNode(
            id="node-sub-beta",
            name="Substation Beta (North Heights)",
            node_type=NodeType.SUBSTATION,
            lat=37.795,
            lng=-122.418,
            elevation_m=19.5,
            status=NodeStatus.OPERATIONAL,
            vulnerability_index=0.2,
            capacity_total=220,
            capacity_used=180,
            details={"output_mw": 220, "connected_assets": ["node-hosp-1", "node-shelter-1", "node-shelter-2", "node-res-3"]}
        ),
        # Water Treatment Plant
        InfrastructureNode(
            id="node-water-1",
            name="Delta Water Reclamation & Treatment Facility",
            node_type=NodeType.WATER_TREATMENT,
            lat=37.758,
            lng=-122.412,
            elevation_m=3.5,
            status=NodeStatus.OPERATIONAL,
            vulnerability_index=0.82,
            details={"capacity_mgl": 45, "chlorine_scrubber": True}
        ),
        # Bridges & Critical Choke Points
        InfrastructureNode(
            id="node-bridge-1",
            name="Harbor Gateway Bridge",
            node_type=NodeType.BRIDGE,
            lat=37.772,
            lng=-122.398,
            elevation_m=5.0,
            status=NodeStatus.OPERATIONAL,
            vulnerability_index=0.65,
            details={"connected_roads": ["road-2", "road-6"], "served_districts": ["node-res-2"]}
        ),
        InfrastructureNode(
            id="node-bridge-2",
            name="Delta River Expressway Span",
            node_type=NodeType.BRIDGE,
            lat=37.766,
            lng=-122.420,
            elevation_m=4.5,
            status=NodeStatus.OPERATIONAL,
            vulnerability_index=0.72,
            details={"connected_roads": ["road-1", "road-3"], "served_districts": ["node-res-1"]}
        ),
        # Dam & Levee
        InfrastructureNode(
            id="node-levee-1",
            name="East River Levee Barrier & Floodgate 4",
            node_type=NodeType.DAM_LEVEE,
            lat=37.762,
            lng=-122.428,
            elevation_m=6.5,
            status=NodeStatus.OPERATIONAL,
            vulnerability_index=0.8,
            details={"crest_height_m": 7.5, "status_gate": "closed"}
        ),
        # Fire Stations & EMS Dispatch
        InfrastructureNode(
            id="node-fire-1",
            name="Station 14 - Swift Water Rescue Division",
            node_type=NodeType.FIRE_STATION,
            lat=37.778,
            lng=-122.428,
            elevation_m=11.0,
            status=NodeStatus.OPERATIONAL,
            details={"boats": 4, "high_water_engines": 3}
        ),
        InfrastructureNode(
            id="node-fire-2",
            name="Station 8 - Downtown Emergency Response",
            node_type=NodeType.FIRE_STATION,
            lat=37.770,
            lng=-122.408,
            elevation_m=7.2,
            status=NodeStatus.OPERATIONAL,
            details={"pumps": 6, "ambulances": 5}
        ),
        # Residential & Commercial Population Sectors
        InfrastructureNode(
            id="node-res-1",
            name="Riverside Lowlands District",
            node_type=NodeType.RESIDENTIAL_DISTRICT,
            lat=37.762,
            lng=-122.418,
            elevation_m=2.9,  # Highest flood risk
            status=NodeStatus.OPERATIONAL,
            vulnerability_index=0.92,
            population_density=4200,
            details={"elderly_pct": 28, "mobility_impaired": 140}
        ),
        InfrastructureNode(
            id="node-res-2",
            name="Bay Marina Coastal Quarter",
            node_type=NodeType.RESIDENTIAL_DISTRICT,
            lat=37.755,
            lng=-122.400,
            elevation_m=2.4,  # Extreme surge risk
            status=NodeStatus.OPERATIONAL,
            vulnerability_index=0.95,
            population_density=3100,
            details={"elderly_pct": 22, "mobility_impaired": 95}
        ),
        InfrastructureNode(
            id="node-res-3",
            name="North Heights Residential Plateau",
            node_type=NodeType.RESIDENTIAL_DISTRICT,
            lat=37.790,
            lng=-122.415,
            elevation_m=17.5,  # High ground safe
            status=NodeStatus.OPERATIONAL,
            vulnerability_index=0.15,
            population_density=6800,
            details={"elderly_pct": 18, "mobility_impaired": 110}
        ),
        InfrastructureNode(
            id="node-res-4",
            name="Central Commercial & Tech Hub",
            node_type=NodeType.COMMERCIAL_DISTRICT,
            lat=37.776,
            lng=-122.415,
            elevation_m=8.5,
            status=NodeStatus.OPERATIONAL,
            vulnerability_index=0.45,
            population_density=5200,
            details={"highrise_count": 45, "underground_transit": True}
        ),
        # Educational & Community Hub
        InfrastructureNode(
            id="node-school-1",
            name="South Bay Elementary School",
            node_type=NodeType.SCHOOL,
            lat=37.760,
            lng=-122.408,
            elevation_m=3.8,
            status=NodeStatus.OPERATIONAL,
            vulnerability_index=0.88,
            population_density=650,
            details={"student_count": 580, "buses_on_site": 4}
        )
    ]

    # Create Road Edges connecting nodes
    roads: List[RoadEdge] = [
        RoadEdge(
            id="road-1",
            from_node="node-res-1",
            to_node="node-sub-alpha",
            name="River Basin Way",
            coordinates=[[-122.418, 37.762], [-122.416, 37.765], [-122.415, 37.768]],
            length_km=0.8,
            elevation_m=3.2,
            max_speed_kmh=45.0,
            status=RoadStatus.CLEAR
        ),
        RoadEdge(
            id="road-2",
            from_node="node-res-2",
            to_node="node-hosp-2",
            name="Harbor Coast Boulevard",
            coordinates=[[-122.400, 37.755], [-122.401, 37.760], [-122.402, 37.765]],
            length_km=1.2,
            elevation_m=2.8,
            max_speed_kmh=50.0,
            status=RoadStatus.CLEAR
        ),
        RoadEdge(
            id="road-3",
            from_node="node-sub-alpha",
            to_node="node-res-4",
            name="Central Arterial Avenue",
            coordinates=[[-122.415, 37.768], [-122.415, 37.772], [-122.415, 37.776]],
            length_km=0.9,
            elevation_m=7.0,
            max_speed_kmh=60.0,
            is_evacuation_corridor=True,
            status=RoadStatus.CLEAR
        ),
        RoadEdge(
            id="road-4",
            from_node="node-res-4",
            to_node="node-hosp-1",
            name="Medical Center Parkway",
            coordinates=[[-122.415, 37.776], [-122.412, 37.779], [-122.410, 37.782]],
            length_km=1.1,
            elevation_m=11.0,
            max_speed_kmh=50.0,
            is_evacuation_corridor=True,
            status=RoadStatus.CLEAR
        ),
        RoadEdge(
            id="road-5",
            from_node="node-res-4",
            to_node="node-shelter-2",
            name="Civic Plaza Expressway",
            coordinates=[[-122.415, 37.776], [-122.410, 37.782], [-122.405, 37.788]],
            length_km=1.6,
            elevation_m=13.0,
            max_speed_kmh=65.0,
            is_evacuation_corridor=True,
            status=RoadStatus.CLEAR
        ),
        RoadEdge(
            id="road-6",
            from_node="node-hosp-2",
            to_node="node-bridge-1",
            name="Bay Bridge Connector",
            coordinates=[[-122.402, 37.765], [-122.400, 37.769], [-122.398, 37.772]],
            length_km=0.9,
            elevation_m=4.8,
            max_speed_kmh=50.0,
            status=RoadStatus.CLEAR
        ),
        RoadEdge(
            id="road-7",
            from_node="node-res-1",
            to_node="node-school-1",
            name="South Delta Access Road",
            coordinates=[[-122.418, 37.762], [-122.413, 37.761], [-122.408, 37.760]],
            length_km=0.9,
            elevation_m=3.0,
            max_speed_kmh=40.0,
            status=RoadStatus.CLEAR
        ),
        RoadEdge(
            id="road-8",
            from_node="node-school-1",
            to_node="node-res-2",
            name="Marina South Link",
            coordinates=[[-122.408, 37.760], [-122.404, 37.757], [-122.400, 37.755]],
            length_km=0.8,
            elevation_m=2.6,
            max_speed_kmh=40.0,
            status=RoadStatus.CLEAR
        ),
        RoadEdge(
            id="road-9",
            from_node="node-hosp-1",
            to_node="node-res-3",
            name="North Ridgeway Highway",
            coordinates=[[-122.410, 37.782], [-122.412, 37.786], [-122.415, 37.790]],
            length_km=1.0,
            elevation_m=16.0,
            max_speed_kmh=60.0,
            is_evacuation_corridor=True,
            status=RoadStatus.CLEAR
        ),
        RoadEdge(
            id="road-10",
            from_node="node-res-3",
            to_node="node-shelter-1",
            name="Summit Ridge Arterial",
            coordinates=[[-122.415, 37.790], [-122.420, 37.791], [-122.425, 37.792]],
            length_km=1.1,
            elevation_m=18.0,
            max_speed_kmh=50.0,
            is_evacuation_corridor=True,
            status=RoadStatus.CLEAR
        ),
        RoadEdge(
            id="road-11",
            from_node="node-fire-1",
            to_node="node-res-4",
            name="West Station Link",
            coordinates=[[-122.428, 37.778], [-122.421, 37.777], [-122.415, 37.776]],
            length_km=1.2,
            elevation_m=9.5,
            max_speed_kmh=50.0,
            status=RoadStatus.CLEAR
        ),
        RoadEdge(
            id="road-12",
            from_node="node-bridge-1",
            to_node="node-shelter-2",
            name="Civic Coast Highway",
            coordinates=[[-122.398, 37.772], [-122.401, 37.780], [-122.405, 37.788]],
            length_km=1.8,
            elevation_m=9.0,
            max_speed_kmh=65.0,
            is_evacuation_corridor=True,
            status=RoadStatus.CLEAR
        )
    ]

    # Create IoT Sensors
    sensors: List[SensorReading] = [
        SensorReading(
            sensor_id="sensor-water-1",
            sensor_type=SensorType.WATER_LEVEL_GAUGE,
            name="River Basin Water Level Gauge #104",
            lat=37.763,
            lng=-122.421,
            current_value=12.0,
            unit="cm",
            threshold_warning=35.0,
            threshold_critical=60.0,
            status=NodeStatus.OPERATIONAL,
            trend="rising",
            history=[8.0, 8.5, 9.0, 10.0, 11.2, 12.0]
        ),
        SensorReading(
            sensor_id="sensor-water-2",
            sensor_type=SensorType.WATER_LEVEL_GAUGE,
            name="Marina Harbor Tidal Sensor #202",
            lat=37.756,
            lng=-122.398,
            current_value=18.0,
            unit="cm",
            threshold_warning=40.0,
            threshold_critical=75.0,
            status=NodeStatus.OPERATIONAL,
            trend="rising",
            history=[14.0, 15.0, 16.0, 17.0, 17.5, 18.0]
        ),
        SensorReading(
            sensor_id="sensor-drain-1",
            sensor_type=SensorType.STORM_DRAIN_FLOW,
            name="Central Arterial Storm Sewer Flowmeter",
            lat=37.771,
            lng=-122.415,
            current_value=28.0,
            unit="%",
            threshold_warning=70.0,
            threshold_critical=90.0,
            status=NodeStatus.OPERATIONAL,
            trend="rising",
            history=[15.0, 18.0, 22.0, 25.0, 28.0]
        ),
        SensorReading(
            sensor_id="sensor-drain-2",
            sensor_type=SensorType.STORM_DRAIN_FLOW,
            name="Lowland Culvert Outflow Gauge #08",
            lat=37.760,
            lng=-122.414,
            current_value=35.0,
            unit="%",
            threshold_warning=65.0,
            threshold_critical=85.0,
            status=NodeStatus.OPERATIONAL,
            trend="rising",
            history=[20.0, 24.0, 29.0, 32.0, 35.0]
        ),
        SensorReading(
            sensor_id="sensor-soil-1",
            sensor_type=SensorType.SOIL_MOISTURE,
            name="Delta Levee Slope Soil Saturation",
            lat=37.764,
            lng=-122.427,
            current_value=42.0,
            unit="%",
            threshold_warning=75.0,
            threshold_critical=92.0,
            status=NodeStatus.OPERATIONAL,
            trend="rising",
            history=[35.0, 38.0, 40.0, 41.0, 42.0]
        ),
        SensorReading(
            sensor_id="sensor-weather-1",
            sensor_type=SensorType.WIND_WEATHER,
            name="Civic Tower Weather Station",
            lat=37.776,
            lng=-122.415,
            current_value=24.0,
            unit="km/h",
            threshold_warning=60.0,
            threshold_critical=90.0,
            status=NodeStatus.OPERATIONAL,
            trend="stable",
            history=[20.0, 21.0, 22.0, 23.5, 24.0]
        )
    ]

    # Initial Dispatch Units
    dispatch_units: List[DispatchUnit] = [
        DispatchUnit(
            unit_id="unit-rescue-1",
            callsign="Rescue Boat Echo-1",
            unit_type="swift_water_rescue",
            agency="Fire & Rescue",
            lat=37.778,
            lng=-122.428,
            status="standby",
            assigned_mission="Staged at Station 14 for Lowland deployment"
        ),
        DispatchUnit(
            unit_id="unit-pump-1",
            callsign="Mobile Dewatering Pump Alpha",
            unit_type="public_works_pump",
            agency="Public Works",
            lat=37.770,
            lng=-122.408,
            status="standby",
            assigned_mission="Ready for Substation Alpha flood protection"
        ),
        DispatchUnit(
            unit_id="unit-ems-1",
            callsign="Medic 42",
            unit_type="ems_ambulance",
            agency="EMS",
            lat=37.782,
            lng=-122.410,
            status="standby",
            assigned_mission="Stationed at Metro General Trauma"
        ),
        DispatchUnit(
            unit_id="unit-traffic-1",
            callsign="Traffic Intercept 9",
            unit_type="traffic_control",
            agency="Police",
            lat=37.776,
            lng=-122.415,
            status="standby",
            assigned_mission="Monitoring North Corridor flow"
        )
    ]

    # Execute Initial Simulation Cycle
    hydro = HydrologySimulationEngine()
    cascade = CascadeFailureEngine()
    router = DynamicEvacuationRouter()
    ai_cmd = AIIncidentCommander()

    nodes, roads, sensors = hydro.calculate_flood_depths(
        timeline_hour=0.0,
        rain_intensity_mmhr=0.0,
        storm_surge_m=0.0,
        levee_breached=False,
        nodes=nodes,
        roads=roads,
        sensors=sensors
    )

    nodes, cascade_links, metrics = cascade.evaluate_cascade_effects(
        nodes=nodes,
        roads=roads,
        substation_tripped=False,
        levee_breached=False,
        timeline_hour=0.0
    )

    evacuation_routes = router.calculate_evacuation_routes(nodes, roads)

    iap = ai_cmd.generate_incident_action_plan(
        city_name="Metropolis Bay Delta",
        timeline_hour=0.0,
        rain_intensity_mmhr=0.0,
        nodes=nodes,
        roads=roads,
        sensors=sensors,
        cascade_links=cascade_links,
        evacuation_routes=evacuation_routes,
        levee_breached=False,
        substation_tripped=False
    )

    state = CityDigitalTwinState(
        city_id="metropolis_bay",
        city_name="Metropolis Bay Delta",
        center_coords=[center_lat, center_lng],
        bounding_box=[37.750, -122.435, 37.800, -122.390],
        timeline_hour=0.0,
        rain_intensity_mmhr=0.0,
        storm_surge_m=0.0,
        wind_speed_kmh=15.0,
        wind_direction_deg=45.0,
        levee_breached=False,
        substation_tripped=False,
        nodes=nodes,
        roads=roads,
        sensors=sensors,
        cascade_links=cascade_links,
        evacuation_routes=evacuation_routes,
        dispatch_units=dispatch_units,
        iap=iap,
        metrics=metrics
    )

    return state
