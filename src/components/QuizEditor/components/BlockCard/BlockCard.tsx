import { memo } from "react";
import type { QuizBlock } from "../../../../types/quizType";
import clsx from "clsx";

interface BlockCardProps {
  block: QuizBlock;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;

  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  isDropTarget?: boolean;
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
    onDragOver,
    onDragLeave,
    onDrop,
    isDropTarget,
  }: BlockCardProps) => {
    return (
      <div
        key={block.id}
        draggable={draggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={clsx(
          "cursor-pointer rounded-lg border-2 p-4 transition-all duration-200",
          {
            "border-accent bg-accent-subtle":
              isSelected || (isDropTarget && !isDragging),
            "border-default bg-background scale-95 opacity-50":
              !isSelected && isDragging,
            "border-default hover:border-default":
              !isSelected && !isDragging && !isDropTarget,
          },
        )}
        onClick={() => onSelect(block.id)}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-secondary text-sm font-medium">
            {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(block.id);
            }}
            className="btn btn-danger cursor-pointer rounded-md text-sm"
          >
            Delete
          </button>
        </div>
        <div className="text-primary">{block.content}</div>
      </div>
    );
  },
);
