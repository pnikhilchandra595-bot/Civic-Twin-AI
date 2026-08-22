from typing import Dict, Any
import datetime
from app.models.schemas import CityDigitalTwinState

class DatasetExportService:
    """
    Generates structured, human-readable data documents and reports
    from the live Digital Twin state across all urban aspects.
    """

    def generate_markdown_doc(self, state: CityDigitalTwinState) -> str:
        now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
        
        doc = f"""# 🏙️ CIVICTWIN AI – LIVE URBAN DIGITAL TWIN REAL-TIME DATASET REPORT
**Generated At:** {now_str}  
**Active Scenario:** {state.city_name} (`{state.city_id}`)  
**Center Coordinates:** Lat {state.center_coords[0]:.4f}° N, Lng {state.center_coords[1]:.4f}° E  
**Simulation Timeline:** T+{state.timeline_hour:.1f} Hours  
**Overall Disaster Threat Level:** {state.iap.overall_threat_level}  
**National Disaster Management Authority (NDMA / SDMA) - Incident Command System**

---

## 1. 🌦️ ATMOSPHERIC, WEATHER & SATELLITE RADAR TELEMETRY

| Parameter | Current Live Reading | Threshold / Normal Range | Status | Data Source |
| :--- | :--- | :--- | :--- | :--- |
| **Precipitation / Rain Rate** | **{state.rain_intensity_mmhr:.1f} mm/hr** | Normal: <15 mm/hr, Warning: >35 mm/hr, Heavy: >65 mm/hr | {'CRITICAL' if state.rain_intensity_mmhr >= 45 else 'WARNING' if state.rain_intensity_mmhr >= 15 else 'NORMAL'} | IMD / Open-Meteo Satellite Mesh |
| **Coastal / River Surge** | **{state.storm_surge_m:.2f} meters** | Normal: 0.0m, High Tide Warning: >0.8m, Surge: >1.5m | {'CRITICAL' if state.storm_surge_m >= 1.2 else 'WARNING' if state.storm_surge_m > 0.4 else 'NORMAL'} | Central Water Commission (CWC) Tidal Gauge |
| **Atmospheric Wind Speed** | **{state.wind_speed_kmh:.1f} km/h** | Gale Warning: >60 km/h, Cyclone: >90 km/h | {'WARNING' if state.wind_speed_kmh >= 50 else 'NORMAL'} | IMD Doppler Weather Radar |
| **Wind Direction** | **{state.wind_direction_deg:.0f}° (South-West Monsoon)** | - | Active Monsoon Vector | Anemometer Array |
| **Mithi River Floodgates** | **{'BREACHED / OVERFLOWING' if state.levee_breached else 'SECURE / HIGH TIDE LOCK'}** | Retaining Wall: 5.5m | {'EMERGENCY' if state.levee_breached else 'NORMAL'} | BMC Stormwater Telemetry |
| **Primary Power Grid** | **{'TRIPPED / OFFLINE' if state.substation_tripped else 'OPERATIONAL ONLINE'}** | 220kV Receiving Bus | {'BLACKOUT' if state.substation_tripped else 'NORMAL'} | State Load Dispatch Center (SLDC) |

---

## 2. 📡 REAL-TIME IoT SENSOR GRID TELEMETRY

Total Active Telemetry Channels: **{len(state.sensors)} Connected Real-Time Nodes**

| Sensor ID | Sensor Name | Type | Current Value | Warning Level | Critical Level | Condition Status | Trend |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
"""
        for s in state.sensors:
            doc += f"| `{s.sensor_id}` | **{s.name}** | `{s.sensor_type}` | **{s.current_value:.1f} {s.unit}** | {s.threshold_warning} {s.unit} | {s.threshold_critical} {s.unit} | `{s.status.upper()}` | {s.trend.upper()} |\n"

        doc += """
---

## 3. 🏥 CRITICAL INFRASTRUCTURE & LIFELINE ASSETS

Total Infrastructure Facilities Monitored: **""" + str(len(state.nodes)) + """ Nodes**

| Node ID | Facility Name | Category | Elevation | Flood Depth | Vulnerability | Operational Status | Backup Power | Details / Capacity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
"""
        for n in state.nodes:
            cap_str = f"{n.capacity_used}/{n.capacity_total}" if n.capacity_total > 0 else f"Pop: {n.population_density}"
            power_str = f"⚡ {n.backup_power_hours:.1f}h Fuel (ACTIVE)" if n.backup_power_active else "Grid AC Online"
            doc += f"| `{n.id}` | **{n.name}** | `{n.node_type}` | {n.elevation_m}m | **{n.flood_depth_m:.2f}m** | {(n.vulnerability_index*100):.0f}% | `{n.status.upper()}` | {power_str} | {cap_str} |\n"

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
                doc += f"- **Operational Description:** {link.description}\n\n"

        doc += """---

## 6. 🧭 AI DYNAMIC EVACUATION CORRIDORS & SAFE ROUTES

Total Computed Egress Corridors: **""" + str(len(state.evacuation_routes)) + """ Population Sectors**

| Sector Origin | Target High-Ground Shelter | Distance | Travel Time | Safety Score | Corridor Status | Evacuees Assigned |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
"""
        for route in state.evacuation_routes:
            doc += f"| **{route.source_name}** | **{route.target_shelter_name}** | {route.distance_km:.1f} km | **{route.estimated_time_min:.1f} min** | {(route.safety_score*100):.0f}% | `{route.status.upper()}` | {route.assigned_evacuees:,} citizens |\n"

        doc += """
---

## 7. 🚨 FEMA / NDMA INCIDENT ACTION PLAN (ICS-201/202)

- **Incident Name:** """ + state.iap.incident_name + """
- **Operational Period:** """ + state.iap.operational_period + """
- **Overall Threat Level:** **""" + state.iap.overall_threat_level + """**

### Executive Situation Report (SITREP):
> """ + state.iap.incident_commander_summary + """

### Strategic Operational Objectives:
"""
        for obj in state.iap.strategic_objectives:
            doc += f"- {obj}\n"

        doc += "\n### Multi-Agency Operational Directives:\n"
        for agency, tasks in state.iap.agency_tasks.items():
            doc += f"#### 🛡️ {agency}\n"
            for t in tasks:
                doc += f"- {t}\n"

        doc += "\n### Multi-Lingual Emergency Public Broadcast (CAP Protocol):\n"
        doc += f"```\n{state.iap.public_emergency_alert}\n```\n"

        doc += """
---

## 8. 🚒 ACTIVE EMERGENCY RESPONSE ASSETS & DISPATCH UNITS

| Unit Callsign | Unit Type | Agency | Current Status | Assigned Location | Operational Mission |
| :--- | :--- | :--- | :--- | :--- | :--- |
"""
        for unit in state.dispatch_units:
            doc += f"| **{unit.callsign}** | `{unit.unit_type}` | {unit.agency} | `{unit.status.upper()}` | Lat: {unit.lat:.4f}, Lng: {unit.lng:.4f} | {unit.assigned_mission} |\n"

        doc += f"""
---
*Report synthesized automatically by **CivicTwin AI Digital Twin Engine** in compliance with NDMA / SDMA & FEMA ICS Standards.*
"""
        return doc

dataset_export_service = DatasetExportService()
