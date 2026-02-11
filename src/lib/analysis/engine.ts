import { Signal, Narrative, BuildIdea, AnalysisResult } from "@/lib/types";
import { collectAllSignals } from "@/lib/signals";

interface NarrativePattern {
  id: string;
  title: string;
  keywords: string[];
  categories: string[];
  minSignals: number;
  description: string;
  buildIdeas: BuildIdea[];
}

// Predefined narrative patterns that RONIN looks for
const NARRATIVE_PATTERNS: NarrativePattern[] = [
  {
    id: "ai-agents",
    title: "AI Agents on Solana",
    keywords: [
      "agent",
      "ai",
      "autonomous",
      "llm",
      "gpt",
      "claude",
      "inference",
    ],
    categories: ["AI Agents", "Tooling"],
    minSignals: 1,
    description:
      "Autonomous AI agents interacting with Solana for trading, security analysis, and automated on-chain operations. The convergence of AI and blockchain is creating a new category of autonomous economic actors.",
    buildIdeas: [
      {
        title: "Agent-to-Agent Payment Protocol",
        description:
          "A Solana program that enables autonomous agents to negotiate, escrow, and settle payments for services rendered to each other - creating an agent economy.",
        feasibility: "medium",
        estimatedEffort: "4-6 weeks",
        targetAudience:
          "AI agent developers, autonomous system builders",
        solanaIntegration:
          "SPL token escrow, PDA-based agent identities, automated settlement via CPI",
      },
      {
        title: "On-Chain Agent Reputation System",
        description:
          "Soulbound reputation tokens for AI agents based on their on-chain performance history - accuracy of predictions, successful task completion, reliability scores.",
        feasibility: "high",
        estimatedEffort: "2-3 weeks",
        targetAudience: "Agent operators, platforms hiring agents",
        solanaIntegration:
          "Token-2022 soulbound tokens, Merkle trees for proof history, compressed NFT credentials",
      },
      {
        title: "Agent Bounty Marketplace",
        description:
          "A decentralized marketplace where humans post tasks and AI agents compete to complete them, with automated judging and payout via smart contracts.",
        feasibility: "medium",
        estimatedEffort: "6-8 weeks",
        targetAudience: "Businesses needing AI labor, agent operators",
        solanaIntegration:
          "Escrow programs, oracle-based judging, SPL token rewards",
      },
    ],
  },
  {
    id: "defi-growth",
    title: "DeFi Expansion on Solana",
    keywords: [
      "defi",
      "tvl",
      "swap",
      "lending",
      "yield",
      "liquidity",
      "amm",
      "vault",
    ],
    categories: ["DeFi", "Liquidity", "DEXes", "Lending"],
    minSignals: 2,
    description:
      "Solana DeFi is expanding with growing TVL, new protocols, and increasing capital efficiency. The ecosystem is maturing from simple swaps to complex structured products.",
    buildIdeas: [
      {
        title: "Intent-Based DEX Aggregator",
        description:
          "Users express trade intents in natural language ('swap $500 to the best performing Solana DeFi token this week'). AI resolves the intent, finds optimal routes, and executes.",
        feasibility: "high",
        estimatedEffort: "3-4 weeks",
        targetAudience: "Retail DeFi users, crypto newcomers",
        solanaIntegration:
          "Jupiter aggregation, versioned transactions, priority fees optimization",
      },
      {
        title: "DeFi Risk Dashboard with ML Scoring",
        description:
          "Real-time risk scores for every Solana DeFi protocol based on TVL trends, smart contract analysis, team activity, and market conditions.",
        feasibility: "high",
        estimatedEffort: "3-5 weeks",
        targetAudience: "DeFi investors, fund managers, DAOs",
        solanaIntegration:
          "On-chain TVL tracking, program account monitoring, historical transaction analysis",
      },
      {
        title: "Automated Yield Strategy Builder",
        description:
          "Visual builder for composable DeFi strategies on Solana. Drag-and-drop yield farming, leveraged positions, and hedging strategies that compile to executable transactions.",
        feasibility: "medium",
        estimatedEffort: "6-8 weeks",
        targetAudience: "Active DeFi farmers, treasury managers",
        solanaIntegration:
          "Cross-program invocations, atomic transaction bundles, Jito MEV protection",
      },
    ],
  },
  {
    id: "token-security",
    title: "Token Security & Rug Prevention",
    keywords: [
      "security",
      "rug",
      "scam",
      "audit",
      "vulnerability",
      "scanner",
      "honeypot",
    ],
    categories: ["Security", "Risk"],
    minSignals: 1,
    description:
      "With 98.6% of pump.fun tokens being rugs, security tooling is a critical gap. New approaches using ML, behavioral analysis, and wallet forensics are emerging to protect traders.",
    buildIdeas: [
      {
        title: "Pre-Swap Risk Interception Layer",
        description:
          "Browser extension or Jupiter plugin that intercepts swap transactions, runs real-time risk analysis, and shows a risk report BEFORE the user confirms. Saves users from rugs at the moment of decision.",
        feasibility: "high",
        estimatedEffort: "2-3 weeks",
        targetAudience:
          "Every Solana trader, especially pump.fun users",
        solanaIntegration:
          "Transaction simulation, Jupiter quote API, token account inspection, mint authority checks",
      },
      {
        title: "Wallet DNA Forensics Tool",
        description:
          "Graph-based analysis tool that maps wallet relationships, identifies Sybil networks, and traces funds from known rug operations across the Solana ecosystem.",
        feasibility: "medium",
        estimatedEffort: "4-6 weeks",
        targetAudience:
          "Security researchers, law enforcement, advanced traders",
        solanaIntegration:
          "Transaction history indexing, token transfer graph construction, PDA relationship mapping",
      },
      {
        title: "Community-Powered Rug Insurance Pool",
        description:
          "Decentralized insurance pool where users stake SOL against rug risk. If an AI-verified rug occurs, affected users get compensated automatically.",
        feasibility: "low",
        estimatedEffort: "8-12 weeks",
        targetAudience: "Risk-averse traders, DeFi protocols",
        solanaIntegration:
          "Insurance pool program, oracle-verified rug events, automated claim settlement",
      },
    ],
  },
  {
    id: "depin-growth",
    title: "DePIN Infrastructure on Solana",
    keywords: [
      "depin",
      "physical",
      "infrastructure",
      "iot",
      "sensor",
      "network",
      "helium",
      "render",
      "hivemapper",
    ],
    categories: ["DePIN", "Infrastructure"],
    minSignals: 1,
    description:
      "Decentralized Physical Infrastructure Networks are finding product-market fit on Solana, with projects like Helium, Render, and Hivemapper demonstrating real-world utility.",
    buildIdeas: [
      {
        title: "DePIN Node Health Monitor",
        description:
          "Dashboard and alerting system for DePIN node operators across multiple networks (Helium, Hivemapper, etc). Uptime tracking, reward optimization, and predictive maintenance.",
        feasibility: "high",
        estimatedEffort: "3-4 weeks",
        targetAudience: "DePIN node operators, infrastructure investors",
        solanaIntegration:
          "Compressed NFT node credentials, reward token tracking, staking position monitoring",
      },
      {
        title: "Cross-DePIN Data Marketplace",
        description:
          "Aggregation layer that lets developers buy compute, bandwidth, mapping data, and sensor readings from multiple DePIN networks through a single API, settled on Solana.",
        feasibility: "medium",
        estimatedEffort: "6-8 weeks",
        targetAudience: "Web3 developers, data scientists, IoT companies",
        solanaIntegration:
          "Payment channels, data access NFTs, multi-token settlement",
      },
      {
        title: "DePIN Yield Optimizer",
        description:
          "Automatically allocates capital across DePIN staking and delegation opportunities based on real-time yield, risk, and network demand signals.",
        feasibility: "medium",
        estimatedEffort: "4-6 weeks",
        targetAudience: "DePIN investors, yield farmers",
        solanaIntegration:
          "Cross-protocol staking, automated rebalancing transactions, yield tracking",
      },
    ],
  },
  {
    id: "developer-tooling",
    title: "Developer Experience Revolution",
    keywords: [
      "sdk",
      "cli",
      "tool",
      "framework",
      "developer",
      "anchor",
      "testing",
    ],
    categories: ["Tooling", "Ecosystem"],
    minSignals: 1,
    description:
      "The Solana developer experience is rapidly improving with new frameworks, testing tools, and SDKs. Lower barriers to entry are attracting web2 developers to build on Solana.",
    buildIdeas: [
      {
        title: "AI-Powered Solana Program Generator",
        description:
          "Natural language to Anchor program compiler. Describe what you want your program to do, get tested, audited Rust code with security best practices baked in.",
        feasibility: "medium",
        estimatedEffort: "6-8 weeks",
        targetAudience: "Web2 developers entering Solana, rapid prototypers",
        solanaIntegration:
          "Anchor framework generation, automated test suite, devnet deployment pipeline",
      },
      {
        title: "Solana Transaction Debugger",
        description:
          "Visual debugger that replays any Solana transaction step-by-step, showing account state changes, CPI calls, and compute unit consumption in a clean UI.",
        feasibility: "high",
        estimatedEffort: "3-4 weeks",
        targetAudience: "Solana developers, program auditors",
        solanaIntegration:
          "Transaction simulation, account state diffing, program log parsing",
      },
      {
        title: "One-Click Solana Starter Kits",
        description:
          "Opinionated project templates for common Solana use cases (token launch, NFT collection, DeFi pool, DAO). Full stack: Anchor program + Next.js frontend + tests + deployment.",
        feasibility: "high",
        estimatedEffort: "2-3 weeks",
        targetAudience: "New Solana developers, hackathon participants",
        solanaIntegration:
          "Anchor scaffolding, wallet adapter setup, devnet auto-deploy",
      },
    ],
  },
  {
    id: "market-momentum",
    title: "Solana Ecosystem Market Momentum",
    keywords: [
      "price",
      "volume",
      "market",
      "cap",
      "surge",
      "gain",
      "momentum",
    ],
    categories: ["Market", "Momentum"],
    minSignals: 1,
    description:
      "Price action and trading volume across Solana ecosystem tokens are showing directional momentum, signaling shifting capital allocation and narrative attention.",
    buildIdeas: [
      {
        title: "Solana Smart Money Tracker",
        description:
          "Identify and track wallets with consistently profitable trading histories. Surface what smart money is accumulating before it becomes mainstream narrative.",
        feasibility: "high",
        estimatedEffort: "3-5 weeks",
        targetAudience: "Active traders, research analysts",
        solanaIntegration:
          "Wallet transaction history, token balance snapshots, DEX trade reconstruction",
      },
      {
        title: "Narrative-Weighted Portfolio Builder",
        description:
          "Portfolio construction tool that allocates based on narrative strength signals rather than market cap. Overweight emerging narratives, underweight declining ones.",
        feasibility: "medium",
        estimatedEffort: "4-6 weeks",
        targetAudience: "Crypto fund managers, sophisticated retail",
        solanaIntegration:
          "Jupiter swap execution, portfolio rebalancing programs, on-chain position tracking",
      },
      {
        title: "Real-Time Solana Alpha Feed",
        description:
          "Aggregated feed of alpha signals: unusual volume, whale movements, new pool creation, governance proposals, airdrop indicators. Delivered via Telegram bot and web dashboard.",
        feasibility: "high",
        estimatedEffort: "2-3 weeks",
        targetAudience: "Active traders, alpha hunters",
        solanaIntegration:
          "WebSocket monitoring, DEX pool creation events, token transfer tracking",
      },
    ],
  },
];

