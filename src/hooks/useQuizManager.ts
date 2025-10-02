import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import type { Quiz, QuizBlock } from "../types/quizType";
import { quizStorage } from "../services/quizStorage";
import { nowIso } from "../utils/datetime";
import { useDebounce } from "./useDebounce";

export const useQuizManager = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewQuiz = id === "new";

  const [isLoading, setIsLoading] = useState(true);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<Quiz>({
    id: "new",
    title: "Untitled Quiz",
    blocks: [],
    published: false,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  });

  useEffect(() => {
    setSelectedBlockId(null);

    if (isNewQuiz) {
      const tempBlocks = quizStorage.getTemporaryBlocksFromStorage();
      if (tempBlocks.length > 0) {
        setQuiz((prev) => ({
          ...prev,
          blocks: tempBlocks,
        }));
      }
      setIsLoading(false);
    } else {
      const existingQuiz = quizStorage.getQuizById(id!);

      if (existingQuiz) {
        setQuiz(existingQuiz);
      } else {
        navigate("/");
        return;
      }
    }
    setIsLoading(false);
  }, [id, isNewQuiz, navigate]);

  useEffect(() => {
    return () => {
      if (isNewQuiz) {
        quizStorage.clearTemporaryBlocks();
      }
      setSelectedBlockId(null);
    };
  }, [isNewQuiz]);

  const addBlock = useCallback(
    (type: string, insertBeforeId?: string) => {
      const newBlockId = `block_${crypto.randomUUID()}`;
      const newBlock: QuizBlock = {
        id: newBlockId,
        type: type as QuizBlock["type"],
        content: `New ${type}`,
        properties:
          type === "question"
            ? { questionType: "single", options: ["Option 1", "Option 2"] }
            : {},
      };

      setQuiz((prev) => {
        const newBlocks = [...prev.blocks];
        if (insertBeforeId) {
          const index = newBlocks.findIndex((b) => b.id === insertBeforeId);
          newBlocks.splice(index + 1, 0, newBlock);
        } else {
          newBlocks.push(newBlock);
        }
        return {
          ...prev,
          blocks: newBlocks,
          updatedAt: nowIso(),
        };
      });

      if (isNewQuiz) {
        quizStorage.addBlock({ quizId: id!, newBlock });
      } else {
        toast.success("Block added! Click save to persist changes.");
      }
    },
    [id, isNewQuiz],
  );

  const deleteBlock = useCallback(
    (blockId: string) => {
      setQuiz((prev) => ({
        ...prev,
        blocks: prev.blocks.filter((b) => b.id !== blockId),
        updatedAt: nowIso(),
      }));

      if (isNewQuiz) {
        quizStorage.deleteTemporaryBlock(blockId);
      } else {
        toast.success("Block deleted! Click save to persist changes.");
      }

      if (selectedBlockId === blockId) {
        setSelectedBlockId(null);
      }
    },
    [selectedBlockId, isNewQuiz],
  );

  const updateBlock = useCallback(
    (blockId: string, updates: Partial<QuizBlock>) => {
      setQuiz((prev) => ({
        ...prev,
        blocks: prev.blocks.map((b) =>
          b.id === blockId ? { ...b, ...updates } : b,
        ),
        updatedAt: nowIso(),
      }));

      if (isNewQuiz) {
        quizStorage.saveTemporaryBlocks(quiz.blocks);
        toast.success("Block updated temporarily!");
      } else {
        toast.success("Block updated! Click save to persist changes.");
      }
    },
    [isNewQuiz, quiz.blocks],
  );

  const reorderBlock = useCallback(
    (draggedId: string, targetId: string) => {
      if (draggedId === targetId) return;

      setQuiz((prev) => {
        const newBlocks = [...prev.blocks];
        const draggedIndex = newBlocks.findIndex((b) => b.id === draggedId);

        if (draggedIndex === -1) return prev;

        const [draggedBlock] = newBlocks.splice(draggedIndex, 1);

        if (targetId === "end") {
          newBlocks.push(draggedBlock);
        } else {
          const targetIndex = newBlocks.findIndex((b) => b.id === targetId);
          if (targetIndex === -1) return prev;
          newBlocks.splice(targetIndex + 1, 0, draggedBlock);
        }

        return {
          ...prev,
          blocks: newBlocks,
          updatedAt: nowIso(),
        };
      });

      if (isNewQuiz) {
        quizStorage.saveTemporaryBlocks(quiz.blocks);
        toast.success("Block reordered temporarily!");
      } else {
        toast.success("Block reordered! Click save to persist changes.");
      }
    },
    [quiz.blocks, isNewQuiz],
  );

  const updateTitleImmediate = useCallback((title: string) => {
    setQuiz((prev) => ({
      ...prev,
      title,
      updatedAt: nowIso(),
    }));
  }, []);

  const showTitleUpdateToast = useCallback(() => {
    if (isNewQuiz) {
      toast.success("Title updated temporarily!");
    } else {
      toast.success("Title updated! Click save to persist changes.");
    }
  }, [isNewQuiz]);

  const debouncedShowToast = useDebounce(showTitleUpdateToast, 500);

  const updateTitle = useCallback(
    (title: string) => {
      updateTitleImmediate(title);
      debouncedShowToast();
    },
    [updateTitleImmediate, debouncedShowToast],
  );

  const selectBlock = useCallback((id: string) => {
    setSelectedBlockId(id);
  }, []);

  const resetToSavedState = useCallback(() => {
    if (!isNewQuiz && id) {
      const savedQuiz = quizStorage.getQuizById(id);
      if (savedQuiz) {
        setQuiz(savedQuiz);
        setSelectedBlockId(null);
      }
    }
  }, [isNewQuiz, id]);

  const selectedBlock = quiz.blocks.find((b) => b.id === selectedBlockId);

  return {
    // State
    quiz,
    isLoading,
    selectedBlock,
    isNewQuiz,

    // Actions
    addBlock,
    deleteBlock,
    updateBlock,
    reorderBlock,
    updateTitle,
    selectBlock,
    resetToSavedState,

    // Setters
    setQuiz,
  };
};
