// FlashFusion types and interfaces

export type PromptCategory =
  | "automation"
  | "creative"
  | "ops"
  | "llm"
  | "notion"
  | "workflow";

export type PromptSection = "context" | "task" | "constraints" | "tone";

export interface PromptPreset {
  id: string;
  name: string;
  content: string;
  section: PromptSection;
  category: PromptCategory;
  tags: string[];
  description?: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: PromptCategory;
  context: string;
  task: string;
  constraints: string;
  tone: string;
  tags: string[];
  author?: string;
  isPublic?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FlashFusionPack {
  version: string;
  name: string;
  description: string;
  category: PromptCategory;
  sections: {
    context: string;
    task: string;
    constraints: string;
    tone: string;
  };
  tags: string[];
  metadata: {
    author?: string;
    createdAt: string;
    updatedAt: string;
    tokenCount?: number;
  };
}

export interface SearchFilter {
  query: string;
  categories: PromptCategory[];
  tags: string[];
  section?: PromptSection;
}
