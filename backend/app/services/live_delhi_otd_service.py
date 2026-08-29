import os
import urllib.request
import datetime
from typing import Dict, Any, List, Optional
from google.transit import gtfs_realtime_pb2
from app.services.demo_state import demo_state

class LiveDelhiOTDService:
    """
    Live Satellite GPS Vehicle Tracking Service for Delhi NCR.
    Ingests real-time AIS-140 GNSS feeds from Delhi Open Transit Data (otd.delhi.gov.in).
    """

    def __init__(self):
        self.api_key = os.getenv("DELHI_OTD_API_KEY")
        self._cached_vehicles: List[Dict[str, Any]] = []
        self._last_fetch: Optional[datetime.datetime] = None
        self._cache_ttl_sec = 6  # 6-second live refresh

    async def fetch_live_delhi_vehicles(self, limit: int = 150) -> Dict[str, Any]:
        now = datetime.datetime.now()
        if demo_state.is_on():
            demo_vehicles = [
                {
                    "vehicle_id": "DL-1PD-4081",
                    "route_id": "Route 502 (Mehrauli - Kashmere Gate)",
                    "lat": 28.6139,
                    "lng": 77.2090,
                    "speed_kmh": 28.5,
                    "bearing": 18.0,
                    "status": "IN_TRANSIT",
                    "type": "EVACUATION_TRANSIT_BUS"
                },
                {
                    "vehicle_id": "DL-1PB-7712",
                    "route_id": "Route 419 (Ambedkar Nagar - Delhi Rly Stn)",
                    "lat": 28.6324,
                    "lng": 77.2201,
                    "speed_kmh": 32.0,
                    "bearing": 45.0,
                    "status": "IN_TRANSIT",
                    "type": "EVACUATION_TRANSIT_BUS"
                },
                {
                    "vehicle_id": "DL-1PC-9904",
                    "route_id": "Route 729 (Kapashera Border - Mori Gate)",
                    "lat": 28.5982,
                    "lng": 77.1856,
                    "speed_kmh": 14.2,
                    "bearing": 90.0,
                    "status": "SLOW_WATERLOGGING_CORRIDOR",
                    "type": "EVACUATION_TRANSIT_BUS"
                }
            ]
            return {
                "status": "demo_simulated",
                "data_mode": "demo_simulated",
                "source": "Delhi Open Transit Data (Demo Fleet Simulation)",
                "note": "🎬 Demo Mode active — showing calibrated reference data, live query skipped.",
                "total_tracked": len(demo_vehicles),
                "timestamp": now.isoformat(),
                "vehicles": demo_vehicles
            }

        if not self.api_key:
            return {
                "status": "unauthenticated",
                "data_mode": "unconfigured",
                "source": "Delhi Open Transit Data (otd.delhi.gov.in)",
                "note": "⚠️ DELHI_OTD_API_KEY not configured in .env. Live GNSS transit stream unavailable.",
                "total_tracked": 0,
                "timestamp": now.isoformat(),
                "vehicles": []
            }

        if self._last_fetch and (now - self._last_fetch).total_seconds() < self._cache_ttl_sec and self._cached_vehicles:
            return {
                "status": "success",
                "data_mode": "live",
                "source": "Delhi Open Transit Data (AIS-140 GNSS Live Stream)",
                "total_tracked": len(self._cached_vehicles),
                "timestamp": self._last_fetch.isoformat(),
                "vehicles": self._cached_vehicles[:limit]
            }

        url = f"https://otd.delhi.gov.in/api/realtime/VehiclePositions.pb?key={self.api_key}"
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "CivicTwin-AI-Platform/1.0"})
            with urllib.request.urlopen(req, timeout=8) as resp:
                raw_data = resp.read()

            feed = gtfs_realtime_pb2.FeedMessage()
            feed.ParseFromString(raw_data)

            vehicles = []
            for idx, entity in enumerate(feed.entity):
                if not entity.HasField("vehicle"):
                    continue
                v = entity.vehicle
                if not v.HasField("position"):
                    continue
                pos = v.position
                
                # Filter valid Delhi NCR bounding box (28.2N-29.0N, 76.7E-77.6E)
                if not (28.2 <= pos.latitude <= 29.0 and 76.7 <= pos.longitude <= 77.6):
                    continue

                v_id = v.vehicle.id if v.vehicle.id else f"DL-BUS-{idx+1:03d}"
                speed_kmh = round((pos.speed or 0) * 3.6, 1)
                bearing = round(pos.bearing or 0, 1)

                # Truthful vehicle classification: Delhi OTD GTFS feed consists of public transit buses
                vehicles.append({
                    "id": v_id,
                    "name": f"Delhi Transit Bus {v_id}",
                    "vehicle_type": "CIVIC_TRANSIT_BUS",
                    "role_assignment": "live_transit_feed",
                    "lat": round(pos.latitude, 5),
                    "lng": round(pos.longitude, 5),
                    "speed_kmh": speed_kmh,
                    "bearing": bearing,
                    "status": "moving" if speed_kmh > 2 else "staging",
                    "gnss_source": "AIS-140 GNSS Telemetry",
                    "timestamp": v.timestamp or int(now.timestamp())
                })

            if vehicles:
                self._cached_vehicles = vehicles
                self._last_fetch = now
                return {
                    "status": "success",
                    "data_mode": "live",
                    "source": "Delhi Open Transit Data (AIS-140 GNSS Live Stream)",
                    "total_tracked": len(vehicles),
                    "timestamp": now.isoformat(),
                    "vehicles": vehicles[:limit]
                }
        except Exception as e:
            print(f"Error ingesting Delhi OTD live satellite feed: {e}")

        # Honest failure state if live stream encounters network or API error
        return {
            "status": "query_failed",
            "data_mode": "offline",
            "source": "Delhi Open Transit Data (otd.delhi.gov.in)",
            "note": "⚠️ Live Delhi OTD GNSS feed unavailable.",
            "total_tracked": 0,
            "timestamp": now.isoformat(),
            "vehicles": []
        }

live_delhi_otd_service = LiveDelhiOTDService()
