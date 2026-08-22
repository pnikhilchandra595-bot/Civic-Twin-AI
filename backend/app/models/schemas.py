from typing import List, Dict, Optional, Any, Tuple
from pydantic import BaseModel, Field
from enum import Enum

class HazardType(str, Enum):
    FLOOD = "flood"
    WILDFIRE = "wildfire"
    EARTHQUAKE = "earthquake"
    STORM_SURGE = "storm_surge"
    HEATWAVE = "heatwave"

class NodeType(str, Enum):
    HOSPITAL = "hospital"
    SHELTER = "shelter"
    FIRE_STATION = "fire_station"
    POLICE_STATION = "police_station"
    SUBSTATION = "substation"
    WATER_TREATMENT = "water_treatment"
    SCHOOL = "school"
    RESIDENTIAL_DISTRICT = "residential_district"
    COMMERCIAL_DISTRICT = "commercial_district"
    INDUSTRIAL_ZONE = "industrial_zone"
    BRIDGE = "bridge"
    DAM_LEVEE = "dam_levee"
    SENSOR_NODE = "sensor_node"
    ROAD_JUNCTION = "road_junction"

class NodeStatus(str, Enum):
    OPERATIONAL = "operational"
    WARNING = "warning"
    CRITICAL = "critical"
    ISOLATED = "isolated"
    SUBMERGED = "submerged"
    DAMAGED = "damaged"
    OFFLINE = "offline"

class RoadStatus(str, Enum):
    CLEAR = "clear"
    CONGESTED = "congested"
    FLOODED_WARNING = "flooded_warning"
    IMPASSABLE = "impassable"
    CLOSED_EMERGENCY = "closed_emergency"

class SensorType(str, Enum):
    WATER_LEVEL_GAUGE = "water_level_gauge"
    STORM_DRAIN_FLOW = "storm_drain_flow"
    SOIL_MOISTURE = "soil_moisture"
    WIND_WEATHER = "wind_weather"
    SEISMIC_PGA = "seismic_pga"
    AIR_QUALITY = "air_quality"
    STRUCTURAL_STRAIN = "structural_strain"

class SensorReading(BaseModel):
    sensor_id: str
    sensor_type: SensorType
    name: str
    lat: float
    lng: float
    current_value: float
    unit: str
    threshold_warning: float
    threshold_critical: float
    status: NodeStatus
    trend: str = "stable"  # rising, falling, stable
    history: List[float] = Field(default_factory=list)

class InfrastructureNode(BaseModel):
    id: str
    name: str
    node_type: NodeType
    lat: float
    lng: float
    elevation_m: float
    status: NodeStatus = NodeStatus.OPERATIONAL
    vulnerability_index: float = 0.5  # 0.0 to 1.0
    capacity_total: int = 0
    capacity_used: int = 0
    backup_power_hours: float = 24.0
    backup_power_active: bool = False
    flood_depth_m: float = 0.0
    structural_integrity: float = 1.0  # 0.0 to 1.0
    population_density: int = 0
    details: Dict[str, Any] = Field(default_factory=dict)

class RoadEdge(BaseModel):
    id: str
    from_node: str
    to_node: str
    name: str
    coordinates: List[List[float]]  # [[lng, lat], ...]
    length_km: float
    elevation_m: float
    max_speed_kmh: float = 50.0
    current_speed_kmh: float = 50.0
    flood_depth_m: float = 0.0
    status: RoadStatus = RoadStatus.CLEAR
    is_evacuation_corridor: bool = False
    lanes: int = 2
    capacity_vph: int = 1500

class CascadeLink(BaseModel):
    id: str
    source_id: str
    target_id: str
    trigger_type: str  # e.g., "flood_submergence", "power_loss", "road_severance"
    severity: str  # warning, critical, disaster
    time_offset_min: int
    description: str
    cascade_level: int = 1

class EvacuationRoute(BaseModel):
    route_id: str
    source_node_id: str
    source_name: str
    target_shelter_id: str
    target_shelter_name: str
    coordinates: List[List[float]]  # GeoJSON path [[lng, lat], ...]
    distance_km: float
    estimated_time_min: float
    safety_score: float  # 0.0 to 1.0
    status: str = "optimal"  # optimal, alternative, compromised
    assigned_evacuees: int = 0
    choke_points: List[str] = Field(default_factory=list)

class DispatchUnit(BaseModel):
    unit_id: str
    callsign: str
    unit_type: str  # "high_water_rescue", "ems_ambulance", "fire_engine", "public_works_pump", "sandbag_crew", "traffic_control"
    agency: str  # "Fire & Rescue", "EMS", "Public Works", "Police", "Civil Defense"
    lat: float
    lng: float
    target_lat: Optional[float] = None
    target_lng: Optional[float] = None
    target_node_id: Optional[str] = None
    current_path: List[List[float]] = Field(default_factory=list)
    path_progress: float = 0.0  # 0.0 to 1.0
    status: str = "standby"  # "standby", "en_route", "on_scene", "returning"
    eta_min: Optional[float] = None
    assigned_mission: str = "Standby in staging area"

class IncidentActionPlan(BaseModel):
    iap_id: str
    incident_name: str
    operational_period: str
    overall_threat_level: str  # "MONITOR", "ELEVATED", "CRITICAL", "CATASTROPHIC"
    incident_commander_summary: str
    strategic_objectives: List[str]
    agency_tasks: Dict[str, List[str]]
    active_evacuation_zones: List[str]
    allocated_resources: Dict[str, int]
    public_emergency_alert: str
    timestamp: str

class CityDigitalTwinState(BaseModel):
    city_id: str
    city_name: str
    center_coords: List[float]  # [lat, lng]
    bounding_box: List[float]  # [min_lat, min_lng, max_lat, max_lng]
    timeline_hour: float = 0.0  # 0.0 to 12.0
    rain_intensity_mmhr: float = 0.0
    storm_surge_m: float = 0.0
    wind_speed_kmh: float = 15.0
    wind_direction_deg: float = 45.0
    levee_breached: bool = False
    substation_tripped: bool = False
    nodes: List[InfrastructureNode]
    roads: List[RoadEdge]
    sensors: List[SensorReading]
    cascade_links: List[CascadeLink]
    evacuation_routes: List[EvacuationRoute]
    dispatch_units: List[DispatchUnit]
    iap: IncidentActionPlan
    metrics: Dict[str, Any]

class SimulationControlCommand(BaseModel):
    timeline_hour: Optional[float] = None
    rain_intensity_mmhr: Optional[float] = None
    storm_surge_m: Optional[float] = None
    wind_speed_kmh: Optional[float] = None
    wind_direction_deg: Optional[float] = None
    toggle_levee_breach: Optional[bool] = None
    toggle_substation_trip: Optional[bool] = None
    custom_block_road_id: Optional[str] = None
    custom_unblock_road_id: Optional[str] = None
    dispatch_unit_command: Optional[Dict[str, Any]] = None
