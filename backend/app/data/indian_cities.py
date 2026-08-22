from typing import List, Dict, Any
from app.models.schemas import (
    CityDigitalTwinState, InfrastructureNode, RoadEdge, SensorReading,
    DispatchUnit, NodeType, NodeStatus, RoadStatus, SensorType, IncidentActionPlan
)
from app.simulation.hydrology import HydrologySimulationEngine
from app.simulation.cascade import CascadeFailureEngine
from app.simulation.routing import DynamicEvacuationRouter
from app.ai.incident_commander import AIIncidentCommander

def get_available_indian_cities():
    return [
        {
            "id": "mumbai_monsoon",
            "name": "Maharashtra: Mumbai Mithi Basin & Western Coastal Corridor",
            "region": "West India",
            "state": "Maharashtra",
            "hazard_profile": "Monsoon High Tide, Mithi River Overflow & Dadar Hindmata Submergence",
            "lat": 19.040,
            "lng": 72.850,
            "ndrf_unit": "NDRF 5th Battalion (Pune/Mumbai)"
        },
        {
            "id": "delhi_yamuna",
            "name": "Delhi NCR: Yamuna River Floodplain & Ring Road Breach",
            "region": "North India",
            "state": "Delhi NCR",
            "hazard_profile": "Hathnikund Barrage Discharge, ITO & Kashmere Gate Submergence",
            "lat": 28.640,
            "lng": 77.230,
            "ndrf_unit": "NDRF 8th Battalion (Ghaziabad/NCR)"
        },
        {
            "id": "bengaluru_lakes",
            "name": "Karnataka: Bengaluru Bellandur Lake Corridor & Outer Ring Road",
            "region": "South India",
            "state": "Karnataka",
            "hazard_profile": "Bellandur-Varthur Lake Breach & Marathahalli IT Corridor Flooding",
            "lat": 12.950,
            "lng": 77.670,
            "ndrf_unit": "NDRF 10th Battalion (South Staging)"
        },
        {
            "id": "chennai_cyclone",
            "name": "Tamil Nadu: Chennai Coastal Storm Surge & Adyar River",
            "region": "South India",
            "state": "Tamil Nadu",
            "hazard_profile": "Bay of Bengal Cyclone Storm Surge & Chembarambakkam Sluice Discharge",
            "lat": 13.040,
            "lng": 80.250,
            "ndrf_unit": "NDRF 4th Battalion (Arakkonam)"
        },
        {
            "id": "kolkata_hooghly",
            "name": "West Bengal: Kolkata Hooghly Tidal Surge & Sundarbans",
            "region": "East India",
            "state": "West Bengal",
            "hazard_profile": "Bay of Bengal Cyclone Surge, Hooghly Tidal Bore & Strand Road Inundation",
            "lat": 22.560,
            "lng": 88.350,
            "ndrf_unit": "NDRF 2nd Battalion (Haringhata/Kolkata)"
        },
        {
            "id": "assam_brahmaputra",
            "name": "Assam: Guwahati & Brahmaputra River Basin Flooding",
            "region": "North-East India",
            "state": "Assam",
            "hazard_profile": "Brahmaputra Severe Inundation, Pandu Port Submergence & Flash Floods",
            "lat": 26.140,
            "lng": 91.740,
            "ndrf_unit": "NDRF 1st Battalion (Guwahati)"
        },
        {
            "id": "odisha_mahanadi",
            "name": "Odisha: Bhubaneswar-Cuttack Mahanadi Delta",
            "region": "East India",
            "state": "Odisha",
            "hazard_profile": "Mahanadi Hirakud Release, Kathajodi Embankment Surge",
            "lat": 20.320,
            "lng": 85.850,
            "ndrf_unit": "NDRF 3rd Battalion (Mundali/Cuttack)"
        },
        {
            "id": "kerala_periyar",
            "name": "Kerala: Kochi & Periyar River Idukki Dam Sluice Surge",
            "region": "South India",
            "state": "Kerala",
            "hazard_profile": "Western Ghats Intense Cloudburst, Idukki Sluice Discharge & Aluva Flooding",
            "lat": 10.020,
            "lng": 76.310,
            "ndrf_unit": "NDRF 4th Battalion Swift Water Team"
        },
        {
            "id": "gujarat_tapi",
            "name": "Gujarat: Surat Tapi River & Ukai Dam Surge",
            "region": "West India",
            "state": "Gujarat",
            "hazard_profile": "Ukai Dam Discharge & Arabian Sea High Tide Confluence",
            "lat": 21.180,
            "lng": 72.830,
            "ndrf_unit": "NDRF 6th Battalion (Vadodara)"
        },
        {
            "id": "bihar_kosi",
            "name": "Bihar: Patna Ganga & Kosi River Inundation",
            "region": "Central/North India",
            "state": "Bihar",
            "hazard_profile": "Kosi River Embankment Pressure & Ganga Catchment Backwater",
            "lat": 25.610,
            "lng": 85.140,
            "ndrf_unit": "NDRF 9th Battalion (Bihta/Patna)"
        },
        {
            "id": "uttar_pradesh_ganga",
            "name": "Uttar Pradesh: Varanasi & Prayagraj Ganga Basin",
            "region": "North India",
            "state": "Uttar Pradesh",
            "hazard_profile": "Ganga & Yamuna Sangam Rising Water & Ghat Submergence",
            "lat": 25.310,
            "lng": 83.000,
            "ndrf_unit": "NDRF 11th Battalion (Varanasi)"
        },
        {
            "id": "uttarakhand_cloudburst",
            "name": "Uttarakhand: Rishikesh & Chamoli Himalayan Flash Flood",
            "region": "North India",
            "state": "Uttarakhand",
            "hazard_profile": "Himalayan Cloudburst, Alaknanda Glacial Surge & Highway Landslides",
            "lat": 30.090,
            "lng": 78.290,
            "ndrf_unit": "NDRF 8th Battalion Mountain Team"
        },
        {
            "id": "himachal_beas",
            "name": "Himachal Pradesh: Kullu & Beas River Torrential Surge",
            "region": "North India",
            "state": "Himachal Pradesh",
            "hazard_profile": "Beas River Embankment Breach & Mountain Valley Flash Flooding",
            "lat": 31.960,
            "lng": 77.110,
            "ndrf_unit": "NDRF 7th Battalion Hill Rescue"
        },
        {
            "id": "punjab_sutlej",
            "name": "Punjab: Ludhiana & Sutlej Floodplain Surge",
            "region": "North India",
            "state": "Punjab",
            "hazard_profile": "Bhakra Nangal Sluice Discharge & Sutlej Agricultural Submergence",
            "lat": 30.910,
            "lng": 75.850,
            "ndrf_unit": "NDRF 7th Battalion (Bhatinda)"
        },
        {
            "id": "andhra_krishna",
            "name": "Andhra Pradesh: Vijayawada Krishna River Prakasam Barrage",
            "region": "South India",
            "state": "Andhra Pradesh",
            "hazard_profile": "Prakasam Barrage Maximum Discharge & Krishna Delta Backwater",
            "lat": 16.510,
            "lng": 80.620,
            "ndrf_unit": "NDRF 10th Battalion (Guntur)"
        },
        {
            "id": "telangana_musi",
            "name": "Telangana: Hyderabad Musi River & Hussain Sagar Overflow",
            "region": "South India",
            "state": "Telangana",
            "hazard_profile": "Osman Sagar & Himayat Sagar Sluice Discharge into Musi Basin",
            "lat": 17.390,
            "lng": 78.480,
            "ndrf_unit": "NDRF 10th Battalion Staging"
        },
        {
            "id": "rajasthan_luni",
            "name": "Rajasthan: Jodhpur & Luni River Flash Flood Basin",
            "region": "West India",
            "state": "Rajasthan",
            "hazard_profile": "Desert Cloudburst & Luni Ephemeral River High-Velocity Inundation",
            "lat": 26.250,
            "lng": 73.020,
            "ndrf_unit": "NDRF 6th Battalion Rapid Wing"
        },
        {
            "id": "madhya_pradesh_narmada",
            "name": "Madhya Pradesh: Jabalpur Narmada Bargi Dam Surge",
            "region": "Central India",
            "state": "Madhya Pradesh",
            "hazard_profile": "Bargi Dam 21-Gate Sluice Release & Narmada River Gorge Overflow",
            "lat": 23.180,
            "lng": 79.980,
            "ndrf_unit": "NDRF 11th Battalion Staging"
        },
        {
            "id": "jammu_jhelum",
            "name": "Jammu & Kashmir: Srinagar Jhelum River Valley Basin",
            "region": "North India",
            "state": "Jammu & Kashmir",
            "hazard_profile": "Jhelum River Gauge Above Danger Mark & Dal Lake Sluice Saturation",
            "lat": 34.080,
            "lng": 74.800,
            "ndrf_unit": "NDRF 7th Battalion (Srinagar Base)"
        },
        {
            "id": "goa_mandovi",
            "name": "Goa: Panaji Mandovi Coastal Estuary Tidal Surge",
            "region": "West India",
            "state": "Goa",
            "hazard_profile": "Arabian Sea High Tide & Western Ghats Zuari-Mandovi Confluence",
            "lat": 15.500,
            "lng": 73.830,
            "ndrf_unit": "NDRF 5th Battalion Marine Team"
        },
        {
            "id": "sikkim_teesta",
            "name": "Sikkim: Teesta River Basin & Glacial Lake GLOF Surge",
            "region": "North-East India",
            "state": "Sikkim",
            "hazard_profile": "South Lhonak Glacial Lake Outburst (GLOF) & Teesta Gorge Flash Surge",
            "lat": 27.330,
            "lng": 88.610,
            "ndrf_unit": "NDRF 2nd Battalion Mountain Wing"
        },
        {
            "id": "tripura_howrah",
            "name": "Tripura: Agartala & Howrah River Inundation",
            "region": "North-East India",
            "state": "Tripura",
            "hazard_profile": "Howrah River Flash Flood & International Border Lowland Inflow",
            "lat": 23.830,
            "lng": 91.280,
            "ndrf_unit": "NDRF 1st Battalion Staging"
        },
        {
            "id": "meghalaya_cherrapunji",
            "name": "Meghalaya: Cherrapunji & Shillong Torrential Cloudburst",
            "region": "North-East India",
            "state": "Meghalaya",
            "hazard_profile": "Record High Precipitation Velocity & Khasi Hills Flash Inundation",
            "lat": 25.270,
            "lng": 91.730,
            "ndrf_unit": "NDRF 1st Battalion Hill Rescue"
        },
        {
            "id": "manipur_imphal",
            "name": "Manipur: Imphal River & Loktak Lake Spillway",
            "region": "North-East India",
            "state": "Manipur",
            "hazard_profile": "Nambul & Imphal River Embankment Breach & Loktak Basin Surge",
            "lat": 24.810,
            "lng": 93.930,
            "ndrf_unit": "NDRF 1st Battalion Rapid Team"
        },
        {
            "id": "jharkhand_subarnarekha",
            "name": "Jharkhand: Ranchi & Subarnarekha River Dam Discharge",
            "region": "East India",
            "state": "Jharkhand",
            "hazard_profile": "Getalsud Dam Maximum Sluice Release & Industrial Corridor Risk",
            "lat": 23.340,
            "lng": 85.300,
            "ndrf_unit": "NDRF 9th Battalion (Ranchi)"
        },
        {
            "id": "chhattisgarh_mahanadi",
            "name": "Chhattisgarh: Raipur & Hasdeo Bango Dam Surge",
            "region": "Central India",
            "state": "Chhattisgarh",
            "hazard_profile": "Hasdeo Bango Release & Mahanadi Upstream Catchment Swell",
            "lat": 21.250,
            "lng": 81.630,
            "ndrf_unit": "NDRF 3rd Battalion Central Wing"
        },
        {
            "id": "haryana_gurugram",
            "name": "Haryana: Gurugram & Najafgarh Drain Choke Point",
            "region": "North India",
            "state": "Haryana",
            "hazard_profile": "Hero Honda Chowk & Subhash Chowk Underpass Major Submergence",
            "lat": 28.450,
            "lng": 77.020,
            "ndrf_unit": "NDRF 8th Battalion NCR Strike Team"
        },
        {
            "id": "andaman_portblair",
            "name": "Andaman & Nicobar: Port Blair Coastal Cyclone & Tsunami Risk",
            "region": "Islands",
            "state": "Andaman & Nicobar",
            "hazard_profile": "Deep Bay of Bengal Cyclonic Depression & Island Coastal Inundation",
            "lat": 11.620,
            "lng": 92.720,
            "ndrf_unit": "NDRF Island Marine Rescue Wing"
        },
        {
            "id": "ladakh_indus",
            "name": "Ladakh: Leh Indus River & Glacial Flash Flooding",
            "region": "North India",
            "state": "Ladakh",
            "hazard_profile": "High-Altitude Glacial Stream Cloudburst & Valley Debris Torrent",
            "lat": 34.150,
            "lng": 77.570,
            "ndrf_unit": "NDRF High-Altitude Disaster Response Base"
        }
    ]

