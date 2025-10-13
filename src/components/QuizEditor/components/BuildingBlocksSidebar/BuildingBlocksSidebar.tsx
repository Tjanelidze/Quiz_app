interface BuildingBlock {
  type: string;
  label: string;
  icon: string;
}

interface BuildingBlocksSidebarProps {
  buildingBlocks: BuildingBlock[];
  onDragStart: (e: React.DragEvent, block: BuildingBlock) => void;
  onBlockClick: (type: string) => void;
}

export const BuildingBlocksSidebar = ({
  buildingBlocks,
  onDragStart,
  onBlockClick,
}: BuildingBlocksSidebarProps) => {
  return (
    <div className="border-default bg-surface text-primary w-64 border-r p-4">
      <h3 className="text-primary mb-4 text-lg font-semibold">
        Building Blocks
      </h3>

      <div className="space-y-2">
        {buildingBlocks.map((block) => (
          <div
            key={block.type}
            draggable
            onDragStart={(e) => onDragStart(e, block)}
            onClick={() => onBlockClick(block.type)}
            className="border-default bg-background hover:bg-background flex cursor-pointer items-center space-x-3 rounded-lg border p-3 transition-colors"
          >
            <span className="text-xl">{block.icon}</span>
            <span className="text-secondary font-medium">{block.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
