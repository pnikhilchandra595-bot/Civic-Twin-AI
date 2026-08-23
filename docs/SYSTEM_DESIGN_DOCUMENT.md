# 📐 CIVICTWIN AI — SYSTEM DESIGN DOCUMENT (SDD)
**Architecture, Mathematical Formulations, Data Schemas & Engineering Specifications**

---

## 1. System Architecture Overview

CivicTwin AI is architected as a modular, high-throughput cyber-physical twin following the **Micro-Catchment Event-Driven Architecture (EDA)** pattern.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   PRESENTATION LAYER                                   │
│  React 18 + TypeScript + Vite + Tailwind CSS + Lucide Icons + Leaflet (0.5m Esri Base) │
└───────────────────────────────────────────▲────────────────────────────────────────────┘
                                            │ HTTP / WebSocket (Port 8000 / 5173)
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                               FASTAPI APPLICATION LAYER                                │
│  • Routing & Serialization (Pydantic v2)        • WebSocket Broadcasting Manager       │
│  • RBAC & JWT Middleware (HMAC-SHA256)          • Media Magic-Byte Sanitizer           │
└───────┬─────────────────┬───────────────────┬───────────────────┬──────────────────────┘
        │                 │                   │                   │
        ▼                 ▼                   ▼                   ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────────┐ ┌──────────────────────────────┐
│  SIMULATION   │ │   AI AGENT    │ │ SATELLITE HUB &   │ │   RELATIONAL PERSISTENCE     │
│    ENGINE     │ │    COPILOT    │ │ INGESTION DRIVERS │ │        (SQLite WAL)          │
│ • Hydrology   │ │ • Google      │ │ • Copernicus NDWI │ │ • Zones, Risk Assessments    │
│ • Cascades    │ │   Gemini      │ │ • NASA FIRMS 375m │ │ • Assets, Incidents, Media   │
│ • Routing     │ │ • ICS-201 IAP │ │ • Open-Meteo IMD  │ │ • State Snapshots & GPS Logs │
└───────────────┘ └───────────────┘ └───────────────────┘ └──────────────────────────────┘
```

---

## 2. Mathematical Modeling & Physics Formulations

### 2.1 Hydrology & Inundation Propagation
Water depth at any micro-catchment cell $i$ at timeline hour $t$ is calculated by integrating precipitation intensity, tidal storm surge, and topographical slope based on a modified 1D/2D **Manning's Open Channel Flow Formula**:

$$h_i(t) = h_{base} + \left( \frac{I_{rain} \cdot C_{runoff} \cdot A_{catchment}}{3600 \cdot W_{channel}} \right) \cdot \left( \frac{n}{S_0^{1/2}} \right)^{3/5} + S_{surge} \cdot e^{-\lambda \cdot d_{coast}}$$

Where:
- $h_i(t)$: Water depth at node $i$ in meters.
- $I_{rain}$: Precipitation rate in $\text{mm/hr}$ (from live IMD Doppler or simulation slider).
- $C_{runoff}$: Catchment impermeability coefficient ($0.85$ for urban concrete, $0.35$ for green vegetative cover).
- $n$: Manning's roughness coefficient ($0.035$ for urban drainage canals).
- $S_0$: Hydraulic slope gradient $(\Delta z / \Delta x)$.
- $S_{surge}$: Coastal storm surge height in meters.
- $d_{coast}$: Distance from shoreline in kilometers.

---

### 2.2 Gaussian Plume Toxic Gas Dispersion
For industrial chemical leaks (e.g., Ammonia $\text{NH}_3$, Chlorine $\text{Cl}_2$), atmospheric concentration $C(x,y,z)$ downwind from source $(x=0, y=0, z=H)$ is calculated via the **Pasquill-Gifford Gaussian Plume Equation**:

$$C(x,y,z) = \frac{Q}{2\pi u \sigma_y \sigma_z} \exp\left( -\frac{y^2}{2\sigma_y^2} \right) \left[ \exp\left( -\frac{(z-H)^2}{2\sigma_z^2} \right) + \exp\left( -\frac{(z+H)^2}{2\sigma_z^2} \right) \right]$$

Where:
- $Q$: Chemical emission release rate $(\text{kg/s})$.
- $u$: Ambient wind velocity $(\text{m/s})$ at release height.
- $\sigma_y, \sigma_z$: Atmospheric dispersion standard deviations as functions of downwind distance $x$ and atmospheric stability class.

---

### 2.3 Dynamic Evacuation Routing (NetworkX Dijkstra with Flood Impedance)
Evacuation path cost $W(e)$ for road segment $e = (u,v)$ is dynamically reweighted based on flood depth:

$$W(e) = L(e) \cdot \left[ 1 + \alpha \cdot \left( \frac{h(e)}{h_{critical}} \right)^\beta \right] \quad \text{for } h(e) < h_{critical}$$

$$W(e) = \infty \quad \text{for } h(e) \ge h_{critical} \text{ (Road Inundated / Blocked)}$$

Where $h_{critical} = 0.45\text{ m}$ (safe for light rescue vehicles), $\alpha = 4.0$, $\beta = 2.0$.

---

## 3. Database Schema (Relational ER Model)

The persistence engine implements **SQLite WAL Mode** (Write-Ahead Logging) structured into 9 core tables:

```
┌─────────────────┐       ┌──────────────────────┐       ┌────────────────────────┐
│      ZONES      │1     *│   RISK_ASSESSMENTS   │       │ INFRASTRUCTURE_ASSETS  │
├─────────────────┤───────├──────────────────────┤       ├────────────────────────┤
│ zone_id (PK)    │       │ assessment_id (PK)   │       │ asset_id (PK)          │
│ name            │       │ zone_id (FK)         │       │ name, asset_type       │
│ district, state │       │ hazard_type          │       │ lat, lng, capacity     │
│ lat, lng        │       │ risk_score, level    │       │ flood_threshold_m      │
│ population      │       │ predicted_at         │       │ is_operational         │
└─────────────────┘       └──────────────────────┘       └────────────────────────┘
        │1
        │*
