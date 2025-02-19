import React from 'react';
import { Message } from '../../types';
import { getThemeColors } from '../../utils/theme';
import { commonStyles } from '../../styles/commonStyles';

interface MessagesProps {
  messages: Message[];
  theme: 'light' | 'dark';
  containerRef: React.RefObject<HTMLDivElement>;
}

export const Messages: React.FC<MessagesProps> = ({ messages, theme, containerRef }) => {
  const themeColors = getThemeColors(theme === 'dark');

  return (
    <div 
      ref={containerRef}
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
          style={{
            ...commonStyles.container,
            backgroundColor: message.isBot ? themeColors.secondary : themeColors.primary,
            color: themeColors.text,
            padding: '10px 15px',
            marginBottom: '10px',
            maxWidth: '85%',
            alignSelf: message.isBot ? 'flex-start' : 'flex-end',
            animation: 'slideIn 0.3s ease'
          }}
        >
          {message.text}
        </div>
      ))}
    </div>
  );
}; 