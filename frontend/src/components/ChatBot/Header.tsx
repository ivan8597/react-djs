import React from 'react';
import { commonStyles } from '../../styles/commonStyles';

interface HeaderProps {
  onClose: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  isDragging: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onClose, onMouseDown, isDragging }) => (
  <div 
    style={{
      ...commonStyles.flexCenter,
      padding: '15px',
      backgroundColor: '#007bff',
      cursor: isDragging ? 'grabbing' : 'grab',
      color: '#ffffff',
      justifyContent: 'space-between'
    }}
    onMouseDown={onMouseDown}
  >
    <span style={{ fontWeight: 500 }}>Помощник</span>
    <button
      onClick={onClose}
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
); 