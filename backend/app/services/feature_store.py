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
    Structured Feature Store and Multi-Hazard Tabular Processing Layer:
    Computes mathematical risk scores for Flood, Fire, and Cyclone with empirical
    Source Confidence % based on independent sensor signal agreement.
    """

    def __init__(self):
        # Reference Bay of Bengal / Arabian Sea cyclonic depression center (Lat/Lng)
        self.cyclone_depression_center = (18.45, 86.80)  # Off Odisha/AP Coast
        self.cyclone_max_wind_kmh = 165.0
        self.cyclone_hours_to_landfall = 18.0

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
        hotspot_count_firms: int = 4,
        mean_frp_mw: float = 38.5
    ) -> Dict[str, Any]:
        """
        Extracts structured feature vector and calculates:
        1. Flood Risk Formula (Rain + River + Topo + Soil)
        2. Fire Risk Formula (Hotspot Density + FRP + Proximity)
        3. Cyclone Risk Formula (Wind + Haversine Track Distance + Surge + ETA)
        4. Empirical Source Confidence Score % (Source Agreement Metric)
        """
        # =========================================================================
        # 1. FLOOD RISK FORMULA (Option A Weighted Multi-Factor)
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
        approx_zone_area_km2 = 250.0
        hotspot_density_norm = min(1.0, (hotspot_count_firms / approx_zone_area_km2) * 50.0)
        fire_frp_norm = min(1.0, mean_frp_mw / 80.0)
        proximity_to_substation_inv = max(0.0, min(1.0, (5.0 - distance_to_water_km) / 5.0))

        fire_risk_score = round(
            ((0.50 * hotspot_density_norm) + 
             (0.30 * fire_frp_norm) + 
             (0.20 * proximity_to_substation_inv)) * 100.0,
            1
        )

        # =========================================================================
        # 3. CYCLONE RISK FORMULA (Haversine Track Distance + Surge + Wind + ETA)
        # =========================================================================
        dist_to_cyclone_km = haversine_distance_km(
            district_lat, district_lng,
            self.cyclone_depression_center[0], self.cyclone_depression_center[1]
        )
        track_dist_inverse = max(0.0, min(1.0, (800.0 - dist_to_cyclone_km) / 800.0))
        wind_speed_norm = min(1.0, self.cyclone_max_wind_kmh / 200.0)
        is_coastal = elevation_m < 25.0 and distance_to_water_km < 5.0
        storm_surge_risk = max(0.0, min(1.0, (15.0 - elevation_m) / 15.0)) if is_coastal else 0.05
        time_to_landfall_inv = max(0.0, min(1.0, (48.0 - self.cyclone_hours_to_landfall) / 48.0))

        cyclone_risk_score = round(
            ((0.40 * wind_speed_norm) +
             (0.30 * track_dist_inverse) +
             (0.20 * storm_surge_risk) +
             (0.10 * time_to_landfall_inv)) * 100.0,
            1
        )

        # =========================================================================
        # 4. EMPIRICAL SOURCE CONFIDENCE SCORE % (Agreement Across 5 Independent Signals)
        # =========================================================================
        # Signal 1: Heavy 24h Precipitation (Rainfall > 60mm)
        s1_rain = 1 if rainfall_24h_mm >= 60.0 else 0
        # Signal 2: Rapid River Level Rise Rate (Rise > 0.15 m/hr)
        s2_river = 1 if river_rise_rate_m_hr >= 0.15 else 0
        # Signal 3: Topographical Drainage Trap (Elevation < 15m and Slope < 2.5 deg)
        s3_topo = 1 if (elevation_m < 15.0 and slope_deg < 2.5) else 0
        # Signal 4: High Soil Moisture Saturation (Soil > 70%)
        s4_soil = 1 if soil_saturation_pct >= 70.0 else 0
        # Signal 5: Historical Disaster Hotspot (Past frequency >= 6 per decade)
        s5_hist = 1 if historical_flood_freq_per_decade >= 6 else 0

        agreeing_signals = s1_rain + s2_river + s3_topo + s4_soil + s5_hist
        confidence_pct = round((agreeing_signals / 5.0) * 100.0, 1)

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
                "distance_to_cyclone_eye_km": round(dist_to_cyclone_km, 1),
                "firms_hotspots_count": hotspot_count_firms
            },
            "risk_model_output": {
                "hazard_type": "flood",
                "option_a_composite_risk_score": flood_risk_score,
                "threat_level": threat_level,
                "confidence_pct": confidence_pct,
                "agreeing_signals_count": agreeing_signals,
                "total_signals_evaluated": 5,
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
        """Returns feature table across key Indian river basins with precise coordinates"""
        sample_districts = [
            ("Mumbai Suburban", "Maharashtra", 112.5, 185.0, 480.0, 0.24, 6.2, 0.8, 88.0, 0.2, 9, 19.076, 72.877, 5, 42.0),
            ("North East Delhi", "Delhi NCR", 78.0, 115.0, 310.0, 0.18, 204.0, 0.5, 75.0, 0.4, 6, 28.669, 77.262, 3, 31.0),
            ("Kamrup Metropolitan", "Assam", 145.0, 220.0, 1850.0, 0.31, 52.0, 1.1, 94.0, 0.1, 10, 26.144, 91.736, 1, 15.0),
            ("Chennai Central", "Tamil Nadu", 95.0, 150.0, 420.0, 0.20, 7.5, 0.6, 80.0, 0.3, 8, 13.082, 80.270, 2, 22.0),
            ("Kolkata Municipal", "West Bengal", 88.0, 135.0, 610.0, 0.28, 9.0, 0.4, 85.0, 0.2, 7, 22.572, 88.363, 2, 28.0),
            ("Ernakulam (Aluva)", "Kerala", 160.0, 240.0, 890.0, 0.35, 12.0, 2.5, 96.0, 0.1, 9, 10.107, 76.351, 1, 18.0),
            ("Dehradun (Rishikesh)", "Uttarakhand", 130.0, 190.0, 740.0, 0.42, 340.0, 5.8, 82.0, 0.2, 8, 30.086, 78.267, 1, 12.0),
            ("Cuttack Delta", "Odisha", 90.0, 140.0, 920.0, 0.22, 28.0, 0.7, 86.0, 0.3, 8, 20.462, 85.882, 3, 35.0)
        ]

        return [self.compute_district_features(*args) for args in sample_districts]

geospatial_feature_store = GeospatialFeatureStoreService()
