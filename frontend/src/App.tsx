import React, { useState, useEffect } from 'react';
import { 
  CityDigitalTwinState, InfrastructureNode, SensorReading, EvacuationRoute 
} from './types/digital_twin';
import { apiService, RadioMessage, SatelliteSARReport, LiveSmsBatchResult } from './services/api';
import { Header } from './components/Header';
import { DigitalTwinMap } from './components/DigitalTwinMap';
import { CascadeFailureGraph } from './components/CascadeFailureGraph';
import { SensorTelemetryPanel } from './components/SensorTelemetryPanel';
import { IncidentCommanderPanel } from './components/IncidentCommanderPanel';
import { TacticalRadioFeed } from './components/TacticalRadioFeed';
import { ScenarioSandbox } from './components/ScenarioSandbox';
import { NodeInspectorModal } from './components/NodeInspectorModal';
import { BroadcastModal } from './components/BroadcastModal';
import { SatelliteSARModal } from './components/SatelliteSARModal';
import { TutorialModal } from './components/TutorialModal';
import { DataExportModal } from './components/DataExportModal';
import { LoginPage, AuthUser } from './components/LoginPage';
import { CitizenSOSModal } from './components/CitizenSOSModal';
import { DroneCCTVModal } from './components/DroneCCTVModal';
import { VoiceRadioCoPilot } from './components/VoiceRadioCoPilot';
import { MultiHazardModal } from './components/MultiHazardModal';
import { IntegrationsModal } from './components/IntegrationsModal';
import { DataProvenanceModal } from './components/DataProvenanceModal';
import { ICS201ActionPlanModal } from './components/ICS201ActionPlanModal';
import { MobileCompanionModal } from './components/MobileCompanionModal';
import { ElevationProfileModal } from './components/ElevationProfileModal';
import { DamHydrographModal } from './components/DamHydrographModal';
import { HospitalSurgeModal } from './components/HospitalSurgeModal';
import { MeshNetworkModal } from './components/MeshNetworkModal';
import { GeminiAIModal } from './components/GeminiAIModal';
import { CitizenPortalView } from './components/CitizenPortalView';
import { LiveWeatherModal } from './components/LiveWeatherModal';
import { PublicScrollingPortal } from './components/PublicScrollingPortal';
import { WhatsAppSimulatorModal } from './components/WhatsAppSimulatorModal';
import { PublicGPSLocationSOSModal } from './components/PublicGPSLocationSOSModal';
import { MobileHeadAppModal } from './components/MobileHeadAppModal';
import { DistrictSelectionModal } from './components/DistrictSelectionModal';
import { CitizenQRCodeModal } from './components/CitizenQRCodeModal';
import { 
  Bell, Compass, Layers, Activity, ShieldAlert, MessageSquare, 
  Video, AlertOctagon, Skull, Radar, Sparkles, ChevronDown, Radio as RadioIcon,
  QrCode, TrendingUp
} from 'lucide-react';
import { DEFAULT_FALLBACK_STATE } from './data/defaultTwinState';

