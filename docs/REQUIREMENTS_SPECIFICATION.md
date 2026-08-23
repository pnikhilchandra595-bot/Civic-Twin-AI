# 📋 CIVICTWIN AI — REQUIREMENTS SPECIFICATION (SRS)
**Functional Requirements, Non-Functional Requirements, User Stories & Acceptance Criteria**

---

## 1. System Purpose & Target Stakeholders

### 1.1 Purpose
This document specifies the software, hardware, and operational requirements for **CivicTwin AI**, an intelligent cyber-physical digital twin designed for urban disaster management and climate resilience across India.

### 1.2 Target User Personas
1. **National Emergency Director (NDMA / MHA)**: Needs high-level sovereign situational awareness across all 28 states and 8 union territories, strategic resource deployment, and national hazard alerts.
2. **State Disaster Management Officer (SDMA)**: Needs regional flood monitoring, river basin telemetry, and multi-district evacuation coordination.
3. **District Collector / Municipal Commissioner (DDMA)**: Needs micro-ward level inundation maps, emergency shelter bed capacity, dam gate control simulations, and local SMS broadcasts.
4. **First Responder (NDRF / SDRF / 108 EMS)**: Needs dynamic turn-by-turn routing around flooded roads, live GPS vehicle tracking, and SOS distress triage.
5. **Urban Citizen**: Needs accessible, multilingual flood risk information, turn-by-turn evacuation navigation, emergency shelter locators, and a one-click SOS assistance beacon.

---

## 2. Functional Requirements (FR)

### Module 1: Pan-India Geospatial Digital Twin
- **FR-01 (Instant District Resolution)**: The system shall dynamically generate micro-catchment terrain elevation, critical lifeline nodes, road networks, and flood zones for all 780+ Indian districts within 2.0 seconds of user selection or search.
- **FR-02 (Multi-Layer GIS Map Visualizer)**: The system shall render interactive map layers including Esri High-Resolution Satellite Base (0.5m), NOAA Doppler radar overlays, Sentinel-2 NDWI water extents, NASA FIRMS active fire hotspots, and live sensor networks.
- **FR-03 (Camera Smooth Flying)**: The map canvas shall smoothly fly (`map.flyTo`) to the precise GPS coordinates of any searched district or clicked location.

### Module 2: Multi-Hazard Physics & Cascades
- **FR-04 (Inundation Propagation Engine)**: The system shall calculate flood water depth at every node and road segment using Manning's open channel flow formula, taking into account rainfall intensity (0–120 mm/hr) and storm surge (0–5 m).
- **FR-05 (Infrastructure Cascade Evaluation)**: The system shall automatically evaluate failure propagation across graph dependencies, identifying when flooded substations or levees trip dependent hospitals, water pumping stations, and telecommunications towers.
- **FR-06 (Multi-Hazard Simulation Models)**: The system shall simulate Gaussian toxic gas plume dispersion, earthquake ShakeMaps (Modified Mercalli Intensity), and slum fire propagation upon command.
- **FR-07 (What-If Crisis Sandbox)**: The system shall support one-click injection of extreme scenario presets including *100-Year Cloudburst Storm*, *Dam Sluice Gate Breach*, and *Regional Substation Failure*.

### Module 3: Generative AI Incident Commander & IAP
- **FR-08 (Natural Language AI Copilot)**: The system shall provide an interactive conversational AI Incident Commander (powered by Google Gemini) that parses live telemetry, answers tactical queries, and suggests NDRF asset deployments.
- **FR-09 (Automated ICS-201 Incident Action Plan)**: The system shall automatically synthesize a standardized Incident Action Plan containing operational objectives, safety messages, and resource assignments.

### Module 4: Real-World Ingestion & Citizen SOS
- **FR-10 (Live Remote Sensing Ingestion)**: The system shall ingest live NASA FIRMS thermal anomaly CSV data and Copernicus Sentinel-2 NDWI statistical calculations with in-memory TTL caching.
- **FR-11 (Citizen SOS Media Upload & Triage)**: The system shall enable citizens to submit geotagged SOS assistance requests with photo evidence, validating file headers using magic-byte inspection (JPEG, PNG, WebP) and capping sizes at 5MB.
- **FR-12 (Multi-Carrier Telecom Alerts)**: The system shall dispatch real-time emergency SMS and WhatsApp notifications formatted in compliance with the NDMA Common Alerting Protocol (CAP-CP).

---

## 3. Non-Functional Requirements (NFR)

### 3.1 Performance & Scalability
- **NFR-01 (Sub-Second Simulation Response)**: Hydrodynamic and cascade recomputations shall execute in under 150 milliseconds for up to 50 nodes and 100 road segments.
- **NFR-02 (Low Latency WebSocket Broadcasting)**: Simulation state changes shall broadcast to all connected WebSocket clients within 50 milliseconds.
- **NFR-03 (Frontend Bundle Optimization)**: The production frontend bundle shall use Rollup chunk-splitting to keep initial JavaScript download size under 1.0 MB for fast loading on 4G/5G mobile devices.

### 3.2 Security & Data Protection
- **NFR-04 (Cryptographic JWT & RBAC)**: Administrative and state-altering endpoints shall enforce HMAC-SHA256 JWT authorization tokens.
- **NFR-05 (Input Sanitization & Upload Safety)**: All uploaded citizen media files shall undergo magic-byte header validation, 5MB file-size limits, and path-traversal filename sanitization.
- **NFR-06 (Database Concurrency & WAL Mode)**: The relational database shall operate in SQLite Write-Ahead Logging (`WAL`) mode with a busy timeout of 5000ms to guarantee zero lock contention during concurrent reads and writes.

### 3.3 Availability & Fault Tolerance
- **NFR-07 (Zero-Backend Standalone Fallback)**: If the backend service is temporarily unreachable, the frontend shall seamlessly fall back to client-side synthetic state generation without crashing.
- **NFR-08 (External API Resiliency)**: Third-party satellite and weather calls shall implement a 10-minute in-memory TTL cache and fallback baseline responses in case of upstream network outages.

---

## 4. Hardware & Software Requirements

| Category | Component | Minimum Specification | Recommended Specification |
| :--- | :--- | :--- | :--- |
| **Server Hardware** | CPU / RAM | 2 vCPU, 2 GB RAM | 4 vCPU, 8 GB RAM |
| **Server Runtime** | Python Runtime | Python 3.10+ (FastAPI 0.110+, Uvicorn) | Python 3.11+ |
| **Client Device** | Web Browser | Modern Evergreen Browser (Chrome 90+, Edge, Firefox, Safari) | Chromium-based browser with WebGL enabled |
| **Client Device** | Mobile Device | Android 10+ / iOS 14+ (4G LTE / 5G) | Android 12+ / iOS 16+ |
| **Database** | Persistence Storage | SQLite 3.35+ (with WAL mode enabled) | PostgreSQL 15+ with PostGIS extension |
| **Cloud Hosting** | Deployment Platform | Render / Railway (Backend), Vercel (Frontend) | AWS ECS / EKS + CloudFront CDN |
