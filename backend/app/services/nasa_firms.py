import os
import httpx
import csv
import io
import datetime
from typing import List, Dict, Any, Optional
from app.services.demo_state import demo_state

class NASAFIRMSIngestionService:
    """
    Live Ingestion Service for NASA FIRMS (Fire Information for Resource Management System).
    Uses official MAP_KEY to query VIIRS 375m and MODIS Near-Real-Time active fire hotspots across India.
    """

    def __init__(self):
        self.map_key = os.getenv("NASA_FIRMS_API_KEY")
        # India Bounding Box: West=68°E, South=8°N, East=97°E, North=37°N
        self.area_bbox = "68,8,97,37"
        self._cached_hotspots: List[Dict[str, Any]] = []
        self._cache_timestamp: Optional[datetime.datetime] = None
        self._cache_ttl_seconds = 600  # 10 minute cache

    async def fetch_live_india_hotspots(self, day_range: int = 1) -> List[Dict[str, Any]]:
        """
        Fetches live VIIRS 375m thermal anomaly hotspots for India over the last N days.
        Uses 10-minute TTL in-memory cache to prevent NASA API rate limits.
        """
        if demo_state.is_on():
            return [
                {
                    "lat": 30.7333,
                    "lng": 76.7794,
                    "brightness_kelvin": 342.5,
                    "frp_mw": 38.2,
                    "confidence": "high",
                    "acq_date": datetime.datetime.now().strftime("%Y-%m-%d"),
                    "acq_time": "1130",
                    "satellite": "VIIRS SNPP (NASA/NOAA - Demo Mode)",
                    "data_mode": "demo_simulated"
                },
                {
                    "lat": 26.8467,
                    "lng": 80.9462,
                    "brightness_kelvin": 331.0,
                    "frp_mw": 22.4,
                    "confidence": "nominal",
                    "acq_date": datetime.datetime.now().strftime("%Y-%m-%d"),
                    "acq_time": "1130",
                    "satellite": "VIIRS SNPP (NASA/NOAA - Demo Mode)",
                    "data_mode": "demo_simulated"
                }
            ]

        now = datetime.datetime.now()
        if self._cached_hotspots and self._cache_timestamp and (now - self._cache_timestamp).total_seconds() < self._cache_ttl_seconds:
            return self._cached_hotspots

        if not self.map_key:
            return []

        url = f"https://firms.modaps.eosdis.nasa.gov/api/area/csv/{self.map_key}/VIIRS_SNPP_NRT/{self.area_bbox}/{day_range}"
        try:
            async with httpx.AsyncClient(timeout=12.0) as client:
                resp = await client.get(url)
                if resp.status_code == 200 and "latitude" in resp.text:
                    hotspots = []
                    reader = csv.DictReader(io.StringIO(resp.text))
                    for idx, row in enumerate(reader):
                        if idx >= 50:  # Cap to top 50 active hotspots for maximum performance
                            break
                        hotspots.append({
                            "lat": float(row.get("latitude", 0)),
                            "lng": float(row.get("longitude", 0)),
                            "brightness_kelvin": float(row.get("bright_ti4", row.get("brightness", 320))),
                            "frp_mw": float(row.get("frp", 15.0)),
                            "confidence": row.get("confidence", "nominal"),
                            "acq_date": row.get("acq_date", datetime.datetime.now().strftime("%Y-%m-%d")),
                            "acq_time": row.get("acq_time", "1200"),
                            "satellite": "VIIRS SNPP (NASA/NOAA)"
                        })
                    if hotspots:
                        self._cached_hotspots = hotspots
                        self._cache_timestamp = datetime.datetime.now()
                        return hotspots
        except Exception as e:
            print(f"NASA FIRMS API error: {e}")

        return []


nasa_firms_service = NASAFIRMSIngestionService()