function matchSignalsToNarratives(
  signals: Signal[]
): Map<string, { pattern: NarrativePattern; matched: Signal[] }> {
  const matches = new Map<
    string,
    { pattern: NarrativePattern; matched: Signal[] }
  >();

  for (const pattern of NARRATIVE_PATTERNS) {
    const matched: Signal[] = [];

    for (const signal of signals) {
      const signalText =
        `${signal.title} ${signal.description} ${signal.category}`.toLowerCase();

      const keywordMatch = pattern.keywords.some((kw) =>
        signalText.includes(kw)
      );
      const categoryMatch = pattern.categories.some(
        (cat) =>
          signal.category.toLowerCase().includes(cat.toLowerCase()) ||
          cat.toLowerCase().includes(signal.category.toLowerCase())
      );

      if (keywordMatch || categoryMatch) {
        matched.push(signal);
      }
    }

    if (matched.length >= pattern.minSignals) {
      matches.set(pattern.id, { pattern, matched });
    }
  }

  return matches;
}

function calculateConfidence(signals: Signal[]): number {
  if (signals.length === 0) return 0;
  const avgStrength =
    signals.reduce((sum, s) => sum + s.strength, 0) / signals.length;
  const sourceBonus =
    new Set(signals.map((s) => s.source)).size * 10;
  const countBonus = Math.min(signals.length * 5, 25);
  return Math.min(100, Math.round(avgStrength * 0.6 + sourceBonus + countBonus));
}

