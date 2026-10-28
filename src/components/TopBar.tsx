import React from 'react';
import { ShieldAlert, Globe, Compass, LifeBuoy } from 'lucide-react';
import { CurrencySymbol } from '../types';

interface TopBarProps {
  currentCurrency: CurrencySymbol;
  onCurrencyChange: (curr: CurrencySymbol) => void;
  activeTab: 'wizard' | 'dashboard' | 'comparison' | 'rights';
  onTabChange: (tab: 'wizard' | 'dashboard' | 'comparison' | 'rights') => void;
  hasActiveRescue: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentCurrency,
  onCurrencyChange,
  activeTab,
  onTabChange,
  hasActiveRescue,
}) => {
  const currencies: CurrencySymbol[] = ['$', '€', '£', '₹', '¥'];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onTabChange('wizard')}
          className="flex items-center gap-2.5 text-left group shrink-0 focus:outline-none"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="font-americana text-xl font-bold tracking-tight text-slate-900 block leading-none">
              Travel Rescue Agent
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-blue-600 uppercase block mt-0.5">
              AI Route Research
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
          <button
            onClick={() => onTabChange('wizard')}
            className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 py-1 ${
              activeTab === 'wizard' ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : ''
            }`}
          >
            Rescue Assistant
          </button>
          
          <button
            onClick={() => onTabChange('dashboard')}
            disabled={!hasActiveRescue}
            className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1.5 ${
              !hasActiveRescue ? 'opacity-40 cursor-not-allowed' : ''
            } ${activeTab === 'dashboard' ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : ''}`}
          >
            <span>Route Research</span>
            {hasActiveRescue && (
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            )}
          </button>

          <button
            onClick={() => onTabChange('comparison')}
            disabled={!hasActiveRescue}
            className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 py-1 ${
              !hasActiveRescue ? 'opacity-40 cursor-not-allowed' : ''
            } ${activeTab === 'comparison' ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : ''}`}
          >
            Multi-Modal Matrix
          </button>

          <button
            onClick={() => onTabChange('rights')}
            className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 py-1 flex items-center gap-1 ${
              activeTab === 'rights' ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : ''
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Passenger Rights</span>
          </button>
        </nav>

        {/* Zone 3: Single Primary Action & Currency Selector */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Currency Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-lg border border-slate-200/60">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1 hidden sm:inline" />
            {currencies.map((curr) => (
              <button
                key={curr}
                onClick={() => onCurrencyChange(curr)}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                  currentCurrency === curr
                    ? 'bg-white text-blue-600 shadow-xs border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>

          <button
            onClick={() => onTabChange(hasActiveRescue ? 'dashboard' : 'wizard')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap shrink-0 active:scale-95"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{hasActiveRescue ? 'View Active Rescue' : 'Start Emergency Rescue'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
