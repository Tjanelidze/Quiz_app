import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { Quiz } from "../types/quizType";

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
      setIsLoading(false);
    }
    setIsLoading(false);
  }, []);

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
              value={quiz.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="rounded border-none bg-transparent px-2 py-1 text-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quiz title..."
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => {
                // TODO: SAVE BUTTON
              }}
              className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => {
                // TODO: PUBLISH BUTTON
              }}
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
                onClick={() => {
                  // TODO: HANDLE ADDING BLOCK ON CLICK
                }}
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
            className="border2 rounded-2 min-h-full border-dashed border-gray-300 bg-white p-6"
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
                    onClick={() => {
                      // TODO: ADD NEW BLOCK
                    }}
                    className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                  >
                    + Add First Block
                  </button>
                </div>
              </div>
            ) : (
              <>{/* TODO: EXISTING QUIZ STYLE */}</>
            )}
          </div>
        </div>

        {/* Right Sidebar - Properties Panel */}
        <div className="w-80 border-l border-gray-200 bg-white p-4">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Properties
          </h3>
          {/* TODO: SELECTED BLOCK */}
        </div>
      </div>
    </div>
  );
};
