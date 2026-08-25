import os
import urllib.request
import json
import datetime
from typing import Dict, Any, List, Optional

class LivePurpleAirService:
    def __init__(self):
        self.api_key = os.getenv('PURPLEAIR_API_KEY', '5817167C-A095-11F1-9E30-4201AC1DC129')
        self._cache: Dict[str, Any] = {}
        self._last_fetch: Optional[datetime.datetime] = None
        self._cache_ttl_sec = 60

    async def fetch_live_india_air_sensors(self, target_lat: float = 28.6139, target_lng: float = 77.2090, radius_deg: float = 0.8) -> Dict[str, Any]:
        now = datetime.datetime.now()
        cache_key = f'{round(target_lat, 2)}_{round(target_lng, 2)}_{round(radius_deg, 2)}'

        if self._last_fetch and (now - self._last_fetch).total_seconds() < self._cache_ttl_sec and cache_key in self._cache:
            return self._cache[cache_key]

        nwlng = target_lng - radius_deg
        nwlat = target_lat + radius_deg
        selng = target_lng + radius_deg
        selat = target_lat - radius_deg

        url = f'https://api.purpleair.com/v1/sensors?fields=name,latitude,longitude,pm2.5,humidity,temperature&nwlng={nwlng:.4f}&nwlat={nwlat:.4f}&selng={selng:.4f}&selat={selat:.4f}'
        req = urllib.request.Request(url, headers={
            'X-API-Key': self.api_key,
            'User-Agent': 'CivicTwin-AI/1.0'
        })

        try:
            with urllib.request.urlopen(req, timeout=8) as resp:
                raw_data = json.loads(resp.read().decode())
                fields = raw_data.get('fields', [])
                rows = raw_data.get('data', [])

                sensors: List[Dict[str, Any]] = []
                idx_map = {f: i for i, f in enumerate(fields)}

                for row in rows:
                    lat = row[idx_map.get('latitude', 2)]
                    lng = row[idx_map.get('longitude', 3)]
                    if lat is None or lng is None:
                        continue

                    pm25 = row[idx_map.get('pm2.5', 6)] if 'pm2.5' in idx_map else 25.0
                    pm25_val = float(pm25) if pm25 is not None else 25.0
                    temp_f = row[idx_map.get('temperature', 5)] if 'temperature' in idx_map else None
                    temp_c = round((float(temp_f) - 32) * 5.0 / 9.0, 1) if temp_f is not None else None
                    humidity = row[idx_map.get('humidity', 4)] if 'humidity' in idx_map else None

                    aqi_cat = 'Good'
                    aqi_color = '#10b981'
                    if pm25_val > 120:
                        aqi_cat = 'Severe / Hazardous'
                        aqi_color = '#ef4444'
                    elif pm25_val > 60:
                        aqi_cat = 'Poor / Unhealthy'
                        aqi_color = '#f97316'
                    elif pm25_val > 30:
                        aqi_cat = 'Moderate'
                        aqi_color = '#f59e0b'

                    sensor_item = {
                        'sensor_index': row[idx_map.get('sensor_index', 0)],
                        'name': str(row[idx_map.get('name', 1)] or 'PurpleAir Station').split('(')[0].strip(),
                        'lat': float(lat),
                        'lng': float(lng),
                        'pm2_5': pm25_val,
                        'temperature_c': temp_c,
                        'humidity_pct': float(humidity) if humidity is not None else None,
                        'aqi_category': aqi_cat,
                        'aqi_color': aqi_color,
                        'hardware_type': 'Physical Laser Particle Counter (Plantower PMS5003)',
                        'timestamp': datetime.datetime.utcnow().isoformat() + 'Z'
                    }
                    sensors.append(sensor_item)

                result = {
                    'status': 'success',
                    'source': 'PurpleAir Global Physical IoT Network (Real Hardware Sensors)',
                    'count': len(sensors),
                    'target_coords': [target_lat, target_lng],
                    'sensors': sensors
                }

                self._cache[cache_key] = result
                self._last_fetch = now
                return result

        except Exception as e:
            return {
                'status': 'error',
                'message': f'PurpleAir API error: {str(e)}',
                'source': 'PurpleAir Global Physical IoT Network',
                'count': 0,
                'sensors': []
            }

live_purpleair_service = LivePurpleAirService()
