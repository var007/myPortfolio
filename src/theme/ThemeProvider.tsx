import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { DEFAULT_THEME, THEME_STORAGE_KEY, ThemeContext, isTheme } from './theme'
import type { Theme } from './theme'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return DEFAULT_THEME

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(storedTheme) ? storedTheme : DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Theme still applies even when persistence is unavailable.
    }
  }, [theme])

  function setTheme(nextTheme: Theme) {
    setThemeState(nextTheme)
  }

  function toggleTheme() {
    setThemeState((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
