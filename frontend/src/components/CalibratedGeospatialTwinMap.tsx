import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Compass, Layers, Eye, EyeOff, Navigation, ShieldCheck, 
  AlertTriangle, Radio, Activity, Zap, Maximize2, 
  Map as MapIcon, Globe, Waves, ArrowRight, ShieldAlert, Mountain,
  Car, Truck, Ship, Crosshair
} from 'lucide-react';
import { CalibratedComprehensiveTwinState, HeliLandingZone, CalibratedPolygonInundation } from '../data/calibratedTwinStates';
import { InfrastructureNode } from '../types/digital_twin';

interface CalibratedGeospatialTwinMapProps {
  comprehensiveState: CalibratedComprehensiveTwinState;
  sensitivityMultiplier: number;
  vehicleWadingFilter: 'all' | 'car' | 'truck' | 'boat';
  is3DTiltActive: boolean;
  onSelectNode: (node: InfrastructureNode) => void;
  highlightedNodeId?: string | null;
}

export const CalibratedGeospatialTwinMap: React.FC<CalibratedGeospatialTwinMapProps> = ({
  comprehensiveState,
  sensitivityMultiplier,
  vehicleWadingFilter,
  is3DTiltActive,
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

  const { state, inundationPolygons, heliLandingZones, vehicleWadingClearances } = comprehensiveState;

  // Initialize or re-center Map when comprehensiveState changes
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: state.center_coords,
        zoom: 11,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      mapInstanceRef.current = map;
      layersGroupRef.current = L.layerGroup().addTo(map);
    } else {
      mapInstanceRef.current.flyTo(state.center_coords, 11, {
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

  // Render Interactive Calibrated Layers
  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;
    const layers = layersGroupRef.current;
    layers.clearLayers();

    // 1. Render Vector Inundation Polygons (Pillar 1)
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

    // 2. Render Helicopter Landing Zones (LZ) (Pillar 4)
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

    // 3. Render Evacuation Routes with Animated Flow Lines (Pillar 1)
    if (showEvacuationRoutes && state.evacuation_routes) {
      state.evacuation_routes.forEach((route) => {
        // Invert [lng, lat] to [lat, lng] for Leaflet
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

    // 4. Render Roads with Vehicle Wading Clearance Filter (Pillar 4)
    if (state.roads) {
      state.roads.forEach((road) => {
        const latLngs = road.coordinates.map(coord => [coord[1], coord[0]] as [number, number]);
        const depth = road.flood_depth_m * (0.8 + 0.2 * sensitivityMultiplier);

        // Determine passability based on vehicle filter
        let isPassable = true;
        if (vehicleWadingFilter === 'car' && depth > vehicleWadingClearances.standardCarMaxDepthM) {
          isPassable = false;
        } else if (vehicleWadingFilter === 'truck' && depth > vehicleWadingClearances.ndrfTruckMaxDepthM) {
          isPassable = false;
        } else if (vehicleWadingFilter === 'boat' && depth < vehicleWadingClearances.inflatableBoatMinDepthM) {
          isPassable = false; // Boat cannot navigate dry roads
        } else if (depth > 0.5) {
          isPassable = false;
        }

        const roadColor = !isPassable
          ? '#ef4444' // Impassable red
          : depth > 0
          ? '#f59e0b' // Warning amber
          : '#3b82f6'; // Clear blue

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

    // 5. Render Hypsometric Depth Tinted Nodes & USAR X-Codes (Pillar 1 & 4)
    if (state.nodes) {
      state.nodes.forEach((node) => {
        const dynamicDepth = Number((node.flood_depth_m * (0.8 + 0.2 * sensitivityMultiplier)).toFixed(2));
        
        // Hypsometric tint
        let badgeColor = '#10b981'; // Safe green
        let categoryLabel = 'Safe Elevation';

        if (dynamicDepth > 1.5 || node.status === 'submerged') {
          badgeColor = '#ef4444'; // Red submerged >1.5m
          categoryLabel = '🔴 Submerged (>1.5m)';
        } else if (dynamicDepth >= 0.5) {
          badgeColor = '#f97316'; // Orange waist 0.5m - 1.5m
          categoryLabel = '🟠 Waist Depth (0.5m-1.5m)';
        } else if (dynamicDepth > 0) {
          badgeColor = '#eab308'; // Yellow ankle/knee <0.5m
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

        // USAR X-Code Block if present
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

  }, [comprehensiveState, sensitivityMultiplier, vehicleWadingFilter, showPolygons, showHeliLZ, showEvacuationRoutes, highlightedNodeId]);

  return (
    <div className="relative w-full h-[580px] lg:h-[650px] rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl bg-[#040812]">
      
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

        {/* Layer Toggles */}
        <div className="flex items-center bg-slate-950/90 border border-slate-800 rounded-xl p-1 shadow-lg backdrop-blur-md gap-1">
          <button
            onClick={() => setShowPolygons(!showPolygons)}
            className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
              showPolygons ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Waves className="w-3 h-3" />
            <span>Surge Polygons</span>
          </button>

          <button
            onClick={() => setShowHeliLZ(!showHeliLZ)}
            className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
              showHeliLZ ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span>🚁 Heli LZs</span>
          </button>

          <button
            onClick={() => setShowEvacuationRoutes(!showEvacuationRoutes)}
            className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
              showEvacuationRoutes ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Navigation className="w-3 h-3" />
            <span>Evac Flow</span>
          </button>
        </div>
      </div>

      {/* Bottom Map Legend */}
      <div className="absolute bottom-3 left-3 z-10 bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 shadow-xl backdrop-blur-md font-mono text-[10px] space-y-1 text-slate-300">
        <div className="text-[9px] text-slate-400 uppercase font-bold border-b border-slate-800 pb-1">
          Hypsometric Depth Legend:
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded bg-red-500" />
          <span>🔴 Submerged (&gt;1.5m - Boat/Helo only)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded bg-orange-500" />
          <span>🟠 Waist Depth (0.5m-1.5m)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded bg-yellow-500" />
          <span>🟡 Ankle/Knee (&lt;0.5m - High clearance)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
          <span>🟢 Safe High Ground Relief Zone</span>
        </div>
      </div>

      {/* Vehicle Wading Status Pill */}
      <div className="absolute top-3 right-3 z-10 bg-slate-950/90 border border-cyan-500/40 rounded-xl px-3 py-1.5 shadow-xl backdrop-blur-md font-mono text-xs flex items-center space-x-2 text-cyan-300">
        {vehicleWadingFilter === 'car' && <Car className="w-3.5 h-3.5 text-amber-400" />}
        {vehicleWadingFilter === 'truck' && <Truck className="w-3.5 h-3.5 text-emerald-400" />}
        {vehicleWadingFilter === 'boat' && <Ship className="w-3.5 h-3.5 text-cyan-400" />}
        {vehicleWadingFilter === 'all' && <Crosshair className="w-3.5 h-3.5 text-slate-400" />}
        <span className="uppercase text-[11px] font-bold">
          Filter: {vehicleWadingFilter.toUpperCase()} WADING
        </span>
      </div>

    </div>
  );
};
