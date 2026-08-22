import React, { useState } from 'react';
import { 
  TrendingUp, X, Waves, AlertTriangle, Layers, 
  MapPin, ShieldAlert, Sparkles, Activity 
} from 'lucide-react';

interface ElevationProfileModalProps {
  cityName: string;
  rainIntensity: number;
  stormSurge: number;
  onClose: () => void;
}

export const ElevationProfileModal: React.FC<ElevationProfileModalProps> = ({
  cityName,
  rainIntensity,
  stormSurge,
  onClose
}) => {
  const [selectedCorridor, setSelectedCorridor] = useState<'mithi_to_dadar' | 'yamuna_to_ito' | 'bellandur_to_silkboard'>('mithi_to_dadar');

  // Ground elevation profiles (Meters above Mean Sea Level)
  const profiles = {
    mithi_to_dadar: {
      name: "Mithi River Catchment ➔ Dadar TT Circle Cross-Section",
      distance_km: 4.8,
      points: [
        { label: "Mithi River Bed", dist_km: 0.0, ground_elev: 1.2, flood_water_level: 3.4, status: "SUBMERGED" },
        { label: "River Embankment Levee", dist_km: 0.8, ground_elev: 3.8, flood_water_level: 3.4, status: "NEAR_OVERTOP" },
        { label: "LBS Marg Arterial", dist_km: 1.6, ground_elev: 2.1, flood_water_level: 3.4, status: "SUBMERGED" },
        { label: "Tata Power Substation", dist_km: 2.4, ground_elev: 3.1, flood_water_level: 3.4, status: "SUBMERGED" },
        { label: "Dadar Hindmata Subway", dist_km: 3.5, ground_elev: 1.9, flood_water_level: 3.4, status: "CRITICAL_INUNDATION" },
        { label: "KEM Hospital Ridge (Safe)", dist_km: 4.8, ground_elev: 9.2, flood_water_level: 3.4, status: "HIGH_GROUND_SAFE" }
      ]
    },
    yamuna_to_ito: {
      name: "Yamuna River Floodplain ➔ ITO Ring Road Cross-Section",
      distance_km: 5.2,
      points: [
        { label: "Yamuna River Channel", dist_km: 0.0, ground_elev: 201.5, flood_water_level: 206.2, status: "SUBMERGED" },
        { label: "Yamuna Khadar Embankment", dist_km: 1.2, ground_elev: 205.8, flood_water_level: 206.2, status: "OVERTOPPED" },
        { label: "Ring Road North Inundated", dist_km: 2.3, ground_elev: 204.0, flood_water_level: 206.2, status: "SUBMERGED" },
        { label: "ITO Barrage Sluice Way", dist_km: 3.4, ground_elev: 204.5, flood_water_level: 206.2, status: "SUBMERGED" },
        { label: "IP Estate Substation Base", dist_km: 4.2, ground_elev: 205.2, flood_water_level: 206.2, status: "SUBMERGED" },
        { label: "Connaught Place Ridge (Safe)", dist_km: 5.2, ground_elev: 218.0, flood_water_level: 206.2, status: "HIGH_GROUND_SAFE" }
      ]
    },
    bellandur_to_silkboard: {
      name: "Bellandur Lake Spillway ➔ Silk Board Flyover Cross-Section",
      distance_km: 6.0,
      points: [
        { label: "Bellandur Lake Bed", dist_km: 0.0, ground_elev: 862.0, flood_water_level: 866.5, status: "SUBMERGED" },
        { label: "Spillway Embankment", dist_km: 1.0, ground_elev: 865.0, flood_water_level: 866.5, status: "OVERTOPPED" },
        { label: "ORR Ecospace Underpass", dist_km: 2.5, ground_elev: 864.0, flood_water_level: 866.5, status: "SUBMERGED" },
        { label: "BESCOM 66kV Substation", dist_km: 3.8, ground_elev: 866.0, flood_water_level: 866.5, status: "SUBMERGED" },
        { label: "Koramangala 4th Block", dist_km: 4.9, ground_elev: 870.0, flood_water_level: 866.5, status: "HIGH_GROUND_SAFE" },
        { label: "Silk Board Elevated Span", dist_km: 6.0, ground_elev: 888.0, flood_water_level: 866.5, status: "HIGH_GROUND_SAFE" }
      ]
    }
  };

  const current = profiles[selectedCorridor];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none">
      <div className="hud-panel w-full max-w-4xl rounded-2xl border border-cyan-500/40 p-6 flex flex-col space-y-4 shadow-[0_0_60px_rgba(0,210,255,0.25)] bg-[#090e1a] text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                <span>Topographic Bathymetry & Flood Slice Cross-Section</span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                2D Terrain Elevation Curve vs. Rising Hydraulic Flood Line
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

        {/* Corridor Selector */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setSelectedCorridor('mithi_to_dadar')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedCorridor === 'mithi_to_dadar' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-white'
            }`}
          >
            Maharashtra: Mithi ➔ Dadar
          </button>

          <button
            onClick={() => setSelectedCorridor('yamuna_to_ito')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedCorridor === 'yamuna_to_ito' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-white'
            }`}
          >
            Delhi NCR: Yamuna ➔ ITO
          </button>

          <button
            onClick={() => setSelectedCorridor('bellandur_to_silkboard')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              selectedCorridor === 'bellandur_to_silkboard' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-white'
            }`}
          >
            Karnataka: Bellandur ➔ Silk Board
          </button>
        </div>

        {/* Visual 2D Elevation Slice Graph */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-white">{current.name}</span>
            <span className="text-cyan-400 font-bold">Corridor Length: {current.distance_km} km</span>
          </div>

          {/* Graphical Step Bars */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            {current.points.map((p, idx) => {
              const isFlooded = p.ground_elev <= p.flood_water_level;
              const diffM = Math.abs(p.flood_water_level - p.ground_elev);

              return (
                <div 
                  key={idx} 
                  className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 font-mono transition-all ${
                    isFlooded 
                      ? 'bg-rose-950/30 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.15)]' 
                      : 'bg-emerald-950/30 border-emerald-500/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>Pt {idx + 1} ({p.dist_km}km)</span>
                      <span className={`px-1.5 py-0.5 rounded font-bold ${
                        isFlooded ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {isFlooded ? 'FLOODED' : 'SAFE'}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-white block leading-tight">{p.label}</span>
                  </div>

                  <div className="space-y-1 text-[11px] pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Ground:</span>
                      <strong className="text-cyan-300">{p.ground_elev.toFixed(1)}m</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Flood Line:</span>
                      <strong className="text-blue-400">{p.flood_water_level.toFixed(1)}m</strong>
                    </div>
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-400">Water Depth:</span>
                      <strong className={isFlooded ? "text-rose-400" : "text-emerald-400"}>
                        {isFlooded ? `+${diffM.toFixed(2)}m` : "0.00m"}
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
