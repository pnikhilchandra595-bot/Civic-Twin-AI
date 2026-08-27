# 📋 CIVICTWIN AI — REQUIREMENTS SPECIFICATION DOCUMENT
**Software Requirements Specification (SRS) for National Disaster Digital Twin**

---

## 1. Introduction

### 1.1 Purpose
This document specifies the functional, non-functional, and interface requirements for the **CivicTwin AI** platform, defining the system capabilities across sovereign geospatial boundary locking, 4-tier role-based access control, multi-source sensor and satellite ingestion, aviation tracking, hydrodynamic cascade modeling, and citizen safety assistance.

### 1.2 Scope
CivicTwin AI serves disaster management authorities across India, including:
- **National Level**: National Disaster Management Authority (NDMA), National Disaster Response Force (NDRF), Prime Minister's Office (PMO).
- **State Level**: State Disaster Management Authorities (SDMA), State Disaster Response Forces (SDRF).
- **District Level**: District Disaster Management Authorities (DDMA), Municipal Corporations, District Magistrates.
- **Civilians**: Indian citizens residing in or traveling through disaster-affected corridors.

---

## 2. Functional Requirements (FR)

### FR-1: Sovereign Geographic & Map Boundary Restrictions
- **FR-1.1**: The interactive Leaflet GIS canvas **MUST** enforce hard boundary limits locked to the Republic of India: `[[6.5°N, 68.0°E], [37.5°N, 97.5°E]]` with `maxBoundsViscosity: 1.0`.
- **FR-1.2**: Camera movement, panning, and zooming outside sovereign Indian borders **MUST** be physically prevented by the viewport controller.
- **FR-1.3**: For State Officers, the camera boundary **MUST** dynamically lock to the assigned state bounding box (`minZoom: 6`). Any click outside triggers an access violation banner.
- **FR-1.4**: For District Officers, the camera boundary **MUST** lock to the assigned district centroid ($\pm 0.45^\circ$, `minZoom: 10`).

---

### FR-2: 4-Tier Hierarchical Access Control (RBAC)
- **FR-2.1 (Level 5 — National Authority)**:
  - Full read/write access to all 780+ Indian districts across all 36 States and Union Territories.
  - Pan-India radar mosaic grid, inter-state NDRF battalion dispatch, and national CAP emergency alert broadcasting.
- **FR-2.2 (Level 3 — State SDMA Officer)**:
  - Filtered access strictly scoped to the assigned State (e.g. Telangana, Maharashtra, Gujarat).
  - Ability to inspect and drill down into all districts within their state jurisdiction; tools and metrics scope automatically.
- **FR-2.3 (Level 2 — District DDMA Officer)**:
  - Access restricted strictly to their assigned municipal district (e.g. Mumbai Suburban, Hyderabad, Surat).
  - Localized ward-level inundation tracking, municipal relief shelters, local CCTV feeds, and dewatering pump deployments.
- **FR-2.4 (Level 1 — Public Citizen)**:
  - Simplified, responsive civilian portal with 1-Click SOS GPS Beacon broadcast, localized emergency helpline directory (112, 1070, 1077, 108), Gemini AI conversational safety advice, and active flooded road warnings.

---

### FR-3: Multi-Source Spaceborne & Meteorological Ingestion
- **FR-3.1 (ISRO MOSDAC)**: Continuous polling of INSAT-3D/3DR TIR-1 cloud-top temperatures ($209\,\text{K}$) and Hydro-Estimator precipitation rates (`3SIMG_L2B_HEM`).
- **FR-3.2 (IMD Doppler Weather Radars)**: Real-time ingestion and display of animated Doppler reflectivity loops (`MUM_MAXZ.gif`, `DLH_MAXZ.gif`, `HYD_MAXZ.gif`, `mosaic.gif`) in native resolution.
- **FR-3.3 (Copernicus Sentinel-1/2)**: C-Band Synthetic Aperture Radar (SAR) backscatter ($\sigma^0 < -16\,\text{dB}$) water extraction and Sentinel-2 multispectral NDWI damage grading.
- **FR-3.4 (NASA FIRMS)**: Near real-time VIIRS 375m and MODIS thermal anomaly and active fire hotspots.

---

### FR-4: Two-Tier Disaster Aircraft Tracking & Sortie Simulation
- **FR-4.1 (OpenSky ADS-B Ingestion)**: Live transponder streaming across Indian airspace bounding boxes.
- **FR-4.2 (Two-Tier Sourced Registry Matching)**:
  - **Tier 1 (Civil State & Pawan Hans Fleets)**: Matching against verified DGCA hex codes (`80026e`, `8004f2`, `8003a9`, `8006b1`, `800794`, `80027f`).
  - **Tier 2 (Military Tactical Airlift)**: Matching against IAF asset codes (`80018a`, `80018b`, `800041`, `800531`).
- **FR-4.3 (24-Hour Cache Lifecycle)**: Cached sightings **MUST** be timestamped with UTC/IST time and automatically purged after **24.0 hours**.
- **FR-4.4 (Dynamic Moving Sortie Simulator)**: Real-time animated helicopter flight path executing a 12-waypoint loop with transparent `[SIMULATED]` badges.

---

### FR-5: Tactical Computer Vision & Video Ingestion
- **FR-5.1 (1-Click Laptop Webcam)**: Zero-latency hardware camera capture via `navigator.mediaDevices.getUserMedia()` with real-time YOLO bounding box telemetry.
- **FR-5.2 (Direct IP Video)**: Streaming of smartphone MJPEG/RTSP feeds (`http://<PHONE_IP>:8080/video`) for rapid field sensor deployment.
- **FR-5.3 (Multispectral Shader Simulation)**: Real-time toggling between Normal RGB, FLIR Thermal Ironbow, and Night Vision matrices.

---

### FR-6: Physics-Informed Cascade & "What-If" Simulation
- **FR-6.1 (2D Saint-Venant Shallow Water Model)**: Computes water depth $h$, flow velocity $v$, and Froude number $Fr$ based on rainfall intensity and digital elevation models.
- **FR-6.2 (Infrastructure Cascade Propagation)**: Models power substation trips, secondary pump failures, hospital ICU generator fuel exhaustion, and road cutoffs.
- **FR-6.3 (Scenario Sandbox)**: Interactive sliders for rainfall intensity ($0\text{--}150\,\text{mm/h}$), storm surge ($0\text{--}4\,\text{m}$), and levee breaches with timeline playback ($1\times, 2\times, 5\times, 10\times$).

---

## 3. Non-Functional Requirements (NFR)

### NFR-1: Performance & Latency
- **NFR-1.1**: Map interaction and layer toggle rendering latency **MUST** remain below $16.6\,\text{ms}$ ($60\,\text{FPS}$).
- **NFR-1.2**: Backend REST API response times for district telemetry **MUST** be $< 200\,\text{ms}$ under normal load.
- **NFR-1.3**: WebSocket state broadcast latency **MUST** be $< 50\,\text{ms}$.

### NFR-2: Reliability & Availability
- **NFR-2.1**: The backend services **MUST** provide automated fallbacks for external APIs (e.g., cached IMD radar maps, fallback GloFAS hydrographs).
- **NFR-2.2**: 99.9% uptime target during active monsoon and cyclone operational windows.

### NFR-3: Security & Governance
- **NFR-3.1**: Authentication via 256-bit AES encrypted tokens; passkeys and badges stored securely.
- **NFR-3.2**: Full compliance with NDMA Common Alerting Protocol (CAP v1.2) standards.
- **NFR-3.3**: Zero external data leakage of sensitive user GPS coordinates; citizen SOS packets encrypted in transit.
