"use client"

import { useEffect, useRef } from "react"

function SoundChart({ data }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!data || data.length === 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Set chart dimensions
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Find min and max values
    const minValue = 0
    const maxValue = 120

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#95a5a6"
    ctx.lineWidth = 1

    // Y-axis
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)

    // X-axis
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Draw Y-axis labels
    ctx.font = "12px Arial"
    ctx.fillStyle = "#7f8c8d"
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"

    const yStep = chartHeight / 4
    for (let i = 0; i <= 4; i++) {
      const y = height - padding - i * yStep
      const value = minValue + (i * (maxValue - minValue)) / 4
      ctx.fillText(value.toFixed(0), padding - 10, y)

      // Draw horizontal grid line
      ctx.beginPath()
      ctx.strokeStyle = "#ecf0f1"
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Draw data points and lines
    if (data.length > 1) {
      ctx.beginPath()
      ctx.strokeStyle = "#3498db"
      ctx.lineWidth = 2
      ctx.lineJoin = "round"

      data.forEach((point, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth
        const normalizedValue = (point.level - minValue) / (maxValue - minValue)
        const y = height - padding - normalizedValue * chartHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Draw points
      data.forEach((point, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth
        const normalizedValue = (point.level - minValue) / (maxValue - minValue)
        const y = height - padding - normalizedValue * chartHeight

        ctx.beginPath()
        ctx.arc(x, y, 4, 0, 2 * Math.PI)
        ctx.fillStyle = "#3498db"
        ctx.fill()
        ctx.strokeStyle = "#fff"
        ctx.lineWidth = 1
        ctx.stroke()
      })
    }

    // Draw X-axis labels (timestamps)
    ctx.fillStyle = "#7f8c8d"
    ctx.textAlign = "center"
    ctx.textBaseline = "top"

    // Only show a few labels to avoid overcrowding
    const labelCount = Math.min(5, data.length)
    for (let i = 0; i < labelCount; i++) {
      const index = Math.floor((i * (data.length - 1)) / (labelCount - 1))
      const point = data[index]
      const x = padding + (index / (data.length - 1)) * chartWidth

      const date = new Date(point.timestamp)
      const timeLabel = `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`

      ctx.fillText(timeLabel, x, height - padding + 10)
    }

    // Draw chart title
    ctx.font = "14px Arial"
    ctx.fillStyle = "#2c3e50"
    ctx.textAlign = "center"
    ctx.fillText("Sound Level Over Time (dB)", width / 2, 15)
  }, [data])

  return <canvas ref={canvasRef} width={600} height={300} style={{ width: "100%", height: "auto" }} />
}

export default SoundChart

