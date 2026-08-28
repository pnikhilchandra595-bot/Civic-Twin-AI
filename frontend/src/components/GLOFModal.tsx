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
  Radio
} from 'lucide-react';

interface DownstreamAsset {
  name: string;
  distance_km: number;
  travel_time_min: number;
}

interface GlacialLake {
  lake_id: string;
  name: string;
  state: string;
  basin: string;
  elevation_m: number;
  coordinates: [number, number];
  area_hectares: number;
  volume_million_m3: number;
  moraine_dam_type: string;
  threat_level: string;
  downstream_assets: DownstreamAsset[];
}

interface ImpactScheduleItem {
  asset_name: string;
  distance_km: number;
  arrival_time_min: number;
  peak_surge_discharge_m3s: number;
  surge_depth_m: number;
  threat_assessment: string;
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
      const res = await fetch('http://127.0.0.1:8000/api/simulation/glof-inventory');
      if (res.ok) {
        const data = await res.json();
        setLakes(data.lakes || []);
      }
    } catch (e) {
      console.error('Failed to fetch GLOF lakes:', e);
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async () => {
    setSimulating(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/simulation/glof-cascade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lake_id: selectedLakeId,
          breach_depth_m: breachDepth,
          breach_width_m: breachWidth,
          moraine_soil_erosion_rate: erosionRate
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSimResult(data);
      }
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
  }, [isOpen, selectedLakeId]);

  if (!isOpen) return null;

  const currentLake = lakes.find(l => l.lake_id === selectedLakeId) || lakes[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
              <Mountain className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  Himalayan Glacial Lake Outburst Flood (GLOF) Sentinel
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1">
                  <Activity className="w-3 h-3 text-amber-400" />
                  HYDRODYNAMIC PHYSICS SIMULATION
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700 rounded-full">
                  CALIBRATED CRYOSPHERE BASELINE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Froehlich (1995) Dam Breach Hydraulics & Debris Cascade Forecasting for Himalayan Hydro Dams
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lake Selection Grid */}
        <div className="p-4 bg-slate-950/50 border-b border-slate-800">
          <div className="text-[11px] font-mono font-bold text-slate-400 uppercase mb-2">
            🏔️ Monitored High-Risk Himalayan Glacial Basins
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {lakes.map(lake => (
              <button
                key={lake.lake_id}
                onClick={() => setSelectedLakeId(lake.lake_id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedLakeId === lake.lake_id
                    ? 'bg-cyan-950/40 border-cyan-500/80 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate">{lake.name}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold">
                    {lake.threat_level}
                  </span>
                </div>
                <div className="text-[10px] text-cyan-400 font-mono mt-1">
                  {lake.state} • {lake.elevation_m}m ASL
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Vol: {lake.volume_million_m3}M m³ • {lake.basin}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {/* Controls & Peak Hydraulics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Simulation Sliders */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-200">
                <span>Moraine Breach Parameters</span>
                <Activity className="w-4 h-4 text-cyan-400" />
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
                <span>{simulating ? 'Computing Hydraulics...' : 'Re-calculate Flood Hydrograph'}</span>
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
                  72% of total moraine impoundment
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
                  Flash breach emptying window
                </div>
              </div>

              {/* Dam Moraine Summary */}
              <div className="col-span-2 sm:col-span-3 p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-mono flex items-center justify-between text-slate-300">
                <div>
                  <span className="text-slate-400">Dam Type: </span>
                  <strong className="text-white">{currentLake?.moraine_dam_type}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Coordinates: </span>
                  <strong className="text-cyan-300">{currentLake?.coordinates.join(', ')}</strong>
                </div>
              </div>
            </div>

          </div>

          {/* Downstream Impact Timeline Table */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-bold text-white flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Downstream Hydroelectric Dam & Valley Cascade Timeline</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Surge Speed: ~36 km/h in steep Himalayan canyons
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2">Downstream Asset</th>
                    <th className="pb-2">Distance</th>
                    <th className="pb-2">Arrival ETA</th>
                    <th className="pb-2">Peak Surge</th>
                    <th className="pb-2">Wave Depth</th>
                    <th className="pb-2">Threat Status</th>
                    <th className="pb-2">Recommended Action</th>
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
              <span>NDMA / State Emergency Operations Directive</span>
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
            <span>Cryosphere Hydrodynamic Dam Breach Physics (Froehlich-Costa Algorithm)</span>
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
