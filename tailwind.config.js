/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        clash: ["ClashDisplay", "sans-serif"],
      },
      colors: {
        "heading": "#192230",
        "normal": "#171e29",
        "second": "#acb5c4",
        "theme-lavender": "#6359e7",
        "theme-blue": "#59c8f1",
        "theme-orange": "#fb7e36",
        "theme-pink": "#fd5271",
        "theme-green": "05958c",
        "card": "#f2f4f7"
      },
      fontSize: {
        '4xl': '2.441rem',
        '5xl': '3.052rem',
        '6xl': '3.815rem',
        '7xl': '4.769rem',
        '8xl': '5.961rem',
      }
    },
  },
  plugins: [],
};
