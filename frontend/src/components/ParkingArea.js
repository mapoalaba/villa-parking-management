import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import DraggableResizableItem from './DraggableResizableItem';
import { ItemTypes } from './ItemTypes';
import '../styles/ParkingArea.css';

const ParkingArea = ({ spaces, moveSpace, resizeSpace, deleteSpace }) => {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      setContainerSize({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, []);

  const [, drop] = useDrop({
    accept: [ItemTypes.VILLA, ItemTypes.PARKING, ItemTypes.EXIT, ItemTypes.WALL],
    drop(item, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (!delta) return;
      let newLeft = Math.round(item.left + delta.x);
      let newTop = Math.round(item.top + delta.y);

      // Ensure the item stays within the boundaries
      newLeft = Math.max(0, Math.min(newLeft, containerSize.width - item.width));
      newTop = Math.max(0, Math.min(newTop, containerSize.height - item.height));

      moveSpace(item.id, newLeft, newTop);
    },
  });

  // Combine refs
  const setRefs = useCallback((node) => {
    containerRef.current = node;
    drop(node);
  }, [drop]);

  return (
    <div ref={setRefs} className="parking-area">
      {spaces.map((space) => (
        <DraggableResizableItem
          key={space.id}
          id={space.id}
          type={space.type}
          left={space.left}
          top={space.top}
          width={space.width}
          height={space.height}
          moveSpace={moveSpace}
          resizeSpace={resizeSpace}
          deleteSpace={deleteSpace}
          containerWidth={containerSize.width}
          containerHeight={containerSize.height}
        />
      ))}
    </div>
  );
};

export default ParkingArea;