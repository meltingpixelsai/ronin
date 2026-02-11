import { Signal, GitHubRepo } from "@/lib/types";

const GITHUB_API = "https://api.github.com";

async function searchSolanaRepos(query: string): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      `${GITHUB_API}/search/repositories?q=${encodeURIComponent(query)}&sort=updated&order=desc&per_page=15`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "ronin-agent",
        },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.items ?? [];
  } catch {
    return [];
  }
}

async function fetchTrendingTopics(): Promise<GitHubRepo[]> {
  const queries = [
    "solana created:>2026-01-01 stars:>5",
    "solana agent ai created:>2026-01-01",
    "solana depin created:>2025-10-01 stars:>3",
    "anchor solana created:>2025-10-01 stars:>10",
    "solana token-2022 OR token-extensions",
    "solana blinks OR actions created:>2025-06-01",
    "solana compressed-nft OR state-compression",
  ];

  const results: GitHubRepo[] = [];
  // Fetch first 3 queries to stay within rate limits
  for (const query of queries.slice(0, 3)) {
    const repos = await searchSolanaRepos(query);
    results.push(...repos);
    // Small delay to respect rate limits
    await new Promise((r) => setTimeout(r, 500));
  }

  // Deduplicate by full_name
  const seen = new Set<string>();
  return results.filter((r) => {
    if (seen.has(r.full_name)) return false;
    seen.add(r.full_name);
    return true;
  });
}

export async function collectGitHubSignals(): Promise<Signal[]> {
  const signals: Signal[] = [];
  const repos = await fetchTrendingTopics();

  if (repos.length === 0) return signals;

  // Group repos by topic/keyword
  const topicGroups = new Map<string, GitHubRepo[]>();
  const topicKeywords: Record<string, string[]> = {
    "AI Agents": ["agent", "ai", "llm", "gpt", "claude", "autonomous"],
    DePIN: ["depin", "iot", "sensor", "physical", "infrastructure"],
    DeFi: ["defi", "swap", "amm", "lending", "yield", "vault"],
    NFT: ["nft", "compressed", "bubblegum", "metaplex"],
    "Token Extensions": ["token-2022", "token-extensions", "spl-token"],
    Gaming: ["game", "gaming", "play-to-earn", "metaverse"],
    Payments: ["payment", "pay", "checkout", "commerce"],
    Security: ["security", "audit", "vulnerability", "scanner"],
    Tooling: ["sdk", "cli", "tool", "framework", "library"],
  };

  for (const repo of repos) {
    const repoText =
      `${repo.full_name} ${repo.description || ""} ${(repo.topics || []).join(" ")}`.toLowerCase();
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some((kw) => repoText.includes(kw))) {
        if (!topicGroups.has(topic)) topicGroups.set(topic, []);
        topicGroups.get(topic)!.push(repo);
      }
    }
  }

  // Generate signals from topic groups
  for (const [topic, topicRepos] of topicGroups) {
    if (topicRepos.length >= 2) {
      const totalStars = topicRepos.reduce(
        (sum, r) => sum + r.stargazers_count,
        0
      );
      const recentRepos = topicRepos.filter(
        (r) =>
          new Date(r.updated_at) >
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );

      signals.push({
        source: "github",
        category: topic,
        title: `${topic}: ${topicRepos.length} active repositories on Solana`,
        description: `Developer activity in ${topic} is ${recentRepos.length > topicRepos.length / 2 ? "strong" : "moderate"} with ${topicRepos.length} repos (${totalStars} total stars). ${recentRepos.length} updated in the last 7 days.`,
        dataPoints: topicRepos.slice(0, 3).map((r) => ({
          metric: r.full_name,
          value: `${r.stargazers_count} stars`,
          change: r.description?.slice(0, 80) || "",
          source: "GitHub",
          url: r.html_url,
        })),
        strength: Math.min(
          100,
          topicRepos.length * 15 + Math.min(totalStars, 50)
        ),
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Signal: Overall ecosystem velocity
  const recentlyCreated = repos.filter(
    (r) =>
      new Date(r.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  if (recentlyCreated.length > 0) {
    signals.push({
      source: "github",
      category: "Ecosystem",
      title: `${recentlyCreated.length} new Solana projects in the last 30 days`,
      description: `Developer ecosystem showing ${recentlyCreated.length >= 10 ? "high" : "moderate"} velocity with ${recentlyCreated.length} new repositories created. Top languages: ${[...new Set(recentlyCreated.map((r) => r.language).filter(Boolean))].slice(0, 3).join(", ")}.`,
      dataPoints: recentlyCreated.slice(0, 4).map((r) => ({
        metric: r.full_name,
        value: `${r.stargazers_count} stars`,
        change: `Created ${new Date(r.created_at).toLocaleDateString()}`,
        source: "GitHub",
        url: r.html_url,
      })),
      strength: Math.min(100, recentlyCreated.length * 8),
      timestamp: new Date().toISOString(),
    });
  }

  return signals;
}
