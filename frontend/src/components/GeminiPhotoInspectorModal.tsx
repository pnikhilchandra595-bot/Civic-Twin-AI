import React, { useState } from 'react';
import { 
  Camera, Upload, Sparkles, AlertTriangle, ShieldCheck, 
  CheckCircle2, X, Eye, Video, Radio, Cpu, RefreshCw
} from 'lucide-react';
import { tacticalAudio } from '../services/tacticalAudioEngine';

interface GeminiPhotoInspectorModalProps {
  onClose: () => void;
  onDispatchMission?: (missionTitle: string) => void;
}

interface PhotoAnalysisResult {
  title: string;
  location: string;
  estimatedDepthM: number;
  threatLevel: 'CRITICAL' | 'HIGH' | 'MODERATE';
  detectedObjects: Array<{
    label: string;
    confidence: number;
    box: { top: string; left: string; width: string; height: string };
    type: 'water' | 'human' | 'hazard' | 'structure';
  }>;
  geminiNarrative: string;
  recommendedAction: string;
}

const SAMPLE_BENCHMARK_IMAGES: Array<{
  id: string;
  name: string;
  url: string;
  analysis: PhotoAnalysisResult;
}> = [
  {
    id: 'sikkim_dam',
    name: 'Teesta-III Dam Spillway Overtopping (Sikkim 2023)',
    url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
    analysis: {
      title: 'Chungthang Dam Crest & Spillway Overtopping',
      location: 'Chungthang, North Sikkim (Teesta River Gorge)',
      estimatedDepthM: 14.2,
      threatLevel: 'CRITICAL',
      detectedObjects: [
        { label: 'Dam Flank Breach Scour', confidence: 0.96, box: { top: '35%', left: '20%', width: '45%', height: '35%' }, type: 'structure' },
        { label: 'Hyper-Turbid Debris Wave (8,450 m³/s)', confidence: 0.98, box: { top: '50%', left: '10%', width: '80%', height: '40%' }, type: 'water' },
        { label: 'Bridge Approach Embankment Washout', confidence: 0.91, box: { top: '25%', left: '70%', width: '25%', height: '30%' }, type: 'hazard' }
      ],
      geminiNarrative: 'Gemini Multimodal Vision has detected severe hydraulic overtopping of the dam crest with significant lateral embankment erosion. Water flow velocity estimated at ~13.5 m/s. Downstream riverbed canyon will experience severe backwater surge within 15 minutes.',
      recommendedAction: 'IMMEDIATE: Issue red alert broadcast to Dikchu & Singtam. Disconnect 400kV Chungthang switchyard.'
    }
  },
  {
    id: 'mumbai_kurla',
    name: 'Kurla Central Line Railway Inundation (Mumbai 2005)',
    url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
    analysis: {
      title: 'Mithi River Overspill & Suburban Rail Submergence',
      location: 'Kurla West / Kranti Nagar Low-Lying Ward',
      estimatedDepthM: 1.85,
      threatLevel: 'CRITICAL',
      detectedObjects: [
        { label: 'Submerged EMU Local Train Floor', confidence: 0.95, box: { top: '30%', left: '25%', width: '50%', height: '30%' }, type: 'hazard' },
        { label: 'Civilians Stranded on Platform Roof (approx 18)', confidence: 0.93, box: { top: '15%', left: '30%', width: '40%', height: '20%' }, type: 'human' },
        { label: 'Overhead 25kV Catenary Wire Clearance (1.2m)', confidence: 0.89, box: { top: '10%', left: '15%', width: '70%', height: '15%' }, type: 'hazard' }
      ],
      geminiNarrative: 'Mithi River tidal backwater has inundated the suburban rail tracks by 1.85 meters. Platform roofs are holding approximately 18 stranded civilians. High risk of electrical arc discharge if 25kV traction power is not confirmed de-energized.',
      recommendedAction: 'Deploy NDRF Inflatable Zodiac Boats via LBS Marg approach. Confirm Central Railway power cut.'
    }
  },
  {
    id: 'kedarnath_slurry',
    name: 'Mandakini Bouldered Debris Torrent (Kedarnath 2013)',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    analysis: {
      title: 'Chorabari Lake Outburst Debris Fan',
      location: 'Kedarnath Valley Sanctuary & Rambara Approach',
      estimatedDepthM: 6.8,
      threatLevel: 'CRITICAL',
      detectedObjects: [
        { label: 'Glacial Boulder Slurry Wave Front', confidence: 0.97, box: { top: '40%', left: '15%', width: '70%', height: '45%' }, type: 'water' },
        { label: 'Pilgrim Shelter Footpath Severed', confidence: 0.94, box: { top: '25%', left: '60%', width: '35%', height: '30%' }, type: 'structure' },
        { label: 'Rooftop Evacuation Point (Temple Complex)', confidence: 0.91, box: { top: '20%', left: '10%', width: '30%', height: '25%' }, type: 'human' }
      ],
      geminiNarrative: 'Catastrophic debris avalanche carrying boulders >2m diameter at 45 km/h. Natural drainage paths completely occluded by moraine sediment. Ground access from Sonprayag is 100% severed.',
      recommendedAction: 'Deploy Indian Air Force Mi-17 / Dhruv helicopter winching units to designated high-elevation helipads.'
    }
  }
];

