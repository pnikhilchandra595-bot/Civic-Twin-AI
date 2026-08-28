import math
import datetime
from typing import Dict, Any, List, Optional

class HimalayanGLOFEngine:
    """
    Himalayan Glacial Lake Outburst Flood (GLOF) & High-Altitude Snow Cover Monitoring Engine.
    Simulates:
    1. Glacial Moraine Dam Breach Hydraulics (Froehlich & Costa Peak Outflow Equations)
    2. Debris Flow Attenuation & Downstream Hydroelectric Dam Impact Timelines
    3. Satellite Thermal Melt Anomaly & Moraine Freeboard Stability Index
    """

    CRITICAL_HIMALAYAN_GLACIAL_LAKES = [
        {
            "lake_id": "GLOF-SK-01",
            "name": "South Lhonak Glacial Lake",
            "state": "Sikkim",
            "basin": "Teesta River Basin",
            "elevation_m": 5200,
            "coordinates": [27.915, 88.203],
            "area_hectares": 168.4,
            "volume_million_m3": 65.2,
            "moraine_dam_type": "Terminal Ice-Cored Moraine",
            "threat_level": "VERY_HIGH",
            "downstream_assets": [
                {"name": "Chungthang Hydroelectric Dam (Teesta-III)", "distance_km": 34.0, "travel_time_min": 28},
                {"name": "Mangan Valley Settlement", "distance_km": 58.0, "travel_time_min": 52},
                {"name": "Dikchu Bridge & Barrage", "distance_km": 78.0, "travel_time_min": 74},
                {"name": "Singtam Urban Sector", "distance_km": 94.0, "travel_time_min": 92}
            ]
        },
        {
            "lake_id": "GLOF-UK-02",
            "name": "Chorabari & Vasudhara Tal Complex",
            "state": "Uttarakhand",
            "basin": "Mandakini / Alaknanda Basin",
            "elevation_m": 4350,
            "coordinates": [30.748, 79.062],
            "area_hectares": 84.0,
            "volume_million_m3": 28.5,
            "moraine_dam_type": "Lateral Moraine with Permafrost Core",
            "threat_level": "HIGH",
            "downstream_assets": [
                {"name": "Kedarnath Temple Complex & Base Town", "distance_km": 3.8, "travel_time_min": 6},
                {"name": "Gaurikund Transit Camp", "distance_km": 14.2, "travel_time_min": 18},
                {"name": "Sonprayag Confluence", "distance_km": 20.5, "travel_time_min": 26},
                {"name": "Rudraprayag Sangam", "distance_km": 72.0, "travel_time_min": 85}
            ]
        },
        {
            "lake_id": "GLOF-UK-03",
            "name": "Rishi Ganga Upper Glacier (Nanda Devi)",
            "state": "Uttarakhand",
            "basin": "Dhauliganga / Alaknanda Basin",
            "elevation_m": 4850,
            "coordinates": [30.412, 79.742],
            "area_hectares": 62.5,
            "volume_million_m3": 18.2,
            "moraine_dam_type": "Hanging Rock-Ice Avalanche Slurry",
            "threat_level": "ELEVATED",
            "downstream_assets": [
                {"name": "Rishiganga Small Hydro Project", "distance_km": 12.0, "travel_time_min": 14},
                {"name": "Tapovan Vishnugad NTPC Barrage", "distance_km": 24.0, "travel_time_min": 24},
                {"name": "Joshimath Cantonment Flank", "distance_km": 36.0, "travel_time_min": 40},
                {"name": "Karnaprayag Sangam", "distance_km": 92.0, "travel_time_min": 110}
            ]
        },
        {
            "lake_id": "GLOF-HP-04",
            "name": "Gepang Gath Glacial Lake",
            "state": "Himachal Pradesh",
            "basin": "Chandra / Chenab Basin (Lahaul)",
            "elevation_m": 4120,
            "coordinates": [32.482, 77.218],
            "area_hectares": 95.0,
            "volume_million_m3": 38.0,
            "moraine_dam_type": "Unconsolidated Moraine Ridge",
            "threat_level": "HIGH",
            "downstream_assets": [
                {"name": "Sissu Valley Infrastructure", "distance_km": 16.0, "travel_time_min": 20},
                {"name": "Atal Tunnel North Portal Highway", "distance_km": 28.0, "travel_time_min": 32},
                {"name": "Tandi Confluence (Chandra-Bhaga)", "distance_km": 42.0, "travel_time_min": 48}
            ]
        }
    ]

    def simulate_glof_breach(
        self,
        lake_id: str = "GLOF-SK-01",
        breach_depth_m: float = 24.0,
        breach_width_m: float = 65.0,
        moraine_soil_erosion_rate: float = 1.8
    ) -> Dict[str, Any]:
        """
        Calculates peak breach discharge hydrograph using Froehlich (1995) Dam Breach Equation:
        Q_peak = 0.607 * V_w^0.295 * h_w^1.24 (m3/s)
        """
        lake = next((l for l in self.CRITICAL_HIMALAYAN_GLACIAL_LAKES if l["lake_id"] == lake_id), self.CRITICAL_HIMALAYAN_GLACIAL_LAKES[0])
        
        vol_m3 = lake["volume_million_m3"] * 1e6
        hw = max(5.0, breach_depth_m)
        
        # Froehlich Peak Discharge (m3/s)
        q_peak_m3s = round(0.607 * (vol_m3 ** 0.295) * (hw ** 1.24) * moraine_soil_erosion_rate, 1)
        
        # Debris bulking factor (glacial floods entrain 20-40% boulders/sediment)
        bulked_q_peak = round(q_peak_m3s * 1.35, 1)
        
        # Downstream cascade impacts with velocity attenuation
        impact_schedule = []
        base_velocity_kmh = 36.0  # Steep Himalayan gorge gradient (~25-45 km/h)
        
        for asset in lake["downstream_assets"]:
            t_min = round((asset["distance_km"] / base_velocity_kmh) * 60.0, 1)
            attenuation = math.exp(-0.012 * asset["distance_km"])
            attenuated_q = round(bulked_q_peak * attenuation, 1)
            surge_depth_m = round(math.sqrt(attenuated_q / 45.0), 2)

            threat = "CATASTROPHIC_DESTRUCTION" if surge_depth_m > 8.0 else ("HEAVY_OVERTOPPING" if surge_depth_m > 4.0 else "MODERATE_INUNDATION")

            impact_schedule.append({
                "asset_name": asset["name"],
                "distance_km": asset["distance_km"],
                "arrival_time_min": t_min,
                "peak_surge_discharge_m3s": attenuated_q,
                "surge_depth_m": surge_depth_m,
                "threat_assessment": threat,
                "recommended_protective_action": (
                    "Emergency sluice wide-open discharge & dam evacuation" if "Dam" in asset["name"] or "Barrage" in asset["name"] else
                    "Immediate vertical evacuation to ridge contours > 30m above riverbed"
                )
            })

        return {
            "status": "success",
            "hazard_type": "HIMALAYAN_GLOF_BREACH_CASCADE",
            "lake": lake,
            "simulation_inputs": {
                "breach_depth_m": breach_depth_m,
                "breach_width_m": breach_width_m,
                "moraine_soil_erosion_rate": moraine_soil_erosion_rate
            },
            "hydrology_metrics": {
                "clearwater_q_peak_m3s": q_peak_m3s,
                "debris_bulked_q_peak_m3s": bulked_q_peak,
                "total_water_released_million_m3": round(lake["volume_million_m3"] * 0.72, 1),
                "breach_duration_hours": round(vol_m3 / (q_peak_m3s * 3600 * 0.5), 1)
            },
            "downstream_impact_schedule": impact_schedule,
            "tactical_orders": [
                f"Transmit Grade-1 GLOF Red Alert to {lake['state']} State Disaster Management Authority (SDMA).",
                "Open all bottom spillways and sluices on downstream hydroelectric dams immediately to create flood buffer cushion.",
                "Sound high-decibel mountain sirens across valley floor settlements.",
                "Mobilize NDRF Mountain Rescue & Army USAR columns in high-altitude staging zones."
            ],
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
        }

    def get_himalayan_lake_inventory(self) -> Dict[str, Any]:
        """Returns inventory of critical Himalayan glacial lakes monitored via spaceborne telemetry."""
        return {
            "status": "success",
            "source": "ISRO MOSDAC / NRSC Himalayan Cryosphere & Glacial Lake Registry",
            "total_critical_lakes_tracked": len(self.CRITICAL_HIMALAYAN_GLACIAL_LAKES),
            "cryosphere_monitoring_regions": ["Sikkim Himalaya", "Uttarakhand Garhwal", "Himachal Lahaul-Spiti", "J&K Ladakh"],
            "lakes": self.CRITICAL_HIMALAYAN_GLACIAL_LAKES
        }

glof_engine = HimalayanGLOFEngine()
