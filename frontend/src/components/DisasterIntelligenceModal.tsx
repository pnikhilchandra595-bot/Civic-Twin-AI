import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface DisasterIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyExtractedSITREP?: (data: any) => void;
}

const PRESET_BULLETINS = [
  {
    title: "PIB Mumbai Monsoon Cloudburst Bulletin",
    text: "PRESS INFORMATION BUREAU (PIB) - GOVERNMENT OF INDIA\nOperational SITREP No. 14/2026 - Mumbai Metropolitan Region.\nAt least 14 fatalities and 45 injured reported across Kurla and Chembur due to severe waterlogging following 210 mm of rain recorded in the past 24 hours. Over 1,200 people evacuated to 8 operational relief camps. NDRF has mobilized 6 specialized flood rescue teams equipped with motorized Gemini rafts to assist local civic authorities in low-lying sectors of Kurla and Thane."
  },
  {
    title: "NDMA Wayanad Landslide SITREP",
    text: "NATIONAL DISASTER MANAGEMENT AUTHORITY (NDMA) SITREP\nMajor landslides in Meppadi and Chooralmala, Wayanad district. Heavy continuous rainfall of 372 mm within 48 hours triggered catastrophic debris flows. Official casualty count stands at 84 deaths with 120 injured. District administration has evacuated 3,400 people into 14 temporary relief shelters. 8 NDRF battalions and Indian Army Madras Regiment deployed for SAR operations across Wayanad."
  },
  {
    title: "ASDMA Assam Brahmaputra Flood Advisory",
    text: "ASSAM STATE DISASTER MANAGEMENT AUTHORITY (ASDMA)\nSevere inundation reported along the Brahmaputra and Barak river basins. Cachar and Silchar municipal areas heavily submerged following Betkundi embankment distress. 22 deaths confirmed, 62,000 people displaced and sheltered across 45 relief camps. 180 mm rainfall recorded upstream in Meghalaya catchments. 12 NDRF teams deployed across Cachar, Silchar, and Kamrup."
  }
];

