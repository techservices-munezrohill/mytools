/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        // Warm neutral base (cream / linen).
        sand: {
          50: '#fbf8f1',
          100: '#f6efe0',
          200: '#ece1c7',
          300: '#dccea5',
          400: '#c6b482',
        },
        // Brand primary: deep teal. Calming, modern, nothing subcultural.
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
      backgroundImage: {
        'app-gradient':
          'radial-gradient(1200px 600px at 90% -10%, #ccfbf1 0%, transparent 60%), radial-gradient(900px 500px at -10% 110%, #f6efe0 0%, transparent 55%), linear-gradient(180deg, #fbf8f1 0%, #fdfaf3 100%)',
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgba(15, 118, 110, 0.04), 0 4px 14px -2px rgba(15, 118, 110, 0.08)',
        lift: '0 8px 24px -8px rgba(15, 118, 110, 0.25)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 0 0 rgba(217, 119, 6, 0.45)',
          },
          '50%': {
            boxShadow: '0 0 0 10px rgba(217, 119, 6, 0)',
          },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(15, 118, 110, 0.45)' },
          '70%': { boxShadow: '0 0 0 12px rgba(15, 118, 110, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(15, 118, 110, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 500ms ease-out both',
        'bounce-soft': 'bounce-soft 2.4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.2s ease-out infinite',
        'pulse-ring': 'pulse-ring 2.4s ease-out infinite',
        shimmer: 'shimmer 1.4s linear infinite',
      },
    },
  },
  plugins: [],
};
