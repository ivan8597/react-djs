import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import AnalysisChart from './AnalysisChart';
import { themes } from '../styles/themes';
import ChatBot from './ChatBot';

interface AnalysisResult {
  positive: number;
  negative: number;
  neutral: number;
  speech: number;
  skip: number;
}

const MainContent: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  const [text, setText] = useState<string>('');
  const [result, setResult] = useState<{ status: string; result: AnalysisResult } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const [canClick, setCanClick] = useState(true);

  const analyzeText = async () => {
    if (!canClick || loading || !text.trim()) return;
    
    setCanClick(false);
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Произошла ошибка при анализе');
      }

      setResult(data);
      resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      setError((err as Error).message);
      setResult(null);
    } finally {
      setLoading(false);
      setTimeout(() => setCanClick(true), 100);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Произошла ошибка при анализе файла');
      }

      setResult(data);
      resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      setError((err as Error).message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{
      backgroundColor: currentTheme.background,
      color: currentTheme.text,
      minHeight: '100vh',
      transition: 'all 0.3s ease',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative'
    }}>
      <ThemeToggle />
      <ChatBot />
      
      <div style={{
        width: '100%',
        maxWidth: '800px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
      }}>
        <h1 style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '2.5rem',
          fontWeight: 600,
          marginBottom: '2rem',
          color: theme === 'dark' ? '#e0e0e0' : currentTheme.text
        }}>
          Анализ тональности текста
        </h1>
        
        <div className="input-section" style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px'
        }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Например: Это очень хороший день!"
            disabled={loading}
            style={{
              width: '100%',
              minHeight: '150px',
              padding: '15px',
              backgroundColor: theme === 'dark' ? '#2d2d2d' : currentTheme.chart.background,
              color: theme === 'dark' ? '#e0e0e0' : currentTheme.text,
              border: `1px solid ${currentTheme.border}`,
              borderRadius: '8px',
              resize: 'vertical',
              fontFamily: "'Roboto', sans-serif",
              fontSize: '1rem',
              lineHeight: 1.5
            }}
          />

          <button 
            onClick={analyzeText}
            disabled={!canClick || loading || !text.trim()}
            style={{
              backgroundColor: currentTheme.primary,
              color: '#ffffff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: !canClick || loading || !text.trim() ? 'not-allowed' : 'pointer',
              opacity: !canClick || loading || !text.trim() ? 0.7 : 1,
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 500,
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {loading ? 'Анализируем...' : 'Анализировать текст'}
          </button>

          <div className="file-upload" style={{
            width: '100%',
            textAlign: 'center',
            color: theme === 'dark' ? '#e0e0e0' : currentTheme.text
          }}>
            <h3 style={{
              color: theme === 'dark' ? '#e0e0e0' : currentTheme.text
            }}>
              Загрузка текстового файла
            </h3>
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              disabled={loading}
            />
          </div>
        </div>

        {error && (
          <div className="error-message" style={{
            color: '#dc3545',
            padding: '10px',
            borderRadius: '4px',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            width: '100%',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {result && result.result && (
          <div className="result-section" ref={resultRef} style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            <h2 style={{
              color: theme === 'dark' ? '#e0e0e0' : currentTheme.text
            }}>
              Результат анализа:
            </h2>
            <AnalysisChart 
              data={Object.entries(result.result).map(([label, value]) => ({
                label,
                value,
              }))}
            />
          </div>
        )}

        {result && result.result && (
          <button
            onClick={scrollToTop}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              backgroundColor: currentTheme.primary,
              color: '#ffffff',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontFamily: "'Montserrat', sans-serif",
              zIndex: 1000,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            }}
          >
            ↑
          </button>
        )}

        <p style={{
          color: theme === 'dark' ? '#e0e0e0' : currentTheme.text
        }}>
          График показывает распределение эмоциональной окраски текста по категориям.
        </p>
      </div>
    </div>
  );
};

export default MainContent; 