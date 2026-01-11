import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Instagram-inspired color palette
        ig: {
          black: '#000000',
          dark: '#121212',
          surface: '#1a1a1a',
          card: '#262626',
          border: '#363636',
          'border-light': '#dbdbdb',
          text: '#fafafa',
          'text-secondary': '#a8a8a8',
          link: '#e0f1ff',
        },
        // Instagram gradient colors
        gradient: {
          pink: '#E1306C',
          purple: '#833AB4',
          orange: '#F77737',
          yellow: '#FCAF45',
          magenta: '#C13584',
          red: '#F56040',
        },
        // Action colors
        action: {
          like: '#ed4956',
          save: '#fafafa',
          verified: '#0095f6',
          blue: '#0095f6',
        },
        // Category colors (vibrant for dark mode)
        category: {
          food: '#22c55e',
          transport: '#3b82f6',
          entertainment: '#a855f7',
          shopping: '#f59e0b',
          bills: '#ef4444',
          health: '#ec4899',
          other: '#6b7280',
        },
      },
      backgroundImage: {
        // Instagram signature gradient
        'ig-gradient': 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
        'ig-gradient-vibrant': 'linear-gradient(45deg, #FCAF45 0%, #F77737 25%, #E1306C 50%, #C13584 75%, #833AB4 100%)',
        'ig-gradient-subtle': 'linear-gradient(135deg, #833AB4 0%, #E1306C 50%, #F77737 100%)',
        'ig-stories-gradient': 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
        // Utility gradients
        'gradient-dark': 'linear-gradient(180deg, #000000 0%, #121212 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-bottom': 'slideInBottom 0.25s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-heart': 'pulseHeart 0.3s ease-in-out',
        'stories-spin': 'storiesSpin 1.5s linear infinite',
        'shimmer': 'shimmer 1.5s infinite',
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
        slideInBottom: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseHeart: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
        storiesSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'ig': '0 1px 2px rgba(0, 0, 0, 0.1)',
        'ig-md': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'ig-lg': '0 8px 24px rgba(0, 0, 0, 0.2)',
        'ig-glow': '0 0 20px rgba(225, 48, 108, 0.3)',
      },
      borderRadius: {
        'ig': '8px',
        'ig-lg': '12px',
        'ig-xl': '16px',
        'ig-2xl': '24px',
      },
      fontFamily: {
        'ig': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
