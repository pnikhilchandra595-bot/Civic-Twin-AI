# 📚 CIVICTWIN AI — RESEARCH PAPERS, TELEMETRY SOURCES & REFERENCE COMPENDIUM

A comprehensive compilation of all peer-reviewed academic literature, mathematical physics models, satellite remote sensing catalogs, official meteorological feeds, and emergency alerting standards powering the **CivicTwin AI** platform.

---

## 🏛️ 1. Foundational Academic & IEEE Research Papers

### 📡 A. Urban Digital Twins & Disaster Risk Management
1. **IEEE Access (2023)**: *Digital Twin Technology for Smart City Disaster Management and Emergency Response*  
   - **Link**: [https://ieeexplore.ieee.org/document/10188981](https://ieeexplore.ieee.org/document/10188981)  
   - **DOI**: `10.1109/ACCESS.2023.3294821`  
   - *Key Focus*: Cyber-physical spatial data integration, IoT sensory stream ingestion, and real-time hydrodynamic disaster modeling.

2. **IEEE Internet of Things Journal (2023)**: *A Digital Twin-Driven Approach for Urban Multi-Hazard Monitoring and Emergency Routing*  
   - **Link**: [https://ieeexplore.ieee.org/document/10049419](https://ieeexplore.ieee.org/document/10049419)  
   - **DOI**: `10.1109/JIOT.2023.3246810`  
   - *Key Focus*: Real-time flood propagation modeling, dynamic road network impedance, and automated emergency ambulance routing.

3. **IEEE International Conference on Digital Twin (2023)**: *Spatially Explicit Urban Digital Twin for Flood Simulation and Rapid Evacuation Planning*  
   - **Link**: [https://ieeexplore.ieee.org/xpl/conhome/10392688/proceeding](https://ieeexplore.ieee.org/xpl/conhome/10392688/proceeding)  
   - **DOI**: `10.1109/DigitalTwin58962.2023.00018`  
   - *Key Focus*: Common Alerting Protocol (CAP) multi-channel distribution and hierarchical command access control.

4. **Nature Cities / Scientific Reports**: *Digital Twins for City Climate Resilience and Multi-Hazard Early Warning Systems*  
   - **Link**: [https://www.nature.com/articles/s41598-023-38914-1](https://www.nature.com/articles/s41598-023-38914-1)  
   - **DOI**: `10.1038/s41598-023-38914-1`  
   - *Key Focus*: Coupling geostationary thermal sensors with hydrodynamic urban runoff equations.

5. **MDPI Sustainability (2023)**: *Digital Twins for Disaster Risk Management in Smart Cities: A Systematic Literature Review*  
   - **Link**: [https://www.mdpi.com/2071-1050/15/14/11082](https://www.mdpi.com/2071-1050/15/14/11082)  
   - **DOI**: `10.3390/su151411082`  
   - *Key Focus*: Review of 140+ cyber-physical architectures for flood, seismic, and wildland-urban interface (WUI) fire containment.

---

### 🌊 B. Hydrodynamics & Glacial Lake Outburst Flood (GLOF) Physics
1. **Froehlich, D. C. (1995)**: *Peak Outflow from Breached Embankment Dam*  
   - **Journal**: *Journal of Water Resources Planning and Management (ASCE)*, 121(1), 90–97.  
   - **Link**: [https://ascelibrary.org/doi/10.1061/%28ASCE%290733-9496%281995%29121%3A1%2890%29](https://ascelibrary.org/doi/10.1061/%28ASCE%290733-9496%281995%29121%3A1%2890%29)  
   - *Equation Implemented*:  
     $$Q_p = 0.607 \cdot V_w^{0.295} \cdot H_w^{1.24}$$

2. **Cunge, J. A. (1969)**: *On the Subject of a Method of Calculating the Propagation of Flood Waves (Muskingum-Cunge)*  
   - **Journal**: *Journal of Hydraulic Research*, 7(2), 205–230.  
   - **Link**: [https://www.tandfonline.com/doi/abs/10.1080/00221686909500264](https://www.tandfonline.com/doi/abs/10.1080/00221686909500264)  
   - *Key Focus*: 1D unsteady hydrodynamic wave translation through mountain river gorges.

3. **McFeeters, S. K. (1996)**: *The Use of the Normalized Difference Water Index (NDWI) in the Delineation of Open Water Features*  
   - **Journal**: *International Journal of Remote Sensing*, 17(7), 1425–1432.  
   - **Link**: [https://www.tandfonline.com/doi/abs/10.1080/01431169608948714](https://www.tandfonline.com/doi/abs/10.1080/01431169608948714)  
   - *Equation Implemented*:  
     $$\text{NDWI} = \frac{\text{Green} (B3) - \text{NIR} (B8)}{\text{Green} (B3) + \text{NIR} (B8)}$$

---

## 🛰️ 2. Official Spaceborne Remote Sensing Feeds & APIs

| Agency & Satellite Mission | Telemetry Data Ingested | Official API / Portal Link |
| :--- | :--- | :--- |
| **ISRO SAC MOSDAC** | INSAT-3D/3DR Multispectral Imager, Hydro-Estimator Precipitation (`3SIMG_L2B_HEM`), Sea Surface Temp (SST) | **[https://www.mosdac.gov.in](https://www.mosdac.gov.in)** |
| **ISRO Bhuvan (NRSC)** | OGC Web Map Services (WMS), 30m CartoDEM Elevation, Land Use / Land Cover (LULC), Geocoded Village Master | **[https://bhuvan.nrsc.gov.in](https://bhuvan.nrsc.gov.in)** |
| **ISRO Bhoonidhi STAC** | SpatioTemporal Asset Catalog (STAC) metadata for Sentinel-1A SAR, NISAR, and LISS-IV imagery | **[https://bhoonidhi.nrsc.gov.in](https://bhoonidhi.nrsc.gov.in)** |
| **ESA Copernicus CDSE** | Sentinel-1A C-Band SAR ($10\text{m}$, VV/VH all-weather flood backscatter) & Sentinel-2 Multispectral L2A | **[https://dataspace.copernicus.eu](https://dataspace.copernicus.eu)** |
| **NASA FIRMS** | Fire Information for Resource Management System (VIIRS 375m & MODIS Active Thermal Hotspots) | **[https://firms.modaps.eosdis.nasa.gov](https://firms.modaps.eosdis.nasa.gov)** |
| **NASA EONET** | Earth Observatory Natural Event Tracker (Real-time severe storms, volcanoes, wildfires) | **[https://eonet.gsfc.nasa.gov](https://eonet.gsfc.nasa.gov)** |

---

## 🌧️ 3. Hydrological, Meteorological & Seismic Feeds

| Organization / Sensor Network | Data Stream | Documentation / Direct Feed Link |
| :--- | :--- | :--- |
| **Central Water Commission (CWC)** | Official Indian River Gauge Hydrographs, Warning & Danger Levels across Ganga, Yamuna, Godavari, Brahmaputra | **[https://cwc.gov.in](https://cwc.gov.in)** |
| **India Meteorological Department (IMD)** | Mausam Doppler Weather Radar MAXZ reflectivity loops (`MUM_MAXZ.gif`, `DLH_MAXZ.gif`, National mosaic) | **[https://mausam.imd.gov.in](https://mausam.imd.gov.in)** |
| **Open-Meteo High-Res API** | ECMWF Numerical Weather Model (0.1° grid: rain rate, ambient temp, humidity, pressure, soil saturation) | **[https://open-meteo.com/en/docs](https://open-meteo.com/en/docs)** |
| **EMSC Seismology (FDSN)** | European-Mediterranean Seismological Centre Real-Time Global Seismic Web Service (`fdsnws/event/1/query`) | **[https://www.seismicportal.eu](https://www.seismicportal.eu)** |
| **USGS Earthquake Hazards** | Real-time global seismic feeds (M2.5+ & M4.5+ GeoJSON telemetry) | **[https://earthquake.usgs.gov](https://earthquake.usgs.gov)** |
| **NOAA Space Weather (SWPC)** | Planetary K-Index (Kp 0-9), solar flare radiation bursts, GPS ionospheric constellation drift | **[https://services.swpc.noaa.gov](https://services.swpc.noaa.gov)** |
| **UNESCO IOC Sea Level** | Real-time coastal tide gauges (Apollo Bunder Mumbai, Chennai Port, Vishakhapatnam) | **[http://www.ioc-sealevelmonitoring.org](http://www.ioc-sealevelmonitoring.org)** |

---

## 🚗 4. Transit, Aviation & Geospatial Infrastructure

| Service / Gateway | Function in CivicTwin AI | API Reference Link |
| :--- | :--- | :--- |
| **OpenSky Network (ADS-B)** | Live airspace aircraft transponder tracking (IAF C-130J, Mi-17V5, Pawan Hans Dauphin rescue helicopters) | **[https://opensky-network.org](https://opensky-network.org)** |
| **Delhi Open Transit Data (OTD)** | AIS-140 GNSS Protocol Buffer streams (`VehiclePositions.pb`) tracking 4,900+ active city transit buses | **[https://otd.delhi.gov.in](https://otd.delhi.gov.in)** |
| **OpenStreetMap Overpass API** | Real-time live querying of civil infrastructure (Hospitals, Trauma ICUs, Fire Stations, Police ERSS, Flood Shelters) | **[https://overpass-turbo.eu](https://overpass-turbo.eu)** |
| **AISStream Maritime Hub** | Real-time Automatic Identification System (AIS) transponder stream for coastal rescue and navy vessels | **[https://aisstream.io](https://aisstream.io)** |

---

## 🚨 5. Emergency Alerting Standards & Sovereign Guidelines

| Standard / Authority | Specification / Framework | Documentation Link |
| :--- | :--- | :--- |
| **OASIS / ITU-T X.1303 (CAP v1.2)** | Common Alerting Protocol specification for Wireless Emergency Alerts (WEA), radio EAS, and siren relays | **[http://docs.oasis-open.org/emergency/cap/v1.2/](http://docs.oasis-open.org/emergency/cap/v1.2/)** |
| **NDMA India Guidelines** | National Disaster Management Authority Guidelines for Urban Floods & Glacial Lake Outburst Floods (GLOFs) | **[https://ndma.gov.in](https://ndma.gov.in)** |
| **ERSS 112 (MHA India)** | Emergency Response Support System single pan-India emergency number standard and GPS dispatch routing | **[https://112.gov.in](https://112.gov.in)** |
| **FEMA Incident Command System (ICS-201)** | Incident Briefing & Action Plan operational taxonomy powering the AI Tactical Commander | **[https://training.fema.gov/emiweb/is/icsresource/](https://training.fema.gov/emiweb/is/icsresource/)** |
