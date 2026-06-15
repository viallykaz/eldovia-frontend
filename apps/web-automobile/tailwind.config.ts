import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        azure: {
          950: '#020B18',
          900: '#040F20',
          800: '#071628',
          700: '#0B1E3A',
          600: '#0F2952',
          500: '#1A3A6E',
          400: '#2B5499',
        },
        brand: {
          orange: '#F97316',
          amber: '#FBBF24',
        },
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(249,115,22,0.15) 0%, transparent 60%)',
        'orange-glow': 'radial-gradient(circle, rgba(249,115,22,0.3) 0%, transparent 70%)',
        'azure-glow': 'radial-gradient(circle, rgba(15,41,82,0.8) 0%, transparent 70%)',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.5)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'gradient-x': 'gradient-x 4s ease infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        ticker: 'ticker 30s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
