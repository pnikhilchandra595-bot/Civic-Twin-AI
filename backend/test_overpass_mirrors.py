import urllib.request
import urllib.parse
import json

mirrors = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://lz4.overpass-api.de/api/interpreter'
]

query = '[out:json][timeout:10];(node["amenity"="hospital"](around:5000,19.076,72.877););out center 3;'
post_data = urllib.parse.urlencode({'data': query}).encode('utf-8')

for m in mirrors:
    try:
        req = urllib.request.Request(m, data=post_data, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Content-Type': 'application/x-www-form-urlencoded'
        })
        resp = urllib.request.urlopen(req, timeout=10)
        data = json.loads(resp.read().decode())
        print(f"{m:45} -> HTTP {resp.status} | Found {len(data.get('elements', []))} hospitals!")
        for el in data.get('elements', [])[:2]:
            print(f"   • {el.get('tags', {}).get('name', 'Hospital')} [GPS: {el.get('lat')}, {el.get('lon')}]")
    except Exception as e:
        print(f"{m:45} -> FAILED: {e}")
