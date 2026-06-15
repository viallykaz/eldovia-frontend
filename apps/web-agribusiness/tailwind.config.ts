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
        forest: {
          950: '#020D06',
          900: '#041209',
          800: '#071A0E',
          700: '#0a2318',
          600: '#0d5730',
          500: '#158040',
          400: '#22c55e',
        },
        gray: {
          950: '#0C0C0C',
          900: '#111111',
          850: '#161616',
          800: '#1a1a1a',
        },
        brand: {
          green: '#0d5730',
          lime: '#22c55e',
        },
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(13,87,48,0.25) 0%, transparent 60%)',
        'green-glow': 'radial-gradient(circle, rgba(13,87,48,0.4) 0%, transparent 70%)',
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
        grow: {
          '0%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        'gradient-x': 'gradient-x 4s ease infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        grow: 'grow 1s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
