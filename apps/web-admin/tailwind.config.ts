import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#f97316',
          'orange-light': '#fed7aa',
          'orange-dark': '#ea580c',
        },
      },
    },
  },
  plugins: [],
};

export default config;
