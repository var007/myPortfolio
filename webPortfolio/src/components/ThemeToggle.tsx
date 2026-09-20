import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../theme/useTheme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={`Switch to ${nextTheme} mode`}
      aria-pressed={theme === 'light'}
      onClick={toggleTheme}
    >
      <span className="theme-toggle-icon theme-toggle-moon" aria-hidden="true">
        <Moon size={18} />
      </span>
      <span className="theme-toggle-icon theme-toggle-sun" aria-hidden="true">
        <Sun size={18} />
      </span>
    </button>
  )
}
