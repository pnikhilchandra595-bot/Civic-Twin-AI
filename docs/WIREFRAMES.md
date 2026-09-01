# 🏛️ CivicTwin AI — Complete Platform UI & Wireframe Specifications

This document outlines the UI layout, component hierarchy, sensor telemetry integrations, and structural blueprints for all 9 core screens of **CivicTwin AI**.

You can also view the live interactive prototype at:
- **Local Web Server**: [http://localhost:5173/wireframes.html](http://localhost:5173/wireframes.html)
- **Local File Path**: `frontend/public/wireframes.html`

---

## 1. Main Command Map & Incident Action Plan HUD
* **Target Viewport**: 1920×1080 (16:9 Operator Dashboard)
* **Components**:
  * **Header**: Live ISRO INSAT-3DR pass ticker, weather metrics, emergency alert status, officer badge.
  * **Interactive Map Canvas**: Leaflet GIS engine, Sentinel-1A SAR flood inundation raster, hospital trauma load markers, shelter status, drone feeds.
  * **Incident Commander Panel**: Inundated area (km²), exposed population, active triage SOS calls, tactical directives list, one-click EAS dispatch.

```
+----------------------------------------------------------------------------------------------------------------------+
| [🛰️ CIVICTWIN-AI] | Region: Maharashtra: Mumbai Mithi Basin | Threat: CATASTROPHIC (Grade-1) | 🌧️ 35mm/h | 🚨 EAS | 🎙️ AI |
+----------------------------------------------------------------------------------------------------------------------+
| [LAYER TOGGLES: 🌊 SAR Flood | 🏥 Trauma Beds | 🏕️ Shelters | 📹 Drones | 🚗 Transponders] | Mode: Sentinel-1A SAR   |
+-------------------------------------------------------------------------+--------------------------------------------+
|                                                                         | 🛡️ INCIDENT COMMANDER HUD                  |
|                                                                         +--------------------------------------------+
|                                   N                                     | [INUNDATED AREA]    | [POPULATION AT RISK] |
|                                   ^                                     |   18.4 km²          |   42,000 Citizens    |
|                                   |                                     +---------------------+----------------------+
|                   .-''''-.                                              | [ACTIVE SOS]        | [HOSPITAL BEDS]      |
|                .-'        '-.   (Flood Inundation Polygon)              |   12 High-Triage    |   670 / 1400 Free    |
|               /   (ZONE 4)   \                                          +--------------------------------------------+
|              |   MITHI S-BEND |  <-- [NDRF Raft Column #2]              | TACTICAL DIRECTIVES:                       |
|               \              /                                          | 1. Deploy NDRF Inflatable Rafts to Zone 4. |
|                '-.        .-'                                           | 2. Barricade Kurla West Railway Culvert.   |
|                   '-....-'                                              | 3. Transmit Grade-1 EAS Cell Broadcast.    |
|                                                                         +--------------------------------------------+
|  [🏥 Lilavati ICU: 88%]           [🏕️ Stadium Shelter: 450/1200]       | [🚨 TRANSMIT EAS ALERT] [🚁 DISPATCH UNIT] |
+-------------------------------------------------------------------------+--------------------------------------------+
| Coordinates: 19.0760° N, 72.8777° E  | Elevation: 14.2m MSL (EGM2008)   | Telemetry Ingest: 100% Real-Time Live Sync |
+-------------------------------------------------------------------------+--------------------------------------------+
```

---

## 2. Himalayan GLOF Sentinel & Hydrodynamic Wave Routing
* **Telemetry**: Copernicus Sentinel-2 float32 NDWI + 80km EMSC Seismic buffer
* **Hydrology Model**: Froehlich (1995) peak dam-breach equation & 1D Muskingum-Cunge unsteady channel routing
* **Monitored Lakes**: South Lhonak (Sikkim), Chorabari (Uttarakhand), Rishi Ganga (Uttarakhand), Gepang Gath (Himachal Pradesh).

```
+----------------------------------------------------------------------------------------------------------------------+
| 🏔️ HIMALAYAN GLOF CASCADE SENTINEL | Copernicus Sentinel-2 float32 NDWI + 80km Real-Time EMSC / USGS Seismic Buffer  |
+------------------------------------------------------+---------------------------------------------------------------+
| MONITORED GLACIAL BASINS (ISRO ATLAS)                | HYDRODYNAMIC DAM-BREACH & WAVE ROUTING MODEL                  |
+------------------------------------------------------+---------------------------------------------------------------+
| [*] South Lhonak Glacial Lake (Sikkim)               | [PEAK OUTFLOW Q]    | [RELEASE VOLUME]    | [BREACH DURATION] |
|     Teesta Basin • 5,200m ASL • 65.2M m³             |   14,820 m³/s       |   46.9M m³ (72%)    |   1.8 Hours       |
|     🛰️ S2 NDWI: 168.4 ha • Seismic Buffer: 0 Quakes |   (Debris Bulked)   |   (Drainage Factor) |   (Moraine Sieve) |
|                                                      +---------------------------------------------------------------+
| [ ] Chorabari & Vasudhara Tal (Uttarakhand)          | 1D MUSKINGUM-CUNGE DOWNSTREAM IMPACT SCHEDULE:                |
|     Mandakini Basin • 4,350m ASL • 28.5M m³          +-----------------------+----------+---------+------------------+
|                                                      | Downstream Asset      | Distance | ETA     | Peak Surge Depth |
| [ ] Rishi Ganga Upper Glacier (Uttarakhand)          | Chungthang Hydro Dam  | 34.0 km  | 42 min  | 14.2m (CRITICAL) |
|     Dhauliganga Basin • 4,850m ASL • 18.2M m³        | Mangan Valley Hub     | 58.0 km  | 76 min  | 9.8m  (WARNING)  |
|                                                      | Singtam Urban Sector  | 94.0 km  | 128 min | 5.4m  (ELEVATED) |
| [ ] Gepang Gath Glacial Lake (Himachal)              +---------------------------------------------------------------+
|     Chenab / Lahaul Basin • 4,120m ASL • 38.0M m³    | [🚨 TRANSMIT GRADE-1 GLOF RED ALERT TO STATE SDMA / NHPC DAMS] |
+------------------------------------------------------+---------------------------------------------------------------+
```

---

## 3. Real-Time Doppler Weather & Atmospheric Telemetry
* **Telemetry**: Open-Meteo High-Resolution ECMWF numerical model + In-situ Doppler Radar
* **Parameters**: Precipitation rate (mm/h), Surface temp (°C), Relative humidity (%), Wind speed (km/h), Barometric pressure (hPa), Soil saturation (%).

```
+----------------------------------------------------------------------------------------------------------------------+
| 🌧️ LIVE SATELLITE & DOPPLER WEATHER STREAM | Open-Meteo High-Res ECMWF Numerical Model & In-Situ Radar Ingestion     |
+----------------------------------------------------------------------------------------------------------------------+
| Location: Mumbai Suburban District (19.076° N, 72.877° E)                          | Status: 🟢 100% REAL LIVE SYNC |
+----------------------------------------------------------------------------------------------------------------------+
| [LIVE RAIN RATE]           | [SURFACE TEMPERATURE]      | [RELATIVE HUMIDITY]                                        |
|   0.0 mm/h (Night Radar)   |   26.6 °C                  |   84 % (Atmospheric Saturation)                            |
+----------------------------+----------------------------+------------------------------------------------------------+
| [WIND VELOCITY & GUSTS]    | [BAROMETRIC PRESSURE]      | [SOIL SATURATION (0-1cm)]                                  |
|   14.6 km/h (WSW)          |   1008.3 hPa (Cyclonic)    |   32.0 % (Infiltration Buffer)                             |
+----------------------------------------------------------------------------------------------------------------------+
| [🚀 DEPLOY EXACT LIVE WEATHER DIRECTLY INTO DIGITAL TWIN SIMULATION RUNTIME]                                         |
+----------------------------------------------------------------------------------------------------------------------+
```

---

## 4. Multi-Hazard Space Weather, Seismic & Coastal Tides
* **Sensors**: EMSC Global Seismometer network (FDSN), NOAA SWPC Planetary K-Index, UNESCO IOC Apollo Bunder Tide Gauge.

```
+----------------------------------------------------------------------------------------------------------------------+
| 🛰️ SPACE, SEISMIC & MARITIME GEOSPATIAL INTELLIGENCE                                                                 |
+----------------------------------+----------------------------------+------------------------------------------------+
| 🌍 EMSC SEISMOMETER FEED         | ☀️ NOAA SWPC SPACE WEATHER       | 🌊 UNESCO IOC TIDAL GAUGES                     |
+----------------------------------+----------------------------------+------------------------------------------------+
| • M 4.2 — Hindu Kush (180km dp)  | Kp Index: 2.33 (G0 Quiet)        | Apollo Bunder Gauge: 2.45m                     |
|   28 min ago • FDSN Ingest       | Solar Flare Activity: Class B    | Tidal State: High Tide Buffer                  |
| • M 2.8 — Andaman Ridge (12km)   | GPS Constellation Drift: < 3m    | Storm Surge Anomaly: +0.12m                    |
|   1 hr ago • USGS Ingest         | Radio HF Blackout: NONE          | Coastal Inundation Risk: MODERATE              |
+----------------------------------+----------------------------------+------------------------------------------------+
```

---

## 5. Citizen Emergency SOS & Crowdsourced Damage Portal
* **Target Viewport**: Mobile 390×844 (iOS / Android Citizen PWA)
* **Features**: Live GPS Geolocation, One-tap hazard taxonomy, Media photo upload, 10s voice memo, automatic 112 emergency routing.

```
+-----------------------------------------------+
| 🔴 CIVICTWIN CITIZEN SOS       [112 LINKED]   |
+-----------------------------------------------+
| Verified GPS Location:                        |
| 📍 19.0682° N, 72.8690° E (Kurla West)        |
+-----------------------------------------------+
| Select Emergency Category:                    |
| [🌊 Flood Trapped]     [🏥 Medical Urgent]    |
| [⚡ Live Wire Hazard]   [🏚️ Building Damage]   |
+-----------------------------------------------+
| 📸 Damage Media Upload (Optional):            |
| [+ Attach Photo from Camera / Gallery]        |
+-----------------------------------------------+
| 🎙️ Voice SOS / बोली सहायता (Hindi/English):    |
| [▶ Hold to Record 10s Voice SOS]              |
+-----------------------------------------------+
| [🚨 SEND IMMEDIATE SOS TO NDMA / POLICE 112]  |
+-----------------------------------------------+
| 🛡️ Status: Live Dispatcher Beacon #8914 Active|
+-----------------------------------------------+
```

---

## 6. CAP Emergency Broadcast & Multi-Channel Alerting (EAS)
* **Standards**: ITU-T X.1303 / OASIS Common Alerting Protocol (CAP v1.2)
* **Distribution**: Wireless Emergency Alerts (WEA), WhatsApp Bot Broadcast, High-Decibel sirens, Radio/TV EAS.

```
+----------------------------------------------------------------------------------------------------------------------+
| 📢 UNIFIED EMERGENCY BROADCAST (CAP v1.2 STANDARD)                                                                  |
+------------------------------------------------------+---------------------------------------------------------------+
| COMMON ALERTING PROTOCOL (CAP) CONSTRUCTOR           | DISPATCH CHANNELS & AUDIENCE REACH                            |
+------------------------------------------------------+---------------------------------------------------------------+
| Headline: GRADE-1 FLASH FLOOD EMERGENCY EVACUATION   | • 📱 Wireless Emergency Alerts (WEA):  148,000 Mobile Devices |
| Severity: Extreme (Red Alert)                        | • 💬 WhatsApp Disaster Broadcast Bot:  24,500 Subscribed      |
| Target Area: Zones 1, 2, 4 (Kurla, BKC, Bandra East) | • 🔊 High-Decibel Mountain Sirens:     18 Stations Armed      |
| Expiry: 6 Hours from Transmission                    | • 📻 All-India Radio / TV EAS Ingest:  Channel 101 Armed      |
+------------------------------------------------------+---------------------------------------------------------------+
| [🚨 TRANSMIT IMMEDIATE GRADE-1 BROADCAST TO ALL PUBLIC CHANNELS & CELL TOWERS]                                       |
+----------------------------------------------------------------------------------------------------------------------+
```

---

## 7. Tactical Voice Radio AI Co-Pilot
* **Engine**: Google Gemini AI Emergency Incident Commander Ingest
* **Features**: Speech-to-Intent NLP, Tactical order formulation, Automatic unit routing, Bilingual (English/Hindi).

```
+----------------------------------------------------------------------------------------------------------------------+
| 🎙️ TACTICAL VOICE & RADIO CO-PILOT | Gemini Pro AI Incident Command Ingest                                          |
+----------------------------------------------------------------------------------------------------------------------+
| 📻 [Officer Radio Transmission]: "Commander, water rising fast at Kurla underpass, request 2 inflatable boats."      |
| 🤖 [AI Tactical Copilot]:        "Acknowledged. Dispatching NDRF Boat Column #2 from BKC Staging Depot (ETA: 11 min).|
|                                   Automatic traffic diversion signal transmitted to Mumbai Police control."         |
+----------------------------------------------------------------------------------------------------------------------+
| [🎙️ PUSH TO TALK (PTT)]   |   [🌐 Language: English / हिंदी]   |   [📻 Switch Channel: Tactical Alpha #1]            |
+----------------------------------------------------------------------------------------------------------------------+
```

---

## 8. CWC Sovereign River Hydrographs & Flood Telemetry
* **Source**: Central Water Commission (CWC) Official Flood Forecasting Stream
* **Telemetry**: Gauge level (m), Warning Stage (m), Danger Level (m), Discharge (m³/s), Hydrograph Trend.

```
+----------------------------------------------------------------------------------------------------------------------+
| 🌊 CENTRAL WATER COMMISSION (CWC) OFFICIAL FLOOD FORECASTING TELEMETRY                                               |
+------------------------------------------------------+---------------------------------------------------------------+
| GANGA BASIN — RISHIKESH HYDRO-STATION                | YAMUNA BASIN — OLD RAILWAY BRIDGE (DELHI)                     |
+------------------------------------------------------+---------------------------------------------------------------+
| Water Level:  339.40 m (Warning Stage: 340.00m)       | Water Level:  206.12 m (ABOVE DANGER LEVEL: 205.33m)          |
| Discharge:    8,400 m³/s • Trend: Rising (+0.12m/hr) | Discharge:    12,800 m³/s • Trend: Peak Inundation (+0.28m/hr)|
+------------------------------------------------------+---------------------------------------------------------------+
```

---

## 9. Data Provenance & Sensor Reliability Ledger
* **Audit Certificates**: Cryptographic telemetry signatures, data freshness timestamps, provenance badges.

```
+----------------------------------------------------------------------------------------------------------------------+
| 🛡️ SENSOR PROVENANCE, DATA FRESHNESS & AUDIT CERTIFICATES                                                            |
+-------------------------+-------------------------+-------------------------+----------------------------------------+
| 🛰️ ISRO SAC MOSDAC      | 🇪🇺 COPERNICUS CDSE       | 🌍 EMSC / USGS SEISMIC  | 🌊 CENTRAL WATER COMMISSION            |
| INSAT-3DR Multi-Channel | Sentinel-2 L2A float32  | Real-Time FDSN Ingest   | Official River Gauges                  |
| ● LIVE PASS 17:00 UTC   | ● RASTERIO PARSED       | ● 80KM BUFFER ACTIVE    | ● HYDROGRAPH VERIFIED                  |
+-------------------------+-------------------------+-------------------------+----------------------------------------+
```
