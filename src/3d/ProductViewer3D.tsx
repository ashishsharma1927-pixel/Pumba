import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import { HeadphoneModel } from './HeadphoneModel';
import { Particles } from './Particles';
import { ThreeErrorBoundary, ThreeFallback } from '../components/ThreeFallback';
import { isWebGLAvailable } from '../utils/webgl';

export const ProductViewer3D: React.FC = () => {
  if (!isWebGLAvailable()) {
    return (
      <div className="w-full h-full min-h-[420px] sm:min-h-[500px] relative bg-gradient-to-b from-[#16161c] to-[#0d0d10] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 flex items-center justify-center p-4">
        <ThreeFallback
          title="Interactive 3D Hardware View"
          subtitle="Enable WebGL hardware acceleration in your browser to inspect this device in full 360° real-time."
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[420px] sm:min-h-[500px] relative bg-gradient-to-b from-[#16161c] to-[#0d0d10] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-white/10 backdrop-blur-md text-xs font-mono text-white/70 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        3D Real-time Model • Drag to Rotate
      </div>

      <ThreeErrorBoundary
        fallback={
          <div className="p-4 h-full flex items-center justify-center">
            <ThreeFallback
              title="3D Viewer Temporarily Unavailable"
              subtitle="Device GPU context was interrupted. Refresh to reinitialize."
            />
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 5.8], fov: 45 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[6, 8, 5]} intensity={1.5} />
          <directionalLight position={[-6, -4, -3]} intensity={0.5} color="#3b82f6" />
          <spotLight
            position={[0, 5, 2]}
            angle={0.3}
            penumbra={1}
            intensity={1.8}
            color="#88ccff"
          />

          <Suspense fallback={null}>
            <HeadphoneModel activeHotspot={null} />
            <Particles count={120} />
            <Environment preset="city" />
            <ContactShadows
              position={[0, -2.4, 0]}
              opacity={0.5}
              scale={8}
              blur={2.2}
              far={4}
              color="#000000"
            />
          </Suspense>

          <OrbitControls
            enableZoom={true}
            maxDistance={8}
            minDistance={3.5}
            maxPolarAngle={Math.PI / 1.6}
            minPolarAngle={Math.PI / 2.8}
            rotateSpeed={0.8}
          />
        </Canvas>
      </ThreeErrorBoundary>
    </div>
  );
};

