import React, { useState, useRef } from 'react';
import AnalysisChart from './components/AnalysisChart';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const resultRef = useRef(null);

  const formatPercentage = (value) => {
    return (value * 100).toFixed(2) + '%';
  };

  const getMainEmotion = (result) => {
    if (!result) return null;
    const emotions = Object.entries(result);
    emotions.sort((a, b) => b[1] - a[1]);
    return emotions[0];
  };

  const renderResultBar = (label, value) => {
    const percentage = value * 100;
    return (
      <div className="result-bar" key={label}>
        <div className="result-label">{label}</div>
        <div className="bar-container">
          <div 
            className="bar" 
            style={{ width: `${percentage}%`, backgroundColor: getBarColor(label) }}
          ></div>
          <span className="percentage">{formatPercentage(value)}</span>
        </div>
      </div>
    );
  };

  const getBarColor = (label) => {
    const colors = {
      positive: '#28a745',
      negative: '#dc3545',
      neutral: '#6c757d',
      speech: '#17a2b8',
      skip: '#ffc107'
    };
    return colors[label] || '#6c757d';
  };

  const scrollToResult = () => {
    resultRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const analyzeText = async () => {
    if (!text.trim()) return;
    
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
      setTimeout(scrollToResult, 100);
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
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
      setTimeout(scrollToResult, 100);
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Анализ тональности текста</h1>
      
      <div className="description">
        <p>Этот сервис анализирует эмоциональную окраску текста и определяет его тональность.</p>
      </div>
      
      <div className="input-section">
        <h2>Ввод текста</h2>
        <p className="hint">Введите или вставьте текст для анализа тональности</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Например: Это очень хороший день!"
          disabled={loading}
        />
        <button 
          onClick={analyzeText}
          disabled={loading || !text.trim()}
        >
          {loading ? 'Анализируем...' : 'Анализировать текст'}
        </button>
      </div>

      <div className="file-upload">
        <h3>Загрузка текстового файла</h3>
        <input
          type="file"
          accept=".txt"
          onChange={handleFileUpload}
          disabled={loading}
        />
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {result && result.result && (
        <div className="result-section" ref={resultRef}>
          <h2>Результат анализа:</h2>
          <AnalysisChart data={result.result} />
        </div>
      )}
    </div>
  );
}

export default App; 