/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
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
    }
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;