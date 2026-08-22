import React, { useState } from 'react';
import { 
  Radio, X, WifiOff, ShieldCheck, 
  Activity, Smartphone, Send, CheckCircle2, Zap, ArrowRight 
} from 'lucide-react';

interface MeshNetworkModalProps {
  cityName: string;
  onClose: () => void;
}

export const MeshNetworkModal: React.FC<MeshNetworkModalProps> = ({
  cityName,
  onClose
}) => {
  const [meshActive, setMeshActive] = useState<boolean>(true);
  const [hopCount, setHopCount] = useState<number>(4);
  const [testSent, setTestSent] = useState<boolean>(false);

  const meshHops = [
    { hop: 1, device: "Stranded Citizen Phone (Kurla Roof)", type: "BLUETOOTH_LE", signal_dbm: -72, distance_m: 45 },
    { hop: 2, device: "Relay Phone (Building 4, 3rd Floor)", type: "BLUETOOTH_LE", signal_dbm: -68, distance_m: 80 },
    { hop: 3, device: "Relay Phone (BKC High-Ground Bridge)", type: "WIFI_DIRECT", signal_dbm: -54, distance_m: 140 },
    { hop: 4, device: "NDRF Swift-Water Rescue Boat Base", type: "LONG_RANGE_LORA", signal_dbm: -42, distance_m: 350 }
  ];

  const handleSimulateHop = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 4000);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none">
      <div className="hud-panel w-full max-w-4xl rounded-2xl border border-cyan-500/40 p-6 flex flex-col space-y-4 shadow-[0_0_60px_rgba(0,210,255,0.25)] bg-[#090e1a] text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <WifiOff className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                <span>Zero-Network P2P Bluetooth / Wi-Fi Mesh SOS Relay</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950 border border-amber-600 text-amber-300 font-mono">
                  CELL TOWER COLLAPSE FAILSAFE
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Ad-Hoc Multi-Hop Distress Packet Routing (No Internet / No Telecom Tower Required)
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

        {/* Multi-Hop Network Visualizer */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white">Live Multi-Hop Ad-Hoc Mesh Topology:</span>
            <span className="text-amber-400 font-bold">4 Relays Active • 0% Cellular Dependence</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            {meshHops.map((h, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex flex-col justify-between space-y-2 transition-all ${
                  testSent
                    ? 'bg-cyan-950/40 border-cyan-500 shadow-[0_0_15px_rgba(0,210,255,0.25)]'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-bold text-amber-300">Hop #{h.hop}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold">{h.type}</span>
                  </div>
                  <span className="font-bold text-white text-xs block leading-tight">{h.device}</span>
                </div>

                <div className="space-y-1 text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                  <div className="flex justify-between">
                    <span>Signal:</span>
                    <strong className="text-emerald-400">{h.signal_dbm} dBm</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Range:</span>
                    <strong className="text-cyan-300">~{h.distance_m}m</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 flex items-center justify-between font-mono text-xs">
          <div>
            <span className="font-bold text-white block">Test Zero-Network Packet Hop:</span>
            <span className="text-slate-400 text-[11px]">
              Transmits an offline distress signal hopping across 4 citizen devices to the NDRF base.
            </span>
          </div>

          <button
            onClick={handleSimulateHop}
            disabled={testSent}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold flex items-center space-x-1.5 shadow-lg transition-all"
          >
            <Zap className="w-4 h-4" />
            <span>{testSent ? 'Packet Hopping Across Mesh...' : 'Simulate Offline Mesh SOS'}</span>
          </button>
        </div>

        {testSent && (
          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center space-x-2 animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>✅ Offline SOS packet successfully hopped across 4 citizen phones and reached NDRF Rescue Boat Base!</span>
          </div>
        )}

      </div>
    </div>
  );
};
