import React, { useState } from 'react';
import { 
  QrCode, Smartphone, MapPin, Share2, Copy, Check, 
  ExternalLink, PhoneCall, ShieldAlert, Waves, X, AlertOctagon 
} from 'lucide-react';

interface CitizenQRCodeModalProps {
  cityName: string;
  cityId: string;
  onClose: () => void;
}

export const CitizenQRCodeModal: React.FC<CitizenQRCodeModalProps> = ({
  cityName,
  cityId,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  const publicUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/?mode=citizen&city=${encodeURIComponent(cityId)}`
    : `https://civic-twin-ai-delta.vercel.app/?mode=citizen&city=${encodeURIComponent(cityId)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`🚨 CIVICTWIN AI EMERGENCY DISTRESS BEACON\n\nCitizens in ${cityName} can lock their hardware satellite GPS coordinates and request immediate NDRF rescue assistance here:\n\n${publicUrl}\n\nEmergency Helplines: NDMA (1070) | All-in-One (112)`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none">
      <div className="hud-panel w-full max-w-lg rounded-3xl border border-rose-500/50 bg-[#090e1a] p-6 flex flex-col space-y-4 shadow-[0_0_80px_rgba(244,63,94,0.3)] max-h-[92vh] overflow-y-auto text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
              <QrCode className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                <span>Citizen Mobile SOS QR Beacon</span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Instant Offline Smartphone GPS Dispatch ({cityName})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Canvas */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white text-slate-900 shadow-xl border-4 border-rose-500/30 space-y-3">
          <div className="w-48 h-48 relative flex items-center justify-center bg-white p-2">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(publicUrl)}&color=090e1a&bgcolor=ffffff&margin=1`}
              alt={`QR Code for ${cityName} Citizen SOS`}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="text-center">
            <span className="text-[11px] font-mono font-bold text-slate-800 uppercase tracking-widest block">
              Scan with Any Mobile Camera
            </span>
            <span className="text-[10px] text-slate-500">
              Zero App Download Required • Locks Hardware GNSS GPS
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-2.5">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={publicUrl}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-cyan-950 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold hover:bg-cyan-900/50 flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleWhatsAppShare}
              className="px-4 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-mono font-bold hover:bg-emerald-900/60 flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
            >
              <Share2 className="w-4 h-4" />
              <span>Share via WhatsApp</span>
            </button>

            <button
              onClick={() => window.open(publicUrl, '_blank')}
              className="px-4 py-2.5 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-300 text-xs font-mono font-bold hover:bg-rose-900/60 flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Citizen Portal</span>
            </button>
          </div>
        </div>

        {/* Resilient Architecture Notes */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-[11px] font-mono">
          <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>Civic Defense Offline PWA Guarantee</span>
          </div>
          <p className="text-slate-400 text-[10px] leading-relaxed">
            When mobile internet is cut during severe cyclones or floods, this beacon uses the browser's 
            <strong className="text-slate-200"> HTML5 Geolocation Satellite Receiver</strong> and provides a 
            <strong className="text-rose-300"> 1-Tap Pre-Formatted SMS to 112</strong> that transmits victim coordinates over standard 2G GSM cellular towers.
          </p>
        </div>

      </div>
    </div>
  );
};
