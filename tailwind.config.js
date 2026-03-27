/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: 'class',
  mode: 'jit',
  content: [
    './public/**/*.html',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
  ],
  plugins: [require('@tailwindcss/forms')],
};
