import type { QuizBlock } from "../../../../types/quizType";
import { ContentEditor } from "./components/ContentEditor";
import { BlockTypeDisplay } from "./components/BlockTypeDisplay";
import { QuestionProperties } from "./components/QuestionProperties";
import { ButtonProperties } from "./components/ButtonProperties";

interface PropertiesPanelProps {
  selectedBlock: QuizBlock | null;
  onUpdate: (blockId: string, updates: Partial<QuizBlock>) => void;
}

export const PropertiesPanel = ({
  selectedBlock,
  onUpdate,
}: PropertiesPanelProps) => {
  if (!selectedBlock) {
    return (
      <div className="border-default bg-surface text-primary w-80 border-l p-4">
        <h3 className="text-primary mb-4 text-lg font-semibold">Properties</h3>
        <div className="text-secondary py-8 text-center">
          <p>Select a block to edit its properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-default bg-surface text-primary w-80 border-l p-4">
      <h3 className="text-primary mb-4 text-lg font-semibold">Properties</h3>

      <div className="space-y-4">
        <ContentEditor block={selectedBlock} onUpdate={onUpdate} />
        <BlockTypeDisplay block={selectedBlock} />
        <QuestionProperties block={selectedBlock} onUpdate={onUpdate} />
        <ButtonProperties block={selectedBlock} onUpdate={onUpdate} />
      </div>
    </div>
  );
};
