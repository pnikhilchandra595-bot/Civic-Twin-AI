# 🏛️ CivicTwin AI – India Disaster Response & Civil Defense Digital Twin

> 🇮🇳 **India's Multi-Tier Disaster Management & Civil Defense Digital Twin** — Powered by Copernicus Satellite SAR, Real-Time Hydraulic Physics Engines, Google Gemini AI Incident Commander, and Offline 112 Cellular SMS Lifeline.

---

## 🌟 Key Features

### 1. 🛰️ Copernicus Sentinel-1 SAR & ISRO Bhuvan Ingestion
- **Active Microwave Radar**: 100% cloud-penetrating radar imaging through dense monsoon storms and cyclonic depressions.
- **Water Backscatter Extraction**: Calculates radar reflectance ($< -17.5\text{ dB}$) to extract exact inundated area ($\text{km}^2$) and urban submersion polygons.
- **Live IMD Meteorological Ingestion**: Real-time Doppler rainfall velocity, barometric pressure, wind vectors, and soil moisture saturation.

### 2. 🗺️ 2D/3D Geospatial Digital Twin & Hydraulic Simulation
- **Multi-Hazard Hydraulic Physics**: Simulates river overtopping, urban subway pooling, and storm surge across 20 Indian disaster corridors.
- **Cascade Vulnerability Graph**: Models power grid trips, hospital ICU oxygen surges, and road blockages.
- **Dynamic Evacuation Routing**: Reroutes emergency vehicles and civilians to high-ground relief centers.

### 3. ✨ Google Gemini AI Disaster Incident Commander
- **Generative Incident Reasoning**: Real-time conversational AI incident management with live digital twin telemetry injection.
- **Multi-Lingual Audio Synthesis**: Native text-to-speech voice readouts in English, Hindi, Marathi, and Tamil.
- **1-Click Tactical Actions**: Dispatches rescue teams, generates SITREPs, and executes simulation commands.

### 4. 📹 AI Computer Vision Drone & Municipal CCTV Feeds
- **Real HD Video Feeds**: Live video feeds monitoring underpasses and aerial riverfronts.
- **YOLO Neural Network Bounding Boxes**: Detects stranded citizen groups, submerged vehicles, and water gauges.
- **Multi-Spectrum Modes**: Optical RGB, FLIR Thermal Infrared (heat signature detection), and Night Vision.

### 5. 📱 Public Citizen Safety & Zero-Internet SMS 112 Lifeline
- **100% Offline GPS Sensor Extraction**: Locks hardware satellite GPS coordinates without mobile internet or Wi-Fi.
- **1-Tap Cellular SMS to 112**: Pre-formatted rescue dispatch directly to emergency services via GSM cellular network.
- **24/7 National Emergency Helplines**: 1-Tap call access to NDMA (1070), All-in-One Emergency (112), EMS (108), Fire (101), Municipal (1916), and District Cells (1077).

### 6. 🔐 3-Tier Role-Based Clearance Hierarchy
- **Level 5 — National Authority (NDMA HQ)**: Unrestricted Pan-India control across all 20 states and central executive tools.
- **Level 3 — State Sub-Officer (SDMA)**: Strictly locked to assigned state jurisdiction, CCTV feeds, and local queues.
- **Level 1 — Public Citizen**: Text-first safety hub with zero complex maps, offline GPS sharing, and shelter bulletins.

---

## 🚀 Quick Start

### 1. One-Click Launch (Windows)
Double-click `run_civictwin.bat` in the root directory.

### 2. Manual Launch

#### Backend (FastAPI + Simulation Engine)
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

#### Frontend (React + Vite + Tailwind)
```bash
cd frontend
npm install
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 🏛️ Government Compliance & Standards
- **NDMA CAP (Common Alerting Protocol)** Compliant
- **ISRO Bhuvan / MOSDAC** Open Geospatial Standards
- **Copernicus Open Access Hub** GeoTIFF & SAR Polarimetry
- **256-Bit AES Encrypted** API Key & Gateway Storage
