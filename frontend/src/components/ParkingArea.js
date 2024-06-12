import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import DraggableResizableItem from './DraggableResizableItem';
import { ItemTypes } from './ItemTypes';
import '../styles/ParkingArea.css';

const ParkingArea = ({ spaces, moveSpace, resizeSpace, deleteSpace }) => {
  const ref = useRef(null);

  const [, drop] = useDrop(() => ({
    accept: [ItemTypes.VILLA, ItemTypes.PARKING, ItemTypes.EXIT, ItemTypes.WALL],
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      let left = Math.round(item.left + delta.x);
      let top = Math.round(item.top + delta.y);

      if (ref.current) {
        const { offsetWidth, offsetHeight } = ref.current;

        // Ensure the item stays within the bounds of ParkingArea
        left = Math.max(0, Math.min(left, offsetWidth - item.width));
        top = Math.max(0, Math.min(top, offsetHeight - item.height));
      }

      moveSpace(item.id, left, top);
    },
  }));

  return (
    <div ref={(node) => { ref.current = node; drop(node); }} className="parking-area">
      {spaces.map((space) => (
        <DraggableResizableItem
          key={space.id}
          id={space.id}
          type={space.type}
          left={space.left}
          top={space.top}
          width={space.width}
          height={space.height}
          onResize={resizeSpace}
          onMove={moveSpace}
          onDelete={deleteSpace}
        >
          {space.type}
        </DraggableResizableItem>
      ))}
    </div>
  );
};

export default ParkingArea;
