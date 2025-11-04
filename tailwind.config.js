/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
      extend: {
        colors: {
          primary: "#60e08e",
          secondary: "#45FFCA",
          light: "#F6F7FF",
          dark: "#0B0B0D",
          gray: "#141515"
        },
        fontFamily: {
          sarpanch: ['Sarpanch', "sans-serif"],
          chakra: ["'Chakra Petch'", "sans-serif"],
          poppins: ['Poppins', "sans-serif"],
        },
      },
    },
    plugins: [],
}

