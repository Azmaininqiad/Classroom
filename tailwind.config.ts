import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'welcome-gradient': 'var(--welcome-gradient-background)',
        'welcome-primary-gradient': 'var(--welcome-gradient-primary)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      spacing: {
        'welcome-xs': 'var(--welcome-spacing-xs)',
        'welcome-sm': 'var(--welcome-spacing-sm)',
        'welcome-md': 'var(--welcome-spacing-md)',
        'welcome-lg': 'var(--welcome-spacing-lg)',
        'welcome-xl': 'var(--welcome-spacing-xl)',
        'welcome-2xl': 'var(--welcome-spacing-2xl)',
      },
      fontSize: {
        'welcome-hero': ['var(--welcome-text-hero)', { lineHeight: '1.1', fontWeight: '700' }],
        'welcome-hero-mobile': ['var(--welcome-text-hero-mobile)', { lineHeight: '1.1', fontWeight: '700' }],
        'welcome-subtitle': ['var(--welcome-text-subheadline)', { lineHeight: '1.4', fontWeight: '500' }],
        'welcome-subtitle-mobile': ['var(--welcome-text-subheadline-mobile)', { lineHeight: '1.4', fontWeight: '500' }],
        'welcome-body': ['var(--welcome-text-body)', { lineHeight: '1.6', fontWeight: '400' }],
        'welcome-body-mobile': ['var(--welcome-text-body-mobile)', { lineHeight: '1.6', fontWeight: '400' }],
        'welcome-feature-title': ['var(--welcome-text-feature-title)', { lineHeight: '1.3', fontWeight: '600' }],
        'welcome-feature-desc': ['var(--welcome-text-feature-desc)', { lineHeight: '1.5', fontWeight: '400' }],
        'welcome-button': ['var(--welcome-text-button)', { fontWeight: '600' }],
      },
      screens: {
        'welcome-mobile': '320px',
        'welcome-tablet': '768px',
        'welcome-desktop': '1024px',
      },
      boxShadow: {
        'welcome-glow-primary': 'var(--welcome-glow-primary)',
        'welcome-glow-accent': 'var(--welcome-glow-accent)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        // Welcome page specific colors
        welcome: {
          'bg-start': 'var(--welcome-bg-start)',
          'bg-end': 'var(--welcome-bg-end)',
          'primary-start': 'var(--welcome-primary-start)',
          'primary-end': 'var(--welcome-primary-end)',
          'accent': 'var(--welcome-accent)',
          'text-primary': 'var(--welcome-text-primary)',
          'text-secondary': 'var(--welcome-text-secondary)',
          'card-bg': 'var(--welcome-card-bg)',
          'border': 'var(--welcome-border)',
        },
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: 'var(--welcome-glow-primary)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 106, 0, 0.5)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
        'fade-in-up': 'fade-in-up 0.8s ease-out',
        'gradient-shift': 'gradient-shift 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
