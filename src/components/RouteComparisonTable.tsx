import React from 'react';
import { Plane, Train, Bus, Layers, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { RescueResearchResult, RescueOption } from '../types';

interface RouteComparisonTableProps {
  rescueData: RescueResearchResult;
  onSelectOption: (option: RescueOption) => void;
}

export const RouteComparisonTable: React.FC<RouteComparisonTableProps> = ({
  rescueData,
  onSelectOption,
}) => {
  const modeIcon = (mode: string) => {
    switch (mode) {
      case 'flight': return <Plane className="w-4 h-4 text-blue-600" />;
      case 'train': return <Train className="w-4 h-4 text-emerald-600" />;
      case 'bus': return <Bus className="w-4 h-4 text-amber-600" />;
      default: return <Layers className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-americana text-2xl font-bold text-slate-900">
            Multi-Modal Reroute Matrix
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Side-by-side comparison across Flights, High-Speed Rail, Express Coaches, and Hybrid options for {rescueData.origin} ➔ {rescueData.destination}.
          </p>
        </div>

        <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-semibold border border-blue-200/60 flex items-center gap-1.5 shrink-0">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Budget Cap: {rescueData.currency}{rescueData.budgetCap}</span>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-4 px-5">Transit Mode & Route</th>
                <th className="py-4 px-4 font-mono-num">Duration</th>
                <th className="py-4 px-4 font-mono-num">Total Price</th>
                <th className="py-4 px-4 font-mono-num">On-Time %</th>
                <th className="py-4 px-4">Stress & Transfers</th>
                <th className="py-4 px-4">Key Advantage</th>
                <th className="py-4 px-5 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {rescueData.options.map((opt) => (
                <tr 
                  key={opt.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    opt.recommended ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-slate-100 rounded-xl">
                        {modeIcon(opt.type)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <span>{opt.title}</span>
                          {opt.recommended && (
                            <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[9px] font-bold uppercase rounded">
                              Top Choice
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">{opt.subtitle}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-mono-num text-slate-900 font-semibold">
                    {opt.totalDuration}
                  </td>

                  <td className="py-4 px-4 font-mono-num font-bold text-blue-600 text-sm">
                    {opt.currency}{opt.totalPrice}
                  </td>

                  <td className="py-4 px-4 font-mono-num">
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full" 
                          style={{ width: `${opt.reliabilityScore}%` }}
                        />
                      </div>
                      <span className="font-semibold text-slate-700">{opt.reliabilityScore}%</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="space-y-0.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        opt.stressScore === 'Low' ? 'bg-emerald-100 text-emerald-800' : opt.stressScore === 'Moderate' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {opt.stressScore} Stress
                      </span>
                      <div className="text-[10px] text-slate-400">
                        {opt.transfersCount === 0 ? 'Direct Route' : `${opt.transfersCount} Connection`}
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-slate-600 max-w-xs text-xs">
                    "{opt.tagline}"
                  </td>

                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => onSelectOption(opt)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* Visual Mode Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        
        {/* Train & Bus Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-americana text-lg font-bold text-slate-900">High-Speed Rail & Coach Rescues</h3>
              <p className="text-xs text-slate-500">Why trains and express buses beat flight delays in emergency travel</p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden h-40 relative bg-slate-100">
            <img
              src="/src/assets/images/mode_train_bus_1793180157424.jpg"
              alt="Express Rail Rescue"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
            <li className="flex items-start gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>No 2-hour airport security queues or terminal transfers.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>98%+ on-time arrival rate even during severe weather conditions.</span>
            </li>
          </ul>
        </div>

        {/* Flight Reroute Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-americana text-lg font-bold text-slate-900">Direct Priority Flight Rescue</h3>
              <p className="text-xs text-slate-500">Fastest speed over long distance & international corridors</p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden h-40 relative bg-slate-100">
            <img
              src="/src/assets/images/mode_flight_1793180158102.jpg"
              alt="Flight Rescue"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
            <li className="flex items-start gap-1.5">
              <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span>Instant standby reroutes available under passenger rights protocols.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span>Bypasses long ground distances for intercontinental emergencies.</span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
};
