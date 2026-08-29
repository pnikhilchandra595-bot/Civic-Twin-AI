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
    video_url: str
    status: str  # "LIVE_RADAR_STREAM" | "SIMULATED_RECON_FEED" | "STANDBY"
    data_mode: str = "modeled_benchmark_simulation"
    stream_source_type: str = "SYNTHESIZED_SIMULATION_LOOP"  # "OFFICIAL_IMD_DOPPLER_RADAR" | "SYNTHESIZED_SIMULATION_LOOP"
    flood_depth_detected_m: float
    stalled_vehicles_count: int
    stranded_pedestrians_count: int
    flow_velocity_ms: float
    ai_yolo_detections: List[ComputerVisionDetection]

class DroneCCTVService:
    """
    Tactical Surveillance & Aerial Reconnaissance Simulation Service.

    DATA PROVENANCE & ARCHITECTURE NOTE:
    - Video Streams: Combines official IMD Doppler Weather Radar animation feeds with calibrated local tactical video simulation loops.
    - Computer Vision Detections: Bounding box annotations and confidence metrics in this module represent pre-calibrated synthetic computer vision benchmark annotations for disaster incident demonstration, rather than active edge-inferenced model outputs.
    - Data Mode: 'modeled_benchmark_simulation' (calibrated testbed annotations).
    """

    def __init__(self):
        self.camera_feeds: List[DroneCameraFeed] = []
        self._init_pan_india_camera_feeds()

    def _init_pan_india_camera_feeds(self):
        self.camera_feeds = [
            # 1. Quick Reaction Tactical Mobile Unit
            DroneCameraFeed(
                camera_id="CAM-TAC-01",
                feed_name="📱 NDRF Tactical Mobile Recon Unit (Alpha)",
                camera_type="UAV_SURVEY_DRONE",
                city_id="all",
                location_name="Mobile Command Field Unit (NDRF Rapid Response)",
                state_name="Active Command Sector",
                lat=19.076,
                lng=72.877,
                video_url="/videos/river_drone.mp4",
                status="SIMULATED_RECON_FEED",
                data_mode="modeled_benchmark_simulation",
                stream_source_type="SYNTHESIZED_SIMULATION_LOOP",
                flood_depth_detected_m=0.35,
                stalled_vehicles_count=1,
                stranded_pedestrians_count=2,
                flow_velocity_ms=1.2,
                ai_yolo_detections=[
                    ComputerVisionDetection(label="Tactical Reconnaissance Simulation", confidence=0.95, bbox=[25, 20, 50, 60], hazard_severity="NORMAL"),
                    ComputerVisionDetection(label="Pedestrian Inundation Marker (Benchmark)", confidence=0.92, bbox=[35, 30, 30, 45], hazard_severity="WARNING")
                ]
            ),
            # 2. Mumbai Hindmata Subway (CCTV)
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
                status="SIMULATED_RECON_FEED",
                data_mode="modeled_benchmark_simulation",
                stream_source_type="SYNTHESIZED_SIMULATION_LOOP",
                flood_depth_detected_m=0.58,
                stalled_vehicles_count=3,
                stranded_pedestrians_count=6,
                flow_velocity_ms=1.4,
                ai_yolo_detections=[
                    ComputerVisionDetection(label="Submerged Public Transit Vehicle (Simulated)", confidence=0.94, bbox=[18, 32, 42, 38], hazard_severity="CRITICAL"),
                    ComputerVisionDetection(label="Stranded Citizens on Median (Simulated)", confidence=0.91, bbox=[65, 42, 22, 30], hazard_severity="CRITICAL"),
                    ComputerVisionDetection(label="Estimated Water Depth: 0.58m", confidence=0.95, bbox=[5, 62, 90, 32], hazard_severity="WARNING")
                ]
            ),
            # 3. Mumbai River Recon Drone (Garuda-1)
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
                status="SIMULATED_RECON_FEED",
                data_mode="modeled_benchmark_simulation",
                stream_source_type="SYNTHESIZED_SIMULATION_LOOP",
                flood_depth_detected_m=0.92,
                stalled_vehicles_count=5,
                stranded_pedestrians_count=14,
                flow_velocity_ms=2.8,
                ai_yolo_detections=[
                    ComputerVisionDetection(label="Mithi Embankment Overflow Zone (Simulated)", confidence=0.96, bbox=[20, 22, 60, 44], hazard_severity="CRITICAL"),
                    ComputerVisionDetection(label="Rooftop Evacuee Cluster (Simulated)", confidence=0.93, bbox=[45, 12, 32, 26], hazard_severity="CRITICAL"),
                    ComputerVisionDetection(label="High Velocity Current Vector (2.8 m/s)", confidence=0.89, bbox=[10, 66, 80, 28], hazard_severity="WARNING")
                ]
            ),
            # 4. Delhi NCR Yamuna Recon Drone
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
                status="SIMULATED_RECON_FEED",
                data_mode="modeled_benchmark_simulation",
                stream_source_type="SYNTHESIZED_SIMULATION_LOOP",
                flood_depth_detected_m=0.74,
                stalled_vehicles_count=4,
                stranded_pedestrians_count=8,
                flow_velocity_ms=2.1,
                ai_yolo_detections=[
                    ComputerVisionDetection(label="Yamuna Lowland Floodplain Inundation", confidence=0.95, bbox=[15, 25, 70, 45], hazard_severity="CRITICAL"),
                    ComputerVisionDetection(label="Ring Road Water Encroachment", confidence=0.91, bbox=[5, 60, 90, 30], hazard_severity="WARNING")
                ]
            ),
            # 5. Bengaluru Lake Spill
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
                status="SIMULATED_RECON_FEED",
                data_mode="modeled_benchmark_simulation",
                stream_source_type="SYNTHESIZED_SIMULATION_LOOP",
                flood_depth_detected_m=0.45,
                stalled_vehicles_count=8,
                stranded_pedestrians_count=3,
                flow_velocity_ms=0.9,
                ai_yolo_detections=[
                    ComputerVisionDetection(label="ORR Service Road Waterlogging", confidence=0.93, bbox=[22, 35, 55, 40], hazard_severity="WARNING"),
                    ComputerVisionDetection(label="Traffic Bottleneck / Stalled Vehicles", confidence=0.90, bbox=[10, 50, 40, 35], hazard_severity="WARNING")
                ]
            ),
            # 6. Chennai Coastal Storm Surge Cam
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
                status="SIMULATED_RECON_FEED",
                data_mode="modeled_benchmark_simulation",
                stream_source_type="SYNTHESIZED_SIMULATION_LOOP",
                flood_depth_detected_m=1.15,
                stalled_vehicles_count=1,
                stranded_pedestrians_count=2,
                flow_velocity_ms=3.4,
                ai_yolo_detections=[
                    ComputerVisionDetection(label="Storm Surge Overtopping (Simulated)", confidence=0.96, bbox=[5, 30, 90, 50], hazard_severity="CRITICAL"),
                    ComputerVisionDetection(label="Estuary Sluice Discharge Current", confidence=0.92, bbox=[30, 55, 40, 35], hazard_severity="CRITICAL")
                ]
            ),
            # 7. Assam Brahmaputra Aerial Recon Drone
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
                status="SIMULATED_RECON_FEED",
                data_mode="modeled_benchmark_simulation",
                stream_source_type="SYNTHESIZED_SIMULATION_LOOP",
                flood_depth_detected_m=1.45,
                stalled_vehicles_count=0,
                stranded_pedestrians_count=22,
                flow_velocity_ms=4.2,
                ai_yolo_detections=[
                    ComputerVisionDetection(label="Brahmaputra River Inundation Boundary", confidence=0.97, bbox=[10, 15, 80, 55], hazard_severity="CRITICAL"),
                    ComputerVisionDetection(label="River Bund Evacuee Cluster", confidence=0.94, bbox=[40, 60, 35, 25], hazard_severity="CRITICAL")
                ]
            ),
            # 8. Official IMD Doppler Weather Radar (Mumbai Colaba)
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
                status="LIVE_RADAR_STREAM",
                data_mode="live",
                stream_source_type="OFFICIAL_IMD_DOPPLER_RADAR",
                flood_depth_detected_m=0.42,
                stalled_vehicles_count=0,
                stranded_pedestrians_count=0,
                flow_velocity_ms=8.5,
                ai_yolo_detections=[
                    ComputerVisionDetection(label="Doppler Radar High Reflectivity Core (48 dBZ)", confidence=0.98, bbox=[10, 10, 80, 80], hazard_severity="CRITICAL"),
                    ComputerVisionDetection(label="Konkan Coast Cloud Cluster", confidence=0.93, bbox=[50, 20, 40, 60], hazard_severity="WARNING")
                ]
            ),
            # 9. Official IMD National All-India Radar Mosaic
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
                status="LIVE_RADAR_STREAM",
                data_mode="live",
                stream_source_type="OFFICIAL_IMD_DOPPLER_RADAR",
                flood_depth_detected_m=0.0,
                stalled_vehicles_count=0,
                stranded_pedestrians_count=0,
                flow_velocity_ms=12.4,
                ai_yolo_detections=[
                    ComputerVisionDetection(label="Pan-India Monsoon Trough Reflectivity", confidence=0.97, bbox=[20, 20, 60, 60], hazard_severity="WARNING"),
                    ComputerVisionDetection(label="Deep Convective Cloud Cell", confidence=0.95, bbox=[35, 45, 40, 30], hazard_severity="CRITICAL")
                ]
            ),
            # 10. Official IMD Delhi NCR Doppler Weather Radar
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
                status="LIVE_RADAR_STREAM",
                data_mode="live",
                stream_source_type="OFFICIAL_IMD_DOPPLER_RADAR",
                flood_depth_detected_m=0.55,
                stalled_vehicles_count=0,
                stranded_pedestrians_count=0,
                flow_velocity_ms=6.8,
                ai_yolo_detections=[
                    ComputerVisionDetection(label="NCR Radar Reflectivity Front (dBZ Contour Map)", confidence=0.96, bbox=[15, 15, 70, 70], hazard_severity="WARNING")
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
