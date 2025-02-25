import { renderHook } from '@testing-library/react';
import { useAnimation } from '../hooks/useAnimation';

jest.useFakeTimers();

describe('Хук useAnimation', () => {
  test('вызывает callback после задержки', () => {
    const callback = jest.fn();// Мок для callback
    renderHook(() => useAnimation(callback, 1000));// Рендерит хук useAnimation
    
    expect(callback).not.toHaveBeenCalled();// Проверяет, что callback не был вызван
    
    jest.advanceTimersByTime(1000);// Увеличивает время на 1000 миллисекунд
    expect(callback).toHaveBeenCalledTimes(1);// Проверяет, что callback был вызван 1 раз
  });

  test('очищает таймаут при размонтировании', () => {
    const callback = jest.fn();// Мок для callback
    const { unmount } = renderHook(() => useAnimation(callback, 1000));// Рендерит хук useAnimation
    
    unmount();// Размонтирует хук
    jest.advanceTimersByTime(1000);// Увеличивает время на 1000 миллисекунд
    
    expect(callback).not.toHaveBeenCalled();// Проверяет, что callback не был вызван
  });

  test('сбрасывает таймер при изменении зависимостей', () => {
    const callback = jest.fn();// Мок для callback
    const { rerender } = renderHook(({ cb, delay }) => useAnimation(cb, delay), {// Рендерит хук useAnimation
      initialProps: { cb: callback, delay: 1000 }// Инициализирует props
    });
    
    jest.advanceTimersByTime(500);// Увеличивает время на 500 миллисекунд
    
    // Rerender with new delay
    rerender({ cb: callback, delay: 2000 });// Рендерит хук useAnimation с новыми props
    
    jest.advanceTimersByTime(500);// Увеличивает время на 500 миллисекунд
    expect(callback).not.toHaveBeenCalled();// Проверяет, что callback не был вызван
    
    jest.advanceTimersByTime(1500);// Увеличивает время на 1500 миллисекунд
    expect(callback).toHaveBeenCalledTimes(1);// Проверяет, что callback был вызван 1 раз
  });
}); 