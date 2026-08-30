# 🇮🇳 CIVICTWIN AI: SYSTEM ARCHITECTURE & TECHNICAL DESIGN DOCUMENT
**National Multi-Tier Disaster Digital Twin & AI Incident Command System**

---

## 1. Executive Summary & Problem Statement

### 1.1 Problem Statement
India faces catastrophic seasonal monsoon floods, cyclonic storm surges, wildfires, and glacial cloudbursts affecting over 40 million citizens annually. Traditional disaster management suffers from:
1. **Data Silos**: Fragmented communication between National (NDMA), State (SDMA), District (DDMA), and first responders (NDRF, 108 EMS).
2. **Delayed Inundation Warnings**: Optical satellites are blocked by cloud cover; physical gauge networks lack automated forward-looking predictive cascade models.
3. **Citizen Exclusion**: Citizens lack real-time localized hyper-local telemetry, GPS SOS routing, and multilingual conversational safety advice.
4. **Venue Network Vulnerability**: Stage demonstrations can fail if external government data feeds suffer intermittent outages.

### 1.2 The CivicTwin AI Solution
CivicTwin AI is an operational **Cyber-Physical Digital Twin** that unifies:
- **Sovereign Spaceborne Remote Sensing**: Cloud-penetrating C-Band Radar (Sentinel-1 SAR), Multispectral Damage Indices (Sentinel-2), Thermal Hotspots (NASA FIRMS), and Cyclone tracking (ISRO MOSDAC, Bhuvan, & Bhoonidhi STAC).
- **Official Meteorological Radars**: Direct live Doppler weather radar animation loops from IMD Mausam (`mausam.imd.gov.in`).
- **Disaster Response Aviation Tracking**: OpenSky Network ADS-B transponder stream filtered against a verified Two-Tier Indian disaster response fleet registry (Pawan Hans, State Government helicopters, IAF airlift) with a 24-hour cache cutoff rule and real-time dynamic flight sortie simulation.
- **Grounded Emergency Hospital Dispatch Engine**: Simulation engine rooted in verified OpenStreetMap municipal hospitals that computes realistic arterial road paths, true spherical distance, and live countdown ETA.
- **Live Ground Transit GNSS**: Official Delhi Open Transit Data (AIS-140) tracking 4,900+ active buses alongside simulated smart city emergency fleets.
- **Transparent Stage Demo Mode**: Admin-gated switch that guarantees zero-latency, zero-outage presentations on venue networks with explicit honesty badges.
- **Physics-Informed Cascade Prediction**: Hydrodynamic flood models, substation trip cascades, and road cutoffs.
- **Strict Sovereign Geographic & Role Boundaries**: Hard-locked Indian national boundary limits and 4-tier operational access permissions.
- **Telecom & AI Delivery**: Live SMS alerts via Twilio/Fast2SMS, GPS-triggered emergency broadcasts, and Google Gemini AI multilingual safety advice.

---

## 2. High-Level Architecture Diagram

```mermaid
graph TD
    subgraph SATELLITE_AND_WEATHER ["1. Ingestion Layer (Spaceborne & Ground APIs)"]
        S1["🛰️ Sentinel-1 SAR (C-Band Radar)"]
        S2["🛰️ Sentinel-2 (Multispectral NDVI)"]
        FIRMS["🔥 NASA FIRMS (VIIRS 375m)"]
        MOSDAC["🌀 ISRO MOSDAC / INSAT-3D"]
        BHUVAN["🇮🇳 ISRO Bhuvan NRSC"]
        BHOONIDHI["🛰️ ISRO Bhoonidhi STAC"]
        IMD_RADAR["🌧️ IMD Doppler Weather Radar Loops"]
        OPENSKY["✈️ OpenSky ADS-B & 2-Tier Disaster Fleet Filter"]
        DELHI_OTD["🚌 Delhi Open Transit Data (AIS-140)"]
        GLOFAS["🌊 Copernicus GloFAS River Flow"]
        CWC["📏 CWC River Gauges (Scraped)"]
        HOSPITALS["🏥 OpenStreetMap Healthcare Registry"]
    end

    subgraph PROCESSING_LAYER ["2. Processing & Demo Mode Layer"]
        DEMO_STATE["🎬 Global Demo State Switch (demo_state.py)"]
        PREPROC["Spatial Clipping & EPSG:4326 Reprojection"]
        FSTORE["Geospatial Feature Store (feature_store.py)"]
        CACHE_CUTOFF["24-Hour Sighting Cache Lifespan Enforcer"]
    end

    subgraph PREDICTION_ENGINE ["3. Multi-Hazard Prediction & Cascade Engine"]
        HYBRID["Flood: 0.40 Rain + 0.30 River + 0.20 Topo + 0.10 Soil"]
        FIRE_ENGINE["Fire: 0.50 Hotspot Density + 0.30 FRP + 0.20 Proximity"]
        CYCLONE_ENGINE["Cyclone: 0.40 Wind + 0.30 Track Dist + 0.20 Surge + 0.10 ETA"]
        CONF["Confidence Score (Source Agreement %)"]
        CASCADE["Vulnerability Cascade (Substation Trip, Road Closures)"]
        SORTIE_SIM["Dynamic Real-Time Moving Sortie Simulator"]
        DISPATCH_SIM["Grounded 108/NDRF Hospital Route Dispatcher"]
    end

    subgraph PERSISTENCE_LAYER ["4. Persistent Relational Storage (database.py)"]
        DB[(9-Table Database: Zones, Risk, Assets, Incidents, Resources, Alerts, Shelters, Users)]
    end

    subgraph SERVING_LAYER ["5. Serving, Telecom & AI Layer (FastAPI Backend)"]
        WS["WebSocket Event Stream (/ws/stream)"]
        TWILIO["Twilio & Fast2SMS Telecom Carrier Gateway"]
        GEMINI["Google Gemini AI Safety Advisor"]
        WEBCAM["1-Click Laptop Webcam & Mobile RTSP/MJPEG Video Engine"]
    end

    subgraph CLIENT_TIERS ["6. 4-Tier User Experience & Boundary Enforcer"]
        HQ["🏛️ Level 5: National Command (NDMA) - 780+ Districts & All-India Grid"]
        SDMA["🏢 Level 3: State SDMA - State-Locked Boundary (minZoom: 6)"]
        DDMA["📍 Level 2: District DDMA - District Centroid Lock (minZoom: 10)"]
        CITIZEN["📱 Level 1: Citizen Safety Portal - Helplines, SOS Beacon & Gemini AI"]
    end

    SATELLITE_AND_WEATHER --> DEMO_STATE
    DEMO_STATE --> PREPROC
    OPENSKY --> CACHE_CUTOFF
    PREPROC --> FSTORE
    FSTORE --> HYBRID
    FSTORE --> FIRE_ENGINE
    FSTORE --> CYCLONE_ENGINE
    HYBRID --> CONF
    FIRE_ENGINE --> CONF
    CYCLONE_ENGINE --> CONF
    CONF --> CASCADE
    CASCADE --> DB
    CACHE_CUTOFF --> SORTIE_SIM
    HOSPITALS --> DISPATCH_SIM
    DB --> SERVING_LAYER
    SERVING_LAYER --> CLIENT_TIERS
```

