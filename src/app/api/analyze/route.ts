import { NextResponse } from "next/server";
import { analyzeNarratives } from "@/lib/analysis/engine";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET() {
  try {
    const result = await analyzeNarratives();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis failed:", error);
    return NextResponse.json(
      { error: "Analysis failed", message: String(error) },
      { status: 500 }
    );
  }
}
