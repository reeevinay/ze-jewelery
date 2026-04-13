/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fdf9ef',
          100: '#faf0d4',
          200: '#f4dda3',
          300: '#ecc567',
          400: '#e3a832',
          500: '#c8881a',
          600: '#a96a12',
          700: '#864f10',
          800: '#6d3f14',
          900: '#5c3513',
        },
        ivory: {
          50:  '#fefef9',
          100: '#fdfcf0',
          200: '#faf7df',
          300: '#f5efbf',
          DEFAULT: '#f5f0e8',
        },
        charcoal: {
          DEFAULT: '#1a1a1a',
          light: '#2d2d2d',
          muted: '#6b6b6b',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-jost)', 'system-ui', 'sans-serif'],
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      fontSize: {
        '2xs': '0.65rem',
        display: ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['6rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'gold-pulse': 'goldPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        goldPulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      boxShadow: {
        'gold': '0 4px 24px -4px rgba(200, 136, 26, 0.25)',
        'gold-lg': '0 8px 40px -8px rgba(200, 136, 26, 0.35)',
        'luxury': '0 20px 60px -15px rgba(0, 0, 0, 0.15)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #e3a832, #c8881a, #a96a12)',
        'gold-shimmer': 'linear-gradient(90deg, transparent, rgba(227,168,50,0.3), transparent)',
        'ivory-gradient': 'linear-gradient(180deg, #fefef9, #f5f0e8)',
      },
    },
  },
  plugins: [],
};