export const DisasterIntelligenceModal: React.FC<DisasterIntelligenceModalProps> = ({
  isOpen,
  onClose,
  onApplyExtractedSITREP
}) => {
  const [activeTab, setActiveTab] = useState<'nlp' | 'cyclone' | 'recession' | 'satellite' | 'anomaly' | 'benchmarks' | 'carbon'>('nlp');
  
  // NLP Parser State
  const [sitrepText, setSitrepText] = useState(PRESET_BULLETINS[0].text);
  const [parsing, setParsing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [injectedSuccess, setInjectedSuccess] = useState(false);

  // Cyclone Cone State
  const [cycloneName, setCycloneName] = useState("Cyclone Biparjoy");
  const [cycloneData, setCycloneData] = useState<any>(null);
  const [loadingCyclone, setLoadingCyclone] = useState(false);

  // Flood Recession State
  const [recessionHour, setRecessionHour] = useState(0);

  // Satellite Split Slider State
  const [splitPercent, setSplitPercent] = useState(50);

  // Anomaly Engine State
  const [anomalyData, setAnomalyData] = useState<any>(null);
  const [loadingAnomaly, setLoadingAnomaly] = useState(false);

  // Benchmarks State
  const [benchmarkData, setBenchmarkData] = useState<any>(null);
  const [loadingBenchmark, setLoadingBenchmark] = useState(false);

  // Carbon Accounting State
  const [carbonData, setCarbonData] = useState<any>(null);
  const [loadingCarbon, setLoadingCarbon] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    loadCycloneData(cycloneName);
    loadAnomalyData();
    loadBenchmarkData();
    loadCarbonData();
  }, [isOpen]);

  const handleParseSITREP = async () => {
    setParsing(true);
    setInjectedSuccess(false);
    try {
      const res = await apiService.parseSitrepText(sitrepText);
      setExtractedData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setParsing(false);
    }
  };

  const loadCycloneData = async (name: string) => {
    setLoadingCyclone(true);
    try {
      const res = await apiService.getCyclonePredictionCone(name);
      setCycloneData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCyclone(false);
    }
  };

  const loadAnomalyData = async () => {
    setLoadingAnomaly(true);
    try {
      const res = await apiService.getSensorAnomalyScan();
      setAnomalyData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAnomaly(false);
    }
  };

  const loadBenchmarkData = async () => {
    setLoadingBenchmark(true);
    try {
      const res = await apiService.getDisasterBenchmarks();
      setBenchmarkData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBenchmark(false);
    }
  };

  const loadCarbonData = async () => {
    setLoadingCarbon(true);
    try {
      const res = await apiService.getSortieCarbonTracker();
      setCarbonData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCarbon(false);
    }
  };

  const handleApplyToTwin = () => {
    if (!extractedData) return;
    if (onApplyExtractedSITREP) {
      onApplyExtractedSITREP(extractedData);
    }
    setInjectedSuccess(true);
    setTimeout(() => setInjectedSuccess(false), 4000);
  };

  if (!isOpen) return null;

  // Recession calculations based on slider hour (0 to 72)
  const baseWaterML = 1850;
  const pumpDischargeRateM3s = 48.5; // combined high-capacity mobile pumps
  const waterRemainingML = Math.max(120, Math.round(baseWaterML * Math.exp(-0.045 * recessionHour)));
  const waterRecededPct = Math.min(100, Math.round(((baseWaterML - waterRemainingML) / baseWaterML) * 100));
  const roadClearancePct = Math.min(98, Math.round(24 + (waterRecededPct * 0.74)));
  const peakDepthM = Math.max(0.08, +(1.65 * Math.exp(-0.042 * recessionHour)).toFixed(2));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-900/50 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 bg-cyan-500/10 border border-cyan-400/30 rounded-xl">🧠</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">NATIONAL DISASTER INTELLIGENCE & MODELING SUITE</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 rounded-full">
                  AI + Physics Twin
                </span>
              </div>
              <p className="text-xs text-slate-400">
                PIB/NDMA NLP SITREP Bulletins • Probabilistic Cyclone Cones • 72h Inundation Recession • Sensor Z-Scores • Sortie Carbon Accounting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 py-2 border-b border-slate-800 bg-slate-950/50 overflow-x-auto text-xs">
          {[
            { id: 'nlp', label: '🤖 NLP SITREP Parser', tag: 'nlp_extracted_intelligence' },
            { id: 'cyclone', label: '🌀 Cyclone Track Cone', tag: 'probabilistic_geospatial_model' },
            { id: 'recession', label: '🌊 Flood Recession Scrubber', tag: 'hydrological_decay_model' },
            { id: 'satellite', label: '🖼️ Pre/Post Satellite Split', tag: 'sentinel_sar_overlay' },
            { id: 'anomaly', label: '📊 Sensor Anomaly Engine', tag: 'statistical_ml_anomaly' },
            { id: 'benchmarks', label: '📈 Disaster Benchmarks', tag: 'cross_disaster_benchmark' },
            { id: 'carbon', label: '🌱 Sortie Carbon Accounting', tag: 'operational_energy_accounting' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">

          {/* TAB 1: NLP SITREP PARSER */}
          {activeTab === 'nlp' && (
            <div className="space-y-6">
              <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-cyan-300">Natural Language Situation Report (SITREP) Triage</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Paste raw press releases, PIB briefings, or NDMA field communiqués. The NLP entity extractor parses casualties, displaced populations, rainfall measurements, and mobilized relief forces to synchronize directly into the Digital Twin.
                  </p>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-mono uppercase bg-cyan-900/40 text-cyan-300 border border-cyan-500/30 rounded">
                  nlp_extracted_intelligence
                </span>
              </div>

              {/* Sample Preset Selector */}
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Pre-loaded Official Press Bulletins:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {PRESET_BULLETINS.map((b, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSitrepText(b.text)}
                      className="p-2.5 text-left rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/40 transition group"
                    >
                      <div className="text-xs font-medium text-slate-200 group-hover:text-cyan-300">{b.title}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{b.text.slice(0, 70)}...</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Area */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Raw Bulletin Content:</label>
                <textarea
                  value={sitrepText}
                  onChange={(e) => setSitrepText(e.target.value)}
                  rows={5}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 transition"
                  placeholder="Paste government press release or field report here..."
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Character count: {sitrepText.length}</span>
                  <button
                    onClick={handleParseSITREP}
                    disabled={parsing || !sitrepText.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs rounded-xl shadow-lg transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {parsing ? 'Parsing Entities...' : '⚡ Extract Telemetry & Triage'}
                  </button>
                </div>
              </div>

              {/* Extracted Telemetry Results */}
              {extractedData && extractedData.extracted_entities && (
                <div className="border border-cyan-500/40 bg-slate-950/70 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Threat Classification:</span>
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                        extractedData.extracted_entities.threat_level === 'CRITICAL_RED_ALERT'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/50 animate-pulse'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      }`}>
                        {extractedData.extracted_entities.threat_level}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      NLP Model Confidence: <span className="text-emerald-400 font-bold">{(extractedData.nlp_confidence_score * 100).toFixed(0)}%</span>
                    </div>
                  </div>

                  {/* Entity Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg text-center">
                      <div className="text-[10px] uppercase text-slate-400">Casualties</div>
                      <div className="text-xl font-bold text-red-400 mt-1">{extractedData.extracted_entities.fatalities}</div>
                    </div>
                    <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg text-center">
                      <div className="text-[10px] uppercase text-slate-400">Injured</div>
                      <div className="text-xl font-bold text-amber-400 mt-1">{extractedData.extracted_entities.injured}</div>
                    </div>
                    <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg text-center">
                      <div className="text-[10px] uppercase text-slate-400">Displaced</div>
                      <div className="text-xl font-bold text-cyan-400 mt-1">{extractedData.extracted_entities.displaced_population.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg text-center">
                      <div className="text-[10px] uppercase text-slate-400">Relief Camps</div>
                      <div className="text-xl font-bold text-purple-400 mt-1">{extractedData.extracted_entities.operational_relief_camps}</div>
                    </div>
                    <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg text-center">
                      <div className="text-[10px] uppercase text-slate-400">24h Rainfall</div>
                      <div className="text-xl font-bold text-blue-400 mt-1">{extractedData.extracted_entities.recorded_rainfall_mm} mm</div>
                    </div>
                    <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg text-center">
                      <div className="text-[10px] uppercase text-slate-400">NDRF Teams</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1">{extractedData.extracted_entities.ndrf_teams_mobilized}</div>
                    </div>
                  </div>

                  {/* Impacted Districts */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 font-medium">Impacted Geospatial Sectors:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {extractedData.extracted_entities.impacted_districts.map((d: string, idx: number) => (
                        <span key={idx} className="px-2 py-0.5 bg-cyan-900/40 text-cyan-300 border border-cyan-700/50 rounded text-[11px]">
                          📍 {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400">
                      Syncing this telemetry overrides current baseline estimates in the Active Simulation Incident Action Plan (IAP).
                    </div>
                    <button
                      onClick={handleApplyToTwin}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl shadow-lg transition flex items-center gap-2"
                    >
                      {injectedSuccess ? '✓ Applied to Active Simulation!' : '🔄 Apply to Live Digital Twin State'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROBABILISTIC CYCLONE CONE */}
          {activeTab === 'cyclone' && (
            <div className="space-y-6">
              <div className="bg-blue-950/20 border border-blue-500/30 rounded-xl p-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-blue-300">Probabilistic Cyclone Track & Cone of Uncertainty</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Displays forward-looking storm progression cones with 70% core confidence and 95% outer margin. Calibrated against IMD and JTWC tropical cyclone advisories for the Indian Ocean basin.
                  </p>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-mono uppercase bg-blue-900/40 text-blue-300 border border-blue-500/30 rounded">
                  probabilistic_geospatial_model
                </span>
              </div>

              {/* Cyclone Selector */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-medium">Active Tropical System:</span>
                <select
                  value={cycloneName}
                  onChange={(e) => {
                    setCycloneName(e.target.value);
                    loadCycloneData(e.target.value);
                  }}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Cyclone Biparjoy">Cyclone Biparjoy (Arabian Sea)</option>
                  <option value="Cyclone Michaung">Cyclone Michaung (Bay of Bengal / Chennai)</option>
                  <option value="Cyclone Remal">Cyclone Remal (West Bengal / Sunderbans)</option>
                  <option value="Cyclone Fani">Super Cyclone Fani (Odisha Coast)</option>
                </select>
              </div>

              {loadingCyclone ? (
                <div className="text-center py-12 text-slate-500 text-xs">Loading Probabilistic Track Cones...</div>
              ) : cycloneData ? (
                <div className="space-y-5">
                  {/* Cyclone Metric Header */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg">
                      <div className="text-[10px] uppercase text-slate-400">Classification</div>
                      <div className="text-sm font-bold text-amber-300 mt-1">{cycloneData.current_intensity}</div>
                    </div>
                    <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg">
                      <div className="text-[10px] uppercase text-slate-400">Central Pressure</div>
                      <div className="text-sm font-bold text-cyan-300 mt-1">{cycloneData.central_pressure_hpa} hPa</div>
                    </div>
                    <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg">
                      <div className="text-[10px] uppercase text-slate-400">Sustained Winds</div>
                      <div className="text-sm font-bold text-red-400 mt-1">{cycloneData.max_sustained_winds_kmh} km/h (Gusts: {cycloneData.max_gust_kmh})</div>
                    </div>
                    <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg">
                      <div className="text-[10px] uppercase text-slate-400">Storm Surge</div>
                      <div className="text-sm font-bold text-blue-400 mt-1">+{cycloneData.storm_surge_predicted_m} m AMSL</div>
                    </div>
                    <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg">
                      <div className="text-[10px] uppercase text-slate-400">Gale Wind Radius</div>
                      <div className="text-sm font-bold text-purple-300 mt-1">{cycloneData.gale_wind_radius_km} km</div>
                    </div>
                  </div>

                  {/* Probabilistic Waypoints Table */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800 text-xs font-semibold text-slate-300">
                      Probabilistic Forecast Track Waypoints (T+0 to T+24h)
                    </div>
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-900/40 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="px-4 py-2">Timeline</th>
                          <th className="px-4 py-2">Status / Forecast</th>
                          <th className="px-4 py-2">Latitude</th>
                          <th className="px-4 py-2">Longitude</th>
                          <th className="px-4 py-2">Peak Wind</th>
                          <th className="px-4 py-2">Cone Spread</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {cycloneData.track_waypoints.map((wp: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-900/40 transition">
                            <td className="px-4 py-2 font-mono text-cyan-400 font-bold">T+{wp.hour}h</td>
                            <td className="px-4 py-2 font-medium text-slate-200">{wp.status}</td>
                            <td className="px-4 py-2 font-mono text-slate-300">{wp.lat.toFixed(4)}° N</td>
                            <td className="px-4 py-2 font-mono text-slate-300">{wp.lng.toFixed(4)}° E</td>
                            <td className="px-4 py-2 text-amber-400 font-bold">{wp.intensity_kmh} km/h</td>
                            <td className="px-4 py-2 text-slate-400">±{(15 + wp.hour * 1.8).toFixed(0)} km (70% CI)</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Evacuation Buffer Callout */}
                  <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-lg text-xs flex items-center justify-between text-amber-200">
                    <div className="flex items-center gap-2">
                      <span>⚠️</span>
                      <span>Mandatory coastal evacuation buffer: <strong>{cycloneData.evacuation_buffer_required_km} km inland</strong> from projected landfall sector.</span>
                    </div>
                    <span className="text-[11px] text-amber-400 font-mono">NDMA SOP Level 3</span>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 3: FLOOD RECESSION SCRUBBER */}
          {activeTab === 'recession' && (
            <div className="space-y-6">
              <div className="bg-teal-950/20 border border-teal-500/30 rounded-xl p-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-teal-300">Hydrological Flood Recession & Dewatering Simulator</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Scrub forward across 72 hours of post-monsoon pumping to observe water volume decay, road re-opening rates, and mobile pumping fleet clearance curves.
                  </p>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-mono uppercase bg-teal-900/40 text-teal-300 border border-teal-500/30 rounded">
                  hydrological_decay_model
                </span>
              </div>

              {/* Interactive Timeline Slider */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-300">
                    Temporal Horizon: <span className="text-teal-400 font-bold font-mono">T+{recessionHour} Hours Post-Peak</span>
                  </div>
                  <div className="flex gap-2">
                    {[0, 6, 12, 24, 48, 72].map((h) => (
                      <button
                        key={h}
                        onClick={() => setRecessionHour(h)}
                        className={`px-2.5 py-1 text-[10px] font-mono rounded ${
                          recessionHour === h
                            ? 'bg-teal-500 text-slate-950 font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        +{h}h
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="range"
                  min={0}
                  max={72}
                  step={1}
                  value={recessionHour}
                  onChange={(e) => setRecessionHour(Number(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer"
                />

                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>T+0h (Peak Flood Depth)</span>
                  <span>T+24h (Major Dewatering)</span>
                  <span>T+48h (Arterial Roads Open)</span>
                  <span>T+72h (Baseline Reset)</span>
                </div>
              </div>

              {/* Dynamic Metrics at T+X */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs text-slate-400">Standing Flood Volume</div>
                  <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">{waterRemainingML.toLocaleString()} ML</div>
                  <div className="text-[10px] text-slate-500 mt-1">Recession: {waterRecededPct}% cleared</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs text-slate-400">Peak Water Level (Lowlands)</div>
                  <div className="text-2xl font-bold text-teal-300 font-mono mt-1">{peakDepthM} m</div>
                  <div className="text-[10px] text-slate-500 mt-1">Original peak: 1.65 m</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs text-slate-400">Urban Road Network Clear</div>
                  <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">{roadClearancePct}%</div>
                  <div className="text-[10px] text-slate-500 mt-1">Passable by emergency transit</div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                  <div className="text-xs text-slate-400">Active Dewatering Discharge</div>
                  <div className="text-2xl font-bold text-blue-400 font-mono mt-1">{pumpDischargeRateM3s} m³/s</div>
                  <div className="text-[10px] text-slate-500 mt-1">28 high-volume dewatering pumps</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BEFORE / AFTER SATELLITE SPLIT */}
          {activeTab === 'satellite' && (
            <div className="space-y-6">
              <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-purple-300">Satellite Change Detection (Optical vs SAR Radar Inundation)</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Side-by-side comparison of baseline dry Sentinel-2 optical imagery against Sentinel-1 C-band Synthetic Aperture Radar (SAR) standing flood vectors.
                  </p>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-mono uppercase bg-purple-900/40 text-purple-300 border border-purple-500/30 rounded">
                  sentinel_sar_overlay
                </span>
              </div>

              {/* Interactive Split Control */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-semibold">⬅ Baseline Dry Terrain (Sentinel-2 L2A)</span>
                  <span className="text-slate-400 font-mono">Split: {splitPercent}%</span>
                  <span className="text-cyan-400 font-semibold">Post-Flood SAR Inundation (Sentinel-1) ➡</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={splitPercent}
                  onChange={(e) => setSplitPercent(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Visual Split Canvas Simulation */}
              <div className="relative h-64 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex">
                {/* Left Side: Dry Baseline */}
                <div
                  className="h-full bg-gradient-to-br from-emerald-950/80 via-slate-900 to-amber-950/50 flex flex-col justify-center items-center text-center p-6 border-r border-cyan-500/50"
                  style={{ width: `${splitPercent}%` }}
                >
                  <div className="text-emerald-400 text-3xl mb-2">🛰️</div>
                  <div className="text-xs font-bold text-emerald-300">PRE-DISASTER OPTICAL BASELINE</div>
                  <div className="text-[10px] text-slate-400 mt-1">Sentinel-2 Multi-spectral • Cloudless dry baseline</div>
                  <div className="mt-4 text-xs font-mono text-slate-300 bg-black/50 px-3 py-1 rounded">
                    Dry Urban Soil Area: 98.4%
                  </div>
                </div>

                {/* Right Side: Inundation SAR */}
                <div
                  className="h-full bg-gradient-to-bl from-blue-950 via-cyan-950/90 to-slate-900 flex flex-col justify-center items-center text-center p-6"
                  style={{ width: `${100 - splitPercent}%` }}
                >
                  <div className="text-cyan-400 text-3xl mb-2">🌊</div>
                  <div className="text-xs font-bold text-cyan-300">POST-EVENT SAR RADAR FLOOD EXTENT</div>
                  <div className="text-[10px] text-slate-400 mt-1">Sentinel-1 C-Band SAR • Cloud-penetrating radar reflection</div>
                  <div className="mt-4 text-xs font-mono text-cyan-200 bg-black/50 px-3 py-1 rounded">
                    Detected Inundation: 14.8 km²
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SENSOR ANOMALY ENGINE */}
          {activeTab === 'anomaly' && (
            <div className="space-y-6">
              <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-amber-300">Real-Time Statistical Sensor Anomaly Scanner</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Evaluates live gauge streams against 100-year historical return baselines. Z-scores greater than 3.0 flag non-linear flash flood dynamics and embankment breach hazards.
                  </p>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-mono uppercase bg-amber-900/40 text-amber-300 border border-amber-500/30 rounded">
                  statistical_ml_anomaly
                </span>
              </div>

              {loadingAnomaly ? (
                <div className="text-center py-12 text-slate-500 text-xs">Scanning Sensor Network for Statistical Deviations...</div>
              ) : anomalyData ? (
                <div className="space-y-4">
                  <div className="text-xs font-semibold text-slate-400">
                    Detected Anomalous Sensor Feeds: <span className="text-red-400 font-bold">{anomalyData.anomalies_detected_count} Active Outliers</span>
                  </div>

                  <div className="space-y-3">
                    {anomalyData.anomalies.map((a: any, idx: number) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-xl p-4 transition">
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-cyan-300">{a.sensor_id}</span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs font-semibold text-slate-200">{a.metric}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-slate-400">Z-Score:</span>
                            <span className="px-2 py-0.5 text-xs font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/40 rounded">
                              +{a.z_score.toFixed(2)} σ
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mb-3">
                          <div>
                            <span className="text-slate-500 block text-[10px]">Current Reading</span>
                            <span className="font-mono font-bold text-amber-300">{a.current_value} {a.unit}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Historical Mean</span>
                            <span className="font-mono text-slate-300">{a.baseline_mean} {a.unit}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Historical Std Dev</span>
                            <span className="font-mono text-slate-300">±{a.historical_std_dev} {a.unit}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Severity</span>
                            <span className="font-bold text-red-400">{a.severity}</span>
                          </div>
                        </div>

                        <div className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                          <div className="text-slate-400 font-medium mb-0.5">⚠️ Alert Notification:</div>
                          <div>{a.alert_message}</div>
                          <div className="text-cyan-400 font-medium mt-1">🔬 Root Cause Hypothesis: {a.root_cause_hypothesis}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 6: CROSS-DISASTER BENCHMARKS */}
          {activeTab === 'benchmarks' && (
            <div className="space-y-6">
              <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-indigo-300">Cross-Disaster Impact Benchmark Matrix</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Standardized comparative analysis across historic Indian catastrophic events to evaluate flood surge severity, structural resilience, and disaster containment efficiency.
                  </p>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-mono uppercase bg-indigo-900/40 text-indigo-300 border border-indigo-500/30 rounded">
                  cross_disaster_benchmark
                </span>
              </div>

              {loadingBenchmark ? (
                <div className="text-center py-12 text-slate-500 text-xs">Loading Benchmark Comparative Matrix...</div>
              ) : benchmarkData ? (
                <div className="space-y-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="px-4 py-3">Disaster Event</th>
                          <th className="px-4 py-3">Region</th>
                          <th className="px-4 py-3">Peak 24h Rain</th>
                          <th className="px-4 py-3">Fatalities</th>
                          <th className="px-4 py-3">Economic Loss</th>
                          <th className="px-4 py-3">Primary Failure Mode</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {benchmarkData.benchmarks.map((b: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-900/50 transition">
                            <td className="px-4 py-3 font-semibold text-cyan-300">{b.event_name}</td>
                            <td className="px-4 py-3 text-slate-300">{b.region}</td>
                            <td className="px-4 py-3 font-mono text-blue-400 font-bold">{b.peak_24h_rainfall_mm} mm</td>
                            <td className="px-4 py-3 font-mono text-red-400 font-bold">{b.casualties.toLocaleString()}</td>
                            <td className="px-4 py-3 font-mono text-amber-300">₹{b.economic_loss_inr_crores.toLocaleString()} Cr</td>
                            <td className="px-4 py-3 text-slate-400 max-w-xs">{b.primary_failure_mode}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Benchmark Takeaways */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs">
                      <span className="text-slate-400 block font-semibold mb-1">Mithi River Basin Vulnerability</span>
                      <p className="text-slate-300 text-[11px]">
                        944 mm in 2005 highlighted tidal choke points. Today, 5 automated dewatering outfalls operate under INCOIS high-tide alert triggers.
                      </p>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs">
                      <span className="text-slate-400 block font-semibold mb-1">Western Ghats Slope Stability</span>
                      <p className="text-slate-300 text-[11px]">
                        2024 Wayanad proved that pore pressure slope saturation above 300 mm requires mandatory 12-hour preemptive night evacuations.
                      </p>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs">
                      <span className="text-slate-400 block font-semibold mb-1">Embankment Health Auditing</span>
                      <p className="text-slate-300 text-[11px]">
                        2022 Silchar dyke failure shows real-time piezometer sensor monitoring prevents municipal catastrophic inundation.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 7: SORTIE CARBON & ENERGY ACCOUNTING */}
          {activeTab === 'carbon' && (
            <div className="space-y-6">
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-emerald-300">Aviation & Maritime Emergency Sortie Carbon Accounting</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Real-time operational energy tracker quantifying aviation turbine fuel (ATF) and marine diesel consumption across IAF helicopters, Coast Guard ALHs, and NDRF motorized rescue rafts.
                  </p>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-mono uppercase bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 rounded">
                  operational_energy_accounting
                </span>
              </div>

              {loadingCarbon ? (
                <div className="text-center py-12 text-slate-500 text-xs">Calculating Fleet Carbon Footprint...</div>
              ) : carbonData ? (
                <div className="space-y-5">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                      <div className="text-xs text-slate-400">Total Fuel Burned</div>
                      <div className="text-2xl font-bold text-amber-400 font-mono mt-1">
                        {carbonData.total_fuel_consumed_kg.toLocaleString()} kg
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">Aviation Turbine Fuel + Marine Diesel</div>
                    </div>
                    <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                      <div className="text-xs text-slate-400">Total Greenhouse Emissions</div>
                      <div className="text-2xl font-bold text-red-400 font-mono mt-1">
                        {carbonData.total_carbon_emissions_tco2e} tCO₂e
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">Direct Scope 1 operational sorties</div>
                    </div>
                    <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                      <div className="text-xs text-slate-400">Total Survivors Rescued</div>
                      <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
                        {carbonData.total_survivors_rescued}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">Winched or evacuated to safety</div>
                    </div>
                    <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                      <div className="text-xs text-slate-400">Humanitarian Carbon Efficiency</div>
                      <div className="text-2xl font-bold text-cyan-300 font-mono mt-1">
                        {carbonData.carbon_efficiency_kg_co2_per_rescue} kg
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">CO₂ emission per rescued survivor</div>
                    </div>
                  </div>

                  {/* Asset-by-Asset Breakdown Table */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800 text-xs font-semibold text-slate-300">
                      Sortie Asset Operations Breakdown
                    </div>
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-900/40 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="px-4 py-2">Asset Callsign</th>
                          <th className="px-4 py-2">Type</th>
                          <th className="px-4 py-2">Agency</th>
                          <th className="px-4 py-2">Operating Hours</th>
                          <th className="px-4 py-2">Fuel (kg)</th>
                          <th className="px-4 py-2">CO₂ (Tonnes)</th>
                          <th className="px-4 py-2">Survivors Rescued</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {carbonData.assets_breakdown.map((a: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-900/40 transition">
                            <td className="px-4 py-2 font-mono text-cyan-300 font-bold">{a.asset_callsign}</td>
                            <td className="px-4 py-2 text-slate-300">{a.type}</td>
                            <td className="px-4 py-2 text-slate-400">{a.agency}</td>
                            <td className="px-4 py-2 font-mono text-slate-300">{a.flight_hours || a.operating_hours} hrs</td>
                            <td className="px-4 py-2 font-mono text-amber-400 font-bold">{a.fuel_burned_kg.toLocaleString()}</td>
                            <td className="px-4 py-2 font-mono text-red-400 font-bold">{a.co2_emissions_tonnes} t</td>
                            <td className="px-4 py-2 font-mono text-emerald-400 font-bold">{a.survivors_winched || a.survivors_evacuated}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Operational Disaster Intelligence Matrix Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          >
            Close Intelligence Suite
          </button>
        </div>
      </div>
    </div>
  );
};
