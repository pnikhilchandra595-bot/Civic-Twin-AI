import React, { useState, useEffect } from 'react';
import {
  X, Sliders, Cpu, Users, ShieldAlert, Waves, Anchor, Radio,
  Send, Activity, AlertTriangle, CheckCircle, Download, RefreshCw,
  Zap, HeartPulse, Mountain, FileText, ArrowRight, Play, Server
} from 'lucide-react';
import { apiService } from '../services/api';

interface AdvancedCommandSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvancedCommandSuiteModal: React.FC<AdvancedCommandSuiteModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Module Data States
  const [countermeasures, setCountermeasures] = useState<any>(null);
  const [iotDevices, setIotDevices] = useState<any>(null);
  const [citizenReports, setCitizenReports] = useState<any>(null);
  const [warRoomPlan, setWarRoomPlan] = useState<any>(null);
  const [damData, setDamData] = useState<any>(null);
  const [boatData, setBoatData] = useState<any>(null);
  const [telecomData, setTelecomData] = useState<any>(null);
  const [uavData, setUavData] = useState<any>(null);
  const [triageData, setTriageData] = useState<any>(null);
  const [insarData, setInsarData] = useState<any>(null);
  const [loraData, setLoraData] = useState<any>(null);
  const [pdnaData, setPdnaData] = useState<any>(null);

  // Tab 1 Form
  const [cmType, setCmType] = useState<string>('dewatering_pump');
  const [cmLocation, setCmLocation] = useState<string>('Kurla Railway Subway');
  const [cmCapacity, setCmCapacity] = useState<number>(500);

  // Tab 2 Form (IoT Simulator)
  const [simDistanceCm, setSimDistanceCm] = useState<number>(110);
  const [iotPostStatus, setIotPostStatus] = useState<string | null>(null);

  // Tab 3 Form (Citizen Depth)
  const [citLevel, setCitLevel] = useState<string>('knee');
  const [citLocation, setCitLocation] = useState<string>('Sion Gandhi Market');

  // Tab 4 Form (War Room)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('english');

  // Tab 5 Form (Dam Rule Curve)
  const [damGates, setDamGates] = useState<number>(3);
  const [damHeight, setDamHeight] = useState<number>(1.8);

  // Tab 11 Form (LoRaWAN Codec)
  const [loraNodeId, setLoraNodeId] = useState<number>(7);
  const [loraDepthCm, setLoraDepthCm] = useState<number>(145);
  const [encodedHex, setEncodedHex] = useState<string>('AA000000070002E8C4000B1ED600915F0001');

  useEffect(() => {
    if (isOpen) {
      loadTabContent(activeTab);
    }
  }, [isOpen, activeTab]);

  const loadTabContent = async (tab: number) => {
    setLoading(true);
    try {
      if (tab === 1) {
        const d = await apiService.getCountermeasures();
        setCountermeasures(d);
      } else if (tab === 2) {
        const d = await apiService.getIoTDevices();
        setIotDevices(d);
      } else if (tab === 3) {
        const d = await apiService.getCitizenDepthReports();
        setCitizenReports(d);
      } else if (tab === 4 && !warRoomPlan) {
        const d = await apiService.synthesizeWarRoomPlan({
          city_name: 'Mumbai',
          hazard_type: 'Flash Flood Deluge',
          threat_level: 'CRITICAL',
          evacuees_count: 14500
        });
        setWarRoomPlan(d);
      } else if (tab === 5) {
        const d = await apiService.simulateDamRuleCurve('mumbai_vihar', damGates, damHeight, 350);
        setDamData(d);
      } else if (tab === 6) {
        const d = await apiService.getAmphibiousBoatRouting();
        setBoatData(d);
      } else if (tab === 7) {
        const d = await apiService.getTelecomBlackoutStatus();
        setTelecomData(d);
      } else if (tab === 8) {
        const d = await apiService.getUAVAirspace();
        setUavData(d);
      } else if (tab === 9) {
        const d = await apiService.getHospitalTriageDashboard();
        setTriageData(d);
      } else if (tab === 10) {
        const d = await apiService.getInSARLandslidePredictions();
        setInsarData(d);
      } else if (tab === 11) {
        const d = await apiService.getLoRaWANMeshStatus();
        setLoraData(d);
      } else if (tab === 12) {
        const d = await apiService.getEconomicPDNA({ city_name: 'Mumbai Metropolitan', flooded_nodes: 14, substations: 1, damaged_roads_km: 18.5, evacuees: 14500 });
        setPdnaData(d);
      }
    } catch (e) {
      console.error("Error loading tab content:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeployCM = async () => {
    setLoading(true);
    await apiService.deployCountermeasure({
      type: cmType,
      location_name: cmLocation,
      lat: 19.07,
      lng: 72.87,
      specs: { capacity_m3_hr: cmCapacity, barrier_length_m: 250, power_kva: 300 }
    });
    const refreshed = await apiService.getCountermeasures();
    setCountermeasures(refreshed);
    setLoading(false);
  };

  const handleRemoveCM = async (id: string) => {
    await apiService.removeCountermeasure(id);
    const refreshed = await apiService.getCountermeasures();
    setCountermeasures(refreshed);
  };

  const handleSendIoTTest = async () => {
    setIotPostStatus('Transmitting packet...');
    const res = await apiService.ingestIoTSensor({
      device_id: 'ESP32-MUM-01',
      distance_cm: simDistanceCm,
      sensor_height_cm: 250,
      battery_pct: 92,
      rssi_dbm: -65
    });
    setIotPostStatus(res.message || 'Packet accepted!');
    const refreshed = await apiService.getIoTDevices();
    setIotDevices(refreshed);
    setTimeout(() => setIotPostStatus(null), 3000);
  };

  const handleSubmitCitizenReport = async () => {
    await apiService.submitCitizenDepthReport({
      location_name: citLocation,
      lat: 19.05,
      lng: 72.86,
      qualitative_level: citLevel,
      reporter_alias: 'Citizen Hero',
      has_photo: true
    });
    const refreshed = await apiService.getCitizenDepthReports();
    setCitizenReports(refreshed);
  };

  const handleSimulateDam = async () => {
    setLoading(true);
    const d = await apiService.simulateDamRuleCurve('mumbai_vihar', damGates, damHeight, 420);
    setDamData(d);
    setLoading(false);
  };

  const handleEncodeLora = async () => {
    const res = await apiService.encodeLoRaWANPacket({
      node_id: loraNodeId,
      lat: 19.066,
      lng: 72.879,
      water_depth_cm: loraDepthCm,
      battery_pct: 95,
      sos_alert: true
    });
    if (res.payload_hex) setEncodedHex(res.payload_hex);
  };

  const downloadTextFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  const TABS = [
    { id: 1, label: '🎛️ Countermeasure Sandbox', icon: Sliders },
    { id: 2, label: '🔌 Physical IoT Webhook', icon: Cpu },
    { id: 3, label: '👥 Citizen Depth Fusion', icon: Users },
    { id: 4, label: '🧠 Autonomous AI War Room', icon: ShieldAlert },
    { id: 5, label: '🌊 Dam Rule-Curve Engine', icon: Waves },
    { id: 6, label: '🚤 Amphibious NDRF Canals', icon: Anchor },
    { id: 7, label: '📶 Telecom Blackout Map', icon: Radio },
    { id: 8, label: '🚁 UAV Airspace Corridors', icon: Send },
    { id: 9, label: '🩸 Hospital Triage & Supplies', icon: HeartPulse },
    { id: 10, label: '🛰️ InSAR Landslide Creep', icon: Mountain },
    { id: 11, label: '📻 LoRaWAN & Ham Mesh', icon: Zap },
    { id: 12, label: '⚖️ Economic PDNA Dossier', icon: FileText },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 overflow-hidden">
      <div className="relative w-full max-w-7xl h-[92vh] bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-wide text-white flex items-center gap-2">
                CIVICTWIN AI <span className="text-cyan-400">ADVANCED COMMAND SUITE</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/40">12 ENHANCEMENTS ACTIVE</span>
              </h2>
              <p className="text-xs text-slate-400">Tactical Sandbox, Live Hardware Webhooks, Multi-Agent War Room & NDMA Compliance</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Body with Sidebar Tabs */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Sidebar Tabs */}
          <div className="w-64 bg-slate-950/60 border-r border-slate-800/80 flex flex-col p-2 space-y-1 overflow-y-auto">
            {TABS.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition text-left ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-950/50'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className="truncate">{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-900/50">
            {loading && (
              <div className="flex items-center justify-center p-8 text-cyan-400 gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span className="text-sm">Synchronizing Digital Twin Telemetry...</span>
              </div>
            )}

            {/* TAB 1: COUNTERMEASURE SANDBOX */}
            {activeTab === 1 && countermeasures && (
              <div className="space-y-6">
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-cyan-400" /> Interactive Tactical Countermeasure Sandbox
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Deploy mobile dewatering pumps, sandbag berms, or emergency diesel gensets to simulate real-time water depth reduction and critical facility restoration.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Intervention Type</label>
                      <select value={cmType} onChange={e => setCmType(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white">
                        <option value="dewatering_pump">Dewatering Pump (500 m³/h)</option>
                        <option value="sandbag_barrier">Inflatable / Sandbag Levee</option>
                        <option value="mobile_generator">Mobile Genset Truck (250 kVA)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Target Location</label>
                      <input type="text" value={cmLocation} onChange={e => setCmLocation(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Capacity / Specs</label>
                      <input type="number" value={cmCapacity} onChange={e => setCmCapacity(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                    </div>
                    <div className="flex items-end">
                      <button onClick={handleDeployCM} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-950">
                        <Play className="w-3.5 h-3.5" /> Deploy in Twin
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active Deployments Table */}
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
                  <h4 className="text-sm font-bold text-white mb-3">Active Operational Interventions ({countermeasures.active_count})</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="p-2.5">ID</th>
                          <th className="p-2.5">Equipment / Intervention</th>
                          <th className="p-2.5">Target Location</th>
                          <th className="p-2.5">Specs & Discharge</th>
                          <th className="p-2.5">Mitigation Effect</th>
                          <th className="p-2.5">Status</th>
                          <th className="p-2.5">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {countermeasures.deployments?.map((d: any) => (
                          <tr key={d.id} className="hover:bg-slate-800/30">
                            <td className="p-2.5 font-mono text-cyan-300">{d.id}</td>
                            <td className="p-2.5 font-medium text-white">{d.name}</td>
                            <td className="p-2.5 text-slate-300">{d.location_name}</td>
                            <td className="p-2.5 text-slate-400">
                              {d.capacity_m3_hr ? `${d.capacity_m3_hr} m³/h` : d.barrier_length_m ? `${d.barrier_length_m}m barrier` : `${d.power_kva} kVA`}
                            </td>
                            <td className="p-2.5 text-emerald-400 font-semibold">
                              {d.effective_depth_reduction_m ? `- ${d.effective_depth_reduction_m}m water depth` : 'Active Protection Berm'}
                            </td>
                            <td className="p-2.5">
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase border border-emerald-500/30">ACTIVE</span>
                            </td>
                            <td className="p-2.5">
                              <button onClick={() => handleRemoveCM(d.id)} className="text-red-400 hover:text-red-300 text-xs font-semibold underline">Withdraw</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PHYSICAL IOT WEBHOOK */}
            {activeTab === 2 && iotDevices && (
              <div className="space-y-6">
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-emerald-400" /> Live Physical IoT Gauge Ingestion Webhook
                    </h3>
                    <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/40">
                      ENDPOINT: POST /api/sensors/ingest
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Connect real microcontrollers (ESP32, Raspberry Pi, Arduino + HC-SR04 ultrasonic sensors) via Wi-Fi, 4G, or LoRaWAN. When a reading is posted, the map marker flips from <code className="text-amber-300">CALIBRATED_BASELINE</code> to <code className="text-emerald-400 font-bold">LIVE_HARDWARE_TELEMETRY</code>.
                  </p>

                  {/* Interactive Live Hardware Simulator */}
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 mb-4">
                    <h4 className="text-xs font-bold text-cyan-300 mb-2 uppercase tracking-wide">🧪 Stage Demonstration & Hardware Test Rig</h4>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="flex-1 w-full">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Ultrasonic Distance to Water Surface: <strong className="text-white">{simDistanceCm} cm</strong></span>
                          <span>Calculated Water Depth: <strong className="text-cyan-400 font-mono">{(250 - simDistanceCm) / 100} m ({250 - simDistanceCm} cm)</strong></span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="240"
                          value={simDistanceCm}
                          onChange={e => setSimDistanceCm(Number(e.target.value))}
                          className="w-full accent-cyan-400 h-2 bg-slate-700 rounded-lg cursor-pointer"
                        />
                      </div>
                      <button
                        onClick={handleSendIoTTest}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-5 rounded-lg text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950 whitespace-nowrap"
                      >
                        <Send className="w-3.5 h-3.5" /> Transmit Packet
                      </button>
                    </div>
                    {iotPostStatus && (
                      <p className="text-xs text-emerald-400 font-mono mt-2 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> {iotPostStatus}
                      </p>
                    )}
                  </div>

                  {/* Registered Devices List */}
                  <h4 className="text-xs font-bold text-slate-300 mb-2 uppercase">Connected Physical Hardware Units ({iotDevices.total_registered_hardware_nodes})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {iotDevices.devices?.map((dev: any) => (
                      <div key={dev.device_id} className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-white text-sm">{dev.device_name}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/40">
                            {dev.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono mb-2">ID: {dev.device_id} | HW: {dev.hardware}</p>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="bg-slate-950 p-2 rounded border border-slate-800">
                            <span className="text-slate-500 block text-[10px]">WATER DEPTH</span>
                            <span className="text-cyan-400 font-bold font-mono text-sm">{dev.water_depth_m} m</span>
                          </div>
                          <div className="bg-slate-950 p-2 rounded border border-slate-800">
                            <span className="text-slate-500 block text-[10px]">BATTERY</span>
                            <span className="text-emerald-400 font-bold font-mono text-sm">{dev.battery_pct}%</span>
                          </div>
                          <div className="bg-slate-950 p-2 rounded border border-slate-800">
                            <span className="text-slate-500 block text-[10px]">LINK</span>
                            <span className="text-slate-300 font-mono text-[11px]">{dev.connection_type}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CITIZEN DEPTH FUSION */}
            {activeTab === 3 && citizenReports && (
              <div className="space-y-6">
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-400" /> Crowdsourced Citizen Depth & Bayesian Sensor Fusion
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Converts qualitative human observations ("ankle", "knee", "waist", "chest") into quantitative metric water depth distributions, reinforced by lightweight Computer Vision watermark detection against vehicle hubs and curbs.
                  </p>

                  {/* Citizen Input Form */}
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 mb-5 grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Qualitative Water Level</label>
                      <select value={citLevel} onChange={e => setCitLevel(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white">
                        <option value="ankle">Ankle Deep (~10 cm)</option>
                        <option value="knee">Knee Deep (~45 cm)</option>
                        <option value="waist">Waist Deep (~90 cm)</option>
                        <option value="chest">Chest Deep (~130 cm)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Location / Landmark</label>
                      <input type="text" value={citLocation} onChange={e => setCitLocation(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                    </div>
                    <div className="flex items-center text-xs text-slate-400 pt-5">
                      <span className="text-emerald-400 font-mono">📷 Auto-detecting CV Waterline</span>
                    </div>
                    <div className="flex items-end">
                      <button onClick={handleSubmitCitizenReport} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-950">
                        <Send className="w-3.5 h-3.5" /> Submit Observation
                      </button>
                    </div>
                  </div>

                  {/* Recent Citizen Reports */}
                  <div className="space-y-2">
                    {citizenReports.reports?.map((r: any) => (
                      <div key={r.report_id} className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{r.location_name}</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                              {r.qualitative_level.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-mono mt-1">
                            Estimated Depth: <strong className="text-cyan-400">{r.estimated_depth_m} m</strong> | Confidence: {(r.confidence_score * 100).toFixed(0)}%
                          </p>
                          {r.cv_watermark_detected && (
                            <p className="text-[11px] text-emerald-400 mt-0.5">🔍 CV Detected: {r.cv_detected_object}</p>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500">{new Date(r.timestamp).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: AUTONOMOUS AI WAR ROOM */}
            {activeTab === 4 && warRoomPlan && (
              <div className="space-y-6">
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-amber-400" /> Multi-Agent Autonomous Incident Command War Room
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Autonomous Generative AI agents formulate logistics transport schedules, generate multilingual NDMA CAP broadcast alerts in 6 Indian languages, and produce statutory ICS-201/204 Incident Action Plans.
                  </p>

                  {/* Logistics Agent Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-500 block">EVACUATION BUSES</span>
                      <span className="text-xl font-bold font-mono text-cyan-400">{warRoomPlan.logistics_agent?.buses_allocated} Units</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-500 block">DIESEL RESERVE</span>
                      <span className="text-xl font-bold font-mono text-amber-400">{warRoomPlan.logistics_agent?.total_diesel_required_liters} L</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-500 block">HIGH-GROUND SHELTERS</span>
                      <span className="text-xl font-bold font-mono text-emerald-400">{warRoomPlan.logistics_agent?.shelters_staged} Staged</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-500 block">NDRF BATTALIONS</span>
                      <span className="text-xl font-bold font-mono text-indigo-400">{warRoomPlan.logistics_agent?.ndrf_battalions_requested} Requested</span>
                    </div>
                  </div>

                  {/* Multilingual Broadcast Engine */}
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 mb-5">
                    <h4 className="text-xs font-bold text-cyan-300 mb-3 uppercase tracking-wide">
                      📡 Common Alerting Protocol (CAP) Multilingual Citizen Alerts
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {['english', 'hindi', 'marathi', 'bengali', 'tamil', 'telugu'].map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setSelectedLanguage(lang)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                            selectedLanguage === lang
                              ? 'bg-amber-500 text-black shadow-md shadow-amber-950'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-sm text-slate-200 font-serif leading-relaxed">
                      {warRoomPlan.multilingual_broadcast_agent?.broadcast_payloads?.[selectedLanguage] || 'Alert ready.'}
                    </div>
                  </div>

                  {/* ICS-201 Download */}
                  <button
                    onClick={() => downloadTextFile(`ICS-201_${warRoomPlan.city_name}.md`, warRoomPlan.statutory_ics_201)}
                    className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition"
                  >
                    <Download className="w-4 h-4 text-cyan-400" /> Export Official NDMA ICS-201 Incident Action Plan (.MD)
                  </button>
                </div>
              </div>
            )}

            {/* TAB 5: DAM RULE-CURVE ENGINE */}
            {activeTab === 5 && damData && (
              <div className="space-y-6">
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <Waves className="w-5 h-5 text-blue-400" /> Advanced Dam Rule-Curve & Upstream Reservoir Simulator
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Models spillway gate discharge formulas (CWC / Dam Safety Act 2021) and calculates wave transit lag time down to downstream urban bridges.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 mb-5">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Spillway Gates Opened: <strong className="text-white">{damGates}</strong></label>
                      <input type="range" min="0" max="4" value={damGates} onChange={e => setDamGates(Number(e.target.value))} className="w-full accent-blue-400" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Gate Opening Height: <strong className="text-white">{damHeight} m</strong></label>
                      <input type="range" min="0.5" max="3.0" step="0.1" value={damHeight} onChange={e => setDamHeight(Number(e.target.value))} className="w-full accent-blue-400" />
                    </div>
                    <div className="flex items-end">
                      <button onClick={handleSimulateDam} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-950">
                        <Play className="w-3.5 h-3.5" /> Re-Compute Hydrograph
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-500 block">SPILLWAY DISCHARGE</span>
                      <span className="text-xl font-bold font-mono text-cyan-400">{damData.hydraulic_outputs?.total_spillway_discharge_cumecs} m³/s</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-500 block">RIVER TRANSIT TIME</span>
                      <span className="text-xl font-bold font-mono text-amber-400">{damData.hydraulic_outputs?.transit_time_to_city_hours} Hours</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-500 block">WAVE ARRIVAL ETA</span>
                      <span className="text-xl font-bold font-mono text-emerald-400">{damData.hydraulic_outputs?.estimated_wave_arrival_eta}</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-500 block">URBAN SURGE ADDITION</span>
                      <span className="text-xl font-bold font-mono text-blue-400">+{damData.hydraulic_outputs?.induced_urban_depth_surge_m} m</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: AMPHIBIOUS NDRF BOAT CANALS */}
            {activeTab === 6 && boatData && (
              <div className="space-y-6">
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <Anchor className="w-5 h-5 text-teal-400" /> Amphibious & Rescue Boat Routing (NDRF Canal Navigation)
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Inverts flooded streets into navigable waterways for Inflatable Rescue Boats (IRBs) while pinpointing underwater death-traps (open manhole vortexes, sunken medians, submerged electrical pillars).
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                    {boatData.navigable_corridors?.map((c: any) => (
                      <div key={c.corridor_id} className="bg-slate-950 p-4 rounded-xl border border-teal-500/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-white text-sm">{c.name}</span>
                          <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-mono font-bold uppercase">{c.status}</span>
                        </div>
                        <p className="text-xs text-slate-400 mb-2 font-mono">Length: {c.length_km} km | Average Depth: <strong className="text-cyan-400">{c.average_depth_m}m</strong></p>
                        <p className="text-[11px] text-slate-300">Vessel: {c.recommended_vessel}</p>
                      </div>
                    ))}
                  </div>

                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Submerged Hazard Radar (Flagged for OBM Motors)
                  </h4>
                  <div className="space-y-2">
                    {boatData.submerged_hazards?.map((h: any) => (
                      <div key={h.id} className="bg-red-950/20 border border-red-500/30 p-3 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white text-xs">{h.name}</span>
                          <p className="text-[11px] text-red-300 mt-0.5">{h.warning}</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-red-400 uppercase">{h.danger_level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: TELECOM BLACKOUT MAP */}
            {activeTab === 7 && telecomData && (
              <div className="space-y-6">
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <Radio className="w-5 h-5 text-purple-400" /> Cellular Tower & Telecom Blackout Propagation
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Tracks BTS tower battery depletion curves as electrical substations trip, predicting the exact "Civic Silence Hour" to deploy mobile COWs (Cellular-on-Wheels).
                  </p>

                  <div className="bg-purple-950/30 border border-purple-500/40 p-4 rounded-xl mb-5 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-purple-300 font-bold block uppercase">PREDICTED CIVIC SILENCE HOUR</span>
                      <span className="text-2xl font-bold font-mono text-white">{telecomData.predicted_civic_silence_hour}</span>
                      <p className="text-xs text-slate-400 mt-1">Countdown to network collapse: <strong className="text-amber-400">{telecomData.time_to_first_silence_hours} Hours</strong></p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/40">
                      {telecomData.overall_telecom_threat}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {telecomData.towers?.map((t: any) => (
                      <div key={t.tower_id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white text-sm">{t.name} ({t.operator})</span>
                          <p className="text-xs text-slate-400 font-mono mt-1">Grid: {t.grid_power_status} | Battery Type: {t.backup_battery_type}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm font-bold font-mono ${t.battery_hours_remaining < 1.0 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {t.battery_hours_remaining} hrs left ({t.battery_pct}%)
                          </span>
                          <span className="text-[10px] text-slate-500 block">{t.population_served?.toLocaleString()} Citizens</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: UAV AIRSPACE CORRIDORS */}
            {activeTab === 8 && uavData && (
              <div className="space-y-6">
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <Send className="w-5 h-5 text-sky-400" /> Search & Rescue UAV Airspace Corridors & Waypoints
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Generates automated 3D search-and-rescue waypoints (QGroundControl / MAVLink format) while buffering against high-tension powerline snags and military helicopter flight paths.
                  </p>

                  <div className="space-y-3 mb-5">
                    {uavData.active_missions?.map((m: any) => (
                      <div key={m.mission_id} className="bg-slate-950 p-4 rounded-xl border border-sky-500/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-white text-sm">{m.callsign} ({m.drone_model})</span>
                          <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-mono font-bold uppercase">{m.status}</span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono mb-2">Cruising Alt: {m.cruising_altitude_m_agl}m AGL | Battery: {m.battery_pct}% | Mission: {m.mission_type}</p>
                        <div className="grid grid-cols-4 gap-2">
                          {m.waypoints?.map((wp: any) => (
                            <div key={wp.seq} className="bg-slate-900 p-2 rounded border border-slate-800 text-center text-xs">
                              <span className="text-slate-500 block text-[10px]">WP #{wp.seq}</span>
                              <span className="text-sky-300 font-mono font-bold">{wp.action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={async () => {
                      const res = await apiService.getUAVAirspace();
                      downloadTextFile('UAV_SAR_Mission.plan', JSON.stringify(res, null, 2));
                    }}
                    className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition"
                  >
                    <Download className="w-4 h-4 text-sky-400" /> Export QGroundControl 3D Flight Plan (.plan)
                  </button>
                </div>
              </div>
            )}

            {/* TAB 9: HOSPITAL TRIAGE & SUPPLIES */}
            {activeTab === 9 && triageData && (
              <div className="space-y-6">
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-rose-400" /> Multi-Hospital Emergency Triage & Supply Rebalancer
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Monitors life-critical stockpiles (O-negative blood, liquid oxygen, dialysis kits, anti-venom) and dynamically generates 108 ambulance redistribution vectors to unflooded high-ground facilities.
                  </p>

                  <div className="space-y-3 mb-5">
                    {triageData.hospitals?.map((h: any) => (
                      <div key={h.hospital_id} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-white text-sm">{h.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            h.status === 'CRITICAL_SURGE' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {h.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center text-xs">
                          <div className="bg-slate-900 p-2 rounded border border-slate-800">
                            <span className="text-slate-500 block text-[10px]">O-VE BLOOD</span>
                            <span className="text-rose-400 font-bold font-mono">{h.stockpiles?.o_negative_blood_units} Units</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded border border-slate-800">
                            <span className="text-slate-500 block text-[10px]">OXYGEN</span>
                            <span className="text-cyan-400 font-bold font-mono">{h.stockpiles?.liquid_oxygen_kl} kL</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded border border-slate-800">
                            <span className="text-slate-500 block text-[10px]">DIALYSIS</span>
                            <span className="text-amber-400 font-bold font-mono">{h.stockpiles?.dialysis_kits} Kits</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded border border-slate-800">
                            <span className="text-slate-500 block text-[10px]">ANTI-VENOM</span>
                            <span className="text-emerald-400 font-bold font-mono">{h.stockpiles?.anti_snake_venom_vials} Vials</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 10: INSAR LANDSLIDE CREEP */}
            {activeTab === 10 && insarData && (
              <div className="space-y-6">
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <Mountain className="w-5 h-5 text-amber-500" /> Sentinel-1 InSAR Slope Subsidence & Landslide Creep
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Persistent Scatterer Interferometry (PSI) radar velocity grids coupled with 48-hour antecedent rainfall to issue Landslide Early Warnings (LEWs) before catastrophic shear failure.
                  </p>

                  <div className="space-y-3">
                    {insarData.sectors?.map((s: any) => (
                      <div key={s.sector_id} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-white text-sm">{s.region}</span>
                          <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                            s.threat_level === 'RED_ALERT' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {s.threat_level}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center text-xs mt-3">
                          <div className="bg-slate-900 p-2 rounded border border-slate-800">
                            <span className="text-slate-500 block text-[10px]">RADAR CREEP</span>
                            <span className="text-red-400 font-mono font-bold">{s.insar_creep_velocity_mm_yr} mm/yr</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded border border-slate-800">
                            <span className="text-slate-500 block text-[10px]">48H RAINFALL</span>
                            <span className="text-cyan-400 font-mono font-bold">{s.cumulative_48h_rain_mm} mm</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded border border-slate-800">
                            <span className="text-slate-500 block text-[10px]">FACTOR OF SAFETY</span>
                            <span className={`font-mono font-bold ${s.factor_of_safety_fos < 1.0 ? 'text-red-400' : 'text-emerald-400'}`}>{s.factor_of_safety_fos} FoS</span>
                          </div>
                          <div className="bg-slate-900 p-2 rounded border border-slate-800">
                            <span className="text-slate-500 block text-[10px]">EVAC WINDOW</span>
                            <span className="text-amber-400 font-mono font-bold">{s.evacuation_window_hours} Hours</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 11: LORAWAN & HAM MESH */}
            {activeTab === 11 && (
              <div className="space-y-6">
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" /> Offline LoRaWAN & Amateur Ham Radio Packet Mesh
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Ultralight binary telemetry codec (&lt; 18 bytes) on Indian ISM Band (865-867 MHz) and Ham Radio VHF (144.39 MHz) for operating in total blackout.
                  </p>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-5">
                    <h4 className="text-xs font-bold text-yellow-300 mb-3 uppercase">📡 Live LoRaWAN Frame Encoder / Decoder</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Node ID</label>
                        <input type="number" value={loraNodeId} onChange={e => setLoraNodeId(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Water Depth (cm)</label>
                        <input type="number" value={loraDepthCm} onChange={e => setLoraDepthCm(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white" />
                      </div>
                      <div className="flex items-end">
                        <button onClick={handleEncodeLora} className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg text-xs shadow-lg shadow-yellow-950">
                          Encode Frame
                        </button>
                      </div>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs text-yellow-400 break-all">
                      Raw Packed Hex: {encodedHex} (18 Bytes / Airtime: 138ms SF10)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 12: ECONOMIC PDNA DOSSIER */}
            {activeTab === 12 && pdnaData && (
              <div className="space-y-6">
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-400" /> Instantaneous Economic Loss & Post-Disaster Needs Assessment (PDNA)
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">
                    World Bank & NDMA Section 46 Disaster Management Act compliant financial damage valuation across housing, power grid, roads, and emergency relief operations.
                  </p>

                  <div className="bg-emerald-950/30 border border-emerald-500/40 p-5 rounded-xl mb-5 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-emerald-300 font-bold block uppercase">TOTAL INSTANTANEOUS ECONOMIC LOSS</span>
                      <span className="text-3xl font-bold font-mono text-white">₹ {pdnaData.total_estimated_economic_loss_inr_crores} Crores</span>
                      <p className="text-xs text-slate-400 mt-1">USD Equivalent: ~${pdnaData.total_estimated_economic_loss_usd_millions} Million</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Central NDRF Grant Eligible</span>
                      <span className="text-xl font-bold font-mono text-cyan-400">₹ {pdnaData.recommended_central_ndrf_assistance_crores} Cr</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-5">
                    {pdnaData.sectoral_breakdown?.map((s: any, idx: number) => (
                      <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white text-xs">{s.sector}</span>
                          <p className="text-[11px] text-slate-400">{s.damage_description}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-emerald-400 text-sm">₹ {s.loss_inr_crores} Cr</span>
                          <span className="text-[10px] text-slate-500 block">{s.share_pct}% of total</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => downloadTextFile(`PDNA_Report_${pdnaData.city_name}.json`, JSON.stringify(pdnaData, null, 2))}
                    className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition"
                  >
                    <Download className="w-4 h-4 text-emerald-400" /> Download World Bank / NDMA PDNA Dossier (.JSON)
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
