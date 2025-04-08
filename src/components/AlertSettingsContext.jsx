import { createContext, useContext, useState } from "react"

const AlertSettingsContext = createContext()

export const AlertSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    enabled: true,
    threshold: 85,
    duration: 5,
    cooldown: 15,
  })

  return (
    <AlertSettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </AlertSettingsContext.Provider>
  )
}

export const useAlertSettings = () => useContext(AlertSettingsContext)
