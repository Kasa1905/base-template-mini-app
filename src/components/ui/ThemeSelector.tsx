import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

export function ThemeSelector() {
  const { currentTheme, changeTheme, themes, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (themeName: string) => {
    changeTheme(themeName);
    setIsOpen(false);
  };

  const themeOptions = Object.entries(themes);
  const currentThemeData = themes[currentTheme] || themes.dark || { name: 'Unknown' };

  // Theme icons mapping - only light and dark
  const themeIcons: { [key: string]: string } = {
    dark: '🌙',
    light: '☀️'
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Always visible theme button with theme-aware design */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center space-x-2 px-4 py-2.5 rounded-full backdrop-blur-sm shadow-lg border transition-all duration-300 font-medium z-50 hover:scale-105"
        style={{ 
          backgroundColor: theme.bgSecondary,
          color: theme.text,
          borderColor: theme.border
        }}
        onMouseEnter={(e) => {
          const hoverBg = theme.theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(59, 130, 246, 0.1)';
          const hoverShadow = theme.theme === 'dark' ? '0 10px 25px rgba(59, 130, 246, 0.15)' : '0 10px 25px rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.backgroundColor = hoverBg;
          e.currentTarget.style.boxShadow = hoverShadow;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = theme.bgSecondary;
          e.currentTarget.style.boxShadow = '';
        }}
        title={`Current theme: ${currentThemeData.name}`}
      >
        <span className="text-lg">{themeIcons[currentTheme] || '🎨'}</span>
        <span className="text-sm hidden sm:inline">Theme</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div 
          className="absolute top-full mt-3 right-0 backdrop-blur-xl border rounded-2xl shadow-2xl z-50 min-w-[200px] overflow-hidden"
          style={{ 
            backgroundColor: theme.bgSecondary,
            borderColor: theme.border 
          }}
        >
          <div className="py-3">
            <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b" style={{ color: theme.textSecondary, borderColor: theme.border }}>
              Choose Theme
            </div>
            {themeOptions.map(([key, themeData]) => (
              <button
                key={key}
                onClick={() => handleThemeChange(key)}
                className={`w-full flex items-center space-x-4 px-4 py-4 text-left transition-all duration-300 backdrop-blur-sm ${
                  currentTheme === key ? 'border-l-4 border-blue-500' : ''
                }`}
                style={{ 
                  backgroundColor: currentTheme === key ? (theme.theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)') : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (currentTheme !== key) {
                    const hoverBg = theme.theme === 'dark' ? 'rgba(75, 85, 99, 0.3)' : 'rgba(243, 244, 246, 0.5)';
                    e.currentTarget.style.backgroundColor = hoverBg;
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentTheme !== key) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  } else {
                    e.currentTarget.style.backgroundColor = theme.theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)';
                  }
                }}
              >
                <span className="text-xl">{themeIcons[key] || '🎨'}</span>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${currentTheme === key ? 'text-blue-500' : ''}`} style={{ color: currentTheme === key ? '#3b82f6' : theme.text }}>
                    {(themeData as any).name}
                  </div>
                  <div className="text-xs" style={{ color: theme.textSecondary }}>
                    {key === 'dark' && 'Dark gradient theme'}
                    {key === 'light' && 'Light gradient theme'}
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-2 border-white shadow-sm"></div>
                {currentTheme === key && (
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}
