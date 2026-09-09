import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Pure deterministic pseudo-random generator to satisfy React render purity rules
function generateParticlePositions(count: number) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const s1 = Math.sin(i * 12.9898 + 1) * 43758.5453;
    const s2 = Math.sin(i * 78.233 + 2) * 43758.5453;
    const s3 = Math.sin(i * 45.164 + 3) * 43758.5453;
    pos[i * 3] = (s1 - Math.floor(s1) - 0.5) * 10;
    pos[i * 3 + 1] = (s2 - Math.floor(s2) - 0.5) * 10;
    pos[i * 3 + 2] = (s3 - Math.floor(s3) - 0.5) * 10;
  }
  return pos;
}

export const Particles = ({ count = 500 }) => {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => generateParticlePositions(count), [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.05;
      points.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#88ccff"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
