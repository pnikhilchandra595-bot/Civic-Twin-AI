import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  CityDigitalTwinState, InfrastructureNode, SensorReading, EvacuationRoute 
} from '../types/digital_twin';
import { 
  Compass, Layers, Eye, EyeOff, Navigation, ShieldCheck, 
  AlertTriangle, Radio, Activity, Zap, Check, Maximize2, 
  Map as MapIcon, Globe, Waves, PhoneCall, ArrowRight, ShieldAlert, ChevronDown 
} from 'lucide-react';

interface DigitalTwinMapProps {
  state: CityDigitalTwinState | null;
  onSelectNode: (node: InfrastructureNode) => void;
  onSelectSensor: (sensor: SensorReading) => void;
  onSelectRoute: (route: EvacuationRoute) => void;
  onSwitchCity?: (cityId: string) => void;
  onResolveLocation?: (query?: string, lat?: number, lng?: number) => void;
}

export const DigitalTwinMap: React.FC<DigitalTwinMapProps> = ({
  state,
  onSelectNode,
  onSelectSensor,
  onSelectRoute,
  onSwitchCity,
  onResolveLocation
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  // Map settings & search
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [baseMap, setBaseMap] = useState<'dark' | 'satellite' | 'street'>('dark');
  const [viewScope, setViewScope] = useState<'city' | 'india'>('city');
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  const [clickCoordFeedback, setClickCoordFeedback] = useState<string | null>(null);
  
  // Layer visibility toggles
  const [showFloodHeatmap, setShowFloodHeatmap] = useState(true);
  const [showRoads, setShowRoads] = useState(true);
  const [showEvacuationRoutes, setShowEvacuationRoutes] = useState(true);
  const [showSensors, setShowSensors] = useState(true);
  const [showUnits, setShowUnits] = useState(true);

  // Pan-India disaster state summaries for all 20 major states & regions
  const indiaStates = [
    { 
      name: "Maharashtra (Mumbai)", 
      cityId: "mumbai_monsoon", 
      coords: [19.0760, 72.8777] as [number, number], 
      threat: "ELEVATED", 
      rainfall: "35 mm/h", 
      hazard: "Mithi River & Monsoon Tidal Surge", 
      ndrf: "NDRF 5th Bn (Pune/Mumbai)",
      color: "#f59e0b" 
    },
    { 
      name: "Delhi NCR (Yamuna)", 
      cityId: "delhi_yamuna", 
      coords: [28.6139, 77.2090] as [number, number], 
      threat: "CRITICAL", 
      rainfall: "42 mm/h", 
      hazard: "Hathnikund Barrage & Lowland Floodplain", 
      ndrf: "NDRF 8th Bn (Ghaziabad/NCR)",
      color: "#ef4444" 
    },
    { 
      name: "Karnataka (Bengaluru)", 
      cityId: "bengaluru_lakes", 
      coords: [12.9716, 77.5946] as [number, number], 
      threat: "CRITICAL", 
      rainfall: "48 mm/h", 
      hazard: "Bellandur-Varthur Lake Spill & IT Corridor", 
      ndrf: "NDRF 10th Bn (South Staging)",
      color: "#ef4444" 
    },
    { 
      name: "Tamil Nadu (Chennai)", 
      cityId: "chennai_cyclone", 
      coords: [13.0827, 80.2707] as [number, number], 
      threat: "MONITOR", 
      rainfall: "18 mm/h", 
      hazard: "Bay of Bengal Cyclone & Adyar River Sluice", 
      ndrf: "NDRF 4th Bn (Arakkonam)",
      color: "#10b981" 
    },
    { 
      name: "Assam (Guwahati / Brahmaputra)", 
      cityId: "assam_brahmaputra", 
      coords: [26.1445, 91.7362] as [number, number], 
      threat: "CRITICAL", 
      rainfall: "68 mm/h", 
      hazard: "Brahmaputra River Inundation & Flash Floods", 
      ndrf: "NDRF 1st Bn (Guwahati)",
      color: "#ef4444" 
    },
    { 
      name: "West Bengal (Kolkata / Hooghly)", 
      cityId: "kolkata_hooghly", 
      coords: [22.5726, 88.3639] as [number, number], 
      threat: "ELEVATED", 
      rainfall: "38 mm/h", 
      hazard: "Hooghly Tidal Bore & Coastal Storm Surge", 
      ndrf: "NDRF 2nd Bn (Kolkata)",
      color: "#f59e0b" 
    },
    { 
      name: "Odisha (Bhubaneswar / Mahanadi)", 
      cityId: "odisha_mahanadi", 
      coords: [20.2961, 85.8245] as [number, number], 
      threat: "MONITOR", 
      rainfall: "22 mm/h", 
      hazard: "Mahanadi Hirakud Release & Cyclone Surge", 
      ndrf: "NDRF 3rd Bn (Mundali/Cuttack)",
      color: "#10b981" 
    },
    { 
      name: "Kerala (Kochi / Periyar River)", 
      cityId: "kerala_periyar", 
      coords: [9.9312, 76.2673] as [number, number], 
      threat: "ELEVATED", 
      rainfall: "45 mm/h", 
      hazard: "Idukki Reservoir Sluice & Western Ghats Cloudburst", 
      ndrf: "NDRF 4th Bn Swift Water",
      color: "#f59e0b" 
    },
    { 
      name: "Gujarat (Surat / Tapi River)", 
      cityId: "gujarat_tapi", 
      coords: [21.1702, 72.8311] as [number, number], 
      threat: "MONITOR", 
      rainfall: "14 mm/h", 
      hazard: "Ukai Dam Discharge & Arabian Sea High Tide", 
      ndrf: "NDRF 6th Bn (Vadodara)",
      color: "#10b981" 
    },
    { 
      name: "Bihar (Patna / Kosi Basin)", 
      cityId: "bihar_kosi", 
      coords: [25.5941, 85.1376] as [number, number], 
      threat: "ELEVATED", 
      rainfall: "32 mm/h", 
      hazard: "Kosi Embankment Pressure & Ganga Catchment", 
      ndrf: "NDRF 9th Bn (Bihta/Patna)",
      color: "#f59e0b" 
    },
    { 
      name: "Uttar Pradesh (Varanasi / Ganga)", 
      cityId: "uttar_pradesh_ganga", 
      coords: [25.3176, 82.9739] as [number, number], 
      threat: "ELEVATED", 
      rainfall: "28 mm/h", 
      hazard: "Ganga Sangam Rising Water & Ghat Submergence", 
      ndrf: "NDRF 11th Bn (Varanasi)",
      color: "#f59e0b" 
    },
    { 
      name: "Uttarakhand (Rishikesh / Chamoli)", 
      cityId: "uttarakhand_cloudburst", 
      coords: [30.0869, 78.2676] as [number, number], 
      threat: "CRITICAL", 
      rainfall: "75 mm/h", 
      hazard: "Himalayan Cloudburst & Flash Surge", 
      ndrf: "NDRF 8th Bn Mountain Team",
      color: "#ef4444" 
    },
    { 
      name: "Himachal (Kullu / Beas River)", 
      cityId: "himachal_beas", 
      coords: [31.9579, 77.1095] as [number, number], 
      threat: "CRITICAL", 
      rainfall: "62 mm/h", 
      hazard: "Beas River Embankment Breach", 
      ndrf: "NDRF 7th Bn Hill Rescue",
      color: "#ef4444" 
    },
    { 
      name: "Punjab (Ludhiana / Sutlej)", 
      cityId: "punjab_sutlej", 
      coords: [30.9010, 75.8573] as [number, number], 
      threat: "MONITOR", 
      rainfall: "24 mm/h", 
      hazard: "Sutlej Floodplain & Agricultural Submergence", 
      ndrf: "NDRF 7th Bn (Bhatinda)",
      color: "#10b981" 
    },
    { 
      name: "Andhra Pradesh (Krishna / Vijayawada)", 
      cityId: "andhra_krishna", 
      coords: [16.5062, 80.6480] as [number, number], 
      threat: "ELEVATED", 
      rainfall: "34 mm/h", 
      hazard: "Prakasam Barrage Maximum Discharge", 
      ndrf: "NDRF 10th Bn (Guntur)",
      color: "#f59e0b" 
    },
    { 
      name: "Telangana (Hyderabad / Musi)", 
      cityId: "telangana_musi", 
      coords: [17.3850, 78.4867] as [number, number], 
      threat: "ELEVATED", 
      rainfall: "30 mm/h", 
      hazard: "Musi River & Hussain Sagar Overflow", 
      ndrf: "NDRF 10th Bn Staging",
      color: "#f59e0b" 
    },
    { 
      name: "Rajasthan (Jodhpur / Luni River)", 
      cityId: "rajasthan_luni", 
      coords: [26.2389, 73.0243] as [number, number], 
      threat: "MONITOR", 
      rainfall: "12 mm/h", 
      hazard: "Desert Flash Inundation", 
      ndrf: "NDRF 6th Bn Rapid Wing",
      color: "#10b981" 
    },
    { 
      name: "Madhya Pradesh (Narmada / Jabalpur)", 
      cityId: "madhya_pradesh_narmada", 
      coords: [23.1815, 79.9864] as [number, number], 
      threat: "MONITOR", 
      rainfall: "20 mm/h", 
      hazard: "Bargi Dam 21-Gate Sluice Release", 
      ndrf: "NDRF 11th Bn Staging",
      color: "#10b981" 
    },
    { 
      name: "Jammu & Kashmir (Srinagar / Jhelum)", 
      cityId: "jammu_jhelum", 
      coords: [34.0837, 74.7973] as [number, number], 
      threat: "ELEVATED", 
      rainfall: "36 mm/h", 
      hazard: "Jhelum River Danger Mark Inundation", 
      ndrf: "NDRF 7th Bn (Srinagar)",
      color: "#f59e0b" 
    },
    { 
      name: "Goa (Panaji / Mandovi)", 
      cityId: "goa_mandovi", 
      coords: [15.4909, 73.8278] as [number, number], 
      threat: "MONITOR", 
      rainfall: "16 mm/h", 
      hazard: "Mandovi Estuary Tidal Surge", 
      ndrf: "NDRF 5th Bn Marine Team",
      color: "#10b981" 
    },
    { 
      name: "Sikkim (Gangtok / Teesta Basin)", 
      cityId: "sikkim_teesta", 
      coords: [27.3389, 88.6065] as [number, number], 
      threat: "CRITICAL", 
      rainfall: "82 mm/h", 
      hazard: "South Lhonak Glacial Lake GLOF Surge", 
      ndrf: "NDRF 2nd Bn Mountain Wing",
      color: "#ef4444" 
    },
    { 
      name: "Tripura (Agartala / Howrah River)", 
      cityId: "tripura_howrah", 
      coords: [23.8315, 91.2868] as [number, number], 
      threat: "ELEVATED", 
      rainfall: "41 mm/h", 
      hazard: "Howrah River Flash Flood Inundation", 
      ndrf: "NDRF 1st Bn Staging",
      color: "#f59e0b" 
    },
    { 
      name: "Meghalaya (Cherrapunji / Shillong)", 
      cityId: "meghalaya_cherrapunji", 
      coords: [25.2702, 91.7323] as [number, number], 
      threat: "CRITICAL", 
      rainfall: "96 mm/h", 
      hazard: "Record Precipitation Khasi Cloudburst", 
      ndrf: "NDRF 1st Bn Hill Rescue",
      color: "#ef4444" 
    },
    { 
      name: "Manipur (Imphal / Loktak Lake)", 
      cityId: "manipur_imphal", 
      coords: [24.8170, 93.9368] as [number, number], 
      threat: "ELEVATED", 
      rainfall: "39 mm/h", 
      hazard: "Imphal River Embankment Overflow", 
      ndrf: "NDRF 1st Bn Rapid Team",
      color: "#f59e0b" 
    },
    { 
      name: "Jharkhand (Ranchi / Subarnarekha)", 
      cityId: "jharkhand_subarnarekha", 
      coords: [23.3441, 85.3096] as [number, number], 
      threat: "MONITOR", 
      rainfall: "26 mm/h", 
      hazard: "Getalsud Dam Maximum Sluice Release", 
      ndrf: "NDRF 9th Bn (Ranchi)",
      color: "#10b981" 
    },
    { 
      name: "Chhattisgarh (Raipur / Mahanadi)", 
      cityId: "chhattisgarh_mahanadi", 
      coords: [21.2514, 81.6296] as [number, number], 
      threat: "MONITOR", 
      rainfall: "21 mm/h", 
      hazard: "Hasdeo Bango Dam Surge & Upstream Inundation", 
      ndrf: "NDRF 3rd Bn Central Wing",
      color: "#10b981" 
    },
    { 
      name: "Haryana (Gurugram / Najafgarh)", 
      cityId: "haryana_gurugram", 
      coords: [28.4595, 77.0266] as [number, number], 
      threat: "CRITICAL", 
      rainfall: "58 mm/h", 
      hazard: "Hero Honda Chowk Underpass Submergence", 
      ndrf: "NDRF 8th Bn NCR Strike Team",
      color: "#ef4444" 
    },
    { 
      name: "Andaman & Nicobar (Port Blair)", 
      cityId: "andaman_portblair", 
      coords: [11.6234, 92.7265] as [number, number], 
      threat: "ELEVATED", 
      rainfall: "48 mm/h", 
      hazard: "Deep Bay of Bengal Cyclone & Coastal Inundation", 
      ndrf: "NDRF Island Marine Rescue Wing",
      color: "#f59e0b" 
    },
    { 
      name: "Ladakh (Leh / Indus Valley)", 
      cityId: "ladakh_indus", 
      coords: [34.1526, 77.5771] as [number, number], 
      threat: "ELEVATED", 
      rainfall: "18 mm/h", 
      hazard: "High-Altitude Glacial Stream Cloudburst", 
      ndrf: "NDRF High-Altitude Disaster Response Base",
      color: "#f59e0b" 
    },
    { 
      name: "Arunachal Pradesh (Itanagar / Siang)", 
      cityId: "arunachal_siang", 
      coords: [27.1000, 93.6200] as [number, number], 
      threat: "CRITICAL", 
      rainfall: "76 mm/h", 
      hazard: "Himalayan Flash Cloudburst & Siang Inundation", 
      ndrf: "NDRF 1st Bn Mountain Unit",
      color: "#ef4444" 
    },
    { 
      name: "Mizoram (Aizawl / Tlawng River)", 
      cityId: "mizoram_tlawng", 
      coords: [23.7307, 92.7173] as [number, number], 
      threat: "ELEVATED", 
      rainfall: "46 mm/h", 
      hazard: "Steep Hill Slope Mudslides & Highway Blockage", 
      ndrf: "NDRF 1st Bn Aizawl Base",
      color: "#f59e0b" 
    },
    { 
      name: "Nagaland (Kohima / Dimapur / Doyang)", 
      cityId: "nagaland_doyang", 
      coords: [25.6751, 94.1086] as [number, number], 
      threat: "ELEVATED", 
      rainfall: "44 mm/h", 
      hazard: "Doyang Hydro Dam Sluice Surge & Plain Flood", 
      ndrf: "NDRF 12th Bn Dimapur Base",
      color: "#f59e0b" 
    },
    { 
      name: "Chandigarh UT (Sukhna Lake)", 
      cityId: "chandigarh_sukhna", 
      coords: [30.7333, 76.7794] as [number, number], 
      threat: "MONITOR", 
      rainfall: "24 mm/h", 
      hazard: "Sukhna Lake Floodgate Sluice Opening", 
      ndrf: "NDRF 7th Bn NCR Quick Response",
      color: "#10b981" 
    },
    { 
      name: "Dadra & Nagar Haveli & Daman & Diu", 
      cityId: "daman_damanganga", 
      coords: [20.4283, 72.8597] as [number, number], 
      threat: "ELEVATED", 
      rainfall: "39 mm/h", 
      hazard: "Damanganga Madhuvan Dam Surge & High Tide", 
      ndrf: "NDRF 6th Bn Coastal Strike Team",
      color: "#f59e0b" 
    },
    { 
      name: "Lakshadweep UT (Kavaratti Atoll)", 
      cityId: "lakshadweep_kavaratti", 
      coords: [10.5667, 72.6417] as [number, number], 
      threat: "CRITICAL", 
      rainfall: "64 mm/h", 
      hazard: "Arabian Sea Cyclonic Storm Surge & Overwash", 
      ndrf: "NDRF Coast Guard Joint Marine Team",
      color: "#ef4444" 
    },
    { 
      name: "Puducherry UT (Coromandel Coast)", 
      cityId: "puducherry_coastal", 
      coords: [11.9416, 79.8083] as [number, number], 
      threat: "ELEVATED", 
      rainfall: "36 mm/h", 
      hazard: "Bay of Bengal Cyclone Surge & Sankaraparani", 
      ndrf: "NDRF 4th Bn Coastal Team",
      color: "#f59e0b" 
    }
  ];

  // Tile URL Map
  const tileUrls = {
    dark: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    street: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialCoords = state?.center_coords || [19.076, 72.877];
      const map = L.map(mapContainerRef.current, {
        center: initialCoords,
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const baseLayer = L.tileLayer(tileUrls[baseMap], {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      tileLayerRef.current = baseLayer;

      const layersGroup = L.layerGroup().addTo(map);
      layersGroupRef.current = layersGroup;

      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        setClickCoordFeedback(`📍 Resolving Micro-Catchment for [${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E]...`);
        setTimeout(() => setClickCoordFeedback(null), 4000);
        if (onResolveLocation) {
          onResolveLocation('', lat, lng);
        }
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update base tile layer on baseMap switch
  useEffect(() => {
    if (mapInstanceRef.current && tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
      const newLayer = L.tileLayer(tileUrls[baseMap], {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(mapInstanceRef.current);
      tileLayerRef.current = newLayer;
    }
  }, [baseMap]);

  // Center map on city switch or view scope change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (viewScope === 'india') {
      mapInstanceRef.current.flyTo([22.5937, 78.9629], 5, { duration: 1.5 });
    } else if (state && state.center_coords) {
      mapInstanceRef.current.flyTo(state.center_coords, 13, { duration: 1.2 });
    }
  }, [state?.city_id, viewScope]);

  // Re-render Digital Twin overlays whenever state or layer toggles change
  useEffect(() => {
    if (!mapInstanceRef.current || !layersGroupRef.current) return;

    const map = mapInstanceRef.current;
    const layerGroup = layersGroupRef.current;
    layerGroup.clearLayers();

    // 1. If in Pan-India Overview Mode: Render Indian state badges across all 10 regions
    if (viewScope === 'india') {
      indiaStates.forEach(st => {
        const iconHtml = `
          <div class="flex flex-col items-center cursor-pointer group transform hover:scale-110 transition-all">
            <div class="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-950/95 border backdrop-blur-md shadow-2xl" style="border-color: ${st.color}">
              <span class="w-2.5 h-2.5 rounded-full animate-ping" style="background-color: ${st.color}"></span>
              <span class="text-xs font-extrabold text-white whitespace-nowrap">${st.name.split('(')[0]}</span>
              <span class="text-[9px] font-mono px-1.5 py-0.2 rounded font-bold" style="background-color: ${st.color}30; color: ${st.color}">
                ${st.threat}
              </span>
            </div>
            <div class="text-[9px] font-mono text-cyan-300 bg-slate-900/90 px-1.5 py-0.2 rounded-b border-b border-x border-slate-700 shadow-md">
              🌧️ ${st.rainfall} • Click to Launch
            </div>
          </div>
        `;

        const stateMarker = L.marker(st.coords, {
          icon: L.divIcon({
            className: 'custom-div-icon',
            html: iconHtml,
            iconSize: [160, 40],
            iconAnchor: [80, 20]
          })
        }).addTo(layerGroup);

        stateMarker.on('click', () => {
          setViewScope('city');
          if (onSwitchCity) {
            onSwitchCity(st.cityId);
          }
          map.flyTo(st.coords, 13, { duration: 1.2 });
        });
      });

      return;
    }

    if (!state) return;

    // 2. Render Inundation Heatmaps / Flood Polygons (soft transparent circles)
    if (showFloodHeatmap) {
      state.nodes.forEach(node => {
        if (node.flood_depth_m > 0.05) {
          const radiusMeters = Math.min(700, 200 + node.flood_depth_m * 350);
          const opacity = Math.min(0.55, 0.20 + (node.flood_depth_m / 1.5) * 0.35);

          const floodCircle = L.circle([node.lat, node.lng], {
            radius: radiusMeters,
            color: '#00d2ff',
            weight: 1.2,
            fillColor: node.flood_depth_m >= 0.35 ? '#ef4444' : '#0284c7',
            fillOpacity: opacity
          }).addTo(layerGroup);

          floodCircle.bindTooltip(`🌊 Inundation: ${node.name} (${node.flood_depth_m.toFixed(2)}m water depth)`);
        }
      });
    }

    // 3. Render Roads & Arterial Corridors
    if (showRoads) {
      state.roads.forEach(road => {
        const isImpassable = road.status === 'impassable' || road.status === 'closed_emergency';
        const isEvac = road.is_evacuation_corridor && !isImpassable;

        const latLngs: [number, number][] = road.coordinates.map(pt => [pt[1], pt[0]]);

        const roadColor = isImpassable 
          ? '#ef4444' 
          : isEvac 
            ? '#10b981' 
            : road.status === 'congested' 
              ? '#f59e0b' 
              : '#38bdf8';

        const polyline = L.polyline(latLngs, {
          color: roadColor,
          weight: isEvac ? 5 : isImpassable ? 3.5 : 2.5,
          opacity: 0.85,
          dashArray: isImpassable ? '6, 8' : undefined
        }).addTo(layerGroup);

        polyline.bindTooltip(`
          <div class="text-xs font-mono">
            <strong>${road.name}</strong><br/>
            Status: <span style="color: ${roadColor}">${road.status.toUpperCase()}</span><br/>
            Speed: ${road.current_speed_kmh.toFixed(0)} km/h | Flood: ${road.flood_depth_m.toFixed(2)}m
          </div>
        `);
      });
    }

    // 4. Render Evacuation Routes (Active green corridors)
    if (showEvacuationRoutes) {
      state.evacuation_routes.forEach(route => {
        if (route.coordinates && route.coordinates.length >= 2) {
          const waypointsLatLng: [number, number][] = route.coordinates.map(wp => [wp[1], wp[0]]);
          
          const evacLine = L.polyline(waypointsLatLng, {
            color: '#10b981',
            weight: 5.5,
            opacity: 0.85
          }).addTo(layerGroup);

          evacLine.on('click', () => onSelectRoute(route));
          evacLine.bindTooltip(`
            <div class="text-xs font-mono">
              <strong>✅ SAFE EVACUATION CORRIDOR</strong><br/>
              ${route.source_name} ➔ ${route.target_shelter_name}<br/>
              Safety Score: ${(route.safety_score * 100).toFixed(0)}% | Time: ${route.estimated_time_min.toFixed(0)} min
            </div>
          `);
        }
      });
    }

    // 5. Render Critical Infrastructure Nodes (COMPACT CLEAN ROUND PINS - NO CLUTTER!)
    state.nodes.forEach(node => {
      const isCritical = node.status === 'critical' || node.status === 'offline' || node.flood_depth_m >= 0.3;
      const isWarning = node.status === 'warning' || (node.flood_depth_m > 0.05 && node.flood_depth_m < 0.3);

      let iconEmoji = '🏥';
      let iconColor = '#00d2ff';

      if (node.node_type === 'hospital') {
        iconEmoji = '🏥';
        iconColor = '#ef4444';
      } else if (node.node_type === 'shelter') {
        iconEmoji = '🏫';
        iconColor = '#10b981';
      } else if (node.node_type === 'substation') {
        iconEmoji = '⚡';
        iconColor = '#f59e0b';
      } else if (node.node_type === 'water_treatment') {
        iconEmoji = '🌊';
        iconColor = '#0284c7';
      } else if (node.node_type === 'bridge') {
        iconEmoji = '🌉';
        iconColor = '#38bdf8';
      } else if (node.node_type === 'dam_levee') {
        iconEmoji = '🛡️';
        iconColor = '#8b5cf6';
      } else if (node.node_type === 'fire_station') {
        iconEmoji = '🚒';
        iconColor = '#f97316';
      } else if (node.node_type === 'residential_district') {
        iconEmoji = '🏘️';
        iconColor = '#64748b';
      }

      const statusRing = isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981';

      // Compact circular pin with floating status pip (32x32px)
      const compactNodeHtml = `
        <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#090e1a] border-2 shadow-xl cursor-pointer group transform hover:scale-125 transition-all" style="border-color: ${isCritical ? '#ef4444' : iconColor}">
          <span class="text-sm">${iconEmoji}</span>
          <span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${isCritical ? 'animate-ping' : ''}" style="background-color: ${statusRing}"></span>
          ${node.flood_depth_m > 0.05 ? `
            <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-mono px-1 py-0.2 rounded bg-red-950 text-red-300 border border-red-700 font-bold whitespace-nowrap">
              ${node.flood_depth_m.toFixed(1)}m
            </div>
          ` : ''}
        </div>
      `;

      const marker = L.marker([node.lat, node.lng], {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: compactNodeHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        })
      }).addTo(layerGroup);

      marker.bindTooltip(`
        <div class="text-xs font-mono p-1">
          <strong class="text-white">${node.name}</strong><br/>
          Type: <span class="capitalize text-cyan-300">${node.node_type.replace('_', ' ')}</span><br/>
          Status: <span style="color: ${statusRing}">${node.status.toUpperCase()}</span><br/>
          Flood Depth: <span class="text-amber-300">${node.flood_depth_m.toFixed(2)}m</span>
        </div>
      `);

      marker.on('click', () => onSelectNode(node));
    });

    // 6. Render IoT Sensor Pins (Compact 26px dots)
    if (showSensors) {
      state.sensors.forEach(sensor => {
        const isWarn = sensor.status === 'warning';
        const isCrit = sensor.status === 'critical';
        const ringColor = isCrit ? '#ef4444' : isWarn ? '#f59e0b' : '#00d2ff';

        const sensorHtml = `
          <div class="relative flex items-center justify-center w-6 h-6 rounded-full bg-[#090e1a] border-2 shadow-lg cursor-pointer transform hover:scale-125 transition-all" style="border-color: ${ringColor}">
            <span class="text-[10px]">📡</span>
            ${isCrit ? `<div class="absolute inset-0 rounded-full animate-ping opacity-60" style="background-color: ${ringColor}"></div>` : ''}
          </div>
        `;

        const sMarker = L.marker([sensor.lat, sensor.lng], {
          icon: L.divIcon({
            className: 'custom-div-icon',
            html: sensorHtml,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          })
        }).addTo(layerGroup);

        sMarker.bindTooltip(`
          <div class="text-xs font-mono">
            <strong>${sensor.name}</strong><br/>
            Reading: <span class="text-cyan-300 font-bold">${sensor.current_value.toFixed(1)} ${sensor.unit}</span> (${sensor.trend})
          </div>
        `);

        sMarker.on('click', () => onSelectSensor(sensor));
      });
    }

    // 7. Render Moving Units & Tactical NDRF Assets (Distinct Tactical Badges)
    if (showUnits) {
      state.dispatch_units.forEach(unit => {
        let unitEmoji = '🚑';
        let badgeBg = 'bg-rose-950/95 border-rose-500 text-rose-200';

        if (unit.unit_type === 'swift_water_rescue') {
          unitEmoji = '🚤';
          badgeBg = 'bg-cyan-950/95 border-cyan-400 text-cyan-200';
        } else if (unit.unit_type === 'fire_rescue') {
          unitEmoji = '🚒';
          badgeBg = 'bg-orange-950/95 border-orange-500 text-orange-200';
        } else if (unit.unit_type === 'police_traffic') {
          unitEmoji = '🚔';
          badgeBg = 'bg-blue-950/95 border-blue-500 text-blue-200';
        } else if (unit.unit_type === 'public_works_pump') {
          unitEmoji = '🚛';
          badgeBg = 'bg-amber-950/95 border-amber-500 text-amber-200';
        }

        const unitHtml = `
          <div class="flex items-center space-x-1 px-2.5 py-0.8 rounded-full ${badgeBg} border text-[10px] font-mono font-bold shadow-2xl cursor-pointer transform hover:scale-120 transition-all">
            <span>${unitEmoji}</span>
            <span class="truncate max-w-[85px]">${unit.callsign.split('(')[0].trim()}</span>
          </div>
        `;

        const uMarker = L.marker([unit.lat, unit.lng], {
          icon: L.divIcon({
            className: 'custom-div-icon',
            html: unitHtml,
            iconSize: [110, 26],
            iconAnchor: [55, 13]
          })
        }).addTo(layerGroup);

        uMarker.bindTooltip(`
          <div class="text-xs font-mono p-1">
            <strong>${unitEmoji} ${unit.callsign}</strong><br/>
            Agency: <span class="text-cyan-300">${unit.agency}</span><br/>
            Status: <span class="text-emerald-400 uppercase">${unit.status}</span><br/>
            Mission: <span class="text-slate-300">${unit.assigned_mission}</span>
          </div>
        `);
      });
    }

  }, [state, baseMap, viewScope, showFloodHeatmap, showRoads, showEvacuationRoutes, showSensors, showUnits]);

  return (
    <div className="relative w-full h-[540px] lg:h-[620px] bg-[#060a12] rounded-2xl border border-[#1f2c44] overflow-hidden select-none shadow-2xl">
      {/* Leaflet Map Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top-Left Geographic Toolbar */}
      <div className="absolute top-3 left-3 z-10 flex flex-col space-y-1.5">
        {/* Pan-India vs City Twin Scope Switcher */}
        <div className="hud-panel p-1 rounded-xl flex items-center space-x-1 text-xs font-mono border border-cyan-500/30 shadow-xl bg-slate-950/90">
          <button
            onClick={() => setViewScope('city')}
            className={`px-2.5 py-1 rounded-lg flex items-center space-x-1 transition-all ${
              viewScope === 'city'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>City Twin</span>
          </button>

          <button
            onClick={() => setViewScope('india')}
            className={`px-2.5 py-1 rounded-lg flex items-center space-x-1 transition-all ${
              viewScope === 'india'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-orange-400" />
            <span>🇮🇳 All-India Grid</span>
          </button>
        </div>

        {/* Base Map Style Selector */}
        <div className="hud-panel p-1 rounded-xl flex items-center space-x-1 text-[11px] font-mono border border-slate-800 bg-slate-950/90">
          {(['dark', 'satellite', 'street'] as const).map(style => (
            <button
              key={style}
              onClick={() => setBaseMap(style)}
              className={`px-2 py-0.5 rounded-lg capitalize transition-all ${
                baseMap === style
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {style === 'dark' ? '🌃 Dark' : style === 'satellite' ? '🛰️ Sat' : '🗺️ Street'}
            </button>
          ))}
        </div>

        {/* Omnibox Search Any Place in India (780+ Districts & Infinite GPS Points) */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (!searchQuery.trim()) return;
            setClickCoordFeedback(`🔍 Resolving "${searchQuery}" across Pan-India Digital Twin...`);
            setTimeout(() => setClickCoordFeedback(null), 4000);
            const parts = searchQuery.split(',').map(s => parseFloat(s.trim()));
            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
              if (onResolveLocation) onResolveLocation('', parts[0], parts[1]);
            } else {
              if (onResolveLocation) onResolveLocation(searchQuery);
            }
          }}
          className="hud-panel p-1 rounded-xl border border-cyan-500/40 bg-slate-950/95 flex items-center space-x-1.5 shadow-2xl max-w-xs"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search any town, district or lat, lng..."
            className="bg-transparent border-none text-[11px] font-mono text-white placeholder-slate-500 focus:outline-none flex-1 px-2 py-0.5"
          />
          <button
            type="submit"
            className="px-2 py-0.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-mono font-bold cursor-pointer"
          >
            Locate
          </button>
        </form>

        {/* Live Coordinate Resolution Status Feedback */}
        {clickCoordFeedback ? (
          <div className="px-2.5 py-1 rounded-lg bg-cyan-950/95 border border-cyan-400 text-cyan-300 text-[10px] font-mono font-bold shadow-2xl animate-pulse">
            {clickCoordFeedback}
          </div>
        ) : (
          <div className="text-[9px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 pointer-events-none">
            💡 Click anywhere on map to inspect micro-catchment
          </div>
        )}
      </div>

      {/* Top-Right Collapsible GIS Layer Controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col items-end space-y-1.5">
        <button
          onClick={() => setIsLayersOpen(!isLayersOpen)}
          className="hud-panel px-3 py-1.5 rounded-xl flex items-center space-x-1.5 text-xs font-mono border border-slate-700 bg-slate-950/90 text-cyan-300 shadow-xl hover:border-cyan-500 transition-all"
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>GIS Layers</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${isLayersOpen ? 'rotate-180' : ''}`} />
        </button>

        {isLayersOpen && (
          <div className="hud-panel p-2.5 rounded-xl flex flex-col space-y-1 text-[11px] font-mono border border-slate-800 bg-slate-950/95 shadow-2xl min-w-[190px]">
            <button
              onClick={() => setShowFloodHeatmap(!showFloodHeatmap)}
              className={`w-full flex items-center justify-between p-1.5 rounded-lg border transition-all ${
                showFloodHeatmap ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300' : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}
            >
              <span>🌊 Inundation</span>
              {showFloodHeatmap ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </button>

            <button
              onClick={() => setShowRoads(!showRoads)}
              className={`w-full flex items-center justify-between p-1.5 rounded-lg border transition-all ${
                showRoads ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300' : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}
            >
              <span>🛣️ Road Status</span>
              {showRoads ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </button>

            <button
              onClick={() => setShowEvacuationRoutes(!showEvacuationRoutes)}
              className={`w-full flex items-center justify-between p-1.5 rounded-lg border transition-all ${
                showEvacuationRoutes ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}
            >
              <span>✅ Safe Corridors</span>
              {showEvacuationRoutes ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </button>

            <button
              onClick={() => setShowSensors(!showSensors)}
              className={`w-full flex items-center justify-between p-1.5 rounded-lg border transition-all ${
                showSensors ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300' : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}
            >
              <span>📡 IoT Sensors</span>
              {showSensors ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </button>

            <button
              onClick={() => setShowUnits(!showUnits)}
              className={`w-full flex items-center justify-between p-1.5 rounded-lg border transition-all ${
                showUnits ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300' : 'bg-slate-900/40 border-slate-800 text-slate-500'
              }`}
            >
              <span>🚤 NDRF Units</span>
              {showUnits ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </button>
          </div>
        )}
      </div>

      {/* Floating Bottom Left Live Region Indicator */}
      <div className="absolute bottom-3 left-3 z-10 hud-panel px-3 py-1.5 rounded-xl flex items-center space-x-2 text-[11px] font-mono border border-cyan-500/30 bg-slate-950/90 shadow-xl">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-white font-bold truncate max-w-[200px]">{state?.city_name.split(':')[0] || 'Twin'}</span>
        <span className="text-slate-600">|</span>
        <span className="text-cyan-300">🌧️ {state?.rain_intensity_mmhr.toFixed(0) || 0} mm/h</span>
      </div>
    </div>
  );
};
