/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Syne', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        surface: {
          0:   '#060612',
          50:  '#0a0a1e',
          100: '#0d0d28',
          200: '#111130',
          300: '#1a1a40',
          400: '#252550',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #4f46e5, #7c3aed)',
        'gradient-success': 'linear-gradient(135deg, #059669, #10b981)',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        shimmer: 'shimmer 1.5s infinite',
        'fade-up': 'fadeUp 0.5s ease both',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        brand:  '0 8px 24px rgba(99,102,241,0.35)',
        glass:  '0 8px 32px rgba(0,0,0,0.4)',
        card:   '0 16px 40px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}
