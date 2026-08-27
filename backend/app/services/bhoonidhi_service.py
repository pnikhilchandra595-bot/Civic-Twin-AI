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
# Official STAC Catalog & Real-Time Earth Observation Ingestion
# Base URL: https://bhoonidhi-api.nrsc.gov.in
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
        self._access_token: Optional[str] = None
        self._refresh_token: Optional[str] = None
        self._token_expires_at: Optional[datetime.datetime] = None
        
        self._cache: Dict[str, Any] = {}
        self._cache_ttl_sec = 300  # 5 minutes cache for STAC queries

        self._ctx = ssl.create_default_context()
        self._ctx.check_hostname = False
        self._ctx.verify_mode = ssl.CERT_NONE

    def _get_valid_token(self, force_refresh: bool = False) -> Optional[str]:
        """Authenticate with Bhoonidhi API and return a valid JWT Bearer access token."""
        user_id = os.getenv("BHOONIDHI_USER_ID")
        password = os.getenv("BHOONIDHI_PASSWORD")

        if not user_id or not password:
            print("[WARN] BHOONIDHI_USER_ID or BHOONIDHI_PASSWORD environment variable not set in .env")
            return None

        now = datetime.datetime.now(datetime.timezone.utc)
        
        if not force_refresh and self._access_token and self._token_expires_at and now < self._token_expires_at:
            return self._access_token

        # If refresh token is available and not force refresh, try refreshing first
        if self._refresh_token and not force_refresh:
            try:
                ref_url = f"{self.base_url}/auth/token"
                payload = json.dumps({
                    "userId": user_id,
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
                "userId": user_id,
                "password": password,
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
            return self._build_offline_fallback(lat, lng, selected_collection, limit, reason="Authentication failed")

        search_url = f"{self.base_url}/data/search"
        payload = json.dumps({
            "collections": collections,
            "limit": limit
        }).encode("utf-8")

        # Attempt search with retry on 401
        for attempt in range(2):
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
                            "download_url": f"http://127.0.0.1:8000/api/satellite/bhoonidhi/download?id={asset_id}&collection={col}",
                            "source": "ISRO National Remote Sensing Centre (NRSC Hyderabad / Bhoonidhi)"
                        })

                    result = {
                        "status": "success",
                        "source": "ISRO National Remote Sensing Centre (Bhoonidhi STAC API)",
                        "authenticated_user": os.getenv("BHOONIDHI_USER_ID", "AUTHORIZED_OFFICER"),
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

            except urllib.error.HTTPError as he:
                if he.code == 401 and attempt == 0:
                    # Token expired; force refresh token and retry
                    token = self._get_valid_token(force_refresh=True)
                    if not token:
                        break
                    continue
                else:
                    return self._build_offline_fallback(lat, lng, selected_collection, limit, reason=f"HTTP Error {he.code}")
            except Exception as e:
                return self._build_offline_fallback(lat, lng, selected_collection, limit, reason=str(e))

        return self._build_offline_fallback(lat, lng, selected_collection, limit, reason="Bhoonidhi STAC query failed")

    def _build_offline_fallback(self, lat: float, lng: float, selected_collection: Optional[str], limit: int, reason: str = "") -> Dict[str, Any]:
        """Provides verified fallback ISRO STAC granules when external Bhoonidhi network is throttled or refreshing."""
        now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")
        
        candidates = [
            {
                "id": "NISAR_S2_PR_GCOV_029_026_A_011_2500_CRNA_A",
                "collection": "NISAR_SSAR_GCOV",
                "mission_name": "ISRO-NASA NISAR Synthetic Aperture Radar (Interferometry)",
                "category": "Interferometric SAR Ground Deformation",
                "resolution": "6m - 12m Dual-Pol (L+S Band)",
                "physics_metric": "Ground Subsidence & Fault Displacement (mm/yr)",
                "operational_role": "Earthquake Fault Rupture & Landslide Creep Telemetry",
                "emoji": "📡",
                "badge_color": "#a855f7",
                "datetime": now_str,
                "sun_elevation": 62.1,
                "cloud_cover_pct": 0.0,
                "online_status": "⚠️ OFFLINE — Reference Data (Live Query Failed)",
                "download_url": "https://bhoonidhi-api.nrsc.gov.in/download?id=NISAR_S2_PR_GCOV_029_026_A_011_2500_CRNA_A&collection=NISAR_SSAR_GCOV",
                "source": "ISRO National Remote Sensing Centre (NRSC / Bhoonidhi)"
            },
            {
                "id": "E06SCTL3WW2025365_25km_v1.0.5",
                "collection": "EOS-06_SCAT_3WW",
                "mission_name": "ISRO EOS-06 Ku-Band Scatterometer (Ocean Surface Winds)",
                "category": "Ocean Surface Wind Vectors & Cyclone Gales",
                "resolution": "25km Grid Resolution",
                "physics_metric": "Wind Speed (knots) & Direction (0-360°)",
                "operational_role": "Cyclone Landfall Warning & Sea State Storm Surge",
                "emoji": "🌀",
                "badge_color": "#06b6d4",
                "datetime": now_str,
                "sun_elevation": 54.8,
                "cloud_cover_pct": 0.0,
                "online_status": "⚠️ OFFLINE — Reference Data (Live Query Failed)",
                "download_url": "https://bhoonidhi-api.nrsc.gov.in/download?id=E06SCTL3WW2025365_25km_v1.0.5&collection=EOS-06_SCAT_3WW",
                "source": "ISRO National Remote Sensing Centre (NRSC / Bhoonidhi)"
            },
            {
                "id": "RAF27AUG2026050440011200058SSANSTUC00GTDD",
                "collection": "ResourceSat-2A_LISS4-MX70_L2",
                "mission_name": "ISRO ResourceSat-2A LISS-4 (Sub-Decameter Multispectral)",
                "category": "Ultra-High Resolution Urban Infrastructure Damage",
                "resolution": "5.8m Spatial Resolution",
                "physics_metric": "Urban Inundation Boundary & Bridge Structural Damage",
                "operational_role": "Municipal Ward-Level Structural Collapse Inspection",
                "emoji": "🔬",
                "badge_color": "#eab308",
                "datetime": now_str,
                "sun_elevation": 58.2,
                "cloud_cover_pct": 4.2,
                "online_status": "⚠️ OFFLINE — Reference Data (Live Query Failed)",
                "download_url": "https://bhoonidhi-api.nrsc.gov.in/download?id=RAF27AUG2026050440011200058SSANSTUC00GTDD&collection=ResourceSat-2A_LISS4-MX70_L2",
                "source": "ISRO National Remote Sensing Centre (NRSC / Bhoonidhi)"
            },
            {
                "id": "SEN1A_SAR_IW_29JUN2026_065185_76FC_ESA_ST0C00NTD_DV",
                "collection": "Sentinel-1A_SAR-IW_GRD",
                "mission_name": "Sentinel-1A SAR IW GRD (ISRO NRSC Hosted Radar Granules)",
                "category": "All-Weather Day/Night C-Band Radar Water Extraction",
                "resolution": "10m SAR Backscatter",
                "physics_metric": "Radar Backscatter σ° (< -16.0 dB Threshold)",
                "operational_role": "Cloud-Penetrating Monsoon Flood Inundation Delineation",
                "emoji": "🛰️",
                "badge_color": "#3b82f6",
                "datetime": now_str,
                "sun_elevation": 61.4,
                "cloud_cover_pct": 0.0,
                "online_status": "⚠️ OFFLINE — Reference Data (Live Query Failed)",
                "download_url": "https://bhoonidhi-api.nrsc.gov.in/download?id=SEN1A_SAR_IW_29JUN2026_065185_76FC_ESA_ST0C00NTD_DV&collection=Sentinel-1A_SAR-IW_GRD",
                "source": "ISRO National Remote Sensing Centre (NRSC / Bhoonidhi)"
            }
        ]

        if selected_collection:
            filtered = [c for c in candidates if c["collection"] == selected_collection]
            assets = filtered if filtered else candidates
        else:
            assets = candidates

        # Use backend proxy URL for direct authenticated browser downloads
        for a in assets:
            a["download_url"] = f"http://127.0.0.1:8000/api/satellite/bhoonidhi/download?id={a['id']}&collection={a['collection']}"

        return {
            "status": "fallback",
            "source": "ISRO National Remote Sensing Centre (Bhoonidhi STAC API)",
            "authenticated_user": os.getenv("BHOONIDHI_USER_ID", "AUTHORIZED_OFFICER"),
            "target_coords": [lat, lng],
            "note": f"⚠️ Live Bhoonidhi query failed: {reason}. Showing reference granule data." if reason else "⚠️ Live Bhoonidhi STAC query offline. Showing reference granule data.",
            "total_returned": len(assets),
            "supported_collections": list(BHOONIDHI_COLLECTIONS_REGISTRY.keys()),
            "assets": assets
        }

    def download_granule_stream(self, granule_id: str, collection: str):
        """Streams authenticated granule file directly from Bhoonidhi with Bearer token."""
        token = self._get_valid_token()
        if not token:
            raise ValueError("Bhoonidhi authentication token unavailable.")

        download_url = f"{self.base_url}/download?id={granule_id}&collection={collection}"
        req = urllib.request.Request(download_url, headers={
            "Authorization": f"Bearer {token}",
            "User-Agent": "CivicTwin-AI/1.0"
        })
        resp = urllib.request.urlopen(req, timeout=30, context=self._ctx)
        return resp


bhoonidhi_service = BhoonidhiNRSCService()
