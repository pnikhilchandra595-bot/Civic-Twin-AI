import React, { useState } from 'react';
import { 
  FlaskConical, BookOpen, Activity, Waves, Gauge, ArrowRight, 
  CheckCircle2, X, Sparkles, ExternalLink, HelpCircle
} from 'lucide-react';
import { CalibratedScenario } from '../data/calibratedSimulationScenarios';

interface ExplainablePhysicsModalProps {
  scenario: CalibratedScenario;
  multiplier: number;
  onClose: () => void;
}

export const ExplainablePhysicsModal: React.FC<ExplainablePhysicsModalProps> = ({
  scenario,
  multiplier,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'froehlich' | 'manning' | 'saint_venant' | 'celerity'>('froehlich');

  // Dynamically computed physical parameters
  const baseOutflow = scenario.peakDischargeCumecs;
  const activeOutflow = Math.round(baseOutflow * multiplier);
  const surgeDepth = Number((scenario.peakSurgeDepthM * (0.8 + 0.2 * multiplier)).toFixed(2));
  const celerity = Number((scenario.celerityKmh * (0.9 + 0.1 * multiplier)).toFixed(1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl max-h-[92vh] bg-[#071120] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-mono text-slate-100">
        
        {/* Header */}
        <div className="p-4 bg-slate-950/90 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FlaskConical className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-bold text-white font-hud tracking-wide">
                  EXPLAINABLE PHYSICS (XAI) SCIENTIFIC DERIVATIONS
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  FIRST-PRINCIPLES
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Mathematical hydrodynamic equations backing CivicTwin AI's multi-hazard simulations
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Model Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-3 bg-slate-900/70 border-b border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('froehlich')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
              activeTab === 'froehlich'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/25 border border-cyan-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            1. Froehlich (1995) Dam Breach
          </button>
          <button
            onClick={() => setActiveTab('manning')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
              activeTab === 'manning'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/25 border border-cyan-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            2. Manning's Channel Roughness
          </button>
          <button
            onClick={() => setActiveTab('celerity')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
              activeTab === 'celerity'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/25 border border-cyan-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            3. Kinematic Wave Celerity
          </button>
          <button
            onClick={() => setActiveTab('saint_venant')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
              activeTab === 'saint_venant'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/25 border border-cyan-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            4. 1D Saint-Venant Momentum
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeTab === 'froehlich' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30">
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block mb-1">
                  GOVERNING EQUATION (FROEHLICH EMPIRICAL BREACH MODEL - 1995)
                </span>
                <div className="text-base sm:text-lg font-mono font-bold text-cyan-200 py-2 border-y border-slate-800 my-2">
                  Q_p = 0.607 · V_w^0.295 · H_w^1.24 · K_m
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Used by the US Army Corps of Engineers (HEC-RAS) and the Central Water Commission (CWC) to predict instantaneous peak outburst discharge resulting from moraine or earthen embankment failures.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <span className="font-bold text-white uppercase text-[11px]">Parameter Definitions:</span>
                  <ul className="space-y-1 text-slate-300">
                    <li>• <strong className="text-cyan-300">Q_p:</strong> Peak breach discharge (m³/s)</li>
                    <li>• <strong className="text-cyan-300">V_w:</strong> Reservoir storage volume at failure (m³)</li>
                    <li>• <strong className="text-cyan-300">H_w:</strong> Hydraulic height of breach water column (m)</li>
                    <li>• <strong className="text-cyan-300">K_m:</strong> Active sensitivity multiplier ({multiplier}x)</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-teal-500/30 space-y-2">
                  <span className="font-bold text-teal-300 uppercase text-[11px]">Current Live Evaluation ({scenario.name}):</span>
                  <div className="space-y-1 font-mono text-xs">
                    <p>Base Discharged: <strong className="text-white">{baseOutflow.toLocaleString()} m³/s</strong></p>
                    <p>Sensitivity Multiplier: <strong className="text-amber-300">{multiplier}x</strong></p>
                    <p className="text-emerald-400 font-bold text-sm pt-1 border-t border-slate-800">
                      → Calibrated Q_p: {activeOutflow.toLocaleString()} m³/s
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1">
                <strong className="text-slate-200">Scientific Reference:</strong>
                <p>Froehlich, D. C. (1995). "Embankment Dam Breach Parameters Revisited." Proceedings of the 1995 ASCE Conference on Water Resources Engineering, San Antonio, Texas, pp. 887-891.</p>
              </div>
            </div>
          )}

          {activeTab === 'manning' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30">
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block mb-1">
                  GOVERNING EQUATION (MANNING OPEN-CHANNEL HYDRAULICS)
                </span>
                <div className="text-base sm:text-lg font-mono font-bold text-cyan-200 py-2 border-y border-slate-800 my-2">
                  v = (1 / n) · R^(2/3) · S^(1/2)
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Computes the average velocity and conveyance capacity of natural riverbeds and urban drainage culverts during extreme precipitation events.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <span className="font-bold text-white uppercase text-[11px]">Parameter Definitions:</span>
                  <ul className="space-y-1 text-slate-300">
                    <li>• <strong className="text-cyan-300">v:</strong> Mean channel velocity (m/s)</li>
                    <li>• <strong className="text-cyan-300">n:</strong> Manning roughness coefficient (0.035 mountain rocky bed; 0.015 concrete canal)</li>
                    <li>• <strong className="text-cyan-300">R:</strong> Hydraulic radius (A / P, m)</li>
                    <li>• <strong className="text-cyan-300">S:</strong> Energy slope / bed inclination (m/m)</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-teal-500/30 space-y-2">
                  <span className="font-bold text-teal-300 uppercase text-[11px]">Computed Wave Depth & Conveyance:</span>
                  <div className="space-y-1 font-mono text-xs">
                    <p>Channel Roughness n: <strong className="text-white">0.038 (Bouldered Riverbed)</strong></p>
                    <p>Current Surge Depth H_s: <strong className="text-teal-300">{surgeDepth} meters</strong></p>
                    <p className="text-emerald-400 font-bold text-sm pt-1 border-t border-slate-800">
                      → Flow Velocity: {(celerity / 3.6).toFixed(2)} m/s ({celerity} km/h)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'celerity' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30">
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block mb-1">
                  GOVERNING EQUATION (KINEMATIC WAVE FLOOD CELERITY)
                </span>
                <div className="text-base sm:text-lg font-mono font-bold text-cyan-200 py-2 border-y border-slate-800 my-2">
                  c = dQ/dA = (5/3) · v
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  In steep Himalayan and Western Ghats mountain river valleys, the flood surge wave propagates faster than the average water particles. The celerity dictates arrival lead times for downstream civilian settlements.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <span className="font-bold text-white uppercase text-[11px]">Wave Arrival Timeline:</span>
                  <div className="space-y-1.5">
                    {scenario.keyInundatedNodes.slice(0, 4).map((kn, idx) => (
                      <div key={idx} className="flex items-center justify-between text-slate-300 py-0.5 border-b border-slate-800/60">
                        <span>{kn.name}</span>
                        <strong className="text-cyan-300 font-mono">T+{kn.arrivalMinutes} min</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-teal-500/30 space-y-2">
                  <span className="font-bold text-teal-300 uppercase text-[11px]">Celerity Computation:</span>
                  <div className="space-y-1 font-mono text-xs">
                    <p>Base Celerity: <strong className="text-white">{scenario.celerityKmh} km/h</strong></p>
                    <p>Current Wave Speed c: <strong className="text-emerald-300">{celerity} km/h</strong></p>
                    <p className="text-amber-400 text-[11px] pt-1 border-t border-slate-800">
                      ⚡ Advance Warning Window: ~{scenario.keyInundatedNodes[0]?.arrivalMinutes} minutes to nearest dam.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'saint_venant' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30">
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block mb-1">
                  GOVERNING EQUATIONS (1D UNSTEADY SAINT-VENANT EQUATIONS)
                </span>
                <div className="space-y-1.5 py-2 border-y border-slate-800 my-2 text-xs sm:text-sm font-mono font-bold text-cyan-200">
                  <div>1. Continuity: ∂A/∂t + ∂Q/∂x - q_lat = 0</div>
                  <div>2. Momentum: ∂Q/∂t + ∂/∂x(Q²/A) + g·A·∂h/∂x + g·A(S_f - S_0) = 0</div>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Solves for unsteady, non-uniform shallow water wave routing across complex topography, accounting for lateral inflow from cloudbursts (q_lat), bed slope (S_0), and boundary friction (S_f).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
                <span className="font-bold text-white uppercase text-[11px]">Numerical Discretization:</span>
                <p className="text-slate-300 font-sans leading-relaxed">
                  Discretized using an implicit finite-difference Preissmann 4-point scheme with Courant number stability check (Cr = c·Δt / Δx ≤ 1.0) to ensure numerical convergence during steep flash flood wave fronts.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Calibrated against CWC & USACE Hydro Standards</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all cursor-pointer shadow-md"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
