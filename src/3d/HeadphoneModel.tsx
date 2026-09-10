import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

export interface HeadphoneModelProps {
  activeHotspot: number | null;
}

export const HeadphoneModel: React.FC<HeadphoneModelProps> = ({ activeHotspot }) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const leftDriverRef = useRef<THREE.Mesh>(null);
  const rightDriverRef = useRef<THREE.Mesh>(null);
  const headbandGlowRef = useRef<THREE.Mesh>(null);
  const batteryGlowRef = useRef<THREE.Mesh>(null);
  
  const { viewport } = useThree();
  // Calculate responsive scale based on viewport width. 
  // Makes it smaller for mobile screens to fit nicely, and larger for PC screens.
  // Max scale is capped to 1.35 so it doesn't clip at the top of the frustum.
  const responsiveScale = Math.min(1.35, Math.max(1.0, viewport.width * 0.15));

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (rootGroupRef.current) {
      // Gentle idle floating rotation
      // When a hotspot is active, smoothly bias rotation toward that angle
      let targetRotY = time * 0.15;
      let targetRotX = Math.sin(time * 0.5) * 0.05;

      if (activeHotspot === 1) {
        // Precision audio: Turn ear cup towards front-right
        targetRotY = 0.6 + Math.sin(time) * 0.05;
        targetRotX = 0.1;
      } else if (activeHotspot === 2) {
        // Adaptive comfort: Tilt down slightly to reveal headband
        targetRotY = Math.sin(time * 0.5) * 0.1;
        targetRotX = 0.35;
      } else if (activeHotspot === 3) {
        // 24 Hour battery: Angle to highlight bottom stem / power port
        targetRotY = -0.7 + Math.sin(time) * 0.05;
        targetRotX = -0.15;
      }

      rootGroupRef.current.rotation.y += (targetRotY - rootGroupRef.current.rotation.y) * 0.04;
      rootGroupRef.current.rotation.x += (targetRotX - rootGroupRef.current.rotation.x) * 0.04;
    }

    // Audio hotspot pulsing effect
    if (leftDriverRef.current && rightDriverRef.current) {
      const isAudioActive = activeHotspot === 1;
      const pulse = isAudioActive ? 0.6 + Math.sin(time * 6) * 0.4 : 0.2;
      const matL = leftDriverRef.current.material as THREE.MeshStandardMaterial;
      const matR = rightDriverRef.current.material as THREE.MeshStandardMaterial;
      matL.emissiveIntensity = pulse;
      matR.emissiveIntensity = pulse;
    }

    // Headband comfort glow
    if (headbandGlowRef.current) {
      const isComfortActive = activeHotspot === 2;
      const mat = headbandGlowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = isComfortActive ? 0.8 + Math.sin(time * 4) * 0.3 : 0.1;
    }

    // Battery glow
    if (batteryGlowRef.current) {
      const isBatteryActive = activeHotspot === 3;
      const mat = batteryGlowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = isBatteryActive ? 1.0 + Math.sin(time * 5) * 0.4 : 0.15;
    }
  });

  // Materials definition
  const matteBlack = (
    <meshStandardMaterial
      color="#151518"
      roughness={0.4}
      metalness={0.2}
    />
  );

  const titanium = (
    <meshStandardMaterial
      color="#d4d4d8"
      roughness={0.15}
      metalness={0.9}
    />
  );

  const darkLeather = (
    <meshStandardMaterial
      color="#0a0a0c"
      roughness={0.8}
      metalness={0.05}
    />
  );

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
      {/* Shift Y down slightly (-0.6) to perfectly vertically center the headphones in the frustum */}
      <group ref={rootGroupRef} scale={responsiveScale} position={[0, -0.6, 0]}>
        {/* ================= HEADBAND ARCH ================= */}
        {/* Outer Titanium Arch */}
        <mesh position={[0, 0.4, 0]} rotation={[0, 0, 0]} castShadow>
          <torusGeometry args={[1.5, 0.06, 16, 64, Math.PI]} />
          {titanium}
        </mesh>

        {/* Inner Comfort Cushion */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <torusGeometry args={[1.44, 0.07, 16, 48, Math.PI * 0.8]} />
          {darkLeather}
        </mesh>

        {/* Comfort Accent Glow Strip (Active when Hotspot 2 is selected) */}
        <mesh ref={headbandGlowRef} position={[0, 1.88, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.8, 16]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={0.1}
            roughness={0.1}
          />
        </mesh>

        {/* Left & Right Headband Extension Sliders */}
        <mesh position={[-1.5, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.5, 16]} />
          {titanium}
        </mesh>
        <mesh position={[1.5, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.5, 16]} />
          {titanium}
        </mesh>

        {/* ================= LEFT EAR CUP ASSEMBLY ================= */}
        <group position={[-1.55, -0.2, 0]} rotation={[0, 0.15, -0.05]}>
          {/* Yoke / Pivot Fork */}
          <mesh position={[0, 0.25, 0]} castShadow>
            <torusGeometry args={[0.5, 0.04, 16, 32, Math.PI]} />
            {titanium}
          </mesh>

          {/* Outer Cup Shell */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
            <cylinderGeometry args={[0.7, 0.65, 0.35, 32]} />
            {matteBlack}
          </mesh>

          {/* Glowing Sonic Ring Accent */}
          <mesh ref={leftDriverRef} position={[-0.19, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <ringGeometry args={[0.45, 0.55, 32]} />
            <meshStandardMaterial
              color="#3b82f6"
              emissive="#3b82f6"
              emissiveIntensity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Outer Cup Titanium Faceplate */}
          <mesh position={[-0.18, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
            <circleGeometry args={[0.42, 32]} />
            {titanium}
          </mesh>

          {/* Inner Memory Foam Cushion */}
          <mesh position={[0.22, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
            <torusGeometry args={[0.5, 0.18, 16, 32]} />
            {darkLeather}
          </mesh>

          {/* Internal Acoustic Grille */}
          <mesh position={[0.2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.42, 32]} />
            <meshStandardMaterial color="#050505" roughness={0.9} />
          </mesh>

          {/* Battery Stem & Fast-Charge Glow Port (Hotspot 3) */}
          <group position={[0, -0.65, 0.1]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.3, 16]} />
              {titanium}
            </mesh>
            <mesh ref={batteryGlowRef} position={[0, -0.16, 0]}>
              <cylinderGeometry args={[0.065, 0.065, 0.04, 16]} />
              <meshStandardMaterial
                color="#10b981"
                emissive="#10b981"
                emissiveIntensity={0.2}
              />
            </mesh>
          </group>
        </group>

        {/* ================= RIGHT EAR CUP ASSEMBLY ================= */}
        <group position={[1.55, -0.2, 0]} rotation={[0, -0.15, 0.05]}>
          {/* Yoke / Pivot Fork */}
          <mesh position={[0, 0.25, 0]} castShadow>
            <torusGeometry args={[0.5, 0.04, 16, 32, Math.PI]} />
            {titanium}
          </mesh>

          {/* Outer Cup Shell */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
            <cylinderGeometry args={[0.7, 0.65, 0.35, 32]} />
            {matteBlack}
          </mesh>

          {/* Glowing Sonic Ring Accent */}
          <mesh ref={rightDriverRef} position={[0.19, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <ringGeometry args={[0.45, 0.55, 32]} />
            <meshStandardMaterial
              color="#3b82f6"
              emissive="#3b82f6"
              emissiveIntensity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Outer Cup Titanium Faceplate */}
          <mesh position={[0.18, 0, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow>
            <circleGeometry args={[0.42, 32]} />
            {titanium}
          </mesh>

          {/* Inner Memory Foam Cushion */}
          <mesh position={[-0.22, 0, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow>
            <torusGeometry args={[0.5, 0.18, 16, 32]} />
            {darkLeather}
          </mesh>

          {/* Internal Acoustic Grille */}
          <mesh position={[-0.2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <circleGeometry args={[0.42, 32]} />
            <meshStandardMaterial color="#050505" roughness={0.9} />
          </mesh>
        </group>

        {/* Ambient floating tech particle ring around the centerpiece */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2.5, 0, 0]}>
          <ringGeometry args={[2.2, 2.22, 64]} />
          <meshBasicMaterial
            color="#3b82f6"
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </Float>
  );
};
