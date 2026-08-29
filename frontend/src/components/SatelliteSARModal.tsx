import React, { useState } from 'react';
import { SatelliteSARReport } from '../services/api';
import { AuthUser } from './LoginPage';
import { 
  Waves, X, Shield, Activity, Globe, 
  CheckCircle2, AlertTriangle, Radar, Eye, Layers, Lock, Sparkles, Sliders, RefreshCw, Send
} from 'lucide-react';

interface SatelliteSARModalProps {
  report: SatelliteSARReport | null;
  authUser?: AuthUser | null;
  onClose: () => void;
  onSyncLiveWeather: () => void;
  isSyncing: boolean;
}

export const SatelliteSARModal: React.FC<SatelliteSARModalProps> = ({
  report,
  authUser,
  onClose,
  onSyncLiveWeather,
  isSyncing
}) => {
  if (!report) return null;

  const isNational = !authUser || authUser.userType === 'national_authority';
  const isStateOfficer = authUser?.userType === 'state_officer';
  const assignedState = authUser?.assignedState || 'Assigned State';

  // National-only satellite calibration state
  const [backscatterThreshold, setBackscatterThreshold] = useState<number>(report.water_threshold_db);
  const [retaskingTriggered, setRetaskingTriggered] = useState<boolean>(false);

  const handleRetaskPass = () => {
    if (!isNational) return;
    setRetaskingTriggered(true);
    setTimeout(() => {
      setRetaskingTriggered(false);
      onSyncLiveWeather();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none font-sans">
      <div className="hud-panel w-full max-w-3xl rounded-3xl border border-cyan-500/40 bg-[#060a14] p-6 flex flex-col space-y-5 shadow-[0_0_70px_rgba(0,210,255,0.25)] text-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-cyan-950/90 border border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(0,210,255,0.3)]">
              <Radar className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-black text-white uppercase tracking-wider">
                  Copernicus Sentinel-1 C-SAR & Radar Backscatter Model
                </h2>
                {isNational ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-500 text-[10px] font-mono text-blue-300 font-bold flex items-center space-x-1">
                    <Globe className="w-3 h-3 text-blue-400" />
                    <span>Level 5 • Full National Control</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-500 text-[10px] font-mono text-purple-300 font-bold flex items-center space-x-1">
                    <Lock className="w-3 h-3 text-purple-400" />
                    <span>Level 3 • {assignedState} SDMA Read-Only</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Synthetic Aperture Radar (SAR) Inundation Model (Hydrodynamic C-SAR Simulation & ISRO MOSDAC Metadata)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Clearance Alert Banner */}
        {isStateOfficer ? (
          <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/40 flex items-start space-x-3 text-xs font-mono text-purple-200">
            <Lock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-purple-300 uppercase">State Officer SDMA Access Policy: </span>
              <span>You have authorized telemetry view of {assignedState}'s satellite radar flood extent. Orbital parameter re-tasking, threshold calibration, and multi-state satellite reconfiguration are restricted to National Command (NDMA Level 5).</span>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-500/40 flex items-start space-x-3 text-xs font-mono text-blue-200">
            <Shield className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-blue-300 uppercase">National Command Clearance Level 5: </span>
              <span>Full read/write telemetry privileges active. You can trigger emergency satellite re-tasking passes and recalibrate radar backscatter flood sensitivity across all 36 States & UTs.</span>
            </div>
          </div>
        )}

        {/* Data Provenance Badge */}
        <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-[11px] font-mono text-amber-200 flex items-center justify-between">
          <span>⚠️ <strong>Provenance:</strong> Modeled Physics Simulation (C-Band Radar Backscatter derived from 2D hydrodynamic water depth)</span>
          <span className="px-2 py-0.5 rounded bg-amber-900/50 border border-amber-500 text-amber-300 text-[10px] font-bold">
            MODELED_PHYSICS_SIMULATION
          </span>
        </div>

        {/* Satellite Mission Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3.5 bg-[#090e1c] rounded-2xl border border-slate-800">
            <div className="text-slate-500">Constellation</div>
            <div className="text-sm font-black text-cyan-300 mt-1">Sentinel-1 C-Band Model</div>
          </div>
          <div className="p-3.5 bg-[#090e1c] rounded-2xl border border-slate-800">
            <div className="text-slate-500">Spatial Resolution</div>
            <div className="text-sm font-black text-slate-200 mt-1">{report.resolution_m}m / pixel</div>
          </div>
          <div className="p-3.5 bg-[#090e1c] rounded-2xl border border-slate-800">
            <div className="text-slate-500">Cloud Penetration</div>
            <div className="text-sm font-black text-emerald-400 mt-1">100% Active (All-Weather)</div>
          </div>
          <div className="p-3.5 bg-[#090e1c] rounded-2xl border border-slate-800">
            <div className="text-slate-500">SAR Confidence</div>
            <div className="text-sm font-black text-cyan-300 mt-1">{(report.sar_confidence_score * 100).toFixed(0)}%</div>
          </div>
        </div>

        {/* Radar Flood Inundation Measurements */}
        <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-black text-cyan-300 uppercase flex items-center space-x-2">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Detected Radar Flood Extent</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
              Acquisition: {report.acquisition_time}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 bg-[#090e1c] rounded-2xl border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">Total Submerged Surface Area</div>
              <div className="text-3xl font-black font-mono text-cyan-300 mt-1 flex items-baseline space-x-1.5">
                <span>{report.total_inundated_area_km2}</span>
                <span className="text-sm text-slate-400 font-normal">km²</span>
              </div>
            </div>

            <div className="p-4 bg-[#090e1c] rounded-2xl border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">Urban Zone Submergence Ratio</div>
              <div className="text-3xl font-black font-mono text-amber-400 mt-1 flex items-baseline space-x-1.5">
                <span>{report.urban_surface_inundation_pct}%</span>
                <span className="text-sm text-slate-400 font-normal">Inundated</span>
              </div>
            </div>
          </div>

          {/* Radar Backscatter Spectrum */}
          <div className="pt-2 space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Mean Radar Backscatter: <strong className="text-cyan-300">{report.mean_backscatter_db} dB</strong></span>
              <span>Water Inundation Threshold: <strong className="text-red-400">{backscatterThreshold} dB</strong></span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden relative border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-red-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.max(10, (report.mean_backscatter_db + 30) * 3))}%` }}
              />
            </div>
          </div>

          {/* 🛰️ ISRO MOSDAC Satellite Orbital Telemetry Card */}
          <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/40 space-y-2 mt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-purple-300">
                <span>🛰️ ISRO MOSDAC (INSAT-3DR Atmospheric & Hydro-Estimator)</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-purple-900/60 border border-purple-500 text-[10px] font-mono text-purple-200 font-bold">
                ISRO MOSDAC Catalog
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-slate-500 text-[10px]">Dataset ID</div>
                <div className="text-amber-300 font-bold">3SIMG_L1B_STD</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-slate-500 text-[10px]">Rain Estimator</div>
                <div className="text-cyan-300 font-bold">3SIMG_L2B_HEM</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-slate-500 text-[10px]">Sea Surface Temp</div>
                <div className="text-emerald-300 font-bold">3RIMG_L2B_SST</div>
              </div>
            </div>
          </div>
        </div>

        {/* National Command Modification Panel (Only for Level 5 National Officers) */}
        {isNational && (
          <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blue-300 uppercase flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                <span>National Satellite Re-Tasking & Parameter Overrides</span>
              </span>
              <span className="text-[10px] font-mono text-blue-400 bg-blue-950 px-2 py-0.5 rounded-md border border-blue-500/50">
                Authorized: Level 5
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">
                  Radar Water Threshold Calibration ({backscatterThreshold} dB)
                </label>
                <input
                  type="range"
                  min="-28"
                  max="-10"
                  step="0.5"
                  value={backscatterThreshold}
                  onChange={(e) => setBackscatterThreshold(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleRetaskPass}
                  disabled={retaskingTriggered || isSyncing}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-lg flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {retaskingTriggered ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Transmitting Orbital Uplink...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-cyan-200" />
                      <span>Uplink Re-Tasking Command</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
