/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}",

    "./src/pages/**/*.{astro,html,js,jsx,ts,tsx}",
    "./src/components/**/*.{astro,html,js,jsx,ts,tsx}",
    "./src/layouts/**/*.{astro,html,js,jsx,ts,tsx}",

    "./index.html",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};

