"""
Pan-India Micro-Catchment Synthesizer and District Geocoder.
Enables unique, geomorphologically realistic Digital Twin generation for all 786+ Indian Districts.
"""

import math
import hashlib
from datetime import datetime
from typing import Dict, Any, List, Optional, Tuple
from app.models.schemas import (
    CityDigitalTwinState,
    InfrastructureNode,
    NodeType,
    NodeStatus,
    RoadEdge,
    RoadStatus,
    SensorReading,
    SensorType,
    CascadeLink,
    EvacuationRoute,
    DispatchUnit,
    IncidentActionPlan
)
from app.data.all_indian_districts import ALL_INDIA_DISTRICTS

PAN_INDIA_DISTRICTS = ALL_INDIA_DISTRICTS

# Authentic landmark profiles for prominent Indian districts
AUTHENTIC_DISTRICT_PROFILES: Dict[str, Dict[str, Any]] = {
    "hyderabad": {
        "hosp1": "Gandhi Hospital & Apex Emergency Trauma Center",
        "hosp2": "Osmania General Hospital & Casualty ICU",
        "sub1": "220kV Gachibowli Extra High Voltage Substation",
        "sub2": "132kV Begumpet Central Grid Feeder",
        "pump": "Musi River & Hussain Sagar Floodgate Barrage",
        "shelter1": "Gachibowli Stadium Mega Evacuation Complex",
        "shelter2": "LB Stadium High-Ground Emergency Camp",
        "fire": "NDRF & TS Disaster Response Force (DRF) HQ",
        "bridge": "Puranapul Heritage River Bridge & Viaduct",
        "res1": "Moosarambagh Lowland Musi Riverfront Settlement",
        "res2": "Begumpet Subway & Shaikpet Underpass Choke Point",
        "roads": ["P.V. Narasimha Rao Elevated Expressway", "Outer Ring Road (ORR) Emergency Corridor", "Musi River Promenade Link", "Begumpet Airport Bypass"],
        "basin": "Musi River & Hussain Sagar Sluice Catchment"
    },
    "bengaluru": {
        "hosp1": "Victoria Hospital & Apex Trauma Institute",
        "hosp2": "Bowring & Lady Curzon Hospital Emergency ICU",
        "sub1": "220kV Peenya Major Industrial Substation",
        "sub2": "66kV HAL Airport Feeder Station",
        "pump": "Bellandur & Varthur Lake Stormwater Barrage",
        "shelter1": "Kanteerava Indoor Stadium Mega Relief Camp",
        "shelter2": "Bangalore University High-Ground Shelter",
        "fire": "NDRF 10th Battalion & Karnataka Fire HQ",
        "bridge": "Hebbal Flyover & Nagawara Viaduct",
        "res1": "Rainbow Drive & Ecospace Lowland IT Corridor",
        "res2": "Silk Board Junction & ORR Underpass Choke Point",
        "roads": ["Outer Ring Road (ORR) Arterial", "Hosur Road Elevated Highway", "Bellandur Lake Bypass", "Old Madras Road Corridor"],
        "basin": "Bellandur-Varthur & Dakshina Pinakini Basin"
    },
    "chennai": {
        "hosp1": "Rajiv Gandhi Government General Hospital (RGGGH) Trauma Center",
        "hosp2": "Stanley Medical College & Casualty ICU",
        "sub1": "230kV Taramani Substation & Power Grid",
        "sub2": "110kV Koyambedu Feeder Station",
        "pump": "Chembarambakkam & Chemmanchery Floodgate Barrage",
        "shelter1": "Jawaharlal Nehru Stadium Mega Relief Camp",
        "shelter2": "Anna University Elevated Sports Complex",
        "fire": "NDRF 4th Battalion & Tamil Nadu Fire Services HQ",
        "bridge": "Adyar Thiru Vi Ka River Bridge",
        "res1": "Velachery & Mudichur Lowland Residential Sector",
        "res2": "Ganesapuram & Vyasarpadi Subway Underpass Choke Point",
        "roads": ["Grand Southern Trunk (GST) Road", "Old Mahabalipuram Road (OMR) Expressway", "Kathipara Elevated Junction", "Inner Ring Road Corridor"],
        "basin": "Adyar, Cooum & Chembarambakkam Basin"
    },
    "mumbai": {
        "hosp1": "KEM Hospital & Apex Level-1 Trauma Center (Parel)",
        "hosp2": "Sion LTMG Hospital Emergency Trauma ICU",
        "sub1": "220kV Tata Power Dharavi Transmission Substation",
        "sub2": "110kV BKC International Financial Power Feeder",
        "pump": "Lovegrove & Britannia Stormwater Dewatering Pumping Plant",
        "shelter1": "Bandra Kurla Complex (BKC) Mega Relief Center",
        "shelter2": "Wankhede / National Sports Club High-Ground Shelter",
        "fire": "Mumbai Fire Brigade HQ & Disaster Cell (Byculla)",
        "bridge": "Bandra-Worli Sea Link & Mithi River Bridge",
        "res1": "Hindmata Dadar & Kurla Kranti Nagar Riverfront Lowland",
        "res2": "Milan Subway & Andheri Underpass Choke Point",
        "roads": ["Western Express Highway (WEH)", "Eastern Freeway Viaduct", "BKC Elevated Connector", "Swami Vivekananda Road Arterial"],
        "basin": "Mithi River & Arabian Sea Tidal Catchment"
    },
    "delhi": {
        "hosp1": "AIIMS Apex Trauma Center (New Delhi)",
        "hosp2": "Lok Nayak Jai Prakash (LNJP) Emergency Hospital",
        "sub1": "400kV Maharani Bagh Power Grid Substation",
        "sub2": "220kV IP Power Station Feeder",
        "pump": "ITO & Barapullah Drain Stormwater Pumping Barrage",
        "shelter1": "Indira Gandhi Indoor Stadium Mega Relief Camp",
        "shelter2": "Thyagaraj Sports Complex Elevated Shelter",
        "fire": "Delhi Fire Service HQ & NDRF 8th Battalion Post",
        "bridge": "Old Yamuna Bridge (Loha Pul) & Signature Bridge",
        "res1": "Yamuna Floodplain Lowland (Mayur Vihar / Yamuna Bazar)",
        "res2": "Minto Bridge & Pragati Maidan Underpass Choke Point",
        "roads": ["Mahatma Gandhi Ring Road", "Barapullah Elevated Corridor", "Vikas Marg Yamuna Arterial", "Mathura Road NH-19 Highway"],
        "basin": "Yamuna River & Najafgarh Drain Basin"
    },
    "varanasi": {
        "hosp1": "BHU Sir Sunderlal Hospital & Apex Trauma Center",
        "hosp2": "Pandit Deen Dayal Upadhyaya Civil Hospital ICU",
        "sub1": "220kV Shivpur Power Grid Transmission Substation",
        "sub2": "132kV Sarnath Regional Feeder",
        "pump": "Varuna River & Rajghat Floodgate Sluice Barrage",
        "shelter1": "Dr. Sampurnanand Sports Stadium Mega Shelter",
        "shelter2": "Banaras Hindu University Elevated Student Hall",
        "fire": "NDRF 11th Battalion HQ (Ghazipur Road Staging)",
        "bridge": "Malviya Bridge (Dufferin Bridge) over River Ganga",
        "res1": "Dashashwamedh & Assi Lowland Ghats Settlement",
        "res2": "Chowkaghat & Andhrapul Subway Choke Point",
        "roads": ["Varanasi Ring Road Phase-2", "Grand Trunk (GT) Road NH-19", "Cantonment Station Arterial", "Ganga Ghats Heritage Bypass"],
        "basin": "Ganga & Varuna River Confluence Basin"
    },
    "patna": {
        "hosp1": "AIIMS Patna Apex Emergency Trauma Center",
        "hosp2": "Patna Medical College & Hospital (PMCH) ICU",
        "sub1": "220kV Khagaul Power Transmission Substation",
        "sub2": "132kV Fatuha Power Grid Feeder",
        "pump": "Saidpur & Pahari Dewatering Pumping Plant",
        "shelter1": "Moin-ul-Haq Stadium Mega Evacuation Shelter",
        "shelter2": "Patna University High-Ground Campus Camp",
        "fire": "NDRF 9th Battalion Post & Bihar Fire Services HQ",
        "bridge": "Mahatma Gandhi Setu & Digha-Sonpur Bridge",
        "res1": "Rajendra Nagar & Kankarbagh Lowland Floodplain",
        "res2": "R-Block & GPO Subway Underpass Choke Point",
        "roads": ["Loknayak Ganga Path (Patna Marine Drive)", "Baily Road Expressway", "Patna-Gaya Highway NH-22", "Bypass Flyover Corridor"],
        "basin": "Ganga, Gandak & Son Triple Confluence Basin"
    },
    "kolkata": {
        "hosp1": "SSKM Hospital & IPGMER Apex Trauma Center",
        "hosp2": "Calcutta National Medical College Emergency ICU",
        "sub1": "220kV Kasba Grid Substation & CESC Control Hub",
        "sub2": "132kV Howrah Transmission Center",
        "pump": "Palmer Bazar & Dhapa Stormwater Pumping Barrage",
        "shelter1": "Salt Lake Stadium (Yuva Bharati Krirangan) Mega Camp",
        "shelter2": "Eden Gardens & Maidan High-Ground Relief Post",
        "fire": "West Bengal Fire & Emergency HQ (Free School St)",
        "bridge": "Howrah Bridge (Rabindra Setu) & Vidyasagar Setu",
        "res1": "Thanthania & Muktarambabu Lowland Settlement",
        "res2": "Ultadanga & Lake Gardens Underpass Choke Point",
        "roads": ["Eastern Metropolitan (EM) Bypass", "Maa Flyover Elevated Expressway", "Strand Road Riverside Arterial", "AJC Bose Road Flyover"],
        "basin": "Hooghly River & East Kolkata Wetlands Basin"
    }
}

