import { Prompt } from "../types";

interface TrendingCache {
  prompts: Prompt[];
  timestamp: number;
  date: string; // YYYY-MM-DD format for easy date comparison
}

class TrendingService {
  private readonly CACHE_KEY = "trending_prompts";
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  private readonly TRENDING_COUNT = 9;

  /**
   * Get trending prompts - either from cache or generate new ones
   */
  async getTrendingPrompts(allPrompts: Prompt[]): Promise<Prompt[]> {
    const cached = this.getCachedTrending();

    // Check if cache is valid (same day and not expired)
    if (cached && this.isCacheValid(cached)) {
      console.log("📊 Using cached trending prompts");
      return cached.prompts;
    }

    // Generate new trending prompts
    console.log("🎲 Generating new trending prompts");
    const trendingPrompts = this.generateRandomTrending(allPrompts);

    // Cache the new trending prompts
    this.cacheTrending(trendingPrompts);

    return trendingPrompts;
  }

  /**
   * Generate random trending prompts from all available prompts
   */
  private generateRandomTrending(allPrompts: Prompt[]): Prompt[] {
    if (allPrompts.length === 0) {
      return [];
    }

    // If we have fewer prompts than needed, return all
    if (allPrompts.length <= this.TRENDING_COUNT) {
      return [...allPrompts];
    }

    // Create a shuffled copy of all prompts
    const shuffled = [...allPrompts].sort(() => Math.random() - 0.5);

    // Take the first 9 prompts
    return shuffled.slice(0, this.TRENDING_COUNT);
  }

  /**
   * Get cached trending prompts from localStorage
   */
  private getCachedTrending(): TrendingCache | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;

      return JSON.parse(cached) as TrendingCache;
    } catch (error) {
      console.error("Error reading cached trending prompts:", error);
      return null;
    }
  }

  /**
   * Cache trending prompts to localStorage
   */
  private cacheTrending(prompts: Prompt[]): void {
    try {
      const now = new Date();
      const cache: TrendingCache = {
        prompts,
        timestamp: now.getTime(),
        date: now.toISOString().split("T")[0], // YYYY-MM-DD format
      };

      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
      console.log(
        `💾 Cached ${prompts.length} trending prompts for ${cache.date}`
      );
    } catch (error) {
      console.error("Error caching trending prompts:", error);
    }
  }

  /**
   * Check if cached trending prompts are still valid
   */
  private isCacheValid(cached: TrendingCache): boolean {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    // Check if it's the same day
    if (cached.date !== today) {
      console.log("📅 Trending prompts expired - different day");
      return false;
    }

    // Check if cache is not too old (within 24 hours)
    const age = now.getTime() - cached.timestamp;
    if (age > this.CACHE_DURATION) {
      console.log("⏰ Trending prompts expired - older than 24 hours");
      return false;
    }

    return true;
  }

  /**
   * Force refresh trending prompts (clear cache and generate new ones)
   */
  async refreshTrendingPrompts(allPrompts: Prompt[]): Promise<Prompt[]> {
    console.log("🔄 Force refreshing trending prompts");
    localStorage.removeItem(this.CACHE_KEY);
    return this.getTrendingPrompts(allPrompts);
  }

  /**
   * Get cache info for debugging
   */
  getCacheInfo(): { hasCache: boolean; date?: string; age?: number } {
    const cached = this.getCachedTrending();
    if (!cached) {
      return { hasCache: false };
    }

    const now = new Date();
    const age = now.getTime() - cached.timestamp;

    return {
      hasCache: true,
      date: cached.date,
      age: Math.round(age / (1000 * 60 * 60)), // Age in hours
    };
  }
}

export const trendingService = new TrendingService();
