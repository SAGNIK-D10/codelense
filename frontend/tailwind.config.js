/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F172A', // slate-900
        surface: '#1E293B',    // slate-800
        primary: {
          DEFAULT: '#3B82F6',  // blue-500
          hover: '#2563EB',    // blue-600
          dim: 'rgba(59, 130, 246, 0.15)',
        },
        accent: {
          DEFAULT: '#10B981',  // emerald-500
          hover: '#059669',    // emerald-600
        },
        text: {
          main: '#F8FAFC',     // slate-50
          muted: '#94A3B8',    // slate-400
        },
        border: '#334155',     // slate-700
      },
      fontFamily: {
        sans: ['Cinzel', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'IBM Plex Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
