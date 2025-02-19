import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import MainContent from './components/MainContent';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  );
}

export default App; 