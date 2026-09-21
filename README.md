# 🏛️ CivicTwin AI – India Disaster Response & Civil Defense Digital Twin

> 🇮🇳 **India's Operational Multi-Hazard Disaster Response & Civil Defense Digital Twin** — Powered by live ISRO MOSDAC, Bhuvan & Bhoonidhi satellite pipelines, OpenTopography Copernicus 30m DEM, MapLibre GL 3D Geographic Terrain, Subterranean 1D/2D Coupled Stormwater Hydraulics, Edge Computer Vision Waterway Hazard Radar, Copernicus Sentinel-1 SAR Radar, 2D Shallow Water Equations (SWE) Physics, Official IMD Doppler Weather Radar loops, Two-Tier Aircraft Tracking, Delhi Open Transit GNSS, Grounded 108/NDRF Hospital Dispatch Simulator, Google Gemini AI Incident Commander, and Offline 112 Cellular SMS Lifelines across all 780+ Indian Districts.

---

## 🌟 Key Architectural Pillars & Innovations

### 1. 🌍 True 3D Geographic Terrain Map & Subterranean Hydraulic Grid
- **MapLibre GL JS 3D Hardware-Accelerated Engine**:
  - Drapes **high-resolution Esri World Imagery photorealistic satellite tiles**, CartoDB Dark Tactical, and OpenStreetMap directly onto a hardware-rendered **3D Digital Elevation Model (DEM)** with dynamic vertical relief exaggeration ($2.2\times$).
  - Full 3D orbital camera controls: Tilt pitch from $0^\circ$ up to **$85^\circ$ horizon angle**, rotate $360^\circ$, and smooth pan across entire city micro-catchments.
  - Quick-jump camera presets: **🌊 Mithi River Basin**, **🚇 Milan Subway Trench**, and **⚓ Mahim Tidal Outfall**.
- **Real 3D Flood Inundation Polygon**: Drapes 2D Shallow Water Equations (SWE) water boundaries dynamically over real topography, reactive to a $0.0\text{m} \to 3.5\text{m}$ water elevation scrubber.
- **Subterranean Stormwater Drainage Grid (1D/2D Coupled)**:
  - Traces real-world municipal storm drain pipelines beneath the street network connecting Sion Circle, Kurla West, Dharavi 90-Ft Rd, Milan Subway, BKC, and Mahim Creek.
  - Surcharging manholes with pulsing animated hazard markers and erupting geyser indicators.

---

### 2. ⚡ 1D/2D Subterranean Drainage Hydraulic Solver (`underground_drainage_service.py`)
- **Coupled Saint-Venant Pipe Flow & Surface Geysers**:
  - Solves Manning's open-channel and pressurized pipe flow across 8 manhole chambers and 9 subterranean box culverts and conduits.
  - Invert elevations, siltation choking factors ($15\% \to 80\%$), and pipe fill ratios.
- **Coastal Tidal Outfall Backpressure**:
  - Models coastal backpressure resistance when sea tide elevation exceeds $>3.2\text{m}$, locking outfall flap gates and triggering reverse subterranean backflow.
- **Surcharging Surface Geyser Eruptions**:
  - Calculates Hydraulic Grade Line (HGL) vs ground elevation. When $\text{HGL} > Z_{\text{ground}}$, Torricelli pressure jets burst upward through manhole covers as surface geysers (Milan Subway & Kranti Nagar).
- **Live REST Endpoint**: `GET /api/drainage/underground-network`.

---

### 3. 📹 Computer Vision Waterway Safety & Hydrodynamic Hazard Radar (`cv_waterway_safety_service.py`)
- **Submerged Road Median Divider Radar**:
  - Employs edge object segmentation on UAV/CCTV video frames to locate submerged concrete road median dividers concealed beneath murky floodwaters.
  - Computes vertical water clearance down to centimeters; triggers **CRITICAL PROPELLER STRIKE ALERTS** when clearance is $<30\text{ cm}$ (e.g. $18\text{ cm}$ at Dadar TT circle).
- **Dense Farnebäck Optical Flow ($ec{u}, ec{v}$)**:
  - Ingests 30 FPS video frames to generate an $11 \times 11$ surface water velocity vector field.
  - Detects high-vorticity whirlpool suction eddies ($>2.5\text{ m/s}$) that meet the capsize threshold for NDRF Inflatable Rescue Boats (IRBs).
- **Safe Navigable Corridor Segmentation**:
  - Computes clear navigation corridors with $>1.2\text{m}$ clearance away from submerged vehicles and debris.
- **Tactical CV Waterway Safety HUD**:
  - Real-time video window with dynamic AI YOLOv8 bounding boxes, optical flow arrows, and live telemetry gauges.