class PanIndiaMicroCatchmentEngine:
    """
    Computes topographic elevation, river basin characteristics, and synthesizes
    a unique, non-uniform Digital Twin geometry tailored to every district in India.
    """

    @classmethod
    def calculate_elevation(cls, lat: float, lng: float) -> float:
        """Calculates elevation in meters ASL based on real geomorphological zones."""
        if lat > 29.5 or (lat > 25.5 and lng > 89.0):
            base = 650.0 + (lat - 29.5) * 280.0 + abs(lng - 77.0) * 45.0
            return round(min(base, 4200.0), 1)
        elif 24.0 <= lat <= 29.5 and 75.0 <= lng <= 89.0:
            dist_from_sea = (lat - 22.0) * 18.0 + (90.0 - lng) * 4.0
            return round(max(15.0, min(dist_from_sea, 220.0)), 1)
        elif lng < 75.5 and lat < 20.0:
            if lng < 73.2:
                return round(2.5 + (lat % 2.0) * 3.5, 1)
            else:
                return round(540.0 + (lat % 3.0) * 120.0, 1)
        else:
            return round(280.0 + math.sin(lat * 0.5) * 180.0 + math.cos(lng * 0.5) * 120.0, 1)

    @classmethod
    def _deterministic_hash(cls, key: str) -> float:
        """Returns a deterministic float between 0.0 and 1.0 based on sha256 hash."""
        h = hashlib.sha256(key.encode('utf-8')).hexdigest()
        return int(h[:8], 16) / 0xffffffff

    @classmethod
    def resolve_location(cls, query: str = "", lat: Optional[float] = None, lng: Optional[float] = None) -> CityDigitalTwinState:
        matched_district = None
        
        # 1. Direct coordinate lookup (closest district)
        if lat is not None and lng is not None:
            min_dist = float('inf')
            for d in ALL_INDIA_DISTRICTS:
                dist = math.sqrt((d["lat"] - lat)**2 + (d["lng"] - lng)**2)
                if dist < min_dist:
                    min_dist = dist
                    matched_district = d
            if min_dist > 1.2:
                matched_district = None

        # 2. Search by query
        if query and not matched_district:
            clean_q = query.lower().strip()
            # 2a. Exact match
            for d in ALL_INDIA_DISTRICTS:
                if clean_q == d["name"].lower() or clean_q == d["id"].lower():
                    matched_district = d
                    lat = d["lat"]
                    lng = d["lng"]
                    break
            # 2b. Whole word match
            if not matched_district:
                for d in ALL_INDIA_DISTRICTS:
                    words = [w.strip("(),.-") for w in d["name"].lower().split()]
                    if clean_q in words:
                        matched_district = d
                        lat = d["lat"]
                        lng = d["lng"]
                        break
            # 2c. Substring match
            if not matched_district:
                for d in ALL_INDIA_DISTRICTS:
                    if clean_q in d["name"].lower() or clean_q in d["state"].lower():
                        matched_district = d
                        lat = d["lat"]
                        lng = d["lng"]
                        break

        # Default fallback
        if lat is None or lng is None:
            if matched_district:
                lat = matched_district["lat"]
                lng = matched_district["lng"]
            else:
                lat, lng = 17.3850, 78.4867 # Hyderabad center

        lat = max(8.0, min(37.5, lat))
        lng = max(68.5, min(97.5, lng))

        loc_name = matched_district["name"] if matched_district else f"Zone [{lat:.4f}°N, {lng:.4f}°E]"
        state_name = matched_district["state"] if matched_district else "India Tactical Command"
        basin_name = matched_district["basin"] if matched_district else "Regional River Catchment"
        base_name = loc_name.split('(')[0].strip()

        # Check for pre-mapped authentic profile
        profile_key = None
        for k in AUTHENTIC_DISTRICT_PROFILES.keys():
            if k in base_name.lower() or k in loc_name.lower():
                profile_key = k
                break
        
        profile = AUTHENTIC_DISTRICT_PROFILES.get(profile_key) if profile_key else None

        # Deterministic generation seeds based on district identity
        seed_str = f"{loc_name}_{state_name}_{lat:.2f}_{lng:.2f}"
        s0 = cls._deterministic_hash(seed_str + "_angle")
        s1 = cls._deterministic_hash(seed_str + "_spread")
        s2 = cls._deterministic_hash(seed_str + "_rot")
        s3 = cls._deterministic_hash(seed_str + "_skew")

        base_elevation = cls.calculate_elevation(lat, lng)
        
        # Primary axis angle (e.g. river corridor or valley orientation: 0 to 2*pi)
        corridor_angle = s0 * 2.0 * math.pi
        spread_scale = 0.025 + s1 * 0.030 # Natural district radius span (2.5km to 5.5km)

        # Helper to project polar coordinates (r in scale units, theta in radians)
        def proj(r_norm: float, theta_offset: float) -> Tuple[float, float]:
            ang = corridor_angle + theta_offset
            # Elliptical aspect stretch (1.0 to 1.6 ratio)
            stretch = 1.0 + 0.5 * math.sin(s2 * 3.14)
            d_lat = r_norm * spread_scale * math.sin(ang) * stretch
            d_lng = r_norm * spread_scale * math.cos(ang)
            return round(lat + d_lat, 5), round(lng + d_lng, 5)

        # Generate 12 distinct positions for the district
        p_hosp1 = proj(0.75, 0.20)
        p_hosp2 = proj(0.85, 3.40)
        p_sub1  = proj(1.10, 1.45)
        p_sub2  = proj(0.95, 4.30)
        p_pump  = proj(0.50, 2.70)
        p_shelt1 = proj(1.30, 0.85)
        p_shelt2 = proj(1.25, 5.20)
        p_fire   = proj(0.40, 0.00)
        p_radar  = proj(1.40, 2.10)
        p_bridge = proj(0.35, 1.80)
        p_dam    = proj(1.05, 2.90)
        p_res1   = proj(0.65, 2.40)
        p_res2   = proj(0.55, 4.80)

        # Facility Names
        hosp1_name = profile["hosp1"] if profile else f"{base_name} Apex Level-1 Trauma Hospital"
        hosp2_name = profile["hosp2"] if profile else f"{base_name} District Civil Hospital & Emergency ICU"
        sub1_name  = profile["sub1"] if profile else f"{base_name} 220kV Extra High Voltage Substation"
        sub2_name  = profile["sub2"] if profile else f"{base_name} 66kV Local Grid Substation"
        pump_name  = profile["pump"] if profile else f"{basin_name.split('&')[0].strip()} Dewatering Pumping Barrage"
        shelt1_name = profile["shelter1"] if profile else f"{base_name} Mega Stadium Relief Complex"
        shelt2_name = profile["shelter2"] if profile else f"{base_name} High-Ground College Shelter"
        fire_name   = profile["fire"] if profile else f"NDRF & State Fire Rescue Post ({base_name})"
        radar_name  = f"IMD Doppler Weather Radar ({state_name})"
        bridge_name = profile["bridge"] if profile else f"{base_name} Arterial River Viaduct & Bridge"
        dam_name    = f"{basin_name.split('&')[0].strip()} Floodgate Barrage"
        res1_name   = profile["res1"] if profile else f"{base_name} Lowland Riverfront Settlement"
        res2_name   = profile["res2"] if profile else f"{base_name} Central Underpass & Subway Choke Point"

        # 1. 13 High-Fidelity Infrastructure Nodes
        nodes: List[InfrastructureNode] = [
            InfrastructureNode(
                id="node-hosp-1",
                name=hosp1_name,
                node_type=NodeType.HOSPITAL,
                lat=p_hosp1[0],
                lng=p_hosp1[1],
                elevation_m=base_elevation + 6.5,
                status=NodeStatus.OPERATIONAL,
                vulnerability_index=0.22,
                capacity_total=2400,
                capacity_used=1650,
                backup_power_hours=48.0,
                structural_integrity=1.0,
                population_density=3800
            ),
            InfrastructureNode(
                id="node-hosp-2",
                name=hosp2_name,
                node_type=NodeType.HOSPITAL,
                lat=p_hosp2[0],
                lng=p_hosp2[1],
                elevation_m=base_elevation - 0.4,
                status=NodeStatus.WARNING,
                vulnerability_index=0.76,
                capacity_total=1300,
                capacity_used=1180,
                backup_power_hours=20.0,
                backup_power_active=True,
                flood_depth_m=0.32,
                structural_integrity=0.91,
                population_density=2900
            ),
            InfrastructureNode(
                id="node-sub-1",
                name=sub1_name,
                node_type=NodeType.SUBSTATION,
                lat=p_sub1[0],
                lng=p_sub1[1],
                elevation_m=base_elevation + 2.4,
                status=NodeStatus.OPERATIONAL,
                vulnerability_index=0.68,
                capacity_total=450,
                capacity_used=370,
                backup_power_hours=72.0,
                flood_depth_m=0.08,
                structural_integrity=0.96
            ),
            InfrastructureNode(
                id="node-sub-2",
                name=sub2_name,
                node_type=NodeType.SUBSTATION,
                lat=p_sub2[0],
                lng=p_sub2[1],
                elevation_m=base_elevation - 0.9,
                status=NodeStatus.WARNING,
                vulnerability_index=0.86,
                capacity_total=190,
                capacity_used=170,
                flood_depth_m=0.58,
                structural_integrity=0.85
            ),
            InfrastructureNode(
                id="node-pump-1",
                name=pump_name,
                node_type=NodeType.WATER_TREATMENT,
                lat=p_pump[0],
                lng=p_pump[1],
                elevation_m=max(0.5, base_elevation - 2.2),
                status=NodeStatus.OPERATIONAL,
                details={"pumps": 12, "capacity_cumecs": 75, "discharge_basin": basin_name}
            ),
            InfrastructureNode(
                id="node-shelter-1",
                name=shelt1_name,
                node_type=NodeType.SHELTER,
                lat=p_shelt1[0],
                lng=p_shelt1[1],
                elevation_m=base_elevation + 12.0,
                status=NodeStatus.OPERATIONAL,
                capacity_total=9000,
                capacity_used=2200,
                population_density=2200
            ),
            InfrastructureNode(
                id="node-shelter-2",
                name=shelt2_name,
                node_type=NodeType.SHELTER,
                lat=p_shelt2[0],
                lng=p_shelt2[1],
                elevation_m=base_elevation + 15.0,
                status=NodeStatus.OPERATIONAL,
                capacity_total=4800,
                capacity_used=1100,
                population_density=1100
            ),
            InfrastructureNode(
                id="node-fire-1",
                name=fire_name,
                node_type=NodeType.FIRE_STATION,
                lat=p_fire[0],
                lng=p_fire[1],
                elevation_m=base_elevation + 5.0,
                status=NodeStatus.OPERATIONAL
            ),
            InfrastructureNode(
                id="node-radar-1",
                name=radar_name,
                node_type=NodeType.RESIDENTIAL_DISTRICT,
                lat=p_radar[0],
                lng=p_radar[1],
                elevation_m=base_elevation + 22.0,
                status=NodeStatus.OPERATIONAL,
                details={"radar_band": "S-Band Dual Polarimetric", "range_km": 500, "agency": "IMD"}
            ),
            InfrastructureNode(
                id="node-bridge-1",
                name=bridge_name,
                node_type=NodeType.BRIDGE,
                lat=p_bridge[0],
                lng=p_bridge[1],
                elevation_m=base_elevation + 3.8,
                status=NodeStatus.OPERATIONAL
            ),
            InfrastructureNode(
                id="node-dam-1",
                name=dam_name,
                node_type=NodeType.DAM_LEVEE,
                lat=p_dam[0],
                lng=p_dam[1],
                elevation_m=base_elevation + 1.8,
                status=NodeStatus.WARNING,
                vulnerability_index=0.88
            ),
            InfrastructureNode(
                id="node-res-1",
                name=res1_name,
                node_type=NodeType.RESIDENTIAL_DISTRICT,
                lat=p_res1[0],
                lng=p_res1[1],
                elevation_m=max(0.4, base_elevation - 2.6),
                status=NodeStatus.CRITICAL,
                flood_depth_m=0.88,
                population_density=17800
            ),
            InfrastructureNode(
                id="node-res-2",
                name=res2_name,
                node_type=NodeType.COMMERCIAL_DISTRICT,
                lat=p_res2[0],
                lng=p_res2[1],
                elevation_m=max(0.3, base_elevation - 3.4),
                status=NodeStatus.CRITICAL,
                flood_depth_m=1.35,
                population_density=12400
            )
        ]

        # 2. Road Network with Curved Coordinates following local terrain
        roads: List[RoadEdge] = [
            RoadEdge(
                id="road-1",
                from_node="node-fire-1",
                to_node="node-hosp-1",
                name=f"{base_name} Emergency Medical Corridor",
                coordinates=[[p_fire[1], p_fire[0]], [(p_fire[1]+p_hosp1[1])/2 + 0.002, (p_fire[0]+p_hosp1[0])/2 - 0.002], [p_hosp1[1], p_hosp1[0]]],
                length_km=3.6,
                elevation_m=base_elevation + 5.8,
                status=RoadStatus.CLEAR,
                flood_depth_m=0.0,
                is_evacuation_corridor=True
            ),
            RoadEdge(
                id="road-2",
                from_node="node-hosp-1",
                to_node="node-shelter-1",
                name=f"High-Speed Green Lane to Mega Shelter",
                coordinates=[[p_hosp1[1], p_hosp1[0]], [(p_hosp1[1]+p_shelt1[1])/2, (p_hosp1[0]+p_shelt1[0])/2 + 0.004], [p_shelt1[1], p_shelt1[0]]],
                length_km=4.8,
                elevation_m=base_elevation + 8.5,
                status=RoadStatus.CLEAR,
                flood_depth_m=0.0,
                is_evacuation_corridor=True
            ),
            RoadEdge(
                id="road-3",
                from_node="node-res-1",
                to_node="node-shelter-1",
                name=f"Lowland Flood Evacuation Highway",
                coordinates=[[p_res1[1], p_res1[0]], [(p_res1[1]+p_shelt1[1])/2 - 0.003, (p_res1[0]+p_shelt1[0])/2], [p_shelt1[1], p_shelt1[0]]],
                length_km=4.2,
                elevation_m=base_elevation + 3.2,
                status=RoadStatus.FLOODED_WARNING,
                flood_depth_m=0.48,
                is_evacuation_corridor=True
            ),
            RoadEdge(
                id="road-4",
                from_node="node-res-2",
                to_node="node-hosp-2",
                name=f"Underpass Arterial Link",
                coordinates=[[p_res2[1], p_res2[0]], [(p_res2[1]+p_hosp2[1])/2, (p_res2[0]+p_hosp2[0])/2 - 0.002], [p_hosp2[1], p_hosp2[0]]],
                length_km=2.9,
                elevation_m=base_elevation - 1.9,
                status=RoadStatus.IMPASSABLE,
                flood_depth_m=1.35,
                is_evacuation_corridor=False
            ),
            RoadEdge(
                id="road-5",
                from_node="node-pump-1",
                to_node="node-sub-1",
                name=f"Drainage Barrage to Power Substation Link",
                coordinates=[[p_pump[1], p_pump[0]], [(p_pump[1]+p_sub1[1])/2 + 0.003, (p_pump[0]+p_sub1[0])/2], [p_sub1[1], p_sub1[0]]],
                length_km=3.8,
                elevation_m=base_elevation - 0.2,
                status=RoadStatus.CLEAR,
                flood_depth_m=0.12,
                is_evacuation_corridor=False
            ),
            RoadEdge(
                id="road-6",
                from_node="node-hosp-2",
                to_node="node-shelter-2",
                name=f"South Civil Hospital Elevated Bypass",
                coordinates=[[p_hosp2[1], p_hosp2[0]], [(p_hosp2[1]+p_shelt2[1])/2 - 0.002, (p_hosp2[0]+p_shelt2[0])/2 + 0.003], [p_shelt2[1], p_shelt2[0]]],
                length_km=4.4,
                elevation_m=base_elevation + 7.0,
                status=RoadStatus.CLEAR,
                flood_depth_m=0.0,
                is_evacuation_corridor=True
            ),
            RoadEdge(
                id="road-7",
                from_node="node-fire-1",
                to_node="node-sub-1",
                name=f"Fire HQ to 220kV Grid Corridor",
                coordinates=[[p_fire[1], p_fire[0]], [(p_fire[1]+p_sub1[1])/2, (p_fire[0]+p_sub1[0])/2 - 0.003], [p_sub1[1], p_sub1[0]]],
                length_km=3.1,
                elevation_m=base_elevation + 4.0,
                status=RoadStatus.CLEAR,
                flood_depth_m=0.0,
                is_evacuation_corridor=False
            )
        ]

        # 3. Dynamic Sensors
        sensors: List[SensorReading] = [
            SensorReading(
                sensor_id="sens-rain-1",
                sensor_type=SensorType.WIND_WEATHER,
                name=f"{base_name} Automatic Weather & Rain Gauge",
                lat=p_hosp1[0] + 0.004,
                lng=p_hosp1[1] + 0.004,
                current_value=58.0 + (s1 * 20.0),
                unit="mm/h",
                threshold_warning=40.0,
                threshold_critical=65.0,
                status=NodeStatus.WARNING,
                trend="rising",
                history=[22.0, 34.0, 45.0, 52.0, 58.0 + (s1 * 20.0)]
            ),
            SensorReading(
                sensor_id="sens-water-1",
                sensor_type=SensorType.WATER_LEVEL_GAUGE,
                name=f"{basin_name.split('&')[0].strip()} River Gauge Mark",
                lat=p_res1[0] + 0.002,
                lng=p_res1[1] - 0.002,
                current_value=3.65,
                unit="m",
                threshold_warning=2.5,
                threshold_critical=3.2,
                status=NodeStatus.CRITICAL,
                trend="rising",
                history=[1.4, 2.0, 2.6, 3.2, 3.65]
            ),
            SensorReading(
                sensor_id="sens-flow-1",
                sensor_type=SensorType.STORM_DRAIN_FLOW,
                name=f"Barrage Sluice Spillway Sensor",
                lat=p_dam[0],
                lng=p_dam[1],
                current_value=1620.0 + (s2 * 400.0),
                unit="cumecs",
                threshold_warning=1000.0,
                threshold_critical=1500.0,
                status=NodeStatus.CRITICAL,
                trend="rising",
                history=[700.0, 950.0, 1200.0, 1450.0, 1620.0 + (s2 * 400.0)]
            ),
            SensorReading(
                sensor_id="sens-drain-1",
                sensor_type=SensorType.STORM_DRAIN_FLOW,
                name="Gravity Outfall Drain Velocity",
                lat=p_pump[0],
                lng=p_pump[1],
                current_value=3.2,
                unit="m/s",
                threshold_warning=1.2,
                threshold_critical=0.5,
                status=NodeStatus.OPERATIONAL,
                trend="stable",
                history=[2.8, 2.9, 3.0, 3.1, 3.2]
            )
        ]

        # 4. 8 Active Moving Dispatch Units with Unique Patrol Coordinates
        dispatch_units: List[DispatchUnit] = [
            DispatchUnit(
                unit_id="unit-amb-1",
                callsign="🚑 108 ALS Ambulance Alpha",
                unit_type="ems_ambulance",
                agency="108 Emergency Medical Services",
                lat=(p_fire[0] + p_hosp1[0]) / 2,
                lng=(p_fire[1] + p_hosp1[1]) / 2,
                status="en_route",
                assigned_mission=f"Trauma response to {hosp1_name}",
                path_progress=0.52
            ),
            DispatchUnit(
                unit_id="unit-amb-2",
                callsign="🚑 108 Mobile Triage Beta",
                unit_type="ems_ambulance",
                agency="108 Emergency Medical Services",
                lat=p_hosp2[0] + 0.002,
                lng=p_hosp2[1] + 0.002,
                status="standby",
                assigned_mission=f"Staged at {hosp2_name}",
                path_progress=0.0
            ),
            DispatchUnit(
                unit_id="unit-raft-1",
                callsign="🚤 NDRF Gemini Deep Raft 01",
                unit_type="high_water_rescue",
                agency="National Disaster Response Force (NDRF)",
                lat=(p_dam[0] + p_res1[0]) / 2,
                lng=(p_dam[1] + p_res1[1]) / 2,
                status="en_route",
                assigned_mission=f"Conducting swift-water boat rescue in {res1_name}",
                path_progress=0.68
            ),
            DispatchUnit(
                unit_id="unit-raft-2",
                callsign="🚤 NDRF Heavy Inflatable Raft 02",
                unit_type="high_water_rescue",
                agency="National Disaster Response Force (NDRF)",
                lat=p_fire[0] + 0.003,
                lng=p_fire[1] - 0.003,
                status="standby",
                assigned_mission="Tactical reserve at NDRF Fire Staging Post",
                path_progress=0.0
            ),
            DispatchUnit(
                unit_id="unit-fire-1",
                callsign="🚒 Fire Water Tender 01",
                unit_type="fire_engine",
                agency="State Fire & Emergency Services",
                lat=(p_fire[0] + p_sub1[0]) / 2,
                lng=(p_fire[1] + p_sub1[1]) / 2,
                status="en_route",
                assigned_mission=f"Perimeter flood pumping at {sub1_name}",
                path_progress=0.48
            ),
            DispatchUnit(
                unit_id="unit-fire-2",
                callsign="🚒 Fire Hazmat Rescue 02",
                unit_type="fire_engine",
                agency="State Fire & Emergency Services",
                lat=p_fire[0] - 0.002,
                lng=p_fire[1] + 0.004,
                status="standby",
                assigned_mission="Standby in Central Disaster Logistics Yard",
                path_progress=0.0
            ),
            DispatchUnit(
                unit_id="unit-police-1",
                callsign="🚔 Police Traffic Interceptor",
                unit_type="traffic_control",
                agency="State Traffic Police & SDMA",
                lat=p_bridge[0],
                lng=p_bridge[1],
                status="on_scene",
                assigned_mission=f"Barricading inundated {res2_name}",
                path_progress=1.0
            ),
            DispatchUnit(
                unit_id="unit-pump-1",
                callsign="🚛 High-Volume Pump Truck P-04",
                unit_type="public_works_pump",
                agency="Municipal Disaster Management Cell",
                lat=p_res2[0],
                lng=p_res2[1],
                status="on_scene",
                assigned_mission=f"Dewatering flooded underpass and stormwater sump",
                path_progress=1.0
            )
        ]

        # 5. Evacuation Routes
        evacuation_routes: List[EvacuationRoute] = [
            EvacuationRoute(
                route_id="evac-1",
                source_node_id="node-res-1",
                source_name=res1_name,
                target_shelter_id="node-shelter-1",
                target_shelter_name=shelt1_name,
                coordinates=[
                    [p_res1[1], p_res1[0]],
                    [(p_res1[1]+p_shelt1[1])/2 - 0.004, (p_res1[0]+p_shelt1[0])/2 + 0.003],
                    [p_shelt1[1], p_shelt1[0]]
                ],
                distance_km=4.8,
                estimated_time_min=16.0,
                safety_score=0.91,
                status="optimal",
                assigned_evacuees=1650,
                choke_points=["Lowland Approach Flyover"]
            ),
            EvacuationRoute(
                route_id="evac-2",
                source_node_id="node-res-2",
                source_name=res2_name,
                target_shelter_id="node-shelter-2",
                target_shelter_name=shelt2_name,
                coordinates=[
                    [p_res2[1], p_res2[0]],
                    [(p_res2[1]+p_shelt2[1])/2 + 0.003, (p_res2[0]+p_shelt2[0])/2 - 0.002],
                    [p_shelt2[1], p_shelt2[0]]
                ],
                distance_km=4.1,
                estimated_time_min=14.0,
                safety_score=0.95,
                status="optimal",
                assigned_evacuees=1120,
                choke_points=["Elevated Ring Road Junction"]
            )
        ]

        # 6. Cascade Failure Links
        cascade_links: List[CascadeLink] = [
            CascadeLink(
                id="casc-1",
                source_id="node-res-2",
                target_id="node-sub-2",
                trigger_type="flood_submergence",
                severity="critical",
                time_offset_min=15,
                description=f"Stormwater backflow at {res2_name} threatening {sub2_name} feeder lines.",
                cascade_level=1
            ),
            CascadeLink(
                id="casc-2",
                source_id="node-sub-2",
                target_id="node-hosp-2",
                trigger_type="power_loss",
                severity="disaster",
                time_offset_min=30,
                description=f"Grid trip at {sub2_name} activating backup diesel generators at {hosp2_name}.",
                cascade_level=2
            )
        ]

        # 7. Incident Action Plan
        iap = IncidentActionPlan(
            iap_id=f"IAP-{base_name.replace(' ', '-').upper()}-01",
            incident_name=f"{base_name} Multi-Hazard Monsoon & Micro-Catchment Emergency",
            operational_period="0800 - 2000 IST (Level 2/3 District Response)",
            overall_threat_level="CRITICAL",
            incident_commander_summary=f"Heavy localized precipitation over {basin_name}. Multi-agency strike units mobilized for {base_name} district.",
            strategic_objectives=[
                f"Deploy NDRF Inflatable Rafts to evacuate low-lying settlements along {basin_name}.",
                f"Reinforce perimeter flood barrier berms at {sub1_name}.",
                f"Maintain unflooded green corridors from {hosp1_name} to {shelt1_name}.",
                f"Operate {pump_name} at maximum discharge capacity (75 cumecs)."
            ],
            agency_tasks={
                "NDRF_Battalion": [f"Conduct boat rescue sweeps in {res1_name}", "Deploy 2 Gemini rafts to low-lying riverbank"],
                "State_Police": [f"Barricade inundated {res2_name}", f"Secure green lane between {hosp1_name} and relief camps"],
                "Health_108_EMS": [f"Prepare ICU surge at {hosp1_name}", "Dispatch Mobile Triage Unit Beta"],
                "Municipal_Works": [f"Deploy High-Volume Dewatering Pump P-04 to {res2_name}", "Inspect barrage sluice gate clearances"]
            },
            active_evacuation_zones=[f"{base_name} Lowland Riverfront Sector", f"{base_name} City Underpass Floodplain"],
            allocated_resources={
                "NDRF_Inflatable_Boats": 4,
                "ALS_Ambulances": 8,
                "Heavy_Fire_Tenders": 6,
                "Mobile_Dewatering_Pumps": 14,
                "Tactical_Drones": 4
            },
            public_emergency_alert=f"CIVICTWIN ALERT: Flash flood warning in {base_name} along {basin_name}. Evacuate low-lying riverfront sectors to designated {shelt1_name}.",
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
        )

        return CityDigitalTwinState(
            city_id=f"pan_india_{lat:.2f}_{lng:.2f}",
            city_name=loc_name,
            center_coords=[lat, lng],
            bounding_box=[lat - spread_scale * 1.8, lng - spread_scale * 1.8, lat + spread_scale * 1.8, lng + spread_scale * 1.8],
            timeline_hour=3.5,
            rain_intensity_mmhr=58.0 + (s1 * 20.0),
            storm_surge_m=0.85 + (s2 * 0.4),
            wind_speed_kmh=42.0 + (s3 * 15.0),
            wind_direction_deg=round(corridor_angle * 180.0 / math.pi, 1),
            levee_breached=False,
            substation_tripped=False,
            nodes=nodes,
            roads=roads,
            sensors=sensors,
            cascade_links=cascade_links,
            evacuation_routes=evacuation_routes,
            dispatch_units=dispatch_units,
            iap=iap,
            metrics={
                "total_population_at_risk": int(24000 + s0 * 15000),
                "power_grid_health": round(80.0 + s1 * 15.0, 1),
                "hospital_bed_occupancy_pct": round(72.0 + s2 * 18.0, 1),
                "active_flood_hotspots": int(2 + s3 * 3),
                "elevation_base_m": base_elevation,
                "river_basin": basin_name,
                "state": state_name
            }
        )

pan_india_engine = PanIndiaMicroCatchmentEngine()
