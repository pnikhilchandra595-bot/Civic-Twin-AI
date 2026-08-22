from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_get_state():
    response = client.get("/api/state")
    assert response.status_code == 200
    data = response.json()
    assert "nodes" in data
    assert "roads" in data
    assert "sensors" in data
    assert "iap" in data

def test_simulation_control_post():
    response = client.post("/api/control", json={
        "rain_intensity_mmhr": 45.0,
        "timeline_hour": 2.5
    })
    assert response.status_code == 200
    data = response.json()
    assert data["rain_intensity_mmhr"] == 45.0
    assert data["timeline_hour"] == 2.5

def test_what_if_inject():
    response = client.post("/api/what-if/inject?event_type=100_year_storm")
    assert response.status_code == 200
    data = response.json()
    assert data["rain_intensity_mmhr"] == 75.0
