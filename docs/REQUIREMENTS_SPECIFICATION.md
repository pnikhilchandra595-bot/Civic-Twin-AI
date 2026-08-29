# 📋 CIVICTWIN AI — REQUIREMENTS SPECIFICATION DOCUMENT
**Software Requirements Specification (SRS) for National Disaster Digital Twin**

---

## 1. Introduction

### 1.1 Purpose
This document specifies the functional, non-functional, and interface requirements for the **CivicTwin AI** platform, defining the system capabilities across sovereign geospatial boundary locking, 4-tier role-based access control, multi-source sensor and satellite ingestion, live transit & aviation tracking, emergency hospital dispatch simulation, hydrodynamic cascade modeling, and transparent stage demo resilience.

### 1.2 Scope
CivicTwin AI serves disaster management authorities across India, including:
- **National Level**: National Disaster Management Authority (NDMA), National Disaster Response Force (NDRF), Prime Minister's Office (PMO).
- **State Level**: State Disaster Management Authorities (SDMA), State Disaster Response Forces (SDRF).
- **District Level**: District Disaster Management Authorities (DDMA), Municipal Corporations, District Magistrates.
- **Civilians**: Indian citizens residing in or traveling through disaster-affected corridors.

---

## 2. Functional Requirements (FR)

### FR-1: Sovereign Geographic & Map Viewport Restrictions
- **FR-1.1**: The interactive Leaflet GIS canvas **MUST** enforce hard boundary limits locked to the Republic of India: `[[6.5°N, 68.0°E], [37.5°N, 97.5°E]]` with `maxBoundsViscosity: 1.0`.
- **FR-1.2**: Camera movement, panning, and zooming outside sovereign Indian borders **MUST** be physically prevented by the viewport controller.
- **FR-1.3**: For State Officers, the camera boundary **MUST** dynamically lock to the assigned state bounding box (`minZoom: 6`). Any click outside triggers an access violation banner.
- **FR-1.4**: For District Officers, the camera boundary **MUST** lock to the assigned district centroid ($\pm 0.45^\circ$, `minZoom: 10`).
- **FR-1.5**: The Map Viewport in dedicated GIS mode **MUST** provide an expanded, full-bleed experience (`h-[calc(100vh-210px)]`, `99vw` width) with unified frosted-glass HUD toolbars.

---

### FR-2: 4-Tier Hierarchical Access Control (RBAC)
- **FR-2.1 (Level 5 — National Authority)**: Full read/write access to all 780+ Indian districts across all 36 States/UTs, Pan-India radar mosaic, inter-state NDRF battalion dispatch, and national CAP emergency alert broadcasting.
- **FR-2.2 (Level 3 — State SDMA Officer)**: Filtered access strictly scoped to the assigned State; automatic district metric drilldown.
- **FR-2.3 (Level 2 — District DDMA Officer)**: Access restricted strictly to assigned municipal district, ward-level inundation tracking, and local relief shelters.
- **FR-2.4 (Level 1 — Public Citizen)**: Simplified, responsive civilian portal with 1-Click SOS GPS Beacon broadcast, localized emergency helpline directory (112, 1070, 1077, 108), Gemini AI conversational safety advice, and active flooded road warnings.

---

### FR-3: Multi-Source Spaceborne & Meteorological Ingestion
- **FR-3.1 (ISRO MOSDAC)**: Continuous polling of INSAT-3D/3DR TIR-1 cloud-top temperatures ($209\,\text{K}$) and Hydro-Estimator precipitation rates (`3SIMG_L2B_HEM`).
- **FR-3.2 (ISRO Bhuvan & Bhoonidhi)**: Ingests Bhuvan OGC WMS overlays, hospital registries, and Bhoonidhi STAC catalog radar passes (NISAR, Sentinel-1A).
- **FR-3.3 (IMD Doppler Weather Radars)**: Real-time ingestion and display of animated Doppler reflectivity loops (`MUM_MAXZ.gif`, `DLH_MAXZ.gif`, `HYD_MAXZ.gif`, `mosaic.gif`) in native resolution.
- **FR-3.4 (Copernicus Sentinel-1/2)**: C-Band Synthetic Aperture Radar (SAR) backscatter ($\sigma^0 < -16\,\text{dB}$) water extraction and Sentinel-2 multispectral NDWI damage grading.
- **FR-3.5 (NASA FIRMS)**: Near real-time VIIRS 375m and MODIS thermal anomaly and active fire hotspots.

---

