import { useEffect, useState } from "react";
import type { QuizBlock } from "../../../../../types/quizType";
import { useDebounce } from "../../../../../hooks/useDebounce";

interface ContentEditorProps {
  block: QuizBlock;
  onUpdate: (blockId: string, updates: Partial<QuizBlock>) => void;
}

export const ContentEditor = ({ block, onUpdate }: ContentEditorProps) => {
  const [localContent, setLocalContent] = useState("");

  const debouncedUpdate = useDebounce((...args: unknown[]) => {
    const [blockId, updates] = args as [string, Partial<QuizBlock>];
    onUpdate(blockId, updates);
  }, 500);

  useEffect(() => {
    setLocalContent(block.content);
  }, [block]);

  return (
    <div>
      <label
        htmlFor=""
        className="text-secondary mb-2 block text-sm font-medium"
      >
        Content
      </label>
      <textarea
        value={localContent}
        onChange={(e) => {
          setLocalContent(e.target.value);
          debouncedUpdate(block.id, { content: e.target.value });
        }}
        className="border-default w-full rounded-md border p-2 outline-none focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary-500)]"
        rows={3}
      />
    </div>
  );
};