export const App: React.FC = () => {
  // Authentication state
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('civictwin_officer');
    return saved ? JSON.parse(saved) : null;
  });

  const [state, setState] = useState<CityDigitalTwinState>(DEFAULT_FALLBACK_STATE);
  
  // Device detection: Mobile is dedicated to Public Citizen Portal, Desktop has full Command Cockpit
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobileDevice(mobile);
      if (mobile) {
        setViewMode('SCROLLING_PORTAL');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // View mode: defaults to public portal on mobile, flexible on desktop
  const [viewMode, setViewMode] = useState<'SCROLLING_PORTAL' | 'COCKPIT'>('SCROLLING_PORTAL');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Selected deep analysis sub-tab in Section 4
  const [analysisTab, setAnalysisTab] = useState<'cascade' | 'telemetry' | 'iap' | 'sar'>('cascade');
  
  const [selectedNode, setSelectedNode] = useState<InfrastructureNode | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<SensorReading | null>(null);
  
  // Modals state
  const [isBroadcastOpen, setIsBroadcastOpen] = useState<boolean>(false);
  const [isSAROpen, setIsSAROpen] = useState<boolean>(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [isDataExportOpen, setIsDataExportOpen] = useState<boolean>(false);
  const [isCitizenSOSOpen, setIsCitizenSOSOpen] = useState<boolean>(false);
  const [isGPSLocationSOSOpen, setIsGPSLocationSOSOpen] = useState<boolean>(false);
  const [isDroneCCTVOpen, setIsDroneCCTVOpen] = useState<boolean>(false);
  const [isVoiceRadioOpen, setIsVoiceRadioOpen] = useState<boolean>(false);
  const [isMultiHazardOpen, setIsMultiHazardOpen] = useState<boolean>(false);
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState<boolean>(false);
  const [isProvenanceOpen, setIsProvenanceOpen] = useState<boolean>(false);
  const [isICS201Open, setIsICS201Open] = useState<boolean>(false);
  const [isMobileCompanionOpen, setIsMobileCompanionOpen] = useState<boolean>(false);
  const [isElevationOpen, setIsElevationOpen] = useState<boolean>(false);
  const [isDamOpen, setIsDamOpen] = useState<boolean>(false);
  const [isHospitalSurgeOpen, setIsHospitalSurgeOpen] = useState<boolean>(false);
  const [isMeshOpen, setIsMeshOpen] = useState<boolean>(false);
  const [isAICopilotOpen, setIsAICopilotOpen] = useState<boolean>(false);
  const [isLiveWeatherOpen, setIsLiveWeatherOpen] = useState<boolean>(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState<boolean>(false);
  const [isDistrictAtlasOpen, setIsDistrictAtlasOpen] = useState<boolean>(false);
  const [isQRCodeOpen, setIsQRCodeOpen] = useState<boolean>(false);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isSyncingWeather, setIsSyncingWeather] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false); // true while district synthesis is in progress
  
  const [radioMessages, setRadioMessages] = useState<RadioMessage[]>([]);
  const [sarReport, setSarReport] = useState<SatelliteSARReport | null>(null);
  const [toastAlert, setToastAlert] = useState<string | null>(null);

  // Initialize digital twin state, radio comms, and SAR
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const initialState = await apiService.getState();
        setState(initialState);
        const comms = await apiService.getRadioComms();
        setRadioMessages(comms);
        const sar = await apiService.getSatelliteSARReport();
        setSarReport(sar);
      } catch (err) {
        console.error('Failed to fetch initial state:', err);
      }
    };

    fetchInitial();

    // Connect WebSocket live streams
    apiService.connectWebSocket(
      (updatedState) => {
        setState(updatedState);
      },
      (newRadioMsg) => {
        setRadioMessages(prev => [...prev, newRadioMsg]);
      },
      (broadcastRecord) => {
        setToastAlert(`🚨 EAS BROADCAST TRANSMITTED: ${broadcastRecord.alert_type} to ${broadcastRecord.target_zones.join(', ')}`);
        setTimeout(() => setToastAlert(null), 6000);
      },
      (smsBatch) => {
        setToastAlert(`📱 LIVE SMS DISPATCHED: Alert delivered to ${smsBatch.total_recipients} recipient numbers`);
        setTimeout(() => setToastAlert(null), 6000);
      },
      (sosReport) => {
        setToastAlert(`🚨 CITIZEN SOS RECEIVED: ${sosReport.citizen_name} at ${sosReport.location_name} (${sosReport.victim_count} Victims)`);
        setTimeout(() => setToastAlert(null), 7000);
      }
    );

    return () => {
      apiService.disconnectWebSocket();
    };
  }, []);

  const handleLogin = (user: AuthUser) => {
    setAuthUser(user);
    localStorage.setItem('civictwin_officer', JSON.stringify(user));
  };

  const handleLogout = () => {
    setAuthUser(null);
    localStorage.removeItem('civictwin_officer');
  };

  const handleReset = async () => {
    try {
      const resetState = await apiService.resetScenario(state?.city_id || 'mumbai_monsoon');
      setState(resetState);
      setSelectedNode(null);
      setSelectedSensor(null);
    } catch (e) {
      console.error('Reset error:', e);
    }
  };

  const handleSwitchCity = async (cityId: string) => {
    try {
      const switchedState = await apiService.switchCity(cityId);
      setState(switchedState);
      setSelectedNode(null);
      setSelectedSensor(null);
      const sar = await apiService.getSatelliteSARReport();
      setSarReport(sar);
    } catch (e) {
      console.error('City switch error:', e);
    }
  };

  const handleSyncLiveWeather = async () => {
    try {
      setIsSyncingWeather(true);
      const res = await apiService.syncLiveWeather();
      setState(res.state);
      setToastAlert(`🌧️ Synced live IMD telemetry: ${res.weather.precipitation_mmhr} mm/h rain, ${res.weather.wind_speed_kmh} km/h wind`);
      setTimeout(() => setToastAlert(null), 5000);
    } catch (e) {
      console.error('Weather sync error:', e);
      setToastAlert(`⚠️ Weather API sync failed, check internet connection.`);
      setTimeout(() => setToastAlert(null), 4000);
    } finally {
      setIsSyncingWeather(false);
    }
  };

  const handleSendRadio = async (msg: string, channel: string, priority: string) => {
    try {
      const callsign = authUser ? authUser.name.split(',')[0] : 'Tactical Unit';
      await apiService.sendRadioMessage(channel, callsign, msg, priority);
    } catch (e) {
      console.error('Send radio error:', e);
    }
  };

  const handleTogglePlayback = async () => {
    try {
      const res = await apiService.setPlayback('toggle', playbackSpeed);
      setIsPlaying(res.is_playing);
    } catch (e) {
      console.error('Playback toggle error:', e);
    }
  };

  const handleResolveLocation = async (query: string = '', lat?: number, lng?: number) => {
    try {
      setIsSyncing(true);
      setToastAlert(`🔍 Resolving micro-catchment terrain & infrastructure...`);
      const newState = await apiService.resolvePanIndiaLocation(query, lat, lng);
      setState(newState);
      setToastAlert(`✅ Digital Twin Synthesized for ${newState.city_name}`);
      setTimeout(() => setToastAlert(null), 4000);
    } catch (e) {
      console.error('Resolve location error:', e);
      setToastAlert(`❌ Failed to resolve location. Try another district.`);
      setTimeout(() => setToastAlert(null), 3500);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSetSpeed = async (speed: number) => {
    try {
      setPlaybackSpeed(speed);
      const res = await apiService.setPlayback(isPlaying ? 'play' : 'pause', speed);
      setIsPlaying(res.is_playing);
    } catch (e) {
      console.error('Set speed error:', e);
    }
  };

  // If user requests login modal specifically
  if (isLoginModalOpen && !authUser) {
    return <LoginPage onLogin={(user) => { handleLogin(user); setIsLoginModalOpen(false); if (user.userType !== 'citizen') setViewMode('COCKPIT'); }} />;
  }

  // If user is in SCROLLING_PORTAL mode
  if (viewMode === 'SCROLLING_PORTAL') {
    return (
      <div className="min-h-screen w-full bg-[#040711] text-slate-100 flex flex-col">
        <PublicScrollingPortal
          state={state}
          authUser={authUser}
          onSwitchCity={handleSwitchCity}
          onLaunchFullCockpit={() => {
            if (isMobileDevice) {
              setToastAlert('💻 Full Multi-Hazard Digital Twin & Sandbox is designed for Desktop screens. Mobile is dedicated to Public Safety & Helplines.');
              setTimeout(() => setToastAlert(null), 5000);
            } else {
              setViewMode('COCKPIT');
            }
          }}
          onOpenGemini={() => setIsAICopilotOpen(true)}
          onOpenSatelliteSAR={() => setIsSAROpen(true)}
          onOpenDroneCCTV={() => setIsDroneCCTVOpen(true)}
          onOpenWeather={() => setIsLiveWeatherOpen(true)}
          onOpenCitizenSOS={() => setIsCitizenSOSOpen(true)}
          onOpenGPSLocationSOS={() => setIsGPSLocationSOSOpen(true)}
          onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
          onOpenGateways={() => setIsIntegrationsOpen(true)}
          onLoginRequest={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
          onControlCommand={(cmd) => apiService.sendControl(cmd)}
          onResolveLocation={handleResolveLocation}
        />

        {/* Real-Time Device GPS Location SOS Distress Modal */}
        {isGPSLocationSOSOpen && (
          <PublicGPSLocationSOSModal
            cityName={state?.city_name || 'Mumbai'}
            cityId={state?.city_id || 'mumbai_monsoon'}
            onClose={() => setIsGPSLocationSOSOpen(false)}
          />
        )}

        {/* Role-Based Login Modal (4-Tier Access Control) */}
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative w-full max-w-5xl">
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="absolute top-4 right-4 z-50 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white font-mono text-xs cursor-pointer"
              >
                ✕ Close
              </button>
              <LoginPage
                onLogin={(user) => {
                  handleLogin(user);
                  setIsLoginModalOpen(false);
                  if (user.userType !== 'citizen') {
                    if (!isMobileDevice) {
                      setViewMode('COCKPIT');
                    } else {
                      setToastAlert(`🔒 Authenticated as ${user.name}. Open on Desktop for Full GIS Twin.`);
                      setTimeout(() => setToastAlert(null), 5000);
                    }
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* All Modals reachable from Scrolling Portal */}
        {isCitizenSOSOpen && (
          <CitizenSOSModal
            cityId={state?.city_id || 'mumbai_monsoon'}
            cityName={state?.city_name || 'Mumbai'}
            onClose={() => setIsCitizenSOSOpen(false)}
          />
        )}
        {isDroneCCTVOpen && (
          <DroneCCTVModal
            cityId={state?.city_id || 'mumbai_monsoon'}
            cityName={state?.city_name || 'Mumbai'}
            onClose={() => setIsDroneCCTVOpen(false)}
          />
        )}
        {isSAROpen && (
          <SatelliteSARModal
            report={sarReport}
            onClose={() => setIsSAROpen(false)}
            onSyncLiveWeather={() => setIsLiveWeatherOpen(true)}
            isSyncing={isSyncingWeather}
          />
        )}
        {isAICopilotOpen && (
          <GeminiAIModal
            cityName={state?.city_name || 'Mumbai'}
            onClose={() => setIsAICopilotOpen(false)}
          />
        )}
        {isLiveWeatherOpen && (
          <LiveWeatherModal
            state={state}
            onClose={() => setIsLiveWeatherOpen(false)}
            onDeployed={handleSyncLiveWeather}
          />
        )}
        {isIntegrationsOpen && (
          <IntegrationsModal
            onClose={() => setIsIntegrationsOpen(false)}
          />
        )}
        {isWhatsAppOpen && (
          <WhatsAppSimulatorModal
            cityName={state?.city_name || 'Mumbai'}
            onClose={() => setIsWhatsAppOpen(false)}
          />
        )}
      </div>
    );
  }

  // If user is not authenticated and in COCKPIT mode, show login
  if (!authUser) {
    return <LoginPage onLogin={(user) => { handleLogin(user); setViewMode('COCKPIT'); }} />;
  }

  return (
    <div className="min-h-screen w-full bg-[#080c14] text-slate-100 flex flex-col select-none overflow-y-auto">
      {/* Return to Portal Banner Button */}
      <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-1.5 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400">Full-Screen Digital Twin Cockpit View</span>
        <button
          onClick={() => setViewMode('SCROLLING_PORTAL')}
          className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
        >
          ← Return to Multi-Page Showcase Portal
        </button>
      </div>
      {/* Sticky Header */}
      <Header
        state={state}
        authUser={authUser}
        onLogout={handleLogout}
        onReset={handleReset}
        onOpenBroadcast={() => setIsBroadcastOpen(true)}
        onOpenSAR={() => setIsSAROpen(true)}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenDataExport={() => setIsDataExportOpen(true)}
        onOpenCitizenSOS={() => setIsCitizenSOSOpen(true)}
        onOpenDroneCCTV={() => setIsDroneCCTVOpen(true)}
        onOpenVoiceRadio={() => setIsVoiceRadioOpen(true)}
        onOpenIntegrations={() => setIsIntegrationsOpen(true)}
        onOpenProvenance={() => setIsProvenanceOpen(true)}
        onOpenICS201={() => setIsICS201Open(true)}
        onOpenMobileCompanion={() => setIsMobileCompanionOpen(true)}
        onOpenElevation={() => setIsElevationOpen(true)}
        onOpenDam={() => setIsDamOpen(true)}
        onOpenHospitalSurge={() => setIsHospitalSurgeOpen(true)}
        onOpenMesh={() => setIsMeshOpen(true)}
        onOpenAICopilot={() => setIsAICopilotOpen(true)}
        onOpenMultiHazard={() => setIsMultiHazardOpen(true)}
        onOpenDistrictAtlas={() => setIsDistrictAtlasOpen(true)}
        onOpenQRCode={() => setIsQRCodeOpen(true)}
        onSyncLiveWeather={() => setIsLiveWeatherOpen(true)}
        isSyncingWeather={isSyncingWeather}
        onSwitchCity={handleSwitchCity}
        activeView="map"
        setActiveView={() => {}}
      />

      {/* Floating Emergency Toast Notification */}
      {toastAlert && (
        <div className="fixed top-20 right-6 z-50 hud-danger-glow p-3.5 rounded-xl bg-slate-900/95 backdrop-blur-md flex items-center space-x-3 text-xs font-mono text-red-300 shadow-2xl animate-bounce">
          <Bell className="w-4 h-4 text-red-400 animate-pulse" />
          <span>{toastAlert}</span>
        </div>
      )}

      {/* If Citizen, show Text-Based Public Safety Portal (No Complex GIS Map) */}
      {authUser?.userType === 'citizen' ? (
        <CitizenPortalView
          state={state}
          authUser={authUser}
          onOpenGemini={() => setIsAICopilotOpen(true)}
          onOpenMesh={() => setIsMeshOpen(true)}
          onOpenBroadcast={() => setIsBroadcastOpen(true)}
          onOpenSOS={() => setIsCitizenSOSOpen(true)}
        />
      ) : (
        /* Main Scrollable Executive Dashboard Content (For National & State Officers) */
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-5 space-y-6">
        
        {/* ========================================================================= */}
        {/* SECTION 1: INTERACTIVE GEOGRAPHIC DIGITAL TWIN MAP                         */}
        {/* ========================================================================= */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm font-mono font-bold text-white uppercase tracking-wider">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>1. Geographic Digital Twin Simulation Map</span>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-slate-400">Threat Level:</span>
              <span className={`px-2 py-0.5 rounded font-bold ${
                state?.iap?.overall_threat_level === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
              }`}>
                {state?.iap?.overall_threat_level || 'MONITOR'}
              </span>
            </div>
          </div>

          <DigitalTwinMap
            state={state}
            authUser={authUser}
            onSelectNode={(n) => { setSelectedNode(n); setSelectedSensor(null); }}
            onSelectSensor={(s: SensorReading) => { setSelectedSensor(s); setSelectedNode(null); }}
            onSelectRoute={(r) => console.log('Selected route:', r)}
            onSwitchCity={handleSwitchCity}
            onResolveLocation={handleResolveLocation}
            isSyncing={isSyncing}
          />
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: "WHAT-IF" CRISIS SIMULATION SANDBOX & TIMELINE CONTROLLER       */}
        {/* ========================================================================= */}
        <section className="space-y-2">
          <div className="flex items-center space-x-2 text-sm font-mono font-bold text-white uppercase tracking-wider">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>2. "What-If" Crisis Sandbox & Timeline Simulation Controls</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-[#1f2c44] shadow-xl">
            <ScenarioSandbox
              state={state}
              isPlaying={isPlaying}
              playbackSpeed={playbackSpeed}
              onTogglePlayback={handleTogglePlayback}
              onSetSpeed={handleSetSpeed}
            />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: REAL-TIME OPERATIONAL INTELLIGENCE GRID (3 SPACIOUS COLUMNS)    */}
        {/* ========================================================================= */}
        {/* SECTION 3: REAL-TIME OPERATIONAL INTELLIGENCE GRID                         */}
        {/* ========================================================================= */}
        <section className="space-y-3">
          <div className="flex items-center space-x-2 text-sm font-mono font-bold text-white uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>3. Real-Time Operations & Inter-Agency Tactical Intelligence</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
            
            {/* Card 1: Citizen SOS Live Feed Card */}
            <div className="p-3.5 rounded-2xl bg-[#0a0f1d] border border-[#1f2c44] flex flex-col justify-between space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-1.5">
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-bold font-mono text-white">Citizen SOS Queue</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-snug">
                Crowdsourced WhatsApp & Telegram distress signals with AI confidence triage scoring.
              </p>
              <button
                onClick={() => setIsCitizenSOSOpen(true)}
                className="w-full py-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-600/60 text-rose-200 font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                <span>Open SOS Triage</span>
              </button>
            </div>

            {/* Card 2: Citizen Smartphone QR Beacon Card (NEW!) */}
            <div className="p-3.5 rounded-2xl bg-[#0a0f1d] border border-rose-500/30 flex flex-col justify-between space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-1.5">
                  <QrCode className="w-4 h-4 text-rose-400 animate-pulse" />
                  <span className="text-xs font-bold font-mono text-rose-300">Citizen QR Beacon</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-snug">
                Shareable mobile QR code for instant zero-download hardware GPS locking and 112 SMS dispatch.
              </p>
              <button
                onClick={() => setIsQRCodeOpen(true)}
                className="w-full py-2 bg-rose-950/80 hover:bg-rose-900 border border-rose-500/60 text-rose-200 font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-rose-400" />
                <span>Open QR Beacon</span>
              </button>
            </div>

            {/* Card 3: 3D Topographic Elevation Slicing Card (NEW!) */}
            <div className="p-3.5 rounded-2xl bg-[#0a0f1d] border border-cyan-500/30 flex flex-col justify-between space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-1.5">
                  <TrendingUp className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-xs font-bold font-mono text-cyan-300">3D Elevation Cut</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-snug">
                2D/3D cutaway terrain bathymetry analyzing riverbed, levee crest, and flood spillover points.
              </p>
              <button
                onClick={() => setIsElevationOpen(true)}
                className="w-full py-2 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-200 font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>Open Elevation Cut</span>
              </button>
            </div>

            {/* Card 4: CCTV & Drone Video Recon Card */}
            <div className="p-3.5 rounded-2xl bg-[#0a0f1d] border border-[#1f2c44] flex flex-col justify-between space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-1.5">
                  <Video className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold font-mono text-white">CCTV & Drone Matrix</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-snug">
                Municipal subway cameras and UAV survey drone feeds with real-time YOLOv8 vehicle detection.
              </p>
              <button
                onClick={() => setIsDroneCCTVOpen(true)}
                className="w-full py-2 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-200 font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Video className="w-3.5 h-3.5 text-cyan-400" />
                <span>Launch CCTV Matrix</span>
              </button>
            </div>

            {/* Card 5: Push-to-Talk Voice AI Radio Card */}
            <div className="p-3.5 rounded-2xl bg-[#0a0f1d] border border-[#1f2c44] flex flex-col justify-between space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-1.5">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold font-mono text-white">Voice Radio Co-Pilot</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-snug">
                Tactical walkie-talkie voice radio with authentic squelch static SFX and AI SITREP responses.
              </p>
              <button
                onClick={() => setIsVoiceRadioOpen(true)}
                className="w-full py-2 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/60 text-purple-200 font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Push-To-Talk Radio</span>
              </button>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: DEEP ANALYSIS & CIVIL DEFENSE SYSTEMS (SPACIOUS TABS)           */}
        {/* ========================================================================= */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2 text-sm font-mono font-bold text-white uppercase tracking-wider">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>4. Deep Analysis & Civil Defense Action Center</span>
            </div>

            {/* Analysis Tabs */}
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setAnalysisTab('cascade')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  analysisTab === 'cascade'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Cascade Failure Tree ({state?.cascade_links.length || 0})
              </button>

              <button
                onClick={() => setAnalysisTab('telemetry')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  analysisTab === 'telemetry'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                IoT Telemetry ({state?.sensors.length || 0})
              </button>

              <button
                onClick={() => setAnalysisTab('iap')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  analysisTab === 'iap'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                NDMA Incident Action Plan
              </button>

              <button
                onClick={() => setIsMultiHazardOpen(true)}
                className="px-3 py-1.5 rounded-lg text-amber-300 hover:bg-amber-950/60 transition-all font-bold"
              >
                ☣️ Hazmat Simulator ➔
              </button>
            </div>
          </div>

          {/* Render Active Deep Analysis Component */}
          <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-[#1f2c44] shadow-xl min-h-[480px]">
            {analysisTab === 'cascade' && (
              <CascadeFailureGraph
                state={state}
                onSelectNodeById={(id: string) => {
                  const n = state?.nodes.find(node => node.id === id);
                  if (n) {
                    setSelectedNode(n);
                    setSelectedSensor(null);
                  }
                }}
              />
            )}

            {analysisTab === 'telemetry' && (
              <SensorTelemetryPanel
                state={state}
                onSelectSensor={(s: SensorReading) => { setSelectedSensor(s); setSelectedNode(null); }}
              />
            )}

            {analysisTab === 'iap' && (
              <IncidentCommanderPanel
                state={state}
                onSelectNodeById={(id: string) => {
                  const n = state?.nodes.find(node => node.id === id);
                  if (n) {
                    setSelectedNode(n);
                    setSelectedSensor(null);
                  }
                }}
              />
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: NDRF TACTICAL RADIO CHATTER STREAM                              */}
        {/* ========================================================================= */}
        <section className="space-y-2 pt-2 pb-8">
          <div className="flex items-center space-x-2 text-sm font-mono font-bold text-white uppercase tracking-wider">
            <RadioIcon className="w-4 h-4 text-emerald-400" />
            <span>5. Live NDRF Inter-Agency Tactical Radio Chatter (All 12 Battalions)</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-[#1f2c44] shadow-xl h-[420px]">
            <TacticalRadioFeed
              messages={radioMessages}
              onSendMessage={handleSendRadio}
            />
          </div>
        </section>

      </div>
      )}

      {/* Node / Sensor Detail Inspector Drawer */}
      <NodeInspectorModal
        node={selectedNode}
        sensor={selectedSensor}
        onClose={() => { setSelectedNode(null); setSelectedSensor(null); }}
      />

      {/* Real SMS & Emergency Broadcast Modal */}
      {isBroadcastOpen && (
        <BroadcastModal
          iap={state?.iap || null}
          cityName={state?.city_name || "Mumbai"}
          onClose={() => setIsBroadcastOpen(false)}
        />
      )}

      {/* Copernicus Satellite SAR Radar Modal */}
      {isSAROpen && (
        <SatelliteSARModal
          report={sarReport}
          authUser={authUser}
          onClose={() => setIsSAROpen(false)}
          onSyncLiveWeather={handleSyncLiveWeather}
          isSyncing={isSyncingWeather}
        />
      )}

      {/* Interactive Operator Tutorial Masterclass */}
      {isTutorialOpen && (
        <TutorialModal
          onClose={() => setIsTutorialOpen(false)}
          onOpenLiveSync={handleSyncLiveWeather}
          onOpenBroadcast={() => { setIsTutorialOpen(false); setIsBroadcastOpen(true); }}
        />
      )}

      {/* Real-time Dataset & Document Export Modal */}
      {isDataExportOpen && (
        <DataExportModal
          state={state}
          onClose={() => setIsDataExportOpen(false)}
        />
      )}

      {/* Crowdsourced Citizen SOS Distress Modal */}
      {isCitizenSOSOpen && (
        <CitizenSOSModal
          cityId={state?.city_id || 'mumbai_monsoon'}
          cityName={state?.city_name || 'Mumbai'}
          onClose={() => setIsCitizenSOSOpen(false)}
        />
      )}

      {/* CCTV & Autonomous Recon Drone Video Matrix */}
      {isDroneCCTVOpen && (
        <DroneCCTVModal
          cityId={state?.city_id || 'mumbai_monsoon'}
          cityName={state?.city_name || 'Mumbai'}
          authUser={authUser}
          onClose={() => setIsDroneCCTVOpen(false)}
        />
      )}

      {/* Push-to-Talk AI Voice Incident Commander Co-Pilot */}
      {isVoiceRadioOpen && (
        <VoiceRadioCoPilot
          cityName={state?.city_name || 'Mumbai'}
          onClose={() => setIsVoiceRadioOpen(false)}
        />
      )}

      {/* Multi-Hazard Crisis Sandbox (Hazmat, Earthquake, Fire) */}
      {isMultiHazardOpen && (
        <MultiHazardModal
          cityName={state?.city_name || 'Mumbai'}
          onClose={() => setIsMultiHazardOpen(false)}
        />
      )}

      {/* Production Integrations & Field Deployment Hub */}
      {isIntegrationsOpen && (
        <IntegrationsModal
          onClose={() => setIsIntegrationsOpen(false)}
        />
      )}

      {/* Real Data Provenance & Open-Meteo / GloFAS / OSM Inspector */}
      {isProvenanceOpen && (
        <DataProvenanceModal
          cityId={state?.city_id || 'mumbai_monsoon'}
          cityName={state?.city_name || 'Mumbai'}
          centerCoords={state?.center_coords}
          onClose={() => setIsProvenanceOpen(false)}
        />
      )}

      {/* NDMA ICS-201 Official Action Plan */}
      {isICS201Open && (
        <ICS201ActionPlanModal
          state={state}
          cityName={state?.city_name || 'Mumbai'}
          onClose={() => setIsICS201Open(false)}
        />
      )}

      {/* Mobile Incident Commander & Citizen Companion App */}
      {isMobileCompanionOpen && (
        <MobileHeadAppModal
          state={state}
          onClose={() => setIsMobileCompanionOpen(false)}
        />
      )}

      {/* Citizen Smartphone SOS QR Code Beacon Modal */}
      {isQRCodeOpen && (
        <CitizenQRCodeModal
          cityName={state?.city_name || 'Mumbai'}
          cityId={state?.city_id || 'mumbai_monsoon'}
          onClose={() => setIsQRCodeOpen(false)}
        />
      )}

      {/* Bathymetry Elevation Slice */}
      {isElevationOpen && (
        <ElevationProfileModal
          cityName={state?.city_name || 'Mumbai'}
          rainIntensity={state?.rain_intensity_mmhr || 35.0}
          stormSurge={state?.storm_surge_m || 0.5}
          onClose={() => setIsElevationOpen(false)}
        />
      )}

      {/* Dam Hydrograph Sluice Controller */}
      {isDamOpen && (
        <DamHydrographModal
          cityName={state?.city_name || 'Mumbai'}
          onClose={() => setIsDamOpen(false)}
        />
      )}

      {/* Hospital ICU & Oxygen Surge */}
      {isHospitalSurgeOpen && (
        <HospitalSurgeModal
          cityName={state?.city_name || 'Mumbai'}
          onClose={() => setIsHospitalSurgeOpen(false)}
        />
      )}

      {/* Zero-Network Mesh SOS */}
      {isMeshOpen && (
        <MeshNetworkModal
          cityName={state?.city_name || 'Mumbai'}
          onClose={() => setIsMeshOpen(false)}
        />
      )}

      {/* Google Gemini AI Disaster Incident Commander */}
      {isAICopilotOpen && (
        <GeminiAIModal
          cityName={state?.city_name || 'Mumbai'}
          onClose={() => setIsAICopilotOpen(false)}
        />
      )}

      {/* Real-Time Live Satellite & IMD Weather Radar Modal */}
      {isLiveWeatherOpen && (
        <LiveWeatherModal
          state={state}
          onClose={() => setIsLiveWeatherOpen(false)}
          onDeployed={handleSyncLiveWeather}
        />
      )}

      {/* WhatsApp Civil Defense Bot Simulator */}
      {isWhatsAppOpen && (
        <WhatsAppSimulatorModal
          cityName={state?.city_name || 'Mumbai'}
          onClose={() => setIsWhatsAppOpen(false)}
        />
      )}

      {/* Pan-India 780+ Districts Atlas & Micro-Catchment Ingestion Modal */}
      {isDistrictAtlasOpen && (
        <DistrictSelectionModal
          currentCityName={state?.city_name}
          authUser={authUser}
          onSelectDistrict={(districtName, lat, lng) => handleResolveLocation(districtName, lat, lng)}
          onClose={() => setIsDistrictAtlasOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
