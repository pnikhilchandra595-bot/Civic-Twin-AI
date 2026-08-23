import { CityDigitalTwinState } from '../types/digital_twin';

export const DEFAULT_FALLBACK_STATE: CityDigitalTwinState = {
  city_id: 'mumbai_monsoon',
  city_name: 'Maharashtra: Mumbai Mithi Basin & Coastal Surge Corridor',
  center_coords: [19.0760, 72.8777],
  bounding_box: [18.90, 72.75, 19.30, 73.05],
  timeline_hour: 0.0,
  rain_intensity_mmhr: 35.0,
  storm_surge_m: 0.8,
  wind_speed_kmh: 42.0,
  wind_direction_deg: 245.0,
  levee_breached: false,
  substation_tripped: false,
  nodes: [
    {
      id: 'node-hosp-1',
      name: 'Apex King Edward Memorial (KEM) Trauma Hospital',
      node_type: 'hospital',
      lat: 19.0024,
      lng: 72.8423,
      elevation_m: 14.5,
      status: 'operational',
      vulnerability_index: 0.25,
      capacity_total: 1200,
      capacity_used: 980,
      backup_power_hours: 48,
      backup_power_active: false,
      flood_depth_m: 0.0,
      structural_integrity: 0.98,
      population_density: 4500,
      details: { beds_icu_free: 18, trauma_bays: 12 }
    },
    {
      id: 'node-sub-1',
      name: 'Dharavi 220kV Primary Transmission Substation',
      node_type: 'substation',
      lat: 19.0435,
      lng: 72.8568,
      elevation_m: 6.2,
      status: 'warning',
      vulnerability_index: 0.75,
      capacity_total: 220,
      capacity_used: 195,
      backup_power_hours: 12,
      backup_power_active: false,
      flood_depth_m: 0.45,
      structural_integrity: 0.85,
      population_density: 12000,
      details: { transformer_health: '82%', load_mw: 195 }
    },
    {
      id: 'node-shelter-1',
      name: 'BKC National Indoor Stadium (Evacuation Mega-Camp)',
      node_type: 'shelter',
      lat: 19.0664,
      lng: 72.8682,
      elevation_m: 16.0,
      status: 'operational',
      vulnerability_index: 0.15,
      capacity_total: 6500,
      capacity_used: 2150,
      backup_power_hours: 72,
      backup_power_active: true,
      flood_depth_m: 0.0,
      structural_integrity: 0.99,
      population_density: 2150,
      details: { medical_staff: 24, rations_days: 7 }
    },
    {
      id: 'node-dam-1',
      name: 'Mithi River Sluice Gate & Tidal Retention Barrage',
      node_type: 'dam_levee',
      lat: 19.0512,
      lng: 72.8398,
      elevation_m: 3.5,
      status: 'critical',
      vulnerability_index: 0.88,
      capacity_total: 100,
      capacity_used: 82,
      backup_power_hours: 24,
      backup_power_active: true,
      flood_depth_m: 1.15,
      structural_integrity: 0.74,
      population_density: 300,
      details: { sluice_open_pct: 65, discharge_cusecs: 4200 }
    }
  ],
  roads: [
    {
      id: 'road-1',
      from_node: 'node-hosp-1',
      to_node: 'node-sub-1',
      name: 'Western Express Highway (Elevated Viaduct)',
      coordinates: [[72.8423, 19.0024], [72.8500, 19.0230], [72.8568, 19.0435]],
      length_km: 4.8,
      elevation_m: 15.0,
      max_speed_kmh: 80,
      current_speed_kmh: 45,
      flood_depth_m: 0.0,
      status: 'clear',
      is_evacuation_corridor: true,
      lanes: 6,
      capacity_vph: 4500
    },
    {
      id: 'road-2',
      from_node: 'node-sub-1',
      to_node: 'node-dam-1',
      name: 'Hindmata Subway Underpass Lowland Arterial',
      coordinates: [[72.8568, 19.0435], [72.8480, 19.0470], [72.8398, 19.0512]],
      length_km: 2.2,
      elevation_m: 2.8,
      max_speed_kmh: 40,
      current_speed_kmh: 0,
      flood_depth_m: 0.85,
      status: 'closed_emergency',
      is_evacuation_corridor: false,
      lanes: 4,
      capacity_vph: 2000
    }
  ],
  sensors: [
    {
      sensor_id: 'sensor-mithi-1',
      sensor_type: 'water_level_gauge',
      name: 'Mithi River Outfall Sluice Gauge (Ultrasonic)',
      lat: 19.0512,
      lng: 72.8398,
      current_value: 3.42,
      unit: 'm',
      threshold_warning: 2.5,
      threshold_critical: 3.2,
      status: 'critical',
      trend: 'rising',
      history: [2.1, 2.4, 2.8, 3.1, 3.42]
    },
    {
      sensor_id: 'sensor-rain-1',
      sensor_type: 'storm_drain_flow',
      name: 'BKC Storm Drain Culvert Flow Meter',
      lat: 19.0664,
      lng: 72.8682,
      current_value: 48.0,
      unit: 'm³/s',
      threshold_warning: 40.0,
      threshold_critical: 65.0,
      status: 'warning',
      trend: 'rising',
      history: [25.0, 32.0, 38.0, 44.0, 48.0]
    }
  ],
  cascade_links: [
    {
      id: 'casc-1',
      source_id: 'node-dam-1',
      target_id: 'node-sub-1',
      trigger_type: 'flood_inundation',
      severity: 'critical',
      time_offset_min: 15,
      description: 'Mithi tidal overflow threatening Dharavi 220kV transformer switchgear.',
      cascade_level: 1
    }
  ],
  evacuation_routes: [
    {
      route_id: 'route-alpha-1',
      source_node_id: 'node-hosp-1',
      source_name: 'Apex Trauma Hospital',
      target_shelter_id: 'node-shelter-1',
      target_shelter_name: 'BKC National Stadium',
      coordinates: [[72.8423, 19.0024], [72.8568, 19.0435], [72.8682, 19.0664]],
      distance_km: 7.0,
      estimated_time_min: 14.5,
      safety_score: 92,
      status: 'optimal',
      assigned_evacuees: 4500,
      choke_points: []
    }
  ],
  dispatch_units: [
    {
      unit_id: 'unit-amb-1',
      callsign: '108 ALS Ambulance Alpha (Life Support)',
      unit_type: 'ambulance',
      agency: 'State Emergency Medical Services',
      lat: 19.0050,
      lng: 72.8450,
      current_path: [[72.8450, 19.0050]],
      path_progress: 0.0,
      status: 'standby',
      assigned_mission: 'Apex Trauma Patrol'
    },
    {
      unit_id: 'unit-raft-1',
      callsign: 'NDRF Gemini Deep Rescue Boat 01',
      unit_type: 'boat',
      agency: 'National Disaster Response Force (NDRF)',
      lat: 19.0480,
      lng: 72.8420,
      current_path: [[72.8420, 19.0480]],
      path_progress: 0.0,
      status: 'standby',
      assigned_mission: 'Mithi River Rapid Extraction'
    }
  ],
  iap: {
    iap_id: 'IAP-MUMBAI-001',
    incident_name: 'MONSOON TIDAL FLOOD SURGE EMERGENCY',
    operational_period: 'Period 01 (00:00 - 12:00 IST)',
    overall_threat_level: 'CRITICAL',
    incident_commander_summary: 'Heavy monsoon cloudburst 35-50 mm/h with 0.8m coastal tidal surge along Mithi Basin.',
    strategic_objectives: [
      'Protect Apex KEM Trauma Hospital electrical power grid continuity',
      'Maintain green evacuation corridor on Western Express Highway',
      'Deploy NDRF Gemini inflatable boats for low-lying civilian extractions'
    ],
    agency_tasks: {
      'NDRF': ['Deploy boat teams to Dharavi & Mithi outfalls'],
      'Police': ['Enforce closure on flooded subways'],
      'EMS 108': ['Standby at BKC Mega Shelter']
    },
    active_evacuation_zones: ['Zone 4 (Mithi Lowlands)', 'Dharavi Sector 5'],
    allocated_resources: { 'Ambulances': 12, 'RescueBoats': 6, 'DewateringPumps': 24 },
    public_emergency_alert: 'Avoid low-lying underpasses. Head towards BKC Stadium relief shelter.',
    timestamp: new Date().toISOString()
  },
  metrics: {
    total_population_at_risk: 42000,
    evacuated_count: 14200,
    active_inundation_sqkm: 18.4,
    power_grid_health_pct: 84
  }
};
