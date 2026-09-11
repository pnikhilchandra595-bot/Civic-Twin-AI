import React, { useState, useRef, useEffect } from 'react';
import { CityDigitalTwinState } from '../types/digital_twin';
import { AuthUser } from './LoginPage';
import { 
  Activity, Radio, AlertTriangle, 
  RotateCcw, Bell, Compass, Layers, ShieldCheck, 
  CloudRain, Radar, BookOpen, MessageSquare, PhoneCall, 
  FileText, LogOut, UserCheck, Globe, Video, Mic, Skull, AlertOctagon, Settings, Database,
  TrendingUp, Waves, HeartPulse, WifiOff, Smartphone, QrCode, Bot, Sparkles, Building2, Lock, User,
  ChevronDown, Grid, Shield, Flame, Sun, Moon, Satellite, Mountain,
  FlaskConical, Clock
} from 'lucide-react';

interface HeaderProps {
  state: CityDigitalTwinState | null;
  authUser: AuthUser | null;
  onLogout: () => void;
  onReset: () => void;
  onOpenBroadcast: () => void;
  onOpenSAR: () => void;
  onOpenTutorial: () => void;
  onOpenDataExport: () => void;
  onOpenCitizenSOS: () => void;
  onOpenDroneCCTV: () => void;
  onOpenVoiceRadio: () => void;
  onOpenIntegrations: () => void;
  onOpenProvenance: () => void;
  onOpenICS201: () => void;
  onOpenMobileCompanion: () => void;
  onOpenElevation: () => void;
  onOpenDam: () => void;
  onOpenHospitalSurge: () => void;
  onOpenMesh: () => void;
  onOpenAICopilot: () => void;
  onOpenMultiHazard: () => void;
  onOpenCWCGauges?: () => void;
  onOpenMOSDAC?: () => void;
  onOpenGLOF?: () => void;
  onOpenDistrictAtlas?: () => void;
  onOpenQRCode?: () => void;
  onOpenCitizenPortal?: () => void;
  onSyncLiveWeather: () => void;
  isSyncingWeather: boolean;
  onSwitchCity: (cityId: string) => void;
  activeView: 'map' | 'cascade' | 'telemetry' | 'iap' | 'radio';
  setActiveView: (view: 'map' | 'cascade' | 'telemetry' | 'iap' | 'radio') => void;
  demoMode?: boolean;
  onToggleDemoMode?: () => void;
  onOpenCalibratedSim?: () => void;
  onOpenDisasterIntelligence?: () => void;
  onOpenGoogleFloodHub?: () => void;
  onOpenFuturePredictions?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  state,
  authUser,
  onLogout,
  onReset,
  onOpenBroadcast,
  onOpenSAR,
  onOpenTutorial,
  onOpenDataExport,
  onOpenCitizenSOS,
  onOpenDroneCCTV,
  onOpenVoiceRadio,
  onOpenIntegrations,
  onOpenProvenance,
  onOpenICS201,
  onOpenMobileCompanion,
  onOpenElevation,
  onOpenDam,
  onOpenHospitalSurge,
  onOpenMesh,
  onOpenAICopilot,
  onOpenMultiHazard,
  onOpenCWCGauges,
  onOpenMOSDAC,
  onOpenGLOF,
  onOpenDistrictAtlas,
  onOpenQRCode,
  onOpenCitizenPortal,
  onSyncLiveWeather,
  isSyncingWeather,
  onSwitchCity,
  demoMode,
  onToggleDemoMode,
  onOpenCalibratedSim,
  onOpenDisasterIntelligence,
  onOpenGoogleFloodHub,
  onOpenFuturePredictions,
}) => {
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('civictwin_theme') as 'dark' | 'light') || 'light';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
    localStorage.setItem('civictwin_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const isCitizen = authUser?.userType === 'citizen';
  const isDistrictOfficer = authUser?.userType === 'district_officer';
  const isStateOfficer = authUser?.userType === 'state_officer';
  const isNational = authUser?.userType === 'national_authority' || !authUser?.userType;

  // Close tools dropdown when clicking outside
  useEffect(() => {
    if (!isToolsMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target as Node)) {
        setIsToolsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isToolsMenuOpen]);

  const allCities = [
    { id: 'mumbai_monsoon', state: 'Maharashtra', label: 'Maharashtra: Mumbai Mithi Basin (MH)' },
    { id: 'delhi_yamuna', state: 'Delhi NCR', label: 'Delhi NCR: Yamuna Floodplain (NCR)' },
    { id: 'bengaluru_lakes', state: 'Karnataka', label: 'Karnataka: Bengaluru Lake Corridor (KA)' },
    { id: 'chennai_cyclone', state: 'Tamil Nadu', label: 'Tamil Nadu: Chennai Cyclone Surge (TN)' },
    { id: 'kolkata_hooghly', state: 'West Bengal', label: 'West Bengal: Kolkata Hooghly Surge (WB)' },
    { id: 'assam_brahmaputra', state: 'Assam', label: 'Assam: Guwahati Brahmaputra (AS)' },
    { id: 'odisha_mahanadi', state: 'Odisha', label: 'Odisha: Bhubaneswar Mahanadi (OD)' },
    { id: 'kerala_periyar', state: 'Kerala', label: 'Kerala: Kochi Periyar Dam (KL)' },
    { id: 'gujarat_tapi', state: 'Gujarat', label: 'Gujarat: Surat Tapi Surge (GJ)' },
    { id: 'bihar_kosi', state: 'Bihar', label: 'Bihar: Patna Kosi Basin (BR)' },
    { id: 'uttar_pradesh_ganga', state: 'Uttar Pradesh', label: 'Uttar Pradesh: Varanasi Ganga (UP)' },
    { id: 'uttarakhand_cloudburst', state: 'Uttarakhand', label: 'Uttarakhand: Rishikesh Cloudburst (UK)' },
    { id: 'himachal_beas', state: 'Himachal', label: 'Himachal: Kullu Beas Surge (HP)' },
    { id: 'punjab_sutlej', state: 'Punjab', label: 'Punjab: Ludhiana Sutlej (PB)' },
    { id: 'andhra_krishna', state: 'Andhra Pradesh', label: 'Andhra Pradesh: Vijayawada Krishna (AP)' },
    { id: 'telangana_musi', state: 'Telangana', label: 'Telangana: Hyderabad Musi River (TS)' },
    { id: 'rajasthan_luni', state: 'Rajasthan', label: 'Rajasthan: Jodhpur Luni River (RJ)' },
    { id: 'madhya_pradesh_narmada', state: 'Madhya Pradesh', label: 'Madhya Pradesh: Jabalpur Narmada (MP)' },
    { id: 'jammu_jhelum', state: 'Jammu & Kashmir', label: 'Jammu & Kashmir: Srinagar Jhelum (JK)' },
    { id: 'goa_mandovi', state: 'Goa', label: 'Goa: Panaji Mandovi Estuary (GA)' },
    { id: 'sikkim_teesta', state: 'Sikkim', label: 'Sikkim: Gangtok Teesta GLOF (SK)' },
    { id: 'tripura_howrah', state: 'Tripura', label: 'Tripura: Agartala Howrah River (TR)' },
    { id: 'meghalaya_cherrapunji', state: 'Meghalaya', label: 'Meghalaya: Shillong Cherrapunji (ML)' },
    { id: 'manipur_imphal', state: 'Manipur', label: 'Manipur: Imphal Loktak Lake (MN)' },
    { id: 'jharkhand_subarnarekha', state: 'Jharkhand', label: 'Jharkhand: Ranchi Subarnarekha (JH)' },
    { id: 'chhattisgarh_mahanadi', state: 'Chhattisgarh', label: 'Chhattisgarh: Raipur Mahanadi (CG)' },
    { id: 'haryana_gurugram', state: 'Haryana', label: 'Haryana: Gurugram Najafgarh (HR)' },
    { id: 'andaman_portblair', state: 'Andaman & Nicobar', label: 'Andaman & Nicobar: Port Blair (AN)' },
    { id: 'ladakh_indus', state: 'Ladakh', label: 'Ladakh: Leh Indus Valley (LA)' },
    { id: 'arunachal_siang', state: 'Arunachal Pradesh', label: 'Arunachal Pradesh: Itanagar Siang (AR)' },
    { id: 'mizoram_tlawng', state: 'Mizoram', label: 'Mizoram: Aizawl Tlawng River (MZ)' },
    { id: 'nagaland_doyang', state: 'Nagaland', label: 'Nagaland: Kohima Dimapur Doyang (NL)' },
    { id: 'chandigarh_sukhna', state: 'Chandigarh', label: 'Chandigarh UT: Sukhna Lake (CH)' },
    { id: 'daman_damanganga', state: 'Dadra & Nagar Haveli and Daman & Diu', label: 'Daman & Diu: Damanganga (DD)' },
    { id: 'lakshadweep_kavaratti', state: 'Lakshadweep', label: 'Lakshadweep UT: Kavaratti Atolls (LD)' },
    { id: 'puducherry_coastal', state: 'Puducherry', label: 'Puducherry UT: Coromandel Coast (PY)' },
  ];

  const selectableCities = isDistrictOfficer && authUser.assignedCityId
    ? allCities.filter(c => c.id === authUser.assignedCityId)
    : isStateOfficer && authUser.assignedState
    ? allCities.filter(c => c.state.toLowerCase() === authUser.assignedState?.toLowerCase())
    : allCities;

  return (
    <header className="w-full h-14 bg-gradient-to-r from-[#040916]/98 via-[#081530]/98 to-[#040916]/98 border-b border-cyan-500/35 px-2 sm:px-3 lg:px-4 flex items-center justify-between gap-1.5 sm:gap-2 text-slate-100 z-50 backdrop-blur-2xl font-sans relative shadow-[0_4px_30px_rgba(0,0,0,0.95)] ring-1 ring-cyan-500/20 shrink-0 flex-nowrap overflow-visible cyber-scanner-border">
      
      {/* LEFT SECTION: Logo + Region Switcher + 18 Feeds Badge + Theme Toggle */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0 flex-nowrap">
        {/* Animated Brand Icon */}
        <div className="relative flex items-center justify-center p-1.5 rounded-xl bg-[#0b162c] border border-cyan-400/60 shadow-[0_0_15px_rgba(56,189,248,0.3)] shrink-0">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          <span className="font-hud text-sm sm:text-base font-black tracking-wider bg-gradient-to-r from-amber-300 via-cyan-200 to-emerald-400 bg-clip-text text-transparent truncate hidden xs:inline text-glow-cyan">
            CIVICTWIN AI
          </span>

          {/* Region Dropdown */}
          <div className="flex items-center space-x-1 shrink-0">
            <select
              value={state?.city_id || 'mumbai_monsoon'}
              onChange={(e) => onSwitchCity(e.target.value)}
              className={`text-xs font-mono px-2 py-1 rounded-xl border focus:outline-none cursor-pointer max-w-[120px] sm:max-w-[170px] lg:max-w-[200px] truncate font-bold transition-all ${
                isDistrictOfficer
                  ? 'bg-amber-950/90 border-amber-500 text-amber-200'
                  : isStateOfficer
                  ? 'bg-purple-950/90 border-purple-500 text-purple-200'
                  : isCitizen
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                  : 'bg-[#091224] border-cyan-500/40 text-cyan-100 hover:border-cyan-400'
              }`}
            >
              <optgroup label={isDistrictOfficer ? `🏢 Assigned District (${authUser?.assignedDistrict || 'DDMA'})` : isStateOfficer ? `🔒 Assigned State (${authUser?.assignedState})` : isCitizen ? `📍 Citizen Safe Zones` : `🇮🇳 Pan-India Corridors (All 20 States)`}>
                {selectableCities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </optgroup>
            </select>

            {/* 19 Live Sovereign Feeds Inspector Button */}
            <button
              onClick={onOpenProvenance}
              className="px-2 py-1 rounded-lg bg-emerald-950/90 border border-emerald-400/80 text-emerald-300 hover:bg-emerald-900 text-[10px] sm:text-xs font-mono font-bold flex items-center space-x-1 transition-all shadow-[0_0_15px_rgba(16,185,129,0.35)] ring-1 ring-emerald-400/30 cursor-pointer shrink-0"
              title="Inspect 19 Real-Time Live Sovereign Feeds"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-hud hidden md:inline">19 Feeds</span>
              <span className="font-hud md:hidden">19</span>
            </button>

            {/* Direct Google Flood Hub Button */}
            {onOpenGoogleFloodHub && (
              <button
                onClick={onOpenGoogleFloodHub}
                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-900 to-indigo-900 border border-blue-400/80 text-blue-200 hover:text-white text-[10px] sm:text-xs font-mono font-bold flex items-center space-x-1 transition-all shadow-[0_0_15px_rgba(59,130,246,0.35)] ring-1 ring-blue-400/40 cursor-pointer shrink-0"
                title="Launch Google Flood Hub (AI Streamflow Inflow Ingestion)"
              >
                <span>🌊</span>
                <span className="font-hud hidden md:inline">Flood Hub</span>
              </button>
            )}

            {/* Direct National Disaster Intelligence Suite Button */}
            {onOpenDisasterIntelligence && (
              <button
                onClick={onOpenDisasterIntelligence}
                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-900 via-teal-900 to-blue-950 border border-cyan-400/80 text-cyan-200 hover:text-white text-[10px] sm:text-xs font-mono font-bold flex items-center space-x-1 transition-all shadow-[0_0_15px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400/40 cursor-pointer shrink-0"
                title="Launch National Disaster Intelligence Suite (RAG & Colab LLM)"
              >
                <span>🧠</span>
                <span className="font-hud hidden md:inline">AI Suite</span>
              </button>
            )}

            {/* Direct What Happens Next Predictor Button */}
            {onOpenFuturePredictions && (
              <button
                onClick={onOpenFuturePredictions}
                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-900 via-orange-900 to-amber-950 border border-amber-400/80 text-amber-200 hover:text-white text-[10px] sm:text-xs font-mono font-bold flex items-center space-x-1 transition-all shadow-[0_0_15px_rgba(245,158,11,0.35)] ring-1 ring-amber-400/40 cursor-pointer shrink-0"
                title="Launch What Happens Next: 72-Hour Cascade Impact Predictor"
              >
                <span>🔮</span>
                <span className="font-hud hidden md:inline">What Next</span>
              </button>
            )}

            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1 rounded-xl bg-[#091224] border border-slate-700/80 hover:border-amber-400 text-amber-400 hover:scale-105 transition-all shadow-md cursor-pointer shrink-0"
              title={theme === 'dark' ? "Switch to Light Theme" : "Switch to Dark Theme"}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* CENTER SECTION: Live Telemetry Pill */}
      <div className="hidden 2xl:flex items-center space-x-2 px-3 py-1 rounded-xl bg-[#09152e]/90 border border-cyan-500/40 text-xs font-mono shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/20">
        <span className="text-cyan-400 font-bold text-glow-cyan">T+{state?.timeline_hour.toFixed(1) || '0.0'}h</span>
        <span className="text-slate-600">•</span>
        <span className="text-slate-300">IMD: <strong className="text-cyan-300">{state?.rain_intensity_mmhr.toFixed(0) || 0} mm/h</strong></span>
        <span className="text-slate-600">•</span>
        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
          state?.iap?.overall_threat_level === 'CRITICAL' || state?.iap?.overall_threat_level === 'CATASTROPHIC'
            ? 'bg-red-500/20 text-red-400 border border-red-500/60 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
        }`}>
          {state?.iap?.overall_threat_level || 'ELEVATED'}
        </span>
      </div>

      {/* RIGHT SECTION: Quick Action Buttons + Categorized Command Tools Dropdown */}
      <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0 flex-nowrap">
        
        {/* 1. Citizen SOS Distress Queue Button */}
        {!isCitizen && (
          <button
            onClick={onOpenCitizenSOS}
            title="Citizen SOS Distress Queue"
            className="hidden sm:flex items-center space-x-1 px-2 py-1 rounded-xl bg-rose-950/90 hover:bg-rose-900 border border-rose-600/70 text-rose-200 text-xs font-hud font-bold transition-all shadow-md cursor-pointer shrink-0"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span className="hidden xl:inline">SOS</span>
          </button>
        )}

        {/* 2. Direct 3D Elevation Slicing Button (Ultra widescreen only) */}
        <button
          onClick={onOpenElevation}
          title="3D Topographic Elevation & Levee Spillover Slicing"
          className="hidden 2xl:flex items-center space-x-1 px-2 py-1 rounded-xl bg-[#091224] hover:bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-hud font-bold transition-all shadow-md cursor-pointer shrink-0"
        >
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          <span>3D Elevation</span>
        </button>

        {/* 3. Signature Google Gemini AI Button */}
        <button
          onClick={onOpenAICopilot}
          title="Google Gemini AI Incident Commander"
          className="flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-hud font-black transition-all shadow-md border border-cyan-300/40 cursor-pointer shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
          <span className="hidden lg:inline">Gemini AI</span>
        </button>

        {/* 4. Real Alert / Helpline Button */}
        <button
          onClick={onOpenBroadcast}
          title={isCitizen ? "National Emergency Helpline Directory" : "Send Real Mobile SMS / Siren Warning"}
          className="flex items-center space-x-1 px-2 py-1 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white text-xs font-bold font-hud shadow-md transition-all cursor-pointer shrink-0"
        >
          <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden xl:inline">{isCitizen ? "Helplines" : "Alert"}</span>
        </button>

        {/* 4b. Citizen Safety & Disaster Assistant Portal Button */}
        {isCitizen && onOpenCitizenPortal && (
          <button
            onClick={onOpenCitizenPortal}
            title="Open Citizen Safety & Disaster Assistant Portal"
            className="hidden sm:flex items-center space-x-1 px-2 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-hud font-bold transition-all shadow-sm border border-emerald-300/50 cursor-pointer shrink-0"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
            <span className="hidden md:inline">Portal</span>
          </button>
        )}

        {/* 5. CATEGORIZED COMMAND DECK TOOLS DROPDOWN */}
        {!isCitizen && (
          <div className="relative shrink-0" ref={toolsMenuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsToolsMenuOpen(prev => !prev);
              }}
              title="Command Deck: Surveillance, Hydrology, Physics, Hospital, and Operations Tools"
              className="flex items-center space-x-1 px-2 py-1 rounded-xl bg-[#091224] hover:bg-[#0f1d38] border border-cyan-500/40 hover:border-cyan-400 text-cyan-200 text-xs font-hud font-bold transition-all shadow-md cursor-pointer shrink-0"
            >
              <Grid className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Tools</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isToolsMenuOpen ? 'rotate-180' : ''}`} />
            </button>

          {/* Expanded Modular Tools Menu (Defense-Grade Command Deck) */}
          {isToolsMenuOpen && (
            <div 
              onClick={(e) => e.stopPropagation()} 
              style={{ backgroundColor: '#070e1d' }}
              className="absolute right-0 top-full mt-2.5 w-80 sm:w-[480px] md:w-[540px] max-h-[82vh] overflow-y-auto rounded-3xl bg-[#070e1d] border border-cyan-500/50 p-4 sm:p-5 shadow-[0_25px_80px_rgba(0,0,0,0.99)] z-[200] space-y-4 ring-1 ring-cyan-500/30"
            >
              {/* Deck Header */}
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-cyan-300">
                    <Grid className="w-4 h-4 text-cyan-400 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs font-hud font-black uppercase tracking-wider text-cyan-300 flex items-center space-x-2">
                      <span>COMMAND DECK • 16 MISSION ENGINES</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 flex items-center space-x-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-emerald-300 font-bold">ALL SYSTEMS NOMINAL</span>
                      <span className="text-slate-600">•</span>
                      <span>18 LIVE FEEDS ACTIVE</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-200">
                  {authUser?.role || 'Incident Commander'}
                </span>
              </div>

              {/* Group 1: Surveillance & Comms */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>📡 Surveillance & Tactical Communications</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  
                  {/* CCTV / Drones */}
                  <button
                    onClick={() => { setIsToolsMenuOpen(false); onOpenDroneCCTV(); }}
                    className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-cyan-500/25 hover:border-cyan-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  >
                    <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 group-hover:scale-110 transition-transform shrink-0">
                      <Video className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-100 group-hover:text-cyan-200 transition-colors truncate">CCTV & Drones</div>
                      <div className="text-[10px] text-slate-400 group-hover:text-slate-300 truncate">FLIR & Optical Feeds</div>
                    </div>
                  </button>

                  {/* Voice Radio */}
                  <button
                    onClick={() => { setIsToolsMenuOpen(false); onOpenVoiceRadio(); }}
                    className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-purple-500/25 hover:border-purple-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                  >
                    <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-400 group-hover:scale-110 transition-transform shrink-0">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-100 group-hover:text-purple-200 transition-colors truncate">Voice Radio</div>
                      <div className="text-[10px] text-slate-400 group-hover:text-slate-300 truncate">Tactical SITREP Audio</div>
                    </div>
                  </button>

                  {/* LoRa Mesh Net */}
                  <button
                    onClick={() => { setIsToolsMenuOpen(false); onOpenMesh(); }}
                    className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-amber-500/25 hover:border-amber-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                  >
                    <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400 group-hover:scale-110 transition-transform shrink-0">
                      <WifiOff className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-100 group-hover:text-amber-200 transition-colors truncate">Mesh Network</div>
                      <div className="text-[10px] text-slate-400 group-hover:text-slate-300 truncate">Offline P2P Packets</div>
                    </div>
                  </button>

                  {/* Citizen QR Beacon */}
                  <button
                    onClick={() => { setIsToolsMenuOpen(false); if (onOpenQRCode) onOpenQRCode(); else onOpenMobileCompanion(); }}
                    className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-rose-500/25 hover:border-rose-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                  >
                    <div className="p-2 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-400 group-hover:scale-110 transition-transform shrink-0">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-100 group-hover:text-rose-200 transition-colors truncate">Citizen QR Beacon</div>
                      <div className="text-[10px] text-slate-400 group-hover:text-slate-300 truncate">Geo-Location Evacuation</div>
                    </div>
                  </button>

                </div>
              </div>

              {/* Group 2: Hydrology & Multi-Hazard Physics */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>🌊 Hydrology & Physics Simulators</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">

                  {/* Dam Sluice */}
                  <button
                    onClick={() => { setIsToolsMenuOpen(false); onOpenDam(); }}
                    className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-blue-500/25 hover:border-blue-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                  >
                    <div className="p-2 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-400 group-hover:scale-110 transition-transform shrink-0">
                      <Waves className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-100 group-hover:text-blue-200 transition-colors truncate">Dam Hydrograph</div>
                      <div className="text-[10px] text-slate-400 group-hover:text-slate-300 truncate">Spillway Sluice Release</div>
                    </div>
                  </button>

                  {/* 3D Elevation Cut */}
                  <button
                    onClick={() => { setIsToolsMenuOpen(false); onOpenElevation(); }}
                    className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-cyan-500/25 hover:border-cyan-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  >
                    <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 group-hover:scale-110 transition-transform shrink-0">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-100 group-hover:text-cyan-200 transition-colors truncate">3D Elevation Profile</div>
                      <div className="text-[10px] text-slate-400 group-hover:text-slate-300 truncate">LiDAR Topo Slicing</div>
                    </div>
                  </button>

                  {/* Hazmat Sim */}
                  <button
                    onClick={() => { setIsToolsMenuOpen(false); onOpenMultiHazard(); }}
                    className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-amber-500/25 hover:border-amber-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                  >
                    <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400 group-hover:scale-110 transition-transform shrink-0">
                      <Skull className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-100 group-hover:text-amber-200 transition-colors truncate">Hazmat Multi-Hazard</div>
                      <div className="text-[10px] text-slate-400 group-hover:text-slate-300 truncate">Toxic Plume Dynamics</div>
                    </div>
                  </button>

                  {/* CWC River Gauges */}
                  <button
                    onClick={() => { setIsToolsMenuOpen(false); if (onOpenCWCGauges) onOpenCWCGauges(); }}
                    className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-teal-500/25 hover:border-teal-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(20,184,166,0.2)]"
                  >
                    <div className="p-2 rounded-xl bg-teal-950/80 border border-teal-500/40 text-teal-400 group-hover:scale-110 transition-transform shrink-0">
                      <Waves className="w-4 h-4 animate-pulse" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-100 group-hover:text-teal-200 transition-colors truncate">CWC River Gauges</div>
                      <div className="text-[10px] text-slate-400 group-hover:text-slate-300 truncate">Water Stage Telemetry</div>
                    </div>
                  </button>

                  {/* MOSDAC Satellites */}
                  <button
                    onClick={() => { setIsToolsMenuOpen(false); if (onOpenMOSDAC) onOpenMOSDAC(); }}
                    className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-blue-500/25 hover:border-blue-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                  >
                    <div className="p-2 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-400 group-hover:scale-110 transition-transform shrink-0">
                      <Satellite className="w-4 h-4 animate-pulse" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-100 group-hover:text-blue-200 transition-colors truncate">MOSDAC Satellites</div>
                      <div className="text-[10px] text-slate-400 group-hover:text-slate-300 truncate">ISRO Weather Feeds</div>
                    </div>
                  </button>

                  {/* Himalayan GLOF */}
                  <button
                    onClick={() => { setIsToolsMenuOpen(false); if (onOpenGLOF) onOpenGLOF(); }}
                    className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-cyan-500/25 hover:border-cyan-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  >
                    <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 group-hover:scale-110 transition-transform shrink-0">
                      <Mountain className="w-4 h-4 animate-pulse" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-100 group-hover:text-cyan-200 transition-colors truncate">Himalayan GLOF</div>
                      <div className="text-[10px] text-slate-400 group-hover:text-slate-300 truncate">Glacial Moraine Burst</div>
                    </div>
                  </button>

                  {/* SAR Radar */}
                  <button
                    onClick={() => { setIsToolsMenuOpen(false); onOpenSAR(); }}
                    className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-emerald-500/25 hover:border-emerald-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  >
                    <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                      <Radar className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-100 group-hover:text-emerald-200 transition-colors truncate">Satellite SAR Radar</div>
                      <div className="text-[10px] text-slate-400 group-hover:text-slate-300 truncate">Cloud-Penetrating InSAR</div>
                    </div>
                  </button>

                </div>
              </div>

              {/* Group 2.5: Disaster AI, Flood Hub & Future Cascade Horizons */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>🔮 Disaster AI, Streamflow & Cascade Horizons</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">

                  {/* What Happens Next Predictor */}
                  <button
                    onClick={() => { setIsToolsMenuOpen(false); if (onOpenFuturePredictions) onOpenFuturePredictions(); }}
                    className="group p-2.5 rounded-2xl bg-gradient-to-r from-[#1a1205] to-[#0c1833] hover:from-[#2a1c08] hover:to-[#132652] border border-amber-500/40 hover:border-amber-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                  >
                    <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400 group-hover:scale-110 transition-transform shrink-0">
                      <Clock className="w-4 h-4 animate-pulse" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-amber-200 group-hover:text-amber-100 transition-colors truncate">What Happens Next</div>
                      <div className="text-[10px] text-amber-400/80 truncate">72h Cascade Predictor</div>
                    </div>
                  </button>

                  {/* Google Flood Hub */}
                  <button
                    onClick={() => { setIsToolsMenuOpen(false); if (onOpenGoogleFloodHub) onOpenGoogleFloodHub(); }}
                    className="group p-2.5 rounded-2xl bg-gradient-to-r from-[#07132b] to-[#0c1833] hover:from-[#0d224d] hover:to-[#132652] border border-blue-500/40 hover:border-blue-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.25)]"
                  >
                    <div className="p-2 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-400 group-hover:scale-110 transition-transform shrink-0">
                      <Waves className="w-4 h-4 animate-pulse" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-blue-200 group-hover:text-blue-100 transition-colors truncate">Google Flood Hub</div>
                      <div className="text-[10px] text-blue-400/80 truncate">AI Streamflow Ingestion</div>
                    </div>
                  </button>

                  {/* Disaster Intelligence Suite */}
                  <button
                    onClick={() => { setIsToolsMenuOpen(false); if (onOpenDisasterIntelligence) onOpenDisasterIntelligence(); }}
                    className="group p-2.5 rounded-2xl bg-gradient-to-r from-[#061822] to-[#0c1833] hover:from-[#0b2b3d] hover:to-[#132652] border border-cyan-500/40 hover:border-cyan-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] sm:col-span-2"
                  >
                    <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 group-hover:scale-110 transition-transform shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-cyan-200 group-hover:text-cyan-100 transition-colors truncate">National Disaster Intelligence Suite</div>
                      <div className="text-[10px] text-cyan-400/80 truncate">Historical Memory RAG (Option A) & Colab Fine-Tuned Llama-3.2 (Option B)</div>
                    </div>
                  </button>

                </div>
              </div>

              {/* Group 3: Operations & System Data */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>🏥 Relief Logistics & Command Protocols</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">

                  {/* Hospital Surge */}
                  <button
                    onClick={() => { setIsToolsMenuOpen(false); onOpenHospitalSurge(); }}
                    className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-rose-500/25 hover:border-rose-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                  >
                    <div className="p-2 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-400 group-hover:scale-110 transition-transform shrink-0">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-100 group-hover:text-rose-200 transition-colors truncate">Hospital Surge</div>
                      <div className="text-[10px] text-slate-400 group-hover:text-slate-300 truncate">ICU Beds & Ambulances</div>
                    </div>
                  </button>

                  {/* ICS-201 Plan */}
                  <button
                    onClick={() => { setIsToolsMenuOpen(false); onOpenICS201(); }}
                    className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-emerald-500/25 hover:border-emerald-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  >
                    <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-100 group-hover:text-emerald-200 transition-colors truncate">NDMA ICS-201</div>
                      <div className="text-[10px] text-slate-400 group-hover:text-slate-300 truncate">Incident Action Plan</div>
                    </div>
                  </button>

                  {/* Live APIs */}
                  <button
                    onClick={() => { setIsToolsMenuOpen(false); onOpenProvenance(); }}
                    className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-teal-500/25 hover:border-teal-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(20,184,166,0.2)]"
                  >
                    <div className="p-2 rounded-xl bg-teal-950/80 border border-teal-500/40 text-teal-400 group-hover:scale-110 transition-transform shrink-0">
                      <Database className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-100 group-hover:text-teal-200 transition-colors truncate">Live Sovereign Feeds</div>
                      <div className="text-[10px] text-slate-400 group-hover:text-slate-300 truncate">18 Provenance Feeds</div>
                    </div>
                  </button>

                  {/* Gateways */}
                  <button
                    onClick={() => { setIsToolsMenuOpen(false); onOpenIntegrations(); }}
                    className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-cyan-500/25 hover:border-cyan-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                  >
                    <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 group-hover:scale-110 transition-transform shrink-0">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-100 group-hover:text-cyan-200 transition-colors truncate">Alert Gateways</div>
                      <div className="text-[10px] text-slate-400 group-hover:text-slate-300 truncate">CAP-India & SMS APIs</div>
                    </div>
                  </button>

                </div>
              </div>

              {/* Bottom Quick Bar: Weather Sync & Reset */}
              <div className="flex items-center justify-between pt-3 border-t border-cyan-500/20 text-xs font-mono">
                <button
                  onClick={() => { onSyncLiveWeather(); }}
                  disabled={isSyncingWeather}
                  className="px-3 py-1.5 rounded-xl bg-blue-950/70 hover:bg-blue-900 border border-blue-500/40 flex items-center space-x-1.5 text-blue-300 hover:text-blue-200 transition-all cursor-pointer shadow-sm"
                >
                  <CloudRain className={`w-3.5 h-3.5 ${isSyncingWeather ? 'animate-spin text-blue-300' : 'text-blue-400'}`} />
                  <span>Sync IMD Doppler</span>
                </button>

                <button
                  onClick={() => { setIsToolsMenuOpen(false); onReset(); }}
                  className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 flex items-center space-x-1.5 text-rose-300 hover:text-white transition-all cursor-pointer shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                  <span>Reset Twin</span>
                </button>
              </div>

            </div>
          )}
        </div>
      )}



        {/* 5. Live Weather Sync Button (Only for Officers) */}
        {!isCitizen && (
          <button
            onClick={onSyncLiveWeather}
            disabled={isSyncingWeather}
            title="Sync Live IMD Weather"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-blue-300 hover:text-blue-200 transition-all cursor-pointer"
          >
            <CloudRain className={`w-4 h-4 ${isSyncingWeather ? 'animate-spin' : ''}`} />
          </button>
        )}

        {/* 6. Officer Profile & Logout */}
        {authUser && (
          <button
            onClick={onLogout}
            title={`Logged in as ${authUser.name} (${authUser.role}) - Click to Logout`}
            className="p-2 rounded-xl bg-slate-900 hover:bg-red-950/80 border border-slate-700 hover:border-red-600 text-slate-300 hover:text-red-300 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}

      </div>
    </header>
  );
};
