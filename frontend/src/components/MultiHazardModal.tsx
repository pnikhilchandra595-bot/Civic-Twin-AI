import React, { useState } from 'react';
import { 
  Flame, Skull, Activity, Wind, AlertTriangle, 
  ShieldAlert, CheckCircle2, X, Play, Zap, Compass 
} from 'lucide-react';
import { apiService } from '../services/api';

interface MultiHazardModalProps {
  cityName: string;
  onClose: () => void;
}

export const MultiHazardModal: React.FC<MultiHazardModalProps> = ({
  cityName,
  onClose
}) => {
  const [activeHazard, setActiveHazard] = useState<'HAZMAT' | 'EARTHQUAKE' | 'FIRE' | 'CYCLONE'>('HAZMAT');
  
  // Hazmat Inputs
  const [chemical, setChemical] = useState('Ammonia (NH3)');
  const [releaseRate, setReleaseRate] = useState(30.0);
  
  // Earthquake Inputs
  const [magnitude, setMagnitude] = useState(6.8);
  const [depthKm, setDepthKm] = useState(10.0);

  const [simulationResult, setSimulationResult] = useState<any | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      if (activeHazard === 'HAZMAT') {
        const res = await apiService.simulateMultiHazard('HAZMAT_TOXIC_GAS_LEAK', {
          chemical_name: chemical,
          release_rate_kg_s: releaseRate
        });
        setSimulationResult(res);
      } else if (activeHazard === 'EARTHQUAKE') {
        const res = await apiService.simulateMultiHazard('EARTHQUAKE_SHAKEMAP', {
          magnitude_richter: magnitude,
          focal_depth_km: depthKm
        });
        setSimulationResult(res);
      } else if (activeHazard === 'FIRE') {
        const res = await apiService.simulateMultiHazard('URBAN_FIRE', {});
        setSimulationResult(res);
      }
    } catch (e) {
      console.error('Multi-hazard sim error', e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="hud-panel w-full max-w-3xl rounded-2xl border border-amber-500/40 p-6 flex flex-col space-y-4 shadow-[0_0_60px_rgba(245,158,11,0.25)] max-h-[90vh] overflow-y-auto bg-[#090e1a]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Skull className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                <span>Multi-Hazard Physics & Crisis Vector Engine</span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Simulate Hazmat Toxic Gas Plumes, Earthquake ShakeMaps, Cyclones & Slum Fires ({cityName})
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

        {/* Hazard Selector Tabs */}
        <div className="flex items-center space-x-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => { setActiveHazard('HAZMAT'); setSimulationResult(null); }}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
              activeHazard === 'HAZMAT'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Skull className="w-4 h-4 text-amber-400" />
            <span>☣️ Hazmat Gas Leak</span>
          </button>

          <button
            onClick={() => { setActiveHazard('EARTHQUAKE'); setSimulationResult(null); }}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
              activeHazard === 'EARTHQUAKE'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4 text-rose-400" />
            <span>🏢 Earthquake ShakeMap</span>
          </button>

          <button
            onClick={() => { setActiveHazard('FIRE'); setSimulationResult(null); }}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
              activeHazard === 'FIRE'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40 font-bold shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4 text-red-400" />
            <span>🔥 Slum Conflagration</span>
          </button>
        </div>

        {/* Hazard Input Parameter Sandbox */}
        <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
          {activeHazard === 'HAZMAT' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Select Industrial Chemical / Toxic Agent:</label>
                  <select
                    value={chemical}
                    onChange={(e) => setChemical(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="Ammonia (NH3)">Ammonia (NH3) - Industrial Fertilizer Storage</option>
                    <option value="Chlorine (Cl2)">Chlorine (Cl2) - Water Treatment Cylinder Rupture</option>
                    <option value="Hydrogen Sulfide (H2S)">Hydrogen Sulfide (H2S) - Drainage Culvert Gas</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">
                    Discharge Release Rate: {releaseRate.toFixed(0)} kg/sec
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={releaseRate}
                    onChange={(e) => setReleaseRate(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {activeHazard === 'EARTHQUAKE' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">
                    Earthquake Magnitude: M {magnitude.toFixed(1)} Richter
                  </label>
                  <input
                    type="range"
                    min="4.5"
                    max="8.2"
                    step="0.1"
                    value={magnitude}
                    onChange={(e) => setMagnitude(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">
                    Focal Depth: {depthKm.toFixed(0)} km (Shallow Crustal)
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={depthKm}
                    onChange={(e) => setDepthKm(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {activeHazard === 'FIRE' && (
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Simulates high-density slum and urban settlement fire propagation rate in meters/minute based on wind vector (35 km/h) and structural fuel density.
            </p>
          )}

          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all"
          >
            <Play className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Computing Physics Dispersion...' : 'Execute Multi-Hazard Simulation & Calculate Plume'}</span>
          </button>
        </div>

        {/* Results Screen */}
        {simulationResult && (
          <div className="p-4 bg-slate-950 rounded-xl border border-amber-500/40 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-amber-300 font-bold border-b border-slate-800 pb-2">
              <span>📊 Multi-Hazard Impact Assessment: {simulationResult.hazard_type}</span>
              <span className="text-emerald-400">Physics Solver Converged</span>
            </div>

            {simulationResult.impact_zones && (
              <div className="space-y-2">
                <div className="text-[11px] text-slate-400 font-bold">Gaussian Dispersion Zones:</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {simulationResult.impact_zones.map((zone: any, idx: number) => (
                    <div key={idx} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                      <div className="text-white font-bold text-[11px]">{zone.zone.split('(')[0]}</div>
                      <div className="text-amber-400 text-xs">Radius: {zone.radius_km} km</div>
                      <div className="text-[10px] text-slate-400">{zone.ppe_required || zone.action}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {simulationResult.peak_ground_acceleration_g && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Peak Ground Acceleration:</div>
                  <div className="text-rose-400 font-bold text-sm">{simulationResult.peak_ground_acceleration_g} g</div>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Intensity Scale:</div>
                  <div className="text-amber-300 font-bold text-xs">{simulationResult.mmi_intensity}</div>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Masonry Collapse Risk:</div>
                  <div className="text-red-400 font-bold text-sm">{simulationResult.structural_collapse_risk.unreinforced_masonry_buildings_pct}%</div>
                </div>
              </div>
            )}

            {simulationResult.rate_of_spread_m_per_min && (
              <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-lg space-y-1">
                <div className="text-red-300 font-bold text-xs">Flame Velocity: {simulationResult.rate_of_spread_m_per_min} meters / minute</div>
                <div className="text-slate-300 text-[11px]">Time to engulf residential ward: {simulationResult.time_to_engulf_ward_min} minutes</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
