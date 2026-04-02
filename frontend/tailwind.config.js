/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0C0A06',
        surface: '#1e1b16',
        primary: {
          DEFAULT: '#D4A853',
          hover: '#f2c36b',
          dim: 'rgba(212, 168, 83, 0.15)',
        },
        accent: {
          DEFAULT: '#C9B896',
          hover: '#d6c5a2',
        },
        text: {
          main: '#e8e1d9',
          muted: '#9b8f7e',
        },
        border: '#4e4637',
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
