import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainContent from '../components/MainContent';
import { ThemeProvider } from '../context/ThemeContext';

// Мок для fetch API
global.fetch = jest.fn(() =>// Возвращает промис
  Promise.resolve({ 
    ok: true, // Указывает, что запрос был успешным
    json: () => Promise.resolve({
      status: 'success', // Статус успешного выполнения
      result: {
        positive: 0.8, // Положительная оценка
        negative: 0.1, // Отрицательная оценка
        neutral: 0.1   // Нейтральная оценка
      }
    }),
  })
) as jest.Mock;

describe('Компонент MainContent', () => {// Описывает компонент MainContent
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();// Очищает мок
  });

  test('отрисовывает заголовок и текстовую область', () => {
    render(
      <ThemeProvider>
        <MainContent />
      </ThemeProvider>
    );
    
    expect(screen.getByText(/Анализ тональности текста/i)).toBeInTheDocument();// Проверяет, что заголовок существует
    expect(screen.getByPlaceholderText(/Например:/i)).toBeInTheDocument();// Проверяет, что текстовая область существует
  });

  test('позволяет вводить текст и отправлять его для анализа', async () => {
    render(
      <ThemeProvider>
        <MainContent />
      </ThemeProvider>
    );
    
    const textArea = screen.getByPlaceholderText(/Например:/i);
    fireEvent.change(textArea, { target: { value: 'Тестовый текст для анализа' } });
    
    const analyzeButton = screen.getByText(/Анализировать текст/i);
    fireEvent.click(analyzeButton);// Отправляет текст для анализа
    
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/analyze', expect.any(Object));
    
    await waitFor(() => {
      expect(screen.getByText(/Результат анализа:/i)).toBeInTheDocument();
    });
  });

  test('обрабатывает ошибки от API', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ detail: 'Ошибка анализа' }),
      })
    );
    
    render(
      <ThemeProvider>
        <MainContent />
      </ThemeProvider>
    );
    
    const textArea = screen.getByPlaceholderText(/Например:/i);
    fireEvent.change(textArea, { target: { value: 'Тестовый текст' } });
    
    const analyzeButton = screen.getByText(/Анализировать текст/i);
    fireEvent.click(analyzeButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Ошибка анализа/i)).toBeInTheDocument();
    });
  });

  test('отключает кнопку, когда текстовая область пуста', () => {
    render(
      <ThemeProvider>
        <MainContent />
      </ThemeProvider>
    );
    
    const analyzeButton = screen.getByText(/Анализировать текст/i);
    expect(analyzeButton).toBeDisabled();
    
    const textArea = screen.getByPlaceholderText(/Например:/i);
    fireEvent.change(textArea, { target: { value: 'Тестовый текст' } });
    
    expect(analyzeButton).not.toBeDisabled();
  });
}); 