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
  Compass
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
  const [customInput, setCustomInput] = useState('');

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
        suggestions: currentCurrency === '₹' ? [
          '₹800 (AC Bus / Sleeper Rail)',
          '₹2000 (3AC Express / State Volvo)',
          '₹4500 (Vande Bharat / Air Standby)',
          '₹9000 (Priority Air / Premium Tatkal)',
        ] : [
          `${currentCurrency}150 (Budget Bus / Rail)`,
          `${currentCurrency}300 (Standard Express)`,
          `${currentCurrency}600 (Priority Reroute)`,
          `${currentCurrency}1200 (Emergency Any-Mode)`,
        ],
      },
    ]);
    setCurrentStepIndex(2);
  };

  const handleSelectBudget = (budgetOption: string) => {
    const rawVal = budgetOption.replace(/[^0-9]/g, '');
    const numVal = parseInt(rawVal, 10) || 600;
    setBudget(numVal);

    setMessages((prev) => [
      ...prev,
      { id: `usr-${Date.now()}`, sender: 'user', text: `Budget Cap: ${currentCurrency}${numVal}` },
      {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Logged budget limit of ${currentCurrency}${numVal}. Finally, what is the primary urgency context for your travel rescue?`,
        step: 'emergency',
        suggestions: [
          'Flight Cancelled / Stranded at Airport',
          'Missed Rail Connection / Last-minute',
          'Fastest Reroute (Ignore Carbon)',
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
      currency: currentCurrency,
      targetTime,
      travelPriority: 'Fastest Safe Reroute',
      emergencyType,
    });
  };

  const resetWizard = () => {
    setOrigin('New York (JFK)');
    setDestination('London Heathrow (LHR)');
    setBudget(600);
    setTargetTime('ASAP (< 8 Hours)');
    setEmergencyType('Flight Cancelled / Reroute Urgent');
    setCurrentStepIndex(0);
    setMessages([
      {
        id: 'm1',
        sender: 'bot',
        text: 'Welcome to Travel Rescue Agent. I am your multi-modal route research assistant. Where are you currently starting from, and where do you need to reach?',
        step: 'origin_dest',
        suggestions: [
          'JFK New York ➔ LHR London',
          'LAX Los Angeles ➔ ORD Chicago',
          'SFO San Francisco ➔ SEA Seattle',
          'CDG Paris ➔ ZRH Zurich',
          'DEL Delhi ➔ BOM Mumbai',
          'BER Berlin ➔ AMS Amsterdam',
        ],
      },
    ]);
  };

  const currentBotMessage = messages[messages.length - 1]?.sender === 'bot' ? messages[messages.length - 1] : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
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

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1"><Plane className="w-3.5 h-3.5 text-blue-600" /> Flights</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Train className="w-3.5 h-3.5 text-blue-600" /> Trains</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Bus className="w-3.5 h-3.5 text-blue-600" /> Buses</span>
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
              <span>{currentCurrency}{budget}</span>
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
                calculates fastest routes, timing schedules, and exact cost breakdowns
              </div>
            </motion.div>
          )}
        </div>

      </div>

    </div>
  );
};
