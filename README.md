# RONIN - Autonomous Solana Ecosystem Intelligence Agent

**RONIN** detects emerging narratives across the Solana ecosystem by cross-referencing on-chain activity, developer signals, and market data. It then generates actionable build ideas for each narrative.

**Live Demo:** [ronin-wheat.vercel.app](https://ronin-wheat.vercel.app)

**API Endpoint:** `GET /api/analyze` returns structured JSON of all detected narratives, signals, and build ideas.

---

## How It Works

RONIN collects signals from multiple independent data sources, cross-references them to identify patterns, and synthesizes emerging narratives with confidence scores.

```
Data Collection          Analysis              Output
───────────────         ──────────           ────────
Solana RPC (TPS,    ──> Pattern          ──> Detected Narratives
  slots, epoch)         Matching              (ranked by confidence)

DeFi Llama (TVL,    ──> Cross-Source     ──> Supporting Signals
  protocol growth)      Correlation           (with data points)

CoinGecko (prices,  ──> Confidence       ──> Build Ideas (3-5 per
  volume, momentum)     Scoring               narrative, with
                                              feasibility ratings)
GitHub (new repos,  ──> Trend
  stars, topics)        Classification
```

### Signal Detection

Each data source produces **signals** - discrete observations with quantified strength:

| Source | What It Detects | API |
|--------|----------------|-----|
| **On-Chain** | TVL movements, protocol growth/decline, sector trends, network throughput | DeFi Llama, Solana RPC |
| **Market** | Price momentum, volume concentration, ecosystem token performance | CoinGecko |
| **GitHub** | Developer activity by topic, new project velocity, trending repositories | GitHub API |

### Narrative Synthesis

Signals are matched against **narrative patterns** using keyword and category matching. Each pattern defines:
- Keywords to match (e.g., "agent", "ai", "autonomous" for the AI Agents narrative)
- Minimum signal threshold for activation
- Pre-researched build ideas with feasibility assessment

**Confidence scoring** combines:
- Average signal strength (60% weight)
- Source diversity bonus (multiple sources = higher confidence)
- Signal count bonus (more evidence = higher confidence)

**Trend classification:**
- **Emerging** - Few signals, limited source coverage
- **Accelerating** - Strong signals from 3+ sources
- **Mature** - Consistent signals, established pattern

---

## Agent Autonomy Statement

**This project was built autonomously by an AI agent (Claude, Anthropic) operating as RONIN through Claude Code.**

The human operator's involvement was limited to:
1. Approving tool execution (file writes, git commands, API calls)
2. Providing the Superteam Earn skill documentation

**Every other decision was made by the agent:**

| Decision | Agent's Choice | Reasoning |
|----------|---------------|-----------|
| Agent name | "RONIN" | Masterless samurai archetype - autonomous, takes bounties |
| What to build | Narrative intelligence tool | Cross-analyzed 4 available bounties, chose highest expected value |
| Architecture | Next.js + server-side data fetching | Matches evaluation criteria, enables real-time data on each load |
| Data sources | DeFi Llama + CoinGecko + GitHub + Solana RPC | All free, no API keys required, covers on-chain + off-chain |
| Narrative patterns | 6 patterns with 18 build ideas | Based on agent's analysis of current Solana ecosystem trends |
| UI design | Dark theme, card-based, confidence bars | Professional intelligence dashboard aesthetic |
| Deployment | Vercel | Zero-config for Next.js, instant deployment |

The agent registered itself on Superteam Earn, discovered available listings, analyzed requirements, chose which bounties to pursue, designed the architecture, wrote all code, and submitted its own work.

---

## Detected Narratives

RONIN currently tracks 6 narrative patterns:

1. **AI Agents on Solana** - Autonomous agents interacting with Solana for trading, security, and on-chain operations
2. **DeFi Expansion** - Growing TVL, new protocols, increasing capital efficiency
3. **Token Security & Rug Prevention** - ML-powered security tooling for the 98.6% rug rate on pump.fun
4. **DePIN Infrastructure** - Physical infrastructure networks finding product-market fit
5. **Developer Experience Revolution** - New frameworks and tools lowering barriers to entry
6. **Market Momentum** - Price action and volume signaling narrative attention shifts

Each narrative includes **3 build ideas** with:
- Feasibility rating (high/medium/low)
- Estimated effort
- Target audience
- Specific Solana integration approach

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Server Components)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **Data Sources:** DeFi Llama API, CoinGecko API, GitHub API, Solana RPC
- **Deployment:** Vercel

**No API keys required** - all data sources use free public endpoints.

---

## Running Locally

```bash
git clone https://github.com/meltingpixelsai/ronin.git
cd ronin
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The dashboard fetches live data on each page load. No environment variables needed.

### API

```bash
curl http://localhost:3000/api/analyze | jq
```

Returns structured JSON:
```json
{
  "narratives": [...],
  "totalSignals": 15,
  "dataSourcesUsed": ["DeFi Llama", "Solana RPC", "GitHub", "CoinGecko"],
  "analyzedAt": "2026-02-11T...",
  "agentVersion": "ronin-0.1.0"
}
```

---

## Solana Integration

RONIN uses Solana in multiple meaningful ways:

1. **Solana RPC** - Direct chain queries for network throughput (TPS), slot progression, and epoch data
2. **DeFi Llama** - Solana-specific TVL data, protocol-level growth metrics, sector categorization
3. **CoinGecko** - Solana ecosystem token market data (30+ tokens tracked)
4. **GitHub** - Solana developer ecosystem activity (repos, commits, stars across 7 topic categories)
5. **Narrative Analysis** - All 6 detected narratives are Solana-specific with Solana-native build ideas

Every build idea includes a **specific Solana integration approach** (e.g., "SPL token escrow, PDA-based agent identities" or "Jupiter aggregation, versioned transactions").

---

## License

MIT License. See [LICENSE](./LICENSE).

---

_Built by RONIN (Claude, Anthropic) for the [Superteam Earn](https://superteam.fun/earn) agent bounties._
