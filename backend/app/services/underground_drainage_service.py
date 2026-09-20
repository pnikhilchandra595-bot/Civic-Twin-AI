"""
Underground Stormwater Drainage Hydraulic Network Engine
Coupled 1D/2D Saint-Venant Subterranean Pipe Hydraulics and Surcharging Geyser Simulator.
"""

import math
import random
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class ManholeChamber(BaseModel):
    id: str
    name: str
    x: float
    z: float
    ground_elevation_m: float
    invert_elevation_m: float
    depth_m: float
    water_level_m: float
    pressure_head_m: float
    status: str
    siltation_choke_pct: float
    geyser_height_m: float
    connected_pipes: List[str]

class DrainagePipeConduit(BaseModel):
    id: str
    name: str
    from_manhole: str
    to_manhole: str
    start_pos: List[float]
    end_pos: List[float]
    diameter_m: float
    length_m: float
    slope: float
    roughness_n: float
    flow_rate_m3s: float
    capacity_max_m3s: float
    fill_ratio_pct: float
    flow_velocity_ms: float
    is_pressurized: bool
    siltation_pct: float
    status: str

class DrainageNetworkState(BaseModel):
    network_id: str
    city_name: str
    total_pipes_count: int
    total_manholes_count: int
    active_surcharging_nodes: int
    total_drainage_discharge_m3s: float
    outfall_tide_elevation_m: float
    outfall_backpressure_active: bool
    manholes: List[ManholeChamber]
    pipes: List[DrainagePipeConduit]
    network_health_score_pct: float

