import { ChevronLeftIcon } from "../../../../icons/icons";
import type { Quiz } from "../../../../types/quizType";

interface HeaderProps {
  onBack: () => void;
  quiz: Quiz;
}

export const Header = ({ onBack, quiz }: HeaderProps) => {
  return (
    <div className="border-b border-default bg-surface px-6 py-4 text-primary">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex cursor-pointer items-center space-x-2 text-secondary hover:text-primary"
        >
          <ChevronLeftIcon />
          <span>Back</span>
        </button>
        <div>
          <h1 className="text-xl font-semibold text-primary">{quiz.title}</h1>
          {!quiz.published && (
            <p className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
              Not published yet
            </p>
          )}
        </div>
        <div className="w-20"></div>
      </div>
    </div>
  );
};
