/*
 * This file renders a subtle grain layer over the entire application.
 * It exists separately so texture intensity can be tuned in one place and reused across every route.
 * The layout mounts this component globally to prevent sterile flat gradients and preserve atmospheric depth.
 */

export function SVGNoiseOverlay(): React.JSX.Element {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[2] opacity-[0.07] mix-blend-soft-light">
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          {/* This turbulence profile is intentionally low-frequency so the texture feels filmic rather than digital static. */}
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}
