import React, { useState, useEffect } from 'react';
import { 
  Smartphone, Bell, Navigation, ShieldCheck, Radio, 
  MapPin, AlertOctagon, CheckCircle2, Waves, Send, X, 
  Activity, Compass, Phone, Volume2, Wifi, Battery, Zap
} from 'lucide-react';
import { CityDigitalTwinState } from '../types/digital_twin';

export interface MobileEmergencyUnit {
  id: string;
  name: string;
  type: 'ambulance' | 'boat' | 'fire_truck' | 'police' | 'pump_truck';
  status: string;
  speed_kmh: number;
  current_destination?: string;
}

interface MobileHeadAppModalProps {
  state: CityDigitalTwinState | null;
  onClose: () => void;
}

export const MobileHeadAppModal: React.FC<MobileHeadAppModalProps> = ({
  state,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'DISPATCHES' | 'SOS_FEED' | 'RADIO' | 'MAP'>('DISPATCHES');
  const [mobileNotifications, setMobileNotifications] = useState<Array<{
    id: string;
    title: string;
    body: string;
    time: string;
    type: 'DISPATCH' | 'SOS' | 'RADIO' | 'ALARM';
  }>>([
    {
      id: 'notif-1',
      title: '🚨 Tactical Asset Deployed',
      body: '108 ALS Ambulance Alpha dispatched to Apex Trauma Hospital via Green Corridor',
      time: 'Just now',
      type: 'DISPATCH'
    },
    {
      id: 'notif-2',
      title: '🚤 NDRF Rescue Boat En Route',
      body: 'Gemini Deep Raft Alpha responding to 4 Stranded Citizens at Lowland Settlement',
      time: '2m ago',
      type: 'DISPATCH'
    },
    {
      id: 'notif-3',
      title: '📱 Real-time GPS SOS Alert',
      body: 'Citizen Ramesh Sharma (GPS: 19.0762°N, 72.8777°E) reported 0.8m rising water',
      time: '4m ago',
      type: 'SOS'
    },
    {
      id: 'notif-4',
      title: '📻 Tactical Field Comms',
      body: 'EOC-ALPHA: Berm reinforced at 220kV Substation. Pumping at 12,000 L/min.',
      time: '6m ago',
      type: 'RADIO'
    }
  ]);

  const units: MobileEmergencyUnit[] = ((state as any)?.emergency_units) || [
    { id: 'u1', name: '108 ALS Ambulance Alpha', type: 'ambulance', status: 'en_route', speed_kmh: 42, current_destination: 'Apex Trauma Hospital' },
    { id: 'u2', name: 'NDRF Inflatable Raft Alpha', type: 'boat', status: 'en_route', speed_kmh: 18, current_destination: 'Lowland Flood Sector 4' },
    { id: 'u3', name: 'Fire High-Volume Pump 01', type: 'pump_truck', status: 'deployed', speed_kmh: 0, current_destination: '220kV Grid Substation' }
  ];
  const cityName = state?.city_name || 'Mumbai';

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none font-sans overflow-y-auto">
      <div className="hud-panel w-full max-w-4xl rounded-3xl border border-cyan-500/40 bg-[#070b16] text-slate-100 shadow-[0_0_90px_rgba(0,210,255,0.3)] overflow-hidden my-6 flex flex-col md:flex-row gap-6 p-6">
        
        {/* Left Side: Mobile Info & QR Code */}
        <div className="flex-1 flex flex-col justify-between space-y-5 border-b md:border-b-0 md:border-r border-slate-800 pb-5 md:pb-0 md:pr-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-lg shadow-cyan-500/20">
                <Smartphone className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-base font-black text-white uppercase tracking-wider">
                  Incident Commander Mobile App
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold">
                  ● LIVE FIELD PUSH SYNCHRONIZED
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Yes! The system is built with a <strong>Progressive Web App (PWA) Mobile Application</strong>. When any asset is deployed from the Digital Twin or when a citizen transmits an SOS beacon, instant push dispatches stream directly to the <strong>Head Officer & Field Units' Mobile App</strong>.
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="text-cyan-400 font-bold flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Mobile Synchronization Features:</span>
              </div>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                <li>✅ <strong>1-Tap Asset Deployment</strong>: Instant dispatch notifications sent to drivers and captains.</li>
                <li>✅ <strong>Real-time Turn-by-Turn GPS</strong>: Routes around flooded subways.</li>
                <li>✅ <strong>Citizen SOS Location Radar</strong>: Shows exact victims coordinates and water depth.</li>
                <li>✅ <strong>Tactical Radio Audio Stream</strong>: Live 136–174 MHz VHF field chatter.</li>
              </ul>
            </div>
          </div>

          {/* QR Code Quick Connect */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/30 flex items-center space-x-3 text-xs font-mono">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(window.location.origin)}&color=00d2ff&bgcolor=070b16`}
              alt="QR Code"
              className="w-16 h-16 rounded-xl border border-cyan-500/40 shrink-0"
            />
            <div className="space-y-1">
              <div className="text-white font-bold">Scan with Phone Camera</div>
              <div className="text-[10px] text-slate-400">
                Instantly opens this mobile command portal on your iOS / Android device.
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Realistic Phone Mockup */}
        <div className="w-full md:w-80 flex flex-col items-center justify-center">
          <div className="w-[300px] h-[580px] bg-slate-950 rounded-[42px] border-[6px] border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative flex flex-col overflow-hidden text-xs">
            
            {/* Phone Top Notch & Status Bar */}
            <div className="h-8 bg-slate-950 flex items-center justify-between px-6 pt-1 text-[10px] text-slate-400 font-mono select-none z-20">
              <span className="font-bold text-white">09:41</span>
              <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />
              <div className="flex items-center space-x-1">
                <Wifi className="w-3 h-3 text-cyan-400" />
                <Battery className="w-3 h-3 text-emerald-400" />
              </div>
            </div>

            {/* App In-Screen Header */}
            <div className="p-3 bg-gradient-to-r from-slate-900 to-cyan-950/80 border-b border-cyan-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span className="font-mono font-bold text-white text-[11px]">CIVICTWIN MOBILE</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-500">
                ● LIVE
              </span>
            </div>

            {/* In-App Segment Tabs */}
            <div className="flex bg-slate-900/90 border-b border-slate-800 text-[10px] font-mono font-bold text-center">
              <button
                onClick={() => setActiveTab('DISPATCHES')}
                className={`flex-1 py-1.5 transition-all ${activeTab === 'DISPATCHES' ? 'text-cyan-300 border-b-2 border-cyan-400 bg-cyan-950/40' : 'text-slate-400'}`}
              >
                Dispatches
              </button>
              <button
                onClick={() => setActiveTab('SOS_FEED')}
                className={`flex-1 py-1.5 transition-all ${activeTab === 'SOS_FEED' ? 'text-rose-300 border-b-2 border-rose-400 bg-rose-950/40' : 'text-slate-400'}`}
              >
                SOS ({units.length})
              </button>
              <button
                onClick={() => setActiveTab('RADIO')}
                className={`flex-1 py-1.5 transition-all ${activeTab === 'RADIO' ? 'text-amber-300 border-b-2 border-amber-400 bg-amber-950/40' : 'text-slate-400'}`}
              >
                Comms
              </button>
            </div>

            {/* Phone Scrollable Content Body */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 font-mono text-[11px]">
              
              {activeTab === 'DISPATCHES' && (
                <>
                  <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
                    <span>Active Mobile Deployments</span>
                    <span className="text-cyan-400">● {units.length || 4} En Route</span>
                  </div>

                  {units.length > 0 ? (
                    units.slice(0, 4).map((u) => (
                      <div key={u.id} className="p-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 space-y-1 shadow-md">
                        <div className="flex items-center justify-between text-white font-bold text-[10px]">
                          <span className="flex items-center space-x-1.5">
                            <span>{u.type === 'boat' ? '🚤' : u.type === 'ambulance' ? '🚑' : '🚒'}</span>
                            <span>{u.name}</span>
                          </span>
                          <span className="text-emerald-400 text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500">
                            {u.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-[9px] text-slate-400">
                          Speed: {u.speed_kmh} km/h • ETA: 4m
                        </div>
                        <div className="text-[9px] text-cyan-300">
                          Target: {u.current_destination || 'Incident Site Alpha'}
                        </div>
                      </div>
                    ))
                  ) : (
                    mobileNotifications.filter(n => n.type === 'DISPATCH').map((n) => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 space-y-1">
                        <div className="text-white font-bold text-[10px]">{n.title}</div>
                        <div className="text-[9px] text-slate-300 font-sans">{n.body}</div>
                        <div className="text-[8px] text-slate-500">{n.time}</div>
                      </div>
                    ))
                  )}
                </>
              )}

              {activeTab === 'SOS_FEED' && (
                <div className="space-y-2">
                  <div className="text-[10px] text-rose-400 uppercase font-bold">
                    🚨 Citizen GPS Rescue Feed
                  </div>
                  {mobileNotifications.filter(n => n.type === 'SOS').map((n) => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/50 space-y-1">
                      <div className="text-rose-200 font-bold text-[10px] flex items-center justify-between">
                        <span>{n.title}</span>
                        <span className="text-[8px] text-rose-400">HIGH PRIORITY</span>
                      </div>
                      <div className="text-[9px] text-slate-300 font-sans">{n.body}</div>
                      <div className="text-[8px] text-slate-500">{n.time}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'RADIO' && (
                <div className="space-y-2">
                  <div className="text-[10px] text-amber-400 uppercase font-bold flex items-center space-x-1">
                    <Volume2 className="w-3 h-3 text-amber-400" />
                    <span>Live Tactical VHF Radio</span>
                  </div>
                  {mobileNotifications.filter(n => n.type === 'RADIO').map((n) => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-slate-900 border border-amber-500/40 space-y-1">
                      <div className="text-amber-300 font-bold text-[10px]">{n.title}</div>
                      <div className="text-[9px] text-slate-300 font-sans">{n.body}</div>
                      <div className="text-[8px] text-slate-500">{n.time}</div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Phone Bottom Home Bar */}
            <div className="h-6 bg-slate-950 flex items-center justify-center">
              <div className="w-28 h-1 bg-slate-700 rounded-full" />
            </div>

          </div>
        </div>

        {/* Top Right Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
};
