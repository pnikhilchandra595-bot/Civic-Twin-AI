import React, { useState } from 'react';
import { CityDigitalTwinState, SimulationControlCommand } from '../types/digital_twin';
import { 
  Play, Pause, FastForward, RotateCcw, CloudRain, 
  Waves, Wind, Zap, AlertTriangle, CheckCircle, Sliders, StepForward 
} from 'lucide-react';
import { apiService } from '../services/api';

interface ScenarioSandboxProps {
  state: CityDigitalTwinState | null;
  isPlaying: boolean;
  playbackSpeed: number;
  onTogglePlayback: () => void;
  onSetSpeed: (speed: number) => void;
}

export const ScenarioSandbox: React.FC<ScenarioSandboxProps> = ({
  state,
  isPlaying,
  playbackSpeed,
  onTogglePlayback,
  onSetSpeed
}) => {
  const [injecting, setInjecting] = useState<string | null>(null);

  if (!state) return null;

  const handleSliderChange = (key: keyof SimulationControlCommand, value: any) => {
    apiService.sendControl({ [key]: value });
  };

  const handleInject = async (eventType: string) => {
    try {
      setInjecting(eventType);
      await apiService.injectScenario(eventType);
    } catch (e) {
      console.error('Inject error', e);
    } finally {
      setInjecting(null);
    }
  };

  const handleStep = async () => {
    await apiService.setPlayback('step');
  };

  return (
    <div className="hud-panel p-4 rounded-2xl border border-[#1f2c44] flex flex-col space-y-4">
      {/* Top Controls: Timeline Scrubber & Playback */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Playback Button Group */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onTogglePlayback}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,210,255,0.3)]'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            onClick={handleStep}
            title="Step forward 15 mins"
            className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 transition-colors"
          >
            <StepForward className="w-4 h-4" />
          </button>

          {/* Speed Selectors */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
            {[1, 2, 5].map(speed => (
              <button
                key={speed}
                onClick={() => onSetSpeed(speed)}
                className={`px-2 py-1 rounded transition-all ${
                  playbackSpeed === speed
                    ? 'bg-cyan-500/30 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Slider ($T_0$ to $T_{+12h}$) */}
        <div className="flex-1 min-w-[240px] flex items-center space-x-3">
          <span className="text-xs font-mono font-bold text-cyan-300 whitespace-nowrap">
            T+{state.timeline_hour.toFixed(1)}h
          </span>
          <input
            type="range"
            min="0"
            max="12"
            step="0.1"
            value={state.timeline_hour}
            onChange={(e) => handleSliderChange('timeline_hour', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <span className="text-xs font-mono text-slate-500 whitespace-nowrap">T+12.0h</span>
        </div>

        {/* Crisis Injection Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleInject('100_year_storm')}
            disabled={injecting !== null}
            className="px-3 py-1.5 rounded-lg bg-blue-950/80 border border-blue-600/50 hover:border-blue-400 text-blue-300 text-xs font-mono font-semibold flex items-center space-x-1.5 transition-all shadow-[0_0_10px_rgba(59,130,246,0.15)]"
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>100-Yr Storm (75mm/h)</span>
          </button>

          <button
            onClick={() => handleInject('levee_breach')}
            disabled={injecting !== null}
            className="px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-600/50 hover:border-red-400 text-red-300 text-xs font-mono font-semibold flex items-center space-x-1.5 transition-all shadow-[0_0_10px_rgba(239,68,68,0.15)]"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>Breach Levee 4</span>
          </button>

          <button
            onClick={() => handleInject('substation_failure')}
            disabled={injecting !== null}
            className="px-3 py-1.5 rounded-lg bg-amber-950/80 border border-amber-600/50 hover:border-amber-400 text-amber-300 text-xs font-mono font-semibold flex items-center space-x-1.5 transition-all shadow-[0_0_10px_rgba(245,158,11,0.15)]"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Trip Substation Alpha</span>
          </button>

          <button
            onClick={() => handleInject('clear_weather')}
            disabled={injecting !== null}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 text-xs font-mono transition-all"
            title="Clear Hazard Conditions"
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* Sliders Grid: Rainfall, Surge, Wind */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80 text-xs font-mono">
        {/* Rainfall Slider */}
        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col space-y-2">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center space-x-1.5">
              <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
              <span>Rainfall Intensity</span>
            </span>
            <span className="font-bold text-cyan-300">{state.rain_intensity_mmhr.toFixed(0)} mm/hr</span>
          </div>
          <input
            type="range"
            min="0"
            max="120"
            step="1"
            value={state.rain_intensity_mmhr}
            onChange={(e) => handleSliderChange('rain_intensity_mmhr', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Storm Surge Slider */}
        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col space-y-2">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center space-x-1.5">
              <Waves className="w-3.5 h-3.5 text-blue-400" />
              <span>Coastal Storm Surge</span>
            </span>
            <span className="font-bold text-blue-300">{state.storm_surge_m.toFixed(1)} m</span>
          </div>
          <input
            type="range"
            min="0"
            max="3.0"
            step="0.1"
            value={state.storm_surge_m}
            onChange={(e) => handleSliderChange('storm_surge_m', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
          />
        </div>

        {/* Wind Speed Slider */}
        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col space-y-2">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center space-x-1.5">
              <Wind className="w-3.5 h-3.5 text-amber-400" />
              <span>Wind Velocity</span>
            </span>
            <span className="font-bold text-amber-300">{state.wind_speed_kmh.toFixed(0)} km/h</span>
          </div>
          <input
            type="range"
            min="0"
            max="140"
            step="1"
            value={state.wind_speed_kmh}
            onChange={(e) => handleSliderChange('wind_speed_kmh', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>
      </div>
    </div>
  );
};
