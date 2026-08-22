import React, { useState } from 'react';
import { RadioMessage, apiService } from '../services/api';
import { 
  Radio, Send, Shield, AlertTriangle, 
  Clock, CheckCircle, Volume2, UserCheck, MessageSquare 
} from 'lucide-react';

interface TacticalRadioFeedProps {
  messages: RadioMessage[];
  onSendMessage: (channel: string, sender: string, message: string, priority: string) => void;
}

export const TacticalRadioFeed: React.FC<TacticalRadioFeedProps> = ({
  messages,
  onSendMessage
}) => {
  const [selectedChannel, setSelectedChannel] = useState('TAC-1 Command');
  const [inputMessage, setInputMessage] = useState('');
  const [senderName, setSenderName] = useState('Operations Commander');
  const [priority, setPriority] = useState('PRIORITY');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    onSendMessage(selectedChannel, senderName, inputMessage.trim(), priority);
    setInputMessage('');
  };

  const getPriorityStyle = (p: string) => {
    switch (p) {
      case 'EMERGENCY':
      case 'FLASH':
        return 'text-red-400 bg-red-500/20 border-red-500/40 animate-pulse';
      case 'PRIORITY':
        return 'text-amber-400 bg-amber-500/20 border-amber-500/40';
      case 'ROUTINE':
      default:
        return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/40';
    }
  };

  return (
    <div className="hud-panel p-4 rounded-2xl flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
            Live Tactical Radio Comms Feed
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500 flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Encrypted APCO-P25 Radio</span>
        </span>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[160px] max-h-[300px]">
        {messages.map(msg => (
          <div key={msg.id} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <div className="flex items-center space-x-2">
                <span className="text-cyan-400 font-bold">{msg.channel}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 font-semibold">{msg.sender_callsign}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-1.5 py-0.2 rounded border uppercase ${getPriorityStyle(msg.priority)}`}>
                  {msg.priority}
                </span>
                <span className="text-slate-500">{msg.timestamp}</span>
              </div>
            </div>
            <p className="text-xs text-slate-200 font-sans leading-relaxed">
              {msg.message}
            </p>
          </div>
        ))}
      </div>

      {/* Radio Input Bar */}
      <form onSubmit={handleSend} className="pt-2 border-t border-slate-800 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-mono">
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-400"
          >
            <option value="TAC-1 Command">TAC-1 Command</option>
            <option value="TAC-2 Fire/Rescue">TAC-2 Fire/Rescue</option>
            <option value="TAC-3 EMS">TAC-3 EMS</option>
            <option value="TAC-4 Public Works">TAC-4 Public Works</option>
            <option value="TAC-5 Traffic">TAC-5 Traffic</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-400"
          >
            <option value="ROUTINE">ROUTINE</option>
            <option value="PRIORITY">PRIORITY</option>
            <option value="EMERGENCY">EMERGENCY</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Transmit directive to tactical units..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 font-sans focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all shadow-[0_0_10px_rgba(0,210,255,0.3)]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Transmit</span>
          </button>
        </div>
      </form>
    </div>
  );
};
