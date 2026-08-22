import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class CitizenSOSReport(BaseModel):
    id: str
    timestamp: str
    citizen_name: str
    contact_number: str
    city_id: str
    location_name: str
    lat: float = 0.0
    lng: float = 0.0
    category: str  # "STRANDED_PERSONS" | "SUBMERGED_VEHICLE" | "MEDICAL_EMERGENCY" | "LEVEE_CRACK" | "POWER_LINE_DOWN"
    severity: str  # "CRITICAL" | "HIGH" | "MEDIUM"
    victim_count: int
    water_depth_reported_m: float
    description: str
    ai_verification_score: float  # 0.0 - 1.0 (confidence from metadata / photo)
    ai_detected_tags: List[str]
    status: str  # "UNRESOLVED" | "UNIT_DISPATCHED" | "RESOLVED"
    assigned_unit_id: Optional[str] = None

class CitizenSOSService:
    """
    Manages crowdsourced citizen distress reports (via WhatsApp / Telegram / Web SOS)
    with AI computer vision verification and automated NDRF unit dispatch recommendations.
    """

    def __init__(self):
        self.reports: List[CitizenSOSReport] = []
        self._seed_initial_sos_reports()

    def _seed_initial_sos_reports(self):
        now = datetime.datetime.now()
        
        sample_reports = [
            {
                "id": "SOS-IND-901",
                "offset_min": 18,
                "name": "Ramesh Patil",
                "phone": "+91 98201 44512",
                "city_id": "mumbai_monsoon",
                "location": "Kranti Nagar Riverbank (Kurla West)",
                "lat": 19.069,
                "lng": 72.876,
                "category": "STRANDED_PERSONS",
                "severity": "CRITICAL",
                "victim_count": 8,
                "water_depth": 0.85,
                "description": "8 family members including 2 elderly stuck on tin roof. Water entered ground floor up to chest level.",
                "ai_score": 0.96,
                "tags": ["Roof Stranded", "Elderly Present", "High Current Water"],
                "status": "UNRESOLVED"
            },
            {
                "id": "SOS-IND-902",
                "offset_min": 12,
                "name": "Anil Sharma",
                "phone": "+91 98112 33419",
                "city_id": "delhi_yamuna",
                "location": "Yamuna Khadar Lowland Jhuggi Cluster",
                "lat": 28.641,
                "lng": 77.261,
                "category": "MEDICAL_EMERGENCY",
                "severity": "CRITICAL",
                "victim_count": 3,
                "water_depth": 0.60,
                "description": "Pregnant woman in labor, roads submerged, ambulance cannot reach via main underpass.",
                "ai_score": 0.98,
                "tags": ["Medical Emergency", "Boat Required", "Infant Risk"],
                "status": "UNRESOLVED"
            },
            {
                "id": "SOS-IND-903",
                "offset_min": 8,
                "name": "Pooja Hegde",
                "phone": "+91 97405 66723",
                "city_id": "bengaluru_lakes",
                "location": "Outer Ring Road EcoSpace Underpass",
                "lat": 12.936,
                "lng": 77.682,
                "category": "SUBMERGED_VEHICLE",
                "severity": "HIGH",
                "victim_count": 4,
                "water_depth": 0.70,
                "description": "2 BMTC buses and 5 cars stalled in deep water near tech park exit. Water rising rapidly.",
                "ai_score": 0.92,
                "tags": ["Submerged Bus", "Traffic Choke", "Rapid Inflow"],
                "status": "UNRESOLVED"
            },
            {
                "id": "SOS-IND-904",
                "offset_min": 4,
                "name": "Biren Das",
                "phone": "+91 94350 11984",
                "city_id": "assam_brahmaputra",
                "location": "Pandu Ghat Ferry Approach",
                "lat": 26.148,
                "lng": 91.738,
                "category": "LEVEE_CRACK",
                "severity": "CRITICAL",
                "victim_count": 0,
                "water_depth": 1.10,
                "description": "Erosion visible along earthen embankment. River water seeping through sandbags towards settlement.",
                "ai_score": 0.94,
                "tags": ["Embankment Piping", "Sandbag Breach Risk", "High Velocity"],
                "status": "UNRESOLVED"
            }
        ]

        for rep in sample_reports:
            t = (now - datetime.timedelta(minutes=rep["offset_min"])).strftime("%Y-%m-%d %H:%M:%S IST")
            self.reports.append(CitizenSOSReport(
                id=rep["id"],
                timestamp=t,
                citizen_name=rep["name"],
                contact_number=rep["phone"],
                city_id=rep["city_id"],
                location_name=rep["location"],
                lat=rep["lat"],
                lng=rep["lng"],
                category=rep["category"],
                severity=rep["severity"],
                victim_count=rep["victim_count"],
                water_depth_reported_m=rep["water_depth"],
                description=rep["description"],
                ai_verification_score=rep["ai_score"],
                ai_detected_tags=rep["tags"],
                status=rep["status"]
            ))

    def get_all_reports(self, city_id: Optional[str] = None) -> List[CitizenSOSReport]:
        if city_id:
            return [r for r in self.reports if r.city_id == city_id]
        return self.reports

    def add_sos_report(
        self,
        citizen_name: str,
        contact_number: str,
        city_id: str,
        location_name: str,
        lat: float,
        lng: float,
        category: str,
        severity: str,
        victim_count: int,
        water_depth_m: float,
        description: str
    ) -> CitizenSOSReport:
        t = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
        new_id = f"SOS-IND-{len(self.reports)+905}"
        
        # Calculate AI verification score from completeness & depth
        ai_score = min(0.99, 0.85 + (0.1 if victim_count > 0 else 0.0) + (0.04 if lat != 0.0 else 0.0))
        tags = [category.replace("_", " ").title(), f"Depth: {water_depth_m:.2f}m"]
        if victim_count > 0:
            tags.append(f"{victim_count} Victims")

        report = CitizenSOSReport(
            id=new_id,
            timestamp=t,
            citizen_name=citizen_name,
            contact_number=contact_number,
            city_id=city_id,
            location_name=location_name,
            lat=lat,
            lng=lng,
            category=category,
            severity=severity,
            victim_count=victim_count,
            water_depth_reported_m=water_depth_m,
            description=description,
            ai_verification_score=ai_score,
            ai_detected_tags=tags,
            status="UNRESOLVED"
        )
        self.reports.insert(0, report)
        return report

    def update_status(self, sos_id: str, new_status: str, assigned_unit_id: Optional[str] = None) -> Optional[CitizenSOSReport]:
        for rep in self.reports:
            if rep.id == sos_id:
                rep.status = new_status
                if assigned_unit_id:
                    rep.assigned_unit_id = assigned_unit_id
                return rep
        return None

citizen_sos_service = CitizenSOSService()
