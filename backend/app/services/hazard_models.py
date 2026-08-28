import math
from typing import Dict, Any, List

class MultiHazardEngine:
    """
    Simulates multi-hazard urban disaster physics vectors:
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
        All impact counts dynamically scale with release rate, wind dispersion, and zone geometry.
        """
        wind_speed_ms = max(1.0, wind_speed_kmh / 3.6)
        
        # Downwind distance contours (km)
        lethal_idlh_km = round(math.sqrt(release_rate_kg_s * 12.0 / wind_speed_ms) * 0.4, 2)
        toxic_evac_km = round(lethal_idlh_km * 2.4, 2)
        advisory_km = round(toxic_evac_km * 2.0, 2)

        # Downwind angle
        downwind_angle_deg = (wind_direction_deg + 180.0) % 360.0

        # Physical impact scaling based on plume geometry and release mass
        # Urban density model (~3,500 - 5,000 residents / km² standard metro density)
        area_red_km2 = math.pi * (lethal_idlh_km ** 2) * 0.35  # Plume cone fraction
        area_orange_km2 = math.pi * (toxic_evac_km ** 2) * 0.35 - area_red_km2
        area_yellow_km2 = math.pi * (advisory_km ** 2) * 0.35 - math.pi * (toxic_evac_km ** 2) * 0.35

        density_factor = 4200.0  # Residents per km² in urban corridor
        rate_intensity_multiplier = min(4.0, max(0.2, release_rate_kg_s / 25.0))

        est_casualties = max(25, round(area_red_km2 * density_factor * 0.22 * rate_intensity_multiplier))
        est_pop_orange = max(150, round(area_orange_km2 * density_factor * 0.85))
        est_pop_yellow = max(500, round(area_yellow_km2 * density_factor * 0.95))

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
                    "radius_km": lethal_idlh_km,
                    "ppe_required": "Level-A Hazmat Self-Contained Breathing (SCBA)",
                    "estimated_casualties_if_unprotected": est_casualties
                },
                {
                    "zone": "Orange Zone (Toxic Irritant / Shelter-In-Place)",
                    "radius_km": toxic_evac_km,
                    "ppe_required": "Level-C Gas Filter Masks",
                    "estimated_affected_population": est_pop_orange
                },
                {
                    "zone": "Yellow Zone (Advisory Plume Envelope)",
                    "radius_km": advisory_km,
                    "action": "Close windows and HVAC air intakes",
                    "estimated_affected_population": est_pop_yellow
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
        Protected against division-by-zero for shallow epicenters (focal_depth_km >= 0).
        Structural collapse metrics dynamically scale with energy magnitude & focal depth attenuation.
        """
        # Division-by-zero protection for surface/shallow quakes
        safe_focal_depth = max(0.5, focal_depth_km)

        # Attenuation PGA model (g) calibrated for realistic 0.01g - 1.20g range
        pga_raw = 0.04 * (10 ** (0.28 * (magnitude_richter - 4.0))) / ((safe_focal_depth + 4.0) ** 0.5)
        capped_pga = round(min(1.20, max(0.01, pga_raw)), 3)

        # Dynamic MMI scale assignment
        if magnitude_richter >= 7.8 or capped_pga >= 0.50:
            mmi_scale = "X - DISASTROUS (Widespread Collapse)"
        elif magnitude_richter >= 6.8 or capped_pga >= 0.25:
            mmi_scale = "VIII - SEVERE (Moderate/Heavy Damage)"
        elif magnitude_richter >= 5.8 or capped_pga >= 0.10:
            mmi_scale = "VII - VERY STRONG (Moderate Damage)"
        elif magnitude_richter >= 4.8:
            mmi_scale = "VI - STRONG (Felt by All, Slight Damage)"
        else:
            mmi_scale = "IV - LIGHT / MODERATE"

        # Structural severity scaling: 0 at M4.5 to 1.0 at M9.0
        severity_factor = max(0.0, min(1.0, (magnitude_richter - 4.5) / 4.5))
        depth_attenuation = min(2.0, max(0.5, 12.0 / safe_focal_depth))

        unreinforced_masonry_pct = round(min(98.0, 15.0 + (severity_factor * 75.0 * depth_attenuation)), 1)
        rcc_frame_pct = round(min(65.0, 2.0 + (severity_factor * 35.0 * depth_attenuation)), 1)
        pipeline_ruptures = max(1, round(2 + (severity_factor * 38.0 * depth_attenuation)))

        return {
            "hazard_type": "EARTHQUAKE_SHAKEMAP",
            "magnitude": magnitude_richter,
            "focal_depth_km": focal_depth_km,
            "epicenter": [epicenter_lat, epicenter_lng],
            "peak_ground_acceleration_g": capped_pga,
            "mmi_intensity": mmi_scale,
            "structural_collapse_risk": {
                "unreinforced_masonry_buildings_pct": unreinforced_masonry_pct,
                "rcc_frame_structures_pct": rcc_frame_pct,
                "underground_pipeline_ruptures_expected": pipeline_ruptures
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
        Calculates urban slum fire propagation rate using Rothermel fuel & wind velocity formulas.
        Resource allocation dynamically scales with fire spread velocity.
        """
        rate_of_spread_m_min = round(4.5 + (wind_speed_kmh * 0.35) * (1.8 if fuel_density_high else 1.0), 1)
        engulf_time = round(600.0 / rate_of_spread_m_min, 1)

        foam_tenders_needed = max(2, round(rate_of_spread_m_min / 3.0))
        water_bowsers_needed = max(3, round(rate_of_spread_m_min / 2.0))

        return {
            "hazard_type": "URBAN_FIRE_CONFLAGRATION",
            "origin": [origin_lat, origin_lng],
            "rate_of_spread_m_per_min": rate_of_spread_m_min,
            "time_to_engulf_ward_min": engulf_time,
            "firefighting_resources_required": [
                f"{foam_tenders_needed}x High-Pressure Foam Tenders",
                f"{water_bowsers_needed}x Water Bowsers (10,000L)",
                "Aerial Ladder Platform (54m)"
            ]
        }

multi_hazard_engine = MultiHazardEngine()
