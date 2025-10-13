export const Loading = ({ text }: { text: string }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <div className="border-accent mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
        <p className="text-secondary">{text}</p>
      </div>
    </div>
  );
};
