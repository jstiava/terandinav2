import tailwindcssAnimate from 'tailwindcss-animate'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  plugins: [tailwindcssAnimate, typography],
  prefix: '',
  safelist: [
    {
      pattern: /w-full/,
      variants: ["sm", "md", "lg", "xl"],
    },
    {
      pattern: /grid-cols-(1|2|3|4)/,
      variants: ["sm", "md", "lg", "xl", "2xl"],
    },
    {
      pattern: /^(p|pt|pb|pl|pr)-(0|1|2|3|4|5|6)$/,
      variants: ["sm", "md", "lg", "xl", "2xl"],
    },
    {
      pattern: /^gap-(0|1|2|3|4|5|6)$/,
      variants: ["sm", "md", "lg", "xl", "2xl"],
    },

    "flex",
    "grid",
    "flex-wrap",

    "capitalize",
    "normal-case",
    "uppercase",

    "bg-[--terandina-teal]/0",
    "bg-[--terandina-teal]/25",
    "bg-[--terandina-teal]/50",
    "bg-[--terandina-teal]/75",
    "bg-[--terandina-teal]",

    "bg-[--terandina-gold]/0",
    "bg-[--terandina-gold]/25",
    "bg-[--terandina-gold]/50",
    "bg-[--terandina-gold]/75",
    "bg-[--terandina-gold]",

    "bg-[--terandina-clay]/0",
    "bg-[--terandina-clay]/25",
    "bg-[--terandina-clay]/50",
    "bg-[--terandina-clay]/75",
    "bg-[--terandina-clay]",

    "backdrop-blur-md"
  ],
  theme: {
    container: {
      center: true,
      padding: {
        '2xl': '2rem',
        DEFAULT: '1rem',
        lg: '2rem',
        md: '2rem',
        sm: '1rem',
        xl: '2rem',
      },
      screens: {
        '2xl': '86rem',
        lg: '64rem',
        md: '48rem',
        sm: '40rem',
        xl: '80rem',
      },
    },
    extend: {
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        fadeContent: 'fadeContent 0.3s ease-out 0.5s forwards',
        "cart-shake": "cart-shake 0.4s ease-in-out",
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        background: 'hsl(var(--background))',
        border: 'hsla(var(--border))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        foreground: 'hsl(var(--foreground))',
        input: 'hsl(var(--input))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        ring: 'hsl(var(--ring))',
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        success: 'hsl(var(--success))',
        error: 'hsl(var(--error))',
        warning: 'hsl(var(--warning))',
      },
      fontFamily: {
        mono: ['var(--font-geist-mono)'],
        sans: ['var(--font-geist-sans)'],
        canela: ['var(--font-canela)', 'serif'],
        archivo: ['var(--font-archivo)'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fadeContent': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        "cart-shake": {
          "0%, 100%": {
            transform: "rotate(0deg)",
          },
          "25%": {
            transform: "rotate(-7deg)",
          },
          "50%": {
            transform: "rotate(6deg)",
          },
          "75%": {
            transform: "rotate(-4deg)",
          },
        },
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--font-archivo)',
            '--tw-prose-headings': 'var(--font-canela)',
            h1: { margin: "0" },
            h2: { margin: "0" },
            h3: { margin: "0" },
            h4: { margin: "0" },
            h5: { margin: "0" },
            h6: { margin: "0" },
          },
        },
        base: {
          css: [
            {
              h1: {
                fontSize: '2.25rem',
                fontWeight: 900,
                margin: 0,
                padding: 0,
                marginBottom: 0
              },
              h2: {
                fontSize: '1.875rem',
                fontWeight: 900,
                margin: 0,
                padding: 0,
                marginBottom: 0
              },
              h3: {
                fontSize: "1.5rem",
                fontWeight: 500,
                margin: 0,
                padding: 0,
                marginBottom: 0
              },
              h4: {
                fontSize: "1.25rem",
                fontWeight: 500,
                margin: 0,
                padding: 0,
                marginBottom: 0
              },
              h5: {
                fontSize: "1.125rem",
                fontWeight: 500,
                margin: 0,
                padding: 0,
                marginBottom: 0
              },
              h5: {
                fontSize: "1rem",
                fontWeight: 500,
                margin: 0,
                padding: 0,
                marginBottom: 0
              }
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: '3rem',
                fontWeight: 900,
                margin: 0,
                padding: 0,
                marginBottom: 0
              },
              h2: {
                fontSize: '2.5rem',
                fontWeight: 900,
                margin: 0,
                padding: 0,
                marginBottom: 0
              },
              h3: {
                fontSize: "2rem",
                fontWeight: 500,
                margin: 0,
                padding: 0,
                marginBottom: 0
              },
              h4: {
                fontSize: "1.75rem",
                fontWeight: 500,
                margin: 0,
                padding: 0,
                marginBottom: 0
              },
              h5: {
                fontSize: "1.5rem",
                fontWeight: 500,
                margin: 0,
                padding: 0,
                marginBottom: 0
              },
              h5: {
                fontSize: "1.25rem",
                fontWeight: 500,
                margin: 0,
                padding: 0,
                marginBottom: 0
              }
            },
          ],
        },
      }),
    },
  },
}

export default config
