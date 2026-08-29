import React, { useState, useRef, useEffect } from 'react';
import { CityDigitalTwinState } from '../types/digital_twin';
import { AuthUser } from './LoginPage';
import { 
  Activity, Radio, AlertTriangle, 
  RotateCcw, Bell, Compass, Layers, ShieldCheck, 
  CloudRain, Radar, BookOpen, MessageSquare, PhoneCall, 
  FileText, LogOut, UserCheck, Globe, Video, Mic, Skull, AlertOctagon, Settings, Database,
  TrendingUp, Waves, HeartPulse, WifiOff, Smartphone, QrCode, Bot, Sparkles, Building2, Lock, User,
  ChevronDown, Grid, Shield, Flame, Sun, Moon, Satellite, Mountain
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
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target as Node)) {
        setIsToolsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <header className="w-full h-14 sm:h-16 bg-[#080e1b]/95 border-b border-cyan-500/25 px-2.5 sm:px-4 lg:px-6 flex items-center justify-between gap-2 text-slate-100 z-40 backdrop-blur-xl font-sans relative shadow-xl shrink-0">
      
      {/* LEFT SECTION: Logo + Region Switcher + 18 Feeds Badge + Theme Toggle */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {/* Animated Brand Icon */}
        <div className="relative flex items-center justify-center p-1.5 sm:p-2 rounded-xl bg-[#0b162c] border border-cyan-400/60 shadow-[0_0_15px_rgba(56,189,248,0.3)]">
          <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 animate-pulse" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
        </div>

        <div className="flex items-center space-x-2 sm:space-x-2.5">
          <span className="font-hud text-base sm:text-lg font-black tracking-wider bg-gradient-to-r from-amber-300 via-cyan-200 to-emerald-400 bg-clip-text text-transparent truncate">
            CIVICTWIN AI
          </span>

          {/* Region Dropdown */}
          <div className="flex items-center space-x-1.5">
            <select
              value={state?.city_id || 'mumbai_monsoon'}
              onChange={(e) => onSwitchCity(e.target.value)}
              className={`text-xs font-mono px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border focus:outline-none cursor-pointer max-w-[140px] sm:max-w-[190px] lg:max-w-[220px] truncate font-bold transition-all ${
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

            {/* 18 Live Sovereign, Maritime, Aerospace, Grid & Traffic Feeds Inspector Button */}
            <button
              onClick={onOpenProvenance}
              className="px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg bg-emerald-950/90 border border-emerald-400/80 text-emerald-300 hover:bg-emerald-900 text-[11px] sm:text-xs font-mono font-bold flex items-center space-x-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] cursor-pointer shrink-0"
              title="Inspect 18 Real-Time Live Sovereign, Maritime, Aerospace, Grid, Traffic & Physical IoT Feeds"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-hud hidden md:inline">18 Live Feeds</span>
              <span className="font-hud md:hidden">18 Feeds</span>
            </button>

            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-xl bg-[#091224] border border-slate-700 hover:border-amber-400 text-amber-400 hover:scale-105 transition-all shadow-md cursor-pointer shrink-0"
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
      <div className="hidden 2xl:flex items-center space-x-2 px-3 py-1 rounded-xl bg-[#091224]/90 border border-cyan-500/30 text-xs font-mono shrink-0">
        <span className="text-cyan-400 font-bold">T+{state?.timeline_hour.toFixed(1) || '0.0'}h</span>
        <span className="text-slate-600">•</span>
        <span className="text-slate-300">IMD: <strong className="text-cyan-300">{state?.rain_intensity_mmhr.toFixed(0) || 0} mm/h</strong></span>
        <span className="text-slate-600">•</span>
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
          state?.iap?.overall_threat_level === 'CRITICAL' || state?.iap?.overall_threat_level === 'CATASTROPHIC'
            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
        }`}>
          {state?.iap?.overall_threat_level || 'ELEVATED'}
        </span>
      </div>

      {/* RIGHT SECTION: Quick Action Buttons + Categorized Command Tools Dropdown */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
        
        {/* 1. Citizen SOS Distress Queue Button */}
        {!isCitizen && (
          <button
            onClick={onOpenCitizenSOS}
            title="Citizen SOS Distress Queue"
            className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-950/90 hover:bg-rose-900 border border-rose-600/70 text-rose-200 text-xs font-hud font-bold transition-all shadow-md cursor-pointer shrink-0"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span className="hidden sm:inline">Citizen SOS</span>
            <span className="sm:hidden">SOS</span>
          </button>
        )}

        {/* 2. Direct 3D Elevation Slicing Button (Widescreen only) */}
        <button
          onClick={onOpenElevation}
          title="3D Topographic Elevation & Levee Spillover Slicing"
          className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-[#091224] hover:bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-hud font-bold transition-all shadow-md cursor-pointer shrink-0"
        >
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          <span>3D Elevation</span>
        </button>

        {/* 3. Signature Google Gemini AI Button */}
        <button
          onClick={onOpenAICopilot}
          title="Google Gemini AI Incident Commander"
          className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-hud font-black transition-all shadow-[0_0_20px_rgba(59,130,246,0.35)] animate-pulse border border-cyan-300/40 cursor-pointer shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
          <span>Gemini AI</span>
        </button>

        {/* 4. Real Alert / Helpline Button */}
        <button
          onClick={onOpenBroadcast}
          title={isCitizen ? "National Emergency Helpline Directory" : "Send Real Mobile SMS / Siren Warning"}
          className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white text-xs font-bold font-hud shadow-md transition-all cursor-pointer shrink-0"
        >
          <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden sm:inline">{isCitizen ? "Helplines" : "Real Alert"}</span>
          <span className="sm:hidden">Alert</span>
        </button>

        {/* 4b. Citizen Safety & Disaster Assistant Portal Button */}
        {isCitizen && onOpenCitizenPortal && (
          <button
            onClick={onOpenCitizenPortal}
            title="Open Citizen Safety & Disaster Assistant Portal"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-hud font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-pulse border border-emerald-300/50 cursor-pointer shrink-0"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
            <span>Citizen Safety Portal</span>
          </button>
        )}

        {/* 5. CATEGORIZED COMMAND DECK TOOLS DROPDOWN (Hidden from Citizens) */}
        {!isCitizen && (
          <div className="relative shrink-0" ref={toolsMenuRef}>
            <button
              onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
              title="Command Deck: Surveillance, Hydrology, Physics, Hospital, and Operations Tools"
              className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#091224] hover:bg-[#0f1d38] border border-cyan-500/40 hover:border-cyan-400 text-cyan-200 text-xs font-hud font-bold transition-all shadow-md cursor-pointer shrink-0"
            >
            <Grid className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Tools</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isToolsMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Expanded Modular Tools Menu */}
          {isToolsMenuOpen && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl bg-[#080d1a] border border-cyan-500/40 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 space-y-3.5 backdrop-blur-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                  <Grid className="w-3.5 h-3.5" />
                  <span>Command Center Modules</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {authUser?.role || 'Operator'}
                </span>
              </div>

              {/* Group 1: Surveillance & Comms */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  📡 Surveillance & Communications
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                  <button
                    onClick={() => { setIsToolsMenuOpen(false); onOpenDroneCCTV(); }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500 text-left flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <Video className="w-4 h-4 text-cyan-400" />
                    <span>CCTV/Drones</span>
                  </button>

                  <button
                    onClick={() => { setIsToolsMenuOpen(false); onOpenVoiceRadio(); }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500 text-left flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <Mic className="w-4 h-4 text-purple-400" />
                    <span>Voice Radio</span>
                  </button>

                  <button
                    onClick={() => { setIsToolsMenuOpen(false); onOpenMesh(); }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500 text-left flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <WifiOff className="w-4 h-4 text-amber-400" />
                    <span>Mesh SOS</span>
                  </button>

                  <button
                    onClick={() => { setIsToolsMenuOpen(false); if (onOpenQRCode) onOpenQRCode(); else onOpenMobileCompanion(); }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-rose-500 text-left flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-rose-400" />
                    <span>Citizen QR Beacon</span>
                  </button>
                </div>
              </div>

              {/* Group 2: Hydrology & Multi-Hazard Physics */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  🌊 Hydrology & Physics Engines
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                  <button
                    onClick={() => { setIsToolsMenuOpen(false); onOpenDam(); }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-500 text-left flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <Waves className="w-4 h-4 text-blue-400" />
                    <span>Dam Sluice</span>
                  </button>

                  <button
                    onClick={() => { setIsToolsMenuOpen(false); onOpenElevation(); }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500 text-left flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span>3D Elevation Cut</span>
                  </button>

                  <button
                    onClick={() => { setIsToolsMenuOpen(false); onOpenMultiHazard(); }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500 text-left flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <Skull className="w-4 h-4 text-amber-400" />
                    <span>Hazmat Sim</span>
                  </button>

                  <button
                    onClick={() => { setIsToolsMenuOpen(false); if (onOpenCWCGauges) onOpenCWCGauges(); }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-500 text-left flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <Waves className="w-4 h-4 text-cyan-300 animate-pulse" />
                    <span>CWC River Gauges</span>
                  </button>

                  <button
                    onClick={() => { setIsToolsMenuOpen(false); if (onOpenMOSDAC) onOpenMOSDAC(); }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-500 text-left flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <Satellite className="w-4 h-4 text-blue-400 animate-pulse" />
                    <span>MOSDAC Satellites</span>
                  </button>

                  <button
                    onClick={() => { setIsToolsMenuOpen(false); if (onOpenGLOF) onOpenGLOF(); }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500 text-left flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <Mountain className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span>Himalayan GLOF</span>
                  </button>

                  <button
                    onClick={() => { setIsToolsMenuOpen(false); onOpenSAR(); }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500 text-left flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <Radar className="w-4 h-4 text-cyan-400" />
                    <span>SAR Radar</span>
                  </button>
                </div>
              </div>

              {/* Group 3: Operations & System Data */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  🏥 Relief & System Controls
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                  <button
                    onClick={() => { setIsToolsMenuOpen(false); onOpenHospitalSurge(); }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-rose-500 text-left flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <HeartPulse className="w-4 h-4 text-rose-400" />
                    <span>Hospital Surge</span>
                  </button>

                  <button
                    onClick={() => { setIsToolsMenuOpen(false); onOpenICS201(); }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-red-500 text-left flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-red-400" />
                    <span>ICS-201 Plan</span>
                  </button>

                  <button
                    onClick={() => { setIsToolsMenuOpen(false); onOpenProvenance(); }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500 text-left flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>Live APIs</span>
                  </button>

                  <button
                    onClick={() => { setIsToolsMenuOpen(false); onOpenIntegrations(); }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500 text-left flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-cyan-400" />
                    <span>Gateways</span>
                  </button>
                </div>
              </div>

              {/* Bottom Quick Bar: Weather Sync & Reset */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-mono">
                <button
                  onClick={() => { onSyncLiveWeather(); }}
                  disabled={isSyncingWeather}
                  className="flex items-center space-x-1.5 text-blue-300 hover:text-blue-200 transition-colors cursor-pointer"
                >
                  <CloudRain className={`w-3.5 h-3.5 ${isSyncingWeather ? 'animate-spin' : ''}`} />
                  <span>Sync IMD Weather</span>
                </button>

                <button
                  onClick={() => { setIsToolsMenuOpen(false); onReset(); }}
                  className="flex items-center space-x-1.5 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Twin</span>
                </button>
              </div>

            </div>
          )}
        </div>
      )}

        {/* 4.5 Global Demo Mode Toggle Pill */}
        {onToggleDemoMode && (
          <button
            onClick={onToggleDemoMode}
            title={demoMode ? "🎬 Demo Mode is ACTIVE (External API calls skipped, returning calibrated reference data). Click to switch to Real Telemetry." : "🛰️ Real Telemetry is ACTIVE. Click to activate Demo Mode for offline presentation."}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
              demoMode
                ? 'bg-amber-950/90 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)] animate-pulse'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-emerald-400 hover:border-emerald-500'
            }`}
          >
            <span>{demoMode ? '🎬 DEMO' : '🛰️ REAL'}</span>
            <div className={`w-2 h-2 rounded-full ${demoMode ? 'bg-amber-400' : 'bg-emerald-400'}`} />
          </button>
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
