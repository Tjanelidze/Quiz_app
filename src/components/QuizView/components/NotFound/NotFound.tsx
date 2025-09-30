interface NotFoundProps {
  onBack: () => void;
}

export const NotFound = ({ onBack }: NotFoundProps) => {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-primary mb-4 text-2xl font-bold">Quiz Not Found</h1>
        <p className="text-secondary mb-6">
          The quiz you're looking for doesn't exist.
        </p>
        <button
          onClick={onBack}
          className="btn btn-primary cursor-pointer rounded-lg"
        >
          Back to Quiz List
        </button>
      </div>
    </div>
  );
};
