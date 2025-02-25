import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeToggle from '../components/ThemeToggle';
import { ThemeProvider } from '../context/ThemeContext';

describe('Компонент ThemeToggle', () => {
  test('рендерит кнопку переключения с иконкой светлой темы', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    
    const toggleButton = screen.getByRole('button');// Получает кнопку переключения
    expect(toggleButton).toBeInTheDocument();// Проверяет, что кнопка существует
    expect(toggleButton).toHaveTextContent('🌙');// Проверяет, что кнопка имеет текст
  });

  test('изменяет иконку при нажатии', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    
    const toggleButton = screen.getByRole('button');// Получает кнопку переключения
    fireEvent.click(toggleButton);// Нажимает кнопку
    
    expect(toggleButton).toHaveTextContent('☀️');// Проверяет, что кнопка имеет текст
    
    // Нажимает кнопку снова, чтобы вернуться к светлой теме
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent('🌙');// Проверяет, что кнопка имеет текст
  });
}); 