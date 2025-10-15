import { useEffect, useState } from "react";
import type { Quiz } from "../types/quizType";
import { useNavigate } from "react-router";
import { quizStorage } from "../services/quizStorage";
import { Loading } from "./Loading/Loading";
import clsx from "clsx";
import { formatDate } from "../utils/fromatDate";

export const QuizList = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    quizStorage.initializeDefaultQuizzes();

    const allQuizzes = quizStorage.getAllQuizzes();
    setQuizzes(allQuizzes);
    setLoading(false);
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/quiz/edit/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/quiz/${id}`);
  };

  const handleCreateQuiz = () => {
    navigate("/quiz/edit/new");
  };

  const handleDeleteQuiz = (id: string) => {
    if (window.confirm("Are you sure you want to delete the quiz?")) {
      const success = quizStorage.deleteQuiz(id);

      if (success) {
        setQuizzes((prev) => prev.filter((quiz) => quiz.id !== id));
      }
    }
  };

  if (isLoading) {
    return <Loading text={"Loading quizzes..."} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-primary text-3xl font-bold">Quiz List</h1>

        <button
          onClick={handleCreateQuiz}
          className="p btn btn-primary cursor-pointer rounded-lg"
        >
          Create Quiz
        </button>
      </div>

      <div className="bg-surface text-primary overflow-hidden rounded-lg shadow-md">
        <div className="border-default border-b px-6 py-4">
          <h2 className="text-primary text-lg font-semibold">
            Available Quizzes
          </h2>
        </div>

        {quizzes.length === 0 ? (
          <div className="text-secondary px-6 py-8 text-center">
            <p>No quizzes available. Create your first quiz!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="hover:bg-background px-6 py-4 transition-colors duration-150"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center space-x-3">
                      <h3 className="text-primary text-lg font-medium">
                        {quiz.title}
                      </h3>
                      <span
                        className={clsx(
                          "badge",
                          quiz.published ? "badge-success" : "badge-warning",
                        )}
                      >
                        {quiz.published ? "Published" : "Not published yet"}
                      </span>
                    </div>
                    <p className="text-secondary text-sm">
                      Last updated: {formatDate(quiz.updatedAt)}
                    </p>
                    {quiz.published && quiz.publishedAt && (
                      <p className="text-secondary text-sm">
                        Published: {formatDate(quiz.publishedAt)}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleView(quiz.id)}
                      className="btn btn-success cursor-pointer rounded-md text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(quiz.id)}
                      className="btn btn-primary cursor-pointer rounded-md text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        handleDeleteQuiz(quiz.id);
                      }}
                      className="btn btn-danger cursor-pointer rounded-md text-sm"
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
