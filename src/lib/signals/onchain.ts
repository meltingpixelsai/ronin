import { Signal, DefiLlamaProtocol } from "@/lib/types";

const DEFILLAMA_BASE = "https://api.llama.fi";

async function fetchSolanaTVL(): Promise<{
  totalTvl: number;
  protocols: DefiLlamaProtocol[];
}> {
  try {
    const res = await fetch(`${DEFILLAMA_BASE}/v2/chains`, {
      next: { revalidate: 3600 },
    });
    const chains = await res.json();
    const solana = chains.find(
      (c: { name: string }) =>
        c.name.toLowerCase() === "solana"
    );
    const totalTvl = solana?.tvl ?? 0;

    const protocolsRes = await fetch(`${DEFILLAMA_BASE}/protocols`, {
      next: { revalidate: 3600 },
    });
    const allProtocols = await protocolsRes.json();
    const solanaProtocols = allProtocols
      .filter(
        (p: DefiLlamaProtocol & { chains?: string[] }) =>
          p.chains?.includes("Solana") && p.tvl > 1_000_000
      )
      .sort((a: DefiLlamaProtocol, b: DefiLlamaProtocol) => b.tvl - a.tvl)
      .slice(0, 20);

    return { totalTvl, protocols: solanaProtocols };
  } catch {
    return { totalTvl: 0, protocols: [] };
  }
}

async function fetchSolanaStats(): Promise<{
  slot: number;
  epoch: number;
  tps: number;
}> {
  try {
    const rpc = "https://api.mainnet-beta.solana.com";
    const [slotRes, perfRes] = await Promise.all([
      fetch(rpc, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getSlot",
        }),
      }),
      fetch(rpc, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 2,
          method: "getRecentPerformanceSamples",
          params: [1],
        }),
      }),
    ]);

    const slotData = await slotRes.json();
    const perfData = await perfRes.json();

    const slot = slotData.result ?? 0;
    const perf = perfData.result?.[0];
    const tps = perf
      ? Math.round(perf.numTransactions / perf.samplePeriodSecs)
      : 0;

    return { slot, epoch: Math.floor(slot / 432000), tps };
  } catch {
    return { slot: 0, epoch: 0, tps: 0 };
  }
}

export async function collectOnChainSignals(): Promise<Signal[]> {
  const signals: Signal[] = [];

  const [tvlData, chainStats] = await Promise.all([
    fetchSolanaTVL(),
    fetchSolanaStats(),
  ]);

  // Signal: Overall Solana TVL
  if (tvlData.totalTvl > 0) {
    signals.push({
      source: "onchain",
      category: "DeFi",
      title: "Solana Total Value Locked",
      description: `Solana ecosystem holds $${(tvlData.totalTvl / 1e9).toFixed(2)}B in TVL across ${tvlData.protocols.length}+ protocols.`,
      dataPoints: [
        {
          metric: "Total TVL",
          value: `$${(tvlData.totalTvl / 1e9).toFixed(2)}B`,
          source: "DeFi Llama",
          url: "https://defillama.com/chain/Solana",
        },
      ],
      strength: Math.min(100, Math.round((tvlData.totalTvl / 1e10) * 100)),
      timestamp: new Date().toISOString(),
    });
  }

  // Signal: Top protocol movements
  const topMovers = tvlData.protocols
    .filter((p) => Math.abs(p.change_7d) > 10)
    .sort((a, b) => Math.abs(b.change_7d) - Math.abs(a.change_7d))
    .slice(0, 5);

  for (const protocol of topMovers) {
    const direction = protocol.change_7d > 0 ? "growing" : "declining";
    signals.push({
      source: "onchain",
      category: protocol.category || "DeFi",
      title: `${protocol.name} TVL ${direction}`,
      description: `${protocol.name} (${protocol.category}) has seen ${protocol.change_7d > 0 ? "+" : ""}${protocol.change_7d.toFixed(1)}% TVL change over 7 days. Current TVL: $${(protocol.tvl / 1e6).toFixed(1)}M.`,
      dataPoints: [
        {
          metric: "TVL",
          value: `$${(protocol.tvl / 1e6).toFixed(1)}M`,
          change: `${protocol.change_7d > 0 ? "+" : ""}${protocol.change_7d.toFixed(1)}% (7d)`,
          source: "DeFi Llama",
        },
        {
          metric: "24h Change",
          value: `${protocol.change_1d > 0 ? "+" : ""}${protocol.change_1d.toFixed(1)}%`,
          source: "DeFi Llama",
        },
      ],
      strength: Math.min(100, Math.round(Math.abs(protocol.change_7d) * 2)),
      timestamp: new Date().toISOString(),
    });
  }

  // Signal: Network performance
  if (chainStats.tps > 0) {
    signals.push({
      source: "onchain",
      category: "Infrastructure",
      title: "Solana Network Throughput",
      description: `Solana processing ~${chainStats.tps.toLocaleString()} TPS at slot ${chainStats.slot.toLocaleString()} (epoch ${chainStats.epoch}).`,
      dataPoints: [
        {
          metric: "TPS",
          value: chainStats.tps,
          source: "Solana RPC",
        },
        {
          metric: "Current Slot",
          value: chainStats.slot.toLocaleString(),
          source: "Solana RPC",
        },
      ],
      strength: Math.min(100, Math.round((chainStats.tps / 5000) * 100)),
      timestamp: new Date().toISOString(),
    });
  }

  // Categorize DeFi protocols by type for narrative detection
  const categories = new Map<string, DefiLlamaProtocol[]>();
  for (const p of tvlData.protocols) {
    const cat = p.category || "Other";
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat)!.push(p);
  }

  for (const [category, protocols] of categories) {
    if (protocols.length >= 3) {
      const avgChange =
        protocols.reduce((sum, p) => sum + (p.change_7d || 0), 0) /
        protocols.length;
      const totalCatTvl = protocols.reduce((sum, p) => sum + p.tvl, 0);

      if (Math.abs(avgChange) > 5) {
        signals.push({
          source: "onchain",
          category,
          title: `${category} sector ${avgChange > 0 ? "expansion" : "contraction"} on Solana`,
          description: `${protocols.length} ${category} protocols averaging ${avgChange > 0 ? "+" : ""}${avgChange.toFixed(1)}% change over 7 days. Combined TVL: $${(totalCatTvl / 1e6).toFixed(0)}M.`,
          dataPoints: protocols.slice(0, 3).map((p) => ({
            metric: p.name,
            value: `$${(p.tvl / 1e6).toFixed(1)}M`,
            change: `${p.change_7d > 0 ? "+" : ""}${p.change_7d.toFixed(1)}%`,
            source: "DeFi Llama",
          })),
          strength: Math.min(
            100,
            Math.round(Math.abs(avgChange) * 3 + protocols.length * 5)
          ),
          timestamp: new Date().toISOString(),
        });
      }
    }
  }

  return signals;
}
