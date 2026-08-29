# 🏛️ CivicTwin AI – India Disaster Response & Civil Defense Digital Twin

> 🇮🇳 **India's Operational Multi-Hazard Disaster Response & Civil Defense Digital Twin** — Powered by live ISRO MOSDAC, Bhuvan & Bhoonidhi satellite pipelines, Copernicus Sentinel-1 SAR Radar, 2D Hydrodynamic Physics Engines, Official IMD Doppler Weather Radar loops, Two-Tier NDRF/Disaster Aircraft Tracking, Delhi Open Transit GNSS stream, Grounded 108/NDRF Hospital Dispatch Simulator, Google Gemini AI Incident Commander, and Offline 112 Cellular SMS Lifelines across all 780+ Indian Districts.

---

## 🌟 Key Architectural Pillars & Innovations

### 1. 🛰️ Spaceborne Intelligence & Official Sovereign Feeds
- **ISRO MOSDAC (SAC Ahmedabad)**: Live atmospheric telemetry querying `https://mosdac.gov.in/apios/datasets.json`. Ingests INSAT-3D/3DR TIR-1 cloud-top brightness temperatures ($209\,\text{K} / -64^\circ\text{C}$) and Hydro-Estimator precipitation rain rates (`3SIMG_L2B_HEM`).
- **ISRO Bhuvan & Bhoonidhi (NRSC Hyderabad)**:
  - OGC WMS vector overlays, hospital POIs, village geocoding directories, and CartoDEM terrain models.
  - Bhoonidhi STAC catalog API query engine for NISAR, Sentinel-1A SAR, and LISS-4 imagery metadata over Indian state bounds.
- **Official IMD Doppler Weather Radars (`mausam.imd.gov.in`)**:
  - Live animated Doppler reflectivity scans (`MUM_MAXZ.gif`, `DLH_MAXZ.gif`, `HYD_MAXZ.gif`, and All-India `mosaic.gif`) rendered in both Single Focus and Matrix (4x4) views.
- **Copernicus Sentinel-1 & 2 SAR / Optical**: Active C-band microwave radar backscatter ($\sigma^0 < -16.0\,\text{dB}$) for cloud-penetrating water extraction and Sentinel-2 NDWI ($+0.42$).
- **NASA FIRMS**: VIIRS thermal anomaly hotspots and Fire Radiative Power ($28.6\,\text{MW}$).

---

### 2. ✈️ Two-Tier Disaster Response Aircraft Tracking & Dynamic Sortie Simulator
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

### 3. 🚑 Grounded 108 Emergency / NDRF Deployment Simulator
- **Anchored to Real OpenStreetMap Hospitals**: Dispatches emergency units (108 Ambulances, NDRF Rescue Trucks, Fire Tenders, SDRF Boats) directly from verified municipal hospitals to the active flood/disaster epicenter.
- **Physics-Inspired Road Network Trajectory**: Computes realistic curved arterial paths, true spherical distance ($\text{km}$), and dynamic countdown ETA.
- **Interactive Map Popups & Banner**: Triggerable directly by clicking any hospital marker or via the GIS Layers panel, complete with persistent live dispatch HUD tracker.

---

### 4. 🚌 Delhi Open Transit Data (AIS-140 GNSS) & Urban Fleets
- **Live Delhi OTD Ingest**: Streams real-time GTFS-Realtime Protocol Buffer data (`VehiclePositions.pb`) tracking **4,900+ active buses** across Delhi NCR.
- **Hover-Revealed Badges**: Distinguishes live GNSS buses (`LIVE · <ID>`) from kinematic simulated municipal fleets (`SIM · <ID>`) with clean hover-activated labels.

---

### 5. 🎬 Transparent Stage Demo Mode & Offline Resilience
- **Zero-Deception Demo Architecture**: CivicTwin includes a transparent, global **Demo Mode** (`/api/demo-mode`) that forces all services into their honest simulated/calibrated baseline state on command.
- **Venue WiFi Resilience**: Allows glitch-free stage presentations on unstable venue WiFi while maintaining complete provenance honesty.
- **Always-Visible On-Screen Indicators**: When Demo Mode is active, an orange on-screen top banner and header indicator explicitly label all displayed data as `DEMO_SIMULATED` / `CALIBRATED_BASELINE` rather than live telemetry.

---

### 6. 🗺️ Sovereign Indian Boundary Locking & 4-Tier Access Control
- **Strict Indian Hard Wall**: Map camera bounds locked to `INDIA_BOUNDS = [[6.5, 68.0], [37.5, 97.5]]` with `maxBoundsViscosity: 1.0` forbidding panning outside national territory.
- **Hierarchical Access Control**:
  - **👑 National Authority (Level 5)**: Full Pan-India command, all 28 states & 8 UTs, national Doppler radar grid, inter-state tactical dispatch.
  - **🏢 State SDMA Officer (Level 3)**: Locked strictly to assigned state boundary (`minZoom: 6`), managing all districts within the state.
  - **📍 District DDMA Officer (Level 2)**: Locked strictly to assigned district centroid ($\pm 0.45^\circ$, `minZoom: 10`), municipal ward triage, local subways, and shelters.
  - **👥 Public Citizen (Level 1)**: Citizen Safety Portal with local helplines (112, 1070, 1077, 108), 1-Click SOS GPS Beacon, Gemini AI safety guide, safe shelters, and flooded road alerts.

---

### 7. 📹 Real-Time CCTV Matrix & 1-Click Laptop Webcam Ingestion
- **1-Click Laptop Webcam**: Direct zero-latency hardware ingestion via `navigator.mediaDevices.getUserMedia()`, overlaying real-time YOLO computer vision detections, bounding boxes, and FLIR thermal color palettes.
- **Direct IP / Mobile Cameras**: Ingestion of smartphone RTSP/MJPEG feeds (`http://<PHONE_IP>:8080/video`) for rapid field deployment.

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

#### Frontend (React 18 + Vite + Tailwind CSS)
```bash
cd frontend
npm install
npm run dev
```

Open **`http://localhost:5173`** in your browser.

---

## 📊 Data Provenance & Integration Reality Matrix

CivicTwin AI maintains strict data truthfulness across all spatial and telemetry pipelines:

| Data Feed / Source | Integration Method | Live / Calibrated Status | Error / Offline Behavior |
| :--- | :--- | :--- | :--- |
| **ISRO Bhoonidhi STAC** | Official JWT Bearer STAC Catalog API | 🟢 **LIVE** (NISAR, EOS-06 SCAT, LISS-4, Sentinel-1A) | Returns `status: "unauthenticated"` or `"query_failed"` with 0 fake records |
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
- **NDMA CAP (Common Alerting Protocol)** Compliant
- **ISRO Bhuvan / MOSDAC / Bhoonidhi** Open Geospatial Web Service Standards
- **Copernicus Open Access Hub** GeoTIFF & SAR Polarimetry
- **DGCA India Civil Aircraft Registry** & ICAO India allocation block compliant
- **Strict SSL Certificate Verification** via Mozilla CA Trust Store (`certifi`)
- **256-Bit AES / HMAC-SHA256 Encrypted** JWT Clearance & API Gateway Storage
