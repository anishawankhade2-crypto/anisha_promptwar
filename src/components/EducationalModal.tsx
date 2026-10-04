import React from 'react';
import { X, Radio, Clock, ShieldAlert, Gauge, HelpCircle, Lightbulb } from 'lucide-react';

interface EducationalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EducationalModal: React.FC<EducationalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Lightbulb className="w-4 h-4" />
            <span>Beginner&apos;s Field Guide</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Understanding Network Signal Terms
          </h3>
          <p className="text-xs text-slate-400">
            Learn what numbers like -65 dBm, 30 ms ping, and 0.5% packet loss mean in real life.
          </p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          {/* RSSI */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
            <h4 className="font-bold text-cyan-400 flex items-center gap-2">
              <Radio className="w-4 h-4" />
              <span>What is Signal Strength (RSSI in dBm)?</span>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              RSSI stands for <em>Received Signal Strength Indicator</em>. Because wireless signals drop drastically over space, it is measured in negative decibel-milliwatts (dBm).
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs font-mono">
              <div className="bg-emerald-950/40 border border-emerald-800/40 p-2 rounded-lg">
                <span className="text-emerald-400 font-bold">-30 to -50</span>
                <span className="block text-[10px] text-slate-400 mt-0.5">Optimal</span>
              </div>
              <div className="bg-cyan-950/40 border border-cyan-800/40 p-2 rounded-lg">
                <span className="text-cyan-400 font-bold">-51 to -67</span>
                <span className="block text-[10px] text-slate-400 mt-0.5">Good (HD)</span>
              </div>
              <div className="bg-amber-950/40 border border-amber-800/40 p-2 rounded-lg">
                <span className="text-amber-400 font-bold">-68 to -75</span>
                <span className="block text-[10px] text-slate-400 mt-0.5">Fair / Marginal</span>
              </div>
              <div className="bg-rose-950/40 border border-rose-800/40 p-2 rounded-lg">
                <span className="text-rose-400 font-bold">&lt; -80</span>
                <span className="block text-[10px] text-slate-400 mt-0.5">Poor / Drops</span>
              </div>
            </div>
          </div>

          {/* Latency */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
            <h4 className="font-bold text-purple-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>What is Latency / Ping (ms)?</span>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Latency is the time it takes for a data packet to travel from your device to a server and return. Lower is always better. Under 30ms feels instantaneous; over 100ms causes noticeable audio delays and lag in multiplayer games.
            </p>
          </div>

          {/* Packet Loss */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
            <h4 className="font-bold text-rose-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>What is Packet Loss (%)?</span>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Internet traffic travels in thousands of tiny packets. When Wi-Fi interference, faulty cables, or router overload happens, packets get dropped. Even 2% loss causes robotic voice on Zoom, frozen video frames, and retransmission delays.
            </p>
          </div>

          {/* Wi-Fi 2.4 vs 5GHz */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
            <h4 className="font-bold text-emerald-400 flex items-center gap-2">
              <Gauge className="w-4 h-4" />
              <span>2.4 GHz vs 5 GHz Wi-Fi Bands</span>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              <strong>2.4 GHz:</strong> Travels further through thick walls, but is slower and prone to microwave/Bluetooth interference. <br />
              <strong>5 GHz:</strong> Super fast with high bandwidth, but struggles to penetrate concrete walls or floors.
            </p>
          </div>
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
          >
            Got It, Back to Analyzer
          </button>
        </div>
      </div>
    </div>
  );
};
