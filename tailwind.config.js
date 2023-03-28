/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './node_modules/flowbite-react/**/*.js',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'yellow-100': '#ffc657',
        'blue-100': '#5362ac',
        'white-15': 'rgba(255,255,255,0.15)',
        'custom-1': '#FFF9F6',
        site: 'rgb(255,249,246)',
      },
      fontSize: {
        12: '12px',
      },
      keyframes: {
        fade: {
          '0%': { opacity: 0 },
          '50%': { opacity: 0.5 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        'fade-in': 'fade 3s ease-in-out',
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};
