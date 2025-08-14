'use client'

import { useState, useEffect } from 'react'

interface DestinationRotatorProps {
  destinations: string[]
  interval?: number
}

const DestinationRotator = ({ 
  destinations, 
  interval = 3000 
}: DestinationRotatorProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (destinations.length <= 1) return

    const timer = setInterval(() => {
      // Fade out
      setIsVisible(false)
      
      // After fade out completes, change destination and fade in
      setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          (prevIndex + 1) % destinations.length
        )
        setIsVisible(true)
      }, 250) // Match with CSS transition timing
    }, interval)

    return () => clearInterval(timer)
  }, [destinations.length, interval])

  if (!destinations || destinations.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Now Boarding Label */}
      <div className="text-xs uppercase tracking-wider text-gray-500 font-medium">
        Now Boarding
      </div>
      
      {/* Destination Display */}
      <div className="h-12 flex items-center justify-center">
        <span 
          className={`
            font-mono text-2xl md:text-3xl font-bold text-gray-800
            transition-opacity duration-300 ease-in-out
            ${isVisible ? 'opacity-100' : 'opacity-0'}
          `}
        >
          {destinations[currentIndex]}
        </span>
      </div>
      
      {/* Boarding Pass Style Decoration */}
      <div className="w-24 h-0.5 bg-gray-300 relative">
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  )
}

export default DestinationRotator 
