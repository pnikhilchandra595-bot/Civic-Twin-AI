from typing import List, Dict, Any, Optional
import datetime
import math

class CountermeasureService:
    """
    Tactical Countermeasure Sandbox Engine (ICS-NDMA).
    Simulates operational intervention deployments:
    1. Mobile High-Capacity Dewatering Pumps (500 m3/hr capacity per unit)
    2. Deployable Inflatable / Sandbag Berm Levees (height 0.8m - 1.5m)
    3. Mobile Emergency Diesel Generator Trucks (250 kVA / 500 kVA auxiliary power)
    """

    def __init__(self):
        self.active_deployments: List[Dict[str, Any]] = [
            {
                "id": "PUMP-01",
                "type": "dewatering_pump",
                "name": "Heavy Diesel Dewatering Unit #1 (500 m³/h)",
                "location_name": "Milan Subway Underpass",
                "lat": 19.091,
                "lng": 72.846,
                "capacity_m3_hr": 500.0,
                "effective_depth_reduction_m": 0.42,
                "status": "active",
                "fuel_hours_remaining": 18.5,
                "deployed_at": datetime.datetime.now().isoformat() + "Z"
            },
            {
                "id": "BERM-01",
                "type": "sandbag_barrier",
                "name": "Polymer Sandbag Levee (1.2m Height)",
                "location_name": "Mithi River / Kranti Nagar Flank",
                "lat": 19.068,
                "lng": 72.879,
                "barrier_length_m": 350.0,
                "protection_height_m": 1.2,
                "status": "active",
                "integrity_pct": 98.0,
                "deployed_at": datetime.datetime.now().isoformat() + "Z"
            }
        ]

    def get_active_countermeasures(self) -> Dict[str, Any]:
        pumps = [c for c in self.active_deployments if c["type"] == "dewatering_pump"]
        berms = [c for c in self.active_deployments if c["type"] == "sandbag_barrier"]
        gensets = [c for c in self.active_deployments if c["type"] == "mobile_generator"]

        total_pump_capacity = sum(p.get("capacity_m3_hr", 0) for p in pumps)
        total_berm_length = sum(b.get("barrier_length_m", 0) for b in berms)
        total_aux_power_kva = sum(g.get("power_kva", 0) for g in gensets)

        return {
            "status": "success",
            "active_count": len(self.active_deployments),
            "summary": {
                "total_pumps_active": len(pumps),
                "total_pump_discharge_m3_hr": total_pump_capacity,
                "total_berms_deployed": len(berms),
                "total_berm_protection_length_m": total_berm_length,
                "total_aux_power_kva": total_aux_power_kva
            },
            "deployments": self.active_deployments
        }

    def deploy_countermeasure(
        self,
        countermeasure_type: str,
        name: str,
        location_name: str,
        lat: float,
        lng: float,
        specs: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        specs = specs or {}
        new_id = f"CM-{len(self.active_deployments) + 1:02d}"

        if countermeasure_type == "dewatering_pump":
            capacity = float(specs.get("capacity_m3_hr", 500.0))
            reduction = min(0.65, round(capacity * 0.00085, 3))
            deployment = {
                "id": new_id,
                "type": "dewatering_pump",
                "name": name or f"Heavy Dewatering Pump ({capacity:.0f} m³/h)",
                "location_name": location_name,
                "lat": round(lat, 4),
                "lng": round(lng, 4),
                "capacity_m3_hr": capacity,
                "effective_depth_reduction_m": reduction,
                "status": "active",
                "fuel_hours_remaining": 24.0,
                "deployed_at": datetime.datetime.now().isoformat() + "Z"
            }
        elif countermeasure_type == "sandbag_barrier":
            length = float(specs.get("barrier_length_m", 200.0))
            height = float(specs.get("protection_height_m", 1.2))
            deployment = {
                "id": new_id,
                "type": "sandbag_barrier",
                "name": name or f"Quick-Deploy Berm Barrier ({length:.0f}m)",
                "location_name": location_name,
                "lat": round(lat, 4),
                "lng": round(lng, 4),
                "barrier_length_m": length,
                "protection_height_m": height,
                "status": "active",
                "integrity_pct": 100.0,
                "deployed_at": datetime.datetime.now().isoformat() + "Z"
            }
        elif countermeasure_type == "mobile_generator":
            power_kva = float(specs.get("power_kva", 250.0))
            deployment = {
                "id": new_id,
                "type": "mobile_generator",
                "name": name or f"Mobile Diesel Genset Truck ({power_kva:.0f} kVA)",
                "location_name": location_name,
                "lat": round(lat, 4),
                "lng": round(lng, 4),
                "power_kva": power_kva,
                "target_facility": specs.get("target_facility", "Emergency Hospital / Trauma ICU"),
                "fuel_liters": 800.0,
                "runtime_hours": 36.0,
                "status": "active",
                "deployed_at": datetime.datetime.now().isoformat() + "Z"
            }
        else:
            return {"status": "error", "message": f"Unsupported countermeasure type: {countermeasure_type}"}

        self.active_deployments.append(deployment)
        return {
            "status": "success",
            "message": f"Countermeasure {new_id} deployed successfully.",
            "deployment": deployment
        }

    def remove_countermeasure(self, deployment_id: str) -> Dict[str, Any]:
        initial_len = len(self.active_deployments)
        self.active_deployments = [c for c in self.active_deployments if c["id"] != deployment_id]
        if len(self.active_deployments) < initial_len:
            return {"status": "success", "message": f"Removed countermeasure {deployment_id}"}
        return {"status": "error", "message": f"Countermeasure {deployment_id} not found"}

countermeasure_service = CountermeasureService()
