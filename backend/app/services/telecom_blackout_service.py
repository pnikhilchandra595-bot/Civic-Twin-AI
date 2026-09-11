from typing import Dict, Any, List, Optional
import datetime

class TelecomBlackoutService:
    """
    Cellular BTS Tower & Telecom Survivability Engine.
    Models:
    1. BTS Tower grid dependency on local 220kV/33kV substations.
    2. Internal VRLA/Lithium battery bank depletion curves (3.5 hour operational envelope).
    3. Prediction of the "Civic Silence Hour" (when mobile communication collapses).
    4. Mobile COW (Cellular-on-Wheels) dispatch staging.
    """

    BTS_TOWERS = [
        {
            "tower_id": "BTS-MUM-401",
            "operator": "Jio / Airtel Co-Location",
            "name": "Kurla Central BTS Mast",
            "lat": 19.0652,
            "lng": 72.8790,
            "connected_substation": "Dharavi Tata Power 220kV Substation",
            "grid_power_status": "TRIPPED_GRID_LOSS",
            "backup_battery_type": "Lithium Iron Phosphate (LiFePO4)",
            "rated_backup_hours": 4.0,
            "battery_hours_remaining": 1.2,
            "battery_pct": 30.0,
            "status": "CRITICAL_LOW_BATTERY",
            "population_served": 42000
        },
        {
            "tower_id": "BTS-MUM-402",
            "operator": "Vodafone Idea / BSNL",
            "name": "Milan Subway Arterial Tower",
            "lat": 19.0910,
            "lng": 72.8460,
            "connected_substation": "Santacruz 33kV Receiving Station",
            "grid_power_status": "TRIPPED_GRID_LOSS",
            "backup_battery_type": "VRLA Lead-Acid",
            "rated_backup_hours": 3.0,
            "battery_hours_remaining": 0.4,
            "battery_pct": 13.0,
            "status": "IMMINENT_BLACKOUT",
            "population_served": 28000
        },
        {
            "tower_id": "BTS-MUM-403",
            "operator": "Airtel 5G Tower",
            "name": "BKC High-Ground Monopole",
            "lat": 19.0680,
            "lng": 72.8695,
            "connected_substation": "Bandra 110kV Substation",
            "grid_power_status": "GRID_ONLINE",
            "backup_battery_type": "LiFePO4 + Rooftop Solar",
            "rated_backup_hours": 6.0,
            "battery_hours_remaining": 6.0,
            "battery_pct": 100.0,
            "status": "OPERATIONAL_STABLE",
            "population_served": 65000
        }
    ]

    def get_telecom_blackout_status(self) -> Dict[str, Any]:
        critical_towers = [t for t in self.BTS_TOWERS if t["battery_hours_remaining"] <= 1.5]
        min_remaining = min(t["battery_hours_remaining"] for t in self.BTS_TOWERS)
        
        silence_time = (datetime.datetime.now() + datetime.timedelta(hours=min_remaining)).strftime("%I:%M %p IST")
        
        cow_deployments = [
            {
                "cow_unit_id": "COW-01",
                "target_zone": "Milan Subway Arterial Flank",
                "lat": 19.089,
                "lng": 72.848,
                "eta_minutes": 25,
                "capability": "4G/5G Tactical Voice & SMS (5km Radius)",
                "status": "DISPATCHED"
            }
        ]

        return {
            "status": "success",
            "total_bts_towers_monitored": len(self.BTS_TOWERS),
            "at_risk_towers_count": len(critical_towers),
            "predicted_civic_silence_hour": silence_time,
            "time_to_first_silence_hours": min_remaining,
            "overall_telecom_threat": "CRITICAL_LOCAL_BLACKOUT" if min_remaining < 1.0 else "ELEVATED_WATCH",
            "towers": self.BTS_TOWERS,
            "cellular_on_wheels_staging": cow_deployments,
            "advisory": "Dispatch mobile diesel generators or COWs immediately to avert 112 emergency call drops."
        }

telecom_blackout_service = TelecomBlackoutService()
