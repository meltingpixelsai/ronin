import { Signal } from "@/lib/types";
import { collectOnChainSignals } from "./onchain";
import { collectGitHubSignals } from "./github";
import { collectMarketSignals } from "./market";

export async function collectAllSignals(): Promise<{
  signals: Signal[];
  sources: string[];
}> {
  const [onchain, github, market] = await Promise.all([
    collectOnChainSignals().catch(() => [] as Signal[]),
    collectGitHubSignals().catch(() => [] as Signal[]),
    collectMarketSignals().catch(() => [] as Signal[]),
  ]);

  const signals = [...onchain, ...github, ...market].sort(
    (a, b) => b.strength - a.strength
  );

  const sources: string[] = [];
  if (onchain.length > 0) sources.push("DeFi Llama", "Solana RPC");
  if (github.length > 0) sources.push("GitHub");
  if (market.length > 0) sources.push("CoinGecko");

  return { signals, sources };
}
