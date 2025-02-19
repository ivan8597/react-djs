import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { themes } from '../styles/themes';

const ChatBot: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Array<{ text: string; isBot: boolean }>>([]);
  const [userInput, setUserInput] = useState('');
  const [waitingForResponse, setWaitingForResponse] = useState(true);
  const [showNextMessages, setShowNextMessages] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const [position, setPosition] = useState({ x: 20, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const botMessages = [
    "Вы можете ввести текст в поле выше или загрузить текстовый файл.",
    "После анализа вы увидите распределение эмоциональной окраски текста в виде графика.",
    "Попробуйте прямо сейчас! 😊"
  ];

  const scrollToBottom = () => {
    if (messagesContainerRef.current && !isScrolling.current) {
      isScrolling.current = true;
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
      
      setTimeout(() => {
        isScrolling.current = false;
      }, 1000);
    }
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ text: "👋 Привет! Я помогу вам проанализировать тональность текста. Хотите продолжить?", isBot: true }]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0 && !isScrolling.current) {
      const timeout = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [messages.length]);

  useEffect(() => {
    if (showNextMessages) {
      let messageIndex = 0;
      const timeouts: NodeJS.Timeout[] = [];

      const showMessage = () => {
        if (messageIndex < botMessages.length) {
          setMessages(prev => [...prev, { text: botMessages[messageIndex], isBot: true }]);
          
          if (messageIndex < botMessages.length - 1) {  // Если есть следующее сообщение
            const timeout = setTimeout(() => {
              messageIndex++;
              showMessage();
            }, 2000);  // Увеличиваем интервал до 2 секунд
            timeouts.push(timeout);
          } else {  // Если это последнее сообщение
            const finalTimeout = setTimeout(() => {
              setWaitingForResponse(false);
              setShowNextMessages(false);
            }, 1000);
            timeouts.push(finalTimeout);
          }
        }
      };

      showMessage();

      return () => {
        timeouts.forEach(clearTimeout);
      };
    }
  }, [showNextMessages]);

  useEffect(() => {
    const timeout = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeout);
  }, [messages.length]);

  const handleUserInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && userInput.trim()) {
      const response = userInput.trim().toLowerCase();
      setMessages(prev => [...prev, { text: userInput, isBot: false }]);
      setUserInput('');
      
      if (response === 'да' || response === 'помочь' || response === 'хочу' || response === 'продолжить') {
        setWaitingForResponse(false);
        setShowNextMessages(true);
      } else {
        setMessages(prev => [...prev, { text: "Хорошо, если захотите помощь - просто напишите 'да' или 'помочь'", isBot: true }]);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const maxX = window.innerWidth - 300; // ширина окна минус ширина чат-бота
      const maxY = window.innerHeight - 400; // высота окна минус высота чат-бота
      
      setPosition({
        x: Math.min(Math.max(0, e.clientX - dragStart.current.x), maxX),
        y: Math.min(Math.max(0, e.clientY - dragStart.current.y), maxY)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Общие стили
  const commonStyles = {
    borderRadius: '12px',
    boxSizing: 'border-box' as const,
  };

  // Стили для темной/светлой темы
  const themeStyles = {
    background: theme === 'dark' ? '#2d2d2d' : '#ffffff',
    text: theme === 'dark' ? '#e0e0e0' : '#333333',
    border: theme === 'dark' ? '#404040' : '#e0e0e0',
    messageBg: {
      bot: theme === 'dark' ? '#404040' : '#f0f2f5',
      user: theme === 'dark' ? '#1a1a1a' : '#e3f2fd'
    }
  };

  // Обработчики сообщений
  const handleMessage = (text: string, isBot: boolean) => {
    setMessages(prev => [...prev, { text, isBot }]);
  };

  // Сброс состояний
  const resetStates = (keepInitialMessage = false) => {
    setMessages(keepInitialMessage ? [{ 
      text: "👋 Привет! Я помогу вам проанализировать тональность текста. Хотите продолжить?", 
      isBot: true 
    }] : []);
    setUserInput('');
    setWaitingForResponse(true);
    setShowNextMessages(false);
    setPosition({ x: 20, y: 80 });
  };

  // Стили для сообщений
  const getMessageStyle = (isBot: boolean) => ({
    ...commonStyles,
    backgroundColor: isBot ? themeStyles.messageBg.bot : themeStyles.messageBg.user,
    color: themeStyles.text,
    padding: '10px 15px',
    marginBottom: '10px',
    maxWidth: '85%',
    alignSelf: isBot ? 'flex-start' : 'flex-end',
    animation: 'slideIn 0.3s ease'
  });

  // Стили для input
  const inputStyles = {
    ...commonStyles,
    width: '100%',
    padding: '8px',
    border: `1px solid ${themeStyles.border}`,
    backgroundColor: themeStyles.background,
    color: themeStyles.text
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Открыть чат"
        style={{
          position: 'fixed',
          bottom: '80px',
          left: '20px',
          backgroundColor: '#007bff',
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
          zIndex: 1000
        }}
      >
        💬
      </button>
    );
  }

  return (
    <div style={{
      ...commonStyles,
      position: 'fixed',
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: '300px',
      maxHeight: '400px',
      backgroundColor: themeStyles.background,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000,
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      msUserSelect: 'none',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div 
        style={{
          padding: '15px',
          backgroundColor: '#007bff',
          cursor: isDragging ? 'grabbing' : 'grab',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
        onMouseDown={handleMouseDown}
      >
        <span style={{ fontWeight: 500 }}>Помощник</span>
        <button
          onClick={() => resetStates(true)}
          aria-label="Закрыть чат"
          style={{
            background: 'none',
            border: 'none',
            color: '#ffffff',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '0'
          }}
        >
          ×
        </button>
      </div>
      <div 
        ref={messagesContainerRef}
        className="messages-container"
        onWheel={(e) => e.stopPropagation()}
        style={{
          padding: '15px',
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          scrollBehavior: 'smooth'
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={getMessageStyle(message.isBot)}
          >
            {message.text}
          </div>
        ))}
      </div>
      {waitingForResponse && (
        <div style={{
          padding: '10px',
          borderTop: `1px solid ${themeStyles.border}`,
          ...commonStyles,
          width: '100%'
        }}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleUserInput}
            placeholder="Введите ответ и нажмите Enter..."
            style={inputStyles}
          />
        </div>
      )}
    </div>
  );
};

export default ChatBot; 