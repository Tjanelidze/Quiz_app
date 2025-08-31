import { memo } from "react";
import type { QuizBlock } from "../../../../types/quizType";

interface BlockCardProps {
  block: QuizBlock;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
}

export const BlockCard = memo(
  ({
    block,
    isSelected,
    onSelect,
    onDelete,
    draggable,
    onDragStart,
    onDragEnd,
    isDragging,
  }: BlockCardProps) => {
    return (
      <div
        key={block.id}
        draggable={draggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
          isSelected
            ? "border-blue-500 bg-blue-50"
            : isDragging
              ? "scale-95 border-gray-400 bg-gray-100 opacity-50"
              : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={() => onSelect(block.id)}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(block.id);
            }}
            className="cursor-pointer rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-600"
          >
            Delete
          </button>
        </div>
        <div className="text-gray-800">{block.content}</div>
      </div>
    );
  },
);
