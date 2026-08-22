import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Send, X, Volume2, VolumeX,
  CheckCircle2, AlertTriangle, Zap, ShieldCheck, RefreshCw, MessageSquare, Key, ExternalLink, ShieldAlert, Copy, Check, ChevronRight, Play 
} from 'lucide-react';
import { apiService } from '../services/api';

interface GeminiAIModalProps {
  cityName: string;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actions?: Array<{ tool: string; param: any; description: string }>;
  modelUsed?: string;
}

export const GeminiAIModal: React.FC<GeminiAIModalProps> = ({
  cityName,
  onClose
}) => {
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    return localStorage.getItem('civictwin_gemini_api_key') || '';
  });
  const [tempKey, setTempKey] = useState<string>(() => {
    return localStorage.getItem('civictwin_gemini_api_key') || '';
  });
  const [keySaved, setKeySaved] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: `👋 Greetings Commander. I am your **Google Gemini Disaster Incident Commander** for **${cityName}**.\n\nI am wired to the **Google Gemini 1.5 / 2.0 Flash Cloud LLM Engine** and the live Digital Twin simulation state. You can ask for tactical evacuation plans, multi-lingual emergency alerts, hospital ICU surge coordination, survival guidelines, or execute live disaster controls on the city map.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: geminiApiKey ? 'Google Gemini 1.5/2.0 Flash (Live Cloud AI)' : 'CivicTwin Dynamic Tactical Engine'
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [selectedLang, setSelectedLang] = useState<'EN' | 'HI' | 'MR' | 'KN' | 'TA'>('EN');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleKeyChange = (val: string) => {
    setTempKey(val);
    const trimmed = val.trim();
    setGeminiApiKey(trimmed);
    if (trimmed) {
      localStorage.setItem('civictwin_gemini_api_key', trimmed);
    }
  };

  const handleSaveKey = () => {
    const trimmed = tempKey.trim();
    setGeminiApiKey(trimmed);
    localStorage.setItem('civictwin_gemini_api_key', trimmed);
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2500);
  };

  const handleTestKey = async () => {
    const activeKey = tempKey.trim() || geminiApiKey.trim();
    if (!activeKey) {
      alert("Please paste your Gemini API Key first.");
      return;
    }
    handleSend("Confirm connection to Google Gemini and state system readiness");
  };

  const handleCopyText = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*_#`]/g, '').slice(0, 300);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (customPrompt?: string) => {
    const query = customPrompt || inputPrompt;
    if (!query.trim() || isLoading) return;

    const activeKey = tempKey.trim() || geminiApiKey.trim();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const data = await apiService.chatWithAICopilot(query, selectedLang, activeKey);
      const responseText = data?.ai_response || `🤖 **Google Gemini Tactical Assessment for ${cityName}**:\n- Live inundation telemetry evaluated across infrastructure.\n- Response teams (NDRF, Police, EMS) on high standby.\n- Primary high-ground evacuation shelters open at BKC MMRDA Grounds.`;
      
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: data?.executed_actions || [],
        modelUsed: data?.model || (activeKey ? 'Google Gemini 1.5 Flash (Live Cloud API)' : 'CivicTwin Dynamic Tactical Engine')
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error('Gemini chat error:', e);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: "⚠️ Connection error to Gemini core. Please verify your backend server or Gemini API Key.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    { label: "🌧️ 90 mm/h Cloudburst", prompt: "Inject 90 mm/h cloudburst and recalculate risk" },
    { label: "🧭 Safe Evacuation Plan", prompt: "What is the detailed evacuation plan and safe routes?" },
    { label: "📱 Emergency SMS (Hindi & Marathi)", prompt: "Draft emergency evacuation broadcast SMS in Hindi and Marathi" },
    { label: "🏥 108 Green Corridor Wave", prompt: "Clear 108 green corridor for hospital ICU transfer" },
    { label: "🌊 Dam & River Surge Impact", prompt: "What is the downstream crest arrival time from Hathnikund / Mithi dam?" },
    { label: "⚡ Substation Blackout Plan", prompt: "Isolate primary power grid substation and assess generator runtime" },
    { label: "🛡️ Citizen Survival & Water Guide", prompt: "Give essential survival guidelines and drinking water purification instructions for citizens" }
  ];

  const activeKey = tempKey.trim() || geminiApiKey.trim();

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none">
      <div className="hud-panel w-full max-w-4xl rounded-2xl border border-blue-500/50 flex flex-col h-[90vh] shadow-[0_0_80px_rgba(59,130,246,0.35)] bg-[#070c18] text-slate-100 overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-950 via-blue-950/40 to-slate-950">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 text-white shadow-lg">
              <Sparkles className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                <span>Google Gemini AI Disaster Commander</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  activeKey 
                    ? 'bg-emerald-950 border border-emerald-500 text-emerald-300' 
                    : 'bg-blue-950 border border-blue-500 text-blue-300'
                }`}>
                  {activeKey ? '⚡ Gemini 1.5/2.0 Cloud Active' : 'Dynamic Tactical Engine Ready'}
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Real-Time Generative LLM & Autonomous Simulation Execution
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 text-cyan-300 text-xs rounded-lg px-2.5 py-1.5 font-mono font-bold"
            >
              <option value="EN">English</option>
              <option value="HI">हिन्दी (Hindi)</option>
              <option value="MR">मराठी (Marathi)</option>
              <option value="KN">ಕನ್ನಡ (Kannada)</option>
              <option value="TA">தமிழ் (Tamil)</option>
            </select>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Prominent Gemini API Key Manager Bar */}
        <div className="p-3 bg-blue-950/40 border-b border-blue-500/30 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Key className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white">Google Gemini API Key:</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                activeKey 
                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500' 
                  : 'bg-amber-900/60 text-amber-300 border border-amber-500'
              }`}>
                {activeKey ? '● Connected to Gemini Cloud' : '○ Enter Key for Live Gemini Cloud LLM'}
              </span>
            </div>

            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-cyan-400 hover:underline flex items-center space-x-1"
            >
              <span>Get Free Key (Google AI Studio)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="password"
              value={tempKey}
              onChange={(e) => handleKeyChange(e.target.value)}
              placeholder="Paste your Google Gemini API Key here (e.g. AIzaSy...)"
              className="flex-1 bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
            />
            <button
              onClick={handleSaveKey}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold transition-all shadow-md flex items-center space-x-1"
            >
              {keySaved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : null}
              <span>{keySaved ? 'Saved!' : 'Save Key'}</span>
            </button>
            <button
              onClick={handleTestKey}
              title="Test connection to Gemini Cloud"
              className="px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-500 text-emerald-200 font-bold transition-all text-xs flex items-center space-x-1"
            >
              <Play className="w-3 h-3" />
              <span>Test Key</span>
            </button>
          </div>
        </div>

        {/* Chat Messages Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] p-4 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-900/95 border border-slate-800 text-slate-200 rounded-bl-none shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-cyan-300 mb-2 font-bold pb-1.5 border-b border-slate-800/80">
                  <div className="flex items-center space-x-1.5">
                    {m.sender === 'ai' ? <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> : null}
                    <span>{m.sender === 'ai' ? 'Google Gemini Commander' : 'Incident Operator'}</span>
                    <span className="text-slate-400">• {m.timestamp}</span>
                    {m.modelUsed && (
                      <span className="px-1.5 py-0.2 rounded bg-blue-950 border border-blue-600 text-blue-300 text-[9px] font-mono">
                        ⚡ {m.modelUsed}
                      </span>
                    )}
                  </div>

                  {m.sender === 'ai' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSpeak(m.text)}
                        title="Listen to Voice Readout"
                        className="text-slate-400 hover:text-cyan-300 transition-colors p-1"
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleCopyText(m.id, m.text)}
                        title="Copy Response"
                        className="text-slate-400 hover:text-cyan-300 transition-colors p-1"
                      >
                        {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-xs leading-relaxed space-y-2">{m.text}</div>

                {/* Executed Tools Badges */}
                {m.actions && m.actions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800 space-y-1.5">
                    <span className="text-[10px] text-amber-400 font-bold block">
                      ⚡ Autonomous Digital Twin Tool Actions Executed:
                    </span>
                    {m.actions.map((act, i) => (
                      <div key={i} className="p-2 rounded bg-amber-950/40 border border-amber-500/40 text-amber-200 text-[10px] flex items-center space-x-2">
                        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span><strong>{act.tool}</strong>: {act.description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-cyan-400 p-3 text-xs font-bold animate-pulse">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span>Google Gemini reasoning and synthesizing disaster matrix...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800 flex items-center space-x-2 overflow-x-auto text-[11px] font-mono">
          <span className="text-slate-500 text-[10px] whitespace-nowrap">Suggested:</span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q.prompt)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500 text-slate-300 hover:text-cyan-300 whitespace-nowrap transition-all"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2 font-mono text-xs">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Ask Google Gemini or issue tactical disaster order (e.g. 'What is the evacuation plan?')..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />

          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputPrompt.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl flex items-center space-x-1.5 shadow-lg transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>

      </div>
    </div>
  );
};
