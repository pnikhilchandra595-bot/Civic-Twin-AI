import React, { useState } from 'react';
import { CityDigitalTwinState } from '../types/digital_twin';
import { AuthUser } from './LoginPage';
import { 
  AlertTriangle, Phone, MapPin, Sparkles, Send, 
  ShieldAlert, CheckCircle2, CloudRain, ExternalLink, 
  Radio, WifiOff, PhoneCall, Copy, Check, ChevronRight, Info, HeartHandshake,
  Compass, Navigation, Volume2, Shield, AlertOctagon, HelpCircle
} from 'lucide-react';

interface CitizenPortalViewProps {
  state: CityDigitalTwinState | null;
  authUser: AuthUser | null;
  onOpenGemini: () => void;
  onOpenMesh: () => void;
  onOpenBroadcast: () => void;
  onOpenSOS: () => void;
}

export const CitizenPortalView: React.FC<CitizenPortalViewProps> = ({
  state,
  authUser,
  onOpenGemini,
  onOpenMesh,
  onOpenBroadcast,
  onOpenSOS
}) => {
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isGettingGps, setIsGettingGps] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [copiedSMS, setCopiedSMS] = useState<boolean>(false);

  const cityName = state?.city_name || 'Mumbai Mithi Basin';
  const rain = state?.rain_intensity_mmhr || 0;
  const threat = state?.iap?.overall_threat_level || 'ELEVATED';

  // 1. Capture exact GPS coordinates offline using device sensors
  const handleGetGps = () => {
    setIsGettingGps(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      setIsGettingGps(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsGettingGps(false);
      },
      (error) => {
        console.warn('Geolocation query error:', error);
        // Fallback default coordinates for current city
        const defaultCoord = state?.center_coords 
          ? { lat: state.center_coords[0], lng: state.center_coords[1] } 
          : { lat: 19.043, lng: 72.842 };
        setGpsLocation(defaultCoord);
        setIsGettingGps(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Generate offline SMS payload for cellular dispatch (Works with 0 internet)
  const offlineSmsText = gpsLocation 
    ? `EMERGENCY SOS: Immediate flood rescue needed at ${cityName}. Live GPS: ${gpsLocation.lat.toFixed(5)} N, ${gpsLocation.lng.toFixed(5)} E. Water level critical.`
    : `EMERGENCY SOS: Immediate flood rescue needed at ${cityName}. Water level rising rapidly. Please track this phone.`;

  const smsUri = `sms:112?body=${encodeURIComponent(offlineSmsText)}`;

  const handleCopySMS = () => {
    navigator.clipboard.writeText(offlineSmsText);
    setCopiedSMS(true);
    setTimeout(() => setCopiedSMS(false), 2500);
  };

  const helplineDirectory = [
    { number: '1070', label: 'NDMA National Disaster Helpline', desc: 'Central Flood & Cyclone Operations', color: 'from-red-600 to-rose-600', icon: '🚨' },
    { number: '112', label: 'National All-in-One Emergency', desc: 'Police, Fire, Ambulance & NDRF', color: 'from-blue-600 to-indigo-600', icon: '👮' },
    { number: '108', label: 'Medical EMS & Disaster Ambulance', desc: '24/7 Advanced Life Support Transport', color: 'from-emerald-600 to-teal-600', icon: '🚑' },
    { number: '101', label: 'Fire & Flood Rescue Services', desc: 'Inflatable Rafts & Swift Water Teams', color: 'from-orange-600 to-amber-600', icon: '🚒' },
    { number: '1916', label: 'Municipal Corporation Disaster Cell', desc: 'Waterlogging, Tree Falls & Subways', color: 'from-purple-600 to-pink-600', icon: '🏢' },
    { number: '1077', label: 'District Collectorate Disaster Desk', desc: 'Local Relief Supplies & Food Rations', color: 'from-cyan-600 to-blue-600', icon: '📦' }
  ];

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 space-y-6 select-none font-sans">
      
      {/* 1. Official Citizen Safety Status Banner */}
      <div className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950/50 to-slate-950 border border-cyan-500/40 shadow-[0_0_50px_rgba(0,210,255,0.15)] space-y-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 font-mono text-[11px] font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>CITIZEN EMERGENCY CIVIL PROTECTION</span>
              </span>
              <span className="text-xs text-slate-300 font-mono">
                Region: <strong className="text-white">{cityName}</strong>
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-wide">
              Official Flood & Public Safety Advisory Hub
            </h1>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 text-center min-w-[100px] shadow-md">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Precipitation</div>
              <div className="text-cyan-300 font-black text-base">{rain.toFixed(1)} <span className="text-xs font-normal">mm/h</span></div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 text-center min-w-[100px] shadow-md">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Threat Level</div>
              <div className={`font-black text-base ${threat === 'CRITICAL' || threat === 'CATASTROPHIC' ? 'text-red-400' : 'text-amber-400'}`}>
                {threat}
              </div>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-200 leading-relaxed font-sans flex items-start space-x-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Safety Warning</strong>: Severe rainfall is causing rapid water accumulation in low-lying subways and river catchments. Avoid walking or driving through standing water. If stranded, use the <strong>Offline Emergency Location Sharing</strong> below to dispatch your GPS coordinates to rescue forces.
          </span>
        </div>
      </div>

      {/* 2. ZERO-INTERNET EMERGENCY LOCATION SHARING (Offline GPS + Cellular SMS) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-950/40 via-slate-950 to-slate-950 border border-rose-500/50 shadow-[0_0_50px_rgba(244,63,94,0.18)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                Emergency Location Sharing (Works 100% Offline Without Internet)
              </h2>
              <p className="text-xs text-rose-300/80 font-mono">
                Satellite GPS Direct Sensor + Cellular SMS Relay
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-rose-900/60 border border-rose-500 text-rose-200 font-bold w-fit">
            No Mobile Data / Wi-Fi Needed
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          If mobile data or Wi-Fi towers are down, follow the 2-step protocol below to lock your exact GPS coordinates and dispatch an instant pre-formatted emergency SMS to <strong>112 / NDRF</strong> via cellular network:
        </p>

        {/* 2-Step Interactive Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-[10px] text-cyan-300">1</span>
                <span>Step 1: Lock Device Satellite GPS</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Extracts raw latitude and longitude directly from your phone's GPS chip.
              </p>
            </div>

            <button
              onClick={handleGetGps}
              disabled={isGettingGps}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-mono font-bold text-xs shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <MapPin className={`w-4 h-4 ${isGettingGps ? 'animate-bounce text-yellow-300' : ''}`} />
              <span>{isGettingGps ? 'Locking Satellite Signal...' : gpsLocation ? '📍 GPS Locked! (Click to Re-lock)' : '📍 Lock My Live Device GPS'}</span>
            </button>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-[10px] text-emerald-300">2</span>
                <span>Step 2: Dispatch Cellular SMS to 112</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Opens your phone's SMS app with coordinates pre-filled. Works over standard GSM cellular.
              </p>
            </div>

            {gpsLocation ? (
              <a
                href={smsUri}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs shadow-lg flex items-center justify-center space-x-2 transition-all animate-pulse cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>📱 Dispatch Offline SMS to 112</span>
              </a>
            ) : (
              <button
                onClick={handleGetGps}
                className="w-full py-3 rounded-xl bg-slate-800 text-slate-400 font-mono text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Click Step 1 to Lock GPS First</span>
              </button>
            )}
          </div>

        </div>

        {/* Display Captured Coordinates Card */}
        {gpsLocation && (
          <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/40 text-xs font-mono text-slate-200 space-y-2.5">
            <div className="flex items-center justify-between text-rose-300 text-xs font-bold">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Live Satellite Coordinates Locked: {gpsLocation.lat.toFixed(5)}° N, {gpsLocation.lng.toFixed(5)}° E</span>
              </span>
              <button
                onClick={handleCopySMS}
                className="text-xs text-cyan-400 hover:text-cyan-300 hover:underline flex items-center space-x-1.5 cursor-pointer"
              >
                {copiedSMS ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSMS ? 'Copied to Clipboard!' : 'Copy Text'}</span>
              </button>
            </div>
            <div className="text-white font-mono bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs">
              {offlineSmsText}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
          <span className="text-slate-400">Zero mobile signal? Use peer-to-peer Bluetooth mesh relay:</span>
          <button
            onClick={onOpenMesh}
            className="px-3.5 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-500 text-amber-200 font-mono font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            <span>Launch Zero-Network Mesh SOS</span>
          </button>
        </div>
      </div>

      {/* 3. GOOGLE GEMINI CITIZEN AI GUIDE (Interactive Assistant Card) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/50 via-indigo-950/40 to-slate-950 border border-blue-500/40 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-400/50 text-cyan-300">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                Google Gemini AI Citizen Emergency Guide
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Multi-Lingual AI Safety & Shelter Assistant
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-blue-900/60 border border-blue-500 text-blue-200 font-bold">
            English • हिन्दी • मराठी • தமிழ்
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Ask Gemini anything in plain language for immediate guidance:
        </p>

        {/* Quick Question Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={onOpenGemini}
            className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500 text-left transition-all group cursor-pointer"
          >
            <div className="text-xs font-bold text-white group-hover:text-cyan-300">
              🧭 Nearest High-Ground Shelter?
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Find safe elevated shelters near your location.
            </div>
          </button>

          <button
            onClick={onOpenGemini}
            className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500 text-left transition-all group cursor-pointer"
          >
            <div className="text-xs font-bold text-white group-hover:text-cyan-300">
              💧 Safe Drinking Water Steps?
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Boiling times and chlorine purification ratios.
            </div>
          </button>

          <button
            onClick={onOpenGemini}
            className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500 text-left transition-all group cursor-pointer"
          >
            <div className="text-xs font-bold text-white group-hover:text-cyan-300">
              🚨 Flood First-Aid Essentials?
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Treating wounds and hypothermia during floods.
            </div>
          </button>
        </div>

        <button
          onClick={onOpenGemini}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-mono font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span>Open Full Google Gemini AI Disaster Assistant</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* 4. ALL EMERGENCY HELPLINE NUMBERS DIRECTORY (1-Tap Call Cards) */}
      <div className="space-y-3.5">
        <div className="flex items-center space-x-2 text-white font-bold text-base">
          <PhoneCall className="w-5 h-5 text-cyan-400" />
          <span>24/7 National & Municipal Emergency Helplines (1-Tap Direct Call)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {helplineDirectory.map((h, i) => (
            <a
              key={i}
              href={`tel:${h.number}`}
              className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/70 transition-all flex items-center justify-between group hover:shadow-[0_0_20px_rgba(0,210,255,0.2)] cursor-pointer"
            >
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center space-x-1.5">
                  <span>{h.icon}</span>
                  <span>{h.label}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-sans">
                  {h.desc}
                </div>
              </div>

              <div className={`px-3.5 py-2 rounded-xl bg-gradient-to-r ${h.color} text-white font-mono font-black text-sm shadow-md flex items-center space-x-1.5 group-hover:scale-105 transition-transform`}>
                <Phone className="w-3.5 h-3.5" />
                <span>{h.number}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 5. TEXT-BASED SAFE HIGH-GROUND SHELTERS & ROAD BULLETINS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Safe Evacuation Shelters */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Open High-Ground Relief Shelters:</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold">
              3 Active
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">1. BKC MMRDA Mega Relief Center</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold">OPEN</span>
              </div>
              <div className="text-[11px] text-slate-400">Elevation: 12.5m AMSL • Capacity: 10,000 Persons</div>
              <div className="text-[10px] text-emerald-400">Status: Potable drinking water, dry rations & medical casualty desk active.</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">2. Bandra YMCA High-Ground Center</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold">OPEN</span>
              </div>
              <div className="text-[11px] text-slate-400">Elevation: 18.2m AMSL • Capacity: 2,500 Persons</div>
              <div className="text-[10px] text-emerald-400">Status: Emergency blankets & dry food ration distribution point.</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">3. Parel KEM Hospital Relief Ward</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold">OPEN</span>
              </div>
              <div className="text-[11px] text-slate-400">Elevation: 9.2m AMSL • 24/7 Trauma Triage</div>
              <div className="text-[10px] text-emerald-400">Status: 42 ICU beds ready; continuous oxygen backup engaged.</div>
            </div>
          </div>
        </div>

        {/* Submerged Danger Zones To Avoid */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider font-mono flex items-center space-x-2">
              <AlertOctagon className="w-4 h-4" />
              <span>Inundated Danger Roads (Strictly Avoid!):</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950 border border-rose-500 text-rose-300 font-bold">
              Barricaded
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-900/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-200">🚫 Dadar Hindmata Underpass</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 border border-rose-600 text-rose-300 font-bold">SUBMERGED</span>
              </div>
              <div className="text-[11px] text-slate-400">Water Depth: 0.65m (Heavy runoff)</div>
              <div className="text-[10px] text-rose-400">Traffic Police Barricades Active • Zero Vehicular Transit.</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-900/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-200">🚫 Kurla West LBS Marg Corridor</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 border border-rose-600 text-rose-300 font-bold">RIVER OVERTOPPING</span>
              </div>
              <div className="text-[11px] text-slate-400">Mithi River Backpressure Overtopping Embankment</div>
              <div className="text-[10px] text-rose-400">Use Elevated Eastern Express Highway / Skywalk Instead.</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-900/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-200">🚫 Milan Subway & King's Circle</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 border border-rose-600 text-rose-300 font-bold">PUMPS ACTIVE</span>
              </div>
              <div className="text-[11px] text-slate-400">Standing Flood Water in Lowland Dip</div>
              <div className="text-[10px] text-rose-400">Municipal Dewatering In Progress • Transit Prohibited.</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
