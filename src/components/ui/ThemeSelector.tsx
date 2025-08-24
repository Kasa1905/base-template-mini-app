import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

export function ThemeSelector() {
  const { currentTheme, changeTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (themeName: string) => {
    console.log('Changing theme from', currentTheme, 'to', themeName);
    changeTheme(themeName);
    setIsOpen(false);
    
    // Force a small delay to ensure theme change is applied
    setTimeout(() => {
      console.log('Theme changed to:', themeName);
    }, 100);
  };

  const themeOptions = Object.entries(themes);
  const currentThemeData = themes[currentTheme];

  // Theme icons mapping
  const themeIcons: { [key: string]: string } = {
    dark: '🌙',
    light: '☀️', 
    blue: '🌊',
    purple: '🔮',
    green: '🌿'
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
      {/* Always visible theme button with high contrast */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white text-gray-800 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 font-medium z-50"
        title={`Current theme: ${currentThemeData.name}`}
      >
        <span className="text-lg">{themeIcons[currentTheme] || '🎨'}</span>
        <span className="text-sm hidden sm:inline">Theme</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[180px] overflow-hidden">
          <div className="py-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
              Choose Theme
            </div>
            {themeOptions.map(([key, themeData]) => (
              <button
                key={key}
                onClick={() => handleThemeChange(key)}
                className={`w-full flex items-center space-x-3 px-3 py-3 text-left transition-colors duration-200 hover:bg-gray-50 ${
                  currentTheme === key ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <span className="text-lg">{themeIcons[key] || '🎨'}</span>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${currentTheme === key ? 'text-blue-700' : 'text-gray-700'}`}>
                    {(themeData as any).name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {key === 'dark' && 'Dark mode'}
                    {key === 'light' && 'Light mode'}
                    {key === 'blue' && 'Ocean theme'}
                    {key === 'purple' && 'Magic theme'}
                    {key === 'green' && 'Nature theme'}
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full ${(themeData as any).bg} border-2 border-gray-300`}></div>
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
