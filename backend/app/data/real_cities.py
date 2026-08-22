from typing import Dict
from app.models.schemas import CityDigitalTwinState
from app.data.scenarios import generate_metropolis_bay_scenario
import copy

def get_available_cities():
    return [
        {
            "id": "san_francisco_bay",
            "name": "San Francisco Bay & Delta (USA)",
            "hazard_profile": "Atmospheric River, Sea Surge & Mission Creek Basin Inundation",
            "lat": 37.775,
            "lng": -122.418
        },
        {
            "id": "miami_metro",
            "name": "Miami Beach & Biscayne Bay (USA)",
            "hazard_profile": "Category 4 Hurricane, Coastal Storm Surge & Causeway Cutoff",
            "lat": 25.7617,
            "lng": -80.1918
        },
        {
            "id": "tokyo_delta",
            "name": "Tokyo Delta & Sumida Basin (Japan)",
            "hazard_profile": "Typhoon Super-Storm, River Cresting & Lowland Submergence",
            "lat": 35.6895,
            "lng": 139.6917
        }
    ]

def load_city_digital_twin(city_id: str) -> CityDigitalTwinState:
    state = generate_metropolis_bay_scenario()
    
    if city_id == "miami_metro":
        state.city_id = "miami_metro"
        state.city_name = "Miami Beach & Biscayne Bay"
        state.center_coords = [25.7617, -80.1918]
        state.bounding_box = [25.730, -80.220, 25.800, -80.160]
        # Update node names
        for n in state.nodes:
            if "Trauma Hospital" in n.name:
                n.name = "Jackson Memorial Level-1 Trauma"
                n.lat, n.lng = 25.790, -80.210
            elif "Memorial Hospital" in n.name:
                n.name = "Mount Sinai Medical Center (Biscayne)"
                n.lat, n.lng = 25.765, -80.180
            elif "North Ridge" in n.name:
                n.name = "Miami Beach Convention Center Shelter"
                n.lat, n.lng = 25.795, -80.190
            elif "Hillcrest" in n.name:
                n.name = "Bayfront Pavilion Emergency Shelter"
                n.lat, n.lng = 25.775, -80.185
            elif "Bridge" in n.name:
                n.name = "Venetian Causeway Bridge Link"
                n.lat, n.lng = 25.780, -80.180
            elif "Substation" in n.name:
                n.name = "Brickell Coastal Substation"
                n.lat, n.lng = 25.760, -80.195

    elif city_id == "tokyo_delta":
        state.city_id = "tokyo_delta"
        state.city_name = "Tokyo Delta & Sumida Basin"
        state.center_coords = [35.6895, 139.6917]
        state.bounding_box = [35.650, 139.650, 35.730, 139.750]
        for n in state.nodes:
            if "Trauma Hospital" in n.name:
                n.name = "Tokyo University Central Hospital"
                n.lat, n.lng = 35.712, 139.760
            elif "Memorial Hospital" in n.name:
                n.name = "Sumida Riverfront Medical Center"
                n.lat, n.lng = 35.690, 139.790
            elif "North Ridge" in n.name:
                n.name = "Odaiba Dome Emergency Shelter"
                n.lat, n.lng = 35.720, 139.710
            elif "Hillcrest" in n.name:
                n.name = "Ueno Civic Disaster Complex"
                n.lat, n.lng = 35.715, 139.775
            elif "Bridge" in n.name:
                n.name = "Rainbow Bridge Arterial Span"
                n.lat, n.lng = 35.695, 139.780
            elif "Substation" in n.name:
                n.name = "Koto Ward Subterranean Substation"
                n.lat, n.lng = 35.675, 139.795

    return state
