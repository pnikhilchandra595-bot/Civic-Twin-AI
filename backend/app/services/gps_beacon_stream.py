import datetime
from typing import Dict, Any, List, Optional
from app.db.database import civictwin_db

class GPSHardwareBeaconEngine:
    """
    Ingests live MQTT, Traccar, OBD-II, and LoRaWAN GPS beacons from physical
    NDRF rescue boats, 108 ALS ambulances, and mobile dewatering pump trucks.
    """

    def __init__(self):
        self.active_beacons: Dict[str, Dict[str, Any]] = {}

    def ingest_beacon_telemetry(
        self,
        device_id: str,
        protocol: str, # "traccar_mqtt" | "lorawan_4g" | "obd2_cellular"
        lat: float,
        lng: float,
        speed_kmh: float = 0.0,
        battery_pct: float = 100.0,
        status: str = "operational"
    ) -> Dict[str, Any]:
        """
        Receives real hardware GPS packet and updates database and live dispatch state.
        """
        telemetry = {
            "device_id": device_id,
            "protocol": protocol,
            "lat": lat,
            "lng": lng,
            "speed_kmh": speed_kmh,
            "battery_pct": battery_pct,
            "status": status,
            "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
        }

        self.active_beacons[device_id] = telemetry

        # Update database resource location
        civictwin_db.update_resource_gps(device_id, lat, lng, status)

        return {
            "status": "acknowledged",
            "device_id": device_id,
            "telemetry": telemetry
        }

    def get_all_beacons(self) -> List[Dict[str, Any]]:
        return list(self.active_beacons.values())

gps_beacon_engine = GPSHardwareBeaconEngine()
