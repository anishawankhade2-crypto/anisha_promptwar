import React from 'react';
import { 
  Radio, 
  Wifi, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  HelpCircle,
  Zap,
  Gauge,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { PRESET_SCENARIOS } from '../data/presets';
import { NetworkInput } from '../types/network';

interface HeroHomeProps {
  onStartAnalysis: (preset?: NetworkInput) => void;
  onOpenDocs: () => void;
}

export const HeroHome: React.FC<HeroHomeProps> = ({ onStartAnalysis, onOpenDocs }) => {
  return (
    <div className="space-y-12 py-4">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-slate-700/60 p-8 sm:p-12 shadow-2xl">
        {/* Glow ambient background effects */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-medium tracking-wide">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>AI Telemetry Diagnostics Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            AI-Based Network <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
              Signal Quality Analyzer
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            The intelligent diagnostic assistant that analyzes network signal quality, identifies underlying physical & configuration bottlenecks, and guides you toward optimal connectivity without making unrealistic claims.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onStartAnalysis()}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-base shadow-lg shadow-cyan-500/25 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>Start Analysis</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenDocs}
              className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 font-medium text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Architecture & Setup Docs</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>RF & Wi-Fi Telemetry</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Gemini 3.8 Flash Integration</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No Unrealistic AI Claims</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Telemetry Pillars */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Network Telemetry Checked by the Analyzer
            </h2>
            <p className="text-sm text-slate-400">
              The AI evaluates key signal factors together to build a complete diagnostic model.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-cyan-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base">Signal Strength (RSSI)</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Measured in <strong className="text-slate-300">dBm</strong> (e.g., -40 dBm is strong, -85 dBm is weak). Evaluates physical RF reception between device and access point.
            </p>
            <div className="mt-3 text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-1 rounded border border-cyan-800/40 inline-block">
              Benchmark: -30 to -65 dBm
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-cyan-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
              <Gauge className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base">Internet Speed</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Measured in <strong className="text-slate-300">Mbps</strong>. Indicates data throughput available for streaming, web loading, video conferencing, and heavy transfers.
            </p>
            <div className="mt-3 text-[11px] font-mono text-blue-400 bg-blue-950/40 px-2 py-1 rounded border border-blue-800/40 inline-block">
              Benchmark: &gt; 25 Mbps for 4K
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-cyan-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base">Latency / Ping</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Measured in <strong className="text-slate-300">milliseconds (ms)</strong>. The round-trip delay for signals. Essential for gaming, Zoom calls, and snappy page responses.
            </p>
            <div className="mt-3 text-[11px] font-mono text-purple-400 bg-purple-950/40 px-2 py-1 rounded border border-purple-800/40 inline-block">
              Benchmark: &lt; 40 ms
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-cyan-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base">Packet Loss</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Percentage of data lost in transit (<strong className="text-slate-300">%</strong>). High loss causes audio stuttering, video freeze frames, and game rubberbanding.
            </p>
            <div className="mt-3 text-[11px] font-mono text-rose-400 bg-rose-950/40 px-2 py-1 rounded border border-rose-800/40 inline-block">
              Benchmark: 0.0% (Zero Loss)
            </div>
          </div>
        </div>
      </section>

      {/* How the AI Assistant Operates */}
      <section className="p-6 sm:p-8 rounded-2xl bg-slate-800/40 border border-slate-700/70">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
              <Zap className="w-4 h-4" />
              <span>Ethical & Realistic AI Network Diagnosis</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              Real Diagnostic Engineering, Not False Promises
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Many apps claim to &ldquo;boost Wi-Fi by 300%&rdquo; through magic software. This system respects physics: it calculates real signal-to-noise dynamics, pinpoints whether distance, microwave interference, channel overlap, or ISP throttling is to blame, and provides practical troubleshooting steps that actually work.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 bg-slate-900/80 p-4 rounded-xl border border-slate-700/50 text-xs">
            <div className="flex items-center justify-between text-slate-300 pb-2 border-b border-slate-800">
              <span className="font-medium">Diagnostic Rule</span>
              <span className="text-cyan-400 font-mono">Status</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Automatic Network Fixing</span>
              <span className="text-rose-400 font-semibold">Forbidden (Read-Only)</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Gemini Root Cause Logic</span>
              <span className="text-emerald-400 font-semibold">Enabled</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Practical Checklist</span>
              <span className="text-emerald-400 font-semibold">Provided</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Test Scenarios */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Try Quick Benchmark Scenarios
          </h2>
          <p className="text-sm text-slate-400">
            Click any realistic preset to populate the analyzer and see how the AI handles different signal conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRESET_SCENARIOS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => onStartAnalysis(preset.data)}
              className="p-5 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-cyan-500/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-300">
                    {preset.data.networkType}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {preset.data.rssi} dBm
                  </span>
                </div>
                <h4 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {preset.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-400 font-mono">
                  <span>{preset.data.speed} Mbps</span>
                  <span>{preset.data.latency} ms</span>
                  <span className={preset.data.packetLoss > 1 ? 'text-amber-400' : 'text-slate-400'}>
                    {preset.data.packetLoss}% Loss
                  </span>
                </div>
                <span className="text-cyan-400 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Test <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