def _build_mumbai_scenario() -> Dict[str, Any]:
    """Exact real-world topography & satellite radar stations for Mumbai"""
    nodes = [
        InfrastructureNode(id="node-hosp-1", name="KEM Hospital & Apex Trauma Center (Parel)", node_type=NodeType.HOSPITAL, lat=19.002, lng=72.842, elevation_m=9.2, status=NodeStatus.OPERATIONAL, vulnerability_index=0.35, capacity_total=2400, capacity_used=1800, backup_power_hours=48.0),
        InfrastructureNode(id="node-hosp-2", name="Lokmanya Tilak Municipal General Hospital (Sion)", node_type=NodeType.HOSPITAL, lat=19.037, lng=72.860, elevation_m=2.8, status=NodeStatus.WARNING, vulnerability_index=0.92, capacity_total=1800, capacity_used=1650, backup_power_hours=18.0),
        InfrastructureNode(id="node-radar-1", name="IMD Colaba Doppler Weather Radar & Ground Station", node_type=NodeType.RESIDENTIAL_DISTRICT, lat=18.906, lng=72.815, elevation_m=14.5, status=NodeStatus.OPERATIONAL, details={"radar_model": "DWR S-Band Max 500km", "agency": "IMD"}),
        InfrastructureNode(id="node-shelter-1", name="BKC MMRDA Grounds (Primary Mega Shelter)", node_type=NodeType.SHELTER, lat=19.066, lng=72.868, elevation_m=12.0, status=NodeStatus.OPERATIONAL, capacity_total=9000, capacity_used=1500),
        InfrastructureNode(id="node-shelter-2", name="Bandra YMCA High-Ground Relief Complex", node_type=NodeType.SHELTER, lat=19.056, lng=72.836, elevation_m=18.5, status=NodeStatus.OPERATIONAL, capacity_total=4500, capacity_used=800),
        InfrastructureNode(id="node-sub-alpha", name="Tata Power Dharavi 220kV Receiving Station", node_type=NodeType.SUBSTATION, lat=19.047, lng=72.853, elevation_m=3.1, status=NodeStatus.OPERATIONAL, vulnerability_index=0.88, capacity_total=450, capacity_used=390),
        InfrastructureNode(id="node-water-1", name="Love Grove Worli Stormwater Pumping Barrage", node_type=NodeType.WATER_TREATMENT, lat=19.006, lng=72.818, elevation_m=2.2, status=NodeStatus.OPERATIONAL, details={"pumps": 10, "capacity_cumecs": 60}),
        InfrastructureNode(id="node-bridge-1", name="Bandra-Worli Sea Link (Coastal Highway)", node_type=NodeType.BRIDGE, lat=19.036, lng=72.817, elevation_m=15.0, status=NodeStatus.OPERATIONAL),
        InfrastructureNode(id="node-levee-1", name="Mithi River Mahim Creek Floodgates", node_type=NodeType.DAM_LEVEE, lat=19.043, lng=72.842, elevation_m=3.8, status=NodeStatus.OPERATIONAL, vulnerability_index=0.91),
        InfrastructureNode(id="node-fire-1", name="NDRF 5th Battalion Swift Water Base (Andheri)", node_type=NodeType.FIRE_STATION, lat=19.118, lng=72.847, elevation_m=16.0, status=NodeStatus.OPERATIONAL),
        InfrastructureNode(id="node-res-1", name="Kurla West Kranti Nagar Riverfront Settlement", node_type=NodeType.RESIDENTIAL_DISTRICT, lat=19.068, lng=72.875, elevation_m=2.1, status=NodeStatus.CRITICAL, population_density=16500),
        InfrastructureNode(id="node-res-2", name="Hindmata Lowland Subway Underpass (Dadar)", node_type=NodeType.COMMERCIAL_DISTRICT, lat=19.019, lng=72.846, elevation_m=1.9, status=NodeStatus.CRITICAL, population_density=11200)
    ]

    roads = [
        RoadEdge(id="road-1", from_node="node-res-1", to_node="node-sub-alpha", name="LBS Marg River Corridor", coordinates=[[72.875, 19.068], [72.862, 19.055], [72.853, 19.047]], length_km=2.9, elevation_m=2.4, max_speed_kmh=40.0, status=RoadStatus.CLEAR),
        RoadEdge(id="road-2", from_node="node-res-2", to_node="node-hosp-1", name="Dr. Ambedkar Road Arterial", coordinates=[[72.846, 19.019], [72.844, 19.010], [72.842, 19.002]], length_km=2.1, elevation_m=2.5, max_speed_kmh=45.0, status=RoadStatus.CLEAR),
        RoadEdge(id="road-3", from_node="node-sub-alpha", to_node="node-shelter-1", name="BKC Connector Highway (Green Corridor)", coordinates=[[72.853, 19.047], [72.859, 19.058], [72.868, 19.066]], length_km=3.2, elevation_m=8.5, max_speed_kmh=65.0, is_evacuation_corridor=True, status=RoadStatus.CLEAR),
        RoadEdge(id="road-4", from_node="node-bridge-1", to_node="node-shelter-2", name="Western Express Highway Evacuation Route", coordinates=[[72.817, 19.036], [72.828, 19.048], [72.836, 19.056]], length_km=4.1, elevation_m=12.0, max_speed_kmh=70.0, is_evacuation_corridor=True, status=RoadStatus.CLEAR),
        RoadEdge(id="road-5", from_node="node-fire-1", to_node="node-res-1", name="Western Expressway NDRF Rapid Deploy", coordinates=[[72.847, 19.118], [72.860, 19.090], [72.875, 19.068]], length_km=6.8, elevation_m=11.0, max_speed_kmh=60.0, status=RoadStatus.CLEAR)
    ]

    sensors = [
        SensorReading(sensor_id="sensor-mithi-1", sensor_type=SensorType.WATER_LEVEL_GAUGE, name="Mithi River Kranti Nagar CWC Gauge", lat=19.068, lng=72.875, current_value=2.85, unit="m", threshold_warning=2.5, threshold_critical=3.8, status=NodeStatus.WARNING, trend="rising", history=[1.8, 2.1, 2.4, 2.65, 2.85]),
        SensorReading(sensor_id="sensor-hindmata-1", sensor_type=SensorType.WATER_LEVEL_GAUGE, name="Hindmata Subway Underpass Sensor", lat=19.019, lng=72.846, current_value=0.58, unit="m", threshold_warning=0.3, threshold_critical=0.7, status=NodeStatus.CRITICAL, trend="rising", history=[0.15, 0.28, 0.40, 0.50, 0.58]),
        SensorReading(sensor_id="sensor-worli-drain", sensor_type=SensorType.STORM_DRAIN_FLOW, name="Worli Love Grove Stormwater Discharge", lat=19.006, lng=72.818, current_value=78.0, unit="%", threshold_warning=70.0, threshold_critical=90.0, status=NodeStatus.WARNING, trend="rising", history=[50.0, 58.0, 65.0, 72.0, 78.0]),
        SensorReading(sensor_id="sensor-colaba-radar", sensor_type=SensorType.WIND_WEATHER, name="IMD Colaba Doppler Radar Wind & Rain", lat=18.906, lng=72.815, current_value=48.0, unit="km/h", threshold_warning=60.0, threshold_critical=85.0, status=NodeStatus.OPERATIONAL, trend="rising", history=[32.0, 36.0, 40.0, 44.0, 48.0])
    ]

    return {"nodes": nodes, "roads": roads, "sensors": sensors, "center": [19.040, 72.850]}

