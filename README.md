# CivicTwin AI – AI Digital Twin for Disaster & Infrastructure Response

**CivicTwin AI** is a real-time, interactive Geospatial Digital Twin platform designed to predict, simulate, and coordinate urban disaster response. Rather than a simple chatbot, CivicTwin AI creates a living virtual model of a metropolitan area combining satellite imagery, GIS elevation/topography, hydrological drainage basins, live IoT sensor telemetry, power/utility grids, structural building vulnerability, and dynamic road traffic.

---

## 🌟 Key Capabilities

### 1. 2D / 3D Geospatial Digital Twin Map
- **Satellite & Inundation Radar Overlay**: Dynamic flood heatmap rendering water accumulation, river cresting, and coastal storm surge.
- **Topography & Elevation Contours**: Visualizes natural drainage basins, lowland flood risks, and elevated safety zones.
- **3D Extruded Infrastructure**: 3D extruded footprints for hospitals, trauma centers, emergency shelters, schools, and power substations.
- **Road Network Flow**: Dynamic road segment states (`Clear`, `Flooded Warning`, `Impassable/Closed`, `Evacuation Corridor`).
- **Active Moving Units**: Real-time visualization of deployed rescue boats, mobile dewatering pump trucks, ambulances, and police traffic control units.

### 2. Multi-Hazard Simulation & Cascade Failure Engine
- **Hydrological Physics Model**: Calculates 2D water accumulation based on rainfall rate ($\text{mm/hr}$), soil runoff coefficient, drainage saturation, and storm surge.
- **Cascade Vulnerability Graph**: Detects multi-order chain reactions:
  $$\text{Rainfall} \rightarrow \text{Drain Overflow} \rightarrow \text{Road Submergence} \rightarrow \text{Substation Inundation} \rightarrow \text{Hospital Backup Power} \rightarrow \text{Evacuation Corridor Reroute}$$
- **"What-If" Crisis Sandbox**:
  - Timeline scrubber ($T+00:00 \to T+12:00$) with $1\times, 2\times, 5\times$ speed controls.
  - Precipitation, surge, and wind velocity sliders.
  - Crisis event injection buttons: **100-Year Atmospheric Storm**, **River Levee Barrier Breach**, and **Substation Alpha Grid Trip**.

### 3. AI Incident Commander (FEMA ICS-201/202 Compliant)
- **Automated Situation Report (SITREP)**: Real-time threat assessment and executive operational briefing.
- **Strategic Response Objectives & Agency Tasking**: Specific actionable tasking for Fire & Rescue, EMS, Public Works, Traffic Operations, and Red Cross.
- **Dynamic Evacuation Routing**: NetworkX-powered shortest safe path finding that avoids submerged roads and prioritizes green evacuation corridors.
- **EAS Public Emergency Broadcast Synthesizer**: Zone-targeted emergency alerts with multi-language previews (English, Spanish, Chinese, Vietnamese).

---

## 🚀 Quick Start

### 1. One-Click Launch (Windows)
Double-click `run_civictwin.bat` in the root folder.

### 2. Manual Startup

#### Backend (FastAPI + Simulation Engine)
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

#### Frontend (Tactical Command Dashboard)
```bash
cd frontend
npm install
npm run dev
```

Open your browser at **`http://localhost:5173`** to access the Tactical Operations Center.

---

## 🧪 Testing & Verification

Run automated backend simulation and API tests:
```bash
cd backend
python -m pytest tests/
```

Run frontend production build verification:
```bash
cd frontend
npm run build
```
