import os
import urllib.request
import json
import datetime
from typing import Dict, Any, List, Optional

class LiveTomTomTrafficService:
    def __init__(self):
        self.api_key = os.getenv('TOMTOM_API_KEY', 'MOUuKPsdQzqcmuZG8xjKMtn3I9WTkO3V')
        self._cache: Dict[str, Any] = {}
        self._last_fetch: Optional[datetime.datetime] = None
        self._cache_ttl_sec = 60

    async def fetch_traffic_incidents(self, lat: float = 28.6139, lng: float = 77.2090, radius_deg: float = 0.3) -> Dict[str, Any]:
        now = datetime.datetime.now()
        cache_key = f'{round(lat, 2)}_{round(lng, 2)}_{round(radius_deg, 2)}'

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

        req = urllib.request.Request(url, headers={'User-Agent': 'CivicTwin-AI/1.0'})
        try:
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = json.loads(resp.read().decode())
                raw_incidents = data.get('incidents', [])
                parsed_incidents: List[Dict[str, Any]] = []

                for inc in raw_incidents[:50]:
                    props = inc.get('properties', {})
                    geom = inc.get('geometry', {})
                    coords = geom.get('coordinates', [])
                    
                    # Extract representative lat/lng
                    inc_lat, inc_lng = lat, lng
                    if geom.get('type') == 'Point' and len(coords) >= 2:
                        inc_lng, inc_lat = coords[0], coords[1]
                    elif geom.get('type') == 'LineString' and len(coords) > 0 and len(coords[0]) >= 2:
                        inc_lng, inc_lat = coords[0][0], coords[0][1]

                    events = props.get('events', [])
                    desc = events[0].get('description', 'Traffic Congestion') if events else 'Traffic Delay'
                    delay_sec = props.get('delay', 0)
                    magnitude = props.get('magnitudeOfDelay', 1)

                    severity = 'Low'
                    color = '#10b981'
                    if magnitude == 3 or delay_sec > 600:
                        severity = 'Major Delay / Closure'
                        color = '#ef4444'
                    elif magnitude == 2 or delay_sec > 180:
                        severity = 'Moderate Delay'
                        color = '#f59e0b'

                    parsed_incidents.append({
                        'id': str(props.get('id', len(parsed_incidents))),
                        'description': desc,
                        'from_location': props.get('from', 'Urban Corridor'),
                        'to_location': props.get('to', 'Major Junction'),
                        'delay_seconds': delay_sec,
                        'delay_minutes': round(delay_sec / 60.0, 1),
                        'severity': severity,
                        'color': color,
                        'lat': inc_lat,
                        'lng': inc_lng,
                        'source': 'TomTom Live Traffic Intelligence'
                    })

                result = {
                    'status': 'success',
                    'source': 'TomTom Real-Time Traffic & Incident Stream',
                    'count': len(parsed_incidents),
                    'target_coords': [lat, lng],
                    'incidents': parsed_incidents
                }
                self._cache[cache_key] = result
                self._last_fetch = now
                return result
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e),
                'count': 0,
                'incidents': []
            }

live_traffic_service = LiveTomTomTrafficService()
