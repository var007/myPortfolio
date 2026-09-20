import { createContext } from 'react'

export type Theme = 'dark' | 'light'

export interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const THEME_STORAGE_KEY = 'portfolio-theme'
export const DEFAULT_THEME: Theme = 'dark'
export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function isTheme(value: string | null): value is Theme {
  return value === 'dark' || value === 'light'
}
