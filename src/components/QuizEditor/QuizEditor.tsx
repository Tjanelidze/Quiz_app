import { useNavigate } from "react-router";
import { Header } from "./components/Header/Header";
import { BuildingBlocksSidebar } from "./components/BuildingBlocksSidebar/BuildingBlocksSidebar";
import { QuizCanvas } from "./components/QuizCanvas/QuizCanvas";
import { PropertiesPanel } from "./components/PropertiesPanel/PropertiesPanel";
import { useQuizManager } from "../../hooks/useQuizManager";
import { useQuizActions } from "../../hooks/useQuizActions";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";

const buildingBlocks = [
  { type: "heading", label: "Heading", icon: "📝" },
  { type: "question", label: "Question", icon: "❓" },
  { type: "button", label: "Button", icon: "🔘" },
  { type: "footer", label: "Footer", icon: "📄" },
];

export const QuizEditor = () => {
  const navigate = useNavigate();

  // Use custom hooks for different concerns
  const {
    quiz,
    isLoading,
    selectedBlock,
    isNewQuiz,
    addBlock,
    deleteBlock,
    updateBlock,
    reorderBlock,
    updateTitle,
    selectBlock,
    setQuiz,
  } = useQuizManager();

  // Get drag and drop handlers and state
  const {
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleBlockDragStart,
    handleBlockDragEnd,
    handleBlockDragOver,
    handleBlockDragLeave,
    handleBlockDrop,
    getDragState,
  } = useDragAndDrop(addBlock, reorderBlock);

  const { handleSave, handlePublish, handleUnpublish } = useQuizActions(
    quiz,
    isNewQuiz,
    setQuiz,
    navigate,
  );

  const handleBack = () => {
    navigate("/");
  };

  const { isDragOver, dragOverBlockId, draggedBlockId } = getDragState();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <Header
        title={quiz.title}
        isPublished={quiz.published}
        onBack={handleBack}
        onTitleChange={updateTitle}
        onSave={handleSave}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
      />

      {/* Main Content */}
      <div className="flex flex-1">
        <BuildingBlocksSidebar
          buildingBlocks={buildingBlocks}
          onDragStart={handleDragStart}
          onBlockClick={addBlock}
        />

        <QuizCanvas
          blocks={quiz.blocks}
          selectedBlockId={selectedBlock?.id || null}
          onSelect={selectBlock}
          onDelete={deleteBlock}
          onAddBlock={addBlock}
          onReorderBlock={reorderBlock}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onBlockDragStart={handleBlockDragStart}
          onBlockDragEnd={handleBlockDragEnd}
          onBlockDragOver={handleBlockDragOver}
          onBlockDragLeave={handleBlockDragLeave}
          onBlockDrop={handleBlockDrop}
          isDragOver={isDragOver}
          dragOverBlockId={dragOverBlockId}
          draggedBlockId={draggedBlockId}
        />

        <PropertiesPanel
          selectedBlock={selectedBlock || null}
          onUpdate={updateBlock}
        />
      </div>
    </div>
  );
};
