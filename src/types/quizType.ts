export interface QuizBlock {
  id: string;
  type: "heading" | "question" | "button" | "footer";
  content: string;
  properties: Record<string, any>;
}

export interface Quiz {
  id: string;
  title: string;
  blocks: QuizBlock[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}
