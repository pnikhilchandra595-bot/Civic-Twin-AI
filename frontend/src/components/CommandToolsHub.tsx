import React from 'react';
import {
  Mountain,
  Satellite,
  Waves,
  Skull,
  TrendingUp,
  HeartPulse,
  Radar,
  AlertOctagon,
  QrCode,
  Video,
  MessageSquare,
  WifiOff,
  Sparkles,
  FileText,
  Database,
  Settings,
  Download,
  Activity,
  Compass,
  Layers,
  Radio,
  Clock,
  ShieldCheck,
  Zap,
  Flame,
  ThermometerSnowflake
} from 'lucide-react';
import { CityDigitalTwinState } from '../types/digital_twin';

interface CommandToolsHubProps {
  state: CityDigitalTwinState | null;
  onOpenMap: () => void;
  onOpenSandbox: () => void;
  onOpenGLOF: () => void;
  onOpenMOSDAC: () => void;
  onOpenCWCGauges: () => void;
  onOpenMultiHazard: () => void;
  onOpenDam: () => void;
  onOpenElevation: () => void;
  onOpenHospitalSurge: () => void;
  onOpenSAR: () => void;
  onOpenCitizenSOS: () => void;
  onOpenQRCode: () => void;
  onOpenDroneCCTV: () => void;
  onOpenVoiceRadio: () => void;
  onOpenMesh: () => void;
  onOpenAICopilot: () => void;
  onOpenICS201: () => void;
  onOpenProvenance: () => void;
  onOpenIntegrations: () => void;
  onOpenDataExport: () => void;
}

