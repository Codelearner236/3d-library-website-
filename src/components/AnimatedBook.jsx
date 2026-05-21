import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Center, Environment, ContactShadows, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const BookModel = ({ isOpened }) => {
  const bookGroupRef = useRef();
  const coverRef = useRef();
  const textGroupRef = useRef();
  const sparklesGroupRef = useRef();
  
  // Use useRef for animation progress to avoid re-rendering
  const progress = useRef({ pop: 0, open: 0 });

  useFrame((state, delta) => {
    const targetPop = isOpened ? 1 : 0;
    progress.current.pop = THREE.MathUtils.damp(progress.current.pop, targetPop, 4, delta);
    
    // Open the book only after it pops up significantly
    if (progress.current.pop > 0.6) {
      progress.current.open = THREE.MathUtils.damp(progress.current.open, 1, 3, delta);
    } else if (!isOpened) {
      progress.current.open = THREE.MathUtils.damp(progress.current.open, 0, 6, delta);
    }

    const pop = progress.current.pop;
    const open = progress.current.open;

    // Pop-up animation from below the table
    if (bookGroupRef.current) {
      const scale = Math.max(0.01, pop);
      bookGroupRef.current.scale.set(scale, scale, scale);
      // Moves from y=-3 to y=0
      bookGroupRef.current.position.y = -3 + (pop * 3);
    }

    // Rotate cover around Z axis
    if (coverRef.current) {
      coverRef.current.rotation.z = open * (Math.PI / 1.15);
    }
    
    // Text and Sparkles emerging animation
    if (textGroupRef.current) {
      const textScale = Math.max(0.01, open);
      textGroupRef.current.scale.set(textScale, textScale, textScale);
      textGroupRef.current.position.y = open * 2.5;
    }

    if (sparklesGroupRef.current) {
      const sparklesScale = Math.max(0.01, open);
      sparklesGroupRef.current.scale.set(sparklesScale, sparklesScale, sparklesScale);
    }
  });

  // Cinematic Antique Colors
  const antiqueLeatherColor = "#3d1b04"; // Dark reddish-brown leather
  const pagesColor = "#f4ebd8"; // Aged paper
  const goldColor = "#ffb700"; // Metallic gold

  // Landscape dimensions
  const width = 6;
  const depth = 4;
  const thickness = 0.5;
  const coverThickness = 0.2;
  const spineX = -width / 2;

  return (
    <group ref={bookGroupRef} position={[0, -3, 0]} scale={[0, 0, 0]}>
      {/* Back Cover */}
      <mesh position={[0, -coverThickness / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, coverThickness, depth]} />
        <meshStandardMaterial color={antiqueLeatherColor} roughness={0.8} />
      </mesh>
      
      {/* Pages */}
      <mesh position={[0.1, thickness / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width - 0.2, thickness, depth - 0.2]} />
        <meshStandardMaterial color={pagesColor} roughness={0.9} />
      </mesh>

      {/* Spine */}
      <mesh position={[spineX, thickness / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[coverThickness, thickness + coverThickness, depth]} />
        <meshStandardMaterial color={antiqueLeatherColor} roughness={0.8} />
      </mesh>

      {/* Front Cover Hinge Group */}
      <group position={[spineX, thickness, 0]} ref={coverRef}>
        <mesh position={[width / 2, coverThickness / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width, coverThickness, depth]} />
          <meshStandardMaterial color={antiqueLeatherColor} roughness={0.8} />
        </mesh>
        
        {/* Intricate Gold Details on Cover */}
        <mesh position={[width / 2, coverThickness + 0.01, 0]}>
          <boxGeometry args={[width - 0.8, 0.02, depth - 0.8]} />
          <meshStandardMaterial color={goldColor} metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[width / 2, coverThickness + 0.01, 0]}>
          <boxGeometry args={[width - 1.2, 0.03, depth - 1.2]} />
          <meshStandardMaterial color={goldColor} metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Magical Sparkles that appear when opened */}
      <group ref={sparklesGroupRef} position={[0, 1.5, 0]}>
         <Sparkles count={150} scale={6} size={3} speed={0.5} color="#ffe55c" noise={0.2} opacity={isOpened ? 1 : 0} />
      </group>

      {/* Text that emerges */}
      <group ref={textGroupRef} position={[0, 0, 0]}>
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
          {/* A golden point light attached to the text to cast a magical glow */}
          <pointLight position={[0, 0, 0]} intensity={1.5} color="#ffe55c" distance={10} decay={2} />
          
          <Center top position={[0, 0, 0]}>
            <Text
              fontSize={0.7}
              color="#ffe55c"
              outlineWidth={0.03}
              outlineColor="#4a2e00"
              anchorX="center"
              anchorY="middle"
              maxWidth={6}
              textAlign="center"
            >
              WELCOME TO THE LIBRARY
            </Text>
          </Center>
          
          <Center top position={[0, -1.2, 0]}>
            <Text
              fontSize={0.28}
              color="#fcf3d9"
              maxWidth={6}
              textAlign="center"
              anchorX="center"
              anchorY="middle"
            >
              Your gateway to infinite knowledge, curated digital resources,{"\n"}and a state-of-the-art interactive learning experience.
            </Text>
          </Center>
        </Float>
      </group>
    </group>
  );
};

export default function AnimatedBook() {
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    // Pop up and open the book shortly after mounting
    const timer = setTimeout(() => {
      setIsOpened(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Dark moody ambient light */}
      <ambientLight intensity={0.15} color="#111" />
      
      {/* Green Banker's Lamp Light (Positioned right/top/front) */}
      <pointLight position={[6, 5, 4]} intensity={2.5} color="#00ff66" distance={20} decay={1.5} />
      
      {/* Warm fill light to balance the green */}
      <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#ffd1a9" />
      
      <group rotation={[Math.PI / 8, -Math.PI / 6, 0]}>
        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.1}>
          <BookModel isOpened={isOpened} />
          
          {/* Dark wooden table surface underneath the book */}
          <mesh position={[0, -0.2, 0]} receiveShadow>
            <cylinderGeometry args={[12, 12, 0.2, 64]} />
            <meshStandardMaterial color="#1a110a" roughness={0.9} />
          </mesh>
        </Float>
      </group>
      
      <Environment preset="night" />
      <ContactShadows position={[0, -0.1, 0]} opacity={0.8} scale={20} blur={2.5} far={10} color="#000000" />
    </>
  );
}