function determineTrend(
  signals: Signal[]
): "emerging" | "accelerating" | "mature" | "declining" {
  const avgStrength =
    signals.reduce((sum, s) => sum + s.strength, 0) / signals.length;
  const sources = new Set(signals.map((s) => s.source)).size;

  if (avgStrength > 70 && sources >= 3) return "accelerating";
  if (avgStrength > 50 && sources >= 2) return "mature";
  if (signals.length <= 2) return "emerging";
  return "emerging";
}

export async function analyzeNarratives(): Promise<AnalysisResult> {
  const { signals, sources } = await collectAllSignals();
  const matches = matchSignalsToNarratives(signals);

  const narratives: Narrative[] = [];

  for (const [id, { pattern, matched }] of matches) {
    narratives.push({
      id,
      title: pattern.title,
      summary: pattern.description.slice(0, 120) + "...",
      description: pattern.description,
      signals: matched,
      confidence: calculateConfidence(matched),
      trend: determineTrend(matched),
      buildIdeas: pattern.buildIdeas,
      detectedAt: new Date().toISOString(),
      category: pattern.categories[0] || "General",
    });
  }

  // Sort by confidence descending
  narratives.sort((a, b) => b.confidence - a.confidence);

  return {
    narratives,
    totalSignals: signals.length,
    dataSourcesUsed: sources,
    analyzedAt: new Date().toISOString(),
    agentVersion: "ronin-0.1.0",
  };
}
