import React, { useState } from 'react';
import { 
  BookOpen, X, ChevronRight, ChevronLeft, CheckCircle2, 
  Compass, Waves, Activity, ShieldAlert, Radio, Sliders, Zap, Sparkles 
} from 'lucide-react';

interface TutorialModalProps {
  onClose: () => void;
  onOpenLiveSync?: () => void;
  onOpenBroadcast?: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  onClose,
  onOpenLiveSync,
  onOpenBroadcast
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      title: "1. Welcome to CivicTwin AI",
      subtitle: "The Next-Gen Urban Resilience & Disaster Response Digital Twin",
      icon: <Sparkles className="w-8 h-8 text-cyan-400" />,
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            Traditional disaster management relies on static maps or simple chat bots. <strong className="text-cyan-300">CivicTwin AI</strong> creates a <strong>living, predictive virtual model</strong> of a city by fusing:
          </p>
          <ul className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <li className="p-2 bg-slate-900 rounded-lg border border-slate-800 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Copernicus Satellite SAR Radar</span>
            </li>
            <li className="p-2 bg-slate-900 rounded-lg border border-slate-800 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>GIS Topography & Drainage Basins</span>
            </li>
            <li className="p-2 bg-slate-900 rounded-lg border border-slate-800 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Live Open-Meteo Weather Mesh</span>
            </li>
            <li className="p-2 bg-slate-900 rounded-lg border border-slate-800 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>IoT Water Gauges & Power Grid</span>
            </li>
          </ul>
          <p className="text-slate-400">
            As weather develops, the physics simulation continuously forecasts surface runoff, submerged roadways, isolated medical trauma centers, and generates AI Incident Action Plans.
          </p>
        </div>
      )
    },
    {
      title: "2. Exploring the Geospatial Digital Twin Canvas",
      subtitle: "3D Extrusions, Inundation Heatmaps, and Interactive Nodes",
      icon: <Compass className="w-8 h-8 text-cyan-400" />,
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            The interactive geospatial canvas provides an aerial view of all city infrastructure:
          </p>
          <div className="space-y-2 text-[11px] font-mono">
            <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800 flex items-start space-x-2.5">
              <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">HOSPITALS</span>
              <span>Level 1 & 2 Medical Trauma centers. Monitored for access road closures and backup generator runtime.</span>
            </div>
            <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800 flex items-start space-x-2.5">
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">SHELTERS</span>
              <span>Designated high-ground evacuation shelters with live capacity meters and medical triage stations.</span>
            </div>
            <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800 flex items-start space-x-2.5">
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">SUBSTATIONS</span>
              <span>Power distribution hubs vulnerable to lowland flooding that power downstream hospitals and pumps.</span>
            </div>
          </div>
          <p className="text-cyan-300 text-[11px] font-mono">
            👉 Tip: Click on any building, hospital, or sensor pin on the map to open the deep Inspector Drawer!
          </p>
        </div>
      )
    },
    {
      title: "3. Real Satellite & Live Weather Ingestion",
      subtitle: "Syncing Live Earth Observation & Open-Meteo Telemetry",
      icon: <Waves className="w-8 h-8 text-blue-400" />,
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            CivicTwin AI connects to <strong>real open meteorological and satellite APIs</strong>:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span><strong>Open-Meteo Satellite Weather:</strong> Fetches live rainfall rate, atmospheric wind gusts, and 6-hour precipitation predictions.</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span><strong>Sentinel-1 SAR Radar:</strong> Analyzes all-weather cloud-penetrating synthetic aperture radar backscatter to detect water boundaries.</span>
            </li>
          </ul>
          <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-600/40 text-blue-200">
            Click the <strong className="text-white">"Live Satellite Sync"</strong> button in the top navigation bar at any time to pull real-time weather into the digital twin!
          </div>
        </div>
      )
    },
    {
      title: "4. Cascade Failure Analysis & Domino Effects",
      subtitle: "Understanding Multi-Order Infrastructure Cascades",
      icon: <Zap className="w-8 h-8 text-amber-400" />,
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            The primary value of a digital twin is discovering hidden catastrophic vulnerabilities before they happen:
          </p>
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono space-y-1.5 text-slate-300">
            <div className="text-cyan-400 font-bold">Cascade Progression Example:</div>
            <div>1. Heavy Rain (75 mm/hr) → Storm Drains saturate at 100%</div>
            <div>2. Lowland Water Pools to 0.45m → Central Arterial Road becomes IMPASSABLE</div>
            <div>3. Riverside Power Substation floods → Bayfront Hospital forced onto Backup Power</div>
            <div>4. Harbor Bridge blocked → 3,100 Coastal Residents cut off from trauma hospital</div>
            <div>5. AI automatically reroutes evacuation corridor to North Ridge High School!</div>
          </div>
          <p className="text-slate-400">
            Switch to the <strong>"Cascade Failure Tree"</strong> tab to view the live 3-level dependency hierarchy.
          </p>
        </div>
      )
    },
    {
      title: "5. 'What-If' Crisis Sandbox & Timeline Scrubbing",
      subtitle: "Simulate Storms, Breaches, and Stress-Test Response Plans",
      icon: <Sliders className="w-8 h-8 text-cyan-400" />,
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            The bottom docked control bar gives you full command of the disaster timeline:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li>• <strong>Timeline Slider (T+00:00 to T+12:00):</strong> Scrub forward in time to watch flood waters rise and road networks close dynamically.</li>
            <li>• <strong>Play/Pause & Speed (1x, 2x, 5x):</strong> Run the live simulation tick engine in continuous real-time mode.</li>
            <li>• <strong>Crisis Injection Buttons:</strong> Trigger a <strong>100-Year Atmospheric Storm</strong>, a <strong>River Levee Breach</strong>, or a <strong>Substation Grid Trip</strong> to stress-test your emergency response.</li>
          </ul>
        </div>
      )
    },
    {
      title: "6. AI Incident Commander & EAS Citizen Broadcast",
      subtitle: "ICS-201/202 Action Plans, Asset Dispatch, and Emergency Alerts",
      icon: <Radio className="w-8 h-8 text-rose-400" />,
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            CivicTwin AI acts as an autonomous Incident Commander Co-Pilot:
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li>• <strong>AI Incident Action Plan (IAP):</strong> Generates FEMA standard objectives, agency-by-agency tasking (Fire, EMS, Public Works, Traffic), and SITREPs.</li>
            <li>• <strong>Tactical Asset Dispatch:</strong> Click <em>"Dispatch to Hotspot"</em> to deploy high-water rescue boats and mobile dewatering pumps. Watch them move in real time on the 3D map!</li>
            <li>• <strong>EAS Citizen Broadcast:</strong> Click <em>"EAS Citizen Alert"</em> to transmit multi-language emergency alerts (English, Spanish, Chinese, Vietnamese) directly to simulated citizen mobile handsets.</li>
          </ul>
        </div>
      )
    }
  ];

  const step = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="hud-panel w-full max-w-2xl rounded-2xl border border-cyan-500/40 p-6 flex flex-col space-y-5 shadow-[0_0_50px_rgba(0,210,255,0.2)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider">
                CivicTwin AI Masterclass & Operator Guide
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Step {currentStep + 1} of {tutorialSteps.length} • Digital Twin Command Center Training
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Header */}
        <div className="flex items-center space-x-3.5 p-3.5 bg-slate-900/80 rounded-xl border border-slate-800">
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex-shrink-0">
            {step.icon}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{step.title}</h3>
            <p className="text-xs text-cyan-300 font-mono">{step.subtitle}</p>
          </div>
        </div>

        {/* Step Body */}
        <div className="min-h-[220px]">
          {step.content}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 text-xs font-mono font-bold flex items-center space-x-1.5 border border-slate-800 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Dots */}
          <div className="flex items-center space-x-1.5">
            {tutorialSteps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentStep === idx ? 'bg-cyan-400 w-6' : 'bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          {currentStep < tutorialSteps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(prev => Math.min(tutorialSteps.length - 1, prev + 1))}
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center space-x-1.5 shadow-[0_0_15px_rgba(0,210,255,0.3)] transition-all"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center space-x-1.5 shadow-[0_0_15px_rgba(0,230,118,0.3)] transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Start Operating Twin</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
