import os
import json
import time
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class IntegrationConfig(BaseModel):
    # Satellite Gateways
    copernicus_client_id: Optional[str] = ""
    copernicus_client_secret: Optional[str] = ""
    isro_bhuvan_api_key: Optional[str] = ""
    nasa_earthdata_token: Optional[str] = ""
    sentinel_hub_instance_id: Optional[str] = ""
    
    # AI Incident Commander
    gemini_api_key: Optional[str] = ""

    # SMS & Emergency Dispatch
    fast2sms_api_key: Optional[str] = ""
    fast2sms_dlt_sender_id: Optional[str] = "CIVIC-TWIN"
    twilio_account_sid: Optional[str] = ""
    twilio_auth_token: Optional[str] = ""
    twilio_from_number: Optional[str] = ""
    
    # WhatsApp Cloud Gateway
    whatsapp_cloud_token: Optional[str] = ""
    whatsapp_phone_number_id: Optional[str] = ""
    whatsapp_webhook_verify_token: Optional[str] = "civictwin_verify_token_2026"
    
    # IoT Telemetry & Meteorological
    mqtt_broker_host: Optional[str] = "mqtt.civictwin.gov.in"
    mqtt_port: Optional[int] = 1883
    open_meteo_api_key: Optional[str] = ""

class CustomCameraInput(BaseModel):
    camera_id: str
    feed_name: str
    stream_url: str
    camera_type: str
    location_name: str
    state_name: str
    lat: float
    lng: float

