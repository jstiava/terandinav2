import typography from '@tailwindcss/typography'
import { pixelBasedPreset, TailwindConfig } from '@react-email/tailwind'

const config: TailwindConfig = {
  // plugins: [typography],
  prefix: '',
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      fontFamily: {
        mono: ['Archivo'],
        sans: ['Archivo', 'Arial', 'sans-serif'],
        serif: ['Canela', 'Georgia', 'serif'],
        canela: ['Canela', 'Georgia', 'serif'],
        archivo: ['var(--font-archivo)', 'Arial', 'sans-serif'],
      },
    },
  },
}

export default config
