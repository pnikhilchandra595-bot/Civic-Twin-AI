import { CityDigitalTwinState, SimulationControlCommand } from '../types/digital_twin';

const API_BASE = 'http://127.0.0.1:8000/api';
const WS_BASE = 'ws://127.0.0.1:8000/ws/stream';

export interface RadioMessage {
  id: string;
  timestamp: string;
  channel: string;
  sender_callsign: string;
  recipient_callsign: string;
  message: string;
  priority: string;
}

export interface SatelliteSARReport {
  satellite_mission: string;
  pass_type: string;
  polarization: string;
  resolution_m: number;
  cloud_penetration: string;
  acquisition_time: string;
  total_inundated_area_km2: number;
  urban_surface_inundation_pct: number;
  mean_backscatter_db: number;
  water_threshold_db: number;
  sar_confidence_score: number;
}

export interface LiveSmsReceipt {
  phone_number: string;
  carrier: string;
  transaction_id: string;
  status: string;
  delivery_time: string;
  live_push_link?: string;
  message_preview: string;
}

export interface LiveSmsBatchResult {
  batch_id: string;
  timestamp: string;
  city: string;
  language: string;
  gateways_used?: string[];
  gateway_used?: string;
  total_recipients: number;
  alert_title: string;
  full_message: string;
  live_public_channel?: string;
  recipients: LiveSmsReceipt[];
}

export interface CitizenSOSReport {
  id: string;
  timestamp: string;
  citizen_name: string;
  contact_number: string;
  city_id: string;
  location_name: string;
  lat: number;
  lng: number;
  category: string;
  severity: string;
  victim_count: number;
  water_depth_reported_m: number;
  description: string;
  ai_verification_score: number;
  ai_detected_tags: string[];
  status: string;
  assigned_unit_id?: string;
}

export interface ComputerVisionDetection {
  label: string;
  confidence: number;
  bbox: [number, number, number, number];
  hazard_severity: string;
}

export interface DroneCameraFeed {
  camera_id: string;
  feed_name: string;
  camera_type: string;
  city_id: string;
  location_name: string;
  state_name?: string;
  lat: number;
  lng: number;
  video_url: string;
  status: string;
  flood_depth_detected_m: number;
  stalled_vehicles_count: number;
  stranded_pedestrians_count: number;
  flow_velocity_ms: number;
  ai_yolo_detections: ComputerVisionDetection[];
}

export class DigitalTwinApiService {
  private ws: WebSocket | null = null;
  private onStateCallback: ((state: CityDigitalTwinState) => void) | null = null;
  private onRadioCallback: ((msg: RadioMessage) => void) | null = null;
  private onBroadcastCallback: ((rec: any) => void) | null = null;
  private onSmsDispatchedCallback: ((res: LiveSmsBatchResult) => void) | null = null;
  private onSOSReceivedCallback: ((sos: CitizenSOSReport) => void) | null = null;
  private isConnected = false;
  private reconnectTimer: any = null;

  async getState(): Promise<CityDigitalTwinState> {
    const res = await fetch(`${API_BASE}/state`);
    if (!res.ok) throw new Error('Failed to fetch state');
    return res.json();
  }

