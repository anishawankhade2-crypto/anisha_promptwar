import React from 'react';
import { 
  History, 
  Trash2, 
  ArrowRight, 
  Download, 
  Radio, 
  Wifi, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  FileText
} from 'lucide-react';
import { AnalysisHistoryItem } from '../types/network';

interface HistoryDrawerProps {
  history: AnalysisHistoryItem[];
  onSelect: (item: AnalysisHistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onStartNew: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  history,
  onSelect,
  onDelete,
  onClear,
  onStartNew,
}) => {
  const avgScore = history.length
    ? Math.round(history.reduce((acc, curr) => acc + curr.qualityScore, 0) / history.length)
    : 0;

  const handleExportAll = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `network-history-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-cyan-400" />
            <span>Analysis History</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Stored telemetry records from your past network signal diagnoses.
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportAll}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export History</span>
            </button>
            <button
              onClick={onClear}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-rose-300 text-xs font-medium border border-rose-800/40 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* Summary KPI Cards */}
      {history.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Total Scans</div>
              <div className="text-xl font-bold text-white">{history.length} Tests</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Average Quality Score</div>
              <div className="text-xl font-bold text-white">{avgScore}%</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Most Recent</div>
              <div className="text-xs font-mono font-medium text-slate-200">
                {new Date(history[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Items List */}
      {history.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No Previous Analyses Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Run your first network telemetry test to view signal scores and diagnostic reports saved here.
          </p>
          <button
            onClick={onStartNew}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 cursor-pointer transition-all"
          >
            <span>Run Network Test</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => {
            const dateStr = new Date(item.timestamp).toLocaleString([], {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            const statusColor = {
              Good: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
              Average: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
              Poor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
            }[item.signalStatus];

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div 
                  onClick={() => onSelect(item)}
                  className="flex-1 cursor-pointer space-y-1"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border ${statusColor}`}>
                      {item.signalStatus} ({item.qualityScore}%)
                    </span>
                    <span className="font-semibold text-white flex items-center gap-1">
                      {item.input.networkType === 'Wi-Fi' ? <Wifi className="w-3.5 h-3.5 text-cyan-400" /> : <Radio className="w-3.5 h-3.5 text-cyan-400" />}
                      <span>{item.input.networkType}</span>
                    </span>
                    {item.input.locationLabel && (
                      <span className="text-slate-400">· {item.input.locationLabel}</span>
                    )}
                    <span className="text-slate-500 text-[11px] ml-auto font-mono">
                      {dateStr}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-1">
                    {item.problemSummary}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
                    <span>RSSI: {item.input.rssi} dBm</span>
                    <span>Speed: {item.input.speed} Mbps</span>
                    <span>Ping: {item.input.latency} ms</span>
                    <span>Loss: {item.input.packetLoss}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => onSelect(item)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-300 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 border border-slate-700 transition-colors cursor-pointer"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
