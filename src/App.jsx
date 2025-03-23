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

  // Function to send sound data to the backend (to trigger email alert)
  const sendSoundData = async (level) => {
    try {
      const response = await fetch("https://sound-detector-backend.vercel.app/api/sound-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, deviceId: "frontend-simulator" }),
      });
      const data = await response.json();
      console.log("Email alert triggered:", data);
    } catch (error) {
      console.error("Error triggering email alert:", error);
    }
  };

  // Simulate initial sound data and real-time updates
  useEffect(() => {
    // Generate initial mock data
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      level: 40 + Math.random() * 50,
      timestamp: Date.now() - (20 - i) * 60000,
    }));
    setSoundData(initialData.filter((data) => data !== undefined));
    if (initialData.length > 0) {
      setCurrentLevel(initialData[initialData.length - 1].level);
    }

    // Simulate real-time sound level updates every 2 seconds
    const interval = setInterval(() => {
      const newReading = {
        id: Date.now(),
        level: 40 + Math.random() * 50, // Random level between 40 and 90 dB
        timestamp: Date.now(),
      };

      setSoundData((prevData) => {
        const filteredData = prevData.filter((data) => data !== undefined);
        const updatedData = [...filteredData, newReading].slice(-20);
        setCurrentLevel(newReading.level);

        // If sound level > 85 dB, send a POST request to trigger email alert
        if (newReading.level > 85) {
          console.log(`🚨 High sound level detected: ${newReading.level} dB`);
          sendSoundData(newReading.level);
        }

        return updatedData;
      });
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
          <AlertSettings />
        </div>
      )}
    </div>
  );
}

export default App;
