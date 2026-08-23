import React, { useState, useEffect } from 'react';
import { 
  AlertOctagon, PhoneCall, MapPin, Users, Waves, 
  CheckCircle2, X, Plus, ShieldAlert, Activity, Send, Filter, RefreshCw 
} from 'lucide-react';
import { apiService, CitizenSOSReport } from '../services/api';

interface CitizenSOSModalProps {
  cityId: string;
  cityName: string;
  onClose: () => void;
  onSelectCoordinates?: (lat: number, lng: number) => void;
}

export const CitizenSOSModal: React.FC<CitizenSOSModalProps> = ({
  cityId,
  cityName,
  onClose,
  onSelectCoordinates
}) => {
  const [reports, setReports] = useState<CitizenSOSReport[]>([]);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'UNRESOLVED'>('ALL');
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  // New SOS Form State
  const [citizenName, setCitizenName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [locationName, setLocationName] = useState('');
  const [category, setCategory] = useState('STRANDED_PERSONS');
  const [victimCount, setVictimCount] = useState(4);
  const [waterDepth, setWaterDepth] = useState(0.75);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSOS = async () => {
      try {
        const data = await apiService.getCitizenSOSReports(cityId);
        setReports(data);
      } catch (err) {
        console.warn('Failed to load SOS reports:', err);
      }
    };
    fetchSOS();

    // Auto-poll every 3 seconds for new live SOS signals
    const interval = setInterval(fetchSOS, 3000);

    // Register live WebSocket listener
    apiService.onSOSReceived((newSOS) => {
      setReports(prev => {
        if (prev.some(r => r.id === newSOS.id)) return prev;
        return [newSOS, ...prev];
      });
    });

    return () => clearInterval(interval);
  }, [cityId]);

  const handleTriage = async (sosId: string, newStatus: string) => {
    try {
      const updated = await apiService.triageCitizenSOS(sosId, newStatus, "unit-ndrf-1");
      setReports(prev => prev.map(r => r.id === sosId ? updated : r));
    } catch (e) {
      console.error('Triage error', e);
    }
  };

  const handleSubmitNewSOS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenName.trim() || !locationName.trim()) return;

    try {
      setIsSubmitting(true);
      const newReport = await apiService.submitCitizenSOS({
        citizen_name: citizenName,
        contact_number: phone,
        city_id: cityId,
        location_name: locationName,
        category: category,
        severity: victimCount >= 5 || waterDepth >= 0.8 ? 'CRITICAL' : 'HIGH',
        victim_count: victimCount,
        water_depth_reported_m: waterDepth,
        description: description
      });

      setReports(prev => [newReport, ...prev]);
      setShowSubmitForm(false);
      // Reset
      setCitizenName('');
      setDescription('');
    } catch (e) {
      console.error('Submit SOS error', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReports = reports.filter(r => {
    if (activeFilter === 'CRITICAL') return r.severity === 'CRITICAL';
    if (activeFilter === 'UNRESOLVED') return r.status === 'UNRESOLVED';
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="hud-panel w-full max-w-3xl rounded-2xl border border-rose-500/40 p-6 flex flex-col space-y-4 shadow-[0_0_60px_rgba(244,63,94,0.25)] max-h-[90vh] overflow-y-auto bg-[#090e1a]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                <span>Crowdsourced Citizen SOS Distress Queue</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-950 border border-rose-600 text-rose-300 font-mono">
                  {reports.filter(r => r.status === 'UNRESOLVED').length} Active Calls
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Live WhatsApp, Telegram & Citizen Portal Distress Signals with AI Verification ({cityName})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={async () => {
                const data = await apiService.getCitizenSOSReports(cityId);
                setReports(data);
              }}
              title="Refresh Live SOS Queue"
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-rose-300 hover:text-white cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Filters */}
          <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-3 py-1 rounded-lg transition-all ${activeFilter === 'ALL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              All Reports ({reports.length})
            </button>
            <button
              onClick={() => setActiveFilter('UNRESOLVED')}
              className={`px-3 py-1 rounded-lg transition-all ${activeFilter === 'UNRESOLVED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              Unresolved ({reports.filter(r => r.status === 'UNRESOLVED').length})
            </button>
            <button
              onClick={() => setActiveFilter('CRITICAL')}
              className={`px-3 py-1 rounded-lg transition-all ${activeFilter === 'CRITICAL' ? 'bg-red-500/30 text-red-300 border border-red-500/50 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              Critical Risk ({reports.filter(r => r.severity === 'CRITICAL').length})
            </button>
          </div>

          <button
            onClick={() => setShowSubmitForm(!showSubmitForm)}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold flex items-center space-x-1.5 shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{showSubmitForm ? 'Close Citizen SOS Form' : 'Simulate / Submit Citizen SOS'}</span>
          </button>
        </div>

        {/* Submit SOS Form Drawer */}
        {showSubmitForm && (
          <form onSubmit={handleSubmitNewSOS} className="p-4 bg-slate-900/95 rounded-xl border border-rose-500/40 space-y-3 font-mono text-xs">
            <div className="font-bold text-rose-300 flex items-center space-x-1.5">
              <PhoneCall className="w-4 h-4" />
              <span>Simulate Inbound Citizen Distress Signal (WhatsApp / Telegram Bot)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Citizen Full Name:</label>
                <input
                  type="text"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder="e.g. Meera Desai"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Contact Mobile Number:</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] text-slate-400">Location / Landmark Description:</label>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            setLocationName(`Live GPS: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E (Real Device Location)`);
                          },
                          (err) => {
                            setLocationName("GPS Permission Denied - Manual Location");
                          }
                        );
                      }
                    }}
                    className="text-[9px] text-cyan-400 hover:text-cyan-300 font-bold underline flex items-center space-x-1"
                  >
                    <MapPin className="w-2.5 h-2.5" />
                    <span>📍 Use My Live Device GPS</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Near Kalina Bridge, Kurla East"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Distress Emergency Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="STRANDED_PERSONS">Stranded Persons / Roof Trapped</option>
                  <option value="MEDICAL_EMERGENCY">Medical Emergency / Ambulance Blocked</option>
                  <option value="SUBMERGED_VEHICLE">Submerged Bus / Vehicle Trapped</option>
                  <option value="LEVEE_CRACK">River Levee Crack / Embankment Piping</option>
                  <option value="POWER_LINE_DOWN">Submerged Transformer / Live Wire</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Victim / Trapped Count: {victimCount} Persons</label>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={victimCount}
                  onChange={(e) => setVictimCount(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Estimated Water Depth: {waterDepth.toFixed(2)} meters</label>
                <input
                  type="range"
                  min="0.1"
                  max="2.5"
                  step="0.05"
                  value={waterDepth}
                  onChange={(e) => setWaterDepth(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Distress Message / Situation Details:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe current situation, water flow, and immediate hazards..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-rose-600 hover:bg-rose-500 font-bold rounded-lg text-white shadow-md flex items-center justify-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Transmitting SOS to Twin...' : 'Publish Crowdsourced Citizen SOS'}</span>
            </button>
          </form>
        )}

        {/* SOS Feed Cards List */}
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col space-y-2 ${
                report.severity === 'CRITICAL'
                  ? 'bg-rose-950/25 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-rose-300">{report.id}</span>
                  <span className="text-white font-bold text-xs">{report.citizen_name}</span>
                  <span className="text-[10px] font-mono text-slate-400">{report.contact_number}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    report.status === 'UNRESOLVED'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                      : report.status === 'UNIT_DISPATCHED'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {report.status}
                  </span>

                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800">
                    AI Conf: {(report.ai_verification_score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs text-slate-300 font-mono">
                <span className="flex items-center space-x-1 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <strong className="text-white">{report.location_name}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>{report.victim_count} Victims</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Waves className="w-3.5 h-3.5 text-blue-400" />
                  <span>{report.water_depth_reported_m.toFixed(2)}m Depth</span>
                </span>
              </div>

              <p className="text-xs text-slate-200 font-sans leading-relaxed bg-slate-950/60 p-2 rounded-lg border border-slate-850">
                "{report.description}"
              </p>

              {/* Tags & Triage Dispatch Buttons */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex flex-wrap gap-1">
                  {report.ai_detected_tags.map((tag, idx) => (
                    <span key={idx} className="text-[9px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  {report.status === 'UNRESOLVED' && (
                    <button
                      onClick={() => handleTriage(report.id, 'UNIT_DISPATCHED')}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold font-mono text-[10px] rounded-lg shadow-sm transition-all"
                    >
                      🚤 Dispatch NDRF Raft
                    </button>
                  )}

                  {report.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleTriage(report.id, 'RESOLVED')}
                      className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white font-bold font-mono text-[10px] rounded-lg shadow-sm transition-all flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Mark Rescued</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
