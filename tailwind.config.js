/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8F87F1",    // Purple-blue
        secondary: "#C68EFD",  // Lavender
        accent1: "#E9A5F1",    // Pink
        accent2: "#FED2E2",    // Light pink
      },
    },
  },
  plugins: [],
}