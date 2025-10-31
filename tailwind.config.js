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
          'tertiary': '#374151', // For borders and dividers
        },
        'text': {
          'primary': '#F9FAFB',   // Off-white
          'secondary': '#9CA3AF', // Light Gray
        },
        'border': '#374151',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        // ARCHITECT'S TOUCH: Adding a display font for impactful headings.
        display: ['"Clash Display"', 'sans-serif'],
      },
      backdrop_blur: {
        'xs': '2px',
        'xl': '24px',
      },
      boxShadow: {
        'glow-primary': '0 0 20px 5px rgba(74, 222, 128, 0.15)',
        'glow-accent': '0 0 20px 5px rgba(129, 140, 248, 0.15)',
      },
      // ARCHITECT'S TOUCH: Defining keyframes for our bespoke animations.
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}