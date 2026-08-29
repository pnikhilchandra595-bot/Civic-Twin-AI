# 🏛️ CIVICTWIN AI — PROJECT OVERVIEW
**India's Operational Multi-Hazard Disaster Response & Civil Defense Digital Twin**

---

## 1. Executive Summary

**CivicTwin AI** is an advanced, production-grade cyber-physical digital twin engineered to predict, simulate, and coordinate multi-hazard disaster response and civil defense operations across all **780+ Indian districts** and **36 States/Union Territories**.

By fusing sovereign spaceborne remote sensing (ISRO MOSDAC, ISRO Bhuvan NRSC, Bhoonidhi STAC, Copernicus Sentinel-1/2 SAR, NASA FIRMS), official real-time meteorological Doppler radars (IMD Mausam), 2D hydrodynamic physics engines, live GNSS transit streams (Delhi OTD AIS-140), live aviation ADS-B transponder filtering (OpenSky Network), zero-latency hardware computer vision (webcams and mobile cameras), and Google Gemini AI, CivicTwin AI bridges the critical operational gap between **National Command (NDMA)**, **State Authorities (SDMA)**, **District Collectors (DDMA)**, and **Vulnerable Citizens**.

---

## 2. Core Capabilities & Architectural Highlights

```mermaid
graph TD
    A[CivicTwin AI Core Engine] --> B[Sovereign Spaceborne & Radar Feeds]
    A --> C[Physics-Informed Cascade Engine]
    A --> D[Two-Tier Aviation & Sortie Simulator]
    A --> E[Grounded 108/NDRF Hospital Dispatch Simulator]
    A --> F[4-Tier Hierarchical Access Control]
    A --> G[Transparent Stage Demo Mode]

    B --> B1[ISRO MOSDAC / Bhuvan / Bhoonidhi • IMD Doppler • Sentinel SAR]
    C --> C1[Saint-Venant 2D Floods • Substation Trips • Road Closures]
    D --> D1[Pawan Hans / State Helis / IAF Airlift • 24h Cache • Dynamic Sortie]
    E --> E1[Real OSM Hospitals • Road Corridor Curve • ETA & Arrival HUD]
    F --> F1[National L-5 • State SDMA L-3 • District DDMA L-2 • Citizen L-1]
    G --> G1[Zero-Latency Offline Mode • Persistent Banner • Honest Provenance]
```

### 🛰️ 1. Multi-Satellite & Radar Remote Sensing Hub
- **ISRO MOSDAC (SAC Ahmedabad)**: Ingests INSAT-3D/3DR geostationary thermal infrared brightness temperatures ($209\,\text{K} / -64^\circ\text{C}$) and Hydro-Estimator real-time rainfall precipitation rates (`3SIMG_L2B_HEM`).
- **ISRO Bhuvan (NRSC Hyderabad)**: OGC WMS vector overlays, hospital POIs, village geocoding directories, and CartoDEM terrain models.
- **ISRO Bhoonidhi STAC**: Ingests Sentinel-1A SAR, NISAR, and LISS-4 imagery metadata directly over Indian state bounds.
- **IMD Mausam Doppler Weather Radars**: Real-time live animated radar loops (`MUM_MAXZ.gif`, `DLH_MAXZ.gif`, `HYD_MAXZ.gif`, and National `mosaic.gif`) streaming cloud reflectivity and storm motion into both Single Focus and Matrix (4x4) views.
- **Copernicus Sentinel-1 SAR & Sentinel-2 Optical**: Cloud-penetrating C-Band radar backscatter ($\sigma^0 < -16\,\text{dB}$) for night/storm water extraction and $10\text{m}$ multispectral NDWI/NDVI vegetation and asset damage grading.
- **NASA FIRMS (VIIRS 375m & MODIS)**: Thermal active hotspots and Fire Radiative Power ($\text{MW}$).

### ✈️ 2. Two-Tier Disaster Response Aviation & Sortie Simulator
- **Verified Sourced ICAO24 Fleet Registry**:
  - **Tier 1 (Civil Disaster Assets)**: Verified DGCA India civil aircraft hex codes (Pawan Hans Dauphin AS365 `VT-PHA`/`VT-PHD`, Maharashtra S-76 `VT-MHA`, Gujarat Bell 412 `VT-GVT`, Telangana AW139 `VT-TSG`, State Eurocopter `VT-EHL`).
  - **Tier 2 (Military Tactical Airlift)**: Documented IAF C-130J Super Hercules (`KC-3801`/`KC-3802`), C-17 Globemaster III (`CB-8001`), and Mi-17V-5 (`Z-3431`) rescue units.
