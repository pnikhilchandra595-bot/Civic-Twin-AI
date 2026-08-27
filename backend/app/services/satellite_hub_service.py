import os
import httpx
import datetime
from typing import Dict, Any, List, Optional

class CopernicusSatelliteHubService:
    """
    Live Copernicus Data Space Ecosystem (CDSE) / Sentinel Hub Integration.
    Uses OAuth2 client-credentials flow to query Sentinel-2 MSI L2A Statistical API
    for NDWI (Normalized Difference Water Index: (B03 - B08)/(B03 + B08)) surface water extent.
    """

    def __init__(self):
        env_file = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
        if os.path.exists(env_file):
            with open(env_file, "r") as f:
                for line in f:
                    if "=" in line and not line.startswith("#"):
                        k, v = line.strip().split("=", 1)
                        if k not in os.environ:
                            os.environ[k] = v

        self.client_id = os.getenv("COPERNICUS_CLIENT_ID", "")
        self.client_secret = os.getenv("COPERNICUS_CLIENT_SECRET", "")
        self.auth_token_url = "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token"
        self.statistics_url = "https://sh.dataspace.copernicus.eu/api/v1/statistics"
        self._cached_token: Optional[str] = None
        self._token_expires_at: Optional[datetime.datetime] = None
        self._cached_ndwi: Dict[str, Any] = {}
        self._ndwi_cached_at: Dict[str, datetime.datetime] = {}
        self._cache_ttl_seconds = 600  # 10 min cache

    async def _get_oauth_access_token(self) -> Optional[str]:
        """
        Fetches or returns cached OAuth2 Bearer token from CDSE identity service.
        """
        now = datetime.datetime.now()
        if self._cached_token and self._token_expires_at and now < self._token_expires_at:
            return self._cached_token

        if not self.client_id or not self.client_secret:
            return None

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(
                    self.auth_token_url,
                    data={
                        "grant_type": "client_credentials",
                        "client_id": self.client_id,
                        "client_secret": self.client_secret
                    }
                )
                if resp.status_code == 200:
                    token_data = resp.json()
                    self._cached_token = token_data.get("access_token")
                    expires_in = token_data.get("expires_in", 600)
                    self._token_expires_at = now + datetime.timedelta(seconds=expires_in - 30)
                    return self._cached_token
        except Exception as e:
            print(f"Copernicus OAuth token error: {e}")

        return None

    async def fetch_ndwi_water_statistics(
        self,
        bbox: Optional[List[float]] = None,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Queries Sentinel Hub Statistical API for NDWI surface water statistics.
        bbox: [west, south, east, north] in EPSG:4326 (default: Mumbai Catchment)
        """
        if bbox is None:
            bbox = [72.82, 18.95, 72.88, 19.02]  # Focused Mumbai Suburban bounding box

        cache_key = f"{bbox[0]:.3f}_{bbox[1]:.3f}_{bbox[2]:.3f}_{bbox[3]:.3f}"
        now_dt = datetime.datetime.now()
        if cache_key in self._cached_ndwi and cache_key in self._ndwi_cached_at:
            if (now_dt - self._ndwi_cached_at[cache_key]).total_seconds() < self._cache_ttl_seconds:
                return self._cached_ndwi[cache_key]

        now = datetime.datetime.utcnow()
        if not date_to:
            date_to = now.strftime("%Y-%m-%dT23:59:59Z")
        if not date_from:
            date_from = (now - datetime.timedelta(days=30)).strftime("%Y-%m-%dT00:00:00Z")

        token = await self._get_oauth_access_token()

        if token:
            evalscript = """
            //VERSION=3
            function setup() {
              return {
                input: [{ bands: ["B03", "B08", "dataMask"] }],
                output: [
                  { id: "ndwi", bands: 1 },
                  { id: "dataMask", bands: 1 }
                ]
              };
            }
            function evaluatePixel(sample) {
              let ndwi = (sample.B03 - sample.B08) / (sample.B03 + sample.B08);
              return {
                ndwi: [ndwi],
                dataMask: [sample.dataMask]
              };
            }
            """

            payload = {
                "input": {
                    "bounds": {
                        "bbox": bbox,
                        "properties": {"crs": "http://www.opengis.net/def/crs/EPSG/0/4326"}
                    },
                    "data": [{
                        "type": "sentinel-2-l2a",
                        "dataFilter": {"timeRange": {"from": date_from, "to": date_to}}
                    }]
                },
                "aggregation": {
                    "timeRange": {"from": date_from, "to": date_to},
                    "aggregationInterval": {"of": "P5D"},
                    "evalscript": evalscript,
                    "width": 256,
                    "height": 256
                }
            }

            headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
            try:
                async with httpx.AsyncClient(timeout=20.0) as client:
                    resp = await client.post(self.statistics_url, json=payload, headers=headers)
                    if resp.status_code == 200:
                        data = resp.json()
                        intervals = data.get("data", [])
                        
                        # Extract statistics from the most recent valid interval
                        mean_ndwi = 0.0
                        max_ndwi = 0.0
                        if intervals:
                            latest_stats = intervals[-1].get("outputs", {}).get("ndwi", {}).get("bands", {}).get("B0", {}).get("stats", {})
                            mean_ndwi = latest_stats.get("mean", 0.0)
                            max_ndwi = latest_stats.get("max", 0.0)

                        # Threshold check: NDWI > 0.20 indicates open surface water / inundation
                        inundation_confirmed = max_ndwi > 0.20 or mean_ndwi > 0.10

                        result = {
                            "status": "success",
                            "source": "Copernicus Data Space Ecosystem (Sentinel-2 L2A)",
                            "satellite": "Sentinel-2 MSI (10m Resolution)",
                            "spectral_index": "NDWI (B03-Green, B08-NIR)",
                            "bbox": bbox,
                            "time_range": {"from": date_from, "to": date_to},
                            "mean_ndwi": round(mean_ndwi, 4),
                            "max_ndwi": round(max_ndwi, 4),
                            "inundation_confirmed": inundation_confirmed,
                            "raw_statistics": data
                        }
                        self._cached_ndwi[cache_key] = result
                        self._ndwi_cached_at[cache_key] = datetime.datetime.now()
                        return result
            except Exception as e:
                print(f"Copernicus Statistical API error: {e}")

        return {
            "status": "query_failed",
            "source": "Copernicus Data Space Ecosystem (CDSE)",
            "satellite": "Sentinel-2 MSI (10m Resolution)",
            "spectral_index": "NDWI (Normalized Difference Water Index)",
            "bbox": bbox,
            "error": "Copernicus CDSE API unconfigured or offline",
            "note": "⚠️ Live Copernicus Sentinel-2 query offline.",
            "mean_ndwi": None,
            "max_ndwi": None,
            "inundation_confirmed": False,
            "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")
        }


satellite_hub_service = CopernicusSatelliteHubService()
