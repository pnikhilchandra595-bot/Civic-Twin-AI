import urllib.request
import json

cities = ['Mumbai', 'Varanasi', 'Bengaluru', 'Delhi']
for c in cities:
    u = f'https://nominatim.openstreetmap.org/search?q=hospital+in+{c}&format=json&limit=3'
    req = urllib.request.Request(u, headers={'User-Agent': 'CivicTwin-AI-Platform/1.0 (nikhil@civictwin.ai)'})
    try:
        r = urllib.request.urlopen(req, timeout=5)
        data = json.loads(r.read().decode())
        print(f"[NOMINATIM] {c:12} -> HTTP {r.status} | Found {len(data)} REAL HOSPITALS:")
        for h in data:
            name = h.get('display_name', '').split(',')[0]
            print(f"   - {name:35} [GPS: {h.get('lat')}, {h.get('lon')}]")
    except Exception as e:
        print(f"[NOMINATIM] {c:12} -> FAILED: {e}")
