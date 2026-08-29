import os
import urllib.request
import json
import datetime
from typing import Dict, Any, List, Optional
from app.services.demo_state import demo_state

class LiveThingSpeakIoTService:
    def __init__(self):
        self.channels = [
            {'id': 12397, 'name': 'Cheshire Precision Weather & Rain IoT Station', 'type': 'meteorological'},
            {'id': 9, 'name': 'MathWorks HQ Environmental IoT Node', 'type': 'environmental'},
        ]
        self._cache: Dict[int, Any] = {}
        self._last_fetch: Optional[datetime.datetime] = None
        self._cache_ttl_sec = 15

    async def fetch_live_iot_feeds(self) -> Dict[str, Any]:
        now = datetime.datetime.now()
        if demo_state.is_on():
            return {
                'status': 'demo_simulated',
                'data_mode': 'demo_simulated',
                'source': 'ThingSpeak IoT Physical Telemetry Hub (Demo Mode Simulation)',
                'note': '🎬 Demo Mode active — showing calibrated reference data, live query skipped.',
                'timestamp': now.isoformat(),
                'active_channels': 2,
                'channels': [
                    {
                        'channel_id': 12397,
                        'name': 'Cheshire Precision Weather & Rain IoT Station',
                        'description': 'Live Physical Hardware Station (Demo Mode)',
                        'last_entry_id': 849201,
                        'last_update_utc': now.strftime("%Y-%m-%dT%H:%M:%SZ"),
                        'telemetry_fields': {
                            'field1_temp_or_wind': '28.4',
                            'field2_humidity_or_rain': '82.0',
                            'field3_ultrasonic_level': '1.42',
                            'field4_solar_radiation': '450.0',
                            'field6_barometric_pressure': '1008.2'
                        },
                        'hardware_architecture': 'ESP32 Hydrographic Sensor Mesh'
                    }
                ]
            }

        results: List[Dict[str, Any]] = []

        for ch in self.channels:
            ch_id = ch['id']
            url = f'https://api.thingspeak.com/channels/{ch_id}/feeds.json?results=3'
            req = urllib.request.Request(url, headers={'User-Agent': 'CivicTwin-AI/1.0'})
            try:
                with urllib.request.urlopen(req, timeout=5) as resp:
                    data = json.loads(resp.read().decode())
                    meta = data.get('channel', {})
                    feeds = data.get('feeds', [])
                    latest = feeds[-1] if feeds else {}

                    results.append({
                        'channel_id': ch_id,
                        'name': meta.get('name', ch['name']),
                        'description': meta.get('description', 'Live Physical Hardware Station'),
                        'last_entry_id': latest.get('entry_id'),
                        'last_update_utc': latest.get('created_at'),
                        'telemetry_fields': {
                            'field1_temp_or_wind': latest.get('field1'),
                            'field2_humidity_or_rain': latest.get('field2'),
                            'field3_ultrasonic_level': latest.get('field3'),
                            'field4_solar_radiation': latest.get('field4'),
                            'field6_barometric_pressure': latest.get('field6')
                        },
                        'hardware_architecture': 'Microcontroller (ESP32/Arduino) + REST Ingest Socket'
                    })
            except Exception as e:
                results.append({
                    'channel_id': ch_id,
                    'name': ch['name'],
                    'status': 'offline',
                    'error': str(e)
                })

        return {
            'status': 'success',
            'source': 'MathWorks ThingSpeak Open IoT Cloud (Physical Hardware Stream)',
            'timestamp': datetime.datetime.utcnow().isoformat() + 'Z',
            'active_channels': results
        }

live_thingspeak_service = LiveThingSpeakIoTService()
