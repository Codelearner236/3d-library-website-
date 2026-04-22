import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

// A flowing, wavy wireframe topographical map (similar to the Spline contour lines)
const FlowingGrid = () => {
  const geomRef = useRef();

  useFrame((state) => {
    if (!geomRef.current) return;
    const time = state.clock.getElapsedTime();
    const positions = geomRef.current.attributes.position.array;

    // Iterate through the vertices to create a dynamic fluid wave effect
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      
      // Combine multiple sine waves for an organic, topographical contour look
      const wave1 = Math.sin(x * 0.2 + time * 0.8) * 1.5;
      const wave2 = Math.cos(y * 0.3 - time * 0.5) * 1.0;
      const wave3 = Math.sin((x + y) * 0.15 + time) * 0.8;
      
      // Z is index i+2
      positions[i + 2] = wave1 + wave2 + wave3;
    }
    
    // Notify Three.js that the vertices have moved
    geomRef.current.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      {/* Primary Cyan Wavy Line Grid */}
      <mesh rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -5, -15]}>
        {/* Large plane, highly subdivided so the waves are smooth */}
        <planeGeometry ref={geomRef} args={[80, 80, 120, 120]} />
        <meshBasicMaterial 
          color="#00f0ff" 
          wireframe={true} 
          transparent={true}
          opacity={0.3}
        />
      </mesh>
      
      {/* Secondary Deep Blue Wavy Line Grid (Slightly offset for depth) */}
      <mesh rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -5.5, -15]}>
        <planeGeometry args={[80, 80, 80, 80]} />
        <meshBasicMaterial 
          color="#1a5aff" 
          wireframe={true} 
          transparent={true}
          opacity={0.15}
        />
      </mesh>
    </group>
  );
};

const CyberBackground = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, background: '#030508' }}>
      <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
        {/* Fog to fade the grid smoothly into the background */}
        <fog attach="fog" args={['#030508', 10, 40]} />
        
        {/* Soft lighting */}
        <ambientLight intensity={0.5} />
        
        {/* Topographical Wavy Contour Lines */}
        <FlowingGrid />
      </Canvas>
    </div>
  );
};

export default CyberBackground;
