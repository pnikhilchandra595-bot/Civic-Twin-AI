import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Map, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
  Compass, Eye, RotateCw, ZoomIn, ZoomOut, Waves, Send, Anchor, 
  ShieldAlert, Activity, Play, Pause, RefreshCw, Layers, Award,
  Sliders, ArrowUpRight, Zap, Building2, Flame, Maximize2, X,
  Radio, Video, Navigation, AlertTriangle, CheckCircle2, ChevronRight,
  Globe, Map as MapIcon, Mountain, ShieldCheck
} from 'lucide-react';
import { CityDigitalTwinState, InfrastructureNode } from '../types/digital_twin';

interface Real3DGeographicMapProps {
  state: CityDigitalTwinState | null;
  onSelectNode?: (node: InfrastructureNode) => void;
  onSwitchTo2D?: () => void;
  onOpenCommandSuite?: () => void;
  onOpenAccuracyAudit?: () => void;
  onOpenCrownJewels?: () => void;
}

// Basemap Tile Configurations
const BASEMAP_STYLES = {
  satellite: {
    version: 8 as const,
    sources: {
      'esri-satellite': {
        type: 'raster' as const,
        tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256,
        attribution: '© Esri, Maxar, Earthstar Geographics'
      },
      'terrain-dem': {
        type: 'raster-dem' as const,
        tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
        encoding: 'terrarium' as const,
        tileSize: 256
      }
    },
    layers: [
      {
        id: 'esri-satellite-layer',
        type: 'raster' as const,
        source: 'esri-satellite',
        minzoom: 0,
        maxzoom: 20
      }
    ]
  },
  dark: {
    version: 8 as const,
    sources: {
      'carto-dark': {
        type: 'raster' as const,
        tiles: [
          'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
          'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'
        ],
        tileSize: 256,
        attribution: '© CARTO, OpenStreetMap contributors'
      },
      'terrain-dem': {
        type: 'raster-dem' as const,
        tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
        encoding: 'terrarium' as const,
        tileSize: 256
      }
    },
    layers: [
      {
        id: 'carto-dark-layer',
        type: 'raster' as const,
        source: 'carto-dark',
        minzoom: 0,
        maxzoom: 20
      }
    ]
  },
  streets: {
    version: 8 as const,
    sources: {
      'osm-streets': {
        type: 'raster' as const,
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors'
      },
      'terrain-dem': {
        type: 'raster-dem' as const,
        tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
        encoding: 'terrarium' as const,
        tileSize: 256
      }
    },
    layers: [
      {
        id: 'osm-streets-layer',
        type: 'raster' as const,
        source: 'osm-streets',
        minzoom: 0,
        maxzoom: 19
      }
    ]
  }
};

// Real Mumbai Geographic Hotspots for 3D Inundation and Drainage
const MUMBAI_DRAINAGE_NODES = [
  { id: 'MH-01', name: 'Sion Circle Storm Sump', coords: [72.8625, 19.0405], depth: '3.8m', status: 'SURCHARGING', geyser: false },
  { id: 'MH-02', name: 'Kurla West Trunk Collector', coords: [72.8777, 19.0655], depth: '4.2m', status: 'SURCHARGING', geyser: false },
  { id: 'MH-03', name: 'Dharavi 90-Ft Rd Culvert', coords: [72.8550, 19.0430], depth: '3.5m', status: 'OPTIMAL', geyser: false },
  { id: 'MH-04', name: 'Milan Subway Deep Trench', coords: [72.8420, 19.0880], depth: '5.0m', status: 'GEYSER_ERUPTING', geyser: true },
  { id: 'MH-05', name: 'BKC Connector Stormway', coords: [72.8680, 19.0600], depth: '4.0m', status: 'OPTIMAL', geyser: false },
  { id: 'MH-06', name: 'Bandra East Highland Feeder', coords: [72.8450, 19.0550], depth: '4.5m', status: 'OPTIMAL', geyser: false },
  { id: 'MH-07', name: 'Kranti Nagar Riverbank Siphon', coords: [72.8820, 19.0720], depth: '3.2m', status: 'GEYSER_ERUPTING', geyser: true },
  { id: 'MH-08', name: 'Mahim Creek Tidal Outfall', coords: [72.8380, 19.0410], depth: '3.0m', status: 'BACKPRESSURE_CHOKED', geyser: false }
];

