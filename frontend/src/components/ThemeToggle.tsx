import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '10px',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: theme === 'light' ? '#1a1a1a' : '#ffffff',
        color: theme === 'light' ? '#ffffff' : '#1a1a1a'
      }}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle; 