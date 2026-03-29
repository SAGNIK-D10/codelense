import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function NavBar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)]">
      <div className="backdrop-blur-xl" style={{ background: 'var(--nav-bg)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/20">
              C
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>
              CodeLense
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs font-mono tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
              AI Codebase Explainer
            </div>
            <button
              onClick={toggleTheme}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                background: 'var(--toggle-bg)',
                border: '1px solid var(--border)',
              }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun size={18} style={{ color: 'var(--text-primary)' }} />
              ) : (
                <Moon size={18} style={{ color: 'var(--text-primary)' }} />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen transition-colors duration-500" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
          <NavBar />

          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
