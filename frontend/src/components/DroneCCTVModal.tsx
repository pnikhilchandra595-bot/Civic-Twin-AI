import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, Eye, EyeOff, AlertTriangle, ShieldCheck, 
  Maximize2, X, RefreshCw, Layers, Crosshair, Navigation, 
  Thermometer, Moon, Sun, Camera, Sparkles, Activity, Play, Pause, Volume2, VolumeX, Radio, Check,
  Grid, Compass, Send, ShieldAlert, Zap, CheckCircle2, Globe
} from 'lucide-react';
import { apiService, DroneCameraFeed } from '../services/api';
import { AuthUser } from './LoginPage';

interface DroneCCTVModalProps {
  cityId: string;
  cityName: string;
  authUser?: AuthUser | null;
  onClose: () => void;
}

export const DroneCCTVModal: React.FC<DroneCCTVModalProps> = ({
  cityId,
  cityName,
  authUser,
  onClose
}) => {
  const [feeds, setFeeds] = useState<DroneCameraFeed[]>([]);
  const [activeFeedId, setActiveFeedId] = useState<string | null>(null);
  const [showAIOverlay, setShowAIOverlay] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'SINGLE_FOCUS' | 'MATRIX_4X4'>('SINGLE_FOCUS');
  
  // Vision Filter Spectrum
  const [visionMode, setVisionMode] = useState<'RGB' | 'THERMAL_FLIR' | 'NIGHT_VISION'>('RGB');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [snapshotTaken, setSnapshotTaken] = useState<boolean>(false);
  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null);

  // Tactical PTZ (Pan-Tilt-Zoom) & Flight HUD
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showFlightHUD, setShowFlightHUD] = useState<boolean>(true);
  const [radioChatter, setRadioChatter] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const isNational = !authUser || authUser.userType === 'national_authority';
  const isStateOfficer = authUser?.userType === 'state_officer';
  const assignedState = authUser?.assignedState || '';

  useEffect(() => {
    const fetchFeeds = async () => {
      const data = await apiService.getDroneCCTVFeeds(cityId);
      
      // Hierarchical Role-Based CCTV & UAV Filter:
      // State Officer only sees feeds from their assigned state (or live tactical field cam)
      let authorizedFeeds = data;
      if (isStateOfficer && assignedState) {
        authorizedFeeds = data.filter(f => 
          (f.state_name && f.state_name.toLowerCase().includes(assignedState.toLowerCase())) ||
          f.city_id === cityId ||
          f.camera_id === 'CAM-IPHONE-01'
        );
      }
      
      setFeeds(authorizedFeeds);
      if (authorizedFeeds.length > 0) {
        const cityMatch = authorizedFeeds.find(f => f.city_id === cityId);
        setActiveFeedId(cityMatch ? cityMatch.camera_id : authorizedFeeds[0].camera_id);
      }
    };
    fetchFeeds();
  }, [cityId, isStateOfficer, assignedState]);

  const activeFeed = feeds.find(f => f.camera_id === activeFeedId) || feeds[0];

  // Video filter style based on spectrum mode + PTZ transform
  const getVideoFilterStyle = () => {
    let filter = '';
    if (visionMode === 'THERMAL_FLIR') {
      filter = 'contrast(200%) brightness(110%) hue-rotate(180deg) saturate(280%)';
    } else if (visionMode === 'NIGHT_VISION') {
      filter = 'contrast(170%) brightness(130%) sepia(100%) hue-rotate(85deg) saturate(320%)';
    }

    return {
      filter: filter || undefined,
      transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
      transition: 'transform 0.2s ease-out'
    };
  };

  const [customCameraInput, setCustomCameraInput] = useState<string>('http://nikhils-iphone.local:8081/video');
  const [useCustomUrl, setUseCustomUrl] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);
  const webcamStreamRef = useRef<MediaStream | null>(null);

  const startWebcam = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
        webcamStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setIsWebcamActive(true);
        setVideoError(false);
      }
    } catch (e) {
      console.warn('Webcam permission denied or unavailable:', e);
      alert('Webcam access was denied or is unavailable on this device.');
    }
  };

  const stopWebcam = () => {
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach(track => track.stop());
      webcamStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsWebcamActive(false);
  };

  useEffect(() => {
    return () => {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const currentStreamUrl = useCustomUrl ? customCameraInput : (activeFeed?.video_url || '/videos/mumbai_mithi.mp4');
  const isMjpegStream = !isWebcamActive && (currentStreamUrl.includes(':8081') || currentStreamUrl.includes('/video') || currentStreamUrl.includes('.mjpg'));

  const isImageOrGif = !isWebcamActive && (
    currentStreamUrl.endsWith('.gif') ||
    currentStreamUrl.endsWith('.jpg') ||
    currentStreamUrl.endsWith('.jpeg') ||
    currentStreamUrl.endsWith('.png') ||
    currentStreamUrl.includes('Radar') ||
    currentStreamUrl.includes('Satellite')
  );

  const handleApplyCustomStream = () => {
    if (customCameraInput.trim()) {
      if (isWebcamActive) stopWebcam();
      setUseCustomUrl(true);
      setVideoError(false);
    }
  };

  const handlePan = (dx: number, dy: number) => {
    setPanOffset(prev => ({
      x: Math.max(-100, Math.min(100, prev.x + dx)),
      y: Math.max(-100, Math.min(100, prev.y + dy))
    }));
  };

  const handleResetPTZ = () => {
    setZoomLevel(1.0);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleTakeSnapshot = () => {
    setSnapshotTaken(true);
    setTimeout(() => setSnapshotTaken(false), 2500);
  };

  const handleQuickDispatch = (locationName: string) => {
    setDispatchSuccess(`NDRF Rescue Raft Alpha Dispatched to ${locationName}`);
    setTimeout(() => setDispatchSuccess(null), 3500);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none font-sans">
      <div className="hud-panel w-full max-w-6xl rounded-3xl border border-cyan-500/40 flex flex-col h-[92vh] bg-[#070b16] text-slate-100 shadow-[0_0_90px_rgba(0,210,255,0.25)] overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-950 via-blue-950/40 to-slate-950">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-cyan-950/90 border border-cyan-500/50 text-cyan-400 shadow-md">
              <Video className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center space-x-2">
                <span>AI Computer Vision CCTV & Recon Drone Feeds</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-red-950 border border-red-500 text-red-300 font-mono font-bold animate-pulse">
                  ● LIVE 60 FPS STREAM
                </span>
                {isStateOfficer && (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-500 text-purple-300 font-mono font-bold flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-purple-400" />
                    <span>🔒 {assignedState} SDMA ONLY</span>
                  </span>
                )}
                {isNational && (
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-500 text-blue-300 font-mono font-bold flex items-center space-x-1">
                    <Globe className="w-3 h-3 text-blue-400" />
                    <span>🌐 National All-India Access</span>
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {isStateOfficer 
                  ? `Authorized State SDMA Surveillance Network • Displaying ${feeds.length} cameras registered in ${assignedState}`
                  : `Real-Time Urban Flood Inundation & Victim Detection Network (${cityName})`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono">
              <button
                onClick={() => setViewMode('SINGLE_FOCUS')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'SINGLE_FOCUS' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Focus
              </button>
              <button
                onClick={() => setViewMode('MATRIX_4X4')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'MATRIX_4X4' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Matrix (4x4)
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Left / Center: Main Video Feed Player */}
          <div className="flex-1 flex flex-col p-4 space-y-3 overflow-y-auto">
            
            {viewMode === 'SINGLE_FOCUS' && activeFeed && (
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-black aspect-video flex items-center justify-center shadow-2xl group">
                
                {/* Real Direct Video / IMD Doppler Radar Live GIF / MJPEG IP Camera Stream Element */}
                {isImageOrGif || isMjpegStream ? (
                  <img
                    src={currentStreamUrl}
                    alt="Live IMD Doppler Radar / CCTV Stream"
                    style={getVideoFilterStyle()}
                    className="w-full h-full object-contain bg-slate-950"
                    onError={() => setVideoError(true)}
                  />
                ) : (
                  <video
                    ref={videoRef}
                    key={currentStreamUrl}
                    src={currentStreamUrl}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    style={getVideoFilterStyle()}
                    className="w-full h-full object-cover"
                    onError={() => setVideoError(true)}
                  />
                )}

                {/* Video Connection Failure Alert */}
                {videoError && (
                  <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center space-y-3 z-15">
                    <AlertTriangle className="w-10 h-10 text-amber-400 animate-bounce" />
                    <div className="text-sm font-mono text-white font-bold">
                      Waiting for Live Camera Stream at:
                    </div>
                    <div className="text-xs font-mono text-cyan-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 max-w-md break-all">
                      {currentStreamUrl}
                    </div>
                    <p className="text-[11px] text-slate-400 max-w-sm">
                      Ensure your phone camera app is actively broadcasting on port 8081 and both devices are on the same Wi-Fi network.
                    </p>
                    <button
                      onClick={() => { setVideoError(false); setUseCustomUrl(false); }}
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all"
                    >
                      ← Switch to Default Simulated River Drone
                    </button>
                  </div>
                )}

                {/* Scanline CRT Texture Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-10 opacity-60" />

                {/* Military Drone Flight HUD Overlay */}
                {showFlightHUD && (
                  <div className="absolute inset-0 pointer-events-none z-15 flex flex-col justify-between p-4 font-mono text-[11px] text-cyan-400 select-none">
                    
                    {/* Top Compass Heading Tape */}
                    <div className="flex justify-center">
                      <div className="px-4 py-1 rounded bg-black/60 border border-cyan-500/40 text-center text-[10px] tracking-widest text-cyan-300">
                        ◀ ··· 070 ··· 080 ··· <span className="text-white font-bold font-mono">094° E</span> ··· 100 ··· 110 ··· ▶
                      </div>
                    </div>

                    {/* Center Artificial Horizon & Target Reticle */}
                    <div className="flex-1 flex items-center justify-center relative">
                      {/* Tactical Pitch Lines */}
                      <div className="absolute w-40 flex flex-col items-center space-y-4 opacity-50">
                        <div className="w-24 border-t-2 border-cyan-400/80 flex justify-between text-[8px]">
                          <span>+10</span><span>+10</span>
                        </div>
                        <div className="w-32 border-t-2 border-dashed border-cyan-300 flex justify-between text-[8px]">
                          <span>--00--</span><span>--00--</span>
                        </div>
                        <div className="w-24 border-b-2 border-cyan-400/80 flex justify-between text-[8px]">
                          <span>-10</span><span>-10</span>
                        </div>
                      </div>

                      {/* Optical Crosshairs */}
                      <div className="w-16 h-16 border border-cyan-400/60 rounded-full flex items-center justify-center relative">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                        <div className="absolute top-0 bottom-0 w-0.5 bg-cyan-400/50" />
                        <div className="absolute left-0 right-0 h-0.5 bg-cyan-400/50" />
                      </div>

                      {/* Laser Rangefinder */}
                      <div className="absolute bottom-6 px-2 py-0.5 rounded bg-black/80 border border-cyan-500/40 text-[9px] text-cyan-300">
                        🎯 LRF: 412.5m • AZ: +02.4° • EL: -14.8°
                      </div>
                    </div>

                    {/* Left & Right Telemetry Ladders */}
                    <div className="flex justify-between items-end">
                      <div className="p-2 rounded bg-black/75 border border-slate-700/80 space-y-0.5 text-[10px]">
                        <div>ALT: <span className="text-white font-bold">+48.2m AGL</span></div>
                        <div>SPD: <span className="text-white font-bold">{activeFeed.flow_velocity_ms * 4} km/h</span></div>
                        <div>LAT: <span className="text-slate-300">{activeFeed.lat.toFixed(4)}° N</span></div>
                      </div>

                      <div className="p-2 rounded bg-black/75 border border-slate-700/80 space-y-0.5 text-[10px] text-right">
                        <div>BATT: <span className="text-emerald-400 font-bold">88% (28m)</span></div>
                        <div>SIGNAL: <span className="text-cyan-300 font-bold">-62 dBm</span></div>
                        <div>ENC: <span className="text-slate-300">AES-256 GCM</span></div>
                      </div>
                    </div>

                  </div>
                )}

                {/* Tactical HUD OSD Watermark Overlay */}
                <div className="absolute top-3 left-3 flex items-center space-x-2 pointer-events-none z-20">
                  <span className="px-2.5 py-1 rounded-lg bg-black/80 border border-cyan-500/50 text-cyan-300 font-mono text-xs font-bold flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span>REC: {activeFeed.camera_id}</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-black/80 border border-slate-700 text-slate-300 font-mono text-[11px]">
                    📍 {activeFeed.location_name}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-black/80 border border-slate-700 text-yellow-300 font-mono text-[11px]">
                    🌊 Depth: {activeFeed.flood_depth_detected_m}m
                  </span>
                </div>

                {/* Vision Spectrum Badge */}
                <div className="absolute top-3 right-3 pointer-events-none z-20">
                  <span className="px-2.5 py-1 rounded-lg bg-black/80 border border-slate-700 text-slate-300 font-mono text-[11px] font-bold">
                    SPECTRUM: {visionMode}
                  </span>
                </div>

                {/* AI YOLO Computer Vision Bounding Boxes Overlay */}
                {showAIOverlay && activeFeed.ai_yolo_detections && (
                  <div className="absolute inset-0 pointer-events-none z-10">
                    {activeFeed.ai_yolo_detections.map((det, idx) => (
                      <div
                        key={idx}
                        style={{
                          left: `${det.bbox[0]}%`,
                          top: `${det.bbox[1]}%`,
                          width: `${det.bbox[2]}%`,
                          height: `${det.bbox[3]}%`
                        }}
                        className={`absolute border-2 rounded-lg transition-all ${
                          det.hazard_severity === 'CRITICAL'
                            ? 'border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                            : 'border-yellow-400 bg-yellow-400/10 shadow-[0_0_15px_rgba(234,179,8,0.5)]'
                        }`}
                      >
                        <div className="absolute -top-6 left-0 px-2 py-0.5 rounded bg-black/90 border border-current font-mono text-[10px] font-black uppercase text-white whitespace-nowrap">
                          {det.label} ({(det.confidence * 100).toFixed(0)}%)
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Floating Interactive PTZ D-Pad Controller */}
                <div className="absolute right-3 bottom-14 z-25 bg-black/80 border border-cyan-500/40 backdrop-blur-md rounded-2xl p-2 flex flex-col items-center space-y-1 text-slate-300">
                  <div className="text-[9px] font-mono text-cyan-400 font-bold mb-0.5">PTZ PAN/ZOOM</div>
                  <button
                    onClick={() => handlePan(0, -15)}
                    className="p-1 rounded bg-slate-900 hover:bg-cyan-600 text-white text-[10px] transition-all"
                  >
                    ▲
                  </button>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handlePan(-15, 0)}
                      className="p-1 rounded bg-slate-900 hover:bg-cyan-600 text-white text-[10px] transition-all"
                    >
                      ◀
                    </button>
                    <button
                      onClick={handleResetPTZ}
                      className="p-1 rounded bg-cyan-950 text-cyan-300 text-[9px] font-mono hover:bg-cyan-900 transition-all"
                    >
                      {zoomLevel.toFixed(1)}x
                    </button>
                    <button
                      onClick={() => handlePan(15, 0)}
                      className="p-1 rounded bg-slate-900 hover:bg-cyan-600 text-white text-[10px] transition-all"
                    >
                      ▶
                    </button>
                  </div>
                  <button
                    onClick={() => handlePan(0, 15)}
                    className="p-1 rounded bg-slate-900 hover:bg-cyan-600 text-white text-[10px] transition-all"
                  >
                    ▼
                  </button>
                  <div className="flex items-center space-x-1 pt-1 border-t border-slate-800">
                    <button
                      onClick={() => setZoomLevel(z => Math.max(1.0, z - 0.2))}
                      className="px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-[10px] font-bold"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setZoomLevel(z => Math.min(3.0, z + 0.2))}
                      className="px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-[10px] font-bold text-cyan-400"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Bottom Video Floating Controls */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2 rounded-xl bg-black/80 backdrop-blur-md border border-slate-800 z-20">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Spectrum Vision Filter Selector */}
                  <div className="flex items-center space-x-1.5 text-xs font-mono">
                    <button
                      onClick={() => setVisionMode('RGB')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        visionMode === 'RGB' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      Optical (RGB)
                    </button>
                    <button
                      onClick={() => setVisionMode('THERMAL_FLIR')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        visionMode === 'THERMAL_FLIR' ? 'bg-purple-600 text-white font-bold' : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      FLIR Thermal
                    </button>
                    <button
                      onClick={() => setVisionMode('NIGHT_VISION')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        visionMode === 'NIGHT_VISION' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      Night Vision
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowFlightHUD(!showFlightHUD)}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold flex items-center space-x-1 ${
                        showFlightHUD ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>HUD OSD</span>
                    </button>

                    <button
                      onClick={() => setShowAIOverlay(!showAIOverlay)}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold flex items-center space-x-1 ${
                        showAIOverlay ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {showAIOverlay ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>AI YOLO</span>
                    </button>

                    <button
                      onClick={handleTakeSnapshot}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center space-x-1"
                    >
                      {snapshotTaken ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Camera className="w-3.5 h-3.5" />}
                      <span>{snapshotTaken ? 'Saved!' : 'Snapshot'}</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* Matrix (4x4 Grid) View */}
            {viewMode === 'MATRIX_4X4' && (
              <div className="grid grid-cols-2 gap-3 flex-1">
                {feeds.slice(0, 4).map((feed) => {
                  const feedIsImg = feed.video_url.endsWith('.gif') || feed.video_url.endsWith('.jpg') || feed.video_url.includes('Radar') || feed.video_url.includes('Satellite');
                  return (
                    <div
                      key={feed.camera_id}
                      onClick={() => { setActiveFeedId(feed.camera_id); setViewMode('SINGLE_FOCUS'); }}
                      className="relative rounded-2xl overflow-hidden border border-slate-800 bg-black aspect-video cursor-pointer group hover:border-cyan-500 transition-all"
                    >
                      {feedIsImg ? (
                        <img
                          src={feed.video_url}
                          alt={feed.feed_name}
                          className="w-full h-full object-contain bg-slate-950 opacity-90 group-hover:opacity-100"
                        />
                      ) : (
                        <video
                          src={feed.video_url}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100"
                        />
                      )}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-cyan-300 font-bold">
                        {feed.camera_id}: {feed.feed_name.slice(0, 25)}...
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-red-950 border border-red-600 text-[10px] font-mono text-red-300 font-bold">
                        🌊 {feed.flood_depth_detected_m}m Depth
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Action Notification Banner */}
            {dispatchSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-mono flex items-center space-x-2 animate-bounce">
                <CheckCircle2 className="w-4 h-4" />
                <span>{dispatchSuccess}</span>
              </div>
            )}

          </div>

          {/* Right Column: Camera Switcher & Telemetry Panel */}
          <div className="w-full lg:w-96 p-4 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between space-y-4 bg-slate-950/60 overflow-y-auto">
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Grid className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Available Camera Feeds ({feeds.length})</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400">All Feeds Online</span>
              </div>

              {/* Feed Selection List */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {feeds.map((f) => (
                  <button
                    key={f.camera_id}
                    onClick={() => setActiveFeedId(f.camera_id)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      f.camera_id === activeFeedId
                        ? 'bg-cyan-950/80 border-cyan-500 shadow-[0_0_15px_rgba(0,210,255,0.2)]'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span className="truncate">{f.feed_name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-950 font-mono text-cyan-300 border border-slate-800">
                        {f.camera_type.includes('DRONE') ? '🛸 UAV DRONE' : '📹 CCTV'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1">
                      <span>📍 {f.location_name}</span>
                      <span className="text-yellow-400">🌊 {f.flood_depth_detected_m}m</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Active Camera Live Analytics Card */}
              {activeFeed && (
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 font-mono text-xs">
                  <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">
                    📊 Live Computer Vision Analytics:
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Flood Water Depth:</span>
                      <span className="text-rose-400 font-bold text-sm">{activeFeed.flood_depth_detected_m} m</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Flow Velocity:</span>
                      <span className="text-yellow-400 font-bold text-sm">{activeFeed.flow_velocity_ms} m/s</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Stalled Vehicles:</span>
                      <span className="text-white font-bold text-sm">{activeFeed.stalled_vehicles_count} Units</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Stranded Persons:</span>
                      <span className="text-emerald-400 font-bold text-sm">{activeFeed.stranded_pedestrians_count} People</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Live Indian & Field Tactical Camera Ingestion Card */}
              <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between text-[11px] font-bold text-cyan-300">
                  <span className="flex items-center space-x-1.5">
                    <span>🇮🇳</span>
                    <span>Live Indian / Tactical Camera Stream:</span>
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-700">
                    WEBCAM / IP / MJPEG
                  </span>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={customCameraInput}
                    onChange={(e) => setCustomCameraInput(e.target.value)}
                    placeholder="http://nikhils-iphone.local:8081/video or /videos/..."
                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-[11px] font-mono text-white focus:outline-none placeholder-slate-600"
                  />
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleApplyCustomStream}
                      className="flex-1 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] transition-all cursor-pointer shadow-md"
                    >
                      Connect Stream
                    </button>
                    {isWebcamActive ? (
                      <button
                        onClick={stopWebcam}
                        className="px-2.5 py-1.5 rounded-lg bg-red-950/90 hover:bg-red-900 border border-red-500 text-red-300 text-[10px] font-bold animate-pulse"
                      >
                        ⏹️ Stop Webcam
                      </button>
                    ) : (
                      <button
                        onClick={startWebcam}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500 text-emerald-300 text-[10px] font-bold cursor-pointer shadow"
                      >
                        📷 Laptop Webcam
                      </button>
                    )}
                    <button
                      onClick={() => { setCustomCameraInput('http://nikhils-iphone.local:8081/video'); setUseCustomUrl(true); setVideoError(false); }}
                      className="px-2 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[10px]"
                      title="Nikhil's iPhone Live Feed"
                    >
                      📱 iPhone
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Dispatch Button */}
            {activeFeed && (
              <button
                onClick={() => handleQuickDispatch(activeFeed.location_name)}
                className="w-full py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Dispatch NDRF Boat to {activeFeed.camera_id}</span>
              </button>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
