import React, { useState, useRef, useEffect } from 'react';
import { CityDigitalTwinState } from '../types/digital_twin';
import { AuthUser } from './LoginPage';
import { 
  Activity, Radio, AlertTriangle, 
  RotateCcw, Bell, Compass, Layers, ShieldCheck, 
  CloudRain, Radar, BookOpen, MessageSquare, PhoneCall, 
  FileText, LogOut, UserCheck, Globe, Video, Mic, Skull, AlertOctagon, Settings, Database,
  TrendingUp, Waves, HeartPulse, WifiOff, Smartphone, QrCode, Bot, Sparkles, Building2, Lock, User,
  ChevronDown, Grid, Shield, Flame
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
  onOpenDistrictAtlas?: () => void;
  onOpenQRCode?: () => void;
  onSyncLiveWeather: () => void;
  isSyncingWeather: boolean;
  onSwitchCity: (cityId: string) => void;
  activeView: 'map' | 'cascade' | 'telemetry' | 'iap' | 'radio';
  setActiveView: (view: 'map' | 'cascade' | 'telemetry' | 'iap' | 'radio') => void;
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
  onOpenDistrictAtlas,
  onOpenQRCode,
  onSyncLiveWeather,
  isSyncingWeather,
  onSwitchCity,
}) => {
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

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
    <header className="h-16 bg-[#060a14]/95 border-b border-cyan-500/30 px-4 flex items-center justify-between text-slate-100 z-40 backdrop-blur-xl font-sans relative">
      
      {/* LEFT SECTION: Logo + Region Switcher + Role Pill */}
      <div className="flex items-center space-x-3.5">
        {/* Animated Brand Icon */}
        <div className="relative flex items-center justify-center p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,210,255,0.25)]">
          <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-400 rounded-full animate-ping" />
        </div>

        <div className="flex items-center space-x-3">
          <div>
            <span className="text-base font-black tracking-wider bg-gradient-to-r from-orange-400 via-white to-emerald-400 bg-clip-text text-transparent">
              CIVICTWIN AI
            </span>
          </div>

          {/* Region Dropdown */}
          <div className="flex items-center space-x-1.5">
            <select
              value={state?.city_id || 'mumbai_monsoon'}
              onChange={(e) => onSwitchCity(e.target.value)}
              className={`text-xs font-mono px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer max-w-[210px] lg:max-w-xs truncate font-bold transition-all ${
                isDistrictOfficer
                  ? 'bg-amber-950/90 border-amber-500 text-amber-200'
                  : isStateOfficer
                  ? 'bg-purple-950/90 border-purple-500 text-purple-200'
                  : isCitizen
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                  : 'bg-slate-900 border-cyan-500/50 text-cyan-200 hover:border-cyan-400'
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

            {isDistrictOfficer && (
              <span title={`Locked to ${authUser?.assignedDistrict}`} className="px-2 py-1 rounded-lg bg-amber-950/90 border border-amber-500 text-amber-300 text-[10px] font-mono font-bold flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>District Only</span>
              </span>
            )}

            {isStateOfficer && !isDistrictOfficer && (
              <span title={`Locked to ${authUser?.assignedState} SDMA`} className="px-2 py-1 rounded-lg bg-purple-950/90 border border-purple-500 text-purple-300 text-[10px] font-mono font-bold flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>{authUser?.assignedState} Only</span>
              </span>
            )}

            {/* Role-Specific Districts Atlas Button (Only for Authorized Officers, Hidden from Citizens) */}
            {!isCitizen && onOpenDistrictAtlas && (
              <button
                onClick={onOpenDistrictAtlas}
                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-600/30 via-cyan-600/30 to-emerald-600/30 hover:from-orange-600/50 hover:to-emerald-600/50 border border-cyan-500/50 text-cyan-200 text-xs font-mono font-bold flex items-center space-x-1.5 shadow-md transition-all cursor-pointer"
                title={isDistrictOfficer ? `Browse ${authUser?.assignedDistrict} DDMA municipal triage nodes` : isStateOfficer ? `Browse ${authUser?.assignedState} SDMA districts` : "Browse & search all 780+ Indian Districts across 36 States & UTs"}
              >
                <Globe className="w-3.5 h-3.5 text-orange-400" />
                <span className="hidden sm:inline">
                  {isDistrictOfficer
                    ? `📍 ${authUser?.assignedDistrict || 'District'} DDMA Triage`
                    : isStateOfficer
                    ? `🏢 ${authUser?.assignedState || 'State'} SDMA Districts`
                    : '🇮🇳 780+ Districts Atlas'}
                </span>
              </button>
            )}

            {/* 5 Live Sovereign Feeds Inspector Button */}
            <button
              onClick={onOpenProvenance}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-300 text-xs font-mono font-bold flex items-center space-x-1.5 shadow-md transition-all cursor-pointer"
              title="Inspect 5 Live Sovereign Data Streams: Open-Meteo, Copernicus GloFAS, Delhi OTD GNSS, OSM Hospitals, ISRO Bhuvan"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="hidden sm:inline">🟢 5 Live Feeds</span>
            </button>
          </div>

          {/* Role Clearance Badge */}
          <div className="hidden xl:flex items-center space-x-1">
            {isNational && (
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-blue-950/90 border border-blue-500 text-blue-300 font-mono font-bold flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>Level 5 • National Command</span>
              </span>
            )}
            {isStateOfficer && !isDistrictOfficer && (
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-purple-950/90 border border-purple-500 text-purple-300 font-mono font-bold flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Level 3 • State SDMA</span>
              </span>
            )}
            {isDistrictOfficer && (
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-amber-950/90 border border-amber-500 text-amber-300 font-mono font-bold flex items-center space-x-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>Level 2 • District DDMA</span>
              </span>
            )}
            {isCitizen && (
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500 text-emerald-300 font-mono font-bold flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Level 1 • Citizen Safe Hub</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* CENTER SECTION: Live Telemetry Pill */}
      <div className="hidden md:flex items-center space-x-2.5 px-3 py-1.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
        <span className="text-cyan-400 font-bold">T+{state?.timeline_hour.toFixed(1) || '0.0'}h</span>
        <span className="text-slate-600">•</span>
        <span className="text-slate-300">IMD: <strong className="text-cyan-300">{state?.rain_intensity_mmhr.toFixed(0) || 0} mm/h</strong></span>
        <span className="text-slate-600">•</span>
        <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
          state?.iap?.overall_threat_level === 'CRITICAL' || state?.iap?.overall_threat_level === 'CATASTROPHIC'
            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
        }`}>
          {state?.iap?.overall_threat_level || 'ELEVATED'}
        </span>
        <span className="text-slate-600">•</span>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-cyan-950/90 border border-cyan-500/60 text-cyan-300 flex items-center space-x-1" title="Multi-Hazard Sensor Agreement: Evaluated across Flood, Fire, and Cyclone Risk Indexes">
          <span>🎯 {(state as any)?.confidence_pct ? `${(state as any).confidence_pct.toFixed(1)}%` : (state?.iap?.overall_threat_level === 'CRITICAL' ? '100.0%' : '66.7%')} Confidence</span>
        </span>
      </div>

      {/* RIGHT SECTION: Quick Action Buttons + Categorized Command Tools Dropdown */}
      <div className="flex items-center space-x-2">
        
        {/* 1. Citizen SOS Distress Queue Button */}
        {!isCitizen && (
          <button
            onClick={onOpenCitizenSOS}
            title="Citizen SOS Distress Queue"
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-rose-950/90 hover:bg-rose-900 border border-rose-600/70 text-rose-200 text-xs font-mono font-bold transition-all shadow-md cursor-pointer"
          >
            <AlertOctagon className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>Citizen SOS</span>
          </button>
        )}

        {/* 2. Direct Citizen QR Beacon Button */}
        <button
          onClick={onOpenQRCode}
          title="Shareable Citizen Emergency Mobile QR Beacon"
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs font-mono font-bold transition-all shadow-md cursor-pointer"
        >
          <QrCode className="w-4 h-4 text-rose-400" />
          <span className="hidden md:inline">Citizen QR</span>
        </button>

        {/* 3. Direct 3D Elevation Slicing Button */}
        <button
          onClick={onOpenElevation}
          title="3D Topographic Elevation & Levee Spillover Slicing"
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold transition-all shadow-md cursor-pointer"
        >
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span className="hidden md:inline">3D Elevation</span>
        </button>

        {/* 4. Signature Google Gemini AI Button */}
        <button
          onClick={onOpenAICopilot}
          title="Google Gemini AI Incident Commander"
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-mono font-black transition-all shadow-[0_0_25px_rgba(59,130,246,0.4)] animate-pulse border border-cyan-300/40 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span>✨ Gemini AI</span>
        </button>

        {/* 3. Real Alert / Helpline Button */}
        <button
          onClick={onOpenBroadcast}
          title={isCitizen ? "National Emergency Helpline Directory" : "Send Real Mobile SMS / Siren Warning"}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white text-xs font-bold font-mono shadow-md transition-all cursor-pointer"
        >
          <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden sm:inline">{isCitizen ? "Helplines" : "Real Alert"}</span>
        </button>

        {/* 4. CATEGORIZED COMMAND DECK TOOLS DROPDOWN (Hidden from Citizens) */}
        {!isCitizen && (
          <div className="relative" ref={toolsMenuRef}>
            <button
              onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
              title="Command Deck: Surveillance, Hydrology, Physics, Hospital, and Operations Tools"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-cyan-400 text-slate-200 text-xs font-mono font-bold transition-all shadow-md cursor-pointer"
            >
            <Grid className="w-4 h-4 text-cyan-400" />
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
