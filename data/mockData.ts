import { Prompt, Category } from "../types";
import { promptService } from "../lib/prompts";

// Legacy mock data - will be replaced by remote data
export const mockPrompts: Prompt[] = [];
export const categories: Category[] = [];

// Export functions that use the prompt service
export const getPrompts = async (): Promise<Prompt[]> => {
  const { prompts } = await promptService.fetchPrompts();
  return prompts;
};

export const getCategories = async (): Promise<Category[]> => {
  const { categories } = await promptService.fetchPrompts();
  return categories;
};

export const getPromptById = async (
  id: number
): Promise<Prompt | undefined> => {
  const { prompts } = await promptService.fetchPrompts();
  return prompts.find((prompt) => prompt.id === id);
};

export const getPromptsByCategory = async (
  categoryId: string
): Promise<Prompt[]> => {
  const { prompts } = await promptService.fetchPrompts();
  if (categoryId === "all") {
    return prompts;
  }
  return prompts.filter(
    (prompt) =>
      prompt.category.toLowerCase().replace(/\s+/g, "-") === categoryId
  );
};
