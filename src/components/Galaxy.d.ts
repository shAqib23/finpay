declare module './Galaxy' {
  import React from 'react';

  interface GalaxyProps extends React.HTMLAttributes<HTMLDivElement> {
    focal?: [number, number];
    rotation?: [number, number];
    starSpeed?: number;
    density?: number;
    hueShift?: number;
    disableAnimation?: boolean;
    speed?: number;
    mouseInteraction?: boolean;
    glowIntensity?: number;
    saturation?: number;
    mouseRepulsion?: boolean;
    twinkleIntensity?: number;
    rotationSpeed?: number;
    repulsionStrength?: number;
    autoCenterRepulsion?: number;
    transparent?: boolean;
  }

  const Galaxy: React.FC<GalaxyProps>;
  export default Galaxy;
}
