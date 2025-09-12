export interface Prompt {
  id: number;
  title: string;
  description: string;
  category: string;
  skills: string[];
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}