def _build_delhi_scenario() -> Dict[str, Any]:
    """Exact real-world topography & satellite radar stations for Delhi NCR"""
    nodes = [
        InfrastructureNode(id="node-hosp-1", name="AIIMS New Delhi (Apex Trauma Center)", node_type=NodeType.HOSPITAL, lat=28.567, lng=77.210, elevation_m=22.0, status=NodeStatus.OPERATIONAL, capacity_total=3200, capacity_used=2400, backup_power_hours=72.0),
        InfrastructureNode(id="node-hosp-2", name="LNJP Hospital & Maulana Azad Medical College", node_type=NodeType.HOSPITAL, lat=28.636, lng=77.240, elevation_m=11.5, status=NodeStatus.WARNING, vulnerability_index=0.86, capacity_total=2000, capacity_used=1850, backup_power_hours=24.0),
        InfrastructureNode(id="node-radar-1", name="IMD Mausam Bhawan Lodhi Road Radar & Earth Station", node_type=NodeType.RESIDENTIAL_DISTRICT, lat=28.588, lng=77.225, elevation_m=24.0, status=NodeStatus.OPERATIONAL, details={"radar": "IMD Headquarters Doppler Radar"}),
        InfrastructureNode(id="node-shelter-1", name="Yamuna Sports Complex Mega Disaster Relief Center", node_type=NodeType.SHELTER, lat=28.665, lng=77.305, elevation_m=18.0, status=NodeStatus.OPERATIONAL, capacity_total=10000, capacity_used=1200),
        InfrastructureNode(id="node-shelter-2", name="Thyagaraj Stadium High-Ground Shelter Complex", node_type=NodeType.SHELTER, lat=28.577, lng=77.218, elevation_m=25.0, status=NodeStatus.OPERATIONAL, capacity_total=6000, capacity_used=900),
        InfrastructureNode(id="node-sub-alpha", name="Delhi Transco IP Estate 220kV Grid Substation", node_type=NodeType.SUBSTATION, lat=28.622, lng=77.247, elevation_m=8.2, status=NodeStatus.OPERATIONAL, vulnerability_index=0.89, capacity_total=500, capacity_used=430),
        InfrastructureNode(id="node-water-1", name="Wazirabad Water Treatment Plant & Barrage", node_type=NodeType.WATER_TREATMENT, lat=28.710, lng=77.226, elevation_m=7.5, status=NodeStatus.OPERATIONAL, details={"intake_mgd": 120}),
        InfrastructureNode(id="node-bridge-1", name="Old Yamuna Iron Bridge Corridor", node_type=NodeType.BRIDGE, lat=28.660, lng=77.240, elevation_m=14.0, status=NodeStatus.OPERATIONAL),
        InfrastructureNode(id="node-levee-1", name="Hathnikund & ITO Barrage Sluice Floodgates", node_type=NodeType.DAM_LEVEE, lat=28.627, lng=77.250, elevation_m=8.0, status=NodeStatus.OPERATIONAL, vulnerability_index=0.94),
        InfrastructureNode(id="node-fire-1", name="NDRF 8th Battalion Disaster Post (Ghaziabad)", node_type=NodeType.FIRE_STATION, lat=28.675, lng=77.410, elevation_m=28.0, status=NodeStatus.OPERATIONAL),
        InfrastructureNode(id="node-res-1", name="Yamuna Khadar Lowland Settlement (Civil Lines)", node_type=NodeType.RESIDENTIAL_DISTRICT, lat=28.678, lng=77.235, elevation_m=6.8, status=NodeStatus.CRITICAL, population_density=18000),
        InfrastructureNode(id="node-res-2", name="Kashmere Gate ISBT & Ring Road Choke Point", node_type=NodeType.COMMERCIAL_DISTRICT, lat=28.667, lng=77.228, elevation_m=7.2, status=NodeStatus.CRITICAL, population_density=14000)
    ]

    roads = [
        RoadEdge(id="road-1", from_node="node-res-1", to_node="node-res-2", name="Ring Road North Inundated Way", coordinates=[[77.235, 28.678], [77.230, 28.672], [77.228, 28.667]], length_km=1.8, elevation_m=7.0, max_speed_kmh=35.0, status=RoadStatus.CLEAR),
        RoadEdge(id="road-2", from_node="node-res-2", to_node="node-bridge-1", name="Kashmere Gate to Old Yamuna Bridge", coordinates=[[77.228, 28.667], [77.234, 28.663], [77.240, 28.660]], length_km=1.5, elevation_m=10.0, max_speed_kmh=40.0, status=RoadStatus.CLEAR),
        RoadEdge(id="road-3", from_node="node-bridge-1", to_node="node-shelter-1", name="Vikas Marg Safe Evacuation Corridor", coordinates=[[77.240, 28.660], [77.275, 28.662], [77.305, 28.665]], length_km=6.8, elevation_m=16.0, max_speed_kmh=65.0, is_evacuation_corridor=True, status=RoadStatus.CLEAR),
        RoadEdge(id="road-4", from_node="node-res-2", to_node="node-hosp-1", name="Mahatma Gandhi Marg Apex Hospital Way", coordinates=[[77.228, 28.667], [77.220, 28.610], [77.210, 28.567]], length_km=11.5, elevation_m=18.0, max_speed_kmh=75.0, is_evacuation_corridor=True, status=RoadStatus.CLEAR)
    ]

    sensors = [
        SensorReading(sensor_id="sensor-del-yamuna-1", sensor_type=SensorType.WATER_LEVEL_GAUGE, name="Yamuna Old Railway Bridge CWC Gauge", lat=28.660, lng=77.240, current_value=206.2, unit="m", threshold_warning=204.5, threshold_critical=205.33, status=NodeStatus.CRITICAL, trend="rising", history=[203.8, 204.4, 205.1, 205.8, 206.2]),
        SensorReading(sensor_id="sensor-del-ito-1", sensor_type=SensorType.WATER_LEVEL_GAUGE, name="ITO Ring Road Underpass Sensor", lat=28.627, lng=77.250, current_value=0.48, unit="m", threshold_warning=0.3, threshold_critical=0.6, status=NodeStatus.CRITICAL, trend="rising", history=[0.1, 0.22, 0.35, 0.42, 0.48]),
        SensorReading(sensor_id="sensor-del-radar-1", sensor_type=SensorType.WIND_WEATHER, name="IMD Mausam Bhawan Doppler Radar", lat=28.588, lng=77.225, current_value=42.0, unit="mm/h", threshold_warning=35.0, threshold_critical=65.0, status=NodeStatus.WARNING, trend="rising", history=[20.0, 26.0, 32.0, 38.0, 42.0])
    ]

    return {"nodes": nodes, "roads": roads, "sensors": sensors, "center": [28.640, 77.230]}

