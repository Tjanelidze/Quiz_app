import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { Quiz, QuizBlock } from "../../types/quizType";
import { quizStorage } from "../../services/quizStorage";
import { BlockCard } from "./BlockCard/BlockCard";

const buildingBlocks = [
  { type: "heading", label: "Heading", icon: "📝" },
  { type: "question", label: "Question", icon: "❓" },
  { type: "button", label: "Button", icon: "🔘" },
  { type: "footer", label: "Footer", icon: "📄" },
];

export const QuizEditor = () => {
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
  }, []);

  // Cleanup temporary blocks when leaving creation page
  useEffect(() => {
    return () => {
      if (isNewQuiz) {
        quizStorage.clearTemporaryBlocks();
      }
    };
  }, [isNewQuiz]);

  const handleBack = () => {
    navigate("/");
  };

  const handleTitleChange = (title: string) => {
    setQuiz((prev) => ({
      ...prev,
      title,
      updatedAt: new Date().toISOString(),
    }));
  };

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

      // Save block to storage (temporary for new quiz, permanent for existing)
      quizStorage.addBlock({ quizId: id!, newBlock });
    },
    [id],
  );

  const handleSave = () => {
    try {
      const success = quizStorage.saveQuiz(quiz);

      if (success) {
        // Update the quiz with the new ID if it was a new quiz
        if (isNewQuiz && quiz.id === "new") {
          const savedQuiz = quizStorage.getQuizById(quiz.id);
          if (savedQuiz) {
            setQuiz(savedQuiz);
            navigate(`/quiz/edit/${savedQuiz.id}`, { replace: true });
          }
        }

        // Clear temporary blocks after successful save
        if (isNewQuiz) {
          quizStorage.clearTemporaryBlocks();
        }
      }
    } catch (error) {
      console.error("Failed to save quiz:", error);
    }
  };

  const handleDelete = useCallback(
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
        // For existing quiz, delete from permanent storage
        quizStorage.deleteBlock({ quizId: id!, blockId });
      }

      if (selectedBlockId === blockId) {
        setSelectedBlockId(null);
      }
    },
    [selectedBlockId, isNewQuiz, id],
  );

  const handleUpdate = useCallback(
    (blockId: string, updates: Partial<QuizBlock>) => {
      setQuiz((prev) => ({
        ...prev,
        blocks: prev.blocks.map((b) =>
          b.id === blockId ? { ...b, ...updates } : b,
        ),
        updatedAt: new Date().toISOString(),
      }));
    },
    [],
  );

  const handlePublish = async () => {
    try {
      let quizId = quiz.id;

      // First save the quiz if it hasn't been saved yet
      if (quiz.id === "new") {
        const saveSuccess = quizStorage.saveQuiz(quiz);
        if (!saveSuccess) {
          return;
        }

        const savedQuizzes = quizStorage.getAllQuizzes();
        const savedQuiz = savedQuizzes[savedQuizzes.length - 1];
        quizId = savedQuiz.id;
        setQuiz(savedQuiz);
        navigate(`/quiz/edit/${savedQuiz.id}`, { replace: true });
      }

      const success = quizStorage.publishQuiz(quizId);
      if (success) {
        setQuiz((prev) => ({
          ...prev,
          published: true,
          updatedAt: new Date().toISOString(),
          publishedAt: new Date().toISOString(),
        }));
      }
    } catch (error) {
      console.error("Failed to publish quiz:", error);
    }
  };

  const handleUnpublish = async () => {
    try {
      const success = quizStorage.unpublishQuiz(quiz.id);
      if (success) {
        setQuiz((prev) => ({
          ...prev,
          published: false,
          updatedAt: new Date().toISOString(),
          publishedAt: undefined,
        }));
      }
    } catch (error) {
      console.error("Failed to unpublish quiz:", error);
    }
  };

  const handleSelect = useCallback((id: string) => {
    setSelectedBlockId(id);
  }, []);

  const selectedBlock = quiz.blocks.find((b) => b.id === selectedBlockId);

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
      {/* HEADER */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex cursor-pointer items-center space-x-1 text-gray-600 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>

              <span>Back</span>
            </button>
            <input
              type="text"
              name="title"
              value={quiz.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="rounded border-none bg-transparent px-2 py-1 text-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quiz title..."
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={quiz.published ? handleUnpublish : handlePublish}
              className={`cursor-pointer rounded-lg px-4 py-2 font-medium ${
                quiz.published
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {quiz.published ? "Unpublish" : "Publish"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Sidebar - Building Blocks */}
        <div className="w-64 border-r border-gray-200 bg-white p-4">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Building Blocks
          </h3>

          <div className="space-y-2">
            {buildingBlocks.map((block) => (
              <div
                key={block.type}
                draggable
                onDragStart={() => {
                  // TODO: HANDLE DRAGING
                }}
                onClick={() => addBlock(block.type)}
                className="flex cursor-pointer items-center space-x-3 rounded-lg border border-gray-200 bg-gray-50 p-3 hover:bg-gray-100"
              >
                <span className="text-xl">{block.icon}</span>
                <span className="font-medium text-gray-700">{block.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center Canvas */}
        <div className="flex-1 p-6">
          <div
            className="min-h-full rounded-lg border-2 border-dashed border-gray-300 bg-white p-6"
            onDragOver={() => {
              // TODO: IMPLEMENT ON DRAG OVER
            }}
            onDrop={() => {
              // TODO: IMPLEMENT ON DROP
            }}
          >
            {quiz.blocks.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <p className="text-lg">
                  Drag building blocks here to start building your quiz
                </p>
                <p className="mt-2 text-sm">
                  or click on building blocks in the left sidebar to add them
                </p>
                <div className="mt-4">
                  <button
                    onClick={() => addBlock("heading")}
                    className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                  >
                    + Add First Block
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {quiz.blocks.map((block) => (
                  <BlockCard
                    key={block.id}
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    onSelect={handleSelect}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Properties Panel */}
        <div className="w-80 border-l border-gray-200 bg-white p-4">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Properties
          </h3>

          {selectedBlock ? (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor=""
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Content
                </label>
                <textarea
                  value={selectedBlock.content}
                  onChange={(e) => {
                    handleUpdate(selectedBlock.id, { content: e.target.value });
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
                        handleUpdate(selectedBlock.id, {
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
                          (selectedBlock.properties.options as string[]) || [
                            "Option 1",
                            "Option 2",
                          ]
                        ).map((option: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [
                                  ...(selectedBlock.properties.options || [
                                    "Option 1",
                                    "Option 2",
                                  ]),
                                ];
                                newOptions[index] = e.target.value;
                                handleUpdate(selectedBlock.id, {
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
                                  (selectedBlock.properties
                                    .options as string[]) || [
                                    "Option 1",
                                    "Option 2",
                                  ]
                                ).filter((_: string, i: number) => i !== index);
                                handleUpdate(selectedBlock.id, {
                                  properties: {
                                    ...selectedBlock.properties,
                                    options: newOptions,
                                  },
                                });
                              }}
                              className="cursor-pointer p-1 text-red-600 hover:text-red-800"
                              disabled={
                                (
                                  selectedBlock.properties.options || [
                                    "Option 1",
                                    "Option 2",
                                  ]
                                ).length <= 2
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-3"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18 18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newOptions = [
                              ...(selectedBlock.properties.options || [
                                "Option 1",
                                "Option 2",
                              ]),
                              `Option ${(selectedBlock.properties.options || ["Option 1", "Option 2"]).length + 1}`,
                            ];
                            handleUpdate(selectedBlock.id, {
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
                      handleUpdate(selectedBlock.id, {
                        properties: {
                          ...selectedBlock.properties,
                          buttonStyle: e.target.value,
                        },
                      })
                    }
                    className="w-full cursor-pointer rounded-md border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="success">Success</option>
                    <option value="danger">Danger</option>
                  </select>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p>Select a block to edit its properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
