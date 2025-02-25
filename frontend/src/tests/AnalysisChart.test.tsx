import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnalysisChart from '../components/AnalysisChart';
import { ThemeProvider } from '../context/ThemeContext';

// Мок для D3
jest.mock('d3', () => {// Мокирует d3
  // Создаем функции, которые возвращают объекты с нужными методами
  const createChainableObject = () => {
    const obj: Record<string, jest.Mock> = {};// Создает объект с методами
    
    // Основные методы, возвращающие цепочку
    const methods = [
      'domain', 'range', 'padding', 'attr', 'style', 'text', 'data', 
      'enter', 'append', 'exit', 'remove', 'selectAll', 'select',
      'ticks', 'tickFormat', 'call', 'on', 'transition', 'duration'
    ];
    
    methods.forEach(method => {// Проходит по всем методам
      obj[method] = jest.fn().mockReturnValue(obj);// Возвращает объект
    });
    
    // Специальные методы с конкретными значениями
    obj.bandwidth = jest.fn().mockReturnValue(30); // Возвращает числовое значение
    
    return obj;
  };

  // Создаем специальный мок для методов axis
  const createAxisMock = () => {
    const axisMock = jest.fn().mockReturnValue(createChainableObject());// Возвращает объект
    return axisMock;
  };

  return {
    select: jest.fn().mockImplementation(() => {
      const obj = createChainableObject(); // Создает объект с цепочечными методами
      obj.node = jest.fn().mockReturnValue({ 
        getBoundingClientRect: () => ({ width: 300, height: 200 }) // Возвращает размеры элемента
      });
      return obj;
    }),
    selectAll: jest.fn().mockReturnValue(createChainableObject()), // Мокирует метод selectAll, возвращая объект с цепочечными методами
    scaleLinear: jest.fn().mockImplementation(() => createChainableObject()), // Мокирует линейную шкалу
    scaleBand: jest.fn().mockImplementation(() => createChainableObject()), // Мокирует шкалу с диапазоном
    max: jest.fn().mockReturnValue(1), // Мокирует метод max, возвращая значение 1
    axisBottom: createAxisMock(), // Мокирует нижнюю ось
    axisLeft: createAxisMock(), // Мокирует левую ось
    // Добавим эти методы глобально
    transition: jest.fn().mockReturnValue(createChainableObject()), // Мокирует метод transition, возвращая объект с цепочечными методами
    duration: jest.fn().mockReturnValue(createChainableObject()) // Мокирует метод duration, возвращая объект с цепочечными методами
  };
});

describe('Компонент AnalysisChart', () => {
  const mockData = [
    { label: 'positive', value: 0.75 }, // Положительная оценка
    { label: 'negative', value: 0.15 }, // Отрицательная оценка
    { label: 'neutral', value: 0.1 }, // Нейтральная оценка
  ];

  test('отрисовывает контейнер для графика', () => {
    render(
      <ThemeProvider>
        <AnalysisChart data={mockData} />
      </ThemeProvider>
    );

    const chartContainer = screen.getByTestId('chart-container');// Получает контейнер для графика
    expect(chartContainer).toBeInTheDocument();// Проверяет, что контейнер существует
  });

  test('отрисовывает элементы легенды', () => {
    render(
      <ThemeProvider>
        <AnalysisChart data={mockData} />
      </ThemeProvider>
    );

    expect(screen.getByText(/Положительный/i)).toBeInTheDocument();// Проверяет, что текст существует в документе
    expect(screen.getByText(/Отрицательный/i)).toBeInTheDocument();// Проверяет, что текст существует в документе
    expect(screen.getByText(/Нейтральный/i)).toBeInTheDocument();// Проверяет, что текст существует в документе
  });

  test('отрисовывает пустой контейнер при отсутствии данных', () => {
    render(
      <ThemeProvider>
        <AnalysisChart data={[]} />
      </ThemeProvider>
    );

    // Проверяем наличие сообщения о пустых данных
    const emptyContainer = screen.getByTestId('empty-container');// Получает контейнер для пустых данных
    expect(emptyContainer).toBeInTheDocument();// Проверяет, что контейнер существует
    expect(emptyContainer).toHaveTextContent(/Нет данных для отображения/i);// Проверяет, что текст существует в документе
  });
}); 