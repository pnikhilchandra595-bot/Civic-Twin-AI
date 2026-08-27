import urllib.request
import json
import datetime
from typing import Dict, Any, List, Optional

class LiveAviationService:
    def __init__(self):
        self._cache: Dict[str, Any] = {}
        self._last_fetch: Optional[datetime.datetime] = None
        self._cache_ttl_sec = 15  # 15 second cache for live ADS-B telemetry

    async def fetch_live_aircraft(self, lat: float = 28.6139, lng: float = 77.2090, radius_deg: float = 1.0) -> Dict[str, Any]:
        now = datetime.datetime.now()
        cache_key = f'{round(lat, 2)}_{round(lng, 2)}_{round(radius_deg, 2)}'

        if self._last_fetch and (now - self._last_fetch).total_seconds() < self._cache_ttl_sec and cache_key in self._cache:
            return self._cache[cache_key]

        lamin = lat - radius_deg
        lomin = lng - radius_deg
        lamax = lat + radius_deg
        lomax = lng + radius_deg

        url = f'https://opensky-network.org/api/states/all?lamin={lamin:.4f}&lomin={lomin:.4f}&lamax={lamax:.4f}&lomax={lomax:.4f}'
        req = urllib.request.Request(url, headers={'User-Agent': 'CivicTwin-AI/1.0'})
        try:
            with urllib.request.urlopen(req, timeout=6) as resp:
                data = json.loads(resp.read().decode())
                raw_states = data.get('states', []) or []
                aircraft_list: List[Dict[str, Any]] = []

                for s in raw_states:
                    callsign = (s[1] or 'AIRCRAFT').strip()
                    s_lng = s[5]
                    s_lat = s[6]
                    baro_alt = s[7] or 1500
                    on_ground = s[8]
                    velocity = s[9] or 150  # m/s
                    heading = s[10] or 0    # degrees

                    if s_lat is not None and s_lng is not None:
                        is_heli = 'HELI' in callsign or 'VT' in callsign or (velocity < 70 and baro_alt < 2000)
                        ac_type = 'NDRF Air-Drop Helicopter' if is_heli else 'Air Ambulance / Evac Transport'
                        emoji = '🚁' if is_heli else '✈️'

                        aircraft_list.append({
                            'icao24': s[0],
                            'callsign': callsign,
                            'origin_country': s[2],
                            'lat': float(s_lat),
                            'lng': float(s_lng),
                            'altitude_m': round(float(baro_alt), 0),
                            'velocity_kmh': round(float(velocity) * 3.6, 1),
                            'heading_deg': round(float(heading), 1),
                            'on_ground': bool(on_ground),
                            'aircraft_type': ac_type,
                            'emoji': emoji,
                            'source': 'OpenSky Network Live ADS-B Transponder Network'
                        })

                result = {
                    'status': 'success',
                    'source': 'OpenSky Network Live ADS-B Transponder Stream',
                    'count': len(aircraft_list),
                    'target_coords': [lat, lng],
                    'aircraft': aircraft_list
                }
                self._cache[cache_key] = result
                self._last_fetch = now
                return result
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e),
                'count': 0,
                'aircraft': []
            }

live_aviation_service = LiveAviationService()