---

## 3. Disaster Response Aviation & Emergency Dispatch

### 3.1 Two-Tier Verified Fleet Registry
The aviation subsystem in `live_aviation_service.py` filters live OpenSky ADS-B transponder packets against a sourced Indian registry:
- **Tier 1 (Civil Disaster Assets)**: Verified DGCA India civil aircraft hex codes (allocation block `800000`–`803FFF`):
  - `80026e` (`VT-PHA`) — Pawan Hans Dauphin AS365 N3 Air Ambulance
  - `8004f2` (`VT-PHD`) — Pawan Hans Coastal & Flood SAR
  - `8003a9` (`VT-EHL`) — State Relief Wing Eurocopter AS350 B3
  - `8006b1` (`VT-GVT`) — Government of Gujarat Bell 412EP
  - `800794` (`VT-TSG`) — Government of Telangana AW139 Emergency Sortie
  - `80027f` (`VT-MHA`) — Government of Maharashtra Sikorsky S-76D
- **Tier 2 (Military Tactical Airlift)**: Documented IAF disaster airlift tail registrations:
  - `80018a` (`KC-3801`) — IAF C-130J Super Hercules
  - `80018b` (`KC-3802`) — IAF C-130J Tactical Evacuation
  - `800041` (`CB-8001`) — IAF C-17 Globemaster Heavy Relief
  - `800531` (`Z-3431`) — IAF Mi-17V-5 Flood Rescue Sortie

### 3.2 Real-Hospital Grounded 108 Emergency Dispatch
`emergency_deployment_service.py` computes and streams animated ground unit deployments:
- **Real Origin Point**: Verified OpenStreetMap hospitals in the active city.
- **Curved Arterial Path**: Quadratic sinusoidal offsets simulating road-network navigation.
- **Accurate Telemetry**: Computed spherical distance ($\text{km}$), speed ($35\text{--}45\text{ km/h}$), and live ETA countdown ($\text{min}$).
- **Transparent Provenance**: Stamped with `data_mode="demo_simulated"` and `[SIMULATED]` badges.

---

## 4. Transparent Stage Demo Mode & Offline Resilience
- **Global Toggle**: Controlled via `GET /api/demo-mode` and clearance-gated `POST /api/demo-mode`.
- **Live Query Bypass**: When ON, all 11 external services skip external queries and return calibrated reference data.
- **Visual Disclosure**: Header pill switch (`[ 🎬 DEMO ]` vs `[ 🛰️ REAL ]`) and persistent sticky top banner.

---

## 5. Sovereign Indian Boundary Locking & 4-Tier Access Control
- **Indian Hard Wall**: Map camera bounds locked to `INDIA_BOUNDS = [[6.5, 68.0], [37.5, 97.5]]` with `maxBoundsViscosity: 1.0`.
- **Role Scopes**:
  - **National Authority (L5)**: Full Pan-India access across all 780+ districts.
  - **State SDMA Officer (L3)**: Locked strictly to assigned state boundary (`minZoom: 6`).
  - **District DDMA Officer (L2)**: Centroid locked to assigned district ($\pm 0.45^\circ$, `minZoom: 10`).
  - **Public Citizen (L1)**: High-contrast safety portal with 1-Click SOS GPS Beacon and local helplines.
