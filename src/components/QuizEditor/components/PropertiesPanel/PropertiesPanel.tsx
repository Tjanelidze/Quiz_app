import { useEffect, useState } from "react";
import type { QuizBlock } from "../../../../types/quizType";
import { useDebounce } from "../../../../hooks/useDebounce";
import { DEFAULT_OPTIONS } from "./constant/quizConstants";
import { CloseIcon } from "../../../../icons/icons";

interface PropertiesPanelProps {
  selectedBlock: QuizBlock | null;
  onUpdate: (blockId: string, updates: Partial<QuizBlock>) => void;
}

export const PropertiesPanel = ({
  selectedBlock,
  onUpdate,
}: PropertiesPanelProps) => {
  const [localContent, setLocalContent] = useState("");

  const debouncedUpdate = useDebounce((...args: unknown[]) => {
    const [blockId, updates] = args as [string, Partial<QuizBlock>];
    onUpdate(blockId, updates);
  }, 500);

  useEffect(() => {
    if (selectedBlock) {
      setLocalContent(selectedBlock.content);
    }
  }, [selectedBlock]);

  if (!selectedBlock) {
    return (
      <div className="w-80 border-l border-gray-200 bg-white p-4">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Properties</h3>
        <div className="py-8 text-center text-gray-500">
          <p>Select a block to edit its properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-gray-200 bg-white p-4">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Properties</h3>

      <div className="space-y-4">
        <div>
          <label
            htmlFor=""
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Content
          </label>
          <textarea
            value={localContent}
            onChange={(e) => {
              setLocalContent(e.target.value);
              debouncedUpdate(selectedBlock.id, { content: e.target.value });
            }}
            className="w-full rounded-md border border-gray-300 p-2 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Block Type
          </label>
          <div className="rounded bg-gray-50 p-2 text-sm text-gray-600">
            {selectedBlock.type.charAt(0).toUpperCase() +
              selectedBlock.type.slice(1)}
          </div>
        </div>

        {/* Additional properties based on block type */}

        {selectedBlock.type === "question" && (
          <>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Question Type
              </label>
              <select
                value={selectedBlock.properties.questionType || "single"}
                onChange={(e) =>
                  onUpdate(selectedBlock.id, {
                    properties: {
                      ...selectedBlock.properties,
                      questionType: e.target.value,
                    },
                  })
                }
                className="w-full cursor-pointer rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                <option value="single">Single Choice (Radio)</option>
                <option value="multi">Multiple Choice (Checkbox)</option>
                <option value="text">Text Input</option>
              </select>
            </div>

            {(selectedBlock.properties.questionType === "single" ||
              selectedBlock.properties.questionType === "multi") && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Options
                </label>
                <div className="space-y-2">
                  {(
                    (selectedBlock.properties.options as string[]) ||
                    DEFAULT_OPTIONS
                  ).map((option: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [
                            ...(selectedBlock.properties.options ||
                              DEFAULT_OPTIONS),
                          ];
                          newOptions[index] = e.target.value;
                          onUpdate(selectedBlock.id, {
                            properties: {
                              ...selectedBlock.properties,
                              options: newOptions,
                            },
                          });
                        }}
                        className="flex-1 rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        placeholder={`Option ${index + 1}`}
                      />
                      <button
                        onClick={() => {
                          const newOptions = (
                            (selectedBlock.properties.options as string[]) ||
                            DEFAULT_OPTIONS
                          ).filter((_: string, i: number) => i !== index);
                          onUpdate(selectedBlock.id, {
                            properties: {
                              ...selectedBlock.properties,
                              options: newOptions,
                            },
                          });
                        }}
                        className="cursor-pointer p-1 text-red-600 hover:text-red-800"
                        disabled={
                          (selectedBlock.properties.options || DEFAULT_OPTIONS)
                            .length <= 2
                        }
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
                        ...(selectedBlock.properties.options ||
                          DEFAULT_OPTIONS),
                        `Option ${(selectedBlock.properties.options || DEFAULT_OPTIONS).length + 1}`,
                      ];
                      onUpdate(selectedBlock.id, {
                        properties: {
                          ...selectedBlock.properties,
                          options: newOptions,
                        },
                      });
                    }}
                    className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Option
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {selectedBlock.type === "button" && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Button Style
            </label>
            <select
              value={selectedBlock.properties.buttonStyle || "primary"}
              onChange={(e) =>
                onUpdate(selectedBlock.id, {
                  properties: {
                    ...selectedBlock.properties,
                    buttonStyle: e.target.value,
                  },
                })
              }
              className="w-full cursor-pointer rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="primary">Next</option>
              <option value="primary">Submit</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
