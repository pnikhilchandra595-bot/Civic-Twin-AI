export interface CalibratedScenario {
  id: string;
  name: string;
  basin: string;
  state: string;
  eventDate: string;
  historicalEvent: string;
  peakRainfallRateMmh: number;
  totalRainfallMm: number;
  peakDischargeCumecs: number;
  peakSurgeDepthM: number;
  celerityKmh: number;
  coordinates: [number, number];
  zoomLevel: number;
  methodology: string;
  governingEquations: string[];
  keyInundatedNodes: Array<{
    name: string;
    type: string;
    depthM: number;
    arrivalMinutes: number;
    status: 'submerged' | 'critical' | 'warning' | 'operational';
  }>;
  sensorCalibration: Array<{
    sensorId: string;
    metric: string;
    calibratedValue: string;
    dangerThreshold: string;
    status: 'DANGER' | 'WARNING' | 'ELEVATED';
  }>;
  tacticalMitigation: string[];
}

export const CALIBRATED_BENCHMARK_SCENARIOS: CalibratedScenario[] = [
  {
    id: 'sikkim_lhonak_glof_2023',
    name: 'Sikkim Teesta GLOF 2023 (South Lhonak Moraine Burst)',
    basin: 'Teesta River Basin',
    state: 'Sikkim',
    eventDate: '04-Oct-2023 00:45 UTC+5:30',
    historicalEvent: 'South Lhonak Glacial Lake moraine collapse releasing 62M m³ water surge into Teesta-III Dam',
    peakRainfallRateMmh: 110.0,
    totalRainfallMm: 280.0,
    peakDischargeCumecs: 8450.0,
    peakSurgeDepthM: 14.2,
    celerityKmh: 48.5,
    coordinates: [27.9125, 88.5833],
    zoomLevel: 11,
    methodology: 'Coupled Froehlich (1995) Hydrodynamic Dam Breach & 1D Muskingum-Cunge Wave Routing',
    governingEquations: [
      'Qp = 0.607 * Vw^0.295 * Hw^1.24 * ErosionMultiplier (Froehlich 1995)',
      'c = (5/3) * v (Kinematic Celerity in Steep Mountain Canyons)',
      'Wave Attenuation: Q(x,t) = Qp * exp(-k * x / L)'
    ],
    keyInundatedNodes: [
      { name: 'Chungthang Teesta-III Dam Crest', type: 'dam_levee', depthM: 14.2, arrivalMinutes: 28, status: 'submerged' },
      { name: 'Dikchu Suspension Bridge', type: 'bridge', depthM: 9.8, arrivalMinutes: 52, status: 'submerged' },
      { name: 'Singtam Riverfront Ward', type: 'residential_district', depthM: 6.4, arrivalMinutes: 85, status: 'critical' },
      { name: 'Rangpo Inter-State Border Post', type: 'road_junction', depthM: 4.8, arrivalMinutes: 115, status: 'warning' },
      { name: 'Melli Teesta Valley Highway NH-10', type: 'road_junction', depthM: 3.5, arrivalMinutes: 145, status: 'warning' }
    ],
    sensorCalibration: [
      { sensorId: 'LORA-LHONAK-01', metric: 'Lake Moraine Piezometer Level', calibratedValue: '+2.4 cm/h rise', dangerThreshold: '+1.5 cm/h', status: 'DANGER' },
      { sensorId: 'CWC-TEESTA-CHUNGTHANG', metric: 'River Gauge Stage Elevation', calibratedValue: '1,568.4 m ASL', dangerThreshold: '1,562.0 m ASL', status: 'DANGER' },
      { sensorId: 'MOSDAC-INSAT-RAIN', metric: 'Hydro-Estimator Rainfall', calibratedValue: '110 mm/h cloudburst', dangerThreshold: '75 mm/h', status: 'DANGER' }
    ],
    tacticalMitigation: [
      'Trigger automated bottom radial sluice gates at Teesta-III to create 15M m³ buffer cushion.',
      'Broadcast Common Alerting Protocol (CAP v1.2) sirens in Lepcha, Nepali, Hindi, and English.',
      'Order mandatory vertical evacuation to mountain contours >35m above the riverbed.'
    ]
  },
  {
    id: 'mumbai_cloudburst_2005',
    name: 'Mumbai 26-July Mega-Deluge (944mm Cloudburst & Tidal Lock)',
    basin: 'Mithi River Basin & Arabian Sea Coast',
    state: 'Maharashtra',
    eventDate: '26-Jul-2005 14:00 UTC+5:30',
    historicalEvent: '944mm extreme monsoon precipitation in 24 hours coupled with 4.48m high tide backwater lock',
    peakRainfallRateMmh: 125.0,
    totalRainfallMm: 944.0,
    peakDischargeCumecs: 1220.0,
    peakSurgeDepthM: 4.85,
    celerityKmh: 18.0,
    coordinates: [19.0760, 72.8777],
    zoomLevel: 12,
    methodology: 'SWMM 2D Urban Inundation Routing coupled with Tidal Hydrograph Boundary Conditions',
    governingEquations: [
      'Q_runoff = C * I * A (Rational Urban Runoff for Impervious Basins)',
      'H_backwater = H_tide + (Q^2 / (2 * g * B^2 * y^2)) (Tidal Lock Backwater Profile)',
      'Storage Inundation: dV/dt = Q_in - Q_out'
    ],
    keyInundatedNodes: [
      { name: 'Kurla Bail Bazar & Taximen Colony', type: 'residential_district', depthM: 3.4, arrivalMinutes: 40, status: 'submerged' },
      { name: 'Bandra-Kurla Complex Financial District', type: 'commercial_district', depthM: 2.2, arrivalMinutes: 65, status: 'submerged' },
      { name: 'Kalina CST Road Power Substation', type: 'substation', depthM: 2.8, arrivalMinutes: 50, status: 'critical' },
      { name: 'Chhatrapati Shivaji Maharaj Airport Runway 09/27', type: 'road_junction', depthM: 1.6, arrivalMinutes: 80, status: 'critical' },
      { name: 'Sion Hospital Trauma Ward (Ground Floor)', type: 'hospital', depthM: 1.2, arrivalMinutes: 95, status: 'warning' }
    ],
    sensorCalibration: [
      { sensorId: 'CWC-MITHI-KR-04', metric: 'Mithi River Gauge Depth', calibratedValue: '4.85 m', dangerThreshold: '3.00 m', status: 'DANGER' },
      { sensorId: 'IOC-APOLLO-BUNDER', metric: 'Mumbai Coastal Tide Level', calibratedValue: '4.48 m High Tide', dangerThreshold: '4.00 m', status: 'DANGER' },
      { sensorId: 'IMD-SANTACRUZ-RADAR', metric: 'Doppler Radar Reflectivity', calibratedValue: '58 dBZ (>100 mm/h)', dangerThreshold: '45 dBZ', status: 'DANGER' }
    ],
    tacticalMitigation: [
      'Activate Mahim Causeway & Vakola Nallah storm pumps at maximum 45 m³/s capacity.',
      'Isolate Kalina 220kV power transformers to prevent grid flashover and electrocution.',
      'Deploy NDRF inflatable powerboats along LBS Marg and SCLR corridors.'
    ]
  },
  {
    id: 'delhi_yamuna_flood_2023',
    name: 'Delhi Yamuna Historic Record Surge (208.66m Old Railway Bridge)',
    basin: 'Yamuna River Basin',
    state: 'Delhi NCR',
    eventDate: '13-Jul-2023 18:00 UTC+5:30',
    historicalEvent: 'Yamuna river breached all-time 1978 record (207.49m), reaching 208.66m and flooding central Delhi',
    peakRainfallRateMmh: 65.0,
    totalRainfallMm: 185.0,
    peakDischargeCumecs: 10165.0,
    peakSurgeDepthM: 3.8,
    celerityKmh: 24.0,
    coordinates: [28.6692, 77.2433],
    zoomLevel: 12,
    methodology: 'CWC Stage-Discharge Rating Curve & Unsteady HEC-RAS Hydrodynamic Routing',
    governingEquations: [
      'Q = C_d * (H - H_0)^n (Hathnikund to Okhla Stage-Discharge Curve)',
      'Backwater Ingress: Drain No. 12 backflow into Ring Road & Supreme Court',
      'Floodplain Infiltration: Green-Ampt Excess Rainfall Infiltration'
    ],
    keyInundatedNodes: [
      { name: 'Old Railway Bridge (Loha Pul)', type: 'bridge', depthM: 3.8, arrivalMinutes: 15, status: 'submerged' },
      { name: 'Kashmere Gate ISBT Bus Concourse', type: 'road_junction', depthM: 2.6, arrivalMinutes: 45, status: 'submerged' },
      { name: 'Wazirabad Water Treatment Plant (WTP)', type: 'water_treatment', depthM: 2.1, arrivalMinutes: 30, status: 'submerged' },
      { name: 'Red Fort Ring Road Underpass', type: 'road_junction', depthM: 2.9, arrivalMinutes: 60, status: 'critical' },
      { name: 'Chandrawal WTP Pumping Station', type: 'water_treatment', depthM: 1.8, arrivalMinutes: 55, status: 'critical' }
    ],
    sensorCalibration: [
      { sensorId: 'CWC-DEL-ORB-01', metric: 'Yamuna Old Railway Bridge Stage', calibratedValue: '208.66 m', dangerThreshold: '205.33 m', status: 'DANGER' },
      { sensorId: 'HATHNIKUND-DISCHARGE', metric: 'Hathnikund Barrage Outflow', calibratedValue: '359,000 cusecs', dangerThreshold: '100,000 cusecs', status: 'DANGER' },
      { sensorId: 'OTD-AIS140-TRANSIT', metric: 'Fleet Movement Stoppage Alert', calibratedValue: '84 buses stranded', dangerThreshold: '10 buses', status: 'DANGER' }
    ],
    tacticalMitigation: [
      'Erect sandbag dykes and army engineering flood barriers at Drain No. 12 regulator.',
      'Reroute Delhi OTD public buses away from Outer Ring Road to elevated Barapullah corridor.',
      'Mobilize 35 water tankers to central Delhi hospital complexes due to Wazirabad WTP shutdown.'
    ]
  },
  {
    id: 'kedarnath_flash_flood_2013',
    name: 'Kedarnath Chorabari Glacier Outburst (2013 Flash Deluge)',
    basin: 'Mandakini River Basin',
    state: 'Uttarakhand',
    eventDate: '17-Jun-2013 07:15 UTC+5:30',
    historicalEvent: 'Chorabari moraine lake dam burst releasing 400M liters of debris-laden water into Kedarnath shrine',
    peakRainfallRateMmh: 135.0,
    totalRainfallMm: 375.0,
    peakDischargeCumecs: 5200.0,
    peakSurgeDepthM: 7.6,
    celerityKmh: 54.0,
    coordinates: [30.7346, 79.0669],
    zoomLevel: 12,
    methodology: 'Hyper-Concentrated Debris Flow Bulking & Kinematic Steep-Slope Wave Routing',
    governingEquations: [
      'Q_debris = Q_water * (1 + C_sediment / (1 - C_sediment)) (Debris Bulking Factor ~1.45)',
      'Slope Velocity: v = (1/n) * R^(2/3) * S^(1/2) with S = 0.08 (Steep Mountain Gradient)',
      'Impact Hydrodynamic Force: F = rho * v^2 * Area'
    ],
    keyInundatedNodes: [
      { name: 'Kedarnath Temple Settlement & Outer Plinth', type: 'residential_district', depthM: 6.8, arrivalMinutes: 12, status: 'submerged' },
      { name: 'Rambara Transit Settlement', type: 'residential_district', depthM: 7.6, arrivalMinutes: 24, status: 'submerged' },
      { name: 'Gaurikund Pilgrim Base & Hot Springs', type: 'road_junction', depthM: 5.2, arrivalMinutes: 42, status: 'submerged' },
      { name: 'Sonprayag Mandakini-Basuki Confluence', type: 'bridge', depthM: 4.5, arrivalMinutes: 65, status: 'critical' },
      { name: 'Guptkashi Emergency Staging Base', type: 'hospital', depthM: 1.4, arrivalMinutes: 90, status: 'warning' }
    ],
    sensorCalibration: [
      { sensorId: 'CWC-MANDAKINI-RUDRAPRAYAG', metric: 'River Gauge Stage Height', calibratedValue: '624.8 m ASL', dangerThreshold: '619.0 m ASL', status: 'DANGER' },
      { sensorId: 'IMD-DEHRADUN-RADAR', metric: 'Cloudburst Multi-Cell Rainfall', calibratedValue: '135 mm/h', dangerThreshold: '80 mm/h', status: 'DANGER' },
      { sensorId: 'USGS-SEISMIC-NW-HIM', metric: 'High-Altitude Debris Tremor', calibratedValue: 'Magnitude 2.8 Debris Signal', dangerThreshold: '2.0', status: 'DANGER' }
    ],
    tacticalMitigation: [
      'Designate high-ridge helipads above 3,600m ASL for IAF Mi-17 and ALH Dhruv air evacuations.',
      'Transmit automated village panchayat radio alerts via UHF/VHF repeaters down the Mandakini gorge.',
      'Establish foot-trail rope lines at Sonprayag ridge to evacuate 12,000 stranded pilgrims.'
    ]
  }
];
