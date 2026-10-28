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
          Know your non-negotiable legal rights across India (DGCA / Indian Railways), US DOT, and EU261 regulations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* India DGCA & Indian Railways Protection */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              IN
            </div>
            <div>
              <h3 className="font-americana text-lg font-bold text-slate-900">
                India DGCA & IRCTC Charter
              </h3>
              <p className="text-xs text-slate-500">Pan-India Passenger Safeguards</p>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-slate-700">
            <li className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">DGCA Flight Cancellation Refund</strong>
                If flight is cancelled, airline must offer alternate flight OR 100% full refund within 3 days. Delays 2h+ require free meals/refreshments.
              </div>
            </li>

            <li className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">IRCTC Train Cancellation 100% Refund</strong>
                If Indian Railways cancels a train due to weather or technical reasons, 100% fare is automatically credited back to your bank/UPI.
              </div>
            </li>

            <li className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">IRCTC TDR File 3+ Hour Delay</strong>
                If a train is delayed over 3 hours and you do not travel, file TDR online via IRCTC before train departure for full fare refund.
              </div>
            </li>
          </ul>
        </div>

        {/* US DOT Regulations */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              US
            </div>
            <div>
              <h3 className="font-americana text-lg font-bold text-slate-900">
                US DOT Rules
              </h3>
              <p className="text-xs text-slate-500">Automatic Cash Refund Guarantee</p>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-slate-700">
            <li className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">100% Cash Refund Right</strong>
                If flight is cancelled or delayed 3+ hours domestic, airline MUST refund ticket within 7 days.
              </div>
            </li>

            <li className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">No Mandatory Vouchers</strong>
                Airlines cannot force flight vouchers. You can insist on a direct refund.
              </div>
            </li>
          </ul>
        </div>

        {/* EU261 Regulation */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              EU
            </div>
            <div>
              <h3 className="font-americana text-lg font-bold text-slate-900">
                EU261 & UK261 Rules
              </h3>
              <p className="text-xs text-slate-500">Up to €600 Cash Compensation</p>
            </div>
          </div>

          <ul className="space-y-3 text-xs text-slate-700">
            <li className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">Fixed Cash Compensation</strong>
                Flight delays of 3+ hours qualify for fixed cash compensation ranging from €250 to €600.
              </div>
            </li>

            <li className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-semibold">Duty of Care</strong>
                Hotel + meals included for overnight cancellations.
              </div>
            </li>
          </ul>
        </div>

      </div>

      {/* Actionable Checklist */}
      <div className="bg-blue-600 text-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-lg shadow-blue-600/10">
        <h3 className="font-americana text-xl font-bold">
          Emergency Checklist When Stranded at Railway Station or Airport in India
        </h3>

        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs leading-relaxed">
          <li className="p-4 bg-white/10 backdrop-blur-xs rounded-xl border border-white/20">
            <span className="font-bold text-sm block mb-1">Step 1: Check Live Status</span>
            Check NTES (National Train Enquiry System) or airline app for official delay certificate or PNR cancellation status.
          </li>
          <li className="p-4 bg-white/10 backdrop-blur-xs rounded-xl border border-white/20">
            <span className="font-bold text-sm block mb-1">Step 2: Check Tatkal / Volvo Option</span>
            Check Vande Bharat or State AC Sleeper Volvo buses (Zingbus, KSRTC, MSRTC) for immediate seats.
          </li>
          <li className="p-4 bg-white/10 backdrop-blur-xs rounded-xl border border-white/20">
            <span className="font-bold text-sm block mb-1">Step 3: Book via Travel Rescue Agent</span>
            Execute AI Route Research to generate the fastest multi-modal reroute plan across flights, trains, and buses.
          </li>
        </ol>
      </div>

    </div>
  );
};
