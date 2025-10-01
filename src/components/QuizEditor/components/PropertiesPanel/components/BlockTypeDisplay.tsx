import type { QuizBlock } from "../../../../../types/quizType";

interface BlockTypeDisplayProps {
  block: QuizBlock;
}

export const BlockTypeDisplay = ({ block }: BlockTypeDisplayProps) => {
  return (
    <div>
      <label className="text-secondary mb-2 block text-sm font-medium">
        Block Type
      </label>
      <div className="bg-background text-secondary rounded p-2 text-sm">
        {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
      </div>
    </div>
  );
};
