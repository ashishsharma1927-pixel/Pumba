import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { PremiumObject } from './PremiumObject';
import { Particles } from './Particles';
import { ThreeErrorBoundary, ThreeFallback } from '../components/ThreeFallback';
import { isWebGLAvailable } from '../utils/webgl';

// Component to handle mouse interaction
const SceneController = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Smoothly interpolate current rotation towards target based on mouse position
      const targetX = (state.pointer.x * Math.PI) / 10;
      const targetY = (state.pointer.y * Math.PI) / 10;
      
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <PremiumObject />
      <Particles count={250} />
    </group>
  );
};

export const HeroScene = () => {
  if (!isWebGLAvailable()) {
    return (
      <div className="w-full h-full min-h-[400px] md:min-h-[600px] flex items-center justify-center">
        <ThreeFallback
          title="PUMBA Monolith Sphere"
          subtitle="WebGL hardware acceleration recommended to experience real-time 3D simulation."
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[600px] relative pointer-events-auto">
      <ThreeErrorBoundary
        fallback={
          <ThreeFallback
            title="PUMBA Core Architecture"
            subtitle="Interactive 3D mode paused. Click or refresh to restore."
          />
        }
      >
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          dpr={[1, 1.75]} // Cap DPR for smooth framerates on high-density displays
          shadows
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={1} 
            castShadow 
            shadow-mapSize={[1024, 1024]}
          />
          <spotLight 
            position={[-5, 5, 2]} 
            angle={0.15} 
            penumbra={1} 
            intensity={2} 
            color="#3b82f6" 
          />
          
          <SceneController />
          
          <Environment preset="city" />
          
          <ContactShadows 
            position={[0, -2.5, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2.5} 
            far={4} 
            color="#000000"
          />
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
};

