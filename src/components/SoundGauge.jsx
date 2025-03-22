"use client"

import { useEffect, useRef } from "react"

function SoundGauge({ value }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 10

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw gauge background
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI, false)
    ctx.lineWidth = 20
    ctx.strokeStyle = "#e5e7eb"
    ctx.stroke()

    // Calculate angle based on value
    const min = 0
    const max = 120
    const normalizedValue = Math.min(Math.max(value, min), max)
    const ratio = (normalizedValue - min) / (max - min)
    const angle = Math.PI + ratio * Math.PI

    // Draw value arc
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, Math.PI, angle, false)
    ctx.lineWidth = 20

    // Color based on value
    let color
    if (normalizedValue < 60) {
      color = "#2ecc71" // Green for low levels
    } else if (normalizedValue < 85) {
      color = "#f39c12" // Yellow for medium levels
    } else {
      color = "#e74c3c" // Red for high levels
    }
    ctx.strokeStyle = color
    ctx.stroke()

    // Draw center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius - 40, 0, 2 * Math.PI, false)
    ctx.fillStyle = "#f9fafb"
    ctx.fill()
    ctx.lineWidth = 2
    ctx.strokeStyle = "#e5e7eb"
    ctx.stroke()

    // Draw value text
    ctx.font = "bold 24px Arial"
    ctx.fillStyle = "#2c3e50"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(`${value.toFixed(1)} dB`, centerX, centerY - 10)

    // Draw label
    ctx.font = "14px Arial"
    ctx.fillStyle = "#7f8c8d"
    ctx.fillText("Sound Level", centerX, centerY + 20)

    // Draw min and max labels
    ctx.font = "12px Arial"
    ctx.fillStyle = "#95a5a6"
    ctx.textAlign = "left"
    ctx.fillText(`${min}`, centerX - radius + 10, centerY + radius / 2)
    ctx.textAlign = "right"
    ctx.fillText(`${max}`, centerX + radius - 10, centerY + radius / 2)
  }, [value])

  return <canvas ref={canvasRef} width={300} height={300} />
}

export default SoundGauge