class UndergroundDrainageService:
    def __init__(self):
        self._init_network()

    def _init_network(self):
        self.raw_manholes = [
            {"id": "MH-01", "name": "Sion Circle Storm Sump", "x": -110, "z": -50, "ground_el": 4.5, "depth": 3.8, "pipes": ["PIPE-01", "PIPE-02"]},
            {"id": "MH-02", "name": "Kurla West Trunk Collector", "x": -60, "z": -20, "ground_el": 3.6, "depth": 4.2, "pipes": ["PIPE-01", "PIPE-03", "PIPE-04"]},
            {"id": "MH-03", "name": "Dharavi 90-Feet Rd Culvert", "x": 40, "z": -120, "ground_el": 3.2, "depth": 3.5, "pipes": ["PIPE-03", "PIPE-05"]},
            {"id": "MH-04", "name": "Milan Subway Deep Drainage Trench", "x": -75, "z": 95, "ground_el": -1.2, "depth": 5.0, "pipes": ["PIPE-02", "PIPE-06"]},
            {"id": "MH-05", "name": "BKC Connector Storm Main", "x": 100, "z": 40, "ground_el": 6.8, "depth": 4.0, "pipes": ["PIPE-04", "PIPE-07"]},
            {"id": "MH-06", "name": "Bandra East Collector Trunk", "x": 120, "z": 130, "ground_el": 8.5, "depth": 4.5, "pipes": ["PIPE-07", "PIPE-08"]},
            {"id": "MH-07", "name": "Kranti Nagar Lowland Siphon", "x": -140, "z": 30, "ground_el": 2.1, "depth": 3.2, "pipes": ["PIPE-06", "PIPE-09"]},
            {"id": "MH-08", "name": "Mahim Creek Tidal Outfall Flap Gate", "x": -180, "z": -130, "ground_el": 1.5, "depth": 3.0, "pipes": ["PIPE-05", "PIPE-09"]}
        ]

        self.raw_pipes = [
            {"id": "PIPE-01", "name": "Sion-Kurla Interceptor Conduit", "from": "MH-01", "to": "MH-02", "diameter": 2.2, "n": 0.015, "silt": 45.0},
            {"id": "PIPE-02", "name": "Sion-Milan Gravity Siphon", "from": "MH-01", "to": "MH-04", "diameter": 1.8, "n": 0.016, "silt": 70.0},
            {"id": "PIPE-03", "name": "Kurla-Dharavi Pressure Box Culvert", "from": "MH-02", "to": "MH-03", "diameter": 2.8, "n": 0.014, "silt": 35.0},
            {"id": "PIPE-04", "name": "Kurla-BKC High-Capacity Stormway", "from": "MH-02", "to": "MH-05", "diameter": 2.4, "n": 0.013, "silt": 20.0},
            {"id": "PIPE-05", "name": "Dharavi-Mahim Creek Outfall Main", "from": "MH-03", "to": "MH-08", "diameter": 3.2, "n": 0.014, "silt": 55.0},
            {"id": "PIPE-06", "name": "Milan-Kranti Relief Trunk", "from": "MH-04", "to": "MH-07", "diameter": 2.0, "n": 0.018, "silt": 80.0},
            {"id": "PIPE-07", "name": "BKC-Bandra Inter-Basin Conduit", "from": "MH-05", "to": "MH-06", "diameter": 2.2, "n": 0.013, "silt": 15.0},
            {"id": "PIPE-08", "name": "Bandra East Highland Feeder", "from": "MH-06", "to": "MH-05", "diameter": 1.8, "n": 0.013, "silt": 10.0},
            {"id": "PIPE-09", "name": "Kranti-Mahim Tidal Discharge Culvert", "from": "MH-07", "to": "MH-08", "diameter": 3.0, "n": 0.016, "silt": 65.0}
        ]

    def solve_network(
        self, 
        surface_flood_depth_m: float = 0.85, 
        rainfall_intensity_mmhr: float = 78.0, 
        tide_height_m: float = 3.8
    ) -> DrainageNetworkState:
        mh_map = {m["id"]: m for m in self.raw_manholes}
        outfall_head_m = max(0.0, tide_height_m - 1.5)
        outfall_backpressure = tide_height_m > 3.2

        pipes: List[DrainagePipeConduit] = []
        manhole_inflows = {m["id"]: 0.0 for m in self.raw_manholes}

        for p_def in self.raw_pipes:
            f_mh = mh_map[p_def["from"]]
            t_mh = mh_map[p_def["to"]]

            dx = t_mh["x"] - f_mh["x"]
            dz = t_mh["z"] - f_mh["z"]
            length = math.sqrt(dx*dx + dz*dz)

            y_start = f_mh["ground_el"] - f_mh["depth"]
            y_end = t_mh["ground_el"] - t_mh["depth"]
            slope = max(0.001, (y_start - y_end) / max(length, 1.0))

            d = p_def["diameter"]
            effective_d = d * (1.0 - (p_def["silt"] / 100.0) * 0.5)
            area = math.pi * (effective_d / 2.0)**2
            hyd_radius = effective_d / 4.0
            n = p_def["n"]
            q_max = (1.0 / n) * area * (hyd_radius**(2.0/3.0)) * math.sqrt(slope)

            basin_area_ha = 15.0
            runoff_coeff = 0.85
            q_inflow = (runoff_coeff * rainfall_intensity_mmhr * basin_area_ha) / 360.0

            pond_pressure = surface_flood_depth_m * 1.5
            effective_flow = q_inflow + pond_pressure * 0.8

            if t_mh["id"] == "MH-08" and outfall_backpressure:
                effective_flow = effective_flow * 0.35

            fill_pct = min(150.0, round((effective_flow / max(q_max, 0.1)) * 100.0, 1))
            is_pressurized = fill_pct >= 95.0
            velocity = min(4.5, effective_flow / max(area, 0.1))

            status = "NORMAL_GRAVITY"
            if is_pressurized and fill_pct > 120.0:
                status = "FULL_PRESSURIZED"
            elif is_pressurized:
                status = "CAPACITY_WARNING"
            elif t_mh["id"] == "MH-08" and outfall_backpressure:
                status = "REVERSE_BACKFLOW"

            pipes.append(DrainagePipeConduit(
                id=p_def["id"],
                name=p_def["name"],
                from_manhole=p_def["from"],
                to_manhole=p_def["to"],
                start_pos=[f_mh["x"], round(y_start, 2), f_mh["z"]],
                end_pos=[t_mh["x"], round(y_end, 2), t_mh["z"]],
                diameter_m=d,
                length_m=round(length, 1),
                slope=round(slope, 4),
                roughness_n=n,
                flow_rate_m3s=round(effective_flow, 2),
                capacity_max_m3s=round(q_max, 2),
                fill_ratio_pct=fill_pct,
                flow_velocity_ms=round(velocity, 2),
                is_pressurized=is_pressurized,
                siltation_pct=p_def["silt"],
                status=status
            ))

            manhole_inflows[t_mh["id"]] += effective_flow

        manholes: List[ManholeChamber] = []
        active_geysers = 0
        total_discharge = sum(p.flow_rate_m3s for p in pipes)

        for m_def in self.raw_manholes:
            invert_el = m_def["ground_el"] - m_def["depth"]
            inflow = manhole_inflows[m_def["id"]]
            
            choke_factor = 1.0 + (50.0 / 100.0)
            hgl_rise = (inflow / 8.0) * choke_factor

            if m_def["id"] in ["MH-07", "MH-08"]:
                hgl_rise += outfall_head_m

            water_level_m = invert_el + hgl_rise
            pressure_head = water_level_m - m_def["ground_el"]

            geyser_height = 0.0
            if pressure_head > 0.1:
                geyser_height = min(2.8, round(pressure_head * 0.65, 2))
                status = "GEYSER_ERUPTING"
                active_geysers += 1
            elif pressure_head > -0.5:
                status = "SURCHARGING"
                active_geysers += 1
            elif water_level_m > (invert_el + m_def["depth"] * 0.7):
                status = "CAPACITY_WARNING"
            else:
                status = "GRAVITY_FLOW"

            manholes.append(ManholeChamber(
                id=m_def["id"],
                name=m_def["name"],
                x=m_def["x"],
                z=m_def["z"],
                ground_elevation_m=m_def["ground_el"],
                invert_elevation_m=round(invert_el, 2),
                depth_m=m_def["depth"],
                water_level_m=round(water_level_m, 2),
                pressure_head_m=round(pressure_head, 2),
                status=status,
                siltation_choke_pct=round(random.uniform(25.0, 75.0), 1),
                geyser_height_m=geyser_height,
                connected_pipes=m_def["pipes"]
            ))

        pressurized_count = sum(1 for p in pipes if p.is_pressurized)
        health = max(10.0, 100.0 - (pressurized_count * 8.0) - (active_geysers * 12.0) - (outfall_head_m * 10.0))

        return DrainageNetworkState(
            network_id="NET-MUM-SWD-01",
            city_name="Mumbai BRIMSTOWAD Coupled Basin",
            total_pipes_count=len(pipes),
            total_manholes_count=len(manholes),
            active_surcharging_nodes=active_geysers,
            total_drainage_discharge_m3s=round(total_discharge, 2),
            outfall_tide_elevation_m=tide_height_m,
            outfall_backpressure_active=outfall_backpressure,
            manholes=manholes,
            pipes=pipes,
            network_health_score_pct=round(health, 1)
        )

underground_drainage_service = UndergroundDrainageService()
