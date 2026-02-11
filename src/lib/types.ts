export interface DataPoint {
  metric: string;
  value: string | number;
  change?: string;
  source: string;
  url?: string;
}

export interface Signal {
  source: "onchain" | "github" | "social" | "market";
  category: string;
  title: string;
  description: string;
  dataPoints: DataPoint[];
  strength: number; // 0-100
  timestamp: string;
}

export interface BuildIdea {
  title: string;
  description: string;
  feasibility: "high" | "medium" | "low";
  estimatedEffort: string;
  targetAudience: string;
  solanaIntegration: string;
}

export interface Narrative {
  id: string;
  title: string;
  summary: string;
  description: string;
  signals: Signal[];
  confidence: number; // 0-100
  trend: "emerging" | "accelerating" | "mature" | "declining";
  buildIdeas: BuildIdea[];
  detectedAt: string;
  category: string;
}

export interface AnalysisResult {
  narratives: Narrative[];
  totalSignals: number;
  dataSourcesUsed: string[];
  analyzedAt: string;
  agentVersion: string;
}

export interface DefiLlamaProtocol {
  name: string;
  chain: string;
  tvl: number;
  change_1d: number;
  change_7d: number;
  category: string;
  slug: string;
}

export interface GitHubRepo {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  created_at: string;
  language: string;
  topics: string[];
  html_url: string;
}

export interface CoinGeckoToken {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  market_cap: number;
  total_volume: number;
}
