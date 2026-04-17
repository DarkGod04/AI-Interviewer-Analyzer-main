'use client';
import dynamic from 'next/dynamic';

// Dynamically import to ensure it's only client-side rendered
const Crosshair = dynamic(() => import('./Crosshair'), { ssr: false });

export default function GlobalCrosshair() {
  return (
    <Crosshair
      color="#ec4899"
      opacity={0.6}
      containerRef={null}
    />
  );
}
