import urllib.request
import urllib.parse
import json

API_KEY = "gmnSpSaKqninoz0DQqF0ew2DhgCLPB1B"

endpoints = [
    f"https://otd.delhi.gov.in/api/realtime/VehiclePositions.pb?key={API_KEY}",
    f"https://otd.delhi.gov.in/api/realtime/VehiclePositions.json?key={API_KEY}",
    f"https://otd.delhi.gov.in/api/realtime/TripUpdates.pb?key={API_KEY}",
    f"https://otd.delhi.gov.in/api/realtime/TripUpdates.json?key={API_KEY}",
    f"https://otd.delhi.gov.in/api/realtime/Alerts.pb?key={API_KEY}"
]

print("=== TESTING DELHI OPEN TRANSIT DATA (OTD) LIVE SATELLITE GPS API ===\n")
for ep in endpoints:
    try:
        req = urllib.request.Request(ep, headers={"User-Agent": "CivicTwin-AI/1.0"})
        resp = urllib.request.urlopen(req, timeout=10)
        content_type = resp.headers.get("Content-Type", "")
        data = resp.read()
        print(f"URL: {ep.split('?')[0]}")
        print(f"Status: HTTP {resp.status} | Size: {len(data)} bytes | MIME: {content_type}")
        if "json" in content_type:
            try:
                parsed = json.loads(data.decode())
                print(f"JSON Sample: {str(parsed)[:200]}")
            except Exception:
                pass
        print("-" * 50)
    except Exception as e:
        print(f"URL: {ep.split('?')[0]} -> FAILED: {e}")
        print("-" * 50)
