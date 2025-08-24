import { useTheme } from '../context/ThemeContext';
import { ThemeSelector } from '../components/ui/ThemeSelector';

export default function ThemeTest() {
  const { theme, currentTheme, themes } = useTheme();

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} p-8`}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Theme Testing Page</h1>
        
        {/* Theme Selector */}
        <div className="mb-8">
          <h2 className="text-xl mb-4">Theme Selector:</h2>
          <ThemeSelector />
        </div>

        {/* Current Theme Info */}
        <div className={`${theme.bgSecondary} p-6 rounded-lg mb-8`}>
          <h2 className="text-xl mb-4">Current Theme Info:</h2>
          <p><strong>Current Theme:</strong> {currentTheme}</p>
          <p><strong>Theme Name:</strong> {theme.name}</p>
          <p><strong>Background:</strong> {theme.bg}</p>
          <p><strong>Text:</strong> {theme.text}</p>
          <p><strong>Accent:</strong> {theme.accent}</p>
        </div>

        {/* Color Swatches */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className={`${theme.bg} ${theme.border} border p-4 rounded-lg`}>
            <p>Primary Background</p>
          </div>
          <div className={`${theme.bgSecondary} ${theme.border} border p-4 rounded-lg`}>
            <p>Secondary Background</p>
          </div>
          <div className={`${theme.accent} text-white p-4 rounded-lg`}>
            <p>Accent Color</p>
          </div>
          <div className={`${theme.text} p-4 rounded-lg border ${theme.border}`}>
            <p>Text Color</p>
          </div>
        </div>

        {/* All Available Themes */}
        <div className={`${theme.bgSecondary} p-6 rounded-lg`}>
          <h2 className="text-xl mb-4">All Available Themes:</h2>
          <div className="space-y-2">
            {Object.entries(themes).map(([key, themeData]) => (
              <div key={key} className="flex items-center space-x-4">
                <span className={currentTheme === key ? 'font-bold' : ''}>{key}</span>
                <span className="text-sm">{themeData.name}</span>
                <div className={`w-4 h-4 rounded ${themeData.bg} border`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* CSS Variables Test */}
        <div className="mt-8 p-6 border rounded-lg" style={{
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          borderColor: 'var(--border-color)'
        }}>
          <h2 className="text-xl mb-2">CSS Variables Test</h2>
          <p>This box uses CSS variables. If theme switching works, this should change colors too.</p>
          <div className="bg-primary text-primary p-2 mt-2 rounded">
            Using .bg-primary and .text-primary utility classes
          </div>
        </div>
      </div>
    </div>
  );
}
