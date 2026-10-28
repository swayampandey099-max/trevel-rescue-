import React from 'react';
import { LifeBuoy, ShieldCheck, DollarSign, Clock, FileText, CheckCircle2 } from 'lucide-react';

export const EmergencyRightsGuide: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
          <LifeBuoy className="w-4 h-4" />
          <span>Stranded Passenger Legal Protection</span>
        </div>
        <h1 className="font-americana text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Emergency Passenger Rights & Refund Rules
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
          Know your non-negotiable legal rights when flights are cancelled, trains are delayed, or bus connections are missed.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* US DOT Regulations */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              US
            </div>
            <div>
              <h3 className="font-americana text-lg font-bold text-slate-900">
                US Department of Transportation Rules
              </h3>
              <p className="text-xs text-slate-500">Automatic Cash Refund Guarantee</p>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-slate-700">
            <li className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">100% Cash Refund Right</strong>
                If your flight is cancelled or significantly delayed (3+ hours domestic, 6+ hours international) and you choose not to accept the rebooking, the airline MUST refund your ticket to original payment method within 7 business days.
              </div>
            </li>

            <li className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">Vouchers Are Optional</strong>
                Airlines cannot force you to accept flight credit or vouchers. You have the right to insist on a cash refund.
              </div>
            </li>

            <li className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">Baggage Fee Refunds</strong>
                If your checked baggage is significantly delayed (12-15 hours), the airline is required to refund your baggage fees.
              </div>
            </li>
          </ul>
        </div>

        {/* EU261 / UK261 Regulation */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              EU
            </div>
            <div>
              <h3 className="font-americana text-lg font-bold text-slate-900">
                EU261 & UK261 Passenger Protection
              </h3>
              <p className="text-xs text-slate-[500]">Up to €600 / £520 Cash Compensation</p>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-slate-700">
            <li className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">Fixed Cash Compensation</strong>
                If your flight arrives 3+ hours late or is cancelled within 14 days of departure, you are owed fixed compensation: €250 (short), €400 (medium), or €600 (long haul).
              </div>
            </li>

            <li className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">Duty of Care (Meals & Hotel)</strong>
                For delays over 2 hours, the airline MUST provide free food vouchers, 2 phone calls, and overnight hotel accommodation + transport if delayed overnight.
              </div>
            </li>

            <li className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">Railway Passenger Rights (EU Rail)</strong>
                Rail delays over 60 minutes entitle passengers to 25% refund; delays over 120 minutes entitle passengers to 50% cash refund.
              </div>
            </li>
          </ul>
        </div>

      </div>

      {/* Actionable Checklist */}
      <div className="bg-blue-600 text-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-lg shadow-blue-600/10">
        <h3 className="font-americana text-xl font-bold">
          Emergency Checklist When Stranded at Airport or Station
        </h3>

        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs leading-relaxed">
          <li className="p-4 bg-white/10 backdrop-blur-xs rounded-xl border border-white/20">
            <span className="font-bold text-sm block mb-1">Step 1: Document Everything</span>
            Take photos of departure screens showing "Cancelled" or "Delayed". Save original boarding passes and SMS alerts.
          </li>
          <li className="p-4 bg-white/10 backdrop-blur-xs rounded-xl border border-white/20">
            <span className="font-bold text-sm block mb-1">Step 2: Request Written Cause</span>
            Ask the airline or rail agent for a written statement of cancellation cause (proves eligibility for compensation).
          </li>
          <li className="p-4 bg-white/10 backdrop-blur-xs rounded-xl border border-white/20">
            <span className="font-bold text-sm block mb-1">Step 3: Book Alternate Via AURA</span>
            Use AURA AI Rescue to book the next train, bus, or alternate carrier before remaining seats fill up.
          </li>
        </ol>
      </div>

    </div>
  );
};
