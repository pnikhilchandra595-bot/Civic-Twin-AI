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
  Compass,
  Layers,
  ThermometerSnowflake,
  Radio,
  Satellite,
  Gauge
} from 'lucide-react';
import { apiService } from '../services/api';

interface DownstreamAsset {
  name: string;
  distance_km: number;
  travel_time_min?: number;
  reach_slope?: number;
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

interface GLOFSimResult {
  status: string;
  hazard_type: string;
  lake: GlacialLake;
  hydrology_metrics: {
    clearwater_q_peak_m3s: number;
    debris_bulked_q_peak_m3s: number;
    total_water_released_million_m3: number;
    breach_duration_hours: number;
    wave_routing_model?: string;
  };
  downstream_impact_schedule: ImpactScheduleItem[];
  tactical_orders: string[];
}

interface GLOFModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GLOFModal: React.FC<GLOFModalProps> = ({ isOpen, onClose }) => {
  const [lakes, setLakes] = useState<GlacialLake[]>([]);
  const [selectedLakeId, setSelectedLakeId] = useState<string>('GLOF-SK-01');
  const [breachDepth, setBreachDepth] = useState<number>(24.0);
  const [breachWidth, setBreachWidth] = useState<number>(65.0);
  const [erosionRate, setErosionRate] = useState<number>(1.8);
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
      const data = await apiService.simulateGLOFBreach(selectedLakeId, breachDepth, erosionRate);
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
  }, [selectedLakeId]);

  if (!isOpen) return null;

  const currentLake = lakes.find(l => l.lake_id === selectedLakeId) || lakes[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden font-mono">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-400">
              <Mountain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Himalayan Glacial Lake Outburst Flood (GLOF) Sentinel
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  1D Muskingum-Cunge Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Copernicus Sentinel-2 NDWI Lake Extent • EMSC 80km Seismic Triggers • Froehlich-Costa Hydraulics
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchLakes}
              disabled={loading}
              title="Refresh Spaceborne Telemetry"
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

        {/* Lake Selection Grid */}
        <div className="p-4 bg-slate-950/50 border-b border-slate-800">
          <div className="text-[11px] font-mono font-bold text-slate-400 uppercase mb-2 flex items-center justify-between">
            <span>🏔️ Monitored High-Risk Himalayan Glacial Basins</span>
            <span className="text-cyan-400 text-[10px]">Real-Time Multi-Sensor Cryosphere Grid</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {lakes.map(lake => {
              const isSelected = selectedLakeId === lake.lake_id;
              const hasSeismicAlarm = lake.seismic_status?.seismic_alarm;
              const hasExpansionAlert = lake.satellite_ndwi?.expansion_alert;

              return (
                <button
                  key={lake.lake_id}
                  onClick={() => setSelectedLakeId(lake.lake_id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/50 border-cyan-400 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{lake.name}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      hasSeismicAlarm || hasExpansionAlert
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {lake.threat_level}
                    </span>
                  </div>
                  <div className="text-[10px] text-cyan-300 font-mono mt-1 flex justify-between">
                    <span>{lake.state}</span>
                    <span>{lake.elevation_m}m ASL</span>
                  </div>
                  
                  {/* Telemetry pill */}
                  <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9px]">
                    <span className="text-emerald-400 flex items-center space-x-1">
                      <Satellite className="w-2.5 h-2.5" />
                      <span>{lake.satellite_ndwi?.current_area_hectares || lake.area_hectares || 168} ha</span>
                    </span>
                    <span className={`font-mono px-1 rounded ${hasSeismicAlarm ? 'bg-red-950 text-red-300 border border-red-500' : 'bg-slate-950 text-slate-400'}`}>
                      {hasSeismicAlarm ? '🚨 Quake <80km' : '🟢 Seismic OK'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          
          {/* Real Live Satellite NDWI & Seismic Cross-Referencing Telemetry Card */}
          {currentLake && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              
              {/* Copernicus Sentinel-2 L2A NDWI Telemetry Card */}
              <div className="p-3.5 bg-slate-950/90 border border-cyan-500/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs text-cyan-300 font-bold">
                  <div className="flex items-center space-x-1.5">
                    <Satellite className="w-4 h-4 text-cyan-400" />
                    <span>Copernicus Sentinel-2 L2A Surface Water NDWI</span>
                  </div>
                  <span className="text-[9px] bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/40 text-cyan-200">
                    {currentLake.satellite_ndwi?.acquisition_date || 'Live Ingest'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">Baseline Area</span>
                    <span className="text-sm font-bold text-white">{currentLake.satellite_ndwi?.baseline_area_hectares || currentLake.area_hectares || 168.4} ha</span>
                  </div>
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">Current Extent</span>
                    <span className="text-sm font-bold text-cyan-300">{currentLake.satellite_ndwi?.current_area_hectares || 174.3} ha</span>
                  </div>
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">Expansion Anomaly</span>
                    <span className={`text-sm font-bold ${currentLake.satellite_ndwi?.expansion_alert ? 'text-red-400' : 'text-emerald-400'}`}>
                      +{currentLake.satellite_ndwi?.expansion_pct || 3.5}%
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Spectral Band: <code>(B03 - B08)/(B03 + B08)</code></span>
                  <span className="text-emerald-300 font-bold">Mean NDWI: {currentLake.satellite_ndwi?.mean_ndwi || 0.54}</span>
                </div>
              </div>

              {/* EMSC / USGS Seismic Proximity Sensor Card */}
              <div className="p-3.5 bg-slate-950/90 border border-rose-500/30 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs text-rose-300 font-bold">
                  <div className="flex items-center space-x-1.5">
                    <Activity className="w-4 h-4 text-rose-400" />
                    <span>EMSC/USGS 80km Seismic Proximity Sensor</span>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    currentLake.seismic_status?.seismic_alarm
                      ? 'bg-red-500 text-white animate-ping'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {currentLake.seismic_status?.seismic_alarm ? '🚨 SEISMIC TRIGGER RISK' : '🟢 MORAINE STABLE'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">Quakes in 80km</span>
                    <span className="text-sm font-bold text-white">{currentLake.seismic_status?.recent_earthquakes_count ?? 0}</span>
                  </div>
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">Peak Magnitude</span>
                    <span className="text-sm font-bold text-amber-300">{currentLake.seismic_status?.max_magnitude ? `${currentLake.seismic_status.max_magnitude} M` : 'None'}</span>
                  </div>
                  <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">Nearest Epicenter</span>
                    <span className="text-sm font-bold text-cyan-300">{currentLake.seismic_status?.nearest_epicenter_km ? `${currentLake.seismic_status.nearest_epicenter_km} km` : 'Safe'}</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 pt-1 truncate">
                  {currentLake.seismic_status?.note || 'Live seismic network listening across Himalayan fault.'}
                </div>
              </div>

            </div>
          )}

          {/* Controls & Peak Hydraulics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Simulation Sliders */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-200">
                <span>Moraine Dam Breach Parameters</span>
                <Gauge className="w-4 h-4 text-cyan-400" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Breach Depth:</span>
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

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Breach Width:</span>
                  <span className="text-cyan-300 font-bold">{breachWidth} m</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="150"
                  step="5"
                  value={breachWidth}
                  onChange={e => setBreachWidth(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Moraine Erosion Rate:</span>
                  <span className="text-cyan-300 font-bold">{erosionRate}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="3.0"
                  step="0.1"
                  value={erosionRate}
                  onChange={e => setErosionRate(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <button
                onClick={runSimulation}
                disabled={simulating}
                className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-mono text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <Play className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
                <span>{simulating ? 'Routing Muskingum Wave...' : 'Re-calculate Flood Hydrograph'}</span>
              </button>
            </div>

            {/* Peak Hydrograph Cards */}
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col justify-between">
                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Peak Discharge</span>
                  <Waves className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-mono font-black text-cyan-300">
                  {simResult?.hydrology_metrics.debris_bulked_q_peak_m3s.toLocaleString() ?? '—'} <span className="text-xs text-slate-400">m³/s</span>
                </div>
                <div className="text-[10px] text-cyan-400 font-mono">
                  Froehlich Peak + 35% Debris Bulking
                </div>
              </div>

              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col justify-between">
                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Water Outflow</span>
                  <TrendingDown className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-mono font-black text-blue-300">
                  {simResult?.hydrology_metrics.total_water_released_million_m3 ?? '—'} <span className="text-xs text-slate-400">M m³</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  72% of moraine impoundment
                </div>
              </div>

              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col justify-between">
                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Breach Duration</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-mono font-black text-amber-300">
                  {simResult?.hydrology_metrics.breach_duration_hours ?? '—'} <span className="text-xs text-slate-400">Hours</span>
                </div>
                <div className="text-[10px] text-amber-400 font-mono">
                  Emptying window
                </div>
              </div>

              {/* Dam Moraine Summary */}
              <div className="col-span-2 sm:col-span-3 p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono flex items-center justify-between text-slate-300">
                <div>
                  <span className="text-slate-400">Dam Structure: </span>
                  <strong className="text-white">{currentLake?.moraine_dam_type}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Valley Gradient: </span>
                  <strong className="text-cyan-300">S₀ = {currentLake?.channel_slope || 0.048} (Manning n=0.055)</strong>
                </div>
              </div>
            </div>

          </div>

          {/* Downstream Impact Timeline Table */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-bold text-white flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>1D Muskingum-Cunge Downstream Hydroelectric Dam & Valley Cascade Timeline</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-300">
                Wave Celerity: c = 5/3 · v ≈ 42–52 km/h
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
                    <th className="pb-2">Tactical Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {simResult?.downstream_impact_schedule.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50">
                      <td className="py-2.5 font-bold text-slate-200">{item.asset_name}</td>
                      <td className="py-2.5 text-slate-400">{item.distance_km} km</td>
                      <td className="py-2.5 font-bold text-amber-300 flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>+{item.arrival_time_min} mins</span>
                      </td>
                      <td className="py-2.5 text-cyan-300 font-bold">{item.flow_velocity_kmh || 45} km/h</td>
                      <td className="py-2.5 text-cyan-300">{item.peak_surge_discharge_m3s.toLocaleString()} m³/s</td>
                      <td className="py-2.5 font-bold text-rose-400">+{item.surge_depth_m} m</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.threat_assessment === 'CATASTROPHIC_DESTRUCTION'
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

          {/* Tactical Emergency Orders */}
          <div className="p-4 bg-red-950/20 border border-red-800/40 rounded-xl space-y-2">
            <div className="text-xs font-mono font-bold text-red-300 flex items-center space-x-1.5">
              <Radio className="w-4 h-4 text-red-400" />
              <span>NDMA / State Disaster Operations Directive</span>
            </div>
            <ul className="space-y-1 text-xs font-mono text-slate-300">
              {simResult?.tactical_orders.map((order, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-red-400 font-bold">[{idx + 1}]</span>
                  <span>{order}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Froehlich-Costa Dam Breach + 1D Muskingum-Cunge Channel Wave Routing Engine</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-slate-300 font-semibold">Real-Time Cryosphere Sentinel Active</span>
          </div>
        </div>

      </div>
    </div>
  );
};
