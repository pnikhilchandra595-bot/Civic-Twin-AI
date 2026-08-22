import React, { useState } from 'react';
import { CityDigitalTwinState } from '../types/digital_twin';
import { 
  FileText, Download, Copy, Check, X, 
  Layers, Activity, ShieldAlert, Compass, Code, Table 
} from 'lucide-react';

interface DataExportModalProps {
  state: CityDigitalTwinState | null;
  onClose: () => void;
}

export const DataExportModal: React.FC<DataExportModalProps> = ({ state, onClose }) => {
  const [activeTab, setActiveTab] = useState<'report' | 'json' | 'nodes' | 'sensors' | 'roads'>('report');
  const [copied, setCopied] = useState(false);

  if (!state) return null;

  const downloadDocFile = () => {
    // Direct link to download the generated .doc or .md report
    const element = document.createElement("a");
    const docData = generateDocString();
    const file = new Blob([docData], { type: 'text/markdown;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `CIVICTWIN_${state.city_id.toUpperCase()}_DATASET_REPORT.doc`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadJsonFile = () => {
    const element = document.createElement("a");
    const jsonData = JSON.stringify(state, null, 2);
    const file = new Blob([jsonData], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `CIVICTWIN_${state.city_id.toUpperCase()}_LIVE_STATE.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const generateDocString = () => {
    return `# 🏙️ CIVICTWIN AI – LIVE URBAN DIGITAL TWIN REAL-TIME DATASET REPORT
Active Scenario: ${state.city_name} (${state.city_id})
Timeline: T+${state.timeline_hour.toFixed(1)} Hours | Threat Level: ${state.iap.overall_threat_level}

---
1. WEATHER & ATMOSPHERIC TELEMETRY:
- Rain Intensity: ${state.rain_intensity_mmhr.toFixed(1)} mm/hr
- Storm Surge: ${state.storm_surge_m.toFixed(2)} meters
- Wind Velocity: ${state.wind_speed_kmh.toFixed(1)} km/h (${state.wind_direction_deg.toFixed(0)}°)
- Levee Breached: ${state.levee_breached ? 'YES' : 'NO'}
- Substation Tripped: ${state.substation_tripped ? 'YES' : 'NO'}

---
2. SENSORS MONITORED (${state.sensors.length} Nodes):
${state.sensors.map(s => `• ${s.name} (${s.sensor_type}): ${s.current_value} ${s.unit} | Status: ${s.status} | Trend: ${s.trend}`).join('\n')}

---
3. INFRASTRUCTURE ASSETS (${state.nodes.length} Facilities):
${state.nodes.map(n => `• ${n.name} [${n.node_type}]: Elev: ${n.elevation_m}m | Flood Depth: ${n.flood_depth_m.toFixed(2)}m | Vuln: ${(n.vulnerability_index*100).toFixed(0)}% | Status: ${n.status}`).join('\n')}

---
4. ROAD ARTERIAL NETWORK (${state.roads.length} Corridors):
${state.roads.map(r => `• ${r.name}: ${r.length_km.toFixed(1)}km | Flood Depth: ${r.flood_depth_m.toFixed(2)}m | Speed: ${r.current_speed_kmh.toFixed(0)}km/h | Status: ${r.status}`).join('\n')}

---
5. INCIDENT ACTION PLAN (ICS-201/202):
• Incident Name: ${state.iap.incident_name}
• Situation Summary: ${state.iap.incident_commander_summary}
• Public Alert: ${state.iap.public_emergency_alert}
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateDocString());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="hud-panel w-full max-w-4xl rounded-2xl border border-cyan-500/40 p-6 flex flex-col space-y-4 shadow-[0_0_60px_rgba(0,210,255,0.2)] max-h-[90vh] overflow-y-auto bg-[#090e1a]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                <span>Real-Time Digital Twin Dataset & Document Export</span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Inspect, copy, or download the full live geospatial and sensor matrix
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar & Quick Downloads */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-xl">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-300">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Dataset File Available in Workspace Root: <strong className="text-white">CIVICTWIN_REALTIME_DATASET_REPORT.doc</strong></span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center space-x-1.5 border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Report'}</span>
            </button>

            <button
              onClick={downloadDocFile}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center space-x-1.5 shadow-[0_0_15px_rgba(0,210,255,0.3)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .DOC Report</span>
            </button>

            <button
              onClick={downloadJsonFile}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-bold flex items-center space-x-1.5 border border-cyan-800"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Download .JSON State</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'report' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Structured Document Report
          </button>
          <button
            onClick={() => setActiveTab('nodes')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'nodes' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Infrastructure Table ({state.nodes.length})
          </button>
          <button
            onClick={() => setActiveTab('sensors')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'sensors' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            IoT Sensor Grid ({state.sensors.length})
          </button>
          <button
            onClick={() => setActiveTab('roads')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'roads' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Roads & Corridors ({state.roads.length})
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'json' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Raw JSON State
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-y-auto max-h-96">
          {activeTab === 'report' && (
            <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed font-sans text-xs">
              {generateDocString()}
            </pre>
          )}

          {activeTab === 'nodes' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2">ID</th>
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Elevation</th>
                    <th className="pb-2">Flood Depth</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {state.nodes.map(n => (
                    <tr key={n.id} className="hover:bg-slate-900/50">
                      <td className="py-1.5 text-cyan-400 font-bold">{n.id}</td>
                      <td className="py-1.5 text-white">{n.name}</td>
                      <td className="py-1.5 text-slate-400">{n.node_type}</td>
                      <td className="py-1.5 text-slate-300">{n.elevation_m}m</td>
                      <td className="py-1.5 text-amber-300 font-bold">{n.flood_depth_m.toFixed(2)}m</td>
                      <td className="py-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          n.status === 'critical' || n.status === 'offline' || n.status === 'damaged' ? 'bg-red-500/20 text-red-300' :
                          n.status === 'warning' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {n.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'sensors' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2">Sensor ID</th>
                    <th className="pb-2">Sensor Name</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Live Value</th>
                    <th className="pb-2">Thresholds (Warn/Crit)</th>
                    <th className="pb-2">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {state.sensors.map(s => (
                    <tr key={s.sensor_id} className="hover:bg-slate-900/50">
                      <td className="py-1.5 text-cyan-400 font-bold">{s.sensor_id}</td>
                      <td className="py-1.5 text-white">{s.name}</td>
                      <td className="py-1.5 text-slate-400">{s.sensor_type}</td>
                      <td className="py-1.5 text-amber-300 font-bold">{s.current_value.toFixed(1)} {s.unit}</td>
                      <td className="py-1.5 text-slate-400">{s.threshold_warning} / {s.threshold_critical} {s.unit}</td>
                      <td className="py-1.5 text-cyan-400">{s.trend.toUpperCase()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'roads' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2">Road ID</th>
                    <th className="pb-2">Corridor Name</th>
                    <th className="pb-2">Length</th>
                    <th className="pb-2">Flood Depth</th>
                    <th className="pb-2">Speed</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {state.roads.map(r => (
                    <tr key={r.id} className="hover:bg-slate-900/50">
                      <td className="py-1.5 text-cyan-400 font-bold">{r.id}</td>
                      <td className="py-1.5 text-white">{r.name}</td>
                      <td className="py-1.5 text-slate-400">{r.length_km.toFixed(1)} km</td>
                      <td className="py-1.5 text-amber-300 font-bold">{r.flood_depth_m.toFixed(2)}m</td>
                      <td className="py-1.5 text-slate-300">{r.current_speed_kmh.toFixed(0)} km/h</td>
                      <td className="py-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          r.status === 'impassable' ? 'bg-red-500/20 text-red-300' :
                          r.status === 'congested' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {r.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'json' && (
            <pre className="text-cyan-300 text-[10px]">
              {JSON.stringify(state, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