def _build_bengaluru_scenario() -> Dict[str, Any]:
    """Exact real-world topography & ISRO/IMD stations for Bengaluru"""
    nodes = [
        InfrastructureNode(id="node-hosp-1", name="Manipal Hospital (Old Airport Road Apex Trauma)", node_type=NodeType.HOSPITAL, lat=12.958, lng=77.649, elevation_m=895.0, status=NodeStatus.OPERATIONAL, capacity_total=1600, capacity_used=1200, backup_power_hours=48.0),
        InfrastructureNode(id="node-hosp-2", name="St. John's Medical College Hospital (Koramangala)", node_type=NodeType.HOSPITAL, lat=12.934, lng=77.618, elevation_m=880.0, status=NodeStatus.OPERATIONAL, vulnerability_index=0.82, capacity_total=1400, capacity_used=1250, backup_power_hours=36.0),
        InfrastructureNode(id="node-radar-1", name="ISRO Telemetry Tracking & Command Network (ISTRAC)", node_type=NodeType.RESIDENTIAL_DISTRICT, lat=13.033, lng=77.514, elevation_m=920.0, status=NodeStatus.OPERATIONAL, details={"agency": "ISRO Ground Station"}),
        InfrastructureNode(id="node-shelter-1", name="Manyata Tech Park High-Ground Relief Complex", node_type=NodeType.SHELTER, lat=13.048, lng=77.620, elevation_m=915.0, status=NodeStatus.OPERATIONAL, capacity_total=8500, capacity_used=1100),
        InfrastructureNode(id="node-shelter-2", name="Kanteerava Indoor Stadium Central Shelter", node_type=NodeType.SHELTER, lat=12.970, lng=77.593, elevation_m=905.0, status=NodeStatus.OPERATIONAL, capacity_total=5000, capacity_used=700),
        InfrastructureNode(id="node-sub-alpha", name="BESCOM Bellandur 66/11kV Primary Substation", node_type=NodeType.SUBSTATION, lat=12.930, lng=77.685, elevation_m=868.0, status=NodeStatus.OPERATIONAL, vulnerability_index=0.91, capacity_total=400, capacity_used=360),
        InfrastructureNode(id="node-water-1", name="Varthur Lake Sluice & Drainage Outfall", node_type=NodeType.WATER_TREATMENT, lat=12.942, lng=77.728, elevation_m=862.0, status=NodeStatus.OPERATIONAL),
        InfrastructureNode(id="node-bridge-1", name="Silk Board Junction Flyover Corridor", node_type=NodeType.BRIDGE, lat=12.917, lng=77.623, elevation_m=888.0, status=NodeStatus.OPERATIONAL),
        InfrastructureNode(id="node-levee-1", name="Bellandur Lake Spillway & Sluice Gates", node_type=NodeType.DAM_LEVEE, lat=12.935, lng=77.674, elevation_m=865.0, status=NodeStatus.OPERATIONAL, vulnerability_index=0.95),
        InfrastructureNode(id="node-fire-1", name="NDRF South Staging Base (Bangalore Base)", node_type=NodeType.FIRE_STATION, lat=13.010, lng=77.560, elevation_m=925.0, status=NodeStatus.OPERATIONAL),
        InfrastructureNode(id="node-res-1", name="Outer Ring Road IT Corridor (Ecospace / Bellandur)", node_type=NodeType.COMMERCIAL_DISTRICT, lat=12.928, lng=77.682, elevation_m=866.0, status=NodeStatus.CRITICAL, population_density=15000),
        InfrastructureNode(id="node-res-2", name="Koramangala 4th Block Lowland Ward", node_type=NodeType.RESIDENTIAL_DISTRICT, lat=12.932, lng=77.628, elevation_m=872.0, status=NodeStatus.CRITICAL, population_density=12500)
    ]

    roads = [
        RoadEdge(id="road-1", from_node="node-res-1", to_node="node-levee-1", name="Outer Ring Road Service Arterial", coordinates=[[77.682, 12.928], [77.678, 12.931], [77.674, 12.935]], length_km=1.2, elevation_m=866.0, max_speed_kmh=35.0, status=RoadStatus.CLEAR),
        RoadEdge(id="road-2", from_node="node-res-2", to_node="node-bridge-1", name="Hosur Road to Silk Board", coordinates=[[77.628, 12.932], [77.625, 12.924], [77.623, 12.917]], length_km=1.9, elevation_m=880.0, max_speed_kmh=45.0, status=RoadStatus.CLEAR),
        RoadEdge(id="road-3", from_node="node-res-1", to_node="node-shelter-1", name="Outer Ring Road North Evacuation Corridor", coordinates=[[77.682, 12.928], [77.650, 12.980], [77.620, 13.048]], length_km=14.2, elevation_m=910.0, max_speed_kmh=75.0, is_evacuation_corridor=True, status=RoadStatus.CLEAR),
        RoadEdge(id="road-4", from_node="node-res-2", to_node="node-hosp-1", name="Old Airport Road Hospital Link", coordinates=[[77.628, 12.932], [77.640, 12.945], [77.649, 12.958]], length_km=4.2, elevation_m=890.0, max_speed_kmh=60.0, is_evacuation_corridor=True, status=RoadStatus.CLEAR)
    ]

    sensors = [
        SensorReading(sensor_id="sensor-blr-bellandur", sensor_type=SensorType.WATER_LEVEL_GAUGE, name="Bellandur Lake Inundation Sensor", lat=12.935, lng=77.674, current_value=2.65, unit="m", threshold_warning=2.0, threshold_critical=3.2, status=NodeStatus.CRITICAL, trend="rising", history=[1.4, 1.8, 2.1, 2.4, 2.65]),
        SensorReading(sensor_id="sensor-blr-orr", sensor_type=SensorType.WATER_LEVEL_GAUGE, name="ORR Ecospace Underpass Water Sensor", lat=12.928, lng=77.682, current_value=0.62, unit="m", threshold_warning=0.3, threshold_critical=0.7, status=NodeStatus.CRITICAL, trend="rising", history=[0.1, 0.25, 0.42, 0.55, 0.62]),
        SensorReading(sensor_id="sensor-blr-imd", sensor_type=SensorType.WIND_WEATHER, name="IMD Palace Road Radar & Weather", lat=12.986, lng=77.587, current_value=48.0, unit="mm/h", threshold_warning=35.0, threshold_critical=70.0, status=NodeStatus.CRITICAL, trend="rising", history=[20.0, 28.0, 36.0, 42.0, 48.0])
    ]

    return {"nodes": nodes, "roads": roads, "sensors": sensors, "center": [12.950, 77.670]}