- **Live REST Endpoint**: `GET /api/cv-waterway/safety-telemetry`.

---

### 4. 🛰️ OpenTopography Global High-Resolution DEM API (`opentopography_service.py`)
- **Direct Integration**: Authenticated via authorized user API key (`OPENTOPOGRAPHY_API_KEY`).
- **High-Resolution Topography**: Fetches Copernicus 30m Global DEM (`COP30`) and NASADEM/SRTMGL1 GeoTIFF rasters for any coordinate bounding box.
- **Local Caching System**: Automatically caches GeoTIFF grids in `backend/app/data/dem_cache/` to eliminate redundant network overhead and respect API rate limits.
- **Live REST Endpoint**: `GET /api/terrain/opentopography-dem`.

---

### 5. 🏙️ 3D Cybernetic Facility Digital Twin (`ThreeDimensionalTwinMap.tsx`)
- **60 FPS WebGL Shadow Engine**:
  - Features procedurally generated **illuminated window matrices** on building facades and real-time **glowing neon architectural edges** (`EdgesGeometry`).
  - **Floating 3D Holographic Status Badges** (`THREE.Sprite`) hovering above critical facilities that always face the camera:
    - `🏥 LTMG SION HOSPITAL (CASUALTY 0.4m SURGE)`
    - `⚡ 220kV SUBSTATION (SCADA BREAKER TRIP)`
    - `🌊 MILAN SUBWAY TRENCH (SUBMERGED)`
    - `🏢 BKC FINANCIAL TOWER (EVAC HQ)`
    - `🏘️ KRANTI NAGAR SLUM (EXTRACTION)`
    - `🏥 LILAVATI TRAUMA CENTER (RECEIVING)`
  - Flashing red rooftop emergency warning strobes with dynamic point lighting.
  - Moving emergency ambulances with flashing emergency lightbars navigating illuminated road networks.
  - Translucent ocean-blue dynamic water mesh with physical vertex wave displacement.
  - Kinetic NDRF Hawk-Eye UAV drone with spinning rotor discs, wingtip strobes, and volumetric spotlight cone.
  - Inflatable Rescue Boat (IRB) with wave-bobbing buoyancy physics.

---

### 6. 💎 The 7 Crown Jewels of CivicTwin AI (`CrownJewelsModal.tsx`)
A standalone sovereign scientific suite accessible via header button, cockpit switcher, and Command Tools Hub:
1. **2D SWE Micro-Physics Calculator**: Solves Shallow Water Equations ($\partial h/\partial t + 
abla \cdot (uh) = R$) with Chitale Commission residual check ($\pm 4.17\text{ cm}$).
2. **Multi-Order Cascade Domino Engine**: Models inter-dependency failure chains (Substation trip $\to$ WTP de-energization $\to$ Hospital ICU backup fuel countdown).
3. **Physical IoT 18-Byte Hex Frame Encoder**: Generates micro-payload binary packets (`AA00...`) for zero-internet LoRaWAN / VHF radio mesh delivery.
4. **Amphibious Rescue Boat Canal Router**: Computes navigable waterways for shallow-draft boats avoiding low bridges, culvert chokes, and high-velocity eddies.
5. **6-Language NDMA CAP War Room Broadcast**: Automated XML Common Alerting Protocol generation in Hindi, Marathi, Bengali, Tamil, Telugu, and English.
6. **Sovereign InSAR Radar & Landslide FoS**: Sentinel-1 SAR interferometry phase unwrapping with Morgenstern-Price Factor of Safety (FoS) slope stability calculator.
7. **Economic PDNA Loss Assessment**: World Bank / NDMA Section 46 compliant post-disaster needs loss calculator calculating ₹ Crore infrastructure damages.

---

### 7. 🛰️ Spaceborne Intelligence & Official Sovereign Feeds
- **ISRO MOSDAC (SAC Ahmedabad)**: Live atmospheric telemetry querying `https://mosdac.gov.in/apios/datasets.json`. Ingests INSAT-3D/3DR TIR-1 cloud-top brightness temperatures ($209\,\text{K} / -64^\circ\text{C}$) and Hydro-Estimator precipitation rain rates (`3SIMG_L2B_HEM`).
- **ISRO Bhuvan & Bhoonidhi (NRSC Hyderabad)**:
  - OGC WMS vector overlays, hospital POIs, village geocoding directories, and CartoDEM terrain models.
  - Bhoonidhi STAC catalog API query engine for NISAR, Sentinel-1A SAR, and LISS-4 imagery metadata over Indian state bounds.
