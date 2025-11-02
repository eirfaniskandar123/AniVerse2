
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./{,pages,components,App}/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'eerie-black': '#222222',
        'pantone-red': '#E63946',
      }
    },
  },
  plugins: [],
}
