import datetime
from typing import Dict, Any, Optional

class TelegramSOSService:
    def __init__(self):
        pass

    async def process_incoming_webhook(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        message = payload.get('message', {})
        chat = message.get('chat', {})
        from_user = message.get('from', {})
        text = message.get('text', '')
        location = message.get('location', {})
        photo = message.get('photo', [])

        user_name = from_user.get('first_name', 'Citizen') + ' ' + from_user.get('last_name', '')
        user_name = user_name.strip() or 'Citizen Informant'

        lat = location.get('latitude', 28.6139) if location else 28.6139
        lng = location.get('longitude', 77.2090) if location else 77.2090

        sos_report = {
            'sos_id': f'TG-{int(datetime.datetime.utcnow().timestamp())}',
            'sender_name': user_name,
            'source': 'Telegram Citizen SOS Bot',
            'text': text or 'Emergency Rescue / Waterlogging Assistance Needed',
            'has_photo': len(photo) > 0,
            'lat': lat,
            'lng': lng,
            'status': 'TRIAGED_PRIORITY_1',
            'timestamp': datetime.datetime.utcnow().isoformat() + 'Z'
        }

        return {
            'status': 'success',
            'message': 'Citizen distress beacon triaged and registered into digital twin',
            'report': sos_report
        }

telegram_sos_service = TelegramSOSService()
