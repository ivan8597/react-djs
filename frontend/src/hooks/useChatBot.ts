import { useState, useRef } from 'react';
import { Message } from '../types';
import { INITIAL_POSITION } from '../constants';

export const useChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [waitingForResponse, setWaitingForResponse] = useState(true);
  const [showNextMessages, setShowNextMessages] = useState(false);
  const [position, setPosition] = useState(INITIAL_POSITION);
  const [isDragging, setIsDragging] = useState(false);

  const addMessage = (text: string, isBot: boolean) => {
    setMessages(prev => [...prev, { text, isBot }]);
  };

  const resetChat = (keepInitialMessage = false) => {
    setMessages(keepInitialMessage ? [{ 
      text: "👋 Привет! Я помогу вам проанализировать тональность текста. Хотите продолжить?", 
      isBot: true 
    }] : []);
    setUserInput('');
    setWaitingForResponse(true);
    setShowNextMessages(false);
    setPosition(INITIAL_POSITION);
  };

  return {
    messages,
    isOpen,
    userInput,
    waitingForResponse,
    showNextMessages,
    position,
    isDragging,
    addMessage,
    resetChat,
    setIsOpen,
    setUserInput,
    setWaitingForResponse,
    setShowNextMessages,
    setPosition,
    setIsDragging
  };
}; 