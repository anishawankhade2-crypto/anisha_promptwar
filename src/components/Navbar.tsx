import React from 'react';
import { Activity, Radio, History, BookOpen, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'analyzer' | 'dashboard' | 'history' | 'docs';
  setActiveTab: (tab: 'home' | 'analyzer' | 'dashboard' | 'history' | 'docs') => void;
  hasAnalysis: boolean;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  hasAnalysis,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="font-bold text-base sm:text-lg tracking-tight text-white flex items-center gap-2">
              SignalPulse <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono border border-cyan-500/30">AI</span>
            </div>
            <div className="text-xs text-slate-400 hidden sm:block">
              Network Signal Quality Analyzer
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'home'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => setActiveTab('analyzer')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'analyzer'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Analyzer</span>
          </button>

          {hasAnalysis && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 relative ${
              activeTab === 'history'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span className="hidden md:inline">History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-slate-700 text-cyan-300">
                {historyCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'docs'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Project Docs & Setup"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden lg:inline">Docs & Setup</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
