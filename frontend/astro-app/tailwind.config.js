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
      fontFamily: {
        display: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        brand: {
          amber: '#FBBF24',
          glow: '#FB923C',
          orange: '#F97316',
          deep: '#EA580C',
        },
        cream: '#FFF8F1',
        ink: {
          DEFAULT: '#0E1116',
          soft: '#171B22',
          line: '#232A34',
        },
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(249, 115, 22, 0.45)',
        card: '0 10px 40px -12px rgba(15, 17, 22, 0.12)',
        lift: '0 24px 60px -20px rgba(234, 88, 12, 0.35)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        floaty: {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(3deg)' },
        },
        floatySlow: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-22px)' },
        },
        gradientShift: {
          '0%,100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(120%)' },
        },
        pulseGlow: {
          '0%,100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.06)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        spinSlow: { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
        bob: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-out forwards',
        floaty: 'floaty 6s ease-in-out infinite',
        floatySlow: 'floatySlow 9s ease-in-out infinite',
        gradientShift: 'gradientShift 6s ease infinite',
        shimmer: 'shimmer 2.4s ease-in-out infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
        marquee: 'marquee 28s linear infinite',
        spinSlow: 'spinSlow 26s linear infinite',
        bob: 'bob 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
