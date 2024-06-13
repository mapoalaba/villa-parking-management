import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Resizable } from 're-resizable';
import { ItemTypes } from './ItemTypes';

const DraggableResizableItem = ({ id, type, left, top, width, height, moveSpace, resizeSpace, deleteSpace, containerWidth, containerHeight }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes[type.toUpperCase()],
    item: { id, left, top, width, height, type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (!delta) return;
      let newLeft = Math.round(item.left + delta.x);
      let newTop = Math.round(item.top + delta.y);

      // Ensure the item stays within the boundaries
      newLeft = Math.max(0, Math.min(newLeft, containerWidth - width));
      newTop = Math.max(0, Math.min(newTop, containerHeight - height));

      moveSpace(item.id, newLeft, newTop);
    },
  });

  const [, drop] = useDrop({
    accept: ItemTypes[type.toUpperCase()],
    hover(item, monitor) {
      if (!ref.current) return;
      const dragId = item.id;
      const hoverId = id;

      if (dragId === hoverId) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      if (dragId < hoverId && hoverClientY < hoverMiddleY) return;
      if (dragId > hoverId && hoverClientY > hoverMiddleY) return;

      moveSpace(dragId, hoverId);
      item.index = hoverId;
    },
  });

  drag(drop(ref));

  const handleResizeStop = (e, direction, ref, d) => {
    resizeSpace(id, ref.offsetWidth, ref.offsetHeight);
  };

  const handleDelete = () => {
    deleteSpace(id);
  };

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      <Resizable        // 주차 배치도 
        size={{ width, height }}
        onResizeStop={handleResizeStop}
        style={{ border: '1px solid black', color: 'black'}}
      >
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          {type}
          <button onClick={handleDelete} style={{ position: 'absolute', top: 0, right: 0 }}>x</button>
        </div>
      </Resizable>
    </div>
  );
};

export default DraggableResizableItem;