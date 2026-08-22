from typing import List, Dict, Tuple, Set
from app.models.schemas import (
    InfrastructureNode, RoadEdge, CascadeLink, NodeStatus, RoadStatus, NodeType
)

class CascadeFailureEngine:
    """
    Evaluates multi-order cascade failure propagation across urban infrastructure:
    Power grid -> Water supply -> Road network -> Emergency facilities -> Populations.
    """

    def __init__(self):
        pass

    def evaluate_cascade_effects(
        self,
        nodes: List[InfrastructureNode],
        roads: List[RoadEdge],
        substation_tripped: bool,
        levee_breached: bool,
        timeline_hour: float
    ) -> Tuple[List[InfrastructureNode], List[CascadeLink], Dict[str, any]]:
        cascade_links: List[CascadeLink] = []
        node_map = {n.id: n for n in nodes}
        road_map = {r.id: r for r in roads}

        substations = [n for n in nodes if n.node_type == NodeType.SUBSTATION]
        hospitals = [n for n in nodes if n.node_type == NodeType.HOSPITAL]
        shelters = [n for n in nodes if n.node_type == NodeType.SHELTER]
        water_plants = [n for n in nodes if n.node_type == NodeType.WATER_TREATMENT]
        bridges = [n for n in nodes if n.node_type == NodeType.BRIDGE]
        residential = [n for n in nodes if n.node_type == NodeType.RESIDENTIAL_DISTRICT]

        isolated_districts: Set[str] = set()
        compromised_hospitals: Set[str] = set()
        compromised_shelters: Set[str] = set()

        # 1. Evaluate Substation Cascade
        for sub in substations:
            # If submerged or explicitly tripped
            is_down = substation_tripped or sub.flood_depth_m >= 0.35 or sub.status in [NodeStatus.CRITICAL, NodeStatus.SUBMERGED]
            if is_down:
                sub.status = NodeStatus.OFFLINE
                
                # Find connected nodes in metadata
                connected_ids = sub.details.get("connected_assets", [])
                for target_id in connected_ids:
                    if target_id in node_map:
                        target = node_map[target_id]
                        target.backup_power_active = True
                        # Consume backup fuel over timeline hours
                        consumed_fuel = timeline_hour * 1.5
                        target.backup_power_hours = max(0.0, round(24.0 - consumed_fuel, 1))

                        if target.backup_power_hours <= 4.0:
                            target.status = NodeStatus.CRITICAL
                            if target.node_type == NodeType.HOSPITAL:
                                compromised_hospitals.add(target.id)

                        cascade_links.append(CascadeLink(
                            id=f"cascade-pwr-{sub.id}-{target.id}",
                            source_id=sub.id,
                            target_id=target.id,
                            trigger_type="grid_power_failure",
                            severity="critical" if target.backup_power_hours <= 6.0 else "warning",
                            time_offset_min=15,
                            description=f"{sub.name} offline -> {target.name} forced onto backup generator ({target.backup_power_hours}h remaining)",
                            cascade_level=2
                        ))

        # 2. Evaluate Road Severance & Bridge Isolation
        impassable_road_ids = {r.id for r in roads if r.status in [RoadStatus.IMPASSABLE, RoadStatus.CLOSED_EMERGENCY]}
        
        # Check bridge submergence / structural load
        for bridge in bridges:
            connected_road_ids = bridge.details.get("connected_roads", [])
            is_blocked = any(rid in impassable_road_ids for rid in connected_road_ids) or bridge.flood_depth_m >= 0.4
            
            if is_blocked:
                bridge.status = NodeStatus.CRITICAL
                # Cascade impact on served residential sectors
                served_sectors = bridge.details.get("served_districts", [])
                for sector_id in served_sectors:
                    if sector_id in node_map:
                        sec = node_map[sector_id]
                        sec.status = NodeStatus.ISOLATED
                        isolated_districts.add(sector_id)

                        cascade_links.append(CascadeLink(
                            id=f"cascade-bridge-{bridge.id}-{sec.id}",
                            source_id=bridge.id,
                            target_id=sec.id,
                            trigger_type="arterial_bridge_cutoff",
                            severity="critical",
                            time_offset_min=30,
                            description=f"{bridge.name} impassable -> District {sec.name} completely cut off from primary EMS & Hospital routes",
                            cascade_level=2
                        ))

        # 3. Evaluate Water Treatment & Sanitation Cascade
        for wp in water_plants:
            if wp.flood_depth_m >= 0.3 or wp.backup_power_active:
                wp.status = NodeStatus.WARNING if wp.flood_depth_m < 0.5 else NodeStatus.OFFLINE
                for res in residential:
                    cascade_links.append(CascadeLink(
                        id=f"cascade-water-{wp.id}-{res.id}",
                        source_id=wp.id,
                        target_id=res.id,
                        trigger_type="potable_water_risk",
                        severity="warning",
                        time_offset_min=45,
                        description=f"{wp.name} pressure compromised -> Boil water advisory triggered for {res.name}",
                        cascade_level=3
                    ))

        # 4. Evaluate Shelter Capacity & Flood Inundation
        for sh in shelters:
            if sh.flood_depth_m >= 0.2:
                sh.status = NodeStatus.CRITICAL
                compromised_shelters.add(sh.id)
                # Relocation cascade
                cascade_links.append(CascadeLink(
                    id=f"cascade-shelter-{sh.id}",
                    source_id=sh.id,
                    target_id=sh.id,
                    trigger_type="shelter_inundation",
                    severity="critical",
                    time_offset_min=10,
                    description=f"{sh.name} flood waters entering ground floor -> Evacuee relocation mandatory",
                    cascade_level=1
                ))
            else:
                # Dynamic shelter occupancy influx as disaster progresses
                influx_rate = int(timeline_hour * 120)
                sh.capacity_used = min(sh.capacity_total, sh.details.get("base_occupancy", 100) + influx_rate)
                if sh.capacity_used >= sh.capacity_total * 0.9:
                    sh.status = NodeStatus.WARNING

        # 5. Evaluate Hospital Access Road Availability
        for hosp in hospitals:
            access_roads = hosp.details.get("access_roads", [])
            blocked_access = [r_id for r_id in access_roads if r_id in impassable_road_ids]
            if len(blocked_access) == len(access_roads) and len(access_roads) > 0:
                hosp.status = NodeStatus.ISOLATED
                compromised_hospitals.add(hosp.id)
                cascade_links.append(CascadeLink(
                    id=f"cascade-hosp-access-{hosp.id}",
                    source_id=blocked_access[0],
                    target_id=hosp.id,
                    trigger_type="emergency_access_severed",
                    severity="critical",
                    time_offset_min=20,
                    description=f"All access corridors to {hosp.name} are impassable -> Trauma redirects activated",
                    cascade_level=3
                ))

        summary_metrics = {
            "total_cascade_links": len(cascade_links),
            "isolated_districts_count": len(isolated_districts),
            "compromised_hospitals_count": len(compromised_hospitals),
            "compromised_shelters_count": len(compromised_shelters),
            "total_impassable_roads": len(impassable_road_ids),
        }

        return nodes, cascade_links, summary_metrics
