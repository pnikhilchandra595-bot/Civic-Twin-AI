from typing import Dict, Any
import datetime
from app.models.schemas import CityDigitalTwinState

class DatasetExportService:
    """
    Generates structured, human-readable data documents and reports
    from the Digital Twin state across all urban aspects with explicit data provenance classification.
    """

    def generate_markdown_doc(self, state: CityDigitalTwinState) -> str:
        now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
        
        doc = f"""# 🏙️ CIVICTWIN AI – DISASTER DIGITAL TWIN STATE & TELEMETRY REPORT
**Generated At:** {now_str}  
**Active Scenario:** {state.city_name} (`{state.city_id}`)  
**Center Coordinates:** Lat {state.center_coords[0]:.4f}° N, Lng {state.center_coords[1]:.4f}° E  
**Simulation Timeline:** T+{state.timeline_hour:.1f} Hours  
**Overall Disaster Threat Level:** {state.iap.overall_threat_level}  
**Incident Command Framework:** Integrated Multi-Hazard Incident Action Plan (ICS-NDMA)

> [!NOTE]
> **Data Provenance Classification:**
> - 🛰️ **LIVE_TELEMETRY**: Real-time streams from Open-Meteo, IMD Doppler radar mosaic, and CWC live monitoring stations.
> - 📐 **CALIBRATED_BASELINE**: Seeded digital elevation models, OpenStreetMap infrastructure geometries, and CWC historical high-flood levels (HFL).
> - ⚡ **MODELED_SIMULATION**: Hydrodynamic Manning-Strickler runoff, 2D shallow water surface pooling, and cascade failure network propagation.

---

## 1. 🌦️ ATMOSPHERIC, WEATHER & SATELLITE RADAR TELEMETRY

| Parameter | Current Reading | Normal Range | Status | Data Mode | Attribution Source |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Precipitation / Rain Rate** | **{state.rain_intensity_mmhr:.1f} mm/hr** | Normal: <15 mm/hr, Heavy: >45 mm/hr | {'CRITICAL' if state.rain_intensity_mmhr >= 45 else 'WARNING' if state.rain_intensity_mmhr >= 15 else 'NORMAL'} | `LIVE_TELEMETRY` | Open-Meteo / IMD Weather Mesh |
| **Coastal / River Surge** | **{state.storm_surge_m:.2f} meters** | Normal: 0.0m, Surge: >1.2m | {'CRITICAL' if state.storm_surge_m >= 1.2 else 'WARNING' if state.storm_surge_m > 0.4 else 'NORMAL'} | `MODELED_SIMULATION` | Hydrodynamic Surge Boundary Condition |
| **Atmospheric Wind Speed** | **{state.wind_speed_kmh:.1f} km/h** | Normal: <30 km/h, Gale: >60 km/h | {'WARNING' if state.wind_speed_kmh >= 50 else 'NORMAL'} | `LIVE_TELEMETRY` | Open-Meteo Anemometer Ingest |
| **Wind Direction** | **{state.wind_direction_deg:.0f}° (South-West)** | - | Active Monsoon Flow | `LIVE_TELEMETRY` | Open-Meteo Wind Vector |
| **River Floodgates** | **{'BREACHED / OVERFLOWING' if state.levee_breached else 'SECURE / HIGH TIDE LOCK'}** | Retaining Wall: 5.5m | {'EMERGENCY' if state.levee_breached else 'NORMAL'} | `MODELED_SIMULATION` | Digital Twin Sluice Model |
| **Primary Power Grid** | **{'TRIPPED / OFFLINE' if state.substation_tripped else 'OPERATIONAL ONLINE'}** | 220kV Receiving Bus | {'BLACKOUT' if state.substation_tripped else 'NORMAL'} | `MODELED_SIMULATION` | Substation Interdependency Grid |

---

## 2. 📡 IoT SENSOR GRID TELEMETRY

Total Active Telemetry Channels: **{len(state.sensors)} Connected Real-Time Nodes**

| Sensor ID | Sensor Name | Type | Current Value | Warning Level | Critical Level | Condition Status | Provenance Mode |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
"""
        for s in state.sensors:
            doc += f"| `{s.sensor_id}` | **{s.name}** | `{s.sensor_type}` | **{s.current_value:.1f} {s.unit}** | {s.threshold_warning} {s.unit} | {s.threshold_critical} {s.unit} | `{s.status.upper()}` | `CALIBRATED_BASELINE` |\n"

        doc += """
---

## 3. 🏥 CRITICAL INFRASTRUCTURE & LIFELINE ASSETS

Total Infrastructure Facilities Monitored: **""" + str(len(state.nodes)) + """ Nodes**

| Node ID | Facility Name | Category | Elevation | Flood Depth | Vulnerability | Operational Status | Backup Power | Provenance Mode |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
"""
        for n in state.nodes:
            power_str = f"⚡ {n.backup_power_hours:.1f}h Fuel (ACTIVE)" if n.backup_power_active else "Grid AC Online"
            doc += f"| `{n.id}` | **{n.name}** | `{n.node_type}` | {n.elevation_m}m | **{n.flood_depth_m:.2f}m** | {(n.vulnerability_index*100):.0f}% | `{n.status.upper()}` | {power_str} | `CALIBRATED_BASELINE` |\n"

        doc += """
---

## 4. 🛣️ ROAD NETWORK & ARTERIAL CORRIDOR STATUS

Total Road Network Corridors Monitored: **""" + str(len(state.roads)) + """ Segments**

| Road ID | Corridor Name | Length | Elevation | Flood Depth | Flow Speed | Segment Status | Evacuation Route? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
"""
        for r in state.roads:
            evac_tag = "✅ GREEN EVAC CORRIDOR" if r.is_evacuation_corridor else "Secondary Arterial"
            doc += f"| `{r.id}` | **{r.name}** | {r.length_km:.1f} km | {r.elevation_m:.1f}m | **{r.flood_depth_m:.2f}m** | {r.current_speed_kmh:.0f} / {r.max_speed_kmh:.0f} km/h | `{r.status.upper()}` | {evac_tag} |\n"

        doc += """
---

## 5. ⚠️ DETECTED CASCADE INFRASTRUCTURE FAILURES

Total Active Cascade Dependency Links: **""" + str(len(state.cascade_links)) + """ Chain Reactions**

"""
        if len(state.cascade_links) == 0:
            doc += "*No multi-order cascade failures detected. Infrastructure operating within safety resilience envelopes.*\n\n"
        else:
            for idx, link in enumerate(state.cascade_links):
                doc += f"### Cascade Event #{idx+1} (Level {link.cascade_level} - {link.severity.upper()})\n"
                doc += f"- **Trigger Cause:** `{link.trigger_type}`\n"
                doc += f"- **Source Node:** `{link.source_id}` $\\rightarrow$ **Impacted Node:** `{link.target_id}`\n"
                doc += f"- **Time to Onset:** T+{link.time_offset_min} minutes\n"
                doc += f"- **Operational Description:** {link.description}\n"
                doc += f"- **Calculation Mode:** `MODELED_PHYSICS_SIMULATION`\n\n"

        doc += """---

## 6. 🧭 AI DYNAMIC EVACUATION CORRIDORS & SAFE ROUTES

Total Computed Egress Corridors: **""" + str(len(state.evacuation_routes)) + """ Population Sectors**

| Sector Origin | Target High-Ground Shelter | Distance | Travel Time | Safety Score | Corridor Status | Evacuees Assigned |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
"""
        for route in state.evacuation_routes:
            doc += f"| **{route.origin_sector}** | **{route.destination_shelter}** | {route.distance_km:.1f} km | **{route.estimated_time_minutes:.0f} min** | {(route.safety_score*100):.0f}% | `{route.route_status.upper()}` | **{route.evacuees_assigned:,} citizens** |\n"

        doc += f"""
---

## 7. 📋 INCIDENT ACTION PLAN (IAP) & TACTICAL DIRECTIVES

- **Operational Priority:** {state.iap.incident_objectives[0] if state.iap.incident_objectives else 'Maintain Life-Safety and Critical Hospital Grid Uptime'}
- **Evacuation Target Population:** **{state.iap.evacuation_target_population:,} Citizens**
- **Critical Breaches Identified:** **{len(state.iap.critical_breaches)} Hotspots**
- **Recommended Pump Allocations:** **{len(state.iap.pump_allocations)} Dewatering Units**
- **Live NDRF Deployments:** **{len(state.iap.ndrf_deployments)} Field Teams Dispatched**

*Generated by CivicTwin AI Command Infrastructure Engine.*
"""
        return doc

dataset_export_service = DatasetExportService()
