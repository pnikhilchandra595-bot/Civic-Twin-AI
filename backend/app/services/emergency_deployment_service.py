import math
import datetime
from typing import Dict, Any, List

class EmergencyDeploymentService:
    """
    Simulated NDRF/108 Ambulance & Rescue Unit Deployment Engine.
    Generates a believable animated dispatch sequence from a real hospital
    location to a disaster zone, for stage demo purposes. Explicitly labeled
    as simulated — does not represent an actual dispatched emergency unit.
    """

    UNIT_TYPES = [
        {"id": "AMB", "label": "108 Emergency Ambulance", "icon": "🚑", "speed_kmh": 45, "agency": "108 National Emergency Medical Service"},
        {"id": "NDRF", "label": "NDRF Rapid Flood Rescue Unit", "icon": "🚒", "speed_kmh": 35, "agency": "National Disaster Response Force (NDRF)"},
        {"id": "FIRE", "label": "Fire & Life Rescue Tender", "icon": "🚒", "speed_kmh": 40, "agency": "State Fire & Emergency Services"},
        {"id": "BOAT", "label": "SDRF Inflatable Motor Rescue Boat", "icon": "🚤", "speed_kmh": 25, "agency": "State Disaster Response Force (SDRF)"},
    ]

    def generate_deployment(
        self,
        origin_lat: float, origin_lng: float, origin_name: str,
        dest_lat: float, dest_lng: float, dest_name: str,
        unit_type: str = "AMB",
        steps: int = 50
    ) -> Dict[str, Any]:
        unit = next((u for u in self.UNIT_TYPES if u["id"] == unit_type), self.UNIT_TYPES[0])

        route: List[Dict[str, Any]] = []
        for i in range(steps + 1):
            t = i / steps
            # Quadratic sinusoidal curve offset to simulate following urban roadway corridors
            curve_offset = math.sin(t * math.pi) * 0.005
            lat = origin_lat + (dest_lat - origin_lat) * t + curve_offset
            lng = origin_lng + (dest_lng - origin_lng) * t - (curve_offset * 0.5)
            
            # Interpolate bearing heading
            bearing = math.degrees(math.atan2(dest_lng - origin_lng, dest_lat - origin_lat)) % 360
            
            route.append({
                "lat": round(lat, 5),
                "lng": round(lng, 5),
                "step": i,
                "bearing": round(bearing, 1)
            })

        distance_km = round(
            math.sqrt((dest_lat - origin_lat) ** 2 + (dest_lng - origin_lng) ** 2) * 111.0, 2
        )
        eta_min = round(max(1.0, (distance_km / unit["speed_kmh"]) * 60.0), 1)

        return {
            "status": "success",
            "data_mode": "demo_simulated",
            "is_simulated": True,
            "provenance": "SIMULATED_TACTICAL_DEPLOYMENT",
            "note": "🎬 SIMULATED DEPLOYMENT — for demonstration purposes only. Not a real dispatch.",
            "deployment_id": f"SIM-{unit['id']}-{int(datetime.datetime.now().timestamp())}",
            "unit_type": unit["id"],
            "unit_label": unit["label"],
            "icon": unit["icon"],
            "agency": unit["agency"],
            "speed_kmh": unit["speed_kmh"],
            "origin": {"lat": origin_lat, "lng": origin_lng, "name": origin_name},
            "destination": {"lat": dest_lat, "lng": dest_lng, "name": dest_name},
            "distance_km": distance_km,
            "eta_minutes": eta_min,
            "route": route,
            "triggered_at": datetime.datetime.now().isoformat()
        }

emergency_deployment_service = EmergencyDeploymentService()
