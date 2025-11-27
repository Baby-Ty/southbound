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
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // South Bound Custom Palette
        'sb-blue': {
          50: '#F4F7FF',
          100: '#E4F0FF',
          200: '#C9E0FF',
        },
        'sb-clay': {
          200: '#E3B8A2',
        },
        'sb-teal': {
          50: '#F0FEFE',
          100: '#E1FDFD', 
          200: '#C3FAFB',
          300: '#AEE6E6', // Primary soft teal
          400: '#7DD3D8',
          500: '#4ABDC6',
          600: '#2D9CA8',
          700: '#1E7A85',
          800: '#155B63',
          900: '#0F4347',
        },
        'sb-orange': {
          50: '#FFF7F0',
          100: '#FFEDE1',
          200: '#FFD6C2',
          300: '#FFC4A3',
          400: '#FFB084',
          500: '#FFA069', // Primary sunset orange
          600: '#FF8A47',
          700: '#E6682A',
          800: '#B8501F',
          900: '#8A3C17',
        },
        'sb-beige': {
          50: '#FEFEFE',
          100: '#FDF6EF', // Primary warm beige
          200: '#FAE6D3',
          300: '#F6D5B7',
          400: '#F2C49B',
          500: '#EEB37F',
          600: '#E89F5F',
          700: '#D4823F',
          800: '#A6652F',
          900: '#78481F',
        },
        'sb-navy': {
          50: '#F8FAFB',
          100: '#F1F5F7',
          200: '#E2EAEF',
          300: '#D4E0E7',
          400: '#8FA0AD',
          500: '#4A5B73',
          600: '#2E405A',
          700: '#1C2D3A', // Primary navy text
          800: '#162028',
          900: '#0F1316',
        },
        'sb-mint': {
          50: '#F8FEFB',
          100: '#F1FDF7',
          200: '#E3FAEF',
          300: '#C2F5D8', // Primary accent mint
          400: '#A1F0C1',
          500: '#7EEBAA',
          600: '#5EE193',
          700: '#3DD67C',
          800: '#2FA862',
          900: '#217A48',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
        handwritten: ['var(--font-kalam)', 'Comic Sans MS', 'cursive'],
        inter: ['Inter', 'sans-serif'],
      },
      // Enhanced Typography
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.6' }],
        'base': ['1rem', { lineHeight: '1.7' }],
        'lg': ['1.125rem', { lineHeight: '1.7' }],
        'xl': ['1.25rem', { lineHeight: '1.7' }],
        '2xl': ['1.5rem', { lineHeight: '1.6' }],
        '3xl': ['1.875rem', { lineHeight: '1.5' }],
        '4xl': ['2.25rem', { lineHeight: '1.4' }],
        '5xl': ['3rem', { lineHeight: '1.3' }],
        '6xl': ['3.75rem', { lineHeight: '1.2' }],
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
        '8xl': ['6rem', { lineHeight: '1.1' }],
        '9xl': ['8rem', { lineHeight: '1.1' }],
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
      // Spacing and Layout
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Animation and Effects
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      // Custom Box Shadows
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.08)',
        'large': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 50px -10px rgba(0, 0, 0, 0.1)',
      },
      // Gradient Backgrounds
      backgroundImage: {
        'sb-gradient': 'linear-gradient(135deg, #AEE6E6 0%, #C2F5D8 100%)',
        'sb-sunset': 'linear-gradient(135deg, #FFA069 0%, #FF8A47 100%)',
        'sb-hero': 'linear-gradient(135deg, #AEE6E6 0%, #FDF6EF 50%, #C2F5D8 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} 