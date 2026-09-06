import React, { useState, useEffect } from 'react';
import { 
  CALIBRATED_COMPREHENSIVE_TWIN_STATES, 
  CalibratedComprehensiveTwinState 
} from './data/calibratedTwinStates';
import { CALIBRATED_BENCHMARK_SCENARIOS } from './data/calibratedSimulationScenarios';
import { CalibratedGeospatialTwinMap } from './components/CalibratedGeospatialTwinMap';
import { ExplainablePhysicsModal } from './components/ExplainablePhysicsModal';
import { GeminiPhotoInspectorModal } from './components/GeminiPhotoInspectorModal';
import { SovereignCertificateModal } from './components/SovereignCertificateModal';
import { FamilyEmergencyCardModal } from './components/FamilyEmergencyCardModal';
import { CascadeFailureGraph } from './components/CascadeFailureGraph';
import { SensorTelemetryPanel } from './components/SensorTelemetryPanel';
import { IncidentCommanderPanel } from './components/IncidentCommanderPanel';
import { tacticalAudio } from './services/tacticalAudioEngine';
import { InfrastructureNode, SensorReading, EvacuationRoute } from './types/digital_twin';
import { 
  Compass, Activity, ShieldAlert, Award, FileText, Camera, FlaskConical,
  Radio, Volume2, VolumeX, Play, Pause, RotateCcw, Clock, Sparkles, 
  Layers, MapPin, CheckCircle2, ChevronRight, ExternalLink, Globe, Car, Truck, Ship,
  Printer, Waves, Mountain, Flame, Zap, ShieldCheck
} from 'lucide-react';

