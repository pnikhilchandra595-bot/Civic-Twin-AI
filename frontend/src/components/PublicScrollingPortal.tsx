import React, { useState } from 'react';
import { CityDigitalTwinState, InfrastructureNode, SensorReading } from '../types/digital_twin';
import { AuthUser } from './LoginPage';
import { DigitalTwinMap } from './DigitalTwinMap';
import { ScenarioSandbox } from './ScenarioSandbox';
import { SensorTelemetryPanel } from './SensorTelemetryPanel';
import { IncidentCommanderPanel } from './IncidentCommanderPanel';
import { 
  Activity, Globe, Satellite, Video, Sparkles, Smartphone, 
  ShieldCheck, ShieldAlert, ArrowRight, Phone, MapPin, 
  CloudRain, Wind, Droplets, Gauge, Key, Lock, Building2, 
  CheckCircle2, AlertTriangle, Eye, Compass, Waves, FileText, 
  Radio, Play, Pause, ChevronRight, Zap, RefreshCw, ExternalLink,
  ChevronDown, Layers, Terminal, MessageSquare
} from 'lucide-react';

interface PublicScrollingPortalProps {
  state: CityDigitalTwinState | null;
  authUser: AuthUser | null;
  onSwitchCity: (cityId: string) => void;
  onLaunchFullCockpit: () => void;
  onOpenGemini: () => void;
  onOpenSatelliteSAR: () => void;
  onOpenDroneCCTV: () => void;
  onOpenWeather: () => void;
  onOpenCitizenSOS: () => void;
  onOpenGPSLocationSOS?: () => void;
  onOpenWhatsApp?: () => void;
  onOpenGateways: () => void;
  onLoginRequest: () => void;
  onLogout: () => void;
  onControlCommand: (cmd: any) => void;
}

