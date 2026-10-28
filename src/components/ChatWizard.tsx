import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  MapPin, 
  Clock, 
  DollarSign, 
  AlertCircle, 
  RotateCcw,
  Plane,
  Train,
  Bus,
  ShieldAlert,
  Compass,
  AlertTriangle,
  Layers,
  Sparkles
} from 'lucide-react';
import { CurrencySymbol, RescueRequestParams } from '../types';

interface ChatWizardProps {
  currentCurrency: CurrencySymbol;
  onExecuteRescue: (params: RescueRequestParams) => void;
  isLoading: boolean;
}

interface MessageBubble {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  step?: 'origin_dest' | 'target_time' | 'budget' | 'emergency' | 'complete';
  suggestions?: string[];
}

export const ChatWizard: React.FC<ChatWizardProps> = ({
  currentCurrency,
  onExecuteRescue,
  isLoading,
}) => {
  // Form State
  const [origin, setOrigin] = useState('New Delhi (DEL)');
  const [destination, setDestination] = useState('Mumbai (BOM)');
  const [budget, setBudget] = useState<number>(4500);
  const [targetTime, setTargetTime] = useState('ASAP (< 12 Hours)');
  const [emergencyType, setEmergencyType] = useState('Flight Cancelled / IRCTC Tatkal Reroute');
  const [preferredMode, setPreferredMode] = useState<'all' | 'flight' | 'train' | 'bus' | 'hybrid'>('all');
  const [customInput, setCustomInput] = useState('');
  const [showDisruptedModal, setShowDisruptedModal] = useState(false);

  // Active Wizard Step: 0 = Origin/Dest, 1 = Target Time, 2 = Budget, 3 = Emergency, 4 = Ready
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [messages, setMessages] = useState<MessageBubble[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: 'Welcome to Travel Rescue Agent (Pan-India). I am your multi-modal route research assistant for Indian Railways (IRCTC/Vande Bharat), domestic airlines, state Volvo buses, and regional connections across all 28 states & 8 UTs. Where are you starting from, and where do you need to reach?',
      step: 'origin_dest',
      suggestions: [
        'DEL New Delhi ➔ BOM Mumbai',
        'BLR Bengaluru ➔ MAA Chennai',
        'CCU Kolkata ➔ GHY Guwahati',
        'HYD Hyderabad ➔ VZG Visakhapatnam',
        'COK Kochi ➔ BLR Bengaluru',
        'AMD Ahmedabad ➔ DEL New Delhi',
        'SXR Srinagar ➔ DEL New Delhi',
        'PNQ Pune ➔ BOM Mumbai',
        'PAT Patna ➔ CCU Kolkata',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentStepIndex]);

  const handleSelectRoutePreset = (preset: string) => {
    const parts = preset.split('➔').map((s) => s.trim());
    if (parts.length === 2) {
      setOrigin(parts[0]);
      setDestination(parts[1]);
    } else {
      setOrigin(preset);
    }

    const userMsgId = `usr-${Date.now()}`;
    const userText = `Origin: ${parts[0] || preset}, Destination: ${parts[1] || destination}`;
    
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: 'user', text: userText },
      {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Target corridor logged: ${parts[0] || preset} to ${parts[1] || destination}. When do you need to reach your destination?`,
        step: 'target_time',
        suggestions: [
          'ASAP / Next Available (< 6 Hours)',
          'Tonight before Midnight',
          'Tomorrow Morning (First departure)',
          'Flexible (Best Value Reroute)',
        ],
      },
    ]);

    setCurrentStepIndex(1);
  };

  const handleSelectTargetTime = (timeOption: string) => {
    setTargetTime(timeOption);
    setMessages((prev) => [
      ...prev,
      { id: `usr-${Date.now()}`, sender: 'user', text: `Arrival Goal: ${timeOption}` },
      {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Understood. What is your comfortable maximum budget cap for this trip? (Includes Flight, Train, Bus, or Shuttle fare combined)`,
        step: 'budget',
        suggestions: [
          '₹800 (AC Bus / Sleeper Rail)',
          '₹2000 (3AC Express / State Volvo)',
          '₹4500 (Vande Bharat / Air Standby)',
          '₹9000 (Priority Air / Premium Tatkal)',
        ],
      },
    ]);
    setCurrentStepIndex(2);
  };

  const handleSelectBudget = (budgetOption: string) => {
    const rawVal = budgetOption.replace(/[^0-9]/g, '');
    const numVal = parseInt(rawVal, 10) || 4500;
    setBudget(numVal);

    setMessages((prev) => [
      ...prev,
      { id: `usr-${Date.now()}`, sender: 'user', text: `Budget Cap: ₹${numVal}` },
      {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Logged budget limit of ₹${numVal}. Finally, what is the primary urgency context for your travel rescue?`,
        step: 'emergency',
        suggestions: [
          'Flight Cancelled / Stranded at Airport',
          'Train Cancelled / Tatkal Standby Needed',
          'Flight / Train Delayed (>2 Hours)',
          'Missed Connection at Transfer Station',
          'Strict Budget Priority (Lowest Cost)',
        ],
      },
    ]);
    setCurrentStepIndex(3);
  };

  const handleSelectEmergency = (emergency: string) => {
    setEmergencyType(emergency);
    setMessages((prev) => [
      ...prev,
      { id: `usr-${Date.now()}`, sender: 'user', text: `Scenario: ${emergency}` },
      {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `All rescue parameters locked. Ready to analyze real flight schedules, high-speed rail corridors, and express bus connections for ${origin} to ${destination}. Click "Execute AI Route Research" below.`,
        step: 'complete',
      },
    ]);
    setCurrentStepIndex(4);
  };

  const handleDisruptionPreset = (type: 'cancelled' | 'delayed' | 'missed') => {
    setShowDisruptedModal(false);
    if (type === 'cancelled') {
      setEmergencyType('Flight / Train Cancelled (Immediate Reroute)');
    } else if (type === 'delayed') {
      setEmergencyType('Flight / Train Delayed (>2 Hours)');
    } else {
      setEmergencyType('Missed Connection at Junction');
    }
    setTargetTime('ASAP (< 6 Hours)');
    
    setMessages((prev) => [
      ...prev,
      {
        id: `usr-disrupted-${Date.now()}`,
        sender: 'user',
        text: `EMERGENCY DISRUPTION: ${type === 'cancelled' ? 'Flight/Train Cancelled' : type === 'delayed' ? 'Delayed >2 Hours' : 'Missed Connection'}`,
      },
      {
        id: `bot-disrupted-${Date.now()}`,
        sender: 'bot',
        text: `Disruption logged! Ready to research emergency standby flights, Tatkal rail seats, and Volvo coaches for ${origin} ➔ ${destination}.`,
        step: 'complete',
      },
    ]);
    setCurrentStepIndex(4);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const text = customInput.trim();
    setCustomInput('');

    if (currentStepIndex === 0) {
      const parts = text.split(/to|->|➔/i).map(s => s.trim());
      if (parts.length >= 2) {
        setOrigin(parts[0]);
        setDestination(parts[1]);
      } else {
        setOrigin(text);
      }
      handleSelectRoutePreset(text);
    } else if (currentStepIndex === 1) {
      handleSelectTargetTime(text);
    } else if (currentStepIndex === 2) {
      handleSelectBudget(text);
    } else if (currentStepIndex === 3) {
      handleSelectEmergency(text);
    } else {
      triggerResearch();
    }
  };

  const triggerResearch = () => {
    onExecuteRescue({
      origin,
      destination,
      budget,
      currency: '₹',
      targetTime,
      travelPriority: preferredMode === 'all' ? 'Fastest Safe Reroute' : `${preferredMode.toUpperCase()} Priority`,
      emergencyType,
    });
  };

  const resetWizard = () => {
    setOrigin('New Delhi (DEL)');
    setDestination('Mumbai (BOM)');
    setBudget(4500);
    setTargetTime('ASAP (< 12 Hours)');
    setEmergencyType('Flight Cancelled / IRCTC Tatkal Reroute');
    setPreferredMode('all');
    setCurrentStepIndex(0);
    setMessages([
      {
        id: 'm1',
        sender: 'bot',
        text: 'Welcome to Travel Rescue Agent (Pan-India). I am your multi-modal route research assistant for Indian Railways (IRCTC/Vande Bharat), domestic airlines, state Volvo buses, and regional connections across all 28 states & 8 UTs. Where are you starting from, and where do you need to reach?',
        step: 'origin_dest',
        suggestions: [
          'DEL New Delhi ➔ BOM Mumbai',
          'BLR Bengaluru ➔ MAA Chennai',
          'CCU Kolkata ➔ GHY Guwahati',
          'HYD Hyderabad ➔ VZG Visakhapatnam',
          'COK Kochi ➔ BLR Bengaluru',
          'AMD Ahmedabad ➔ DEL New Delhi',
          'SXR Srinagar ➔ DEL New Delhi',
          'PNQ Pune ➔ BOM Mumbai',
          'PAT Patna ➔ CCU Kolkata',
        ],
      },
    ]);
  };

  const currentBotMessage = messages[messages.length - 1]?.sender === 'bot' ? messages[messages.length - 1] : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Disruption Alert Quick Trigger Bar */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5 text-xs text-amber-900 font-medium">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Is your current flight, train or bus disrupted right now?</span>
        </div>

        <button
          onClick={() => setShowDisruptedModal(true)}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors shrink-0"
        >
          My Journey is Disrupted
        </button>
      </div>

      {/* Disruption Type Selector Modal */}
      {showDisruptedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="space-y-1">
              <h3 className="font-americana text-lg font-bold text-slate-900">
                Select Disruption Scenario
              </h3>
              <p className="text-xs text-slate-500">
                Choose what happened to activate emergency rerouting.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleDisruptionPreset('cancelled')}
                className="w-full p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-left text-xs font-semibold text-red-900 flex items-center justify-between transition-colors"
              >
                <span>🚨 Flight or Train Cancelled</span>
                <span className="text-[10px] text-red-700">Immediate Reroute</span>
              </button>

              <button
                onClick={() => handleDisruptionPreset('delayed')}
                className="w-full p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-left text-xs font-semibold text-amber-900 flex items-center justify-between transition-colors"
              >
                <span>⏳ Flight or Train Delayed (&gt;2 Hours)</span>
                <span className="text-[10px] text-amber-700">Skip Long Delay</span>
              </button>

              <button
                onClick={() => handleDisruptionPreset('missed')}
                className="w-full p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-left text-xs font-semibold text-blue-900 flex items-center justify-between transition-colors"
              >
                <span>🏃 Missed Connection at Junction</span>
                <span className="text-[10px] text-blue-700">Catch Next Transit</span>
              </button>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowDisruptedModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Soft Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Multi-Modal Rescue Intelligence</span>
            </div>
            
            <h1 className="font-americana text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <span>Travel Rescue Agent</span>
              <span className="font-bernhard text-blue-600 font-normal text-2xl sm:text-3xl lowercase border-l border-slate-200 pl-3">
                sanctuary
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
              Researches real-time flight routes, high-speed rail timings, and express bus connections within your target budget and deadline.
            </p>
          </div>

          {/* Mode Selection Buttons */}
          <div className="space-y-1 shrink-0">
            <div className="text-[10px] font-semibold uppercase text-slate-400">Preferred Mode Filter:</div>
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-medium">
              <button
                onClick={() => setPreferredMode('all')}
                className={`px-2.5 py-1.5 rounded-lg transition-colors ${preferredMode === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600'}`}
              >
                All
              </button>
              <button
                onClick={() => setPreferredMode('flight')}
                className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${preferredMode === 'flight' ? 'bg-white text-blue-600 shadow-2xs font-semibold' : 'text-slate-600'}`}
              >
                <Plane className="w-3 h-3" />
                Flight
              </button>
              <button
                onClick={() => setPreferredMode('train')}
                className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${preferredMode === 'train' ? 'bg-white text-emerald-600 shadow-2xs font-semibold' : 'text-slate-600'}`}
              >
                <Train className="w-3 h-3" />
                Train
              </button>
              <button
                onClick={() => setPreferredMode('bus')}
                className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors ${preferredMode === 'bus' ? 'bg-white text-amber-600 shadow-2xs font-semibold' : 'text-slate-600'}`}
              >
                <Bus className="w-3 h-3" />
                Bus
              </button>
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200/80" />
          </div>
          <div className="relative flex justify-center text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            <span className="bg-white px-3">Travel Parameters Overview</span>
          </div>
        </div>

        {/* Live Parameter Bar Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/60">
            <span className="text-[10px] font-semibold text-slate-400 block uppercase">Origin & Destination</span>
            <div className="text-xs font-semibold text-slate-800 truncate mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
              <span>{origin} ➔ {destination}</span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/60">
            <span className="text-[10px] font-semibold text-slate-400 block uppercase">Target Arrival</span>
            <div className="text-xs font-semibold text-slate-800 truncate mt-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-600 shrink-0" />
              <span>{targetTime}</span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/60">
            <span className="text-[10px] font-semibold text-slate-400 block uppercase">Max Budget</span>
            <div className="text-xs font-semibold text-slate-800 truncate mt-0.5 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-blue-600 shrink-0" />
              <span>₹{budget}</span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/60">
            <span className="text-[10px] font-semibold text-slate-400 block uppercase">Context</span>
            <div className="text-xs font-semibold text-slate-800 truncate mt-0.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-blue-600 shrink-0" />
              <span>{emergencyType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-200/80" />
        </div>
        <div className="relative flex justify-center text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          <span className="bg-[#f8fafc] px-3 font-bernhard text-base text-slate-500 lowercase">
            interactive travel assistant flow
          </span>
        </div>
      </div>

      {/* Chat Bot Interface Canvas */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col min-h-[480px] overflow-hidden">
        
        {/* Chat Header */}
        <div className="px-6 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span>AI Rescue Wizard Assistant</span>
          </div>

          <button
            onClick={resetWizard}
            className="text-xs font-medium text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Flow</span>
          </button>
        </div>

        {/* Clickable Quick Prompt Chips Bar */}
        <div className="p-3 bg-blue-50/40 border-b border-blue-100/60 flex items-center gap-2 overflow-x-auto text-xs text-slate-600">
          <span className="text-[10px] font-semibold uppercase text-slate-400 shrink-0">Quick Prompts:</span>
          <button
            onClick={() => handleSelectBudget('₹3000 (Budget Cap)')}
            className="px-2.5 py-1 bg-white border border-slate-200 hover:border-blue-300 rounded-lg shrink-0 hover:text-blue-700 text-[11px] font-medium transition-colors"
          >
            "I have a ₹3,000 budget cap"
          </button>
          <button
            onClick={() => handleSelectTargetTime('Tonight before Midnight')}
            className="px-2.5 py-1 bg-white border border-slate-200 hover:border-blue-300 rounded-lg shrink-0 hover:text-blue-700 text-[11px] font-medium transition-colors"
          >
            "I need to reach before Midnight"
          </button>
          <button
            onClick={() => handleSelectEmergency('Flight Cancelled / Stranded at Airport')}
            className="px-2.5 py-1 bg-white border border-slate-200 hover:border-blue-300 rounded-lg shrink-0 hover:text-blue-700 text-[11px] font-medium transition-colors"
          >
            "Flight cancelled at Delhi Terminal 3"
          </button>
          <button
            onClick={() => handleSelectEmergency('Train Cancelled / Tatkal Standby Needed')}
            className="px-2.5 py-1 bg-white border border-slate-200 hover:border-blue-300 rounded-lg shrink-0 hover:text-blue-700 text-[11px] font-medium transition-colors"
          >
            "Is Vande Bharat Tatkal available?"
          </button>
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xl rounded-2xl px-5 py-3.5 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white shadow-xs font-medium rounded-br-xs'
                      : 'bg-white border border-slate-200/80 text-slate-800 shadow-xs rounded-bl-xs space-y-2'
                  }`}
                >
                  {msg.sender === 'bot' && (
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-[10px] font-semibold uppercase text-blue-600 font-americana tracking-wider">
                        AURA Intelligence
                      </span>
                      <span className="font-bernhard text-xs text-slate-400">
                        route research
                      </span>
                    </div>
                  )}
                  <p>{msg.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Interactive Suggestions Chips */}
          {currentBotMessage && currentBotMessage.suggestions && currentBotMessage.suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-2 pl-2 space-y-2"
            >
              <div className="text-[11px] font-medium text-slate-400 tracking-wide uppercase">
                Click a suggestion to select:
              </div>
              <div className="flex flex-wrap gap-2">
                {currentBotMessage.suggestions.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (currentStepIndex === 0) handleSelectRoutePreset(option);
                      else if (currentStepIndex === 1) handleSelectTargetTime(option);
                      else if (currentStepIndex === 2) handleSelectBudget(option);
                      else if (currentStepIndex === 3) handleSelectEmergency(option);
                    }}
                    className="px-3.5 py-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-medium text-slate-700 hover:text-blue-700 shadow-2xs transition-all active:scale-97"
                  >
                    <span>{option}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar or Execute Button */}
        <div className="p-4 border-t border-slate-100 bg-white space-y-3">
          
          {currentStepIndex < 4 ? (
            <form onSubmit={handleCustomSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder={
                  currentStepIndex === 0
                    ? 'Or enter custom origin & destination e.g. Boston to Philadelphia...'
                    : currentStepIndex === 1
                    ? 'Enter target time e.g. Today by 18:00...'
                    : currentStepIndex === 2
                    ? 'Enter max budget number e.g. 450...'
                    : 'Enter custom emergency details...'
                }
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all shrink-0 active:scale-95"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-3"
            >
              <button
                onClick={triggerResearch}
                disabled={isLoading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Flight, Train & Bus Networks...</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4" />
                    <span>Execute AI Travel Rescue Research</span>
                  </>
                )}
              </button>

              <div className="text-center text-[11px] text-slate-400 font-bernhard text-sm">
                calculates cheapest, fastest, and best overall routes against budget and arrival deadline
              </div>
            </motion.div>
          )}
        </div>

      </div>

    </div>
  );
};
