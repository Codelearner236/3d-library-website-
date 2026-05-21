import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Environment } from '@react-three/drei';
import * as THREE from 'three';

// An abstract, soft, moving gradient/liquid sphere
const LiquidSphere = ({ position, color, scale, speed }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime() * speed;
    if (meshRef.current) {
      // Gentle floating and drifting
      meshRef.current.position.y = position[1] + Math.sin(time) * 2;
      meshRef.current.position.x = position[0] + Math.cos(time * 0.8) * 1.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      {/* We use a highly blurred basic material or standard material since it will be behind the glass layer.
          Actually, giving it emission makes it glow softly. */}
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={0.8}
        roughness={0.5}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
};

export const FluidBackground = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1, // Sits behind the entire app
      pointerEvents: 'none', // Allow clicking through to the DOM
      backgroundColor: '#020617' // Deep dark blue base
    }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={1} performance={{ min: 0.5 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        
        {/* Soft glowing fluid orbs with neon accents */}
        <LiquidSphere position={[-5, 2, -10]} color="#00f0ff" scale={4} speed={0.2} /> {/* Neon Cyan */}
        <LiquidSphere position={[6, -3, -15]} color="#bc13fe" scale={6} speed={0.15} /> {/* Electric Purple */}
        <LiquidSphere position={[-2, -6, -8]} color="#0f3460" scale={5} speed={0.25} /> {/* Deep Blue */}
        <LiquidSphere position={[4, 5, -12]} color="#00f0ff" scale={3} speed={0.1} /> {/* Neon Cyan */}
        
        {/* Magic dust */}
        <Sparkles count={150} scale={20} size={2.5} speed={0.3} opacity={0.3} color="#00f0ff" />
        
        {/* Deeper fog */}
        <fog attach="fog" args={['#020617', 5, 20]} />
      </Canvas>
    </div>
  );
};
