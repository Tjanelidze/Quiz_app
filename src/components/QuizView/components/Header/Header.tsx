import { ChevronLeftIcon } from "../../../../icons/icons";
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
          <ChevronLeftIcon />
          <span>Back</span>
        </button>
        <h1 className="text-xl font-semibold text-gray-900">{quiz.title}</h1>
        <div className="w-20"></div>
      </div>
    </div>
  );
};
