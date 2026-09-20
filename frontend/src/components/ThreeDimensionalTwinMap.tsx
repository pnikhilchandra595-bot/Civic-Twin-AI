import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { 
  Compass, Eye, RotateCw, ZoomIn, ZoomOut, Waves, Send, Anchor, 
  ShieldAlert, Activity, Play, Pause, RefreshCw, Layers, Award,
  Sliders, ArrowUpRight, Zap, Building2, Flame, Maximize2, X,
  Radio, Video, Navigation, AlertTriangle, CheckCircle2, ChevronRight
} from 'lucide-react';
import { CityDigitalTwinState, InfrastructureNode } from '../types/digital_twin';

interface ThreeDimensionalTwinMapProps {
  state: CityDigitalTwinState | null;
  onSelectNode?: (node: InfrastructureNode) => void;
  onSwitchTo2D?: () => void;
  onOpenCommandSuite?: () => void;
  onOpenAccuracyAudit?: () => void;
  onOpenCrownJewels?: () => void;
}

interface Building3DInfo {
  id: string;
  name: string;
  type: 'hospital' | 'substation' | 'subway' | 'slum' | 'commercial';
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  elevation: number;
  baseColor: number;
  roofColor: number;
  status: string;
  threatDescription: string;
}

const CITY_BUILDINGS_CONFIG: Building3DInfo[] = [
  {
    id: 'hosp-sion',
    name: 'Lokmanya Tilak Municipal General Hospital (Sion)',
    type: 'hospital',
    x: -120,
    z: -60,
    width: 70,
    depth: 60,
    height: 75,
    elevation: 4.5,
    baseColor: 0x1e293b,
    roofColor: 0xe11d48,
    status: 'CRITICAL_SURGE',
    threatDescription: 'Ground floor emergency casualty ward submerged. 4.2h diesel reserves on basement generators.'
  },
  {
    id: 'sub-dharavi',
    name: 'Dharavi 220kV Main Transmission Substation',
    type: 'substation',
    x: 60,
    z: -140,
    width: 65,
    depth: 55,
    height: 35,
    elevation: 3.2,
    baseColor: 0x334155,
    roofColor: 0xf59e0b,
    status: 'BREAKER_TRIP_RISK',
    threatDescription: 'Water depth at busbar 0.38m (threshold 0.35m). SCADA breaker trip initiated.'
  },
  {
    id: 'subway-milan',
    name: 'Milan Subway Underpass Trench',
    type: 'subway',
    x: -80,
    z: 110,
    width: 90,
    depth: 35,
    height: 12,
    elevation: -4.5,
    baseColor: 0x0f172a,
    roofColor: 0x0284c7,
    status: 'CHOKED_SUBMERGED',
    threatDescription: 'Sunken topography depth 1.82m. 3x 500 m³/hr dewatering pumps operating.'
  },
  {
    id: 'bkc-tower',
    name: 'Bandra-Kurla Complex (BKC) Financial Center',
    type: 'commercial',
    x: 130,
    z: 50,
    width: 80,
    depth: 70,
    height: 110,
    elevation: 6.8,
    baseColor: 0x1e3a8a,
    roofColor: 0x06b6d4,
    status: 'OPERATIONAL_ISLAND',
    threatDescription: 'High-ground commercial zone functioning as emergency staging and NDRF dry heliport.'
  },
  {
    id: 'hosp-lilavati',
    name: 'Lilavati Hospital & Research Centre (Bandra)',
    type: 'hospital',
    x: 140,
    z: 150,
    width: 65,
    depth: 55,
    height: 85,
    elevation: 8.5,
    baseColor: 0x0f172a,
    roofColor: 0x10b981,
    status: 'SURGE_RECEIVING',
    threatDescription: 'Designated high-ground diversion trauma center receiving critical Sion ICU transfers.'
  },
  {
    id: 'slum-kranti',
    name: 'Kranti Nagar Slum Settlement (Mithi Riverbank)',
    type: 'slum',
    x: -160,
    z: 40,
    width: 100,
    depth: 45,
    height: 16,
    elevation: 2.1,
    baseColor: 0x451a03,
    roofColor: 0xb45309,
    status: 'MANDATORY_EVACUATION',
    threatDescription: 'Riverbank overtopping. 4,200 residents prioritized for amphibious boat extraction.'
  }
];

// Subterranean Drainage Conduit & Manhole Layout
interface Manhole3D {
  id: string;
  name: string;
  x: number;
  z: number;
  invertY: number;
  status: 'OPTIMAL' | 'SURCHARGING' | 'GEYSER_ERUPTING';
  depthM: number;
  fillPct: number;
}