┌─────────────────┐       ┌──────────────────────┐       ┌────────────────────────┐
│    INCIDENTS    │1     *│  INCIDENT_RESOURCES  │*     1│       RESOURCES        │
├─────────────────┤───────├──────────────────────┤───────├────────────────────────┤
│ incident_id (PK)│       │ mapping_id (PK)      │       │ resource_id (PK)       │
│ zone_id (FK)    │       │ incident_id (FK)     │       │ name, resource_type    │
│ severity, status│       │ resource_id (FK)     │       │ lat, lng, status       │
│ victim_count    │       │ assigned_at          │       │ battery_pct            │
└─────────────────┘       └──────────────────────┘       └────────────────────────┘
```

---

## 4. API Endpoints Specification

### Core Digital Twin & State Endpoints
- `GET /api/state`: Returns full digital twin state (nodes, roads, sensors, metrics, routes, IAP).
- `POST /api/location/resolve`: Dynamically synthesizes digital twin for ANY district or GPS coordinate in India.
- `POST /api/control`: Applies simulation control parameter overrides (rain intensity, storm surge, dam breaches).
- `POST /api/what-if/inject`: Simulates extreme crisis scenarios (`100_year_storm`, `dam_breach`, `substation_failure`).

### Satellite & Remote Sensing Endpoints
- `GET /api/real-data/firms-hotspots`: Fetches live VIIRS 375m thermal anomaly hotspots for India (NASA FIRMS).
- `GET /api/real-data/copernicus-ndwi`: Evaluates live Sentinel-2 MSI 10m Normalized Difference Water Index.
- `GET /api/satellite/sar-report`: Generates synthetic aperture radar (SAR) flood extent report.

### AI Incident Commander & Telecom Endpoints
- `POST /api/ai/chat`: Interactive natural language tactical advisory with Google Gemini.
- `POST /api/alerts/send-live-sms`: Dispatches real emergency SMS alerts via Twilio/Fast2SMS.
- `POST /api/citizen-sos/upload-media`: Uploads and validates citizen damage photos with magic-byte checking.
- `WS /ws/stream`: Full duplex WebSocket event stream broadcasting live digital twin updates.

---

## 5. Security & Data Integrity

1. **Authentication**: Cryptographic **HMAC-SHA256 JWT tokens** with 24-hour expiration and clearance-level claims (`national_authority`, `state_officer`, `district_officer`).
2. **File Sanitization**: Citizen damage uploads undergo strict magic-byte verification (JPEG, PNG, WebP header checks), a 5MB size limit, and path-traversal filename sanitization.
3. **Database Concurrency**: Configured with `PRAGMA journal_mode=WAL` and `PRAGMA busy_timeout=5000` to prevent database locks during real-time multi-client updates.
4. **Resilient Caching**: 10-minute in-memory TTL caching on external satellite calls (NASA, Copernicus) prevents rate-limit exhaustion and ensures rapid sub-50ms UI response times.
