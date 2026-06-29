/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'finpay-dark': '#050505',
        'finpay-accent': '#00e6a4'
      }
    },
  },
  plugins: [],
}
