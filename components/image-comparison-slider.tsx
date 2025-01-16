'use client'

import { useState, useEffect, useRef } from 'react'

interface ImageComparisonSliderProps {
  beforeImage: string
  afterImage: string
}

export default function ImageComparisonSlider({ beforeImage, afterImage }: ImageComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!container || !isDragging) return
      e.preventDefault()
      const rect = container.getBoundingClientRect()
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX
      const position = ((x - rect.left) / rect.width) * 100
      setSliderPosition(Math.min(Math.max(position, 0), 100))
    }

    const handleMoveEnd = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMove)
    document.addEventListener('touchmove', handleMove, { passive: false })
    document.addEventListener('mouseup', handleMoveEnd)
    document.addEventListener('touchend', handleMoveEnd)

    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('mouseup', handleMoveEnd)
      document.removeEventListener('touchend', handleMoveEnd)
    }
  }, [isDragging])

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full overflow-hidden rounded-lg cursor-col-resize select-none"
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
    >
      <img 
        src={beforeImage} 
        alt="Before" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div 
        className="absolute top-0 right-0 bottom-0 overflow-hidden"
        style={{ width: `${100 - sliderPosition}%` }}
      >
        <img 
          src={afterImage} 
          alt="After" 
          className="absolute top-0 left-0 w-full h-full object-cover" 
          style={{ right: `${sliderPosition - 100}%` }} 
        />
      </div>
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white cursor-col-resize"
        style={{ left: `calc(${sliderPosition}% - 1px)` }}
      >
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary"
          >
            <path 
              d="M18 8L22 12L18 16M6 8L2 12L6 16" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

