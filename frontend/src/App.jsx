import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Sun, Moon, ArrowUpRight } from 'lucide-react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function NavBar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="backdrop-blur-xl" style={{ background: 'var(--nav-bg)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-700 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-amber-500/20">
              C
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>
              CodeLense
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'Home', path: '/' },
              { label: 'About', path: '/#about' },
              { label: 'Features', path: '/#features' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.path}
                className="text-sm font-medium transition-colors duration-200 hover:opacity-100"
                style={{
                  color: 'var(--text-secondary)',
                  opacity: location.pathname === item.path ? 1 : 0.7,
                }}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                background: 'var(--toggle-bg)',
                border: '1px solid var(--border)',
              }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun size={16} style={{ color: 'var(--text-primary)' }} />
              ) : (
                <Moon size={16} style={{ color: 'var(--text-primary)' }} />
              )}
            </button>
            <a
              href="#get-started"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #D4A853, #8B6914)',
                color: '#fff',
              }}
            >
              Get Started
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowUpRight size={12} />
              </div>
            </a>
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
