import clsx from "clsx";
import { ChevronLeftIcon } from "../../../../icons/icons";

interface HeaderProps {
  title: string;
  isPublished: boolean;
  onBack: () => void;
  onTitleChange: (title: string) => void;
  onSave: () => void;
  onPublish: () => void;
  onUnpublish: () => void;
}

export const Header = ({
  title,
  isPublished,
  onBack,
  onTitleChange,
  onSave,
  onPublish,
  onUnpublish,
}: HeaderProps) => {
  return (
    <div className="border-default bg-surface text-primary border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
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
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="rounded border-none bg-transparent px-2 py-1 text-2xl font-bold outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
            placeholder="Enter quiz title..."
          />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onSave}
            className="btn btn-primary cursor-pointer rounded-lg"
          >
            Save
          </button>
          <button
            onClick={isPublished ? onUnpublish : onPublish}
            className={clsx(
              `cursor-pointer rounded-lg px-4 py-2 font-medium ${
                isPublished ? "btn btn-danger" : "btn btn-success"
              }`,
            )}
          >
            {isPublished ? "Unpublish" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
};