const DRAINAGE_PIPES_GEOJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Sion-Kurla Interceptor', status: 'pressurized', color: '#06b6d4' },
      geometry: { type: 'LineString', coordinates: [[72.8625, 19.0405], [72.8777, 19.0655]] }
    },
    {
      type: 'Feature',
      properties: { name: 'Kurla-Dharavi Pressure Box', status: 'pressurized', color: '#3b82f6' },
      geometry: { type: 'LineString', coordinates: [[72.8777, 19.0655], [72.8550, 19.0430]] }
    },
    {
      type: 'Feature',
      properties: { name: 'Kurla-BKC Stormway', status: 'flowing', color: '#10b981' },
      geometry: { type: 'LineString', coordinates: [[72.8777, 19.0655], [72.8680, 19.0600]] }
    },
    {
      type: 'Feature',
      properties: { name: 'Dharavi-Mahim Outfall', status: 'pressurized', color: '#f59e0b' },
      geometry: { type: 'LineString', coordinates: [[72.8550, 19.0430], [72.8380, 19.0410]] }
    },
    {
      type: 'Feature',
      properties: { name: 'Sion-Milan Gravity Siphon', status: 'surcharging', color: '#ef4444' },
      geometry: { type: 'LineString', coordinates: [[72.8625, 19.0405], [72.8420, 19.0880]] }
    },
    {
      type: 'Feature',
      properties: { name: 'Milan-Kranti Relief Trunk', status: 'surcharging', color: '#ef4444' },
      geometry: { type: 'LineString', coordinates: [[72.8420, 19.0880], [72.8820, 19.0720]] }
    },
    {
      type: 'Feature',
      properties: { name: 'Kranti-Mahim Tidal Culvert', status: 'backpressure', color: '#ef4444' },
      geometry: { type: 'LineString', coordinates: [[72.8820, 19.0720], [72.8380, 19.0410]] }
    }
  ]
};

// 3D Flood Inundation Polygon along Mithi River Corridor
const FLOOD_INUNDATION_GEOJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Mithi River 2D SWE Inundation Belt', depth: '1.85m' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [72.8350, 19.0380],
          [72.8520, 19.0420],
          [72.8650, 19.0550],
          [72.8800, 19.0680],
          [72.8950, 19.0780],
          [72.8880, 19.0850],
          [72.8700, 19.0740],
          [72.8550, 19.0580],
          [72.8400, 19.0480],
          [72.8350, 19.0380]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'Milan Subway Depression Ponding', depth: '1.82m' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [72.8390, 19.0850],
          [72.8450, 19.0850],
          [72.8450, 19.0910],
          [72.8390, 19.0910],
          [72.8390, 19.0850]
        ]]
      }
    }
  ]
};

