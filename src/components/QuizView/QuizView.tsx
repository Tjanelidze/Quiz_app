import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizStorage } from "../../services/quizStorage";
import type { Quiz, QuizBlock } from "../../types/quizType";
import { Header } from "./components/Header/Header";
import { NotFound } from "./components/NotFound/NotFound";
import { Loading } from "../Loading/Loading";
import clsx from "clsx";

type AnswerValue = string | string[] | null;
type Answers = Record<string, AnswerValue>;

const QuizView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Answers>({});
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    try {
      const foundQuiz = quizStorage.getQuizById(id!);
      setQuiz(foundQuiz);
    } catch (error) {
      console.error("Failed to fetch quiz:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleBack = () => {
    navigate("/");
  };

  const handleAnswerChange = (blockId: string, value: AnswerValue) => {
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
      case "heading": {
        return (
          <div key={block.id} className="mb-6">
            <h2 className="text-primary text-center text-2xl font-bold">
              {block.content}
            </h2>
          </div>
        );
      }

      case "question": {
        const questionType = block.properties?.questionType ?? "single";
        const options = Array.isArray(block.properties?.options)
          ? (block.properties!.options as string[])
          : [];

        if (questionType === "single") {
          return (
            <div
              key={block.id}
              className="border-default bg-surface text-primary mb-6 rounded-lg border p-6 shadow-sm"
            >
              <h3 className="text-primary mb-4 text-lg font-medium">
                {block.content}
              </h3>
              <div className="space-y-3">
                {options.map((option, index) => (
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
                      className="border-default h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-secondary">{option}</span>
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
              className="border-default bg-surface text-primary mb-6 rounded-lg border p-6 shadow-sm"
            >
              <h3 className="text-primary mb-4 text-lg font-medium">
                {block.content}
              </h3>
              <div className="space-y-3">
                {options.map((option, index) => {
                  const current = Array.isArray(answers[block.id])
                    ? (answers[block.id] as string[])
                    : [];
                  const checked = current.includes(option);
                  return (
                    <label
                      key={index}
                      className="flex cursor-pointer items-center space-x-3"
                    >
                      <input
                        type="checkbox"
                        value={option}
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleAnswerChange(block.id, [...current, option]);
                          } else {
                            handleAnswerChange(
                              block.id,
                              current.filter((a) => a !== option),
                            );
                          }
                        }}
                        className="border-default h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-secondary">{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        }

        // text
        return (
          <div
            key={block.id}
            className="border-default bg-surface text-primary mb-6 rounded-lg border p-6 shadow-sm"
          >
            <h3 className="text-primary mb-4 text-lg font-medium">
              {block.content}
            </h3>
            <textarea
              value={(answers[block.id] as string) || ""}
              onChange={(e) => handleAnswerChange(block.id, e.target.value)}
              placeholder="Type your answer here..."
              className="border-default w-full resize-none rounded-md border p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>
        );
      }

      case "button": {
        const isLastBlock =
          quiz!.blocks.indexOf(block) === quiz!.blocks.length - 1;
        const configuredType = (block.properties as any)?.buttonType as
          | "next"
          | "submit"
          | undefined;
        const buttonText =
          configuredType === "submit"
            ? "Submit Quiz"
            : configuredType === "next"
              ? "Next"
              : isLastBlock
                ? "Submit Quiz"
                : "Next";
        const buttonAction =
          configuredType === "submit"
            ? handleSubmit
            : configuredType === "next"
              ? handleNext
              : isLastBlock
                ? handleSubmit
                : handleNext;
        const buttonStyle =
          (block.properties?.buttonStyle as
            | "primary"
            | "secondary"
            | "success"
            | "danger") ?? "primary";

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
              className={clsx(
                `cursor-pointer rounded-lg px-6 py-3 text-lg font-medium transition-colors duration-200 ${buttonClasses[buttonStyle]}`,
              )}
            >
              {buttonText}
            </button>
          </div>
        );
      }

      case "footer": {
        return (
          <div
            key={block.id}
            className="border-default text-secondary mt-8 border-t p-4 text-center"
          >
            {block.content}
          </div>
        );
      }

      default:
        return null;
    }
  };

  if (loading) {
    return <Loading text={"Loading quiz..."} />;
  }

  if (!quiz) {
    return <NotFound onBack={handleBack} />;
  }

  return (
    <div className="bg-background text-primary min-h-screen">
      {/* Header */}
      <Header onBack={handleBack} quiz={quiz} />

      {/* Quiz Content */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-6">{quiz.blocks.map(renderBlock)}</div>
      </div>
    </div>
  );
};

export default QuizView;
