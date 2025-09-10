/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        '18': '4.5rem',
        '20': '5rem',
        '24': '6rem',
        '32': '8rem',
      },
      height: {
        '18': '4.5rem',
        '20': '5rem',
        '24': '6rem',
        '32': '8rem',
      },
      width: {
        '18': '4.5rem',
        '20': '5rem',
        '24': '6rem',
        '32': '8rem',
      }
    },
  },
  plugins: [],
};
