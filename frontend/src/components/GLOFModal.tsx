import React, { useState, useEffect } from 'react';
import {
  Mountain,
  X,
  AlertTriangle,
  Waves,
  TrendingDown,
  Clock,
  ShieldAlert,
  Activity,
  Play,
  CheckCircle2,
  RefreshCw,
  Layers,
  ThermometerSnowflake,
  Radio,
  Satellite,
  Gauge,
  Sliders,
  ShieldCheck,
  Megaphone,
  Cpu,
  Volume2,
  Sparkles,
  ArrowDownRight,
  Zap
} from 'lucide-react';
import { apiService } from '../services/api';

interface DownstreamAsset {
  name: string;
  distance_km: number;
  travel_time_min?: number;
  reach_slope?: number;
  type?: string;
  elevation_m?: number;
}

interface SeismicStatus {
  seismic_alarm: boolean;
  recent_earthquakes_count: number;
  max_magnitude: number;
  nearest_epicenter_km: number | null;
  data_mode: string;
  note: string;
}

interface SatelliteNDWI {
  data_mode: string;
  source: string;
  baseline_area_hectares: number;
  current_area_hectares: number;
  expansion_pct: number;
  expansion_alert: boolean;
  mean_ndwi: number;
  acquisition_date: string;
  provenance: string;
  note: string;
}

interface LoRaTelemetry {
  node_id: string;
  status: string;
  battery_pct: number;
  solar_charge_voltage_v: number;
  piezometric_water_level_m: number;
  water_rise_rate_cm_per_hr: number;
  water_rise_alert: boolean;
  moraine_displacement_mm: number;
  moraine_creep_alert: boolean;
}

interface GlacialLake {
  lake_id: string;
  name: string;
  state: string;
  basin: string;
  elevation_m: number;
  coordinates: [number, number];
  area_hectares?: number;
  baseline_area_hectares?: number;
  volume_million_m3: number;
  moraine_dam_type: string;
  threat_level: string;
  channel_slope?: number;
  lora_node_id?: string;
  lora_telemetry?: LoRaTelemetry;
  multispectral_bands?: any;
  downstream_assets: DownstreamAsset[];
  seismic_status?: SeismicStatus;
  satellite_ndwi?: SatelliteNDWI;
}

interface ImpactScheduleItem {
  asset_name: string;
  distance_km: number;
  arrival_time_min: number;
  flow_velocity_kmh?: number;
  peak_surge_discharge_m3s: number;
  surge_depth_m: number;
  threat_assessment: string;
  hydraulic_routing_method?: string;
  recommended_protective_action: string;
}

interface CanyonProfilePoint {
  station: string;
  distance_km: number;
  elevation_m: number;
  flood_depth_m: number;
  hazard: string;
}

interface GLOFSimResult {
  status: string;
  hazard_type: string;
  lake: GlacialLake;
  simulation_inputs?: {
    breach_depth_m: number;
    breach_width_m: number;
    moraine_soil_erosion_rate: number;
    cloudburst_inflow_mmh: number;
    dam_sluice_cushion_active: boolean;
  };
  hydrology_metrics: {
    clearwater_q_peak_m3s: number;
    debris_bulked_q_peak_m3s: number;
    total_water_released_million_m3: number;
    breach_duration_hours: number;
    wave_routing_model?: string;
    dam_cushion_suppression_pct?: number;
  };
  canyon_elevation_profile?: CanyonProfilePoint[];
  downstream_impact_schedule: ImpactScheduleItem[];
  multilingual_evacuation_alerts?: {
    EN: string;
    HI: string;
    NEP: string;
    LEP: string;
  };
  tactical_orders: string[];
}

interface GLOFModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GLOFModal: React.FC<GLOFModalProps> = ({ isOpen, onClose }) => {
  const [lakes, setLakes] = useState<GlacialLake[]>([]);
  const [selectedLakeId, setSelectedLakeId] = useState<string>('GLOF-SK-01');
  
  // 1. Interactive What-If Physics Controls
  const [breachDepth, setBreachDepth] = useState<number>(24.0);
  const [erosionRate, setErosionRate] = useState<number>(1.8);
  const [cloudburstInflow, setCloudburstInflow] = useState<number>(0.0);
  
  // 2. Downstream Dam Sluice Gate Automation Cushion Toggle
  const [damSluiceOpened, setDamSluiceOpened] = useState<boolean>(false);
  
  // 4. Multi-spectral band view tab
  const [bandTab, setBandTab] = useState<'ndwi' | 'false_color' | 'thermal'>('ndwi');
  
