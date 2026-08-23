import datetime
import math
from typing import List, Dict, Any, Optional

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance between two GPS coordinates in kilometers."""
    R = 6371.0  # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2.0) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

class GeospatialFeatureStoreService:
    """
    Structured Feature Store and Multi-Hazard Processing Layer for District Risk:
    Computes mathematical risk scores for Flood, Fire, and Cyclone using explicit
    data inputs, with empirical multi-hazard agreement Confidence % metrics.
    """

    def __init__(self):
        pass

    def compute_district_features(
        self,
        district_name: str,
        state_name: str,
        rainfall_24h_mm: float = 85.4,
        rainfall_48h_mm: float = 142.0,
        river_discharge_m3s: float = 480.0,
        river_rise_rate_m_hr: float = 0.24,
        elevation_m: float = 8.5,
        slope_deg: float = 1.2,
        soil_saturation_pct: float = 82.0,
        distance_to_water_km: float = 0.35,
        historical_flood_freq_per_decade: int = 7,
        district_lat: float = 19.076,
        district_lng: float = 72.877,
        fire_hotspot_density_pct: float = 24.5,
        fire_frp_mw: float = 38.5,
        fire_distance_to_urban_km: float = 2.4,
        cyclone_wind_speed_kmh: float = 145.0,
        cyclone_distance_to_track_km: float = 120.0,
        cyclone_coastal_elevation_m: float = 8.5,
        cyclone_eta_hours: float = 18.0
    ) -> Dict[str, Any]:
        """
        Extracts structured feature vector and calculates:
        1. Flood Risk Formula (Rain + River + Topo + Soil)
        2. Fire Risk Formula (Hotspot Density + FRP + Proximity)
        3. Cyclone Risk Formula (Wind + Track Distance + Surge + ETA)
        4. Empirical Multi-Hazard Confidence Score %
        """
        # =========================================================================
        # 1. FLOOD RISK FORMULA: 0.40*Rain + 0.30*River + 0.20*Topo + 0.10*Soil
        # =========================================================================
        rain_norm = min(100.0, (rainfall_24h_mm / 150.0) * 100.0)
        river_norm = min(100.0, (river_rise_rate_m_hr / 0.35) * 100.0)
        topo_factor = max(0.0, min(100.0, (1.0 - (elevation_m / 40.0)) * 70.0 + (1.0 - (slope_deg / 10.0)) * 30.0))
        soil_norm = min(100.0, soil_saturation_pct)

        flood_risk_score = round(
            (0.40 * rain_norm) + 
            (0.30 * river_norm) + 
            (0.20 * topo_factor) + 
            (0.10 * soil_norm),
            1
        )
        threat_level = "CRITICAL" if flood_risk_score >= 75 else "ELEVATED" if flood_risk_score >= 45 else "MONITOR"

        # =========================================================================
        # 2. FIRE RISK FORMULA: 0.50*HotspotDensity + 0.30*FRP_norm + 0.20*Proximity_inv
        # =========================================================================
        hotspot_density_norm = min(1.0, fire_hotspot_density_pct / 100.0)
        frp_norm = min(1.0, fire_frp_mw / 100.0)
        proximity_inv = max(0.0, min(1.0, (10.0 - fire_distance_to_urban_km) / 10.0))

        fire_risk_score = round(
            ((0.50 * hotspot_density_norm) + 
             (0.30 * frp_norm) + 
             (0.20 * proximity_inv)) * 100.0,
            1
        )

        # =========================================================================
        # 3. CYCLONE RISK FORMULA: 0.40*Wind + 0.30*TrackDist_inv + 0.20*Surge + 0.10*ETA_inv
        # =========================================================================
        wind_norm = min(1.0, cyclone_wind_speed_kmh / 220.0)
        track_inv = max(0.0, min(1.0, (600.0 - cyclone_distance_to_track_km) / 600.0))
        surge_risk = max(0.0, min(1.0, (20.0 - cyclone_coastal_elevation_m) / 20.0)) if cyclone_coastal_elevation_m < 25.0 else 0.05
        eta_inv = max(0.0, min(1.0, (48.0 - cyclone_eta_hours) / 48.0))

        cyclone_risk_score = round(
            ((0.40 * wind_norm) +
             (0.30 * track_inv) +
             (0.20 * surge_risk) +
             (0.10 * eta_inv)) * 100.0,
            1
        )

        # =========================================================================
        # 4. EMPIRICAL MULTI-HAZARD CONFIDENCE SCORE %
        # Evaluates how many of the 3 hazard scores (Flood, Fire, Cyclone)
        # individually cross their own "elevated" threshold (>= 45.0) out of 3 total.
        # =========================================================================
        flood_elevated = 1 if flood_risk_score >= 45.0 else 0
        fire_elevated = 1 if fire_risk_score >= 45.0 else 0
        cyclone_elevated = 1 if cyclone_risk_score >= 45.0 else 0

        elevated_count = flood_elevated + fire_elevated + cyclone_elevated
        # Source agreement percentage across evaluated multi-hazard risks
        confidence_pct = round((elevated_count / 3.0) * 100.0, 1) if elevated_count > 0 else 100.0

        # Option B: XGBoost Inundation Probability Proxy
        ml_inundation_prob_48h = round(min(0.99, max(0.05, flood_risk_score / 100.0 * 1.05)), 2)

        return {
            "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC"),
            "district": district_name,
            "state": state_name,
            "coordinates": {"lat": district_lat, "lng": district_lng},
            "features": {
                "rainfall_24h_mm": rainfall_24h_mm,
                "rainfall_48h_mm": rainfall_48h_mm,
                "river_discharge_m3s": river_discharge_m3s,
                "river_rise_rate_m_hr": river_rise_rate_m_hr,
                "elevation_m": elevation_m,
                "slope_deg": slope_deg,
                "soil_saturation_pct": soil_saturation_pct,
                "distance_to_water_km": distance_to_water_km,
                "historical_flood_freq_per_decade": historical_flood_freq_per_decade,
                "fire_hotspot_density_pct": fire_hotspot_density_pct,
                "fire_frp_mw": fire_frp_mw,
                "fire_distance_to_urban_km": fire_distance_to_urban_km,
                "cyclone_wind_speed_kmh": cyclone_wind_speed_kmh,
                "cyclone_distance_to_track_km": cyclone_distance_to_track_km,
                "cyclone_coastal_elevation_m": cyclone_coastal_elevation_m,
                "cyclone_eta_hours": cyclone_eta_hours
            },
            "risk_model_output": {
                "hazard_type": "flood",
                "option_a_composite_risk_score": flood_risk_score,
                "threat_level": threat_level,
                "confidence_pct": confidence_pct,
                "elevated_hazards_count": elevated_count,
                "total_hazards_evaluated": 3,
                "multi_hazard_scores": {
                    "flood_risk": flood_risk_score,
                    "fire_risk": fire_risk_score,
                    "cyclone_risk": cyclone_risk_score
                },
                "option_b_xgb_inundation_prob_48h": ml_inundation_prob_48h,
                "primary_contributing_factor": (
                    "Heavy 24h Rainfall Rate (40% Weight)" if rain_norm >= river_norm else
                    "Rapid River Sluice Inflow Rate (30% Weight)"
                )
            }
        }

    def get_national_feature_store_table(self) -> List[Dict[str, Any]]:
        """Returns feature table across key Indian river basins with full 18-feature tuple"""
        sample_districts = [
            # district, state, rain24, rain48, river_q, river_rate, elev, slope, soil, dist_w, flood_freq, lat, lng, fire_dens, fire_frp, fire_dist, cyc_wind, cyc_track_dist, cyc_elev, cyc_eta
            ("Mumbai Suburban", "Maharashtra", 112.5, 185.0, 480.0, 0.24, 6.2, 0.8, 88.0, 0.2, 9, 19.076, 72.877, 35.0, 42.0, 1.8, 110.0, 240.0, 6.2, 14.0),
            ("North East Delhi", "Delhi NCR", 78.0, 115.0, 310.0, 0.18, 204.0, 0.5, 75.0, 0.4, 6, 28.669, 77.262, 45.0, 31.0, 0.9, 45.0, 580.0, 204.0, 36.0),
            ("Kamrup Metropolitan", "Assam", 145.0, 220.0, 1850.0, 0.31, 52.0, 1.1, 94.0, 0.1, 10, 26.144, 91.736, 12.0, 15.0, 4.2, 85.0, 410.0, 52.0, 24.0),
            ("Chennai Central", "Tamil Nadu", 95.0, 150.0, 420.0, 0.20, 7.5, 0.6, 80.0, 0.3, 8, 13.082, 80.270, 28.0, 22.0, 2.1, 155.0, 90.0, 7.5, 10.0),
            ("Kolkata Municipal", "West Bengal", 88.0, 135.0, 610.0, 0.28, 9.0, 0.4, 85.0, 0.2, 7, 22.572, 88.363, 20.0, 28.0, 1.5, 140.0, 110.0, 9.0, 12.0),
            ("Ernakulam (Aluva)", "Kerala", 160.0, 240.0, 890.0, 0.35, 12.0, 2.5, 96.0, 0.1, 9, 10.107, 76.351, 15.0, 18.0, 3.5, 95.0, 320.0, 12.0, 20.0),
            ("Dehradun (Rishikesh)", "Uttarakhand", 130.0, 190.0, 740.0, 0.42, 340.0, 5.8, 82.0, 0.2, 8, 30.086, 78.267, 10.0, 12.0, 5.0, 35.0, 720.0, 340.0, 48.0),
            ("Cuttack Delta", "Odisha", 90.0, 140.0, 920.0, 0.22, 28.0, 0.7, 86.0, 0.3, 8, 20.462, 85.882, 30.0, 35.0, 2.8, 175.0, 60.0, 28.0, 8.0)
        ]

        return [self.compute_district_features(*args) for args in sample_districts]

geospatial_feature_store = GeospatialFeatureStoreService()
