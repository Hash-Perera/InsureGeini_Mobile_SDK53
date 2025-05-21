/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "custom-blue1": "#1978bb",
        "custom-blue2": "#3cc6ef",
        gray800: "#1f2937",
        gray200: "#e5e7eb",
        gray100: "#f3f4f6",
      },
    },
  },
  plugins: [],
};
