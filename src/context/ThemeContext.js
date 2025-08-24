import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  dark: {
    name: 'Dark',
    bg: 'bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800',
    bgSecondary: 'bg-gray-800/60 backdrop-blur-sm',
    text: 'text-gray-100',
    textSecondary: 'text-gray-200',
    accent: 'bg-gradient-to-r from-blue-500 to-purple-600',
    accentHover: 'hover:from-blue-600 hover:to-purple-700',
    border: 'border-gray-700/50',
    shadow: 'shadow-xl shadow-gray-900/30'
  },
  light: {
    name: 'Light',
    bg: 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
    bgSecondary: 'bg-white/90 backdrop-blur-sm',
    text: 'text-gray-900',
    textSecondary: 'text-gray-700',
    accent: 'bg-gradient-to-r from-blue-600 to-indigo-600',
    accentHover: 'hover:from-blue-700 hover:to-indigo-700',
    border: 'border-gray-200/60',
    shadow: 'shadow-xl shadow-gray-200/40'
  }
};

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('dark');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('prootvault-theme') || 'dark';
      // Ensure the saved theme exists in our themes object
      const validTheme = themes[saved] ? saved : 'dark';
      setCurrentTheme(validTheme);
      
      // Apply the theme class to body on initial load
      document.body.classList.remove('theme-dark', 'theme-light');
      document.body.classList.add(`theme-${validTheme}`);
    }
  }, []);

  const changeTheme = (themeName) => {
    // Validate theme exists
    if (!themes[themeName]) {
      console.error('❌ Invalid theme:', themeName, 'Falling back to dark');
      themeName = 'dark';
    }
    
    setCurrentTheme(themeName);
    
    // Apply theme class to document body for CSS variables
    if (typeof window !== 'undefined') {
      // Remove all existing theme classes
      document.body.classList.remove('theme-dark', 'theme-light');
      // Add the new theme class
      document.body.classList.add(`theme-${themeName}`);
      
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
