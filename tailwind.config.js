/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          'primary': '#4ADE80', // Minty Green
          'accent': '#818CF8',  // Soft Blue/Purple
        },
        'dark': {
          'primary': '#111827',   // Deep Charcoal
          'secondary': '#1F2937', // Lighter Charcoal
        },
        'text': {
          'primary': '#F9FAFB',   // Off-white
          'secondary': '#9CA3AF', // Light Gray
        },
        'border': '#374151',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backdrop_blur: {
        'xs': '2px',
      },
      boxShadow: {
        'glow-primary': '0 0 15px 5px rgba(74, 222, 128, 0.2)',
        'glow-accent': '0 0 15px 5px rgba(129, 140, 248, 0.2)',
      }
    },
  },
  plugins: [],
}