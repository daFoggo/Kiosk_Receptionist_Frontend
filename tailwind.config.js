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
        heading_text: "#192230",
        normal_text: "#171e29",
        second_text: "#acb5c4",
        theme_lavender: "#6359e7",
        theme_blue: "#59c8f1",
        theme_orange: "#fb7e36",
        theme_pink: "#fd5271",
        tghheme_green: "05958c",
        card_bg: "#f2f4f7"
      }
    },
  },
  plugins: [],
};
