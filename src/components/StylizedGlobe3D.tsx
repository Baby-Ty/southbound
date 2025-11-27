'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { RegionData } from '@/lib/regionsData';

interface StylizedGlobe3DProps {
  regions: RegionData[];
  selectedRegionId: string | null;
  onRegionClick?: (regionId: string) => void;
}

// Convert lat/lng to 3D coordinates on a sphere
const latLngToVector3 = (lat: number, lng: number, radius: number = 2) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
};

// Animated region pin component
const RegionPin = ({
  region,
  isSelected,
  onClick
}: {
  region: RegionData;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  // Pulsing animation
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      const float = Math.sin(state.clock.elapsedTime * 2) * 0.05;
      groupRef.current.position.y += float * 0.01;

      // Scale pulse when selected
      if (isSelected) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
        groupRef.current.scale.set(scale, scale, scale);
      } else {
        groupRef.current.scale.set(1, 1, 1);
      }
    }

    // Pulsing ring
    if (pulseRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.7;
      pulseRef.current.scale.set(pulse, pulse, pulse);
      if (pulseRef.current.material instanceof THREE.MeshBasicMaterial) {
        pulseRef.current.material.opacity = (1 - pulse) * 0.5;
      }
    }

    // Always face camera
    if (meshRef.current) {
      meshRef.current.lookAt(0, 0, 0);
    }
  });

  const position = latLngToVector3(region.centerLat, region.centerLng, 2.02);

  return (
    <group ref={groupRef} position={position}>
      {/* Main pin marker */}
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
        <circleGeometry args={[0.15, 32]} />
        <meshBasicMaterial
          color={isSelected ? '#FF7A3D' : region.color}
          transparent
          opacity={isSelected ? 1 : 0.9}
        />
      </mesh>

      {/* Glow ring */}
      <mesh ref={pulseRef}>
        <ringGeometry args={[0.16, 0.22, 32]} />
        <meshBasicMaterial
          color="#FF7A3D"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Selected indicator */}
      {isSelected && (
        <mesh>
          <ringGeometry args={[0.24, 0.28, 32]} />
          <meshBasicMaterial
            color="#40D9E8"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};

// Main globe component with stylized appearance
const Globe = ({ regions, selectedRegionId, onRegionClick }: StylizedGlobe3DProps) => {
  const globeRef = useRef<THREE.Group>(null);
  const targetRotation = useRef<{ x: number; y: number } | null>(null);
  const isAnimating = useRef(false);

  // Create custom stylized texture for land masses
  const globeTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Ocean base - translucent deep teal
      ctx.fillStyle = '#2CB5C0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Simplified land masses with warm tones
      ctx.fillStyle = '#E8D5C4';
      
      // Africa
      ctx.beginPath();
      ctx.ellipse(1100, 450, 200, 280, 0, 0, Math.PI * 2);
      ctx.fill();

      // Europe (small)
      ctx.beginPath();
      ctx.ellipse(1050, 280, 120, 100, 0, 0, Math.PI * 2);
      ctx.fill();

      // Asia
      ctx.fillStyle = '#D4A574';
      ctx.beginPath();
      ctx.ellipse(1450, 350, 280, 200, 0, 0, Math.PI * 2);
      ctx.fill();

      // North America
      ctx.fillStyle = '#A8B896';
      ctx.beginPath();
      ctx.ellipse(400, 300, 200, 220, 0, 0, Math.PI * 2);
      ctx.fill();

      // South America
      ctx.fillStyle = '#D4A574';
      ctx.beginPath();
      ctx.ellipse(550, 600, 140, 200, 0, 0, Math.PI * 2);
      ctx.fill();

      // Australia
      ctx.fillStyle = '#E8D5C4';
      ctx.beginPath();
      ctx.ellipse(1550, 680, 130, 100, 0, 0, Math.PI * 2);
      ctx.fill();

      // Add subtle texture/noise
      ctx.globalAlpha = 0.1;
      for (let i = 0; i < 5000; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2;
        ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
        ctx.fillRect(x, y, size, size);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Handle rotation to selected region
  React.useEffect(() => {
    if (selectedRegionId && globeRef.current) {
      const region = regions.find(r => r.id === selectedRegionId);
      if (region) {
        isAnimating.current = true;
        const targetY = -(region.centerLng * Math.PI) / 180;
        const targetX = ((region.centerLat - 5) * Math.PI) / 180;
        targetRotation.current = { x: targetX, y: targetY };
      }
    } else {
      isAnimating.current = false;
      targetRotation.current = null;
    }
  }, [selectedRegionId, regions]);

  // Animation loop
  useFrame(() => {
    if (globeRef.current) {
      if (targetRotation.current && isAnimating.current) {
        // Smooth interpolation to target
        const current = globeRef.current.rotation;
        const target = targetRotation.current;
        const lerpFactor = 0.05;
        
        current.y += (target.y - current.y) * lerpFactor;
        current.x += (target.x - current.x) * lerpFactor;

        if (Math.abs(target.y - current.y) < 0.001 && Math.abs(target.x - current.x) < 0.001) {
          isAnimating.current = false;
        }
      } else if (!targetRotation.current) {
        // Gentle idle rotation (breathing effect)
        globeRef.current.rotation.y += 0.001;
      }
    }
  });

  return (
    <group>
      <group ref={globeRef}>
        {/* Main globe sphere with stylized texture */}
        <Sphere args={[2, 64, 64]}>
          <meshStandardMaterial
            map={globeTexture}
            roughness={0.9}
            metalness={0}
            transparent
            opacity={0.95}
          />
        </Sphere>

        {/* Ocean overlay - translucent */}
        <Sphere args={[2.01, 64, 64]}>
          <meshBasicMaterial
            color="#2CB5C0"
            transparent
            opacity={0.15}
          />
        </Sphere>

        {/* Region pins */}
        {regions.map((region) => (
          <RegionPin
            key={region.id}
            region={region}
            isSelected={selectedRegionId === region.id}
            onClick={() => onRegionClick?.(region.id)}
          />
        ))}
      </group>

      {/* Soft atmosphere glow */}
      <Sphere args={[2.15, 32, 32]}>
        <meshBasicMaterial
          color="#FF9F66"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Warm ambient lighting */}
      <ambientLight intensity={1.5} color="#FFF8F0" />
      <directionalLight position={[5, 3, 5]} intensity={1} color="#FFD4BA" />
      <directionalLight position={[-3, -2, -3]} intensity={0.4} color="#40D9E8" />
    </group>
  );
};

// Main component wrapper
const StylizedGlobe3D: React.FC<StylizedGlobe3DProps> = ({
  regions,
  selectedRegionId,
  onRegionClick
}) => {
  return (
    <div className="w-full h-full min-h-[500px] rounded-2xl overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <React.Suspense fallback={null}>
          <Globe
            regions={regions}
            selectedRegionId={selectedRegionId}
            onRegionClick={onRegionClick}
          />
        </React.Suspense>
      </Canvas>
    </div>
  );
};

export default StylizedGlobe3D;




