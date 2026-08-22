import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, User, Key, Building2, 
  ArrowRight, ShieldAlert, Activity, CheckCircle2, 
  Fingerprint, Sparkles, AlertTriangle, Radio, Globe, 
  Smartphone, Phone, MapPin, Check, Zap, Eye
} from 'lucide-react';

export type UserType = 'national_authority' | 'state_officer' | 'district_officer' | 'citizen';

export interface AuthUser {
  name: string;
  role: string;
  agency: string;
  badgeId?: string;
  phone?: string;
  userType: UserType;
  assignedState?: string;
  assignedDistrict?: string;
  assignedCityId?: string;
  allowedStates: string[];
  clearanceLevel: number;
}

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [authTab, setAuthTab] = useState<UserType>('national_authority');

  // National Officer Form State
  const [nationalBadgeId, setNationalBadgeId] = useState('NDMA-HQ-01');
  const [nationalAgency, setNationalAgency] = useState('National Disaster Management Authority (NDMA HQ)');

  // State Sub-Officer Form State
  const [stateBadgeId, setStateBadgeId] = useState('MH-SDMA-442');
  const [assignedState, setAssignedState] = useState('Maharashtra');

  // District Officer Form State
  const [districtBadgeId, setDistrictBadgeId] = useState('MUM-DDMA-09');
  const [assignedDistrict, setAssignedDistrict] = useState('Mumbai Suburban / Mithi River Ward');
  const [districtCityId, setDistrictCityId] = useState('mumbai_monsoon');

  // Citizen Form State
  const [citizenMobile, setCitizenMobile] = useState('+91 98765 43210');
  const [citizenCity, setCitizenCity] = useState('mumbai_monsoon');

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const stateCityMap: Record<string, { cityId: string; label: string; district: string }> = {
    'Maharashtra': { cityId: 'mumbai_monsoon', label: 'Mumbai Mithi Basin (MH)', district: 'Mumbai Suburban District' },
    'Delhi NCR': { cityId: 'delhi_yamuna', label: 'Delhi Yamuna Floodplain (NCR)', district: 'North-East Delhi District' },
    'Karnataka': { cityId: 'bengaluru_lakes', label: 'Bengaluru Lake Corridor (KA)', district: 'Bengaluru Urban District' },
    'Tamil Nadu': { cityId: 'chennai_cyclone', label: 'Chennai Cyclone Surge (TN)', district: 'Chennai Coastal District' },
    'West Bengal': { cityId: 'kolkata_hooghly', label: 'Kolkata Hooghly Surge (WB)', district: 'Kolkata Metropolitan District' },
    'Gujarat': { cityId: 'gujarat_tapi', label: 'Surat Tapi Surge (GJ)', district: 'Surat District' },
    'Kerala': { cityId: 'kerala_periyar', label: 'Kochi Periyar Dam (KL)', district: 'Ernakulam District' },
    'Assam': { cityId: 'assam_brahmaputra', label: 'Guwahati Brahmaputra (AS)', district: 'Kamrup Metropolitan District' },
    'Sikkim': { cityId: 'sikkim_teesta', label: 'Gangtok Teesta Basin (SK)', district: 'East Sikkim District' },
    'Uttar Pradesh': { cityId: 'uttar_pradesh_ganga', label: 'Varanasi Ganga (UP)', district: 'Varanasi District' },
    'Madhya Pradesh': { cityId: 'madhya_pradesh_narmada', label: 'Jabalpur Narmada (MP)', district: 'Jabalpur District' },
    'Bihar': { cityId: 'bihar_kosi', label: 'Patna Kosi Catchment (BR)', district: 'Patna District' },
    'Uttarakhand': { cityId: 'uttarakhand_cloudburst', label: 'Rishikesh Himalayan Surge (UK)', district: 'Dehradun District' },
    'Himachal Pradesh': { cityId: 'himachal_beas', label: 'Kullu Beas Surge (HP)', district: 'Kullu District' },
    'Punjab': { cityId: 'punjab_sutlej', label: 'Ludhiana Sutlej Basin (PB)', district: 'Ludhiana District' },
    'Andhra Pradesh': { cityId: 'andhra_krishna', label: 'Vijayawada Krishna Delta (AP)', district: 'Krishna District' },
    'Telangana': { cityId: 'telangana_musi', label: 'Hyderabad Musi Basin (TS)', district: 'Hyderabad District' },
    'Rajasthan': { cityId: 'rajasthan_luni', label: 'Jodhpur Luni Basin (RJ)', district: 'Jodhpur District' },
    'Jammu & Kashmir': { cityId: 'jammu_jhelum', label: 'Srinagar Jhelum Valley (JK)', district: 'Srinagar District' },
    'Goa': { cityId: 'goa_mandovi', label: 'Panaji Mandovi Estuary (GA)', district: 'North Goa District' },
    'Tripura': { cityId: 'tripura_howrah', label: 'Agartala Howrah River (TR)', district: 'West Tripura District' },
    'Meghalaya': { cityId: 'meghalaya_cherrapunji', label: 'Shillong Cherrapunji (ML)', district: 'East Khasi Hills District' },
    'Manipur': { cityId: 'manipur_imphal', label: 'Imphal Loktak Basin (MN)', district: 'Imphal West District' },
    'Jharkhand': { cityId: 'jharkhand_subarnarekha', label: 'Ranchi Subarnarekha (JH)', district: 'Ranchi District' },
    'Chhattisgarh': { cityId: 'chhattisgarh_mahanadi', label: 'Raipur Hasdeo Bango (CG)', district: 'Raipur District' },
    'Haryana': { cityId: 'haryana_gurugram', label: 'Gurugram Najafgarh (HR)', district: 'Gurugram District' },
    'Odisha': { cityId: 'odisha_mahanadi', label: 'Bhubaneswar Mahanadi (OD)', district: 'Khordha District' },
    'Andaman & Nicobar': { cityId: 'andaman_portblair', label: 'Port Blair Island Coast (AN)', district: 'South Andaman District' },
    'Ladakh': { cityId: 'ladakh_indus', label: 'Leh Indus Valley (LA)', district: 'Leh District' },
    'Arunachal Pradesh': { cityId: 'arunachal_siang', label: 'Itanagar Siang Basin (AR)', district: 'Papum Pare District' },
    'Mizoram': { cityId: 'mizoram_tlawng', label: 'Aizawl Tlawng Valley (MZ)', district: 'Aizawl District' },
    'Nagaland': { cityId: 'nagaland_doyang', label: 'Kohima Dimapur Doyang (NL)', district: 'Kohima District' },
    'Chandigarh': { cityId: 'chandigarh_sukhna', label: 'Chandigarh Sukhna Lake (CH)', district: 'Chandigarh District' },
    'Dadra and Nagar Haveli and Daman and Diu': { cityId: 'daman_damanganga', label: 'Daman Damanganga (DD)', district: 'Daman District' },
    'Lakshadweep': { cityId: 'lakshadweep_kavaratti', label: 'Kavaratti Coral Atoll (LD)', district: 'Lakshadweep District' },
    'Puducherry': { cityId: 'puducherry_coastal', label: 'Puducherry Coromandel Coast (PY)', district: 'Puducherry District' }
  };

  const handleQuickDemo = (role: UserType, stateName: string = 'Maharashtra') => {
    setAuthTab(role);
    if (role === 'national_authority') {
      setNationalBadgeId('NDMA-HQ-01');
      setNationalAgency('National Disaster Management Authority (NDMA HQ)');
    } else if (role === 'state_officer') {
      setAssignedState(stateName);
      setStateBadgeId(`${stateName.slice(0, 2).toUpperCase()}-SDMA-108`);
    } else if (role === 'district_officer') {
      const mapItem = stateCityMap[stateName] || stateCityMap['Maharashtra'];
      setAssignedDistrict(mapItem.district);
      setDistrictCityId(mapItem.cityId);
      setDistrictBadgeId(`${mapItem.district.slice(0, 3).toUpperCase()}-DDMA-01`);
    } else {
      setCitizenMobile('+91 98765 43210');
      setCitizenCity('mumbai_monsoon');
    }
  };

  const handleNationalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthSuccess(true);
      setTimeout(() => {
        onLogin({
          name: 'Dr. Rajiv Malhotra, IAS',
          role: 'Chief National Incident Commander',
          agency: nationalAgency,
          badgeId: nationalBadgeId,
          userType: 'national_authority',
          allowedStates: ['ALL'],
          clearanceLevel: 5
        });
      }, 400);
    }, 500);
  };

  const handleStateOfficerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    const mapping = stateCityMap[assignedState] || { cityId: 'mumbai_monsoon', label: `${assignedState} Zone`, district: 'State Headquarters' };

    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthSuccess(true);
      setTimeout(() => {
        onLogin({
          name: `Officer S. Kulkarni (${assignedState} SDMA)`,
          role: `State Relief Commissioner (${assignedState})`,
          agency: `${assignedState} State Disaster Management Authority`,
          badgeId: stateBadgeId,
          userType: 'state_officer',
          assignedState: assignedState,
          assignedCityId: mapping.cityId,
          allowedStates: [assignedState],
          clearanceLevel: 3
        });
      }, 400);
    }, 500);
  };

  const handleDistrictOfficerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthSuccess(true);
      setTimeout(() => {
        onLogin({
          name: `District Magistrate (${assignedDistrict})`,
          role: `District Disaster Magistrate / Collector`,
          agency: `${assignedDistrict} DDMA Command Cell`,
          badgeId: districtBadgeId,
          userType: 'district_officer',
          assignedDistrict: assignedDistrict,
          assignedCityId: districtCityId,
          allowedStates: [assignedState],
          clearanceLevel: 2
        });
      }, 400);
    }, 500);
  };

  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthSuccess(true);
      setTimeout(() => {
        onLogin({
          name: `Citizen (${citizenMobile.slice(-4)})`,
          role: 'Resident Civilian (Public Access)',
          agency: 'Civic Citizen Emergency Network',
          phone: citizenMobile,
          userType: 'citizen',
          assignedCityId: citizenCity,
          allowedStates: ['ALL'],
          clearanceLevel: 1
        });
      }, 400);
    }, 500);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#040711] text-slate-100 flex items-center justify-center p-4 select-none z-50 overflow-hidden font-sans">
      {/* High-Tech Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(0,210,255,0.12),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.08),transparent_50%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#0c1322_1px,transparent_1px),linear-gradient(to_bottom,#0c1322_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40 pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative w-full max-w-5xl rounded-3xl border border-cyan-500/30 p-8 shadow-[0_0_100px_rgba(0,210,255,0.2)] flex flex-col lg:flex-row gap-8 bg-[#070b16]/95 backdrop-blur-2xl">
        
        {/* Left Column: Branding & Role Hierarchy Info */}
        <div className="flex-1 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/80 pb-6 lg:pb-0 lg:pr-8 space-y-6">
          <div>
            <div className="flex items-center space-x-3.5 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/30 via-cyan-500/30 to-emerald-500/30 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_25px_rgba(0,210,255,0.35)]">
                <Activity className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-wider bg-gradient-to-r from-orange-400 via-white to-emerald-400 bg-clip-text text-transparent">
                  CIVICTWIN AI
                </h1>
                <p className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest">
                  India Multi-Tier Disaster Response Twin
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans mb-5">
              Government of India Smart City Disaster Management & Civil Defense Digital Twin with Role-Based Access Hierarchy.
            </p>

            {/* Quick Demo Pre-Fill Buttons for Hackathon Presentation */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 mb-5 space-y-2">
              <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>Quick 1-Click Demo Logins:</span>
              </div>
              <div className="flex flex-wrap gap-2 text-[11px] font-mono font-bold">
                <button
                  onClick={() => handleQuickDemo('national_authority')}
                  className="px-2.5 py-1 rounded-lg bg-blue-950/90 hover:bg-blue-900 border border-blue-500/60 text-blue-200 transition-all flex items-center space-x-1"
                >
                  <span>🏛️ National HQ</span>
                </button>
                <button
                  onClick={() => handleQuickDemo('state_officer', 'Maharashtra')}
                  className="px-2.5 py-1 rounded-lg bg-purple-950/90 hover:bg-purple-900 border border-purple-500/60 text-purple-200 transition-all flex items-center space-x-1"
                >
                  <span>🏢 MH SDMA</span>
                </button>
                <button
                  onClick={() => handleQuickDemo('state_officer', 'Delhi NCR')}
                  className="px-2.5 py-1 rounded-lg bg-purple-950/90 hover:bg-purple-900 border border-purple-500/60 text-purple-200 transition-all flex items-center space-x-1"
                >
                  <span>🏢 Delhi DDMA</span>
                </button>
                <button
                  onClick={() => handleQuickDemo('citizen')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-200 transition-all flex items-center space-x-1"
                >
                  <span>📱 Public Citizen</span>
                </button>
              </div>
            </div>

            {/* Role Clearance Hierarchy Table */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                🔐 Access Clearance Matrix:
              </label>

              {/* National Authority Card */}
              <div 
                onClick={() => setAuthTab('national_authority')}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  authTab === 'national_authority'
                    ? 'bg-blue-950/80 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span className="flex items-center space-x-2 text-blue-400">
                    <Building2 className="w-4 h-4" />
                    <span>1. National Command Head</span>
                  </span>
                  <span className="text-[9px] px-2 py-0.5 bg-blue-900/60 text-blue-300 rounded-full border border-blue-600 font-mono font-bold">
                    Level 5 • All 28 States
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-sans">
                  Full control: All 28 states & UTs, 100-year storm injection, levee breach controls, Voice Radio Copilot, and 1-click NDMA ICS-201 PDF generator.
                </p>
              </div>

              {/* State Sub-Officer Card */}
              <div 
                onClick={() => setAuthTab('state_officer')}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  authTab === 'state_officer'
                    ? 'bg-purple-950/80 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span className="flex items-center space-x-2 text-purple-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>2. State Officer (SDMA)</span>
                  </span>
                  <span className="text-[9px] px-2 py-0.5 bg-purple-900/60 text-purple-300 rounded-full border border-purple-600 font-mono font-bold">
                    Level 3 • State-Wise Control
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-sans">
                  State-level control: State SDRF battalions, state power grid substations, and state-wide green evacuation corridors.
                </p>
              </div>

              {/* District Officer Card */}
              <div 
                onClick={() => setAuthTab('district_officer')}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  authTab === 'district_officer'
                    ? 'bg-amber-950/80 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span className="flex items-center space-x-2 text-amber-400">
                    <Activity className="w-4 h-4" />
                    <span>3. District Magistrate (DDMA)</span>
                  </span>
                  <span className="text-[9px] px-2 py-0.5 bg-amber-900/60 text-amber-300 rounded-full border border-amber-600 font-mono font-bold">
                    Level 2 • District-Level Control
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-sans">
                  District & Municipal Ward control: Local dewatering pumps, subway underpasses, and district stadium relief shelters.
                </p>
              </div>

              {/* Citizen Card */}
              <div 
                onClick={() => setAuthTab('citizen')}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  authTab === 'citizen'
                    ? 'bg-emerald-950/80 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span className="flex items-center space-x-2 text-emerald-400">
                    <Smartphone className="w-4 h-4" />
                    <span>4. Public Citizen (Open Access)</span>
                  </span>
                  <span className="text-[9px] px-2 py-0.5 bg-emerald-900/60 text-emerald-300 rounded-full border border-emerald-600 font-mono font-bold">
                    Level 1 • Open Access
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-sans">
                  Public safety hub: Live IMD weather forecasts, 1-tap helplines, WhatsApp bot, and 1-click real-time GPS Location SOS beacon.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-800/80">
            <span>NDMA CAP Protocol Compliant</span>
            <span>256-Bit Encrypted AES</span>
          </div>
        </div>

        {/* Right Column: Tabbed Login Form */}
        <div className="flex-1 flex flex-col justify-center">
          
          {/* Top Auth Mode Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 bg-slate-950/90 border border-slate-800 rounded-2xl mb-5 text-xs font-mono font-bold">
            <button
              onClick={() => setAuthTab('national_authority')}
              className={`py-2 rounded-xl transition-all text-center flex items-center justify-center space-x-1 ${
                authTab === 'national_authority'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>National</span>
            </button>
            <button
              onClick={() => setAuthTab('state_officer')}
              className={`py-2 rounded-xl transition-all text-center flex items-center justify-center space-x-1 ${
                authTab === 'state_officer'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>State SDMA</span>
            </button>
            <button
              onClick={() => setAuthTab('district_officer')}
              className={`py-2 rounded-xl transition-all text-center flex items-center justify-center space-x-1 ${
                authTab === 'district_officer'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>District DDMA</span>
            </button>
            <button
              onClick={() => setAuthTab('citizen')}
              className={`py-2 rounded-xl transition-all text-center flex items-center justify-center space-x-1 ${
                authTab === 'citizen'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Public</span>
            </button>
          </div>

          {/* TAB 1: National Authority Login */}
          {authTab === 'national_authority' && (
            <form onSubmit={handleNationalSubmit} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span>National Command Head & NDMA HQ Login</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Full clearance across all 28 Indian disaster corridors and central executive tools.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold">National Officer Badge ID:</label>
                <input
                  type="text"
                  value={nationalBadgeId}
                  onChange={(e) => setNationalBadgeId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                {isAuthenticating ? <span>AUTHENTICATING LEVEL 5 CLEARANCE...</span> : <span>👑 ACCESS NATIONAL COMMAND CONSOLE</span>}
              </button>
            </form>
          )}

          {/* TAB 2: State Officer Login */}
          {authTab === 'state_officer' && (
            <form onSubmit={handleStateOfficerSubmit} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>State Disaster Management Authority (SDMA)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Restricted to assigned state civil defense infrastructure and SDRF battalions.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold">Assigned State Jurisdiction:</label>
                <select
                  value={assignedState}
                  onChange={(e) => {
                    setAssignedState(e.target.value);
                    setStateBadgeId(`${e.target.value.slice(0, 2).toUpperCase()}-SDMA-108`);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                >
                  {Object.keys(stateCityMap).map((st) => (
                    <option key={st} value={st}>{st} SDMA</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                {isAuthenticating ? <span>AUTHENTICATING STATE OFFICER...</span> : <span>🏛️ ACCESS {assignedState.toUpperCase()} SDMA CONSOLE</span>}
              </button>
            </form>
          )}

          {/* TAB 3: District Officer Login */}
          {authTab === 'district_officer' && (
            <form onSubmit={handleDistrictOfficerSubmit} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>District Magistrate & Collector (DDMA)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Hyper-local district control: Municipal pumps, subway underpasses, and ward shelters.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300 font-semibold">Assigned District / Municipal Ward:</label>
                <select
                  value={assignedDistrict}
                  onChange={(e) => {
                    setAssignedDistrict(e.target.value);
                    const found = Object.values(stateCityMap).find(m => m.district === e.target.value);
                    if (found) setDistrictCityId(found.cityId);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                >
                  {Object.values(stateCityMap).map((m) => (
                    <option key={m.district} value={m.district}>{m.district} ({m.label.split('(')[1]?.replace(')', '') || 'DDMA'})</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                {isAuthenticating ? <span>AUTHENTICATING DISTRICT MAGISTRATE...</span> : <span>🏢 ACCESS DISTRICT DDMA CONSOLE</span>}
              </button>
            </form>
          )}

          {/* TAB 4: Citizen Portal */}
          {authTab === 'citizen' && (
            <form onSubmit={handleCitizenSubmit} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Public Citizen Open Access Portal</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct access to live IMD weather forecasts, emergency helplines, and 1-click GPS SOS.
                </p>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <span>👥 ENTER PUBLIC CITIZEN PORTAL (NO LOGIN REQUIRED)</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
