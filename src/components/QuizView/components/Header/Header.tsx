import type { Quiz } from "../../../../types/quizType";
import { CommonHeader } from "../../../../components/common/CommonHeader";

interface HeaderProps {
  onBack: () => void;
  quiz: Quiz;
}

export const Header = ({ onBack, quiz }: HeaderProps) => {
  return (
    <CommonHeader
      onBack={onBack}
      title={
        <div>
          <h1 className="text-primary text-xl font-semibold">{quiz.title}</h1>
          {!quiz.published && (
            <p className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
              Not published yet
            </p>
          )}
        </div>
      }
    />
  );
};
