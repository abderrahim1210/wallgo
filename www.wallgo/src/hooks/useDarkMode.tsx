import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  theme: ThemeMode;
  isDarkMode: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const getInitialTheme = (): ThemeMode => {
  const savedTheme = localStorage.getItem('theme')
  return savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system'
    ? savedTheme
    : 'system'
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme)
  const [systemPrefersDark, setSystemPrefersDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
  )
  const isDarkMode = theme === 'dark' || (theme === 'system' && systemPrefersDark)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const updateSystemPreference = () => setSystemPrefersDark(mediaQuery.matches)
    mediaQuery.addEventListener('change', updateSystemPreference)
    return () => mediaQuery.removeEventListener('change', updateSystemPreference)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', isDarkMode)
    root.style.colorScheme = isDarkMode ? 'dark' : 'light'
  }, [isDarkMode])

  const setTheme = (nextTheme: ThemeMode) => {
    localStorage.setItem('theme', nextTheme)
    setThemeState(nextTheme)
  }

  const toggleDarkMode = () => setTheme(isDarkMode ? 'light' : 'dark')

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, setTheme, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

const useDarkMode = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useDarkMode must be used within a ThemeProvider')
  }
  return context
}

export default useDarkMode
