export function SVGNoiseOverlay() {
    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] h-full w-full opacity-[0.05] mix-blend-overlay">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <filter id="noiseFilter">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.65"
                        numOctaves="3"
                        stitchTiles="stitch"
                    />
                </filter>
                <rect width="100%" height="100%" filter="url(#noiseFilter)" />
            </svg>
        </div>
    );
}
