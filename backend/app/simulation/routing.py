import networkx as nx
from typing import List, Dict, Optional, Tuple
from app.models.schemas import (
    InfrastructureNode, RoadEdge, EvacuationRoute, RoadStatus, NodeStatus, NodeType
)

class DynamicEvacuationRouter:
    """
    Computes optimal and resilient evacuation corridors using NetworkX.
    Dynamically reroutes around submerged and impassable roads.
    """

    def __init__(self):
        pass

    def build_network_graph(self, nodes: List[InfrastructureNode], roads: List[RoadEdge]) -> nx.DiGraph:
        G = nx.DiGraph()
        
        # Add nodes
        for n in nodes:
            G.add_node(n.id, lat=n.lat, lng=n.lng, name=n.name, type=n.node_type, status=n.status)

        # Add road edges (bidirectional where appropriate)
        for r in roads:
            # Calculate weight
            if r.status in [RoadStatus.IMPASSABLE, RoadStatus.CLOSED_EMERGENCY]:
                weight = float('inf')
            else:
                base_time = (r.length_km / max(5.0, r.current_speed_kmh)) * 60.0  # minutes
                if r.status == RoadStatus.FLOODED_WARNING:
                    weight = base_time * 3.0 + 10.0
                elif r.status == RoadStatus.CONGESTED:
                    weight = base_time * 1.8
                elif r.is_evacuation_corridor:
                    weight = base_time * 0.8
                else:
                    weight = base_time

            if weight < float('inf'):
                G.add_edge(
                    r.from_node,
                    r.to_node,
                    weight=weight,
                    road_id=r.id,
                    name=r.name,
                    length_km=r.length_km,
                    coordinates=r.coordinates,
                    status=r.status
                )
                # Bi-directional support
                rev_coords = list(reversed(r.coordinates))
                G.add_edge(
                    r.to_node,
                    r.from_node,
                    weight=weight,
                    road_id=r.id,
                    name=r.name,
                    length_km=r.length_km,
                    coordinates=rev_coords,
                    status=r.status
                )

        return G

    def calculate_evacuation_routes(
        self,
        nodes: List[InfrastructureNode],
        roads: List[RoadEdge]
    ) -> List[EvacuationRoute]:
        G = self.build_network_graph(nodes, roads)
        node_map = {n.id: n for n in nodes}

        residential_nodes = [n for n in nodes if n.node_type in [NodeType.RESIDENTIAL_DISTRICT, NodeType.SCHOOL]]
        operational_shelters = [n for n in nodes if n.node_type == NodeType.SHELTER and n.status != NodeStatus.SUBMERGED]

        if not operational_shelters:
            # Fallback to any shelter
            operational_shelters = [n for n in nodes if n.node_type == NodeType.SHELTER]

        evacuation_routes: List[EvacuationRoute] = []

        for res_node in residential_nodes:
            best_route: Optional[EvacuationRoute] = None
            shortest_cost = float('inf')

            for shelter in operational_shelters:
                if res_node.id == shelter.id:
                    continue

                if nx.has_path(G, res_node.id, shelter.id):
                    try:
                        path_nodes = nx.shortest_path(G, source=res_node.id, target=shelter.id, weight='weight')
                        total_time = nx.shortest_path_length(G, source=res_node.id, target=shelter.id, weight='weight')

                        # Assemble coordinates
                        route_coords: List[List[float]] = [[res_node.lng, res_node.lat]]
                        total_dist = 0.0
                        choke_points: List[str] = []
                        hazard_penalties = 0

                        for i in range(len(path_nodes) - 1):
                            u, v = path_nodes[i], path_nodes[i+1]
                            edge_data = G.get_edge_data(u, v)
                            if edge_data:
                                total_dist += edge_data.get('length_km', 1.0)
                                edge_coords = edge_data.get('coordinates', [])
                                if edge_coords:
                                    for c in edge_coords:
                                        if not route_coords or route_coords[-1] != c:
                                            route_coords.append(c)
                                if edge_data.get('status') == RoadStatus.FLOODED_WARNING:
                                    choke_points.append(f"Water pooling on {edge_data.get('name')}")
                                    hazard_penalties += 1

                        route_coords.append([shelter.lng, shelter.lat])

                        safety_score = max(0.2, round(1.0 - (hazard_penalties * 0.25), 2))
                        route_status = "optimal" if safety_score >= 0.8 else "alternative"

                        if total_time < shortest_cost:
                            shortest_cost = total_time
                            best_route = EvacuationRoute(
                                route_id=f"evac-{res_node.id}-{shelter.id}",
                                source_node_id=res_node.id,
                                source_name=res_node.name,
                                target_shelter_id=shelter.id,
                                target_shelter_name=shelter.name,
                                coordinates=route_coords,
                                distance_km=round(total_dist, 2),
                                estimated_time_min=round(total_time, 1),
                                safety_score=safety_score,
                                status=route_status,
                                assigned_evacuees=res_node.population_density or 850,
                                choke_points=choke_points
                            )
                    except Exception:
                        continue

            if best_route:
                evacuation_routes.append(best_route)
            else:
                # No path found - isolated zone
                evacuation_routes.append(EvacuationRoute(
                    route_id=f"evac-{res_node.id}-isolated",
                    source_node_id=res_node.id,
                    source_name=res_node.name,
                    target_shelter_id="NONE",
                    target_shelter_name="NO REACHABLE SHELTER",
                    coordinates=[[res_node.lng, res_node.lat]],
                    distance_km=0.0,
                    estimated_time_min=0.0,
                    safety_score=0.0,
                    status="compromised",
                    assigned_evacuees=res_node.population_density or 850,
                    choke_points=["All egress routes submerged or blocked!"]
                ))

        return evacuation_routes
