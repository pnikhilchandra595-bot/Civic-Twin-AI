import { CityDigitalTwinState, InfrastructureNode, SensorReading, RoadEdge, CascadeLink, EvacuationRoute, DispatchUnit } from '../types/digital_twin';

export interface CalibratedExtendedNode extends InfrastructureNode {
  hypsometricCategory: 'ankle_knee' | 'waist' | 'submerged' | 'safe_elevation';
  usarXCode?: {
    date: string;
    searchUnit: string;
    hazards: string;
    survivorsRescued: number;
  };
}

export interface HeliLandingZone {
  id: string;
  name: string;
  coords: [number, number];
  elevation_m: number;
  clearRadius_m: number;
  windSpeed_kmh: number;
  hasPowerCables: boolean;
  status: 'SAFE' | 'MARGINAL' | 'CLOSED';
  notes: string;
}

export interface CalibratedPolygonInundation {
  id: string;
  name: string;
  depthRangeM: string;
  color: string;
  fillOpacity: number;
  coordinates: [number, number][]; // [[lat, lng], ...]
}

export interface CalibratedComprehensiveTwinState {
  id: string;
  name: string;
  eventDate: string;
  state: CityDigitalTwinState;
  inundationPolygons: CalibratedPolygonInundation[];
  heliLandingZones: HeliLandingZone[];
  vehicleWadingClearances: {
    standardCarMaxDepthM: number;
    ndrfTruckMaxDepthM: number;
    inflatableBoatMinDepthM: number;
  };
  radioFeedTranscripts: Array<{
    id: string;
    callsign: string;
    agency: string;
    message: string;
    hindiMessage?: string;
    timestamp: string;
    priority: 'EMERGENCY' | 'PRIORITY' | 'ROUTINE';
  }>;
}

