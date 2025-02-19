import { useEffect, useRef } from 'react';
import { SIZES } from '../constants';

export const useDraggable = (
  isDragging: boolean,
  position: { x: number; y: number },
  setPosition: (pos: { x: number; y: number }) => void,
  setIsDragging: (dragging: boolean) => void
) => {
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const maxX = window.innerWidth - SIZES.CHATBOT_WIDTH;
      const maxY = window.innerHeight - SIZES.CHATBOT_HEIGHT;
      
      setPosition({
        x: Math.min(Math.max(0, e.clientX - dragStart.current.x), maxX),
        y: Math.min(Math.max(0, e.clientY - dragStart.current.y), maxY)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return { handleMouseDown };
}; 