- **Continuous 6-Second Telemetry Polling**: Real-time transponder updates with elevated layer z-index (`zIndexOffset: 8500`) and clickable interactive telemetry popups.
- **Dynamic Real-Time Sortie Flight Simulator**: Dedicated **`🚁 Launch Demo NDRF Sortie`** tool that injects an animated helicopter flight loop across 12 mission waypoints with transparent `[SIMULATED]` labeling.

### 🚑 3. Grounded 108/NDRF Emergency Hospital Dispatch Simulator
- **Anchored to Real OpenStreetMap Hospitals**: Dispatches emergency units (108 Ambulances, NDRF Rescue Trucks, Fire Tenders, SDRF Boats) directly from verified municipal hospitals to the active flood/disaster epicenter.
- **Physics-Inspired Road Network Trajectory**: Computes realistic curved arterial paths, true spherical distance ($\text{km}$), and dynamic countdown ETA.
- **Interactive Map Popups & Banner**: Triggerable directly by clicking any hospital marker or via the GIS Layers panel, complete with persistent live dispatch HUD tracker.

### 🚌 4. Delhi Open Transit Data (AIS-140 GNSS) & Urban Fleets
- **Live Delhi OTD Ingest**: Streams real-time GTFS-Realtime Protocol Buffer data (`VehiclePositions.pb`) tracking **4,900+ active buses** across Delhi NCR.
- **Hover-Revealed Badges**: Distinguishes live GNSS buses (`LIVE · <ID>`) from kinematic simulated municipal fleets (`SIM · <ID>`) with clean hover-activated labels.

### 🎬 5. Transparent Stage Demo Mode & Offline Presentation Resilience
- **One-Click Admin Gated Switch**: Instant toggle (`/api/demo-mode`) that forces all 11 backend services to bypass live external queries and immediately return calibrated reference data.
- **Zero-Ambiguity Provenance**: Stamped with `data_mode: "demo_simulated"` and displayed on a persistent, pulsing amber top banner so live presentation audiences always have complete transparency.

### 🗺️ 6. Sovereign Indian Boundary Limits & 4-Tier Access Control
- **Strict Indian Hard Wall**: Map camera bounds locked to `INDIA_BOUNDS = [[6.5, 68.0], [37.5, 97.5]]` with `maxBoundsViscosity: 1.0`. Dragging or panning outside Indian national borders is forbidden.
- **Hierarchical Clearance Model**:
  - **👑 National Authority (Level 5)**: Full Pan-India command, all 28 states & 8 UTs, national Doppler radar grid, inter-state tactical dispatch.
  - **🏢 State SDMA Officer (Level 3)**: Locked strictly to assigned state boundary (`minZoom: 6`), managing all districts within that state.
  - **📍 District DDMA Officer (Level 2)**: Locked strictly to assigned district centroid ($\pm 0.45^\circ$, `minZoom: 10`), municipal ward triage, and relief camps.
  - **👥 Public Citizen (Level 1)**: Dedicated Citizen Safety Portal with local emergency helplines (112, 1070, 1077, 108), 1-Click SOS GPS Beacon, Gemini AI safety guide, and safe shelters list.

---

## 3. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Leaflet GIS, Lucide Icons, KaTeX Math |
| **Backend** | Python 3.11/3.13, FastAPI, Uvicorn, Pydantic v2, WebSockets, AsyncIO, SQLite/PostgreSQL |
| **AI & LLM** | Google Gemini 1.5 Flash/Pro, Prompt Engineering for Incident Command Systems (ICS-201) |
| **Computer Vision** | YOLOv8 Object Detection, FLIR Thermal Shader Simulation, Night Vision Matrix |
| **Data Ingestion** | OpenSky Network ADS-B, IMD Mausam, ISRO MOSDAC/Bhuvan/Bhoonidhi, Delhi OTD, Open-Meteo, GloFAS, USGS, TomTom, AISStream |
| **Telecom** | Twilio Carrier Gateway, Fast2SMS, Common Alerting Protocol (CAP v1.2) |

---

## 4. Operational Deployment

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1-Click Startup
Double-click `run_civictwin.bat` in the repository root.

### Manual Startup
```bash
# Terminal 1: Backend
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

Access the platform at **`http://localhost:5173`**.
