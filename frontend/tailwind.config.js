/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/game/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      satoshi: ["Satoshi", "sans-serif"],
    },
    extend: {
      colors: {
        white: "#FFFFFF",
        black: "#1C2434",
        dark: "#1c002b",
        primary: "#141d26",
        secondary: "#e8a3ff",
        stroke: "#E2E8F0",
        glass: 'rgba(255, 255, 255, 0.1)',
        green: "#65b520",
        blue:"#2450a6",
      },
    },
  },
  plugins: [],
};
