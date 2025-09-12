import { NextResponse } from "next/server";
import { getServerPrompts, getServerTrendingPrompts } from "../../../lib/data";

export async function GET() {
  try {
    const allPrompts = await getServerPrompts();
    const trendingPrompts = await getServerTrendingPrompts(allPrompts);

    return NextResponse.json(trendingPrompts);
  } catch (error) {
    console.error("Error fetching trending prompts:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending prompts" },
      { status: 500 }
    );
  }
}
