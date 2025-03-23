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

  // Function to send sound data to backend
  const sendSoundData = async (level) => {
    try {
      const response = await fetch("https://sound-detector-backend.vercel.app/api/sound-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, deviceId: "frontend-simulator" }),
      });

      const data = await response.json();
      console.log("Data sent:", data);
    } catch (error) {
      console.error("Error sending sound data:", error);
    }
  };

  // Simulate real-time sound level updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newReading = {
        id: Date.now(),
        level: 40 + Math.random() * 60, // Random level between 40-100 dB
        timestamp: Date.now(),
      }

      setSoundData((prevData) => {
        const updatedData = [...prevData, newReading].slice(-20)
        setCurrentLevel(newReading.level)

        // If sound level > 85 dB, send data to backend
        if (newReading.level > 85) {
          console.log(`🚨 High Sound Level Detected: ${newReading.level} dB`);
          sendSoundData(newReading.level);
        }

        return updatedData;
      })
    }, 2000);

    return () => clearInterval(interval);
  }, []);

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

export default App;

