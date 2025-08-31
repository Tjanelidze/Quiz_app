import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { Quiz } from "../types/quizType";

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
        </div>
      </div>
    </div>
  );
};
