import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        zuzu: {
          teal: '#0D9488',
          'teal-light': '#5EEAD4',
          'teal-dark': '#0F766E',
          'teal-bg': '#CCFBF1',
          amber: '#FBBF24',
          'amber-dark': '#D97706',
          screen: '#0F172A',
          bg: '#F0FDFA',
        },
      },
      keyframes: {
        thinkDot: {
          '0%, 60%, 100%': { opacity: '0.2', transform: 'translateY(0px)' },
          '30%': { opacity: '1', transform: 'translateY(-5px)' },
        },
        blinkEye: {
          '0%, 88%, 100%': { transform: 'scaleY(1)' },
          '92%': { transform: 'scaleY(0.05)' },
        },
        gentleBounce: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'think-dot-1': 'thinkDot 1.2s ease-in-out infinite',
        'think-dot-2': 'thinkDot 1.2s ease-in-out 0.2s infinite',
        'think-dot-3': 'thinkDot 1.2s ease-in-out 0.4s infinite',
        'blink-eye': 'blinkEye 4s ease-in-out infinite',
        'gentle-bounce': 'gentleBounce 2.2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'pop-in': 'popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
    },
  },
  plugins: [],
};

export default config;
