import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        azure: {
          950: '#030A14',
          900: '#050E1A',
          800: '#071627',
          700: '#0A1F3C',
          600: '#0D2850',
          500: '#113264',
        },
        brand: {
          orange: '#F97316',
          amber: '#FBBF24',
        },
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(249,115,22,0.15) 0%, transparent 60%), linear-gradient(to bottom, #050E1A, #030A14)',
        'orange-glow': 'radial-gradient(circle at 50% 50%, rgba(249,115,22,0.3) 0%, transparent 70%)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-clash)', 'sans-serif'],
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(249,115,22,0.3)' },
          '50%': { boxShadow: '0 0 60px rgba(249,115,22,0.6)' },
        },
      },
      animation: {
        'gradient-x': 'gradient-x 4s ease infinite',
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
