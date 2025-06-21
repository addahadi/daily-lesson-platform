/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        orange: {
          1: "#FF9500",
        },
        "white-1": "#f1f3f6",
        "white-2": "#e3e6ed",
        "shadow-dark": "#d1d9e6",
        "shadow-light": "#ffffff",
        black : {
          1 : "#242424"
        }
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

