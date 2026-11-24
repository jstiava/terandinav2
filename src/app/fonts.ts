import { Archivo } from "next/font/google"
import localFont from "next/font/local"


export const canela = localFont({
  src: [
    { path: '../../public/fonts/canelaweb-black.ttf', weight: '900', style: 'normal', },
    { path: '../../public/fonts/canelaweb-medium.ttf', weight: '500', style: 'normal', },
    { path: '../../public/fonts/canelaweb-thin.ttf', weight: '100', style: 'normal', },
  ], variable: '--font-canela', display: 'swap',
})

export const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})