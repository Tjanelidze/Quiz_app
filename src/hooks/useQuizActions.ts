import { useCallback } from "react";
import { useNavigate } from "react-router";
import { quizStorage } from "../services/quizStorage";
import type { Quiz } from "../types/quizType";
import {
  publishQuiz as publishQuizUtil,
  unpublishQuiz as unpublishQuizUtil,
} from "../utils/quiz";

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
        if (isNewQuiz) {
          quizStorage.clearTemporaryBlocks();
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Failed to save quiz:", error);
    }
  }, [quiz, isNewQuiz, navigate]);

  const handlePublish = useCallback(() => {
    try {
      let quizId = quiz.id;

      if (quiz.id === "new") {
        const saveSuccess = quizStorage.saveQuiz(quiz);
        if (!saveSuccess) {
          return;
        }

        const savedQuizzes = quizStorage.getAllQuizzes();
        const savedQuiz = savedQuizzes[savedQuizzes.length - 1];
        quizId = savedQuiz.id;
        setQuiz(savedQuiz);
        navigate("/");
        return;
      }

      const success = quizStorage.publishQuiz(quizId);
      if (success) {
        setQuiz((prev) => publishQuizUtil(prev));
      }
    } catch (error) {
      console.error("Failed to publish quiz:", error);
    }
  }, [quiz, setQuiz, navigate]);

  const handleUnpublish = useCallback(() => {
    try {
      const success = quizStorage.unpublishQuiz(quiz.id);
      if (success) {
        setQuiz((prev) => unpublishQuizUtil(prev));
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
