import datetime
from typing import List, Dict, Any, Optional

class CWCandIMDScraperService:
    """
    Reference Ingestion Service for:
    1. CWC (Central Water Commission) - River water levels, gauge stations, warning & danger levels (Seeded Baseline).
    2. IMD (India Meteorological Department) - District-wise color-coded rainfall & cyclone warnings (Seeded Baseline).
    
    NOTE: As documented in SYSTEM_DESIGN_DOCUMENT.md, this service provides calibrated seeded reference datasets.
    Live scraping endpoints are not active in this build.
    """

    def __init__(self):
        self.cwc_base_url = "https://ffs.cwc.gov.in"
        self.imd_base_url = "https://mausam.imd.gov.in"

        # Pre-calibrated baseline of major Indian River Basin Gauge Stations
        self.major_cwc_gauges: List[Dict[str, Any]] = [
            {
                "gauge_id": "CWC-MUM-01",
                "river": "Mithi River",
                "basin": "West Flowing Rivers (Konkan)",
                "station_name": "Kurla CST Bridge Station",
                "state": "Maharashtra",
                "district": "Mumbai Suburban",
                "warning_level_m": 3.20,
                "danger_level_m": 4.10,
                "current_level_m": 3.85,
                "trend": "RISING",
                "rate_of_rise_m_hr": 0.24,
                "status": "WARNING",
                "data_mode": "seeded_reference",
                "last_updated": "Monsoon 2026 Reference Baseline"
            },
            {
                "gauge_id": "CWC-DEL-02",
                "river": "Yamuna River",
                "basin": "Ganga Basin",
                "station_name": "Old Railway Bridge (Loha Pul)",
                "state": "Delhi NCR",
                "district": "North East Delhi",
                "warning_level_m": 204.50,
                "danger_level_m": 205.33,
                "current_level_m": 205.80,
                "trend": "RISING",
                "rate_of_rise_m_hr": 0.18,
                "status": "DANGER",
                "data_mode": "seeded_reference",
                "last_updated": "Monsoon 2026 Reference Baseline"
            },
            {
                "gauge_id": "CWC-ASM-03",
                "river": "Brahmaputra River",
                "basin": "Brahmaputra Basin",
                "station_name": "Guwahati DC Court Ghat",
                "state": "Assam",
                "district": "Kamrup Metropolitan",
                "warning_level_m": 49.68,
                "danger_level_m": 50.50,
                "current_level_m": 51.12,
                "trend": "RISING",
                "rate_of_rise_m_hr": 0.31,
                "status": "CRITICAL_OVERTOPPING",
                "data_mode": "seeded_reference",
                "last_updated": "Monsoon 2026 Reference Baseline"
            },
            {
                "gauge_id": "CWC-CHE-04",
                "river": "Adyar River",
                "basin": "East Coast Rivers",
                "station_name": "Saidapet Bridge Station",
                "state": "Tamil Nadu",
                "district": "Chennai",
                "warning_level_m": 6.80,
                "danger_level_m": 8.00,
                "current_level_m": 7.45,
                "trend": "RISING",
                "rate_of_rise_m_hr": 0.20,
                "status": "WARNING",
                "data_mode": "seeded_reference",
                "last_updated": "Monsoon 2026 Reference Baseline"
            },
            {
                "gauge_id": "CWC-KOL-05",
                "river": "Hooghly River",
                "basin": "Ganga Lower Delta",
                "station_name": "Howrah Garden Reach Station",
                "state": "West Bengal",
                "district": "Kolkata",
                "warning_level_m": 5.40,
                "danger_level_m": 6.20,
                "current_level_m": 5.90,
                "trend": "HIGH_TIDE_SURGE",
                "rate_of_rise_m_hr": 0.28,
                "status": "ELEVATED",
                "data_mode": "seeded_reference",
                "last_updated": "Monsoon 2026 Reference Baseline"
            },
            {
                "gauge_id": "CWC-KER-06",
                "river": "Periyar River",
                "basin": "West Flowing Rivers (Kerala)",
                "station_name": "Aluva Manappuram Station",
                "state": "Kerala",
                "district": "Ernakulam",
                "warning_level_m": 4.50,
                "danger_level_m": 5.50,
                "current_level_m": 5.82,
                "trend": "RISING",
                "rate_of_rise_m_hr": 0.35,
                "status": "DANGER",
                "data_mode": "seeded_reference",
                "last_updated": "Monsoon 2026 Reference Baseline"
            },
            {
                "gauge_id": "CWC-UTT-07",
                "river": "Ganga River (Upper)",
                "basin": "Upper Ganga Basin",
                "station_name": "Rishikesh Triveni Ghat",
                "state": "Uttarakhand",
                "district": "Dehradun",
                "warning_level_m": 339.50,
                "danger_level_m": 340.50,
                "current_level_m": 340.85,
                "trend": "FLASH_SURGE",
                "rate_of_rise_m_hr": 0.42,
                "status": "CRITICAL_FLASH",
                "data_mode": "seeded_reference",
                "last_updated": "Monsoon 2026 Reference Baseline"
            },
            {
                "gauge_id": "CWC-ODI-08",
                "river": "Mahanadi River",
                "basin": "Mahanadi Basin",
                "station_name": "Mundali Barrage Station",
                "state": "Odisha",
                "district": "Cuttack",
                "warning_level_m": 29.50,
                "danger_level_m": 30.80,
                "current_level_m": 30.15,
                "trend": "RISING",
                "rate_of_rise_m_hr": 0.22,
                "status": "WARNING",
                "data_mode": "seeded_reference",
                "last_updated": "Monsoon 2026 Reference Baseline"
            }
        ]

        self.imd_bulletins: List[Dict[str, Any]] = [
            {
                "bulletin_id": "IMD-NOWCAST-20260823-01",
                "state": "Maharashtra",
                "districts": ["Mumbai", "Thane", "Raigad", "Ratnagiri"],
                "warning_level": "RED",
                "hazard_type": "Extremely Heavy Rainfall (Monsoon Cloudburst)",
                "expected_rainfall_mm_24h": "180 - 240 mm",
                "valid_until": "Monsoon 2026 Reference Advisory",
                "data_mode": "seeded_reference",
                "impact_advisory": "Flash flooding in low-lying areas, local train delays, subway waterlogging. Movement discouraged unless emergency."
            },
            {
                "bulletin_id": "IMD-NOWCAST-20260823-02",
                "state": "Delhi NCR",
                "districts": ["North East Delhi", "Central Delhi", "East Delhi"],
                "warning_level": "ORANGE",
                "hazard_type": "Moderate to Heavy Rain with Yamuna Catchment Runoff",
                "expected_rainfall_mm_24h": "70 - 110 mm",
                "valid_until": "Monsoon 2026 Reference Advisory",
                "data_mode": "seeded_reference",
                "impact_advisory": "Yamuna floodplain inundation, Ring road traffic diversion, low-lying slum evacuation."
            },
            {
                "bulletin_id": "IMD-NOWCAST-20260823-03",
                "state": "Assam",
                "districts": ["Kamrup", "Dibrugarh", "Golaghat", "Dhubri"],
                "warning_level": "RED",
                "hazard_type": "Severe Brahmaputra Spate & Inundation",
                "expected_rainfall_mm_24h": "150 - 210 mm",
                "valid_until": "Monsoon 2026 Reference Advisory",
                "data_mode": "seeded_reference",
                "impact_advisory": "Embankment breach risks in Kaziranga & Majuli, boat rescue operations activated."
            },
            {
                "bulletin_id": "IMD-NOWCAST-20260823-04",
                "state": "Kerala",
                "districts": ["Wayanad", "Idukki", "Ernakulam", "Kottayam"],
                "warning_level": "RED",
                "hazard_type": "Heavy Ghats Orographic Rainfall & Landslide Warning",
                "expected_rainfall_mm_24h": "190 - 250 mm",
                "valid_until": "Monsoon 2026 Reference Advisory",
                "data_mode": "seeded_reference",
                "impact_advisory": "High landslide vulnerability on steep slopes, night travel prohibited on ghat roads."
            }
        ]

    CWC_LIVE_URL = "https://ffs.india-water.gov.in/ffm/api/station-water-level-above-warning/"

    async def fetch_cwc_river_gauges(self, state_filter: Optional[str] = None) -> Dict[str, Any]:
        """
        Fetches LIVE river gauge stations currently above warning level from CWC's
        official flood forecasting API (ffs.india-water.gov.in). Falls back to a
        clearly labeled seeded reference dataset if the live call fails.
        """
        try:
            import httpx
            import certifi
            async with httpx.AsyncClient(timeout=10.0, verify=certifi.where()) as client:
                res = await client.get(self.CWC_LIVE_URL, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
                if res.status_code == 200:
                    raw = res.json()
                    stations = [
                        {
                            "gauge_id": item.get("stationCode"),
                            "station_code": item.get("stationCode"),
                            "current_level_m": item.get("value"),
                            "status": item.get("status"),
                            "trend": item.get("trend") or "UNKNOWN",
                            "data_mode": "live",
                            "last_updated": datetime.datetime.now().strftime("%Y-%m-%d %H:%M IST"),
                            "source": "LIVE — CWC ffs.india-water.gov.in"
                        }
                        for item in raw
                    ]
                    return {
                        "status": "success",
                        "data_mode": "live",
                        "source": "Central Water Commission (CWC ffs.india-water.gov.in)",
                        "note": "✅ Live CWC real-time stations currently above warning level.",
                        "total_stations": len(stations),
                        "total_gauges": len(stations),
                        "gauges": stations
                    }
        except Exception as e:
            print(f"CWC live fetch failed: {e}")

        # Honest fallback if live endpoint is unreachable
        results = self.major_cwc_gauges
        if state_filter and state_filter.upper() != "ALL":
            results = [g for g in results if g["state"].lower() == state_filter.lower()]
        return {
            "status": "seeded_reference",
            "data_mode": "seeded_reference",
            "source": "Central Water Commission (CWC) River Basin Baseline",
            "note": "⚠️ Static reference dataset — live CWC query failed or unavailable.",
            "total_stations": len(results),
            "total_gauges": len(results),
            "gauges": results
        }

    async def fetch_imd_bulletins(self, state_filter: Optional[str] = None) -> Dict[str, Any]:
        """
        Returns seeded/reference IMD weather bulletins (static baseline).
        NOTE: This is not a live IMD scrape — see SYSTEM_DESIGN_DOCUMENT.md build status.
        """
        results = self.imd_bulletins
        if state_filter and state_filter.upper() != "ALL":
            results = [b for b in results if b["state"].lower() == state_filter.lower()]
        return {
            "status": "seeded_reference",
            "data_mode": "seeded_reference",
            "source": "India Meteorological Department (IMD) Warning Bulletins Baseline",
            "note": "⚠️ Static reference dataset — live IMD bulletin scraping in progress.",
            "total_bulletins": len(results),
            "bulletins": results
        }


cwc_imd_service = CWCandIMDScraperService()