def generate_base_scenario(city_id: str = "mumbai_monsoon") -> CityDigitalTwinState:
    cities = {c["id"]: c for c in get_available_indian_cities()}
    selected = cities.get(city_id, cities["mumbai_monsoon"])

    if city_id == "mumbai_monsoon":
        spec = _build_mumbai_scenario()
    elif city_id == "delhi_yamuna":
        spec = _build_delhi_scenario()
    elif city_id == "bengaluru_lakes":
        spec = _build_bengaluru_scenario()
    else:
        # Fallback to authentic city coordinates
        center_lat = selected["lat"]
        center_lng = selected["lng"]
        spec = {
            "center": [center_lat, center_lng],
            "nodes": [
                InfrastructureNode(id="node-hosp-1", name=f"Apex Medical & Trauma Hospital ({selected['state']})", node_type=NodeType.HOSPITAL, lat=center_lat + 0.02, lng=center_lng - 0.02, elevation_m=18.0, status=NodeStatus.OPERATIONAL, capacity_total=2000, capacity_used=1400),
                InfrastructureNode(id="node-radar-1", name=f"IMD Doppler Weather Radar & Ground Station ({selected['state']})", node_type=NodeType.RESIDENTIAL_DISTRICT, lat=center_lat - 0.03, lng=center_lng - 0.03, elevation_m=25.0, status=NodeStatus.OPERATIONAL),
                InfrastructureNode(id="node-shelter-1", name=f"State Emergency Relief Camp ({selected['state']})", node_type=NodeType.SHELTER, lat=center_lat + 0.03, lng=center_lng + 0.02, elevation_m=22.0, status=NodeStatus.OPERATIONAL, capacity_total=6000, capacity_used=900),
                InfrastructureNode(id="node-sub-alpha", name=f"State 220kV Primary Grid Substation ({selected['state']})", node_type=NodeType.SUBSTATION, lat=center_lat - 0.01, lng=center_lng + 0.01, elevation_m=6.0, status=NodeStatus.OPERATIONAL, capacity_total=400, capacity_used=340),
                InfrastructureNode(id="node-bridge-1", name=f"Primary River/Coastal Bridge Span ({selected['state']})", node_type=NodeType.BRIDGE, lat=center_lat, lng=center_lng, elevation_m=12.0, status=NodeStatus.OPERATIONAL),
                InfrastructureNode(id="node-levee-1", name=f"River Embankment & Sluice Gates ({selected['state']})", node_type=NodeType.DAM_LEVEE, lat=center_lat + 0.01, lng=center_lng - 0.01, elevation_m=5.0, status=NodeStatus.OPERATIONAL),
                InfrastructureNode(id="node-fire-1", name=f"{selected['ndrf_unit']} Swift Water Base", node_type=NodeType.FIRE_STATION, lat=center_lat + 0.04, lng=center_lng - 0.03, elevation_m=24.0, status=NodeStatus.OPERATIONAL),
                InfrastructureNode(id="node-res-1", name=f"Lowland Riverfront Settlement ({selected['state']})", node_type=NodeType.RESIDENTIAL_DISTRICT, lat=center_lat - 0.02, lng=center_lng + 0.02, elevation_m=3.5, status=NodeStatus.CRITICAL, population_density=14000)
            ],
            "roads": [
                RoadEdge(id="road-1", from_node="node-res-1", to_node="node-bridge-1", name="State Arterial Link", coordinates=[[center_lng + 0.02, center_lat - 0.02], [center_lng, center_lat]], length_km=3.1, elevation_m=4.5, max_speed_kmh=45.0, status=RoadStatus.CLEAR),
                RoadEdge(id="road-2", from_node="node-bridge-1", to_node="node-shelter-1", name="Highway Evacuation Corridor", coordinates=[[center_lng, center_lat], [center_lng + 0.02, center_lat + 0.03]], length_km=4.2, elevation_m=18.0, max_speed_kmh=65.0, is_evacuation_corridor=True, status=RoadStatus.CLEAR)
            ],
            "sensors": [
                SensorReading(sensor_id="sensor-state-gauge-1", sensor_type=SensorType.WATER_LEVEL_GAUGE, name=f"CWC River Level Gauge ({selected['state']})", lat=center_lat, lng=center_lng, current_value=24.5, unit="m", threshold_warning=22.0, threshold_critical=26.0, status=NodeStatus.WARNING, trend="rising", history=[20.0, 21.5, 23.0, 24.5]),
                SensorReading(sensor_id="sensor-state-radar-1", sensor_type=SensorType.WIND_WEATHER, name=f"IMD Doppler Weather Radar ({selected['state']})", lat=center_lat - 0.03, lng=center_lng - 0.03, current_value=38.0, unit="mm/h", threshold_warning=30.0, threshold_critical=60.0, status=NodeStatus.OPERATIONAL, trend="rising", history=[18.0, 24.0, 31.0, 38.0])
            ]
        }

    nodes: List[InfrastructureNode] = spec["nodes"]
    roads: List[RoadEdge] = spec["roads"]
    sensors: List[SensorReading] = spec["sensors"]
    center_coords: List[float] = spec["center"]

    dispatch_units: List[DispatchUnit] = [
        DispatchUnit(
            unit_id="unit-ndrf-1",
            callsign=f"{selected['ndrf_unit'].split(' ')[0]} Raft Alpha",
            unit_type="swift_water_rescue",
            agency=selected["ndrf_unit"],
            lat=center_coords[0] + 0.02,
            lng=center_coords[1] - 0.02,
            status="standby",
            assigned_mission=f"Staged at {selected['ndrf_unit']} base for rapid flood evacuation"
        ),
        DispatchUnit(
            unit_id="unit-pump-1",
            callsign="State Heavy Dewatering Pump P-12",
            unit_type="public_works_pump",
            agency=f"{selected['state']} Disaster Authority (SDMA)",
            lat=center_coords[0] - 0.015,
            lng=center_coords[1] + 0.015,
            status="standby",
            assigned_mission="Ready for Substation & Lowland flood defense"
        ),
        DispatchUnit(
            unit_id="unit-ems-1",
            callsign="108 Advance Life Support Ambulance 08",
            unit_type="ems_ambulance",
            agency="108 Emergency Medical Services",
            lat=center_coords[0] - 0.01,
            lng=center_coords[1] - 0.01,
            status="standby",
            assigned_mission="Staged at Apex Trauma Hospital"
        )
    ]

    hydro = HydrologySimulationEngine()
    cascade = CascadeFailureEngine()
    router = DynamicEvacuationRouter()
    ai_cmd = AIIncidentCommander()

    nodes, roads, sensors = hydro.calculate_flood_depths(
        timeline_hour=0.0,
        rain_intensity_mmhr=35.0,
        storm_surge_m=0.5,
        levee_breached=False,
        nodes=nodes,
        roads=roads,
        sensors=sensors
    )

    nodes, cascade_links, metrics = cascade.evaluate_cascade_effects(
        nodes=nodes,
        roads=roads,
        substation_tripped=False,
        levee_breached=False,
        timeline_hour=0.0
    )

    evacuation_routes = router.calculate_evacuation_routes(nodes, roads)

    iap = ai_cmd.generate_incident_action_plan(
        city_name=selected["name"],
        timeline_hour=0.0,
        rain_intensity_mmhr=35.0,
        nodes=nodes,
        roads=roads,
        sensors=sensors,
        cascade_links=cascade_links,
        evacuation_routes=evacuation_routes,
        levee_breached=False,
        substation_tripped=False
    )

    state = CityDigitalTwinState(
        city_id=selected["id"],
        city_name=selected["name"],
        center_coords=center_coords,
        bounding_box=[center_coords[0] - 0.1, center_coords[1] - 0.1, center_coords[0] + 0.1, center_coords[1] + 0.1],
        timeline_hour=0.0,
        rain_intensity_mmhr=35.0,
        storm_surge_m=0.5,
        wind_speed_kmh=32.0,
        wind_direction_deg=220.0,
        levee_breached=False,
        substation_tripped=False,
        nodes=nodes,
        roads=roads,
        sensors=sensors,
        cascade_links=cascade_links,
        evacuation_routes=evacuation_routes,
        dispatch_units=dispatch_units,
        iap=iap,
        metrics=metrics
    )

    return state

def load_indian_city_scenario(city_id: str) -> CityDigitalTwinState:
    return generate_base_scenario(city_id)