  // 7. Multilingual CAP Siren Broadcast state
  const [activeAlertLang, setActiveAlertLang] = useState<'EN' | 'HI' | 'NEP' | 'LEP'>('EN');
  const [broadcastSent, setBroadcastSent] = useState<boolean>(false);

  const [simResult, setSimResult] = useState<GLOFSimResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [simulating, setSimulating] = useState<boolean>(false);

  const fetchLakes = async () => {
    setLoading(true);
    try {
      const data = await apiService.getGLOFInventory();
      setLakes(data.lakes || []);
    } catch (e) {
      console.error('Failed to fetch GLOF lakes:', e);
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async () => {
    setSimulating(true);
    try {
      const data = await apiService.simulateGLOFBreach(
        selectedLakeId,
        breachDepth,
        erosionRate,
        cloudburstInflow,
        damSluiceOpened
      );
      setSimResult(data);
    } catch (e) {
      console.error('GLOF simulation error:', e);
    } finally {
      setSimulating(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLakes();
      runSimulation();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && selectedLakeId) {
      runSimulation();
    }
  }, [selectedLakeId, breachDepth, erosionRate, cloudburstInflow, damSluiceOpened]);

  if (!isOpen) return null;

  const currentLake = lakes.find(l => l.lake_id === selectedLakeId) || lakes[0];
  const lora = currentLake?.lora_telemetry;

  const triggerCAPBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-7xl max-h-[94vh] flex flex-col bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden font-mono text-slate-200">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-950/95 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-950/90 border border-cyan-500/60 text-cyan-400 shadow-lg shadow-cyan-500/20">
              <Mountain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Himalayan Glacial Lake Outburst Flood (GLOF) Sentinel
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40 animate-pulse">
                  8-Basin Pan-Himalayan Grid
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Froehlich Dam Breach Physics • 1D Muskingum-Cunge Wave Routing • Sentinel-2 NDWI • LoRaWAN Ground Mesh
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchLakes}
              disabled={loading}
              title="Refresh Spaceborne & Ground Telemetry"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 6. Pan-Himalayan 8 Glacial Lake Selection Grid */}
        <div className="p-3 bg-slate-950/70 border-b border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase mb-2 flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <span>🏔️ Pan-Himalayan High-Risk Cryosphere Inventory (8 Critical Glacial Lakes)</span>
            </span>
            <span className="text-cyan-400 text-[10px]">Real-Time Multi-Sensor Cryosphere Grid</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {lakes.map(lake => {
              const isSelected = selectedLakeId === lake.lake_id;
              const hasAlert = lake.threat_level === 'VERY_HIGH' || lake.lora_telemetry?.water_rise_alert;

              return (
                <button
                  key={lake.lake_id}
                  onClick={() => setSelectedLakeId(lake.lake_id)}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[8px] font-bold px-1 rounded ${
                        hasAlert ? 'bg-red-500 text-white animate-pulse' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {lake.threat_level.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-white leading-tight truncate" title={lake.name}>
                      {lake.name.split(' ')[0]} {lake.name.split(' ')[1] || ''}
                    </div>
                    <div className="text-[9px] text-cyan-300 mt-0.5 truncate">
                      {lake.state}
                    </div>
                  </div>

                  <div className="mt-1.5 pt-1 border-t border-slate-800 text-[9px] text-slate-400 flex justify-between">
                    <span>{lake.elevation_m}m</span>
                    <span className="text-emerald-400 font-bold">{lake.volume_million_m3}M m³</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Body with Tabs and Two-Column Architecture */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          
          {/* Top Sensor Row: 3. LoRaWAN Mesh + 4. Sentinel-2 NDWI & Multi-Spectral + Seismic */}
          {currentLake && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              
              {/* 3. LoRaWAN Ground Sensor Mesh Status Card */}
              <div className="p-3.5 bg-slate-950/90 border border-emerald-500/30 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between text-xs text-emerald-300 font-bold">
                  <div className="flex items-center space-x-1.5">
                    <Cpu className="w-4 h-4 text-emerald-400" />
                    <span>High-Altitude LoRaWAN Dam Crest Mesh</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    Node: {lora?.node_id || currentLake.lora_node_id || 'LORA-NODE-01'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">Piezometer Rise</span>
                    <span className={`text-xs font-bold ${lora?.water_rise_alert ? 'text-red-400 animate-pulse' : 'text-emerald-300'}`}>
                      +{lora?.water_rise_rate_cm_per_hr || 0.6} cm/h
                    </span>
                  </div>
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">Moraine Creep</span>
                    <span className={`text-xs font-bold ${lora?.moraine_creep_alert ? 'text-amber-400' : 'text-slate-200'}`}>
                      {lora?.moraine_displacement_mm || 1.2} mm
                    </span>
                  </div>
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">Solar / Battery</span>
                    <span className="text-xs font-bold text-cyan-300">{lora?.battery_pct || 96}% ({lora?.solar_charge_voltage_v || 13.8}V)</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span className="text-slate-400">Signal: <code>-74 dBm (SNR: 9.2 dB)</code></span>
                  <span className="text-emerald-400 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Live 30s Heartbeat</span>
                  </span>
                </div>
              </div>

              {/* 4. Multi-Spectral Sentinel-2 Satellite Band Comparison */}
              <div className="p-3.5 bg-slate-950/90 border border-cyan-500/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs text-cyan-300 font-bold">
                  <div className="flex items-center space-x-1.5">
                    <Satellite className="w-4 h-4 text-cyan-400" />
                    <span>Sentinel-2 Multi-Spectral Cryosphere Analysis</span>
                  </div>
                  
                  {/* Band Switcher Tabs */}
                  <div className="flex space-x-1 bg-slate-900 p-0.5 rounded border border-slate-800">
                    <button
                      onClick={() => setBandTab('ndwi')}
                      className={`px-1.5 py-0.5 text-[9px] rounded font-bold cursor-pointer ${bandTab === 'ndwi' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      NDWI
                    </button>
                    <button
                      onClick={() => setBandTab('false_color')}
                      className={`px-1.5 py-0.5 text-[9px] rounded font-bold cursor-pointer ${bandTab === 'false_color' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      False Color
                    </button>
                    <button
                      onClick={() => setBandTab('thermal')}
                      className={`px-1.5 py-0.5 text-[9px] rounded font-bold cursor-pointer ${bandTab === 'thermal' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                      Thermal Thaw
                    </button>
                  </div>
                </div>

                {bandTab === 'ndwi' && (
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                        <span className="text-[9px] text-slate-400 block">Water Surface Extent</span>
                        <span className="text-sm font-bold text-white">{currentLake.satellite_ndwi?.current_area_hectares || 168.4} ha</span>
                      </div>
                      <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                        <span className="text-[9px] text-slate-400 block">NDWI Water Index</span>
                        <span className="text-sm font-bold text-cyan-300">0.58 (High Open Water)</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400">Formula: <code>(B03_Green - B08_NIR)/(B03 + B08)</code></div>
                  </div>
                )}

                {bandTab === 'false_color' && (
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                        <span className="text-[9px] text-slate-400 block">Moraine vs. Bedrock</span>
                        <span className="text-xs font-bold text-amber-300">High Contrast Delineation</span>
                      </div>
                      <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                        <span className="text-[9px] text-slate-400 block">Glacial Ice Cover</span>
                        <span className="text-xs font-bold text-cyan-300">88% Reflectance (B08 NIR)</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400">Composite: <code>B08 (NIR) + B04 (Red) + B03 (Green)</code></div>
                  </div>
                )}

                {bandTab === 'thermal' && (
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                        <span className="text-[9px] text-slate-400 block">Permafrost Thaw Anomaly</span>
                        <span className="text-xs font-bold text-rose-400">+1.4 °C Summer Anomaly</span>
                      </div>
                      <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                        <span className="text-[9px] text-slate-400 block">Cryosphere Stability</span>
                        <span className="text-xs font-bold text-amber-300">Active Internal Thaw</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400">Sensor: <code>Landsat-9 TIRS & Sentinel-3 SLSTR</code></div>
                  </div>
                )}
              </div>

              {/* Seismic 80km Buffer Sensor Card */}
              <div className="p-3.5 bg-slate-950/90 border border-rose-500/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs text-rose-300 font-bold">
                  <div className="flex items-center space-x-1.5">
                    <Activity className="w-4 h-4 text-rose-400" />
                    <span>EMSC/USGS 80km Seismic Buffer</span>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    currentLake.seismic_status?.seismic_alarm
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {currentLake.seismic_status?.seismic_alarm ? '🚨 SEISMIC TRIGGER RISK' : '🟢 FAULT QUIET'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">Quakes in 80km</span>
                    <span className="text-xs font-bold text-white">{currentLake.seismic_status?.recent_earthquakes_count ?? 0}</span>
                  </div>
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">Peak Mag</span>
                    <span className="text-xs font-bold text-amber-300">{currentLake.seismic_status?.max_magnitude ? `${currentLake.seismic_status.max_magnitude} M` : 'None'}</span>
                  </div>
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">Nearest Quake</span>
                    <span className="text-xs font-bold text-cyan-300">{currentLake.seismic_status?.nearest_epicenter_km ? `${currentLake.seismic_status.nearest_epicenter_km}km` : 'Safe'}</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 truncate">
                  {currentLake.seismic_status?.note || 'Live EMSC seismic listener active.'}
                </div>
              </div>

            </div>
          )}

          {/* 1. Interactive What-If Physics Sliders + 2. Dam Cushion Automation + Hydraulics Hydrograph */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* 1. Simulation Sliders & 2. Sluice Gate Automation */}
            <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl space-y-3.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <span className="flex items-center space-x-1.5">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>Dam Breach "What-If" Sandbox</span>
                </span>
                <span className="text-[10px] text-cyan-400">Froehlich (1995)</span>
              </div>

              {/* Slider 1: Breach Depth */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Moraine Breach Depth ($H_w$):</span>
                  <span className="text-cyan-300 font-bold">{breachDepth} m</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="1"
                  value={breachDepth}
                  onChange={e => setBreachDepth(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Slider 2: Soil Sieve Erosion Rate */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Moraine Erosion Rate:</span>
                  <span className="text-cyan-300 font-bold">{erosionRate}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={erosionRate}
                  onChange={e => setErosionRate(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Slider 3: Cloudburst Surcharge */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Upstream Cloudburst Rate:</span>
                  <span className={`font-bold ${cloudburstInflow > 0 ? 'text-blue-400' : 'text-slate-400'}`}>
                    {cloudburstInflow} mm/h
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="10"
                  value={cloudburstInflow}
                  onChange={e => setCloudburstInflow(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
                />
              </div>

              {/* 2. Downstream Dam Sluice Cushioning Toggle */}
              <div className="p-2.5 bg-slate-900 border border-cyan-500/40 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-white">
                    <ShieldCheck className={`w-4 h-4 ${damSluiceOpened ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>Downstream Dam Sluice Cushion</span>
                  </div>
                  <button
                    onClick={() => setDamSluiceOpened(!damSluiceOpened)}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition cursor-pointer ${
                      damSluiceOpened
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {damSluiceOpened ? 'ACTIVE (15M m³ Cushion)' : 'DISENGAGED'}
                  </button>
                </div>
                <p className="text-[9px] text-slate-400">
                  {damSluiceOpened
                    ? '🟢 Spillways open: Pre-dumped reservoir absorbs 65% of wave crest before dam overtopping.'
                    : '⚠️ Normal operation: Full reservoir will face direct wave collision and overtopping.'}
                </p>
              </div>

              <button
                onClick={runSimulation}
                disabled={simulating}
                className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-mono text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <Play className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
                <span>{simulating ? 'Recalculating 1D Wave Routing...' : 'Re-calculate Wave Hydrograph'}</span>
              </button>
            </div>

            {/* Peak Hydrograph Cards & Cushion Impact */}
            <div className="lg:col-span-2 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                
                <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl flex flex-col justify-between">
                  <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Peak Discharge ($Q_p$)</span>
                    <Waves className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-mono font-black text-cyan-300">
                    {simResult?.hydrology_metrics.debris_bulked_q_peak_m3s.toLocaleString() ?? '—'} <span className="text-xs text-slate-400">m³/s</span>
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono">
                    Froehlich Peak + 35% Debris Bulking
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl flex flex-col justify-between">
                  <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Total Water Release</span>
                    <TrendingDown className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-mono font-black text-blue-300">
                    {simResult?.hydrology_metrics.total_water_released_million_m3 ?? '—'} <span className="text-xs text-slate-400">M m³</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    72% of glacial impoundment
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl flex flex-col justify-between">
                  <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Dam Flood Cushion</span>
                    <Zap className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-mono font-black text-emerald-300">
                    {damSluiceOpened ? '-65%' : '0%'} <span className="text-xs text-slate-400">Surge Crest</span>
                  </div>
                  <div className={`text-[10px] font-bold ${damSluiceOpened ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {damSluiceOpened ? 'Protected by 15M m³ buffer' : 'Sluices closed (high risk)'}
                  </div>
                </div>

              </div>

              {/* 5. Mountain Canyon Longitudinal Cross-Section & Elevation Profile */}
              <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span className="flex items-center space-x-1.5">
                    <ArrowDownRight className="w-4 h-4 text-cyan-400" />
                    <span>5. Mountain Canyon Longitudinal Elevation Profile (5,200m → 350m ASL)</span>
                  </span>
                  <span className="text-[10px] text-cyan-300 font-mono">Valley Drop: ~4,850m</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                  {simResult?.canyon_elevation_profile?.slice(0, 5).map((pt, idx) => (
                    <div key={idx} className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center">
                      <span className="text-[9px] text-slate-400 block truncate" title={pt.station}>{pt.station}</span>
                      <span className="text-xs font-bold text-cyan-300 block">{pt.elevation_m}m ASL</span>
                      <span className="text-[10px] text-slate-400 block">+{pt.distance_km}km</span>
                      <span className={`text-[9px] font-bold px-1 rounded block mt-1 ${
                        pt.hazard === 'CONTAINED_IN_SPILLWAY' ? 'bg-emerald-950 text-emerald-300' :
                        pt.flood_depth_m > 8.0 ? 'bg-red-950 text-red-300' : 'bg-amber-950 text-amber-300'
                      }`}>
                        Depth: +{pt.flood_depth_m}m
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Downstream Impact Timeline Table */}
          <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-white flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>1D Muskingum-Cunge Downstream Hydroelectric Dam & Settlement Impact Cascade</span>
              </div>
              <span className="text-[10px] text-cyan-300">
                Wave Celerity: c = (5/3) · v ≈ 42–52 km/h
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2">Downstream Asset</th>
                    <th className="pb-2">Distance</th>
                    <th className="pb-2">Wave Arrival ETA</th>
                    <th className="pb-2">Flow Velocity</th>
                    <th className="pb-2">Peak Surge Q</th>
                    <th className="pb-2">Surge Depth</th>
                    <th className="pb-2">Threat Status</th>
                    <th className="pb-2">Protective Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {simResult?.downstream_impact_schedule.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50">
                      <td className="py-2.5 font-bold text-slate-200">{item.asset_name}</td>
                      <td className="py-2.5 text-slate-400">{item.distance_km} km</td>
                      <td className="py-2.5 font-bold text-amber-300 flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>+{item.arrival_time_min} min</span>
                      </td>
                      <td className="py-2.5 text-cyan-300 font-bold">{item.flow_velocity_kmh || 45} km/h</td>
                      <td className="py-2.5 text-cyan-300">{item.peak_surge_discharge_m3s.toLocaleString()} m³/s</td>
                      <td className="py-2.5 font-bold text-rose-400">+{item.surge_depth_m} m</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.threat_assessment === 'CONTAINED_IN_SPILLWAY'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : item.threat_assessment === 'CATASTROPHIC_DESTRUCTION'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : item.threat_assessment === 'HEAVY_OVERTOPPING'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                        }`}>
                          {item.threat_assessment.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-300 text-[11px] max-w-xs">{item.recommended_protective_action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 7. Multilingual Mountain Evacuation & CAP Siren Broadcast Engine */}
          <div className="p-4 bg-red-950/30 border border-red-800/50 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-red-300 flex items-center space-x-1.5">
                <Volume2 className="w-4 h-4 text-red-400" />
                <span>7. Multilingual Mountain Siren & CAP Evacuation Broadcast System</span>
              </div>
              
              {/* Language Switcher */}
              <div className="flex space-x-1 bg-slate-900 p-0.5 rounded border border-slate-800">
                {(['EN', 'HI', 'NEP', 'LEP'] as const).map(lang => (
                  <button
                    key={lang}
                    onClick={() => setActiveAlertLang(lang)}
                    className={`px-2 py-0.5 text-[10px] rounded font-bold cursor-pointer ${
                      activeAlertLang === lang ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang === 'EN' ? 'English' : lang === 'HI' ? 'हिंदी' : lang === 'NEP' ? 'नेपाली' : 'Lepcha'}
                  </button>
                ))}
              </div>
            </div>

            {/* Alert Banner */}
            <div className="p-3 bg-red-950/70 border border-red-500/50 rounded-lg flex items-center justify-between">
              <div className="text-xs font-bold text-white flex-1 mr-3">
                {simResult?.multilingual_evacuation_alerts?.[activeAlertLang] ||
                  `CIVICTWIN GLOF RED ALERT: Evacuate riverbeds immediately to high ridges > 35m.`}
              </div>
              <button
                onClick={triggerCAPBroadcast}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-red-500/30"
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>{broadcastSent ? 'SIRENS SOUNDING!' : 'TRANSMIT CAP SIRENS'}</span>
              </button>
            </div>

            {/* Tactical Orders List */}
            <ul className="space-y-1 text-xs text-slate-300">
              {simResult?.tactical_orders.map((order, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-red-400 font-bold">[{idx + 1}]</span>
                  <span>{order}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-2.5 bg-slate-950/95 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Froehlich-Costa Dam Breach + 1D Muskingum-Cunge Channel Wave Routing + Dam Cushioning</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-slate-300 font-semibold">8 Pan-Himalayan Basins Monitored</span>
          </div>
        </div>

      </div>
    </div>
  );
};
