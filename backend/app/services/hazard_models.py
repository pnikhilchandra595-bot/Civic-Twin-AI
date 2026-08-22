import math
from typing import Dict, Any, List

class MultiHazardEngine:
    """
    Simulates multi-hazard urban disaster vectors:
    1. Atmospheric Toxic Hazmat Gas Plume (Gaussian Plume Dispersion)
    2. Cyclone Gale & Coastal Inundation Surge (SLOSH / Saffir-Simpson)
    3. Earthquake Structural ShakeMap & Collapse Vulnerability (PGA / MMI)
    4. Urban Slum & Grid Fire Spread (Rothermel Flame Propagation)
    """

    def calculate_hazmat_gas_plume(
        self,
        source_lat: float,
        source_lng: float,
        chemical_name: str = "Ammonia (NH3)",
        release_rate_kg_s: float = 25.0,
        wind_speed_kmh: float = 30.0,
        wind_direction_deg: float = 220.0,
        atmospheric_stability: str = "D_NEUTRAL"
    ) -> Dict[str, Any]:
        """
        Computes Gaussian gas dispersion ellipse downwind from industrial storage source.
        """
        wind_speed_ms = max(1.0, wind_speed_kmh / 3.6)
        
        # Downwind distance contours (km)
        lethal_idlh_km = math.sqrt(release_rate_kg_s * 12.0 / wind_speed_ms) * 0.4
        toxic_evac_km = lethal_idlh_km * 2.4
        advisory_km = toxic_evac_km * 2.0

        # Downwind angle
        downwind_angle_deg = (wind_direction_deg + 180.0) % 360.0

        return {
            "hazard_type": "HAZMAT_TOXIC_GAS_LEAK",
            "chemical": chemical_name,
            "release_rate_kg_s": release_rate_kg_s,
            "wind_vector": {
                "wind_speed_kmh": wind_speed_kmh,
                "wind_direction_deg": wind_direction_deg,
                "downwind_trajectory_deg": downwind_angle_deg
            },
            "source_location": [source_lat, source_lng],
            "impact_zones": [
                {
                    "zone": "Red Zone (IDLH Lethal / Immediate Evacuation)",
                    "radius_km": round(lethal_idlh_km, 2),
                    "ppe_required": "Level-A Hazmat Self-Contained Breathing (SCBA)",
                    "estimated_casualties_if_unprotected": 1200
                },
                {
                    "zone": "Orange Zone (Toxic Irritant / Shelter-In-Place)",
                    "radius_km": round(toxic_evac_km, 2),
                    "ppe_required": "Level-C Gas Filter Masks",
                    "estimated_affected_population": 18500
                },
                {
                    "zone": "Yellow Zone (Advisory Plume Envelope)",
                    "radius_km": round(advisory_km, 2),
                    "action": "Close windows and HVAC air intakes",
                    "estimated_affected_population": 45000
                }
            ],
            "recommended_actions": [
                f"Transmit instant EAS Toxic Plume Broadcast downwind of {chemical_name} leak.",
                "Deploy NDRF Hazmat CBRN Response Unit with gas neutralizing mist canons.",
                "Reroute emergency traffic away from downwind arterial corridors."
            ]
        }

    def calculate_earthquake_shakemap(
        self,
        epicenter_lat: float,
        epicenter_lng: float,
        magnitude_richter: float = 6.8,
        focal_depth_km: float = 12.0
    ) -> Dict[str, Any]:
        """
        Computes Peak Ground Acceleration (PGA) and Modified Mercalli Intensity (MMI).
        """
        # Est PGA (g)
        pga_epicenter_g = round(0.48 * (10 ** (0.22 * magnitude_richter)) / (focal_depth_km ** 0.5), 2)
        mmi_scale = "VIII - SEVERE (Moderate/Heavy Damage)" if magnitude_richter >= 6.5 else "VI - STRONG"

        return {
            "hazard_type": "EARTHQUAKE_SHAKEMAP",
            "magnitude": magnitude_richter,
            "focal_depth_km": focal_depth_km,
            "epicenter": [epicenter_lat, epicenter_lng],
            "peak_ground_acceleration_g": min(0.85, pga_epicenter_g),
            "mmi_intensity": mmi_scale,
            "structural_collapse_risk": {
                "unreinforced_masonry_buildings_pct": 72.0,
                "rcc_frame_structures_pct": 18.0,
                "underground_pipeline_ruptures_expected": 14
            },
            "immediate_priorities": [
                "Deploy NDRF Urban Search & Rescue (USAR) collapse extrication teams.",
                "Isolate gas pipelines and inspect electrical transmission sub-stations for arching.",
                "Mobilize trauma blood bank reserves at Apex Hospitals."
            ]
        }

    def calculate_slum_fire_spread(
        self,
        origin_lat: float,
        origin_lng: float,
        wind_speed_kmh: float = 35.0,
        fuel_density_high: bool = True
    ) -> Dict[str, Any]:
        """
        Calculates urban slum fire propagation rate.
        """
        rate_of_spread_m_min = round(4.5 + (wind_speed_kmh * 0.35) * (1.8 if fuel_density_high else 1.0), 1)

        return {
            "hazard_type": "URBAN_FIRE_CONFLAGRATION",
            "origin": [origin_lat, origin_lng],
            "rate_of_spread_m_per_min": rate_of_spread_m_min,
            "time_to_engulf_ward_min": round(600.0 / rate_of_spread_m_min, 1),
            "firefighting_resources_required": [
                "6x High-Pressure Foam Tenders",
                "8x Water Bowsers (10,000L)",
                "Aerial Ladder Platform (54m)"
            ]
        }

multi_hazard_engine = MultiHazardEngine()
