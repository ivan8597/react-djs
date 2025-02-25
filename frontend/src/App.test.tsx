import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('отрисовывает компонент ChatBot', () => {
    render(<App />);
    expect(screen.getByText(/Помощник/)).toBeInTheDocument();
  });
});

