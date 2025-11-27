'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RegionData } from '@/lib/regionsData';

type MapRegionMeta = {
  path: string;
  label: {
    x: number;
    y: number;
    anchor?: 'start' | 'middle' | 'end';
  };
  transformOrigin: string;
  spotlight: {
    cx: number;
    cy: number;
    r: number;
  };
};

type RegionPalette = {
  active: string;
  hover: string;
  muted: string;
  text: string;
};

const neutralLandPaths: string[] = [
  // North America silhouette
  'M80 80 Q 110 60, 140 65 Q 170 70, 185 85 Q 200 100, 205 120 Q 210 140, 210 160 Q 210 180, 200 200 Q 190 220, 170 230 Q 150 240, 130 235 Q 110 230, 95 215 Q 80 200, 75 180 Q 70 160, 70 140 Q 70 120, 75 100 Q 75 90, 80 80 Z',
  // Africa silhouette (elongated north-south)
  'M360 200 Q 380 180, 410 175 Q 440 170, 465 180 Q 490 190, 505 210 Q 520 230, 525 255 Q 530 280, 525 305 Q 520 330, 505 350 Q 490 370, 465 380 Q 440 390, 415 385 Q 390 380, 370 360 Q 350 340, 345 315 Q 340 290, 340 265 Q 340 240, 345 215 Q 350 205, 360 200 Z',
  // Asia silhouette (wider east-west with extensions)
  'M510 140 Q 540 120, 580 125 Q 620 130, 660 145 Q 700 160, 730 185 Q 760 210, 775 240 Q 790 270, 790 300 Q 790 330, 770 355 Q 750 380, 715 390 Q 680 400, 640 395 Q 600 390, 565 370 Q 530 350, 510 320 Q 490 290, 485 260 Q 480 230, 485 200 Q 490 170, 500 155 Q 505 145, 510 140 Z',
  // Australia silhouette (compact, rounded)
  'M720 360 Q 745 350, 770 355 Q 795 360, 815 375 Q 835 390, 840 410 Q 845 430, 835 445 Q 825 460, 805 465 Q 785 470, 760 465 Q 735 460, 715 445 Q 695 430, 690 410 Q 685 390, 690 375 Q 695 365, 710 360 Q 715 358, 720 360 Z'
];

const regionMeta: Record<string, MapRegionMeta> = {
  'south-america': {
    // Recognizable South America shape: wider north, narrow middle, wider south
    path: 'M240 120 Q 260 105, 280 110 Q 300 115, 310 130 Q 320 145, 320 165 Q 320 185, 315 205 Q 310 225, 300 240 Q 290 255, 280 265 Q 285 280, 295 300 Q 305 320, 310 340 Q 315 360, 310 380 Q 305 400, 290 410 Q 275 420, 255 420 Q 235 420, 220 410 Q 205 400, 195 385 Q 185 370, 185 350 Q 185 330, 190 310 Q 195 290, 205 275 Q 195 265, 185 250 Q 175 235, 170 215 Q 165 195, 170 175 Q 175 155, 185 140 Q 195 125, 210 117 Q 225 112, 240 120 Z',
    label: { x: 252, y: 265, anchor: 'middle' },
    transformOrigin: '252px 265px',
    spotlight: { cx: 252, cy: 265, r: 135 }
  },
  'south-europe': {
    // Mediterranean peninsula shape
    path: 'M370 150 Q 390 140, 415 145 Q 440 150, 460 165 Q 480 180, 490 200 Q 500 220, 495 240 Q 490 260, 475 272 Q 460 284, 440 285 Q 420 286, 400 278 Q 380 270, 365 255 Q 350 240, 345 220 Q 340 200, 345 180 Q 350 165, 360 155 Q 365 150, 370 150 Z',
    label: { x: 420, y: 215, anchor: 'middle' },
    transformOrigin: '420px 215px',
    spotlight: { cx: 420, cy: 215, r: 95 }
  },
  'central-east-europe': {
    // Eastern Europe + Turkey region
    path: 'M485 125 Q 510 115, 535 120 Q 560 125, 580 140 Q 600 155, 610 175 Q 620 195, 618 215 Q 616 235, 605 250 Q 594 265, 575 272 Q 556 279, 535 275 Q 514 271, 495 258 Q 476 245, 465 227 Q 454 209, 455 190 Q 456 171, 465 155 Q 474 140, 485 130 Q 485 127, 485 125 Z',
    label: { x: 540, y: 200, anchor: 'middle' },
    transformOrigin: '540px 200px',
    spotlight: { cx: 540, cy: 200, r: 100 }
  },
  'southeast-asia': {
    // Southeast Asia archipelago feel (rounded with island extensions)
    path: 'M630 220 Q 650 205, 675 210 Q 700 215, 720 230 Q 740 245, 755 265 Q 770 285, 775 310 Q 780 335, 770 355 Q 760 375, 740 385 Q 720 395, 695 395 Q 670 395, 650 385 Q 630 375, 620 355 Q 610 335, 610 310 Q 610 285, 615 265 Q 620 245, 625 235 Q 627 227, 630 220 Z',
    label: { x: 692, y: 305, anchor: 'middle' },
    transformOrigin: '692px 305px',
    spotlight: { cx: 692, cy: 305, r: 115 }
  }
};