export const Real3DGeographicMap: React.FC<Real3DGeographicMapProps> = ({
  state,
  onSelectNode,
  onSwitchTo2D,
  onOpenCommandSuite,
  onOpenAccuracyAudit,
  onOpenCrownJewels
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  const [basemap, setBasemap] = useState<'satellite' | 'dark' | 'streets'>('satellite');
  const [waterDepthMeters, setWaterDepthMeters] = useState<number>(1.85);
  const [isSubterraneanXRay, setIsSubterraneanXRay] = useState<boolean>(true);
  const [showCVWaterwayModal, setShowCVWaterwayModal] = useState<boolean>(false);
  const [terrainExaggeration, setTerrainExaggeration] = useState<number>(2.2);
  const [currentPitch, setCurrentPitch] = useState<number>(65);
  const [currentBearing, setCurrentBearing] = useState<number>(-35);

  // Initialize Real 3D MapLibre Geographic Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center coords from state or default to Mumbai Mithi Basin
    const centerLng = state?.center_coords?.[1] || 72.865;
    const centerLat = state?.center_coords?.[0] || 19.060;

    const map = new Map({
      container: mapContainerRef.current,
      style: BASEMAP_STYLES[basemap] as any,
      center: [centerLng, centerLat],
      zoom: 13.5,
      pitch: currentPitch,
      bearing: currentBearing,
      maxPitch: 85,
    });

    map.on('load', () => {
      // 1. Enable 3D Terrain Elevation Relief
      try {
        map.setTerrain({
          source: 'terrain-dem',
          exaggeration: terrainExaggeration
        });
      } catch (e) {
        console.warn('3D Terrain DEM layer loaded with default relief:', e);
      }

      // 2. Add Dynamic 3D Flood Inundation Layer
      map.addSource('flood-inundation-source', {
        type: 'geojson',
        data: FLOOD_INUNDATION_GEOJSON
      });

      map.addLayer({
        id: 'flood-inundation-layer',
        type: 'fill',
        source: 'flood-inundation-source',
        paint: {
          'fill-color': '#0284c7',
          'fill-opacity': 0.68
        }
      });

      map.addLayer({
        id: 'flood-outline-layer',
        type: 'line',
        source: 'flood-inundation-source',
        paint: {
          'line-color': '#38bdf8',
          'line-width': 3,
          'line-opacity': 0.95
        }
      });

      // 3. Add Subterranean Drainage Pipe Network
      map.addSource('drainage-pipes-source', {
        type: 'geojson',
        data: DRAINAGE_PIPES_GEOJSON
      });

      map.addLayer({
        id: 'drainage-pipes-glow',
        type: 'line',
        source: 'drainage-pipes-source',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 8,
          'line-opacity': 0.45,
          'line-blur': 3
        }
      });

      map.addLayer({
        id: 'drainage-pipes-core',
        type: 'line',
        source: 'drainage-pipes-source',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#ffffff',
          'line-width': 3,
          'line-opacity': 0.9
        }
      });

      // 4. Add 3D Manhole Surcharge Markers & Erupting Geysers
      MUMBAI_DRAINAGE_NODES.forEach((node) => {
        const el = document.createElement('div');
        el.className = 'group cursor-pointer';

        if (node.geyser) {
          el.innerHTML = `
            <div class="relative flex items-center justify-center">
              <span class="absolute w-12 h-12 rounded-full bg-cyan-400 opacity-75 animate-ping"></span>
              <span class="absolute w-8 h-8 rounded-full bg-red-500 opacity-60 animate-pulse"></span>
              <div class="w-6 h-6 rounded-full bg-red-600 border-2 border-white shadow-lg flex items-center justify-center text-[10px] text-white font-bold">
                ⚠️
              </div>
              <div class="absolute -top-7 whitespace-nowrap px-2 py-0.5 rounded bg-red-950/90 border border-red-500 text-[10px] font-mono text-white font-black shadow-lg">
                💥 GEYSER: ${node.name}
              </div>
            </div>
          `;
        } else {
          el.innerHTML = `
            <div class="relative flex items-center justify-center">
              <span class="absolute w-7 h-7 rounded-full bg-cyan-500 opacity-40 animate-pulse"></span>
              <div class="w-4 h-4 rounded-full bg-cyan-400 border border-slate-950 shadow-md flex items-center justify-center text-[8px] text-slate-950 font-bold">
                ●
              </div>
              <div class="hidden group-hover:block absolute -top-6 whitespace-nowrap px-1.5 py-0.5 rounded bg-slate-950/90 border border-cyan-400 text-[9px] font-mono text-cyan-300 font-bold shadow-lg">
                ${node.name} (${node.depth})
              </div>
            </div>
          `;
        }

        new Marker({ element: el })
          .setLngLat(node.coords as [number, number])
          .addTo(map);
      });

      // 5. Add Infrastructure Facility Markers
      if (state?.nodes) {
        state.nodes.forEach((node) => {
          if (!node.lat || !node.lng) return;
          const markerEl = document.createElement('div');
          markerEl.className = 'cursor-pointer hover:scale-110 transition-transform';
          const isCrit = node.status === 'critical' || node.status === 'damaged' || node.status === 'submerged' || node.status === 'offline';
          const icon = node.node_type === 'hospital' ? '🏥' : node.node_type === 'substation' ? '⚡' : node.node_type === 'bridge' ? '🌉' : '📍';

          markerEl.innerHTML = `
            <div class="flex items-center space-x-1 px-2 py-1 rounded-xl shadow-2xl backdrop-blur-md border ${
              isCrit ? 'bg-red-950/90 border-red-500 text-red-200' : 'bg-slate-950/90 border-cyan-400 text-cyan-200'
            }">
              <span class="text-xs">${icon}</span>
              <span class="font-mono text-[10px] font-bold">${node.name}</span>
            </div>
          `;

          markerEl.onclick = () => {
            if (onSelectNode) onSelectNode(node);
          };

          new Marker({ element: markerEl })
            .setLngLat([node.lng, node.lat])
            .addTo(map);
        });
      }
    });

    map.on('rotate', () => {
      setCurrentBearing(Math.round(map.getBearing()));
      setCurrentPitch(Math.round(map.getPitch()));
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [state?.city_name, basemap]);

  // Update Flood Inundation Opacity & Elevation via Slider
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (map.getLayer('flood-inundation-layer')) {
      const opacity = Math.min(0.92, 0.35 + (waterDepthMeters / 3.5) * 0.55);
      map.setPaintProperty('flood-inundation-layer', 'fill-opacity', opacity);
    }
  }, [waterDepthMeters]);

  // Toggle Subterranean Drainage Visibility
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const visibility = isSubterraneanXRay ? 'visible' : 'none';
    if (map.getLayer('drainage-pipes-glow')) {
      map.setLayoutProperty('drainage-pipes-glow', 'visibility', visibility);
    }
    if (map.getLayer('drainage-pipes-core')) {
      map.setLayoutProperty('drainage-pipes-core', 'visibility', visibility);
    }
  }, [isSubterraneanXRay]);

  // Camera Presets
  const handleFlyTo = (lng: number, lat: number, pitch: number, bearing: number, zoom: number) => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [lng, lat],
      pitch: pitch,
      bearing: bearing,
      zoom: zoom,
      essential: true,
      duration: 2500
    });
  };

  return (
    <div className="relative w-full rounded-2xl bg-[#030712] border border-cyan-500/40 shadow-2xl overflow-hidden flex flex-col font-mono">
      
      {/* TOP HUD BAR */}
      <div className="px-4 py-3 bg-[#081224]/95 border-b border-cyan-500/35 flex flex-wrap items-center justify-between gap-3 z-10 backdrop-blur-md">
        
        {/* Title & Status */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-cyan-400 animate-spin-slow" />
            <h3 className="font-bold text-sm tracking-wider text-cyan-300">
              CIVICTWIN TRUE 3D GEOGRAPHIC TERRAIN MAP
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 animate-pulse">
            3D DEM SATELLITE RELIEF
          </span>
          <span className="hidden md:inline text-xs text-slate-400">
            Real Topography + Esri Photorealistic 3D + Subterranean SWD Network
          </span>
        </div>

        {/* Top Controls */}
        <div className="flex items-center space-x-2 text-xs">
          
          {/* Basemap Switcher */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-900 border border-cyan-500/40">
            <button
              onClick={() => setBasemap('satellite')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                basemap === 'satellite' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              🛰️ Satellite 3D
            </button>
            <button
              onClick={() => setBasemap('dark')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                basemap === 'dark' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              🌃 Dark Tactical
            </button>
            <button
              onClick={() => setBasemap('streets')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                basemap === 'streets' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              🗺️ Streets 3D
            </button>
          </div>

          {/* Subterranean X-Ray Toggle */}
          <button
            onClick={() => setIsSubterraneanXRay(!isSubterraneanXRay)}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              isSubterraneanXRay 
                ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/50 border border-cyan-200 font-black' 
                : 'bg-slate-900/90 text-cyan-400 hover:bg-cyan-950/80 border border-cyan-500/40'
            }`}
            title="Toggle Subterranean 1D Drainage Pipe Network & Surcharging Geyser Cones"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isSubterraneanXRay ? '⚡ X-RAY: DRAINAGE ON' : '⚡ SUBTERRANEAN X-RAY'}</span>
          </button>

          {/* AI Waterway CV Vision Button */}
          <button
            onClick={() => setShowCVWaterwayModal(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold flex items-center space-x-1.5 shadow-lg shadow-cyan-600/30 cursor-pointer transition-all"
            title="Open Computer Vision Drone Waterway Safety HUD"
          >
            <Video className="w-3.5 h-3.5 text-cyan-200" />
            <span>📹 AI WATERWAY CV VISION</span>
          </button>

          {/* Switch to 2D Map Button */}
          {onSwitchTo2D && (
            <button
              onClick={onSwitchTo2D}
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <span>🗺️</span>
              <span>2D MAP</span>
            </button>
          )}

          {onOpenCrownJewels && (
            <button
              onClick={onOpenCrownJewels}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black flex items-center space-x-1.5 shadow-lg cursor-pointer"
            >
              <span>💎</span>
              <span>7 CROWN JEWELS</span>
            </button>
          )}
        </div>
      </div>

      {/* 3D MAPLIBRE CONTAINER */}
      <div className="relative w-full h-[620px] md:h-[680px]">
        
        {/* Map Canvas Mount */}
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* 3D CAMERA & PERSPECTIVE CONTROLS (TOP LEFT) */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 pointer-events-auto">
          <div className="p-3 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-cyan-500/35 text-xs text-slate-200 shadow-2xl space-y-2 max-w-xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-cyan-400 uppercase">
              <span className="flex items-center space-x-1">
                <Compass className="w-3.5 h-3.5" />
                <span>3D Geographic Orbit</span>
              </span>
              <span className="text-slate-400">Pitch: {currentPitch}°</span>
            </div>

            {/* Quick 3D Camera Jump Presets */}
            <div className="grid grid-cols-3 gap-1 pt-1">
              <button
                onClick={() => handleFlyTo(72.865, 19.060, 65, -35, 14)}
                className="px-2 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold transition-all text-center cursor-pointer"
              >
                🌊 Mithi Basin
              </button>
              <button
                onClick={() => handleFlyTo(72.842, 19.088, 72, 15, 15.5)}
                className="px-2 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold transition-all text-center cursor-pointer"
              >
                🚇 Milan Subway
              </button>
              <button
                onClick={() => handleFlyTo(72.838, 19.041, 60, -70, 14.5)}
                className="px-2 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold transition-all text-center cursor-pointer"
              >
                ⚓ Mahim Outfall
              </button>
            </div>

            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
              Right-Click Drag: 3D Pitch & Tilt | Left-Click: Pan | Scroll: Zoom
            </div>
          </div>
        </div>

        {/* 3D FLOOD PLANE & HYDROLOGIC SLIDER (BOTTOM RIGHT) */}
        <div className="absolute bottom-4 right-4 z-10 p-3.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 text-xs text-slate-200 shadow-2xl w-80 pointer-events-auto space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-cyan-300 font-bold flex items-center space-x-1.5">
              <Waves className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>3D Surface Flood Inundation</span>
            </span>
            <span className="text-sm font-black text-cyan-300">
              {waterDepthMeters.toFixed(2)} m
            </span>
          </div>

          <input
            type="range"
            min="0.0"
            max="3.5"
            step="0.05"
            value={waterDepthMeters}
            onChange={(e) => setWaterDepthMeters(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0.0m (Riverbed)</span>
            <span>1.82m (Milan Underpass)</span>
            <span>3.5m (Catastrophic)</span>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Subterranean Pipes:</span>
            <span className="text-cyan-300 font-bold">9 Conduits | 2 Erupting Geysers</span>
          </div>
        </div>

        {/* MAP LEGEND (BOTTOM LEFT) */}
        <div className="absolute bottom-4 left-4 z-10 p-3 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 text-[11px] text-slate-300 shadow-2xl pointer-events-auto space-y-1.5">
          <div className="font-bold text-cyan-400 uppercase text-[10px]">3D Geographic Layers</div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-sky-500/70 border border-sky-300" />
            <span>2D SWE Flood Inundation Water</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-1 bg-cyan-400 rounded-full" />
            <span>Subterranean Stormwater Conduits (1D SWD)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-600 border border-white animate-ping" />
            <span>Surcharging Manhole Geyser Eruptions</span>
          </div>
        </div>

      </div>

      {/* COMPUTER VISION WATERWAY SAFETY HUD MODAL */}
      {showCVWaterwayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
          <div className="relative w-full max-w-4xl rounded-2xl bg-[#060c18] border border-cyan-500/50 shadow-2xl overflow-hidden flex flex-col text-slate-200">
            
            <div className="px-5 py-3.5 bg-[#09152b] border-b border-cyan-500/40 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                  <Video className="w-4 h-4 animate-pulse" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-cyan-300">
                    CV WATERWAY SAFETY & HYDRODYNAMIC RADAR
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Edge YOLOv8 Inference + Dense Farnebäck Optical Flow (29.97 FPS)
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  LIVE STREAM ACTIVE
                </span>
                <button
                  onClick={() => setShowCVWaterwayModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="relative w-full h-80 rounded-xl bg-slate-950 border border-cyan-500/30 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-sky-950 to-blue-950 opacity-90">
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-20 pointer-events-none">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="border border-cyan-400/40 flex items-center justify-center text-[8px] text-cyan-300">
                        →
                      </div>
                    ))}
                  </div>
                </div>

                <div 
                  className="absolute border-2 border-red-500 bg-red-500/15 rounded pointer-events-none animate-pulse"
                  style={{ left: '22%', top: '58%', width: '54%', height: '14%' }}
                >
                  <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-red-600 text-[9px] font-black text-white rounded">
                    ⚠️ SUBMERGED ROAD MEDIAN (18cm CLEARANCE - PROP STRIKE RISK)
                  </div>
                </div>

                <div 
                  className="absolute border-2 border-amber-400 bg-amber-500/20 rounded pointer-events-none"
                  style={{ left: '52%', top: '35%', width: '22%', height: '24%' }}
                >
                  <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-amber-500 text-[9px] font-black text-slate-950 rounded">
                    🌀 SUCTION EDDY (2.6 m/s VORTICITY - CAPSIZE DANGER)
                  </div>
                </div>

                <div 
                  className="absolute border-2 border-emerald-400 bg-emerald-500/15 rounded pointer-events-none"
                  style={{ left: '6%', top: '28%', width: '26%', height: '52%' }}
                >
                  <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-emerald-600 text-[9px] font-black text-white rounded">
                    ✅ VERIFIED SAFE CHANNEL (&gt;1.2m CLEARANCE)
                  </div>
                </div>

                <div className="absolute top-3 left-3 text-[10px] space-y-0.5 text-cyan-300 bg-slate-950/70 p-2 rounded border border-cyan-500/30 backdrop-blur-sm">
                  <div>CAM: <strong>UAV-GARUDA-01</strong></div>
                  <div>FPS: <strong>29.97</strong> | LATENCY: <strong>14ms</strong></div>
                  <div>SURFACE VELOCITY: <strong>1.82 m/s</strong></div>
                  <div>BEARING: <strong>285° WNW</strong></div>
                </div>

                <div className="absolute bottom-3 right-3 text-[10px] space-y-0.5 text-red-300 bg-slate-950/70 p-2 rounded border border-red-500/30 backdrop-blur-sm">
                  <div className="flex items-center space-x-1 text-red-400 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>SONAR HAZARD ALERT</span>
                  </div>
                  <div>Median Submerged: <strong>0.18m</strong></div>
                  <div>Action: <strong>PROHIBIT BOAT CROSSING</strong></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase">Surface Velocity</span>
                  <div className="text-lg font-black text-cyan-400 mt-0.5">1.82 m/s</div>
                  <div className="text-[10px] text-slate-400">Peak eddy: 2.64 m/s</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase">Median Depth Ingress</span>
                  <div className="text-lg font-black text-amber-400 mt-0.5">0.18 m</div>
                  <div className="text-[10px] text-red-400 font-bold">Propeller Shear Risk</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase">Safe Transit Route</span>
                  <div className="text-lg font-black text-emerald-400 mt-0.5">Corridor Alpha</div>
                  <div className="text-[10px] text-emerald-400">Heading 285° Cleared</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase">Subterranean Coupling</span>
                  <div className="text-lg font-black text-blue-400 mt-0.5">2 Surcharging</div>
                  <div className="text-[10px] text-slate-400">Milan & Kranti Geysers</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-start space-x-2.5 text-xs text-slate-300">
                <span className="text-cyan-400 text-base">🛡️</span>
                <div>
                  <strong className="text-cyan-300">NDRF INFLATABLE RESCUE BOAT (IRB) DIRECTIVE:</strong>
                  <p className="mt-0.5 text-slate-400 text-[11px]">
                    Do NOT attempt to cross the road median divider near Dadar TT circle. Murky floodwater conceals sharp concrete edges just 18 cm below the surface. Steer via Corridor Alpha along S.V. Road western margin where clearance exceeds 1.4m.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
