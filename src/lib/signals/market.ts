import { Signal, CoinGeckoToken } from "@/lib/types";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

async function fetchSolanaEcosystemTokens(): Promise<CoinGeckoToken[]> {
  try {
    const res = await fetch(
      `${COINGECKO_BASE}/coins/markets?vs_currency=usd&category=solana-ecosystem&order=market_cap_desc&per_page=30&page=1&sparkline=false&price_change_percentage=7d`,
      {
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function collectMarketSignals(): Promise<Signal[]> {
  const signals: Signal[] = [];
  const tokens = await fetchSolanaEcosystemTokens();

  if (tokens.length === 0) return signals;

  // Signal: SOL price action
  const sol = tokens.find((t) => t.symbol === "sol");
  if (sol) {
    signals.push({
      source: "market",
      category: "Market",
      title: "SOL Market Position",
      description: `SOL at $${sol.current_price.toFixed(2)} with ${sol.price_change_percentage_24h > 0 ? "+" : ""}${sol.price_change_percentage_24h.toFixed(1)}% (24h). Market cap: $${(sol.market_cap / 1e9).toFixed(1)}B. 24h volume: $${(sol.total_volume / 1e9).toFixed(2)}B.`,
      dataPoints: [
        {
          metric: "Price",
          value: `$${sol.current_price.toFixed(2)}`,
          change: `${sol.price_change_percentage_24h > 0 ? "+" : ""}${sol.price_change_percentage_24h.toFixed(1)}% (24h)`,
          source: "CoinGecko",
        },
        {
          metric: "Market Cap",
          value: `$${(sol.market_cap / 1e9).toFixed(1)}B`,
          source: "CoinGecko",
        },
        {
          metric: "24h Volume",
          value: `$${(sol.total_volume / 1e9).toFixed(2)}B`,
          source: "CoinGecko",
        },
      ],
      strength: Math.min(
        100,
        50 + Math.abs(sol.price_change_percentage_24h) * 3
      ),
      timestamp: new Date().toISOString(),
    });
  }

  // Signal: Top gainers (7d momentum)
  const gainers = tokens
    .filter(
      (t) =>
        t.price_change_percentage_7d_in_currency &&
        t.price_change_percentage_7d_in_currency > 10 &&
        t.symbol !== "sol"
    )
    .sort(
      (a, b) =>
        (b.price_change_percentage_7d_in_currency ?? 0) -
        (a.price_change_percentage_7d_in_currency ?? 0)
    )
    .slice(0, 5);

  if (gainers.length >= 2) {
    signals.push({
      source: "market",
      category: "Momentum",
      title: `${gainers.length} Solana tokens surging this week`,
      description: `Notable 7-day gains across the Solana ecosystem: ${gainers.map((g) => `${g.symbol.toUpperCase()} (+${g.price_change_percentage_7d_in_currency?.toFixed(0)}%)`).join(", ")}.`,
      dataPoints: gainers.map((g) => ({
        metric: g.name,
        value: `$${g.current_price < 1 ? g.current_price.toPrecision(3) : g.current_price.toFixed(2)}`,
        change: `+${g.price_change_percentage_7d_in_currency?.toFixed(1)}% (7d)`,
        source: "CoinGecko",
      })),
      strength: Math.min(
        100,
        gainers.reduce(
          (sum, g) =>
            sum + (g.price_change_percentage_7d_in_currency ?? 0) / 5,
          0
        )
      ),
      timestamp: new Date().toISOString(),
    });
  }

  // Signal: Top losers (7d decline)
  const losers = tokens
    .filter(
      (t) =>
        t.price_change_percentage_7d_in_currency &&
        t.price_change_percentage_7d_in_currency < -10 &&
        t.symbol !== "sol"
    )
    .sort(
      (a, b) =>
        (a.price_change_percentage_7d_in_currency ?? 0) -
        (b.price_change_percentage_7d_in_currency ?? 0)
    )
    .slice(0, 5);

  if (losers.length >= 2) {
    signals.push({
      source: "market",
      category: "Risk",
      title: `${losers.length} Solana tokens declining this week`,
      description: `Notable 7-day declines: ${losers.map((l) => `${l.symbol.toUpperCase()} (${l.price_change_percentage_7d_in_currency?.toFixed(0)}%)`).join(", ")}.`,
      dataPoints: losers.map((l) => ({
        metric: l.name,
        value: `$${l.current_price < 1 ? l.current_price.toPrecision(3) : l.current_price.toFixed(2)}`,
        change: `${l.price_change_percentage_7d_in_currency?.toFixed(1)}% (7d)`,
        source: "CoinGecko",
      })),
      strength: Math.min(
        100,
        losers.reduce(
          (sum, l) =>
            sum +
            Math.abs(l.price_change_percentage_7d_in_currency ?? 0) / 5,
          0
        )
      ),
      timestamp: new Date().toISOString(),
    });
  }

  // Signal: Volume concentration
  const totalVolume = tokens.reduce((sum, t) => sum + t.total_volume, 0);
  const solVolume = sol?.total_volume ?? 0;
  const altVolume = totalVolume - solVolume;
  if (altVolume > 0 && totalVolume > 0) {
    const altShare = (altVolume / totalVolume) * 100;
    signals.push({
      source: "market",
      category: "Liquidity",
      title: `Solana ecosystem token trading volume`,
      description: `Total 24h volume across tracked Solana tokens: $${(totalVolume / 1e9).toFixed(2)}B. Non-SOL tokens account for ${altShare.toFixed(0)}% of volume, indicating ${altShare > 40 ? "healthy ecosystem diversity" : "SOL dominance"}.`,
      dataPoints: [
        {
          metric: "Total Volume",
          value: `$${(totalVolume / 1e9).toFixed(2)}B`,
          source: "CoinGecko",
        },
        {
          metric: "Alt Token Share",
          value: `${altShare.toFixed(0)}%`,
          source: "CoinGecko",
        },
      ],
      strength: Math.min(100, Math.round(altShare * 1.5 + 20)),
      timestamp: new Date().toISOString(),
    });
  }

  return signals;
}
