import React, { useState } from 'react';
import { IncidentActionPlan } from '../types/digital_twin';
import { 
  Radio, X, Copy, Check, Volume2, Globe, 
  AlertTriangle, ShieldAlert, Smartphone, BellRing, Send, CheckCircle2, 
  PhoneCall, MessageSquare, Settings, Key, ExternalLink, QrCode, Bell, 
  MessageCircle, Share2, AlertOctagon, Zap 
} from 'lucide-react';
import { apiService, LiveSmsBatchResult } from '../services/api';
import { audioSiren } from '../services/audioSiren';
import { notificationService } from '../services/notificationService';

interface BroadcastModalProps {
  iap: IncidentActionPlan | null;
  cityName?: string;
  onClose: () => void;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({ iap, cityName = "Mumbai", onClose }) => {
  const [activeTab, setActiveTab] = useState<'direct_sms' | 'broadcast'>('direct_sms');
  const [copied, setCopied] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'HI' | 'MR' | 'KN' | 'TA' | 'EN'>('HI');
  const [alertType, setAlertType] = useState('FLASH_FLOOD_EMERGENCY');
  
  // Real Phone number input
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customSmsText, setCustomSmsText] = useState('');
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [smsResult, setSmsResult] = useState<LiveSmsBatchResult | null>(null);

  // Gateway credentials configuration
  const [showConfig, setShowConfig] = useState(false);
  const [fast2smsKey, setFast2smsKey] = useState('');
  const [twilioSid, setTwilioSid] = useState('');
  const [twilioToken, setTwilioToken] = useState('');
  const [twilioFrom, setTwilioFrom] = useState('');

