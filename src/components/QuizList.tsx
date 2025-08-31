import { useEffect, useState } from "react";
import type { Quiz } from "../types/quizType";
import { useNavigate } from "react-router";
import { quizStorage } from "../services/quizStorage";

export const QuizList = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize storage and load quizzes
    quizStorage.initialize();
    const allQuizzes = quizStorage.getAllQuizzes();
    setQuizzes(allQuizzes);
    setLoading(false);
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/quiz/edit/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/quiz/view/${id}`);
  };

  const handleCreateQuiz = () => {
    navigate("/quiz/edit/new");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Quiz List</h1>

        <button
          onClick={handleCreateQuiz}
          className="p cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
        >
          Create Quiz
        </button>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Available Quizzes
          </h2>
        </div>

        {quizzes.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            <p>No quizzes available. Create your first quiz!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="px-6 py-4 transition-colors duration-150 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {quiz.title}
                      </h3>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          quiz.published
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {quiz.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Last updated: {formatDate(quiz.updatedAt)}
                    </p>
                    {quiz.published && quiz.publishedAt && (
                      <p className="text-sm text-gray-500">
                        Published: {formatDate(quiz.publishedAt)}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleView(quiz.id)}
                      className="cursor-pointer rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-green-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(quiz.id)}
                      className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        // TODO: HANDLE DELETE
                      }}
                      className="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
