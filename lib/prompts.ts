import { Prompt, Category } from "../types";

interface RemotePrompt {
  title: string;
  category: string;
  prompt: string;
  promptType: "user" | "system";
  tags: string;
}

class PromptService {
  private prompts: Prompt[] = [];
  private categories: Category[] = [];
  private isLoading = false;
  private lastFetch = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async fetchPrompts(): Promise<{ prompts: Prompt[]; categories: Category[] }> {
    // Check if we have recent data
    const now = Date.now();
    if (this.prompts.length > 0 && now - this.lastFetch < this.CACHE_DURATION) {
      return { prompts: this.prompts, categories: this.categories };
    }

    if (this.isLoading) {
      // Wait for current fetch to complete
      while (this.isLoading) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return { prompts: this.prompts, categories: this.categories };
    }

    this.isLoading = true;

    try {
      console.log("🔄 Fetching prompts from remote URL...");

      // Fetch from GitHub raw URL
      const response = await fetch(
        "https://raw.githubusercontent.com/NodeOps-app/awesome-templates/main/output.json"
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch prompts: ${response.status} ${response.statusText}`
        );
      }

      const remotePrompts: RemotePrompt[] = await response.json();
      console.log(`✅ Fetched ${remotePrompts.length} prompts from remote`);

      // Transform remote prompts to our format
      this.prompts = remotePrompts.map((remotePrompt, index) => {
        // Parse tags from string to array
        const tags =
          remotePrompt.tags && remotePrompt.tags !== "null"
            ? remotePrompt.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag)
            : [];

        // Use category or default to 'General'
        const category =
          remotePrompt.category && remotePrompt.category !== "null"
            ? remotePrompt.category
            : "General";

        return {
          id: index + 1,
          title: remotePrompt.title,
          description: remotePrompt.prompt.substring(0, 100) + "...", // First 100 chars as description
          category,
          skills: tags,
          content: remotePrompt.prompt,
          prompt: remotePrompt.prompt,
          promptType: remotePrompt.promptType,
          tags: remotePrompt.tags,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });

      // Generate categories from the prompts
      const categoryMap = new Map<string, number>();
      this.prompts.forEach((prompt) => {
        const count = categoryMap.get(prompt.category) || 0;
        categoryMap.set(prompt.category, count + 1);
      });

      this.categories = [
        { id: "all", name: "All", count: this.prompts.length },
        ...Array.from(categoryMap.entries()).map(([name, count]) => ({
          id: name.toLowerCase().replace(/\s+/g, "-"),
          name,
          count,
        })),
      ];

      this.lastFetch = now;
      console.log(
        `✅ Processed ${this.prompts.length} prompts and ${this.categories.length} categories`
      );

      return { prompts: this.prompts, categories: this.categories };
    } catch (error) {
      console.error("❌ Error fetching prompts:", error);
      // Return empty arrays on error
      return { prompts: [], categories: [] };
    } finally {
      this.isLoading = false;
    }
  }

  getPrompts(): Prompt[] {
    return this.prompts;
  }

  getCategories(): Category[] {
    return this.categories;
  }

  getPromptById(id: number): Prompt | undefined {
    return this.prompts.find((prompt) => prompt.id === id);
  }

  getPromptsByCategory(categoryId: string): Prompt[] {
    if (categoryId === "all") {
      return this.prompts;
    }
    return this.prompts.filter(
      (prompt) =>
        prompt.category.toLowerCase().replace(/\s+/g, "-") === categoryId
    );
  }
}

export const promptService = new PromptService();
