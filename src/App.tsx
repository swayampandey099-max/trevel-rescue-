/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TopBar } from './components/TopBar';
import { ChatWizard } from './components/ChatWizard';
import { RescueDashboard } from './components/RescueDashboard';
import { RouteComparisonTable } from './components/RouteComparisonTable';
import { EmergencyRightsGuide } from './components/EmergencyRightsGuide';
import { InteractiveChatConcierge } from './components/InteractiveChatConcierge';
import { CurrencySymbol, RescueRequestParams, RescueResearchResult, RescueOption } from './types';
import { Compass, AlertCircle, MessageSquare } from 'lucide-react';

export default function App() {
  const [currentCurrency, setCurrentCurrency] = useState<CurrencySymbol>('₹');
  const [activeTab, setActiveTab] = useState<'wizard' | 'dashboard' | 'comparison' | 'rights'>('wizard');
  const [rescueData, setRescueData] = useState<RescueResearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);

  const handleExecuteRescue = async (params: RescueRequestParams) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/rescue/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data: RescueResearchResult = await res.json();
      setRescueData(data);
      setActiveTab('dashboard');
    } catch (err) {
      console.error('Failed to perform rescue research:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOptionFromTable = (option: RescueOption) => {
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      
      {/* Top Bar Header */}
      <TopBar
        currentCurrency={currentCurrency}
        onCurrencyChange={setCurrentCurrency}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasActiveRescue={Boolean(rescueData)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'wizard' && (
          <ChatWizard
            currentCurrency={currentCurrency}
            onExecuteRescue={handleExecuteRescue}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'dashboard' && rescueData && (
          <RescueDashboard
            rescueData={rescueData}
            onOpenChat={() => setIsConciergeOpen(true)}
            onModifySearch={() => setActiveTab('wizard')}
          />
        )}

        {activeTab === 'comparison' && rescueData && (
          <RouteComparisonTable
            rescueData={rescueData}
            onSelectOption={handleSelectOptionFromTable}
          />
        )}

        {activeTab === 'rights' && (
          <EmergencyRightsGuide />
        )}
      </main>

      {/* Floating Action Trigger for AI Concierge */}
      {rescueData && (
        <button
          onClick={() => setIsConciergeOpen(true)}
          className="fixed bottom-6 right-6 z-30 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">AI Travel Assistant</span>
        </button>
      )}

      {/* AI Chat Concierge Drawer */}
      <InteractiveChatConcierge
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
        rescueContext={rescueData}
      />

      {/* Minimalist Soft Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-600" />
            <span className="font-americana font-bold text-slate-900">Travel Rescue Agent</span>
            <span className="text-slate-400">·</span>
            <span>Multi-modal flight, train & bus route research engine</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Gemini 3.8 Intelligence</span>
            <span>·</span>
            <span>Real-time Transit Data</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
