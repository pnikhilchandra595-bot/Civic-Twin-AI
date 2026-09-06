import React from 'react';
import { 
  FileText, Printer, CheckCircle2, X, ShieldAlert, 
  Phone, Droplets, HeartPulse, MapPin, Compass
} from 'lucide-react';
import { CalibratedScenario } from '../data/calibratedSimulationScenarios';

interface FamilyEmergencyCardModalProps {
  scenario: CalibratedScenario;
  onClose: () => void;
}

export const FamilyEmergencyCardModal: React.FC<FamilyEmergencyCardModalProps> = ({
  scenario,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl max-h-[92vh] bg-[#071120] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-mono text-slate-100">
        
        {/* Header */}
        <div className="p-4 bg-slate-950/90 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-hud tracking-wide">
                GOVERNMENT OF INDIA • CIVILIAN EMERGENCY ACTION CARD
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Official NDMA Pocket Protocol for Disaster Evacuation & Safe High Ground
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Card Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-slate-900/40">
          
          <div className="p-5 rounded-2xl bg-[#0a1628] border-2 border-dashed border-cyan-500/50 space-y-4 shadow-xl">
            
            {/* Card Title Banner */}
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
                  DISASTER PREPAREDNESS & SURVIVAL PROTOCOL
                </span>
                <h2 className="text-base font-bold text-white font-hud mt-0.5">
                  FAMILY ACTION CARD: {scenario.name.toUpperCase()}
                </h2>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  RED ALERT ZONE
                </span>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">Basin: {scenario.basin}</p>
              </div>
            </div>

            {/* Grid of Instructions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              
              {/* Box 1: Evacuation Shelter */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-cyan-300 font-bold">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>PRIMARY HIGH-GROUND SHELTER:</span>
                </div>
                <p className="text-slate-200 font-sans text-xs font-medium">
                  {scenario.keyInundatedNodes[2]?.name || 'Government Higher Secondary School Relief Camp'}
                </p>
                <p className="text-[11px] text-emerald-400 font-mono">
                  Elevation: &gt;18m above peak crest level • Dry rations & medical first-aid active.
                </p>
              </div>

              {/* Box 2: Water Safety */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-blue-300 font-bold">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span>DRINKING WATER PURIFICATION:</span>
                </div>
                <p className="text-slate-200 font-sans text-xs leading-relaxed">
                  Boil all drinking water for minimum <strong className="text-white">3 minutes</strong> at rolling boil. Or dissolve 1 Halazone / Chlorine tablet per 5 liters. Never consume tap water during surge.
                </p>
              </div>

              {/* Box 3: 24/7 Helplines */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-amber-300 font-bold">
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>24/7 TOLL-FREE HELPLINES:</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px] font-mono">
                  <p>• Unified Police/EMS: <strong className="text-white">112</strong></p>
                  <p>• NDRF Boat Rescue: <strong className="text-white">1078</strong></p>
                  <p>• State Control SDMA: <strong className="text-white">1070</strong></p>
                  <p>• District DDMA Cell: <strong className="text-white">1077</strong></p>
                </div>
              </div>

              {/* Box 4: Survival Kit */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-emerald-300 font-bold">
                  <HeartPulse className="w-4 h-4 text-emerald-400" />
                  <span>EMERGENCY GO-BAG CHECKLIST:</span>
                </div>
                <ul className="text-slate-300 font-sans text-[11px] space-y-0.5">
                  <li>☑ Aadhaar cards & documents in waterproof zip pouch</li>
                  <li>☑ 3-day dry food rations (chana, biscuits, ORS sachets)</li>
                  <li>☑ Battery LED torch + extra batteries</li>
                  <li>☑ Essential prescription medications (diabetes/blood pressure)</li>
                </ul>
              </div>

            </div>

            {/* Warning Footer inside Card */}
            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between font-mono">
              <span>National Disaster Management Authority (NDMA) • Safety SOP-2026</span>
              <span className="text-cyan-300 font-bold">KEEP IN POCKET OR VEHICLE GLOVEBOX</span>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold transition-all cursor-pointer flex items-center space-x-2 shadow-md shadow-cyan-500/25"
          >
            <Printer className="w-4 h-4" />
            <span>Print Family Emergency Card (PDF)</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all cursor-pointer"
          >
            Close Card
          </button>
        </div>
      </div>
    </div>
  );
};
