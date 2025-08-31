import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizStorage } from "../../services/quizStorage";
import type { Quiz, QuizBlock } from "../../types/quizType";

const QuizView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const foundQuiz = quizStorage.getQuizById(id!);
        setQuiz(foundQuiz);
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleBack = () => {
    navigate("/");
  };

  const handleAnswerChange = (blockId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [blockId]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < quiz!.blocks.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSubmit = () => {
    alert("Quiz submitted successfully!");
  };

  const renderBlock = (block: QuizBlock) => {
    switch (block.type) {
      case "heading":
        return (
          <div key={block.id} className="mb-6">
            <h2 className="text-center text-2xl font-bold text-gray-900">
              {block.content}
            </h2>
          </div>
        );

      case "question":
        const questionType = block.properties.questionType || "single";
        const options = block.properties.options;

        if (questionType === "single") {
          return (
            <div
              key={block.id}
              className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                {block.content}
              </h3>
              <div className="space-y-3">
                {Array.isArray(options) &&
                  options.map((option: string, index: number) => (
                    <label
                      key={index}
                      className="flex cursor-pointer items-center space-x-3"
                    >
                      <input
                        type="radio"
                        name={block.id}
                        value={option}
                        checked={answers[block.id] === option}
                        onChange={(e) =>
                          handleAnswerChange(block.id, e.target.value)
                        }
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
              </div>
            </div>
          );
        }

        if (questionType === "multi") {
          return (
            <div
              key={block.id}
              className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                {block.content}
              </h3>
              <div className="space-y-3">
                {Array.isArray(options) &&
                  options.map((option: string, index: number) => (
                    <label
                      key={index}
                      className="flex cursor-pointer items-center space-x-3"
                    >
                      <input
                        type="checkbox"
                        value={option}
                        checked={
                          Array.isArray(answers[block.id]) &&
                          answers[block.id].includes(option)
                        }
                        onChange={(e) => {
                          const currentAnswers = answers[block.id] || [];
                          if (e.target.checked) {
                            handleAnswerChange(block.id, [
                              ...currentAnswers,
                              option,
                            ]);
                          } else {
                            handleAnswerChange(
                              block.id,
                              currentAnswers.filter(
                                (a: string) => a !== option,
                              ),
                            );
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
              </div>
            </div>
          );
        }

        if (questionType === "text") {
          return (
            <div
              key={block.id}
              className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                {block.content}
              </h3>
              <textarea
                value={answers[block.id] || ""}
                onChange={(e) => handleAnswerChange(block.id, e.target.value)}
                placeholder="Type your answer here..."
                className="w-full resize-none rounded-md border border-gray-300 p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>
          );
        }

        return null;

      case "button":
        const isLastBlock =
          quiz!.blocks.indexOf(block) === quiz!.blocks.length - 1;
        const buttonText = isLastBlock ? "Submit Quiz" : "Next";
        const buttonAction = isLastBlock ? handleSubmit : handleNext;
        const buttonStyle =
          (block.properties.buttonStyle as
            | "primary"
            | "secondary"
            | "success"
            | "danger") || "primary";

        const buttonClasses: Record<string, string> = {
          primary: "bg-blue-600 hover:bg-blue-700 text-white",
          secondary: "bg-gray-600 hover:bg-gray-700 text-white",
          success: "bg-green-600 hover:bg-green-700 text-white",
          danger: "bg-red-600 hover:bg-red-700 text-white",
        };

        return (
          <div key={block.id} className="mb-6 text-center">
            <button
              onClick={buttonAction}
              className={`cursor-pointer rounded-lg px-6 py-3 text-lg font-medium transition-colors duration-200 ${buttonClasses[buttonStyle]}`}
            >
              {buttonText}
            </button>
          </div>
        );

      case "footer":
        return (
          <div
            key={block.id}
            className="mt-8 border-t border-gray-200 p-4 text-center text-gray-600"
          >
            {block.content}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Quiz Not Found
          </h1>
          <p className="mb-6 text-gray-600">
            The quiz you're looking for doesn't exist.
          </p>
          <button
            onClick={handleBack}
            className="cursor-pointer rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
          >
            Back to Quiz List
          </button>
        </div>
      </div>
    );
  }

  if (!quiz.published) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Quiz Not Published
          </h1>
          <p className="mb-6 text-gray-600">This quiz is not published yet.</p>
          <button
            onClick={handleBack}
            className="cursor-pointer rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
          >
            Back to Quiz List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex cursor-pointer items-center space-x-2 text-gray-600 hover:text-gray-800"
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
          <h1 className="text-xl font-semibold text-gray-900">{quiz.title}</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Quiz Content */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-6">{quiz.blocks.map(renderBlock)}</div>
      </div>
    </div>
  );
};

export default QuizView;
