/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroHome } from './components/HeroHome';
import { NetworkInputForm } from './components/NetworkInputForm';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ProjectDocsModal } from './components/ProjectDocsModal';
import { EducationalModal } from './components/EducationalModal';
import { NetworkInput, AnalysisResult, AnalysisHistoryItem } from './types/network';
import { 
  analyzeNetworkSignal, 
  loadStoredHistory, 
  saveHistoryItem, 
  deleteHistoryItem, 
  clearAllHistory 
} from './services/networkAnalyzer';
import { Radio, AlertCircle, HelpCircle, BookOpen, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'analyzer' | 'dashboard' | 'history' | 'docs'>('home');
  const [currentInput, setCurrentInput] = useState<NetworkInput>({
    rssi: -65,
    speed: 45,
    latency: 32,
    packetLoss: 0.2,
    networkType: 'Wi-Fi',
    locationLabel: 'Living Room',
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [isSavedInHistory, setIsSavedInHistory] = useState<boolean>(false);
  const [isEduModalOpen, setIsEduModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load history from storage on mount
  useEffect(() => {
    const loaded = loadStoredHistory();
    setHistory(loaded);
  }, []);

  const handleStartAnalysis = (preset?: NetworkInput) => {
    if (preset) {
      setCurrentInput(preset);
    }
    setActiveTab('analyzer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRunAnalysis = async (input: NetworkInput) => {
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentInput(input);

    try {
      const result = await analyzeNetworkSignal(input);
      setAnalysisResult(result);
      
      // Save item to history
      const saved = saveHistoryItem(result, input);
      setHistory((prev) => [saved, ...prev.filter((i) => i.id !== saved.id)].slice(0, 25));
      setIsSavedInHistory(true);

      setActiveTab('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(
        err?.message || 'Could not complete network signal analysis. Please verify your metrics and retry.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSave = () => {
    if (analysisResult && !isSavedInHistory) {
      const saved = saveHistoryItem(analysisResult, currentInput);
      setHistory((prev) => [saved, ...prev.filter((i) => i.id !== saved.id)].slice(0, 25));
      setIsSavedInHistory(true);
    }
  };

  const handleSelectHistoryItem = (item: AnalysisHistoryItem) => {
    setCurrentInput(item.input);
    setAnalysisResult(item);
    setIsSavedInHistory(true);
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = deleteHistoryItem(id);
    setHistory(updated);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all analysis history records?')) {
      clearAllHistory();
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        hasAnalysis={!!analysisResult}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs text-rose-400 hover:text-white underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab 1: Home */}
        {activeTab === 'home' && (
          <HeroHome
            onStartAnalysis={handleStartAnalysis}
            onOpenDocs={() => setActiveTab('docs')}
          />
        )}

        {/* Tab 2: Analyzer Form */}
        {activeTab === 'analyzer' && (
          <NetworkInputForm
            initialValues={currentInput}
            onSubmit={handleRunAnalysis}
            isLoading={isLoading}
          />
        )}

        {/* Tab 3: Dashboard */}
        {activeTab === 'dashboard' && analysisResult && (
          <AnalysisDashboard
            result={analysisResult}
            input={currentInput}
            onRetest={() => setActiveTab('analyzer')}
            onSaveToHistory={handleManualSave}
            isSaved={isSavedInHistory}
          />
        )}

        {/* Tab 4: History */}
        {activeTab === 'history' && (
          <HistoryDrawer
            history={history}
            onSelect={handleSelectHistoryItem}
            onDelete={handleDeleteHistoryItem}
            onClear={handleClearHistory}
            onStartNew={() => setActiveTab('analyzer')}
          />
        )}

        {/* Tab 5: Docs & Architecture */}
        {activeTab === 'docs' && <ProjectDocsModal />}
      </main>

      {/* Educational Guide floating button */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsEduModalOpen(true)}
          className="px-4 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 border border-slate-700 shadow-xl shadow-cyan-950/40 text-xs font-semibold flex items-center gap-2 backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Network Glossary & Guide</span>
        </button>
      </div>

      {/* Modal Guide */}
      <EducationalModal
        isOpen={isEduModalOpen}
        onClose={() => setIsEduModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-400">
              AI-Based Network Signal Quality Analyzer
            </span>
            <span>· Telemetry Diagnostic Engine</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsEduModalOpen(true)}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Glossary
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Setup Docs
            </button>
            <span className="flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Realistic AI Suggestions</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
