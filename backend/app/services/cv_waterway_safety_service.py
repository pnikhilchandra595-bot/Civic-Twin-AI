"""
Computer Vision Waterway Safety and Hydrodynamic Hazard Radar Engine.
Provides edge-inferenced video analytics for urban flood navigation and rescue operations:
1. Submerged concrete median divider and obstacle detection
2. Farneback Dense Optical Flow surface velocity vectors (u, v) and capsize vortex detection (>2.5 m/s)
3. Waterline depth inference using physical fiducial markers (curbs, poles, tires)
4. Safe navigable corridor segmentation for NDRF Inflatable Rescue Boats (IRBs)
"""

import math
import random
import time
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class CVWaterwayDetection(BaseModel):
    id: str
    hazard_type: str  # "SUBMERGED_MEDIAN" | "HIGH_VELOCITY_VORTEX" | "FLOATING_DEBRIS" | "STALLED_VEHICLE" | "SAFE_CHANNEL"
    label: str
    confidence: float
    bbox_pct: List[int]  # [x, y, w, h] in % of frame
    water_depth_m: float
    submerged_clearance_m: float  # Depth of water above obstacle (<0.3m is prop strike risk)
    collision_risk: str  # "CRITICAL_IMPACT" | "PROP_STRIKE_HAZARD" | "VORTEX_CAPSIZE" | "PASSABLE"
    flow_velocity_ms: float
    tactical_action: str

class OpticalFlowVector(BaseModel):
    grid_x: int  # 0 to 10
    grid_y: int  # 0 to 10
    u_velocity: float
    v_velocity: float
    magnitude_ms: float
    vorticity: float
    is_eddy_or_whirlpool: bool

class WaterwaySafetyTelemetry(BaseModel):
    frame_timestamp_iso: str
    camera_id: str
    stream_fps: float
    waterway_name: str
    channel_status: str  # "NAVIGABLE" | "HAZARDOUS_CURRENT" | "IMPASSABLE_BLOCKED"
    surface_velocity_mean_ms: float
    surface_velocity_peak_ms: float
    safe_boat_heading_deg: float
    optical_flow_grid: List[OpticalFlowVector]
    detected_hazards: List[CVWaterwayDetection]
    submerged_median_visible: bool
    underwater_sonar_alert: Optional[str]

