import React, { useState } from 'react';
import { InfrastructureNode, SensorReading, NodeStatus, NodeType } from '../types/digital_twin';
import { 
  X, Shield, Zap, Droplets, Activity, 
  Clock, AlertTriangle, CheckCircle, Navigation, Send 
} from 'lucide-react';
import { apiService } from '../services/api';

interface NodeInspectorModalProps {
  node: InfrastructureNode | null;
  sensor: SensorReading | null;
  onClose: () => void;
}

export const NodeInspectorModal: React.FC<NodeInspectorModalProps> = ({
  node,
  sensor,
  onClose
}) => {
  if (!node && !sensor) return null;

  const item = node || sensor;
  const isNode = Boolean(node);

  const getStatusColor = (status: NodeStatus) => {
    switch (status) {
      case 'submerged':
      case 'critical':
        return 'text-red-400 bg-red-500/20 border-red-500/40';
      case 'isolated':
        return 'text-purple-400 bg-purple-500/20 border-purple-500/40';
      case 'warning':
        return 'text-amber-400 bg-amber-500/20 border-amber-500/40';
      default:
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40';
    }
  };

  const [selectedUnitType, setSelectedUnitType] = useState<string>(() => {
    if (!node) return 'unit-pump-1';
    if (node.node_type === 'hospital') return 'unit-amb-1';
    if (node.node_type === 'substation') return 'unit-fire-1';
    if (node.node_type === 'dam_levee' || node.status === 'submerged' || node.status === 'critical') return 'unit-raft-1';
    return 'unit-pump-1';
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);

  const handleDeployAction = async () => {
    if (!node) return;
    setIsDeploying(true);
    try {
      await apiService.dispatchUnit(selectedUnitType, node.id, `Emergency Tactical Response for ${node.name}`);
      setDeploySuccess(true);
      setTimeout(() => {
        setDeploySuccess(false);
        setIsDeploying(false);
        onClose();
      }, 1400);
    } catch (e) {
      console.error('Deploy error:', e);
      setIsDeploying(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[#0a0f1d]/95 backdrop-blur-xl border-l border-[#1f2c44] shadow-2xl z-50 flex flex-col p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            {isNode ? <Shield className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">
              {item?.name}
            </h3>
            <span className="text-[10px] font-mono text-slate-400 uppercase">
              {isNode ? (node?.node_type.replace(/_/g, ' ') || '') : 'IoT Live Sensor'}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content */}
      <div className="py-5 space-y-5 flex-1">
        {/* Status Badge */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-mono">Operational Condition</span>
          <span className={`text-xs uppercase font-mono font-bold px-2.5 py-1 rounded border ${getStatusColor(item!.status)}`}>
            {item!.status}
          </span>
        </div>

        {/* Node Metrics */}
        {node && (
          <>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-slate-500">Elevation</div>
                <div className="text-base font-bold text-slate-200 mt-0.5">{node.elevation_m} m</div>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-slate-500">Water Depth</div>
                <div className={`text-base font-bold mt-0.5 ${node.flood_depth_m > 0.2 ? 'text-red-400' : 'text-cyan-300'}`}>
                  {node.flood_depth_m.toFixed(2)} m
                </div>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-slate-500">Vulnerability Index</div>
                <div className="text-base font-bold text-amber-400 mt-0.5">
                  {(node.vulnerability_index * 100).toFixed(0)}%
                </div>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-slate-500">Backup Generator</div>
                <div className={`text-base font-bold mt-0.5 ${node.backup_power_active ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {node.backup_power_active ? `${node.backup_power_hours}h fuel` : 'Grid Online'}
                </div>
              </div>
            </div>

            {/* Capacity / Population */}
            {node.capacity_total > 0 && (
              <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Facility Capacity</span>
                  <span className="text-cyan-300 font-bold">{node.capacity_used} / {node.capacity_total}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full"
                    style={{ width: `${Math.min(100, (node.capacity_used / node.capacity_total) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Specific Node Details */}
            {Object.keys(node.details).length > 0 && (
              <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                <div className="text-xs font-mono font-bold text-cyan-300 uppercase">Asset Specifications</div>
                <div className="space-y-1 text-xs text-slate-300 font-mono">
                  {Object.entries(node.details).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-slate-500 capitalize">{k.replace(/_/g, ' ')}:</span>
                      <span>{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Sensor Details */}
        {sensor && (
          <div className="space-y-3 font-mono text-xs">
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
              <div className="text-slate-400">Current Reading</div>
              <div className="text-3xl font-extrabold text-cyan-300 mt-1">
                {sensor.current_value} <span className="text-sm font-normal text-slate-400">{sensor.unit}</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Trend: {sensor.trend.toUpperCase()}</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-amber-950/20 border border-amber-800/30 rounded-xl">
                <div className="text-amber-400 text-[10px]">Warning Level</div>
                <div className="text-sm font-bold text-amber-200">{sensor.threshold_warning} {sensor.unit}</div>
              </div>
              <div className="p-3 bg-red-950/20 border border-red-800/30 rounded-xl">
                <div className="text-red-400 text-[10px]">Critical Alarm</div>
                <div className="text-sm font-bold text-red-200">{sensor.threshold_critical} {sensor.unit}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      {isNode && (
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400 font-bold uppercase flex items-center justify-between">
              <span>Select Tactical Strike Asset:</span>
              <span className="text-cyan-400 font-mono text-[10px]">Instant 108 / NDRF Link</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
              {[
                { id: 'unit-amb-1', label: '🚑 108 Ambulance' },
                { id: 'unit-raft-1', label: '🚤 NDRF Gemini Raft' },
                { id: 'unit-fire-1', label: '🚒 Heavy Fire Tender' },
                { id: 'unit-pump-1', label: '🚛 Dewatering Pump' },
              ].map(u => (
                <button
                  key={u.id}
                  onClick={() => setSelectedUnitType(u.id)}
                  type="button"
                  className={`p-2 rounded-xl text-left text-[11px] font-bold border transition-all cursor-pointer ${
                    selectedUnitType === u.id
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(0,210,255,0.2)]'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleDeployAction}
            disabled={isDeploying || deploySuccess}
            className={`w-full py-3 rounded-xl text-white text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              deploySuccess
                ? 'bg-emerald-600 shadow-[0_0_25px_rgba(16,185,129,0.5)]'
                : isDeploying
                ? 'bg-cyan-700 animate-pulse'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-[0_0_20px_rgba(0,210,255,0.3)]'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>
              {deploySuccess
                ? '✅ DISPATCHED & PUSHED TO HEAD MOBILE APP!'
                : isDeploying
                ? 'TRANSMITTING DISPATCH TO HEAD MOBILE APP...'
                : 'Deploy Emergency Asset to Location'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