export const CommandToolsHub: React.FC<CommandToolsHubProps> = ({
  state,
  onOpenMap,
  onOpenSandbox,
  onOpenGLOF,
  onOpenMOSDAC,
  onOpenCWCGauges,
  onOpenMultiHazard,
  onOpenDam,
  onOpenElevation,
  onOpenHospitalSurge,
  onOpenSAR,
  onOpenCitizenSOS,
  onOpenQRCode,
  onOpenDroneCCTV,
  onOpenVoiceRadio,
  onOpenMesh,
  onOpenAICopilot,
  onOpenICS201,
  onOpenProvenance,
  onOpenIntegrations,
  onOpenDataExport,
}) => {
  return (
    <div className="space-y-6">
      
      {/* Category 1: GIS, Satellite & Crisis Physics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 text-sm font-mono font-bold text-cyan-300 uppercase tracking-wider">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>1. Core GIS, Satellites & Cryosphere Models</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">6 Real-Time Tools</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          
          {/* Tool 1: Digital Twin Map */}
          <div className="p-4 rounded-2xl bg-[#091224]/90 border border-cyan-500/30 hover:border-cyan-400 transition-all flex flex-col justify-between space-y-3 shadow-lg group">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  LIVE GIS TWIN
                </span>
              </div>
              <h3 className="text-sm font-bold text-white font-hud mt-2.5">
                Geographic Digital Twin Simulation Map
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Full-screen Leaflet geospatial viewport with flood heatmaps, levee breaches, road inundation, and evacuation routing.
              </p>
            </div>
            <button
              onClick={onOpenMap}
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Launch Full GIS Map</span>
            </button>
          </div>

          {/* Tool 2: What-If Crisis Sandbox */}
          <div className="p-4 rounded-2xl bg-[#091224]/90 border border-amber-500/30 hover:border-amber-400 transition-all flex flex-col justify-between space-y-3 shadow-lg group">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
                  PHYSICS SANDBOX
                </span>
              </div>
              <h3 className="text-sm font-bold text-white font-hud mt-2.5">
                "What-If" Crisis Simulation Sandbox
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Timeline scrub controller, rainfall multiplier dials, levee sluice overrides, and flood surge propagation.
              </p>
            </div>
            <button
              onClick={onOpenSandbox}
              className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Open Crisis Sandbox</span>
            </button>
          </div>

          {/* Tool 3: Himalayan GLOF Sentinel */}
          <div className="p-4 rounded-2xl bg-[#091224]/90 border border-cyan-500/30 hover:border-cyan-400 transition-all flex flex-col justify-between space-y-3 shadow-lg group">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
                  <Mountain className="w-5 h-5 animate-pulse" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 font-bold">
                  CRYOSPHERE SENTINEL
                </span>
              </div>
              <h3 className="text-sm font-bold text-white font-hud mt-2.5">
                Himalayan GLOF Early Warning Engine
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Froehlich dam breach hydraulics for South Lhonak, Chorabari, and Rishi Ganga with downstream hydro dam surge arrival ETAs.
              </p>
            </div>
            <button
              onClick={onOpenGLOF}
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Mountain className="w-3.5 h-3.5" />
              <span>Launch GLOF Sentinel</span>
            </button>
          </div>

          {/* Tool 4: ISRO MOSDAC Satellites */}
          <div className="p-4 rounded-2xl bg-[#091224]/90 border border-blue-500/30 hover:border-blue-400 transition-all flex flex-col justify-between space-y-3 shadow-lg group">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                  <Satellite className="w-5 h-5 animate-pulse" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 font-bold">
                  ISRO LIVE INGEST
                </span>
              </div>
              <h3 className="text-sm font-bold text-white font-hud mt-2.5">
                ISRO MOSDAC Spaceborne Observation
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Real-time INSAT-3DR 6-channel imager, QPE quantitative rainfall grids, SST cyclone heat, and live granule catalog.
              </p>
            </div>
            <button
              onClick={onOpenMOSDAC}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Satellite className="w-3.5 h-3.5" />
              <span>Inspect Satellite Feeds</span>
            </button>
          </div>

          {/* Tool 5: CWC River Gauges */}
          <div className="p-4 rounded-2xl bg-[#091224]/90 border border-blue-500/30 hover:border-blue-400 transition-all flex flex-col justify-between space-y-3 shadow-lg group">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-500/10 rounded-xl text-cyan-300 border border-blue-500/20">
                  <Waves className="w-5 h-5 animate-pulse" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
                  91 LIVE STATIONS
                </span>
              </div>
              <h3 className="text-sm font-bold text-white font-hud mt-2.5">
                Central Water Commission (CWC) River Gauges
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Sovereign real-time flood monitoring network across Ganga, Brahmaputra, Godavari, Krishna, and Narmada basins.
              </p>
            </div>
            <button
              onClick={onOpenCWCGauges}
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Waves className="w-3.5 h-3.5" />
              <span>Open CWC Gauges</span>
            </button>
          </div>

          {/* Tool 6: SAR Radar Satellite */}
          <div className="p-4 rounded-2xl bg-[#091224]/90 border border-cyan-500/30 hover:border-cyan-400 transition-all flex flex-col justify-between space-y-3 shadow-lg group">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
                  <Radar className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
                  RADAR IMAGING
                </span>
              </div>
              <h3 className="text-sm font-bold text-white font-hud mt-2.5">
                Sentinel-1 SAR Radar Inundation
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Cloud-penetrating C-Band radar backscatter extraction isolating submerged wards and flood extents during monsoon rain.
              </p>
            </div>
            <button
              onClick={onOpenSAR}
              className="w-full py-2 bg-[#0e1b36] hover:bg-[#14264c] border border-cyan-500/40 text-cyan-200 font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Radar className="w-3.5 h-3.5" />
              <span>Launch SAR Radar</span>
            </button>
          </div>

        </div>
      </div>

      {/* Category 2: Hydrology & Multi-Hazard Physics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 text-sm font-mono font-bold text-blue-300 uppercase tracking-wider">
            <Waves className="w-4 h-4 text-blue-400" />
            <span>2. Hydrology & Physics Simulation Engines</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">4 Physics Engines</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* Tool 7: Dam Sluice */}
          <div className="p-4 rounded-2xl bg-[#091224]/90 border border-blue-500/25 hover:border-blue-400 transition-all flex flex-col justify-between space-y-3 shadow-lg">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                  <Waves className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-blue-300 font-bold">HYDROGRAPH</span>
              </div>
              <h3 className="text-sm font-bold text-white font-hud mt-2.5">
                Dam Hydrograph & Sluice
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Reservoir volume vs discharge curves and emergency sluice gate opening simulations.
              </p>
            </div>
            <button
              onClick={onOpenDam}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Waves className="w-3.5 h-3.5" />
              <span>Simulate Sluice</span>
            </button>
          </div>

          {/* Tool 8: 3D Elevation Cut */}
          <div className="p-4 rounded-2xl bg-[#091224]/90 border border-cyan-500/25 hover:border-cyan-400 transition-all flex flex-col justify-between space-y-3 shadow-lg">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-cyan-300 font-bold">LIDAR PROFILE</span>
              </div>
              <h3 className="text-sm font-bold text-white font-hud mt-2.5">
                3D Terrain Elevation Cut
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                2D/3D cutaway terrain bathymetry analyzing riverbed, levee crest, and flood spillover points.
              </p>
            </div>
            <button
              onClick={onOpenElevation}
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Open Elevation Cut</span>
            </button>
          </div>

          {/* Tool 9: Hazmat Sim */}
          <div className="p-4 rounded-2xl bg-[#091224]/90 border border-amber-500/25 hover:border-amber-400 transition-all flex flex-col justify-between space-y-3 shadow-lg">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                  <Skull className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-amber-300 font-bold">TOXIC PLUME</span>
              </div>
              <h3 className="text-sm font-bold text-white font-hud mt-2.5">
                Hazmat & Gas Dispersion
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Gaussian plume gas dispersion models, IDLH lethal zones, and downwind toxic evacuation corridors.
              </p>
            </div>
            <button
              onClick={onOpenMultiHazard}
              className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Skull className="w-3.5 h-3.5" />
              <span>Simulate Hazmat</span>
            </button>
          </div>

          {/* Tool 10: Hospital Surge */}
          <div className="p-4 rounded-2xl bg-[#091224]/90 border border-rose-500/25 hover:border-rose-400 transition-all flex flex-col justify-between space-y-3 shadow-lg">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/20">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-rose-300 font-bold">HEALTHCARE TRIAGE</span>
              </div>
              <h3 className="text-sm font-bold text-white font-hud mt-2.5">
                Hospital Surge & ICU Capacity
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Emergency ward surge capacity, backup generator runtime, and mass casualty patient redistribution.
              </p>
            </div>
            <button
              onClick={onOpenHospitalSurge}
              className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Manage Hospital Surge</span>
            </button>
          </div>

        </div>
      </div>

      {/* Category 3: Tactical Emergency Operations & Comms */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 text-sm font-mono font-bold text-rose-300 uppercase tracking-wider">
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            <span>3. Tactical Emergency Operations & Civil Comms</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">6 Tactical Tools</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          
          {/* Tool 11: Citizen SOS */}
          <div className="p-4 rounded-2xl bg-[#091224]/90 border border-rose-500/30 hover:border-rose-400 transition-all flex flex-col justify-between space-y-3 shadow-lg">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/20">
                  <AlertOctagon className="w-5 h-5 animate-pulse" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                  SOS TRIAGE
                </span>
              </div>
              <h3 className="text-sm font-bold text-white font-hud mt-2.5">
                Citizen SOS Incident Queue
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Crowdsourced WhatsApp & Telegram distress signals with AI confidence triage scoring and rescue dispatch.
              </p>
            </div>
            <button
              onClick={onOpenCitizenSOS}
              className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Open SOS Queue</span>
            </button>
          </div>

          {/* Tool 12: Citizen QR Beacon */}
          <div className="p-4 rounded-2xl bg-[#091224]/90 border border-rose-500/30 hover:border-rose-400 transition-all flex flex-col justify-between space-y-3 shadow-lg">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/20">
                  <QrCode className="w-5 h-5 animate-pulse" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                  MOBILE BEACON
                </span>
              </div>
              <h3 className="text-sm font-bold text-white font-hud mt-2.5">
                Citizen Smartphone QR Beacon
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Shareable mobile QR code for instant zero-download hardware GPS locking and 112 SMS dispatch.
              </p>
            </div>
            <button
              onClick={onOpenQRCode}
              className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Generate QR Beacon</span>
            </button>
          </div>

          {/* Tool 13: Drone CCTV */}
          <div className="p-4 rounded-2xl bg-[#091224]/90 border border-cyan-500/30 hover:border-cyan-400 transition-all flex flex-col justify-between space-y-3 shadow-lg">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
                  <Video className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                  YOLOV8 CV
                </span>
              </div>
              <h3 className="text-sm font-bold text-white font-hud mt-2.5">
                CCTV & Drone Video Matrix
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Municipal subway cameras and UAV survey drone feeds with real-time YOLOv8 vehicle and human detection.
              </p>
            </div>
            <button
              onClick={onOpenDroneCCTV}
              className="w-full py-2 bg-[#0e1b36] hover:bg-[#14264c] border border-cyan-500/40 text-cyan-200 font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Launch Drone Feeds</span>
            </button>
          </div>

          {/* Tool 14: Voice Radio */}
          <div className="p-4 rounded-2xl bg-[#091224]/90 border border-purple-500/30 hover:border-purple-400 transition-all flex flex-col justify-between space-y-3 shadow-lg">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
                  PTT VOICE
                </span>
              </div>
              <h3 className="text-sm font-bold text-white font-hud mt-2.5">
                Push-to-Talk Voice AI Radio
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Tactical walkie-talkie voice radio with authentic squelch static SFX and AI SITREP responses.
              </p>
            </div>
            <button
              onClick={onOpenVoiceRadio}
              className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open Voice Radio</span>
            </button>
          </div>

          {/* Tool 15: Zero-Network Mesh SOS */}
          <div className="p-4 rounded-2xl bg-[#091224]/90 border border-amber-500/30 hover:border-amber-400 transition-all flex flex-col justify-between space-y-3 shadow-lg">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                  <WifiOff className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  OFFLINE LORA
                </span>
              </div>
              <h3 className="text-sm font-bold text-white font-hud mt-2.5">
                Zero-Network Mesh SOS Relay
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Peer-to-peer Bluetooth/LoRa hop-by-hop mesh network packet relay during complete cell tower blackouts.
              </p>
            </div>
            <button
              onClick={onOpenMesh}
              className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span>Launch Mesh Relay</span>
            </button>
          </div>

          {/* Tool 16: Gemini AI Commander */}
          <div className="p-4 rounded-2xl bg-[#091224]/90 border border-emerald-500/30 hover:border-emerald-400 transition-all flex flex-col justify-between space-y-3 shadow-lg">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                  AI STRATEGIST
                </span>
              </div>
              <h3 className="text-sm font-bold text-white font-hud mt-2.5">
                Google Gemini AI Incident Commander
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Real-time incident action plan generation, NDRF resource routing, and inter-agency coordination.
              </p>
            </div>
            <button
              onClick={onOpenAICopilot}
              className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Consult AI Commander</span>
            </button>
          </div>

        </div>
      </div>

      {/* Category 4: National Frameworks, Data & System Provenance */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2 text-sm font-mono font-bold text-emerald-300 uppercase tracking-wider">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>4. National Incident Plans, Data Pipelines & Hardware Gateways</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">4 System Tools</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* Tool 17: ICS-201 */}
          <div className="p-4 rounded-2xl bg-[#091224]/90 border border-slate-700 hover:border-cyan-400 transition-all flex flex-col justify-between space-y-3 shadow-lg">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-cyan-300 font-bold">NDMA ICS-201</span>
              </div>
              <h3 className="text-sm font-bold text-white font-hud mt-2.5">
                ICS-201 Incident Action Plan
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Standardized disaster operational briefing, hazard threat matrix, and tactical command hierarchy.
              </p>
            </div>
            <button
              onClick={onOpenICS201}
              className="w-full py-2 bg-[#0e1b36] hover:bg-[#14264c] border border-cyan-500/40 text-cyan-200 font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View ICS-201 Plan</span>
            </button>
          </div>

          {/* Tool 18: Live Data Feeds */}
          <div className="p-4 rounded-2xl bg-[#091224]/90 border border-slate-700 hover:border-emerald-400 transition-all flex flex-col justify-between space-y-3 shadow-lg">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                  <Database className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-emerald-300 font-bold">18 FEEDS</span>
              </div>
              <h3 className="text-sm font-bold text-white font-hud mt-2.5">
                Data Provenance & APIs
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Transparent verification of all live satellite, weather, flood gauge, and power grid pipelines.
              </p>
            </div>
            <button
              onClick={onOpenProvenance}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Inspect Data Feeds</span>
            </button>
          </div>

          {/* Tool 19: Hardware Gateways */}
          <div className="p-4 rounded-2xl bg-[#091224]/90 border border-slate-700 hover:border-cyan-400 transition-all flex flex-col justify-between space-y-3 shadow-lg">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
                  <Settings className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-cyan-300 font-bold">IOT / RTSP</span>
              </div>
              <h3 className="text-sm font-bold text-white font-hud mt-2.5">
                Integration Gateways
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Custom camera feeds, IoT SCADA underpass sensors, and external alert webhook bridges.
              </p>
            </div>
            <button
              onClick={onOpenIntegrations}
              className="w-full py-2 bg-[#0e1b36] hover:bg-[#14264c] border border-cyan-500/40 text-cyan-200 font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Configure Gateways</span>
            </button>
          </div>

          {/* Tool 20: Data Export */}
          <div className="p-4 rounded-2xl bg-[#091224]/90 border border-slate-700 hover:border-blue-400 transition-all flex flex-col justify-between space-y-3 shadow-lg">
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                  <Download className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-blue-300 font-bold">CSV / JSON</span>
              </div>
              <h3 className="text-sm font-bold text-white font-hud mt-2.5">
                Forensic Data Export
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Download structured telemetry logs, casualty predictions, and evacuation timelines for post-event audit.
              </p>
            </div>
            <button
              onClick={onOpenDataExport}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Datasets</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
