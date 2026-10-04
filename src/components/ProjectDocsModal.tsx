import React, { useState } from 'react';
import { 
  FolderTree, 
  Terminal, 
  Database, 
  Sparkles, 
  BookOpen, 
  Check, 
  Copy, 
  Layers, 
  Server, 
  FileCode,
  ShieldCheck
} from 'lucide-react';

export const ProjectDocsModal: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'structure' | 'api' | 'prompt' | 'db' | 'setup'>('structure');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyCode = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-2">
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <BookOpen className="w-7 h-7 text-cyan-400" />
          <span>Technical Architecture & Setup Guide</span>
        </h2>
        <p className="text-sm text-slate-400">
          Complete project documentation for developers, beginners, and educators.
        </p>
      </div>

      {/* Navigation tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'structure', label: '1. Folder Structure', icon: FolderTree },
          { id: 'api', label: '2. Backend / API', icon: Server },
          { id: 'prompt', label: '3. Gemini Prompt Logic', icon: Sparkles },
          { id: 'db', label: '4. Database Structure', icon: Database },
          { id: 'setup', label: '5. Setup & Running', icon: Terminal },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* SECTION 1: FOLDER STRUCTURE */}
        {activeSection === 'structure' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-cyan-400" />
                <span>Complete Project Folder Structure</span>
              </h3>
            </div>
            <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
{`signal-quality-analyzer/
├── server.ts                    # Full-Stack Express Server (Gemini 3.8 Flash API & Vite middleware)
├── package.json                 # Project dependencies & scripts (Express, @google/genai, React 19)
├── tsconfig.json                # TypeScript compiler config
├── vite.config.ts               # Vite bundler configuration with Tailwind v4
├── index.html                   # HTML entry point with synchronized metadata & title
├── metadata.json                # Applet configuration & server-side Gemini capabilities
├── .env.example                 # Environment variables specification (GEMINI_API_KEY)
└── src/
    ├── main.tsx                 # React DOM client entry point
    ├── App.tsx                  # Main state coordinator & view router
    ├── index.css                # Global Tailwind CSS imports
    ├── types/
    │   └── network.ts           # Interfaces: NetworkInput, AnalysisResult, HistoryItem
    ├── services/
    │   └── networkAnalyzer.ts   # Client API client, localStorage history, & live ping measurement
    ├── data/
    │   └── presets.ts           # Realistic benchmark network test scenarios
    └── components/
        ├── Navbar.tsx           # Navigation bar with real-time indicators
        ├── HeroHome.tsx         # Home landing page with project mission & start CTA
        ├── NetworkInputForm.tsx # Input form for RSSI, Speed, Latency, Loss, & Type
        ├── SignalGauge.tsx      # Custom SVG animated speedometer for quality scores
        ├── AnalysisDashboard.tsx# Comprehensive diagnostic dashboard & AI report cards
        ├── HistoryDrawer.tsx    # Persistent test history manager with export options
        └── ProjectDocsModal.tsx # Complete documentation & running instructions`}
            </pre>
          </div>
        )}

        {/* SECTION 2: BACKEND & API */}
        {activeSection === 'api' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-400" />
              <span>Backend & API Architecture</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Gemini API calls are strictly handled <strong>server-side</strong> in <code className="text-cyan-300">server.ts</code> using the official <code className="text-cyan-300">@google/genai</code> SDK. The client browser communicates with the server via the <code className="text-cyan-300">/api/analyze-network</code> endpoint.
            </p>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">Endpoint Details:</h4>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
                <div className="text-cyan-400 font-bold">POST /api/analyze-network</div>
                <div className="text-slate-400">Content-Type: application/json</div>
                <div className="text-slate-300">
{`{
  "networkType": "Wi-Fi" | "Mobile Data",
  "rssi": -68,             // dBm (-100 to -20)
  "speed": 35,             // Mbps
  "latency": 45,           // ms Ping
  "packetLoss": 0.5,       // % (0 to 100)
  "locationLabel": "Living Room" // optional
}`}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-300 space-y-2">
              <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Graceful Offline RF Engine Fallback</span>
              </div>
              <p>
                If the Gemini API key is missing or encounters network latency, the server automatically computes deterministic RF calculations based on IEEE 802.11 and 3GPP cellular thresholds, ensuring zero user downtime.
              </p>
            </div>
          </div>
        )}

        {/* SECTION 3: GEMINI PROMPT LOGIC */}
        {activeSection === 'prompt' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Gemini AI Prompt & Schema Design</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We leverage <code className="text-cyan-300">gemini-3.8-flash</code> configured with structured JSON schema outputs (<code className="text-cyan-300">Type.OBJECT</code>).
            </p>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400">System Instruction:</span>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`You are a Senior Network Telecommunications and RF Engineer.
Your task is to analyze user-provided network parameters and produce a realistic, practical diagnostic assessment.
Rules:
1. ONLY analyze network problems and RF performance based on real telemetry principles.
2. DO NOT make unrealistic claims or pretend to change network settings automatically.
3. Keep suggestions actionable, simple, and beginner-friendly.
4. Categorize signalStatus strictly as "Good", "Average", or "Poor".
5. Calculate an accurate qualityScore between 0 and 100 based on standard industry thresholds:
   - RSSI (dBm): >= -60 is Excellent, -61 to -70 is Good, -71 to -80 is Fair, < -80 is Poor.
   - Latency (Ping): < 40ms is Excellent, 40-80ms is Acceptable, > 100ms is High.
   - Packet Loss: 0% is Optimal, 0.1-1% is Minor, > 2% causes noticeable issues.
6. Provide distinct items for:
   - problemSummary, possibleCauses, missingChecks, riskAnalysis, improvementSuggestions.`}
              </pre>
            </div>
          </div>
        )}

        {/* SECTION 4: DATABASE STRUCTURE */}
        {activeSection === 'db' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              <span>Database Architecture (Firebase Firestore & Local Store)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The project is architected for both cloud-synced storage using Firebase Cloud Firestore and client-side persistence with localStorage.
            </p>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">Firestore Collection Schema:</h4>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
                <div className="text-cyan-400 font-bold">Collection: /network_analyses/{'{analysisId}'}</div>
                <pre className="text-slate-300">
{`{
  id: string,                 // Unique Document UUID
  userId: string,             // Authenticated User ID
  createdAt: timestamp,       // Server timestamp
  input: {
    networkType: string,      // "Wi-Fi" | "Mobile Data"
    rssi: number,             // dBm (-30 to -95)
    speed: number,            // Mbps
    latency: number,          // ms ping
    packetLoss: number,       // % loss
    locationLabel: string     // "Living Room"
  },
  result: {
    qualityScore: number,     // 0 - 100
    signalStatus: string,     // "Good" | "Average" | "Poor"
    problemSummary: string,
    possibleCauses: string[],
    missingChecks: string[],
    riskAnalysis: string[],
    improvementSuggestions: string[]
  }
}`}
                </pre>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-slate-300">Recommended Firestore Security Rules:</h4>
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /network_analyses/{analysisId} {
      allow read, delete: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: STEP-BY-STEP SETUP */}
        {activeSection === 'setup' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <span>Step-by-Step Setup & Running Instructions</span>
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
                  Step 1: Clone & Install Dependencies
                </div>
                <pre className="text-xs font-mono text-slate-300">
{`git clone <repository-url>
cd signal-quality-analyzer
npm install`}
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
                  Step 2: Configure Environment Variables
                </div>
                <p className="text-xs text-slate-400">
                  Create a <code className="text-cyan-300">.env</code> file in the project root:
                </p>
                <pre className="text-xs font-mono text-slate-300">
{`GEMINI_API_KEY="your-gemini-api-key-here"
PORT=3000`}
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
                  Step 3: Start Development Server
                </div>
                <pre className="text-xs font-mono text-slate-300">
{`npm run dev`}
                </pre>
                <p className="text-xs text-slate-400">
                  The full-stack application will launch on <code className="text-cyan-300">http://localhost:3000</code>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
                  Step 4: Build for Production
                </div>
                <pre className="text-xs font-mono text-slate-300">
{`npm run build
npm start`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
