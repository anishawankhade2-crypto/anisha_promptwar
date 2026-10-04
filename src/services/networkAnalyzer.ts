import { NetworkInput, AnalysisResult, AnalysisHistoryItem } from '../types/network';

const HISTORY_KEY = 'signal_quality_analyzer_history_v1';

export async function analyzeNetworkSignal(input: NetworkInput): Promise<AnalysisResult> {
  const response = await fetch('/api/analyze-network', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Server responded with status ${response.status}`);
  }

  const data: AnalysisResult = await response.json();
  return data;
}

export function loadStoredHistory(): AnalysisHistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to load history from localStorage:', err);
    return [];
  }
}

export function saveHistoryItem(result: AnalysisResult, input: NetworkInput): AnalysisHistoryItem {
  const history = loadStoredHistory();
  const newItem: AnalysisHistoryItem = {
    ...result,
    id: `scan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    input,
    timestamp: Date.now(),
  };

  // Keep up to 25 items
  const updated = [newItem, ...history].slice(0, 25);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }

  return newItem;
}

export function deleteHistoryItem(id: string): AnalysisHistoryItem[] {
  const history = loadStoredHistory();
  const updated = history.filter((item) => item.id !== id);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete history item:', err);
  }
  return updated;
}

export function clearAllHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (err) {
    console.error('Failed to clear history:', err);
  }
}

// Client-side quick live ping measurement helper to assist beginners
export async function measureBrowserPing(): Promise<{ ping: number; jitter: number }> {
  const samples: number[] = [];
  for (let i = 0; i < 4; i++) {
    const start = performance.now();
    try {
      await fetch(`/api/health?t=${Date.now()}_${i}`, { cache: 'no-store' });
      const elapsed = Math.round(performance.now() - start);
      samples.push(elapsed);
    } catch {
      samples.push(45);
    }
  }

  const ping = Math.round(samples.reduce((a, b) => a + b, 0) / samples.length);
  const diffs = samples.map((s) => Math.abs(s - ping));
  const jitter = Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length);

  return { ping, jitter };
}
