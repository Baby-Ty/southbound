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
    <div className="flex flex-col items-center space-y-3">
      {/* Now Boarding Label */}
      <div className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium">
        Now Boarding
      </div>
      
      {/* Destination Display */}
      <div className="h-12 sm:h-14 flex items-center justify-center w-full">
        <div className="w-64 sm:w-72 md:w-80 flex items-center justify-center">
          <span 
            className={`
              font-mono text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-[0.15em]
              transition-opacity duration-300 ease-in-out
              ${isVisible ? 'opacity-100' : 'opacity-0'}
            `}
          >
            {destinations[currentIndex]}
          </span>
        </div>
      </div>
      
      {/* Boarding Pass Style Decoration with orange accent */}
      <div className="w-28 h-[1px] bg-sb-orange-500 relative">
        <div className="absolute -top-[3px] left-1/2 transform -translate-x-1/2 w-[6px] h-[6px] bg-sb-orange-500 rounded-full"></div>
      </div>
    </div>
  )
}

export default DestinationRotator 
