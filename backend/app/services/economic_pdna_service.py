from typing import Dict, Any, List, Optional
import datetime

class EconomicPDNAService:
    """
    Economic Loss & Post-Disaster Needs Assessment (PDNA) Engine.
    Implements World Bank, United Nations Development Programme (UNDP),
    and NDMA Disaster Management Act Section 46 Post-Disaster Damage Assessment Standards.
    Calculates instantaneous monetary damages (₹ Crores) across 4 infrastructure pillars:
    1. Residential & Commercial Built Assets (submerged plinth area x circle rate)
    2. Electrical SCADA & Substation Assets (transformer repair and busbar de-watering)
    3. Municipal Transportation (damaged bitumen road lane-km mill & pave)
    4. Emergency Relief & First-Responder Operational Expenses
    """

    def __init__(self):
        pass

    def calculate_instantaneous_pdna(
        self,
        city_name: str,
        flooded_nodes_count: int = 14,
        submerged_substations_count: int = 1,
        damaged_road_km: float = 18.5,
        evacuees_count: int = 14500
    ) -> Dict[str, Any]:
        now_str = datetime.datetime.now().strftime("%d %B %Y, %H:%M IST")

        # 1. Built Asset Damages (Residential & Commercial)
        avg_plinth_submerged_sqm = flooded_nodes_count * 12500  # ~12,500 sqm affected per inundated urban sector
        avg_damage_cost_per_sqm_inr = 4500.0  # Repair, electrical drying, wall restoration
        housing_damage_inr_cr = round((avg_plinth_submerged_sqm * avg_damage_cost_per_sqm_inr) / 1e7, 2)

        # 2. Power Grid & Substation Damages
        cost_per_substation_inr_cr = 38.5  # 220kV power transformer replacement + switchgear overhaul
        substation_damage_inr_cr = round(submerged_substations_count * cost_per_substation_inr_cr, 2)

        # 3. Roads & Transport Infrastructure
        cost_per_lane_km_inr_cr = 1.25  # PWD standard for bitumen milling, WMM re-laying, and dense asphalt concrete
        road_damage_inr_cr = round(damaged_road_km * cost_per_lane_km_inr_cr, 2)

        # 4. Emergency Response & Relief Operational Costs
        # Ex-gratia, relief camp feeding (₹350/person/day for 14 days), fuel, NDRF boat mobilization
        relief_operations_inr_cr = round((evacuees_count * 350.0 * 14.0 + 8500000.0) / 1e7, 2)

        # Total Instantaneous Economic Loss
        total_economic_loss_inr_cr = round(
            housing_damage_inr_cr + substation_damage_inr_cr + road_damage_inr_cr + relief_operations_inr_cr, 2
        )

        statutory_breakdown = [
            {
                "sector": "Housing & Built Assets",
                "loss_inr_crores": housing_damage_inr_cr,
                "share_pct": round((housing_damage_inr_cr / total_economic_loss_inr_cr) * 100, 1),
                "damage_description": f"{avg_plinth_submerged_sqm:,.0f} m² of residential/commercial plinth flooded"
            },
            {
                "sector": "Energy & Power Grid",
                "loss_inr_crores": substation_damage_inr_cr,
                "share_pct": round((substation_damage_inr_cr / total_economic_loss_inr_cr) * 100, 1),
                "damage_description": f"{submerged_substations_count} major high-voltage substation inundated"
            },
            {
                "sector": "Municipal Roads & Transit",
                "loss_inr_crores": road_damage_inr_cr,
                "share_pct": round((road_damage_inr_cr / total_economic_loss_inr_cr) * 100, 1),
                "damage_description": f"{damaged_road_km:.1f} km of bitumen arterial road eroded/potholed"
            },
            {
                "sector": "Emergency Relief & First Responders",
                "loss_inr_crores": relief_operations_inr_cr,
                "share_pct": round((relief_operations_inr_cr / total_economic_loss_inr_cr) * 100, 1),
                "damage_description": f"Relief camp logistics & sustenance for {evacuees_count:,} evacuees"
            }
        ]

        return {
            "status": "success",
            "city_name": city_name,
            "assessment_timestamp": now_str,
            "total_estimated_economic_loss_inr_crores": total_economic_loss_inr_cr,
            "total_estimated_economic_loss_usd_millions": round(total_economic_loss_inr_cr / 8.35, 2),
            "methodology": "World Bank PDNA & Ministry of Home Affairs SDRF/NDRF Norms (DM Act 2005)",
            "sectoral_breakdown": statutory_breakdown,
            "recommended_central_ndrf_assistance_crores": round(total_economic_loss_inr_cr * 0.75, 2),
            "state_sdrf_contribution_crores": round(total_economic_loss_inr_cr * 0.25, 2)
        }

economic_pdna_service = EconomicPDNAService()
