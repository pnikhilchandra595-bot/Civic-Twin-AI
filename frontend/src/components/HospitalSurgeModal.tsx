import React, { useState } from 'react';
import { 
  Building, X, HeartPulse, ShieldAlert, 
  CheckCircle2, AlertTriangle, ArrowRight, Ambulance, Activity, Zap 
} from 'lucide-react';

interface HospitalSurgeModalProps {
  cityName: string;
  onClose: () => void;
}

export const HospitalSurgeModal: React.FC<HospitalSurgeModalProps> = ({
  cityName,
  onClose
}) => {
  const [hospitals, setHospitals] = useState([
    {
      id: "hosp-1",
      name: "Lokmanya Tilak Municipal General Hospital (Sion)",
      type: "MUNICIPAL_TERTIARY",
      flood_risk: "CRITICAL_INUNDATION",
      water_depth_m: 0.85,
      icu_beds_total: 85,
      icu_beds_occupied: 82,
      oxygen_manifold_hours: 12.0,
      backup_generator_fuel_hours: 14.5,
      requires_evacuation: true
    },
    {
      id: "hosp-2",
      name: "KEM Hospital & Apex Trauma Center (Parel)",
      type: "APEX_TRAUMA_RIDGE",
      flood_risk: "HIGH_GROUND_SAFE",
      water_depth_m: 0.0,
      icu_beds_total: 140,
      icu_beds_occupied: 98,
      oxygen_manifold_hours: 48.0,
      backup_generator_fuel_hours: 56.0,
      requires_evacuation: false
    },
    {
      id: "hosp-3",
      name: "BYL Nair Charitable Hospital (Mumbai Central)",
      type: "SECONDARY_SURGE",
      flood_risk: "WARNING",
      water_depth_m: 0.22,
      icu_beds_total: 65,
      icu_beds_occupied: 45,
      oxygen_manifold_hours: 28.0,
      backup_generator_fuel_hours: 32.0,
      requires_evacuation: false
    }
  ]);

  const [evacuationScheduled, setEvacuationScheduled] = useState<boolean>(false);

  const handleTriggerGreenCorridor = () => {
    setEvacuationScheduled(true);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none">
      <div className="hud-panel w-full max-w-4xl rounded-2xl border border-cyan-500/40 p-6 flex flex-col space-y-4 shadow-[0_0_60px_rgba(0,210,255,0.25)] bg-[#090e1a] text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                <span>Hospital ICU & Oxygen Evacuation Surge Center</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-950 border border-red-600 text-red-300 font-mono">
                  108 EMS PROTOCOL
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Real-Time Ventilator Reserves, Generator Fuel Tracking & Automated Patient Transfer
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hospital Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          {hospitals.map((h) => (
            <div
              key={h.id}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                h.flood_risk === 'CRITICAL_INUNDATION'
                  ? 'bg-rose-950/30 border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    h.flood_risk === 'CRITICAL_INUNDATION'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {h.flood_risk}
                  </span>
                  <span className="text-[10px] text-slate-400">{h.type}</span>
                </div>
                <h3 className="font-bold text-white text-xs leading-snug">{h.name}</h3>
              </div>

              <div className="space-y-1.5 text-[11px] bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">ICU Bed Occupancy:</span>
                  <strong className={h.icu_beds_occupied >= h.icu_beds_total * 0.9 ? "text-rose-400" : "text-cyan-300"}>
                    {h.icu_beds_occupied} / {h.icu_beds_total} Beds
                  </strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Oxygen Manifold:</span>
                  <strong className={h.oxygen_manifold_hours <= 15 ? "text-rose-400 font-bold" : "text-emerald-400"}>
                    {h.oxygen_manifold_hours} Hours Left
                  </strong>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Backup Generator:</span>
                  <strong className={h.backup_generator_fuel_hours <= 18 ? "text-amber-400 font-bold" : "text-emerald-400"}>
                    {h.backup_generator_fuel_hours} Hours Fuel
                  </strong>
                </div>
              </div>

              {h.requires_evacuation && (
                <div className="p-2 rounded-lg bg-rose-900/40 border border-rose-600/50 text-[10px] text-rose-200 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Ground floor flooded ({h.water_depth_m}m) — Requires priority transfer!</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Automated Transfer & Green Corridor Banner */}
        <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Ambulance className="w-5 h-5 text-cyan-400 animate-bounce" />
              <div>
                <span className="font-bold text-white block">Automated ICU Evacuation Matching:</span>
                <span className="text-slate-400 text-[11px]">
                  Transfer <strong>12 Critical ICU Patients</strong> from Sion Hospital ➔ KEM Hospital Ridge
                </span>
              </div>
            </div>

            <button
              onClick={handleTriggerGreenCorridor}
              disabled={evacuationScheduled}
              className={`px-4 py-2 rounded-xl font-bold transition-all shadow-lg flex items-center space-x-1.5 ${
                evacuationScheduled
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-600 hover:bg-rose-500 text-white'
              }`}
            >
              {evacuationScheduled ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
              <span>{evacuationScheduled ? 'Green Corridor Enforced' : 'Enforce 108 Green Corridor Wave'}</span>
            </button>
          </div>

          {evacuationScheduled && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-[11px] flex items-center justify-between">
              <span>✅ Traffic Signals synced for Green Wave on Dr. Ambedkar Road (ETA: 8.5 mins per transfer)</span>
              <span className="font-bold">6 x 108 ALS Ambulances En Route</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
