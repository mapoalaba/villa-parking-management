import React, { useState, useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { ResizableBox } from 'react-resizable';
import '../styles/DraggableItem.css';

const DraggableItem = ({ id, type, left, top, width = 50, height = 50, onResize }) => {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type,
    item: { id, left, top, type, width, height },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleResize = (e, { size }) => {
    onResize(id, size.width, size.height);
  };

  const nodeRef = useRef(null);

  useEffect(() => {
    if (nodeRef.current) {
      drag(nodeRef.current);
    }
  }, [drag]);

  return (
    <ResizableBox
      ref={nodeRef}
      width={width}
      height={height}
      minConstraints={[20, 20]}
      maxConstraints={[200, 200]}
      onResize={handleResize}
      className="draggable-item"
      style={{ left, top, position: 'absolute' }}
      draggable={false}
    >
      <div style={{ width: '100%', height: '100%' }}>
        {type}
      </div>
    </ResizableBox>
  );
};

export default DraggableItem;
