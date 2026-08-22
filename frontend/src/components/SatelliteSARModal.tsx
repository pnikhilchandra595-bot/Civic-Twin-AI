import React from 'react';
import { SatelliteSARReport } from '../services/api';
import { 
  Waves, X, Shield, Activity, Globe, 
  CheckCircle2, AlertTriangle, Radar, Eye, Layers 
} from 'lucide-react';

interface SatelliteSARModalProps {
  report: SatelliteSARReport | null;
  onClose: () => void;
  onSyncLiveWeather: () => void;
  isSyncing: boolean;
}

export const SatelliteSARModal: React.FC<SatelliteSARModalProps> = ({
  report,
  onClose,
  onSyncLiveWeather,
  isSyncing
}) => {
  if (!report) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="hud-panel w-full max-w-2xl rounded-2xl border border-cyan-500/40 p-6 flex flex-col space-y-5 shadow-[0_0_50px_rgba(0,210,255,0.25)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Radar className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider">
                Copernicus Sentinel-1 SAR Radar Telemetry
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                All-Weather Synthetic Aperture Radar & Satellite Earth Observation Ingestion
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

        {/* Satellite Mission Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <div className="text-slate-500">Mission</div>
            <div className="text-sm font-bold text-cyan-300 mt-1">Sentinel-1C</div>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <div className="text-slate-500">Resolution</div>
            <div className="text-sm font-bold text-slate-200 mt-1">{report.resolution_m}m / pixel</div>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <div className="text-slate-500">Cloud Penetration</div>
            <div className="text-sm font-bold text-emerald-400 mt-1">100% Active</div>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <div className="text-slate-500">SAR Confidence</div>
            <div className="text-sm font-bold text-cyan-300 mt-1">{(report.sar_confidence_score * 100).toFixed(0)}%</div>
          </div>
        </div>

        {/* Flood Inundation Measurements */}
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-cyan-300 uppercase">
              Detected Radar Flood Extent
            </span>
            <span className="text-[10px] font-mono text-slate-400">Pass: {report.acquisition_time}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">Total Submerged Surface Area</div>
              <div className="text-2xl font-black font-mono text-cyan-300 mt-1">
                {report.total_inundated_area_km2} <span className="text-sm text-slate-400">km²</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-mono">Urban Zone Inundation</div>
              <div className="text-2xl font-black font-mono text-amber-400 mt-1">
                {report.urban_surface_inundation_pct}%
              </div>
            </div>
          </div>

          {/* Radar Backscatter Spectrum */}
          <div className="pt-2">
            <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
              <span>Mean Radar Backscatter: <strong className="text-cyan-300">{report.mean_backscatter_db} dB</strong></span>
              <span>Water Inundation Threshold: <strong className="text-red-400">{report.water_threshold_db} dB</strong></span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-red-500 rounded-full"
                style={{ width: `${Math.min(100, Math.max(10, (report.mean_backscatter_db + 30) * 3))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer Sync Button */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400 font-mono">
            Synced with Open-Meteo & ESA Copernicus Hub
          </span>

          <button
            onClick={onSyncLiveWeather}
            disabled={isSyncing}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center space-x-2 shadow-[0_0_15px_rgba(0,210,255,0.3)] transition-all"
          >
            <Waves className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Ingesting Satellite Data...' : 'Pull Live Satellite & Weather Telemetry'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
