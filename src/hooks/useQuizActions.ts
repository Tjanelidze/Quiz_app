import { useCallback } from "react";
import { useNavigate } from "react-router";
import { quizStorage } from "../services/quizStorage";
import type { Quiz } from "../types/quizType";

export const useQuizActions = (
  quiz: Quiz,
  isNewQuiz: boolean,
  setQuiz: (quiz: Quiz | ((prev: Quiz) => Quiz)) => void,
  navigate: ReturnType<typeof useNavigate>,
) => {
  const handleSave = useCallback(() => {
    try {
      const success = quizStorage.saveQuiz(quiz);

      if (success) {
        // Clear temporary blocks after successful save
        if (isNewQuiz) {
          quizStorage.clearTemporaryBlocks();
          // Navigate back to main page after saving new quiz
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Failed to save quiz:", error);
    }
  }, [quiz, isNewQuiz, navigate]);

  const handlePublish = useCallback(async () => {
    try {
      let quizId = quiz.id;

      // First save the quiz if it hasn't been saved yet
      if (quiz.id === "new") {
        const saveSuccess = quizStorage.saveQuiz(quiz);
        if (!saveSuccess) {
          return;
        }

        const savedQuizzes = quizStorage.getAllQuizzes();
        const savedQuiz = savedQuizzes[savedQuizzes.length - 1];
        quizId = savedQuiz.id;
        setQuiz(savedQuiz);
        // Navigate back to main page after saving and publishing new quiz
        navigate("/");
        return;
      }

      const success = quizStorage.publishQuiz(quizId);
      if (success) {
        setQuiz((prev) => ({
          ...prev,
          published: true,
          updatedAt: new Date().toISOString(),
          publishedAt: new Date().toISOString(),
        }));
      }
    } catch (error) {
      console.error("Failed to publish quiz:", error);
    }
  }, [quiz, setQuiz, navigate]);

  const handleUnpublish = useCallback(async () => {
    try {
      const success = quizStorage.unpublishQuiz(quiz.id);
      if (success) {
        setQuiz((prev) => ({
          ...prev,
          published: false,
          updatedAt: new Date().toISOString(),
          publishedAt: undefined,
        }));
      }
    } catch (error) {
      console.error("Failed to unpublish quiz:", error);
    }
  }, [quiz.id, setQuiz]);

  return {
    handleSave,
    handlePublish,
    handleUnpublish,
  };
};