const MANHOLES_CONFIG: Manhole3D[] = [
  { id: 'MH-01', name: 'Sion Sump', x: -110, z: -50, invertY: -14, status: 'SURCHARGING', depthM: 3.8, fillPct: 88 },
  { id: 'MH-02', name: 'Kurla Collector', x: -60, z: -20, invertY: -16, status: 'SURCHARGING', depthM: 4.2, fillPct: 92 },
  { id: 'MH-03', name: 'Dharavi Culvert', x: 40, z: -120, invertY: -15, status: 'OPTIMAL', depthM: 3.5, fillPct: 76 },
  { id: 'MH-04', name: 'Milan Subway Trench', x: -75, z: 95, invertY: -22, status: 'GEYSER_ERUPTING', depthM: 5.0, fillPct: 140 },
  { id: 'MH-05', name: 'BKC Stormway', x: 100, z: 40, invertY: -15, status: 'OPTIMAL', depthM: 4.0, fillPct: 54 },
  { id: 'MH-06', name: 'Bandra East Feeder', x: 120, z: 130, invertY: -16, status: 'OPTIMAL', depthM: 4.5, fillPct: 45 },
  { id: 'MH-07', name: 'Kranti Siphon', x: -140, z: 30, invertY: -15, status: 'GEYSER_ERUPTING', depthM: 3.2, fillPct: 135 },
  { id: 'MH-08', name: 'Mahim Flap Gate', x: -180, z: -130, invertY: -14, status: 'SURCHARGING', depthM: 3.0, fillPct: 110 }
];

const PIPES_CONNECTIONS = [
  { from: 'MH-01', to: 'MH-02', name: 'Sion-Kurla Trunk', color: 0x06b6d4 },
  { from: 'MH-01', to: 'MH-04', name: 'Sion-Milan Siphon', color: 0xef4444 },
  { from: 'MH-02', to: 'MH-03', name: 'Kurla-Dharavi Box', color: 0x3b82f6 },
  { from: 'MH-02', to: 'MH-05', name: 'Kurla-BKC Canal', color: 0x10b981 },
  { from: 'MH-03', to: 'MH-08', name: 'Dharavi-Mahim Creek', color: 0xf59e0b },
  { from: 'MH-04', to: 'MH-07', name: 'Milan-Kranti Relief', color: 0xef4444 },
  { from: 'MH-05', to: 'MH-06', name: 'BKC-Bandra Main', color: 0x06b6d4 },
  { from: 'MH-07', to: 'MH-08', name: 'Kranti-Mahim Outfall', color: 0xef4444 }
];