- **Official IMD Doppler Weather Radars (`mausam.imd.gov.in`)**:
  - Live animated Doppler reflectivity scans (`MUM_MAXZ.gif`, `DLH_MAXZ.gif`, `HYD_MAXZ.gif`, and All-India `mosaic.gif`) rendered in Single Focus and Matrix (4x4) views.
- **Copernicus Sentinel-1 & 2 SAR / Optical**: Active C-band microwave radar backscatter ($\sigma^0 < -16.0\,\text{dB}$) for cloud-penetrating water extraction and Sentinel-2 NDWI ($+0.42$).
- **NASA FIRMS**: VIIRS thermal anomaly hotspots and Fire Radiative Power ($28.6\,\text{MW}$).

---

### 8. ✈️ Two-Tier Disaster Response Aircraft Tracking & Sortie Simulator
- **Verified Sourced ICAO24 Registry**:
  - **Tier 1 (Civil-Registered Disaster Fleets & State Govs)**: Verified DGCA Indian registry hex codes:
    - `80026e` (`VT-PHA`) — Pawan Hans Dauphin AS365 N3 Air Ambulance
    - `8004f2` (`VT-PHD`) — Pawan Hans Coastal & Flood SAR
    - `8003a9` (`VT-EHL`) — State Relief Wing Eurocopter AS350 B3
    - `8006b1` (`VT-GVT`) — Government of Gujarat Bell 412EP
    - `800794` (`VT-MHA`) — Government of Maharashtra S-76
    - `80027f` (`VT-TSG`) — Government of Telangana AW139
  - **Tier 2 (Military Tactical Airlift / NDRF Insertion)**:
    - `80018a` / `80018b` (`KC-3801` / `KC-3802`) — IAF C-130J Super Hercules
    - `800041` (`CB-8001`) — IAF C-17 Globemaster III
    - `800531` (`Z-3431`) — IAF Mi-17V-5 Tactical Rescue & Winch
- **Continuous 6s Telemetry Polling**: Automated polling loop with high layer z-index (`zIndexOffset: 8500`) and detailed glassmorphic transponder telemetry popups.
- **Dynamic Real-Time Sortie Simulator**: Injectable animated helicopter flight loop across 12 mission waypoints with transparent `[SIMULATED]` badges.

---

### 9. 🚑 Grounded 108 Emergency / NDRF Deployment Simulator
- **Anchored to Real OpenStreetMap Hospitals**: Dispatches emergency units (108 Ambulances, NDRF Rescue Trucks, Fire Tenders, SDRF Boats) directly from verified municipal hospitals to the active flood/disaster epicenter.
- **Physics-Inspired Road Network Trajectory**: Computes realistic curved arterial paths, true spherical distance ($\text{km}$), and dynamic countdown ETA.
- **Interactive Map Popups & Banner**: Triggerable directly by clicking any hospital marker or via the GIS Layers panel, complete with persistent live dispatch HUD tracker.

---

### 10. 🚌 Delhi Open Transit Data (AIS-140 GNSS) & Urban Fleets
- **Live Delhi OTD Ingest**: Streams real-time GTFS-Realtime Protocol Buffer data (`VehiclePositions.pb`) tracking **4,900+ active buses** across Delhi NCR.
- **Hover-Revealed Badges**: Distinguishes live GNSS buses (`LIVE · <ID>`) from kinematic simulated municipal fleets (`SIM · <ID>`) with clean hover-activated labels.

---

### 11. 🎬 Transparent Stage Demo Mode & Offline Resilience
- **Zero-Deception Demo Architecture**: CivicTwin includes a transparent, global **Demo Mode** (`/api/demo-mode`) that forces all services into their honest simulated/calibrated baseline state on command.
- **Venue WiFi Resilience**: Allows glitch-free stage presentations on unstable venue WiFi while maintaining complete provenance honesty.
- **Always-Visible On-Screen Indicators**: When Demo Mode is active, an orange on-screen top banner and header indicator explicitly label all displayed data as `DEMO_SIMULATED` / `CALIBRATED_BASELINE` rather than live telemetry.

---

### 12. 🗺️ Sovereign Indian Boundary Locking & 4-Tier Access Control
- **Strict Indian Hard Wall**: Map camera bounds locked to `INDIA_BOUNDS = [[6.5, 68.0], [37.5, 97.5]]` with `maxBoundsViscosity: 1.0` forbidding panning outside national territory.
- **Hierarchical Access Control**:
  - **👑 National Authority (Level 5)**: Full Pan-India command, all 28 states & 8 UTs, national Doppler radar grid, inter-state tactical dispatch.
  - **🏢 State SDMA Officer (Level 3)**: Locked strictly to assigned state boundary (`minZoom: 6`), managing all districts within the state.
  - **📍 District DDMA Officer (Level 2)**: Locked strictly to assigned district centroid ($\pm 0.45^\circ$, `minZoom: 10`), municipal ward triage, local subways, and shelters.
  - **👥 Public Citizen (Level 1)**: Citizen Safety Portal with local helplines (112, 1070, 1077, 108), 1-Click SOS GPS Beacon, Gemini AI safety guide, safe shelters, and flooded road alerts.

