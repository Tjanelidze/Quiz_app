import toast from "react-hot-toast";
import type { Quiz, QuizBlock } from "../types/quizType";
import { nowIso } from "../utils/datetime";
import {
  publishQuiz as publishQuizUtil,
  unpublishQuiz as unpublishQuizUtil,
} from "../utils/quiz";

const STORAGE_KEY = "quizbuilder.quizzes";

class QuizStorageService {
  private getQuizzesFromStorage(): Quiz[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        console.warn(
          "Stored quizzes is not an array, resetting to empty array",
        );
        return [];
      }

      return parsed;
    } catch (error) {
      console.error("Error parsing quizzes from localStorage:", error);
      toast.error("Failed to load quizzes from storage");

      return [];
    }
  }

  private generateId(): string {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    // Fallback for older browsers
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private saveQuizzesToStorage(
    quizzes: Quiz[],
    successMessage: string = "Saved successfully!",
  ): boolean {
    try {
      const jsonString = JSON.stringify(quizzes);
      localStorage.setItem(STORAGE_KEY, jsonString);

      toast.success(successMessage);
      return true;
    } catch (error) {
      console.error("Error saving quizzes to localStorage: ", error);
      toast.error("Failed to save quiz to storage");

      if (error instanceof Error && error.name === "QuotaExceededError") {
        toast.error(
          "Storage quota exceeded. Please delete some quizzes to free up space.",
        );
      } else {
        toast.error("Failed to save quiz to storage, Storage quota exceeded");
      }
      return false;
    }
  }

  private getTemporaryBlocks(): QuizBlock[] {
    try {
      const stored = localStorage.getItem("quizbuilder.tempBlocks");
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed;
    } catch (error) {
      console.error("Error parsing temporary blocks from localStorage:", error);
      return [];
    }
  }

  saveTemporaryBlocks(blocks: QuizBlock[]): void {
    try {
      localStorage.setItem("quizbuilder.tempBlocks", JSON.stringify(blocks));
    } catch (error) {
      console.error("Error saving temporary blocks to localStorage:", error);
    }
  }

  getAllQuizzes(): Quiz[] {
    return this.getQuizzesFromStorage();
  }

  getQuizById(id: string): Quiz | null {
    const quizzes = this.getQuizzesFromStorage();
    return quizzes.find((quiz) => quiz.id === id) || null;
  }

  saveQuiz(quiz: Quiz): boolean {
    const quizzes = this.getQuizzesFromStorage();
    const existingIndex = quizzes.findIndex((q) => q.id === quiz.id);

    if (existingIndex >= 0) {
      quizzes[existingIndex] = {
        ...quiz,
        updatedAt: nowIso(),
      };
    } else {
      const newQuiz = {
        ...quiz,
        id: quiz.id === "new" ? this.generateId() : quiz.id,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };

      quizzes.push(newQuiz);
    }

    return this.saveQuizzesToStorage(quizzes);
  }

  deleteQuiz(id: string): boolean {
    const quizzes = this.getQuizzesFromStorage();
    const filteredQuizzes = quizzes.filter((quiz) => quiz.id !== id);

    return this.saveQuizzesToStorage(
      filteredQuizzes,
      "Quiz deleted successfully!",
    );
  }

  publishQuiz(id: string): boolean {
    const quizzes = this.getQuizzesFromStorage();
    const quizIndex = quizzes.findIndex((q) => q.id === id);

    if (quizIndex === -1) return false;

    quizzes[quizIndex] = publishQuizUtil(quizzes[quizIndex]);

    return this.saveQuizzesToStorage(quizzes);
  }

  unpublishQuiz(id: string): boolean {
    const quizzes = this.getQuizzesFromStorage();
    const quizIndex = quizzes.findIndex((q) => q.id === id);

    if (quizIndex === -1) return false;

    quizzes[quizIndex] = unpublishQuizUtil(quizzes[quizIndex]);

    return this.saveQuizzesToStorage(quizzes);
  }

  deleteBlock({ quizId, blockId }: { quizId: string; blockId: string }) {
    const quizzes = this.getQuizzesFromStorage();
    const quizIndex = quizzes.findIndex((quiz) => quiz.id === quizId);

    if (quizIndex === -1) {
      toast.error("Quiz not found");
      return false;
    }

    const quiz = quizzes[quizIndex];
    const blockIndex = quiz.blocks.findIndex((block) => block.id === blockId);

    if (blockIndex === -1) {
      toast.error("Block not found");
      return false;
    }

    const updatedBlocks = quiz.blocks.filter((block) => block.id !== blockId);
    const updatedQuiz = {
      ...quiz,
      blocks: updatedBlocks,
      updatedAt: nowIso(),
    };

    quizzes[quizIndex] = updatedQuiz;

    return this.saveQuizzesToStorage(quizzes, "Block deleted successfully!");
  }

  addBlock({ quizId, newBlock }: { quizId: string; newBlock: QuizBlock }) {
    if (quizId === "new") {
      const tempBlocks = this.getTemporaryBlocks();
      tempBlocks.push(newBlock);
      this.saveTemporaryBlocks(tempBlocks);

      toast.success("Block saved temporarily!");
      return true;
    }

    const quizzes = this.getQuizzesFromStorage();
    const quizIndex = quizzes.findIndex((quiz) => quiz.id === quizId);

    if (quizIndex === -1) {
      toast.error("Quiz not found");
      return false;
    }

    const quiz = quizzes[quizIndex];
    const updatedBlocks = [...quiz.blocks, newBlock];

    const updatedQuiz = {
      ...quiz,
      blocks: updatedBlocks,
      updatedAt: nowIso(),
    };

    quizzes[quizIndex] = updatedQuiz;

    return this.saveQuizzesToStorage(quizzes, "Block added successfully!");
  }

  deleteTemporaryBlock(blockId: string): boolean {
    const tempBlocks = this.getTemporaryBlocks();
    const updatedTempBlocks = tempBlocks.filter(
      (block) => block.id !== blockId,
    );
    this.saveTemporaryBlocks(updatedTempBlocks);

    toast.success("Block deleted successfully!");
    return true;
  }

  getTemporaryBlocksFromStorage(): QuizBlock[] {
    return this.getTemporaryBlocks();
  }

  clearTemporaryBlocks(): void {
    localStorage.removeItem("quizbuilder.tempBlocks");
  }

  initializeDefaultQuizzes(): void {
    const quizzes = this.getQuizzesFromStorage();

    if (quizzes.length > 0) return;

    const defaultQuizzes: Quiz[] = [
      {
        id: "default-1",
        title: "JavaScript Fundamentals Quiz",
        published: true,
        createdAt: nowIso(),
        updatedAt: nowIso(),
        publishedAt: nowIso(),
        blocks: [
          {
            id: "block-1",
            type: "heading",
            content: "JavaScript Fundamentals Quiz",
            properties: {},
          },
          {
            id: "block-2",
            type: "question",
            content:
              "What is the correct way to declare a variable in JavaScript?",
            properties: {
              questionType: "single",
              options: [
                "var name = 'John'",
                "variable name = 'John'",
                "v name = 'John'",
                "declare name = 'John'",
              ],
            },
          },
          {
            id: "block-3",
            type: "question",
            content: "Which of the following are JavaScript data types?",
            properties: {
              questionType: "multiple",
              options: [
                "String",
                "Number",
                "Boolean",
                "Array",
                "Object",
                "Function",
              ],
            },
          },
          {
            id: "block-4",
            type: "question",
            content: "What does 'this' keyword refer to in JavaScript?",
            properties: {
              questionType: "single",
              options: [
                "The current function",
                "The current object",
                "The parent object",
                "The global object",
              ],
            },
          },
          {
            id: "block-5",
            type: "button",
            content: "Submit Quiz",
            properties: {
              buttonText: "Submit Quiz",
              buttonType: "submit",
            },
          },
          {
            id: "block-6",
            type: "footer",
            content: "Thank you for taking the JavaScript Fundamentals Quiz!",
            properties: {},
          },
        ],
      },
      {
        id: "default-2",
        title: "React Knowledge Check",
        published: true,
        createdAt: nowIso(),
        updatedAt: nowIso(),
        publishedAt: nowIso(),
        blocks: [
          {
            id: "block-7",
            type: "heading",
            content: "React Knowledge Check",
            properties: {},
          },
          {
            id: "block-8",
            type: "question",
            content: "What is JSX in React?",
            properties: {
              questionType: "single",
              options: [
                "A JavaScript library",
                "A syntax extension for JavaScript",
                "A CSS framework",
                "A database query language",
              ],
            },
          },
          {
            id: "block-9",
            type: "question",
            content: "Which React hooks are used for state management?",
            properties: {
              questionType: "multiple",
              options: [
                "useState",
                "useEffect",
                "useContext",
                "useReducer",
                "useMemo",
                "useCallback",
              ],
            },
          },
          {
            id: "block-10",
            type: "question",
            content: "What is the purpose of the useEffect hook?",
            properties: {
              questionType: "single",
              options: [
                "To manage component state",
                "To perform side effects",
                "To create custom hooks",
                "To optimize rendering",
              ],
            },
          },
          {
            id: "block-11",
            type: "button",
            content: "Check Answers",
            properties: {
              buttonText: "Check Answers",
              buttonType: "submit",
            },
          },
          {
            id: "block-12",
            type: "footer",
            content: "Great job! Keep learning React!",
            properties: {},
          },
        ],
      },
      {
        id: "default-3",
        title: "General Knowledge Quiz",
        published: false,
        createdAt: nowIso(),
        updatedAt: nowIso(),
        blocks: [
          {
            id: "block-13",
            type: "heading",
            content: "General Knowledge Quiz",
            properties: {},
          },
          {
            id: "block-14",
            type: "question",
            content: "What is the capital of France?",
            properties: {
              questionType: "single",
              options: ["London", "Berlin", "Paris", "Madrid"],
            },
          },
          {
            id: "block-15",
            type: "question",
            content: "Which of the following are programming languages?",
            properties: {
              questionType: "multiple",
              options: ["Python", "HTML", "CSS", "JavaScript", "SQL", "JSON"],
            },
          },
          {
            id: "block-16",
            type: "question",
            content: "What year was the first iPhone released?",
            properties: {
              questionType: "single",
              options: ["2005", "2006", "2007", "2008"],
            },
          },
          {
            id: "block-17",
            type: "button",
            content: "Finish Quiz",
            properties: {
              buttonText: "Finish Quiz",
              buttonType: "submit",
            },
          },
          {
            id: "block-18",
            type: "footer",
            content: "Thanks for testing your general knowledge!",
            properties: {},
          },
        ],
      },
    ];

    this.saveQuizzesToStorage(defaultQuizzes, "Default quizzes initialized!");
  }
}

export const quizStorage = new QuizStorageService();
