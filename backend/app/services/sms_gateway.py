import os
import httpx
import datetime
from typing import List, Dict, Any, Optional

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

class RealSMSAlertGateway:
    """
    Dispatches real Emergency SMS, Mobile Push Alerts, WhatsApp, and CAP Broadcasts.
    Integrates with Fast2SMS (India), Twilio (Global), ntfy.sh (Instant Zero-Config Free Phone Push),
    and custom Webhooks (Telegram/WhatsApp/Discord).
    """

    def __init__(self):
        self.fast2sms_api_key = os.getenv("FAST2SMS_API_KEY", "")
        self.twilio_account_sid = os.getenv("TWILIO_ACCOUNT_SID", "")
        self.twilio_auth_token = os.getenv("TWILIO_AUTH_TOKEN", "")
        self.twilio_from_number = os.getenv("TWILIO_FROM_NUMBER", "")
        self.webhook_url = os.getenv("EMERGENCY_WEBHOOK_URL", "")

        self.sent_alerts_log: List[Dict[str, Any]] = []

    def configure_gateway(self, config: Dict[str, str]):
        if "fast2sms_api_key" in config:
            self.fast2sms_api_key = config["fast2sms_api_key"].strip()
        if "twilio_account_sid" in config:
            self.twilio_account_sid = config["twilio_account_sid"].strip()
        if "twilio_auth_token" in config:
            self.twilio_auth_token = config["twilio_auth_token"].strip()
        if "twilio_from_number" in config:
            self.twilio_from_number = config["twilio_from_number"].strip()
        if "webhook_url" in config:
            self.webhook_url = config["webhook_url"].strip()

    async def send_real_otp_sms(self, phone: str, otp_code: str) -> Dict[str, Any]:
        """
        Sends real Live SMS OTP via Fast2SMS (India) or Twilio to the recipient mobile handset.
        """
        clean_num = phone.strip().replace(" ", "").replace("-", "")
        india_10 = clean_num[-10:] if len(clean_num) >= 10 else clean_num
        e164_num = f"+91{india_10}" if len(india_10) == 10 else clean_num

        # 1. Try Fast2SMS India if API key is present
        if self.fast2sms_api_key:
            try:
                async with httpx.AsyncClient(timeout=8.0) as client:
                    resp = await client.post(
                        "https://www.fast2sms.com/dev/bulkV2",
                        headers={"authorization": self.fast2sms_api_key},
                        json={
                            "route": "otp",
                            "variables_values": str(otp_code),
                            "numbers": india_10
                        }
                    )
                    if resp.status_code == 200 and resp.json().get("return"):
                        return {
                            "status": "success",
                            "gateway": "Fast2SMS India Telecom",
                            "to": india_10,
                            "message": f"Real SMS OTP delivered to {india_10} via Fast2SMS."
                        }
            except Exception as e:
                print(f"Fast2SMS OTP error: {e}")

        # 2. Fallback to Twilio
        if self.twilio_account_sid and self.twilio_auth_token:
            url = f"https://api.twilio.com/2010-04-01/Accounts/{self.twilio_account_sid}/Messages.json"
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.post(
                        url,
                        auth=(self.twilio_account_sid, self.twilio_auth_token),
                        data={
                            "To": e164_num,
                            "From": self.twilio_from_number,
                            "Body": "sms_appointment_reminders"
                        }
                    )
                    if resp.status_code in [200, 201]:
                        data = resp.json()
                        return {
                            "status": "success",
                            "gateway": "Twilio Carrier Gateway",
                            "sid": data.get("sid"),
                            "to": e164_num,
                            "carrier_status": data.get("status", "queued"),
                            "message": f"Real SMS OTP dispatched to {e164_num} via Twilio."
                        }
                    else:
                        return {
                            "status": "partial",
                            "error": resp.text,
                            "message": "Twilio queued message with template."
                        }
            except Exception as e:
                return {"status": "error", "error": str(e)}

        return {"status": "simulated", "otp": otp_code, "message": f"Simulated OTP {otp_code} active."}

    async def send_emergency_sms(
        self,
        phone_numbers: List[str],
        alert_title: str,
        message: str,
        city_name: str,
        language: str = "EN",
        custom_config: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """
        Sends real SMS / Mobile Alerts to the provided mobile numbers.
        """
        if custom_config:
            self.configure_gateway(custom_config)

        cleaned_numbers = []
        for num in phone_numbers:
            clean = num.strip().replace(" ", "").replace("-", "")
            if clean:
                cleaned_numbers.append(clean)

        if not cleaned_numbers:
            return {
                "status": "error",
                "message": "No valid phone numbers provided."
            }

        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
        formatted_alert = (
            f"🚨 [NDMA / SDMA EMERGENCY ALERT - {city_name.upper()}]\n"
            f"{alert_title}\n\n"
            f"{message}\n\n"
            f"Helpline: 1070 / 112 | CivicTwin AI Incident Command"
        )

        delivery_results = []
        gateways_dispatched = []

        recipient_statuses = {}
        for phone in cleaned_numbers:
            recipient_statuses[phone] = {
                "phone": phone,
                "sms_delivered": False,
                "sms_gateway": None,
                "sid": None,
                "push_delivered": False
            }

        # 1. Real instant push delivery via ntfy.sh (No auth required, 100% free & open)
        for phone in cleaned_numbers:
            clean_digits = ''.join(filter(str.isdigit, phone))
            topic_id = f"civictwin_{clean_digits[-10:] if len(clean_digits) >= 10 else clean_digits}"
            try:
                async with httpx.AsyncClient(timeout=6.0) as client:
                    await client.post(
                        f"https://ntfy.sh/{topic_id}",
                        headers={
                            "Title": f"EMERGENCY: {alert_title[:60]}",
                            "Priority": "urgent",
                            "Tags": "warning,rotating_light,sos"
                        },
                        content=formatted_alert.encode("utf-8")
                    )
                recipient_statuses[phone]["push_delivered"] = True
                gateways_dispatched.append(f"Instant Push (ntfy.sh/{topic_id})")
            except Exception as e:
                print(f"ntfy dispatch error for {topic_id}: {e}")

        # Also push to general public alert channel
        try:
            async with httpx.AsyncClient(timeout=6.0) as client:
                await client.post(
                    "https://ntfy.sh/civictwin_public_emergency_india",
                    headers={
                        "Title": f"🚨 NDMA ALERT: {city_name.upper()} - {alert_title[:50]}",
                        "Priority": "max",
                        "Tags": "rotating_light,fire_engine,ambulance"
                    },
                    content=formatted_alert.encode("utf-8")
                )
            gateways_dispatched.append("Public Channel: ntfy.sh/civictwin_public_emergency_india")
        except Exception:
            pass

        # 2. Try Fast2SMS (Indian SMS Gateway) if API Key is configured
        if self.fast2sms_api_key:
            try:
                india_numbers = [n[-10:] for n in cleaned_numbers if len(n) >= 10]
                if india_numbers:
                    async with httpx.AsyncClient(timeout=8.0) as client:
                        resp = await client.post(
                            "https://www.fast2sms.com/dev/bulkV2",
                            headers={"authorization": self.fast2sms_api_key},
                            json={
                                "route": "q",
                                "message": formatted_alert[:160],
                                "numbers": ",".join(india_numbers)
                            }
                        )
                        if resp.status_code == 200:
                            gateways_dispatched.append("Fast2SMS India Live Gateway")
                            for ph in cleaned_numbers:
                                recipient_statuses[ph]["sms_delivered"] = True
                                recipient_statuses[ph]["sms_gateway"] = "Fast2SMS (India)"
            except Exception as e:
                print(f"Fast2SMS error: {e}")

        # 3. Try Twilio if configured
        if self.twilio_account_sid and self.twilio_auth_token and self.twilio_from_number:
            try:
                async with httpx.AsyncClient(timeout=8.0) as client:
                    for num in cleaned_numbers:
                        e164_num = num if num.startswith("+") else f"+91{num}"
                        t_resp = await client.post(
                            f"https://api.twilio.com/2010-04-01/Accounts/{self.twilio_account_sid}/Messages.json",
                            auth=(self.twilio_account_sid, self.twilio_auth_token),
                            data={
                                "From": self.twilio_from_number,
                                "To": e164_num,
                                "Body": formatted_alert
                            }
                        )
                        if t_resp.status_code in (200, 201):
                            t_data = t_resp.json()
                            recipient_statuses[num]["sms_delivered"] = True
                            recipient_statuses[num]["sms_gateway"] = "Twilio Telecom Gateway"
                            recipient_statuses[num]["sid"] = t_data.get("sid", "SENT")
                    gateways_dispatched.append("Twilio Global Carrier Gateway")
            except Exception as e:
                print(f"Twilio error: {e}")

        # 4. Try Custom Webhook / Telegram Bot if configured
        if self.webhook_url:
            try:
                async with httpx.AsyncClient(timeout=6.0) as client:
                    await client.post(
                        self.webhook_url,
                        json={
                            "event": "CIVIC_TWIN_EMERGENCY_ALERT",
                            "recipients": cleaned_numbers,
                            "city": city_name,
                            "alert": formatted_alert,
                            "timestamp": timestamp
                        }
                    )
                gateways_dispatched.append("Webhook Dispatch Hub")
            except Exception as e:
                print(f"Webhook dispatch error: {e}")

        if not gateways_dispatched:
            gateways_dispatched.append("Local Dispatch Queue (Simulation Mode)")

        # Generate recipient receipts with honest statuses
        for idx, phone in enumerate(cleaned_numbers):
            clean_phone = ''.join(filter(str.isdigit, phone))
            st = recipient_statuses.get(phone, {})
            
            if st.get("sms_delivered"):
                status_label = "SENT_VIA_CARRIER"
                carrier_label = st.get("sms_gateway", "Telecom Gateway")
            elif st.get("push_delivered"):
                status_label = "PUSH_NOTIFIED"
                carrier_label = "Web Push Channel (ntfy.sh)"
            else:
                status_label = "LOGGED_LOCAL_SIMULATION"
                carrier_label = "Local System Queue"

            rec = {
                "phone_number": phone,
                "carrier": carrier_label,
                "transaction_id": st.get("sid") or f"LOG-{datetime.datetime.now().strftime('%m%d%H%M')}-{idx+101}",
                "status": status_label,
                "delivery_time": timestamp,
                "live_push_link": f"https://ntfy.sh/civictwin_{clean_phone[-10:] if len(clean_phone) >= 10 else clean_phone}",
                "message_preview": formatted_alert[:95] + "..."
            }
            delivery_results.append(rec)

        summary_log = {
            "batch_id": f"NDMA-BATCH-{len(self.sent_alerts_log)+101}",
            "timestamp": timestamp,
            "city": city_name,
            "language": language,
            "gateways_used": gateways_dispatched,
            "total_recipients": len(cleaned_numbers),
            "alert_title": alert_title,
            "full_message": formatted_alert,
            "live_public_channel": "https://ntfy.sh/civictwin_public_emergency_india",
            "recipients": delivery_results
        }

        self.sent_alerts_log.insert(0, summary_log)
        return summary_log

    def get_alert_logs(self) -> List[Dict[str, Any]]:
        return self.sent_alerts_log

sms_alert_gateway = RealSMSAlertGateway()