export const CalibratedTwinApp: React.FC = () => {
  // Active sovereign scenario
  const [activeScenarioId, setActiveScenarioId] = useState<string>('sikkim_lhonak_glof_2023');
  const [sensitivityMultiplier, setSensitivityMultiplier] = useState<number>(1.0);
  const [vehicleWadingFilter, setVehicleWadingFilter] = useState<'all' | 'car' | 'truck' | 'boat'>('all');
  const [is3DTiltActive, setIs3DTiltActive] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [activeLang, setActiveLang] = useState<'en' | 'hi' | 'mr' | 'bn' | 'ta' | 'te'>('en');

  // Active view tab
  const [activeView, setActiveView] = useState<'map' | 'cascade' | 'sensors' | 'radio' | 'iap'>('map');
  const [selectedNode, setSelectedNode] = useState<InfrastructureNode | null>(null);

  // Modals state
  const [isXAIModalOpen, setIsXAIModalOpen] = useState<boolean>(false);
  const [isPhotoInspectorOpen, setIsPhotoInspectorOpen] = useState<boolean>(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState<boolean>(false);
  const [isFamilyCardModalOpen, setIsFamilyCardModalOpen] = useState<boolean>(false);

  // 90-Second Guided Jury Tour state
  const [isJuryTourActive, setIsJuryTourActive] = useState<boolean>(false);
  const [juryTourStep, setJuryTourStep] = useState<number>(1);

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const comprehensiveState = CALIBRATED_COMPREHENSIVE_TWIN_STATES[activeScenarioId] || CALIBRATED_COMPREHENSIVE_TWIN_STATES['sikkim_lhonak_glof_2023'];
  const baseScenario = CALIBRATED_BENCHMARK_SCENARIOS.find(s => s.id === activeScenarioId) || CALIBRATED_BENCHMARK_SCENARIOS[0];

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

  // Switch scenario
  const handleScenarioChange = (id: string) => {
    setActiveScenarioId(id);
    setSelectedNode(null);
    triggerRadarPing();
    showToast(`🔬 Switched to Sovereign Benchmark: ${CALIBRATED_COMPREHENSIVE_TWIN_STATES[id]?.name || id}`);
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

  // 90-Second Autopilot Tour Controller
  useEffect(() => {
    let timer: any;
    if (isJuryTourActive) {
      if (juryTourStep === 1) {
        showToast('🎬 Tour Step 1/5: Anomaly Detected at Glacial Moraine (T-15 min)');
        setActiveView('map');
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

  return (
    <div className="min-h-screen w-full bg-[#050b16] text-slate-100 font-mono select-none flex flex-col">
      
      {/* 1. TOP SOVEREIGN JURY BANNER & HEADER */}
      <header className="sticky top-0 z-40 bg-[#060d1d]/95 backdrop-blur-xl border-b border-cyan-500/30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          
          {/* Sovereign Seal & Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/10 border border-cyan-400/50 text-cyan-300 shadow-lg shadow-cyan-500/20">
              <FlaskConical className="w-5 h-5 animate-pulse text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  🇮🇳 JURY EVALUATION SUITE
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  SOVEREIGN GROUND-TRUTH
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-white font-hud tracking-wide mt-0.5">
                CIVICTWIN AI • CALIBRATED DIGITAL TWIN PLATFORM
              </h1>
            </div>
          </div>

          {/* Scenario Selector & Language Toggle */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            
            {/* Scenario Dropdown */}
            <div className="flex items-center space-x-1.5 bg-slate-900 border border-cyan-500/40 rounded-xl px-2.5 py-1.5">
              <span className="text-slate-400 text-[10px] uppercase font-bold hidden sm:inline">Benchmark:</span>
              <select
                value={activeScenarioId}
                onChange={(e) => handleScenarioChange(e.target.value)}
                className="bg-transparent text-cyan-300 font-bold outline-none cursor-pointer text-xs"
              >
                {Object.values(CALIBRATED_COMPREHENSIVE_TWIN_STATES).map((sc) => (
                  <option key={sc.id} value={sc.id} className="bg-slate-900 text-white">
                    {sc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-xl p-1 text-[11px]">
              {(['en', 'hi', 'mr', 'bn', 'ta', 'te'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer font-bold ${
                    activeLang === lang
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिं' : lang === 'mr' ? 'मरा' : lang === 'bn' ? 'বাংলা' : lang === 'ta' ? 'தமிழ்' : 'తెలుగు'}
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

            {/* Return to Main App */}
            <a
              href="/"
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold transition-all flex items-center space-x-1 cursor-pointer"
            >
              <span>← Main Platform</span>
            </a>
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
              <strong className="text-emerald-300">+{comprehensiveState.state.metrics.warningLeadTimeGainedMin || 42} Minutes</strong>
            </div>
            <div className="flex items-center space-x-1.5">
              <span>👥 Citizens Safely Routed:</span>
              <strong className="text-cyan-300">{(comprehensiveState.state.metrics.citizensSafeguarded || 14200).toLocaleString()}</strong>
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
          <div>
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
              <span>{isJuryTourActive ? `🎬 AUTOPILOT TOUR: STEP ${juryTourStep}/5` : '🎬 90-SEC GUIDED JURY TOUR'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Floating Emergency Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-5 z-50 p-3.5 rounded-xl bg-slate-900/95 border border-cyan-500/50 shadow-2xl flex items-center space-x-2.5 text-xs text-cyan-200 animate-bounce">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. MAIN DASHBOARD CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 space-y-4">
        
        {/* INTERACTIVE CALIBRATION & SENSITIVITY CONTROLS */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Sensitivity Multiplier Slider */}
          <div className="flex items-center space-x-3">
            <span className="text-slate-400 font-bold uppercase text-[11px]">
              Hydraulic Sensitivity:
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
              className="w-28 sm:w-36 accent-cyan-400 cursor-pointer"
            />
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-500/40">
              {sensitivityMultiplier}x Multiplier
            </span>
            <span className="text-[11px] text-slate-400 hidden md:inline">
              (Discharge: {Math.round(comprehensiveState.state.metrics.peakDischargeCumecs * sensitivityMultiplier).toLocaleString()} m³/s)
            </span>
          </div>

          {/* Vehicle Wading Clearance Filter (Pillar 4) */}
          <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase font-bold px-1.5">Wading Filter:</span>
            <button
              onClick={() => setVehicleWadingFilter('all')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer font-bold ${
                vehicleWadingFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setVehicleWadingFilter('car')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer font-bold flex items-center space-x-1 ${
                vehicleWadingFilter === 'car' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Car className="w-3 h-3" />
              <span>Car (0.25m)</span>
            </button>
            <button
              onClick={() => setVehicleWadingFilter('truck')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer font-bold flex items-center space-x-1 ${
                vehicleWadingFilter === 'truck' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Truck className="w-3 h-3" />
              <span>NDRF Truck (0.85m)</span>
            </button>
            <button
              onClick={() => setVehicleWadingFilter('boat')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer font-bold flex items-center space-x-1 ${
                vehicleWadingFilter === 'boat' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Ship className="w-3 h-3" />
              <span>Boat (0.3m+)</span>
            </button>
          </div>

          {/* 3D Topographic Tilt Toggle (Pillar 1) */}
          <button
            onClick={() => setIs3DTiltActive(!is3DTiltActive)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-1.5 cursor-pointer border ${
              is3DTiltActive
                ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>{is3DTiltActive ? '3D Topo: ACTIVE (25° Tilt)' : 'Enable 3D Topo Tilt'}</span>
          </button>

        </div>

        {/* MODAL LAUNCHER TOOLBAR (Pillars 2, 6, 7) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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
        </div>

        {/* PRIMARY COCKPIT VIEW TABS */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs">
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => { setActiveView('map'); triggerRadarPing(); }}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center space-x-1.5 ${
                activeView === 'map'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/25 border border-cyan-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>🗺️ Digital Twin Vector Map</span>
            </button>

            <button
              onClick={() => { setActiveView('cascade'); triggerAudioChirp(); }}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center space-x-1.5 ${
                activeView === 'cascade'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25 border border-purple-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>⚡ Cascade Failure Graph</span>
            </button>

            <button
              onClick={() => { setActiveView('sensors'); triggerRadarPing(); }}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center space-x-1.5 ${
                activeView === 'sensors'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 border border-blue-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
              <span>📊 CWC Gauges & Telemetry</span>
            </button>

            <button
              onClick={() => { setActiveView('radio'); triggerAudioChirp(); }}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center space-x-1.5 ${
                activeView === 'radio'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-500/25 border border-amber-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>📻 Tactical Radio & Audio SitReps</span>
            </button>

            <button
              onClick={() => { setActiveView('iap'); triggerRadarPing(); }}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center space-x-1.5 ${
                activeView === 'iap'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25 border border-emerald-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>📋 Incident Action Plan (ICS-201)</span>
            </button>
          </div>

          {/* Offline PWA Badge (Pillar 5) */}
          <div className="flex items-center space-x-2 text-[10px] text-emerald-400 font-bold px-2 py-1 rounded bg-emerald-950/60 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>PWA OFFLINE CACHED</span>
          </div>
        </div>

        {/* VIEW 1: GEOSPATIAL VECTOR DIGITAL TWIN MAP */}
        {activeView === 'map' && (
          <div className="space-y-3">
            <CalibratedGeospatialTwinMap
              comprehensiveState={comprehensiveState}
              sensitivityMultiplier={sensitivityMultiplier}
              vehicleWadingFilter={vehicleWadingFilter}
              is3DTiltActive={is3DTiltActive}
              onSelectNode={(node) => {
                setSelectedNode(node);
                triggerAudioChirp();
              }}
              highlightedNodeId={selectedNode?.id}
            />

            {/* Selected Node Details Card */}
            {selectedNode && (
              <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center space-x-2">
                    <strong className="text-sm text-cyan-300 font-hud">{selectedNode.name}</strong>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase">
                      {selectedNode.node_type}
                    </span>
                  </div>
                  <p className="text-slate-400 mt-0.5">
                    Elevation: {selectedNode.elevation_m}m ASL • Calibrated Surge Depth: <strong className="text-rose-400">{selectedNode.flood_depth_m}m</strong> • Structural Integrity: {(selectedNode.structural_integrity * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsXAIModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-bold transition-all cursor-pointer"
                  >
                    Inspect Physics Formula
                  </button>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: CASCADE FAILURE GRAPH */}
        {activeView === 'cascade' && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/30 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-hud uppercase">
                  SOVEREIGN CASCADE FAILURE PROPAGATION TOPOLOGY
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Visualizes multi-sector domino failures: Dam Overtopping → Substation Trip → Highway Washout → Hospital Power Failure
                </p>
              </div>
            </div>
            <CascadeFailureGraph state={comprehensiveState.state} />
          </div>
        )}

        {/* VIEW 3: CWC RIVER GAUGES & SENSOR TELEMETRY */}
        {activeView === 'sensors' && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-blue-500/30 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-hud uppercase">
                  CENTRAL WATER COMMISSION (CWC) & IMD CALIBRATED TELEMETRY GAUGES
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Real historical water level stages vs sovereign Danger Marks with rolling trend history
                </p>
              </div>
            </div>
            <SensorTelemetryPanel
              state={comprehensiveState.state}
            />
          </div>
        )}

        {/* VIEW 4: TACTICAL RADIO & AUDIO SITREPS (Pillar 3) */}
        {activeView === 'radio' && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-hud uppercase flex items-center space-x-2">
                  <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>INTER-AGENCY TACTICAL RADIO & AUDIO SITREP FEED</span>
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Listen to live synthetic voice broadcasts in military radio format across NDRF, Indian Army, and CWC channels
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {comprehensiveState.radioFeedTranscripts.map((msg) => (
                <div 
                  key={msg.id}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        msg.priority === 'EMERGENCY'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {msg.priority}
                      </span>
                      <strong className="text-cyan-300 font-mono">{msg.callsign}</strong>
                      <span className="text-slate-500 text-[10px]">({msg.agency})</span>
                      <span className="text-slate-400 text-[10px]">{msg.timestamp}</span>
                    </div>
                    <p className="text-slate-200 font-sans text-xs">
                      {activeLang === 'hi' && msg.hindiMessage ? msg.hindiMessage : msg.message}
                    </p>
                  </div>

                  <button
                    onClick={() => handlePlayVoiceSitrep(msg.message, msg.hindiMessage)}
                    className="px-3 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-200 font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Listen to Dispatch</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 5: INCIDENT ACTION PLAN (ICS-201) */}
        {activeView === 'iap' && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-hud uppercase">
                  NATIONAL DISASTER MANAGEMENT AUTHORITY • FORM ICS-201
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Official Incident Action Plan (IAP) summary for commander review and resource deployment
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-400" />
                <span>Print Official IAP</span>
              </button>
            </div>

            <IncidentCommanderPanel state={comprehensiveState.state} />
          </div>
        )}

      </main>

      {/* 4. MODALS */}
      {isXAIModalOpen && (
        <ExplainablePhysicsModal
          scenario={baseScenario}
          multiplier={sensitivityMultiplier}
          onClose={() => setIsXAIModalOpen(false)}
        />
      )}

      {isPhotoInspectorOpen && (
        <GeminiPhotoInspectorModal
          onClose={() => setIsPhotoInspectorOpen(false)}
          onDispatchMission={(title) => {
            showToast(`🚀 Dispatched: ${title}`);
          }}
        />
      )}

      {isCertificateModalOpen && (
        <SovereignCertificateModal
          onClose={() => setIsCertificateModalOpen(false)}
        />
      )}

      {isFamilyCardModalOpen && (
        <FamilyEmergencyCardModal
          scenario={baseScenario}
          onClose={() => setIsFamilyCardModalOpen(false)}
        />
      )}

    </div>
  );
};
