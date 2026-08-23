import React, { useState } from 'react';
import { CityDigitalTwinState } from '../types/digital_twin';
import { AuthUser } from './LoginPage';
import { 
  Activity, Sparkles, Smartphone, ShieldCheck, 
  ShieldAlert, ArrowRight, Phone, MapPin, 
  CloudRain, Wind, Droplets, Lock, 
  CheckCircle2, AlertTriangle, Waves, MessageSquare, 
  Send, HelpCircle, Compass, ChevronRight, Zap
} from 'lucide-react';

interface PublicScrollingPortalProps {
  state: CityDigitalTwinState | null;
  authUser: AuthUser | null;
  onSwitchCity: (cityId: string) => void;
  onLaunchFullCockpit: () => void;
  onOpenGemini: () => void;
  onOpenSatelliteSAR?: () => void;
  onOpenDroneCCTV?: () => void;
  onOpenWeather: () => void;
  onOpenCitizenSOS: () => void;
  onOpenGPSLocationSOS?: () => void;
  onOpenWhatsApp?: () => void;
  onOpenGateways?: () => void;
  onLoginRequest: () => void;
  onLogout: () => void;
  onControlCommand?: (cmd: any) => void;
  onResolveLocation?: (query: string, lat?: number, lng?: number) => void;
}

