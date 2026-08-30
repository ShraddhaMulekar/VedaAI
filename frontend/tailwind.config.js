/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FDF0E9",
          100: "#FBDFCF",
          400: "#F47C4C",
          500: "#F0602E",
          600: "#E44E1E",
          700: "#C13F18",
        },
      },
    },
  },
  plugins: [],
}

