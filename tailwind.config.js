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
        "lavender": "#7287fd",
        "heading": "#19194d",
        "primary": "#4c4f69",
        "sub-text1": "#4c4f69",
        "sub-text2": "#6c6f85",
        "base": "	#eff1f5",
        "surface0": "	#bcc0cc",
        "surface1": "#bcc0cc",
        "surface2": "#acb0be",
        "overlay": "#9ca0b0",
        "crust": "#dce0e8",
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
