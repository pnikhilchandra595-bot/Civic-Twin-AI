import React, { useState, useEffect } from 'react';
import { 
  Waves, AlertTriangle, ArrowUpRight, TrendingUp, TrendingDown, 
  Minus, RefreshCw, X, Search, ShieldAlert, Activity, ExternalLink
} from 'lucide-react';
import { apiService } from '../services/api';

interface CWCGaugesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CWCGaugesModal: React.FC<CWCGaugesModalProps> = ({ isOpen, onClose }) => {
  const [gauges, setGauges] = useState<any[]>([]);
  const [dataMode, setDataMode] = useState<string>('live');
  const [note, setNote] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchGauges = async () => {
    setIsLoading(true);
    try {
      const res = await apiService.getCWCRiverGauges();
      if (res && Array.isArray(res.gauges)) {
        setGauges(res.gauges);
        setDataMode(res.data_mode || 'live');
        setNote(res.note || '');
        setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (e) {
      console.warn('Failed to load live CWC river gauges:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchGauges();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredGauges = gauges.filter(g => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = (g.station_code || g.gauge_id || '').toLowerCase().includes(q) ||
                          (g.station_name || '').toLowerCase().includes(q) ||
                          (g.river || '').toLowerCase().includes(q) ||
                          (g.basin || '').toLowerCase().includes(q) ||
                          (g.district || '').toLowerCase().includes(q) ||
                          (g.state || '').toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'ALL' || g.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const dangerCount = gauges.filter(g => g.status === 'DANGER' || g.status?.includes('CRITICAL')).length;
  const warningCount = gauges.filter(g => g.status === 'WARNING').length;

  const getTrendIcon = (trend: string) => {
    const t = (trend || '').toUpperCase();
    if (t === 'RISING') return <TrendingUp className="w-3.5 h-3.5 text-rose-400" />;
    if (t === 'FALLING') return <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />;
    return <Minus className="w-3.5 h-3.5 text-amber-400" />;
  };

  const getStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'DANGER' || s.includes('CRITICAL')) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-rose-950/80 text-rose-300 border border-rose-600/60 animate-pulse flex items-center space-x-1">
          <ShieldAlert className="w-3 h-3" />
          <span>DANGER</span>
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-amber-950/80 text-amber-300 border border-amber-600/60 flex items-center space-x-1">
        <AlertTriangle className="w-3 h-3" />
        <span>WARNING</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-[#080d1a] border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-950/90 border border-blue-500/50 text-blue-400 shadow-lg">
              <Waves className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-hud font-bold text-white tracking-wide">
                  Central Water Commission (CWC) River Gauges
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                  dataMode === 'live' 
                    ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/60' 
                    : 'bg-amber-950/90 text-amber-300 border border-amber-500/60'
                }`}>
                  {dataMode === 'live' ? '🟢 LIVE TELEMETRY' : '⚠️ SEEDED REFERENCE'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Official Ministry of Jal Shakti Flood Forecasting Stream ({gauges.length} Stations Above Warning)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchGauges}
              disabled={isLoading}
              title="Refresh CWC Stream"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              title="Close Modal"
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/80 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950/60 border-b border-slate-800 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-slate-400 text-[10px] block uppercase">Total Stations Above Threshold</span>
            <span className="text-xl font-bold text-white">{gauges.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40">
            <span className="text-rose-400 text-[10px] block uppercase font-bold">Severe Danger Stations</span>
            <span className="text-xl font-bold text-rose-300">{dangerCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40">
            <span className="text-amber-400 text-[10px] block uppercase font-bold">Warning Level Stations</span>
            <span className="text-xl font-bold text-amber-300">{warningCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40">
            <span className="text-cyan-400 text-[10px] block uppercase">Official Source Portal</span>
            <a 
              href="https://ffs.india-water.gov.in" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs font-bold text-cyan-300 hover:underline flex items-center space-x-1 mt-1"
            >
              <span>ffs.india-water.gov.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="p-4 bg-slate-900/40 border-b border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between font-mono text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search station code, river, or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all text-xs"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-slate-400 text-[11px] shrink-0">Filter Status:</span>
            {['ALL', 'DANGER', 'WARNING'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === status 
                    ? 'bg-cyan-500 text-black shadow-md' 
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-cyan-300 text-xs">Ingesting Live CWC River Telemetry...</span>
            </div>
          ) : filteredGauges.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              No matching river gauge stations found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {filteredGauges.map((g, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-cyan-500/50 transition-all space-y-2.5 shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-white font-mono flex items-center space-x-1.5 leading-snug">
                        <Activity className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{g.station_name || `Station ${g.station_code || g.gauge_id}`}</span>
                      </span>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-cyan-300 font-mono font-bold">
                          {g.station_code || g.gauge_id}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {g.state ? `${g.state} • ${g.basin || 'Basin'}` : 'National River Gauge'}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {getStatusBadge(g.status)}
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between pt-1.5 border-t border-slate-800/60">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Water Level</span>
                      <span className="text-lg font-black text-cyan-300">{g.current_level_m} <span className="text-xs font-normal text-slate-400">m</span></span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Hydrological Trend</span>
                      <div className="flex items-center space-x-1 justify-end font-bold text-xs">
                        {getTrendIcon(g.trend)}
                        <span className={g.trend === 'RISING' ? 'text-rose-400' : g.trend === 'FALLING' ? 'text-emerald-400' : 'text-amber-400'}>
                          {g.trend || 'UNKNOWN'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-slate-800/40 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{g.last_updated || 'Live Stream'}</span>
                    <span className="text-cyan-400/80 font-bold">{g.district || 'CWC Flood Portal'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
          <span>{note || 'Official Ministry of Jal Shakti Flood Forecasting Network (CWC)'}</span>
          <span className="text-slate-400">Last Stream Sync: <strong className="text-white">{lastUpdated || 'Just Now'}</strong></span>
        </div>
      </div>
    </div>
  );
};
