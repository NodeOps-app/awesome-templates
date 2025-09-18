import { Prompt, Category } from "../types";

// Server-side data fetching functions
export async function getServerPrompts(): Promise<Prompt[]> {
  try {
    console.log("🔄 Fetching prompts on server...");

    const response = await fetch(
      "https://raw.githubusercontent.com/NodeOps-app/awesome-templates/main/output.json",
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch prompts: ${response.status} ${response.statusText}`
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const remotePrompts: any[] = await response.json();
    console.log(`✅ Fetched ${remotePrompts.length} prompts on server`);

    // Log sample of remote data to debug categories
    console.log(
      "🔍 Sample remote prompt categories:",
      remotePrompts
        .slice(0, 5)
        .map((p) => ({ title: p.title, category: p.category }))
    );

    // Transform remote prompts to our format
    const prompts: Prompt[] = remotePrompts.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (remotePrompt: any, index: number) => {
        const tags =
          remotePrompt.tags && remotePrompt.tags !== "null"
            ? remotePrompt.tags
                .split(",")
                .map((tag: string) => tag.trim())
                .filter((tag: string) => tag)
            : [];

        const category =
          remotePrompt.category &&
          remotePrompt.category !== "null" &&
          remotePrompt.category !== null
            ? remotePrompt.category
            : "General";

        return {
          id: index + 1,
          title: remotePrompt.title,
          description: remotePrompt.prompt.substring(0, 100) + "...",
          category,
          skills: tags,
          content: remotePrompt.prompt,
          prompt: remotePrompt.prompt,
          promptType: remotePrompt.promptType,
          tags: remotePrompt.tags,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
    );

    return prompts;
  } catch (error) {
    console.error("❌ Error fetching prompts on server:", error);
    return [];
  }
}

export async function getServerCategories(
  prompts: Prompt[]
): Promise<Category[]> {
  const categoryMap = new Map<string, number>();
  prompts.forEach((prompt) => {
    const count = categoryMap.get(prompt.category) || 0;
    categoryMap.set(prompt.category, count + 1);
  });

  return Array.from(categoryMap.entries()).map(([name, count]) => ({
    id: name.toLowerCase().replace(/\s+/g, "-"),
    name,
    count,
  }));
}

export async function getServerPromptById(id: number): Promise<Prompt | null> {
  const prompts = await getServerPrompts();
  return prompts.find((prompt) => prompt.id === id) || null;
}

export async function getServerTrendingPrompts(
  prompts: Prompt[]
): Promise<Prompt[]> {
  if (prompts.length === 0) return [];

  if (prompts.length <= 9) {
    return [...prompts];
  }

  // Use deterministic seeding based on current date for server-side rendering
  // This ensures the same trending prompts are shown for the entire day
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const seed = today.split("-").join(""); // Convert to YYYYMMDD for seeding

  // Simple seeded random function
  const seededRandom = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return () => {
      hash = (hash * 9301 + 49297) % 233280;
      return hash / 233280;
    };
  };

  const random = seededRandom(seed);
  const shuffled = [...prompts].sort(() => random() - 0.5);

  const selectedPrompts = shuffled.slice(0, 9);
  console.log(`🎲 Generated deterministic trending prompts for ${today}`);
  console.log(
    "📊 Server trending prompt categories:",
    selectedPrompts.map((p) => p.category)
  );
  return selectedPrompts;
}
