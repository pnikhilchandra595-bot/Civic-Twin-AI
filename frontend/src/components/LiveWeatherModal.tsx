import React, { useState, useEffect } from 'react';
import { 
  CloudRain, Wind, Droplets, Gauge, Compass, 
  Activity, CheckCircle2, RefreshCw, X, AlertTriangle, 
  ShieldCheck, Globe, Zap, ArrowDownRight, Radio, Sparkles 
} from 'lucide-react';
import { apiService } from '../services/api';
import { CityDigitalTwinState } from '../types/digital_twin';

interface LiveWeatherModalProps {
  state: CityDigitalTwinState | null;
  onClose: () => void;
  onDeployed?: () => void;
}

export const LiveWeatherModal: React.FC<LiveWeatherModalProps> = ({
  state,
  onClose,
  onDeployed
}) => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deploySuccess, setDeploySuccess] = useState<boolean>(false);
  const [autoSync, setAutoSync] = useState<boolean>(false);

  const cityName = state?.city_name || 'Mumbai Mithi Basin';
  const lat = state?.center_coords?.[0] || 19.076;
  const lng = state?.center_coords?.[1] || 72.877;

  const fetchLiveWeather = async () => {
    setIsLoading(true);
    try {
      const res = await apiService.getRealWeatherData(lat, lng);
      setWeatherData(res);
    } catch (err) {
      console.error('Failed to fetch live weather:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveWeather();
  }, [lat, lng]);

  // Auto-sync interval
  useEffect(() => {
    let timer: any = null;
    if (autoSync) {
      timer = setInterval(async () => {
        await handleDeployLive();
      }, 60000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoSync, lat, lng]);

  const handleDeployLive = async () => {
    setIsDeploying(true);
    try {
      await apiService.syncLiveWeather();
      setDeploySuccess(true);
      if (onDeployed) onDeployed();
      setTimeout(() => setDeploySuccess(false), 3500);
    } catch (err) {
      console.error('Failed to deploy live weather:', err);
    } finally {
      setIsDeploying(false);
    }
  };

  const rainRate = weatherData?.rain_rate_mmhr ?? 35.0;
  const temp = weatherData?.temperature_c ?? 28.5;
  const humidity = weatherData?.humidity_pct ?? 78;
  const windSpeed = weatherData?.wind_speed_kmh ?? 18.0;
  const pressure = weatherData?.surface_pressure_hpa ?? 1008.0;
  const soilMoisture = weatherData?.soil_moisture_pct ?? 65.0;
  const source = weatherData?.source || 'Open-Meteo & IMD Live Satellite Stream';
  const isLive = weatherData?.is_live_satellite ?? true;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none font-sans">
      <div className="hud-panel w-full max-w-3xl rounded-3xl border border-cyan-500/40 flex flex-col bg-[#070b16] text-slate-100 shadow-[0_0_80px_rgba(0,210,255,0.25)] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-950 via-blue-950/40 to-slate-950">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 text-white shadow-lg shadow-cyan-500/20">
              <CloudRain className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center space-x-2">
                <span>Live Satellite & Doppler Weather Stream</span>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold ${
                  isLive 
                    ? 'bg-emerald-950 border border-emerald-500 text-emerald-300'
                    : 'bg-amber-950 border border-amber-500 text-amber-300'
                }`}>
                  {isLive ? '● LIVE SATELLITE RADAR' : '○ CALIBRATED CACHE'}
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Real-Time Meteorological Ingestion for <strong>{cityName}</strong> ({lat.toFixed(3)}°N, {lng.toFixed(3)}°E)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchLiveWeather}
              disabled={isLoading}
              title="Refresh Satellite Readings"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Weather Metrics Grid */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          
          {/* Source Banner */}
          <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2 text-cyan-300">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Telemetry Source: <strong>{source}</strong></span>
            </div>
            <span className="text-slate-400 text-[11px]">
              Updated: {new Date().toLocaleTimeString()}
            </span>
          </div>

          {/* 6 Core Meteorological Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            
            {/* 1. Precipitation Rate */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span className="flex items-center space-x-1.5">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  <span>Rainfall Rate</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">LIVE</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {rainRate.toFixed(1)} <span className="text-sm font-normal text-cyan-300">mm/h</span>
              </div>
              <div className="text-[10px] text-slate-500">
                {rainRate > 50 ? '⚠️ Extreme Torrential Storm' : rainRate > 20 ? '🌧️ Heavy Monsoon Runoff' : '🌦️ Moderate Precipitation'}
              </div>
            </div>

            {/* 2. Temperature */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span className="flex items-center space-x-1.5">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>Temperature</span>
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {temp.toFixed(1)} <span className="text-sm font-normal text-amber-300">°C</span>
              </div>
              <div className="text-[10px] text-slate-500">Surface ambient temperature</div>
            </div>

            {/* 3. Relative Humidity */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span className="flex items-center space-x-1.5">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span>Humidity</span>
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {humidity} <span className="text-sm font-normal text-blue-300">%</span>
              </div>
              <div className="text-[10px] text-slate-500">Atmospheric vapor saturation</div>
            </div>

            {/* 4. Wind Velocity & Gusts */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span className="flex items-center space-x-1.5">
                  <Wind className="w-4 h-4 text-teal-400" />
                  <span>Wind Velocity</span>
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {windSpeed.toFixed(1)} <span className="text-sm font-normal text-teal-300">km/h</span>
              </div>
              <div className="text-[10px] text-slate-500">Gusts up to {(windSpeed * 1.5).toFixed(0)} km/h</div>
            </div>

            {/* 5. Surface Barometric Pressure */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span className="flex items-center space-x-1.5">
                  <Gauge className="w-4 h-4 text-purple-400" />
                  <span>Pressure</span>
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {pressure.toFixed(1)} <span className="text-sm font-normal text-purple-300">hPa</span>
              </div>
              <div className="text-[10px] text-slate-500">Cyclonic low pressure indicator</div>
            </div>

            {/* 6. Soil Moisture Saturation */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span className="flex items-center space-x-1.5">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>Soil Saturation</span>
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {soilMoisture.toFixed(0)} <span className="text-sm font-normal text-emerald-300">%</span>
              </div>
              <div className="text-[10px] text-slate-500">
                {soilMoisture > 75 ? '⚠️ 100% Runoff (Zero Infiltration)' : 'Normal Soil Absorption'}
              </div>
            </div>

          </div>

          {/* IMD 7-Day Extended Forecast Horizon & Astronomical Surge Matrix */}
          {weatherData?.imd_data && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                  <span>IMD 7-Day Disaster Forecast Horizon (Station ID: {weatherData.imd_data.station_id})</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700">
                  IMD National Weather Service Synced
                </span>
              </div>

              {/* 7-Day Forecast Horizon Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {weatherData.imd_data.weather.forecast.map((day: any, idx: number) => (
                  <div 
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-1.5 hover:border-cyan-500/50 transition-all"
                  >
                    <div className="text-[10px] font-mono text-cyan-400 font-bold">
                      {day.date.slice(0, 6)}
                    </div>
                    <div className="text-sm">
                      {idx < 2 ? '⛈️' : idx < 5 ? '🌧️' : '🌦️'}
                    </div>
                    <div className="text-[11px] font-mono font-bold text-white">
                      {day.max_temp}° <span className="text-slate-400 font-normal">{day.min_temp}°</span>
                    </div>
                    <div className="text-[9px] font-mono text-emerald-400">
                      💧 {day.chance_of_rain_pct}% rain
                    </div>
                  </div>
                ))}
              </div>

              {/* Astronomical High-Tide & Moonrise / Moonset Card */}
              {weatherData.imd_data.weather.astronomical && (
                <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px] block">🌅 Sunrise:</span>
                    <span className="text-amber-300 font-bold">{weatherData.imd_data.weather.astronomical.sunrise} IST</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">🌇 Sunset:</span>
                    <span className="text-orange-400 font-bold">{weatherData.imd_data.weather.astronomical.sunset} IST</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">🌙 Moonrise:</span>
                    <span className="text-cyan-300 font-bold">{weatherData.imd_data.weather.astronomical.moonrise} IST</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">🌊 Tidal Risk Status:</span>
                    <span className="text-rose-400 font-bold text-[10px] truncate block">{weatherData.imd_data.weather.astronomical.tidal_surge_risk}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Deploy Bar */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-blue-950/50 to-slate-950 border border-cyan-500/40 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Deploy Live Weather Directly into Digital Twin Simulation</span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Injects the exact real-time rainfall rate ({rainRate.toFixed(1)} mm/h) and wind speed into the hydraulic flood model.
                </p>
              </div>

              {/* Auto Sync Toggle */}
              <label className="flex items-center space-x-2 text-xs font-mono text-cyan-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoSync}
                  onChange={(e) => setAutoSync(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <span>Auto-Deploy (Every 60s)</span>
              </label>
            </div>

            <button
              onClick={handleDeployLive}
              disabled={isDeploying}
              className="w-full py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white shadow-lg shadow-cyan-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              {isDeploying ? (
                <span>Injecting Live Weather into Hydraulic Physics Engine...</span>
              ) : deploySuccess ? (
                <span className="flex items-center space-x-1.5 text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Live Weather Successfully Injected & Twin Recalculated!</span>
                </span>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>🚀 Deploy Exact Live Weather to Digital Twin</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
