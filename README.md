# 🏛️ CivicTwin AI – India Disaster Response & Civil Defense Digital Twin

> 🇮🇳 **India's Operational Multi-Hazard Disaster Response & Civil Defense Digital Twin** — Powered by live ISRO MOSDAC & Bhuvan satellite pipelines, Copernicus Sentinel-1 SAR Radar, 2D Hydrodynamic Physics Engines, Official IMD Doppler Weather Radar loops, Two-Tier NDRF/Disaster Aircraft Tracking, Google Gemini AI Incident Commander, and Offline 112 Cellular SMS Lifelines across all 780+ Indian Districts.

---

## 🌟 Key Architectural Pillars & Innovations

### 1. 🛰️ Spaceborne Intelligence & Official Sovereign Feeds
- **ISRO MOSDAC (SAC Ahmedabad)**: Live atmospheric telemetry querying `https://mosdac.gov.in/apios/datasets.json`. Ingests INSAT-3D/3DR TIR-1 cloud-top brightness temperatures ($209\,\text{K} / -64^\circ\text{C}$) and Hydro-Estimator precipitation rain rates (`3SIMG_L2B_HEM`).
- **ISRO Bhuvan (NRSC Hyderabad)**: Configured via secure environment variables (`BHUVAN_*_KEY`):
  - `BHUVAN_HOSPITAL_POSTAL_KEY` — Hospital & Postal Lifeline POIs
  - `BHUVAN_VILLAGE_GEOCODE_KEY` — Village & Ward Geocoding Directory
  - `BHUVAN_LULC_STATICS_KEY` — 1:50K LULC Runoff Statistics ($C = 0.78$)
  - `BHUVAN_LULC_AOI_KEY` — AOI-wise Land Cover Allocation
  - `BHUVAN_ROUTING_KEY` — Evacuation Road Network Routing
  - `BHUVAN_GEOID_KEY` — High-Precision Indian Geoid Elevation Model
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
- **Transparent 3-State Telemetry & 24h Cache Lifecycle**:
  - 🟢 **`LIVE ADS-B`**: Real-time transponder signal matched on OpenSky Network.
  - 🟡 **`LAST RECORDED`**: Sighting timestamped with exact UTC/IST time and strictly purged after a **24-hour cutoff**.
  - 🟠 **`SIMULATED SORTIE`**: Dynamic real-time moving flight path that visibly flies across active inundation sectors with mission waypoints (Takeoff $\rightarrow$ Airdrop 400 ration packs $\rightarrow$ Winch extraction $\rightarrow$ Return base).

---

### 3. 🗺️ Sovereign Indian Boundary Locking & 4-Tier Access Control
- **Strict Indian Hard Wall**: Map camera bounds locked to `INDIA_BOUNDS = [[6.5, 68.0], [37.5, 97.5]]` with `maxBoundsViscosity: 1.0` forbidding panning outside national territory.
- **Hierarchical Access Control**:
  - **👑 National Authority (Level 5)**: Full Pan-India command, all 28 states & 8 UTs, national Doppler radar grid, inter-state tactical dispatch.
  - **🏢 State SDMA Officer (Level 3)**: Locked strictly to assigned state boundary (`minZoom: 6`), managing all districts within the state.
  - **📍 District DDMA Officer (Level 2)**: Locked strictly to assigned district centroid ($\pm 0.45^\circ$, `minZoom: 10`), municipal ward triage, local subways, and shelters.
  - **👥 Public Citizen (Level 1)**: Citizen Safety Portal with local helplines (112, 1070, 1077, 108), 1-Click SOS GPS Beacon, Gemini AI safety guide, safe shelters, and flooded road alerts.

---

### 4. 📹 Real-Time CCTV Matrix & 1-Click Laptop Webcam Ingestion
- **1-Click Laptop Webcam**: Direct zero-latency hardware ingestion via `navigator.mediaDevices.getUserMedia()`, overlaying real-time YOLO computer vision detections, bounding boxes, and FLIR thermal color palettes.
- **Direct IP / Mobile Cameras**: Ingestion of smartphone RTSP/MJPEG feeds (`http://<PHONE_IP>:8080/video`) for rapid field deployment.

---

## 🚀 Quick Start

### 1. Launch Everything (Windows)
Double-click `run_civictwin.bat` in the root directory.

### 2. Manual Startup

#### Backend (FastAPI + Python 3.11)
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

## 🏛️ Government Compliance & Standards
- **NDMA CAP (Common Alerting Protocol)** Compliant
- **ISRO Bhuvan / MOSDAC** Open Geospatial Web Service Standards
- **Copernicus Open Access Hub** GeoTIFF & SAR Polarimetry
- **DGCA India Civil Aircraft Registry** & ICAO India allocation block compliant
- **256-Bit AES / HMAC-SHA256 Encrypted** JWT Clearance & API Gateway Storage
