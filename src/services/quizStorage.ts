import toast from "react-hot-toast";
import type { Quiz } from "../types/quizType";

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

  getAllQuizzes(): Quiz[] {
    return this.getQuizzesFromStorage();
  }
}

export const quizStorage = new QuizStorageService();
