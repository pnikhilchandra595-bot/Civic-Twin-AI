import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { 
  Compass, Eye, RotateCw, ZoomIn, ZoomOut, Waves, Send, Anchor, 
  ShieldAlert, Activity, Play, Pause, RefreshCw, Layers, Award,
  Sliders, ArrowUpRight, Zap, Building2, Flame, Maximize2, X
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
  const [rainRateMmHr, setRainRateMmHr] = useState<number>(state?.rain_intensity_mmhr || 75);
  const [selectedBuilding, setSelectedBuilding] = useState<Building3DInfo>(CITY_BUILDINGS_CONFIG[0]);
  const [cameraPreset, setCameraPreset] = useState<'iso' | 'canyon' | 'top'>('iso');

  // Camera Orbit State
  const cameraStateRef = useRef({
    radius: 460,
    theta: Math.PI / 4, // Azimuthal angle (horizontal)
    phi: Math.PI / 3.2, // Polar angle (vertical tilt)
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
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const droneGroupRef = useRef<THREE.Group | null>(null);
  const droneSpotLightRef = useRef<THREE.SpotLight | null>(null);
  const boatGroupRef = useRef<THREE.Group | null>(null);
  const nfzMeshRef = useRef<THREE.Mesh | null>(null);
  const buildingMeshesRef = useRef<THREE.Mesh[]>([]);
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
    const camera = new THREE.PerspectiveCamera(45, width / height, 2, 2500);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. LIGHTING
    const ambientLight = new THREE.AmbientLight(0x93c5fd, 0.65);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0a101d, 0.45);
    scene.add(hemiLight);

    // Sunlight with Shadows
    const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.35);
    sunLight.position.set(220, 380, 260);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 1000;
    const shadowDist = 320;
    sunLight.shadow.camera.left = -shadowDist;
    sunLight.shadow.camera.right = shadowDist;
    sunLight.shadow.camera.top = shadowDist;
    sunLight.shadow.camera.bottom = -shadowDist;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Blue ground bounce light
    const bounceLight = new THREE.DirectionalLight(0x0284c7, 0.5);
    bounceLight.position.set(-200, 50, -200);
    scene.add(bounceLight);

    // 5. GROUND & TERRAIN TOPOGRAPHY
    const groundGeo = new THREE.PlaneGeometry(650, 650, 64, 64);
    groundGeo.rotateX(-Math.PI / 2);
    
    // Custom height displacement for Mithi River and Milan Subway trenches
    const posAttr = groundGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      
      // Mithi River winding channel (sinusoidal trench from top-left to bottom-center)
      const riverCenter = Math.sin(z * 0.015) * 45 - 20;
      const distToRiver = Math.abs(x - riverCenter);
      let elev = 0;
      if (distToRiver < 32) {
        elev = -18 * (1 - distToRiver / 32); // -18m riverbed
      }

      // Milan Subway Underpass trench
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
      flatShading: true
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Grid Floor Helper for tactical measurement
    const grid = new THREE.GridHelper(650, 32, 0x0ea5e9, 0x1e293b);
    grid.position.y = 0.2;
    scene.add(grid);

    // 6. BUILDINGS GENERATION (REAL 3D EXTRUSIONS)
    const buildingMeshes: THREE.Mesh[] = [];
    CITY_BUILDINGS_CONFIG.forEach((b) => {
      const bGeo = new THREE.BoxGeometry(b.width, b.height, b.depth);
      // Move pivot to bottom of building
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

      // Roof Slab with Accent Color
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
      roofMesh.castShadow = true;
      bMesh.add(roofMesh);

      // Helipad Marker on Sion Hospital
      if (b.type === 'hospital') {
        const heliGeo = new THREE.RingGeometry(8, 11, 24);
        heliGeo.rotateX(-Math.PI / 2);
        heliGeo.translate(0, b.height + 2.6, 0);
        const heliMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        const heliMesh = new THREE.Mesh(heliGeo, heliMat);
        bMesh.add(heliMesh);

        // Emergency Flashing Beacon
        const beaconLight = new THREE.PointLight(0xef4444, 2.5, 90);
        beaconLight.position.set(0, b.height + 6, 0);
        bMesh.add(beaconLight);
      }

      // High-voltage warning spark on Dharavi Substation
      if (b.type === 'substation') {
        const sparkLight = new THREE.PointLight(0x38bdf8, 3.0, 110);
        sparkLight.position.set(0, b.height + 5, 0);
        bMesh.add(sparkLight);
      }

      scene.add(bMesh);
      buildingMeshes.push(bMesh);
    });
    buildingMeshesRef.current = buildingMeshes;

    // 7. REAL 3D DYNAMIC VOLUMETRIC WATER MESH
    const waterGeo = new THREE.PlaneGeometry(600, 600, 64, 64);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.12,
      metalness: 0.78,
      transparent: true,
      opacity: 0.76,
      depthWrite: false
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.y = waterDepthMeters * 5 - 10; // Scaled physical elevation
    waterMesh.receiveShadow = true;
    scene.add(waterMesh);
    waterMeshRef.current = waterMesh;

    // 8. 3D NO-FLY ZONE (NFZ) CYLINDER AROUND SUBSTATION
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

    // 9. 3D KINETIC NDRF HAWK-EYE DRONE
    const droneGroup = new THREE.Group();
    const droneBodyGeo = new THREE.BoxGeometry(10, 3, 10);
    const droneBodyMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 });
    const droneBody = new THREE.Mesh(droneBodyGeo, droneBodyMat);
    droneBody.castShadow = true;
    droneGroup.add(droneBody);

    // 4 Drone Arms and Propellers
    const armGeo = new THREE.CylinderGeometry(0.8, 0.8, 16);
    armGeo.rotateZ(Math.PI / 2);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
    const arm1 = new THREE.Mesh(armGeo, armMat);
    arm1.rotation.y = Math.PI / 4;
    const arm2 = new THREE.Mesh(armGeo, armMat);
    arm2.rotation.y = -Math.PI / 4;
    droneGroup.add(arm1);
    droneGroup.add(arm2);

    // Drone Spotlight pointing at flood scene
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

    // 10. 3D AMPHIBIOUS RESCUE BOAT (IRB)
    const boatGroup = new THREE.Group();
    const hullGeo = new THREE.BoxGeometry(14, 4, 28);
    const hullMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.3, metalness: 0.3 });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.castShadow = true;
    boatGroup.add(hull);
    boatGroup.position.set(-20, waterMesh.position.y + 2, -40);
    scene.add(boatGroup);
    boatGroupRef.current = boatGroup;

    // 11. ANIMATION / RENDER LOOP (60 FPS)
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Dynamic Water Vertex Wave Displacement
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

      // Drone Flight Trajectory Orbit
      if (droneGroupRef.current && isPlaying) {
        const droneAngle = elapsedTime * 0.45;
        const droneRadius = 140;
        droneGroupRef.current.position.x = Math.cos(droneAngle) * droneRadius;
        droneGroupRef.current.position.z = Math.sin(droneAngle) * (droneRadius * 0.7);
        droneGroupRef.current.position.y = 85 + Math.sin(elapsedTime * 1.5) * 3;
        droneGroupRef.current.rotation.y = -droneAngle + Math.PI / 2;
        droneGroupRef.current.rotation.z = Math.sin(elapsedTime * 2) * 0.08;
      }

      // Boat Wave Bobbing
      if (boatGroupRef.current && waterMeshRef.current) {
        const boatWaterY = waterMeshRef.current.position.y;
        boatGroupRef.current.position.y = boatWaterY + 1.8 + Math.sin(elapsedTime * 2) * 0.6;
        boatGroupRef.current.position.z = -40 + Math.sin(elapsedTime * 0.35) * 45;
        boatGroupRef.current.position.x = Math.sin(boatGroupRef.current.position.z * 0.015) * 45 - 20;
        boatGroupRef.current.rotation.z = Math.sin(elapsedTime * 2.5) * 0.05;
        boatGroupRef.current.rotation.x = Math.cos(elapsedTime * 1.8) * 0.04;
      }

      // NFZ Pulsing Glow
      if (nfzMeshRef.current) {
        const pulse = (Math.sin(elapsedTime * 3) + 1) * 0.5;
        (nfzMeshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.18 + pulse * 0.22;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // CLEANUP
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
      // Map 0m - 3.5m to real 3D scene Y units
      waterMeshRef.current.position.y = waterDepthMeters * 8 - 14;
    }
  }, [waterDepthMeters]);

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

  // Mouse / Pointer Event Listeners for 3D Camera Gimbal
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
      // Orbit rotation
      cameraStateRef.current.theta -= dx * 0.006;
      cameraStateRef.current.phi = Math.max(0.15, Math.min(Math.PI / 2.05, cameraStateRef.current.phi - dy * 0.006));
      updateCameraPosition();
    } else if (cameraStateRef.current.isRightDragging) {
      // Pan camera target
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

  // Click Raycaster for Building Selection
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

  // Camera Presets
  const handleSetPreset = (preset: 'iso' | 'canyon' | 'top') => {
    setCameraPreset(preset);
    if (preset === 'iso') {
      cameraStateRef.current.radius = 460;
      cameraStateRef.current.theta = Math.PI / 4;
      cameraStateRef.current.phi = Math.PI / 3.2;
    } else if (preset === 'canyon') {
      cameraStateRef.current.radius = 240;
      cameraStateRef.current.theta = Math.PI / 2.1;
      cameraStateRef.current.phi = Math.PI / 2.3;
    } else if (preset === 'top') {
      cameraStateRef.current.radius = 520;
      cameraStateRef.current.theta = 0;
      cameraStateRef.current.phi = 0.18;
    }
    cameraStateRef.current.target.set(0, 10, 0);
    updateCameraPosition();
  };

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
            SWE Micro-Physics + Volumetric Water Mesh + Kinetic UAV & IRB
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          
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
              <span>2D TACTICAL MAP</span>
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
            <span>1.82m (Milan Subway Choke)</span>
            <span>3.5m (2005 Catastrophe)</span>
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
    </div>
  );
};