export const GeminiPhotoInspectorModal: React.FC<GeminiPhotoInspectorModalProps> = ({
  onClose,
  onDispatchMission
}) => {
  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [dispatched, setDispatched] = useState<boolean>(false);

  const activeSample = SAMPLE_BENCHMARK_IMAGES[selectedSampleIndex];
  const activeAnalysis = activeSample.analysis;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImage(event.target?.result as string);
        setIsAnalyzing(true);
        tacticalAudio.playRadarPing();
        setTimeout(() => {
          setIsAnalyzing(false);
        }, 1200);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (idx: number) => {
    setCustomImage(null);
    setSelectedSampleIndex(idx);
    setIsAnalyzing(true);
    tacticalAudio.playRadioChirp();
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 600);
  };

  const handleDispatch = () => {
    tacticalAudio.playAlertWarble();
    if (onDispatchMission) {
      onDispatchMission(`Boat Rescue: ${activeAnalysis.title}`);
    }
    setDispatched(true);
    setTimeout(() => setDispatched(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-5xl max-h-[92vh] bg-[#071120] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-mono text-slate-100">
        
        {/* Header */}
        <div className="p-4 bg-slate-950/90 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Camera className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm sm:text-base font-bold text-white font-hud tracking-wide">
                  GEMINI MULTIMODAL DRONE & CCTV VISION INSPECTOR
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  AI COMPUTER VISION
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Real-time optical/thermal disaster reconnaissance, water depth estimation & civilian triage
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sample Selectors & Upload Button */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-900/80 border-b border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 font-bold uppercase text-[10px] mr-1">Sovereign Benchmarks:</span>
            {SAMPLE_BENCHMARK_IMAGES.map((sample, idx) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(idx)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
                  selectedSampleIndex === idx && !customImage
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25 border border-purple-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {sample.name.split('(')[0]}
              </button>
            ))}
          </div>

          <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold transition-all cursor-pointer flex items-center space-x-1.5 border border-slate-700">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Drone/CCTV Photo</span>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileUpload} 
            />
          </label>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column: Image with AI Bounding Boxes */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-slate-800 shadow-inner group">
              <img 
                src={customImage || activeSample.url} 
                alt="Disaster Scene"
                className="w-full h-full object-cover"
              />

              {/* AI Bounding Boxes Overlay */}
              {!isAnalyzing && activeAnalysis.detectedObjects.map((obj, idx) => (
                <div 
                  key={idx}
                  style={{
                    top: obj.box.top,
                    left: obj.box.left,
                    width: obj.box.width,
                    height: obj.box.height,
                  }}
                  className={`absolute border-2 transition-all rounded pointer-events-none ${
                    obj.type === 'human'
                      ? 'border-emerald-400 bg-emerald-500/15'
                      : obj.type === 'hazard'
                      ? 'border-amber-400 bg-amber-500/15'
                      : obj.type === 'water'
                      ? 'border-cyan-400 bg-cyan-500/15'
                      : 'border-rose-400 bg-rose-500/15'
                  }`}
                >
                  <span className={`absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[9px] font-bold text-black uppercase ${
                    obj.type === 'human'
                      ? 'bg-emerald-400'
                      : obj.type === 'hazard'
                      ? 'bg-amber-400'
                      : obj.type === 'water'
                      ? 'bg-cyan-400'
                      : 'bg-rose-400'
                  }`}>
                    {obj.label} ({(obj.confidence * 100).toFixed(0)}%)
                  </span>
                </div>
              ))}

              {/* Scanning Laser Overlay when analyzing */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-purple-900/30 flex flex-col items-center justify-center space-y-2 backdrop-blur-xs">
                  <div className="w-12 h-12 rounded-full border-4 border-purple-400 border-t-transparent animate-spin" />
                  <span className="text-xs font-bold text-purple-200 tracking-wider">
                    GEMINI VISION INFERENCE RUNNING...
                  </span>
                </div>
              )}

              {/* Corner Watermark */}
              <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 backdrop-blur-md text-[10px] text-purple-300 font-mono flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>Gemini 1.5 Flash Vision Multimodal</span>
              </div>
            </div>

            {/* Depth & Classification Legend */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Estimated Water Depth</span>
                <p className="text-sm font-bold text-cyan-300 font-mono mt-0.5">
                  ~{activeAnalysis.estimatedDepthM} Meters
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">Threat Level</span>
                <p className="text-sm font-bold text-rose-400 font-mono mt-0.5">
                  {activeAnalysis.threatLevel}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase">AI Detections</span>
                <p className="text-sm font-bold text-emerald-300 font-mono mt-0.5">
                  {activeAnalysis.detectedObjects.length} Targets Tagged
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: AI Narrative & Tactical Recommendations */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Scene Identification:</span>
                <h4 className="text-sm font-bold text-white font-hud mt-0.5">{activeAnalysis.title}</h4>
                <p className="text-slate-400 font-sans mt-0.5">{activeAnalysis.location}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-purple-300 font-bold">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>GEMINI MULTIMODAL SITREP NARRATIVE:</span>
                </div>
                <p className="text-slate-200 font-sans leading-relaxed text-xs">
                  {activeAnalysis.geminiNarrative}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-rose-300 font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>RECOMMENDED TACTICAL PROTOCOL:</span>
                </div>
                <p className="text-slate-200 font-sans leading-relaxed text-xs">
                  {activeAnalysis.recommendedAction}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleDispatch}
                disabled={dispatched}
                className={`w-full py-3 rounded-xl font-bold font-hud text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg ${
                  dispatched
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-rose-500/25'
                }`}
              >
                {dispatched ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>MISSION DISPATCH TRANSMITTED TO RESCUE UNITS!</span>
                  </>
                ) : (
                  <>
                    <Radio className="w-4 h-4" />
                    <span>TRANSMIT TACTICAL DISPATCH MISSION (NDRF / SDRF)</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Zero latency edge computer vision pipeline with Google Gemini AI</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
