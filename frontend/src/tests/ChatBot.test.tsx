import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatBot from '../components/ChatBot';
import { ThemeProvider } from '../context/ThemeContext';

describe('Компонент ChatBot', () => {
  const renderChatBot = () => {
    return render(
      <ThemeProvider>
        <ChatBot />
      </ThemeProvider>
    );
  };

  test('отрисовывает начальное приветствие', () => {
    renderChatBot();
    expect(screen.getByText(/Привет! Я помогу вам проанализировать/)).toBeInTheDocument();
  });

  test('отрисовывает заголовок', () => {
    renderChatBot();// Отрисовывает компонент ChatBot
    expect(screen.getByText('Помощник')).toBeInTheDocument();// Проверяет, что заголовок существует
  });

  test('позволяет пользователю вводить текст и отправлять его', () => {
    renderChatBot();
    const input = screen.getByPlaceholderText(/Введите ответ/);// Получает поле ввода
    
    fireEvent.change(input, { target: { value: 'да' } });
    expect(input).toHaveValue('да');// Проверяет, что поле ввода имеет значение
    
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(screen.getByText('да')).toBeInTheDocument();// Проверяет, что текст существует в документе
  });

  test('может быть закрыт и открыт снова', () => {
    const { container } = renderChatBot();// Отрисовывает компонент ChatBot
    
    // Закрытие чата
    const closeButton = screen.getByLabelText('Закрыть чат');// Получает кнопку закрытия
    fireEvent.click(closeButton);// Нажимает кнопку
    
    // После закрытия находим кнопку по роли и иконке
    const openButton = screen.getByRole('button');// Получает кнопку открытия
    expect(openButton).toBeInTheDocument();// Проверяет, что кнопка существует
    
    // Открытие чата
    fireEvent.click(openButton);// Нажимает кнопку
    expect(screen.getByText('Помощник')).toBeInTheDocument();// Проверяет, что текст существует в документе
  });
}); 