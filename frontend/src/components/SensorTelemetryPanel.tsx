import React, { useState } from 'react';
import { CityDigitalTwinState, SensorReading, NodeStatus } from '../types/digital_twin';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, CartesianGrid, LineChart, Line 
} from 'recharts';
import { 
  Activity, Droplets, Wind, Waves, Gauge, 
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2 
} from 'lucide-react';

interface SensorTelemetryPanelProps {
  state: CityDigitalTwinState | null;
  onSelectSensor?: (sensor: SensorReading) => void;
}

export const SensorTelemetryPanel: React.FC<SensorTelemetryPanelProps> = ({
  state,
  onSelectSensor
}) => {
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);

  if (!state) return null;

  const selectedSensor = state.sensors.find(s => s.sensor_id === selectedSensorId) || state.sensors[0];

  // Format historical series data for Recharts
  const chartData = selectedSensor?.history.map((val, idx) => ({
    time: `T-${(selectedSensor.history.length - idx) * 15}m`,
    value: val,
    warning: selectedSensor.threshold_warning,
    critical: selectedSensor.threshold_critical
  })) || [];

  const getStatusBadge = (status: NodeStatus) => {
    switch (status) {
      case 'critical':
      case 'submerged':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'warning':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'operational':
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'water_level_gauge':
        return <Waves className="w-4 h-4 text-cyan-400" />;
      case 'storm_drain_flow':
        return <Droplets className="w-4 h-4 text-blue-400" />;
      case 'soil_moisture':
        return <Gauge className="w-4 h-4 text-emerald-400" />;
      case 'wind_weather':
        return <Wind className="w-4 h-4 text-amber-400" />;
      default:
        return <Activity className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="w-full h-full bg-[#080c14] p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-white tracking-wide">
              Live IoT Sensor Telemetry & Anomaly Grid
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              {state.sensors.length} Real-Time Channels
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time streaming telemetry from hydrological water gauges, drainage flowmeters, soil saturation, and weather stations.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-bold">100Hz WebSocket Telemetry Active</span>
        </div>
      </div>

      {/* Main Grid: Left Sensor List, Right Detailed Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sensor List (Left) */}
        <div className="space-y-3">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Connected Sensor Array
          </div>

          {state.sensors.map(sensor => {
            const isSelected = selectedSensor?.sensor_id === sensor.sensor_id;
            const pctCritical = Math.min(100, Math.round((sensor.current_value / sensor.threshold_critical) * 100));

            return (
              <div
                key={sensor.sensor_id}
                onClick={() => setSelectedSensorId(sensor.sensor_id)}
                className={`hud-panel p-3.5 rounded-xl cursor-pointer transition-all ${
                  isSelected ? 'hud-panel-glow border-cyan-400' : 'hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      {getSensorIcon(sensor.sensor_type)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{sensor.name}</div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">
                        {sensor.sensor_type.replace(/_/g, ' ')}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-extrabold font-mono text-cyan-300">
                      {sensor.current_value} <span className="text-[10px] text-slate-400">{sensor.unit}</span>
                    </div>
                    <span className={`text-[9px] uppercase font-mono px-1.5 py-0.2 rounded border ${getStatusBadge(sensor.status)}`}>
                      {sensor.status}
                    </span>
                  </div>
                </div>

                {/* Progress bar to critical threshold */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>Critical Threshold: {sensor.threshold_critical} {sensor.unit}</span>
                    <span className={pctCritical >= 90 ? 'text-red-400 font-bold' : 'text-slate-400'}>
                      {pctCritical}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pctCritical >= 90
                          ? 'bg-red-500'
                          : pctCritical >= 70
                          ? 'bg-amber-400'
                          : 'bg-cyan-400'
                      }`}
                      style={{ width: `${pctCritical}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Sensor High-Resolution Chart (Right 2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {selectedSensor && (
            <div className="hud-panel p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                    {getSensorIcon(selectedSensor.sensor_type)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedSensor.name}</h3>
                    <p className="text-xs font-mono text-slate-400">
                      Sensor ID: {selectedSensor.sensor_id} • Lat: {selectedSensor.lat.toFixed(4)}, Lng: {selectedSensor.lng.toFixed(4)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-2xl font-black font-mono text-cyan-300">
                      {selectedSensor.current_value} {selectedSensor.unit}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 flex items-center justify-end space-x-1">
                      {selectedSensor.trend === 'rising' ? (
                        <>
                          <TrendingUp className="w-3 h-3 text-red-400" />
                          <span className="text-red-400">Rising Trend</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Stable</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* High-Resolution Area Chart */}
              <div className="h-72 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="sensorValGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#00d2ff" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2c44" />
                    <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 'auto']} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0e1524', borderColor: '#1f2c44', borderRadius: '8px', fontSize: '12px' }}
                      itemStyle={{ color: '#00d2ff' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#00d2ff"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#sensorValGrad)"
                      name={`Reading (${selectedSensor.unit})`}
                    />
                    <Line
                      type="monotone"
                      dataKey="warning"
                      stroke="#f59e0b"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      dot={false}
                      name={`Warning Threshold (${selectedSensor.threshold_warning})`}
                    />
                    <Line
                      type="monotone"
                      dataKey="critical"
                      stroke="#ef4444"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      dot={false}
                      name={`Critical Threshold (${selectedSensor.threshold_critical})`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Threshold & Calibration Stats */}
              <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-slate-800 text-xs font-mono">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                  <div className="text-slate-400">Operational Base</div>
                  <div className="text-sm font-bold text-slate-200 mt-1">Normal Range</div>
                </div>
                <div className="p-3 bg-amber-950/30 rounded-xl border border-amber-800/40">
                  <div className="text-amber-400">Warning Trigger</div>
                  <div className="text-sm font-bold text-amber-200 mt-1">≥ {selectedSensor.threshold_warning} {selectedSensor.unit}</div>
                </div>
                <div className="p-3 bg-red-950/30 rounded-xl border border-red-800/40">
                  <div className="text-red-400">Critical Alarm</div>
                  <div className="text-sm font-bold text-red-200 mt-1">≥ {selectedSensor.threshold_critical} {selectedSensor.unit}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
