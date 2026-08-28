import os
import urllib.request
import json
import datetime
from typing import Dict, Any, List, Optional

class LiveTomTomTrafficService:
    def __init__(self):
        self.api_key = os.getenv('TOMTOM_API_KEY')
        self._cache: Dict[str, Any] = {}
        self._last_fetch: Optional[datetime.datetime] = None
        self._cache_ttl_sec = 60

    async def fetch_traffic_incidents(self, lat: float = 28.6139, lng: float = 77.2090, radius_deg: float = 0.3) -> Dict[str, Any]:
        now = datetime.datetime.now()
        cache_key = f'{round(lat, 2)}_{round(lng, 2)}_{round(radius_deg, 2)}'

        if not self.api_key:
            return {
                'status': 'unauthenticated',
                'message': '⚠️ TOMTOM_API_KEY not configured in .env. Live traffic stream unavailable.',
                'source': 'TomTom Traffic API',
                'incidents': []
            }

        if self._last_fetch and (now - self._last_fetch).total_seconds() < self._cache_ttl_sec and cache_key in self._cache:
            return self._cache[cache_key]

        min_lon = lng - radius_deg
        min_lat = lat - radius_deg
        max_lon = lng + radius_deg
        max_lat = lat + radius_deg

        url = (
            f'https://api.tomtom.com/traffic/services/5/incidentDetails'
            f'?key={self.api_key}&bbox={min_lon:.4f},{min_lat:.4f},{max_lon:.4f},{max_lat:.4f}'
            f'&fields={{incidents{{type,geometry{{type,coordinates}},properties{{iconCategory,magnitudeOfDelay,events{{description,code}},startTime,endTime,from,to,length,delay}}}}}}'
            f'&language=en-GB'
        )

        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'CivicTwin-AI/1.0'})
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = json.loads(resp.read().decode())
                raw_incidents = data.get('incidents', [])

                parsed = []
                for inc in raw_incidents:
                    props = inc.get('properties', {})
                    geom = inc.get('geometry', {})
                    coords = geom.get('coordinates', [])

                    events = props.get('events', [])
                    desc = events[0].get('description', 'Traffic Incident') if events else 'Traffic Disruption'

                    delay_sec = props.get('delay', 0)
                    delay_min = round(delay_sec / 60.0, 1)

                    mag_map = {0: 'Unknown', 1: 'Minor', 2: 'Moderate', 3: 'Major', 4: 'Undefined'}
                    mag_label = mag_map.get(props.get('magnitudeOfDelay', 0), 'Moderate')

                    incident_point = None
                    if geom.get('type') == 'Point' and len(coords) >= 2:
                        incident_point = [coords[1], coords[0]]
                    elif geom.get('type') == 'LineString' and coords and len(coords[0]) >= 2:
                        mid = len(coords) // 2
                        incident_point = [coords[mid][1], coords[mid][0]]

                    if incident_point:
                        parsed.append({
                            'id': props.get('id', f'TOMTOM-{len(parsed)+1}'),
                            'description': desc,
                            'from_road': props.get('from', 'Roadway'),
                            'to_road': props.get('to', ''),
                            'delay_min': delay_min,
                            'length_meters': props.get('length', 0),
                            'severity': mag_label,
                            'location': incident_point,
                            'icon_category': props.get('iconCategory', 0),
                            'timestamp': props.get('startTime', now.isoformat())
                        })

                result = {
                    'status': 'success',
                    'source': 'TomTom Real-Time Live Traffic Flow API',
                    'count': len(parsed),
                    'target_coords': [lat, lng],
                    'incidents': parsed
                }
                self._cache[cache_key] = result
                self._last_fetch = now
                return result

        except Exception as e:
            return {
                'status': 'error',
                'message': f'TomTom Traffic API error: {str(e)}',
                'source': 'TomTom Real-Time Traffic Feed',
                'incidents': []
            }

live_tomtom_service = LiveTomTomTrafficService()
