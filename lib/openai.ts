import OpenAI from "openai";
import { OpenAIConfig, OpenAIModel, ChatMessage } from "../types";

class OpenAIService {
  private client: OpenAI | null = null;
  private config: OpenAIConfig | null = null;

  setConfig(config: OpenAIConfig) {
    this.config = config;
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
      dangerouslyAllowBrowser: true, // Required for browser environment
    });
  }

  getConfig(): OpenAIConfig | null {
    return this.config;
  }

  isConfigured(): boolean {
    return this.client !== null && this.config !== null;
  }

  async getModels(): Promise<OpenAIModel[]> {
    if (!this.client) {
      throw new Error("OpenAI client not configured");
    }

    try {
      const response = await this.client.models.list();
      return response.data;
    } catch (error) {
      console.error("Error fetching models:", error);
      throw new Error(
        "Failed to fetch models. Please check your API configuration."
      );
    }
  }

  async sendMessage(
    messages: ChatMessage[],
    model: string,
    systemPrompt?: string
  ): Promise<string> {
    if (!this.client) {
      throw new Error("OpenAI client not configured");
    }

    try {
      const openaiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
        [];

      if (systemPrompt) {
        openaiMessages.push({
          role: "system",
          content: systemPrompt,
        });
      }

      messages.forEach((msg) => {
        openaiMessages.push({
          role: msg.role,
          content: msg.content,
        });
      });

      const response = await this.client.chat.completions.create({
        model,
        messages: openaiMessages,
        temperature: 0.7,
        max_tokens: 2000,
      });

      return response.choices[0]?.message?.content || "No response generated";
    } catch (error) {
      console.error("Error sending message:", error);
      throw new Error(
        "Failed to send message. Please check your API configuration."
      );
    }
  }

  async sendMessageStream(
    messages: ChatMessage[],
    model: string,
    systemPrompt?: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    if (!this.client) {
      throw new Error("OpenAI client not configured");
    }

    try {
      const openaiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
        [];

      if (systemPrompt) {
        openaiMessages.push({
          role: "system",
          content: systemPrompt,
        });
      }

      messages.forEach((msg) => {
        openaiMessages.push({
          role: msg.role,
          content: msg.content,
        });
      });

      const stream = await this.client.chat.completions.create({
        model,
        messages: openaiMessages,
        temperature: 0.7,
        max_tokens: 2000,
        stream: true,
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          onChunk?.(content);
        }
      }

      return fullResponse;
    } catch (error) {
      console.error("Error sending streaming message:", error);
      throw new Error(
        "Failed to send message. Please check your API configuration."
      );
    }
  }
}

export const openaiService = new OpenAIService();
