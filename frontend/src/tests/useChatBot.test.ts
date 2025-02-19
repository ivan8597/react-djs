import { renderHook, act } from '@testing-library/react';
import { useChatBot } from '../hooks/useChatBot';

describe('useChatBot Hook', () => {
  test('initializes with default values', () => {
    const { result } = renderHook(() => useChatBot());
    
    expect(result.current.isOpen).toBe(true);
    expect(result.current.messages).toHaveLength(0);
    expect(result.current.userInput).toBe('');
    expect(result.current.waitingForResponse).toBe(true);
  });

  test('adds messages correctly', () => {
    const { result } = renderHook(() => useChatBot());
    
    act(() => {
      result.current.addMessage('Test message', true);
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0]).toEqual({
      text: 'Test message',
      isBot: true
    });
  });

  test('resets chat state', () => {
    const { result } = renderHook(() => useChatBot());
    
    act(() => {
      result.current.addMessage('Test message', true);
      result.current.resetChat();
    });

    expect(result.current.messages).toHaveLength(0);
    expect(result.current.userInput).toBe('');
    expect(result.current.waitingForResponse).toBe(true);
  });
}); 