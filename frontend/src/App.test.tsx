import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders ChatBot component', () => {
    render(<App />);
    expect(screen.getByText(/Помощник/)).toBeInTheDocument();
  });
});

