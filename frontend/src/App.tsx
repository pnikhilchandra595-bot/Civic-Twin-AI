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
import { CitizenPortalModal } from './components/CitizenPortalModal';
import { CWCGaugesModal } from './components/CWCGaugesModal';
import { MOSDACModal } from './components/MOSDACModal';
import { GLOFModal } from './components/GLOFModal';
import { CommandToolsHub } from './components/CommandToolsHub';
import { CalibratedSimulationPanel } from './components/CalibratedSimulationPanel';
import { CalibratedScenario } from './data/calibratedSimulationScenarios';
import { 
  Bell, Compass, Layers, Activity, ShieldAlert, MessageSquare, 
  Video, AlertOctagon, Skull, Radar, Sparkles, ChevronDown, Radio as RadioIcon,
  QrCode, TrendingUp, Settings, FlaskConical, ExternalLink,
  Play, Pause, RotateCcw, Clock, Waves, CloudRain, Sliders
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

  // View mode: defaults to full cockpit for direct access to digital twin & simulation tabs
  const [viewMode, setViewMode] = useState<'SCROLLING_PORTAL' | 'COCKPIT'>('COCKPIT');
  const [cockpitView, setCockpitView] = useState<'tools' | 'map' | 'sandbox' | 'calibrated' | 'all'>('map');
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
  const [isCitizenPortalOpen, setIsCitizenPortalOpen] = useState<boolean>(false);
  const [isCWCGaugesOpen, setIsCWCGaugesOpen] = useState<boolean>(false);
  const [isMOSDACOpen, setIsMOSDACOpen] = useState<boolean>(false);
  const [isGLOFOpen, setIsGLOFOpen] = useState<boolean>(false);

  // Active continuous simulation loop state (STOPPED BY DEFAULT - only starts when operator turns it on)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isSyncingWeather, setIsSyncingWeather] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false); // true while district synthesis is in progress
  const [demoMode, setDemoMode] = useState<boolean>(false);
  
  const [radioMessages, setRadioMessages] = useState<RadioMessage[]>([]);
  const [sarReport, setSarReport] = useState<SatelliteSARReport | null>(null);
  const [toastAlert, setToastAlert] = useState<string | null>(null);

  // Live IST Clock
  const [currentTime, setCurrentTime] = useState<string>(() => new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }));
  useEffect(() => {
    const t = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Simulation controls
  const handleToggleSimulation = async () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    try {
      await apiService.setPlayback(nextState ? 'play' : 'pause', playbackSpeed);
    } catch (e) {
      console.error('Playback toggle error:', e);
    }
    setToastAlert(nextState ? `▶️ Simulation RUNNING (${playbackSpeed}x)` : `⏸️ Simulation PAUSED (Standby at T+${state?.timeline_hour.toFixed(2) || '0.00'}h)`);
    setTimeout(() => setToastAlert(null), 3000);
  };

  const handleResetSimulation = () => {
    setIsPlaying(false);
    setState((prevState) => {
      if (!prevState) return prevState;
      return {
        ...prevState,
        timeline_hour: 0.0,
        nodes: prevState.nodes.map(n => ({
          ...n,
          flood_depth_m: (n as any).base_flood_depth ?? 0.0,
          status: 'operational'
        }))
      };
    });
    setToastAlert(`🔄 Simulation reset to T+0.0h Baseline`);
    setTimeout(() => setToastAlert(null), 3000);
  };

  const handleStepSimulation = (deltaHours: number) => {
    setState((prevState) => {
      if (!prevState) return prevState;
      const newTimeline = Math.max(0, Math.min(12, Number((prevState.timeline_hour + deltaHours).toFixed(2))));
      return {
        ...prevState,
        timeline_hour: newTimeline
      };
    });
  };

  const handleScrubTimeline = (hour: number) => {
    setState((prevState) => {
      if (!prevState) return prevState;
      return {
        ...prevState,
        timeline_hour: hour
      };
    });
  };

  // Active continuous digital twin simulation loop
  useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = Math.max(400, Math.floor(1200 / playbackSpeed));
    const timer = setInterval(() => {
      setState((prevState) => {
        if (!prevState || !prevState.nodes || prevState.nodes.length === 0) return prevState;
        const newTimeline = Number((prevState.timeline_hour + 0.05 * playbackSpeed).toFixed(2));
        const updatedNodes = prevState.nodes.map(node => {
          const depthShift = Math.sin(newTimeline * 2 + (node.lat * 10)) * 0.03;
          const newDepth = Math.max(0, Number((node.flood_depth_m + depthShift * (node.vulnerability_index || 0.5)).toFixed(2)));
          let status: any = 'operational';
          if (newDepth > 0.8) status = 'submerged';
          else if (newDepth > 0.3) status = 'critical';
          else if (newDepth > 0.1) status = 'warning';
          return {
            ...node,
            flood_depth_m: newDepth,
            water_level_m: Number((node.elevation_m + newDepth).toFixed(2)),
            status
          };
        });
        return {
          ...prevState,
          timeline_hour: newTimeline,
          nodes: updatedNodes
        };
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  const handleToggleDemoMode = async () => {
    try {
      const res = await apiService.setDemoMode(!demoMode);
      setDemoMode(res.demo_mode);
      setToastAlert(res.demo_mode ? '🎬 STAGE DEMO MODE ACTIVATED: Live external queries bypassed' : '🛰️ REAL TELEMETRY MODE ACTIVATED: Live external queries enabled');
      setTimeout(() => setToastAlert(null), 4000);
    } catch (e) {
      console.error('Failed to toggle demo mode:', e);
    }
  };

  // Initialize digital twin state, radio comms, and SAR
  useEffect(() => {
    // If officer profile is saved in localStorage but JWT token is missing, restore valid token in background
    if (authUser && !localStorage.getItem('civictwin_jwt_token')) {
      apiService.loginOfficer(
        authUser.badgeId || 'NDMA-HQ-01',
        'FieldDemo@2026',
        authUser.userType,
        authUser.assignedState || 'Maharashtra',
        authUser.assignedDistrict || 'Mumbai Suburban'
      );
    }

    const fetchInitial = async () => {
      try {
        const initialState = await apiService.getState();
        setState(initialState);
        const comms = await apiService.getRadioComms();
        setRadioMessages(comms);
        const sar = await apiService.getSatelliteSARReport();
        setSarReport(sar);
        const dm = await apiService.getDemoMode();
        setDemoMode(dm.demo_mode);
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
    apiService.setAuthToken(null);
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

  const handleInjectCalibratedState = (scenario: CalibratedScenario, multiplier: number) => {
    const adjustedDischarge = Math.round(scenario.peakDischargeCumecs * multiplier);
    const adjustedSurge = Number((scenario.peakSurgeDepthM * (0.8 + 0.2 * multiplier)).toFixed(2));
    const adjustedRain = Math.round(scenario.peakRainfallRateMmh * multiplier);

    setState(prev => {
      const calibratedNodes: InfrastructureNode[] = scenario.keyInundatedNodes.map((kn, idx) => {
        const latOffset = (idx * 0.012) * (idx % 2 === 0 ? 1 : -1);
        const lngOffset = (idx * 0.015);
        return {
          id: `calib-node-${scenario.id}-${idx}`,
          name: kn.name,
          node_type: (kn.type as any) || 'dam_levee',
          lat: scenario.coordinates[0] + latOffset,
          lng: scenario.coordinates[1] + lngOffset,
          elevation_m: Math.max(10, 500 - idx * 60),
          status: kn.status,
          vulnerability_index: kn.status === 'submerged' ? 0.98 : kn.status === 'critical' ? 0.85 : 0.65,
          capacity_total: 1000,
          capacity_used: kn.status === 'submerged' ? 0 : 650,
          backup_power_hours: kn.status === 'submerged' ? 0 : 4,
          backup_power_active: kn.status !== 'submerged',
          flood_depth_m: Number((kn.depthM * (0.8 + 0.2 * multiplier)).toFixed(2)),
          structural_integrity: kn.status === 'submerged' ? 15 : kn.status === 'critical' ? 45 : 75,
          population_density: 800,
          details: {
            calibratedScenario: scenario.name,
            historicalEvent: scenario.historicalEvent,
            arrivalMinutes: kn.arrivalMinutes,
            surgeDepthM: kn.depthM
          }
        };
      });

      const calibratedSensors: SensorReading[] = scenario.sensorCalibration.map((sc, idx) => {
        return {
          sensor_id: sc.sensorId,
          sensor_type: 'water_level_gauge',
          name: `${sc.sensorId} (${sc.metric})`,
          lat: scenario.coordinates[0] + (idx * 0.008),
          lng: scenario.coordinates[1] + (idx * 0.009),
          current_value: adjustedDischarge,
          unit: sc.calibratedValue,
          threshold_warning: 50,
          threshold_critical: 80,
          status: sc.status === 'DANGER' ? 'critical' : 'warning',
          trend: 'rising',
          history: [40, 55, 70, 85, 95]
        };
      });

      return {
        ...prev,
        city_name: `${scenario.name}`,
        center_coords: scenario.coordinates,
        rain_intensity_mmhr: adjustedRain,
        storm_surge_m: adjustedSurge,
        levee_breached: true,
        substation_tripped: true,
        nodes: [...calibratedNodes, ...prev.nodes.slice(calibratedNodes.length)],
        sensors: calibratedSensors.length > 0 ? calibratedSensors : prev.sensors,
        iap: {
          ...prev.iap,
          incident_name: `[CALIBRATED BENCHMARK] ${scenario.name}`,
          operational_period: scenario.eventDate,
          overall_threat_level: 'CATASTROPHIC',
          incident_commander_summary: `Sovereign historical benchmark active: ${scenario.historicalEvent}. Calibrated methodology: ${scenario.methodology}. Peak discharge: ${adjustedDischarge.toLocaleString()} m³/s (${multiplier}x multiplier). Surge depth: ${adjustedSurge}m. Celerity: ${scenario.celerityKmh} km/h.`,
          strategic_objectives: scenario.tacticalMitigation,
          public_emergency_alert: `🚨 SOVEREIGN BENCHMARK SIMULATION ACTIVE: ${scenario.name}. Calibrated hydraulic crest propagating downstream.`
        }
      };
    });

    setToastAlert(`🔬 Injected Sovereign Calibrated Scenario: ${scenario.name} (Discharge: ${adjustedDischarge.toLocaleString()} m³/s, Surge: ${adjustedSurge}m)`);
    setTimeout(() => setToastAlert(null), 6000);
  };

  const handleSyncLiveWeather = async () => {
    try {
      setIsSyncingWeather(true);
      const res = await apiService.syncLiveWeather();
      if (res?.state) setState(res.state);
      const rain = res.weather?.rain_rate_mmhr ?? res.weather?.precipitation_mmhr ?? 0;
      const wind = res.weather?.wind_speed_kmh ?? 0;
      setToastAlert(`🌧️ Synced live IMD telemetry: ${rain} mm/h rain, ${wind} km/h wind`);
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
    const safetyTimer = setTimeout(() => setIsSyncing(false), 2500);
    try {
      setIsSyncing(true);
      setToastAlert(`🔍 Resolving micro-catchment terrain & infrastructure...`);
      const newState = await apiService.resolvePanIndiaLocation(query, lat, lng);
      if (newState && newState.city_name) {
        setState(newState);
        setToastAlert(`✅ Digital Twin Synthesized for ${newState.city_name}`);
        setTimeout(() => setToastAlert(null), 3000);
      }
    } catch (e) {
      console.error('Resolve location error:', e);
      setToastAlert(`❌ Failed to resolve location. Reverting to regional baseline.`);
      setTimeout(() => setToastAlert(null), 3000);
    } finally {
      clearTimeout(safetyTimer);
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

  // Persistent 3-Mode Simulation Control Bar (Fits 100% Zoom On All Screens)
  const renderSimulationModeBar = () => (
    <div className="w-full bg-gradient-to-r from-[#040916]/98 via-[#081530]/98 to-[#040916]/98 border-b border-cyan-500/35 py-1.5 px-3 sm:px-5 sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.95)] flex items-center justify-between gap-2.5 backdrop-blur-2xl flex-nowrap overflow-x-auto no-scrollbar shrink-0 text-xs ring-1 ring-cyan-500/20 cyber-scanner-border">
      <div className="flex items-center space-x-2 shrink-0">
        <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-lg bg-cyan-950/80 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)] shrink-0">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
          <span className="text-[10px] font-mono font-black text-cyan-200 uppercase tracking-widest hidden sm:inline shrink-0 text-glow-cyan">
            ENGINE C2:
          </span>
        </div>

        <div className="inline-flex items-center rounded-xl bg-slate-950/90 p-0.5 border border-cyan-500/30 shadow-inner space-x-1 shrink-0">
          {/* Tab 1: Real Telemetry */}
          <button
            onClick={async () => {
              if (demoMode) await handleToggleDemoMode();
              if (cockpitView === 'calibrated') setCockpitView('tools');
              if (viewMode === 'SCROLLING_PORTAL') setViewMode('COCKPIT');
            }}
            className={`px-3 py-1 rounded-lg text-[11px] font-mono font-bold transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 ${
              !demoMode && cockpitView !== 'calibrated'
                ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-md shadow-emerald-500/30 border border-emerald-400 text-glow-emerald ring-1 ring-emerald-400/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span>🛰️ REAL TELEMETRY</span>
            {!demoMode && cockpitView !== 'calibrated' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse" />
            )}
          </button>

          {/* Tab 2: Demo Simulated */}
          <button
            onClick={async () => {
              if (!demoMode) await handleToggleDemoMode();
              if (cockpitView === 'calibrated') setCockpitView('tools');
              if (viewMode === 'SCROLLING_PORTAL') setViewMode('COCKPIT');
            }}
            className={`px-3 py-1 rounded-lg text-[11px] font-mono font-bold transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 ${
              demoMode && cockpitView !== 'calibrated'
                ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white shadow-md shadow-amber-500/30 border border-amber-400 text-glow-amber ring-1 ring-amber-400/30 animate-pulse'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <span>🎬 STAGE DEMO</span>
            {demoMode && cockpitView !== 'calibrated' && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-200 animate-pulse" />
            )}
          </button>

          {/* Tab 3: Calibrated Benchmark Simulation */}
          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={() => {
                setViewMode('COCKPIT');
                setCockpitView('calibrated');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 ${
                cockpitView === 'calibrated'
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md shadow-cyan-500/30 border border-cyan-300 font-black'
                  : 'text-cyan-300 hover:text-white bg-cyan-950/70 hover:bg-cyan-900 border border-teal-500/40'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              <span>🔬 CALIBRATED TWIN</span>
            </button>

            <a
              href="/calibrated"
              target="_blank"
              rel="noreferrer"
              title="Launch Dedicated Standalone Jury Platform (New Tab)"
              className="px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-mono font-bold bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center space-x-1 shrink-0 transition-all cursor-pointer shadow-sm hover:scale-105"
            >
              <ExternalLink className="w-3 h-3" />
              <span className="hidden sm:inline">STANDALONE ↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* View Switcher & Region */}
      <div className="flex items-center space-x-2 text-xs font-mono shrink-0">
        <div className="hidden 2xl:flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 text-[11px] shrink-0">
          <span className="text-slate-500">Region:</span>
          <span className="text-cyan-300 font-bold">{state?.city_name || 'Active Region'}</span>
        </div>

        {viewMode === 'SCROLLING_PORTAL' ? (
          <button
            onClick={() => setViewMode('COCKPIT')}
            className="px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-950 to-blue-950 hover:from-cyan-900 hover:to-blue-900 border border-cyan-500/50 text-cyan-200 font-hud font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md text-xs shrink-0 hover:scale-105"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>ENTER COCKPIT 🎛️</span>
          </button>
        ) : (
          <button
            onClick={() => setViewMode('SCROLLING_PORTAL')}
            className="px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-300 hover:text-white transition-all flex items-center space-x-1.5 cursor-pointer text-xs shrink-0 shadow-sm hover:scale-105"
          >
            <span>CITIZEN PORTAL 🌐</span>
          </button>
        )}
      </div>
    </div>
  );

  // If user is in SCROLLING_PORTAL mode
  if (viewMode === 'SCROLLING_PORTAL') {
    return (
      <div className="min-h-screen w-full bg-[#040711] text-slate-100 flex flex-col">
        {renderSimulationModeBar()}
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
          onOpenCalibratedSim={() => {
            setViewMode('COCKPIT');
            setCockpitView('calibrated');
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
    <div className="min-h-screen w-full bg-transparent text-slate-100 flex flex-col select-none overflow-y-auto">
      {renderSimulationModeBar()}

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
        onOpenCWCGauges={() => setIsCWCGaugesOpen(true)}
        onOpenMOSDAC={() => setIsMOSDACOpen(true)}
        onOpenGLOF={() => setIsGLOFOpen(true)}
        onOpenDistrictAtlas={() => setIsDistrictAtlasOpen(true)}
        onOpenQRCode={() => setIsQRCodeOpen(true)}
        onOpenCitizenPortal={() => setIsCitizenPortalOpen(true)}
        onSyncLiveWeather={() => setIsLiveWeatherOpen(true)}
        isSyncingWeather={isSyncingWeather}
        onSwitchCity={handleSwitchCity}
        activeView="map"
        setActiveView={() => {}}
        demoMode={demoMode}
        onToggleDemoMode={handleToggleDemoMode}
        onOpenCalibratedSim={() => setCockpitView('calibrated')}
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
        /* Main Executive Dashboard Content (For National & State Officers) */
        <div className={`flex-1 w-full ${cockpitView === 'map' ? 'max-w-[99vw] px-2 sm:px-3 py-2 space-y-3' : 'max-w-7xl mx-auto px-4 py-5 space-y-6'}`}>
        
        {/* 0. MASTER SIMULATION CONTROLLER & TIMELINE HUD (STOPPED BY DEFAULT) */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#050c1b]/98 via-[#0b1b38]/95 to-[#050c1b]/98 border border-cyan-500/40 shadow-[0_12px_40px_rgba(0,0,0,0.85)] ring-1 ring-cyan-500/20 backdrop-blur-xl p-3.5 sm:p-4 text-xs space-y-3">
          
          {/* Top Telemetry & Status HUD Header Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-cyan-500/20 text-[11px] font-mono">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="tracking-wider uppercase font-hud">MASTER SIMULATION C2 HUD</span>
              </div>
              <span className="text-slate-500 hidden sm:inline">•</span>
              <span className="text-slate-300 font-bold truncate max-w-[220px] sm:max-w-xs">
                {state?.city_name || 'Active Region'}
              </span>
            </div>

            {/* Dynamic Readouts: Discharge, Rain, Threat Level, IST Clock */}
            <div className="flex items-center space-x-2 text-[10px] sm:text-[11px]">
              <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-slate-300">
                <Waves className="w-3 h-3 text-cyan-400" />
                <span>Inflow:</span>
                <strong className="text-cyan-300">
                  {state?.metrics?.peakDischargeCumecs ? `${Math.round(state.metrics.peakDischargeCumecs).toLocaleString()} m³/s` : '8,450 m³/s'}
                </strong>
              </div>

              <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-slate-300">
                <CloudRain className="w-3 h-3 text-blue-400" />
                <span>Rain:</span>
                <strong className="text-blue-300">
                  {state?.rain_intensity_mmhr?.toFixed(0) || 0} mm/h
                </strong>
              </div>

              <div className="hidden sm:flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-slate-300">
                <span className="text-slate-400">Threat:</span>
                <strong className={`font-bold ${
                  state?.iap?.overall_threat_level === 'CRITICAL' || state?.iap?.overall_threat_level === 'CATASTROPHIC'
                    ? 'text-red-400'
                    : 'text-emerald-400'
                }`}>
                  {state?.iap?.overall_threat_level || 'ELEVATED'}
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
                    onClick={() => handleSetSpeed(s)}
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
                    T + {state?.timeline_hour.toFixed(2) || '0.00'}h
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="12"
                  step="0.1"
                  value={state?.timeline_hour || 0}
                  onChange={(e) => handleScrubTimeline(parseFloat(e.target.value))}
                  className="w-32 sm:w-48 md:w-56 accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  title="Scrub timeline from T+0.0h to T+12.0h"
                />

                <div className="flex items-center space-x-1.5 text-[11px] font-mono shrink-0">
                  <span className="px-2.5 py-1 rounded-xl bg-rose-950/90 text-rose-300 font-bold border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.25)] flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                    <span>{state?.nodes?.filter(n => n.status === 'submerged').length || 0} Submerged</span>
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
        
        {/* RETRO HUD OVERVIEW BANNER (Hidden in dedicated map view for maximum viewing size) */}
        {cockpitView !== 'map' && (
        <section className="p-5 sm:p-6 rounded-3xl bg-[#091224]/90 border border-cyan-500/35 shadow-[0_0_40px_rgba(56,189,248,0.12)] backdrop-blur-md space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-hud text-[11px] font-bold text-cyan-300 uppercase tracking-widest bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/50 shadow-sm">
                  ⚡ AUTONOMOUS DISASTER COMMAND ENGINE
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">🟢 18 LIVE FEEDS ACTIVE</span>
              </div>
              <h2 className="font-hud text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-wider uppercase leading-tight">
                DEFEND CITIES. PREDICT DISASTERS.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl font-sans">
                Real-time physics digital twin synthesizing satellite radar, flood hydrographs, IoT sensors, and NDRF rescue routing for <strong className="text-cyan-300 font-bold">{state?.city_name || 'Active Region'}</strong>.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setIsLiveWeatherOpen(true)}
                className="font-hud px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black transition-all shadow-[0_0_20px_rgba(52,211,153,0.35)] cursor-pointer transform hover:scale-105 flex items-center space-x-1.5"
              >
                <span>SYNC WEATHER 🌧️</span>
              </button>
              <button
                onClick={() => setIsProvenanceOpen(true)}
                className="font-hud px-4 py-2.5 rounded-xl bg-[#0e1b36] hover:bg-[#14264c] border border-cyan-500/40 text-cyan-200 text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center space-x-1.5"
              >
                <span>DATA FEEDS 📊</span>
              </button>
              <button
                onClick={() => setIsICS201Open(true)}
                className="font-hud px-4 py-2.5 rounded-xl bg-[#0e1b36] hover:bg-[#14264c] border border-cyan-500/40 text-cyan-200 text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center space-x-1.5"
              >
                <span>ICS-201 PLAN 📋</span>
              </button>
            </div>
          </div>
        </section>
        )}

        {/* MASTER COCKPIT VIEW SWITCHER */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-gradient-to-r from-[#060e1d]/95 via-[#0a1832]/95 to-[#060e1d]/95 border border-cyan-500/30 rounded-2xl shadow-xl backdrop-blur-xl ring-1 ring-cyan-500/15">
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            <button
              onClick={() => setCockpitView('map')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-2 ${
                cockpitView === 'map'
                  ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white font-black shadow-lg shadow-cyan-500/30 border border-cyan-400 ring-1 ring-cyan-400/40 text-glow-cyan'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800/90 border border-slate-800'
              }`}
            >
              <Compass className="w-4 h-4 text-cyan-300" />
              <span>🗺️ GIS TWIN MAP</span>
            </button>

            <button
              onClick={() => setCockpitView('tools')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-2 ${
                cockpitView === 'tools'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white font-black shadow-lg shadow-blue-500/30 border border-blue-400 ring-1 ring-blue-400/40'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800/90 border border-slate-800'
              }`}
            >
              <Settings className="w-4 h-4 text-cyan-300" />
              <span>🎛️ COMMAND TOOLKIT HUB</span>
            </button>

            <button
              onClick={() => setCockpitView('sandbox')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-2 ${
                cockpitView === 'sandbox'
                  ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white font-black shadow-lg shadow-amber-500/30 border border-amber-400 ring-1 ring-amber-400/40 text-glow-amber'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800/90 border border-slate-800'
              }`}
            >
              <Activity className="w-4 h-4 text-amber-300" />
              <span>⚡ CRISIS SANDBOX</span>
            </button>

            <button
              onClick={() => setCockpitView('calibrated')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-2 ${
                cockpitView === 'calibrated'
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-black shadow-lg shadow-teal-500/30 border border-teal-400 ring-1 ring-teal-400/40 text-glow-emerald'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800/90 border border-slate-800'
              }`}
            >
              <FlaskConical className="w-4 h-4 text-emerald-300" />
              <span>🔬 CALIBRATED SIM</span>
            </button>

            <button
              onClick={() => setCockpitView('all')}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
                cockpitView === 'all'
                  ? 'bg-slate-800 text-white font-bold border border-cyan-500/50 shadow-md'
                  : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Scrollable View</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-slate-300 shadow-md shadow-cyan-500/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-400">Region:</span>
            <strong className="text-cyan-300 font-bold text-glow-cyan">{state?.city_name || 'Active Region'}</strong>
          </div>
        </div>

        {/* VIEW 1: COMMAND TOOLS HUB (PRIMARY WINDOW VIEW) */}
        {cockpitView === 'tools' && (
          <CommandToolsHub
            state={state}
            onOpenMap={() => setCockpitView('map')}
            onOpenSandbox={() => setCockpitView('sandbox')}
            onOpenCalibratedSim={() => setCockpitView('calibrated')}
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
        )}

        {/* VIEW 2 & ALL: INTERACTIVE GEOGRAPHIC DIGITAL TWIN MAP */}
        {(cockpitView === 'map' || cockpitView === 'all') && (
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm font-mono font-bold text-slate-100 uppercase tracking-wider">
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
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            onTogglePlayback={handleTogglePlayback}
            onSetSpeed={handleSetSpeed}
          />
        </section>
        )}

        {/* VIEW 3 & ALL: "WHAT-IF" CRISIS SIMULATION SANDBOX & TIMELINE CONTROLLER */}
        {(cockpitView === 'sandbox' || cockpitView === 'all') && (
        <section className="space-y-2">
          <div className="flex items-center space-x-2 text-sm font-mono font-bold text-slate-100 uppercase tracking-wider">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>2. "What-If" Crisis Sandbox & Timeline Simulation Controls</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#091224]/85 border border-cyan-500/25 shadow-xl text-slate-100">
            <ScenarioSandbox
              state={state}
              isPlaying={isPlaying}
              playbackSpeed={playbackSpeed}
              onTogglePlayback={handleTogglePlayback}
              onSetSpeed={handleSetSpeed}
            />
          </div>
        </section>
        )}

        {/* VIEW 4 & ALL: SOVEREIGN CALIBRATED BENCHMARK SIMULATION SUITE */}
        {(cockpitView === 'calibrated' || cockpitView === 'all') && (
        <section className="space-y-3">
          {/* Standalone Jury Website Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-950/90 via-[#0a182d] to-cyan-950/90 border border-cyan-400/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-teal-400/20 text-teal-300 border border-teal-400/40 font-mono">
                  🏛️ STANDALONE JURY EDITION WEBSITE ACTIVE
                </span>
                <span className="text-[11px] text-cyan-300 font-mono">7 World-Class Scientific Pillars</span>
              </div>
              <h3 className="text-base font-bold text-white font-hud">
                CivicTwin AI – Sovereign Calibrated Digital Twin
              </h3>
              <p className="text-xs text-slate-300 font-sans">
                Dedicated website featuring 3D Topographic Terrain tilt, Explainable Physics XAI (Froehlich Dam Breach, Manning's Roughness), Tactical Soundscape & Audio TTS, Helicopter Landing Zone Evaluator, and SHA-256 Sovereign Provenance.
              </p>
            </div>
            <a
              href="/calibrated"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 hover:brightness-110 text-slate-950 font-black font-mono text-xs flex items-center space-x-2 shadow-xl shadow-cyan-500/30 transition-transform active:scale-95 shrink-0 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>LAUNCH STANDALONE JURY SITE ↗</span>
            </a>
          </div>

          <div className="flex items-center space-x-2 text-sm font-mono font-bold text-slate-100 uppercase tracking-wider">
            <FlaskConical className="w-4 h-4 text-emerald-400" />
            <span>3. Sovereign Calibrated Benchmark Crisis Simulation Suite</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#091224]/85 border border-teal-500/25 shadow-xl text-slate-100">
            <CalibratedSimulationPanel
              onInjectCalibratedState={handleInjectCalibratedState}
              onOpenMap={() => setCockpitView('map')}
            />
          </div>
        </section>
        )}

        {/* EXTRA SECTIONS FOR SCROLLABLE VIEW */}
        {cockpitView === 'all' && (
          <>
            {/* SECTION 3: REAL-TIME OPERATIONAL INTELLIGENCE GRID */}
            <section className="space-y-3">
              <div className="flex items-center space-x-2 text-sm font-mono font-bold text-slate-100 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>3. Real-Time Operations & Inter-Agency Tactical Intelligence</span>
              </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
            
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

            {/* Card 2: Citizen Smartphone QR Beacon Card (NEW!) */}
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

            {/* Card 3: 3D Topographic Elevation Slicing Card (NEW!) */}
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
                Municipal subway cameras and UAV survey drone feeds with real-time YOLOv8 vehicle detection.
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
          <div className="p-4 rounded-2xl bg-[#091224]/85 border border-cyan-500/25 shadow-xl text-slate-100 min-h-[480px]">
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
          <div className="flex items-center space-x-2 text-sm font-mono font-bold text-slate-100 uppercase tracking-wider">
            <RadioIcon className="w-4 h-4 text-emerald-400" />
            <span>5. Live NDRF Inter-Agency Tactical Radio Chatter (All 12 Battalions)</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#091224]/85 border border-cyan-500/25 shadow-xl text-slate-100 h-[420px]">
            <TacticalRadioFeed
              messages={radioMessages}
              onSendMessage={handleSendRadio}
            />
          </div>
        </section>
      </>
    )}

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

      {/* Citizen Safety & Disaster Assistant Portal Modal */}
      {isCitizenPortalOpen && (
        <CitizenPortalModal
          authUser={authUser}
          cityName={state?.city_name || 'Mumbai'}
          onClose={() => setIsCitizenPortalOpen(false)}
          onNavigateToLocation={(lat, lng, label) => handleResolveLocation(label, lat, lng)}
        />
      )}

      {/* Central Water Commission (CWC) Live River Gauges Modal */}
      {isCWCGaugesOpen && (
        <CWCGaugesModal
          isOpen={isCWCGaugesOpen}
          onClose={() => setIsCWCGaugesOpen(false)}
        />
      )}

      {/* ISRO MOSDAC Spaceborne Satellite Telemetry & Numerical Catalog Modal */}
      {isMOSDACOpen && (
        <MOSDACModal
          isOpen={isMOSDACOpen}
          onClose={() => setIsMOSDACOpen(false)}
        />
      )}

      {/* Himalayan Glacial Lake Outburst Flood (GLOF) Early Warning Modal */}
      {isGLOFOpen && (
        <GLOFModal
          isOpen={isGLOFOpen}
          onClose={() => setIsGLOFOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
