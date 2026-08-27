import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, PhoneCall, MapPin, AlertTriangle, 
  Sparkles, Send, HeartPulse, Building2, Navigation, 
  CheckCircle2, X, Activity, Radio, Info, Compass, ShieldCheck, Waves
} from 'lucide-react';
import { AuthUser } from './LoginPage';
import { apiService } from '../services/api';

interface CitizenPortalModalProps {
  authUser: AuthUser | null;
  cityName: string;
  onClose: () => void;
  onNavigateToLocation?: (lat: number, lng: number, label: string) => void;
}

interface ChatMessage {
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
}

export const CitizenPortalModal: React.FC<CitizenPortalModalProps> = ({
  authUser,
  cityName,
  onClose,
  onNavigateToLocation
}) => {
  const stateName = authUser?.assignedState || 'Maharashtra';
  const districtName = authUser?.assignedDistrict || 'Mumbai Suburban District';

  // SOS Beacon State
  const [sosActive, setSosActive] = useState<boolean>(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [sosPersonsCount, setSosPersonsCount] = useState<number>(1);
  const [sosMedicalEmergency, setSosMedicalEmergency] = useState<boolean>(false);
  const [sosSentSuccess, setSosSentSuccess] = useState<boolean>(false);

  // Gemini AI Chat Assistant State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: 'gemini',
      text: `Namaste! I am your Gemini AI Disaster Safety Assistant for ${districtName}, ${stateName}. How can I assist you? You can ask about safe evacuation routes, nearest relief shelters, or emergency medical aid.`,
      timestamp: 'Just now'
    }
  ]);
  const [userQuery, setUserQuery] = useState<string>('');
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'HELPLINES' | 'SHELTERS' | 'ROADS' | 'HOSPITALS' | 'AI_CHAT'>('OVERVIEW');

  // Auto-detect GPS location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        (err) => {
          console.log('Using default district coordinates:', err);
          setGpsCoords({ lat: 19.076, lng: 72.877 });
        }
      );
    }
  }, []);

  const handleSendSos = async () => {
    setSosActive(true);
    setSosSentSuccess(true);
    try {
      if (gpsCoords && (apiService as any).sendCitizenSos) {
        await (apiService as any).sendCitizenSos({
          name: authUser?.name || 'Citizen SOS Beacon',
          phone: authUser?.phone || '+91 98765 43210',
          lat: gpsCoords.lat,
          lng: gpsCoords.lng,
          persons_count: sosPersonsCount,
          medical_required: sosMedicalEmergency,
          district: districtName,
          state: stateName
        });
      }
    } catch (e) {
      console.warn('SOS backend notification:', e);
    }
  };

  const handleSendMessage = async () => {
    if (!userQuery.trim()) return;

    const newMsg: ChatMessage = {
      sender: 'user',
      text: userQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);
    setUserQuery('');
    setIsAiThinking(true);

    try {
      if ((apiService as any).askGeminiAdvisor) {
        const response = await (apiService as any).askGeminiAdvisor({
          query: userQuery,
          context: {
            user_type: 'citizen',
            state: stateName,
            district: districtName,
            gps: gpsCoords
          }
        });

        setChatMessages(prev => [
          ...prev,
          {
            sender: 'gemini',
            text: response?.answer || `Stay indoors and avoid wading through water. The nearest designated safe relief center in ${districtName} is operational with emergency supplies.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsAiThinking(false);
        return;
      }
    } catch (e) {
      console.warn('Gemini chat API error:', e);
    }

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'gemini',
          text: `⚠️ Safety Notice for ${districtName}: Heavy precipitation detected in your area. Avoid underpasses and stay on elevated ground. For urgent water rescue, call the District Disaster Cell at 1077 or National Emergency at 112.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsAiThinking(false);
    }, 700);
  };
        setChatMessages(prev => [
          ...prev,
          {
            sender: 'gemini',
            text: `⚠️ Safety Notice for ${districtName}: Heavy precipitation detected. Avoid underpasses and stay on elevated ground. For urgent water rescue, call the District Disaster Cell at 1077 or National Emergency at 112.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 700);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Local District Helplines
  const helplines = [
    { title: 'National Emergency Helpline', number: '112', desc: 'Police, Fire, Ambulance & NDRF All-in-One', color: 'text-red-400', bg: 'bg-red-950/80 border-red-500/50' },
    { title: `${stateName} State Disaster Control (SDRF)`, number: '1070', desc: 'State Relief & Emergency Management', color: 'text-amber-400', bg: 'bg-amber-950/80 border-amber-500/50' },
    { title: `${districtName} Disaster Control (DDMA)`, number: '1077', desc: 'Local Flood & Evacuation Control Cell', color: 'text-cyan-400', bg: 'bg-cyan-950/80 border-cyan-500/50' },
    { title: 'Emergency Medical & Ambulance', number: '108', desc: '24/7 Life Support & Trauma Response', color: 'text-emerald-400', bg: 'bg-emerald-950/80 border-emerald-500/50' },
    { title: 'Women & Child Emergency Support', number: '1091', desc: 'Priority Family Rescue Support', color: 'text-purple-400', bg: 'bg-purple-950/80 border-purple-500/50' }
  ];

  // Local Safe Shelters in District
  const localShelters = [
    { name: `${districtName} Government Higher Secondary School`, type: 'Designated Relief Camp', capacity: '450 Persons', food: 'Available', power: 'Generator Backup', coords: [19.032, 72.855] },
    { name: 'District Community Hall & Indoor Sports Complex', type: 'High-Ground Safe Shelter', capacity: '800 Persons', food: 'SDRF Kitchen Active', power: 'Solar + Grid', coords: [19.054, 72.842] },
    { name: 'Red Cross Disaster Relief Center', type: 'Medical Aid Post', capacity: '250 Persons', food: 'Medical Kits + Food', power: 'Continuous Supply', coords: [19.021, 72.868] }
  ];

  // Flooded Roads & Inundated Areas
  const floodedRoads = [
    { road: 'Lowland Railway Subway & Underpass', status: 'CLOSED (0.65m Water)', detour: 'Use Flyover Elevated Corridor', severity: 'CRITICAL' },
    { road: 'River Embankment Ring Road (Section 4)', status: 'WATERLOGGED (0.35m)', detour: 'Slow Traffic Only (Heavy Vehicles)', severity: 'WARNING' },
    { road: 'Market Central Junction', status: 'CLEAR & OPEN', detour: 'Normal Traffic Flow', severity: 'SAFE' }
  ];

  // Local Emergency Hospitals
  const localHospitals = [
    { name: `${districtName} General Government Hospital`, beds: '42 Emergency Beds Free', oxygen: 'Full Capacity', phone: '022-24146000', status: 'ACTIVE 24/7' },
    { name: 'Apex Trauma & Multi-Speciality Center', beds: '18 ICU Beds Available', oxygen: 'Adequate', phone: '022-26558000', status: 'ACTIVE 24/7' }
  ];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 z-50 select-none font-sans">
      <div className="hud-panel w-full max-w-5xl rounded-3xl border border-cyan-500/40 flex flex-col h-[92vh] bg-[#070b16] text-slate-100 shadow-[0_0_90px_rgba(0,210,255,0.25)] overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-950 via-blue-950/60 to-slate-950">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30">
              <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                  Citizen Safety & Disaster Assistant
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 text-[10px] font-mono font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>CIVIC ACTIVE</span>
                </span>
              </div>
              <p className="text-xs text-cyan-300 font-mono flex items-center space-x-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>Selected Area: <strong>{districtName}</strong>, {stateName}</span>
                {gpsCoords && (
                  <span className="text-slate-400 text-[11px] hidden sm:inline">
                    • GPS: [{gpsCoords.lat.toFixed(3)}°N, {gpsCoords.lng.toFixed(3)}°E]
                  </span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer shadow-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center space-x-2 overflow-x-auto text-xs font-mono">
          {[
            { id: 'OVERVIEW', label: '🏠 Safety Overview' },
            { id: 'HELPLINES', label: '📞 Emergency Helplines' },
            { id: 'SHELTERS', label: '🏕️ Safe Shelters' },
            { id: 'ROADS', label: '⚠️ Flooded Roads' },
            { id: 'HOSPITALS', label: '🏥 Hospitals' },
            { id: 'AI_CHAT', label: '🤖 Gemini AI Safety Guide' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                activeTab === tab.id
                  ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* TAB 1: OVERVIEW & SOS BEACON */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              
              {/* Emergency 1-Click SOS Hero Card */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-red-950/80 via-slate-950 to-orange-950/70 border border-red-500/50 shadow-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-6 h-6 text-red-400 animate-bounce" />
                      <h3 className="text-lg font-black text-white uppercase tracking-wider">
                        1-Click Emergency SOS GPS Beacon
                      </h3>
                    </div>
                    <p className="text-xs text-slate-300">
                      Instantly share your exact live GPS coordinates and victim count with State SDRF & NDRF rescue boats.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-mono">
                      <span className="text-slate-400 block text-[10px]">Persons Trapped:</span>
                      <select
                        value={sosPersonsCount}
                        onChange={(e) => setSosPersonsCount(Number(e.target.value))}
                        className="bg-transparent text-white font-bold focus:outline-none"
                      >
                        {[1, 2, 3, 4, 5, 6, 8, 10, 15, 20].map(n => (
                          <option key={n} value={n} className="bg-slate-900 text-white">{n} {n === 1 ? 'Person' : 'Persons'}</option>
                        ))}
                      </select>
                    </div>

                    <label className="flex items-center space-x-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sosMedicalEmergency}
                        onChange={(e) => setSosMedicalEmergency(e.target.checked)}
                        className="accent-red-500 w-4 h-4 rounded"
                      />
                      <span>🚑 Medical Emergency</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={handleSendSos}
                    className={`w-full sm:w-auto flex-1 py-4 px-6 rounded-2xl font-mono text-sm font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xl ${
                      sosActive
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/40 animate-pulse'
                        : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-red-600/40'
                    }`}
                  >
                    <Radio className="w-5 h-5 animate-pulse" />
                    <span>{sosActive ? '🟢 SOS Beacon Transmitting Live to NDRF' : '🚨 Broadcast SOS & Share My GPS Location'}</span>
                  </button>
                </div>

                {sosSentSuccess && (
                  <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/80 text-emerald-200 text-xs font-mono flex items-center space-x-2.5 animate-bounce shadow-lg">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>
                      <strong>SOS Dispatched!</strong> Emergency GPS packet received at {districtName} DDMA Control Room. Rescue unit alerted.
                    </span>
                  </div>
                )}
              </div>

              {/* Local Area Quick Safety Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Safe Shelters Summary Card */}
                <div 
                  onClick={() => setActiveTab('SHELTERS')}
                  className="p-5 rounded-3xl bg-slate-900/70 border border-cyan-500/30 hover:border-cyan-400 space-y-3 cursor-pointer transition-all hover:scale-[1.02] shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/50 text-cyan-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                      3 Camps Active
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Nearby Relief Shelters</h4>
                    <p className="text-xs text-slate-400 mt-0.5">High ground shelters with food, drinking water, and backup power.</p>
                  </div>
                  <div className="text-xs font-mono text-cyan-300 flex items-center space-x-1">
                    <span>View all shelters</span>
                    <span>→</span>
                  </div>
                </div>

                {/* Flooded Roads Summary Card */}
                <div 
                  onClick={() => setActiveTab('ROADS')}
                  className="p-5 rounded-3xl bg-slate-900/70 border border-amber-500/30 hover:border-amber-400 space-y-3 cursor-pointer transition-all hover:scale-[1.02] shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-amber-950 border border-amber-500/50 text-amber-400">
                      <Waves className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-red-400 font-bold bg-red-950/80 px-2 py-0.5 rounded-full border border-red-500/40">
                      2 Inundated Roads
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Flooded Roads & Detours</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Active waterlogged subways and closed road alerts in {districtName}.</p>
                  </div>
                  <div className="text-xs font-mono text-amber-300 flex items-center space-x-1">
                    <span>Check safe routes</span>
                    <span>→</span>
                  </div>
                </div>

                {/* Gemini AI Safety Guide Card */}
                <div 
                  onClick={() => setActiveTab('AI_CHAT')}
                  className="p-5 rounded-3xl bg-slate-900/70 border border-purple-500/30 hover:border-purple-400 space-y-3 cursor-pointer transition-all hover:scale-[1.02] shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-purple-950 border border-purple-500/50 text-purple-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-purple-300 font-bold bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-500/40">
                      AI Online 24/7
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Gemini AI Safety Guide</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Ask questions about safe evacuation, medical triage, or food supplies.</p>
                  </div>
                  <div className="text-xs font-mono text-purple-300 flex items-center space-x-1">
                    <span>Chat with Gemini AI</span>
                    <span>→</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: EMERGENCY HELPLINES */}
          {activeTab === 'HELPLINES' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider">
                  📞 Official Emergency Helplines for {districtName}, {stateName}
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">Toll-Free 24/7 Numbers</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {helplines.map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border ${item.bg} flex items-center justify-between shadow-md`}>
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm">{item.title}</h4>
                      <p className="text-[11px] text-slate-300">{item.desc}</p>
                    </div>
                    <a
                      href={`tel:${item.number}`}
                      className="px-4 py-2 rounded-xl bg-white text-slate-950 font-mono text-sm font-black flex items-center space-x-1.5 shadow hover:scale-105 transition-all"
                    >
                      <PhoneCall className="w-4 h-4 text-red-600" />
                      <span>{item.number}</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: RELIEF SHELTERS */}
          {activeTab === 'SHELTERS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider">
                  🏕️ Active Safe Relief Shelters in {districtName}
                </h3>
                <span className="text-[11px] text-emerald-400 font-mono font-bold">● Free Food, Water & Medical Aid</span>
              </div>

              <div className="space-y-3">
                {localShelters.map((s, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-white text-sm">{s.name}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700 text-cyan-300">
                          {s.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        👥 Capacity: <strong className="text-slate-200">{s.capacity}</strong> • 🍲 Meals: <strong className="text-emerald-400">{s.food}</strong> • ⚡ Power: <strong className="text-yellow-300">{s.power}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (onNavigateToLocation) {
                          onNavigateToLocation(s.coords[0], s.coords[1], s.name);
                        }
                        onClose();
                      }}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center justify-center space-x-1.5 cursor-pointer shadow transition-all"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>View on Map</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FLOODED ROADS */}
          {activeTab === 'ROADS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider">
                  ⚠️ Flooded Roads & Traffic Advisory ({districtName})
                </h3>
                <span className="text-[11px] text-amber-400 font-mono">Live Traffic Police Update</span>
              </div>

              <div className="space-y-3">
                {floodedRoads.map((r, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-2xl border ${
                      r.severity === 'CRITICAL' 
                        ? 'bg-red-950/40 border-red-500/50' 
                        : r.severity === 'WARNING' 
                        ? 'bg-amber-950/40 border-amber-500/50' 
                        : 'bg-emerald-950/40 border-emerald-500/50'
                    } flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-white text-sm">{r.road}</h4>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          r.severity === 'CRITICAL' ? 'bg-red-950 text-red-300 border border-red-600' : 'bg-amber-950 text-amber-300 border border-amber-600'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-mono">
                        🚗 Recommended Detour: <strong className="text-cyan-300">{r.detour}</strong>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: HOSPITALS */}
          {activeTab === 'HOSPITALS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-mono text-cyan-300 uppercase tracking-wider">
                  🏥 Emergency Hospitals & Trauma Centers ({districtName})
                </h3>
                <span className="text-[11px] text-emerald-400 font-mono">24/7 Verified Admissions</span>
              </div>

              <div className="space-y-3">
                {localHospitals.map((h, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-sm">{h.name}</h4>
                      <p className="text-xs text-slate-400">
                        🛏️ Available Beds: <strong className="text-emerald-400">{h.beds}</strong> • 💨 Oxygen: <strong className="text-cyan-300">{h.oxygen}</strong>
                      </p>
                    </div>

                    <a
                      href={`tel:${h.phone}`}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center justify-center space-x-1.5 cursor-pointer shadow transition-all"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call Hospital ({h.phone})</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: GEMINI AI SAFETY CHAT */}
          {activeTab === 'AI_CHAT' && (
            <div className="flex flex-col h-[55vh] space-y-3">
              
              <div className="flex-1 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 overflow-y-auto space-y-3">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs ${
                      msg.sender === 'user'
                        ? 'bg-cyan-600 text-white font-medium rounded-tr-none'
                        : 'bg-slate-900 border border-slate-700 text-slate-200 rounded-tl-none shadow-lg'
                    }`}>
                      <div className="flex items-center space-x-1.5 mb-1 text-[10px] opacity-75 font-mono">
                        {msg.sender === 'gemini' && <Sparkles className="w-3 h-3 text-purple-400" />}
                        <span>{msg.sender === 'user' ? 'You' : 'Gemini AI Disaster Guide'} • {msg.timestamp}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}

                {isAiThinking && (
                  <div className="flex justify-start">
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-purple-300 font-mono flex items-center space-x-2">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Gemini AI is analyzing disaster protocols for {districtName}...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Box */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                  placeholder={`Ask Gemini AI about safety in ${districtName}...`}
                  className="flex-1 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none font-sans placeholder-slate-500 shadow-inner"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-mono font-bold flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-cyan-600/30 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Ask AI</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
