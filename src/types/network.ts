export type NetworkType = 'Wi-Fi' | 'Mobile Data';

export type SignalStatus = 'Good' | 'Average' | 'Poor';

export interface NetworkInput {
  rssi: number; // dBm (e.g. -30 to -95)
  speed: number; // Mbps
  latency: number; // ms ping
  packetLoss: number; // percentage (0 to 100%)
  networkType: NetworkType;
  locationLabel?: string;
}

export interface AnalysisResult {
  qualityScore: number; // 0 - 100%
  signalStatus: SignalStatus;
  problemSummary: string;
  possibleCauses: string[];
  missingChecks: string[];
  riskAnalysis: string[];
  improvementSuggestions: string[];
  analyzedAt: string;
  source: 'gemini' | 'rule-based';
  rawParameters?: NetworkInput;
}

export interface AnalysisHistoryItem extends AnalysisResult {
  id: string;
  input: NetworkInput;
  timestamp: number;
}

export interface PresetScenario {
  id: string;
  title: string;
  description: string;
  iconName: string;
  data: NetworkInput;
}