### FR-4: Two-Tier Disaster Aircraft Tracking & Aviation Stream
- **FR-4.1 (OpenSky ADS-B Ingestion)**: Live transponder streaming across Indian airspace with continuous 6-second polling and elevated layer z-index (`zIndexOffset: 8500`).
- **FR-4.2 (Two-Tier Sourced Registry Matching)**:
  - **Tier 1 (Civil State & Pawan Hans Fleets)**: Matching against verified DGCA hex codes (`80026e`, `8004f2`, `8003a9`, `8006b1`, `800794`, `80027f`).
  - **Tier 2 (Military Tactical Airlift)**: Matching against IAF asset codes (`80018a`, `80018b`, `800041`, `800531`).
- **FR-4.3 (24-Hour Cache Lifecycle)**: Cached sightings **MUST** be timestamped with UTC/IST time and automatically purged after **24.0 hours**.
- **FR-4.4 (Dynamic Moving Sortie Simulator)**: Real-time animated helicopter flight path executing a 12-waypoint loop with transparent `[SIMULATED]` badges.

---

### FR-5: Ground Transit Telemetry & Simulated Smart City Fleets
- **FR-5.1 (Delhi Open Transit Data)**: Ingestion of live AIS-140 GTFS-Realtime Protocol Buffer telemetry (`VehiclePositions.pb`) tracking **4,900+ active buses** across Delhi NCR.
- **FR-5.2 (Multi-State Smart City Fleets)**: Kinematic simulation of municipal emergency fleets (Ambulances, Fire, Transit) across major smart cities (Mumbai, Bengaluru, Chennai, Kochi, Hyderabad).
- **FR-5.3 (Marker Decluttering & Provenance)**: Vehicle pins **MUST** render compact icon dots by default and reveal `[LIVE · ID]` or `[SIM · ID]` tags on hover/click to prevent visual clutter.

---

### FR-6: Grounded 108/NDRF Emergency Hospital Dispatch Simulator
- **FR-6.1 (Real Hospital Anchoring)**: Emergency dispatches **MUST** originate from verified OpenStreetMap/Registry hospitals ingested in the active region.
- **FR-6.2 (Curved Road Network Trajectory)**: Computes a realistic curved roadway path from the hospital to the active disaster zone.
- **FR-6.3 (Dynamic Telemetry & ETA)**: Computes real spherical distance ($\text{km}$) and animated ETA countdown ($\text{min}$) based on unit vehicle speed.
- **FR-6.4 (Interactive UI Trigger & HUD)**: Dispatches can be triggered via hospital marker popups or the GIS Layers menu, showing a live HUD tracking banner.

---

### FR-7: Transparent Stage Demo Mode & Offline Resilience
- **FR-7.1 (Global State Switch)**: Backend `DemoState` class exposed via `GET /api/demo-mode` and admin-gated `POST /api/demo-mode`.
- **FR-7.2 (Instant External Bypass)**: When Demo Mode is ON, all 11 live services bypass network queries and immediately return calibrated reference data stamped with `data_mode: "demo_simulated"`.
- **FR-7.3 (Persistent Header & Top Banner)**: Visual indication in the header pill (`[ 🎬 DEMO ]` vs `[ 🛰️ REAL ]`) and a persistent sticky amber banner across the top of the interface.

---

### FR-8: Physics-Informed Cascade & "What-If" Simulation
- **FR-8.1 (2D Saint-Venant Shallow Water Model)**: Computes water depth $h$, flow velocity $v$, and Froude number $Fr$.
- **FR-8.2 (Infrastructure Cascade Propagation)**: Models power substation trips, secondary pump failures, hospital ICU generator fuel exhaustion, and road cutoffs.
- **FR-8.3 (Scenario Sandbox)**: Interactive sliders for rainfall intensity ($0\text{--}150\,\text{mm/h}$), storm surge ($0\text{--}4\,\text{m}$), and levee breaches with timeline playback.

---

## 3. Non-Functional Requirements (NFR)

### NFR-1: Performance & Latency
- **NFR-1.1**: Map interaction and layer toggle rendering latency **MUST** remain below $16.6\,\text{ms}$ ($60\,\text{FPS}$).
- **NFR-1.2**: Backend REST API response times for district telemetry **MUST** be $< 200\,\text{ms}$ under normal load ($< 5\,\text{ms}$ in Demo Mode).
- **NFR-1.3**: WebSocket state broadcast latency **MUST** be $< 50\,\text{ms}$.

### NFR-2: Reliability & Availability
- **NFR-2.1**: Automated fallback mechanisms for all external APIs ensuring zero stage crashes.
- **NFR-2.2**: 99.9% uptime target during active disaster response operations.

### NFR-3: Security & Governance
- **NFR-3.1**: Authentication via 256-bit AES encrypted tokens; passkeys and credentials stored securely in `.env`.
- **NFR-3.2**: Strict role authorization on control endpoints (`/api/control`, `/api/demo-mode`, `/api/integrations/config`).
- **NFR-3.3**: Zero external data leakage of sensitive user GPS coordinates.