  const [selectedZones, setSelectedZones] = useState<string[]>([
    'Kurla West & Mithi Riverfront',
    'Hindmata & Dadar Lowland Ward',
    'Sion Circle Subway'
  ]);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionSuccess, setTransmissionSuccess] = useState<any | null>(null);

  if (!iap) return null;

  const availableZones = [
    'Kurla West & Mithi Riverfront',
    'Hindmata & Dadar Lowland Ward',
    'Sion Circle Subway',
    'Bandra Kurla Complex (BKC)',
    'Mahim Causeway & Creek'
  ];

  const getCleanPhone = (raw: string) => {
    let clean = raw.replace(/\D/g, '');
    if (clean.length === 10) {
      clean = '91' + clean;
    }
    return clean;
  };

  const cleanNum = getCleanPhone(phoneNumber);

  const getTranslatedMessage = (lang: string) => {
    switch (lang) {
      case 'HI':
        return `🚨 राष्ट्रीय आपदा प्रबंधन प्राधिकरण (NDMA) आपातकालीन चेतावनी\n\n${cityName} में भारी बारिश व बाढ़ का रेड अलर्ट जारी किया गया है।\nकृपया निचले इलाकों और सबवे से तुरंत दूर रहें। प्रशासन द्वारा निर्धारित सुरक्षित निकासी मार्गों से राहत शिविरों में जाएं।\nहेल्पलाइन: 1070 / 112`;
      case 'MR':
        return `🚨 महाराष्ट्र राज्य आपत्ती व्यवस्थापन (SDMA) आणीबाणी इशारा\n\n${cityName} परिसरात मुसळधार पाऊस व पूर स्थिती निर्माण झाली आहे.\nसखल भागातील नागरिकांनी त्वरित सुरक्षित स्थळी स्थलांतर करावे.\nआपत्कालीन कक्ष: 1070 / 1916`;
      case 'KN':
        return `🚨 ಕರ್ನಾಟಕ ರಾಜ್ಯ ವಿಪತ್ತು ನಿರ್ವಹಣಾ ಪ್ರಾಧಿಕಾರ (KSDMA) ತುರ್ತು ಎಚ್ಚರಿಕೆ\n\n${cityName} ನಗರದಲ್ಲಿ ಭಾರೀ ಮಳೆ ಹಾಗೂ ಪ್ರವಾಹದ ಹಿನ್ನೆಲೆಯಲ್ಲಿ ರೆಡ್ ಅಲರ್ಟ್ ಘೋಷಿಸಲಾಗಿದೆ.\nದಯವಿಟ್ಟು ತಗ್ಗು ಪ್ರದೇಶಗಳಿಂದ ಸುರಕ್ಷಿತ ತಾಣಗಳಿಗೆ ತೆರಳಿ.\nಸಹಾಯವಾಣಿ: 1070 / 112`;
      case 'TA':
        return `🚨 தமிழ்நாடு மாநில பேரிடர் மேலாண்மை ஆணையம் (TNDMA) அவசர எச்சரிக்கை\n\n${cityName} பகுதியில் கனமழை காரணமாக வெள்ள அபாய எச்சரிக்கை விடுக்கப்பட்டுள்ளது.\nபாதுகாப்பான முகாம்களுக்கு செல்லவும்.\nஉதவி எண்: 1070 / 112`;
      case 'EN':
      default:
        return iap.public_emergency_alert;
    }
  };

  const activeMessageText = customSmsText.trim() || getTranslatedMessage(selectedLang);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeMessageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const toggleZone = (zone: string) => {
    if (selectedZones.includes(zone)) {
      setSelectedZones(selectedZones.filter(z => z !== zone));
    } else {
      setSelectedZones([...selectedZones, zone]);
    }
  };

  // Trigger Native Web Notification
  const triggerBrowserNotification = (title: string, body: string) => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/favicon.ico' });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(p => {
          if (p === 'granted') new Notification(title, { body, icon: '/favicon.ico' });
        });
      }
    }
  };

  const handleSendRealSms = async () => {
    const rawNumbers = phoneNumber.split(',').map(n => n.trim()).filter(n => n.length >= 6);
    if (rawNumbers.length === 0) return;

    try {
      setIsSendingSms(true);
      const config: Record<string, string> = {};
      if (fast2smsKey.trim()) config.fast2sms_api_key = fast2smsKey.trim();
      if (twilioSid.trim()) config.twilio_account_sid = twilioSid.trim();
      if (twilioToken.trim()) config.twilio_auth_token = twilioToken.trim();
      if (twilioFrom.trim()) config.twilio_from_number = twilioFrom.trim();

      const result = await apiService.sendLiveMobileAlert(
        rawNumbers,
        `RED ALERT: Severe Disaster Inundation (${cityName})`,
        activeMessageText,
        selectedLang,
        Object.keys(config).length > 0 ? config : undefined
      );

      setSmsResult(result);

      // Play real Web Audio API Emergency Siren
      audioSiren.playEASAlertSiren(3.5);

      notificationService.sendDesktopAlert(
        `🚨 REAL EMERGENCY ALERT: ${cityName}`,
        activeMessageText
      );
    } catch (e) {
      console.error('Real SMS send error', e);
    } finally {
      setIsSendingSms(false);
    }
  };

  const handleTransmitBroadcast = async () => {
    try {
      setIsTransmitting(true);
      const record = await apiService.transmitBroadcast(
        alertType,
        iap.overall_threat_level,
        selectedZones,
        getTranslatedMessage('EN'),
        {
          HI: getTranslatedMessage('HI'),
          MR: getTranslatedMessage('MR'),
          KN: getTranslatedMessage('KN'),
          TA: getTranslatedMessage('TA')
        }
      );
      setTransmissionSuccess(record);

      // Play real Web Audio API Emergency Siren
      audioSiren.playEASAlertSiren(4.0);

      notificationService.sendDesktopAlert(
        `🚨 NDMA / SDMA EAS BROADCAST TRANSMITTED`,
        `Emergency evacuation ordered for ${selectedZones.join(', ')}`
      );
    } catch (e) {
      console.error('Broadcast transmit error', e);
    } finally {
      setIsTransmitting(false);
    }
  };

  // Direct Mobile Links
  const whatsAppUrl = cleanNum
    ? `https://api.whatsapp.com/send?phone=${cleanNum}&text=${encodeURIComponent(activeMessageText)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(activeMessageText)}`;

  const nativeSmsUrl = cleanNum
    ? `sms:+${cleanNum}?body=${encodeURIComponent(activeMessageText)}`
    : `sms:?body=${encodeURIComponent(activeMessageText)}`;

  const ntfyPushUrl = cleanNum
    ? `https://ntfy.sh/civictwin_${cleanNum}`
    : `https://ntfy.sh/civictwin_public_emergency_india`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(ntfyPushUrl)}`;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="hud-panel w-full max-w-2xl rounded-2xl border border-red-500/40 p-6 flex flex-col space-y-4 shadow-[0_0_50px_rgba(239,68,68,0.25)] max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                <span>NDMA / SDMA Real Mobile Alert & SMS Center</span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Deliver alerts to your physical smartphone via SMS, WhatsApp & Instant Push
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

        {/* Mode Switcher Tabs */}
        <div className="flex items-center space-x-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('direct_sms')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'direct_sms'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40 font-bold shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PhoneCall className="w-4 h-4 text-red-400" />
            <span>Deliver to Your Real Mobile Number</span>
          </button>

          <button
            onClick={() => setActiveTab('broadcast')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'broadcast'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-[0_0_10px_rgba(0,210,255,0.2)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>Area-Wide Cell Broadcast (WEA)</span>
          </button>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            {([
              { id: 'HI', label: 'हिंदी (Hindi)' },
              { id: 'MR', label: 'मराठी (Marathi)' },
              { id: 'KN', label: 'ಕನ್ನಡ (Kannada)' },
              { id: 'TA', label: 'தமிழ் (Tamil)' },
              { id: 'EN', label: 'English' }
            ] as const).map(lang => (
              <button
                key={lang.id}
                onClick={() => setSelectedLang(lang.id as any)}
                className={`px-2.5 py-1 rounded transition-all text-[11px] ${
                  selectedLang === lang.id
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center space-x-1 text-xs font-mono text-slate-400 hover:text-cyan-300 p-1 rounded"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{showConfig ? 'Hide SMS API Config' : 'Configure Fast2SMS / Twilio'}</span>
          </button>
        </div>

        {/* Optional SMS Gateway Configuration Drawer */}
        {showConfig && (
          <div className="p-4 bg-slate-900/90 rounded-xl border border-cyan-500/40 space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between text-cyan-300 font-bold">
              <span className="flex items-center space-x-1.5">
                <Key className="w-3.5 h-3.5" />
                <span>Cellular SMS Gateway Credentials (Fast2SMS / Twilio)</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              For direct cellular SMS to Indian numbers via telecom towers, enter your free Fast2SMS API key (from <a href="https://www.fast2sms.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">fast2sms.com</a>) or Twilio credentials:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Fast2SMS India API Key:</label>
                <input
                  type="password"
                  placeholder="Paste Fast2SMS Key..."
                  value={fast2smsKey}
                  onChange={(e) => setFast2smsKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Twilio Account SID (Optional):</label>
                <input
                  type="text"
                  placeholder="ACxxxxxxxx..."
                  value={twilioSid}
                  onChange={(e) => setTwilioSid(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'direct_sms' ? (
          /* Direct Mobile Delivery Hub */
          <div className="space-y-4">
            {/* Phone Number Input */}
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
              <label className="text-xs font-mono font-bold text-white flex items-center justify-between">
                <span className="flex items-center space-x-1.5">
                  <PhoneCall className="w-4 h-4 text-red-400" />
                  <span>Enter Your Mobile Number:</span>
                </span>
                <span className="text-emerald-400 text-[10px]">e.g. 9876543210 or +919876543210</span>
              </label>
              
              <div className="flex items-center space-x-2">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter 10-digit mobile number..."
                  className="flex-1 bg-slate-950 border border-slate-700 focus:border-red-500 rounded-xl p-3 text-sm font-mono text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Instant Guaranteed Mobile Delivery Options */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-300">
                <span className="flex items-center space-x-1.5">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>Instant Delivery Channels for Your Phone:</span>
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-600/50">
                  Guaranteed Instant Receive
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
                {/* 1-Click WhatsApp Delivery */}
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 rounded-xl flex flex-col items-center justify-center space-y-1 text-emerald-200 transition-all text-center"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold">Deliver via WhatsApp</span>
                  <span className="text-[9px] text-slate-400">Opens WhatsApp on phone</span>
                </a>

                {/* 1-Click Native Phone Messages App */}
                <a
                  href={nativeSmsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 rounded-xl flex flex-col items-center justify-center space-y-1 text-blue-200 transition-all text-center"
                >
                  <Smartphone className="w-5 h-5 text-blue-400" />
                  <span className="font-bold">Native SMS App</span>
                  <span className="text-[9px] text-slate-400">Opens phone SMS app</span>
                </a>

                {/* Instant Urgent Phone Push Feed with Siren */}
                <a
                  href={ntfyPushUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/50 rounded-xl flex flex-col items-center justify-center space-y-1 text-rose-200 transition-all text-center"
                >
                  <BellRing className="w-5 h-5 text-rose-400 animate-bounce" />
                  <span className="font-bold">Live Phone Alarm Feed</span>
                  <span className="text-[9px] text-slate-400">Rings emergency siren</span>
                </a>
              </div>

              {/* QR Code Instant Scan */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="space-y-1 pr-3">
                  <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <QrCode className="w-4 h-4 text-cyan-400" />
                    <span>Scan with Mobile Camera for Live Alert:</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono leading-relaxed">
                    Point your iPhone or Android camera at this QR code to instantly receive and view this disaster alert on your mobile screen with sound.
                  </p>
                </div>
                <img
                  src={qrCodeUrl}
                  alt="Scan QR for Mobile Alert"
                  className="w-20 h-20 rounded-lg border border-slate-700 bg-white p-1 flex-shrink-0"
                />
              </div>
            </div>

            {/* Message Preview */}
            <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 flex items-start space-x-3">
              <Smartphone className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-[11px] font-mono font-bold text-red-300 uppercase mb-1">
                  [NDMA DISASTER ALERT - {cityName.toUpperCase()}]
                </div>
                <pre className="text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
                  {activeMessageText}
                </pre>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center space-x-2 border border-slate-700"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>

              <button
                onClick={handleSendRealSms}
                disabled={isSendingSms || !phoneNumber.trim()}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-mono font-bold flex items-center space-x-2 shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
              >
                <Send className={`w-4 h-4 ${isSendingSms ? 'animate-spin' : ''}`} />
                <span>{isSendingSms ? 'Dispatching Alert...' : 'Dispatch Alert to Mobile & Webhook'}</span>
              </button>
            </div>

            {smsResult && (
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-xs font-mono text-emerald-300 flex items-center justify-between">
                <span>✓ Dispatched Batch {smsResult.batch_id} to {smsResult.total_recipients} numbers via {smsResult.gateway_used || 'Instant Mobile Hub'}</span>
                <span className="text-[10px] text-slate-400">{smsResult.timestamp}</span>
              </div>
            )}
          </div>
        ) : (
          /* Area-Wide Cell Broadcast (WEA) Tab */
          <div className="space-y-4">
            {/* Target Zones Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 font-bold uppercase">Target Evacuation Wards:</span>
                <span className="text-red-400">{selectedZones.length} Wards Selected</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {availableZones.map(zone => {
                  const isSelected = selectedZones.includes(zone);
                  return (
                    <button
                      key={zone}
                      onClick={() => toggleZone(zone)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${
                        isSelected
                          ? 'bg-red-500/20 text-red-300 border-red-500/40 font-bold'
                          : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}{zone}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preview Screen */}
            <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 flex items-start space-x-3">
              <Smartphone className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-xs font-mono font-bold text-red-300 uppercase mb-1">
                  [CIVIL DEFENSE EMERGENCY BROADCAST]
                </div>
                <pre className="text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
                  {getTranslatedMessage(selectedLang)}
                </pre>
              </div>
            </div>

            {/* Transmit Button */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center space-x-2 border border-slate-700"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>

              <button
                onClick={handleTransmitBroadcast}
                disabled={isTransmitting || selectedZones.length === 0}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-mono font-bold flex items-center space-x-2 shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
              >
                <Radio className={`w-4 h-4 ${isTransmitting ? 'animate-spin' : ''}`} />
                <span>{isTransmitting ? 'Transmitting EAS Alert...' : 'Transmit All-Agency Alert (EAS)'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
