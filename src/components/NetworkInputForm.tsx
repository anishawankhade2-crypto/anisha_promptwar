import React, { useState } from 'react';
import { 
  Wifi, 
  Radio, 
  Gauge, 
  Clock, 
  ShieldAlert, 
  Sparkles, 
  RotateCcw, 
  Zap, 
  MapPin, 
  Info,
  Check
} from 'lucide-react';
import { NetworkInput } from '../types/network';
import { PRESET_SCENARIOS } from '../data/presets';
import { measureBrowserPing } from '../services/networkAnalyzer';

interface NetworkInputFormProps {
  initialValues?: NetworkInput;
  onSubmit: (values: NetworkInput) => Promise<void>;
  isLoading: boolean;
}

export const NetworkInputForm: React.FC<NetworkInputFormProps> = ({
  initialValues,
  onSubmit,
  isLoading,
}) => {
  const [networkType, setNetworkType] = useState<'Wi-Fi' | 'Mobile Data'>(
    initialValues?.networkType || 'Wi-Fi'
  );
  const [rssi, setRssi] = useState<number>(initialValues?.rssi ?? -65);
  const [speed, setSpeed] = useState<number>(initialValues?.speed ?? 45);
  const [latency, setLatency] = useState<number>(initialValues?.latency ?? 32);
  const [packetLoss, setPacketLoss] = useState<number>(initialValues?.packetLoss ?? 0.2);
  const [locationLabel, setLocationLabel] = useState<string>(
    initialValues?.locationLabel || 'Living Room'
  );
  const [isMeasuringPing, setIsMeasuringPing] = useState(false);
  const [pingMeasuredNotice, setPingMeasuredNotice] = useState<string | null>(null);

  // Helper to interpret RSSI quality label
  const getRssiFeedback = (val: number) => {
    if (val >= -50) return { label: 'Excellent Signal', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    if (val >= -67) return { label: 'Good & Stable', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' };
    if (val >= -75) return { label: 'Average / Fair', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    if (val >= -85) return { label: 'Poor (High Attenuation)', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' };
    return { label: 'Very Weak / Critical', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' };
  };

  const rssiFeedback = getRssiFeedback(rssi);

  const handleApplyPreset = (data: NetworkInput) => {
    setNetworkType(data.networkType);
    setRssi(data.rssi);
    setSpeed(data.speed);
    setLatency(data.latency);
    setPacketLoss(data.packetLoss);
    if (data.locationLabel) setLocationLabel(data.locationLabel);
  };

  const handleLivePingTest = async () => {
    setIsMeasuringPing(true);
    setPingMeasuredNotice(null);
    try {
      const res = await measureBrowserPing();
      setLatency(res.ping);
      setPingMeasuredNotice(`Live Ping: ${res.ping}ms (Jitter: ±${res.jitter}ms)`);
      setTimeout(() => setPingMeasuredNotice(null), 4000);
    } catch {
      setPingMeasuredNotice('Measurement completed');
    } finally {
      setIsMeasuringPing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      networkType,
      rssi: Number(rssi),
      speed: Number(speed),
      latency: Number(latency),
      packetLoss: Number(packetLoss),
      locationLabel: locationLabel.trim() || undefined,
    });
  };

  const handleReset = () => {
    setNetworkType('Wi-Fi');
    setRssi(-65);
    setSpeed(45);
    setLatency(32);
    setPacketLoss(0.2);
    setLocationLabel('Living Room');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Network Data Input Form
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Enter your current network metrics or choose a benchmark scenario to let Gemini AI analyze your signal health.
        </p>
      </div>

      {/* Quick Benchmark Presets Bar */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Quick Benchmarks:</span>
          </span>
          <span className="text-slate-500">Click to fill form values</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESET_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              onClick={() => handleApplyPreset(scenario.data)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>{scenario.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8">
        {/* Network Type Selector */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-white">
            1. Network Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setNetworkType('Wi-Fi')}
              className={`p-4 rounded-xl border flex items-center justify-center gap-3 transition-all cursor-pointer ${
                networkType === 'Wi-Fi'
                  ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-sm'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wifi className="w-5 h-5" />
              <div className="text-left">
                <div className="font-bold text-sm">Wi-Fi Connection</div>
                <div className="text-xs text-slate-400 hidden sm:block">Home / Office WLAN (2.4GHz / 5GHz)</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setNetworkType('Mobile Data')}
              className={`p-4 rounded-xl border flex items-center justify-center gap-3 transition-all cursor-pointer ${
                networkType === 'Mobile Data'
                  ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-sm'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className="w-5 h-5" />
              <div className="text-left">
                <div className="font-bold text-sm">Mobile Data</div>
                <div className="text-xs text-slate-400 hidden sm:block">Cellular 4G LTE / 5G / NR</div>
              </div>
            </button>
          </div>
        </div>

        {/* 2. Signal Strength (RSSI in dBm) */}
        <div className="space-y-3 p-5 rounded-2xl bg-slate-800/40 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-semibold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <span>2. Signal Strength (RSSI in dBm)</span>
              </label>
              <p className="text-xs text-slate-400 mt-0.5">
                Received Signal Strength Indicator. Closer to -30 dBm is optimal; below -80 dBm indicates high degradation.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${rssiFeedback.bg} ${rssiFeedback.color}`}>
                {rssiFeedback.label}
              </span>
              <div className="relative w-24">
                <input
                  type="number"
                  min="-100"
                  max="-20"
                  value={rssi}
                  onChange={(e) => setRssi(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-sm font-mono font-bold text-white text-right focus:outline-none focus:border-cyan-500"
                />
                <span className="absolute left-2 top-1.5 text-xs text-slate-500">dBm</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <input
              type="range"
              min="-95"
              max="-30"
              step="1"
              value={rssi}
              onChange={(e) => setRssi(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
              <span>-95 dBm (Weak)</span>
              <span>-75 dBm (Average)</span>
              <span>-60 dBm (Good)</span>
              <span>-30 dBm (Max)</span>
            </div>
          </div>
        </div>

        {/* 3. Internet Speed, Latency, and Packet Loss */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Internet Speed */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-blue-400" />
                  <span>Internet Speed</span>
                </label>
                <span className="text-[11px] text-slate-400">Mbps</span>
              </div>
              <input
                type="number"
                min="0.1"
                max="2000"
                step="0.5"
                value={speed}
                onChange={(e) => setSpeed(Math.max(0, Number(e.target.value)))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono font-bold text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <input
                type="range"
                min="1"
                max="300"
                value={Math.min(300, speed)}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-400"
              />
              <div className="text-[10px] text-slate-500 flex justify-between mt-0.5">
                <span>1 Mbps</span>
                <span>150 Mbps</span>
                <span>300+</span>
              </div>
            </div>
          </div>

          {/* Latency / Ping */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Latency / Ping</span>
                </label>
                <button
                  type="button"
                  onClick={handleLivePingTest}
                  disabled={isMeasuringPing}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-medium cursor-pointer"
                  title="Run active browser ping to test current latency"
                >
                  {isMeasuringPing ? 'Measuring...' : 'Test Live'}
                </button>
              </div>
              <input
                type="number"
                min="1"
                max="2000"
                value={latency}
                onChange={(e) => setLatency(Math.max(1, Number(e.target.value)))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono font-bold text-white focus:outline-none focus:border-purple-500"
                required
              />
              {pingMeasuredNotice && (
                <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>{pingMeasuredNotice}</span>
                </div>
              )}
            </div>
            <div>
              <input
                type="range"
                min="5"
                max="250"
                value={Math.min(250, latency)}
                onChange={(e) => setLatency(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <div className="text-[10px] text-slate-500 flex justify-between mt-0.5">
                <span>&lt;20ms (Great)</span>
                <span>80ms</span>
                <span>200ms+ (Lag)</span>
              </div>
            </div>
          </div>

          {/* Packet Loss */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>Packet Loss</span>
                </label>
                <span className="text-[11px] text-slate-400">%</span>
              </div>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={packetLoss}
                onChange={(e) => setPacketLoss(Math.max(0, Math.min(100, Number(e.target.value))))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono font-bold text-white focus:outline-none focus:border-rose-500"
                required
              />
            </div>
            <div>
              <input
                type="range"
                min="0"
                max="15"
                step="0.1"
                value={Math.min(15, packetLoss)}
                onChange={(e) => setPacketLoss(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-400"
              />
              <div className="text-[10px] text-slate-500 flex justify-between mt-0.5">
                <span>0.0% (Clean)</span>
                <span>2.0%</span>
                <span>10%+ (Severe)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Optional Location Context */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Optional Location / Test Context</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Living room near window, Home Office, Basement, Cafe patio"
            value={locationLabel}
            onChange={(e) => setLocationLabel(e.target.value)}
            className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Submission & Action Bar */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Form</span>
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Gemini AI Analyzing Telemetry...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Signal Quality</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
