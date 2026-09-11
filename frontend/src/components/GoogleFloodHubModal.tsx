import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface GoogleFloodHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  cityId?: string;
}

export const GoogleFloodHubModal: React.FC<GoogleFloodHubModalProps> = ({
  isOpen,
  onClose,
  cityId = 'mumbai_monsoon'
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(cityId);

  useEffect(() => {
    if (!isOpen) return;
    loadFloodHubData(selectedCity);
  }, [isOpen, selectedCity]);

  const loadFloodHubData = async (cId: string) => {
    setLoading(true);
    try {
      const res = await apiService.getGoogleFloodHubData(cId);
      setData(res);
    } catch (e) {
      console.error('Failed to load Google Flood Hub data:', e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const basin = data?.basin_info || {};
  const telemetry = data?.streamflow_telemetry || {};
  const alert = data?.alert_status || {};
  const impact = data?.micro_physics_downstream_impact || {};
  const hydrograph = data?.hydrograph_7d || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-blue-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-900/50 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-400/40 rounded-xl text-blue-400 text-2xl">
              🌊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide font-hud">
                  GOOGLE FLOOD HUB AI INGESTION
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full font-bold">
                  Macro AI GRU Streamflow + CivicTwin 2D Physics
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                7-Day Upstream River Streamflow Forecasting Coupled Directly into Micro-Urban Inundation Engines
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Basin Selector Bar */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-800 bg-slate-950/60 overflow-x-auto text-xs">
          <span className="text-slate-400 font-mono font-bold uppercase shrink-0">Select Active River Basin:</span>
          {[
            { id: 'mumbai_monsoon', label: '🌊 Mumbai Mithi / Ulhas' },
            { id: 'guwahati_assam', label: '🌧️ Assam Brahmaputra' },
            { id: 'sikkim_lhonak', label: '🏔️ Sikkim Teesta' },
            { id: 'kerala_floods', label: '🌴 Kerala Periyar' },
            { id: 'delhi_yamuna', label: '🏛️ Delhi NCR Yamuna' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedCity(item.id)}
              className={`px-3 py-1.5 rounded-lg font-mono font-semibold transition cursor-pointer shrink-0 ${
                selectedCity === item.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200 text-xs font-sans">
          {loading ? (
            <div className="text-center py-16 text-slate-400 font-mono animate-pulse">
              Connecting to Google Flood Hub AI streamflow forecast grid...
            </div>
          ) : (
            <>
              {/* Top Banner Alert */}
              <div
                className="rounded-xl p-4 border flex flex-wrap items-center justify-between gap-4 shadow-lg"
                style={{
                  backgroundColor: `${alert.color_hex || '#3b82f6'}15`,
                  borderColor: `${alert.color_hex || '#3b82f6'}60`
                }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: alert.color_hex || '#3b82f6' }} />
                    <span className="font-mono font-bold text-sm uppercase" style={{ color: alert.color_hex || '#3b82f6' }}>
                      {alert.severity_label || 'Severe Alert'}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-900 border border-slate-700 text-slate-300">
                      Peak Arrival Lead Time: {alert.lead_time_hours || 72}h Window
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 font-sans">
                    Gauging Station: <strong>{basin.gauge_station_name}</strong> ({basin.gauge_station_id}) • Region: {basin.basin_name} ({basin.state})
                  </p>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs text-slate-400 uppercase">Google AI Forecast Peak</div>
                  <div className="text-lg font-bold text-white">
                    {telemetry.peak_7d_discharge_cumecs?.toLocaleString()} <span className="text-xs text-slate-400">m³/s</span>
                  </div>
                </div>
              </div>

              {/* 7-Day Hydrograph Bar Matrix */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="font-bold font-mono text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <span>📊</span>
                    <span>Google Flood Hub 7-Day Streamflow Hydrograph:</span>
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400">
                    Gauged Recurrent Unit (GRU) Neural Prediction
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-2 pt-2">
                  {hydrograph.map((item: any, idx: number) => {
                    const isPeak = item.discharge_cumecs === telemetry.peak_7d_discharge_cumecs;
                    const maxFlow = Math.max(...hydrograph.map((h: any) => h.discharge_cumecs), 1);
                    const heightPct = Math.min(100, Math.max(15, Math.round((item.discharge_cumecs / maxFlow) * 100)));

                    return (
                      <div key={idx} className="flex flex-col items-center space-y-2">
                        <div className="h-28 w-full bg-slate-900 rounded-lg p-1 flex flex-col justify-end items-center relative overflow-hidden border border-slate-800">
                          <div
                            className={`w-full rounded transition-all ${
                              isPeak
                                ? 'bg-gradient-to-t from-red-600 via-orange-500 to-amber-400 shadow-lg shadow-orange-500/30'
                                : 'bg-gradient-to-t from-blue-700 to-cyan-500'
                            }`}
                            style={{ height: `${heightPct}%` }}
                          />
                          {isPeak && (
                            <span className="absolute top-1 text-[8px] font-mono font-black uppercase text-amber-300 bg-black/60 px-1 rounded">
                              PEAK
                            </span>
                          )}
                        </div>
                        <div className="text-center">
                          <div className="font-mono font-bold text-slate-200 text-[11px]">
                            {item.discharge_cumecs?.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {item.day_label}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Threshold Comparison Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-center">
                  <div className="text-[10px] uppercase font-mono text-slate-400">Current Discharge</div>
                  <div className="text-sm font-bold text-cyan-400 font-mono mt-1">
                    {telemetry.current_discharge_cumecs} m³/s
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-center">
                  <div className="text-[10px] uppercase font-mono text-slate-400">2-Yr Warning Mark</div>
                  <div className="text-sm font-bold text-amber-400 font-mono mt-1">
                    {telemetry.warning_2yr_cumecs} m³/s
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-center">
                  <div className="text-[10px] uppercase font-mono text-slate-400">5-Yr Danger Mark</div>
                  <div className="text-sm font-bold text-orange-400 font-mono mt-1">
                    {telemetry.danger_5yr_cumecs} m³/s
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-center">
                  <div className="text-[10px] uppercase font-mono text-slate-400">20-Yr Catastrophic</div>
                  <div className="text-sm font-bold text-rose-400 font-mono mt-1">
                    {telemetry.extreme_20yr_cumecs} m³/s
                  </div>
                </div>
              </div>

              {/* Micro-Physics Coupling Card (The CivicTwin Magic) */}
              <div className="border border-cyan-500/40 bg-gradient-to-r from-cyan-950/30 via-blue-950/20 to-slate-950 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">⚡</span>
                    <span className="font-bold font-mono text-cyan-300 uppercase tracking-wide">
                      CivicTwin 2D Micro-Hydrodynamic Physics Translation
                    </span>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 rounded">
                    Macro Inflow → Local Street Depth
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Predicted Street Depth Peak</div>
                    <div className="text-base font-bold text-white font-mono mt-0.5">
                      {impact.predicted_street_inundation_peak_m} meters
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Total Upstream Volume</div>
                    <div className="text-base font-bold text-white font-mono mt-0.5">
                      {impact.total_upstream_inflow_volume_ml} Million m³
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Tidal Lock Amplification</div>
                    <div className="text-xs font-bold text-cyan-300 font-mono mt-0.5">
                      {impact.tidal_lock_amplification_pct}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 font-sans leading-relaxed">
                  🛡️ <strong>Statutory NDMA ICS-201 Operational Action:</strong> {impact.recommended_ndma_action}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span>Google Flood Hub Active Streamflow Bridge Connected</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
