import { FONTS } from '../constants'

export const font = (langIndex: number, size: number): string =>
  FONTS[langIndex].replace('{sz}', String(size))

export const currentLangIndex = (now: number): number =>
  Math.floor(now / 1500) % 4
