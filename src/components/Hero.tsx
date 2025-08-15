"use client"
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import DestinationRotator from './DestinationRotator'

const Hero = () => {
  const destinations = ["BALI", "MEXICO", "GEORGIA", "CAPE TOWN"]
  const highlightRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    const el = highlightRef.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('in-view')
      } else {
        el.classList.remove('in-view')
      }
    }, { threshold: 0.6 })

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
          onError={(e) => {
            console.error('Video error:', e)
            console.error('Video error details:', e.target?.error)
          }}
          onLoadStart={() => console.log('Video loading started')}
          onCanPlay={() => console.log('Video can play')}
          onLoadedData={() => console.log('Video data loaded')}
        >
          <source src="South Bound.mp4" type="video/mp4" />
          <source src="/South Bound.mp4" type="video/mp4" />
          <source src="./South Bound.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-sb-beige-100 bg-opacity-80"></div>
      </div>

      <div className="max-w-7xl w-full relative z-10">
        {/* Main Hero Card */}
        <div className="bg-white bg-opacity-75 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-2 min-h-[600px]">
            
            {/* Left Side - Content */}
            <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16 order-2 lg:order-1">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 mb-8 bg-gradient-to-r from-teal-50 to-rose-50 px-4 py-2 rounded-full border border-teal-100 w-fit">
                <span className="text-lg">🌍</span>
                <span className="text-sm font-medium text-gray-700">South Bound</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Ready for a change of{' '}
                <span ref={highlightRef} className="sb-highlighter align-baseline px-2 py-1">
                  <span className="font-bold sb-highlighter-content text-white">
                    scenery
                    <span className="inline-block align-baseline text-3xl md:text-4xl lg:text-5xl">?</span>
                  </span>
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-lg">
                South Bound helps South Africans live and work from inspiring destinations without the planning stress.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="#places-youll-see"
                  className="inline-flex items-center px-8 py-4 bg-sb-orange-500 hover:bg-sb-orange-600 text-white font-semibold rounded-full transition-all duration-300 shadow-medium hover:shadow-large hover:scale-105"
                >
                  <span>🗺️</span>
                  <span className="ml-2">Places you'll see</span>
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link 
                  href="#whos-this-for"
                  className="bg-sb-teal-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-sb-teal-700 transition-colors duration-200 text-center"
                >
                  who&apos;s this for?
                </Link>
              </div>
            </div>

            {/* Right Side - Boarding Pass */}
            <div className="bg-gradient-to-br from-rose-50 to-teal-50 bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-8 md:p-12 order-1 lg:order-2 relative">
              {/* Boarding Pass Container */}
              <div className="relative">
                {/* Main Boarding Pass Card */}
                <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg p-8 md:p-12 max-w-sm w-full relative">
                  {/* Perforated Edge Effect */}
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                    <div className="flex flex-col space-y-2">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-sb-beige-100 rounded-full"></div>
                      ))}
                    </div>
                  </div>

                  {/* Boarding Pass Header */}
                  <div className="text-center mb-8">
                    <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                      Remote Work Pass
                    </div>
                    <div className="w-16 h-0.5 bg-gray-300 mx-auto"></div>
                  </div>

                  {/* Destination Rotator */}
                  <div className="mb-8">
                    <DestinationRotator destinations={destinations} />
                  </div>

                  {/* Flight Details */}
                  <div className="space-y-4 text-center">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-gray-500">From</div>
                        <div className="font-mono font-semibold">JNB</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-gray-500">Class</div>
                        <div className="font-mono font-semibold">REMOTE</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-gray-500">Gate</div>
                        <div className="font-mono font-semibold">A22</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider text-gray-500">Zone</div>
                        <div className="font-mono font-semibold">ADVENTURE</div>
                      </div>
                    </div>
                    
                    <div className="border-t border-dashed border-gray-300 my-6"></div>
                    
                    <div className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      SOUTH BOUND
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-rose-200 rounded-full opacity-60"></div>
                <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-teal-200 rounded-full opacity-40"></div>
                <div className="absolute top-1/2 -left-8 w-4 h-4 bg-rose-300 rounded-full opacity-50 transform -translate-y-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Optional: Floating Action Hint */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 text-gray-600 text-sm bg-white bg-opacity-80 backdrop-blur-sm px-4 py-2 rounded-full">
            <span>Scroll to explore destinations</span>
            <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero 
