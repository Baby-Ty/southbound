"use client"
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import DestinationRotator from './DestinationRotator'

const Hero = () => {
  const destinations = ["BALI", "MEXICO", "GEORGIA", "CAPE TOWN"]
  const highlightRef = useRef<HTMLSpanElement | null>(null)
  const boardingPassRef = useRef<HTMLDivElement | null>(null)
  const backgroundRef = useRef<HTMLDivElement | null>(null)

  // Highlight animation for "scenery" word
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

  // Subtle parallax effect for the boarding pass card + decorative dots
  useEffect(() => {
    const card = boardingPassRef.current
    if (!card) return

    if (typeof window === 'undefined') return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (prefersReducedMotion.matches) {
      return
    }

    const pointerFineQuery = window.matchMedia('(pointer: fine)')
    const isPointerFine = pointerFineQuery.matches

    let frameId: number | null = null
    let currentX = 0
    let currentY = 0
    let targetX = 0
    let targetY = 0

    const maxOffset = isPointerFine ? 3 : 1.5 // px, keep movement extremely minimal

    const animate = () => {
      const el = boardingPassRef.current
      if (!el) return

      // Ease towards the target for smooth movement
      currentX += (targetX - currentX) * 0.1
      currentY += (targetY - currentY) * 0.1

      el.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`
      frameId = window.requestAnimationFrame(animate)
    }

    const startAnimationLoop = () => {
      if (frameId == null) {
        frameId = window.requestAnimationFrame(animate)
      }
    }

    const updateTarget = (x: number, y: number) => {
      targetX = x
      targetY = y
      startAnimationLoop()
    }

    // Mouse-based parallax for pointer-accurate devices (desktop / laptops)
    const handleMouseMove = (event: MouseEvent) => {
      const el = boardingPassRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      const relativeX = (event.clientX - rect.left) / rect.width - 0.5
      const relativeY = (event.clientY - rect.top) / rect.height - 0.5

      const clampedX = Math.max(-0.5, Math.min(0.5, relativeX))
      const clampedY = Math.max(-0.5, Math.min(0.5, relativeY))

      updateTarget(clampedX * maxOffset, clampedY * maxOffset)
    }

    // Scroll-based parallax fallback for touch / coarse pointer devices
    const handleScroll = () => {
      const el = boardingPassRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      if (!viewportHeight) return

      // Progress of the card passing through the viewport (-1 to 1)
      const distanceFromCenter = (rect.top + rect.height / 2) - viewportHeight / 2
      const progress = distanceFromCenter / viewportHeight
      const clamped = Math.max(-1, Math.min(1, progress))

      // Only apply a tiny vertical drift on scroll for mobile
      updateTarget(0, -clamped * maxOffset)
    }

    // Choose interaction mode based on pointer type
    if (isPointerFine) {
      window.addEventListener('mousemove', handleMouseMove)
    } else {
      handleScroll() // Initialize position
      window.addEventListener('scroll', handleScroll, { passive: true })
    }

    return () => {
      if (isPointerFine) {
        window.removeEventListener('mousemove', handleMouseMove)
      } else {
        window.removeEventListener('scroll', handleScroll)
      }

      if (frameId != null) {
        window.cancelAnimationFrame(frameId)
      }

      const el = boardingPassRef.current
      if (el) {
        el.style.transform = ''
      }
    }
  }, [])

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-stone-900">
      {/* Lively Full-Color Video Background with Parallax */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
          style={{ 
            filter: 'contrast(1.1) brightness(0.9)'
          }}
        >
          <source src="South Bound.mp4" type="video/mp4" />
          <source src="/South Bound.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl w-full relative z-10">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
            
            {/* Left Side - Content */}
            <div className="flex flex-col justify-center text-left text-white">
              
              {/* Logo - subtle and non-distracting */}
              <div className="flex items-center gap-3 mb-8 opacity-90">
                <div className="relative w-10 h-10">
                  <Image 
                    src="/images/logo.png" 
                    alt="South Bound Logo" 
                    fill
                    className="object-contain invert brightness-0 filter" 
                  />
                </div>
                <span className="font-bold tracking-[0.2em] text-sm uppercase text-white/80">South Bound</span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight">
                Work anywhere, <br/>
                <span className="text-[#E86B32]">live everywhere.</span>
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-stone-200 leading-relaxed mb-8 max-w-lg font-medium">
                The remote work adventure for South Africans. We handle the logistics, you just show up.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/route-builder"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#E86B32] hover:bg-[#d55a24] text-white font-bold rounded-full transition-all duration-300 shadow-lg hover:transform hover:-translate-y-1"
                >
                  <span>Start your journey</span>
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              
              <div className="mt-8 flex items-center gap-4 text-sm text-stone-400">
                 <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-stone-700 border-2 border-stone-900 flex items-center justify-center text-xs">
                            {/* Placeholder avatars */}
                            👤
                        </div>
                    ))}
                 </div>
                 <p>Join 500+ South African nomads</p>
              </div>
            </div>

            {/* Right Side - Boarding Pass */}
            <div className="hidden lg:flex items-center justify-center relative perspective-1000">
              
              {/* Boarding Pass Container */}
              <div
                ref={boardingPassRef}
                className="relative z-10 will-change-transform transition-transform duration-100 ease-out"
                aria-hidden="true"
              >
                {/* Clean Premium Boarding Pass */}
                <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8 w-full max-w-sm relative overflow-hidden transform rotate-[-2deg] hover:rotate-0 transition-all duration-500">
                  
                  {/* Decorative header */}
                  <div className="flex justify-between items-center mb-8 border-b border-dashed border-stone-200 pb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-[#E86B32] text-xl">✈️</span>
                        <span className="font-bold text-stone-900 tracking-widest text-sm uppercase">Boarding Pass</span>
                    </div>
                    <div className="text-xs font-mono text-stone-400">SB-2024</div>
                  </div>

                  {/* Destination Rotator */}
                  <div className="mb-8">
                    <div className="text-xs uppercase tracking-widest text-stone-500 mb-2">Destination</div>
                    <DestinationRotator destinations={destinations} />
                  </div>

                  {/* Flight Details Grid */}
                  <div className="grid grid-cols-2 gap-6 mb-8">
                      <div>
                        <div className="text-xs uppercase tracking-widest text-stone-500 mb-1">From</div>
                        <div className="font-mono text-2xl font-bold text-stone-900">ZAR</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-widest text-stone-500 mb-1">Class</div>
                        <div className="font-mono text-sm font-bold text-[#E86B32] bg-[#E86B32]/10 inline-block px-2 py-1 rounded">PREMIUM REMOTE</div>
                      </div>
                      <div>
                         <div className="text-xs uppercase tracking-widest text-stone-500 mb-1">Gate</div>
                         <div className="font-mono text-xl font-bold text-stone-900">A01</div>
                      </div>
                      <div>
                         <div className="text-xs uppercase tracking-widest text-stone-500 mb-1">Boarding</div>
                         <div className="font-mono text-xl font-bold text-stone-900">NOW</div>
                      </div>
                  </div>
                    
                  {/* Barcode / Footer */}
                  <div className="pt-6 border-t border-stone-100 flex justify-between items-end opacity-60">
                      <div className="h-8 w-32 bg-stone-900/10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDAiLz48L3N2Zz4=')]"></div>
                      <span className="text-[10px] text-stone-400">SOUTH BOUND AIRLINES</span>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </section>
  )
}

export default Hero 
