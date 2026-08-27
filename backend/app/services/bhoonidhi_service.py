import urllib.request
import json
import ssl
import datetime
import os
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

load_dotenv()

# ============================================================================
# ISRO NRSC BHOONIDHI OPEN SATELLITE DATA ACCESS API SERVICE
# Supported Collections:
# 1. NISAR (NASA-ISRO SAR Interferometry & Ground Subsidence) -> NISAR_SSAR_GCOV / GUNW
# 3. EOS-06 Scatterometer (Ocean Surface Wind Vectors & Cyclone Gales) -> EOS-06_SCAT_3WW / 2B
# 4. ResourceSat-2A LISS-4 (Ultra-High 5.8m Sub-Decameter Damage) -> ResourceSat-2A_LISS4-MX70_L2
# 6. Sentinel-1A SAR (Direct ISRO-Hosted C-Band Radar Pass) -> Sentinel-1A_SAR-IW_GRD
# + CartoSat-1 CartoDEM (30m Elevation) -> CartoSat-1_PAN_CartoDEM_30m
# + ResourceSat-2A LISS-3 -> ResourceSat-2A_LISS3_L2
# ============================================================================

BHOONIDHI_COLLECTIONS_REGISTRY = {
    "NISAR_SSAR_GCOV": {
        "name": "ISRO-NASA NISAR Synthetic Aperture Radar (Interferometry)",
        "emoji": "📡",
        "badge_color": "#a855f7",
        "category": "Interferometric SAR Ground Deformation",
        "resolution": "6m - 12m Dual-Pol (L+S Band)",
        "physics_metric": "Ground Subsidence & Fault Displacement (mm/yr)",
        "role": "Earthquake Fault Rupture & Landslide Creep Telemetry"
    },
    "EOS-06_SCAT_3WW": {
        "name": "ISRO EOS-06 Ku-Band Scatterometer (Ocean Surface Winds)",
        "emoji": "🌀",
        "badge_color": "#06b6d4",
        "category": "Ocean Surface Wind Vectors & Cyclone Gales",
        "resolution": "25km Grid Resolution",
        "physics_metric": "Wind Speed (knots) & Direction (0-360°)",
        "role": "Cyclone Landfall Warning & Sea State Storm Surge"
    },
    "ResourceSat-2A_LISS4-MX70_L2": {
        "name": "ISRO ResourceSat-2A LISS-4 (Sub-Decameter Multispectral)",
        "emoji": "🔬",
        "badge_color": "#eab308",
        "category": "Ultra-High Resolution Urban Infrastructure Damage",
        "resolution": "5.8m Spatial Resolution",
        "physics_metric": "Urban Inundation Boundary & Bridge Structural Damage",
        "role": "Municipal Ward-Level Structural Collapse Inspection"
    },
    "Sentinel-1A_SAR-IW_GRD": {
        "name": "Sentinel-1A SAR IW GRD (ISRO NRSC Hosted Radar Granules)",
        "emoji": "🛰️",
        "badge_color": "#3b82f6",
        "category": "All-Weather Day/Night C-Band Radar Water Extraction",
        "resolution": "10m SAR Backscatter",
        "physics_metric": "Radar Backscatter σ° (< -16.0 dB Threshold)",
        "role": "Cloud-Penetrating Monsoon Flood Inundation Delineation"
    },
    "CartoSat-1_PAN_CartoDEM_30m": {
        "name": "ISRO CartoSat-1 CartoDEM 30m (Topographic Elevation)",
        "emoji": "🏔️",
        "badge_color": "#10b981",
        "category": "High-Precision Digital Elevation Model",
        "resolution": "30m DEM Grid",
        "physics_metric": "Terrain Slope (°) & Catchment Elevation (m ASL)",
        "role": "Hydrodynamic 2D Overland Runoff & Levee Height Modeling"
    },
    "ResourceSat-2A_LISS3_L2": {
        "name": "ISRO ResourceSat-2A LISS-3 (Multispectral Land/Water)",
        "emoji": "🌾",
        "badge_color": "#f97316",
        "category": "Multispectral Agriculture & Crop Damage",
        "resolution": "23.5m VNIR-SWIR",
        "physics_metric": "NDWI (+0.42 Water) & NDVI (+0.68 Crop)",
        "role": "Post-Disaster Agricultural Loss & Standing Water Assessment"
    }
}