  async sendControl(cmd: SimulationControlCommand): Promise<CityDigitalTwinState> {
    const res = await fetch(`${API_BASE}/control`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cmd)
    });
    if (!res.ok) throw new Error('Failed to send control command');
    return res.json();
  }

  async dispatchUnit(unitId: string, targetNodeId?: string, mission?: string): Promise<CityDigitalTwinState> {
    return this.sendControl({
      dispatch_unit_command: {
        unit_id: unitId,
        target_node_id: targetNodeId,
        mission: mission
      }
    });
  }

  async injectScenario(scenarioName: string, intensity: number = 1.0): Promise<CityDigitalTwinState> {
    return this.sendControl({
      rain_intensity_mmhr: intensity * 50.0,
      storm_surge_m: intensity * 1.5,
      toggle_levee_breach: scenarioName === 'levee_breach' ? true : undefined,
      toggle_substation_trip: scenarioName === 'substation_failure' ? true : undefined
    });
  }

  async setPlayback(action: 'play' | 'pause' | 'toggle' | 'step', speed: number = 1.0) {
    const res = await fetch(`${API_BASE}/playback?action=${action}&speed=${speed}`, {
      method: 'POST'
    });
    return res.json();
  }

  async resetScenario(cityId: string = 'mumbai_monsoon'): Promise<CityDigitalTwinState> {
    const res = await fetch(`${API_BASE}/reset?city_id=${cityId}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to reset scenario');
    return res.json();
  }

  async switchCity(cityId: string): Promise<CityDigitalTwinState> {
    const res = await fetch(`${API_BASE}/city/switch?city_id=${cityId}`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to switch city');
    return res.json();
  }

  async syncLiveWeather(): Promise<{ weather: any; state: CityDigitalTwinState }> {
    const res = await fetch(`${API_BASE}/weather/live-sync`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to sync live weather');
    return res.json();
  }

  async getSatelliteSARReport(): Promise<SatelliteSARReport> {
    const res = await fetch(`${API_BASE}/satellite/sar-report`);
    if (!res.ok) throw new Error('Failed to fetch SAR report');
    return res.json();
  }

  // --- Citizen SOS ---
  async getCitizenSOSReports(cityId?: string): Promise<CitizenSOSReport[]> {
    const url = cityId ? `${API_BASE}/sos/reports?city_id=${cityId}` : `${API_BASE}/sos/reports`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return res.json();
  }

  async submitCitizenSOS(payload: Partial<CitizenSOSReport>): Promise<CitizenSOSReport> {
    const res = await fetch(`${API_BASE}/sos/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to submit SOS');
    return res.json();
  }

  async triageCitizenSOS(sosId: string, status: string, assignedUnitId?: string): Promise<CitizenSOSReport> {
    const res = await fetch(`${API_BASE}/sos/triage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sos_id: sosId, status, assigned_unit_id: assignedUnitId })
    });
    if (!res.ok) throw new Error('Failed to triage SOS');
    return res.json();
  }

  // --- Drone & CCTV Feeds ---
  async getDroneCCTVFeeds(cityId?: string): Promise<DroneCameraFeed[]> {
    const url = cityId ? `${API_BASE}/drone/feeds?city_id=${cityId}` : `${API_BASE}/drone/feeds`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return res.json();
  }

  // --- Multi-Hazard Physics Simulator ---
  async simulateMultiHazard(hazardType: string, params: Record<string, any> = {}): Promise<any> {
    const res = await fetch(`${API_BASE}/hazards/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hazard_type: hazardType, ...params })
    });
    if (!res.ok) throw new Error('Failed to simulate multi-hazard');
    return res.json();
  }

  // --- Voice AI Incident Commander Co-Pilot ---
  async sendVoiceRadioCommand(transcript: string): Promise<{ user_query: string; commander_response: string; action_taken: string }> {
    const res = await fetch(`${API_BASE}/ai/voice-command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript })
    });
    if (!res.ok) throw new Error('Failed to process voice radio command');
    return res.json();
  }

  // --- Tactical Radio Comms ---
  async getRadioComms(): Promise<RadioMessage[]> {
    const res = await fetch(`${API_BASE}/alerts/radio-comms`);
    if (!res.ok) return [];
    return res.json();
  }

  async sendRadioMessage(channel: string, sender: string, message: string, priority: string = 'ROUTINE'): Promise<RadioMessage> {
    const res = await fetch(`${API_BASE}/alerts/radio-send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, sender, message, priority })
    });
    if (!res.ok) throw new Error('Failed to send radio message');
    return res.json();
  }

  async sendLiveMobileAlert(
    phoneNumbers: string[],
    alertTitle: string,
    message: string,
    language: string = 'EN',
    customConfig?: Record<string, string>
  ): Promise<LiveSmsBatchResult> {
    const res = await fetch(`${API_BASE}/alerts/send-live-sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone_numbers: phoneNumbers,
        alert_title: alertTitle,
        message: message,
        language: language,
        custom_config: customConfig
      })
    });
    if (!res.ok) throw new Error('Failed to dispatch live mobile SMS alert');
    return res.json();
  }

  async transmitBroadcast(alertType: string, threatLevel: string, targetZones: string[], messageText: string, translations?: Record<string, string>): Promise<any> {
    const res = await fetch(`${API_BASE}/alerts/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        alert_type: alertType,
        threat_level: threatLevel,
        target_zones: targetZones,
        message_text: messageText,
        translations: translations || {}
      })
    });
    if (!res.ok) throw new Error('Failed to transmit broadcast');
    return res.json();
  }

  connectWebSocket(
    onUpdate: (state: CityDigitalTwinState) => void,
    onRadio?: (msg: RadioMessage) => void,
    onBroadcast?: (rec: any) => void,
    onSmsDispatched?: (res: LiveSmsBatchResult) => void,
    onSOSReceived?: (sos: CitizenSOSReport) => void
  ) {
    this.onStateCallback = onUpdate;
    this.onRadioCallback = onRadio || null;
    this.onBroadcastCallback = onBroadcast || null;
    this.onSmsDispatchedCallback = onSmsDispatched || null;
    this.onSOSReceivedCallback = onSOSReceived || null;
    this.initWebSocket();
  }

  private initWebSocket() {
    try {
      this.ws = new WebSocket(WS_BASE);

      this.ws.onopen = () => {
        this.isConnected = true;
        console.log('🔗 CivicTwin Live Telemetry Stream Connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.event === 'state_update' && parsed.data && this.onStateCallback) {
            this.onStateCallback(parsed.data);
          } else if (parsed.event === 'radio_message' && parsed.data && this.onRadioCallback) {
            this.onRadioCallback(parsed.data);
          } else if (parsed.event === 'eas_broadcast_transmitted' && parsed.data && this.onBroadcastCallback) {
            this.onBroadcastCallback(parsed.data);
          } else if (parsed.event === 'live_sms_dispatched' && parsed.data && this.onSmsDispatchedCallback) {
            this.onSmsDispatchedCallback(parsed.data);
          } else if (parsed.event === 'citizen_sos_received' && parsed.data && this.onSOSReceivedCallback) {
            this.onSOSReceivedCallback(parsed.data);
          }
        } catch (e) {
          console.error('WS parse error:', e);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
        this.reconnectTimer = setTimeout(() => this.initWebSocket(), 3000);
      };

      this.ws.onerror = () => {
        this.ws?.close();
      };
    } catch (e) {
      console.warn('WebSocket connection error, will retry...', e);
    }
  }

  async getIntegrationStatus(): Promise<any> {
    const res = await fetch(`${API_BASE}/api/integrations/status`);
    return await res.json();
  }

  async updateIntegrationConfig(cfg: any): Promise<any> {
    const res = await fetch(`${API_BASE}/integrations/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cfg)
    });
    return await res.json();
  }

  async getDeploymentManifest(): Promise<any> {
    const res = await fetch(`${API_BASE}/integrations/deployment-manifest`);
    return await res.json();
  }

  async addCustomCamera(stream: any): Promise<any> {
    const res = await fetch(`${API_BASE}/cctv/add-stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stream)
    });
    return await res.json();
  }

  async testIoTIngest(payload: any): Promise<any> {
    const res = await fetch(`${API_BASE}/iot/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  }

  async getRealWeatherData(lat: number = 19.076, lng: number = 72.877): Promise<any> {
    const res = await fetch(`${API_BASE}/real-data/weather?lat=${lat}&lng=${lng}`);
    return await res.json();
  }

  async getRealRiverDischarge(lat: number = 19.076, lng: number = 72.877): Promise<any> {
    const res = await fetch(`${API_BASE}/real-data/river-discharge?lat=${lat}&lng=${lng}`);
    return await res.json();
  }

  async getRealOSMInfrastructure(south: number, west: number, north: number, east: number): Promise<any> {
    const res = await fetch(`${API_BASE}/real-data/osm-infrastructure?south=${south}&west=${west}&north=${north}&east=${east}`);
    return await res.json();
  }

  async getDataProvenanceManifest(): Promise<any> {
    const res = await fetch(`${API_BASE}/real-data/provenance`);
    return await res.json();
  }

  async chatWithAICopilot(prompt: string, language: string = 'EN', geminiApiKey?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        language,
        gemini_api_key: geminiApiKey || undefined
      })
    });
    if (!res.ok) {
      throw new Error(`API error ${res.status}`);
    }
    return await res.json();
  }

  disconnectWebSocket() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const apiService = new DigitalTwinApiService();
