import React, { useState } from 'react';
import { CityDigitalTwinState, CascadeLink, NodeStatus, NodeType } from '../types/digital_twin';
import { 
  AlertOctagon, Zap, Droplets, ShieldAlert, ArrowRight, 
  Clock, CheckCircle, AlertTriangle, ChevronRight, Activity, Flame
} from 'lucide-react';

interface CascadeFailureGraphProps {
  state: CityDigitalTwinState | null;
  onSelectNodeById?: (nodeId: string) => void;
}

export const CascadeFailureGraph: React.FC<CascadeFailureGraphProps> = ({
  state,
  onSelectNodeById
}) => {
  const [selectedLink, setSelectedLink] = useState<CascadeLink | null>(null);

  if (!state) return null;

  const nodeMap = new Map(state.nodes.map(n => [n.id, n]));

  // Group cascade links by level or trigger type
  const level1Links = state.cascade_links.filter(l => l.cascade_level === 1);
  const level2Links = state.cascade_links.filter(l => l.cascade_level === 2);
  const level3Links = state.cascade_links.filter(l => l.cascade_level >= 3);

  const getTriggerIcon = (triggerType: string) => {
    switch (triggerType) {
      case 'grid_power_failure':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'potable_water_risk':
        return <Droplets className="w-4 h-4 text-blue-400" />;
      case 'arterial_bridge_cutoff':
      case 'emergency_access_severed':
        return <AlertOctagon className="w-4 h-4 text-rose-400" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-red-400" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'disaster':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'warning':
      default:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
  };

  return (
    <div className="w-full h-full bg-[#080c14] p-6 overflow-y-auto">
      {/* Header Summary */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-white tracking-wide">
              Cascade Infrastructure Failure Analyzer
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-red-500/20 text-red-400 border border-red-500/40">
              {state.cascade_links.length} Active Cascades
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-hazard dependency propagation across power, water, roads, medical trauma, and population centers.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400 hud-panel px-3 py-1.5 rounded-lg">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Power Grid</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Road/Bridge Cutoff</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Water System</span>
          </span>
        </div>
      </div>

      {state.cascade_links.length === 0 ? (
        <div className="hud-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center">
          <CheckCircle className="w-12 h-12 text-emerald-400 mb-3" />
          <h3 className="text-base font-bold text-slate-200">No Active Cascade Failures Detected</h3>
          <p className="text-xs text-slate-400 max-w-md mt-1">
            Infrastructure networks are currently within normal operating safety margins. Use the Scenario Sandbox to simulate heavy precipitation, storm surge, or levee rupture events.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Primary Triggers (Level 1) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Level 1: Hazard Impact & Rupture
              </span>
              <span className="text-[10px] font-mono text-slate-500">{level1Links.length} events</span>
            </div>

            {level1Links.length === 0 && (
              <div className="hud-panel p-4 rounded-xl text-center text-xs text-slate-500">
                Primary assets holding within resilience tolerances.
              </div>
            )}

            {level1Links.map(link => {
              const sourceNode = nodeMap.get(link.source_id);
              const targetNode = nodeMap.get(link.target_id);
              const isSelected = selectedLink?.id === link.id;

              return (
                <div
                  key={link.id}
                  onClick={() => setSelectedLink(link)}
                  className={`hud-panel p-4 rounded-xl cursor-pointer transition-all ${
                    isSelected ? 'hud-panel-glow border-cyan-400' : 'hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        {getTriggerIcon(link.trigger_type)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{sourceNode?.name || link.source_id}</div>
                        <div className="text-[10px] font-mono text-slate-400">Trigger: {link.trigger_type}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${getSeverityBadge(link.severity)}`}>
                      {link.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2.5 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    {link.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>Onset: T+{link.time_offset_min}m</span>
                    </span>
                    <span className="text-cyan-400 hover:underline flex items-center">
                      Inspect <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Column 2: Secondary Cascades (Level 2) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Level 2: Power, Bridge & Logistics Severance
              </span>
              <span className="text-[10px] font-mono text-slate-500">{level2Links.length} events</span>
            </div>

            {level2Links.map(link => {
              const sourceNode = nodeMap.get(link.source_id);
              const targetNode = nodeMap.get(link.target_id);
              const isSelected = selectedLink?.id === link.id;

              return (
                <div
                  key={link.id}
                  onClick={() => setSelectedLink(link)}
                  className={`hud-panel p-4 rounded-xl cursor-pointer transition-all ${
                    isSelected ? 'hud-panel-glow border-cyan-400' : 'hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        {getTriggerIcon(link.trigger_type)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{targetNode?.name || link.target_id}</div>
                        <div className="text-[10px] font-mono text-slate-400">Dep. on {sourceNode?.name || link.source_id}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${getSeverityBadge(link.severity)}`}>
                      {link.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2.5 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    {link.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>Onset: T+{link.time_offset_min}m</span>
                    </span>
                    <span className="text-amber-400 hover:underline flex items-center">
                      Mitigate <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Column 3: Tertiary Cascades (Level 3 - Trauma & Populations) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                Level 3: Critical Healthcare & Population Isolation
              </span>
              <span className="text-[10px] font-mono text-slate-500">{level3Links.length} events</span>
            </div>

            {level3Links.map(link => {
              const sourceNode = nodeMap.get(link.source_id);
              const targetNode = nodeMap.get(link.target_id);
              const isSelected = selectedLink?.id === link.id;

              return (
                <div
                  key={link.id}
                  onClick={() => setSelectedLink(link)}
                  className={`hud-panel p-4 rounded-xl cursor-pointer transition-all ${
                    isSelected ? 'hud-panel-glow border-cyan-400' : 'hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        {getTriggerIcon(link.trigger_type)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{targetNode?.name || link.target_id}</div>
                        <div className="text-[10px] font-mono text-rose-400 font-semibold">Population / Trauma At Risk</div>
                      </div>
                    </div>
                    <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${getSeverityBadge(link.severity)}`}>
                      {link.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2.5 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    {link.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-rose-400" />
                      <span>Onset: T+{link.time_offset_min}m</span>
                    </span>
                    <span className="text-rose-400 hover:underline flex items-center">
                      AI Priority 1 <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
