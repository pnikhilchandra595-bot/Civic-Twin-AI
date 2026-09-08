import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Compass, Layers, Eye, EyeOff, Navigation, ShieldCheck, 
  AlertTriangle, Radio, Activity, Zap, Maximize2, 
  Map as MapIcon, Globe, Waves, ArrowRight, ShieldAlert, Mountain,
  Car, Truck, Ship, Crosshair, Satellite, Play, Pause, RotateCcw,
  Sparkles, Clock, Flame, Sliders, X, ChevronDown, ChevronUp,
  PhoneCall, AlertOctagon, HeartPulse, Video
} from 'lucide-react';
import { CalibratedComprehensiveTwinState, HeliLandingZone, CalibratedPolygonInundation } from '../data/calibratedTwinStates';
import { InfrastructureNode } from '../types/digital_twin';
import { apiService } from '../services/api';

interface CalibratedGeospatialTwinMapProps {
  comprehensiveState: CalibratedComprehensiveTwinState;
  sensitivityMultiplier: number;
  vehicleWadingFilter: 'all' | 'car' | 'truck' | 'boat';
  is3DTiltActive: boolean;
  timelineHour?: number;
  isPlaying?: boolean;
  playbackSpeed?: number;
  onSelectNode: (node: InfrastructureNode) => void;
  highlightedNodeId?: string | null;
}