const regionPalette: Record<string, RegionPalette> = {
  'south-america': {
    active: '#E77A42',
    hover: '#EB8D5B',
    muted: '#F0BA94',
    text: '#2A2A2A'
  },
  'south-europe': {
    active: '#E3A87A',
    hover: '#E9B98E',
    muted: '#F1CCAB',
    text: '#2A2A2A'
  },
  'central-east-europe': {
    active: '#C9A86A',
    hover: '#D4BA83',
    muted: '#E4D1A9',
    text: '#2A2A2A'
  },
  'southeast-asia': {
    active: '#6EB5A2',
    hover: '#82C7B0',
    muted: '#A9D9CC',
    text: '#1F4941'
  }
};

const fallbackPalette: RegionPalette = {
  active: '#E77A42',
  hover: '#EB8D5B',
  muted: '#F0BA94',
  text: '#2A2A2A'
};

interface WorldMapIllustrationProps {
  regions: RegionData[];
  selectedRegionId: string | null;
  onRegionClick?: (regionId: string) => void;
}

export const WorldMapIllustration: React.FC<WorldMapIllustrationProps> = ({
  regions,
  selectedRegionId,
  onRegionClick
}) => {
  const componentId = React.useId().replace(/[:]/g, '');
  const glowFilterId = `glow-${componentId}`;
  const grainFilterId = `grain-${componentId}`;
  const texturePatternId = `texture-${componentId}`;
  const [hoveredRegionId, setHoveredRegionId] = React.useState<string | null>(null);

  const interactiveRegions = React.useMemo(
    () => regions.filter(region => regionMeta[region.id]),
    [regions]
  );

  const getPaletteFor = React.useCallback(
    (regionId: string): RegionPalette => {
      return regionPalette[regionId] ?? fallbackPalette;
    },
    []
  );

  const handleKeyActivate = React.useCallback(
    (event: React.KeyboardEvent<SVGGElement>, regionId: string) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onRegionClick?.(regionId);
      }
    },
    [onRegionClick]
  );

  return (
    <div className="relative w-full">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(242,196,126,0.35)_0%,_rgba(250,245,237,0)_75%)] blur-2xl" />
        <div className="absolute -bottom-28 right-12 h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle,_rgba(110,181,162,0.25)_0%,_rgba(250,245,237,0)_70%)] blur-2xl" />
      </div>

      <svg
        viewBox="0 0 900 520"
        role="img"
        aria-labelledby="world-map-title world-map-desc"
        className="relative w-full h-auto drop-shadow-[0_35px_70px_rgba(206,162,98,0.32)]"
      >
        <title id="world-map-title">Southbound travel regions</title>
        <desc id="world-map-desc">
          A stylised flat world map featuring four interactive travel regions: South America, South Europe, Central and East Europe, and Southeast Asia.
        </desc>

        <defs>
          <filter id={glowFilterId} x="-50%" y="-50%" width="220%" height="220%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="24" result="blur" />
            <feFlood floodColor="rgba(242,196,126,0.42)" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="softGlow" />
            <feMerge>
              <feMergeNode in="softGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id={grainFilterId} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" result="noise" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.08 0" result="fadedNoise" />
            <feBlend in="SourceGraphic" in2="fadedNoise" mode="soft-light" />
          </filter>

          <pattern id={texturePatternId} patternUnits="userSpaceOnUse" width="160" height="160" patternTransform="rotate(4)">
            <rect width="160" height="160" fill="transparent" />
            <circle cx="20" cy="18" r="1.3" fill="rgba(255,255,255,0.14)" />
            <circle cx="140" cy="42" r="1.1" fill="rgba(255,255,255,0.1)" />
            <circle cx="90" cy="120" r="1.2" fill="rgba(209,180,145,0.12)" />
            <circle cx="46" cy="82" r="0.9" fill="rgba(255,255,255,0.08)" />
            <circle cx="120" cy="136" r="0.9" fill="rgba(209,180,145,0.12)" />
          </pattern>
        </defs>

        {/* Ocean background */}
        <rect
          x="0"
          y="0"
          width="900"
          height="520"
          fill="#F5EEE3"
          stroke="#E7D6C3"
          strokeWidth={1.5}
          rx="34"
        />
        <rect x="0" y="0" width="900" height="520" fill={`url(#${texturePatternId})`} opacity={0.35} rx="34" />

        <g filter={`url(#${grainFilterId})`}>
          {/* Neutral land masses */}
          <g fill="#E9DDCC" opacity={0.88} pointerEvents="none" stroke="#DCCAB2" strokeWidth={1.6}>
            {neutralLandPaths.map((path, index) => (
              <path key={index} d={path} strokeLinejoin="round" />
            ))}
          </g>

          {/* Accent travel markers */}
          <g pointerEvents="none">
            <path
              d="M240 70 C 250 55, 270 45, 280 58 C 290 70, 275 90, 260 90 C 245 92, 235 85, 240 70 Z"
              fill="rgba(231,122,66,0.35)"
            />
            <path
              d="M620 150 C 630 135, 650 132, 665 140 C 678 150, 670 165, 655 167 C 640 170, 610 170, 620 150 Z"
              fill="rgba(110,181,162,0.35)"
            />
          </g>

          {/* Interactive regions */}
          {interactiveRegions.map(region => {
            const meta = regionMeta[region.id];
            const palette = getPaletteFor(region.id);
            const isSelected = region.id === selectedRegionId;
            const isHovered = region.id === hoveredRegionId;
            const isActive = isSelected || isHovered;
            const dropShadow = isActive
              ? 'drop-shadow(0px 18px 34px rgba(150,116,76,0.26))'
              : 'drop-shadow(0px 10px 22px rgba(166,133,95,0.18))';

            return (
              <motion.g
                key={region.id}
                role="button"
                tabIndex={0}
                aria-label={`Explore ${region.name}`}
                aria-pressed={isSelected}
                initial={false}
                animate={{ scale: isActive ? 1.02 : 1 }}
                transition={{ duration: 0.3, ease: [0.45, 0, 0.2, 1] }}
                style={{
                  transformOrigin: meta.transformOrigin,
                  cursor: 'pointer',
                  filter: dropShadow
                }}
                onClick={() => onRegionClick?.(region.id)}
                onKeyDown={event => handleKeyActivate(event, region.id)}
                onFocus={() => setHoveredRegionId(region.id)}
                onBlur={() => setHoveredRegionId(current => (current === region.id ? null : current))}
                onMouseEnter={() => setHoveredRegionId(region.id)}
                onMouseLeave={() => setHoveredRegionId(current => (current === region.id ? null : current))}
              >
                <motion.circle
                  cx={meta.spotlight.cx}
                  cy={meta.spotlight.cy}
                  r={meta.spotlight.r}
                  fill="rgba(242,196,126,0.35)"
                  style={{ filter: 'blur(70px)' }}
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.32, ease: [0.45, 0, 0.2, 1] }}
                />

                <motion.path
                  d={meta.path}
                  fill={palette.active}
                  initial={false}
                  animate={{
                    fill: isSelected ? palette.active : isHovered ? palette.hover : palette.muted,
                    opacity: isActive ? 1 : 0.94
                  }}
                  transition={{ duration: 0.3, ease: [0.45, 0, 0.2, 1] }}
                />

                <path
                  d={meta.path}
                  fill="none"
                  stroke="rgba(255,248,240,0.32)"
                  strokeWidth={2.2}
                  strokeLinejoin="round"
                />

                <motion.text
                  x={meta.label.x}
                  y={meta.label.y}
                  textAnchor={meta.label.anchor ?? 'middle'}
                  initial={false}
                  animate={{ fontSize: isSelected ? 20 : isHovered ? 19 : 18 }}
                  transition={{ duration: 0.3, ease: [0.45, 0, 0.2, 1] }}
                  fontWeight={700}
                  fill={palette.text}
                  style={{
                    filter: isActive
                      ? 'drop-shadow(0px 3px 6px rgba(42,42,42,0.25))'
                      : 'drop-shadow(0px 2px 4px rgba(42,42,42,0.18))',
                    letterSpacing: '0.4px'
                  }}
                >
                  {region.name}
                </motion.text>
              </motion.g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default WorldMapIllustration;

