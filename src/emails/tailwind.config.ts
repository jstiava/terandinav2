import type { TailwindConfig } from '@react-email/tailwind'
import { pixelBasedPreset } from '@react-email/tailwind'

const emailFlexFallback = ({ addUtilities }: any) => {
  addUtilities({
    '.flex': {
      display: 'block',
    },
    '.flex-col': {
      display: 'block',
    },
    '.inline-flex': {
      display: 'inline-block',
    },
  })
}

const config: TailwindConfig = {
  prefix: '',
  presets: [pixelBasedPreset],
  plugins: [emailFlexFallback],
  theme: {
    extend: {
      fontFamily: {
        mono: ['Archivo'],
        sans: ['Archivo', 'Arial', 'sans-serif'],
        serif: ['Canela', 'Georgia', 'serif'],
        canela: ['Canela', 'Georgia', 'serif'],
        archivo: ['Archivo', 'Arial', 'sans-serif'],
      },
    },
  },
}

export default config