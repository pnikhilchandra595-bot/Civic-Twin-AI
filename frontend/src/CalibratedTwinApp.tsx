import React, { useState, useEffect, useRef } from 'react';
import { 
  CALIBRATED_COMPREHENSIVE_TWIN_STATES, 
  CalibratedComprehensiveTwinState,
  buildDynamicComprehensiveTwinState
} from './data/calibratedTwinStates';
import { CALIBRATED_BENCHMARK_SCENARIOS, CalibratedScenario } from './data/calibratedSimulationScenarios';
import { Header } from './components/Header';
import { PublicScrollingPortal } from './components/PublicScrollingPortal';
import { LoginPage, AuthUser } from './components/LoginPage';

// Core Cockpit Views
import { CalibratedGeospatialTwinMap } from './components/CalibratedGeospatialTwinMap';
import { DigitalTwinMap } from './components/DigitalTwinMap';
import { CommandToolsHub } from './components/CommandToolsHub';
import { ScenarioSandbox } from './components/ScenarioSandbox';
import { CascadeFailureGraph } from './components/CascadeFailureGraph';
import { SensorTelemetryPanel } from './components/SensorTelemetryPanel';
import { IncidentCommanderPanel } from './components/IncidentCommanderPanel';
import { TacticalRadioFeed } from './components/TacticalRadioFeed';
import { CitizenPortalView } from './components/CitizenPortalView';
import { CalibratedSimulationPanel } from './components/CalibratedSimulationPanel';

// Improvisation Modals
import { ExplainablePhysicsModal } from './components/ExplainablePhysicsModal';
import { GeminiPhotoInspectorModal } from './components/GeminiPhotoInspectorModal';
import { SovereignCertificateModal } from './components/SovereignCertificateModal';
import { FamilyEmergencyCardModal } from './components/FamilyEmergencyCardModal';
import { PresentationDeskModal } from './components/PresentationDeskModal';

// Real Platform Production Modals (All 30+ Fully Wired)
import { NodeInspectorModal } from './components/NodeInspectorModal';
import { BroadcastModal } from './components/BroadcastModal';
import { SatelliteSARModal } from './components/SatelliteSARModal';
import { TutorialModal } from './components/TutorialModal';
import { DataExportModal } from './components/DataExportModal';
import { CitizenSOSModal } from './components/CitizenSOSModal';
import { DroneCCTVModal } from './components/DroneCCTVModal';
import { VoiceRadioCoPilot } from './components/VoiceRadioCoPilot';
import { MultiHazardModal } from './components/MultiHazardModal';
import { IntegrationsModal } from './components/IntegrationsModal';
import { DataProvenanceModal } from './components/DataProvenanceModal';
import { ICS201ActionPlanModal } from './components/ICS201ActionPlanModal';
import { MobileHeadAppModal } from './components/MobileHeadAppModal';
import { ElevationProfileModal } from './components/ElevationProfileModal';
import { DamHydrographModal } from './components/DamHydrographModal';
import { HospitalSurgeModal } from './components/HospitalSurgeModal';
import { MeshNetworkModal } from './components/MeshNetworkModal';
import { GeminiAIModal } from './components/GeminiAIModal';
import { LiveWeatherModal } from './components/LiveWeatherModal';
import { WhatsAppSimulatorModal } from './components/WhatsAppSimulatorModal';
import { DistrictSelectionModal } from './components/DistrictSelectionModal';
import { CitizenQRCodeModal } from './components/CitizenQRCodeModal';
import { CitizenPortalModal } from './components/CitizenPortalModal';
import { CWCGaugesModal } from './components/CWCGaugesModal';
import { MOSDACModal } from './components/MOSDACModal';
import { GLOFModal } from './components/GLOFModal';

import { tacticalAudio } from './services/tacticalAudioEngine';
import { apiService, RadioMessage, SatelliteSARReport } from './services/api';
import { InfrastructureNode, SensorReading, CityDigitalTwinState } from './types/digital_twin';

import { 
  Compass, Activity, ShieldAlert, Award, FileText, Camera, FlaskConical,
  Radio, Volume2, VolumeX, Play, Pause, RotateCcw, Clock, Sparkles, 
  Layers, MapPin, CheckCircle2, ChevronRight, ExternalLink, Globe, Car, Truck, Ship,
  Printer, Waves, Mountain, Flame, Zap, ShieldCheck, HelpCircle, Terminal, Cpu,
  Sliders, MessageSquare, Video, AlertOctagon, HeartPulse, Satellite, Users,
  ArrowRight, Phone, Lock, Eye, AlertTriangle, TrendingUp, Radar, PhoneCall, QrCode, WifiOff, CloudRain,
  Sun, Moon, LogOut, UserCheck, Shield
} from 'lucide-react';
import { computeSimulationStep } from './services/simulationPhysics';

const DEFAULT_AUTH_OFFICER: AuthUser = {
  name: 'Commandant (Jury Evaluation Edition)',
  role: 'National Operations Lead',
  badgeId: 'NDMA-HQ-SOVEREIGN',
  agency: 'National Disaster Management Authority (NDMA)',
  userType: 'national_authority',
  allowedStates: ['Sikkim', 'Maharashtra', 'Delhi', 'Uttarakhand', 'Tamil Nadu', 'Assam', 'West Bengal'],
  clearanceLevel: 5
};

const DEFAULT_SAR_REPORT: SatelliteSARReport = {
  satellite_mission: "ISRO RISAT-1A / EOS-04 C-Band SAR",
  pass_type: "Descending Ground Track (Sun-Synchronous)",
  polarization: "Dual-Pol (VV + VH)",
  resolution_m: 0.5,
  cloud_penetration: "100% All-Weather Cloud Penetrating",
  acquisition_time: new Date().toISOString(),
  total_inundated_area_km2: 46.8,
  urban_surface_inundation_pct: 41.2,
  mean_backscatter_db: -18.4,
  water_threshold_db: -14.2,
  sar_confidence_score: 97.4
};

