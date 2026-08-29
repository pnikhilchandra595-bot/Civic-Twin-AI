from fastapi.testclient import TestClient
from app.main import app

def run_tests():
    client = TestClient(app)

    # Login as Officer to get clearance
    login_res = client.post("/api/auth/login", json={"username": "NDMA-HQ-01", "password": "SecretPassword", "role": "national_authority"})
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    auth_headers = {"Authorization": f"Bearer {token}"}

    # 1. Turn Demo Mode ON
    res_on = client.post("/api/demo-mode", json={"enabled": True}, headers=auth_headers)
    print("Demo Mode Set ON:", res_on.status_code, res_on.json())
    assert res_on.status_code == 200
    assert res_on.json()["demo_mode"] is True

    # 2. Check endpoints
    endpoints = [
        "/api/real-data/cwc-river-gauges",
        "/api/realtime/power-grid",
        "/api/realtime/hospitals?lat=19.076&lng=72.877",
        "/api/realtime/ndma-alerts",
        "/api/realtime/air-sensors?lat=28.6139&lng=77.2090",
        "/api/realtime/traffic-incidents?lat=19.076&lng=72.877",
        "/api/realtime/delhi-vehicles",
        "/api/realtime/aviation-stream?lat=28.6139&lng=77.2090",
        "/api/real-data/mosdac-freshness",
        "/api/satellite/bhoonidhi/live-assets?lat=19.076&lng=72.877"
    ]

    for ep in endpoints:
        r = client.get(ep)
        d = r.json() if r.status_code == 200 else {}
        mode = d.get("data_mode") or (d[0].get("data_mode") if isinstance(d, list) and len(d) > 0 else "N/A")
        print(f"{ep.split('?')[0]:<35} -> HTTP {r.status_code}, data_mode: {mode}")
        assert mode in ["demo_simulated", "demo_simulated"], f"Expected demo_simulated but got {mode}"

    # 3. Turn Demo Mode OFF
    res_off = client.post("/api/demo-mode", json={"enabled": False}, headers=auth_headers)
    print("Demo Mode Restored to OFF:", res_off.status_code, res_off.json())
    assert res_off.status_code == 200
    assert res_off.json()["demo_mode"] is False
    print("\n[SUCCESS] ALL DEMO MODE ENDPOINT TESTS PASSED WITH 100% SUCCESS!")

if __name__ == "__main__":
    run_tests()
