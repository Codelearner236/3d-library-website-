import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, Scroll, Float, MeshTransmissionMaterial, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { ScrollOverlays } from './ScrollOverlays';

const VibrantBackground = () => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      // Slowly rotate the massive background gradients
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.05;
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -25]}>
      {/* Pink Orb */}
      <mesh position={[-15, 10, -10]} scale={25}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#ff007f" transparent opacity={0.8} />
      </mesh>
      {/* Orange Orb */}
      <mesh position={[15, -10, -10]} scale={25}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#ff7b00" transparent opacity={0.8} />
      </mesh>
      {/* Blue Orb */}
      <mesh position={[0, 15, -15]} scale={30}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.8} />
      </mesh>
    </group>
  );
};

const FrostedShapes = () => {
  const scroll = useScroll();
  const groupRef = useRef();

  const shapes = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 8; i++) {
      const isCube = Math.random() > 0.5;
      const size = 0.5 + Math.random() * 1.5;
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 10 - 2;
      
      const rotX = Math.random() * Math.PI;
      const rotY = Math.random() * Math.PI;
      const rotZ = Math.random() * Math.PI;
      
      temp.push({ id: i, isCube, size, position: [x, y, z], rotation: [rotX, rotY, rotZ] });
    }
    // Add one massive central sphere
    temp.push({ id: 99, isCube: false, size: 3.5, position: [0, 0, 0], rotation: [0, 0, 0] });
    return temp;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const offset = scroll.offset;
    
    groupRef.current.children.forEach((child, i) => {
      // Float rotation
      child.rotation.x += delta * (i % 2 === 0 ? 0.2 : -0.2);
      child.rotation.y += delta * (i % 3 === 0 ? 0.1 : -0.1);
    });
    
    // Smooth Parallax on scroll
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, offset * 12, 2, delta);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, offset * 5, 2, delta);
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape) => (
        <Float key={shape.id} speed={2 + Math.random() * 2} rotationIntensity={0.5} floatIntensity={1.5}>
          <mesh position={shape.position} rotation={shape.rotation}>
            {shape.isCube ? (
              <boxGeometry args={[shape.size, shape.size, shape.size]} />
            ) : (
              <sphereGeometry args={[shape.size, 16, 16]} />
            )}
            <meshPhysicalMaterial 
              transmission={1}
              roughness={0.4}
              thickness={shape.size}
              ior={1.2}
              color="#ffffff"
              transparent={true}
              opacity={1}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

export const ScrollableLibraryScene = ({ onEnter }) => {
  return (
    <>
      <color attach="background" args={['#2a0a4a']} /> 
      
      <ambientLight intensity={2} color="#ffffff" />
      <directionalLight position={[10, 20, 10]} intensity={3} color="#ffffff" />
      
      {/* The frosted glass needs an environment map to refract interesting light */}
      <Environment preset="studio" />
      
      <VibrantBackground />
      <FrostedShapes />
      
      <EffectComposer disableNormalPass>
        {/* Massive bloom radius to bleed the background orbs together into a fluid gradient */}
        <Bloom luminanceThreshold={0.4} mipmapBlur intensity={4} radius={1.2} />
      </EffectComposer>

      <Scroll html style={{ width: '100%', height: '100%' }}>
        <ScrollOverlays onEnter={onEnter} />
      </Scroll>
    </>
  );
};
