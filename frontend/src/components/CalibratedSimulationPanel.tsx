import React, { useState } from 'react';
import { 
  CALIBRATED_BENCHMARK_SCENARIOS, 
  CalibratedScenario 
} from '../data/calibratedSimulationScenarios';
import { CityDigitalTwinState, InfrastructureNode } from '../types/digital_twin';
import { 
  FlaskConical, Activity, Waves, Gauge, AlertTriangle, ShieldCheck, 
  Zap, Compass, Play, RotateCcw, Clock, Mountain, MapPin, CheckCircle2, ChevronRight
} from 'lucide-react';

interface CalibratedSimulationPanelProps {
  onInjectCalibratedState?: (scenario: CalibratedScenario, multiplier: number) => void;
  onOpenMap?: () => void;
}

export const CalibratedSimulationPanel: React.FC<CalibratedSimulationPanelProps> = ({
  onInjectCalibratedState,
  onOpenMap
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(CALIBRATED_BENCHMARK_SCENARIOS[0].id);
  const [severityMultiplier, setSeverityMultiplier] = useState<number>(1.0);
  const [injectedSuccess, setInjectedSuccess] = useState<boolean>(false);

  const currentScenario = CALIBRATED_BENCHMARK_SCENARIOS.find(s => s.id === selectedScenarioId) || CALIBRATED_BENCHMARK_SCENARIOS[0];

  const handleInject = () => {
    if (onInjectCalibratedState) {
      onInjectCalibratedState(currentScenario, severityMultiplier);
      setInjectedSuccess(true);
      setTimeout(() => setInjectedSuccess(false), 4000);
    }
  };

  const adjustedDischarge = Math.round(currentScenario.peakDischargeCumecs * severityMultiplier);
  const adjustedSurgeDepth = Number((currentScenario.peakSurgeDepthM * (0.8 + 0.2 * severityMultiplier)).toFixed(2));
  const adjustedCelerity = Number((currentScenario.celerityKmh * (0.9 + 0.1 * severityMultiplier)).toFixed(1));

  return (
    <div className="space-y-4">
      {/* 1. Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/80 via-indigo-950/70 to-slate-900/85 border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-400">
            <FlaskConical className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white font-mono tracking-wide">
                🔬 CALIBRATED SCIENTIFIC BENCHMARK SUITE
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                SOVEREIGN GROUND-TRUTH
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              Coupled multi-hazard physics simulations calibrated against verified ISRO, CWC, and IMD historical catastrophe datasets.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <button
            onClick={handleInject}
            className={`w-full md:w-auto px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer ${
              injectedSuccess
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 hover:shadow-cyan-500/30'
            }`}
          >
            {injectedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>INJECTED INTO TWIN MAP!</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>INJECT CALIBRATED SCENARIO</span>
              </>
            )}
          </button>

          {onOpenMap && (
            <button
              onClick={onOpenMap}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer shrink-0"
              title="View on Digital Twin Map"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">View Map</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Scenario Switcher Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {CALIBRATED_BENCHMARK_SCENARIOS.map((sc) => {
          const isSelected = sc.id === selectedScenarioId;
          return (
            <button
              key={sc.id}
              onClick={() => setSelectedScenarioId(sc.id)}
              className={`p-3 rounded-xl text-left transition-all border cursor-pointer flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'bg-gradient-to-br from-cyan-950/70 to-blue-950/70 border-cyan-400 text-white shadow-lg shadow-cyan-500/15'
                  : 'bg-slate-900/70 hover:bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  {sc.state} • {sc.basin.split(' ')[0]}
                </span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100 font-sans line-clamp-1">
                  {sc.name}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Peak: {sc.peakDischargeCumecs.toLocaleString()} m³/s • Depth: {sc.peakSurgeDepthM}m
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Scenario Detail & Physics Hud */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Physics Telemetry & Sensitivity */}
        <div className="lg:col-span-1 space-y-3">
          <div className="p-4 rounded-2xl bg-[#091224]/90 border border-cyan-500/20 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-slate-100 uppercase">
                  Calibrated Hydraulics
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{currentScenario.eventDate}</span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Peak Outflow Qp</span>
                <p className="text-sm font-bold text-cyan-300 mt-0.5">{adjustedDischarge.toLocaleString()} m³/s</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Max Surge Depth</span>
                <p className="text-sm font-bold text-rose-300 mt-0.5">{adjustedSurgeDepth} meters</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Wave Celerity</span>
                <p className="text-sm font-bold text-amber-300 mt-0.5">{adjustedCelerity} km/h</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Peak Rain Rate</span>
                <p className="text-sm font-bold text-blue-300 mt-0.5">{currentScenario.peakRainfallRateMmh} mm/h</p>
              </div>
            </div>

            {/* Sensitivity Slider */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">Severity Multiplier</span>
                <span className="font-bold text-cyan-300">{severityMultiplier.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={severityMultiplier}
                onChange={(e) => setSeverityMultiplier(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>0.5x (Subdued)</span>
                <span>1.0x (Calibrated Baseline)</span>
                <span>2.0x (Extreme 100-Yr)</span>
              </div>
            </div>

            {/* Governing Mathematical Formulations */}
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Governing Numerical Equations:
              </span>
              <ul className="space-y-1 text-[11px] font-mono text-slate-300">
                {currentScenario.governingEquations.map((eq, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-cyan-400">▹</span>
                    <span>{eq}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Center & Right Columns: Inundation Cascade & Sensor Ground Truth */}
        <div className="lg:col-span-2 space-y-3">
          {/* Historical Description Box */}
          <div className="p-3.5 rounded-2xl bg-[#091224]/85 border border-cyan-500/20 shadow-lg text-xs">
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
              Historical Catastrophe Profile:
            </span>
            <p className="text-slate-200 font-sans mt-1 leading-relaxed">
              {currentScenario.historicalEvent}
            </p>
          </div>

          {/* Inundated Nodes Downstream Progression Table */}
          <div className="p-4 rounded-2xl bg-[#091224]/90 border border-cyan-500/20 shadow-xl space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <Waves className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-slate-100 uppercase">
                  Downstream Flood Wave Propagation (Calibrated Arrival Times)
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">1D Muskingum-Cunge Routing</span>
            </div>

            <div className="space-y-2">
              {currentScenario.keyInundatedNodes.map((node, idx) => {
                const nodeDepth = Number((node.depthM * (0.8 + 0.2 * severityMultiplier)).toFixed(2));
                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                        node.status === 'submerged' ? 'bg-red-950 border border-red-500/40 text-red-300' :
                        node.status === 'critical' ? 'bg-amber-950 border border-amber-500/40 text-amber-300' :
                        'bg-blue-950 border border-blue-500/40 text-blue-300'
                      }`}>
                        T+{node.arrivalMinutes}m
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-100 font-sans">{node.name}</h4>
                        <span className="text-[10px] font-mono text-slate-400 capitalize">{node.type.replace('_', ' ')}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-rose-300">
                        {nodeDepth}m depth
                      </div>
                      <span className={`text-[10px] font-mono font-bold uppercase ${
                        node.status === 'submerged' ? 'text-red-400' :
                        node.status === 'critical' ? 'text-amber-400' : 'text-blue-400'
                      }`}>
                        {node.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sensor Calibrations & Tactical Orders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Calibrated Sensor Feeds */}
            <div className="p-3.5 rounded-2xl bg-[#091224]/90 border border-cyan-500/20 shadow-xl space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Sovereign Sensor Ground-Truth
              </span>
              <div className="space-y-1.5">
                {currentScenario.sensorCalibration.map((sen, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono">
                    <div className="flex justify-between text-slate-400 text-[10px]">
                      <span>{sen.sensorId}</span>
                      <span className="text-rose-400 font-bold">{sen.status}</span>
                    </div>
                    <div className="text-slate-200 font-bold mt-0.5">{sen.metric}</div>
                    <div className="text-cyan-300 text-[10px] mt-0.5">Value: {sen.calibratedValue} (Threshold: {sen.dangerThreshold})</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tactical Mitigations */}
            <div className="p-3.5 rounded-2xl bg-[#091224]/90 border border-cyan-500/20 shadow-xl space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Verified Tactical Mitigations
              </span>
              <ul className="space-y-2 text-xs font-sans text-slate-300">
                {currentScenario.tacticalMitigation.map((mit, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{mit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
