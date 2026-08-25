import urllib.request
import urllib.parse

API_KEY = "gmnSpSaKqninoz0DQqF0ew2DhgCLPB1B"

# Delhi OTD uses agency-specific or raw vehicle endpoints
candidates = [
    f"https://otd.delhi.gov.in/api/realtime/VehiclePositions.pb?key={API_KEY}",
    f"https://otd.delhi.gov.in/api/realtime/VehiclePositions.pb?key={API_KEY}&agency=DTC",
    f"https://otd.delhi.gov.in/api/realtime/VehiclePositions.pb?key={API_KEY}&agency=DIMTS",
    f"https://otd.delhi.gov.in/api/realtime/VehiclePositions.pb?key={API_KEY}&agency_id=DTC",
    f"https://otd.delhi.gov.in/api/realtime/VehiclePositions.pb?key={API_KEY}&agency_id=DIMTS",
    f"https://otd.delhi.gov.in/api/realtime/gtfs-rt/vehicle-positions?key={API_KEY}"
]

for url in candidates:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "CivicTwin-AI/1.0"})
        resp = urllib.request.urlopen(req, timeout=10)
        data = resp.read()
        print(f"URL: {url.split('key=')[0]} -> HTTP {resp.status} | Bytes: {len(data)}")
    except Exception as e:
        print(f"URL: {url.split('key=')[0]} -> FAILED: {e}")
