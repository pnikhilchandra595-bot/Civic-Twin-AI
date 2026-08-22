import React, { useState } from 'react';
import { CityDigitalTwinState, DispatchUnit, NodeType } from '../types/digital_twin';
import { 
  ShieldAlert, Radio, Send, CheckCircle2, 
  Users, Truck, Droplets, Zap, Shield, AlertTriangle, ChevronRight, Activity 
} from 'lucide-react';
import { apiService } from '../services/api';

interface IncidentCommanderPanelProps {
  state: CityDigitalTwinState | null;
  onSelectNodeById?: (nodeId: string) => void;
}

export const IncidentCommanderPanel: React.FC<IncidentCommanderPanelProps> = ({
  state,
  onSelectNodeById
}) => {
  const [dispatchingUnitId, setDispatchingUnitId] = useState<string | null>(null);
  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null);

  if (!state) return null;

  const iap = state.iap;

  const handleDeployUnit = async (unitId: string, targetNodeId: string, mission: string) => {
    try {
      setDispatchingUnitId(unitId);
      await apiService.dispatchUnit(unitId, targetNodeId, mission);
      setDispatchSuccess(`Unit ${unitId} dispatched successfully to ${targetNodeId}`);
      setTimeout(() => setDispatchSuccess(null), 4000);
    } catch (err) {
      console.error('Dispatch failed', err);
    } finally {
      setDispatchingUnitId(null);
    }
  };

  return (
    <div className="w-full h-full bg-[#080c14] p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-white tracking-wide flex items-center space-x-2">
              <ShieldAlert className="w-6 h-6 text-cyan-400" />
              <span>AI Incident Command System (FEMA ICS-201/202)</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              {iap.iap_id}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous Incident Action Plan (IAP) synthesis based on real-time flood progression and cascade vulnerability trees.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-3 py-1.5 rounded-lg bg-[#0e1524] border border-[#1f2c44] text-xs font-mono text-slate-300">
            <span className="text-slate-500">OPERATIONAL PERIOD:</span> <span className="text-cyan-300 font-bold">{iap.operational_period}</span>
          </div>
        </div>
      </div>

      {dispatchSuccess && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{dispatchSuccess}</span>
        </div>
      )}

      {/* Commander SITREP Executive Brief */}
      <div className="hud-panel-glow p-5 rounded-2xl mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>Incident Commander Situation Report (SITREP)</span>
          </span>
          <span className="text-[10px] font-mono text-slate-500">{iap.timestamp}</span>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed font-sans">
          {iap.incident_commander_summary}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Strategic Objectives & Agency Task Matrix */}
        <div className="lg:col-span-2 space-y-6">
          {/* Strategic Objectives */}
          <div className="hud-panel p-5 rounded-2xl">
            <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wide font-mono text-cyan-300">
              Strategic Response Objectives
            </h3>
            <div className="space-y-2.5">
              {iap.strategic_objectives.map((obj, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start space-x-3 text-xs text-slate-200">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1 flex-shrink-0" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Agency Tasking Matrix */}
          <div className="hud-panel p-5 rounded-2xl">
            <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wide font-mono text-cyan-300">
              Multi-Agency Operational Tasking
            </h3>
            <div className="space-y-4">
              {Object.entries(iap.agency_tasks).map(([agency, tasks]) => (
                <div key={agency} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold font-mono text-white flex items-center space-x-2">
                      <Shield className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{agency}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{tasks.length} active directives</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {tasks.map((task, tIdx) => (
                      <li key={tIdx} className="flex items-start space-x-2">
                        <ChevronRight className="w-3 h-3 text-slate-500 mt-0.5 flex-shrink-0" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Tactical Resource Dispatch & Moving Units */}
        <div className="space-y-6">
          {/* Active Emergency Dispatch Units */}
          <div className="hud-panel p-5 rounded-2xl">
            <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wide font-mono text-cyan-300 flex items-center justify-between">
              <span>Tactical Units & Assets</span>
              <span className="text-[10px] text-slate-400 font-mono">{state.dispatch_units.length} Staged</span>
            </h3>

            <div className="space-y-3">
              {state.dispatch_units.map(unit => {
                const isEnRoute = unit.status === 'en_route';
                const isOnScene = unit.status === 'on_scene';

                return (
                  <div key={unit.unit_id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Truck className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-white font-mono">{unit.callsign}</span>
                      </div>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                        isOnScene ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                        isEnRoute ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse' :
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {unit.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300">
                      {unit.assigned_mission}
                    </p>

                    {isEnRoute && unit.eta_min && (
                      <div className="text-[10px] font-mono text-cyan-400">
                        ETA to Scene: {unit.eta_min.toFixed(1)} mins
                      </div>
                    )}

                    {unit.status === 'standby' && (
                      <div className="pt-1 flex gap-2">
                        <button
                          onClick={() => handleDeployUnit(unit.unit_id, 'node-sub-alpha', 'Emergency Dewatering Deployment')}
                          disabled={dispatchingUnitId === unit.unit_id}
                          className="w-full py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/50 text-cyan-200 text-xs font-mono font-semibold flex items-center justify-center space-x-1 transition-all"
                        >
                          <Send className="w-3 h-3" />
                          <span>Dispatch to Hotspot</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Allocated Resource Summary */}
          <div className="hud-panel p-5 rounded-2xl">
            <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wide font-mono text-cyan-300">
              Allocated Equipment Matrix
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {Object.entries(iap.allocated_resources).map(([resName, count]) => (
                <div key={resName} className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px] truncate">{resName}</div>
                  <div className="text-base font-bold text-cyan-300">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