export const CalibratedGeospatialTwinMap: React.FC<CalibratedGeospatialTwinMapProps> = ({
  comprehensiveState,
  sensitivityMultiplier,
  vehicleWadingFilter,
  is3DTiltActive,
  timelineHour = 0,
  isPlaying = false,
  playbackSpeed = 1.0,
  onSelectNode,
  highlightedNodeId
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  const [baseMap, setBaseMap] = useState<'satellite' | 'dark' | 'terrain'>('satellite');
  const [showPolygons, setShowPolygons] = useState<boolean>(true);
  const [showHeliLZ, setShowHeliLZ] = useState<boolean>(true);
  const [showEvacuationRoutes, setShowEvacuationRoutes] = useState<boolean>(true);
  const [showSatellites, setShowSatellites] = useState<boolean>(true);
  const [showHeliSortie, setShowHeliSortie] = useState<boolean>(true);
  const [showEmergencyVehicles, setShowEmergencyVehicles] = useState<boolean>(true);
  const [showShelters, setShowShelters] = useState<boolean>(true);
  const [showEmergencyStations, setShowEmergencyStations] = useState<boolean>(true);
  const [showCWCGauges, setShowCWCGauges] = useState<boolean>(true);
  const [showRoads, setShowRoads] = useState<boolean>(true);
  const [isGISLayersOpen, setIsGISLayersOpen] = useState<boolean>(false);

  // Simulation Animation Steps
  const [internalHeliStep, setInternalHeliStep] = useState<number>(0);
  const [internalVehicleStep, setInternalVehicleStep] = useState<number>(0);
  const [isSortieSimulating, setIsSortieSimulating] = useState<boolean>(true);
  const [isVehicleSimulating, setIsVehicleSimulating] = useState<boolean>(true);

  // Real Dynamic Overlays from API
  const [liveShelters, setLiveShelters] = useState<any[]>([]);
  const [liveStations, setLiveStations] = useState<any[]>([]);

  const { state, inundationPolygons, heliLandingZones, vehicleWadingClearances } = comprehensiveState;
  const [cLat, cLng] = state.center_coords || [27.7, 88.6];

  // Continuous animation ticker for moving helicopter and emergency vehicles
  useEffect(() => {
    if (!isSortieSimulating && !isPlaying) return;
    const interval = setInterval(() => {
      setInternalHeliStep(prev => (prev + 1) % 12);
    }, Math.max(500, Math.floor(1300 / playbackSpeed)));
    return () => clearInterval(interval);
  }, [isSortieSimulating, isPlaying, playbackSpeed]);

  useEffect(() => {
    if (!isVehicleSimulating && !isPlaying) return;
    const interval = setInterval(() => {
      setInternalVehicleStep(prev => (prev + 1) % 10);
    }, Math.max(400, Math.floor(1000 / playbackSpeed)));
    return () => clearInterval(interval);
  }, [isVehicleSimulating, isPlaying, playbackSpeed]);

  // Fetch real-world shelters and emergency stations for the region
  useEffect(() => {
    let isMounted = true;
    const fetchRealData = async () => {
      try {
        const [shelterRes, stationRes] = await Promise.all([
          apiService.getLiveReliefShelters(cLat, cLng, 10.0).catch(() => null),
          apiService.getLiveEmergencyStations(cLat, cLng, 10.0).catch(() => null)
        ]);
        if (isMounted) {
          if (shelterRes?.shelters?.length) setLiveShelters(shelterRes.shelters);
          if (stationRes?.stations?.length) setLiveStations(stationRes.stations);
        }
      } catch (e) {
        console.warn('Real-world data fetch fallback:', e);
      }
    };
    fetchRealData();
    return () => { isMounted = false; };
  }, [cLat, cLng]);

  // Initialize or re-center Map when comprehensiveState changes
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [cLat, cLng],
        zoom: 11,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      mapInstanceRef.current = map;
      layersGroupRef.current = L.layerGroup().addTo(map);
    } else {
      mapInstanceRef.current.flyTo([cLat, cLng], 11, {
        duration: 1.2
      });
    }
  }, [comprehensiveState.id]);

  // Update Base Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let tileUrl = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'; // Default Google Hybrid Sat
    let maxZoom = 20;

    if (baseMap === 'dark') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    } else if (baseMap === 'terrain') {
      tileUrl = 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}'; // Google Terrain with elevation contours
    }

    L.tileLayer(tileUrl, { maxZoom, subdomains: 'abcd' }).addTo(map);
  }, [baseMap]);

  // Render Interactive Multi-Layer Geospatial Simulation
  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;
    const layers = layersGroupRef.current;
    layers.clearLayers();

    // -------------------------------------------------------------------------
    // 1. 🛰️ SATELLITES & SPACEBORNE SAR RADAR SWATH (ISRO RISAT-1A / EOS-04)
    // -------------------------------------------------------------------------
    if (showSatellites) {
      // Calculate dynamic ground track orbit position based on timelineHour + internal ticker
      const orbitOffset = ((timelineHour * 0.015) + (internalHeliStep * 0.005)) % 0.14;
      const satLat = cLat + 0.06 - orbitOffset;
      const satLng = cLng - 0.05 + (orbitOffset * 0.8);

      // SAR Radar Swath Footprint Polygon
      const sarSwathCoords: [number, number][] = [
        [satLat - 0.025, satLng - 0.040],
        [satLat + 0.025, satLng - 0.020],
        [satLat + 0.025, satLng + 0.035],
        [satLat - 0.025, satLng + 0.015]
      ];

      L.polygon(sarSwathCoords, {
        color: '#06b6d4',
        weight: 1.5,
        dashArray: '6, 6',
        fillColor: '#0891b2',
        fillOpacity: 0.12
      }).addTo(layers);

      // Radar Scanning Center Line
      L.polyline([
        [satLat - 0.025, satLng - 0.012],
        [satLat + 0.025, satLng + 0.008]
      ], {
        color: '#22d3ee',
        weight: 2,
        dashArray: '3, 4',
        opacity: 0.7
      }).addTo(layers);

      // Animated Satellite Marker
      const satHtml = `
        <div class="relative flex items-center justify-center w-10 h-10 rounded-full bg-cyan-950/95 border-2 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.9)] cursor-pointer transform hover:scale-125 transition-all">
          <span class="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded bg-cyan-600 text-white font-mono text-[7px] font-black uppercase tracking-wider animate-pulse">
            ORBIT
          </span>
          <span class="text-base animate-pulse">🛰️</span>
          <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-cyan-300 border border-cyan-500 font-bold whitespace-nowrap shadow-xl">
            RISAT-1A / EOS-04 SAR
          </div>
        </div>
      `;

      const satMarker = L.marker([satLat, satLng], {
        icon: L.divIcon({ className: 'custom-div-icon', html: satHtml, iconSize: [40, 40], iconAnchor: [20, 20] }),
        zIndexOffset: 16000
      }).addTo(layers);

      satMarker.bindPopup(`
        <div class="text-xs font-mono p-2.5 bg-slate-950 text-slate-100 rounded-xl border border-cyan-500/60 shadow-2xl space-y-1 min-w-[250px]">
          <div class="flex items-center space-x-1.5 text-cyan-400 font-bold text-xs">
            <span>🛰️ ISRO RISAT-1A / EOS-04 C-Band SAR</span>
            <span class="px-1.5 py-0.2 rounded bg-cyan-900 border border-cyan-500 text-cyan-200 text-[8px]">ACTIVE PASS</span>
          </div>
          <div class="text-[10px] text-slate-300 space-y-0.5 pt-1 border-t border-slate-800">
            <div><strong>Polarization:</strong> <span class="text-white font-bold">Dual-Pol (VV + VH)</span></div>
            <div><strong>Ground Resolution:</strong> <span class="text-emerald-300 font-bold">0.5m High-Resolution</span></div>
            <div><strong>Cloud Penetration:</strong> <span class="text-cyan-300 font-bold">100% All-Weather Radar</span></div>
            <div><strong>Mean Backscatter:</strong> <code class="text-amber-300">-18.4 dB (Inundated Surface)</code></div>
            <div><strong>Swath Width:</strong> <span class="text-white">50 km Active Ground Swath</span></div>
            <div><strong>Telemetry Track:</strong> Descending Sun-Synchronous (10:30 AM Node)</div>
          </div>
        </div>
      `);

      // Bhoonidhi STAC Passes Nearby
      const stacAssets = [
        { name: "NISAR L-Band SAR", lat: cLat + 0.038, lng: cLng + 0.042, emoji: "🛰️", color: "#38bdf8", role: "Surface Deformation" },
        { name: "Cartosat-3 0.28m", lat: cLat - 0.032, lng: cLng - 0.045, emoji: "🛰️", color: "#f59e0b", role: "Optical Inundation Extent" }
      ];

      stacAssets.forEach(stac => {
        const stacHtml = `
          <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-slate-950 border-2 shadow-xl cursor-pointer" style="border-color: ${stac.color}; box-shadow: 0 0 14px ${stac.color}">
            <span class="text-xs">${stac.emoji}</span>
            <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[7px] font-mono px-1 rounded bg-slate-950 text-white border font-bold whitespace-nowrap" style="border-color: ${stac.color}">
              ${stac.name.split(' ')[0]}
            </div>
          </div>
        `;
        const m = L.marker([stac.lat, stac.lng], {
          icon: L.divIcon({ className: 'custom-div-icon', html: stacHtml, iconSize: [32, 32], iconAnchor: [16, 16] }),
          zIndexOffset: 14000
        }).addTo(layers);

        m.bindPopup(`
          <div class="text-xs font-mono p-2 bg-slate-950 text-slate-100 rounded-xl border" style="border-color: ${stac.color}">
            <strong style="color: ${stac.color};">${stac.name}</strong><br/>
            <span>Role: ${stac.role}</span><br/>
            <span>Provider: ISRO Bhoonidhi STAC API</span>
          </div>
        `);
      });
    }

    // -------------------------------------------------------------------------
    // 2. 🚁 MOVING IAF Mi-17V5 / ALH DHRUV TACTICAL EVACUATION FLIGHTS
    // -------------------------------------------------------------------------
    if (showHeliSortie) {
      const waypoints: Array<{ lat: number; lng: number; alt: number; spd: number; phase: string }> = [
        { lat: cLat - 0.048, lng: cLng - 0.055, alt: 380, spd: 140, phase: "Takeoff from Tactical Airbase (Climbing)" },
        { lat: cLat - 0.028, lng: cLng - 0.038, alt: 820, spd: 195, phase: "Transit Corridor: Ingress to river basin" },
        { lat: cLat - 0.008, lng: cLng - 0.018, alt: 1080, spd: 215, phase: "Scanning River Inundation with FLIR Radar" },
        { lat: cLat + 0.015, lng: cLng - 0.008, alt: 720, spd: 155, phase: "Descending over Submerged Settlement" },
        { lat: cLat + 0.028, lng: cLng + 0.012, alt: 220, spd: 60, phase: "Airdropping 400 Emergency Ration Pallets & Life Rafts" },
        { lat: cLat + 0.035, lng: cLng + 0.028, alt: 120, spd: 20, phase: "Hovering: Winch Cable Evacuation of 6 Trapped Citizens" },
        { lat: cLat + 0.025, lng: cLng + 0.042, alt: 450, spd: 130, phase: "Medevac Air Transit to Regional Trauma Center" },
        { lat: cLat + 0.005, lng: cLng + 0.050, alt: 880, spd: 195, phase: "Airlifting Critical ICU Evacuees to High-Ground Hospital" },
        { lat: cLat - 0.018, lng: cLng + 0.035, alt: 1020, spd: 210, phase: "Safe Airspace Return Artery" },
        { lat: cLat - 0.035, lng: cLng + 0.015, alt: 680, spd: 165, phase: "Monitoring Downstream Wave Celerity" },
        { lat: cLat - 0.045, lng: cLng - 0.025, alt: 350, spd: 110, phase: "Approach to Base Helipad (LZ-1)" },
        { lat: cLat - 0.048, lng: cLng - 0.055, alt: 45, spd: 25, phase: "Touchdown & Refueling for Sortie 2" }
      ];

      // Dynamic step: combines timelineHour progression with active simulation ticker
      const effectiveStep = (internalHeliStep + Math.floor(timelineHour * 2)) % waypoints.length;
      const currentWp = waypoints[effectiveStep];
      const flightCoords: [number, number][] = waypoints.map(w => [w.lat, w.lng]);

      // Glowing dashed flight path polyline
      L.polyline(flightCoords, {
        color: '#f97316',
        weight: 3,
        dashArray: '6, 8',
        opacity: 0.85
      }).addTo(layers);

      // Moving Helicopter Marker
      const heliHtml = `
        <div class="relative flex items-center justify-center w-10 h-10 rounded-full bg-orange-950 border-2 border-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.9)] cursor-pointer transform hover:scale-125 transition-all">
          <span class="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded bg-red-600 text-white font-mono text-[7px] font-black uppercase tracking-wider animate-pulse">
            AIR EVAC
          </span>
          <span class="text-base animate-bounce">🚁</span>
          <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-orange-300 border border-orange-500 font-bold whitespace-nowrap shadow-lg">
            IAF Mi-17V5 (${currentWp.alt}m)
          </div>
        </div>
      `;

      const heliMarker = L.marker([currentWp.lat, currentWp.lng], {
        icon: L.divIcon({ className: 'custom-div-icon', html: heliHtml, iconSize: [40, 40], iconAnchor: [20, 20] }),
        zIndexOffset: 15000
      }).addTo(layers);

      heliMarker.bindPopup(`
        <div class="text-xs font-mono p-2.5 bg-slate-950 text-slate-100 rounded-xl border border-orange-500 shadow-2xl space-y-1.5">
          <div class="flex items-center space-x-1.5 text-orange-400 font-bold">
            <span>🚁 IAF Mi-17V5 Tactical Air Evacuation Sortie</span>
            <span class="px-1.5 py-0.2 rounded bg-red-900 border border-red-500 text-white text-[8px]">SIMULATED</span>
          </div>
          <div class="space-y-1 text-[11px] border-t border-slate-800 pt-1">
            <div><strong>Registration:</strong> <code>IAF-Z3431 (Tactical SAR Wing)</code></div>
            <div><strong>Mission Phase:</strong> <span class="text-emerald-300 font-bold">${currentWp.phase}</span></div>
            <div><strong>Telemetry:</strong> Alt: <span class="text-white font-bold">${currentWp.alt}m</span> • Spd: <span class="text-cyan-300 font-bold">${currentWp.spd} km/h</span></div>
            <div><strong>Payload:</strong> 400 Ration Pallets • 6x Winch Hoists • Inflatable Zodiac Rafts</div>
            <div><strong>Status:</strong> <span class="text-amber-300 font-bold">Sortie Active (Step ${effectiveStep + 1}/12)</span></div>
          </div>
        </div>
      `);
    }

    // -------------------------------------------------------------------------
    // 3. 🚑 DYNAMIC SIMULATED 108 / NDRF EMERGENCY VEHICLES & AMBULANCES
    // -------------------------------------------------------------------------
    if (showEmergencyVehicles) {
      const originLat = cLat - 0.035;
      const originLng = cLng - 0.025;
      const destLat = cLat + 0.022;
      const destLng = cLng + 0.015;

      const vehiclePath: [number, number][] = [
        [originLat, originLng],
        [cLat - 0.025, cLng - 0.015],
        [cLat - 0.010, cLng - 0.005],
        [cLat + 0.005, cLng + 0.002],
        [cLat + 0.015, cLng + 0.008],
        [destLat, destLng]
      ];

      // Corridor polyline
      L.polyline(vehiclePath, {
        color: '#f43f5e',
        weight: 3.5,
        dashArray: '8, 8',
        opacity: 0.9
      }).addTo(layers);

      // Destination target pin
      const targetHtml = `
        <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-red-950/90 border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-pulse">
          <span class="text-sm">🎯</span>
          <span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
        </div>
      `;
      L.marker([destLat, destLng], {
        icon: L.divIcon({ className: 'custom-div-icon', html: targetHtml, iconSize: [32, 32], iconAnchor: [16, 16] }),
        zIndexOffset: 12000
      }).addTo(layers).bindPopup(`
        <div class="text-xs font-mono p-2 bg-slate-950 text-white rounded-xl border border-red-500">
          <strong class="text-red-400">🎯 Rescue Epicenter Objective</strong><br/>
          <span>Priority: Critical Inundation Evacuation Point</span>
        </div>
      `);

      // Moving Vehicle position along path
      const vStep = (internalVehicleStep + Math.floor(timelineHour * 2)) % vehiclePath.length;
      const curPt = vehiclePath[vStep];
      const isArrived = vStep >= vehiclePath.length - 1;
      const remainingEtaMin = Math.max(0.2, (vehiclePath.length - 1 - vStep) * 1.8);

      const ambHtml = `
        <div class="relative flex items-center justify-center w-10 h-10 rounded-full bg-rose-950 border-2 border-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.9)] cursor-pointer transform hover:scale-125 transition-all">
          <span class="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded bg-red-600 text-white font-mono text-[7px] font-black uppercase tracking-wider animate-pulse">
            108 DISPATCH
          </span>
          <span class="text-base animate-bounce">🚑</span>
          <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-rose-300 border border-rose-500 font-bold whitespace-nowrap shadow-lg">
            ${isArrived ? 'ARRIVED ON SCENE' : `ETA ${remainingEtaMin.toFixed(1)}m`}
          </div>
        </div>
      `;

      const ambMarker = L.marker(curPt, {
        icon: L.divIcon({ className: 'custom-div-icon', html: ambHtml, iconSize: [40, 40], iconAnchor: [20, 20] }),
        zIndexOffset: 16000
      }).addTo(layers);

      ambMarker.bindPopup(`
        <div class="text-xs font-mono p-2.5 bg-slate-950 text-slate-100 rounded-xl border border-rose-500/60 shadow-2xl space-y-1 min-w-[250px]">
          <div class="flex items-center space-x-1.5 text-rose-400 font-bold">
            <span>🚑 [SIMULATED] 108 Emergency Ambulance Unit</span>
          </div>
          <div class="text-[10px] text-slate-300 space-y-0.5 pt-1 border-t border-slate-800">
            <div><strong>Origin:</strong> District Civil Hospital & Trauma Center</div>
            <div><strong>Destination:</strong> Submerged Urban Outpost</div>
            <div><strong>Speed:</strong> <span class="text-cyan-300 font-bold">58 km/h</span> (High-Water Clearance Equipped)</div>
            <div><strong>Status:</strong> <span class="${isArrived ? 'text-emerald-400' : 'text-amber-400'} font-bold">${isArrived ? '✅ On-Scene: Triaging Evacuees' : '🚨 En Route (Priority Corridor)'}</span></div>
          </div>
        </div>
      `);

      // Also render any NDRF dispatch units from state
      if (state.dispatch_units) {
        state.dispatch_units.forEach(unit => {
          const unitIconHtml = `
            <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-emerald-950 border-2 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.8)] cursor-pointer">
              <span class="text-sm">${unit.unit_type.includes('boat') ? '🚤' : unit.unit_type.includes('helo') ? '🚁' : '🚒'}</span>
              <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[7px] font-mono px-1 rounded bg-slate-950 text-emerald-300 border border-emerald-500 font-bold whitespace-nowrap">
                ${unit.callsign}
              </div>
            </div>
          `;
          const uMarker = L.marker([unit.lat, unit.lng], {
            icon: L.divIcon({ className: 'custom-div-icon', html: unitIconHtml, iconSize: [32, 32], iconAnchor: [16, 16] }),
            zIndexOffset: 13000
          }).addTo(layers);

          uMarker.bindPopup(`
            <div class="text-xs font-mono p-2 bg-slate-950 text-slate-100 rounded-xl border border-emerald-500">
              <strong class="text-emerald-400">${unit.callsign} (${unit.agency})</strong><br/>
              <span>Type: ${unit.unit_type}</span><br/>
              <span>Status: <strong class="text-white">${unit.status}</strong></span><br/>
              <span>Mission: ${unit.assigned_mission}</span>
            </div>
          `);
        });
      }
    }

    // -------------------------------------------------------------------------
    // 4. ⛺ RELIEF SHELTERS & EVACUATION CAMPS (OSM + DDMA)
    // -------------------------------------------------------------------------
    if (showShelters) {
      const sheltersToRender = liveShelters.length > 0 ? liveShelters : [
        { name: "Government High School Relief Camp", lat: cLat - 0.038, lng: cLng + 0.032, capacity: 600, occupants: 420, power: "DG Generator Active", food: "Adequate (3 Days)" },
        { name: "Community Stadium Evacuation Shelter", lat: cLat + 0.042, lng: cLng - 0.035, capacity: 1200, occupants: 950, power: "Solar + DG Backup", food: "Adequate (5 Days)" }
      ];

      sheltersToRender.forEach(s => {
        const occPct = s.capacity ? Math.round(((s.occupants || s.current_occupants || 300) / s.capacity) * 100) : 75;
        const sHtml = `
          <div class="relative flex items-center justify-center w-7 h-7 rounded-full bg-emerald-950 border-2 border-emerald-400 shadow-2xl cursor-pointer transform hover:scale-125 transition-all">
            <span class="text-[12px]">⛺</span>
            <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-mono px-1 rounded bg-slate-950 text-emerald-300 border border-emerald-700 font-bold whitespace-nowrap">
              ${occPct}%
            </div>
          </div>
        `;
        const m = L.marker([s.lat, s.lng], {
          icon: L.divIcon({ className: 'custom-div-icon', html: sHtml, iconSize: [28, 28], iconAnchor: [14, 14] })
        }).addTo(layers);

        m.bindPopup(`
          <div class="text-xs font-mono p-2 bg-slate-950 text-slate-100 rounded-xl border border-emerald-500 space-y-1">
            <strong class="text-emerald-400">⛺ ${s.name}</strong><br/>
            <span>Capacity: <strong class="text-white">${s.occupants || s.current_occupants || 300} / ${s.capacity || 500} (${occPct}%)</strong></span><br/>
            <span>Rations: <strong class="text-cyan-300">${s.food || s.food_water_status || 'Adequate'}</strong></span><br/>
            <span>Power: <strong class="text-emerald-300">${s.power || 'DG Generator Active'}</strong></span>
          </div>
        `);
      });
    }

    // -------------------------------------------------------------------------
    // 5. 🚒 112 ERSS FIRE & POLICE EMERGENCY DEPOTS
    // -------------------------------------------------------------------------
    if (showEmergencyStations) {
      const stationsToRender = liveStations.length > 0 ? liveStations : [
        { name: "Central Fire Brigade & Rescue Depot", lat: cLat - 0.028, lng: cLng - 0.038, emoji: "🚒", fleet: "4 Rescue Tenders • 2 High-Flow Pumps" },
        { name: "District Police C2 Outpost", lat: cLat + 0.018, lng: cLng + 0.038, emoji: "🚓", fleet: "6 Patrol Vehicles • Wireless VHF Net" }
      ];

      stationsToRender.forEach(st => {
        const isFire = st.emoji === '🚒';
        const stColor = isFire ? '#ef4444' : '#3b82f6';
        const stHtml = `
          <div class="relative flex items-center justify-center w-7 h-7 rounded-full bg-slate-950 border-2 shadow-2xl cursor-pointer transform hover:scale-125 transition-all" style="border-color: ${stColor}">
            <span class="text-[12px]">${st.emoji || '🚒'}</span>
          </div>
        `;
        const m = L.marker([st.lat, st.lng], {
          icon: L.divIcon({ className: 'custom-div-icon', html: stHtml, iconSize: [28, 28], iconAnchor: [14, 14] })
        }).addTo(layers);

        m.bindPopup(`
          <div class="text-xs font-mono p-2 bg-slate-950 text-slate-100 rounded-xl border" style="border-color: ${stColor}">
            <strong style="color: ${stColor};">${st.name}</strong><br/>
            <span>Fleet: ${st.fleet || 'Active Response Unit'}</span><br/>
            <span>Channel: 112 ERSS Emergency Net</span>
          </div>
        `);
      });
    }

    // -------------------------------------------------------------------------
    // 6. 🌊 CENTRAL WATER COMMISSION (CWC) RIVER GAUGES
    // -------------------------------------------------------------------------
    if (showCWCGauges) {
      const cwcStations = [
        { name: "CWC Bridge Telemetry Station", lat: cLat + 0.018, lng: cLng - 0.015, level: 88.4, warning: 85.0, danger: 87.5, trend: "RISING" },
        { name: "Downstream Barrage Inflow Gauge", lat: cLat - 0.032, lng: cLng + 0.028, level: 52.8, warning: 50.0, danger: 54.0, trend: "PEAKING" }
      ];

      cwcStations.forEach(g => {
        const isDanger = g.level >= g.danger;
        const color = isDanger ? '#ef4444' : '#38bdf8';
        const gHtml = `
          <div class="relative flex items-center justify-center w-7 h-7 rounded-full bg-cyan-950 border-2 shadow-2xl cursor-pointer" style="border-color: ${color}">
            <span class="text-[12px]">🌊</span>
            <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[7px] font-mono px-1 rounded bg-slate-950 font-bold whitespace-nowrap" style="color: ${color}; border: 1px solid ${color}">
              ${g.level}m
            </div>
          </div>
        `;
        const m = L.marker([g.lat, g.lng], {
          icon: L.divIcon({ className: 'custom-div-icon', html: gHtml, iconSize: [28, 28], iconAnchor: [14, 14] })
        }).addTo(layers);

        m.bindPopup(`
          <div class="text-xs font-mono p-2 bg-slate-950 text-slate-100 rounded-xl border" style="border-color: ${color}">
            <strong style="color: ${color};">🌊 ${g.name}</strong><br/>
            <span>Current Stage: <strong class="text-white">${g.level} m</strong></span><br/>
            <span>Danger Mark: <strong class="text-red-400">${g.danger} m</strong> (${isDanger ? 'BREACHED' : 'SAFE'})</span><br/>
            <span>Trend: <strong class="text-amber-300">${g.trend}</strong></span>
          </div>
        `);
      });
    }

    // -------------------------------------------------------------------------
    // 7. 🗺️ VECTOR INUNDATION POLYGONS (Pillar 1)
    // -------------------------------------------------------------------------
    if (showPolygons && inundationPolygons) {
      inundationPolygons.forEach((poly) => {
        const polygonLayer = L.polygon(poly.coordinates, {
          color: poly.color,
          weight: 2,
          fillColor: poly.color,
          fillOpacity: Math.min(0.85, poly.fillOpacity * (0.8 + 0.2 * sensitivityMultiplier)),
          dashArray: '4, 6'
        });

        polygonLayer.bindTooltip(`
          <div style="font-family: monospace; font-size: 11px; padding: 4px;">
            <strong style="color: ${poly.color};">${poly.name}</strong><br/>
            <span>Water Depth Range: ${poly.depthRangeM}</span><br/>
            <span style="color: #67e8f9;">Multiplier: ${sensitivityMultiplier}x</span>
          </div>
        `, { sticky: true, className: 'leaflet-custom-tooltip' });

        layers.addLayer(polygonLayer);
      });
    }

    // -------------------------------------------------------------------------
    // 8. 🚁 HELICOPTER LANDING ZONES (LZ) (Pillar 4)
    // -------------------------------------------------------------------------
    if (showHeliLZ && heliLandingZones) {
      heliLandingZones.forEach((lz) => {
        const isSafe = lz.status === 'SAFE';
        const color = isSafe ? '#10b981' : lz.status === 'MARGINAL' ? '#f59e0b' : '#ef4444';

        const lzIcon = L.divIcon({
          className: 'lz-custom-icon',
          html: `
            <div style="
              width: 32px; height: 32px; border-radius: 50%;
              background: ${color}25; border: 2px solid ${color};
              display: flex; align-items: center; justify-content: center;
              font-family: monospace; font-weight: bold; font-size: 12px; color: ${color};
              box-shadow: 0 0 12px ${color}60;
            " class="${isSafe ? 'animate-pulse' : ''}">
              H
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker(lz.coords, { icon: lzIcon });
        marker.bindPopup(`
          <div style="font-family: monospace; font-size: 11px; color: #f8fafc; background: #0f172a; padding: 8px; border-radius: 8px; border: 1px solid ${color}; min-width: 200px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <strong style="color: ${color}; font-size: 12px;">🚁 HELI LZ: ${lz.name}</strong>
            </div>
            <div>Status: <strong style="color: ${color};">${lz.status}</strong></div>
            <div>Elevation: ${lz.elevation_m}m ASL</div>
            <div>Clear Radius: ${lz.clearRadius_m} meters</div>
            <div>IMD Wind Speed: ${lz.windSpeed_kmh} km/h</div>
            <div>Overhead Power Cables: ${lz.hasPowerCables ? '⚠️ DETECTED' : '✅ NONE'}</div>
            <p style="margin-top: 6px; font-size: 10px; color: #94a3b8;">${lz.notes}</p>
          </div>
        `);
        layers.addLayer(marker);
      });
    }

    // -------------------------------------------------------------------------
    // 9. 🟢 EVACUATION ROUTES (Pillar 1)
    // -------------------------------------------------------------------------
    if (showEvacuationRoutes && state.evacuation_routes) {
      state.evacuation_routes.forEach((route) => {
        const latLngs = route.coordinates.map(coord => [coord[1], coord[0]] as [number, number]);

        const routeLine = L.polyline(latLngs, {
          color: '#10b981',
          weight: 4,
          opacity: 0.9,
          dashArray: '10, 15',
          lineCap: 'round'
        });

        routeLine.bindTooltip(`
          <div style="font-family: monospace; font-size: 11px;">
            <strong style="color: #10b981;">🟢 SAFE EVACUATION ARTERY:</strong><br/>
            ${route.source_name} → ${route.target_shelter_name}<br/>
            Safety Score: ${(route.safety_score * 100).toFixed(0)}% • ${route.distance_km} km
          </div>
        `, { sticky: true });

        layers.addLayer(routeLine);
      });
    }

    // -------------------------------------------------------------------------
    // 10. 🛣️ ROADS WITH VEHICLE WADING CLEARANCE FILTER (Pillar 4)
    // -------------------------------------------------------------------------
    if (showRoads && state.roads) {
      state.roads.forEach((road) => {
        const latLngs = road.coordinates.map(coord => [coord[1], coord[0]] as [number, number]);
        const depth = road.flood_depth_m * (0.8 + 0.2 * sensitivityMultiplier);

        let isPassable = true;
        if (vehicleWadingFilter === 'car' && depth > vehicleWadingClearances.standardCarMaxDepthM) {
          isPassable = false;
        } else if (vehicleWadingFilter === 'truck' && depth > vehicleWadingClearances.ndrfTruckMaxDepthM) {
          isPassable = false;
        } else if (vehicleWadingFilter === 'boat' && depth < vehicleWadingClearances.inflatableBoatMinDepthM) {
          isPassable = false;
        } else if (depth > 0.5) {
          isPassable = false;
        }

        const roadColor = !isPassable ? '#ef4444' : depth > 0 ? '#f59e0b' : '#3b82f6';

        const roadPolyline = L.polyline(latLngs, {
          color: roadColor,
          weight: 3.5,
          opacity: 0.85
        });

        roadPolyline.bindTooltip(`
          <div style="font-family: monospace; font-size: 11px;">
            <strong>${road.name}</strong><br/>
            Status: ${isPassable ? 'PASSABLE' : 'IMPASSABLE'}<br/>
            Water Depth: ${depth.toFixed(2)}m
          </div>
        `, { sticky: true });

        layers.addLayer(roadPolyline);
      });
    }

    // -------------------------------------------------------------------------
    // 11. 📍 HYPSOMETRIC DEPTH TINTED NODES & USAR X-CODES (Pillar 1 & 4)
    // -------------------------------------------------------------------------
    if (state.nodes) {
      state.nodes.forEach((node) => {
        const dynamicDepth = Number((node.flood_depth_m * (0.8 + 0.2 * sensitivityMultiplier)).toFixed(2));
        
        let badgeColor = '#10b981';
        let categoryLabel = 'Safe Elevation';

        if (dynamicDepth > 1.5 || node.status === 'submerged') {
          badgeColor = '#ef4444';
          categoryLabel = '🔴 Submerged (>1.5m)';
        } else if (dynamicDepth >= 0.5) {
          badgeColor = '#f97316';
          categoryLabel = '🟠 Waist Depth (0.5m-1.5m)';
        } else if (dynamicDepth > 0) {
          badgeColor = '#eab308';
          categoryLabel = '🟡 Ankle/Knee (<0.5m)';
        }

        const isHighlighted = highlightedNodeId === node.id;

        const nodeDivIcon = L.divIcon({
          className: 'node-calibrated-icon',
          html: `
            <div style="
              width: ${isHighlighted ? '38px' : '28px'};
              height: ${isHighlighted ? '38px' : '28px'};
              border-radius: 8px;
              background: ${badgeColor};
              border: 2px solid #ffffff;
              display: flex; align-items: center; justify-content: center;
              font-family: monospace; font-weight: bold; font-size: 11px; color: #000;
              box-shadow: 0 0 ${isHighlighted ? '20px' : '10px'} ${badgeColor};
              transform: ${isHighlighted ? 'scale(1.2)' : 'scale(1)'};
              transition: all 0.3s ease;
            ">
              ${node.node_type === 'dam_levee' ? '🌊' : node.node_type === 'hospital' ? '🏥' : node.node_type === 'shelter' ? '⛺' : node.node_type === 'substation' ? '⚡' : '📍'}
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([node.lat, node.lng], { icon: nodeDivIcon });

        const usar = node.details?.usarXCode;
        const usarHtml = usar ? `
          <div style="margin-top: 8px; padding: 6px; background: #1e293b; border: 1px dashed #f59e0b; border-radius: 6px;">
            <div style="color: #f59e0b; font-weight: bold; font-size: 10px;">🏷️ USAR FEMA/NDRF X-MARKING:</div>
            <div style="font-size: 10px; color: #cbd5e1;">Date: ${usar.date} • Unit: ${usar.searchUnit}</div>
            <div style="font-size: 10px; color: #ef4444;">Hazards: ${usar.hazards}</div>
            <div style="font-size: 10px; color: #10b981; font-weight: bold;">Survivors Rescued: ${usar.survivorsRescued}</div>
          </div>
        ` : '';

        marker.bindPopup(`
          <div style="font-family: monospace; font-size: 11px; color: #f8fafc; background: #091224; padding: 10px; border-radius: 10px; border: 1px solid ${badgeColor}; min-width: 240px;">
            <div style="font-size: 13px; font-weight: bold; color: #38bdf8; margin-bottom: 2px;">${node.name}</div>
            <div style="font-size: 10px; color: #94a3b8; margin-bottom: 6px;">Type: ${node.node_type} • Elevation: ${node.elevation_m}m ASL</div>
            <div style="color: ${badgeColor}; font-weight: bold; margin-bottom: 4px;">Classification: ${categoryLabel}</div>
            <div>Calibrated Flood Depth: <strong style="color: #38bdf8;">${dynamicDepth}m</strong></div>
            <div>Structural Integrity: <strong style="color: ${node.structural_integrity < 0.5 ? '#ef4444' : '#10b981'};">${(node.structural_integrity * 100).toFixed(0)}%</strong></div>
            <div>Backup Power: ${node.backup_power_hours} hrs ${node.backup_power_active ? '(Active)' : '(Failed)'}</div>
            ${usarHtml}
          </div>
        `);

        marker.on('click', () => {
          onSelectNode(node);
        });

        layers.addLayer(marker);
      });
    }

  }, [
    comprehensiveState, sensitivityMultiplier, vehicleWadingFilter, 
    showPolygons, showHeliLZ, showEvacuationRoutes, showSatellites,
    showHeliSortie, showEmergencyVehicles, showShelters, showEmergencyStations,
    showCWCGauges, showRoads, highlightedNodeId, timelineHour, internalHeliStep, internalVehicleStep,
    liveShelters, liveStations
  ]);

  return (
    <div className="relative w-full h-[600px] lg:h-[680px] rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl bg-[#040812]">
      
      {/* 3D Topographic Perspective Tilt Container (Pillar 1) */}
      <div 
        ref={mapContainerRef} 
        style={{
          transform: is3DTiltActive ? 'perspective(900px) rotateX(25deg) scale(0.96)' : 'none',
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        className="w-full h-full z-0"
      />

      {/* Top Map Floating Toolbar */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 font-mono text-xs">
        
        {/* Basemap Switcher */}
        <div className="flex items-center bg-slate-950/90 border border-cyan-500/40 rounded-xl p-1 shadow-lg backdrop-blur-md">
          <button
            onClick={() => setBaseMap('satellite')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-bold ${
              baseMap === 'satellite' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setBaseMap('terrain')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-bold ${
              baseMap === 'terrain' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            3D Terrain
          </button>
          <button
            onClick={() => setBaseMap('dark')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-bold ${
              baseMap === 'dark' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dark HUD
          </button>
        </div>

        {/* Master GIS Layers Deck Trigger Button */}
        <button
          onClick={() => setIsGISLayersOpen(!isGISLayersOpen)}
          className={`px-3 py-1.5 rounded-xl border font-bold flex items-center space-x-1.5 transition-all shadow-lg backdrop-blur-md cursor-pointer ${
            isGISLayersOpen 
              ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white border-cyan-300 shadow-cyan-500/30' 
              : 'bg-slate-950/90 border-cyan-500/50 text-cyan-200 hover:bg-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
          <span>🛰️ GIS LAYERS (18 FEEDS)</span>
          {isGISLayersOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {/* Quick Simulation Toggles */}
        <div className="hidden sm:flex items-center bg-slate-950/90 border border-slate-800 rounded-xl p-1 shadow-lg backdrop-blur-md gap-1">
          <button
            onClick={() => setIsSortieSimulating(!isSortieSimulating)}
            title="Toggle Live IAF Helicopter Air Sortie Movement"
            className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center space-x-1 text-[11px] ${
              isSortieSimulating ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span>🚁 Air Sortie: {isSortieSimulating ? 'ON' : 'PAUSED'}</span>
          </button>

          <button
            onClick={() => setIsVehicleSimulating(!isVehicleSimulating)}
            title="Toggle Live 108 Emergency Ambulance / NDRF Dispatch Simulation"
            className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center space-x-1 text-[11px] ${
              isVehicleSimulating ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span>🚑 108 Dispatch: {isVehicleSimulating ? 'ON' : 'PAUSED'}</span>
          </button>
        </div>

      </div>

      {/* GIS Layers Flyout Drawer */}
      {isGISLayersOpen && (
        <div className="absolute top-14 left-3 z-30 w-72 sm:w-80 rounded-2xl bg-[#070e1d]/98 border border-cyan-500/50 p-3.5 shadow-2xl backdrop-blur-xl font-mono text-xs space-y-3 ring-1 ring-cyan-500/30 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
            <div className="flex items-center space-x-1.5 text-cyan-300 font-bold">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>GIS TELEMETRY LAYERS</span>
            </div>
            <button 
              onClick={() => setIsGISLayersOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
            {/* 1. Satellites */}
            <label className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 cursor-pointer">
              <span className="flex items-center space-x-2 text-cyan-200">
                <Satellite className="w-3.5 h-3.5 text-cyan-400" />
                <span>🛰️ ISRO RISAT-1A SAR & Orbits</span>
              </span>
              <input 
                type="checkbox" 
                checked={showSatellites} 
                onChange={(e) => setShowSatellites(e.target.checked)}
                className="accent-cyan-400 cursor-pointer"
              />
            </label>

            {/* 2. Helicopters */}
            <label className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 cursor-pointer">
              <span className="flex items-center space-x-2 text-orange-200">
                <span>🚁</span>
                <span>IAF Mi-17V5 Evac Flights</span>
              </span>
              <input 
                type="checkbox" 
                checked={showHeliSortie} 
                onChange={(e) => setShowHeliSortie(e.target.checked)}
                className="accent-orange-400 cursor-pointer"
              />
            </label>

            {/* 3. Emergency Vehicles */}
            <label className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 cursor-pointer">
              <span className="flex items-center space-x-2 text-rose-200">
                <span>🚑</span>
                <span>108 Ambulances & NDRF Trucks</span>
              </span>
              <input 
                type="checkbox" 
                checked={showEmergencyVehicles} 
                onChange={(e) => setShowEmergencyVehicles(e.target.checked)}
                className="accent-rose-400 cursor-pointer"
              />
            </label>

            {/* 4. Relief Shelters */}
            <label className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 cursor-pointer">
              <span className="flex items-center space-x-2 text-emerald-200">
                <span>⛺</span>
                <span>Relief Shelters & Camps (OSM)</span>
              </span>
              <input 
                type="checkbox" 
                checked={showShelters} 
                onChange={(e) => setShowShelters(e.target.checked)}
                className="accent-emerald-400 cursor-pointer"
              />
            </label>

            {/* 5. 112 Depots */}
            <label className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 cursor-pointer">
              <span className="flex items-center space-x-2 text-blue-200">
                <span>🚒</span>
                <span>112 Fire & Police Stations</span>
              </span>
              <input 
                type="checkbox" 
                checked={showEmergencyStations} 
                onChange={(e) => setShowEmergencyStations(e.target.checked)}
                className="accent-blue-400 cursor-pointer"
              />
            </label>

            {/* 6. CWC Gauges */}
            <label className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 cursor-pointer">
              <span className="flex items-center space-x-2 text-teal-200">
                <Waves className="w-3.5 h-3.5 text-teal-400" />
                <span>CWC River Stage Gauges</span>
              </span>
              <input 
                type="checkbox" 
                checked={showCWCGauges} 
                onChange={(e) => setShowCWCGauges(e.target.checked)}
                className="accent-teal-400 cursor-pointer"
              />
            </label>

            {/* 7. Inundation Polygons */}
            <label className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 cursor-pointer">
              <span className="flex items-center space-x-2 text-cyan-200">
                <Waves className="w-3.5 h-3.5 text-cyan-400" />
                <span>Vector Inundation Polygons</span>
              </span>
              <input 
                type="checkbox" 
                checked={showPolygons} 
                onChange={(e) => setShowPolygons(e.target.checked)}
                className="accent-cyan-400 cursor-pointer"
              />
            </label>

            {/* 8. Heli Landing Zones */}
            <label className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 cursor-pointer">
              <span className="flex items-center space-x-2 text-emerald-200">
                <span>🚁</span>
                <span>Heli Landing Zones (LZ)</span>
              </span>
              <input 
                type="checkbox" 
                checked={showHeliLZ} 
                onChange={(e) => setShowHeliLZ(e.target.checked)}
                className="accent-emerald-400 cursor-pointer"
              />
            </label>

            {/* 9. Evacuation Arteries */}
            <label className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 cursor-pointer">
              <span className="flex items-center space-x-2 text-emerald-200">
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span>Safe Evacuation Arteries</span>
              </span>
              <input 
                type="checkbox" 
                checked={showEvacuationRoutes} 
                onChange={(e) => setShowEvacuationRoutes(e.target.checked)}
                className="accent-emerald-400 cursor-pointer"
              />
            </label>

            {/* 10. Roads */}
            <label className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 cursor-pointer">
              <span className="flex items-center space-x-2 text-blue-200">
                <Car className="w-3.5 h-3.5 text-blue-400" />
                <span>Road Network & Wading</span>
              </span>
              <input 
                type="checkbox" 
                checked={showRoads} 
                onChange={(e) => setShowRoads(e.target.checked)}
                className="accent-blue-400 cursor-pointer"
              />
            </label>
          </div>
        </div>
      )}

      {/* Bottom Map Legend */}
      <div className="absolute bottom-3 left-3 z-10 bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 shadow-xl backdrop-blur-md font-mono text-[10px] space-y-1 text-slate-300 max-w-[220px] sm:max-w-xs">
        <div className="text-[9px] text-slate-400 uppercase font-bold border-b border-slate-800 pb-1">
          Hypsometric & Simulation Legend:
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded bg-red-500" />
          <span>🔴 Submerged (&gt;1.5m - Boat/Helo only)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded bg-orange-500" />
          <span>🟠 Waist Depth (0.5m-1.5m - Truck)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded bg-yellow-500" />
          <span>🟡 Knee Depth (&lt;0.5m - High clearance)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
          <span>🟢 Safe Relief Zone / Helipad</span>
        </div>
        <div className="flex items-center space-x-2 pt-0.5 text-[9px] text-cyan-300">
          <span>🛰️ Active SAR Pass • 🚁 IAF Sorties • 🚑 108 Units</span>
        </div>
      </div>

      {/* Vehicle Wading Status Pill & Dynamic Telemetry Readout */}
      <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1.5">
        <div className="bg-slate-950/90 border border-cyan-500/40 rounded-xl px-3 py-1.5 shadow-xl backdrop-blur-md font-mono text-xs flex items-center space-x-2 text-cyan-300">
          {vehicleWadingFilter === 'car' && <Car className="w-3.5 h-3.5 text-amber-400" />}
          {vehicleWadingFilter === 'truck' && <Truck className="w-3.5 h-3.5 text-emerald-400" />}
          {vehicleWadingFilter === 'boat' && <Ship className="w-3.5 h-3.5 text-cyan-400" />}
          {vehicleWadingFilter === 'all' && <Crosshair className="w-3.5 h-3.5 text-slate-400" />}
          <span className="uppercase text-[11px] font-bold">
            Filter: {vehicleWadingFilter.toUpperCase()} WADING
          </span>
        </div>

        {/* Live Simulation Progress Pill */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-xl px-2.5 py-1 shadow-md text-[10px] font-mono flex items-center space-x-1.5 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>SIM T+<strong className="text-cyan-300">{timelineHour.toFixed(2)}h</strong></span>
          <span className="text-slate-500">•</span>
          <span>IAF Sortie: <strong className="text-orange-300">{internalHeliStep + 1}/12</strong></span>
        </div>
      </div>

    </div>
  );
};
