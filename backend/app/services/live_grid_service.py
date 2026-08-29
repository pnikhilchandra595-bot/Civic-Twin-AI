import httpx
import re
import datetime
import certifi
from typing import Dict, Any, Optional
from app.services.demo_state import demo_state

class LivePowerGridService:
    """
    Live Grid Demand & Supply Indicator.
    Source: Ministry of Power's Vidyut Pravah public dashboard (vidyutpravah.in).
    
    Note on Grid Frequency:
    The upstream dashboard frequency field is currently unpopulated (returns 0) by POSOCO/NLDC.
    This service ingests the real live national power demand met, peak shortages, and energy metrics
    which are updated continuously per 15-minute power exchange block.
    """

    VIDYUT_PRAVAH_URL = "https://vidyutpravah.in/PXDashboard/BindTopStatisticsFromJS"

    def __init__(self):
        self._cache: Optional[Dict[str, Any]] = None
        self._last_fetch: Optional[datetime.datetime] = None
        self._cache_ttl_sec = 300  # 5 min TTL matching 15-min block updates

    @staticmethod
    def _extract_number(html_span: str) -> Optional[float]:
        """Extracts numeric value embedded inside a <span>...NUMBER...</span> string."""
        if not html_span:
            return None
        match = re.search(r'>\s*([\d.]+)', str(html_span))
        return float(match.group(1)) if match else None

    async def fetch_grid_telemetry(self) -> Dict[str, Any]:
        now = datetime.datetime.now()
        if demo_state.is_on():
            return {
                "status": "demo_simulated",
                "data_mode": "demo_simulated",
                "source": "Ministry of Power — Vidyut Pravah (National Grid Simulation)",
                "note": "🎬 Demo Mode active — showing calibrated reference data, live query skipped.",
                "demand_met_gw": 234.8,
                "demand_met_yesterday_gw": 231.2,
                "peak_shortage_mw": 850.0,
                "energy_shortage_mu": 12.4,
                "peak_shortage_pct": 0.36,
                "energy_shortage_pct": 0.28,
                "grid_state": "Normal / Stable Supply",
                "color": "#10b981",
                "timestamp": now.isoformat() + "Z"
            }

        if self._cache and self._last_fetch and (now - self._last_fetch).total_seconds() < self._cache_ttl_sec:
            return self._cache

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Referer": "https://vidyutpravah.in/",
            "Origin": "https://vidyutpravah.in"
        }

        try:
            async with httpx.AsyncClient(timeout=10.0, verify=certifi.where()) as client:
                resp = await client.get(self.VIDYUT_PRAVAH_URL, headers=headers)
                if resp.status_code == 200:
                    raw = resp.json()
                    if raw and isinstance(raw, list) and len(raw) > 0:
                        item = raw[0]
                        demand_gw = self._extract_number(item.get("demand", ""))
                        demand_yest_gw = self._extract_number(item.get("demandYest", ""))
                        peak_shortage_mw = self._extract_number(item.get("Peak", ""))
                        energy_shortage_mu = self._extract_number(item.get("Energy", ""))
                        peak_pct = self._extract_number(item.get("PeakPercent", ""))
                        energy_pct = self._extract_number(item.get("EnergyPercent", ""))

                        status = "Normal / Stable Supply"
                        color = "#10b981"
                        if peak_pct and peak_pct > 2.0:
                            status = "Grid Stressed (Elevated Peak Shortage)"
                            color = "#f59e0b"

                        result = {
                            "status": "success",
                            "data_mode": "live",
                            "source": "Ministry of Power — Vidyut Pravah (vidyutpravah.in)",
                            "note": "✅ Live national demand & supply data (updated per 15-min power exchange block).",
                            "demand_met_gw": demand_gw,
                            "demand_met_yesterday_gw": demand_yest_gw,
                            "peak_shortage_mw": peak_shortage_mw,
                            "energy_shortage_mu": energy_shortage_mu,
                            "peak_shortage_pct": peak_pct,
                            "energy_shortage_pct": energy_pct,
                            "grid_state": status,
                            "color": color,
                            "timestamp": now.isoformat() + "Z"
                        }
                        self._cache = result
                        self._last_fetch = now
                        return result
        except Exception as e:
            print(f"Vidyut Pravah live fetch failed: {e}")

        # Honest fallback if live upstream fails
        return {
            "status": "query_failed",
            "data_mode": "offline",
            "source": "Ministry of Power — Vidyut Pravah (vidyutpravah.in)",
            "note": "⚠️ Live grid demand/supply query failed or unavailable.",
            "demand_met_gw": None,
            "peak_shortage_mw": None,
            "timestamp": now.isoformat() + "Z"
        }

live_grid_service = LivePowerGridService()
