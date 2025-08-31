import type { QuizBlock } from "../../../../types/quizType";
import { BlockCard } from "../BlockCard/BlockCard";

interface QuizCanvasProps {
  blocks: QuizBlock[];
  selectedBlockId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onAddBlock: (type: string, insertBeforeId?: string) => void;
  onReorderBlock: (draggedId: string, targetId: string) => void;
  // Drag and drop handlers from parent
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onBlockDragStart: (e: React.DragEvent, blockId: string) => void;
  onBlockDragEnd: () => void;
  onBlockDragOver: (e: React.DragEvent, blockId: string) => void;
  onBlockDragLeave: (e: React.DragEvent) => void;
  onBlockDrop: (e: React.DragEvent, targetId: string) => void;
  // Drag state from parent
  isDragOver: boolean;
  dragOverBlockId: string | null;
  draggedBlockId: string | null;
}

export const QuizCanvas = ({
  blocks,
  selectedBlockId,
  onSelect,
  onDelete,
  onAddBlock,
  onDragOver,
  onDragLeave,
  onDrop,
  onBlockDragStart,
  onBlockDragEnd,
  onBlockDragOver,
  onBlockDragLeave,
  onBlockDrop,
  isDragOver,
  dragOverBlockId,
  draggedBlockId,
}: QuizCanvasProps) => {
  return (
    <div className="flex-1 p-6">
      <div
        className={`min-h-full rounded-lg border-2 border-dashed transition-colors ${
          isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-white"
        } p-6`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {blocks.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <p className="text-lg">
              Drag building blocks here to start building your quiz
            </p>
            <p className="mt-2 text-sm">
              or click on building blocks in the left sidebar to add them
            </p>
            <div className="mt-4">
              <button
                onClick={() => onAddBlock("heading")}
                className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
              >
                + Add First Block
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {blocks.map((block, index) => (
              <div key={block.id}>
                {/* Drop zone above block for reordering */}
                <div
                  className={`h-3 transition-all duration-200 ease-in-out ${
                    dragOverBlockId === block.id && draggedBlockId
                      ? "scale-y-110 bg-green-300"
                      : dragOverBlockId === block.id && !draggedBlockId
                        ? "scale-y-110 bg-blue-200"
                        : "bg-transparent"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.dataTransfer.dropEffect = draggedBlockId
                      ? "move"
                      : "copy";
                    onBlockDragOver(e, block.id);
                  }}
                  onDragLeave={onBlockDragLeave}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Always use onBlockDrop for block-specific drop zones
                    onBlockDrop(e, block.id);
                  }}
                />

                <BlockCard
                  block={block}
                  isSelected={selectedBlockId === block.id}
                  onSelect={onSelect}
                  onDelete={onDelete}
                  draggable={true}
                  onDragStart={(e: React.DragEvent) =>
                    onBlockDragStart(e, block.id)
                  }
                  onDragEnd={onBlockDragEnd}
                  isDragging={draggedBlockId === block.id}
                />

                {/* Drop zone below last block */}
                {index === blocks.length - 1 && (
                  <div
                    className={`h-3 transition-all duration-200 ease-in-out ${
                      dragOverBlockId === "end"
                        ? "scale-y-110 bg-blue-200"
                        : "bg-transparent"
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.dataTransfer.dropEffect = draggedBlockId
                        ? "move"
                        : "copy";
                      if (dragOverBlockId !== "end") {
                        onBlockDragOver(e, "end");
                      }
                    }}
                    onDragLeave={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        onBlockDragLeave(e);
                      }
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Always use onBlockDrop for the end drop zone
                      onBlockDrop(e, "end");
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