class BhoonidhiNRSCService:
    def __init__(self):
        self.base_url = "https://bhoonidhi-api.nrsc.gov.in"
        self.user_id = os.getenv("BHOONIDHI_USER_ID")
        self.password = os.getenv("BHOONIDHI_PASSWORD")
        
        self._access_token: Optional[str] = None
        self._refresh_token: Optional[str] = None
        self._token_expires_at: Optional[datetime.datetime] = None
        
        self._cache: Dict[str, Any] = {}
        self._cache_ttl_sec = 600  # 10 minutes cache for STAC queries

        self._ctx = ssl.create_default_context()
        self._ctx.check_hostname = False
        self._ctx.verify_mode = ssl.CERT_NONE

    def _get_valid_token(self) -> Optional[str]:
        """Authenticate with Bhoonidhi API and return a valid JWT Bearer access token."""
        if not self.user_id or not self.password:
            print("[WARN] BHOONIDHI_USER_ID or BHOONIDHI_PASSWORD environment variable not set in .env")
            return None

        now = datetime.datetime.now(datetime.timezone.utc)
        
        if self._access_token and self._token_expires_at and now < self._token_expires_at:
            return self._access_token

        # If refresh token is available, try refreshing first
        if self._refresh_token:
            try:
                ref_url = f"{self.base_url}/auth/token"
                payload = json.dumps({
                    "userId": self.user_id,
                    "refresh_token": self._refresh_token,
                    "grant_type": "refresh_token"
                }).encode("utf-8")
                req = urllib.request.Request(ref_url, data=payload, headers={
                    "Content-Type": "application/json",
                    "User-Agent": "CivicTwin-AI/1.0"
                })
                with urllib.request.urlopen(req, timeout=10, context=self._ctx) as resp:
                    data = json.loads(resp.read().decode())
                    if data.get("access_token"):
                        self._access_token = data["access_token"]
                        self._refresh_token = data.get("refresh_token", self._refresh_token)
                        expires_in = int(data.get("expires_in", 1200)) - 60
                        self._token_expires_at = now + datetime.timedelta(seconds=expires_in)
                        return self._access_token
            except Exception:
                pass

        # Authenticate using password grant_type
        try:
            auth_url = f"{self.base_url}/auth/token"
            payload = json.dumps({
                "userId": self.user_id,
                "password": self.password,
                "grant_type": "password"
            }).encode("utf-8")
            req = urllib.request.Request(auth_url, data=payload, headers={
                "Content-Type": "application/json",
                "User-Agent": "CivicTwin-AI/1.0"
            })
            with urllib.request.urlopen(req, timeout=10, context=self._ctx) as resp:
                data = json.loads(resp.read().decode())
                if data.get("access_token"):
                    self._access_token = data["access_token"]
                    self._refresh_token = data.get("refresh_token")
                    expires_in = int(data.get("expires_in", 1200)) - 60
                    self._token_expires_at = now + datetime.timedelta(seconds=expires_in)
                    return self._access_token
        except Exception as e:
            print(f"[ERROR] Bhoonidhi NRSC Authentication Failed: {e}")
            return None

    async def search_stac_catalog(
        self,
        lat: float = 19.076,
        lng: float = 72.877,
        selected_collection: Optional[str] = None,
        limit: int = 12
    ) -> Dict[str, Any]:
        """Query Bhoonidhi STAC catalog for satellite assets (NISAR, LISS-4 5.8m, EOS-06 SCAT, Sentinel-1A SAR, CartoDEM)."""
        if selected_collection and selected_collection in BHOONIDHI_COLLECTIONS_REGISTRY:
            collections = [selected_collection]
        else:
            collections = list(BHOONIDHI_COLLECTIONS_REGISTRY.keys())

        cache_key = f"{round(lat, 2)}_{round(lng, 2)}_{selected_collection}_{limit}"
        now = datetime.datetime.now(datetime.timezone.utc)

        if cache_key in self._cache:
            entry = self._cache[cache_key]
            if (now - entry["cached_at"]).total_seconds() < self._cache_ttl_sec:
                return entry["data"]

        token = self._get_valid_token()
        if not token:
            return {
                "status": "auth_error",
                "source": "ISRO NRSC Bhoonidhi Open Satellite Data API",
                "message": "Authentication to Bhoonidhi API failed.",
                "features": []
            }

        search_url = f"{self.base_url}/data/search"
        payload = json.dumps({
            "collections": collections,
            "limit": limit
        }).encode("utf-8")

        req = urllib.request.Request(search_url, data=payload, headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
            "User-Agent": "CivicTwin-AI/1.0"
        })

        try:
            with urllib.request.urlopen(req, timeout=14, context=self._ctx) as resp:
                data = json.loads(resp.read().decode())
                features = data.get("features", [])
                
                # Format features into rich digital twin telemetry objects
                formatted_assets: List[Dict[str, Any]] = []
                for f in features:
                    col = f.get("collection", "ISRO Satellite Asset")
                    asset_id = f.get("id", "Granule")
                    props = f.get("properties", {})
                    
                    profile = BHOONIDHI_COLLECTIONS_REGISTRY.get(col, {
                        "name": f"ISRO Satellite ({col})",
                        "emoji": "🛰️",
                        "badge_color": "#38bdf8",
                        "category": "Earth Observation Satellite",
                        "resolution": "Standard",
                        "physics_metric": "Radiance & Spectral Reflectance",
                        "role": "General Earth Observation Telemetry"
                    })

                    formatted_assets.append({
                        "id": asset_id,
                        "collection": col,
                        "mission_name": profile["name"],
                        "category": profile["category"],
                        "resolution": profile["resolution"],
                        "physics_metric": profile["physics_metric"],
                        "operational_role": profile["role"],
                        "emoji": profile["emoji"],
                        "badge_color": profile["badge_color"],
                        "geometry": f.get("geometry"),
                        "datetime": props.get("datetime") or datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC"),
                        "sun_elevation": props.get("sun_elevation", 58.4),
                        "cloud_cover_pct": props.get("cloud_cover", 0.0),
                        "online_status": "ONLINE (Direct ISRO STAC Granule)",
                        "download_url": f"https://bhoonidhi-api.nrsc.gov.in/download?id={asset_id}&collection={col}",
                        "source": "ISRO National Remote Sensing Centre (NRSC Hyderabad / Bhoonidhi)"
                    })

                result = {
                    "status": "success",
                    "source": "ISRO National Remote Sensing Centre (Bhoonidhi STAC API)",
                    "authenticated_user": self.user_id,
                    "target_coords": [lat, lng],
                    "total_returned": len(formatted_assets),
                    "supported_collections": list(BHOONIDHI_COLLECTIONS_REGISTRY.keys()),
                    "assets": formatted_assets
                }

                self._cache[cache_key] = {
                    "cached_at": now,
                    "data": result
                }
                return result

        except Exception as e:
            return {
                "status": "error",
                "source": "ISRO NRSC Bhoonidhi API",
                "message": str(e),
                "total_returned": 0,
                "assets": []
            }


bhoonidhi_service = BhoonidhiNRSCService()
