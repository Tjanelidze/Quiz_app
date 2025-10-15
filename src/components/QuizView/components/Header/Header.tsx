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
        <h1 className="text-primary text-xl font-semibold">{quiz.title}</h1>
      }
    />
  );
};
