import { renderHook, act } from '@testing-library/react';
import { useChatBot } from '../hooks/useChatBot';

describe('Хук useChatBot', () => {
  test('инициализируется с начальными значениями', () => {
    const { result } = renderHook(() => useChatBot());// Рендерит хук useChatBot
    
    expect(result.current.isOpen).toBe(true);// Проверяет, что isOpen равно true
    expect(result.current.messages).toHaveLength(0);// Проверяет, что messages имеет длину 0
    expect(result.current.userInput).toBe('');// Проверяет, что userInput равно пустой строке
    expect(result.current.waitingForResponse).toBe(true);// Проверяет, что waitingForResponse равно true
  });

  test('добавляет сообщения корректно', () => {
    const { result } = renderHook(() => useChatBot());// Рендерит хук useChatBot
    
    act(() => {
      result.current.addMessage('Test message', true);// Добавляет сообщение
    });

    expect(result.current.messages).toHaveLength(1);// Проверяет, что messages имеет длину 1
    expect(result.current.messages[0]).toEqual({
      text: 'Test message',// Проверяет, что текст сообщения равен 'Test message'
      isBot: true// Проверяет, что isBot равно true
    });
  });

  test('сбрасывает состояние чата', () => {
    const { result } = renderHook(() => useChatBot());// Рендерит хук useChatBot
    
    act(() => {
      result.current.addMessage('Test message', true);// Добавляет сообщение
      result.current.resetChat();// Сбрасывает состояние чата
    });

    expect(result.current.messages).toHaveLength(0);// Проверяет, что messages имеет длину 0
    expect(result.current.userInput).toBe('');// Проверяет, что userInput равно пустой строке
    expect(result.current.waitingForResponse).toBe(true);// Проверяет, что waitingForResponse равно true
  });
}); 