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
    <div className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex cursor-pointer items-center space-x-1 text-gray-600 hover:text-gray-800"
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
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="rounded border-none bg-transparent px-2 py-1 text-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter quiz title..."
          />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onSave}
            className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={isPublished ? onUnpublish : onPublish}
            className={`cursor-pointer rounded-lg px-4 py-2 font-medium ${
              isPublished
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {isPublished ? "Unpublish" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
};
