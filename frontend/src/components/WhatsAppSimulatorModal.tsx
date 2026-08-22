import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, Send, Check, CheckCheck, Phone, Video, 
  MapPin, ShieldAlert, Sparkles, X, User, Bot, AlertTriangle, Droplets, Compass
} from 'lucide-react';
import { apiService } from '../services/api';

interface WhatsAppSimulatorModalProps {
  cityName: string;
  onClose: () => void;
}

interface WAMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  isLocation?: boolean;
}

export const WhatsAppSimulatorModal: React.FC<WhatsAppSimulatorModalProps> = ({
  cityName,
  onClose
}) => {
  const [messages, setMessages] = useState<WAMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: `🇮🇳 *Government of India – National Disaster Management (NDMA)*\n\nWelcome to the official 24/7 Civil Defense Emergency WhatsApp Bot for *${cityName}*.\n\nReply with:\n1️⃣ *SOS* – Immediate rescue dispatch\n2️⃣ *SHELTER* – Nearest high-ground relief centers\n3️⃣ *WATER* – Safe drinking water guidelines\n4️⃣ Or *Share Location* 📍`,
      timestamp: '10:00 AM'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (customText?: string) => {
    const query = customText || inputText;
    if (!query.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: WAMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: time
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(async () => {
      let replyText = '';
      const lower = query.toLowerCase();

      if (lower.includes('sos') || lower.includes('rescue') || lower.includes('help') || lower.includes('1')) {
        replyText = `🚨 *EMERGENCY SOS LOGGED!*\n\n• Unit Assigned: *NDRF Inflatable Raft Alpha*\n• Priority: *CRITICAL (Level 1)*\n• Tracking ID: *#SOS-NDMA-${Math.floor(1000 + Math.random() * 9000)}*\n\nStay on high ground. If mobile signal drops, send SMS to *112*. Help is en route.`;
      } else if (lower.includes('shelter') || lower.includes('2') || lower.includes('relief')) {
        replyText = `🧭 *NEAREST OPEN RELIEF SHELTERS (${cityName}):*\n\n1. *BKC MMRDA Grounds* (Elevation 12.5m) – Capacity: 10,000 | Food & Medical Active\n2. *Bandra YMCA Center* (Elevation 18.2m) – Capacity: 2,500\n3. *KEM Hospital Ward* (Elevation 9.2m) – 24/7 ICU Triage\n\nTake elevated arterial roads only.`;
      } else if (lower.includes('water') || lower.includes('drink') || lower.includes('3')) {
        replyText = `💧 *SAFE DRINKING WATER PROTOCOL:*\n\n• *Boil for 3+ Minutes* vigorously to neutralize waterborne bacteria.\n• Or add *2 drops of 5% chlorine bleach* per liter and let sit for 30 minutes.\n• Avoid all flood tap water until BMC clearance.`;
      } else if (lower.includes('location') || lower.includes('gps') || lower.includes('4')) {
        replyText = `📍 *GPS LOCATION RECEIVED:*\n\n• Coordinates: *19.0760° N, 72.8777° E*\n• Nearest Relief Node: *BKC Sector 3 High-Ground (850m North)*\n• Flood Risk: *MODERATE RUNOFF*\n\nProceed north along the elevated skywalk.`;
      } else {
        try {
          const res = await apiService.chatWithAICopilot(query, 'EN');
          replyText = res?.ai_response || `🤖 *NDMA Advisory for ${cityName}:*\nActive rainfall evaluated. Response teams deployed. Stay tuned for emergency bulletins.`;
        } catch {
          replyText = `🤖 *NDMA Automated Alert:*\nStay indoors. Avoid low-lying underpasses and open electrical manholes. Emergency helpline: *112* / *1070*.`;
        }
      }

      const botMsg: WAMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none font-sans">
      <div className="w-full max-w-md rounded-3xl border border-emerald-500/50 flex flex-col h-[750px] bg-[#0b141a] text-slate-100 shadow-[0_0_80px_rgba(16,185,129,0.3)] overflow-hidden">
        
        {/* WhatsApp Top Header Bar */}
        <div className="p-3.5 bg-[#1f2c34] border-b border-[#2a3942] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-emerald-600 border border-emerald-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
                NDMA
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#1f2c34] rounded-full" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center space-x-1.5">
                <span>NDMA Civil Defense Bot</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-600 font-mono">
                  VERIFIED
                </span>
              </div>
              <div className="text-[11px] text-emerald-400 font-sans">Official Govt Emergency Channel</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#111b21] text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WhatsApp Chat Messages Canvas */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0b141a] bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px]">
          
          {/* Official Encryption Notice */}
          <div className="text-center">
            <span className="inline-block px-3 py-1 rounded-lg bg-[#182229] border border-[#222e35] text-[10px] text-amber-300/80 font-sans">
              🔒 Messages are end-to-end encrypted with NDMA Emergency Servers.
            </span>
          </div>

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed font-sans shadow-md relative ${
                  m.sender === 'user'
                    ? 'bg-[#005c4b] text-white rounded-tr-none'
                    : 'bg-[#202c33] text-slate-100 rounded-tl-none border border-[#2a3942]'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
                <div className="flex items-center justify-end space-x-1 mt-1 text-[9px] text-slate-400">
                  <span>{m.timestamp}</span>
                  {m.sender === 'user' && <CheckCheck className="w-3 h-3 text-cyan-400" />}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#202c33] rounded-2xl px-4 py-2.5 text-xs text-emerald-400 flex items-center space-x-1.5 rounded-tl-none border border-[#2a3942]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[10px] text-slate-400 ml-1">NDMA Bot typing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-[#1f2c34] border-t border-[#2a3942] flex items-center space-x-2 overflow-x-auto text-[11px] font-sans">
          <button
            onClick={() => handleSend('🚨 Request Immediate Flood SOS Rescue')}
            className="px-2.5 py-1 rounded-full bg-rose-950/80 hover:bg-rose-900 border border-rose-500 text-rose-200 whitespace-nowrap cursor-pointer transition-all"
          >
            🚨 SOS Rescue
          </button>
          <button
            onClick={() => handleSend('🧭 Nearest Safe Evacuation Shelters?')}
            className="px-2.5 py-1 rounded-full bg-[#111b21] hover:bg-[#202c33] border border-[#2a3942] text-slate-200 whitespace-nowrap cursor-pointer transition-all"
          >
            🧭 Open Shelters
          </button>
          <button
            onClick={() => handleSend('📍 Share My Live GPS Coordinates')}
            className="px-2.5 py-1 rounded-full bg-[#111b21] hover:bg-[#202c33] border border-[#2a3942] text-slate-200 whitespace-nowrap cursor-pointer transition-all"
          >
            📍 Drop Pin
          </button>
        </div>

        {/* WhatsApp Message Input Bar */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="p-3 bg-[#1f2c34] border-t border-[#2a3942] flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message or command (e.g. SOS)..."
            className="flex-1 bg-[#2a3942] border-none rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            className="p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
