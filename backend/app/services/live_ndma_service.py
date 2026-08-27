import urllib.request
import json
import datetime
import ssl
from typing import Dict, Any, List, Optional

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

class LiveNDMASachetService:
    def __init__(self):
        self._cache = None
        self._last_fetch = None
        self._cache_ttl_sec = 180  # Cache for 3 minutes

    async def fetch_ndma_alerts(self) -> Dict[str, Any]:
        now = datetime.datetime.now()
        if self._cache and self._last_fetch and (now - self._last_fetch).total_seconds() < self._cache_ttl_sec:
            return self._cache

        url = 'https://sachet.ndma.gov.in/cap_public_website/FetchAllAlertDetails'
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Accept': 'application/json'
        })
        try:
            with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
                data = json.loads(resp.read().decode())
                alerts = []

                for item in data:
                    disaster_type = str(item.get('disaster_type') or 'Severe Weather Alert')
                    severity = str(item.get('severity') or 'ALERT').upper()
                    area = str(item.get('area_description') or 'District / State Sub-division')
                    start_time = str(item.get('effective_start_time') or 'Immediate')
                    end_time = str(item.get('effective_end_time') or 'Until further notice')

                    color = '#f59e0b'
                    if 'SEVERE' in severity or 'WARNING' in severity or 'RED' in severity:
                        color = '#ef4444'
                    elif 'WATCH' in severity or 'ADVISORY' in severity:
                        color = '#3b82f6'

                    alerts.append({
                        'identifier': item.get('identifier'),
                        'disaster_type': disaster_type,
                        'severity': severity,
                        'severity_level': item.get('severity_level', 'Likely'),
                        'area_description': area,
                        'start_time': start_time,
                        'end_time': end_time,
                        'language': item.get('actual_lang', 'en'),
                        'color': color,
                        'issuing_authority': 'National Disaster Management Authority (NDMA) / IMD'
                    })

                result = {
                    'status': 'success',
                    'source': 'NDMA SACHET National Common Alerting Protocol (CAP) Registry',
                    'count': len(alerts),
                    'timestamp': datetime.datetime.utcnow().isoformat() + 'Z',
                    'alerts': alerts
                }
                self._cache = result
                self._last_fetch = now
                return result
        except Exception as e:
            return {
                'status': 'error',
                'message': str(e),
                'count': 0,
                'alerts': []
            }

live_ndma_service = LiveNDMASachetService()
