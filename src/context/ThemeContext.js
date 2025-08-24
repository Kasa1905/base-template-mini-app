import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  dark: {
    name: 'Dark',
    bg: 'bg-black',
    bgSecondary: 'bg-gray-900',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    accent: 'bg-blue-600',
    border: 'border-gray-800'
  },
  light: {
    name: 'Light', 
    bg: 'bg-white',
    bgSecondary: 'bg-gray-50',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    accent: 'bg-blue-600',
    border: 'border-gray-200'
  }
};

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('dark');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('prootvault-theme') || 'dark';
      setCurrentTheme(saved);
      
      // Apply the theme class to body on initial load
      document.body.classList.remove('theme-dark', 'theme-light');
      document.body.classList.add(`theme-${saved}`);
      console.log('🚀 Initial theme applied:', `theme-${saved}`);
    }
  }, []);

  const changeTheme = (themeName) => {
    console.log('🔄 ThemeContext.changeTheme called:', themeName);
    console.log('📦 Available themes:', Object.keys(themes));
    console.log('🎯 Selected theme data:', themes[themeName]);
    
    setCurrentTheme(themeName);
    
    // Apply theme class to document body for CSS variables
    if (typeof window !== 'undefined') {
      // Remove all existing theme classes
      document.body.classList.remove('theme-dark', 'theme-light');
      // Add the new theme class
      document.body.classList.add(`theme-${themeName}`);
      
      localStorage.setItem('prootvault-theme', themeName);
      console.log('💾 Theme saved to localStorage:', localStorage.getItem('prootvault-theme'));
      console.log('🎨 Applied theme class to body:', `theme-${themeName}`);
      console.log('📄 Body classes now:', document.body.className);
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
