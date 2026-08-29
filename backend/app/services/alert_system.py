import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class RadioTransmission(BaseModel):
    id: str
    timestamp: str
    channel: str
    sender_callsign: str
    recipient_callsign: str
    message: str = ""
    priority: str = "ROUTINE"

class EASBroadcastRecord(BaseModel):
    broadcast_id: str
    timestamp: str
    alert_type: str
    threat_level: str
    target_zones: List[str]
    message_text: str
    translations: Dict[str, str] = {}
    channels_activated: List[str]
    estimated_citizens_notified: int
    data_mode: str = "modeled_protocol_simulation"
    demographic_coverage_basis: str = "Census 2021 urban ward density projection"
    data_note: str = "⚠️ Simulated Common Alerting Protocol (CAP) multi-channel broadcast simulation."

class AlertSystemHub:
    """
    Emergency Alert System & Tactical Radio Operations Hub.

    DATA PROVENANCE & ARCHITECTURE NOTE:
    - Tactical Radio Comms: Simulates multi-channel inter-agency VHF/UHF tactical radio chatter for field coordination drills.
    - Public Warning Broadcasts: Emulates ITU X.1303 Common Alerting Protocol (CAP) XML broadcast triggers across simulated cell-broadcast, radio, and siren networks.
    - Data Mode: 'modeled_protocol_simulation'.
    """

    def __init__(self):
        self.radio_log: List[RadioTransmission] = []
        self.broadcast_history: List[EASBroadcastRecord] = []
        self._init_pan_india_tactical_chatter()

    def _init_pan_india_tactical_chatter(self):
        now = datetime.datetime.now()
        
        initial_messages = [
            {
                "offset_min": 14,
                "channel": "TAC-1 NDMA National Command (New Delhi)",
                "sender": "NDMA Operations Chief (Delhi HQ)",
                "recipient": "All Regional EOCs",
                "message": "National Disaster Ops Center online. Monsoon and cyclone surveillance active across all 12 NDRF battalions.",
                "priority": "ROUTINE"
            },
            {
                "offset_min": 11,
                "channel": "TAC-2 NDRF 5th Battalion (Maharashtra / West)",
                "sender": "NDRF Bravo-5 Leader",
                "recipient": "Mumbai EOC Command",
                "message": "Staged 12 inflatable rafts at Andheri staging. Monitoring Mithi River level rise near Kurla West.",
                "priority": "PRIORITY"
            },
            {
                "offset_min": 9,
                "channel": "TAC-3 NDRF 8th Battalion (Delhi NCR / North)",
                "sender": "NDRF Echo-8 (Ghaziabad)",
                "recipient": "Delhi SDMA Desk",
                "message": "Yamuna water level at Old Railway Bridge reached 205.85m (Warning mark). Evacuations underway in Yamuna Khadar.",
                "priority": "EMERGENCY"
            },
            {
                "offset_min": 7,
                "channel": "TAC-4 NDRF 1st Battalion (Assam / North-East)",
                "sender": "NDRF Rhino-1 (Guwahati)",
                "recipient": "Assam State EOC",
                "message": "Brahmaputra water discharge high at Pandu Port. 4 Swift Water Rescue teams deployed in low-lying char areas.",
                "priority": "EMERGENCY"
            },
            {
                "offset_min": 5,
                "channel": "TAC-5 NDRF 4th Battalion (Tamil Nadu / South)",
                "sender": "NDRF Arakkonam Command",
                "recipient": "Chennai Disaster Cell",
                "message": "Chembarambakkam Reservoir sluice release at 6,000 cusecs. Adyar River banks alerted.",
                "priority": "PRIORITY"
            },
            {
                "offset_min": 3,
                "channel": "TAC-6 CWC & IMD Radar Desk (India)",
                "sender": "IMD Severe Weather Desk",
                "recipient": "All NDRF Units",
                "message": "Doppler radar shows intense monsoon cloudburst cluster moving over Western Ghats and Bay of Bengal coastal belts.",
                "priority": "WARNING"
            },
            {
                "offset_min": 1,
                "channel": "TAC-1 NDMA National Command (New Delhi)",
                "sender": "108 EMS National Grid",
                "recipient": "All Trauma Centers",
                "message": "108 ALS Ambulance networks on full standby at KEM Mumbai, AIIMS Delhi, GMCH Guwahati, and RGGGH Chennai.",
                "priority": "ROUTINE"
            }
        ]

        for m in initial_messages:
            t = (now - datetime.timedelta(minutes=m["offset_min"])).strftime("%H:%M:%S IST")
            self.radio_log.append(RadioTransmission(
                id=f"RAD-IND-{len(self.radio_log)+101}",
                timestamp=t,
                channel=m["channel"],
                sender_callsign=m["sender"],
                recipient_callsign=m["recipient"],
                message=m["message"],
                priority=m["priority"]
            ))

    def add_radio_message(
        self,
        channel: str,
        sender: str,
        recipient: str,
        message: str,
        priority: str = "ROUTINE"
    ) -> RadioTransmission:
        t = datetime.datetime.now().strftime("%H:%M:%S IST")
        trans = RadioTransmission(
            id=f"RAD-IND-{len(self.radio_log)+101}",
            timestamp=t,
            channel=channel,
            sender_callsign=sender,
            recipient_callsign=recipient,
            message=message,
            priority=priority
        )
        self.radio_log.append(trans)
        return trans

    def transmit_broadcast(
        self,
        alert_type: str,
        threat_level: str,
        target_zones: List[str],
        message_text: str,
        translations: Optional[Dict[str, str]] = None
    ) -> EASBroadcastRecord:
        t = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
        record = EASBroadcastRecord(
            broadcast_id=f"NDMA-CAP-IND-{len(self.broadcast_history)+101}",
            timestamp=t,
            alert_type=alert_type,
            threat_level=threat_level,
            target_zones=target_zones,
            message_text=message_text,
            translations=translations or {},
            channels_activated=[
                "CivicTwin Local Incident Mesh (Dispatched)",
                "C-DOT CAP Gateway (Simulated CAP Dispatch)",
                "Doordarshan EAS (Simulated Interrupt)",
                "State Telecom SMS Mesh (Simulated Trigger)"
            ],
            estimated_citizens_notified=len(target_zones) * 35000 + 15000,
            data_mode="modeled_protocol_simulation",
            demographic_coverage_basis="Census 2021 urban ward density projection",
            data_note="⚠️ Simulated Common Alerting Protocol (CAP) multi-channel broadcast simulation."
        )
        self.broadcast_history.insert(0, record)

        self.add_radio_message(
            channel="TAC-1 NDMA National Command",
            sender="National Alert Synthesizer",
            recipient="All Citizens & Response Teams",
            message=f"TRANSMITTED EMERGENCY BROADCAST: {alert_type} to {len(target_zones)} Zones: {', '.join(target_zones)}",
            priority="EMERGENCY"
        )

        return record

alert_hub = AlertSystemHub()
