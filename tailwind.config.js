/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // BaddBeatz custom colors
        'cyber-red': '#ff0033',
        'cyber-cyan': '#00ffff',
        'cyber-green': '#00ff00',
        'neon-pink': '#ff1493',
        'electric-blue': '#1e90ff',
      },
      fontFamily: {
        inter: ['var(--font-inter)'],
        orbitron: ['var(--font-orbitron)'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'cyber-grid': 'cyber-grid 20s linear infinite',
        'glitch': 'glitch 3s infinite linear alternate-reverse',
        'audio-wave': 'audio-wave 1s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'zoom-in': 'zoom-in 0.3s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 10px currentColor' },
          '100%': { textShadow: '0 0 20px currentColor, 0 0 30px currentColor' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px var(--color-primary)' },
          '50%': { boxShadow: '0 0 20px var(--color-primary), 0 0 30px var(--color-primary)' },
        },
        'cyber-grid': {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(50px, 50px)' },
        },
        glitch: {
          '0%, 14%, 15%, 25%, 26%, 49%, 50%, 63%, 64%, 99%, 100%': {
            transform: 'translateX(0)',
          },
          '1%, 13%, 16%, 24%, 27%, 48%, 51%, 62%, 65%, 98%': {
            transform: 'translateX(-2px)',
          },
        },
        'audio-wave': {
          '0%, 100%': { height: '4px' },
          '50%': { height: '20px' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'zoom-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'neon': '0 0 10px currentColor',
        'neon-strong': '0 0 20px currentColor, 0 0 40px currentColor',
        'cyber': '0 4px 15px rgba(255, 0, 51, 0.4)',
        'cyber-hover': '0 8px 25px rgba(255, 0, 51, 0.6)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cyber-grid': `
          linear-gradient(rgba(255, 0, 51, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 0, 51, 0.1) 1px, transparent 1px)
        `,
        'noise': `
          radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)
        `,
      },
      backgroundSize: {
        'grid': '50px 50px',
        'noise': '20px 20px',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
};

module.exports = config;