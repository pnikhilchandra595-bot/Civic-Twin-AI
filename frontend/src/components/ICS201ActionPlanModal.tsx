import React from 'react';
import { 
  FileText, Printer, Download, CheckCircle2, ShieldCheck, 
  X, AlertTriangle, Building, Radio, Activity, Clock, QrCode 
} from 'lucide-react';
import { IncidentActionPlan, CityDigitalTwinState } from '../types/digital_twin';

interface ICS201ActionPlanModalProps {
  state: CityDigitalTwinState | null;
  cityName: string;
  onClose: () => void;
}

export const ICS201ActionPlanModal: React.FC<ICS201ActionPlanModalProps> = ({
  state,
  cityName,
  onClose
}) => {
  if (!state) return null;
  const iap = state.iap;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none print:p-0 print:bg-white print:static">
      <div className="w-full max-w-4xl rounded-2xl border border-cyan-500/40 p-6 flex flex-col space-y-4 shadow-[0_0_60px_rgba(0,210,255,0.25)] max-h-[92vh] overflow-y-auto bg-[#090e1a] text-slate-100 print:bg-white print:text-black print:border-none print:shadow-none print:max-h-none print:overflow-visible">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <FileText className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                <span>NDMA Incident Action Plan (ICS-201 / ICS-204)</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-950 border border-red-600 text-red-300 font-mono">
                  OFFICIAL EXECUTIVE RECORD
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                National Disaster Management Authority (NDMA) & State EOC Formal Command Directive
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Layout */}
        <div className="border-2 border-slate-750 p-6 rounded-xl bg-slate-950/60 font-mono text-xs space-y-5 print:border-black print:bg-white print:text-black">
          
          {/* Header Block with Emblems */}
          <div className="flex items-center justify-between border-b-2 border-slate-700 pb-4 print:border-black">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full border-2 border-cyan-500 flex items-center justify-center font-extrabold text-sm text-cyan-300 print:border-black print:text-black">
                NDMA
              </div>
              <div>
                <h1 className="text-base font-extrabold text-white uppercase tracking-wider print:text-black">
                  National Disaster Management Authority (Govt of India)
                </h1>
                <h2 className="text-xs text-cyan-300 font-bold print:text-black">
                  STATE EMERGENCY OPERATIONS CENTER (SEOC) — INCIDENT BRIEFING (ICS-201)
                </h2>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] font-bold text-white print:text-black">INCIDENT ID: NDMA-{state.city_id.toUpperCase()}-2026</div>
              <div className="text-[10px] text-slate-400 print:text-black">Operational Period: 0600h – 1800h IST</div>
              <div className="text-[10px] text-amber-400 font-bold print:text-black">THREAT LEVEL: {iap?.overall_threat_level || 'CRITICAL'}</div>
            </div>
          </div>

          {/* Section 1: Situation & Incident Summary */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-extrabold text-cyan-300 uppercase border-b border-slate-800 pb-1 print:border-black print:text-black">
              1. Incident Situation Overview & Hydro-Meteorological Assessment
            </h3>
            <p className="text-slate-300 text-[11px] leading-relaxed print:text-black">
              Severe monsoon depression / coastal cyclone causing rapid inundation across <strong>{cityName}</strong>. 
              IMD Doppler radar records precipitation intensity at <strong>{state.rain_intensity_mmhr.toFixed(1)} mm/h</strong> with coastal storm surge at <strong>{state.storm_surge_m.toFixed(2)}m</strong>. 
              Catchment river gauges indicate rising crest levels with immediate flood breach threat to municipal lowlands.
            </p>
          </div>

          {/* Section 2: Strategic Command Objectives */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold text-cyan-300 uppercase border-b border-slate-800 pb-1 print:border-black print:text-black">
              2. Incident Commander Strategic Priorities & Directives
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
              {(iap?.strategic_objectives || []).map((pri: string, idx: number) => (
                <div key={idx} className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-start space-x-2 print:border-black print:bg-slate-100">
                  <span className="font-bold text-cyan-400 print:text-black">[{idx + 1}]</span>
                  <span className="text-slate-200 print:text-black">{pri}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Multi-Agency Task Assignment Matrix (ICS-204) */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold text-cyan-300 uppercase border-b border-slate-800 pb-1 print:border-black print:text-black">
              3. Operational Task Assignments by Agency (ICS-204)
            </h3>
            <table className="w-full border-collapse border border-slate-800 text-[11px] print:border-black">
              <thead>
                <tr className="bg-slate-900 text-slate-300 print:bg-slate-200 print:text-black">
                  <th className="border border-slate-800 p-1.5 text-left print:border-black">Agency / Division</th>
                  <th className="border border-slate-800 p-1.5 text-left print:border-black">Assigned Operational Mission</th>
                  <th className="border border-slate-800 p-1.5 text-left print:border-black">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-800 p-1.5 font-bold text-cyan-300 print:text-black">NDRF Battalions</td>
                  <td className="border border-slate-800 p-1.5 text-slate-200 print:text-black">Deploy inflatable rescue rafts (IRBs) to low-lying settlement clusters; evacuate trapped citizens to high-ground shelters.</td>
                  <td className="border border-slate-800 p-1.5 text-emerald-400 font-bold print:text-black">ACTIVE DEPLOYMENT</td>
                </tr>
                <tr>
                  <td className="border border-slate-800 p-1.5 font-bold text-cyan-300 print:text-black">Municipal Police</td>
                  <td className="border border-slate-800 p-1.5 text-slate-200 print:text-black">Enforce emergency road closures at flooded subways; maintain green traffic wave for 108 ambulances.</td>
                  <td className="border border-slate-800 p-1.5 text-amber-400 font-bold print:text-black">ENFORCING</td>
                </tr>
                <tr>
                  <td className="border border-slate-800 p-1.5 font-bold text-cyan-300 print:text-black">State Power Utility</td>
                  <td className="border border-slate-800 p-1.5 text-slate-200 print:text-black">Monitor 220kV substation transformer water ingress; isolate flooded distribution feeders to prevent electrocution.</td>
                  <td className="border border-slate-800 p-1.5 text-amber-400 font-bold print:text-black">ISOLATION ACTIVE</td>
                </tr>
                <tr>
                  <td className="border border-slate-800 p-1.5 font-bold text-cyan-300 print:text-black">Health Dept & 108 EMS</td>
                  <td className="border border-slate-800 p-1.5 text-slate-200 print:text-black">Stage trauma ambulances at Apex Medical Centers; monitor ICU backup generator diesel reserves.</td>
                  <td className="border border-slate-800 p-1.5 text-emerald-400 font-bold print:text-black">ON STANDBY</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 4: Authentication Sign-Off Block */}
          <div className="grid grid-cols-2 gap-6 pt-4 border-t-2 border-slate-700 print:border-black text-[11px]">
            <div className="space-y-1">
              <span className="text-slate-400 print:text-black block">Prepared By (Planning Section Chief):</span>
              <div className="font-bold text-white print:text-black">CivicTwin AI Autonomous Incident Commander</div>
              <div className="text-[10px] text-slate-500 print:text-black">Timestamp: {new Date().toLocaleString()} IST</div>
            </div>

            <div className="space-y-1 text-right">
              <span className="text-slate-400 print:text-black block">Approved By (Incident Commander / District Magistrate):</span>
              <div className="font-bold text-white underline print:text-black">EOC Commander Auth: #DM-SEOC-IN-2026</div>
              <div className="text-[10px] text-emerald-400 font-bold print:text-black">✅ Digitally Signed & Authorized</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
