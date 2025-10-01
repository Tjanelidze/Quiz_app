import type { QuizBlock } from "../../../../../types/quizType";
import { DEFAULT_OPTIONS } from "../constant/quizConstants";
import { CloseIcon } from "../../../../../icons/icons";

interface QuestionPropertiesProps {
  block: QuizBlock;
  onUpdate: (blockId: string, updates: Partial<QuizBlock>) => void;
}

export const QuestionProperties = ({
  block,
  onUpdate,
}: QuestionPropertiesProps) => {
  if (block.type !== "question") return null;

  const questionType = block.properties.questionType || "single";
  const currentOptions =
    (block.properties.options as string[]) || DEFAULT_OPTIONS;

  return (
    <>
      <div>
        <label className="text-secondary mb-2 block text-sm font-medium">
          Question Type
        </label>
        <select
          value={questionType}
          onChange={(e) =>
            onUpdate(block.id, {
              properties: {
                ...block.properties,
                questionType: e.target.value,
              },
            })
          }
          className="border-default w-full cursor-pointer rounded-md border p-2 focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary-500)]"
        >
          <option value="single">Single Choice (Radio)</option>
          <option value="multi">Multiple Choice (Checkbox)</option>
          <option value="text">Text Input</option>
        </select>
      </div>

      {(questionType === "single" || questionType === "multi") && (
        <div>
          <label className="text-secondary mb-2 block text-sm font-medium">
            Options
          </label>
          <div className="space-y-2">
            {currentOptions.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [
                      ...(block.properties.options || DEFAULT_OPTIONS),
                    ];
                    newOptions[index] = e.target.value;
                    onUpdate(block.id, {
                      properties: {
                        ...block.properties,
                        options: newOptions,
                      },
                    });
                  }}
                  className="border-default flex-1 rounded-md border p-2 focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary-500)]"
                  placeholder={`Option ${index + 1}`}
                />
                <button
                  onClick={() => {
                    const newOptions = currentOptions.filter(
                      (_: string, i: number) => i !== index,
                    );
                    onUpdate(block.id, {
                      properties: {
                        ...block.properties,
                        options: newOptions,
                      },
                    });
                  }}
                  className="text-danger hover:text-danger-strong cursor-pointer p-1"
                  disabled={currentOptions.length <= 2}
                >
                  <CloseIcon
                    className="size-3"
                    stroke={"currentColor"}
                    strokeWidth={1.5}
                  />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newOptions = [
                  ...(block.properties.options || DEFAULT_OPTIONS),
                  `Option ${(block.properties.options || DEFAULT_OPTIONS).length + 1}`,
                ];
                onUpdate(block.id, {
                  properties: {
                    ...block.properties,
                    options: newOptions,
                  },
                });
              }}
              className="text-accent hover:text-accent-strong cursor-pointer text-sm"
            >
              + Add Option
            </button>
          </div>
        </div>
      )}
    </>
  );
};
