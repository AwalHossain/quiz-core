/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // Custom colors from the image
        custom: {
          red: 'hsl(var(--custom-red))',
          green: 'hsl(var(--custom-green))',
          'green-light': 'hsl(var(--custom-green-light))',
          white: 'hsl(var(--custom-white))',
          'bg-light': 'hsl(var(--custom-bg-light))',
          black: 'hsl(var(--custom-black))',
          'gray-strong': 'hsl(var(--custom-gray-strong))',
          'content-tertiary': 'hsl(var(--custom-content-tertiary))',
          'content-secondary': 'hsl(var(--custom-content-secondary))',
          'content-white': 'hsl(var(--custom-content-white))',
          'border-gray-light': 'hsl(var(--custom-border-gray-light))',
          'border-strong-gray': 'hsl(var(--custom-border-strong-gray))',
          'border-green-gray': 'hsl(var(--custom-border-green-gray))',
          'border-green-light': 'hsl(var(--custom-border-green-light))',
          'avatar-bg': 'hsl(var(--custom-avatar-bg))',
          'avatar-text': 'hsl(var(--custom-avatar-text))',
        },
      },
      // ... rest of your configuration
      fontSize: {
        'heading-extra-large': ['54px', { lineHeight: '110%', letterSpacing: '-3.1%', fontWeight: '600' }],
        'heading-large': ['40px', { lineHeight: '110%', letterSpacing: '-3.1%', fontWeight: '500' }],
        'heading-medium': ['38px', { lineHeight: '110%', letterSpacing: '-3.1%', fontWeight: '500' }],
        'heading-small': ['30px', { lineHeight: '110%', letterSpacing: '-3.1%', fontWeight: '500' }],
        'label-28': ['28px', { lineHeight: '110%', letterSpacing: '-3.1%', fontWeight: '500' }],
        'label-24': ['24px', { lineHeight: '130%', letterSpacing: '-0.5%', fontWeight: '600' }],
        'label-22-medium': ['22px', { lineHeight: '110%', letterSpacing: '-3.1%', fontWeight: '500' }],
        'label-22-semibold': ['22px', { lineHeight: '110%', letterSpacing: '-3.1%', fontWeight: '600' }],
        'label-20-regular': ['20px', { lineHeight: '100%', letterSpacing: '-3.1%', fontWeight: '400' }],
        'label-20-medium': ['20px', { lineHeight: '110%', letterSpacing: '-3.1%', fontWeight: '500' }],
        'label-17-regular': ['17px', { lineHeight: '110%', letterSpacing: '-1.5%', fontWeight: '400' }],
        'label-17-medium': ['17px', { lineHeight: '110%', letterSpacing: '-1.5%', fontWeight: '500' }],
        'label-18-regular': ['18px', { lineHeight: '100%', letterSpacing: '-0.5%', fontWeight: '400' }],
        'label-18-semibold': ['18px', { lineHeight: '130%', letterSpacing: '-0.5%', fontWeight: '600' }],
        'label-menu-16-bold': ['16px', { lineHeight: '100%', letterSpacing: '-1.1%', fontWeight: '700' }],
        'label-menu-16-strong': ['16px', { lineHeight: '100%', letterSpacing: '-1.1%', fontWeight: '600' }],
        'label-menu-16-regular': ['16px', { lineHeight: '100%', letterSpacing: '-1.1%', fontWeight: '400' }],
        'body-20': ['20px', { lineHeight: '135%', letterSpacing: '-1%', fontWeight: '400' }],
        'body-17': ['17px', { lineHeight: '155%', letterSpacing: '-1%', fontWeight: '400' }],
        'body-14': ['14px', { lineHeight: '130%', letterSpacing: '-1%', fontWeight: '400' }],
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
