'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Digital nomad hub locations with lat/long
export interface DestinationPin {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  color: string;
}

interface Globe3DProps {
  destinations: DestinationPin[];
  onPinClick?: (destination: DestinationPin) => void;
  selectedDestination?: string | null;
}

// Convert lat/lng to 3D coordinates on a sphere
const latLngToVector3 = (lat: number, lng: number, radius: number = 1.8) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
};

// Helper to get country flag emoji
const getCountryFlag = (country: string): string => {
  const flags: Record<string, string> = {
    'Portugal': '🇵🇹',
    'Colombia': '🇨🇴',
    'Thailand': '🇹🇭',
    'Indonesia': '🇮🇩',
    'South Africa': '🇿🇦',
    'Mexico': '🇲🇽',
    'Georgia': '🇬🇪',
    'Argentina': '🇦🇷'
  };
  return flags[country] || '📍';
};

// Flag marker component with pulsing animation
const FlagMarker = ({ 
  destination, 
  isSelected, 
  onClick 
}: { 
  destination: DestinationPin; 
  isSelected: boolean; 
  onClick: () => void;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  // Create canvas texture once
  const flagTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 128, 128);
      ctx.font = 'bold 96px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(getCountryFlag(destination.country), 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [destination.country]);

  // Pulsing animation for selected flag
  useFrame((state) => {
    if (groupRef.current && isSelected) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.15;
      groupRef.current.scale.set(scale, scale, scale);
    } else if (groupRef.current) {
      groupRef.current.scale.set(1, 1, 1);
    }
    
    // Always make mesh face camera
    if (meshRef.current) {
      meshRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh 
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <planeGeometry args={[0.3, 0.3]} />
        <meshBasicMaterial 
          map={flagTexture}
          transparent
          opacity={isSelected ? 1 : 0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Pulsing ring for selected country */}
      {isSelected && (
        <mesh>
          <ringGeometry args={[0.18, 0.22, 32]} />
          <meshBasicMaterial 
            color="#FF6B35"
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};

// Main globe with texture
const Globe = ({ 
  destinations, 
  onPinClick, 
  selectedDestination 
}: Globe3DProps) => {
  const globeGroupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef<{ x: number; y: number } | null>(null);
  const isRotating = useRef(false);

  // Load earth texture with less water emphasis
  const earthTexture = useLoader(
    THREE.TextureLoader,
    'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
  );
  
  // Load topology for country borders
  const bumpTexture = useLoader(
    THREE.TextureLoader,
    'https://unpkg.com/three-globe/example/img/earth-topology.png'
  );

  // Find selected destination and calculate target rotation
  React.useEffect(() => {
    if (selectedDestination && globeGroupRef.current) {
      const destination = destinations.find(d => d.id === selectedDestination);
      if (destination) {
        // Stop auto-rotation and calculate target
        isRotating.current = true;
        
        // Convert lat/lng to rotation angles
        // We want to rotate the globe so the pin faces the camera
        const targetY = -(destination.lng * Math.PI) / 180;
        const targetX = ((destination.lat - 10) * Math.PI) / 180; // Offset slightly for better view
        
        targetRotation.current = { x: targetX, y: targetY };
      }
    } else {
      // Reset to auto-rotation when nothing selected
      isRotating.current = false;
      targetRotation.current = null;
    }
  }, [selectedDestination, destinations]);

  // Handle rotation: either auto-rotate or animate to target
  useFrame(() => {
    if (globeGroupRef.current) {
      if (targetRotation.current && isRotating.current) {
        // Smooth interpolation to target rotation
        const current = globeGroupRef.current.rotation;
        const target = targetRotation.current;
        
        // Lerp towards target with damping
        const lerpFactor = 0.05;
        current.y += (target.y - current.y) * lerpFactor;
        current.x += (target.x - current.x) * lerpFactor;
        
        // Check if close enough to stop interpolating
        const deltaY = Math.abs(target.y - current.y);
        const deltaX = Math.abs(target.x - current.x);
        if (deltaY < 0.001 && deltaX < 0.001) {
          isRotating.current = false;
        }
      } else if (!targetRotation.current) {
        // Auto-rotation when nothing is selected
        globeGroupRef.current.rotation.y += 0.002;
      }
    }
  });

  return (
    <group>
      {/* Rotating group */}
      <group ref={globeGroupRef}>
        {/* Earth sphere with texture and topology - smaller size */}
        <Sphere args={[1.8, 128, 128]}>
          <meshStandardMaterial
            map={earthTexture}
            bumpMap={bumpTexture}
            bumpScale={0.015}
            roughness={0.8}
            metalness={0.1}
          />
        </Sphere>

        {/* Country flag markers */}
        {destinations.map((destination) => {
          const position = latLngToVector3(destination.lat, destination.lng, 1.82);
          const isSelected = selectedDestination === destination.id;
          
          return (
            <group key={destination.id} position={position}>
              <FlagMarker
                destination={destination}
                isSelected={isSelected}
                onClick={() => onPinClick?.(destination)}
              />
            </group>
          );
        })}
      </group>

      {/* Subtle atmosphere with warmer tone */}
      <Sphere args={[1.93, 64, 64]}>
        <meshBasicMaterial
          color="#AEE6E6"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Lighting for better land visibility */}
      <ambientLight intensity={1.8} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} />
      <directionalLight position={[-3, -2, -3]} intensity={0.4} />
    </group>
  );
};

// Main component with updated interface
interface Globe3DMainProps {
  destinations?: DestinationPin[];
  onPinClick?: (destination: DestinationPin) => void;
  selectedDestination?: string | null;
  onRegionSelect?: (region: string) => void;
}

const Globe3D: React.FC<Globe3DMainProps> = ({ 
  destinations = [], 
  onPinClick,
  selectedDestination,
  onRegionSelect
}) => {
  // Default South Bound destinations if none provided
  const defaultDestinations: DestinationPin[] = [
    { id: '1', name: 'Lisbon', country: 'Portugal', lat: 38.7223, lng: -9.1393, color: '#FF6B35' },
    { id: '2', name: 'Medellín', country: 'Colombia', lat: 6.2442, lng: -75.5812, color: '#FF6B35' },
    { id: '3', name: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018, color: '#FF6B35' },
    { id: '4', name: 'Canggu', country: 'Indonesia', lat: -8.6481, lng: 115.1375, color: '#FF6B35' },
    { id: '5', name: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241, color: '#FF6B35' },
    { id: '6', name: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332, color: '#FF6B35' },
  ];

  const pins = destinations.length > 0 ? destinations : defaultDestinations;

  // Handle pin clicks with region mapping
  const handlePinClick = (destination: DestinationPin) => {
    onPinClick?.(destination);
    
    // Map destinations to regions for onRegionSelect
    if (onRegionSelect) {
      const regionMap: Record<string, string> = {
        'Portugal': 'Europe',
        'Colombia': 'South America',
        'Thailand': 'Southeast Asia',
        'Indonesia': 'Southeast Asia',
        'South Africa': 'Africa',
        'Mexico': 'South America',
        'Georgia': 'Europe',
        'Argentina': 'South America'
      };
      const region = regionMap[destination.country] || destination.country;
      onRegionSelect(region);
    }
  };

  return (
    <div className="w-full h-full min-h-[500px] rounded-2xl overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <React.Suspense fallback={null}>
          <Globe
            destinations={pins}
            onPinClick={handlePinClick}
            selectedDestination={selectedDestination}
          />
        </React.Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={(2 * Math.PI) / 3}
        />
      </Canvas>
    </div>
  );
};

export default Globe3D;
