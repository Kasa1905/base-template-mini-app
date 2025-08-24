import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  dark: {
    name: 'Dark',
    bg: 'bg-gray-900',
    bgSecondary: 'bg-gray-800',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    accent: 'bg-blue-600',
    border: 'border-gray-700'
  },
  light: {
    name: 'Light', 
    bg: 'bg-white',
    bgSecondary: 'bg-gray-50',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    accent: 'bg-blue-600',
    border: 'border-gray-200'
  },
  blue: {
    name: 'Blue',
    bg: 'bg-blue-900',
    bgSecondary: 'bg-blue-800', 
    text: 'text-blue-100',
    textSecondary: 'text-blue-200',
    accent: 'bg-blue-500',
    border: 'border-blue-700'
  },
  purple: {
    name: 'Purple',
    bg: 'bg-purple-900',
    bgSecondary: 'bg-purple-800',
    text: 'text-purple-100', 
    textSecondary: 'text-purple-200',
    accent: 'bg-purple-500',
    border: 'border-purple-700'
  },
  green: {
    name: 'Green',
    bg: 'bg-green-900',
    bgSecondary: 'bg-green-800',
    text: 'text-green-100',
    textSecondary: 'text-green-200', 
    accent: 'bg-green-500',
    border: 'border-green-700'
  }
};

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('dark');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('prootvault-theme') || 'dark';
      setCurrentTheme(saved);
    }
  }, []);

  const changeTheme = (themeName) => {
    setCurrentTheme(themeName);
    if (typeof window !== 'undefined') {
      localStorage.setItem('prootvault-theme', themeName);
    }
  };

  const theme = themes[currentTheme] || themes.dark;

  return (
    <ThemeContext.Provider value={{ currentTheme, theme, changeTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
