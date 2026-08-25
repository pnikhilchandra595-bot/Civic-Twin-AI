import urllib.request
import json
import datetime
import ssl
from typing import Dict, Any, List, Optional

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

class LiveMultiHazardService:
    def __init__(self):
        self._eonet_cache = None
        self._eonet_time = None
        self._seismic_cache = None
        self._seismic_time = None

    async def fetch_nasa_eonet_events(self) -> Dict[str, Any]:
        now = datetime.datetime.now()
        if self._eonet_cache and self._eonet_time and (now - self._eonet_time).total_seconds() < 120:
            return self._eonet_cache

        url = 'https://eonet.gsfc.nasa.gov/api/v3/events?limit=30'
        req = urllib.request.Request(url, headers={'User-Agent': 'CivicTwin-AI/1.0'})
        try:
            with urllib.request.urlopen(req, timeout=8, context=ctx) as resp:
                data = json.loads(resp.read().decode())
                raw_events = data.get('events', [])
                parsed_events = []

                for ev in raw_events:
                    geometries = ev.get('geometry', [])
                    latest_geo = geometries[-1] if geometries else {}
                    coords = latest_geo.get('coordinates', [])

                    if len(coords) >= 2 and isinstance(coords[0], (int, float)):
                        lng, lat = float(coords[0]), float(coords[1])
                        cat_title = ev.get('categories', [{}])[0].get('title', 'Natural Event')

                        parsed_events.append({
                            'id': ev.get('id'),
                            'title': ev.get('title'),
                            'category': cat_title,
                            'lat': lat,
                            'lng': lng,
                            'date': latest_geo.get('date'),
                            'link': ev.get('link'),
                            'source': 'NASA Earth Observatory (EONET)'
                        })

                result = {
                    'status': 'success',
                    'source': 'NASA EONET Real-Time Multi-Hazard Event Feed',
                    'count': len(parsed_events),
                    'events': parsed_events
                }
                self._eonet_cache = result
                self._eonet_time = now
                return result
        except Exception as e:
            return {'status': 'error', 'message': str(e), 'events': []}

    async def fetch_emsc_earthquakes(self) -> Dict[str, Any]:
        now = datetime.datetime.now()
        if self._seismic_cache and self._seismic_time and (now - self._seismic_time).total_seconds() < 60:
            return self._seismic_cache

        url = 'https://www.seismicportal.eu/fdsnws/event/1/query?format=json&limit=30'
        req = urllib.request.Request(url, headers={'User-Agent': 'CivicTwin-AI/1.0'})
        try:
            with urllib.request.urlopen(req, timeout=8, context=ctx) as resp:
                data = json.loads(resp.read().decode())
                raw_features = data.get('features', [])
                quakes = []

                for feat in raw_features:
                    props = feat.get('properties', {})
                    geom = feat.get('geometry', {})
                    coords = geom.get('coordinates', [])

                    if len(coords) >= 2:
                        lng, lat, depth_km = float(coords[0]), float(coords[1]), float(coords[2]) if len(coords) > 2 else 10.0
                        mag = float(props.get('mag') or 4.0)

                        quakes.append({
                            'id': props.get('unid'),
                            'region': props.get('flynn_region') or 'Seismic Zone',
                            'magnitude': mag,
                            'depth_km': depth_km,
                            'lat': lat,
                            'lng': lng,
                            'time_utc': props.get('time'),
                            'source': 'EMSC European-Mediterranean Seismological Centre'
                        })

                result = {
                    'status': 'success',
                    'source': 'EMSC Global Real-Time Seismometer Network',
                    'count': len(quakes),
                    'earthquakes': quakes
                }
                self._seismic_cache = result
                self._seismic_time = now
                return result
        except Exception as e:
            return {'status': 'error', 'message': str(e), 'earthquakes': []}

    async def fetch_open_meteo_air_quality(self, lat: float, lng: float) -> Dict[str, Any]:
        url = f'https://air-quality-api.open-meteo.com/v1/air-quality?latitude={lat:.4f}&longitude={lng:.4f}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi,us_aqi'
        req = urllib.request.Request(url, headers={'User-Agent': 'CivicTwin-AI/1.0'})
        try:
            with urllib.request.urlopen(req, timeout=6, context=ctx) as resp:
                data = json.loads(resp.read().decode())
                current = data.get('current', {})
                return {
                    'status': 'success',
                    'source': 'Open-Meteo Global Atmospheric Chemistry API',
                    'lat': lat,
                    'lng': lng,
                    'pm2_5': current.get('pm2_5'),
                    'pm10': current.get('pm10'),
                    'carbon_monoxide_ugm3': current.get('carbon_monoxide'),
                    'nitrogen_dioxide_ugm3': current.get('nitrogen_dioxide'),
                    'sulphur_dioxide_ugm3': current.get('sulphur_dioxide'),
                    'ozone_ugm3': current.get('ozone'),
                    'us_aqi': current.get('us_aqi'),
                    'european_aqi': current.get('european_aqi'),
                    'timestamp': current.get('time')
                }
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

live_multihazard_service = LiveMultiHazardService()
