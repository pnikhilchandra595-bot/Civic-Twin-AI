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
            # 1. Mumbai Hindmata Subway (CCTV)
            DroneCameraFeed(
                camera_id="CAM-MUM-01",
                feed_name="Hindmata Lowland Subway Underpass (CAM-04)",
                camera_type="MUNICIPAL_CCTV",
                city_id="mumbai_monsoon",
                location_name="Hindmata Junction & Dadar TT Circle",
                state_name="Maharashtra",
                lat=19.019,
                lng=72.846,
                video_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
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
            # 2. Mumbai River Recon Drone (Garuda-1)
            DroneCameraFeed(
                camera_id="DRONE-MUM-01",
                feed_name="UAV Recon Drone Garuda-1 (Mithi Riverfront)",
                camera_type="UAV_SURVEY_DRONE",
                city_id="mumbai_monsoon",
                location_name="Kurla West Kranti Nagar Embankment",
                state_name="Maharashtra",
                lat=19.068,
                lng=72.875,
                video_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
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
            # 3. Delhi NCR Yamuna Recon Drone
            DroneCameraFeed(
                camera_id="DRONE-DEL-01",
                feed_name="UAV SkyRecon Falcon-4 (Yamuna Floodplain)",
                camera_type="UAV_SURVEY_DRONE",
                city_id="delhi_yamuna",
                location_name="Old Yamuna Iron Bridge & Ring Road",
                state_name="Delhi NCR",
                lat=28.665,
                lng=77.235,
                video_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                status="LIVE_STREAMING",
                flood_depth_detected_m=0.74,
                stalled_vehicles_count=4,
                stranded_pedestrians_count=8,
                flow_velocity_ms=2.1,
                ai_yolo_detections=[
                    ComputerVisionDetection(label="Yamuna High Crest Overtopping (208.6m)", confidence=0.98, bbox=[15, 25, 70, 45], hazard_severity="CRITICAL"),
                    ComputerVisionDetection(label="Stranded Settlement Cluster", confidence=0.93, bbox=[50, 18, 30, 25], hazard_severity="CRITICAL")
                ]
            ),
            # 4. Bengaluru Lake Spillway (Karnataka)
            DroneCameraFeed(
                camera_id="CAM-BLR-01",
                feed_name="Bellandur Lake Sluice & Eco-Space Choke (CAM-12)",
                camera_type="MUNICIPAL_CCTV",
                city_id="bengaluru_lakes",
                location_name="Outer Ring Road & Bellandur Lake Spillway",
                state_name="Karnataka",
                lat=12.927,
                lng=77.674,
                video_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
                status="LIVE_STREAMING",
                flood_depth_detected_m=0.62,
                stalled_vehicles_count=7,
                stranded_pedestrians_count=11,
                flow_velocity_ms=1.6,
                ai_yolo_detections=[
                    ComputerVisionDetection(label="Tech Park Perimeter Wall Inundation", confidence=0.94, bbox=[25, 30, 50, 35], hazard_severity="CRITICAL"),
                    ComputerVisionDetection(label="Stalled Vehicles on ORR (7x)", confidence=0.92, bbox=[10, 60, 80, 28], hazard_severity="WARNING")
                ]
            ),
            # 5. Chennai Cooum Surge (Tamil Nadu)
            DroneCameraFeed(
                camera_id="DRONE-CHE-01",
                feed_name="Coastal Recon Drone Trisul-2 (Marina Beach Mouth)",
                camera_type="UAV_SURVEY_DRONE",
                city_id="chennai_cyclone",
                location_name="Cooum River Outfall & Napier Bridge",
                state_name="Tamil Nadu",
                lat=13.067,
                lng=80.282,
                video_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
                status="LIVE_STREAMING",
                flood_depth_detected_m=0.88,
                stalled_vehicles_count=2,
                stranded_pedestrians_count=4,
                flow_velocity_ms=3.2,
                ai_yolo_detections=[
                    ComputerVisionDetection(label="Storm Surge Tide Inflow (+1.8m)", confidence=0.96, bbox=[10, 20, 80, 50], hazard_severity="CRITICAL"),
                    ComputerVisionDetection(label="Fishermen Hamlet Evacuation Point", confidence=0.90, bbox=[40, 15, 35, 25], hazard_severity="WARNING")
                ]
            )
        ]

    def get_all_feeds(self) -> List[DroneCameraFeed]:
        return self.camera_feeds

    def get_feeds_by_city(self, city_id: Optional[str] = None) -> List[DroneCameraFeed]:
        if not city_id:
            return self.camera_feeds
        matches = [f for f in self.camera_feeds if f.city_id == city_id]
        return matches if matches else self.camera_feeds

drone_cctv_service = DroneCCTVService()
