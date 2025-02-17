import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Мок для fetch
global.fetch = jest.fn();

describe('App Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    render(<App />);
  });

  it('renders without crashing', () => {
    expect(screen.getByText('Анализ тональности текста')).toBeInTheDocument();
  });

  it('renders input sections', () => {
    expect(screen.getByPlaceholderText(/Например:/)).toBeInTheDocument();
    expect(screen.getByText('Загрузка текстового файла')).toBeInTheDocument();
  });

  it('handles empty text submission', () => {
    const button = screen.getByRole('button', { name: /Анализировать текст/i });
    expect(button).toBeDisabled();
  });

  it('enables button when text is entered', async () => {
    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, 'Тестовый текст');
    const button = screen.getByRole('button', { name: /Анализировать текст/i });
    
    // Ждем обновления состояния
    await waitFor(() => {
      expect(button).toBeEnabled();
    });
  });

  it('shows loading state during analysis', async () => {
    fetch.mockImplementationOnce(() =>
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve({ result: { positive: 0.9 } })
      }), 100))
    );

    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, 'Тестовый текст');
    const button = screen.getByRole('button', { name: /Анализировать текст/i });
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent('Анализируем...');
    });
  });

  it('displays analysis results', async () => {
    const mockResult = {
      status: 'success',
      result: {
        positive: 0.9,
        negative: 0.1,
        neutral: 0.0,
        speech: 0.0,
        skip: 0.0
      }
    };

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResult)
      })
    );

    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, 'Тестовый текст');
    const button = screen.getByRole('button', { name: /Анализировать текст/i });
    
    fireEvent.click(button);

    await waitFor(() => {
      // Проверяем наличие заголовка результатов
      expect(screen.getByText('Результат анализа')).toBeInTheDocument();
      
      // Проверяем наличие преобладающей эмоции
      expect(screen.getByText(/Преобладающая эмоция:/)).toBeInTheDocument();
      
      // Проверяем процентное значение
      expect(screen.getByText('90.00%')).toBeInTheDocument();
    });
  });

  it('handles API errors', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ detail: 'Test error' })
      })
    );

    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, 'Тестовый текст');
    const button = screen.getByRole('button', { name: /Анализировать текст/i });
    
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Test error/)).toBeInTheDocument();
    });
  });

  it('handles file upload', async () => {
    const file = new File(['Hello World'], 'test.txt', { type: 'text/plain' });
    const mockResult = {
      status: 'success',
      result: {
        positive: 0.9,
        negative: 0.1
      }
    };

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResult)
      })
    );

    const input = screen.getByRole('file');
    await userEvent.upload(input, file);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });
}); 