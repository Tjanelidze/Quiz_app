interface NotFoundProps {
  onBack: () => void;
}

export const NotFound = ({ onBack }: NotFoundProps) => {
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
          onClick={onBack}
          className="cursor-pointer rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
        >
          Back to Quiz List
        </button>
      </div>
    </div>
  );
};
