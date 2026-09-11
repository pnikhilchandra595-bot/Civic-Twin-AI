from typing import Dict, Any, List, Optional
import datetime

class HospitalTriageSupplyService:
    """
    Multi-Hospital Emergency Triage & Critical Stockpile Rebalancing Engine.
    Models:
    1. Life-critical stockpiles: O-ve Blood Units, Liquid Medical Oxygen (kL), Dialysis Consumables, Anti-Venom.
    2. Real-time patient influx vs surge capacity.
    3. 108 Ambulance automated redistribution vectors to prevent casualty choke.
    """

    HOSPITAL_NETWORK = [
        {
            "hospital_id": "HOSP-TRIAGE-01",
            "name": "Lokmanya Tilak Municipal General Hospital (Sion)",
            "lat": 19.037,
            "lng": 72.860,
            "elevation_m": 4.5,
            "flood_depth_m": 0.55,
            "status": "CRITICAL_SURGE",
            "active_icu_occupancy_pct": 96.0,
            "stockpiles": {
                "o_negative_blood_units": 4,
                "liquid_oxygen_kl": 2.1,
                "dialysis_kits": 12,
                "anti_snake_venom_vials": 8
            },
            "stockpile_status": "DEPLETION_WARNING",
            "divert_incoming_ambulances": True,
            "recommended_reroute_target": "HOSP-TRIAGE-03"
        },
        {
            "hospital_id": "HOSP-TRIAGE-02",
            "name": "King Edward Memorial (KEM) Hospital",
            "lat": 19.002,
            "lng": 72.842,
            "elevation_m": 7.2,
            "flood_depth_m": 0.15,
            "status": "HIGH_OCCUPANCY",
            "active_icu_occupancy_pct": 84.0,
            "stockpiles": {
                "o_negative_blood_units": 18,
                "liquid_oxygen_kl": 6.8,
                "dialysis_kits": 45,
                "anti_snake_venom_vials": 24
            },
            "stockpile_status": "ADEQUATE",
            "divert_incoming_ambulances": False
        },
        {
            "hospital_id": "HOSP-TRIAGE-03",
            "name": "Lilavati Hospital & Research Centre (Bandra)",
            "lat": 19.052,
            "lng": 72.829,
            "elevation_m": 12.0,
            "flood_depth_m": 0.0,
            "status": "RESILIENT_HIGH_GROUND",
            "active_icu_occupancy_pct": 62.0,
            "stockpiles": {
                "o_negative_blood_units": 32,
                "liquid_oxygen_kl": 11.5,
                "dialysis_kits": 80,
                "anti_snake_venom_vials": 50
            },
            "stockpile_status": "SURPLUS_STABLE",
            "divert_incoming_ambulances": False
        }
    ]

    def get_triage_dashboard(self) -> Dict[str, Any]:
        compromised = [h for h in self.HOSPITAL_NETWORK if h.get("divert_incoming_ambulances")]
        
        redistribution_vectors = [
            {
                "from_hospital": "Sion Municipal General Hospital",
                "to_hospital": "Lilavati Hospital (Bandra High Ground)",
                "distance_km": 5.2,
                "travel_time_dry_min": 14,
                "estimated_delay_min": 6,
                "recommended_divert_count": 25,
                "priority_cases": "Trauma ICU & Ventilator Critical",
                "route_status": "WESTERN_EXPRESS_FLYOVER_CLEAR"
            }
        ]

        return {
            "status": "success",
            "total_hospitals_monitored": len(self.HOSPITAL_NETWORK),
            "critical_surge_facilities": len(compromised),
            "hospitals": self.HOSPITAL_NETWORK,
            "active_ambulance_redistributions": redistribution_vectors,
            "state_stockpile_reserves": {
                "total_o_negative_units": sum(h["stockpiles"]["o_negative_blood_units"] for h in self.HOSPITAL_NETWORK),
                "total_oxygen_kl": round(sum(h["stockpiles"]["liquid_oxygen_kl"] for h in self.HOSPITAL_NETWORK), 1),
                "emergency_airdrop_required": len(compromised) > 0
            }
        }

hospital_triage_supply_service = HospitalTriageSupplyService()
