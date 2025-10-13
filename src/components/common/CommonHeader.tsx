import type { ReactNode } from "react";
import { ChevronLeftIcon } from "../../icons/icons";

interface CommonHeaderProps {
  title: ReactNode;
  onBack?: () => void;
  left?: ReactNode;
  right?: ReactNode;
  center?: ReactNode;
}

export const CommonHeader = ({
  title,
  onBack,
  left,
  right,
  center,
}: CommonHeaderProps) => {
  return (
    <div className="border-default bg-surface text-primary border-b px-6 py-4">
      <div className="grid grid-cols-3 items-center">
        <div className="flex items-center space-x-4">
          {left ||
            (onBack && (
              <button
                onClick={onBack}
                className="text-secondary hover:text-primary flex cursor-pointer items-center space-x-1"
              >
                <ChevronLeftIcon
                  className="size-5"
                  stroke="currentColor"
                  strokeWidth={1.5}
                />
                <span>Back</span>
              </button>
            ))}
        </div>

        <div className="flex items-center justify-center">
          {center ?? <div className="text-2xl font-bold">{title}</div>}
        </div>

        <div className="flex items-center justify-end space-x-3">{right}</div>
      </div>
    </div>
  );
};
