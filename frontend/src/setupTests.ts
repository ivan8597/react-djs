import '@testing-library/jest-dom';

// Мокаем scrollTo для jsdom окружения
if (typeof window !== 'undefined') {
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
    value: jest.fn(),
    writable: true
  });
} 