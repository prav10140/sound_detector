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

  // Simulate fetching initial data
  useEffect(() => {
    // In a real app, this would be an API call to your backend
    const mockData = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      level: 40 + Math.random() * 50,
      timestamp: Date.now() - (20 - i) * 60000,
    }))

    setSoundData(mockData)
    if (mockData.length > 0) {
      setCurrentLevel(mockData[mockData.length - 1].level)
    }

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newReading = {
        id: Date.now(),
        level: 40 + Math.random() * 50,
        timestamp: Date.now(),
      }

      setSoundData((prevData) => {
        // Keep only the last 20 readings
        const updatedData = [...prevData, newReading].slice(-20)
        setCurrentLevel(newReading.level)
        return updatedData
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Sound Intensity Monitor</h1>
      </header>

      <div className="tab-navigation">
        <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
          Dashboard
        </button>
        <button className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>
          Alert Settings
        </button>
      </div>

      {activeTab === "dashboard" && (
        <div className="dashboard-container">
          <div className="stats-container">
            <div className="stat-card">
              <h3>Current Level</h3>
              <p className="stat-value">{currentLevel.toFixed(1)} dB</p>
              <p className="stat-label">{currentLevel > 85 ? "⚠️ High" : "✓ Normal"}</p>
            </div>

            <div className="stat-card">
              <h3>Average</h3>
              <p className="stat-value">
                {soundData.length > 0
                  ? (soundData.reduce((sum, data) => sum + data.level, 0) / soundData.length).toFixed(1)
                  : "0"}{" "}
                dB
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
          <AlertSettings />
        </div>
      )}
    </div>
  )
}

export default App

