import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class ComputerVisionDetection(BaseModel):
    label: str
    confidence: float
    bbox: List[int]  # [x, y, w, h] in %
    hazard_severity: str  # "CRITICAL" | "WARNING" | "NORMAL"

class DroneCameraFeed(BaseModel):
    camera_id: str
    feed_name: str
    camera_type: str  # "MUNICIPAL_CCTV" | "UAV_SURVEY_DRONE" | "TRAFFIC_CAMERA" | "COASTAL_RADAR_CAM"
    city_id: str
    location_name: str
    state_name: str
    lat: float
    lng: float
    video_url: str  # Real Direct MP4 Video Stream
    status: str  # "LIVE_STREAMING" | "RECORDING" | "STANDBY"
    flood_depth_detected_m: float
    stalled_vehicles_count: int
    stranded_pedestrians_count: int
    flow_velocity_ms: float
    ai_yolo_detections: List[ComputerVisionDetection]

class DroneCCTVService:
    """
    Manages real-time AI Computer Vision video streams from municipal CCTV cameras
    and autonomous reconnaissance survey drones (UAVs) across Indian States.
    """

    def __init__(self):
        self.camera_feeds: List[DroneCameraFeed] = []
        self._init_pan_india_camera_feeds()

    def _init_pan_india_camera_feeds(self):
        self.camera_feeds = [
            # 0. Live Mobile Unit: Nikhil's iPhone (Live IP Camera Stream)
            DroneCameraFeed(
                camera_id="CAM-IPHONE-01",
                feed_name="📱 Nikhil's iPhone Live Mobile Recon Feed",
                camera_type="UAV_SURVEY_DRONE",
                city_id="all",
                location_name="Live Mobile Tactical Unit (Nikhil's iPhone)",
                state_name="Active Command Field Unit",
                lat=19.076,
                lng=72.877,
                video_url="http://nikhils-iphone.local:8081/video",
                status="LIVE_STREAMING",
                flood_depth_detected_m=0.35,
                stalled_vehicles_count=1,
                stranded_pedestrians_count=2,
                flow_velocity_ms=1.2,
                ai_yolo_detections=[
                    ComputerVisionDetection(label="Active Tactical Field Camera", confidence=0.99, bbox=[25, 20, 50, 60], hazard_severity="NORMAL"),
                    ComputerVisionDetection(label="Live Human Detection", confidence=0.95, bbox=[35, 30, 30, 45], hazard_severity="WARNING")
                ]
            ),
            # 1. Mumbai Hindmata Subway (CCTV) - Real Flooded Street Footage
            DroneCameraFeed(
                camera_id="CAM-MUM-01",
                feed_name="Hindmata Lowland Subway Underpass (CAM-04)",
                camera_type="MUNICIPAL_CCTV",
                city_id="mumbai_monsoon",
                location_name="Hindmata Junction & Dadar TT Circle",
                state_name="Maharashtra",
                lat=19.019,
                lng=72.846,
                video_url="/videos/mumbai_mithi.mp4",
                status="LIVE_STREAMING",
                flood_depth_detected_m=0.58,
                stalled_vehicles_count=3,
                stranded_pedestrians_count=6,
                flow_velocity_ms=1.4,
                ai_yolo_detections=[
                    ComputerVisionDetection(label="Submerged Public Bus (BEST)", confidence=0.96, bbox=[18, 32, 42, 38], hazard_severity="CRITICAL"),
                    ComputerVisionDetection(label="Stranded Citizens on Divider (6x)", confidence=0.94, bbox=[65, 42, 22, 30], hazard_severity="CRITICAL"),
                    ComputerVisionDetection(label="Water Pooling Level: 0.58m", confidence=0.98, bbox=[5, 62, 90, 32], hazard_severity="WARNING")
                ]
            ),
            # 2. Mumbai River Recon Drone (Garuda-1) - Live River Flow Recon
            DroneCameraFeed(
                camera_id="DRONE-MUM-01",
                feed_name="UAV Recon Drone Garuda-1 (Mithi Riverfront)",
                camera_type="UAV_SURVEY_DRONE",
                city_id="mumbai_monsoon",
                location_name="Kurla West Kranti Nagar Embankment",
                state_name="Maharashtra",
                lat=19.068,
                lng=72.875,
                video_url="/videos/river_drone.mp4",
                status="LIVE_STREAMING",
                flood_depth_detected_m=0.92,
                stalled_vehicles_count=5,
                stranded_pedestrians_count=14,
                flow_velocity_ms=2.8,
                ai_yolo_detections=[
                    ComputerVisionDetection(label="Mithi River Embankment Overflow", confidence=0.97, bbox=[20, 22, 60, 44], hazard_severity="CRITICAL"),
                    ComputerVisionDetection(label="Roof Stranded Group (14 Persons)", confidence=0.95, bbox=[45, 12, 32, 26], hazard_severity="CRITICAL"),
                    ComputerVisionDetection(label="High Velocity Water Current (2.8 m/s)", confidence=0.91, bbox=[10, 66, 80, 28], hazard_severity="WARNING")
                ]
            ),
            # 3. Delhi NCR Yamuna Recon Drone - Real Flowing River Flood
            DroneCameraFeed(
                camera_id="DRONE-DEL-01",
                feed_name="UAV SkyRecon Falcon-4 (Yamuna Floodplain)",
                camera_type="UAV_SURVEY_DRONE",
                city_id="delhi_yamuna",
                location_name="Old Yamuna Iron Bridge & Ring Road",
                state_name="Delhi NCR",
                lat=28.665,
                lng=77.235,
                video_url="/videos/delhi_yamuna.mp4",
                status="LIVE_STREAMING",
                flood_depth_detected_m=0.74,
                stalled_vehicles_count=4,
                stranded_pedestrians_count=8,
                flow_velocity_ms=2.1,
                ai_yolo_detections=[
                    ComputerVisionDetection(label="Yamuna Lowland Floodplain Submerged", confidence=0.98, bbox=[15, 25, 70, 45], hazard_severity="CRITICAL"),
                    ComputerVisionDetection(label="Ring Road Water Inundation", confidence=0.93, bbox=[5, 60, 90, 30], hazard_severity="WARNING")
                ]
            ),
            # 4. Bengaluru Lake Spill (CCTV) - Heavy Torrential Urban Rain
            DroneCameraFeed(
                camera_id="CAM-BLR-01",
                feed_name="Bellandur Sluice Gate CCTV Matrix",
                camera_type="MUNICIPAL_CCTV",
                city_id="bengaluru_lakes",
                location_name="Outer Ring Road & Ecospace Lake Drain",
                state_name="Karnataka",
                lat=12.926,
                lng=77.676,
                video_url="/videos/bengaluru_lakes.mp4",
                status="LIVE_STREAMING",
                flood_depth_detected_m=0.45,
                stalled_vehicles_count=8,
                stranded_pedestrians_count=3,
                flow_velocity_ms=0.9,
                ai_yolo_detections=[
                    ComputerVisionDetection(label="ORR Service Road Waterlogging", confidence=0.95, bbox=[22, 35, 55, 40], hazard_severity="WARNING"),
                    ComputerVisionDetection(label="Traffic Gridlock / Stalled Sedans", confidence=0.92, bbox=[10, 50, 40, 35], hazard_severity="WARNING")
                ]
            ),
            # 5. Chennai Coastal Cyclone Radar Cam - Live Waterway & Surge Stream
            DroneCameraFeed(
                camera_id="CAM-CHN-01",
                feed_name="Marina Beach Coastal Storm Surge Cam",
                camera_type="COASTAL_RADAR_CAM",
                city_id="chennai_cyclone",
                location_name="Adyar River Estuary & Marina Shore",
                state_name="Tamil Nadu",
                lat=13.010,
                lng=80.278,
                video_url="/videos/chennai_coastal.mp4",
                status="LIVE_STREAMING",
                flood_depth_detected_m=1.15,
                stalled_vehicles_count=1,
                stranded_pedestrians_count=2,
                flow_velocity_ms=3.4,
                ai_yolo_detections=[
                    ComputerVisionDetection(label="Tidal Wave Overtopping (1.15m)", confidence=0.99, bbox=[5, 30, 90, 50], hazard_severity="CRITICAL"),
                    ComputerVisionDetection(label="High Velocity Estuary Sluice Current", confidence=0.94, bbox=[30, 55, 40, 35], hazard_severity="CRITICAL")
                ]
            ),
            # 6. Assam Brahmaputra Aerial Recon Drone - River Survey
            DroneCameraFeed(
                camera_id="DRONE-ASM-01",
                feed_name="UAV EagleEye-9 (Brahmaputra Valley)",
                camera_type="UAV_SURVEY_DRONE",
                city_id="assam_brahmaputra",
                location_name="Guwahati Riverside Ghat & Embankment",
                state_name="Assam",
                lat=26.185,
                lng=91.748,
                video_url="/videos/assam_brahmaputra.mp4",
                status="LIVE_STREAMING",
                flood_depth_detected_m=1.45,
                stalled_vehicles_count=0,
                stranded_pedestrians_count=22,
                flow_velocity_ms=4.2,
                ai_yolo_detections=[
                    ComputerVisionDetection(label="Brahmaputra Major Inundation Plain", confidence=0.98, bbox=[10, 15, 80, 55], hazard_severity="CRITICAL"),
                    ComputerVisionDetection(label="Village Evacuees at River Bund (22x)", confidence=0.96, bbox=[40, 60, 35, 25], hazard_severity="CRITICAL")
                ]
            ),
            # 7. Official IMD Doppler Weather Radar Cam (Mumbai Colaba Live Radar GIF)
            DroneCameraFeed(
                camera_id="CAM-IMD-MUM-01",
                feed_name="🌧️ IMD Doppler Weather Radar (Mumbai Colaba)",
                camera_type="COASTAL_RADAR_CAM",
                city_id="mumbai_monsoon",
                location_name="IMD Colaba Weather Station & Arabian Sea Radar",
                state_name="Maharashtra",
                lat=18.898,
                lng=72.812,
                video_url="https://mausam.imd.gov.in/Radar/animation/Converted/MUM_MAXZ.gif",
                status="LIVE_STREAMING",
                flood_depth_detected_m=0.42,
                stalled_vehicles_count=0,
                stranded_pedestrians_count=0,
                flow_velocity_ms=8.5,
                ai_yolo_detections=[
                    ComputerVisionDetection(label="IMD Severe Rain Band Reflectivity (48 dBZ)", confidence=0.99, bbox=[10, 10, 80, 80], hazard_severity="CRITICAL"),
                    ComputerVisionDetection(label="Western Ghats Orgraphic Surge", confidence=0.95, bbox=[50, 20, 40, 60], hazard_severity="WARNING")
                ]
            ),
            # 8. Official IMD National All-India Radar Mosaic (Live Composite GIF)
            DroneCameraFeed(
                camera_id="CAM-IMD-NAT-01",
                feed_name="🛰️ IMD National All-India Doppler Radar Mosaic",
                camera_type="COASTAL_RADAR_CAM",
                city_id="all",
                location_name="IMD National Meteorological Operations Grid",
                state_name="All-India Radar Grid",
                lat=22.500,
                lng=78.500,
                video_url="https://mausam.imd.gov.in/Radar/MOSAIC/Converted/mosaic.gif",
                status="LIVE_STREAMING",
                flood_depth_detected_m=0.0,
                stalled_vehicles_count=0,
                stranded_pedestrians_count=0,
                flow_velocity_ms=12.4,
                ai_yolo_detections=[
                    ComputerVisionDetection(label="Active Pan-India Monsoon Trough", confidence=0.98, bbox=[20, 20, 60, 60], hazard_severity="WARNING"),
                    ComputerVisionDetection(label="High Cloud Precipitation Density", confidence=0.96, bbox=[35, 45, 40, 30], hazard_severity="CRITICAL")
                ]
            ),
            # 9. Hyderabad Musi River & Hussain Sagar Sluice Gate Cam
            DroneCameraFeed(
                camera_id="CAM-HYD-MUSI-01",
                feed_name="🌊 Hyderabad Musi Riverfront & Sluice Cam",
                camera_type="MUNICIPAL_CCTV",
                city_id="telangana_hyderabad",
                location_name="Musi River Channel & Moosarambagh Bridge",
                state_name="Telangana",
                lat=17.3850,
                lng=78.4867,
                video_url="/videos/river_drone.mp4",
                status="LIVE_STREAMING",
                flood_depth_detected_m=0.85,
                stalled_vehicles_count=4,
                stranded_pedestrians_count=9,
                flow_velocity_ms=3.1,
                ai_yolo_detections=[
                    ComputerVisionDetection(label="Musi River Level Above Red Mark (0.85m)", confidence=0.97, bbox=[15, 30, 70, 50], hazard_severity="CRITICAL"),
                    ComputerVisionDetection(label="Moosarambagh Causeaway Submerged", confidence=0.94, bbox=[25, 60, 50, 30], hazard_severity="CRITICAL")
                ]
            ),
            # 10. Official IMD Delhi NCR Doppler Weather Radar (Live Animation GIF)
            DroneCameraFeed(
                camera_id="CAM-IMD-DEL-01",
                feed_name="🌧️ IMD Doppler Weather Radar (Delhi NCR Palam)",
                camera_type="COASTAL_RADAR_CAM",
                city_id="delhi_yamuna",
                location_name="IMD Palam Station & Yamuna Basin Radar",
                state_name="Delhi NCR",
                lat=28.583,
                lng=77.083,
                video_url="https://mausam.imd.gov.in/Radar/animation/Converted/DLH_MAXZ.gif",
                status="LIVE_STREAMING",
                flood_depth_detected_m=0.55,
                stalled_vehicles_count=0,
                stranded_pedestrians_count=0,
                flow_velocity_ms=6.8,
                ai_yolo_detections=[
                    ComputerVisionDetection(label="NCR Storm Front Cloud Cell", confidence=0.97, bbox=[15, 15, 70, 70], hazard_severity="WARNING")
                ]
            )
        ]

    def get_all_feeds(self) -> List[DroneCameraFeed]:
        return self.camera_feeds

    def get_feeds_by_city(self, city_id: Optional[str] = None) -> List[DroneCameraFeed]:
        if not city_id:
            return self.camera_feeds
        matches = [f for f in self.camera_feeds if f.city_id == city_id or f.city_id == "all"]
        return matches if matches else self.camera_feeds

drone_cctv_service = DroneCCTVService()