export const ThreeDimensionalTwinMap: React.FC<ThreeDimensionalTwinMapProps> = ({
  state,
  onSelectNode,
  onSwitchTo2D,
  onOpenCommandSuite,
  onOpenAccuracyAudit,
  onOpenCrownJewels
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Simulation controls state
  const [waterDepthMeters, setWaterDepthMeters] = useState<number>(1.85);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [selectedBuilding, setSelectedBuilding] = useState<Building3DInfo>(CITY_BUILDINGS_CONFIG[0]);
  const [cameraPreset, setCameraPreset] = useState<'iso' | 'canyon' | 'top'>('iso');

  // New Features State
  const [isSubterraneanXRay, setIsSubterraneanXRay] = useState<boolean>(false);
  const [showCVWaterwayModal, setShowCVWaterwayModal] = useState<boolean>(false);
  const [selectedManhole, setSelectedManhole] = useState<Manhole3D | null>(null);

  // Camera Orbit State
  const cameraStateRef = useRef({
    radius: 460,
    theta: Math.PI / 4,
    phi: Math.PI / 3.2,
    target: new THREE.Vector3(0, 10, 0),
    isDragging: false,
    isRightDragging: false,
    prevMouseX: 0,
    prevMouseY: 0
  });

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const groundMeshRef = useRef<THREE.Mesh | null>(null);
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const droneGroupRef = useRef<THREE.Group | null>(null);
  const droneSpotLightRef = useRef<THREE.SpotLight | null>(null);
  const boatGroupRef = useRef<THREE.Group | null>(null);
  const nfzMeshRef = useRef<THREE.Mesh | null>(null);
  const buildingMeshesRef = useRef<THREE.Mesh[]>([]);
  const undergroundGroupRef = useRef<THREE.Group | null>(null);
  const geyserMeshesRef = useRef<THREE.Mesh[]>([]);
  const animFrameIdRef = useRef<number>(0);

  // Initialize Three.js Real 3D Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // 1. SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050b14);
    scene.fog = new THREE.FogExp2(0x050b14, 0.0018);
    sceneRef.current = scene;

    // 2. CAMERA
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
    cameraRef.current = camera;

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. LIGHTING
    const ambientLight = new THREE.AmbientLight(0x0a192f, 2.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 3.5);
    sunLight.position.set(180, 240, 160);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    const shadowDist = 280;
    sunLight.shadow.camera.left = -shadowDist;
    sunLight.shadow.camera.right = shadowDist;
    sunLight.shadow.camera.top = shadowDist;
    sunLight.shadow.camera.bottom = -shadowDist;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const bounceLight = new THREE.DirectionalLight(0x0284c7, 0.5);
    bounceLight.position.set(-200, 50, -200);
    scene.add(bounceLight);

    // 5. GROUND & TERRAIN TOPOGRAPHY
    const groundGeo = new THREE.PlaneGeometry(650, 650, 64, 64);
    groundGeo.rotateX(-Math.PI / 2);
    
    const posAttr = groundGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      
      const riverCenter = Math.sin(z * 0.015) * 45 - 20;
      const distToRiver = Math.abs(x - riverCenter);
      let elev = 0;
      if (distToRiver < 32) {
        elev = -18 * (1 - distToRiver / 32);
      }

      const distToMilan = Math.hypot(x - (-80), z - 110);
      if (distToMilan < 40) {
        elev = Math.min(elev, -12 * (1 - distToMilan / 40));
      }

      posAttr.setY(i, elev);
    }
    groundGeo.computeVertexNormals();

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x091424,
      roughness: 0.85,
      metalness: 0.15,
      flatShading: true,
      transparent: true,
      opacity: 1.0
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);
    groundMeshRef.current = groundMesh;

    const grid = new THREE.GridHelper(650, 32, 0x0ea5e9, 0x1e293b);
    grid.position.y = 0.2;
    scene.add(grid);

    // 6. BUILDINGS GENERATION
    const buildingMeshes: THREE.Mesh[] = [];
    CITY_BUILDINGS_CONFIG.forEach((b) => {
      const bGeo = new THREE.BoxGeometry(b.width, b.height, b.depth);
      bGeo.translate(0, b.height / 2, 0);

      const bMat = new THREE.MeshStandardMaterial({
        color: b.baseColor,
        roughness: 0.4,
        metalness: 0.35,
        wireframe: false
      });

      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.set(b.x, b.elevation, b.z);
      bMesh.castShadow = true;
      bMesh.receiveShadow = true;
      bMesh.userData = { info: b };

      const roofGeo = new THREE.BoxGeometry(b.width + 1.5, 2.5, b.depth + 1.5);
      roofGeo.translate(0, b.height + 1.25, 0);
      const roofMat = new THREE.MeshStandardMaterial({
        color: b.roofColor,
        roughness: 0.3,
        metalness: 0.5,
        emissive: b.roofColor,
        emissiveIntensity: 0.25
      });
      const roofMesh = new THREE.Mesh(roofGeo, roofMat);
      roofMesh.position.set(b.x, b.elevation, b.z);
      roofMesh.castShadow = true;
      scene.add(roofMesh);

      scene.add(bMesh);
      buildingMeshes.push(bMesh);
    });
    buildingMeshesRef.current = buildingMeshes;

    // 7. SUBTERRANEAN DRAINAGE CONDUITS & MANHOLES (X-RAY LAYER)
    const undergroundGroup = new THREE.Group();
    undergroundGroup.visible = false;

    // Manhole Chambers (Vertical translucent cylinders)
    const mhMap: { [id: string]: Manhole3D } = {};
    MANHOLES_CONFIG.forEach((mh) => {
      mhMap[mh.id] = mh;
      const mhGeo = new THREE.CylinderGeometry(5, 5, Math.abs(mh.invertY) + 2, 16);
      mhGeo.translate(0, (mh.invertY) / 2, 0);
      const mhMat = new THREE.MeshStandardMaterial({
        color: mh.status === 'GEYSER_ERUPTING' ? 0xef4444 : mh.status === 'SURCHARGING' ? 0xf59e0b : 0x06b6d4,
        emissive: mh.status === 'GEYSER_ERUPTING' ? 0xef4444 : 0x0284c7,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.75,
        wireframe: true
      });
      const mhMesh = new THREE.Mesh(mhGeo, mhMat);
      mhMesh.position.set(mh.x, 0, mh.z);
      mhMesh.userData = { manhole: mh };
      undergroundGroup.add(mhMesh);

      // Manhole Cover Disc
      const coverGeo = new THREE.CylinderGeometry(5.5, 5.5, 1, 16);
      const coverMat = new THREE.MeshStandardMaterial({
        color: mh.status === 'GEYSER_ERUPTING' ? 0xff0000 : 0x38bdf8,
        emissive: mh.status === 'GEYSER_ERUPTING' ? 0xff0000 : 0x0ea5e9,
        emissiveIntensity: 0.5
      });
      const coverMesh = new THREE.Mesh(coverGeo, coverMat);
      coverMesh.position.set(mh.x, 0.5, mh.z);
      undergroundGroup.add(coverMesh);
    });

    // Subterranean Connecting Conduits (Pipes)
    PIPES_CONNECTIONS.forEach((conn) => {
      const fMh = mhMap[conn.from];
      const tMh = mhMap[conn.to];
      if (!fMh || !tMh) return;

      const p1 = new THREE.Vector3(fMh.x, fMh.invertY, fMh.z);
      const p2 = new THREE.Vector3(tMh.x, tMh.invertY, tMh.z);
      const distance = p1.distanceTo(p2);
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

      const pipeGeo = new THREE.CylinderGeometry(3.2, 3.2, distance, 16);
      pipeGeo.rotateX(Math.PI / 2);
      const pipeMat = new THREE.MeshStandardMaterial({
        color: conn.color,
        emissive: conn.color,
        emissiveIntensity: 0.45,
        transparent: true,
        opacity: 0.85,
        roughness: 0.2
      });
      const pipeMesh = new THREE.Mesh(pipeGeo, pipeMat);
      pipeMesh.position.copy(mid);
      pipeMesh.lookAt(p2);
      undergroundGroup.add(pipeMesh);
    });

    // Surcharging Geyser Cones on Milan Subway & Kranti Nagar
    const geyserCones: THREE.Mesh[] = [];
    [mhMap['MH-04'], mhMap['MH-07']].forEach((mh) => {
      if (!mh) return;
      const coneGeo = new THREE.ConeGeometry(8, 28, 16, 2, true);
      coneGeo.translate(0, 14, 0);
      const coneMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.65,
        wireframe: true,
        side: THREE.DoubleSide
      });
      const coneMesh = new THREE.Mesh(coneGeo, coneMat);
      coneMesh.position.set(mh.x, 0, mh.z);
      undergroundGroup.add(coneMesh);
      geyserCones.push(coneMesh);
    });
    geyserMeshesRef.current = geyserCones;

    scene.add(undergroundGroup);
    undergroundGroupRef.current = undergroundGroup;

    // 8. DYNAMIC PHYSICAL 3D WATER MESH
    const waterGeo = new THREE.PlaneGeometry(620, 620, 96, 96);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.72,
      roughness: 0.12,
      metalness: 0.65,
      flatShading: true,
      side: THREE.DoubleSide
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.y = -10;
    waterMesh.receiveShadow = true;
    scene.add(waterMesh);
    waterMeshRef.current = waterMesh;

    // 9. 3D NO-FLY ZONE (NFZ) CYLINDER
    const nfzGeo = new THREE.CylinderGeometry(55, 55, 120, 32, 2, true);
    const nfzMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.28,
      wireframe: true,
      side: THREE.DoubleSide
    });
    const nfzMesh = new THREE.Mesh(nfzGeo, nfzMat);
    nfzMesh.position.set(60, 60, -140);
    scene.add(nfzMesh);
    nfzMeshRef.current = nfzMesh;

    // 10. 3D KINETIC NDRF HAWK-EYE DRONE
    const droneGroup = new THREE.Group();
    const droneBodyGeo = new THREE.BoxGeometry(10, 3, 10);
    const droneBodyMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 });
    const droneBody = new THREE.Mesh(droneBodyGeo, droneBodyMat);
    droneBody.castShadow = true;
    droneGroup.add(droneBody);

    const armGeo = new THREE.CylinderGeometry(0.8, 0.8, 16);
    armGeo.rotateZ(Math.PI / 2);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
    const arm1 = new THREE.Mesh(armGeo, armMat);
    arm1.rotation.y = Math.PI / 4;
    const arm2 = new THREE.Mesh(armGeo, armMat);
    arm2.rotation.y = -Math.PI / 4;
    droneGroup.add(arm1);
    droneGroup.add(arm2);

    const droneSpot = new THREE.SpotLight(0x38bdf8, 4.5, 200, Math.PI / 5, 0.4);
    droneSpot.position.set(0, -1, 0);
    droneSpot.target.position.set(0, -90, 0);
    droneSpot.castShadow = true;
    droneGroup.add(droneSpot);
    droneGroup.add(droneSpot.target);
    droneSpotLightRef.current = droneSpot;

    droneGroup.position.set(-60, 85, 0);
    scene.add(droneGroup);
    droneGroupRef.current = droneGroup;

    // 11. 3D AMPHIBIOUS RESCUE BOAT (IRB)
    const boatGroup = new THREE.Group();
    const hullGeo = new THREE.BoxGeometry(14, 4, 28);
    const hullMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.3, metalness: 0.3 });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.castShadow = true;
    boatGroup.add(hull);
    boatGroup.position.set(-20, waterMesh.position.y + 2, -40);
    scene.add(boatGroup);
    boatGroupRef.current = boatGroup;

    // 12. ANIMATION LOOP (60 FPS)
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Dynamic Water Wave Displacement
      if (waterMeshRef.current && isPlaying) {
        const geo = waterMeshRef.current.geometry as THREE.PlaneGeometry;
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const u = pos.getX(i);
          const v = pos.getY(i);
          pos.setZ(
            i, 
            Math.sin(u * 0.04 + elapsedTime * 2.2) * 1.4 + 
            Math.cos(v * 0.035 + elapsedTime * 1.8) * 1.1
          );
        }
        pos.needsUpdate = true;
        geo.computeVertexNormals();
      }

      // Drone Flight Orbit
      if (droneGroupRef.current && isPlaying) {
        const droneAngle = elapsedTime * 0.45;
        const droneRadius = 140;
        droneGroupRef.current.position.x = Math.cos(droneAngle) * droneRadius;
        droneGroupRef.current.position.z = Math.sin(droneAngle) * (droneRadius * 0.7);
        droneGroupRef.current.position.y = 85 + Math.sin(elapsedTime * 1.5) * 3;
        droneGroupRef.current.rotation.y = -droneAngle + Math.PI / 2;
        droneGroupRef.current.rotation.z = Math.sin(elapsedTime * 2) * 0.08;
      }

      // Boat Bobbing
      if (boatGroupRef.current && waterMeshRef.current) {
        const boatWaterY = waterMeshRef.current.position.y;
        boatGroupRef.current.position.y = boatWaterY + 1.8 + Math.sin(elapsedTime * 2) * 0.6;
        boatGroupRef.current.position.z = -40 + Math.sin(elapsedTime * 0.35) * 45;
        boatGroupRef.current.position.x = Math.sin(boatGroupRef.current.position.z * 0.015) * 45 - 20;
        boatGroupRef.current.rotation.z = Math.sin(elapsedTime * 2.5) * 0.05;
        boatGroupRef.current.rotation.x = Math.cos(elapsedTime * 1.8) * 0.04;
      }

      // Surcharging Geyser Animations
      if (geyserMeshesRef.current.length > 0) {
        geyserMeshesRef.current.forEach((mesh, idx) => {
          const geyserPulse = 1.0 + Math.sin(elapsedTime * 6.0 + idx) * 0.35;
          mesh.scale.set(1.0 + Math.sin(elapsedTime * 4) * 0.2, geyserPulse, 1.0 + Math.cos(elapsedTime * 4) * 0.2);
          mesh.rotation.y = elapsedTime * 2.5;
        });
      }

      // NFZ Pulsing Glow
      if (nfzMeshRef.current) {
        const pulse = (Math.sin(elapsedTime * 3) + 1) * 0.5;
        (nfzMeshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.18 + pulse * 0.22;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Update physical water depth in Three.js scene
  useEffect(() => {
    if (waterMeshRef.current) {
      waterMeshRef.current.position.y = waterDepthMeters * 8 - 14;
    }
  }, [waterDepthMeters]);

  // Handle Subterranean X-Ray Toggle
  useEffect(() => {
    if (undergroundGroupRef.current && groundMeshRef.current) {
      undergroundGroupRef.current.visible = isSubterraneanXRay;
      const mat = groundMeshRef.current.material as THREE.MeshStandardMaterial;
      if (isSubterraneanXRay) {
        mat.opacity = 0.22;
        mat.wireframe = true;
      } else {
        mat.opacity = 1.0;
        mat.wireframe = false;
      }
    }
  }, [isSubterraneanXRay]);

  // Update Camera Orbit Spherical Coords
  const updateCameraPosition = useCallback(() => {
    if (!cameraRef.current) return;
    const { radius, theta, phi, target } = cameraStateRef.current;
    
    const x = target.x + radius * Math.sin(phi) * Math.sin(theta);
    const y = target.y + radius * Math.cos(phi);
    const z = target.z + radius * Math.sin(phi) * Math.cos(theta);

    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(target);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 0) {
      cameraStateRef.current.isDragging = true;
    } else if (e.button === 2) {
      cameraStateRef.current.isRightDragging = true;
    }
    cameraStateRef.current.prevMouseX = e.clientX;
    cameraStateRef.current.prevMouseY = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const dx = e.clientX - cameraStateRef.current.prevMouseX;
    const dy = e.clientY - cameraStateRef.current.prevMouseY;
    cameraStateRef.current.prevMouseX = e.clientX;
    cameraStateRef.current.prevMouseY = e.clientY;

    if (cameraStateRef.current.isDragging) {
      cameraStateRef.current.theta -= dx * 0.006;
      cameraStateRef.current.phi = Math.max(0.15, Math.min(Math.PI / 2.05, cameraStateRef.current.phi - dy * 0.006));
      updateCameraPosition();
    } else if (cameraStateRef.current.isRightDragging) {
      const forward = new THREE.Vector3(
        -Math.sin(cameraStateRef.current.theta),
        0,
        -Math.cos(cameraStateRef.current.theta)
      );
      const right = new THREE.Vector3(
        Math.cos(cameraStateRef.current.theta),
        0,
        -Math.sin(cameraStateRef.current.theta)
      );
      cameraStateRef.current.target.addScaledVector(right, -dx * 0.35);
      cameraStateRef.current.target.addScaledVector(forward, dy * 0.35);
      updateCameraPosition();
    }
  };

  const handleMouseUp = () => {
    cameraStateRef.current.isDragging = false;
    cameraStateRef.current.isRightDragging = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    cameraStateRef.current.radius = Math.max(120, Math.min(900, cameraStateRef.current.radius + e.deltaY * 0.45));
    updateCameraPosition();
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mountRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);
    const intersects = raycaster.intersectObjects(buildingMeshesRef.current, true);

    if (intersects.length > 0) {
      let current: THREE.Object3D | null = intersects[0].object;
      while (current && !current.userData?.info && current.parent) {
        current = current.parent;
      }
      if (current?.userData?.info) {
        setSelectedBuilding(current.userData.info);
      }
    }
  };

  const handleSetPreset = (preset: 'iso' | 'canyon' | 'top') => {
    setCameraPreset(preset);
    if (preset === 'iso') {
      cameraStateRef.current.radius = 460;
      cameraStateRef.current.theta = Math.PI / 4;
      cameraStateRef.current.phi = Math.PI / 3.2;
      cameraStateRef.current.target.set(0, 10, 0);
    } else if (preset === 'canyon') {
      cameraStateRef.current.radius = 280;
      cameraStateRef.current.theta = 0.15;
      cameraStateRef.current.phi = Math.PI / 2.3;
      cameraStateRef.current.target.set(-50, 5, 20);
    } else if (preset === 'top') {
      cameraStateRef.current.radius = 560;
      cameraStateRef.current.theta = 0.001;
      cameraStateRef.current.phi = 0.18;
      cameraStateRef.current.target.set(0, 0, 0);
    }
    updateCameraPosition();
  };

  useEffect(() => {
    updateCameraPosition();
  }, [updateCameraPosition]);

  return (
    <div className="relative w-full rounded-2xl bg-[#030712] border border-cyan-500/40 shadow-2xl overflow-hidden flex flex-col">
      
      {/* TOP HUD BAR */}
      <div className="px-4 py-3 bg-[#0a1222]/90 border-b border-cyan-500/30 flex flex-wrap items-center justify-between gap-3 z-10 backdrop-blur-md">
        
        {/* Title & Live Status */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🌐</span>
            <h3 className="font-mono font-bold text-sm tracking-wider text-cyan-300">
              CIVICTWIN REAL 3D LIVE DIGITAL TWIN
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-mono animate-pulse">
            WebGL 60FPS SHADOW ENGINE
          </span>
          <span className="hidden md:inline text-xs text-slate-400 font-mono">
            SWE Micro-Physics + OpenTopography 30m DEM + Subterranean SWD
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          
          {/* Subterranean X-Ray Toggle */}
          <button
            onClick={() => setIsSubterraneanXRay(!isSubterraneanXRay)}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              isSubterraneanXRay 
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/40 border border-cyan-300 scale-105' 
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

          {/* Standalone Crown Jewels Button */}
          {onOpenCrownJewels && (
            <button
              onClick={onOpenCrownJewels}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black flex items-center space-x-1.5 shadow-lg shadow-amber-500/30 cursor-pointer transition-all scale-100 hover:scale-105"
              title="Open Standalone 7 Crown Jewels Scientific Showcase"
            >
              <span>💎</span>
              <span>7 CROWN JEWELS</span>
            </button>
          )}

          {/* Switch to 2D Tactical Map Button */}
          {onSwitchTo2D && (
            <button
              onClick={onSwitchTo2D}
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <span>🗺️</span>
              <span>2D MAP</span>
            </button>
          )}

          {onOpenCommandSuite && (
            <button
              onClick={onOpenCommandSuite}
              className="px-2.5 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-bold transition-all cursor-pointer"
            >
              <span>⚡</span>
              <span>SUITE</span>
            </button>
          )}
        </div>
      </div>

      {/* 3D CANVAS VIEWPORT */}
      <div 
        ref={mountRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClick}
        onContextMenu={(e) => e.preventDefault()}
        className="relative w-full h-[580px] md:h-[640px] cursor-grab active:cursor-grabbing select-none"
      >
        
        {/* FLOATING CAMERA GIMBAL HUD (TOP LEFT) */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 pointer-events-auto">
          <div className="p-2.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 text-xs font-mono text-slate-300 space-y-2 shadow-xl">
            <div className="flex items-center justify-between text-[11px] text-cyan-400 font-bold uppercase">
              <span className="flex items-center space-x-1">
                <Compass className="w-3.5 h-3.5" />
                <span>Camera Gimbal</span>
              </span>
              <span className="text-[10px] text-slate-400">Orbit/Pan</span>
            </div>

            {/* Presets */}
            <div className="flex gap-1">
              <button
                onClick={() => handleSetPreset('iso')}
                className={`px-2 py-1 rounded text-[10px] font-bold ${
                  cameraPreset === 'iso' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-cyan-300 border border-slate-800'
                }`}
              >
                Isometric
              </button>
              <button
                onClick={() => handleSetPreset('canyon')}
                className={`px-2 py-1 rounded text-[10px] font-bold ${
                  cameraPreset === 'canyon' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-cyan-300 border border-slate-800'
                }`}
              >
                Canyon
              </button>
              <button
                onClick={() => handleSetPreset('top')}
                className={`px-2 py-1 rounded text-[10px] font-bold ${
                  cameraPreset === 'top' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-cyan-300 border border-slate-800'
                }`}
              >
                Top-Down
              </button>
            </div>

            <div className="text-[10px] text-slate-400">
              Left-Drag: Orbit | Right-Drag: Pan | Scroll: Zoom
            </div>
          </div>
        </div>

        {/* FLOATING KINETIC ENTITY STATUS (TOP RIGHT) */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 pointer-events-auto">
          <div className="p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 text-xs font-mono text-slate-300 space-y-1.5 shadow-xl max-w-xs">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-cyan-400 flex items-center space-x-1">
                <span>🚁</span>
                <span>NDRF HAWK-EYE UAV</span>
              </span>
              <span className="text-emerald-400 text-[10px]">PATROL LIVE</span>
            </div>
            <div className="text-[11px] text-slate-300">
              Alt: <strong>65m AGL</strong> | SpotLight: <strong>Active</strong> | Camera: <strong>4K FLIR</strong>
            </div>

            <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-red-400 flex items-center space-x-1">
                <span>🔴</span>
                <span>Substation 220kV NFZ</span>
              </span>
              <span className="text-red-300 font-bold">R = 55m RESTRICTED</span>
            </div>

            <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-orange-400 flex items-center space-x-1">
                <span>🚤</span>
                <span>Inflatable Boat IRB-03</span>
              </span>
              <span className="text-orange-300 font-bold">Mithi River Corridor</span>
            </div>

            {isSubterraneanXRay && (
              <div className="pt-1.5 border-t border-cyan-500/40 text-[10px] text-cyan-300 animate-pulse">
                ⚡ SUBTERRANEAN HYDRAULICS: 8 Inverts | 2 Erupting Geysers
              </div>
            )}
          </div>
        </div>

        {/* SELECTED BUILDING INSPECTOR OVERLAY (BOTTOM LEFT) */}
        {selectedBuilding && (
          <div className="absolute bottom-3 left-3 z-10 p-3.5 rounded-2xl bg-[#091224]/90 backdrop-blur-md border border-cyan-400/50 text-xs font-mono text-slate-200 shadow-2xl max-w-sm pointer-events-auto space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 uppercase">
                3D Node Telemetry Inspector
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                selectedBuilding.status.includes('CRITICAL') || selectedBuilding.status.includes('TRIP')
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {selectedBuilding.status}
              </span>
            </div>

            <div>
              <h4 className="font-bold text-white text-sm leading-tight">{selectedBuilding.name}</h4>
              <p className="text-[11px] text-slate-300 mt-1">{selectedBuilding.threatDescription}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800 text-[11px]">
              <div>
                <span className="text-slate-400">Elevation:</span>{' '}
                <strong className="text-cyan-300">{selectedBuilding.elevation}m</strong>
              </div>
              <div>
                <span className="text-slate-400">Height:</span>{' '}
                <strong className="text-cyan-300">{selectedBuilding.height}m</strong>
              </div>
              <div>
                <span className="text-slate-400">Current Flood:</span>{' '}
                <strong className="text-amber-400">
                  {Math.max(0, waterDepthMeters - selectedBuilding.elevation + 4.5).toFixed(2)}m
                </strong>
              </div>
              <div>
                <span className="text-slate-400">Structural Surge:</span>{' '}
                <strong className="text-red-400">
                  {selectedBuilding.type === 'hospital' ? '98% ICU CAP' : 'MONITORED'}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* WATER LEVEL & SIMULATION SCRUBBER (BOTTOM RIGHT) */}
        <div className="absolute bottom-3 right-3 z-10 p-3.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 text-xs font-mono text-slate-200 shadow-2xl w-72 pointer-events-auto space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-cyan-300 font-bold flex items-center space-x-1">
              <Waves className="w-3.5 h-3.5 text-cyan-400" />
              <span>3D Water Plane Elevation</span>
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

          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0.0m (Dry Bed)</span>
            <span>1.82m (Milan Choke)</span>
            <span>3.5m (2005 Surge)</span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-800">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 text-xs font-bold transition-all"
            >
              {isPlaying ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
              <span>{isPlaying ? 'Pause Dynamic Wave' : 'Resume Wave'}</span>
            </button>
            <span className="text-[10px] text-slate-400">60 FPS WebGL</span>
          </div>
        </div>

      </div>

      {/* COMPUTER VISION WATERWAY SAFETY HUD MODAL */}
      {showCVWaterwayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
          <div className="relative w-full max-w-4xl rounded-2xl bg-[#060c18] border border-cyan-500/50 shadow-2xl overflow-hidden flex flex-col font-mono text-slate-200">
            
            {/* Modal Header */}
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

            {/* Video Viewport with AI Bounding Boxes */}
            <div className="p-5 space-y-4">
              <div className="relative w-full h-80 rounded-xl bg-slate-950 border border-cyan-500/30 overflow-hidden flex items-center justify-center">
                
                {/* Synthetic Flood Scene Simulation Frame */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-sky-950 to-blue-950 opacity-90">
                  {/* Grid Lines simulating optical flow matrix */}
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 opacity-20 pointer-events-none">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="border border-cyan-400/40 flex items-center justify-center text-[8px] text-cyan-300">
                        →
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Bounding Box 1: Submerged Concrete Median Divider */}
                <div 
                  className="absolute border-2 border-red-500 bg-red-500/15 rounded pointer-events-none animate-pulse"
                  style={{ left: '22%', top: '58%', width: '54%', height: '14%' }}
                >
                  <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-red-600 text-[9px] font-black text-white rounded">
                    ⚠️ SUBMERGED ROAD MEDIAN (18cm CLEARANCE - PROP STRIKE RISK)
                  </div>
                </div>

                {/* AI Bounding Box 2: Hydrodynamic Vortex Eddy */}
                <div 
                  className="absolute border-2 border-amber-400 bg-amber-500/20 rounded pointer-events-none"
                  style={{ left: '52%', top: '35%', width: '22%', height: '24%' }}
                >
                  <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-amber-500 text-[9px] font-black text-slate-950 rounded">
                    🌀 SUCTION EDDY (2.6 m/s VORTICITY - CAPSIZE DANGER)
                  </div>
                </div>

                {/* AI Bounding Box 3: Verified Safe Rescue Boat Channel */}
                <div 
                  className="absolute border-2 border-emerald-400 bg-emerald-500/15 rounded pointer-events-none"
                  style={{ left: '6%', top: '28%', width: '26%', height: '52%' }}
                >
                  <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-emerald-600 text-[9px] font-black text-white rounded">
                    ✅ VERIFIED SAFE CHANNEL (&gt;1.2m CLEARANCE)
                  </div>
                </div>

                {/* Live HUD Crosshair and Telemetry Stamps */}
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

              {/* Hydrodynamic Telemetry Gauges */}
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

              {/* Tactical Recommendations for NDRF Rescue Teams */}
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
