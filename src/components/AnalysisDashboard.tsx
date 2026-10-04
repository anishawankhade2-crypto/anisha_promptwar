import React, { useState } from 'react';
import { 
  Radio, 
  Wifi, 
  Gauge, 
  Clock, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  HelpCircle, 
  Wrench, 
  ArrowLeft, 
  Download, 
  Bookmark, 
  Share2, 
  Sparkles, 
  Check, 
  CornerDownRight, 
  Layers,
  Activity,
  RotateCcw
} from 'lucide-react';
import { AnalysisResult, NetworkInput } from '../types/network';
import { SignalGauge } from './SignalGauge';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  input: NetworkInput;
  onRetest: () => void;
  onSaveToHistory: () => void;
  isSaved: boolean;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  result,
  input,
  onRetest,
  onSaveToHistory,
  isSaved,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [copySuccess, setCopySuccess] = useState(false);

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ input, result }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `network-analysis-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleShareSummary = async () => {
    const summaryText = `[Network Signal Analysis Report]
Score: ${result.qualityScore}% (${result.signalStatus})
Type: ${input.networkType} | RSSI: ${input.rssi} dBm | Speed: ${input.speed} Mbps | Ping: ${input.latency} ms | Loss: ${input.packetLoss}%
Problem: ${result.problemSummary}
Analyzed via AI-Based Network Signal Quality Analyzer`;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(summaryText);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  // Status Styling configuration
  const statusStyles = {
    Good: {
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      heroBg: 'from-emerald-950/30 via-slate-900 to-slate-900',
      border: 'border-emerald-500/30',
      accent: 'text-emerald-400',
    },
    Average: {
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      heroBg: 'from-amber-950/30 via-slate-900 to-slate-900',
      border: 'border-amber-500/30',
      accent: 'text-amber-400',
    },
    Poor: {
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      heroBg: 'from-rose-950/30 via-slate-900 to-slate-900',
      border: 'border-rose-500/30',
      accent: 'text-rose-400',
    },
  }[result.signalStatus];

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-2">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onRetest}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>New Analysis / Adjust Inputs</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onSaveToHistory}
            disabled={isSaved}
            className={`px-3.5 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              isSaved
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4 text-cyan-400" />}
            <span>{isSaved ? 'Saved in History' : 'Save to History'}</span>
          </button>

          <button
            onClick={handleShareSummary}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Copy report summary"
          >
            {copySuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-cyan-400" />}
            <span>{copySuccess ? 'Copied!' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download JSON audit file"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>
        </div>
      </div>

      {/* Main Score Hero Card */}
      <section className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${statusStyles.heroBg} border ${statusStyles.border} p-6 sm:p-8 shadow-2xl`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Circular SVG Gauge */}
          <div className="flex justify-center md:justify-start">
            <SignalGauge
              score={result.qualityScore}
              status={result.signalStatus}
              size={220}
              label="Network Quality"
              sublabel={`${input.networkType} Telemetry`}
            />
          </div>

          {/* Diagnostic Overview Details */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusStyles.badge}`}>
                Status: {result.signalStatus}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                {input.networkType === 'Wi-Fi' ? <Wifi className="w-3.5 h-3.5 text-cyan-400" /> : <Radio className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{input.networkType}</span>
              </span>
              {input.locationLabel && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700">
                  {input.locationLabel}
                </span>
              )}
              <span className="text-[11px] text-slate-500 font-mono ml-auto">
                Engine: {result.source === 'gemini' ? 'Gemini 3.8 Flash' : 'RF Rule Engine'}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white tracking-tight">
              Network Quality Score: <span className={statusStyles.accent}>{result.qualityScore}%</span>
            </h3>

            {/* Problem Summary Callout */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-200 text-sm leading-relaxed">
              <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Problem Summary</span>
              </div>
              <p>{result.problemSummary}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Interactive Metric Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* RSSI Card */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>Signal (RSSI)</span>
            </span>
            <span className="font-mono">{input.rssi} dBm</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
            {input.rssi} <span className="text-xs font-normal text-slate-400">dBm</span>
          </div>
          {/* Mini Signal Bar visualizer */}
          <div className="flex gap-1 pt-1">
            {[-90, -80, -70, -55].map((threshold, idx) => (
              <div
                key={idx}
                className={`h-2 flex-1 rounded-sm ${
                  input.rssi >= threshold ? 'bg-cyan-400' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
          <div className="text-[11px] text-slate-400">
            {input.rssi >= -65 ? 'Strong RF Field' : input.rssi >= -75 ? 'Moderate Attenuation' : 'Severe Signal Weakness'}
          </div>
        </div>

        {/* Speed Card */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-blue-400" />
              <span>Throughput</span>
            </span>
            <span className="font-mono">{input.speed} Mbps</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
            {input.speed} <span className="text-xs font-normal text-slate-400">Mbps</span>
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, (input.speed / 100) * 100)}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400">
            {input.speed >= 50 ? 'Ample for 4K / Multiple Devices' : input.speed >= 15 ? 'Good for HD Browsing' : 'Bottleneck Risk'}
          </div>
        </div>

        {/* Latency Card */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>Ping / Latency</span>
            </span>
            <span className="font-mono">{input.latency} ms</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
            {input.latency} <span className="text-xs font-normal text-slate-400">ms</span>
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                input.latency < 40 ? 'bg-emerald-400' : input.latency < 80 ? 'bg-amber-400' : 'bg-rose-400'
              }`}
              style={{ width: `${Math.min(100, Math.max(10, (input.latency / 200) * 100))}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400">
            {input.latency < 40 ? 'Snappy Response' : input.latency < 80 ? 'Acceptable Delay' : 'Noticeable Lag'}
          </div>
        </div>

        {/* Packet Loss Card */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Packet Loss</span>
            </span>
            <span className="font-mono">{input.packetLoss}%</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
            {input.packetLoss} <span className="text-xs font-normal text-slate-400">%</span>
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                input.packetLoss === 0 ? 'bg-emerald-400' : input.packetLoss < 1.5 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, input.packetLoss * 15))}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400">
            {input.packetLoss === 0 ? 'Zero Drops (Optimal)' : input.packetLoss < 1 ? 'Minor Jitter' : 'Degraded Audio/Stream'}
          </div>
        </div>
      </section>

      {/* Structured AI Analysis Cards (Causes, Risks, Checks, Suggestions) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Possible Causes */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Possible Causes Identified</h4>
              <p className="text-xs text-slate-400">Physical and network phenomena explaining signal status</p>
            </div>
          </div>

          <ul className="space-y-2.5">
            {result.possibleCauses.map((cause, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span className="leading-relaxed">{cause}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. Risk Analysis */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Risk Analysis & Symptoms</h4>
              <p className="text-xs text-slate-400">Expected user-facing consequences if unaddressed</p>
            </div>
          </div>

          <ul className="space-y-2.5">
            {result.riskAnalysis.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                <span className="leading-relaxed">{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Missing Checks (Interactive Checklist) */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Suggested Diagnostic Checks</h4>
              <p className="text-xs text-slate-400">Quick tests to isolate the origin of the problem</p>
            </div>
          </div>

          <div className="space-y-2">
            {result.missingChecks.map((check, idx) => {
              const isChecked = !!checkedItems[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleCheck(idx)}
                  className={`p-3 rounded-xl border flex items-start gap-3 transition-colors cursor-pointer ${
                    isChecked
                      ? 'bg-cyan-950/20 border-cyan-800/40 text-slate-400 line-through'
                      : 'bg-slate-800/40 border-slate-800 text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                      isChecked ? 'bg-cyan-500 border-cyan-500 text-slate-950' : 'border-slate-600 bg-slate-900'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs sm:text-sm leading-relaxed">{check}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Improvement Suggestions */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Practical Improvement Steps</h4>
              <p className="text-xs text-slate-400">Real actions to boost signal quality & bandwidth</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {result.improvementSuggestions.map((suggestion, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 bg-emerald-950/10 border border-emerald-900/20 p-2.5 rounded-xl">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <span>
          Note: This analysis is based on RF telemetry calculations and Google Gemini AI heuristics. The AI does not modify hardware or claim impossible signal boosts.
        </span>
        <button
          onClick={onRetest}
          className="text-cyan-400 hover:text-cyan-300 font-medium shrink-0 ml-4 cursor-pointer"
        >
          Run Another Test &rarr;
        </button>
      </div>
    </div>
  );
};
