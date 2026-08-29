import datetime
from typing import Dict, Any, Optional

class TelegramSOSService:
    """
    Ingests and triages citizen distress beacons from Telegram Bot webhooks.
    """

    def __init__(self):
        pass

    async def process_incoming_webhook(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        message = payload.get('message', {})
        chat = message.get('chat', {})
        from_user = message.get('from', {})
        text = message.get('text', '')
        location = message.get('location')
        photo = message.get('photo', [])

        first_name = from_user.get('first_name', '')
        last_name = from_user.get('last_name', '')
        user_name = f"{first_name} {last_name}".strip() or 'Citizen Informant'

        # Handle geolocation honestly without false Delhi defaults
        has_gps = bool(location and 'latitude' in location and 'longitude' in location)
        lat: Optional[float] = float(location['latitude']) if has_gps else None
        lng: Optional[float] = float(location['longitude']) if has_gps else None
        location_status = "GPS_ATTACHED" if has_gps else "LOCATION_UNSPECIFIED_PENDING_GEOCODE"

        # Rule-based triage classifier
        text_lower = text.lower()
        urgent_keywords = ["trapped", "medical", "pregnant", "chest", "drowning", "infant", "elderly", "collapse", "levee", "breach", "sos", "urgent", "rescue"]
        is_critical = any(kw in text_lower for kw in urgent_keywords)

        if is_critical:
            severity = "CRITICAL"
            triage_status = "TRIAGED_PRIORITY_1"
        elif text:
            severity = "MEDIUM"
            triage_status = "TRIAGED_ROUTINE"
        else:
            severity = "HIGH" if has_gps else "LOCATION_REQUIRED"
            triage_status = "AWAITING_DETAILS"

        sos_report = {
            'sos_id': f'TG-{int(datetime.datetime.utcnow().timestamp())}',
            'sender_name': user_name,
            'source': 'Telegram Citizen SOS Bot',
            'data_mode': 'live',
            'text': text or 'Emergency distress beacon transmitted without text note.',
            'has_photo': len(photo) > 0,
            'lat': lat,
            'lng': lng,
            'location_status': location_status,
            'severity': severity,
            'status': triage_status,
            'timestamp': datetime.datetime.utcnow().isoformat() + 'Z'
        }

        return {
            'status': 'success',
            'message': 'Citizen distress beacon triaged and registered into digital twin',
            'report': sos_report
        }

telegram_sos_service = TelegramSOSService()
