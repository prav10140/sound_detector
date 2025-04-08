"use client"

import { useState, useEffect } from "react"
import "./App.css"
import SoundGauge from "./components/SoundGauge"
import SoundChart from "./components/SoundChart"
import AlertSettings from "./components/AlertSettings"

function App() {
  const [soundData, setSoundData] = useState([])
  const [currentLevel, setCurrentLevel] = useState(0)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [settings, setSettings] = useState({
    enabled: true,
    threshold: 85,
    duration: 5,
    cooldown: 15,
  })

  const fetchSoundData = async () => {
    try {
      const response = await fetch("https://sound-detector-backend.vercel.app/api/sound-data")
      const data = await response.json()
      if (Array.isArray(data) && data.length > 0) {
        setSoundData(data)
        setCurrentLevel(data[data.length - 1].level)
      }
    } catch (error) {
      console.error("Error fetching sound data:", error)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      fetchSoundData()
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Sound Intensity Monitor</h1>
      </header>

      <div className="tab-navigation">
        <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>Dashboard</button>
        <button className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>Alert Settings</button>
      </div>

      {activeTab === "dashboard" && (
        <div className="dashboard-container">
          <div className="stats-container">
            <div className="stat-card">
              <h3>Current Level</h3>
              <p className="stat-value">{currentLevel.toFixed(1)} dB</p>
              <p className="stat-label">{currentLevel > settings.threshold ? "⚠️ High" : "✓ Normal"}</p>
            </div>

            <div className="stat-card">
              <h3>Average</h3>
              <p className="stat-value">
                {soundData.length > 0
                  ? (soundData.reduce((sum, data) => sum + data.level, 0) / soundData.length).toFixed(1)
                  : "0"} dB
              </p>
            </div>

            <div className="stat-card">
              <h3>Peak Level</h3>
              <p className="stat-value">
                {soundData.length > 0 ? Math.max(...soundData.map((data) => data.level)).toFixed(1) : "0"} dB
              </p>
            </div>
          </div>

          <div className="visualization-container">
            <div className="gauge-container">
              <h3>Current Sound Level</h3>
              <SoundGauge value={currentLevel} />
            </div>

            <div className="chart-container">
              <h3>Sound Level History</h3>
              <SoundChart data={soundData} />
            </div>
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="settings-container">
          <AlertSettings settings={settings} setSettings={setSettings} />
        </div>
      )}
    </div>
  )
}

export default App;