export const CalibratedTwinApp: React.FC = () => {
  // Authentication & Role State
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('civictwin_officer');
    return saved ? JSON.parse(saved) : DEFAULT_AUTH_OFFICER;
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // View Mode: COCKPIT vs SCROLLING_PORTAL vs PRESENTATION
  const [viewMode, setViewMode] = useState<'COCKPIT' | 'SCROLLING_PORTAL' | 'PRESENTATION'>('COCKPIT');

  // Dynamic Multi-City Digital Twin State
  const [currentTwinState, setCurrentTwinState] = useState<CityDigitalTwinState>(
    CALIBRATED_COMPREHENSIVE_TWIN_STATES['sikkim_lhonak_glof_2023'].state
  );
  const [activeScenarioId, setActiveScenarioId] = useState<string>('sikkim_lhonak_glof_2023');

  // Multi-City Inundation & Benchmark Controls
  const [sensitivityMultiplier, setSensitivityMultiplier] = useState<number>(1.0);
  const [vehicleWadingFilter, setVehicleWadingFilter] = useState<'all' | 'car' | 'truck' | 'boat'>('all');
  const [is3DTiltActive, setIs3DTiltActive] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [activeLang, setActiveLang] = useState<'en' | 'hi' | 'mr' | 'bn' | 'ta' | 'te'>('en');
  const [mapRenderMode, setMapRenderMode] = useState<'calibrated_vector' | 'satellite_gis'>('calibrated_vector');
  const [demoMode, setDemoMode] = useState<boolean>(false);

  // Light / Dark Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('civictwin_theme') as 'dark' | 'light') || 'dark';
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

  // Active view inside Cockpit
  const [activeView, setActiveView] = useState<
    'map' | 'tools' | 'sandbox' | 'cascade' | 'sensors' | 'radio' | 'iap' | 'citizen' | 'presentation' | 'all'
  >('map');

  const [selectedNode, setSelectedNode] = useState<InfrastructureNode | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<SensorReading | null>(null);

  // Active continuous simulation loop state (STOPPED by default - starts only when user toggles ON)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isSyncingWeather, setIsSyncingWeather] = useState<boolean>(false);
  const [sarReport, setSarReport] = useState<SatelliteSARReport>(DEFAULT_SAR_REPORT);
  const [isHeaderToolsMenuOpen, setIsHeaderToolsMenuOpen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>(() => new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }));
  const headerToolsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isHeaderToolsMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (headerToolsMenuRef.current && !headerToolsMenuRef.current.contains(event.target as Node)) {
        setIsHeaderToolsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isHeaderToolsMenuOpen]);

  // Modals state (All Production Engines + Improvisations + Presentation Desk)
  const [isPresentationDeskOpen, setIsPresentationDeskOpen] = useState<boolean>(false);
  const [isXAIModalOpen, setIsXAIModalOpen] = useState<boolean>(false);
  const [isPhotoInspectorOpen, setIsPhotoInspectorOpen] = useState<boolean>(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState<boolean>(false);
  const [isFamilyCardModalOpen, setIsFamilyCardModalOpen] = useState<boolean>(false);

  const [isBroadcastOpen, setIsBroadcastOpen] = useState<boolean>(false);
  const [isSAROpen, setIsSAROpen] = useState<boolean>(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [isDataExportOpen, setIsDataExportOpen] = useState<boolean>(false);
  const [isCitizenSOSOpen, setIsCitizenSOSOpen] = useState<boolean>(false);
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
  const [isCitizenPortalOpen, setIsCitizenPortalOpen] = useState<boolean>(false);
  const [isCWCGaugesOpen, setIsCWCGaugesOpen] = useState<boolean>(false);
  const [isMOSDACOpen, setIsMOSDACOpen] = useState<boolean>(false);
  const [isGLOFOpen, setIsGLOFOpen] = useState<boolean>(false);

  // 90-Second Guided Jury Tour state
  const [isJuryTourActive, setIsJuryTourActive] = useState<boolean>(false);
  const [juryTourStep, setJuryTourStep] = useState<number>(1);

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synthesize calibrated comprehensive state for ANY chosen city or benchmark
  const comprehensiveState: CalibratedComprehensiveTwinState = 
    CALIBRATED_COMPREHENSIVE_TWIN_STATES[activeScenarioId] || 
    buildDynamicComprehensiveTwinState(currentTwinState);
  
  const baseScenario: CalibratedScenario = 
    CALIBRATED_BENCHMARK_SCENARIOS.find(s => s.id === activeScenarioId) || 
    CALIBRATED_BENCHMARK_SCENARIOS[0];

  // Map radio messages
  const initialRadioMessages: RadioMessage[] = comprehensiveState.radioFeedTranscripts.map((m, idx) => ({
    id: m.id || `radio-${idx}`,
    timestamp: m.timestamp || '00:15 IST',
    channel: 'TAC-1 Command Net',
    sender_callsign: `${m.callsign} (${m.agency})`,
    recipient_callsign: 'ALL-COMMAND-UNITS',
    priority: m.priority === 'EMERGENCY' ? 'EMERGENCY' : 'PRIORITY',
    message: m.message
  }));
  const [radioMessages, setRadioMessages] = useState<RadioMessage[]>(initialRadioMessages);

  // Sound effects helper
  const triggerAudioChirp = () => {
    if (!isAudioMuted) tacticalAudio.playRadioChirp();
  };

  const triggerRadarPing = () => {
    if (!isAudioMuted) tacticalAudio.playRadarPing();
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Keep live Indian Standard Time clock updated
  useEffect(() => {
    const t = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Simulation Controls: Toggle Play / Pause
  const handleToggleSimulation = () => {
    if (isPlaying) {
      setIsPlaying(false);
      triggerAudioChirp();
      showToast(`⏸️ Simulation PAUSED (Standby Mode at T+${currentTwinState.timeline_hour.toFixed(2)}h)`);
    } else {
      setIsPlaying(true);
      triggerRadarPing();
      showToast(`▶️ Simulation RUNNING: Advancing hydraulic time-steps at ${playbackSpeed}x`);
    }
  };

  // Simulation Controls: Reset to Baseline T+0.0h
  const handleResetSimulation = () => {
    setIsPlaying(false);
    setCurrentTwinState((prevState) => {
      if (!prevState) return prevState;
      const res = computeSimulationStep(prevState, 0.0, sensitivityMultiplier);
      return res.updatedState;
    });
    triggerAudioChirp();
    showToast('🔄 Simulation Reset: T+0.0h (Standby Baseline Calibration)');
  };

  // Simulation Controls: Jump/Step time forward or backward
  const handleStepSimulation = (deltaHours: number) => {
    setCurrentTwinState((prevState) => {
      if (!prevState) return prevState;
      const targetHour = Math.max(0, Math.min(12, Number((prevState.timeline_hour + deltaHours).toFixed(2))));
      const res = computeSimulationStep(prevState, targetHour, sensitivityMultiplier);
      res.events.forEach(evt => {
        if (evt.type === 'radio') {
          setRadioMessages(prev => [{
            id: `sim-radio-${Date.now()}`,
            channel: 'TAC-1 NDMA Command',
            sender_callsign: 'EOC-AUTOMATION',
            recipient_callsign: 'ALL-UNITS',
            priority: evt.priority || 'PRIORITY',
            message: evt.message,
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
          }, ...prev]);
          triggerAudioChirp();
        } else if (evt.type === 'siren') {
          if (!isAudioMuted) tacticalAudio.playWarningSiren();
          showToast(`🚨 ${evt.message}`);
        } else if (evt.type === 'chirp') {
          triggerAudioChirp();
        }
      });
      return res.updatedState;
    });
    showToast(`⏱️ Timeline Stepped to T+${Math.max(0, (currentTwinState.timeline_hour + deltaHours)).toFixed(1)}h`);
  };

  // Simulation Controls: Direct scrub on timeline slider
  const handleScrubTimeline = (targetHour: number) => {
    setCurrentTwinState((prevState) => {
      if (!prevState) return prevState;
      const hour = Math.max(0, Math.min(12, Number(targetHour.toFixed(2))));
      const res = computeSimulationStep(prevState, hour, sensitivityMultiplier);
      return res.updatedState;
    });
  };

  // Active continuous digital twin simulation loop
  useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = Math.max(400, Math.floor(1200 / playbackSpeed));
    const timer = setInterval(() => {
      setCurrentTwinState((prevState) => {
        if (!prevState || !prevState.nodes || prevState.nodes.length === 0) return prevState;
        const newTimeline = Number((prevState.timeline_hour + 0.05 * playbackSpeed).toFixed(2));
        const res = computeSimulationStep(prevState, newTimeline, sensitivityMultiplier);
        res.events.forEach(evt => {
          if (evt.type === 'radio') {
            setRadioMessages(prev => [{
              id: `sim-radio-${Date.now()}`,
              channel: 'TAC-1 NDMA Command',
              sender_callsign: 'EOC-AUTOMATION',
              recipient_callsign: 'ALL-UNITS',
              priority: evt.priority || 'PRIORITY',
              message: evt.message,
              timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
            }, ...prev]);
            triggerAudioChirp();
          } else if (evt.type === 'siren') {
            if (!isAudioMuted) tacticalAudio.playWarningSiren();
            showToast(`🚨 ${evt.message}`);
          } else if (evt.type === 'chirp') {
            triggerAudioChirp();
          }
        });
        return res.updatedState;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, sensitivityMultiplier, isAudioMuted]);

  // Switch City across all Indian States & Corridors (Multi-City Model)
  const handleSwitchCity = async (cityId: string) => {
    try {
      // 1. Check if it's one of our pre-calibrated sovereign benchmarks
      if (CALIBRATED_COMPREHENSIVE_TWIN_STATES[cityId]) {
        setActiveScenarioId(cityId);
        setCurrentTwinState(CALIBRATED_COMPREHENSIVE_TWIN_STATES[cityId].state);
        setSelectedNode(null);
        setSelectedSensor(null);
        triggerRadarPing();
        showToast(`🔬 Switched to Benchmark: ${CALIBRATED_COMPREHENSIVE_TWIN_STATES[cityId].name}`);
        return;
      }

      // 2. Otherwise fetch live or pre-configured digital twin corridor from API
      showToast(`🏙️ Switching Multi-City Corridor: ${cityId}...`);
      const switchedState = await apiService.switchCity(cityId);
      if (switchedState && switchedState.city_name) {
        setCurrentTwinState(switchedState);
        setActiveScenarioId(cityId);
        setSelectedNode(null);
        setSelectedSensor(null);
        triggerRadarPing();
        showToast(`✅ Loaded Calibrated Digital Twin for ${switchedState.city_name}`);
      }
    } catch (e) {
      console.error('City switch error:', e);
      showToast(`⚠️ Regional corridor switch fallback active.`);
    }
  };

  // Pan-India 780+ District Micro-Catchment Resolution
  const handleResolveLocation = async (districtName?: string, lat?: number, lng?: number) => {
    const target = districtName || 'Selected Region';
    try {
      showToast(`🔍 Resolving micro-catchment terrain & sensors for ${target}...`);
      const resolved = await apiService.resolvePanIndiaLocation(target, lat, lng);
      if (resolved && resolved.city_name) {
        setCurrentTwinState(resolved);
        setActiveScenarioId(resolved.city_id || target.toLowerCase().replace(/\s+/g, '_'));
        setSelectedNode(null);
        setSelectedSensor(null);
        triggerRadarPing();
        showToast(`✅ Digital Twin Synthesized for ${resolved.city_name}`);
      }
    } catch (e) {
      console.error('Resolve district error:', e);
      showToast(`❌ Failed to resolve district. Reverting to regional baseline.`);
    }
  };

  // Weather Sync
  const handleSyncLiveWeather = async () => {
    try {
      setIsSyncingWeather(true);
      const res = await apiService.syncLiveWeather();
      if (res?.state) setCurrentTwinState(res.state);
      showToast(`🌧️ Synced live IMD Doppler Radar & INSAT-3DR Telemetry!`);
    } catch (e) {
      showToast(`⚠️ IMD Satellite sync failed, operating on local calibrated cache.`);
    } finally {
      setIsSyncingWeather(false);
    }
  };

  // Toggle Audio
  const toggleAudio = () => {
    const nextMute = !isAudioMuted;
    setIsAudioMuted(nextMute);
    tacticalAudio.setMuted(nextMute);
  };

  // Play TTS Sitrep
  const handlePlayVoiceSitrep = (text: string, hindiText?: string) => {
    const msg = activeLang === 'hi' && hindiText ? hindiText : text;
    tacticalAudio.speakSitrep(msg, activeLang === 'hi' ? 'hi' : 'en');
    showToast(`🎙️ Radio Voice Transmitting: "${msg.slice(0, 50)}..."`);
  };

  // Send radio message handler
  const handleSendRadio = (channel: string, sender: string, message: string, priority: string) => {
    const newMsg: RadioMessage = {
      id: `radio-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      channel,
      sender_callsign: sender,
      recipient_callsign: 'ALL-COMMAND-UNITS',
      priority: priority,
      message: message
    };
    setRadioMessages(prev => [newMsg, ...prev]);
    triggerAudioChirp();
    showToast(`📻 Dispatched on ${channel}: "${message.slice(0, 35)}..."`);
  };

  // 1-Click Action Handler for Presentation Desk
  const handlePresentationAction = (action: string) => {
    switch (action) {
      case 'scenario_sikkim':
        handleSwitchCity('sikkim_lhonak_glof_2023');
        setActiveView('map');
        setViewMode('COCKPIT');
        break;
      case 'scenario_mumbai':
        handleSwitchCity('mumbai_deluge_2005');
        setActiveView('map');
        setViewMode('COCKPIT');
        break;
      case 'open_xai':
        setIsXAIModalOpen(true);
        break;
      case 'open_photo':
        setIsPhotoInspectorOpen(true);
        break;
      case 'toggle_3d':
        setIs3DTiltActive(prev => !prev);
        setActiveView('map');
        break;
      case 'play_radio':
        handlePlayVoiceSitrep(
          comprehensiveState.radioFeedTranscripts[0]?.message || 'Red alert issued. Evacuate downstream wards immediately.',
          comprehensiveState.radioFeedTranscripts[0]?.hindiMessage
        );
        break;
      case 'open_sandbox':
        setActiveView('sandbox');
        setViewMode('COCKPIT');
        break;
      case 'open_tools':
        setActiveView('tools');
        setViewMode('COCKPIT');
        break;
      case 'open_iap':
        setIsICS201Open(true);
        break;
      case 'open_family_card':
        setIsFamilyCardModalOpen(true);
        break;
      case 'open_certificate':
        setIsCertificateModalOpen(true);
        break;
      case 'open_map':
        setActiveView('map');
        setViewMode('COCKPIT');
        break;
      case 'open_mesh':
        setIsMeshOpen(true);
        break;
      case 'open_copilot':
        setIsAICopilotOpen(true);
        break;
      case 'open_sar':
        setIsSAROpen(true);
        break;
      case 'open_cctv':
        setIsDroneCCTVOpen(true);
        break;
      case 'open_sos':
        setIsCitizenSOSOpen(true);
        break;
      case 'open_elevation':
        setIsElevationOpen(true);
        break;
      case 'open_dam':
        setIsDamOpen(true);
        break;
      case 'open_hospital':
        setIsHospitalSurgeOpen(true);
        break;
      default:
        console.log('Action triggered:', action);
    }
  };

  // 90-Second Autopilot Tour Controller
  useEffect(() => {
    let timer: any;
    if (isJuryTourActive) {
      if (juryTourStep === 1) {
        showToast('🎬 Tour Step 1/5: Anomaly Detected at Glacial Moraine (T-15 min)');
        setActiveView('map');
        setViewMode('COCKPIT');
        triggerRadarPing();
      } else if (juryTourStep === 2) {
        showToast('🎬 Tour Step 2/5: Outburst Flood Crest Overtopping Dam Crest (T+28 min)');
        triggerAudioChirp();
      } else if (juryTourStep === 3) {
        showToast('🎬 Tour Step 3/5: Substation Tripped & Traffic Re-routed around Impassable Highway');
        setActiveView('cascade');
      } else if (juryTourStep === 4) {
        showToast('🎬 Tour Step 4/5: Automated Citizen SMS & USAR Boat Rescue Dispatch');
        setActiveView('radio');
      } else if (juryTourStep === 5) {
        showToast('🎬 Tour Step 5/5: Generating Official NDMA Incident Action Plan Dossier');
        setActiveView('iap');
      }

      timer = setTimeout(() => {
        if (juryTourStep < 5) {
          setJuryTourStep(prev => prev + 1);
        } else {
          setIsJuryTourActive(false);
          setJuryTourStep(1);
          showToast('✅ 90-Second Jury Presentation Tour Completed!');
        }
      }, 9000);
    }
    return () => clearTimeout(timer);
  }, [isJuryTourActive, juryTourStep]);

  // Login Modal Handling
  if (isLoginModalOpen) {
    return (
      <LoginPage 
        onLogin={(user) => { 
          setAuthUser(user); 
          setIsLoginModalOpen(false); 
          localStorage.setItem('civictwin_officer', JSON.stringify(user));
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-transparent text-slate-100 font-mono select-none flex flex-col">
      
      {/* 0. PERSISTENT MASTER SIMULATION MODE BAR */}
      <div className="w-full bg-gradient-to-r from-[#040916]/98 via-[#081530]/98 to-[#040916]/98 border-b border-cyan-500/35 py-1.5 px-3 sm:px-5 sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.95)] flex items-center justify-between gap-2.5 backdrop-blur-2xl flex-nowrap overflow-x-auto no-scrollbar shrink-0 text-xs ring-1 ring-cyan-500/20 cyber-scanner-border">
        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-lg bg-cyan-950/80 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)] shrink-0">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <span className="text-[10px] font-mono font-black text-cyan-200 uppercase tracking-widest hidden sm:inline shrink-0 text-glow-cyan">
              ENGINE C2:
            </span>
          </div>

          <div className="inline-flex items-center rounded-xl bg-slate-950/90 p-0.5 border border-cyan-500/30 shadow-inner space-x-1 shrink-0">
            {/* Tab 1: Real Platform */}
            <a
              href="/"
              className="px-3 py-1 rounded-lg text-[11px] font-mono font-bold transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              title="Switch to Real Telemetry Platform"
            >
              <span>🛰️ REAL TELEMETRY</span>
            </a>

            {/* Tab 2: Stage Demo */}
            <a
              href="/?demo=true"
              className="px-3 py-1 rounded-lg text-[11px] font-mono font-bold transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              title="Launch Stage Demo Mode"
            >
              <span>🎬 STAGE DEMO</span>
            </a>

            {/* Tab 3: Calibrated Benchmark Simulation (ACTIVE) */}
            <div className="flex items-center space-x-1 shrink-0">
              <button
                onClick={() => setViewMode('COCKPIT')}
                className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md shadow-cyan-500/30 border border-cyan-300 font-black ring-1 ring-cyan-400/30"
              >
                <FlaskConical className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
                <span>🔬 CALIBRATED TWIN</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-200 animate-pulse" />
              </button>
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 hidden md:inline">
                JURY EDITION
              </span>
            </div>
          </div>
        </div>

        {/* View Switcher & Region */}
        <div className="flex items-center space-x-2 text-xs font-mono shrink-0">
          <div className="hidden 2xl:flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 text-[11px] shrink-0">
            <span className="text-slate-500">Region:</span>
            <span className="text-cyan-300 font-bold">{currentTwinState.city_name}</span>
          </div>

          {viewMode === 'SCROLLING_PORTAL' ? (
            <button
              onClick={() => setViewMode('COCKPIT')}
              className="px-2.5 py-1 rounded-xl font-bold bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-400 text-[11px] transition-all cursor-pointer flex items-center space-x-1 shadow-sm"
            >
              <span>← Command Cockpit</span>
            </button>
          ) : (
            <button
              onClick={() => setViewMode('SCROLLING_PORTAL')}
              className="px-2.5 py-1 rounded-xl font-bold bg-[#0c1833] hover:bg-[#132652] text-teal-300 border border-teal-500/40 text-[11px] transition-all cursor-pointer flex items-center space-x-1 shadow-sm"
            >
              <span>Citizen Portal →</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. UNIFIED SOVEREIGN COMMAND & DEFENSE HEADER */}
      <header className="sticky top-[38px] z-40 bg-gradient-to-r from-[#040916]/98 via-[#081530]/98 to-[#040916]/98 backdrop-blur-2xl border-b border-cyan-500/35 shadow-2xl cyber-scanner-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2">
          
          {/* TOP ROW: BRAND, LOCATION SELECTOR, PRESENTATION, TOOLS & PROFILE */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-800/80">
            
            {/* Left: Brand + Badges + City Selector */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/10 border border-cyan-400/50 text-cyan-300 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
                <FlaskConical className="w-5 h-5 animate-pulse text-cyan-300" />
              </div>
              
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                    🇮🇳 SOVEREIGN CALIBRATED TWIN
                  </span>
                  <span className="text-[10px] text-teal-300 font-bold hidden sm:inline border border-teal-500/30 px-1.5 py-0.2 rounded bg-teal-950/40">
                    MULTI-CITY PAN-INDIA MODEL
                  </span>
                </div>
                <h1 className="text-sm sm:text-base font-bold text-white font-hud tracking-wide mt-0.5 text-glow-cyan">
                  CIVICTWIN AI • DEFENSE & JURY EVALUATION PLATFORM
                </h1>
              </div>

              {/* City / Benchmark Selector */}
              <div className="flex items-center space-x-1.5 bg-slate-900 border border-cyan-500/40 rounded-xl px-2.5 py-1.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold hidden sm:inline">Active Model:</span>
                <select
                  value={activeScenarioId}
                  onChange={(e) => handleSwitchCity(e.target.value)}
                  className="bg-transparent text-cyan-300 font-bold outline-none cursor-pointer text-xs max-w-[170px] sm:max-w-[210px] truncate"
                >
                  <optgroup label="🔬 Sovereign Historical Calibrated Benchmarks">
                    <option value="sikkim_lhonak_glof_2023">Sikkim: Teesta GLOF 2023 (Moraine Burst)</option>
                    <option value="mumbai_deluge_2005">Maharashtra: Mumbai Deluge 2005 (944mm Mithi)</option>
                  </optgroup>
                  <optgroup label="🇮🇳 Pan-India State Corridors (Multi-City Model)">
                    <option value="delhi_yamuna">Delhi: Yamuna Flood Basin (DL)</option>
                    <option value="mumbai_monsoon">Maharashtra: Mumbai Coastal Surge (MH)</option>
                    <option value="tamil_nadu_adyar">Tamil Nadu: Chennai Adyar Basin (TN)</option>
                    <option value="karnataka_bengaluru">Karnataka: Bengaluru Stormwater (KA)</option>
                    <option value="kolkata_hooghly">West Bengal: Kolkata Hooghly Surge (WB)</option>
                    <option value="assam_brahmaputra">Assam: Guwahati Brahmaputra (AS)</option>
                    <option value="uttarakhand_cloudburst">Uttarakhand: Rishikesh Kedarnath (UK)</option>
                    <option value="kerala_periyar">Kerala: Kochi Periyar Dam (KL)</option>
                    <option value="odisha_mahanadi">Odisha: Bhubaneswar Mahanadi (OD)</option>
                    <option value="gujarat_tapi">Gujarat: Surat Tapi Surge (GJ)</option>
                    <option value="bihar_kosi">Bihar: Patna Kosi Basin (BR)</option>
                  </optgroup>
                </select>
              </div>

              {/* 780+ Districts Atlas Launcher */}
              <button
                onClick={() => setIsDistrictAtlasOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-teal-500/40 text-teal-300 font-bold text-xs flex items-center space-x-1 cursor-pointer transition-all hover:scale-105"
                title="Search Pan-India 780+ Districts & Micro-Catchments"
              >
                <Globe className="w-3.5 h-3.5 text-teal-400" />
                <span>780+ Districts</span>
              </button>

              {/* 18 Live Feeds Inspector */}
              <button
                onClick={() => setIsProvenanceOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-sm transition-all"
                title="Inspect 18 Real-Time Sovereign Feeds (MOSDAC, CWC, SAR, Doppler)"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="hidden md:inline">18 Live Feeds</span>
                <span className="md:hidden">18 Feeds</span>
              </button>
            </div>

            {/* Right: Presentation Desk, Tools Menu, View Mode, Language, Audio & Real Platform */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              
              {/* PRESENTATION DESK BUTTON (GOLDEN) */}
              <button
                onClick={() => {
                  setIsPresentationDeskOpen(true);
                  tacticalAudio.playRadioChirp();
                }}
                className="px-3 py-1.5 rounded-xl font-bold font-mono text-xs bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:brightness-110 text-slate-950 shadow-lg shadow-amber-500/30 border border-yellow-300 flex items-center space-x-1.5 cursor-pointer transition-transform active:scale-95 shrink-0"
              >
                <Award className="w-3.5 h-3.5 text-slate-950" />
                <span>🎤 PRESENTATION DESK</span>
              </button>

              {/* 1. Citizen SOS Distress Queue Button */}
              <button
                onClick={() => setIsCitizenSOSOpen(true)}
                title="Citizen SOS Distress Queue"
                className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-rose-950/90 hover:bg-rose-900 border border-rose-600/70 text-rose-200 text-xs font-hud font-bold transition-all shadow-md cursor-pointer shrink-0"
              >
                <AlertOctagon className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>SOS</span>
              </button>

              {/* 2. Direct 3D Elevation Slicing Button */}
              <button
                onClick={() => setIsElevationOpen(true)}
                title="3D Topographic Elevation & Levee Spillover Slicing"
                className="hidden xl:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-[#091224] hover:bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-hud font-bold transition-all shadow-md cursor-pointer shrink-0"
              >
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>3D Elevation</span>
              </button>

              {/* 3. Signature Google Gemini AI Button */}
              <button
                onClick={() => setIsAICopilotOpen(true)}
                title="Google Gemini AI Incident Commander"
                className="flex items-center space-x-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-hud font-black transition-all shadow-md border border-cyan-300/40 cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                <span className="hidden lg:inline">Gemini AI</span>
              </button>

              {/* 4. Real Alert / Helpline Button */}
              <button
                onClick={() => setIsBroadcastOpen(true)}
                title="Send Real Mobile SMS / Siren Warning"
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white text-xs font-bold font-hud shadow-md transition-all cursor-pointer shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden xl:inline">Alert</span>
              </button>

              {/* ALL 16 COMMAND TOOLS DROPDOWN MENU */}
              <div className="relative" ref={headerToolsMenuRef}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsHeaderToolsMenuOpen(prev => !prev);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-200 font-bold text-xs flex items-center space-x-1 cursor-pointer transition-all"
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">16 Engines Hub ▾</span>
                  <span className="sm:hidden">Tools ▾</span>
                </button>

                {isHeaderToolsMenuOpen && (
                  <div 
                    onClick={(e) => e.stopPropagation()} 
                    style={{ backgroundColor: '#070e1d' }}
                    className="absolute right-0 top-full mt-2.5 w-80 sm:w-[480px] md:w-[540px] max-h-[82vh] overflow-y-auto rounded-3xl bg-[#070e1d] border border-cyan-500/50 p-4 sm:p-5 shadow-[0_25px_80px_rgba(0,0,0,0.99)] z-[200] space-y-4 ring-1 ring-cyan-500/30"
                  >
                    {/* Deck Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-cyan-300">
                          <Layers className="w-4 h-4 text-cyan-400 animate-pulse" />
                        </div>
                        <div>
                          <div className="text-xs font-hud font-black uppercase tracking-wider text-cyan-300">
                            16 SOVEREIGN C2 ENGINES HUB
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 flex items-center space-x-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            <span className="text-emerald-300 font-bold">CALIBRATED BENCHMARKS READY</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-200">
                        {authUser?.role || 'Defense Jury'}
                      </span>
                    </div>

                    {/* Section 1: Surveillance & Comms */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>📡 Surveillance, Drone AI & Comms</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                        <button
                          onClick={() => { setIsDroneCCTVOpen(true); setIsHeaderToolsMenuOpen(false); }}
                          className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-purple-500/25 hover:border-purple-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                        >
                          <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-400 group-hover:scale-110 transition-transform shrink-0">
                            <Video className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-100 group-hover:text-purple-200 truncate">Drone & CCTV Fleet</div>
                            <div className="text-[10px] text-slate-400 truncate">FLIR & Optical Feeds</div>
                          </div>
                        </button>

                        <button
                          onClick={() => { setIsVoiceRadioOpen(true); setIsHeaderToolsMenuOpen(false); }}
                          className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-purple-500/25 hover:border-purple-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                        >
                          <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-400 group-hover:scale-110 transition-transform shrink-0">
                            <Radio className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-100 group-hover:text-purple-200 truncate">Voice Radio SITREPs</div>
                            <div className="text-[10px] text-slate-400 truncate">Tactical Audio TTS</div>
                          </div>
                        </button>

                        <button
                          onClick={() => { setIsMeshOpen(true); setIsHeaderToolsMenuOpen(false); }}
                          className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-amber-500/25 hover:border-amber-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                        >
                          <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400 group-hover:scale-110 transition-transform shrink-0">
                            <WifiOff className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-100 group-hover:text-amber-200 truncate">LoRa Mesh Network</div>
                            <div className="text-[10px] text-slate-400 truncate">Offline P2P Telemetry</div>
                          </div>
                        </button>

                        <button
                          onClick={() => { setIsQRCodeOpen(true); setIsHeaderToolsMenuOpen(false); }}
                          className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-teal-500/25 hover:border-teal-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(20,184,166,0.2)]"
                        >
                          <div className="p-2 rounded-xl bg-teal-950/80 border border-teal-500/40 text-teal-400 group-hover:scale-110 transition-transform shrink-0">
                            <QrCode className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-100 group-hover:text-teal-200 truncate">Citizen QR Pack</div>
                            <div className="text-[10px] text-slate-400 truncate">Geo-Location Evacuation</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Section 2: Physics & Satellites */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>🌊 Hydrodynamic Physics & Satellites</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                        <button
                          onClick={() => { setIsGLOFOpen(true); setIsHeaderToolsMenuOpen(false); }}
                          className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-cyan-500/25 hover:border-cyan-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                        >
                          <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 group-hover:scale-110 transition-transform shrink-0">
                            <Mountain className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-100 group-hover:text-cyan-200 truncate">GLOF Early Warning</div>
                            <div className="text-[10px] text-slate-400 truncate">Moraine Burst Hydrograph</div>
                          </div>
                        </button>

                        <button
                          onClick={() => { setIsMOSDACOpen(true); setIsHeaderToolsMenuOpen(false); }}
                          className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-blue-500/25 hover:border-blue-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                        >
                          <div className="p-2 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-400 group-hover:scale-110 transition-transform shrink-0">
                            <Satellite className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-100 group-hover:text-blue-200 truncate">MOSDAC Satellites</div>
                            <div className="text-[10px] text-slate-400 truncate">ISRO Rainfall Telemetry</div>
                          </div>
                        </button>

                        <button
                          onClick={() => { setIsCWCGaugesOpen(true); setIsHeaderToolsMenuOpen(false); }}
                          className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-teal-500/25 hover:border-teal-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(20,184,166,0.2)]"
                        >
                          <div className="p-2 rounded-xl bg-teal-950/80 border border-teal-500/40 text-teal-400 group-hover:scale-110 transition-transform shrink-0">
                            <Waves className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-100 group-hover:text-teal-200 truncate">CWC River Gauges</div>
                            <div className="text-[10px] text-slate-400 truncate">Water Stage Telemetry</div>
                          </div>
                        </button>

                        <button
                          onClick={() => { setIsDamOpen(true); setIsHeaderToolsMenuOpen(false); }}
                          className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-rose-500/25 hover:border-rose-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                        >
                          <div className="p-2 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-400 group-hover:scale-110 transition-transform shrink-0">
                            <Activity className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-100 group-hover:text-rose-200 truncate">Dam Hydrograph</div>
                            <div className="text-[10px] text-slate-400 truncate">Sluice Discharge Rates</div>
                          </div>
                        </button>

                        <button
                          onClick={() => { setIsElevationOpen(true); setIsHeaderToolsMenuOpen(false); }}
                          className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-emerald-500/25 hover:border-emerald-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                        >
                          <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                            <TrendingUp className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-100 group-hover:text-emerald-200 truncate">Elevation DEM Slicing</div>
                            <div className="text-[10px] text-slate-400 truncate">LiDAR Topo Contours</div>
                          </div>
                        </button>

                        <button
                          onClick={() => { setIsSAROpen(true); setIsHeaderToolsMenuOpen(false); }}
                          className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-cyan-500/25 hover:border-cyan-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                        >
                          <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 group-hover:scale-110 transition-transform shrink-0">
                            <Radar className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-100 group-hover:text-cyan-200 truncate">Satellite SAR Radar</div>
                            <div className="text-[10px] text-slate-400 truncate">InSAR Flood Extent</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Section 3: Relief & AI */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>🏥 Relief Coordination & Incident AI</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                        <button
                          onClick={() => { setIsHospitalSurgeOpen(true); setIsHeaderToolsMenuOpen(false); }}
                          className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-rose-500/25 hover:border-rose-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                        >
                          <div className="p-2 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-400 group-hover:scale-110 transition-transform shrink-0">
                            <HeartPulse className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-100 group-hover:text-rose-200 truncate">Hospital Surge</div>
                            <div className="text-[10px] text-slate-400 truncate">ICU Beds & Ambulances</div>
                          </div>
                        </button>

                        <button
                          onClick={() => { setIsAICopilotOpen(true); setIsHeaderToolsMenuOpen(false); }}
                          className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-teal-500/25 hover:border-teal-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(20,184,166,0.2)]"
                        >
                          <div className="p-2 rounded-xl bg-teal-950/80 border border-teal-500/40 text-teal-400 group-hover:scale-110 transition-transform shrink-0">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-100 group-hover:text-teal-200 truncate">Google Gemini Copilot</div>
                            <div className="text-[10px] text-slate-400 truncate">Incident Action AI</div>
                          </div>
                        </button>

                        <button
                          onClick={() => { setIsICS201Open(true); setIsHeaderToolsMenuOpen(false); }}
                          className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-emerald-500/25 hover:border-emerald-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                        >
                          <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-100 group-hover:text-emerald-200 truncate">NDMA ICS-201 Form</div>
                            <div className="text-[10px] text-slate-400 truncate">Action Plan Document</div>
                          </div>
                        </button>

                        <button
                          onClick={() => { setIsMultiHazardOpen(true); setIsHeaderToolsMenuOpen(false); }}
                          className="group p-2.5 rounded-2xl bg-[#0c1833] hover:bg-[#132652] border border-amber-500/25 hover:border-amber-400 text-left flex items-start space-x-2.5 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                        >
                          <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400 group-hover:scale-110 transition-transform shrink-0">
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-100 group-hover:text-amber-200 truncate">Multi-Hazard Simulation</div>
                            <div className="text-[10px] text-slate-400 truncate">Hazmat Plumes & Fire</div>
                          </div>
                        </button>
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-xl p-1 text-[11px]">
                <button
                  onClick={() => setViewMode('COCKPIT')}
                  className={`px-2.5 py-0.5 rounded-lg transition-all cursor-pointer font-bold ${
                    viewMode === 'COCKPIT' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cockpit
                </button>
                <button
                  onClick={() => setViewMode('SCROLLING_PORTAL')}
                  className={`px-2.5 py-0.5 rounded-lg transition-all cursor-pointer font-bold ${
                    viewMode === 'SCROLLING_PORTAL' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Citizen Portal
                </button>
              </div>

              {/* Language Switcher (6 Indian Languages) */}
              <div className="hidden lg:flex items-center space-x-0.5 bg-slate-900 border border-slate-800 rounded-xl p-1 text-[11px]">
                {(['en', 'hi', 'mr', 'bn', 'ta', 'te'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`px-1.5 py-0.5 rounded-lg transition-all cursor-pointer font-bold ${
                      activeLang === lang ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिं' : lang === 'mr' ? 'मरा' : lang === 'bn' ? 'বাং' : lang === 'ta' ? 'தமி' : 'తెలు'}
                  </button>
                ))}
              </div>

              {/* Audio Toggle */}
              <button
                onClick={toggleAudio}
                title={isAudioMuted ? 'Unmute tactical audio soundscape' : 'Mute audio soundscape'}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
              >
                {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />}
              </button>

              {/* Light / Dark Mode Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-400 text-amber-400 hover:scale-105 transition-all shadow-md cursor-pointer"
                title={theme === 'dark' ? "Switch to Light Theme" : "Switch to Dark Theme"}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-400" />
                )}
              </button>

              {/* Officer Profile & Logout Button */}
              {authUser && (
                <button
                  onClick={() => {
                    setAuthUser(null);
                    localStorage.removeItem('civictwin_officer');
                    showToast('Officer logged out');
                  }}
                  title={`Logged in as ${authUser.name} (${authUser.role}) - Click to Logout`}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-red-950/80 border border-slate-800 hover:border-red-600 text-slate-300 hover:text-red-300 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}

              {/* Return to Live Telemetry App */}
              <a
                href="/"
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold transition-all flex items-center space-x-1 cursor-pointer"
              >
                <span>← Real Platform</span>
              </a>
            </div>
          </div>

          {/* BOTTOM ROW: EMERGENCY BROADCAST MARQUEE & LIVE CLOCK */}
          <div className="flex items-center justify-between gap-3 pt-1.5 text-xs text-slate-300">
            <div className="flex items-center space-x-2 truncate">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
              <span className="px-2 py-0.5 rounded font-black text-[10px] uppercase bg-rose-950 text-rose-300 border border-rose-500/50 shrink-0">
                ⚠️ EAS BROADCAST
              </span>
              <span className="truncate text-slate-300 text-[11px] font-sans">
                <strong>{currentTwinState.city_name}:</strong> Severe hydro-dynamic surge detected. Peak discharge: {Math.round((currentTwinState.metrics?.peakDischargeCumecs || comprehensiveState.state.metrics.peakDischargeCumecs) * sensitivityMultiplier).toLocaleString()} m³/s. Inundation modeling active.
              </span>
            </div>

            <div className="hidden sm:flex items-center space-x-3 shrink-0 text-[11px] font-mono text-slate-400">
              <button
                onClick={handleSyncLiveWeather}
                disabled={isSyncingWeather}
                className="hover:text-cyan-300 flex items-center space-x-1 cursor-pointer transition-colors"
                title="Sync IMD Doppler Weather Radar"
              >
                <CloudRain className={`w-3.5 h-3.5 ${isSyncingWeather ? 'animate-spin text-cyan-400' : 'text-slate-400'}`} />
                <span>{isSyncingWeather ? 'Syncing...' : 'IMD Doppler'}</span>
              </button>
              <div className="flex items-center space-x-1 text-cyan-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{currentTime} IST</span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* 2. QUANTITATIVE IMPACT & ROI TICKER RIBBON (Pillar 7) */}
      <div className="w-full bg-[#040813] border-b border-cyan-500/20 py-2 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              SOVEREIGN VALIDATION ROI:
            </span>
            <div className="flex items-center space-x-1.5">
              <span>⏱️ Warning Lead Time Gained:</span>
              <strong className="text-emerald-300">+{currentTwinState.metrics?.warningLeadTimeGainedMin || comprehensiveState.state.metrics.warningLeadTimeGainedMin || 42} Minutes</strong>
            </div>
            <div className="flex items-center space-x-1.5">
              <span>👥 Citizens Safely Routed:</span>
              <strong className="text-cyan-300">{(currentTwinState.metrics?.citizensSafeguarded || comprehensiveState.state.metrics.citizensSafeguarded || 14200).toLocaleString()}</strong>
            </div>
            <div className="flex items-center space-x-1.5">
              <span>⚡ Critical Substations Preserved:</span>
              <strong className="text-amber-300">3 Substations</strong>
            </div>
            <div className="flex items-center space-x-1.5">
              <span>💰 Direct Damage Mitigated:</span>
              <strong className="text-emerald-300">₹240+ Crores</strong>
            </div>
          </div>

          {/* Autopilot 90-Second Guided Jury Tour Button (Pillar 7) */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setIsJuryTourActive(!isJuryTourActive);
                if (!isJuryTourActive) setJuryTourStep(1);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md ${
                isJuryTourActive
                  ? 'bg-amber-600 text-white shadow-amber-500/30 animate-pulse'
                  : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-cyan-500/20'
              }`}
            >
              {isJuryTourActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isJuryTourActive ? `🎬 AUTOPILOT TOUR: STEP ${juryTourStep}/5` : '🎬 90-SEC JURY TOUR'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Floating Emergency Toast Alert */}
      {toastMessage && (
        <div className="fixed top-28 right-5 z-50 p-3.5 rounded-xl bg-slate-900/95 border border-cyan-500/50 shadow-2xl flex items-center space-x-2.5 text-xs text-cyan-200 animate-bounce">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. MAIN DASHBOARD CONTENT */}
      {viewMode === 'SCROLLING_PORTAL' ? (
        /* PUBLIC CITIZEN SCROLLING PORTAL */
        <PublicScrollingPortal
          state={currentTwinState}
          authUser={authUser}
          onSwitchCity={handleSwitchCity}
          onLaunchFullCockpit={() => setViewMode('COCKPIT')}
          onOpenCalibratedSim={() => setViewMode('COCKPIT')}
          onOpenGemini={() => setIsAICopilotOpen(true)}
          onOpenWeather={() => setIsLiveWeatherOpen(true)}
          onOpenCitizenSOS={() => setIsCitizenSOSOpen(true)}
          onOpenGPSLocationSOS={() => setIsCitizenSOSOpen(true)}
          onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
          onLoginRequest={() => setIsLoginModalOpen(true)}
          onLogout={() => setAuthUser(null)}
          onResolveLocation={handleResolveLocation}
        />
      ) : (
        /* COMMAND COCKPIT VIEW */
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 space-y-4">
          
          {/* 0. MASTER SIMULATION CONTROLLER & TIMELINE HUD (STOPPED BY DEFAULT) */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#050c1b]/98 via-[#0b1b38]/95 to-[#050c1b]/98 border border-cyan-500/40 shadow-[0_12px_40px_rgba(0,0,0,0.85)] ring-1 ring-cyan-500/20 backdrop-blur-xl p-3.5 sm:p-4 text-xs space-y-3">
            
            {/* Top Telemetry & Status HUD Header Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-cyan-500/20 text-[11px] font-mono">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold">
                  <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span className="tracking-wider uppercase font-hud">HYDRO-TWIN C2 CONTROLLER</span>
                </div>
                <span className="text-slate-500 hidden sm:inline">•</span>
                <span className="text-slate-300 font-bold truncate max-w-[200px] sm:max-w-xs">
                  {baseScenario.name} ({baseScenario.state})
                </span>
              </div>

              {/* Dynamic Readouts: Discharge, Rain, IST Clock */}
              <div className="flex items-center space-x-2 text-[10px] sm:text-[11px]">
                <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-slate-300">
                  <Waves className="w-3 h-3 text-cyan-400" />
                  <span>Peak Inflow:</span>
                  <strong className="text-cyan-300">
                    {Math.round((currentTwinState.metrics?.peakDischargeCumecs || comprehensiveState.state.metrics.peakDischargeCumecs) * sensitivityMultiplier).toLocaleString()} m³/s
                  </strong>
                </div>

                <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-slate-300">
                  <CloudRain className="w-3 h-3 text-blue-400" />
                  <span>Rain:</span>
                  <strong className="text-blue-300">
                    {currentTwinState.rain_intensity_mmhr?.toFixed(0) || 0} mm/h
                  </strong>
                </div>

                <div className="hidden md:flex items-center space-x-1 text-slate-400 px-2 py-0.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>{currentTime} IST</span>
                </div>
              </div>
            </div>

            {/* Bottom Controls Deck: Playback Controls + Interactive Timeline Scrubber */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-3.5">
              
              {/* Left: Big Play/Pause Toggle + Status Pill + Reset + Step Buttons + Speed */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full lg:w-auto">
                
                {/* START / PAUSE BUTTON */}
                <button
                  onClick={handleToggleSimulation}
                  className={`px-4 py-2 rounded-xl font-bold font-mono text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-lg active:scale-95 border ${
                    isPlaying
                      ? 'bg-gradient-to-r from-amber-600 via-rose-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white shadow-rose-500/30 border-rose-400 ring-1 ring-rose-400/40'
                      : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-emerald-500/40 border-emerald-400 ring-1 ring-emerald-400/40 animate-pulse'
                  }`}
                  title={isPlaying ? "Pause simulation progression" : "Start real-time digital twin simulation"}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                  <span className="tracking-wide uppercase font-black font-hud">
                    {isPlaying ? 'PAUSE SIMULATION' : 'START SIMULATION'}
                  </span>
                </button>

                {/* Simulation Status Indicator Pill */}
                <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border font-mono text-[11px] backdrop-blur-md ${
                  isPlaying 
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]' 
                    : 'bg-amber-950/80 border-amber-500/50 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                  <span className="font-black tracking-wider">{isPlaying ? 'LIVE ADVANCING' : 'STANDBY (PAUSED)'}</span>
                </div>

                {/* Reset to T+0.0h */}
                <button
                  onClick={handleResetSimulation}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/90 text-slate-300 hover:text-white font-mono text-[11px] flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                  title="Reset timeline to T+0.0h (Standby Baseline)"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Reset (T+0.0h)</span>
                </button>

                {/* Time Step Buttons */}
                <div className="flex items-center space-x-1 bg-slate-950/90 p-1 rounded-xl border border-slate-800 shadow-inner">
                  <button
                    onClick={() => handleStepSimulation(-0.5)}
                    className="px-2 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-[10px] font-mono font-bold cursor-pointer transition-all"
                    title="Step back 30 minutes"
                  >
                    -0.5h
                  </button>
                  <div className="w-[1px] h-3 bg-slate-800" />
                  <button
                    onClick={() => handleStepSimulation(0.5)}
                    className="px-2 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-[10px] font-mono font-bold cursor-pointer transition-all"
                    title="Step forward 30 minutes"
                  >
                    +0.5h
                  </button>
                </div>

                {/* Playback Speed Multiplier */}
                <div className="flex items-center space-x-1 bg-slate-950/90 p-1 rounded-xl border border-slate-800 shadow-inner">
                  <span className="text-[10px] text-slate-500 font-bold px-1 uppercase">Speed:</span>
                  {[1.0, 2.0, 5.0].map((s) => (
                    <button
                      key={s}
                      onClick={() => { setPlaybackSpeed(s); triggerAudioChirp(); }}
                      className={`px-1.5 py-0.5 rounded-lg font-mono text-[10px] font-bold cursor-pointer transition-all ${
                        playbackSpeed === s
                          ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Interactive Timeline Scrubbing Slider + Milestone Markers + Submerged Pill */}
              <div className="flex flex-col space-y-1 w-full lg:w-auto">
                <div className="flex items-center justify-between space-x-3">
                  <div className="flex items-center space-x-1.5 shrink-0 px-2 py-1 rounded-lg bg-cyan-950/70 border border-cyan-500/40">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-mono text-cyan-300 font-black text-xs tracking-wider">
                      T + {currentTwinState.timeline_hour.toFixed(2)}h
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="12"
                    step="0.1"
                    value={currentTwinState.timeline_hour}
                    onChange={(e) => handleScrubTimeline(parseFloat(e.target.value))}
                    className="w-32 sm:w-48 md:w-56 accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                    title="Scrub timeline from T+0.0h to T+12.0h"
                  />

                  <div className="flex items-center space-x-1.5 text-[11px] font-mono shrink-0">
                    <span className="px-2.5 py-1 rounded-xl bg-rose-950/90 text-rose-300 font-bold border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.25)] flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                      <span>{currentTwinState.nodes?.filter(n => n.status === 'submerged').length || 0} Submerged</span>
                    </span>
                  </div>
                </div>

                {/* Timeline Milestone Markers */}
                <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 px-1 pt-0.5">
                  <button onClick={() => handleScrubTimeline(0)} className="hover:text-cyan-300 cursor-pointer transition-colors">0h (Base)</button>
                  <button onClick={() => handleScrubTimeline(3)} className="hover:text-cyan-300 cursor-pointer transition-colors">3h (Surge)</button>
                  <button onClick={() => handleScrubTimeline(6)} className="hover:text-cyan-300 cursor-pointer transition-colors font-bold text-amber-400">6h (Peak)</button>
                  <button onClick={() => handleScrubTimeline(9)} className="hover:text-cyan-300 cursor-pointer transition-colors">9h (Recede)</button>
                  <button onClick={() => handleScrubTimeline(12)} className="hover:text-cyan-300 cursor-pointer transition-colors">12h (Stable)</button>
                </div>
              </div>

            </div>

          </div>
          
          {/* INTERACTIVE CALIBRATION & SENSITIVITY CONTROLS */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#060e1d]/95 via-[#0b1b36]/90 to-[#060e1d]/95 border border-cyan-500/25 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs backdrop-blur-md">
            
            {/* Sensitivity Multiplier Slider */}
            <div className="flex items-center space-x-3">
              <span className="text-cyan-400 font-bold uppercase text-[11px] font-mono flex items-center space-x-1">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Hydraulic Sensitivity:</span>
              </span>
              <input 
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={sensitivityMultiplier}
                onChange={(e) => {
                  setSensitivityMultiplier(parseFloat(e.target.value));
                  triggerAudioChirp();
                }}
                className="w-28 sm:w-36 accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <span className="px-2 py-0.5 rounded-lg bg-cyan-950/90 text-cyan-300 font-mono font-bold border border-cyan-500/40 shadow-sm">
                {sensitivityMultiplier.toFixed(1)}x Multiplier
              </span>
              <span className="text-[11px] font-mono text-slate-400 hidden md:inline">
                (Peak Inflow: <span className="text-cyan-300 font-bold">{Math.round((currentTwinState.metrics?.peakDischargeCumecs || comprehensiveState.state.metrics.peakDischargeCumecs) * sensitivityMultiplier).toLocaleString()} m³/s</span>)
              </span>
            </div>

            {/* Vehicle Wading Clearance Filter (Pillar 4) */}
            <div className="flex items-center space-x-1 bg-slate-950/90 p-1 rounded-xl border border-slate-800 shadow-inner">
              <span className="text-slate-400 text-[10px] uppercase font-bold px-1.5 font-mono">Clearance:</span>
              <button
                onClick={() => setVehicleWadingFilter('all')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer font-mono font-bold text-xs ${
                  vehicleWadingFilter === 'all' ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-200 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setVehicleWadingFilter('car')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer font-mono font-bold text-xs flex items-center space-x-1 ${
                  vehicleWadingFilter === 'car' ? 'bg-amber-600 text-white shadow-md shadow-amber-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Car className="w-3 h-3" />
                <span>Car (0.25m)</span>
              </button>
              <button
                onClick={() => setVehicleWadingFilter('truck')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer font-mono font-bold text-xs flex items-center space-x-1 ${
                  vehicleWadingFilter === 'truck' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Truck className="w-3 h-3" />
                <span>NDRF Truck (0.85m)</span>
              </button>
              <button
                onClick={() => setVehicleWadingFilter('boat')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer font-mono font-bold text-xs flex items-center space-x-1 ${
                  vehicleWadingFilter === 'boat' ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Ship className="w-3 h-3" />
                <span>Boat (0.3m+)</span>
              </button>
            </div>

            {/* 3D Topographic Tilt Toggle & Map Renderer Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIs3DTiltActive(!is3DTiltActive)}
                className={`px-3 py-1.5 rounded-xl font-bold font-mono transition-all flex items-center space-x-1.5 cursor-pointer border ${
                  is3DTiltActive
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-500/30'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-700/80'
                }`}
              >
                <Mountain className="w-3.5 h-3.5 text-cyan-300" />
                <span>{is3DTiltActive ? '3D Topo: ACTIVE (25°)' : 'Enable 3D Topo'}</span>
              </button>

              <button
                onClick={() => setMapRenderMode(prev => prev === 'calibrated_vector' ? 'satellite_gis' : 'calibrated_vector')}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-mono font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-sm"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>{mapRenderMode === 'calibrated_vector' ? 'GIS Satellite View' : 'Vector Contours'}</span>
              </button>
            </div>

          </div>

          {/* MODAL LAUNCHER TOOLBAR (Pillars 2, 6, 7 + Production Tools) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
            <button
              onClick={() => setIsXAIModalOpen(true)}
              className="p-3 rounded-xl bg-[#09152a] hover:bg-[#0e2142] border border-cyan-500/30 text-cyan-200 font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer shadow-md group"
            >
              <FlaskConical className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>1. Explainable Physics (XAI)</span>
            </button>

            <button
              onClick={() => setIsPhotoInspectorOpen(true)}
              className="p-3 rounded-xl bg-[#09152a] hover:bg-[#0e2142] border border-purple-500/30 text-purple-200 font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer shadow-md group"
            >
              <Camera className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              <span>2. Gemini Drone & Photo AI</span>
            </button>

            <button
              onClick={() => setIsCertificateModalOpen(true)}
              className="p-3 rounded-xl bg-[#09152a] hover:bg-[#0e2142] border border-emerald-500/30 text-emerald-200 font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer shadow-md group"
            >
              <Award className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>3. Sovereign Provenance</span>
            </button>

            <button
              onClick={() => setIsFamilyCardModalOpen(true)}
              className="p-3 rounded-xl bg-[#09152a] hover:bg-[#0e2142] border border-amber-500/30 text-amber-200 font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer shadow-md group"
            >
              <FileText className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>4. Family Emergency Card</span>
            </button>

            <button
              onClick={() => setIsSAROpen(true)}
              className="p-3 rounded-xl bg-[#09152a] hover:bg-[#0e2142] border border-blue-500/30 text-blue-200 font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer shadow-md group"
            >
              <Satellite className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
              <span>5. Satellite SAR Radar</span>
            </button>

            <button
              onClick={() => setIsAICopilotOpen(true)}
              className="p-3 rounded-xl bg-[#09152a] hover:bg-[#0e2142] border border-teal-500/30 text-teal-200 font-bold text-xs transition-all flex items-center space-x-2 cursor-pointer shadow-md group"
            >
              <Sparkles className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
              <span>6. Gemini AI Commander</span>
            </button>
          </div>

          {/* PRIMARY COCKPIT VIEW TABS (ALL CAPABILITIES) */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs">
            <div className="flex flex-wrap items-center gap-1">
              <button
                onClick={() => { setActiveView('map'); triggerRadarPing(); }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center space-x-1.5 ${
                  activeView === 'map'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/25 border border-cyan-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>🗺️ Digital Twin Map</span>
              </button>

              <button
                onClick={() => { setActiveView('tools'); triggerAudioChirp(); }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center space-x-1.5 ${
                  activeView === 'tools'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-500/25 border border-teal-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>🧰 Command Tools Hub</span>
              </button>

              <button
                onClick={() => { setActiveView('sandbox'); triggerAudioChirp(); }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center space-x-1.5 ${
                  activeView === 'sandbox'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-500/25 border border-amber-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>⚡ Crisis Sandbox</span>
              </button>

              <button
                onClick={() => { setActiveView('cascade'); triggerAudioChirp(); }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center space-x-1.5 ${
                  activeView === 'cascade'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-500/25 border border-rose-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>⛓️ Cascade Graph ({currentTwinState.cascade_links?.length || comprehensiveState.state.cascade_links.length})</span>
              </button>

              <button
                onClick={() => { setActiveView('sensors'); triggerAudioChirp(); }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center space-x-1.5 ${
                  activeView === 'sensors'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 border border-indigo-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Waves className="w-3.5 h-3.5" />
                <span>📈 Telemetry Gauges ({currentTwinState.sensors?.length || comprehensiveState.state.sensors.length})</span>
              </button>

              <button
                onClick={() => { setActiveView('radio'); triggerAudioChirp(); }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center space-x-1.5 ${
                  activeView === 'radio'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25 border border-purple-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>📻 Tactical Radio</span>
              </button>

              <button
                onClick={() => { setActiveView('iap'); triggerAudioChirp(); }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center space-x-1.5 ${
                  activeView === 'iap'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25 border border-emerald-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>📋 NDMA ICS-201</span>
              </button>

              <button
                onClick={() => { setActiveView('citizen'); triggerAudioChirp(); }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center space-x-1.5 ${
                  activeView === 'citizen'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 border border-blue-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>👥 Citizen View</span>
              </button>

              <button
                onClick={() => { setActiveView('presentation'); triggerAudioChirp(); }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center space-x-1.5 ${
                  activeView === 'presentation'
                    ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950 font-black shadow-md shadow-amber-500/25 border border-amber-300'
                    : 'text-amber-400 hover:text-white hover:bg-slate-800 border border-amber-500/30'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>📊 Pitch Deck</span>
              </button>

              <button
                onClick={() => { setActiveView('all'); triggerAudioChirp(); }}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
                  activeView === 'all' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-white'
                }`}
              >
                Scroll View
              </button>
            </div>

            <div className="flex items-center space-x-2 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Active City: <strong className="text-cyan-300">{currentTwinState.city_name}</strong></span>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* VIEW: PRESENTATION & JURY PITCH DECK (IN-PAGE VIEW)            */}
          {/* ------------------------------------------------------------- */}
          {(activeView === 'presentation' || activeView === 'all') && (
            <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0a172e] via-[#060e1d] to-[#040914] border border-amber-500/40 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-500/30 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                      🏛️ EXECUTIVE PITCH DECK & CONTROL DESK
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Stage Presentation Ready</span>
                  </div>
                  <h2 className="text-lg font-black text-white font-hud mt-1">
                    CivicTwin AI – National Sovereign Digital Twin Defense Presentation
                  </h2>
                </div>
                <button
                  onClick={() => setIsPresentationDeskOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 font-black text-xs font-mono flex items-center space-x-2 shadow-lg shadow-amber-500/25 cursor-pointer shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>OPEN FULLSCREEN PRESENTATION DESK</span>
                </button>
              </div>

              {/* Quick 1-Click Action Grid for Presentation */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-2">
                <button
                  onClick={() => handlePresentationAction('scenario_sikkim')}
                  className="p-3 rounded-xl bg-slate-900/90 hover:bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-xs font-bold transition-all text-left cursor-pointer"
                >
                  <Mountain className="w-4 h-4 text-cyan-400 mb-1" />
                  <span>Sikkim GLOF (2023)</span>
                </button>

                <button
                  onClick={() => handlePresentationAction('scenario_mumbai')}
                  className="p-3 rounded-xl bg-slate-900/90 hover:bg-blue-950/60 border border-blue-500/40 text-blue-200 text-xs font-bold transition-all text-left cursor-pointer"
                >
                  <Waves className="w-4 h-4 text-blue-400 mb-1" />
                  <span>Mumbai Deluge (2005)</span>
                </button>

                <button
                  onClick={() => handlePresentationAction('open_xai')}
                  className="p-3 rounded-xl bg-slate-900/90 hover:bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs font-bold transition-all text-left cursor-pointer"
                >
                  <Cpu className="w-4 h-4 text-emerald-400 mb-1" />
                  <span>Explainable Math (XAI)</span>
                </button>

                <button
                  onClick={() => handlePresentationAction('open_photo')}
                  className="p-3 rounded-xl bg-slate-900/90 hover:bg-purple-950/60 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all text-left cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-purple-400 mb-1" />
                  <span>Gemini Photo Triage</span>
                </button>

                <button
                  onClick={() => handlePresentationAction('open_mesh')}
                  className="p-3 rounded-xl bg-slate-900/90 hover:bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs font-bold transition-all text-left cursor-pointer"
                >
                  <Radio className="w-4 h-4 text-amber-400 mb-1" />
                  <span>LoRa Offline Mesh</span>
                </button>

                <button
                  onClick={() => handlePresentationAction('open_family_card')}
                  className="p-3 rounded-xl bg-slate-900/90 hover:bg-orange-950/60 border border-orange-500/40 text-orange-200 text-xs font-bold transition-all text-left cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-orange-400 mb-1" />
                  <span>Print Family Card</span>
                </button>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* VIEW 1: GEOSPATIAL MAP (VECTOR CONTOURS OR GIS SATELLITE MAP)  */}
          {/* ------------------------------------------------------------- */}
          {(activeView === 'map' || activeView === 'all') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm font-bold text-white font-hud uppercase">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>
                    {mapRenderMode === 'calibrated_vector'
                      ? '1. Sovereign Calibrated Vector Inundation Map (Pillars 1 & 4)'
                      : '1. National GIS Satellite Digital Twin Map'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-mono">
                  <span className="text-slate-400">Threat Status:</span>
                  <span className="px-2 py-0.5 rounded font-bold bg-rose-500/20 text-rose-400 border border-rose-500/50">
                    {currentTwinState.iap?.overall_threat_level || comprehensiveState.state.iap.overall_threat_level}
                  </span>
                </div>
              </div>

              {mapRenderMode === 'calibrated_vector' ? (
                <CalibratedGeospatialTwinMap
                  comprehensiveState={comprehensiveState}
                  sensitivityMultiplier={sensitivityMultiplier}
                  vehicleWadingFilter={vehicleWadingFilter}
                  is3DTiltActive={is3DTiltActive}
                  timelineHour={currentTwinState.timeline_hour}
                  isPlaying={isPlaying}
                  playbackSpeed={playbackSpeed}
                  onSelectNode={(node) => {
                    setSelectedNode(node);
                    setSelectedSensor(null);
                    triggerAudioChirp();
                  }}
                  highlightedNodeId={selectedNode?.id}
                />
              ) : (
                <div className="rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl h-[560px]">
                  <DigitalTwinMap
                    state={currentTwinState}
                    authUser={authUser}
                    isPlaying={isPlaying}
                    playbackSpeed={playbackSpeed}
                    onTogglePlayback={handleToggleSimulation}
                    onSetSpeed={(speed) => setPlaybackSpeed(speed)}
                    onSwitchCity={handleSwitchCity}
                    onResolveLocation={handleResolveLocation}
                    onSelectNode={(n) => { setSelectedNode(n); setSelectedSensor(null); }}
                    onSelectSensor={(s) => { setSelectedSensor(s); setSelectedNode(null); }}
                    onSelectRoute={(r) => console.log('Route selected:', r)}
                  />
                </div>
              )}

              {/* REAL-TIME OPERATIONAL INTELLIGENCE GRID */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-100 uppercase tracking-wider">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>Real-Time Operations & Inter-Agency Tactical Intelligence</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                  
                  {/* Card 1: Citizen SOS Live Feed Card */}
                  <div className="p-3.5 rounded-2xl bg-[#091224]/85 border border-cyan-500/25 flex flex-col justify-between space-y-2.5 shadow-lg">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center space-x-1.5">
                        <AlertOctagon className="w-4 h-4 text-rose-400" />
                        <span className="text-xs font-bold font-mono text-slate-100">Citizen SOS Queue</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-300 font-sans leading-snug">
                      Crowdsourced WhatsApp & Telegram distress signals with AI confidence triage scoring.
                    </p>
                    <button
                      onClick={() => setIsCitizenSOSOpen(true)}
                      className="w-full py-2 bg-rose-600 hover:bg-rose-500 border border-rose-600 text-white font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>Open SOS Triage</span>
                    </button>
                  </div>

                  {/* Card 2: Citizen Smartphone QR Beacon Card */}
                  <div className="p-3.5 rounded-2xl bg-[#091224]/85 border border-cyan-500/25 flex flex-col justify-between space-y-2.5 shadow-lg">
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
                      className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Open QR Beacon</span>
                    </button>
                  </div>

                  {/* Card 3: 3D Topographic Elevation Slicing Card */}
                  <div className="p-3.5 rounded-2xl bg-[#091224]/85 border border-cyan-500/25 flex flex-col justify-between space-y-2.5 shadow-lg">
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
                      className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Open Elevation Cut</span>
                    </button>
                  </div>

                  {/* Card 4: CCTV & Drone Video Recon Card */}
                  <div className="p-3.5 rounded-2xl bg-[#091224]/85 border border-cyan-500/25 flex flex-col justify-between space-y-2.5 shadow-lg">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center space-x-1.5">
                        <Video className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold font-mono text-slate-100">CCTV & Drone Matrix</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-300 font-sans leading-snug">
                      Municipal subway cameras and UAV survey drone feeds with real-time vehicle detection.
                    </p>
                    <button
                      onClick={() => setIsDroneCCTVOpen(true)}
                      className="w-full py-2 bg-[#0e1b36] hover:bg-[#14264c] border border-cyan-500/40 text-cyan-200 font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Launch CCTV Matrix</span>
                    </button>
                  </div>

                  {/* Card 5: Push-to-Talk Voice AI Radio Card */}
                  <div className="p-3.5 rounded-2xl bg-[#091224]/85 border border-cyan-500/25 flex flex-col justify-between space-y-2.5 shadow-lg">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center space-x-1.5">
                        <MessageSquare className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-bold font-mono text-slate-100">Voice Radio Co-Pilot</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-300 font-sans leading-snug">
                      Tactical walkie-talkie voice radio with authentic squelch static SFX and AI SITREP responses.
                    </p>
                    <button
                      onClick={() => setIsVoiceRadioOpen(true)}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Push-To-Talk Radio</span>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* VIEW 2: COMMAND TOOLS HUB (ALL 16 TOOLS FROM REAL PLATFORM)   */}
          {/* ------------------------------------------------------------- */}
          {(activeView === 'tools' || activeView === 'all') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2 text-sm font-bold text-white font-hud uppercase">
                  <Layers className="w-4 h-4 text-teal-400" />
                  <span>2. Multi-Agency Command Tools Hub (All Operational Modules)</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  16 Civil Defense & Telemetry Engines Active
                </span>
              </div>

              <CommandToolsHub
                state={currentTwinState}
                onOpenMap={() => setActiveView('map')}
                onOpenSandbox={() => setActiveView('sandbox')}
                onOpenCalibratedSim={() => setActiveView('map')}
                onOpenGLOF={() => setIsGLOFOpen(true)}
                onOpenMOSDAC={() => setIsMOSDACOpen(true)}
                onOpenCWCGauges={() => setIsCWCGaugesOpen(true)}
                onOpenMultiHazard={() => setIsMultiHazardOpen(true)}
                onOpenDam={() => setIsDamOpen(true)}
                onOpenElevation={() => setIsElevationOpen(true)}
                onOpenHospitalSurge={() => setIsHospitalSurgeOpen(true)}
                onOpenSAR={() => setIsSAROpen(true)}
                onOpenCitizenSOS={() => setIsCitizenSOSOpen(true)}
                onOpenQRCode={() => setIsQRCodeOpen(true)}
                onOpenDroneCCTV={() => setIsDroneCCTVOpen(true)}
                onOpenVoiceRadio={() => setIsVoiceRadioOpen(true)}
                onOpenMesh={() => setIsMeshOpen(true)}
                onOpenAICopilot={() => setIsAICopilotOpen(true)}
                onOpenICS201={() => setIsICS201Open(true)}
                onOpenProvenance={() => setIsProvenanceOpen(true)}
                onOpenIntegrations={() => setIsIntegrationsOpen(true)}
                onOpenDataExport={() => setIsDataExportOpen(true)}
              />
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* VIEW 3: CRISIS SANDBOX (WHAT-IF SLIDERS & EVENT INJECTION)     */}
          {/* ------------------------------------------------------------- */}
          {(activeView === 'sandbox' || activeView === 'all') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2 text-sm font-bold text-white font-hud uppercase">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>3. Dynamic Crisis Sandbox & Stress Test Controller</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">Real-time What-If Sensitivity</span>
              </div>

              <ScenarioSandbox
                state={currentTwinState}
                isPlaying={isPlaying}
                playbackSpeed={playbackSpeed}
                onTogglePlayback={() => setIsPlaying(!isPlaying)}
                onSetSpeed={(s) => setPlaybackSpeed(s)}
              />
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* VIEW 4: CASCADE FAILURE DEPENDENCY GRAPH                       */}
          {/* ------------------------------------------------------------- */}
          {(activeView === 'cascade' || activeView === 'all') && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-rose-500/30 shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-white font-hud uppercase">
                    INFRASTRUCTURE CASCADE FAILURE TREE & RIPPLE COLLAPSE
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Interdependent node vulnerability: substations, hospitals, road bridges, and drainage outfalls
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-rose-950/80 text-rose-300 font-bold text-xs border border-rose-500/40">
                  {currentTwinState.cascade_links?.length || comprehensiveState.state.cascade_links.length} Active Cross-Links
                </span>
              </div>

              <CascadeFailureGraph
                state={currentTwinState}
                onSelectNodeById={(id) => {
                  const n = currentTwinState.nodes?.find(node => node.id === id) || comprehensiveState.state.nodes.find(node => node.id === id);
                  if (n) {
                    setSelectedNode(n);
                    setSelectedSensor(null);
                    triggerAudioChirp();
                  }
                }}
              />
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* VIEW 5: SENSOR TELEMETRY & CWC HYDROGRAPHS                     */}
          {/* ------------------------------------------------------------- */}
          {(activeView === 'sensors' || activeView === 'all') && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white font-hud uppercase">
                    CENTRAL WATER COMMISSION (CWC) & IMD CALIBRATED TELEMETRY GAUGES
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Real historical water level stages vs sovereign Danger Marks with rolling trend history
                  </p>
                </div>
                <button
                  onClick={() => setIsCWCGaugesOpen(true)}
                  className="px-3 py-1 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border border-indigo-500/40 font-bold text-xs cursor-pointer"
                >
                  Inspect All CWC Stations ↗
                </button>
              </div>

              <SensorTelemetryPanel
                state={currentTwinState}
                onSelectSensor={(s) => {
                  setSelectedSensor(s);
                  setSelectedNode(null);
                  triggerAudioChirp();
                }}
              />
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* VIEW 6: TACTICAL RADIO & AUDIO SITREPS (Pillar 3)             */}
          {/* ------------------------------------------------------------- */}
          {(activeView === 'radio' || activeView === 'all') && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/30 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white font-hud uppercase">
                    MILITARY RADIO CHATTER & SYNTHETIC VOICE SITREP BROADCAST
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Live tactical radio comms across NDRF, Indian Army, and CWC channels with Hindi/English TTS
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsVoiceRadioOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-500/40 font-bold text-xs flex items-center space-x-1 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                    <span>Voice Walkie-Talkie</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Radio Message Feed */}
                <div className="h-[380px] overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80 p-2">
                  <TacticalRadioFeed
                    messages={radioMessages}
                    onSendMessage={handleSendRadio}
                  />
                </div>

                {/* Synthesized Voice SITREP Queue */}
                <div className="space-y-2.5 overflow-y-auto max-h-[380px] p-2 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide border-b border-slate-800 pb-1.5 flex items-center justify-between">
                    <span>Audible SITREP Dispatches:</span>
                    <span className="text-cyan-400 text-[10px]">Click to Listen</span>
                  </div>
                  {comprehensiveState.radioFeedTranscripts.map((msg) => (
                    <div 
                      key={msg.id}
                      className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start justify-between gap-2.5 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1.5">
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            msg.priority === 'EMERGENCY'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}>
                            {msg.priority}
                          </span>
                          <strong className="text-cyan-300 font-mono text-[11px]">{msg.callsign}</strong>
                          <span className="text-slate-500 text-[10px]">({msg.agency})</span>
                        </div>
                        <p className="text-slate-200 font-sans text-xs">
                          {activeLang === 'hi' && msg.hindiMessage ? msg.hindiMessage : msg.message}
                        </p>
                      </div>

                      <button
                        onClick={() => handlePlayVoiceSitrep(msg.message, msg.hindiMessage)}
                        className="p-2 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-300 transition-all cursor-pointer shrink-0"
                        title="Play Voice SITREP"
                      >
                        <Volume2 className="w-4 h-4 text-amber-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* VIEW 7: INCIDENT ACTION PLAN (ICS-201)                        */}
          {/* ------------------------------------------------------------- */}
          {(activeView === 'iap' || activeView === 'all') && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white font-hud uppercase">
                    NATIONAL DISASTER MANAGEMENT AUTHORITY • FORM ICS-201
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Official Incident Action Plan (IAP) summary for commander review, resource tracking, and deployment
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsICS201Open(true)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all text-xs flex items-center space-x-1 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Full ICS-201 Dossier</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all flex items-center space-x-1.5 cursor-pointer text-xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-400" />
                    <span>Print Official IAP</span>
                  </button>
                </div>
              </div>

              <IncidentCommanderPanel
                state={currentTwinState}
                onSelectNodeById={(id) => {
                  const n = currentTwinState.nodes?.find(node => node.id === id) || comprehensiveState.state.nodes.find(node => node.id === id);
                  if (n) {
                    setSelectedNode(n);
                    setSelectedSensor(null);
                    triggerAudioChirp();
                  }
                }}
              />
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* VIEW 8: CITIZEN SAFETY TEXT PORTAL                            */}
          {/* ------------------------------------------------------------- */}
          {(activeView === 'citizen' || activeView === 'all') && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-blue-500/30 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white font-hud uppercase">
                    CITIZEN PUBLIC SAFETY & RELIEF PORTAL (TEXT-FIRST / LOW-BANDWIDTH)
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Accessible safety guidelines, offline safe shelters, SOS triggers, and helpline assistance
                  </p>
                </div>
                <button
                  onClick={() => setIsCitizenPortalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-blue-200 border border-blue-500/40 text-xs font-bold transition-all cursor-pointer"
                >
                  Open Full Citizen Modal ↗
                </button>
              </div>

              <CitizenPortalView
                state={currentTwinState}
                authUser={authUser}
                onOpenGemini={() => setIsAICopilotOpen(true)}
                onOpenMesh={() => setIsMeshOpen(true)}
                onOpenBroadcast={() => setIsBroadcastOpen(true)}
                onOpenSOS={() => setIsCitizenSOSOpen(true)}
              />
            </div>
          )}

        </main>
      )}

      {/* ========================================================================= */}
      {/* ALL MODALS (IMPROVISATIONS, PRESENTATION DESK & PRODUCTION ENGINES)       */}
      {/* ========================================================================= */}

      {/* 1. PRESENTATION DESK MODAL (NEW!) */}
      {isPresentationDeskOpen && (
        <PresentationDeskModal
          onClose={() => setIsPresentationDeskOpen(false)}
          onTriggerAction={handlePresentationAction}
          activeScenarioName={currentTwinState.city_name}
        />
      )}

      {/* 2. Explainable Physics (XAI) Modal */}
      {isXAIModalOpen && (
        <ExplainablePhysicsModal
          scenario={baseScenario}
          multiplier={sensitivityMultiplier}
          onClose={() => setIsXAIModalOpen(false)}
        />
      )}

      {/* 3. Gemini Multimodal Drone & Photo Inspector */}
      {isPhotoInspectorOpen && (
        <GeminiPhotoInspectorModal
          onClose={() => setIsPhotoInspectorOpen(false)}
          onDispatchMission={(title) => {
            showToast(`🚀 Dispatched: ${title}`);
          }}
        />
      )}

      {/* 4. Sovereign Provenance Certificate Modal */}
      {isCertificateModalOpen && (
        <SovereignCertificateModal
          onClose={() => setIsCertificateModalOpen(false)}
        />
      )}

      {/* 5. Family Emergency Action Card Modal */}
      {isFamilyCardModalOpen && (
        <FamilyEmergencyCardModal
          scenario={baseScenario}
          onClose={() => setIsFamilyCardModalOpen(false)}
        />
      )}

      {/* 6. Node / Sensor Inspector Drawer */}
      <NodeInspectorModal
        node={selectedNode}
        sensor={selectedSensor}
        onClose={() => { setSelectedNode(null); setSelectedSensor(null); }}
      />

      {/* 7. Emergency Broadcast Modal */}
      {isBroadcastOpen && (
        <BroadcastModal
          iap={currentTwinState.iap}
          cityName={currentTwinState.city_name}
          onClose={() => setIsBroadcastOpen(false)}
        />
      )}

      {/* 8. Satellite SAR Radar Modal */}
      {isSAROpen && (
        <SatelliteSARModal
          report={sarReport}
          authUser={authUser}
          onClose={() => setIsSAROpen(false)}
          onSyncLiveWeather={handleSyncLiveWeather}
          isSyncing={isSyncingWeather}
        />
      )}

      {/* 9. Interactive Tutorial Modal */}
      {isTutorialOpen && (
        <TutorialModal
          onClose={() => setIsTutorialOpen(false)}
          onOpenLiveSync={handleSyncLiveWeather}
          onOpenBroadcast={() => { setIsTutorialOpen(false); setIsBroadcastOpen(true); }}
        />
      )}

      {/* 10. Data Export Modal */}
      {isDataExportOpen && (
        <DataExportModal
          state={currentTwinState}
          onClose={() => setIsDataExportOpen(false)}
        />
      )}

      {/* 11. Citizen SOS Queue Modal */}
      {isCitizenSOSOpen && (
        <CitizenSOSModal
          cityId={currentTwinState.city_id}
          cityName={currentTwinState.city_name}
          onClose={() => setIsCitizenSOSOpen(false)}
        />
      )}

      {/* 12. Drone & CCTV Video Matrix Modal */}
      {isDroneCCTVOpen && (
        <DroneCCTVModal
          cityId={currentTwinState.city_id}
          cityName={currentTwinState.city_name}
          authUser={authUser}
          onClose={() => setIsDroneCCTVOpen(false)}
        />
      )}

      {/* 13. Push-to-Talk Voice Radio Co-Pilot Modal */}
      {isVoiceRadioOpen && (
        <VoiceRadioCoPilot
          cityName={currentTwinState.city_name}
          onClose={() => setIsVoiceRadioOpen(false)}
        />
      )}

      {/* 14. Multi-Hazard Crisis Sandbox (Hazmat, Earthquake, Fire) */}
      {isMultiHazardOpen && (
        <MultiHazardModal
          cityName={currentTwinState.city_name}
          onClose={() => setIsMultiHazardOpen(false)}
        />
      )}

      {/* 15. Production Integrations Hub */}
      {isIntegrationsOpen && (
        <IntegrationsModal
          onClose={() => setIsIntegrationsOpen(false)}
        />
      )}

      {/* 16. Data Provenance & Ledger Modal */}
      {isProvenanceOpen && (
        <DataProvenanceModal
          cityId={currentTwinState.city_id}
          cityName={currentTwinState.city_name}
          centerCoords={currentTwinState.center_coords}
          onClose={() => setIsProvenanceOpen(false)}
        />
      )}

      {/* 17. NDMA ICS-201 Official Action Plan Modal */}
      {isICS201Open && (
        <ICS201ActionPlanModal
          state={currentTwinState}
          cityName={currentTwinState.city_name}
          onClose={() => setIsICS201Open(false)}
        />
      )}

      {/* 18. Mobile Companion App Modal */}
      {isMobileCompanionOpen && (
        <MobileHeadAppModal
          state={currentTwinState}
          onClose={() => setIsMobileCompanionOpen(false)}
        />
      )}

      {/* 19. Citizen QR Beacon Modal */}
      {isQRCodeOpen && (
        <CitizenQRCodeModal
          cityName={currentTwinState.city_name}
          cityId={currentTwinState.city_id}
          onClose={() => setIsQRCodeOpen(false)}
        />
      )}

      {/* 20. Elevation Profile & Bathymetry Modal */}
      {isElevationOpen && (
        <ElevationProfileModal
          cityName={currentTwinState.city_name}
          rainIntensity={currentTwinState.rain_intensity_mmhr}
          stormSurge={currentTwinState.storm_surge_m}
          onClose={() => setIsElevationOpen(false)}
        />
      )}

      {/* 21. Dam Hydrograph Modal */}
      {isDamOpen && (
        <DamHydrographModal
          cityName={currentTwinState.city_name}
          onClose={() => setIsDamOpen(false)}
        />
      )}

      {/* 22. Hospital ICU & Oxygen Surge Modal */}
      {isHospitalSurgeOpen && (
        <HospitalSurgeModal
          cityName={currentTwinState.city_name}
          onClose={() => setIsHospitalSurgeOpen(false)}
        />
      )}

      {/* 23. Zero-Network Mesh Network Modal */}
      {isMeshOpen && (
        <MeshNetworkModal
          cityName={currentTwinState.city_name}
          onClose={() => setIsMeshOpen(false)}
        />
      )}

      {/* 24. Gemini AI Incident Commander Modal */}
      {isAICopilotOpen && (
        <GeminiAIModal
          cityName={currentTwinState.city_name}
          onClose={() => setIsAICopilotOpen(false)}
        />
      )}

      {/* 25. Real-time Live Weather Radar Modal */}
      {isLiveWeatherOpen && (
        <LiveWeatherModal
          state={currentTwinState}
          onClose={() => setIsLiveWeatherOpen(false)}
          onDeployed={() => showToast('Radar deployed!')}
        />
      )}

      {/* 26. WhatsApp Civil Defense Bot Simulator */}
      {isWhatsAppOpen && (
        <WhatsAppSimulatorModal
          cityName={currentTwinState.city_name}
          onClose={() => setIsWhatsAppOpen(false)}
        />
      )}

      {/* 27. District Selection Modal (Pan-India 780+ Districts) */}
      {isDistrictAtlasOpen && (
        <DistrictSelectionModal
          currentCityName={currentTwinState.city_name}
          authUser={authUser}
          onSelectDistrict={(districtName, lat, lng) => {
            handleResolveLocation(districtName, lat, lng);
            setIsDistrictAtlasOpen(false);
          }}
          onClose={() => setIsDistrictAtlasOpen(false)}
        />
      )}

      {/* 28. Citizen Portal Modal */}
      {isCitizenPortalOpen && (
        <CitizenPortalModal
          authUser={authUser}
          cityName={currentTwinState.city_name}
          onClose={() => setIsCitizenPortalOpen(false)}
          onNavigateToLocation={(lat, lng, label) => {
            handleResolveLocation(label, lat, lng);
            setIsCitizenPortalOpen(false);
          }}
        />
      )}

      {/* 29. Central Water Commission (CWC) Gauges Modal */}
      {isCWCGaugesOpen && (
        <CWCGaugesModal
          isOpen={isCWCGaugesOpen}
          onClose={() => setIsCWCGaugesOpen(false)}
        />
      )}

      {/* 30. ISRO MOSDAC Satellite Telemetry Modal */}
      {isMOSDACOpen && (
        <MOSDACModal
          isOpen={isMOSDACOpen}
          onClose={() => setIsMOSDACOpen(false)}
        />
      )}

      {/* 31. Himalayan Glacial Lake Outburst Flood (GLOF) Modal */}
      {isGLOFOpen && (
        <GLOFModal
          isOpen={isGLOFOpen}
          onClose={() => setIsGLOFOpen(false)}
        />
      )}

    </div>
  );
};

export default CalibratedTwinApp;
