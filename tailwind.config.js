/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      cubic: ['Cubic11', 'sans-serif'],
    },
    extend: {
      boxShadow: {
        'custom-5px': '5px 5px 0px rgba(0, 0, 0, 1)',
        'custom-3px': '3px 3px 0px rgba(0, 0, 0, 1)',
      },
    },
  },
  plugins: [],
}