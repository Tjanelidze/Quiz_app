import type { Quiz } from "../../../../types/quizType";

interface HeaderProps {
  onBack: () => void;
  quiz: Quiz;
}

export const Header = ({ onBack, quiz }: HeaderProps) => {
  return (
    <div className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
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
        <div className="w-20"></div>
      </div>
    </div>
  );
};
