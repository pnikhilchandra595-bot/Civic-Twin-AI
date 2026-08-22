export type HazardType = "flood" | "wildfire" | "earthquake" | "storm_surge" | "heatwave";

export type NodeType =
  | "hospital"
  | "shelter"
  | "fire_station"
  | "police_station"
  | "substation"
  | "water_treatment"
  | "school"
  | "residential_district"
  | "commercial_district"
  | "industrial_zone"
  | "bridge"
  | "dam_levee"
  | "sensor_node"
  | "road_junction";

export type NodeStatus =
  | "operational"
  | "warning"
  | "critical"
  | "isolated"
  | "submerged"
  | "damaged"
  | "offline";

export type RoadStatus =
  | "clear"
  | "congested"
  | "flooded_warning"
  | "impassable"
  | "closed_emergency";

export type SensorType =
  | "water_level_gauge"
  | "storm_drain_flow"
  | "soil_moisture"
  | "wind_weather"
  | "seismic_pga"
  | "air_quality"
  | "structural_strain";

export interface SensorReading {
  sensor_id: string;
  sensor_type: SensorType;
  name: string;
  lat: floatNumber;
  lng: floatNumber;
  current_value: number;
  unit: string;
  threshold_warning: number;
  threshold_critical: number;
  status: NodeStatus;
  trend: "rising" | "falling" | "stable";
  history: number[];
}

export type floatNumber = number;

export interface InfrastructureNode {
  id: string;
  name: string;
  node_type: NodeType;
  lat: number;
  lng: number;
  elevation_m: number;
  status: NodeStatus;
  vulnerability_index: number;
  capacity_total: number;
  capacity_used: number;
  backup_power_hours: number;
  backup_power_active: boolean;
  flood_depth_m: number;
  structural_integrity: number;
  population_density: number;
  details: Record<string, any>;
}

export interface RoadEdge {
  id: string;
  from_node: string;
  to_node: string;
  name: string;
  coordinates: [number, number][]; // [[lng, lat], ...]
  length_km: number;
  elevation_m: number;
  max_speed_kmh: number;
  current_speed_kmh: number;
  flood_depth_m: number;
  status: RoadStatus;
  is_evacuation_corridor: boolean;
  lanes: number;
  capacity_vph: number;
}

export interface CascadeLink {
  id: string;
  source_id: string;
  target_id: string;
  trigger_type: string;
  severity: "warning" | "critical" | "disaster";
  time_offset_min: number;
  description: string;
  cascade_level: number;
}

export interface EvacuationRoute {
  route_id: string;
  source_node_id: string;
  source_name: string;
  target_shelter_id: string;
  target_shelter_name: string;
  coordinates: [number, number][];
  distance_km: number;
  estimated_time_min: number;
  safety_score: number;
  status: "optimal" | "alternative" | "compromised";
  assigned_evacuees: number;
  choke_points: string[];
}

export interface DispatchUnit {
  unit_id: string;
  callsign: string;
  unit_type: string;
  agency: string;
  lat: number;
  lng: number;
  target_lat?: number;
  target_lng?: number;
  target_node_id?: string;
  current_path: [number, number][];
  path_progress: number;
  status: "standby" | "en_route" | "on_scene" | "returning";
  eta_min?: number;
  assigned_mission: string;
}

export interface IncidentActionPlan {
  iap_id: string;
  incident_name: string;
  operational_period: string;
  overall_threat_level: "MONITOR" | "ELEVATED" | "CRITICAL" | "CATASTROPHIC";
  incident_commander_summary: string;
  strategic_objectives: string[];
  agency_tasks: Record<string, string[]>;
  active_evacuation_zones: string[];
  allocated_resources: Record<string, number>;
  public_emergency_alert: string;
  timestamp: string;
}

export interface CityDigitalTwinState {
  city_id: string;
  city_name: string;
  center_coords: [number, number];
  bounding_box: [number, number, number, number];
  timeline_hour: number;
  rain_intensity_mmhr: number;
  storm_surge_m: number;
  wind_speed_kmh: number;
  wind_direction_deg: number;
  levee_breached: boolean;
  substation_tripped: boolean;
  nodes: InfrastructureNode[];
  roads: RoadEdge[];
  sensors: SensorReading[];
  cascade_links: CascadeLink[];
  evacuation_routes: EvacuationRoute[];
  dispatch_units: DispatchUnit[];
  iap: IncidentActionPlan;
  metrics: Record<string, any>;
}

export interface SimulationControlCommand {
  timeline_hour?: number;
  rain_intensity_mmhr?: number;
  storm_surge_m?: number;
  wind_speed_kmh?: number;
  wind_direction_deg?: number;
  toggle_levee_breach?: boolean;
  toggle_substation_trip?: boolean;
  custom_block_road_id?: string;
  custom_unblock_road_id?: string;
  dispatch_unit_command?: Record<string, any>;
}
