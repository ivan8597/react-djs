import { ThemeColors } from '../types';

export const getThemeColors = (isDark: boolean): ThemeColors => ({
  background: isDark ? '#2d2d2d' : '#ffffff',
  text: isDark ? '#e0e0e0' : '#333333',
  primary: '#007bff',
  secondary: isDark ? '#404040' : '#e0e0e0',
  border: isDark ? '#404040' : '#e0e0e0',
}); 