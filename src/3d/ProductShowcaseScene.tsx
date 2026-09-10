import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, OrbitControls, Html } from '@react-three/drei';
import { HeadphoneModel } from './HeadphoneModel';
import { Particles } from './Particles';
import { HOTSPOTS } from '../data/hotspots';
import { cn } from '../utils/cn';
import { ThreeErrorBoundary, ThreeFallback } from '../components/ThreeFallback';
import { isWebGLAvailable } from '../utils/webgl';

interface ProductShowcaseSceneProps {
  activeHotspot: number | null;
  onSelectHotspot: (id: number) => void;
}

export const ProductShowcaseScene: React.FC<ProductShowcaseSceneProps> = ({
  activeHotspot,
  onSelectHotspot,
}) => {
  if (!isWebGLAvailable()) {
    return (
      <div className="w-full h-full min-h-[480px] flex items-center justify-center">
        <ThreeFallback
          title="PUMBA X1 Acoustic Architecture"
          subtitle="Precision audio engineered with spatial acoustic drivers. WebGL acceleration required for interactive 3D model."
        />
      </div>
    );
  }

  return (
    <div className="w-full lg:w-[65%] h-full min-h-[480px] sm:min-h-[560px] lg:min-h-[640px] relative">
      <ThreeErrorBoundary
        fallback={
          <ThreeFallback
            title="PUMBA X1 Acoustic Architecture"
            subtitle="Interactive 3D mode paused. Click or refresh to restore."
          />
        }
      >
        <Canvas
          camera={{ position: [0, 0, 6.2], fov: 42 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
        <ambientLight intensity={0.6} />
        <directionalLight position={[6, 8, 5]} intensity={1.4} castShadow />
        <directionalLight position={[-6, -4, -3]} intensity={0.4} color="#3b82f6" />
        <spotLight
          position={[0, 5, 2]}
          angle={0.4}
          penumbra={1}
          intensity={1.5}
          color="#88ccff"
        />

        <Suspense fallback={null}>
          <HeadphoneModel activeHotspot={activeHotspot} />

          {/* 3D Hotspot Markers */}
          {HOTSPOTS.map((spot) => {
            const isSelected = activeHotspot === spot.id;
            return (
              <Html key={spot.id} position={spot.position} center distanceFactor={10}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectHotspot(spot.id);
                  }}
                  aria-label={`Hotspot ${spot.id}: ${spot.title}`}
                  className="group relative flex items-center justify-center p-2 focus:outline-none cursor-pointer"
                >
                  {/* Pulsing Radar Ring */}
                  <span
                    className={cn(
                      'absolute w-8 h-8 rounded-full pointer-events-none transition-opacity',
                      isSelected
                        ? 'bg-accent/60 animate-ping opacity-100'
                        : 'bg-white/20 group-hover:bg-accent/40 animate-pulse'
                    )}
                  />

                  {/* Core Hotspot Pin */}
                  <span
                    className={cn(
                      'relative z-10 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full backdrop-blur-md border text-xs font-mono font-bold transition-all duration-300 shadow-lg',
                      isSelected
                        ? 'bg-accent text-white border-accent scale-110 shadow-[0_0_20px_rgba(59,130,246,0.8)]'
                        : 'bg-[#101014]/80 text-white/90 border-white/20 group-hover:border-accent group-hover:text-accent group-hover:scale-110 shadow-[0_0_10px_rgba(0,0,0,0.5)]'
                    )}
                  >
                    0{spot.id}
                  </span>

                  {/* Floating tooltip on hover (desktop only) */}
                  <span
                    className={cn(
                      'hidden md:block absolute left-10 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-[#0e0e11]/90 border border-white/10 text-[11px] font-medium tracking-wide whitespace-nowrap text-white shadow-xl backdrop-blur-md transition-all duration-200 pointer-events-none',
                      isSelected
                        ? 'opacity-100 translate-x-0 border-accent/40 text-accent'
                        : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                    )}
                  >
                    {spot.title}
                  </span>
                </button>
              </Html>
            );
          })}

          <Particles count={150} />
          <Environment preset="city" />

          <ContactShadows
            position={[0, -2.6, 0]}
            opacity={0.5}
            scale={8}
            blur={2.5}
            far={4}
            color="#000000"
          />
        </Suspense>

        {/* Orbit controls allowing user exploration without disrupting scrolling */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 2.6}
          rotateSpeed={0.6}
        />
      </Canvas>
    </ThreeErrorBoundary>
  </div>
);
};
