# 🏛️ CivicTwin AI – India Disaster Response & Civil Defense Digital Twin

> 🇮🇳 **India's Operational Multi-Hazard Disaster Response & Civil Defense Digital Twin** — Powered by live ISRO MOSDAC & Bhuvan satellite pipelines, Copernicus Sentinel-1 SAR Radar, 2D Hydrodynamic Physics Engines, Google Gemini AI Incident Commander, and Offline 112 Cellular SMS Lifelines across all 780+ Indian Districts.

---

## 🌟 Key Architectural Pillars & Innovations

### 1. 🛰️ Spaceborne Intelligence: Dual ISRO Satellite Integration (MOSDAC & Bhuvan)
- **ISRO MOSDAC (SAC Ahmedabad)**: Live atmospheric telemetry querying `https://mosdac.gov.in/apios/datasets.json`. Ingests INSAT-3DR TIR-1 cloud-top brightness temperatures ($209\,\text{K} / -64^\circ\text{C}$) and Hydro-Estimator precipitation rain rates (`3SIMG_L2B_HEM`).
- **ISRO Bhuvan (NRSC Hyderabad)**: Configured via secure environment variables (`BHUVAN_*_KEY`):
  - `BHUVAN_HOSPITAL_POSTAL_KEY` — Hospital & Postal Lifeline POIs
  - `BHUVAN_VILLAGE_GEOCODE_KEY` — Village & Ward Geocoding Directory
  - `BHUVAN_LULC_STATICS_KEY` — 1:50K LULC Runoff Statistics ($C = 0.78$)
  - `BHUVAN_LULC_AOI_KEY` — AOI-wise Land Cover Allocation
  - `BHUVAN_ROUTING_KEY` — Evacuation Road Network Routing
  - `BHUVAN_GEOID_KEY` — High-Precision Indian Geoid Elevation Model
- **Copernicus Sentinel-1 & 2 SAR / Optical**: Active C-band microwave radar backscatter ($\sigma^0 < -16.0\,\text{dB}$) for cloud-penetrating water extraction and Sentinel-2 NDWI ($+0.42$).
- **NASA FIRMS**: VIIRS thermal anomaly hotspots and Fire Radiative Power ($28.6\,\text{MW}$).

### 2. 🛰️ Visual Satellite Orbs & HUD Cockpit in Map Canvas
- **Dual Pulsating Satellite Orbs**:
  - 🟣 **ISRO INSAT-3DR (MOSDAC)**: Geostationary 74°E orbit ring with live cloud-top telemetry popup.
  - 🟠 **ISRO Bhuvan (EOS-04 / Cartosat)**: Sun-synchronous 540km polar swath track with LULC and CartoDEM elevation profile.
- **Persistent HUD Deck**: Floating bottom-right telemetry status pills and top-right layer quick toggles.

### 3. 📊 Comprehensive Numerical Telemetry & Physical Metrics Matrix
- **Meteorological Parameters**: Rain rate $I = 48.5\,\text{mm/hr}$, 24h accumulation $= 184.2\,\text{mm}$, atmospheric pressure $= 1004.2\,\text{hPa}$, wind velocity $= 38.4\,\text{km/h}$.
- **Hydrodynamic Predictions**: Peak discharge $Q_{\text{peak}} = 385.4\,\text{m}^3/\text{s}$ via $Q = \frac{1}{360}CIA$, 2D Saint-Venant water depth $h = 0.85\text{ – }1.42\,\text{m}$, inundation area $= 14.8\,\text{km}^2$, flow velocity $= 1.85\,\text{m/s}$, Froude number $Fr = 0.64$ (subcritical).
- **LULC Concrete Impermeability**: Built-up concrete $62.4\%$, composite runoff coefficient $C = 0.78$.

### 4. 🚨 Crowdsourced Citizen SOS Distress Queue & Real-Time Triage
- **Live 3-Second Polling & WebSocket Synchronization**: Immediate propagation of emergency distress reports to incident commanders.
- **AI Verification & Triage Engine**: Heuristic confidence scoring based on completeness, GPS precision, victim count, and reported water depth.
- **Multilingual Emergency Alerts**: Multi-channel broadcast dispatch via Fast2SMS and Twilio in English, Hindi, Marathi, Kannada, and Tamil.

### 5. 🗺️ 780+ Pan-India Districts Synthesis
- Complete coverage across all 36 States and Union Territories with instant search omnibox, state jurisdiction filtering, and municipal ward analysis.

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
- **256-Bit AES / HMAC-SHA256 Encrypted** JWT Clearance & API Gateway Storage