class ProductionIntegrationsHub:
    def __init__(self):
        self.config = IntegrationConfig(
            copernicus_client_id=os.getenv("COPERNICUS_CLIENT_ID", ""),
            copernicus_client_secret=os.getenv("COPERNICUS_CLIENT_SECRET", ""),
            isro_bhuvan_api_key=os.getenv("ISRO_BHUVAN_API_KEY", ""),
            nasa_earthdata_token=os.getenv("NASA_EARTHDATA_TOKEN", ""),
            sentinel_hub_instance_id=os.getenv("SENTINEL_HUB_INSTANCE_ID", ""),
            gemini_api_key=os.getenv("GEMINI_API_KEY", ""),
            fast2sms_api_key=os.getenv("FAST2SMS_API_KEY", ""),
            twilio_account_sid=os.getenv("TWILIO_ACCOUNT_SID", ""),
            twilio_auth_token=os.getenv("TWILIO_AUTH_TOKEN", ""),
            twilio_from_number=os.getenv("TWILIO_FROM_NUMBER", ""),
            whatsapp_cloud_token=os.getenv("WHATSAPP_CLOUD_TOKEN", ""),
            whatsapp_phone_number_id=os.getenv("WHATSAPP_PHONE_NUMBER_ID", ""),
            whatsapp_webhook_verify_token=os.getenv("WHATSAPP_VERIFY_TOKEN", "civictwin_verify_token_2026"),
            open_meteo_api_key=os.getenv("OPEN_METEO_API_KEY", "")
        )

    def get_config_status(self) -> Dict[str, Any]:
        return {
            "satellite_gateway": {
                "copernicus_configured": bool(self.config.copernicus_client_id or self.config.copernicus_client_secret),
                "isro_bhuvan_configured": bool(self.config.isro_bhuvan_api_key),
                "nasa_nisar_configured": bool(self.config.nasa_earthdata_token),
                "sentinel_hub_configured": bool(self.config.sentinel_hub_instance_id),
                "status": "LIVE_SATELLITE_LINKED" if (self.config.copernicus_client_id or self.config.isro_bhuvan_api_key or self.config.nasa_earthdata_token) else "CALIBRATED_FALLBACK_ACTIVE"
            },
            "ai_commander_gateway": {
                "gemini_configured": bool(self.config.gemini_api_key),
                "model_cluster": "Google Gemini 1.5/2.0 Flash REST API",
                "status": "CONNECTED" if self.config.gemini_api_key else "LOCAL_REASONING_MODE"
            },
            "sms_gateway": {
                "fast2sms_configured": bool(self.config.fast2sms_api_key),
                "twilio_configured": bool(self.config.twilio_account_sid and self.config.twilio_auth_token),
                "dlt_sender_id": self.config.fast2sms_dlt_sender_id,
                "status": "READY" if (self.config.fast2sms_api_key or self.config.twilio_account_sid) else "DEMO_FALLBACK"
            },
            "whatsapp_cloud_api": {
                "configured": bool(self.config.whatsapp_cloud_token and self.config.whatsapp_phone_number_id),
                "webhook_verify_token": self.config.whatsapp_webhook_verify_token,
                "webhook_endpoint": "/api/sos/whatsapp-webhook",
                "status": "ONLINE" if self.config.whatsapp_cloud_token else "SIMULATION_MODE"
            },
            "iot_telemetry_bridge": {
                "mqtt_broker": f"{self.config.mqtt_broker_host}:{self.config.mqtt_port}",
                "mqtt_configured": bool(os.getenv("MQTT_BROKER_HOST")),
                "rest_ingest_endpoint": "/api/iot/ingest",
                "status": "MQTT_CONFIGURED" if os.getenv("MQTT_BROKER_HOST") else "REST_INGESTION_STANDBY"
            },
            "meteorological_bridge": {
                "provider": "Open-Meteo & ECMWF Satellite Ingest",
                "custom_key_configured": bool(self.config.open_meteo_api_key),
                "status": "PRO_TIER_AUTHENTICATED" if self.config.open_meteo_api_key else "COMMUNITY_OPEN_TIER_ACTIVE",
                "refresh_interval_sec": 60
            }
        }

    def update_config(self, new_cfg: IntegrationConfig) -> Dict[str, Any]:
        self.config = new_cfg
        return self.get_config_status()

    def generate_deployment_manifest(self) -> Dict[str, str]:
        docker_compose = """version: '3.8'

services:
  civictwin-backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: civictwin_api
    restart: always
    ports:
      - "8000:8000"
    environment:
      - COPERNICUS_CLIENT_ID=${COPERNICUS_CLIENT_ID}
      - COPERNICUS_CLIENT_SECRET=${COPERNICUS_CLIENT_SECRET}
      - ISRO_BHUVAN_API_KEY=${ISRO_BHUVAN_API_KEY}
      - NASA_EARTHDATA_TOKEN=${NASA_EARTHDATA_TOKEN}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - FAST2SMS_API_KEY=${FAST2SMS_API_KEY}
      - TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}
      - TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
      - TWILIO_FROM_NUMBER=${TWILIO_FROM_NUMBER}
      - WHATSAPP_CLOUD_TOKEN=${WHATSAPP_CLOUD_TOKEN}
      - WHATSAPP_PHONE_NUMBER_ID=${WHATSAPP_PHONE_NUMBER_ID}
    networks:
      - civictwin-net

  civictwin-frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: civictwin_ui
    restart: always
    ports:
      - "80:80"
    depends_on:
      - civictwin-backend
    networks:
      - civictwin-net

networks:
  civictwin-net:
    driver: bridge
"""
        env_sample = f"""# CivicTwin AI - Production Gateways & Satellite Keys
COPERNICUS_CLIENT_ID={self.config.copernicus_client_id or 'your_copernicus_client_id'}
COPERNICUS_CLIENT_SECRET={self.config.copernicus_client_secret or 'your_copernicus_client_secret'}
ISRO_BHUVAN_API_KEY={self.config.isro_bhuvan_api_key or 'your_isro_bhuvan_key'}
NASA_EARTHDATA_TOKEN={self.config.nasa_earthdata_token or 'your_nasa_token'}
GEMINI_API_KEY={self.config.gemini_api_key or 'your_gemini_api_key'}
FAST2SMS_API_KEY={self.config.fast2sms_api_key or 'your_fast2sms_key'}
TWILIO_ACCOUNT_SID={self.config.twilio_account_sid or 'your_twilio_sid'}
TWILIO_AUTH_TOKEN={self.config.twilio_auth_token or 'your_twilio_token'}
TWILIO_FROM_NUMBER={self.config.twilio_from_number or '+1234567890'}
WHATSAPP_CLOUD_TOKEN={self.config.whatsapp_cloud_token or 'your_wa_token'}
WHATSAPP_PHONE_NUMBER_ID={self.config.whatsapp_phone_number_id or 'your_wa_phone_id'}
"""
        return {
            "docker_compose": docker_compose,
            "env_sample": env_sample
        }

integrations_hub = ProductionIntegrationsHub()