export const PublicScrollingPortal: React.FC<PublicScrollingPortalProps> = ({
  state,
  authUser,
  onSwitchCity,
  onLaunchFullCockpit,
  onOpenGemini,
  onOpenSatelliteSAR,
  onOpenDroneCCTV,
  onOpenWeather,
  onOpenCitizenSOS,
  onOpenGPSLocationSOS,
  onOpenWhatsApp,
  onOpenGateways,
  onLoginRequest,
  onLogout,
  onControlCommand
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string>(state?.city_id || 'mumbai_monsoon');
  const [heroPrompt, setHeroPrompt] = useState<string>('What is the current flood status and safest evacuation route?');
  const [visionMode, setVisionMode] = useState<'RGB' | 'THERMAL_FLIR' | 'NIGHT_VISION'>('RGB');

  const cityName = state?.city_name || 'Mumbai Mithi Basin';
  const rain = state?.rain_intensity_mmhr || 0;
  const threat = state?.iap?.overall_threat_level || 'ELEVATED';

  const allCities = [
    { id: 'mumbai_monsoon', name: 'Mumbai (MH)', state: 'Maharashtra', region: 'Mithi Basin' },
    { id: 'delhi_yamuna', name: 'Delhi NCR', state: 'Delhi NCR', region: 'Yamuna Floodplain' },
    { id: 'bengaluru_lakes', name: 'Bengaluru (KA)', state: 'Karnataka', region: 'Lake Corridor' },
    { id: 'chennai_cyclone', name: 'Chennai (TN)', state: 'Tamil Nadu', region: 'Coastal Surge' },
    { id: 'kolkata_hooghly', name: 'Kolkata (WB)', state: 'West Bengal', region: 'Hooghly Surge' },
    { id: 'kerala_periyar', name: 'Kochi (KL)', state: 'Kerala', region: 'Periyar Dam' },
    { id: 'gujarat_tapi', name: 'Surat (GJ)', state: 'Gujarat', region: 'Tapi Basin' },
    { id: 'assam_brahmaputra', name: 'Guwahati (AS)', state: 'Assam', region: 'Brahmaputra' },
    { id: 'odisha_mahanadi', name: 'Bhubaneswar (OD)', state: 'Odisha', region: 'Mahanadi Basin' },
    { id: 'uttar_pradesh_ganga', name: 'Varanasi (UP)', state: 'Uttar Pradesh', region: 'Ganga Basin' },
    { id: 'bihar_kosi', name: 'Patna (BR)', state: 'Bihar', region: 'Kosi Catchment' },
    { id: 'uttarakhand_cloudburst', name: 'Rishikesh (UK)', state: 'Uttarakhand', region: 'Himalayan Surge' },
    { id: 'himachal_beas', name: 'Kullu (HP)', state: 'Himachal', region: 'Beas Torrent' },
    { id: 'punjab_sutlej', name: 'Ludhiana (PB)', state: 'Punjab', region: 'Sutlej Basin' },
    { id: 'andhra_krishna', name: 'Vijayawada (AP)', state: 'Andhra Pradesh', region: 'Krishna Delta' },
    { id: 'telangana_musi', name: 'Hyderabad (TS)', state: 'Telangana', region: 'Musi Basin' },
    { id: 'rajasthan_luni', name: 'Jodhpur (RJ)', state: 'Rajasthan', region: 'Luni Flash' },
    { id: 'madhya_pradesh_narmada', name: 'Jabalpur (MP)', state: 'Madhya Pradesh', region: 'Narmada Gorge' },
    { id: 'jammu_jhelum', name: 'Srinagar (JK)', state: 'Jammu & Kashmir', region: 'Jhelum Valley' },
    { id: 'goa_mandovi', name: 'Panaji (GA)', state: 'Goa', region: 'Mandovi Estuary' },
    { id: 'sikkim_teesta', name: 'Gangtok (SK)', state: 'Sikkim', region: 'Teesta GLOF' },
    { id: 'tripura_howrah', name: 'Agartala (TR)', state: 'Tripura', region: 'Howrah River' },
    { id: 'meghalaya_cherrapunji', name: 'Shillong (ML)', state: 'Meghalaya', region: 'Khasi Cloudburst' },
    { id: 'manipur_imphal', name: 'Imphal (MN)', state: 'Manipur', region: 'Loktak Lake' },
    { id: 'jharkhand_subarnarekha', name: 'Ranchi (JH)', state: 'Jharkhand', region: 'Subarnarekha Dam' },
    { id: 'chhattisgarh_mahanadi', name: 'Raipur (CG)', state: 'Chhattisgarh', region: 'Hasdeo Bango' },
    { id: 'haryana_gurugram', name: 'Gurugram (HR)', state: 'Haryana', region: 'Najafgarh Drain' },
    { id: 'andaman_portblair', name: 'Port Blair (AN)', state: 'Andaman & Nicobar', region: 'Island Coast' },
    { id: 'ladakh_indus', name: 'Leh (LA)', state: 'Ladakh', region: 'Indus Glacial' }
  ];

  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    onSwitchCity(cityId);
  };

  const helplineDirectory = [
    { number: '1070', label: 'NDMA National Disaster Helpline', desc: 'Central Flood & Cyclone Operations', color: 'from-red-600 to-rose-600', icon: '🚨' },
    { number: '112', label: 'National All-in-One Emergency', desc: 'Police, Fire, Ambulance & NDRF', color: 'from-blue-600 to-indigo-600', icon: '👮' },
    { number: '108', label: 'Medical EMS & Disaster Ambulance', desc: '24/7 Advanced Life Support Transport', color: 'from-emerald-600 to-teal-600', icon: '🚑' },
    { number: '101', label: 'Fire & Flood Rescue Services', desc: 'Inflatable Rafts & Swift Water Teams', color: 'from-orange-600 to-amber-600', icon: '🚒' },
    { number: '1916', label: 'Municipal Corporation Disaster Cell', desc: 'Waterlogging, Tree Falls & Subways', color: 'from-purple-600 to-pink-600', icon: '🏢' },
    { number: '1077', label: 'District Disaster Management Cell', desc: 'Local Collectorate Relief Supplies', color: 'from-cyan-600 to-blue-600', icon: '📦' }
  ];

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden scroll-smooth">
      
      {/* 1. STICKY GLASS HEADER NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-[#060a14]/90 backdrop-blur-xl border-b border-cyan-500/30 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center space-x-3">
          <a href="#hero" className="flex items-center space-x-2.5 group">
            <div className="p-1.5 rounded-xl bg-cyan-950/90 border border-cyan-400/50 text-cyan-400 shadow-[0_0_15px_rgba(0,210,255,0.3)]">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-base font-black tracking-wider bg-gradient-to-r from-orange-400 via-white to-emerald-400 bg-clip-text text-transparent">
                CIVICTWIN AI
              </span>
              <span className="hidden sm:inline-block ml-2 text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-600">
                INDIA DIGITAL TWIN
              </span>
            </div>
          </a>
        </div>

        {/* Center Page Section Links */}
        <div className="hidden xl:flex items-center space-x-6 text-xs font-mono font-bold text-slate-300">
          <a href="#hero" className="hover:text-cyan-400 transition-colors">Overview</a>
          <a href="#cockpit" className="hover:text-cyan-400 transition-colors">Digital Twin</a>
          <a href="#satellite" className="hover:text-cyan-400 transition-colors">Satellite SAR</a>
          <a href="#surveillance" className="hover:text-cyan-400 transition-colors">CCTV / Drones</a>
          <a href="#gemini" className="hover:text-cyan-400 transition-colors">Gemini AI</a>
          <a href="#citizen" className="hover:text-cyan-400 transition-colors">Citizen SOS</a>
          <a href="#gateways" className="hover:text-cyan-400 transition-colors">Gateways</a>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onLaunchFullCockpit}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500 text-cyan-200 font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,210,255,0.2)] flex items-center space-x-1.5 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Full-Screen Twin</span>
          </button>

          <button
            onClick={onOpenGemini}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono text-xs font-extrabold transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center space-x-1.5 cursor-pointer animate-pulse"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>Gemini AI</span>
          </button>

          {authUser ? (
            <button
              onClick={onLogout}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 text-xs font-mono transition-all"
              title={`Logged in as ${authUser.name} (${authUser.role}) - Click to Logout`}
            >
              <Lock className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onLoginRequest}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs font-bold transition-all cursor-pointer"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* 2. SECTION 1: HERO SHOWCASE & LIVE TELEMETRY TICKER */}
      <section id="hero" className="relative pt-12 pb-20 px-4 lg:px-8 max-w-7xl mx-auto space-y-8">
        
        {/* Background Glow Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-cyan-500/15 via-blue-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 text-center">
          <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-cyan-950/90 border border-cyan-500/60 text-cyan-300 font-mono text-xs font-bold shadow-lg shadow-cyan-950">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>GOVERNMENT OF INDIA • CIVIL DEFENSE DIGITAL TWIN</span>
          </span>
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs">
            <span>NDMA CAP Protocol</span>
          </span>
        </div>

        {/* Main Hero Headline */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Autonomous Urban Disaster Simulation &{' '}
            <span className="bg-gradient-to-r from-orange-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              Live Satellite Response Twin
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Real-time multi-hazard digital twin modeling urban hydrology, flood surge, infrastructure cascades, offline citizen GPS rescues, and Google Gemini AI incident command across 20 Indian disaster corridors.
          </p>
        </div>

        {/* PUBLIC EMERGENCY 1-CLICK GPS SOS BANNER */}
        <div className="max-w-5xl mx-auto p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-red-950 via-rose-950/80 to-red-950 border-2 border-rose-500/80 shadow-[0_0_50px_rgba(244,63,94,0.35)] flex flex-col sm:flex-row items-center justify-between gap-4">
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
                Stranded or facing rising flood water? Click to instantly transmit your live device GPS coordinates to NDRF & 108 EMS.
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

        {/* LIVE IMD WEATHER & FLOOD HAZARD BAR */}
        <div className="max-w-5xl mx-auto p-4 rounded-3xl bg-slate-950/90 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4 text-xs font-mono shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/50 text-cyan-300">
              <CloudRain className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">
                Live IMD Rainfall: <span className="text-cyan-300">{rain.toFixed(1)} mm/h</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Region: <strong className="text-slate-200">{cityName}</strong> • Threat Level: <span className="text-amber-400 font-bold">{threat}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenWeather}
              className="px-4 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-300 text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <span>🌤️ View 7-Day IMD Forecast & Tide Matrix</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 20-State Quick Selector Pills */}
        <div className="p-4 rounded-3xl bg-slate-950/80 border border-slate-800 max-w-5xl mx-auto space-y-2.5 shadow-2xl">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400">
            <span className="flex items-center space-x-1.5 text-cyan-400">
              <Globe className="w-3.5 h-3.5" />
              <span>Select Live Disaster Corridor (20 States Available):</span>
            </span>
            <span className="text-slate-500">Active: <strong className="text-white">{cityName}</strong></span>
          </div>

          <div className="flex flex-wrap gap-2">
            {allCities.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCityChange(c.id)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  selectedCityId === c.id
                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <span>{c.name}</span>
                <span className="text-[10px] opacity-70">({c.region})</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3 Core Quick Call-to-Action Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto pt-4">
          
          <div 
            onClick={onLaunchFullCockpit}
            className="p-6 rounded-3xl bg-gradient-to-br from-cyan-950/50 via-slate-950 to-slate-950 border border-cyan-500/40 hover:border-cyan-400 transition-all shadow-xl group cursor-pointer"
          >
            <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 w-fit mb-4 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
              <span>Interactive Digital Twin</span>
              <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              2D GIS Map & 3D Topographic Bathymetry with live flood inundation, road closures, and sensor gauges.
            </p>
          </div>

          <div 
            onClick={onOpenGemini}
            className="p-6 rounded-3xl bg-gradient-to-br from-blue-950/50 via-slate-950 to-slate-950 border border-blue-500/40 hover:border-blue-400 transition-all shadow-xl group cursor-pointer"
          >
            <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-400/40 text-blue-300 w-fit mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-white group-hover:text-blue-300 transition-colors flex items-center justify-between">
              <span>Google Gemini AI Commander</span>
              <ChevronRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Real-time natural language disaster assistant with live telemetry reasoning and multi-lingual voice synthesis.
            </p>
          </div>

          <div 
            onClick={onOpenCitizenSOS}
            className="p-6 rounded-3xl bg-gradient-to-br from-rose-950/50 via-slate-950 to-slate-950 border border-rose-500/40 hover:border-rose-400 transition-all shadow-xl group cursor-pointer"
          >
            <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-300 w-fit mb-4 group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-white group-hover:text-rose-300 transition-colors flex items-center justify-between">
              <span>Offline Citizen SOS Hub</span>
              <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Zero-internet device GPS coordinate extraction & 1-tap cellular SMS dispatch to 112 / NDRF.
            </p>
          </div>

        </div>

      </section>

      {/* 3. SECTION 2: LIVE DIGITAL TWIN INTERACTIVE COMMAND COCKPIT */}
      <section id="cockpit" className="py-16 px-4 lg:px-8 max-w-7xl mx-auto space-y-6 border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
              ● SECTION 2 • GEOSPATIAL HYDRAULIC SIMULATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Live Digital Twin Interactive Command Cockpit
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onLaunchFullCockpit}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-lg flex items-center space-x-2 cursor-pointer"
            >
              <span>Expand Full-Screen Command Desk</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Embedded Interactive Map & Simulation Control */}
        <div className="rounded-3xl border border-cyan-500/40 bg-slate-950 overflow-hidden shadow-2xl flex flex-col h-[650px] relative">
          <div className="flex-1 relative">
            <DigitalTwinMap
              state={state}
              onSelectNode={() => {}}
              onSelectSensor={() => {}}
              onSelectRoute={() => {}}
              onSwitchCity={handleCityChange}
            />
          </div>

          {/* Bottom Embedded Control Deck */}
          <div className="p-4 bg-[#080d1a]/95 border-t border-slate-800 z-10">
            <ScenarioSandbox
              state={state}
              isPlaying={false}
              playbackSpeed={1.0}
              onTogglePlayback={() => {}}
              onSetSpeed={() => {}}
            />
          </div>
        </div>
      </section>

      {/* 4. SECTION 3: SATELLITE SAR & METEOROLOGICAL RADAR */}
      <section id="satellite" className="py-16 px-4 lg:px-8 max-w-7xl mx-auto space-y-8 border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold text-blue-400 uppercase tracking-widest block">
              ● SECTION 3 • EARTH OBSERVATION CONSTELLATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Copernicus Sentinel-1 SAR & ISRO Bhuvan Satellite Ingestion
            </h2>
          </div>

          <button
            onClick={onOpenSatelliteSAR}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all shadow-lg flex items-center space-x-2 cursor-pointer"
          >
            <Satellite className="w-4 h-4" />
            <span>Launch Live Satellite SAR Viewer</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-mono">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-cyan-400 font-bold text-sm">🛰️ Sentinel-1C C-Band SAR</div>
            <p className="text-slate-300 leading-relaxed font-sans">
              Microwave active radar pulses penetrate 100% of dense monsoon clouds and cyclone eye-walls to image the ground at 10m resolution.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
              Polarization: <strong>VV + VH Cross-Polar</strong>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-cyan-400 font-bold text-sm">🌊 Water Backscatter Anomaly</div>
            <p className="text-slate-300 leading-relaxed font-sans">
              Smooth flood water specularly reflects radar energy away from the sensor, creating dark backscatter values below <strong>-17.5 dB</strong>.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
              Mean Backscatter: <strong>-19.4 dB (Inundated)</strong>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-cyan-400 font-bold text-sm">📡 ISRO INSAT-3DR Doppler</div>
            <p className="text-slate-300 leading-relaxed font-sans">
              Ingests real-time precipitation velocity ($mm/h$), barometric cyclonic depression, and soil moisture from INSAT-3DR sounder mesh.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
              IMD Doppler Stream: <strong>{rain.toFixed(0)} mm/h</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION 4: AI COMPUTER VISION CCTV & DRONE MATRIX */}
      <section id="surveillance" className="py-16 px-4 lg:px-8 max-w-7xl mx-auto space-y-8 border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-widest block">
              ● SECTION 4 • RECONNAISSANCE & SURVEILLANCE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              AI Computer Vision CCTV & Autonomous Drone Feeds
            </h2>
          </div>

          <button
            onClick={onOpenDroneCCTV}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-lg flex items-center space-x-2 cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>Open Live 4x4 Drone Matrix</span>
          </button>
        </div>

        {/* Live Video Preview Box */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div className="relative rounded-3xl overflow-hidden border border-purple-500/40 bg-black aspect-video shadow-2xl group">
            <video
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {/* OSD Watermark */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 border border-purple-500 text-purple-300 font-mono text-xs font-bold flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>LIVE UAV RECON: {cityName}</span>
            </div>

            {/* YOLO Bounding Box Mock */}
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-red-500 bg-red-500/10 rounded-xl pointer-events-none">
              <span className="absolute -top-6 left-0 px-2 py-0.5 rounded bg-black/90 text-[10px] font-mono font-bold text-red-300 border border-red-500">
                [STRANDED_CITIZENS: 6 PERSONS (94%)]
              </span>
            </div>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="text-white font-bold text-sm">🎯 Real-Time YOLO Object Detection</div>
              <p className="text-slate-300 font-sans leading-relaxed">
                Autonomous drone neural networks detect submerged vehicles, stranded civilian groups on dividers, and water level gauges with confidence scores above 90%.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="text-white font-bold text-sm">🌈 Multi-Spectrum Optical Filters</div>
              <p className="text-slate-300 font-sans leading-relaxed">
                Switch dynamically between <strong>Optical RGB</strong>, <strong>FLIR Thermal Infrared</strong> (body heat detection), and <strong>Night Vision</strong> for 24/7 all-weather search and rescue operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION 5: GOOGLE GEMINI AI INCIDENT COMMANDER */}
      <section id="gemini" className="py-16 px-4 lg:px-8 max-w-7xl mx-auto space-y-8 border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold text-blue-400 uppercase tracking-widest block">
              ● SECTION 5 • GENERATIVE INCIDENT REASONING
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Google Gemini AI Incident Commander
            </h2>
          </div>

          <button
            onClick={onOpenGemini}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-mono text-xs font-extrabold transition-all shadow-lg flex items-center space-x-2 cursor-pointer animate-pulse"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Open Full Conversational Commander</span>
          </button>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-950/40 via-slate-950 to-slate-950 border border-blue-500/40 space-y-4 shadow-2xl">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-300">
            <Sparkles className="w-4 h-4" />
            <span>Ask Google Gemini directly about live disaster conditions:</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={heroPrompt}
              onChange={(e) => setHeroPrompt(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 focus:border-blue-400 rounded-xl p-3.5 text-xs font-mono text-white focus:outline-none"
            />
            <button
              onClick={onOpenGemini}
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer"
            >
              <span>Ask Gemini</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <button 
              onClick={() => { setHeroPrompt('Where are the nearest safe high-ground shelters?'); onOpenGemini(); }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
            >
              🧭 Nearest Safe Shelters?
            </button>
            <button 
              onClick={() => { setHeroPrompt('How do I purify drinking water during a flood?'); onOpenGemini(); }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
            >
              💧 Water Purification Steps?
            </button>
            <button 
              onClick={() => { setHeroPrompt('What roads are blocked by waterlogging?'); onOpenGemini(); }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
            >
              🚫 Blocked Underpasses & Roads?
            </button>
          </div>
        </div>
      </section>

      {/* 7. SECTION 6: CITIZEN SAFETY & ZERO-INTERNET OFFLINE SOS */}
      <section id="citizen" className="py-16 px-4 lg:px-8 max-w-7xl mx-auto space-y-8 border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold text-rose-400 uppercase tracking-widest block">
              ● SECTION 6 • PUBLIC CIVIL PROTECTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Citizen Emergency Safety & Zero-Internet SMS 112 Dispatch
            </h2>
          </div>

          <div className="flex items-center space-x-2.5">
            {onOpenWhatsApp && (
              <button
                onClick={onOpenWhatsApp}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-lg flex items-center space-x-1.5 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>💬 Test WhatsApp Bot</span>
              </button>
            )}

            <button
              onClick={onOpenCitizenSOS}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold transition-all shadow-lg flex items-center space-x-2 cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>Open Citizen Safety Hub</span>
            </button>
          </div>
        </div>

        {/* 24/7 Helplines Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <div className={`px-3.5 py-2 rounded-xl bg-gradient-to-r ${h.color} text-white font-mono font-black text-sm shadow-md`}>
                {h.number}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 8. SECTION 7: SATELLITE & PRODUCTION API GATEWAYS */}
      <section id="gateways" className="py-16 px-4 lg:px-8 max-w-7xl mx-auto space-y-8 border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
              ● SECTION 7 • PRODUCTION INTEGRATIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Satellite Gateways & Production API Keys
            </h2>
          </div>

          <button
            onClick={onOpenGateways}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold transition-all shadow-lg flex items-center space-x-2 cursor-pointer"
          >
            <Key className="w-4 h-4" />
            <span>Configure Satellite & API Gateways</span>
          </button>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white">
              Connect Copernicus, ISRO Bhuvan, Twilio & Google Gemini APIs
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-2xl">
              Plug in your Copernicus OAuth token, ISRO Bhuvan API key, NASA EarthData token, Google Gemini AI key, or telecom SMS gateways. All credentials are encrypted with 256-bit AES.
            </p>
          </div>

          <button
            onClick={onOpenGateways}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Open Key Manager</span>
          </button>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="border-t border-slate-800 bg-[#02040a] py-10 px-4 lg:px-8 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>CIVICTWIN AI • NATIONAL CIVIL DEFENSE DIGITAL TWIN</span>
          </div>
          <div className="text-slate-400">
            Compliant with NDMA CAP Protocol & ISRO/IMD Standards
          </div>
        </div>
      </footer>

    </div>
  );
};