export const PublicScrollingPortal: React.FC<PublicScrollingPortalProps> = ({
  state,
  authUser,
  onSwitchCity,
  onLaunchFullCockpit,
  onOpenGemini,
  onOpenWeather,
  onOpenCitizenSOS,
  onOpenGPSLocationSOS,
  onOpenWhatsApp,
  onLoginRequest,
  onLogout
}) => {
  const [heroPrompt, setHeroPrompt] = useState<string>('Where are the nearest safe high-ground relief shelters?');
  const [aiAnswers, setAiAnswers] = useState<Array<{ q: string; a: string }>>([
    {
      q: 'Where are the nearest safe high-ground relief shelters?',
      a: 'Active relief camps are set up at Municipal Stadiums, High-Ground Central Schools, and Zilla Parishad Halls. Tap the 1-Click SOS button to transmit your live GPS location for directed evacuation transport.'
    }
  ]);
  const [isAsking, setIsAsking] = useState(false);

  const cityName = state?.city_name || 'Mumbai Mithi Basin';
  const rain = state?.rain_intensity_mmhr || 0;
  const threat = state?.iap?.overall_threat_level || 'ELEVATED';

  const helplineDirectory = [
    { label: 'National Disaster Response (NDRF)', number: '1078', desc: 'Toll-free 24/7 emergency flood rescue & boat evacuation', color: 'from-orange-600 to-amber-600', icon: '🚤' },
    { label: 'Unified Emergency Services (Police / Fire / EMS)', number: '112', desc: 'All-India unified helpline for immediate first responders', color: 'from-red-600 to-rose-600', icon: '🚨' },
    { label: 'State Disaster Management Control (SDMA)', number: '1070', desc: 'State relief commissioner & emergency control room', color: 'from-blue-600 to-cyan-600', icon: '🏢' },
    { label: 'District Emergency Operations (DDMA)', number: '1077', desc: 'District magistrate control cell & local sandbagging units', color: 'from-purple-600 to-indigo-600', icon: '📍' },
    { label: 'Ambulance & Trauma Care Life Support', number: '108', desc: '24/7 Advanced life support & critical patient transport', color: 'from-emerald-600 to-teal-600', icon: '🚑' },
    { label: 'Women & Child Emergency Safety', number: '1090', desc: 'Dedicated civilian protection & vulnerable citizen support', color: 'from-pink-600 to-rose-600', icon: '🛡️' }
  ];

  const handleAskGemini = (customQ?: string) => {
    const query = customQ || heroPrompt;
    if (!query.trim()) return;
    
    setIsAsking(true);
    setTimeout(() => {
      let response = "Stay on high ground and avoid wading through moving water. Keep mobile phones charged and monitor official emergency broadcasts.";
      const qLower = query.toLowerCase();
      if (qLower.includes('shelter') || qLower.includes('camp')) {
        response = "High-ground relief shelters are active at Government Colleges, Indoor Stadiums, and Higher Secondary Schools. All facilities provide clean drinking water, dry rations, and medical first-aid.";
      } else if (qLower.includes('water') || qLower.includes('purif')) {
        response = "Boil all drinking water for at least 3 minutes or use chlorine water purification tablets (1 tablet per 5 liters). Never drink unfiltered tap or flood runoff water.";
      } else if (qLower.includes('road') || qLower.includes('blocked') || qLower.includes('underpass')) {
        response = "Subway underpasses and low-lying coastal arterial roads are currently closed due to water pooling. Follow green evacuation signage on elevated highways.";
      } else if (qLower.includes('phone') || qLower.includes('call') || qLower.includes('help')) {
        response = "Dial 112 for immediate first responders or 1078 for NDRF flood boat rescue. You can also tap the red SOS button on this page to transmit your live GPS location.";
      }

      setAiAnswers(prev => [{ q: query, a: response }, ...prev.slice(0, 4)]);
      setIsAsking(false);
    }, 600);
  };

  return (
    <div className="w-full min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* 1. PUBLIC TOP NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-[#060a14]/95 backdrop-blur-xl border-b border-cyan-500/30 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/90 border border-cyan-400/50 text-cyan-400 shadow-[0_0_15px_rgba(0,210,255,0.3)]">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-base font-black tracking-wider bg-gradient-to-r from-orange-400 via-white to-emerald-400 bg-clip-text text-transparent">
                CIVICTWIN AI
              </span>
              <span className="hidden sm:inline-block ml-2 text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-600 font-bold">
                PUBLIC SAFETY PORTAL
              </span>
            </div>
          </div>
        </div>

        {/* Center Navigation Links */}
        <div className="hidden md:flex items-center space-x-6 text-xs font-mono font-bold text-slate-300">
          <a href="#weather" className="hover:text-cyan-400 transition-colors">Live Weather & Safety</a>
          <a href="#gemini" className="hover:text-blue-400 transition-colors">Gemini Safety AI</a>
          <a href="#helplines" className="hover:text-emerald-400 transition-colors">24/7 Helplines</a>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenGPSLocationSOS || onOpenCitizenSOS}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(244,63,94,0.4)] flex items-center space-x-1.5 cursor-pointer animate-pulse"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>🚨 1-Click SOS</span>
          </button>

          {authUser ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={onLaunchFullCockpit}
                className="px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-500 text-cyan-300 text-xs font-mono font-bold hover:bg-cyan-900 transition-all cursor-pointer flex items-center space-x-1"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Enter Cockpit</span>
              </button>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 text-xs font-mono transition-all"
                title={`Logged in as ${authUser.name} - Click to Logout`}
              >
                <Lock className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginRequest}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-200 font-mono text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Officer Login</span>
            </button>
          )}
        </div>
      </nav>

      {/* 2. HERO & LIVE DISASTER CONDITION HERO */}
      <section className="relative pt-10 pb-12 px-4 lg:px-8 max-w-5xl mx-auto space-y-6">
        
        {/* Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-gradient-to-tr from-cyan-500/15 via-blue-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        {/* Top Government Tag */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 text-center">
          <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-cyan-950/90 border border-cyan-500/60 text-cyan-300 font-mono text-xs font-bold shadow-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>GOVERNMENT OF INDIA • CIVIL DEFENSE PUBLIC PORTAL</span>
          </span>
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs font-bold">
            <span>NDMA Safety Protocol</span>
          </span>
        </div>

        {/* Main Title */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Live Public Disaster Safety &{' '}
            <span className="bg-gradient-to-r from-orange-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              Emergency Assistance Hub
            </span>
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
            Real-time flood alerts, emergency GPS evacuation triggers, 24/7 disaster helplines, and Google Gemini AI public safety advice.
          </p>
        </div>

        {/* 1-CLICK EMERGENCY GPS SOS TRIGGER */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-red-950 via-rose-950/90 to-red-950 border-2 border-rose-500/80 shadow-[0_0_50px_rgba(244,63,94,0.3)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/50">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-black text-white uppercase tracking-wider">
                  Citizen Emergency GPS SOS Trigger
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-900 border border-red-500 text-red-200 font-bold">
                  ● 1-CLICK RESCUE
                </span>
              </div>
              <p className="text-xs text-rose-200/90 font-sans mt-0.5">
                Facing rising flood water or medical emergency? Tap to instantly transmit your live GPS coordinates to NDRF & 108 EMS.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenGPSLocationSOS || onOpenCitizenSOS}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs font-black uppercase tracking-wider shadow-xl shadow-red-600/50 flex items-center justify-center space-x-2 shrink-0 transition-all cursor-pointer transform hover:scale-105"
          >
            <MapPin className="w-4 h-4 animate-bounce" />
            <span>🚨 SEND LIVE GPS SOS BEACON</span>
          </button>
        </div>

        {/* LIVE WEATHER & DISASTER CONDITION CARD */}
        <div id="weather" className="p-5 rounded-3xl bg-slate-950/90 border border-cyan-500/30 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <CloudRain className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">
                Live IMD Weather & Flood Threat Condition
              </span>
            </div>
            <button
              onClick={onOpenWeather}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
            >
              <span>View 7-Day Forecast & Tide Matrix</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
              <div className="text-slate-500 text-[10px]">Active Region</div>
              <div className="text-white font-bold mt-0.5 truncate">{cityName}</div>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
              <div className="text-slate-500 text-[10px]">Precipitation Rate</div>
              <div className="text-cyan-300 font-black text-sm mt-0.5">{rain.toFixed(1)} mm/h</div>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
              <div className="text-slate-500 text-[10px]">Overall Threat Level</div>
              <div className="text-amber-400 font-bold mt-0.5">{threat}</div>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
              <div className="text-slate-500 text-[10px]">High-Ground Shelters</div>
              <div className="text-emerald-400 font-bold mt-0.5">Active & Open</div>
            </div>
          </div>
        </div>

      </section>

      {/* 3. GOOGLE GEMINI AI PUBLIC SAFETY ADVISOR */}
      <section id="gemini" className="py-8 px-4 lg:px-8 max-w-5xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-950 border border-blue-500/50 text-blue-300">
              <Sparkles className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <span>Google Gemini AI Public Disaster Advisor</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 border border-blue-500 text-blue-300 font-mono font-bold">
                  24/7 AI SAFETY
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Ask any question regarding flood safety, drinking water, first-aid, and nearest relief camps.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenGemini}
            className="hidden sm:flex px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold items-center space-x-1.5 transition-all shadow-md cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Voice Assistant</span>
          </button>
        </div>

        {/* Conversational Prompt Box */}
        <div className="p-5 rounded-3xl bg-slate-950/90 border border-blue-500/30 space-y-4 shadow-xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={heroPrompt}
              onChange={(e) => setHeroPrompt(e.target.value)}
              placeholder="Ask a safety question (e.g. How to purify water during flood?)"
              className="flex-1 bg-slate-900 border border-slate-700 focus:border-blue-400 rounded-xl p-3 text-xs font-mono text-white focus:outline-none placeholder-slate-500"
            />
            <button
              onClick={() => handleAskGemini()}
              disabled={isAsking}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shrink-0 shadow"
            >
              <span>{isAsking ? 'Thinking...' : 'Ask AI'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Question Pills */}
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <button 
              onClick={() => { setHeroPrompt('Where are the nearest safe high-ground relief shelters?'); handleAskGemini('Where are the nearest safe high-ground relief shelters?'); }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
            >
              🧭 Nearest Relief Shelters?
            </button>
            <button 
              onClick={() => { setHeroPrompt('How do I purify drinking water during a flood?'); handleAskGemini('How do I purify drinking water during a flood?'); }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
            >
              💧 Drinking Water Safety?
            </button>
            <button 
              onClick={() => { setHeroPrompt('What emergency items should I pack in a flood kit?'); handleAskGemini('What emergency items should I pack in a flood kit?'); }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
            >
              🎒 Emergency Go-Bag Checklist?
            </button>
          </div>

          {/* Render Latest AI Advice Stream */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            {aiAnswers.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-500/30 space-y-1 text-xs">
                <div className="font-bold text-cyan-300 font-mono flex items-center space-x-1.5">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Q: {item.q}</span>
                </div>
                <div className="text-slate-200 font-sans leading-relaxed pl-4">
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 24/7 CITIZEN EMERGENCY HELPLINES DIRECTORY */}
      <section id="helplines" className="py-10 px-4 lg:px-8 max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300">
              <Phone className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                24/7 National & State Emergency Helplines
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Toll-free emergency numbers for instant rescue, ambulance, and disaster assistance.
              </p>
            </div>
          </div>

          {onOpenWhatsApp && (
            <button
              onClick={onOpenWhatsApp}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-lg flex items-center space-x-1.5 cursor-pointer w-fit"
            >
              <MessageSquare className="w-4 h-4" />
              <span>💬 Test WhatsApp Safety Bot</span>
            </button>
          )}
        </div>

        {/* Helplines Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {helplineDirectory.map((h, idx) => (
            <a
              key={idx}
              href={`tel:${h.number}`}
              className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/70 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 flex items-center space-x-1.5">
                  <span>{h.icon}</span>
                  <span>{h.label}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-sans mt-0.5">{h.desc}</div>
              </div>
              <div className={`px-3.5 py-2 rounded-xl bg-gradient-to-r ${h.color} text-white font-mono font-black text-sm shadow-md shrink-0 ml-2`}>
                {h.number}
              </div>
            </a>
          ))}
        </div>

        {/* Officer Login Notice Box */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Disaster Management Officers (NDMA / SDMA / DDMA): Please login to access full digital twin tools & district synthesis.</span>
          </div>
          <button
            onClick={onLoginRequest}
            className="px-4 py-1.5 rounded-xl bg-cyan-950 border border-cyan-500/60 text-cyan-300 hover:bg-cyan-900 font-bold transition-all shrink-0 cursor-pointer"
          >
            Officer Login ➔
          </button>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="border-t border-slate-800 bg-[#02040a] py-8 px-4 lg:px-8 text-xs font-mono text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>CIVICTWIN AI • NATIONAL CIVIL DEFENSE PUBLIC SAFETY NETWORK</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            Compliant with NDMA CAP Protocol & ISRO/IMD Standards
          </div>
        </div>
      </footer>

    </div>
  );
};