---

## 🚀 Quick Start

### 1. Launch Everything (Windows)
Double-click `run_civictwin.bat` in the root directory.

### 2. Manual Startup

#### Backend (FastAPI + Python 3.11/3.13)
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
API Documentation: `http://127.0.0.1:8000/docs`

#### Frontend (React 19 + Vite + Tailwind CSS + MapLibre 3D + Three.js)
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** (or `http://localhost:5174`) in your browser.

---

## 📊 Data Provenance & Integration Reality Matrix

CivicTwin AI maintains strict data truthfulness across all spatial and telemetry pipelines:

| Data Feed / Source | Integration Method | Live / Calibrated Status | Error / Offline Behavior |
| :--- | :--- | :--- | :--- |
| **OpenTopography DEM** | REST API (`/API/globaldem`) with Key | 🟢 **LIVE** (Copernicus 30m COP30 / SRTMGL1) | Cached GeoTIFF raster fallback in `dem_cache/` |
| **Subterranean SWD Hydraulics** | 1D Saint-Venant + Manning Equation | 🟢 **PHYSICAL ENGINE** (8 Nodes, 9 Pipes) | Real-time backpressure & geyser eruption modeling |
| **CV Waterway Safety** | Dense Farnebäck Optical Flow + YOLO | 🟢 **EDGE INFERENCE** (30 FPS Stream) | Computes $\vec{u}, \vec{v}$ velocity & prop strike radar |
| **MapLibre 3D Terrain** | WebGL 3D Raster-DEM + Esri Sat | 🟢 **HARDWARE 3D** (Pitch $0^\circ \to 85^\circ$) | Satellite / Dark / OSM basemap switcher |
| **ISRO Bhoonidhi STAC** | Official JWT Bearer STAC Catalog API | 🟢 **LIVE** (NISAR, EOS-06 SCAT, LISS-4, Sentinel-1A) | Returns `status: "unauthenticated"` with 0 fake records |
| **IMD Doppler Radar** | Official `mausam.imd.gov.in` GIF Stream | 🟢 **LIVE** (Mumbai, Delhi, Hyderabad, Mosaic) | Fallback to latest archived radar scan |
| **OpenSky ADS-B Tracking** | Live Mode-S Transponder Stream | 🟢 **LIVE** (DGCA India Registry Filter) | Recent sightings cached $\le 24\text{h}$, then purged |
| **Delhi Open Transit Data** | Official GTFS-RT Protobuf Feed | 🟢 **LIVE** (4,900+ Active Buses) | Falls back to simulated municipal fleets |
| **108 Hospital Dispatch** | `emergency_deployment_service.py` | 🎬 **GROUNDED SIMULATION** | Dispatches from verified OSM hospitals with live ETA |
| **NDMA Sachet Alerts** | Government CAP XML/JSON Feed | 🟢 **LIVE** (Official Multi-Hazard Alerts) | Displays offline warning banner |
| **ISRO Bhuvan Satellite** | NRSC Bhuvan WMS & Geo-APIs | 🟡 **LIVE WMS + SEEDED POIs** | Seamless fallback to Indian geodetic database |
| **USGS / NDWC Earthquakes** | USGS GeoJSON Real-Time API | 🟢 **LIVE** (M2.5+ Global & India Focal Depth) | Displays offline telemetry warning |
| **TomTom Traffic Flow** | Real-Time Vector/Raster Flow API | 🟢 **LIVE** (Speed Delta & Incident Congestion) | Reverts to baseline street topology |
| **Vidyut Pravah Grid** | Ministry of Power Vidyut Pravah Stream | 🟢 **LIVE** (Demand Met / Peak Shortage MW) | Reverts to modeled regional baseline |

---

## 🏛️ Government Compliance & Standards
- **NDMA CAP (Common Alerting Protocol)** Compliant (XML / RSS v1.0)
- **ISRO Bhuvan / MOSDAC / Bhoonidhi** Open Geospatial Web Service Standards
- **OpenTopography / Copernicus Open Access Hub** GeoTIFF & SAR Polarimetry
- **DGCA India Civil Aircraft Registry** & ICAO India allocation block compliant
- **Strict SSL Certificate Verification** via Mozilla CA Trust Store (`certifi`)
- **256-Bit AES / HMAC-SHA256 Encrypted** JWT Clearance & API Gateway Storage
