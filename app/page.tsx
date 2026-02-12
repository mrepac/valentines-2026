'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const startDate = new Date('2024-05-11T00:00:00').getTime()

    const updateTimer = () => {
      const now = new Date().getTime()
      const difference = now - startDate

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTime({ days, hours, minutes, seconds })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8">
        {/* Hearts decoration */}
        <div className="flex justify-center gap-4 mb-8">
          <span className="text-4xl heartbeat" style={{ animationDelay: '0s' }}>❤️</span>
          <span className="text-4xl heartbeat" style={{ animationDelay: '0.3s' }}>💕</span>
          <span className="text-4xl heartbeat" style={{ animationDelay: '0.6s' }}>💖</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500 mb-8">
          Skupaj že
        </h1>

        {/* Timer */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-pink-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-6xl font-bold text-red-500 mb-2">
                {time.days}
              </div>
              <div className="text-sm md:text-lg text-pink-600 font-semibold">
                dni
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-6xl font-bold text-red-500 mb-2">
                {time.hours}
              </div>
              <div className="text-sm md:text-lg text-pink-600 font-semibold">
                ur
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-6xl font-bold text-red-500 mb-2">
                {time.minutes}
              </div>
              <div className="text-sm md:text-lg text-pink-600 font-semibold">
                minut
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-6xl font-bold text-red-500 mb-2">
                {time.seconds}
              </div>
              <div className="text-sm md:text-lg text-pink-600 font-semibold">
                sekund
              </div>
            </div>
          </div>
        </div>

        {/* Link to game */}
        <div className="mt-12">
          <Link
            href="/game"
            className="inline-block text-2xl md:text-3xl font-bold text-pink-600 hover:text-red-500 transition-colors duration-300 cursor-pointer float"
          >
            Pozabavaj se z igro 💝
          </Link>
        </div>

        {/* Decorative hearts */}
        <div className="flex justify-center gap-6 mt-12">
          <span className="text-3xl float" style={{ animationDelay: '0s' }}>💗</span>
          <span className="text-3xl float" style={{ animationDelay: '0.5s' }}>💝</span>
          <span className="text-3xl float" style={{ animationDelay: '1s' }}>💕</span>
        </div>
      </div>
    </div>
  )
}
