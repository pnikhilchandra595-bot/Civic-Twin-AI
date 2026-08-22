import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Sparkles, X, Volume2, 
  CheckCircle2, AlertTriangle, Zap, ShieldCheck, RefreshCw, MessageSquare, Key, ExternalLink, Settings 
} from 'lucide-react';
import { apiService } from '../services/api';

interface AICopilotDrawerProps {
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

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  cityName,
  onClose
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: `👋 Greetings Commander. I am your **Autonomous AI Incident Commander Copilot** for **${cityName}**.\n\nI am connected to the **Google Gemini 1.5/2.0 Flash LLM Engine** and the Digital Twin Simulation Core. You can ask for evacuation routes, multi-lingual emergency broadcasts, hospital ICU triage, or directly issue tactical commands across the city. How can I assist?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'Google Gemini & Autonomous Tactical Engine'
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [selectedLang, setSelectedLang] = useState<'EN' | 'HI' | 'MR' | 'KN' | 'TA'>('EN');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showKeyConfig, setShowKeyConfig] = useState<boolean>(false);
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    return localStorage.getItem('civictwin_gemini_api_key') || '';
  });
  const [keySaved, setKeySaved] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSaveKey = () => {
    localStorage.setItem('civictwin_gemini_api_key', geminiApiKey.trim());
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2500);
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
      const data = await apiService.chatWithAICopilot(query, selectedLang, geminiApiKey);
      const responseText = data?.ai_response || `🤖 **CivicTwin Tactical Assessment for ${cityName}**:\n- Inundation telemetry evaluated across critical infrastructure.\n- Response teams (NDRF, Police, EMS) on high standby.\n- Primary high-ground evacuation shelters open at BKC MMRDA Grounds.`;
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: data?.executed_actions || [],
        modelUsed: data?.model || (geminiApiKey ? 'Google Gemini 1.5 Flash (Live Cloud API)' : 'CivicTwin Emergency Tactical Engine')
      };

      setMessages(prev => [...prev, aiMsg]);

      // Optional voice read-out of summary
      if ('speechSynthesis' in window && responseText) {
        try {
          const cleanText = responseText.replace(/[*_#`]/g, '').slice(0, 140);
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.rate = 1.05;
          window.speechSynthesis.speak(utterance);
        } catch (speechErr) {}
      }
    } catch (e) {
      console.error('AI chat error:', e);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: "⚠️ Connection error to AI agent core. Please check backend status.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    { label: "🌧️ Inject 90 mm/h Cloudburst", prompt: "Inject 90 mm/h cloudburst and recalculate risk" },
    { label: "🧭 Safe Evacuation Route", prompt: "What is the safest evacuation corridor right now?" },
    { label: "🏥 Enforce 108 Green Corridor", prompt: "Clear 108 green corridor for hospital ICU transfer" },
    { label: "📱 Draft Multi-Lingual SMS", prompt: "Draft emergency evacuation SMS in Hindi and Marathi" },
    { label: "⚡ Isolate Substation Power", prompt: "Isolate primary power grid substation" }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none">
      <div className="hud-panel w-full max-w-3xl rounded-2xl border border-cyan-500/50 flex flex-col h-[85vh] shadow-[0_0_70px_rgba(0,210,255,0.3)] bg-[#090e1a] text-slate-100 overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                <span>Autonomous AI Incident Commander</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500 text-cyan-300 font-mono">
                  Gemini & Tool-Calling Agent
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Natural Language Command Execution & Multi-Lingual Disaster Copilot
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Gemini API Key Toggle */}
            <button
              onClick={() => setShowKeyConfig(!showKeyConfig)}
              title="Configure Google Gemini API Key"
              className={`p-1.5 rounded-lg border text-xs font-mono flex items-center space-x-1 transition-all ${
                geminiApiKey
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-cyan-300'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{geminiApiKey ? 'Gemini Key Active' : 'Connect Gemini'}</span>
            </button>

            {/* Language Selector */}
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 text-cyan-300 text-xs rounded-lg px-2 py-1 font-mono font-bold"
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

        {/* Gemini API Key Config Drawer */}
        {showKeyConfig && (
          <div className="p-3.5 bg-slate-950 border-b border-cyan-500/40 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-bold flex items-center space-x-1 text-cyan-300">
                <Key className="w-3.5 h-3.5" />
                <span>Google Gemini API Key (Direct Cloud LLM Integration):</span>
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-cyan-400 hover:underline flex items-center space-x-1"
              >
                <span>Get Free Gemini Key from Google AI Studio</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
              />
              <button
                onClick={handleSaveKey}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-md flex items-center space-x-1"
              >
                {keySaved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : null}
                <span>{keySaved ? 'Saved!' : 'Save Key'}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              When saved, queries will be routed directly to Google's <strong>Gemini 1.5 / 2.0 Flash</strong> model for real-time generative emergency reasoning.
            </p>
          </div>
        )}

        {/* Chat Messages Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                  m.sender === 'user'
                    ? 'bg-cyan-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none shadow-lg'
                }`}
              >
                <div className="flex items-center space-x-1.5 text-[10px] text-cyan-300 mb-1 font-bold flex-wrap gap-y-1">
                  {m.sender === 'ai' ? <Bot className="w-3.5 h-3.5" /> : null}
                  <span>{m.sender === 'ai' ? 'CivicTwin AI Commander' : 'Incident Operator'}</span>
                  <span className="text-slate-400">• {m.timestamp}</span>
                  {m.modelUsed && (
                    <span className="px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-700 text-cyan-300 text-[9px] font-mono">
                      ⚡ {m.modelUsed}
                    </span>
                  )}
                </div>

                <div>{m.text}</div>

                {/* Executed Tools Badges */}
                {m.actions && m.actions.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800 space-y-1">
                    <span className="text-[10px] text-amber-400 font-bold block">
                      ⚡ Autonomous Digital Twin Tool Actions Executed:
                    </span>
                    {m.actions.map((act, i) => (
                      <div key={i} className="p-1.5 rounded bg-amber-950/40 border border-amber-500/40 text-amber-200 text-[10px] flex items-center space-x-1.5">
                        <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                        <span><strong>{act.tool}</strong>: {act.description}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-cyan-400 p-2 text-xs font-bold animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span>AI Incident Commander reasoning & calculating hydrological matrix...</span>
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
            placeholder="Ask AI Commander or give tactical order (e.g. 'Set rain to 80 mm/h and deploy NDRF boat')..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />

          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputPrompt.trim()}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl flex items-center space-x-1.5 shadow-lg transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>

      </div>
    </div>
  );
};
