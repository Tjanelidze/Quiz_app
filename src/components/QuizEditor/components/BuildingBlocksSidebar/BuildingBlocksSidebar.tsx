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
    <div className="w-64 border-r border-gray-200 bg-white p-4">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Building Blocks
      </h3>

      <div className="space-y-2">
        {buildingBlocks.map((block) => (
          <div
            key={block.type}
            draggable
            onDragStart={(e) => onDragStart(e, block)}
            onClick={() => onBlockClick(block.type)}
            className="flex cursor-pointer items-center space-x-3 rounded-lg border border-gray-200 bg-gray-50 p-3 transition-colors hover:bg-gray-100"
          >
            <span className="text-xl">{block.icon}</span>
            <span className="font-medium text-gray-700">{block.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
