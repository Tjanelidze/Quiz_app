export const QuizList = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Quiz List</h1>

        <button className="p cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-blue-700">
          Create Quiz
        </button>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-md"></div>
    </div>
  );
};
