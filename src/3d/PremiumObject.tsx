import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const PremiumObject = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle constant rotation
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float
      speed={2} // Animation speed
      rotationIntensity={0.5} // XYZ rotation intensity
      floatIntensity={1} // Up/down float intensity
    >
      <mesh ref={meshRef} castShadow receiveShadow>
        <icosahedronGeometry args={[1.5, 0]} />
        <MeshTransmissionMaterial
          backside
          backsideThickness={1}
          thickness={0.5}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.9}
          ior={1.2}
          chromaticAberration={0.4}
          anisotropy={0.3}
          color="#ffffff"
          attenuationColor="#3b82f6"
          attenuationDistance={1}
        />
      </mesh>
      
      {/* Inner solid core for contrast */}
      <mesh>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          roughness={0.2}
          metalness={0.8}
          emissive="#3b82f6"
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
};
