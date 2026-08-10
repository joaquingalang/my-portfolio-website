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
          // Elevated planes above `dark`. Named `surface` rather than `gray` so
          // Tailwind's own gray-50..950 scale stays available.
          surface: "#141515",
          "surface-2": "#1B1D1C",
        },
        fontFamily: {
          sarpanch: ['Sarpanch', "sans-serif"],
          chakra: ["'Chakra Petch'", "sans-serif"],
          poppins: ['Poppins', "sans-serif"],
        },
        transitionTimingFunction: {
          // Exponential deceleration — reads as physical, never springy.
          "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
          "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        },
        keyframes: {
          slideDown: {
            from: { opacity: "0", transform: "translateY(-8px)" },
            to: { opacity: "1", transform: "translateY(0)" },
          },
          reveal: {
            from: { opacity: "0", transform: "translateY(16px)" },
            to: { opacity: "1", transform: "translateY(0)" },
          },
        },
        animation: {
          slideDown: "slideDown .22s cubic-bezier(0.16, 1, 0.3, 1)",
          reveal: "reveal .6s cubic-bezier(0.16, 1, 0.3, 1) both",
        },
      },
    },
    plugins: [],
}
