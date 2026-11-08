/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        faberlic: {
          50: '#fff1f4',
          100: '#ffe4e8',
          200: '#fecdcb',
          300: '#fda4b4',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#cf102d', // Core Faberlic Ruby Red
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        roseGold: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#b76e79', // Rose gold metallic
          600: '#9c545f',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'radial-gradient(circle at 10% 20%, rgba(254, 205, 211, 0.4) 0%, rgba(255, 255, 255, 0) 90%)',
      }
    },
  },
  plugins: [],
};
