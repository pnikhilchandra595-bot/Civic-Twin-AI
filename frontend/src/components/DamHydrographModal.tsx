import React, { useState } from 'react';
import { 
  Waves, X, AlertTriangle, ShieldCheck, 
  Activity, Sliders, RefreshCw, Gauge, Clock 
} from 'lucide-react';

interface DamHydrographModalProps {
  cityName: string;
  onClose: () => void;
}

export const DamHydrographModal: React.FC<DamHydrographModalProps> = ({
  cityName,
  onClose
}) => {
  const [selectedDam, setSelectedDam] = useState<'hathnikund' | 'ukai' | 'idukki' | 'bargi'>('hathnikund');
  const [sluiceGatesOpen, setSluiceGatesOpen] = useState<number>(14);
  const [dischargeCumecs, setDischargeCumecs] = useState<number>(350000);

  const damConfigs = {
    hathnikund: {
      name: "Hathnikund Barrage (Haryana/Delhi Yamuna Catchment)",
      max_gates: 18,
      full_reservoir_level_m: 350.0,
      current_inflow_cumecs: 380000,
      downstream_reach: "Wazirabad & Old Iron Bridge (Delhi)",
      downstream_travel_time_hours: 48.0
    },
    ukai: {
      name: "Ukai Dam (Tapi River Catchment - Surat)",
      max_gates: 22,
      full_reservoir_level_m: 105.15,
      current_inflow_cumecs: 420000,
      downstream_reach: "Surat City Nehru Bridge",
      downstream_travel_time_hours: 14.5
    },
    idukki: {
      name: "Idukki Arch Dam & Cheruthoni Sluice (Kerala)",
      max_gates: 5,
      full_reservoir_level_m: 732.43,
      current_inflow_cumecs: 180000,
      downstream_reach: "Aluva & Kochi Periyar Basin",
      downstream_travel_time_hours: 8.0
    },
    bargi: {
      name: "Bargi Dam (Narmada Catchment - Jabalpur)",
      max_gates: 21,
      full_reservoir_level_m: 422.76,
      current_inflow_cumecs: 290000,
      downstream_reach: "Gwarighat & Bhedaghat (Jabalpur)",
      downstream_travel_time_hours: 6.5
    }
  };

  const dam = damConfigs[selectedDam];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none">
      <div className="hud-panel w-full max-w-4xl rounded-2xl border border-cyan-500/40 p-6 flex flex-col space-y-4 shadow-[0_0_60px_rgba(0,210,255,0.25)] bg-[#090e1a] text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Waves className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                <span>Hydrograph Curve & Dam Sluice Release Controller</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950 border border-blue-600 text-blue-300 font-mono">
                  CWC / SDMA Protocol
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Dynamic Catchment Inflow-Outflow Modeling & Downstream Crest Arrival Times
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

        {/* Dam Selector Tabs */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => { setSelectedDam('hathnikund'); setDischargeCumecs(350000); }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedDam === 'hathnikund' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-white'
            }`}
          >
            Delhi: Hathnikund Barrage
          </button>

          <button
            onClick={() => { setSelectedDam('ukai'); setDischargeCumecs(420000); }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedDam === 'ukai' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-white'
            }`}
          >
            Gujarat: Ukai Dam (Surat)
          </button>

          <button
            onClick={() => { setSelectedDam('idukki'); setDischargeCumecs(180000); }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedDam === 'idukki' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-white'
            }`}
          >
            Kerala: Idukki Cheruthoni
          </button>

          <button
            onClick={() => { setSelectedDam('bargi'); setDischargeCumecs(290000); }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedDam === 'bargi' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-white'
            }`}
          >
            MP: Bargi Dam (Jabalpur)
          </button>
        </div>

        {/* Live Gauges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Catchment Inflow</span>
            <span className="text-cyan-300 font-extrabold text-base">{dam.current_inflow_cumecs.toLocaleString()} cusecs</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Full Reservoir Level</span>
            <span className="text-blue-300 font-extrabold text-base">{dam.full_reservoir_level_m} m MSL</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Downstream Reach</span>
            <span className="text-amber-300 font-extrabold text-xs truncate block">{dam.downstream_reach}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">Flood Wave Travel Time</span>
            <span className="text-rose-400 font-extrabold text-base">{dam.downstream_travel_time_hours} Hours</span>
          </div>
        </div>

        {/* Sluice Gate Control Slider */}
        <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center space-x-1.5">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Active Sluice Gates Opened: {sluiceGatesOpen} / {dam.max_gates} Gates</span>
            </span>
            <span className="text-rose-400 font-bold text-sm">
              Discharge: {dischargeCumecs.toLocaleString()} Cusecs
            </span>
          </div>

          <input
            type="range"
            min="1"
            max={dam.max_gates}
            value={sluiceGatesOpen}
            onChange={(e) => {
              const gates = parseInt(e.target.value);
              setSluiceGatesOpen(gates);
              setDischargeCumecs(Math.round((gates / dam.max_gates) * dam.current_inflow_cumecs * 1.15));
            }}
            className="w-full"
          />

          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Low Gate Opening (Normal)</span>
            <span className="text-amber-400 font-bold">50% Sluice Threshold</span>
            <span className="text-rose-400 font-bold">Maximum Extreme Emergency Spill</span>
          </div>
        </div>

      </div>
    </div>
  );
};
