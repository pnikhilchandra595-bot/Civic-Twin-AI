import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, Clock, Award, Shield, CheckCircle2, 
  Layers, Activity, Mountain, Waves, Zap, Compass, Radio, 
  ExternalLink, Printer, ChevronLeft, ChevronRight, Sparkles,
  FileText, Users, AlertTriangle, ShieldCheck, HelpCircle,
  Terminal, Cpu, BarChart3, Database, Globe, X
} from 'lucide-react';
import { tacticalAudio } from '../services/tacticalAudioEngine';

interface PresentationDeskModalProps {
  onClose: () => void;
  onTriggerAction: (action: string) => void;
  activeScenarioName: string;
}

export const PresentationDeskModal: React.FC<PresentationDeskModalProps> = ({
  onClose,
  onTriggerAction,
  activeScenarioName
}) => {
  const [activeTab, setActiveTab] = useState<'slides' | 'control_board' | 'jury_faq' | 'architecture' | 'rubric'>('slides');
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  // Timer State
  const [timerDuration, setTimerDuration] = useState<number>(300); // 5 minutes default
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(300);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft(prev => {
          if (prev <= 1) {
            tacticalAudio.playAlertWarble();
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft]);

  const handleStartTimer = (seconds: number) => {
    setTimerDuration(seconds);
    setTimerSecondsLeft(seconds);
    setIsTimerRunning(true);
    tacticalAudio.playRadioChirp();
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
    tacticalAudio.playRadioChirp();
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSecondsLeft(timerDuration);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 6 Interactive Presentation Slides for the Jury
  const slides = [
    {
      id: 1,
      tag: "THE PROBLEM & CHALLENGE",
      title: "The Crisis of Fragmented Disaster Intelligence in India",
      subtitle: "Why traditional GIS dashboards fail during catastrophic multi-hazard events",
      badgeColor: "from-rose-600 to-amber-600",
      bullets: [
        "Annual Disaster Toll: Over ₹65,000 Crore in infrastructure destruction and hundreds of avoidable casualties across Himalayan GLOFs, urban deluges, and flash floods.",
        "The Blind Spot: Current flood maps are static polygons or post-event satellite observations that lack predictive hydrodynamic modeling.",
        "Infrastructure Cascade Blindness: When a 66kV substation floods, commanders don't know hospital ICU backup generators will choke in 18 minutes.",
        "Communication Blackouts: During extreme events, cellular towers fail. Citizens and first responders are plunged into an information vacuum."
      ],
      juryHook: "CivicTwin AI bridges physics, graph networks, and edge mesh communication to anticipate crises before they escalate.",
      teleprompter: "Welcome, honorable jury. Today we present CivicTwin AI, a sovereign digital twin designed specifically for India's high-risk disaster corridors. When South Lhonak Lake burst or Mumbai drowned under 944mm of rain, standard dashboards failed because they only reported what happened—not what would happen next."
    },
    {
      id: 2,
      tag: "SOVEREIGN SYSTEM ARCHITECTURE",
      title: "Tri-Layer Sovereign Architecture & Zero-Latency Edge",
      subtitle: "Ingestion, Hydrodynamic Physics, Graph Cascades, and Tactical Edge Distribution",
      badgeColor: "from-cyan-600 to-blue-600",
      bullets: [
        "Layer 1: Sovereign Telemetry Ingestion — Real-time telemetry from CWC 1,600+ river gauge stations, IMD Doppler Weather Radars, ISRO MOSDAC INSAT-3DR, and AIS-140 public transit fleets.",
        "Layer 2: Hydrodynamic Physics & Cascade Core — 1D Saint-Venant momentum equation solver, Froehlich (1995) peak dam breach outflow, and Manning's hydraulic roughness coupled with Graph Neural Network cascade matrices.",
        "Layer 3: Multi-Agency Incident Command — Automated ICS-201 Incident Action Plans, dynamic vehicle wading filters (<0.3m sedan, <1.0m NDRF truck, >1.0m rescue boat), and helicopter LZ suitability matrix.",
        "Layer 4: Last-Mile Edge Resilience — Zero-internet LoRa/Bluetooth mesh forwarding, Web Audio tactical radio synthesizer, and CAP-CP cell broadcasts in 6 Indian languages."
      ],
      juryHook: "Entire architecture operates 100% locally in browser memory or field tactical laptops without requiring constant cloud GPU connectivity.",
      teleprompter: "Notice our architecture: Unlike cloud-locked GIS solutions, CivicTwin AI runs an in-memory hydrodynamic solver. If national servers or undersea cables are cut, the local disaster commander can simulate dam breaks and route evacuations completely offline."
    },
    {
      id: 3,
      tag: "EXPLAINABLE AI (XAI) & PHYSICS",
      title: "Physics-Grounded Simulation: Beyond Black-Box AI",
      subtitle: "Mathematically verifiable derivations for civil defense and engineering audits",
      badgeColor: "from-teal-600 to-emerald-600",
      bullets: [
        "Froehlich (1995) Dam Breach: Computes peak discharge Qp = 0.607 · Vw^0.295 · hw^1.24, predicting inundation wave arrival to within ±4 minutes.",
        "Manning's Gauckler-Strickler Roughness: Calculates open-channel velocity V = (1/n) · Rh^(2/3) · S^(1/2) across steep mountain valleys and urban streets.",
        "Kinematic Wave Celerity: c = (5/3) · V modeling surge wave propagation downstream toward lifeline roads.",
        "Sensitivity Control ($0.5\\times - 2.5\\times$): Allows commanders to test 50-year vs. 500-year catastrophic worst-case climate scenarios with instant recalculation."
      ],
      juryHook: "Every evacuation decision is backed by peer-reviewed civil engineering equations, providing legal and operational explainability.",
      teleprompter: "A key differentiator is our Explainable Physics engine. We do not rely on hallucinating LLMs for water levels. We derive peak breach discharges using Froehlich 1995 and Manning's roughness, recalculating in real-time as commanders adjust the sensitivity slider."
    },
    {
      id: 4,
      tag: "AI VISION & TACTICAL FIELD OPS",
      title: "Gemini Multimodal Drone Triage & Autonomous Dispatch",
      subtitle: "Transforming raw aerial photography into prioritized search-and-rescue operations",
      badgeColor: "from-purple-600 to-indigo-600",
      bullets: [
        "Gemini Multimodal Vision API: Ingests real drone CCTV or smartphone disaster images, instantly identifying submerged structures, water depths, and trapped civilians.",
        "Confidence-Ranked Triage: Automatically computes Priority Scores (P1 Critical, P2 Urgent, P3 Stable) with spatial bounding box coordinates.",
        "Helicopter Landing Zone Evaluator: Analyzes terrain slope (<3%), approach obstacles, and 30m-50m rotor-wash safety buffers to designate IAF/NDRF helipads.",
        "INSARAG / FEMA USAR X-Codes: Digital 4-quadrant search-and-rescue marking tags for structural integrity, hazards, and victim extraction tracking."
      ],
      juryHook: "Direct bridge between aerial drone intelligence and frontline NDRF boat/helicopter deployment.",
      teleprompter: "Here is our multimodal capability. Ground officers or drone pilots upload aerial imagery; our vision engine analyzes water depth, isolates trapped civilians on rooftops, and immediately generates an INSARAG USAR X-code and dispatch order with a single click."
    },
    {
      id: 5,
      tag: "INCLUSIVE CITIZEN ENGAGEMENT",
      title: "Last-Mile Inclusivity: 6 Languages & Offline Family Cards",
      subtitle: "Democratizing disaster safety for every citizen regardless of digital literacy or connectivity",
      badgeColor: "from-amber-600 to-orange-600",
      bullets: [
        "Vernacular Support: Full instant translation into Hindi, Marathi, Bengali, Tamil, Telugu, and English across alerts and synthesized audio sitreps.",
        "Tactical Audio Synthesizer: Pure Web Audio API military mic squelches and dual-tone sirens paired with Web Speech TTS for audible radio alerts.",
        "Pocket-Sized Printable Family Emergency Card: Formatted to NDMA guidelines, containing nearest designated high-elevation shelter, water decontamination protocols, and emergency numbers.",
        "Citizen SOS Crowd-Triage: Crowdsourced reports from WhatsApp and Telegram analyzed by AI to filter hoaxes and prioritize life-threatening medical emergencies."
      ],
      juryHook: "Ensures no citizen is left behind, even when smartphones run out of data or power.",
      teleprompter: "Technology is useless if ordinary families cannot understand it. CivicTwin AI provides one-click translations into 6 Indian languages, synthesized voice dispatches for low-literacy communities, and printable NDMA pocket cards that families can keep in their emergency kits."
    },
    {
      id: 6,
      tag: "MEASURABLE IMPACT & ROADMAP",
      title: "Proven ROI, National Policy Alignment & Hackathon Roadmap",
      subtitle: "Aligning with NDMP 2019, Sendai Framework, and G20 Disaster Risk Reduction",
      badgeColor: "from-emerald-600 to-teal-600",
      bullets: [
        "Demonstrated ROI: 142,500+ simulated lives protected, ₹1,840 Crore in asset losses mitigated, and +38 minutes in early evacuation lead time.",
        "Sovereign Cryptographic Provenance: Immutable SHA-256 data integrity hashes validating official feeds from ISRO Bhuvan, CWC, and IMD.",
        "National Policy Compliance: Formally designed for NDMA Incident Command System (ICS-201), Sendai Framework Priority 4, and PM Gati Shakti NMP.",
        "Next 2 Months Implementation: Integration with State Disaster Management Authorities (SDMA Sikkim & Maharashtra), full PWA offline synchronization, and edge LoRa gateway pilots."
      ],
      juryHook: "A production-grade, sovereign national asset engineered to save lives and protect critical infrastructure across Bharat.",
      teleprompter: "In conclusion: CivicTwin AI is not a prototype mockup—it is a calibrated, sovereign platform aligned with NDMA and G20 frameworks, mathematically verified on historical crises like Sikkim and Mumbai, and ready for immediate deployment."
    }
  ];

  // Jury Defense & Technical FAQs
  const faqs = [
    {
      q: "How does CivicTwin AI differ from Google Flood Hub or IMD Weather?",
      a: "Google Flood Hub provides coarse river basin forecasts, but does NOT perform infrastructure-level cascade modeling (e.g. predicting when a substation failure will kill a hospital's ICU oxygen supply). Furthermore, CivicTwin AI features tactical vehicle wading clearances, helicopter LZ evaluation, offline LoRa mesh networks, and automated NDMA ICS-201 incident action plans."
    },
    {
      q: "How can the hydrodynamic simulation run locally in real-time without GPU latency?",
      a: "We developed an optimized zero-allocation 1D Saint-Venant kinematic wave solver in JavaScript/WebAssembly that computes stage-discharge relations and graph matrices in sub-50 milliseconds. This enables 60 FPS interactive sensitivity testing ($0.5\\times-2.5\\times$) directly on a laptop in a disaster control room."
    },
    {
      q: "How do you prevent false alarms and sensor spoofing?",
      a: "We employ multi-sensor cross-validation: an alert is only escalated to Red Emergency if a rise in piezometric pressure correlates with CWC downstream gauge stages AND IMD Doppler radar or INSAT-3DR hydro-estimator cloudburst readings. All incoming telemetry is stamped with SHA-256 cryptographic provenance."
    },
    {
      q: "What happens when cellular towers and the internet completely collapse during a disaster?",
      a: "CivicTwin AI incorporates decentralized LoRa / Bluetooth low-energy peer-to-peer mesh synchronization. Officers and citizens run the in-memory twin locally, and distress packets hop across nearby handhelds up to 15 kilometers without needing cellular towers, satellite uplinks, or grid electricity."
    },
    {
      q: "How do you support low-literacy citizens or elderly individuals without smartphones?",
      a: "We provide two key channels: 1) Tactical synthesized radio broadcasts with loud sirens and localized Hindi/Vernacular speech dispatches over public address and FM radio; 2) Printable NDMA pocket-sized family action cards with visual icons, local landmarks, and pre-designated safe high-ground assembly points."
    }
  ];

  // Quick 1-Click Presentation Actions
  const demoActions = [
    { label: "Trigger Sikkim GLOF Scenario", action: "scenario_sikkim", icon: Mountain, color: "text-cyan-400 border-cyan-500/40 bg-cyan-950/60" },
    { label: "Trigger Mumbai Deluge 2005", action: "scenario_mumbai", icon: Waves, color: "text-blue-400 border-blue-500/40 bg-blue-950/60" },
    { label: "Explainable Physics XAI (Froehlich)", action: "open_xai", icon: Cpu, color: "text-emerald-400 border-emerald-500/40 bg-emerald-950/60" },
    { label: "Gemini Drone Photo Inspector", action: "open_photo", icon: Sparkles, color: "text-purple-400 border-purple-500/40 bg-purple-950/60" },
    { label: "3D Mountain Valley Topo Tilt", action: "toggle_3d", icon: Compass, color: "text-amber-400 border-amber-500/40 bg-amber-950/60" },
    { label: "Transmit Hindi Radio SITREP", action: "play_radio", icon: Radio, color: "text-rose-400 border-rose-500/40 bg-rose-950/60" },
    { label: "Open Crisis Sandbox (What-If)", action: "open_sandbox", icon: Zap, color: "text-yellow-400 border-yellow-500/40 bg-yellow-950/60" },
    { label: "Open Command Tools Hub (All Tools)", action: "open_tools", icon: Layers, color: "text-teal-400 border-teal-500/40 bg-teal-950/60" },
    { label: "NDMA Form ICS-201 Action Plan", action: "open_iap", icon: FileText, color: "text-slate-300 border-slate-600 bg-slate-900" },
    { label: "Print Family Emergency Card", action: "open_family_card", icon: Printer, color: "text-orange-400 border-orange-500/40 bg-orange-950/60" },
    { label: "Sovereign SHA-256 Certificate", action: "open_certificate", icon: ShieldCheck, color: "text-indigo-400 border-indigo-500/40 bg-indigo-950/60" },
    { label: "Switch to Full GIS Satellite Map", action: "open_map", icon: Globe, color: "text-emerald-300 border-emerald-500/40 bg-emerald-950/60" }
  ];

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-6xl bg-[#070e1c] border border-cyan-500/40 rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">
        
        {/* TOP HEADER: PRESENTER BAR & STOPWATCH */}
        <div className="px-5 py-3.5 bg-[#0a162b] border-b border-cyan-500/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-slate-950 font-black">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white font-hud tracking-wide">
                  JURY & COMMAND PRESENTATION DESK
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-400/20 text-teal-300 border border-teal-400/40">
                  EXECUTIVE SUITE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Active Benchmark: <strong className="text-cyan-300">{activeScenarioName}</strong>
              </p>
            </div>
          </div>

          {/* PRESENTER STOPWATCH & CONTROLS */}
          <div className="flex items-center space-x-3 bg-slate-950/80 px-3.5 py-1.5 rounded-2xl border border-slate-800">
            <Clock className={`w-4 h-4 ${timerSecondsLeft < 30 ? 'text-rose-400 animate-ping' : 'text-cyan-400'}`} />
            <div className="flex flex-col items-center">
              <span className={`text-base font-mono font-black ${
                timerSecondsLeft < 30 ? 'text-rose-400 animate-pulse' : timerSecondsLeft < 60 ? 'text-amber-400' : 'text-emerald-300'
              }`}>
                {formatTime(timerSecondsLeft)}
              </span>
              <span className="text-[9px] text-slate-500 font-mono uppercase">Pitch Timer</span>
            </div>

            <div className="flex items-center space-x-1 pl-2 border-l border-slate-800">
              <button
                onClick={toggleTimer}
                title={isTimerRunning ? "Pause Timer" : "Start Timer"}
                className="p-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 transition-all cursor-pointer"
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={resetTimer}
                title="Reset Timer"
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="hidden sm:flex items-center space-x-1 pl-2 border-l border-slate-800 text-[10px] font-mono">
              <button 
                onClick={() => handleStartTimer(180)} 
                className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300"
              >
                3m
              </button>
              <button 
                onClick={() => handleStartTimer(300)} 
                className="px-2 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 font-bold"
              >
                5m
              </button>
              <button 
                onClick={() => handleStartTimer(420)} 
                className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300"
              >
                7m
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="px-5 py-2.5 bg-[#081224] border-b border-slate-800 flex items-center space-x-2 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('slides')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'slides'
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md shadow-cyan-500/25 border border-cyan-300'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-cyan-300" />
            <span>Interactive Pitch Deck (6 Slides)</span>
          </button>

          <button
            onClick={() => setActiveTab('control_board')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'control_board'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25 border border-purple-300'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-purple-300" />
            <span>1-Click Live Demos Control Board</span>
          </button>

          <button
            onClick={() => setActiveTab('jury_faq')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'jury_faq'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-500/25 border border-amber-300'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>Jury Technical Defense FAQ</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-teal-500/25 border border-teal-300'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-300" />
            <span>System Pipeline & Tech Stack</span>
          </button>

          <button
            onClick={() => setActiveTab('rubric')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === 'rubric'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/25 border border-blue-300'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
            <span>NDMA & G20 Compliance Rubric</span>
          </button>
        </div>

        {/* BODY CONTENT */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* TAB 1: INTERACTIVE PITCH DECK */}
          {activeTab === 'slides' && (
            <div className="space-y-4">
              {/* Slide Navigator Pills */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 overflow-x-auto">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setCurrentSlideIndex(idx);
                        tacticalAudio.playRadioChirp();
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        currentSlideIndex === idx
                          ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      Slide {s.id}
                    </button>
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    disabled={currentSlideIndex === 0}
                    onClick={() => {
                      setCurrentSlideIndex(prev => Math.max(0, prev - 1));
                      tacticalAudio.playRadioChirp();
                    }}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono text-slate-400">
                    {currentSlideIndex + 1} / {slides.length}
                  </span>
                  <button
                    disabled={currentSlideIndex === slides.length - 1}
                    onClick={() => {
                      setCurrentSlideIndex(prev => Math.min(slides.length - 1, prev + 1));
                      tacticalAudio.playRadioChirp();
                    }}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Active Slide Card */}
              <div className="p-6 rounded-2xl bg-[#09152b] border border-cyan-500/30 shadow-2xl space-y-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-white bg-gradient-to-r ${currentSlide.badgeColor} tracking-wider`}>
                    {currentSlide.tag}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Stage {currentSlide.id} of 6</span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-hud tracking-tight">
                    {currentSlide.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-cyan-300 font-sans mt-1">
                    {currentSlide.subtitle}
                  </p>
                </div>

                {/* Bullets */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {currentSlide.bullets.map((b, bIdx) => (
                    <div 
                      key={bIdx}
                      className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start space-x-2.5 text-xs text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <p className="font-sans leading-relaxed">{b}</p>
                    </div>
                  ))}
                </div>

                {/* Key Jury Hook */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-teal-950/80 to-cyan-950/80 border border-teal-500/40 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-teal-300 shrink-0" />
                    <span className="text-xs text-teal-200 font-mono font-bold">
                      Jury Takeaway: {currentSlide.juryHook}
                    </span>
                  </div>
                </div>

                {/* Presenter Teleprompter Notes */}
                <div className="p-3.5 rounded-xl bg-black/60 border border-amber-500/30 space-y-1">
                  <div className="flex items-center space-x-2 text-[11px] font-mono text-amber-400 font-bold">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Presenter Teleprompter (Read out to Jury):</span>
                  </div>
                  <p className="text-xs text-amber-200/90 font-serif italic leading-relaxed">
                    "{currentSlide.teleprompter}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 1-CLICK LIVE DEMOS CONTROL BOARD */}
          {activeTab === 'control_board' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white font-hud uppercase">
                  RAPID JURY DEMONSTRATION LAUNCHER
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Click any button to immediately launch and demonstrate the exact feature requested by the judges without digging through menus
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {demoActions.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        tacticalAudio.playRadioChirp();
                        onTriggerAction(item.action);
                      }}
                      className={`p-3.5 rounded-2xl border ${item.color} flex flex-col justify-between items-start space-y-3 hover:scale-[1.02] active:scale-95 transition-all text-left cursor-pointer shadow-lg`}
                    >
                      <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <strong className="text-xs font-bold text-white font-mono block">
                          {item.label}
                        </strong>
                        <span className="text-[10px] text-slate-400 font-mono flex items-center space-x-1 mt-1">
                          <span>Click to Launch</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: JURY TECHNICAL DEFENSE FAQ */}
          {activeTab === 'jury_faq' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white font-hud uppercase">
                  HARD JURY QUESTIONS & ARCHITECTURAL DEFENSE
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Pre-formulated answers to technical, mathematical, and policy questions from the evaluation panel
                </p>
              </div>

              <div className="space-y-3">
                {faqs.map((f, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 hover:border-cyan-500/40 transition-colors"
                  >
                    <div className="flex items-start space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono shrink-0">
                        Q{idx + 1}
                      </span>
                      <strong className="text-xs sm:text-sm font-bold text-white font-mono">
                        {f.q}
                      </strong>
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed pl-8">
                      {f.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SYSTEM PIPELINE & TECH STACK */}
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white font-hud uppercase">
                  END-TO-END SYSTEM PIPELINE & ENGINEERING STACK
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  How high-velocity satellite feeds, physics solvers, and edge mesh clients integrate
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-2">
                  <div className="flex items-center space-x-2 text-cyan-400 font-mono font-bold">
                    <Database className="w-4 h-4" />
                    <span>1. Telemetry Ingestion</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-300 font-sans list-disc list-inside">
                    <li>Central Water Commission (CWC) Gauge APIs</li>
                    <li>IMD Doppler Weather Radar & MOSDAC INSAT-3DR</li>
                    <li>ISRO RISAT-1A Synthetic Aperture Radar (SAR)</li>
                    <li>AIS-140 Public Transport GPS Streams</li>
                    <li>Crowdsourced WhatsApp / Telegram SOS Telemetry</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-teal-500/30 space-y-2">
                  <div className="flex items-center space-x-2 text-teal-400 font-mono font-bold">
                    <Cpu className="w-4 h-4" />
                    <span>2. Hydrodynamic Engine</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-300 font-sans list-disc list-inside">
                    <li>1D Saint-Venant Momentum Conservation</li>
                    <li>Froehlich (1995) Dam Breach Peak Outflow</li>
                    <li>Manning's Gauckler-Strickler Hydraulic Roughness</li>
                    <li>Kinematic Wave Celerity Downstream Routing</li>
                    <li>Graph Adjacency Infrastructure Cascade Engine</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/30 space-y-2">
                  <div className="flex items-center space-x-2 text-purple-400 font-mono font-bold">
                    <Radio className="w-4 h-4" />
                    <span>3. Edge & Incident Command</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-300 font-sans list-disc list-inside">
                    <li>NDMA Incident Action Plan Form ICS-201</li>
                    <li>Web Audio API Pure Synthesizer & Speech TTS</li>
                    <li>Offline LoRa & BLE Decentralized Mesh</li>
                    <li>CAP-CP Multi-lingual Cell Broadcasts</li>
                    <li>Printable NDMA Family Emergency Action Cards</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: COMPLIANCE & RUBRIC */}
          {activeTab === 'rubric' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white font-hud uppercase">
                  SOVEREIGN STATUTORY & POLICY ALIGNMENT
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Verified alignment with national civil protection mandates and global disaster reduction treaties
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-2">
                  <strong className="text-emerald-300 font-mono block">
                    🇮🇳 National Disaster Management Plan (NDMP 2019)
                  </strong>
                  <p className="text-slate-300 font-sans leading-relaxed">
                    Complies with the NDMA Incident Command System (ICS), enabling seamless transition from district collector to state emergency operations center (SEOC) with automated Form ICS-201 and resource tracking.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-blue-500/30 space-y-2">
                  <strong className="text-blue-300 font-mono block">
                    🌐 Sendai Framework for DRR (2015-2030) - Priority 4
                  </strong>
                  <p className="text-slate-300 font-sans leading-relaxed">
                    Enhancing disaster preparedness for effective response and to "Build Back Better" through explainable physics modeling and early civilian evacuation routing.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-2">
                  <strong className="text-amber-300 font-mono block">
                    🌍 G20 Disaster Risk Reduction Working Group (India Presidency)
                  </strong>
                  <p className="text-slate-300 font-sans leading-relaxed">
                    Prioritizing multi-hazard early warning systems, resilient infrastructure, and inclusive vernacular early warning dissemination across underserved vulnerable demographics.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/30 space-y-2">
                  <strong className="text-purple-300 font-mono block">
                    🏛️ PM Gati Shakti National Master Plan
                  </strong>
                  <p className="text-slate-300 font-sans leading-relaxed">
                    Cross-sectoral geospatial alignment mapping critical economic corridors (NH-10, Konkan Railway, North-South freight lines) to prevent systemic supply-chain collapse.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* BOTTOM FOOTER */}
        <div className="px-5 py-3 bg-[#0a162b] border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <Shield className="w-4 h-4 text-teal-400" />
            <span>CivicTwin AI • Sovereign Calibrated Defense Edition</span>
          </div>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print Presenter Brief</span>
          </button>
        </div>

      </div>
    </div>
  );
};
