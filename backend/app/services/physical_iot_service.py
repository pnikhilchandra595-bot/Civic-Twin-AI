from typing import Dict, Any, List, Optional
import datetime

class PhysicalIoTService:
    """
    Physical IoT Hardware Ingestion Service.
    Enables live hardware connectivity for municipal sensors, ward-level IoT pilots,
    and stage demonstrations with microcontrollers (ESP32, Arduino, Raspberry Pi + HC-SR04 ultrasonic gauges).
    """

    def __init__(self):
        self.device_registry: Dict[str, Dict[str, Any]] = {
            "ESP32-MUM-01": {
                "device_id": "ESP32-MUM-01",
                "device_name": "Milan Subway Ultrasonic Depth Node",
                "hardware": "ESP32-WROOM-32 + HC-SR04 (Ultrasonic)",
                "lat": 19.0912,
                "lng": 72.8465,
                "sensor_height_cm": 250.0,
                "last_distance_cm": 115.0,
                "water_depth_cm": 135.0,
                "water_depth_m": 1.35,
                "battery_pct": 94.0,
                "rssi_dbm": -68,
                "connection_type": "4G_LTE_CAT_M1",
                "status": "LIVE_HARDWARE_TELEMETRY",
                "last_seen": datetime.datetime.now().isoformat() + "Z",
                "packets_received": 142
            },
            "ESP32-DEL-02": {
                "device_id": "ESP32-DEL-02",
                "device_name": "Yamuna Bridge Low-Point Sensor",
                "hardware": "ESP32 + JSN-SR04T Waterproof Ultrasonic",
                "lat": 28.6622,
                "lng": 77.2485,
                "sensor_height_cm": 300.0,
                "last_distance_cm": 160.0,
                "water_depth_cm": 140.0,
                "water_depth_m": 1.40,
                "battery_pct": 88.0,
                "rssi_dbm": -72,
                "connection_type": "LoRaWAN_865MHz",
                "status": "LIVE_HARDWARE_TELEMETRY",
                "last_seen": datetime.datetime.now().isoformat() + "Z",
                "packets_received": 89
            }
        }
        self.readings_log: List[Dict[str, Any]] = []

    def ingest_reading(
        self,
        device_id: str,
        distance_cm: Optional[float] = None,
        water_depth_cm: Optional[float] = None,
        sensor_height_cm: Optional[float] = None,
        battery_pct: Optional[float] = None,
        rssi_dbm: Optional[int] = None,
        hardware: Optional[str] = None
    ) -> Dict[str, Any]:
        now_iso = datetime.datetime.now().isoformat() + "Z"

        if device_id not in self.device_registry:
            self.device_registry[device_id] = {
                "device_id": device_id,
                "device_name": f"Field IoT Node {device_id}",
                "hardware": hardware or "ESP32 / Microcontroller IoT",
                "lat": 19.0760,
                "lng": 72.8777,
                "sensor_height_cm": sensor_height_cm or 250.0,
                "last_distance_cm": 0.0,
                "water_depth_cm": 0.0,
                "water_depth_m": 0.0,
                "battery_pct": 100.0,
                "rssi_dbm": -65,
                "connection_type": "Wi-Fi / Cellular",
                "status": "LIVE_HARDWARE_TELEMETRY",
                "last_seen": now_iso,
                "packets_received": 0
            }

        dev = self.device_registry[device_id]
        if sensor_height_cm:
            dev["sensor_height_cm"] = sensor_height_cm

        h_sensor = dev["sensor_height_cm"]

        # Calculate depth if distance provided
        if distance_cm is not None:
            calc_depth_cm = max(0.0, h_sensor - distance_cm)
            dev["last_distance_cm"] = round(distance_cm, 1)
            dev["water_depth_cm"] = round(calc_depth_cm, 1)
            dev["water_depth_m"] = round(calc_depth_cm / 100.0, 3)
        elif water_depth_cm is not None:
            dev["water_depth_cm"] = round(water_depth_cm, 1)
            dev["water_depth_m"] = round(water_depth_cm / 100.0, 3)
            dev["last_distance_cm"] = max(0.0, h_sensor - water_depth_cm)

        if battery_pct is not None:
            dev["battery_pct"] = battery_pct
        if rssi_dbm is not None:
            dev["rssi_dbm"] = rssi_dbm
        if hardware:
            dev["hardware"] = hardware

        dev["last_seen"] = now_iso
        dev["packets_received"] += 1
        dev["status"] = "LIVE_HARDWARE_TELEMETRY"

        reading_entry = {
            "device_id": device_id,
            "timestamp": now_iso,
            "water_depth_cm": dev["water_depth_cm"],
            "water_depth_m": dev["water_depth_m"],
            "battery_pct": dev["battery_pct"],
            "rssi_dbm": dev["rssi_dbm"]
        }
        self.readings_log.append(reading_entry)
        if len(self.readings_log) > 500:
            self.readings_log.pop(0)

        return {
            "status": "success",
            "message": f"Hardware packet accepted from {device_id}",
            "device": dev
        }

    def get_devices(self) -> Dict[str, Any]:
        return {
            "status": "success",
            "total_registered_hardware_nodes": len(self.device_registry),
            "webhook_endpoint": "/api/sensors/ingest",
            "supported_protocols": ["HTTP REST POST (JSON)", "ThingsSpeak Bridge", "MQTT Gateway"],
            "devices": list(self.device_registry.values()),
            "recent_readings": self.readings_log[-15:]
        }

physical_iot_service = PhysicalIoTService()
