/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          600: '#500000',
          700: '#3c0000'
        }
      }
    },
  },
  plugins: [],
}

