import React from 'react';
import { useDrag } from 'react-dnd';
import { ResizableBox } from 'react-resizable';
import '../styles/DraggableItem.css';

const DraggableResizableItem = ({ id, type, left, top, width = 50, height = 50, onResize, onMove, onDelete }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { id, type, left, top, width, height },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleResize = (e, { size }) => {
    onResize(id, size.width, size.height);
  };

  return (
    <ResizableBox
      width={width}
      height={height}
      minConstraints={[20, 20]}
      maxConstraints={[200, 200]}
      onResize={handleResize}
      className="draggable-item"
      resizeHandles={['se']}
      style={{ position: 'absolute', left, top }}
    >
      <div ref={drag} style={{ width: '100%', height: '100%', cursor: isDragging ? 'move' : 'default' }}>
        {type}
        <button className="delete-button" onClick={() => onDelete(id)}>X</button>
      </div>
    </ResizableBox>
  );
};

export default DraggableResizableItem;
