import { renderHook, act } from '@testing-library/react';
import { useDraggable } from '../hooks/useDraggable';

describe('Хук useDraggable', () => {
  const mockSetPosition = jest.fn();// Мок для setPosition
  const mockSetIsDragging = jest.fn();// Мок для setIsDragging
  const initialPosition = { x: 0, y: 0 };// Начальная позиция

  beforeEach(() => {
    jest.clearAllMocks();// Очищает все моки
  });

  test('начинает перетаскивание при нажатии мыши', () => {
    const { result } = renderHook(() => 
      useDraggable(false, initialPosition, mockSetPosition, mockSetIsDragging)// Рендерит хук useDraggable
    );

    act(() => {// Симулируем нажатие мыши
      result.current.handleMouseDown({// Симулируем нажатие мыши
        clientX: 100,// Симулируем координату x
        clientY: 100// Симулируем координату y
      } as React.MouseEvent);// Симулируем нажатие мыши
    });

    expect(mockSetIsDragging).toHaveBeenCalledWith(true);// Проверяет, что mockSetIsDragging был вызван с true
  });

  test('обновляет позицию при перетаскивании', () => {
    const { result } = renderHook(() => 
      useDraggable(true, initialPosition, mockSetPosition, mockSetIsDragging)// Рендерит хук useDraggable
    );

    // Симулируем движение мыши
    act(() => {// Симулируем движение мыши
      window.dispatchEvent(new MouseEvent('mousemove', {// Симулируем движение мыши
        clientX: 200,// Симулируем координату x
        clientY: 200// Симулируем координату y
      }));
    });

    expect(mockSetPosition).toHaveBeenCalled();// Проверяет, что mockSetPosition был вызван
  });
}); 