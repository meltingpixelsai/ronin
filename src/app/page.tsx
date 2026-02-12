import { analyzeNarratives } from "@/lib/analysis/engine";
import { Narrative, Signal, BuildIdea } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function TrendBadge({ trend }: { trend: Narrative["trend"] }) {
  const styles = {
    emerging: "bg-purple/20 text-purple border-purple/30",
    accelerating: "bg-green/20 text-green border-green/30",
    mature: "bg-accent/20 text-accent border-accent/30",
    declining: "bg-red/20 text-red border-red/30",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[trend]}`}
    >
      {trend === "accelerating" && "^"}
      {trend === "emerging" && "*"}
      {trend === "mature" && "~"}
      {trend === "declining" && "v"}
      {trend}
    </span>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  const color =
    value >= 70
      ? "bg-green"
      : value >= 40
        ? "bg-amber"
        : "bg-red";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-border">
        <div
          className={`h-full rounded-full ${color} transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-mono text-foreground/60">{value}%</span>
    </div>
  );
}

function SourceIcon({ source }: { source: Signal["source"] }) {
  const labels = {
    onchain: "ON-CHAIN",
    github: "GITHUB",
    social: "SOCIAL",
    market: "MARKET",
  };
  const colors = {
    onchain: "text-green bg-green/10 border-green/20",
    github: "text-foreground bg-foreground/10 border-foreground/20",
    social: "text-accent bg-accent/10 border-accent/20",
    market: "text-amber bg-amber/10 border-amber/20",
  };
  return (
    <span
      className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-mono font-bold ${colors[source]}`}
    >
      {labels[source]}
    </span>
  );
}

function FeasibilityDot({ level }: { level: BuildIdea["feasibility"] }) {
  const colors = {
    high: "bg-green",
    medium: "bg-amber",
    low: "bg-red",
  };
  return (
    <span className="inline-flex items-center gap-1 text-xs text-foreground/60">
      <span className={`inline-block h-2 w-2 rounded-full ${colors[level]}`} />
      {level} feasibility
    </span>
  );
}

function SignalCard({ signal }: { signal: Signal }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="mb-1 flex items-center gap-2">
        <SourceIcon source={signal.source} />
        <span className="text-xs text-foreground/40">{signal.category}</span>
      </div>
      <p className="text-sm font-medium text-foreground/80">
        {signal.title}
      </p>
      <div className="mt-2 space-y-1">
        {signal.dataPoints.slice(0, 3).map((dp, i) => (
          <div
            key={i}
            className="flex items-center justify-between text-xs"
          >
            <span className="text-foreground/50">{dp.metric}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-foreground/70">{dp.value}</span>
              {dp.change && (
                <span
                  className={`font-mono ${dp.change.startsWith("+") ? "text-green" : dp.change.startsWith("-") ? "text-red" : "text-foreground/50"}`}
                >
                  {dp.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BuildIdeaCard({ idea, index }: { idea: BuildIdea; index: number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-card-hover">
      <div className="mb-2 flex items-start justify-between">
        <h4 className="text-sm font-semibold text-foreground">
          <span className="mr-2 font-mono text-accent">{index + 1}.</span>
          {idea.title}
        </h4>
        <FeasibilityDot level={idea.feasibility} />
      </div>
      <p className="mb-3 text-sm text-foreground/60">{idea.description}</p>
      <div className="space-y-1.5 text-xs">
        <div className="flex gap-2">
          <span className="font-semibold text-foreground/40">Audience:</span>
          <span className="text-foreground/60">{idea.targetAudience}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold text-foreground/40">Effort:</span>
          <span className="text-foreground/60">{idea.estimatedEffort}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold text-foreground/40">Solana:</span>
          <span className="text-foreground/60">{idea.solanaIntegration}</span>
        </div>
      </div>
    </div>
  );
}

function NarrativeSection({ narrative }: { narrative: Narrative }) {
  return (
    <section className="rounded-xl border border-border bg-card/50 p-6">
      <div className="mb-4">
        <div className="mb-2 flex items-center gap-3">
          <h2 className="text-xl font-bold text-foreground">
            {narrative.title}
          </h2>
          <TrendBadge trend={narrative.trend} />
        </div>
        <p className="mb-3 text-sm text-foreground/60">
          {narrative.description}
        </p>
        <div className="max-w-xs">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-foreground/30">
            Confidence
          </span>
          <ConfidenceBar value={narrative.confidence} />
        </div>
      </div>

      {/* Supporting Signals */}
      <div className="mb-6">
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground/30">
          Supporting Signals ({narrative.signals.length})
        </h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {narrative.signals.slice(0, 6).map((signal, i) => (
            <SignalCard key={i} signal={signal} />
          ))}
        </div>
      </div>

      {/* Build Ideas */}
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-foreground/30">
          Build Ideas ({narrative.buildIdeas.length})
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {narrative.buildIdeas.map((idea, i) => (
            <BuildIdeaCard key={i} idea={idea} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function Dashboard() {
  const result = await analyzeNarratives();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">
              <span className="gradient-text">RONIN</span>
            </h1>
            <span className="hidden text-sm text-foreground/40 sm:inline">
              Solana Ecosystem Intelligence
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-foreground/40">
              <span className="inline-block h-2 w-2 rounded-full bg-green animate-pulse-dot" />
              LIVE
            </div>
            <span className="font-mono text-xs text-foreground/30">
              v{result.agentVersion.split("-").pop()}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats Bar */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-foreground/30">
              Narratives Detected
            </span>
            <span className="text-2xl font-bold text-accent">
              {result.narratives.length}
            </span>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-foreground/30">
              Signals Processed
            </span>
            <span className="text-2xl font-bold text-foreground">
              {result.totalSignals}
            </span>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-foreground/30">
              Data Sources
            </span>
            <span className="text-2xl font-bold text-purple">
              {result.dataSourcesUsed.length}
            </span>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-foreground/30">
              Last Analysis
            </span>
            <span className="text-sm font-mono text-foreground/60">
              {new Date(result.analyzedAt).toLocaleTimeString('en-US', { timeZone: 'America/New_York' })}
            </span>
          </div>
        </div>

        {/* Data Sources */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/30">
            Sources:
          </span>
          {result.dataSourcesUsed.map((source) => (
            <span
              key={source}
              className="rounded-full border border-border bg-card px-2.5 py-0.5 text-xs text-foreground/50"
            >
              {source}
            </span>
          ))}
        </div>

        {/* Narratives */}
        <div className="space-y-6">
          {result.narratives.map((narrative) => (
            <NarrativeSection key={narrative.id} narrative={narrative} />
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-border py-8 text-center">
          <p className="text-xs text-foreground/30">
            RONIN - Autonomous Solana Ecosystem Intelligence Agent
          </p>
          <p className="mt-1 text-xs text-foreground/20">
            Built autonomously by an AI agent (Claude, Anthropic). All decisions
            - architecture, data sources, analysis methodology, and UI - were
            made by the agent.
          </p>
          <p className="mt-1 text-xs text-foreground/20">
            Data from DeFi Llama, CoinGecko, GitHub, Solana RPC. Updated on
            each page load.
          </p>
        </footer>
      </main>
    </div>
  );
}
