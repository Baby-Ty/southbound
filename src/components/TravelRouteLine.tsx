'use client';

import React, { useEffect, useRef, useState } from 'react';

interface TravelRouteLineProps {
  className?: string;
  icons?: Array<'plane' | 'pin' | 'sun'>;
  direction?: 'vertical' | 'diagonal' | 'curved';
}

export const TravelRouteLine: React.FC<TravelRouteLineProps> = ({
  className = '',
  icons = ['plane', 'pin', 'sun'],
  direction = 'vertical'
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
    );

    if (svgRef.current) {
      observer.observe(svgRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  // Generate path based on direction
  const getPath = () => {
    switch (direction) {
      case 'diagonal':
        return 'M 40 0 Q 60 30 40 60 Q 20 90 40 120';
      case 'curved':
        return 'M 40 0 Q 55 25 40 50 Q 25 75 40 100 Q 55 125 40 120';
      default: // vertical
        return 'M 40 0 L 40 40 L 40 80 L 40 120';
    }
  };

  const getIconPositions = () => {
    switch (direction) {
      case 'diagonal':
        return [
          { x: 35, y: 25, icon: icons[0] },
          { x: 45, y: 65, icon: icons[1] },
          { x: 35, y: 105, icon: icons[2] }
        ];
      case 'curved':
        return [
          { x: 55, y: 20, icon: icons[0] },
          { x: 25, y: 60, icon: icons[1] },
          { x: 55, y: 100, icon: icons[2] }
        ];
      default: // vertical
        return [
          { x: 40, y: 25, icon: icons[0] },
          { x: 40, y: 65, icon: icons[1] },
          { x: 40, y: 105, icon: icons[2] }
        ];
    }
  };

  const getIconSymbol = (icon: string) => {
    switch (icon) {
      case 'plane': return '✈️';
      case 'pin': return '📍';
      case 'sun': return '☀️';
      default: return '•';
    }
  };

  return (
    <div className={`${className} flex justify-center opacity-80`}>
      <svg
        ref={svgRef}
        width="80"
        height="120"
        viewBox="0 0 80 120"
        className="overflow-visible"
      >
        {/* Main path - Ink Style */}
        <path
          d={getPath()}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="5 8"
          strokeLinecap="round"
          className="text-stone-500"
          style={{
            strokeDashoffset: isVisible ? '0' : '200',
            transition: 'stroke-dashoffset 2s ease-out',
            filter: 'drop-shadow(0px 1px 0px rgba(255,255,255,0.5))'
          }}
        />

        {/* Icons along the path - minimal and subtle */}
        {getIconPositions().map((pos, index) => (
          <g
            key={index}
            className={`transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
            }`}
            style={{
              transitionDelay: `${index * 0.3 + 0.5}s`
            }}
          >
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="12"
              className="pointer-events-none select-none"
              style={{ filter: 'grayscale(0.5)' }}
            >
              {getIconSymbol(pos.icon)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default TravelRouteLine;
