"use client"

import { useState } from "react"

function AlertSettings() {
  const [settings, setSettings] = useState({
    enabled: true,
    threshold: 85,
    duration: 5,
    cooldown: 15,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : Number(value),
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would send the settings to your backend
    console.log("Saving settings:", settings)
    alert("Settings saved successfully!")
  }

  return (
    <div>
      <h2>Alert Settings</h2>
      <p>Configure when to receive sound level alerts</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            <input 
              type="checkbox" 
              name="enabled" 
              checked={settings.enabled} 
              onChange={handleChange} 
            />
            Enable Alerts
          </label>
          <p className="form-help">Receive alerts when sound levels exceed threshold</p>
        </div>

        <div className="form-group">
          <label htmlFor="threshold">Sound Threshold (dB): {settings.threshold}</label>
          <input
            type="range"
            id="threshold"
            name="threshold"
            min="40"
            max="120"
            value={settings.threshold}
            onChange={handleChange}
            onMouseUp={(e) => e.target.blur()}  // Remove focus when mouse interaction ends
            onTouchEnd={(e) => e.target.blur()}  // Remove focus when touch interaction ends
            className="slider"
          />
          <div className="range-labels">
            <span>40 dB (Quiet)</span>
            <span>120 dB (Loud)</span>
          </div>
          <p className="form-help">
            Alert when sound level exceeds this threshold. 85 dB is considered harmful with prolonged exposure.
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duration (seconds)</label>
          <input
            type="number"
            id="duration"
            name="duration"
            min="1"
            max="60"
            value={settings.duration}
            onChange={handleChange}
          />
          <p className="form-help">Sound must exceed threshold for this duration to trigger an alert</p>
        </div>

        <div className="form-group">
          <label htmlFor="cooldown">Cooldown (minutes)</label>
          <input
            type="number"
            id="cooldown"
            name="cooldown"
            min="1"
            max="60"
            value={settings.cooldown}
            onChange={handleChange}
          />
          <p className="form-help">Minimum time between consecutive alerts</p>
        </div>

        <button type="submit" className="submit-btn">
          Save Settings
        </button>
      </form>
    </div>
  )
}

export default AlertSettings

