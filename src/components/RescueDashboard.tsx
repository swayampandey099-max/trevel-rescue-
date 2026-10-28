import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plane, 
  Train, 
  Bus, 
  Layers, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  Copy, 
  Check, 
  Share2, 
  Info,
  ChevronDown,
  Luggage,
  X,
  MessageSquare,
  ShieldAlert
} from 'lucide-react';
import { RescueResearchResult, RescueOption, RouteLeg } from '../types';

interface RescueDashboardProps {
  rescueData: RescueResearchResult;
  onOpenChat: () => void;
  onModifySearch: () => void;
}

export const RescueDashboard: React.FC<RescueDashboardProps> = ({
  rescueData,
  onOpenChat,
  onModifySearch,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'flight' | 'train' | 'bus' | 'hybrid'>('all');
  const [selectedOption, setSelectedOption] = useState<RescueOption | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredOptions = rescueData.options.filter((opt) => {
    if (selectedFilter === 'all') return true;
    return opt.type === selectedFilter;
  });

  const handleCopySummary = (option: RescueOption) => {
    const legsText = option.legs
      .map((l) => `${l.mode.toUpperCase()}: ${l.operator} (${l.codeOrNumber}) ${l.fromStation} ➔ ${l.toStation} [${l.departureTime} - ${l.arrivalTime}]`)
      .join('\n');

    const text = `AURA TRAVEL RESCUE PLAN
Corridor: ${rescueData.origin} ➔ ${rescueData.destination}
Option: ${option.title} (${option.currency}${option.totalPrice})
Duration: ${option.totalDuration} | Reliability: ${option.reliabilityScore}%

SCHEDULE:
${legsText}

INSTRUCTIONS:
${option.stepByStepInstructions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Booking Advice: ${option.bookingAdvice}`;

    navigator.clipboard.writeText(text);
    setCopiedId(option.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const modeIcon = (mode: string) => {
    switch (mode) {
      case 'flight': return <Plane className="w-4 h-4 text-blue-600" />;
      case 'train': return <Train className="w-4 h-4 text-emerald-600" />;
      case 'bus': return <Bus className="w-4 h-4 text-amber-600" />;
      default: return <Layers className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Hero Human Instruction Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          
          <div className="lg:col-span-8 p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-200/60 font-mono-num">
                {rescueData.origin} ➔ {rescueData.destination}
              </span>
              <span>·</span>
              <span>Target: {rescueData.targetDeadline}</span>
              <span>·</span>
              <span>Budget Cap: {rescueData.currency}{rescueData.budgetCap}</span>
            </div>

            <h1 className="font-americana text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <span>Emergency Travel Rescue Plan</span>
              <span className="font-bernhard text-blue-600 font-normal text-xl sm:text-2xl border-l border-slate-200 pl-3">
                verified choices
              </span>
            </h1>

            <div className="p-4 bg-blue-50/60 border border-blue-200/60 rounded-xl space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>AI Human Action Instructions:</span>
              </div>
              <p>{rescueData.humanRescueSummary}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenChat}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask AI Travel Assistant</span>
              </button>

              <button
                onClick={onModifySearch}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all"
              >
                Modify Parameters
              </button>
            </div>
          </div>

          {/* Hero Banner Visual Asset */}
          <div className="lg:col-span-4 relative min-h-[220px] bg-slate-100 hidden sm:block">
            <img
              src="/src/assets/images/travel_rescue_hero_1793180156547.jpg"
              alt="Travel Rescue Hub"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-xs font-medium tracking-wide drop-shadow-xs">
                Multi-Modal Route Synchronization
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Section Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-200/80" />
        </div>
        <div className="relative flex justify-center text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          <span className="bg-[#f8fafc] px-3 font-bernhard text-base text-slate-500 lowercase">
            available multi-modal transit options
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
              selectedFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Options ({rescueData.options.length})
          </button>
          
          <button
            onClick={() => setSelectedFilter('flight')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${
              selectedFilter === 'flight'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plane className="w-3 h-3" />
            <span>Flights</span>
          </button>

          <button
            onClick={() => setSelectedFilter('train')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${
              selectedFilter === 'train'
                ? 'bg-white text-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Train className="w-3 h-3" />
            <span>Trains</span>
          </button>

          <button
            onClick={() => setSelectedFilter('bus')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${
              selectedFilter === 'bus'
                ? 'bg-white text-amber-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bus className="w-3 h-3" />
            <span>Buses</span>
          </button>

          <button
            onClick={() => setSelectedFilter('hybrid')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${
              selectedFilter === 'hybrid'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Hybrid</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-mono-num">
          Showing {filteredOptions.length} verified routes
        </div>
      </div>

      {/* Route Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOptions.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.15 }}
            className={`bg-white rounded-2xl border p-6 shadow-xs relative flex flex-col justify-between transition-all ${
              option.recommended
                ? 'border-blue-500 ring-2 ring-blue-500/10'
                : 'border-slate-200/80 hover:border-slate-300'
            }`}
          >
            {/* Recommended Tag */}
            {option.recommended && (
              <div className="absolute -top-3 left-6 px-3 py-0.5 bg-blue-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                <span>AI Recommended Rescue</span>
              </div>
            )}

            <div className="space-y-4">
              
              {/* Header & Price */}
              <div className="flex items-start justify-between gap-4 pt-1">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-slate-100 rounded-lg">
                      {modeIcon(option.type)}
                    </span>
                    <h3 className="font-americana text-lg font-bold text-slate-900">
                      {option.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">{option.subtitle}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono-num text-xl sm:text-2xl font-bold text-blue-600">
                    {option.currency}{option.totalPrice}
                  </div>
                  <div className="text-[10px] text-slate-400">Total fare</div>
                </div>
              </div>

              {/* Timing & Transfers Bar */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs font-mono-num">
                <div>
                  <span className="text-slate-400 block text-[10px]">DEPART</span>
                  <span className="font-semibold text-slate-900">{option.departureTime}</span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-400">{option.totalDuration}</span>
                  <div className="w-20 sm:w-28 h-0.5 bg-slate-200 relative my-1">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-600" />
                  </div>
                  <span className="text-[10px] font-medium text-slate-500">
                    {option.transfersCount === 0 ? 'Direct' : `${option.transfersCount} Transfer`}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">ARRIVE</span>
                  <span className="font-semibold text-slate-900">{option.arrivalTime}</span>
                </div>
              </div>

              {/* Reliability & Stress Metric */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                  <div className="text-[10px] text-slate-500 font-medium">On-Time Reliability</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full" 
                        style={{ width: `${option.reliabilityScore}%` }}
                      />
                    </div>
                    <span className="font-mono-num font-semibold text-slate-800">{option.reliabilityScore}%</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                  <div className="text-[10px] text-slate-500 font-medium">Stress Level</div>
                  <div className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${
                      option.stressScore === 'Low' ? 'bg-emerald-500' : option.stressScore === 'Moderate' ? 'bg-amber-500' : 'bg-red-500'
                    }`} />
                    <span>{option.stressScore} Stress</span>
                  </div>
                </div>
              </div>

              {/* Tagline */}
              <div className="text-xs text-slate-600 italic font-bernhard text-sm">
                "{option.tagline}"
              </div>

            </div>

            {/* Card Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => setSelectedOption(option)}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-98"
              >
                <span>View Timeline & Instructions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleCopySummary(option)}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs transition-colors shrink-0"
                title="Copy Rescue Plan text"
              >
                {copiedId === option.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

          </motion.div>
        ))}
      </div>

      {/* Detailed Modal Drawer */}
      <AnimatePresence>
        {selectedOption && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 relative"
            >
              <button
                onClick={() => setSelectedOption(null)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  {modeIcon(selectedOption.type)}
                  <span>{selectedOption.type} Rescue Blueprint</span>
                </div>
                <h2 className="font-americana text-2xl font-bold text-slate-900">
                  {selectedOption.title}
                </h2>
                <p className="text-xs text-slate-500">{selectedOption.subtitle}</p>
              </div>

              {/* Key Highlights Bar */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 grid grid-cols-3 gap-3 text-center text-xs font-mono-num">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Total Fare</span>
                  <span className="font-bold text-blue-600 text-base">{selectedOption.currency}{selectedOption.totalPrice}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Duration</span>
                  <span className="font-bold text-slate-800 text-base">{selectedOption.totalDuration}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Reliability</span>
                  <span className="font-bold text-emerald-600 text-base">{selectedOption.reliabilityScore}%</span>
                </div>
              </div>

              {/* Leg-by-leg breakdown */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Route Leg Breakdown
                </h3>

                <div className="space-y-3">
                  {selectedOption.legs.map((leg, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                        <span className="flex items-center gap-1.5">
                          {modeIcon(leg.mode)}
                          <span>{leg.operator}</span>
                          <span className="text-slate-400">({leg.codeOrNumber})</span>
                        </span>
                        <span className="font-mono-num text-blue-600">{selectedOption.currency}{leg.price}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono-num text-slate-600">
                        <div>
                          <div className="font-semibold text-slate-900">{leg.departureTime}</div>
                          <div className="text-[11px] text-slate-500">{leg.fromStation}</div>
                        </div>

                        <div className="text-slate-400">➔ {leg.duration} ➔</div>

                        <div className="text-right">
                          <div className="font-semibold text-slate-900">{leg.arrivalTime}</div>
                          <div className="text-[11px] text-slate-500">{leg.toStation}</div>
                        </div>
                      </div>

                      {leg.baggageNotes && (
                        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1">
                          <Luggage className="w-3.5 h-3.5 text-slate-400" />
                          <span>{leg.baggageNotes}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Human Step-by-Step Instructions */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Step-by-Step Execution Plan
                </h3>

                <ol className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {selectedOption.stepByStepInstructions.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="leading-snug pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Booking Advice */}
              <div className="p-4 bg-emerald-50 border border-emerald-200/60 rounded-xl text-xs text-emerald-900 space-y-1">
                <div className="font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Direct Booking Instruction:</span>
                </div>
                <p>{selectedOption.bookingAdvice}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleCopySummary(selectedOption)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Rescue Summary</span>
                </button>

                <button
                  onClick={() => setSelectedOption(null)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Close Blueprint
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
