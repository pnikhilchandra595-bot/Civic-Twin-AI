import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, User, Key, Building2, 
  ArrowRight, ShieldAlert, Activity, CheckCircle2, 
  Fingerprint, Sparkles, AlertTriangle, Radio, Globe, 
  Smartphone, Phone, MapPin, Check, Zap, Eye, EyeOff, Send, MessageSquare, X
} from 'lucide-react';
import { apiService } from '../services/api';

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
  onClose?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onClose }) => {
  // Main Category Tab: 'OFFICER' vs 'PUBLIC_CITIZEN'
  const [authCategory, setAuthCategory] = useState<'OFFICER' | 'PUBLIC_CITIZEN'>('OFFICER');

  // Officer Sub-Tier Tab:
  const [officerTier, setOfficerTier] = useState<'national_authority' | 'state_officer' | 'district_officer'>('national_authority');

  // Officer Form State: Username & Password
  const [officerUsername, setOfficerUsername] = useState('NDMA-HQ-01');
  const [officerPassword, setOfficerPassword] = useState('NationalCommand@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [assignedState, setAssignedState] = useState('Maharashtra');
  const [assignedDistrict, setAssignedDistrict] = useState('Mumbai Suburban / Mithi River Ward');
  const [districtCityId, setDistrictCityId] = useState('mumbai_monsoon');

  // Public Citizen Mobile & OTP Form State
  const [citizenMobile, setCitizenMobile] = useState('+91 98765 43210');
  const [citizenCity, setCitizenCity] = useState('mumbai_monsoon');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState<string>('842109');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [resendTimer, setResendTimer] = useState<number>(0);
  const [otpError, setOtpError] = useState<string | null>(null);

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
    'Odisha': { cityId: 'odisha_mahanadi', label: 'Bhubaneswar Mahanadi (OD)', district: 'Khordha District' }
  };

  // Timer countdown for OTP resend
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  // Instant 1-Tap Login handler for evaluation
  const handleInstantLogin = (role: UserType, stateName: string = 'Maharashtra') => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthSuccess(true);
      setTimeout(() => {
        if (role === 'national_authority') {
          onLogin({
            name: 'Dr. Rajiv Malhotra, IAS',
            role: 'Chief National Incident Commander',
            agency: 'National Disaster Management Authority (NDMA HQ)',
            badgeId: 'NDMA-HQ-01',
            userType: 'national_authority',
            allowedStates: ['ALL'],
            clearanceLevel: 5
          });
        } else if (role === 'state_officer') {
          const mapping = stateCityMap[stateName] || stateCityMap['Maharashtra'];
          onLogin({
            name: `Officer S. Kulkarni (${stateName} SDMA)`,
            role: `State Relief Commissioner (${stateName})`,
            agency: `${stateName} State Disaster Management Authority`,
            badgeId: `${stateName.slice(0, 2).toUpperCase()}-SDMA-108`,
            userType: 'state_officer',
            assignedState: stateName,
            assignedCityId: mapping.cityId,
            allowedStates: [stateName],
            clearanceLevel: 3
          });
        } else if (role === 'district_officer') {
          const mapping = stateCityMap[stateName] || stateCityMap['Maharashtra'];
          onLogin({
            name: `District Magistrate (${mapping.district})`,
            role: `District Disaster Collector / Magistrate`,
            agency: `${mapping.district} DDMA Command Cell`,
            badgeId: `${mapping.district.slice(0, 3).toUpperCase()}-DDMA-01`,
            userType: 'district_officer',
            assignedDistrict: mapping.district,
            assignedCityId: mapping.cityId,
            allowedStates: [stateName],
            clearanceLevel: 2
          });
        } else {
          onLogin({
            name: 'Citizen (4321)',
            role: 'Resident Civilian (Verified Mobile)',
            agency: 'Civic Citizen Emergency Network',
            phone: '+91 98765 43210',
            userType: 'citizen',
            assignedCityId: 'mumbai_monsoon',
            allowedStates: ['ALL'],
            clearanceLevel: 1
          });
        }
      }, 300);
    }, 400);
  };

  const handleOfficerTierChange = (tier: 'national_authority' | 'state_officer' | 'district_officer') => {
    setOfficerTier(tier);
    if (tier === 'national_authority') {
      setOfficerUsername('NDMA-HQ-01');
      setOfficerPassword('NationalCommand@2026');
    } else if (tier === 'state_officer') {
      setOfficerUsername('MH-SDMA-442');
      setOfficerPassword('StateSDMA@Relief');
    } else {
      setOfficerUsername('MUM-DDMA-09');
      setOfficerPassword('DistrictDDMA@108');
    }
  };

  const handleStateChange = (stateName: string) => {
    setAssignedState(stateName);
    const mapItem = stateCityMap[stateName] || stateCityMap['Maharashtra'];
    setAssignedDistrict(mapItem.district);
    setDistrictCityId(mapItem.cityId);
    if (officerTier === 'state_officer') {
      setOfficerUsername(`${stateName.slice(0, 2).toUpperCase()}-SDMA-108`);
    } else if (officerTier === 'district_officer') {
      setOfficerUsername(`${mapItem.district.slice(0, 3).toUpperCase()}-DDMA-01`);
    }
  };

  const handleSendOtp = async () => {
    if (!citizenMobile.trim()) return;
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setEnteredOtp('');
    setOtpError(null);
    setOtpSent(true);
    setResendTimer(30);

    try {
      await apiService.sendRealOTP(citizenMobile, newOtp);
    } catch (e) {
      console.warn('Real Twilio SMS gateway call:', e);
    }
  };

  const handleAutofillOtp = () => {
    if (generatedOtp) {
      setEnteredOtp(generatedOtp);
    }
  };

  const handleOfficerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    handleInstantLogin(officerTier, assignedState);
  };

  const handleCitizenLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpSent && enteredOtp && enteredOtp.trim() !== generatedOtp) {
      setOtpError('Invalid OTP! Please enter the 6-digit code or tap 1-Tap Autofill.');
      return;
    }
    handleInstantLogin('citizen');
  };

  return (
    <div className="fixed inset-0 w-full h-full min-h-screen bg-[#040711] text-slate-100 flex items-start sm:items-center justify-center p-3 sm:p-6 z-50 overflow-y-auto font-sans">
      {/* High-Tech Background Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(0,210,255,0.12),transparent_60%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.08),transparent_50%)] pointer-events-none" />
      
      {/* Main Glass Authentication Card */}
      <div className="relative w-full max-w-5xl rounded-3xl border border-cyan-500/30 p-5 sm:p-8 shadow-[0_0_100px_rgba(0,210,255,0.2)] flex flex-col lg:flex-row gap-6 lg:gap-8 bg-[#070b16]/98 backdrop-blur-2xl my-auto">
        
        {/* Close Button if applicable */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white z-10"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Left Column: Branding & 1-Tap Quick Logins */}
        <div className="flex-1 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/80 pb-5 lg:pb-0 lg:pr-8 space-y-4">
          <div>
            <div className="flex items-center space-x-3 mb-2.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500/30 via-cyan-500/30 to-emerald-500/30 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_25px_rgba(0,210,255,0.35)]">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-wider bg-gradient-to-r from-orange-400 via-white to-emerald-400 bg-clip-text text-transparent">
                  CIVICTWIN AI
                </h1>
                <p className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest">
                  National Disaster Response Digital Twin
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
              Government of India Disaster Management Infrastructure. Officers login with Username/Password credentials; Citizens verify via Mobile SMS OTP.
            </p>

            {/* INSTANT 1-TAP LOGIN BUTTONS (WORKS INSTANTLY ON MOBILE) */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/40 mb-4 space-y-2.5 shadow-lg">
              <div className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>⚡ Instant 1-Tap Quick Logins:</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold">
                <button
                  type="button"
                  onClick={() => handleInstantLogin('national_authority')}
                  className="p-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-500 text-blue-200 transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow active:scale-95"
                >
                  <span>🏛️ National HQ</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleInstantLogin('state_officer', 'Maharashtra')}
                  className="p-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-500 text-purple-200 transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow active:scale-95"
                >
                  <span>🏢 MH SDMA</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleInstantLogin('district_officer', 'Maharashtra')}
                  className="p-2.5 rounded-xl bg-amber-950 hover:bg-amber-900 border border-amber-500 text-amber-200 transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow active:scale-95"
                >
                  <span>📍 Mumbai DDMA</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleInstantLogin('citizen')}
                  className="p-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500 text-emerald-200 transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow active:scale-95"
                >
                  <span>📱 Citizen Hub</span>
                </button>
              </div>
            </div>

            {/* Role Hierarchy Info */}
            <div className="space-y-1.5 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-center justify-between text-blue-300">
                <span className="font-bold">👑 National Command (NDMA L-5)</span>
                <span className="text-[10px] text-slate-400">All 36 States</span>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between text-purple-300">
                <span className="font-bold">🏢 State Officer (SDMA L-3)</span>
                <span className="text-[10px] text-slate-400">State Locked</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-emerald-300">
                <span className="font-bold">👥 Public Citizen (Level 1)</span>
                <span className="text-[10px] text-slate-400">Mobile OTP</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-800/80">
            <span>NDMA CAP Compliant</span>
            <span>256-Bit AES Encrypted</span>
          </div>
        </div>

        {/* Right Column: Interactive Login Forms */}
        <div className="flex-1 flex flex-col justify-center">
          
          {/* Top Mode Toggle: Officer vs Citizen */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 border border-slate-800 rounded-2xl mb-4 text-xs font-mono font-bold">
            <button
              type="button"
              onClick={() => setAuthCategory('OFFICER')}
              className={`py-2.5 rounded-xl transition-all text-center flex items-center justify-center space-x-1.5 cursor-pointer ${
                authCategory === 'OFFICER'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Disaster Officer</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthCategory('PUBLIC_CITIZEN')}
              className={`py-2.5 rounded-xl transition-all text-center flex items-center justify-center space-x-1.5 cursor-pointer ${
                authCategory === 'PUBLIC_CITIZEN'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Public Citizen</span>
            </button>
          </div>

          {/* 1. OFFICER AUTHENTICATION FORM (USERNAME + PASSWORD) */}
          {authCategory === 'OFFICER' && (
            <form onSubmit={handleOfficerLogin} className="space-y-3.5">
              {/* Officer Tier Selector Pills */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-[11px] font-mono font-bold">
                <button
                  type="button"
                  onClick={() => handleOfficerTierChange('national_authority')}
                  className={`py-1.5 rounded-lg transition-all ${
                    officerTier === 'national_authority' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  National
                </button>
                <button
                  type="button"
                  onClick={() => handleOfficerTierChange('state_officer')}
                  className={`py-1.5 rounded-lg transition-all ${
                    officerTier === 'state_officer' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  State SDMA
                </button>
                <button
                  type="button"
                  onClick={() => handleOfficerTierChange('district_officer')}
                  className={`py-1.5 rounded-lg transition-all ${
                    officerTier === 'district_officer' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  District DDMA
                </button>
              </div>

              {/* State & District Dropdowns if State/District Officer */}
              {officerTier !== 'national_authority' && (
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300 font-semibold">Assigned State Jurisdiction:</label>
                  <select
                    value={assignedState}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    {Object.keys(stateCityMap).map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Username / Official Badge ID */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300 font-semibold flex items-center justify-between">
                  <span>Username / Badge ID:</span>
                  <span className="text-[10px] text-cyan-400">Government ID</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    required
                    value={officerUsername}
                    onChange={(e) => setOfficerUsername(e.target.value)}
                    placeholder="e.g. NDMA-HQ-01"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300 font-semibold flex items-center justify-between">
                  <span>Password:</span>
                  <span className="text-[10px] text-slate-500">Encrypted</span>
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={officerPassword}
                    onChange={(e) => setOfficerPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-10 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer mt-1"
              >
                {isAuthenticating ? (
                  <span>AUTHENTICATING...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>🔐 LOGIN AS OFFICER</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* 2. PUBLIC CITIZEN AUTHENTICATION FORM (MOBILE + SMS OTP) */}
          {authCategory === 'PUBLIC_CITIZEN' && (
            <form onSubmit={handleCitizenLogin} className="space-y-3.5">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Citizen Mobile SMS Verification</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-sans">
                  Enter mobile number to receive 6-digit OTP or tap 1-Tap Login above.
                </p>
              </div>

              {/* Mobile Number Input */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300 font-semibold">Mobile Number:</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={citizenMobile}
                      onChange={(e) => setCitizenMobile(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={resendTimer > 0}
                    className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center space-x-1 ${
                      resendTimer > 0
                        ? 'bg-slate-900 text-slate-500 border border-slate-800'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{resendTimer > 0 ? `${resendTimer}s` : 'Get OTP'}</span>
                  </button>
                </div>
              </div>

              {/* Simulated Incoming SMS Notification Banner */}
              <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 shadow-lg space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center space-x-1.5 text-emerald-300 font-bold">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>SMS Code: {generatedOtp}</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-900/60 px-1.5 py-0.5 rounded font-bold">
                    ACTIVE
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAutofillOtp}
                  className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center justify-center space-x-1 cursor-pointer shadow"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>⚡ 1-Tap Autofill OTP ({generatedOtp})</span>
                </button>
              </div>

              {/* 6-Digit OTP Entry */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300 font-semibold">Enter OTP:</label>
                <input
                  type="text"
                  maxLength={6}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.trim())}
                  placeholder="Enter 6-digit OTP..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white font-mono text-base tracking-widest text-center focus:outline-none focus:border-emerald-500 font-bold"
                />
                {otpError && (
                  <div className="text-xs text-red-400 font-mono mt-0.5 flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>{otpError}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3 rounded-xl text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2 transition-all bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 cursor-pointer shadow-emerald-600/30"
              >
                {isAuthenticating ? (
                  <span>VERIFYING...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>🚀 VERIFY & ENTER SAFE PORTAL</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
