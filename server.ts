import express, { type Request, type Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI client (Server-Side only)
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback rule-based network diagnosis engine
function calculateRuleBasedAnalysis(params: {
  rssi: number;
  speed: number;
  latency: number;
  packetLoss: number;
  networkType: string;
}) {
  const { rssi, speed, latency, packetLoss, networkType } = params;

  // Signal Score (0-100)
  // RSSI: -30dBm = 100%, -90dBm = 0%
  const clampedRssi = Math.max(-95, Math.min(-30, rssi));
  const rssiScore = ((clampedRssi - (-95)) / (-30 - (-95))) * 100;

  // Speed Score (0-100, 100Mbps is benchmark good)
  const speedScore = Math.min(100, (speed / 100) * 100);

  // Latency Score (10ms = 100%, 250ms = 0%)
  const latencyScore = Math.max(0, 100 - (Math.max(0, latency - 15) / 200) * 100);

  // Packet Loss Penalty (0% = 100%, 10%+ = 0%)
  const packetLossScore = Math.max(0, 100 - packetLoss * 15);

  const rawScore = Math.round(
    rssiScore * 0.35 + speedScore * 0.25 + latencyScore * 0.2 + packetLossScore * 0.2
  );
  const qualityScore = Math.max(5, Math.min(99, rawScore));

  let signalStatus: 'Good' | 'Average' | 'Poor' = 'Good';
  if (qualityScore < 50 || rssi < -80 || packetLoss > 3 || latency > 150) {
    signalStatus = 'Poor';
  } else if (qualityScore < 75 || rssi < -70 || packetLoss > 0.8 || latency > 70) {
    signalStatus = 'Average';
  }

  const causes: string[] = [];
  const checks: string[] = [];
  const risks: string[] = [];
  const suggestions: string[] = [];

  // Check RSSI
  if (rssi < -78) {
    causes.push(
      networkType === 'Wi-Fi'
        ? 'Long physical distance from Wi-Fi router or signal blocked by thick concrete walls'
        : 'Weak cellular tower coverage or line-of-sight obstruction'
    );
    suggestions.push(
      networkType === 'Wi-Fi'
        ? 'Move closer to the Wi-Fi access point or consider a mesh extender / 5GHz to 2.4GHz switch'
        : 'Move towards an open window or step outdoors for stronger cellular reception'
    );
  } else if (rssi < -68) {
    causes.push('Moderate signal attenuation caused by interior doors, furniture, or mild distance');
  }

  // Check Packet Loss
  if (packetLoss > 1.5) {
    causes.push('Radio frequency interference (RF noise from microwaves, Bluetooth, or neighboring networks)');
    causes.push('Network bufferbloat or transient congestion on ISP routing equipment');
    risks.push('VoIP and video call audio stuttering or robotic voice artifacts');
    risks.push('Online game packet drops, rubberbanding, and desynchronization');
    suggestions.push('Switch your Wi-Fi channel to a less crowded band (e.g. 5GHz Channel 36-48 or 149+)');
  }

  // Check Latency
  if (latency > 100) {
    causes.push('ISP routing hop delays, distant regional gateway server, or active heavy uploads');
    risks.push('Noticeable lag in web page response times and delay during live conversations');
    suggestions.push('Pause background peer-to-peer syncing, cloud backups, or 4K streams while gaming');
  }

  // Check Speed
  if (speed < 10) {
    causes.push('Bandwidth bottleneck or throttling by service provider');
    risks.push('Heavy video buffering on HD/4K platforms (YouTube, Netflix)');
    risks.push('Slow document and app downloads');
    suggestions.push('Check router bandwidth allocation (QoS settings) or restart the modem');
  }

  // Default suggestions & checks
  checks.push('Restart the Wi-Fi router / modem and wait 60 seconds for frequency re-negotiation');
  checks.push('Run the same signal test on another smartphone or laptop to rule out device antenna issues');
  checks.push('Test your connection in another room to isolate localized RF interference zones');

  if (causes.length === 0) {
    causes.push('Optimal wireless conditions with minimal noise and healthy transceiver margins');
  }
  if (risks.length === 0) {
    risks.push('Low risk: Connectivity is stable for high-definition streaming, VoIP calls, and browsing');
  }
  if (suggestions.length === 0) {
    suggestions.push('Current settings are optimal. Periodically check for router firmware updates');
  }

  const problemSummary =
    signalStatus === 'Good'
      ? `The ${networkType} connection is strong and healthy (${qualityScore}% score). Latency is responsive at ${latency}ms with acceptable signal strength (${rssi} dBm).`
      : signalStatus === 'Average'
      ? `The ${networkType} connection shows moderate degradation with a score of ${qualityScore}%. ${
          rssi < -70 ? 'Signal reception is attenuated' : 'Speed or latency has minor constraints'
        }, which may cause slight buffering during intensive tasks.`
      : `The ${networkType} connection is critically degraded (${qualityScore}% score). High signal loss (${rssi} dBm) or packet loss (${packetLoss}%) is impacting network performance.`;

  return {
    qualityScore,
    signalStatus,
    problemSummary,
    possibleCauses: causes.slice(0, 4),
    missingChecks: checks.slice(0, 4),
    riskAnalysis: risks.slice(0, 4),
    improvementSuggestions: suggestions.slice(0, 4),
    analyzedAt: new Date().toISOString(),
    source: 'rule-based' as const,
  };
}

// Network Analysis API Route
app.post('/api/analyze-network', async (req: Request, res: Response): Promise<void> => {
  try {
    const { rssi, speed, latency, packetLoss, networkType, locationLabel } = req.body;

    // Validate inputs
    const numRssi = Number(rssi);
    const numSpeed = Number(speed);
    const numLatency = Number(latency);
    const numPacketLoss = Number(packetLoss);
    const safeNetworkType = networkType === 'Mobile Data' ? 'Mobile Data' : 'Wi-Fi';

    if (isNaN(numRssi) || isNaN(numSpeed) || isNaN(numLatency) || isNaN(numPacketLoss)) {
      res.status(400).json({ error: 'All network metrics (RSSI, Speed, Latency, Packet Loss) must be valid numbers.' });
      return;
    }

    // If Gemini client is not initialized or fails, use intelligent fallback
    if (!ai) {
      const fallback = calculateRuleBasedAnalysis({
        rssi: numRssi,
        speed: numSpeed,
        latency: numLatency,
        packetLoss: numPacketLoss,
        networkType: safeNetworkType,
      });
      res.json(fallback);
      return;
    }

    const systemInstruction = `You are a Senior Network Telecommunications and RF Engineer.
Your task is to analyze user-provided network parameters and produce a realistic, practical diagnostic assessment.
Rules:
1. ONLY analyze network problems and RF performance based on real telemetry principles.
2. DO NOT make unrealistic claims or pretend to change network settings automatically.
3. Keep suggestions actionable, simple, and beginner-friendly.
4. Categorize signalStatus strictly as "Good", "Average", or "Poor".
5. Calculate an accurate qualityScore between 0 and 100 based on standard industry thresholds:
   - RSSI (dBm): >= -60 is Excellent, -61 to -70 is Good, -71 to -80 is Fair/Average, < -80 is Poor.
   - Latency (Ping): < 40ms is Excellent, 40-80ms is Acceptable, > 100ms is High.
   - Packet Loss: 0% is Optimal, 0.1-1% is Minor, > 2% causes noticeable issues.
   - Speed: evaluated relative to general domestic or mobile demands.
6. Provide distinct items for:
   - problemSummary: Plain English explanation of the network state.
   - possibleCauses: Realistic causes like distance from router/tower, physical obstacles, 2.4GHz interference, channel congestion, ISP throttling, or device antenna limitations.
   - missingChecks: Practical diagnostic tests the user can perform (restart router, check other device, walk closer, test another band).
   - riskAnalysis: Clear practical symptoms (call drops, slow browsing, video buffering, high latency in games).
   - improvementSuggestions: Actionable steps to improve connectivity.`;

    const prompt = `Please analyze the following network metrics:
- Network Type: ${safeNetworkType}
- Signal Strength (RSSI): ${numRssi} dBm
- Internet Speed: ${numSpeed} Mbps
- Latency / Ping: ${numLatency} ms
- Packet Loss: ${numPacketLoss}%
${locationLabel ? `- User Location/Context: ${locationLabel}` : ''}

Generate a structured JSON assessment according to the specified schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            qualityScore: {
              type: Type.INTEGER,
              description: 'Network Quality Score from 0 to 100 percent',
            },
            signalStatus: {
              type: Type.STRING,
              enum: ['Good', 'Average', 'Poor'],
              description: 'Overall classification of signal status',
            },
            problemSummary: {
              type: Type.STRING,
              description: 'Clear, beginner-friendly summary of the current network condition',
            },
            possibleCauses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of 3 to 4 probable physical or network causes',
            },
            missingChecks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of 3 to 4 suggested diagnostic checks',
            },
            riskAnalysis: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of practical user-facing impacts',
            },
            improvementSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Practical, step-by-step suggestions to improve signal quality',
            },
          },
          required: [
            'qualityScore',
            'signalStatus',
            'problemSummary',
            'possibleCauses',
            'missingChecks',
            'riskAnalysis',
            'improvementSuggestions',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response received from Gemini');
    }

    const parsed = JSON.parse(text);
    res.json({
      ...parsed,
      analyzedAt: new Date().toISOString(),
      source: 'gemini',
      rawParameters: {
        rssi: numRssi,
        speed: numSpeed,
        latency: numLatency,
        packetLoss: numPacketLoss,
        networkType: safeNetworkType,
        locationLabel,
      },
    });
  } catch (error) {
    console.error('Error analyzing network with Gemini:', error);
    // Graceful fallback to rule-based analysis so the user experience is smooth
    const { rssi, speed, latency, packetLoss, networkType } = req.body || {};
    const fallback = calculateRuleBasedAnalysis({
      rssi: Number(rssi) || -70,
      speed: Number(speed) || 25,
      latency: Number(latency) || 50,
      packetLoss: Number(packetLoss) || 0,
      networkType: networkType || 'Wi-Fi',
    });
    res.json({
      ...fallback,
      note: 'Analyzed using localized RF engine due to external API latency',
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!ai,
    timestamp: new Date().toISOString(),
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