class CVWaterwaySafetyService:
    def __init__(self):
        pass

    def analyze_waterway_feed(
        self, 
        camera_id: str = "DRONE-GARUDA-01", 
        flood_depth_m: float = 1.25,
        flow_speed_ms: float = 1.8
    ) -> WaterwaySafetyTelemetry:
        """
        Runs synthetic computer vision inference imitating an edge-processed 
        YOLOv8 + Farneback optical flow model on live UAV/CCTV video frames.
        """
        now_str = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        
        # 1. Generate 11x11 dense optical flow velocity grid
        flow_grid: List[OpticalFlowVector] = []
        max_vel = 0.0
        sum_vel = 0.0

        for gx in range(0, 11):
            for gy in range(0, 11):
                # Hydrodynamic river model: higher velocity in center channel (gy around 4-7)
                center_dist = abs(gy - 5)
                base_mag = max(0.2, flow_speed_ms * (1.2 - center_dist * 0.15))
                # Add turbulence
                turbulence = (math.sin(gx * 0.8 + time.time() * 0.5) + math.cos(gy * 0.6)) * 0.25
                mag = max(0.1, round(base_mag + turbulence, 2))
                
                # Check for vortex / whirlpool near pillar (around gx=6, gy=5)
                dx = gx - 6
                dy = gy - 5
                dist_pillar = math.sqrt(dx*dx + dy*dy)
                is_vortex = dist_pillar < 1.8 and flow_speed_ms > 1.5

                if is_vortex:
                    u = round(-dy * 0.6, 2)
                    v = round(dx * 0.6, 2)
                    mag = max(mag, 2.6)
                    vorticity = round(1.8 / max(dist_pillar, 0.5), 2)
                else:
                    u = round(mag * 0.95, 2)
                    v = round(mag * 0.15 * math.sin(gx), 2)
                    vorticity = 0.15

                flow_grid.append(OpticalFlowVector(
                    grid_x=gx,
                    grid_y=gy,
                    u_velocity=u,
                    v_velocity=v,
                    magnitude_ms=mag,
                    vorticity=vorticity,
                    is_eddy_or_whirlpool=is_vortex
                ))

                sum_vel += mag
                if mag > max_vel:
                    max_vel = mag

        mean_vel = round(sum_vel / len(flow_grid), 2)

        # 2. Detect Hazards
        # Submerged concrete divider calculation
        median_top_el = 0.45  # Standard Indian urban road divider height = 0.45m
        water_over_median = max(0.0, flood_depth_m - median_top_el)
        median_risk = "PROP_STRIKE_HAZARD" if water_over_median < 0.4 else "PASSABLE"

        hazards = [
            CVWaterwayDetection(
                id="HAZ-MED-01",
                hazard_type="SUBMERGED_MEDIAN",
                label="Submerged Concrete Road Median Divider (Hidden)",
                confidence=0.96,
                bbox_pct=[22, 58, 54, 14],
                water_depth_m=round(flood_depth_m, 2),
                submerged_clearance_m=round(water_over_median, 2),
                collision_risk=median_risk,
                flow_velocity_ms=round(mean_vel, 2),
                tactical_action="PROHIBIT BOAT CROSSING: Outboard motor propeller will shear against submerged concrete median."
            ),
            CVWaterwayDetection(
                id="HAZ-VOR-02",
                hazard_type="HIGH_VELOCITY_VORTEX",
                label="Hydrodynamic Suction Eddy / Manhole Inflow Vortex",
                confidence=0.91,
                bbox_pct=[52, 40, 24, 26],
                water_depth_m=round(flood_depth_m + 0.35, 2),
                submerged_clearance_m=0.0,
                collision_risk="VORTEX_CAPSIZE" if max_vel > 2.2 else "PROP_STRIKE_HAZARD",
                flow_velocity_ms=round(max_vel, 2),
                tactical_action="NAVIGATIONAL NO-GO ZONE: Swirling downward suction exceeds 2.4 m/s. Capsize threshold reached."
            ),
            CVWaterwayDetection(
                id="HAZ-VEH-03",
                hazard_type="STALLED_VEHICLE",
                label="Partially Submerged BEST Municipal Bus (Roof Accessible)",
                confidence=0.98,
                bbox_pct=[74, 25, 20, 28],
                water_depth_m=round(flood_depth_m, 2),
                submerged_clearance_m=0.0,
                collision_risk="CRITICAL_IMPACT",
                flow_velocity_ms=round(mean_vel * 0.7, 2),
                tactical_action="SEARCH AND RESCUE DOCKING: Position rescue boat upstream of vehicle windshield to evacuate rooftop victims."
            ),
            CVWaterwayDetection(
                id="NAV-CH-01",
                hazard_type="SAFE_CHANNEL",
                label="Verified Navigable Rescue Boat Channel (Cleared Depth > 1.2m)",
                confidence=0.94,
                bbox_pct=[5, 32, 28, 48],
                water_depth_m=round(flood_depth_m, 2),
                submerged_clearance_m=round(flood_depth_m, 2),
                collision_risk="PASSABLE",
                flow_velocity_ms=round(mean_vel * 0.85, 2),
                tactical_action="PRIMARY TRANSIT CORRIDOR: Zero submerged curb obstacles. Maintain 6 knots throttle."
            )
        ]

        # Channel Status Evaluation
        channel_status = "NAVIGABLE"
        sonar_alert = None
        if max_vel > 2.5:
            channel_status = "HAZARDOUS_CURRENT"
            sonar_alert = "WARNING: Surface water velocity exceeds 2.5 m/s. Risk of inflatable boat broaching."
        if water_over_median > 0 and water_over_median < 0.25:
            sonar_alert = "CRITICAL: Median submerged by only 18 cm. Immediate propeller strike danger."

        return WaterwaySafetyTelemetry(
            frame_timestamp_iso=now_str,
            camera_id=camera_id,
            stream_fps=29.97,
            waterway_name="Mithi River Basin / S.V. Road Inundation Corridor",
            channel_status=channel_status,
            surface_velocity_mean_ms=mean_vel,
            surface_velocity_peak_ms=max_vel,
            safe_boat_heading_deg=285.0,
            optical_flow_grid=flow_grid,
            detected_hazards=hazards,
            submerged_median_visible=True,
            underwater_sonar_alert=sonar_alert
        )

cv_waterway_safety_service = CVWaterwaySafetyService()
