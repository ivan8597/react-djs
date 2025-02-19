import { renderHook, act } from '@testing-library/react';
import { useDraggable } from '../hooks/useDraggable';

describe('useDraggable Hook', () => {
  const mockSetPosition = jest.fn();
  const mockSetIsDragging = jest.fn();
  const initialPosition = { x: 0, y: 0 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('starts dragging on mouse down', () => {
    const { result } = renderHook(() => 
      useDraggable(false, initialPosition, mockSetPosition, mockSetIsDragging)
    );

    act(() => {
      result.current.handleMouseDown({
        clientX: 100,
        clientY: 100
      } as React.MouseEvent);
    });

    expect(mockSetIsDragging).toHaveBeenCalledWith(true);
  });

  test('updates position while dragging', () => {
    const { result } = renderHook(() => 
      useDraggable(true, initialPosition, mockSetPosition, mockSetIsDragging)
    );

    // Симулируем движение мыши
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', {
        clientX: 200,
        clientY: 200
      }));
    });

    expect(mockSetPosition).toHaveBeenCalled();
  });
}); 