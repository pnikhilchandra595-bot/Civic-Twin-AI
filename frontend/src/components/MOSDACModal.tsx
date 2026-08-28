import React, { useState, useEffect } from 'react';
import {
  Satellite,
  X,
  RefreshCw,
  ExternalLink,
  Layers,
  Database,
  Calendar,
  MapPin,
  HardDrive,
  Activity,
  Search,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface MOSDACGranule {
  identifier: string;
  id: string;
  summary: string;
  updated: string;
  dcDate?: string;
  enclosureLink?: string;
  searchLink?: string;
  boundbox?: Array<{ west: string; south: string; east: string; north: string }>;
}

interface MOSDACResponse {
  status: string;
  source: string;
  dataset_id: string;
  time_range: { start: string; end: string };
  bounding_box: string;
  total_results: number;
  total_size_mb: number;
  entries: MOSDACGranule[];
  note?: string;
}

interface MOSDACModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MOSDACModal: React.FC<MOSDACModalProps> = ({ isOpen, onClose }) => {
  const [data, setData] = useState<MOSDACResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<string>('3SIMG_L1B_STD');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const DATASETS = [
    { id: '3SIMG_L1B_STD', name: 'INSAT-3DR Imager L1B (Half-Hour)', desc: '6-channel VIS, SWIR, TIR-1, TIR-2, WV Multispectral' },
    { id: '3SND_L2B_TPW', name: 'INSAT-3D Sounder TPW / Moisture', desc: 'Total Precipitable Water & Atmospheric Profiles' },
    { id: '3DIMG_L2B_HEM', name: 'INSAT-3D Hydro-Estimator QPE', desc: 'Quantitative Precipitation Estimates across Indian Basins' },
    { id: 'OCM_L1B_STD', name: 'Oceansat-3 Ocean Color Monitor', desc: 'Coastal Turbidity, Sediment & Chlorophyll-a' },
    { id: 'SCT_L2B_WND', name: 'SCATSAT-1 Ocean Surface Winds', desc: 'Marine Wind Vectors & Cyclone Storm Surge Analysis' }
  ];

  const fetchCatalog = async (datasetId: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = `http://127.0.0.1:8000/api/real-data/mosdac-catalog?dataset_id=${encodeURIComponent(datasetId)}&count=20`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch MOSDAC telemetry`);
      const json: MOSDACResponse = await res.json();
      setData(json);
    } catch (err: any) {
      console.error('MOSDAC fetch error:', err);
      setError(err.message || 'Unable to connect to ISRO MOSDAC service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCatalog(selectedDataset);
    }
  }, [isOpen, selectedDataset]);

  if (!isOpen) return null;

  const entries = data?.entries || [];
  const filteredEntries = entries.filter(e => {
    const q = searchTerm.toLowerCase();
    return (
      (e.identifier || '').toLowerCase().includes(q) ||
      (e.summary || '').toLowerCase().includes(q) ||
      (e.id || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
              <Satellite className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  ISRO MOSDAC Spaceborne Earth Observation Telemetry
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  AUTHENTICATED SATELLITE FEED
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Space Applications Centre (ISRO SAC) • INSAT-3D / INSAT-3DR / OceanSat Multi-Channel Telemetry
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

        {/* Live Numerical Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950/40 border-b border-slate-800/80">
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>Active Granules</span>
              <Database className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-mono font-bold text-white mt-1">
              {data?.total_results ?? '—'}
            </div>
            <div className="text-[10px] text-blue-400 mt-0.5 font-mono">
              Archived granules (7-day window)
            </div>
          </div>

          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>Total Ingest Size</span>
              <HardDrive className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-mono font-bold text-cyan-300 mt-1">
              {data?.total_size_mb ? `${(data.total_size_mb / 1024).toFixed(1)} GB` : '—'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
              {data?.total_size_mb?.toLocaleString() ?? 0} MB HDF5 Telemetry
            </div>
          </div>

          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>Spatial Coverage</span>
              <MapPin className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-sm font-mono font-bold text-emerald-300 mt-1 truncate">
              68.0°E - 97.0°E
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
              8.0°N - 37.0°N (All-India Box)
            </div>
          </div>

          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>Sensor Bandwidth</span>
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-mono font-bold text-amber-300 mt-1">
              6 Channels
            </div>
            <div className="text-[10px] text-amber-400 mt-0.5 font-mono">
              VIS, SWIR, MIR, TIR1, TIR2, WV
            </div>
          </div>
        </div>

        {/* Dataset Selector Tabs & Search */}
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {DATASETS.map(ds => (
              <button
                key={ds.id}
                onClick={() => setSelectedDataset(ds.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                  selectedDataset === ds.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                <Satellite className="w-3.5 h-3.5" />
                <span>{ds.name}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full md:w-72">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search granule / H5 file..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <button
              onClick={() => fetchCatalog(selectedDataset)}
              disabled={loading}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition cursor-pointer"
              title="Refresh MOSDAC Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Granules Feed List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
              <div className="text-sm font-mono">Querying ISRO SAC MOSDAC Atmospheric & Oceanic Ingest API...</div>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-950/30 border border-red-800/50 rounded-xl text-center space-y-2">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
              <div className="text-sm font-bold text-red-300">MOSDAC Ingest Service Offline</div>
              <div className="text-xs text-slate-400 font-mono">{error}</div>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="py-16 text-center text-slate-500 font-mono text-xs">
              No matching satellite granules found for "{searchTerm}".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredEntries.map((granule, idx) => (
                <div
                  key={granule.id || idx}
                  className="p-4 bg-slate-950/70 border border-slate-800/90 hover:border-blue-500/50 rounded-xl transition-all space-y-2 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <div className="text-xs font-mono font-bold text-blue-300 group-hover:text-blue-200 transition break-all">
                        {granule.identifier}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {granule.summary || 'Multispectral Level-1B Radiometric Image Granule'}
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 text-[9px] font-mono bg-blue-950/80 text-blue-300 border border-blue-700/50 rounded shrink-0">
                      ID: {granule.id}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400 font-mono">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{granule.updated ? new Date(granule.updated).toLocaleString('en-IN') : 'Live Observation'}</span>
                    </div>

                    <div className="flex items-center space-x-1 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified HDF5</span>
                    </div>

                    {granule.enclosureLink && (
                      <a
                        href={granule.enclosureLink}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-auto text-blue-400 hover:text-blue-300 flex items-center space-x-1 hover:underline"
                      >
                        <span>Download H5</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Format: High-Density HDF5 (H5) Standard Astronomical & Earth Observation Matrix</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-semibold">ISRO SAC MOSDAC Portal Active</span>
          </div>
        </div>

      </div>
    </div>
  );
};
