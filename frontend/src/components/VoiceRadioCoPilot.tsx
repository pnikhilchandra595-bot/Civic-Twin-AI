import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Radio, Volume2, Sparkles, 
  Check, X, Activity, MessageSquare, Send, CornerDownLeft 
} from 'lucide-react';
import { apiService } from '../services/api';

interface VoiceRadioCoPilotProps {
  cityName: string;
  onClose: () => void;
}

export const VoiceRadioCoPilot: React.FC<VoiceRadioCoPilotProps> = ({
  cityName,
  onClose
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [dialogueHistory, setDialogueHistory] = useState<Array<{ sender: 'OPERATOR' | 'AI_COMMANDER'; text: string; timestamp: string }>>([
    {
      sender: 'AI_COMMANDER',
      text: `Tactical Voice Radio Co-Pilot online. Standing by for voice directives for ${cityName}. Press and hold the mic or type your directive below.`,
      timestamp: '10:20:00'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech Recognition if available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleSendDirective(text);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. You can type your voice command in the box below!");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendDirective = async (queryText?: string) => {
    const textToSend = queryText || transcript;
    if (!textToSend.trim()) return;

    const time = new Date().toLocaleTimeString();

    // Add Operator message
    setDialogueHistory(prev => [...prev, { sender: 'OPERATOR', text: textToSend, timestamp: time }]);
    setTranscript('');
    setIsProcessing(true);

    try {
      const result = await apiService.sendVoiceRadioCommand(textToSend);
      const responseTime = new Date().toLocaleTimeString();

      // Add AI response
      setDialogueHistory(prev => [...prev, { sender: 'AI_COMMANDER', text: result.commander_response, timestamp: responseTime }]);

      // Speak back over audio
      speakResponse(result.commander_response);
    } catch (e) {
      console.error('Voice directive error', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const quickPrompts = [
    "Status report for active floodplains",
    "Simulate power substation trip",
    "Initiate 100-year storm scenario",
    "Deploy NDRF swift water rescue boat",
    "Broadcast emergency evacuation order"
  ];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="hud-panel w-full max-w-2xl rounded-2xl border border-cyan-500/40 p-6 flex flex-col space-y-4 shadow-[0_0_60px_rgba(0,210,255,0.25)] max-h-[90vh] overflow-y-auto bg-[#090e1a]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
                <span>Push-To-Talk AI Voice Incident Co-Pilot</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-300 font-mono">
                  Natural Language Command & Squelch Audio
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Speak directly to the digital twin to execute crisis simulations and SITREPs ({cityName})
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

        {/* Dialogue Stream History */}
        <div className="flex-1 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs max-h-72 overflow-y-auto">
          {dialogueHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex flex-col space-y-1 ${
                msg.sender === 'OPERATOR'
                  ? 'bg-slate-900/90 border-slate-700 ml-8 text-right'
                  : 'bg-cyan-950/40 border-cyan-500/40 mr-8 text-left shadow-md'
              }`}
            >
              <div className={`text-[10px] font-bold uppercase flex items-center space-x-1.5 ${
                msg.sender === 'OPERATOR' ? 'justify-end text-slate-400' : 'text-cyan-400'
              }`}>
                <span>{msg.sender === 'OPERATOR' ? '🎙️ EOC Operator Directive' : '🤖 AI Incident Commander'}</span>
                <span className="text-slate-600">• {msg.timestamp}</span>
              </div>
              <p className="text-slate-100 font-sans text-xs leading-relaxed">
                {msg.text}
              </p>
            </div>
          ))}

          {isProcessing && (
            <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-xl text-xs font-mono text-cyan-300 flex items-center space-x-2 animate-pulse">
              <Activity className="w-4 h-4 animate-spin" />
              <span>AI Incident Commander synthesizing operational response...</span>
            </div>
          )}
        </div>

        {/* Quick Voice Prompt Chips */}
        <div className="space-y-1">
          <div className="text-[10px] font-mono text-slate-400 uppercase">⚡ Quick Spoken Directives:</div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendDirective(prompt)}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 rounded-lg text-xs font-mono text-slate-300 hover:text-cyan-200 transition-all text-left"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>

        {/* Push-to-Talk Mic & Text Input */}
        <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
          <button
            onClick={toggleListening}
            className={`p-3.5 rounded-xl border flex items-center justify-center transition-all shadow-lg ${
              isListening
                ? 'bg-red-600 text-white border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.6)] animate-pulse'
                : 'bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border-cyan-500/50'
            }`}
            title="Click to Speak"
          >
            {isListening ? <Mic className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          <input
            type="text"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendDirective()}
            placeholder={isListening ? "Listening to your voice... Speak now..." : "Speak into mic or type voice directive..."}
            className="flex-1 bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl p-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
          />

          <button
            onClick={() => handleSendDirective()}
            disabled={!transcript.trim()}
            className="p-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl shadow-md transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
