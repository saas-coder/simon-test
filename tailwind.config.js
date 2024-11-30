/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6563fc',
          hover: '#5452d6',
          light: 'rgba(101, 99, 252, 0.1)',
        },
        blue: {
          600: '#6563fc',
          700: '#5452d6',
          900: '#3f3ec4',
          100: 'rgba(101, 99, 252, 0.1)',
        }
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
};