export const CALIBRATED_COMPREHENSIVE_TWIN_STATES: Record<string, CalibratedComprehensiveTwinState> = {
  sikkim_lhonak_glof_2023: {
    id: 'sikkim_lhonak_glof_2023',
    name: 'Sikkim Teesta GLOF 2023 (South Lhonak Moraine Burst)',
    eventDate: '04-Oct-2023 00:45 UTC+5:30',
    vehicleWadingClearances: {
      standardCarMaxDepthM: 0.25,
      ndrfTruckMaxDepthM: 0.85,
      inflatableBoatMinDepthM: 0.30
    },
    inundationPolygons: [
      {
        id: 'poly-lhonak-surge',
        name: 'Upper Teesta Flash Gorge Surge Polygon',
        depthRangeM: '> 10.0m Extreme Torrent',
        color: '#ef4444',
        fillOpacity: 0.55,
        coordinates: [
          [27.915, 88.580],
          [27.880, 88.610],
          [27.840, 88.640],
          [27.790, 88.620],
          [27.740, 88.580],
          [27.760, 88.550],
          [27.820, 88.570],
          [27.890, 88.550]
        ]
      },
      {
        id: 'poly-chungthang-dikchu',
        name: 'Chungthang to Dikchu Valley Submergence Corridor',
        depthRangeM: '6.0m - 14.2m Submerged',
        color: '#f97316',
        fillOpacity: 0.45,
        coordinates: [
          [27.605, 88.510],
          [27.560, 88.530],
          [27.520, 88.520],
          [27.460, 88.500],
          [27.470, 88.470],
          [27.540, 88.490],
          [27.590, 88.480]
        ]
      },
      {
        id: 'poly-singtam-rangpo',
        name: 'Lower Teesta Singtam & Rangpo Inundation Plain',
        depthRangeM: '2.5m - 6.5m Waist-High',
        color: '#06b6d4',
        fillOpacity: 0.35,
        coordinates: [
          [27.240, 88.490],
          [27.200, 88.520],
          [27.160, 88.530],
          [27.140, 88.500],
          [27.170, 88.480],
          [27.220, 88.460]
        ]
      }
    ],
    heliLandingZones: [
      {
        id: 'lz-gangtok-stadium',
        name: 'Paljor Stadium High-Ground LZ-1 (Gangtok)',
        coords: [27.332, 88.614],
        elevation_m: 1650,
        clearRadius_m: 65,
        windSpeed_kmh: 18,
        hasPowerCables: false,
        status: 'SAFE',
        notes: 'Primary Mi-17 and ALH Dhruv staging ground. Free of cables. Clear optical visibility.'
      },
      {
        id: 'lz-mangan-helipad',
        name: 'Mangan North District Helipad LZ-2',
        coords: [27.502, 88.532],
        elevation_m: 1320,
        clearRadius_m: 35,
        windSpeed_kmh: 28,
        hasPowerCables: false,
        status: 'SAFE',
        notes: 'Operational for light utility helicopters. Fuel transport available via elevated bypass.'
      },
      {
        id: 'lz-chungthang-barrage',
        name: 'Chungthang Hydro Dam Staging Field LZ-3',
        coords: [27.604, 88.514],
        elevation_m: 1565,
        clearRadius_m: 22,
        windSpeed_kmh: 54,
        hasPowerCables: true,
        status: 'CLOSED',
        notes: 'CRITICAL HAZARD: Downed 400kV lines and severe valley turbulence >50 km/h.'
      }
    ],
    radioFeedTranscripts: [
      {
        id: 'rad-teesta-1',
        callsign: 'CWC-CHUNGTHANG-GAUGE',
        agency: 'Central Water Commission',
        message: 'FLASH PRIORITY: River stage elevation exceeded 1,568.4m ASL. Extreme surge wave of 14.2m crest detected. Dam crest is actively overtopping.',
        hindiMessage: 'आपातकालीन सूचना: नदी का जलस्तर 1,568.4 मीटर पहुंचा। 14.2 मीटर की बाढ़ की लहर चुंगथांग बांध के ऊपर से बह रही है।',
        timestamp: '00:48 hrs',
        priority: 'EMERGENCY'
      },
      {
        id: 'rad-teesta-2',
        callsign: 'NDRF-UNIT-02',
        agency: '2nd Battalion NDRF (Siliguri)',
        message: 'Moving 4 Zodiac inflatable rescue boats towards Singtam. NH-10 road approach at Melli is submerged under 3.5m water. Re-routing via Lava-Kalimpong high pass.',
        hindiMessage: 'एनडीआरएफ यूनिट 2: 4 बोट सिंगतम की ओर रवाना। एनएच-10 मेल्ली के पास जलमग्न, लाभा-कालिम्पोंग मार्ग से डायवर्जन।',
        timestamp: '01:12 hrs',
        priority: 'PRIORITY'
      },
      {
        id: 'rad-teesta-3',
        callsign: 'EASTERN-AIR-COMMAND',
        agency: 'Indian Air Force Taskforce',
        message: 'Helicopter evacuation teams on standby at Hasimara AFB. Cloud ceiling at 4,000 ft. Paljor Stadium LZ confirmed operational for air-lift.',
        hindiMessage: 'वायुसेना कमांड: हाशिमारा बेस पर हेलीकॉप्टर तैयार। पालजोर स्टेडियम हेलिपैड सुरक्षित व चालू।',
        timestamp: '01:35 hrs',
        priority: 'ROUTINE'
      }
    ],
    state: {
      city_id: 'sikkim_teesta_glof',
      city_name: 'Sikkim: Teesta River Basin & Chungthang Hydro Cascade',
      center_coords: [27.5500, 88.5300],
      bounding_box: [27.10, 88.40, 27.95, 88.65],
      timeline_hour: 1.5,
      rain_intensity_mmhr: 110.0,
      storm_surge_m: 14.2,
      wind_speed_kmh: 48.0,
      wind_direction_deg: 310.0,
      levee_breached: true,
      substation_tripped: true,
      metrics: {
        peakDischargeCumecs: 8450,
        surgeDepthM: 14.2,
        celerityKmh: 48.5,
        damStatus: 'BREACHED_OVERTOPPING',
        warningLeadTimeGainedMin: 42,
        citizensSafeguarded: 14200
      },
      nodes: [
        {
          id: 'skm-node-1',
          name: 'Chungthang Teesta-III Dam Crest & Spillway',
          node_type: 'dam_levee',
          lat: 27.6044,
          lng: 88.5135,
          elevation_m: 1565.0,
          status: 'submerged',
          vulnerability_index: 0.99,
          capacity_total: 1000,
          capacity_used: 1000,
          backup_power_hours: 0,
          backup_power_active: false,
          flood_depth_m: 14.2,
          structural_integrity: 0.12,
          population_density: 350,
          details: {
            hypsometricCategory: 'submerged',
            usarXCode: { date: '04-OCT', searchUnit: 'ARMY-ENGR-01', hazards: 'COLLAPSE-RISK', survivorsRescued: 0 }
          }
        },
        {
          id: 'skm-node-2',
          name: 'Chungthang 400kV Primary Step-Up Substation',
          node_type: 'substation',
          lat: 27.5980,
          lng: 88.5160,
          elevation_m: 1562.0,
          status: 'offline',
          vulnerability_index: 0.95,
          capacity_total: 400,
          capacity_used: 0,
          backup_power_hours: 0,
          backup_power_active: false,
          flood_depth_m: 6.8,
          structural_integrity: 0.40,
          population_density: 120,
          details: {
            hypsometricCategory: 'submerged'
          }
        },
        {
          id: 'skm-node-3',
          name: 'Dikchu Suspension Bridge & Hydropower Tailrace',
          node_type: 'bridge',
          lat: 27.4605,
          lng: 88.5020,
          elevation_m: 850.0,
          status: 'critical',
          vulnerability_index: 0.90,
          capacity_total: 500,
          capacity_used: 350,
          backup_power_hours: 4,
          backup_power_active: false,
          flood_depth_m: 9.8,
          structural_integrity: 0.35,
          population_density: 1500,
          details: {
            hypsometricCategory: 'submerged',
            usarXCode: { date: '04-OCT', searchUnit: 'NDRF-BN-02', hazards: 'BRIDGE-SCOUR', survivorsRescued: 8 }
          }
        },
        {
          id: 'skm-node-4',
          name: 'Singtam Riverfront Ward & Bazaar Lowlands',
          node_type: 'residential_district',
          lat: 27.2380,
          lng: 88.4980,
          elevation_m: 420.0,
          status: 'critical',
          vulnerability_index: 0.85,
          capacity_total: 4500,
          capacity_used: 2800,
          backup_power_hours: 6,
          backup_power_active: true,
          flood_depth_m: 6.4,
          structural_integrity: 0.60,
          population_density: 6800,
          details: {
            hypsometricCategory: 'waist',
            usarXCode: { date: '04-OCT', searchUnit: 'SDRF-01', hazards: 'MUD-DEBRIS', survivorsRescued: 42 }
          }
        },
        {
          id: 'skm-node-5',
          name: 'Rangpo Inter-State Border Post & Police HQ',
          node_type: 'police_station',
          lat: 27.1760,
          lng: 88.5280,
          elevation_m: 330.0,
          status: 'warning',
          vulnerability_index: 0.70,
          capacity_total: 300,
          capacity_used: 210,
          backup_power_hours: 18,
          backup_power_active: true,
          flood_depth_m: 4.8,
          structural_integrity: 0.78,
          population_density: 2200,
          details: {
            hypsometricCategory: 'waist'
          }
        },
        {
          id: 'skm-node-6',
          name: 'Gangtok STNM Multi-Specialty Hospital & Trauma Center',
          node_type: 'hospital',
          lat: 27.3260,
          lng: 88.6120,
          elevation_m: 1650.0,
          status: 'operational',
          vulnerability_index: 0.15,
          capacity_total: 1000,
          capacity_used: 680,
          backup_power_hours: 72,
          backup_power_active: true,
          flood_depth_m: 0.0,
          structural_integrity: 0.99,
          population_density: 3500,
          details: {
            hypsometricCategory: 'safe_elevation',
            beds_icu_free: 28,
            oxygen_manifold_hours: 96
          }
        },
        {
          id: 'skm-node-7',
          name: 'Paljor Stadium Evacuation Relief Camp (Gangtok)',
          node_type: 'shelter',
          lat: 27.3320,
          lng: 88.6140,
          elevation_m: 1680.0,
          status: 'operational',
          vulnerability_index: 0.10,
          capacity_total: 5000,
          capacity_used: 1840,
          backup_power_hours: 96,
          backup_power_active: true,
          flood_depth_m: 0.0,
          structural_integrity: 1.0,
          population_density: 1840,
          details: {
            hypsometricCategory: 'safe_elevation',
            rations_days: 14,
            water_purifier_active: true
          }
        }
      ],
      roads: [
        {
          id: 'skm-road-1',
          from_node: 'skm-node-1',
          to_node: 'skm-node-3',
          name: 'NH-10 Upper Teesta Canyon Highway',
          coordinates: [[88.5135, 27.6044], [88.5080, 27.5300], [88.5020, 27.4605]],
          length_km: 18.5,
          elevation_m: 1200.0,
          max_speed_kmh: 40,
          current_speed_kmh: 0,
          flood_depth_m: 8.5,
          status: 'impassable',
          is_evacuation_corridor: false,
          lanes: 2,
          capacity_vph: 800
        },
        {
          id: 'skm-road-2',
          from_node: 'skm-node-4',
          to_node: 'skm-node-7',
          name: 'Singtam-Gangtok Elevated Bypass Expressway',
          coordinates: [[88.4980, 27.2380], [88.5500, 27.2800], [88.6140, 27.3320]],
          length_km: 24.2,
          elevation_m: 1450.0,
          max_speed_kmh: 60,
          current_speed_kmh: 52,
          flood_depth_m: 0.0,
          status: 'clear',
          is_evacuation_corridor: true,
          lanes: 4,
          capacity_vph: 2400
        }
      ],
      sensors: [
        {
          sensor_id: 'CWC-TEESTA-CHUNGTHANG',
          sensor_type: 'water_level_gauge',
          name: 'CWC Chungthang Hydrometric Stage Gauge',
          lat: 27.604,
          lng: 88.513,
          current_value: 1568.4,
          unit: 'm ASL',
          threshold_warning: 1560.0,
          threshold_critical: 1565.0,
          status: 'critical',
          trend: 'rising',
          history: [1558.2, 1560.4, 1563.8, 1566.2, 1568.4]
        },
        {
          sensor_id: 'LORA-LHONAK-PIEZO-01',
          sensor_type: 'soil_moisture',
          name: 'South Lhonak Moraine Piezometer (LoRa Mesh)',
          lat: 27.912,
          lng: 88.583,
          current_value: 8450,
          unit: 'm³/s surge',
          threshold_warning: 2000,
          threshold_critical: 5000,
          status: 'critical',
          trend: 'rising',
          history: [1200, 2800, 5400, 7200, 8450]
        },
        {
          sensor_id: 'IMD-AWS-GANGTOK-RAIN',
          sensor_type: 'wind_weather',
          name: 'IMD Doppler AWS Precipitation Radar',
          lat: 27.332,
          lng: 88.614,
          current_value: 110.0,
          unit: 'mm/h',
          threshold_warning: 50.0,
          threshold_critical: 80.0,
          status: 'critical',
          trend: 'rising',
          history: [25.0, 48.0, 75.0, 95.0, 110.0]
        }
      ],
      cascade_links: [
        {
          id: 'casc-1',
          source_id: 'skm-node-1',
          target_id: 'skm-node-2',
          trigger_type: 'DAM_OVERTOPPING',
          severity: 'disaster',
          time_offset_min: 15,
          description: '14.2m flood surge inundates 400kV Step-up Switchyard, tripping Northern Grid link',
          cascade_level: 1
        },
        {
          id: 'casc-2',
          source_id: 'skm-node-1',
          target_id: 'skm-node-3',
          trigger_type: 'SURGE_PROPAGATION',
          severity: 'disaster',
          time_offset_min: 28,
          description: 'High-velocity debris wave reaches Dikchu suspension bridge; piers structurally undermined',
          cascade_level: 2
        },
        {
          id: 'casc-3',
          source_id: 'skm-node-3',
          target_id: 'skm-node-4',
          trigger_type: 'DOWNSTREAM_INUNDATION',
          severity: 'critical',
          time_offset_min: 85,
          description: 'Backwater wave enters Singtam bazaar residential corridor; 2,800 residents need immediate boat evacuation',
          cascade_level: 3
        }
      ],
      evacuation_routes: [
        {
          route_id: 'route-singtam-gangtok',
          source_node_id: 'skm-node-4',
          source_name: 'Singtam Riverfront Ward',
          target_shelter_id: 'skm-node-7',
          target_shelter_name: 'Paljor Stadium Relief Camp (Elevation 1,680m)',
          coordinates: [[88.4980, 27.2380], [88.5500, 27.2800], [88.6140, 27.3320]],
          distance_km: 24.2,
          estimated_time_min: 38,
          safety_score: 0.94,
          status: 'optimal',
          assigned_evacuees: 2800,
          choke_points: ['Ranipool Junction (Monitored)']
        }
      ],
      dispatch_units: [
        {
          unit_id: 'ndrf-boat-02',
          callsign: 'NDRF-ZODIAC-02',
          unit_type: 'inflatable_rescue_boat',
          agency: 'National Disaster Response Force',
          lat: 27.2450,
          lng: 88.5020,
          current_path: [],
          path_progress: 0,
          status: 'on_scene',
          assigned_mission: 'Evacuating stranded families at Singtam Riverfront Ward'
        },
        {
          unit_id: 'iaf-alhdhruv-01',
          callsign: 'AIRFORCE-DHRUV-01',
          unit_type: 'utility_helicopter',
          agency: 'Indian Air Force Eastern Command',
          lat: 27.3320,
          lng: 88.6140,
          current_path: [],
          path_progress: 0,
          status: 'en_route',
          assigned_mission: 'Aerial winching at severed Dikchu Bridge Approach'
        }
      ],
      iap: {
        iap_id: 'IAP-SKM-2023-01',
        incident_name: 'OPERATION TEESTA SHIELD (GLOF CATACLYSM RESPONSE)',
        operational_period: '04-Oct-2023 00:00 - 24:00',
        overall_threat_level: 'CATASTROPHIC',
        incident_commander_summary: 'South Lhonak Glacial Lake moraine burst generated an estimated 8,450 m³/s outburst wave traveling at 48.5 km/h down the Teesta River canyon. Chungthang Dam breached by overtopping. Priority: Complete evacuation of Singtam, Rangpo, and Melli floodplains to designated high-elevation camps before T+2 hours.',
        strategic_objectives: [
          'Maintain clear traffic flow along Singtam-Gangtok elevated evacuation corridor NH-310.',
          'Deploy 6 NDRF inflatable motorized boats to Singtam bazaar for civilian rooftop rescue.',
          'Stage 4 Mi-17 and 2 ALH Dhruv helicopters at Paljor Stadium Helipad (LZ-1).',
          'Disconnect and safe-isolate 400kV transmission equipment to prevent mass electrocution hazards.'
        ],
        agency_tasks: {
          'NDRF 2nd Bn': ['Deploy 4 boat teams to Singtam', 'Set up USAR search grid in Dikchu'],
          'Indian Army Eastern Command': ['Establish Bailey bridge over severed approaches', 'Deploy combat engineers to Rangpo'],
          'State Police (Sikkim)': ['Enforce complete traffic ban on NH-10 valley road', 'Guide civilian convoy to Paljor Stadium'],
          'Health & Medical': ['Equip STNM Hospital trauma wing with 35 ICU beds', 'Stock 10,000 ORS and chlorine tablets']
        },
        active_evacuation_zones: ['Chungthang Ward 1-4', 'Dikchu Bazaar', 'Singtam Riverfront', 'Rangpo Lowlands'],
        allocated_resources: {
          'Inflatable Motorized Boats': 8,
          'Evacuation Buses / Heavy 4x4 Trucks': 42,
          'Helicopters (IAF / Army)': 6,
          'Medical First-Responders': 120
        },
        public_emergency_alert: '🚨 RED EMERGENCY ALERT: Teesta River surge crest propagating downstream. Evacuate immediately to Paljor Stadium or designated high-ground schools. Avoid NH-10.',
        timestamp: '2023-10-04T01:00:00Z'
      }
    }
  },

  mumbai_2005: {
    id: 'mumbai_2005',
    name: 'Mumbai 944mm Mega-Deluge (26-Jul-2005)',
    eventDate: '26-Jul-2005 14:00 UTC+5:30',
    vehicleWadingClearances: {
      standardCarMaxDepthM: 0.25,
      ndrfTruckMaxDepthM: 0.85,
      inflatableBoatMinDepthM: 0.30
    },
    inundationPolygons: [
      {
        id: 'poly-mithi-basin',
        name: 'Mithi River Mega-Inundation Zone',
        depthRangeM: '2.5m - 4.5m Tidal Lock',
        color: '#ef4444',
        fillOpacity: 0.50,
        coordinates: [
          [19.080, 72.860],
          [19.065, 72.875],
          [19.050, 72.855],
          [19.040, 72.840],
          [19.060, 72.835],
          [19.075, 72.845]
        ]
      },
      {
        id: 'poly-kurla-bkc',
        name: 'Kurla Kranti Nagar & BKC Submerged Plain',
        depthRangeM: '1.5m - 3.2m High Inundation',
        color: '#f97316',
        fillOpacity: 0.40,
        coordinates: [
          [19.072, 72.870],
          [19.060, 72.885],
          [19.045, 72.870],
          [19.055, 72.855]
        ]
      }
    ],
    heliLandingZones: [
      {
        id: 'lz-bkc-grounds',
        name: 'MMRDA BKC Grounds Helipad LZ-1',
        coords: [19.068, 72.870],
        elevation_m: 16.0,
        clearRadius_m: 80,
        windSpeed_kmh: 42,
        hasPowerCables: false,
        status: 'SAFE',
        notes: 'High ground unaffected by Mithi tidal lock. Capable of staging twin-engine heavy lift helicopters.'
      },
      {
        id: 'lz-mahalaxmi-racecourse',
        name: 'Mahalaxmi Helipad LZ-2 (South Mumbai)',
        coords: [18.982, 72.822],
        elevation_m: 12.0,
        clearRadius_m: 120,
        windSpeed_kmh: 38,
        hasPowerCables: false,
        status: 'SAFE',
        notes: 'Unobstructed landing zone for air ambulance evacuation to KEM and Nair Hospitals.'
      }
    ],
    radioFeedTranscripts: [
      {
        id: 'rad-mum-1',
        callsign: 'IMD-SANTACRUZ-RADAR',
        agency: 'India Meteorological Department',
        message: 'RECORD RAINFALL ALERT: Santacruz AWS records 944mm in 24 hours. Peak precipitation intensity reaching 190 mm/hr. High tide peak of 4.48m occurring simultaneously in Arabian Sea.',
        hindiMessage: 'आईएमडी सांताक्रूज: 24 घंटे में 944 मिमी बारिश दर्ज। अरब सागर में 4.48 मीटर ऊंची ज्वार की लहर। मीठी नदी का पानी उल्टी दिशा में बह रहा है।',
        timestamp: '14:30 hrs',
        priority: 'EMERGENCY'
      },
      {
        id: 'rad-mum-2',
        callsign: 'MCGM-CONTROL-HQ',
        agency: 'Brihanmumbai Disaster Control',
        message: 'Mithi River has overflowed banks at Dharavi and Kurla West. 220kV Dharavi substation experiencing water ingress; initiating emergency controlled load shedding.',
        hindiMessage: 'बीएमसी कंट्रोल रूम: धारावी और कुर्ला में मीठी नदी उफान पर। धारावी सबस्टेशन में पानी भरने से बिजली आपूर्ति बंद।',
        timestamp: '15:15 hrs',
        priority: 'EMERGENCY'
      }
    ],
    state: {
      city_id: 'mumbai_2005_deluge',
      city_name: 'Maharashtra: Mumbai 944mm Cloudburst & Mithi Basin',
      center_coords: [19.0760, 72.8777],
      bounding_box: [18.90, 72.75, 19.25, 73.00],
      timeline_hour: 4.0,
      rain_intensity_mmhr: 190.0,
      storm_surge_m: 4.48,
      wind_speed_kmh: 55.0,
      wind_direction_deg: 240.0,
      levee_breached: true,
      substation_tripped: true,
      metrics: {
        peakDischargeCumecs: 2850,
        surgeDepthM: 4.48,
        celerityKmh: 22.0,
        damStatus: 'SPILLWAY_OVERFLOW',
        warningLeadTimeGainedMin: 65,
        citizensSafeguarded: 38500
      },
      nodes: [
        {
          id: 'mum-node-1',
          name: 'Apex King Edward Memorial (KEM) Trauma Hospital',
          node_type: 'hospital',
          lat: 19.0024,
          lng: 72.8423,
          elevation_m: 14.5,
          status: 'operational',
          vulnerability_index: 0.30,
          capacity_total: 1800,
          capacity_used: 1650,
          backup_power_hours: 48,
          backup_power_active: true,
          flood_depth_m: 0.15,
          structural_integrity: 0.98,
          population_density: 4500,
          details: {
            hypsometricCategory: 'ankle_knee',
            beds_icu_free: 14,
            trauma_bays: 16
          }
        },
        {
          id: 'mum-node-2',
          name: 'Dharavi 220kV Primary Transmission Substation',
          node_type: 'substation',
          lat: 19.0435,
          lng: 72.8568,
          elevation_m: 5.2,
          status: 'critical',
          vulnerability_index: 0.95,
          capacity_total: 220,
          capacity_used: 40,
          backup_power_hours: 0,
          backup_power_active: false,
          flood_depth_m: 2.10,
          structural_integrity: 0.70,
          population_density: 14000,
          details: {
            hypsometricCategory: 'submerged'
          }
        },
        {
          id: 'mum-node-3',
          name: 'BKC National Indoor Stadium (Mega Relief Camp)',
          node_type: 'shelter',
          lat: 19.0664,
          lng: 72.8682,
          elevation_m: 16.0,
          status: 'operational',
          vulnerability_index: 0.12,
          capacity_total: 8000,
          capacity_used: 4200,
          backup_power_hours: 96,
          backup_power_active: true,
          flood_depth_m: 0.0,
          structural_integrity: 0.99,
          population_density: 4200,
          details: {
            hypsometricCategory: 'safe_elevation',
            rations_days: 10,
            drinking_water_active: true
          }
        },
        {
          id: 'mum-node-4',
          name: 'Kurla West Railway Junction & Kranti Nagar Ward',
          node_type: 'road_junction',
          lat: 19.0650,
          lng: 72.8790,
          elevation_m: 4.1,
          status: 'submerged',
          vulnerability_index: 0.98,
          capacity_total: 10000,
          capacity_used: 6500,
          backup_power_hours: 0,
          backup_power_active: false,
          flood_depth_m: 2.85,
          structural_integrity: 0.55,
          population_density: 18000,
          details: {
            hypsometricCategory: 'submerged',
            usarXCode: { date: '26-JUL', searchUnit: 'MCGM-BOAT-04', hazards: 'LIVE-CABLES', survivorsRescued: 110 }
          }
        }
      ],
      roads: [
        {
          id: 'mum-road-1',
          from_node: 'mum-node-1',
          to_node: 'mum-node-3',
          name: 'Western Express Elevated Viaduct Corridor',
          coordinates: [[72.8423, 19.0024], [72.8550, 19.0350], [72.8682, 19.0664]],
          length_km: 8.5,
          elevation_m: 18.0,
          max_speed_kmh: 80,
          current_speed_kmh: 40,
          flood_depth_m: 0.0,
          status: 'clear',
          is_evacuation_corridor: true,
          lanes: 6,
          capacity_vph: 4500
        }
      ],
      sensors: [
        {
          sensor_id: 'IMD-SANTACRUZ-AWS',
          sensor_type: 'wind_weather',
          name: 'IMD Santacruz AWS 24h Gauge',
          lat: 19.085,
          lng: 72.850,
          current_value: 944.0,
          unit: 'mm / 24h',
          threshold_warning: 150.0,
          threshold_critical: 250.0,
          status: 'critical',
          trend: 'rising',
          history: [120, 310, 580, 820, 944]
        },
        {
          sensor_id: 'CWC-MITHI-KURVAR',
          sensor_type: 'water_level_gauge',
          name: 'CWC Mithi River Tidal Gate Stage',
          lat: 19.052,
          lng: 72.840,
          current_value: 4.48,
          unit: 'm tide lock',
          threshold_warning: 2.50,
          threshold_critical: 3.80,
          status: 'critical',
          trend: 'rising',
          history: [1.8, 2.7, 3.4, 4.1, 4.48]
        }
      ],
      cascade_links: [
        {
          id: 'casc-mum-1',
          source_id: 'mum-node-4',
          target_id: 'mum-node-2',
          trigger_type: 'WATER_INGRESS',
          severity: 'disaster',
          time_offset_min: 45,
          description: 'Mithi River overflow reaches Dharavi 220kV yard, forcing emergency trip',
          cascade_level: 1
        }
      ],
      evacuation_routes: [
        {
          route_id: 'route-kurla-bkc',
          source_node_id: 'mum-node-4',
          source_name: 'Kurla West Railway Ward',
          target_shelter_id: 'mum-node-3',
          target_shelter_name: 'BKC National Indoor Stadium (High Elevation)',
          coordinates: [[72.8790, 19.0650], [72.8730, 19.0660], [72.8682, 19.0664]],
          distance_km: 1.6,
          estimated_time_min: 22,
          safety_score: 0.92,
          status: 'optimal',
          assigned_evacuees: 4200,
          choke_points: ['LBS Marg Underpass (Blocked - Use Elevated Flyover)']
        }
      ],
      dispatch_units: [
        {
          unit_id: 'boat-mcgm-01',
          callsign: 'MUMBAI-RESCUE-BOAT-01',
          unit_type: 'inflatable_rescue_boat',
          agency: 'Mumbai Fire Brigade & Navy Divers',
          lat: 19.0650,
          lng: 72.8750,
          current_path: [],
          path_progress: 0,
          status: 'on_scene',
          assigned_mission: 'Rescuing stranded commuters from suburban rail cars'
        }
      ],
      iap: {
        iap_id: 'IAP-MUM-2005-01',
        incident_name: 'OPERATION SAMUDRA MITRA (MUMBAI DELUGE DEFENSE)',
        operational_period: '26-Jul-2005 14:00 - 27-Jul-2005 14:00',
        overall_threat_level: 'CATASTROPHIC',
        incident_commander_summary: 'Extreme mesoscale convective cloudburst dumped 944 mm in 24 hours coincident with 4.48m Arabian Sea high tide. Mithi River flow locked and overflowing into Dharavi, Kurla, and Kalina. Western Express Highway elevated corridor to BKC is designated the primary civilian escape artery.',
        strategic_objectives: [
          'De-energize flooded electrical distribution transformers in Dharavi and Kurla.',
          'Open BKC National Indoor Stadium as primary civilian mega-shelter with food rations and clean water.',
          'Deploy inflatable boat fleets to suburban rail choke points.'
        ],
        agency_tasks: {
          'Mumbai Police': ['Barricade flooded subway underpasses', 'Direct vehicles onto elevated flyovers'],
          'Indian Navy': ['Deploy inflatable Gemini craft with divers to Kurla West'],
          'BEST & MSEDCL': ['Isolate substation circuits to prevent water electrocution']
        },
        active_evacuation_zones: ['Kurla Kranti Nagar', 'Dharavi Transit Camp', 'Kalina Lowlands', 'Milan Subway'],
        allocated_resources: {
          'Rescue Inflatable Boats': 14,
          'Amphibious Trucks': 6,
          'Evacuation High-Clearance Buses': 85
        },
        public_emergency_alert: '🚨 RED CITIZEN ALERT: Extreme water-logging across Mumbai lowlands. Move to high floors or BKC Stadium shelter immediately. Do not drive through flooded underpasses.',
        timestamp: '2005-07-26T15:00:00Z'
      }
    }
  }
};
