import React, { useState } from 'react';
import { 
  Smartphone, QrCode, X, Copy, Check, ExternalLink, 
  MapPin, ShieldCheck, Compass, PhoneCall, AlertTriangle 
} from 'lucide-react';

interface MobileCompanionModalProps {
  cityName: string;
  onClose: () => void;
}

export const MobileCompanionModal: React.FC<MobileCompanionModalProps> = ({
  cityName,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const currentUrl = window.location.href;
  
  // Scannable live QR Code API URL
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(currentUrl)}&color=00d2ff&bgcolor=090e1a`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none">
      <div className="hud-panel w-full max-w-lg rounded-2xl border border-cyan-500/40 p-6 flex flex-col items-center space-y-4 shadow-[0_0_60px_rgba(0,210,255,0.25)] bg-[#090e1a] text-center">
        
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-left">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Live Mobile Citizen Companion
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">
                Scan with your smartphone camera for instant field guidance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Code Container */}
        <div className="p-4 rounded-2xl bg-slate-950 border-2 border-cyan-500/40 shadow-2xl relative group">
          <img
            src={qrApiUrl}
            alt="Mobile Companion QR Code"
            className="w-56 h-56 rounded-xl object-contain mx-auto"
          />
          <div className="absolute inset-0 bg-cyan-500/5 rounded-2xl pointer-events-none border border-cyan-500/20 animate-pulse" />
        </div>

        {/* Instructions */}
        <div className="space-y-1 text-xs font-mono text-slate-300">
          <p className="font-bold text-cyan-300">
            📱 Point any smartphone camera at the QR code above
          </p>
          <p className="text-slate-400 text-[11px]">
            Opens the mobile-responsive citizen evacuation companion for <strong>{cityName}</strong> with live shelter routing, emergency phone dialers, and real GPS SOS submission!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex items-center space-x-2 pt-2">
          <button
            onClick={handleCopyLink}
            className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-mono text-xs font-bold flex items-center justify-center space-x-1.5 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Mobile Companion URL'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
