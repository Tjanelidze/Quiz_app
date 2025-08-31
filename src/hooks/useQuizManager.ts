import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import type { Quiz, QuizBlock } from "../types/quizType";
import { quizStorage } from "../services/quizStorage";

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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    // Reset selected block when quiz ID changes
    setSelectedBlockId(null);

    if (isNewQuiz) {
      // Load temporary blocks if they exist
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
        // Quiz not found, redirect to list
        navigate("/");
        return;
      }
    }
    setIsLoading(false);
  }, [id, isNewQuiz, navigate]);

  // Cleanup temporary blocks when leaving creation page
  useEffect(() => {
    return () => {
      if (isNewQuiz) {
        quizStorage.clearTemporaryBlocks();
      }
      // Reset selected block when component unmounts
      setSelectedBlockId(null);
    };
  }, [isNewQuiz]);

  const addBlock = useCallback(
    (type: string, insertBeforeId?: string) => {
      const newBlockId = `block_${Date.now()}`;
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
          newBlocks.splice(index, 0, newBlock);
        } else {
          newBlocks.push(newBlock);
        }
        return {
          ...prev,
          blocks: newBlocks,
          updatedAt: new Date().toISOString(),
        };
      });

      // Only save to storage for new quizzes (temporary storage)
      // For existing quizzes, blocks will be saved when user clicks save button
      if (isNewQuiz) {
        quizStorage.addBlock({ quizId: id!, newBlock });
      } else {
        // Show feedback for existing quizzes
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
        updatedAt: new Date().toISOString(),
      }));

      if (isNewQuiz) {
        // For new quiz, delete from temporary storage
        quizStorage.deleteTemporaryBlock(blockId);
      } else {
        // Show feedback for existing quizzes
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
        updatedAt: new Date().toISOString(),
      }));

      // Show feedback for block updates
      if (isNewQuiz) {
        // For new quiz, save to temporary storage and show toast
        quizStorage.saveTemporaryBlocks(quiz.blocks);
        toast.success("Block updated temporarily!");
      } else {
        // For existing quiz, show toast that changes will be saved when clicking save
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

        // Remove the dragged block
        const [draggedBlock] = newBlocks.splice(draggedIndex, 1);

        if (targetId === "end") {
          // Move to the end
          newBlocks.push(draggedBlock);
        } else {
          // Insert at specific position
          const targetIndex = newBlocks.findIndex((b) => b.id === targetId);
          if (targetIndex === -1) return prev;
          newBlocks.splice(targetIndex, 0, draggedBlock);
        }

        return {
          ...prev,
          blocks: newBlocks,
          updatedAt: new Date().toISOString(),
        };
      });

      // Update storage and show feedback
      if (isNewQuiz) {
        quizStorage.saveTemporaryBlocks(quiz.blocks);
        toast.success("Block reordered temporarily!");
      } else {
        toast.success("Block reordered! Click save to persist changes.");
      }
    },
    [quiz.blocks, isNewQuiz],
  );

  const updateTitle = useCallback(
    (title: string) => {
      setQuiz((prev) => ({
        ...prev,
        title,
        updatedAt: new Date().toISOString(),
      }));

      // Show feedback for title updates
      if (isNewQuiz) {
        toast.success("Title updated temporarily!");
      } else {
        toast.success("Title updated! Click save to persist changes.");
      }
    },
    [isNewQuiz],
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
