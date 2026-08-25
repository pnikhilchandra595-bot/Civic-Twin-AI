import urllib.request
from google.transit import gtfs_realtime_pb2

API_KEY = "gmnSpSaKqninoz0DQqF0ew2DhgCLPB1B"
url = f"https://otd.delhi.gov.in/api/realtime/VehiclePositions.pb?key={API_KEY}"

try:
    req = urllib.request.Request(url, headers={"User-Agent": "CivicTwin-AI/1.0"})
    resp = urllib.request.urlopen(req, timeout=10)
    raw_data = resp.read()
    
    feed = gtfs_realtime_pb2.FeedMessage()
    feed.ParseFromString(raw_data)
    
    print(f"=== DELHI OTD LIVE SATELLITE GPS DECODE ===")
    print(f"Total Live Moving Vehicles: {len(feed.entity)}")
    print(f"Feed Timestamp: {feed.header.timestamp}\n")
    
    for idx, entity in enumerate(feed.entity[:8]):
        v = entity.vehicle
        pos = v.position
        v_id = v.vehicle.id if v.vehicle.id else f"DL-VEH-{idx+1}"
        speed_kmh = (pos.speed or 0) * 3.6
        print(f"[VEHICLE #{idx+1:02d}] ID: {v_id:15} | GPS: [{pos.latitude:.5f}, {pos.longitude:.5f}] | Speed: {speed_kmh:4.1f} km/h | Bearing: {pos.bearing:5.1f} deg")

except Exception as e:
    print(f"Error parsing protobuf: {e}")
