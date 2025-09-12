export interface Prompt {
  id: number;
  title: string;
  description: string;
  category: string;
  skills: string[];
  content?: string;
  createdAt?: string;
  updatedAt?: string;
  prompt?: string;
  promptType?: "user" | "system";
  tags?: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface OpenAIConfig {
  apiKey: string;
  baseURL: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  promptId: number;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface OpenAIModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}
