import { createContext, useContext, type ReactNode } from 'react'
import { getSettings, defaultSettings, type Settings } from './api'
import { useAsync } from './useAsync'

const SettingsContext = createContext<Settings>(defaultSettings)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { data } = useAsync<Settings>(() => getSettings(), [])
  return (
    <SettingsContext.Provider value={data ?? defaultSettings}>{children}</SettingsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  return useContext(SettingsContext)
}
