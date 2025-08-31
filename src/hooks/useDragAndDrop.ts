import { useCallback, useState, useRef, useEffect } from "react";

interface DragAndDropState {
  dragData: { type: string; label: string } | null;
  isDragOver: boolean;
  dragOverBlockId: string | null;
  draggedBlockId: string | null;
}

interface DragAndDropHandlers {
  // Building block drag handlers
  handleDragStart: (
    e: React.DragEvent,
    block: { type: string; label: string },
  ) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;

  // Block reordering handlers
  handleBlockDragStart: (e: React.DragEvent, blockId: string) => void;
  handleBlockDragEnd: () => void;
  handleBlockDragOver: (e: React.DragEvent, blockId: string) => void;
  handleBlockDragLeave: (e: React.DragEvent) => void;
  handleBlockDrop: (e: React.DragEvent, targetId: string) => void;

  // State getters
  getDragState: () => DragAndDropState;
}

export const useDragAndDrop = (
  onAddBlock: (type: string, insertBeforeId?: string) => void,
  onReorderBlock: (draggedId: string, targetId: string) => void,
): DragAndDropHandlers => {
  const [dragData, setDragData] = useState<{
    type: string;
    label: string;
  } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragOverBlockId, setDragOverBlockId] = useState<string | null>(null);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);

  // Use ref to track current dragData for the drop handler
  const dragDataRef = useRef(dragData);

  // Update ref when dragData changes
  useEffect(() => {
    dragDataRef.current = dragData;
  }, [dragData]);

  const handleDragStart = useCallback(
    (e: React.DragEvent, block: { type: string; label: string }) => {
      setDragData(block);

      e.dataTransfer.effectAllowed = "copy";
      e.dataTransfer.setData("text/plain", block.type);

      // Create a custom drag image for better visual feedback
      const dragImage = document.createElement("div");
      dragImage.className =
        "fixed pointer-events-none z-50 bg-blue-100 border-2 border-blue-300 rounded-lg px-3 py-2 text-sm font-medium text-blue-700 shadow-lg";
      dragImage.textContent = `Add ${block.label}`;
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 0, 0);

      // Remove the drag image after a short delay
      setTimeout(() => {
        if (document.body.contains(dragImage)) {
          document.body.removeChild(dragImage);
        }
      }, 100);
    },
    [],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Only set drag over to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
      setDragOverBlockId(null);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const currentDragData = dragDataRef.current;
      setIsDragOver(false);
      setDragOverBlockId(null);

      if (currentDragData) {
        // When dropping on the main canvas, add at the end
        onAddBlock(currentDragData.type);
        setDragData(null);
      }
    },
    [onAddBlock],
  );

  const handleBlockDragStart = useCallback(
    (e: React.DragEvent, blockId: string) => {
      setDraggedBlockId(blockId);
      // Reset the center canvas drag over state when starting to drag existing blocks
      setIsDragOver(false);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", blockId);

      // Create a custom drag image for the block being reordered
      const dragImage = document.createElement("div");
      dragImage.className =
        "fixed pointer-events-none z-50 bg-gray-100 border-2 border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 shadow-lg opacity-75";
      dragImage.textContent = "Moving block...";
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, 0, 0);

      // Remove the drag image after a short delay
      setTimeout(() => {
        if (document.body.contains(dragImage)) {
          document.body.removeChild(dragImage);
        }
      }, 100);
    },
    [],
  );

  const handleBlockDragEnd = useCallback(() => {
    setDraggedBlockId(null);
    setDragOverBlockId(null);
    // Ensure center canvas drag over state is reset
    setIsDragOver(false);
  }, []);

  const handleBlockDragOver = useCallback(
    (e: React.DragEvent, blockId: string) => {
      e.preventDefault();
      e.stopPropagation();

      // Set drop effect based on what's being dragged
      if (draggedBlockId) {
        e.dataTransfer.dropEffect = "move";
      } else if (dragData) {
        e.dataTransfer.dropEffect = "copy";
      }

      // Only update state if it's actually changing to reduce re-renders
      if (dragOverBlockId !== blockId) {
        setDragOverBlockId(blockId);
      }
    },
    [dragOverBlockId, draggedBlockId, dragData],
  );

  const handleBlockDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    // Only clear if we're actually leaving the block area
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverBlockId(null);
    }
  }, []);

  const handleBlockDrop = useCallback(
    (e: React.DragEvent, targetId: string) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOverBlockId(null);
      // Reset center canvas drag over state when dropping blocks
      setIsDragOver(false);

      if (draggedBlockId && draggedBlockId !== targetId) {
        // Reordering existing blocks
        onReorderBlock(draggedBlockId, targetId);
      } else if (dragData) {
        // Adding new blocks from sidebar to specific positions
        onAddBlock(dragData.type, targetId);
        setDragData(null);
      }
    },
    [draggedBlockId, dragData, onReorderBlock, onAddBlock],
  );

  const getDragState = useCallback(
    () => ({
      dragData,
      isDragOver,
      dragOverBlockId,
      draggedBlockId,
    }),
    [dragData, isDragOver, dragOverBlockId, draggedBlockId],
  );

  return {
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleBlockDragStart,
    handleBlockDragEnd,
    handleBlockDragOver,
    handleBlockDragLeave,
    handleBlockDrop,
    getDragState,
  };
};
