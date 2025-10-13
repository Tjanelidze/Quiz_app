import type { QuizBlock } from "../../../../../types/quizType";

interface ButtonPropertiesProps {
  block: QuizBlock;
  onUpdate: (blockId: string, updates: Partial<QuizBlock>) => void;
}

export const ButtonProperties = ({
  block,
  onUpdate,
}: ButtonPropertiesProps) => {
  if (block.type !== "button") return null;

  return (
    <div className="space-y-4">
      <div>
        <label className="text-secondary mb-2 block text-sm font-medium">
          Button Type
        </label>
        <select
          value={(block.properties as any).buttonType || "next"}
          onChange={(e) => {
            onUpdate(block.id, {
              properties: {
                ...block.properties,
                buttonType: e.target.value,
              },
            });
          }}
          className="border-default w-full cursor-pointer rounded-md border p-2 focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary-500)]"
        >
          <option value="next">Next</option>
          <option value="submit">Submit</option>
        </select>
      </div>

      <div>
        <label className="text-secondary mb-2 block text-sm font-medium">
          Button Style
        </label>
        <select
          value={block.properties.buttonStyle || "primary"}
          onChange={(e) => {
            onUpdate(block.id, {
              properties: {
                ...block.properties,
                buttonStyle: e.target.value,
              },
            });
          }}
          className="border-default w-full cursor-pointer rounded-md border p-2 focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary-500)]"
        >
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="success">Success</option>
          <option value="danger">Danger</option>
        </select>
      </div>
    </div>
  );
};
