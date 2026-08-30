import React from 'react';
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
    Sequence,
    interpolateColors,
} from 'remotion';

// --- Helper Components for AE/Resolve Style Effects ---

const FontStyles: React.FC = () => (
    <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@900&display=swap');
        `}
    </style>
);

// 1. Kinetic Typography with Glitch Simulation
const GlitchText: React.FC<{ text: string }> = ({ text }) => {
    const frame = useCurrentFrame();
    const isGlitching = frame % 30 > 25 && frame % 30 < 29;
    const xOffset = isGlitching ? Math.random() * 20 - 10 : 0;
    const yOffset = isGlitching ? Math.random() * 10 - 5 : 0;
    const skew = isGlitching ? Math.random() * 20 - 10 : 0;

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <div style={{
                fontSize: 120, fontFamily: 'Syncopate', fontWeight: 'bold', color: '#fff',
                transform: `translate(${xOffset}px, ${yOffset}px) skewX(${skew}deg)`,
                textShadow: isGlitching ? '5px 0 0 red, -5px 0 0 blue' : '0px 0px 20px rgba(255,255,255,0.5)',
                mixBlendMode: 'screen',
            }}>
                {text}
            </div>
            {isGlitching && (
                <div style={{
                    position: 'absolute', top: 0, left: '-2%', width: '104%', height: '20%',
                    background: '#000', opacity: 0.8,
                    transform: `translateY(${Math.random() * 100}px)`
                }} />
            )}
        </div>
    );
};

// 2. Track Matte / Masking (Text revealing from behind an invisible line)
const MaskedReveal: React.FC<{ text: string }> = ({ text }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const progress = spring({ frame, fps, config: { damping: 14 } });
    const y = interpolate(progress, [0, 1], [150, 0]);

    return (
        <div style={{ overflow: 'hidden', height: 160, display: 'flex', alignItems: 'flex-end', padding: '10px 0' }}>
            <div style={{ transform: `translateY(${y}px)`, fontSize: 130, fontFamily: 'Inter', fontWeight: 900, color: '#00ffcc' }}>
                {text}
            </div>
        </div>
    );
};

// 3. 3D Camera Parallax Space
const ParallaxSpace: React.FC = () => {
    const frame = useCurrentFrame();
    const zTranslate = frame * 15;
    const rotationY = Math.sin(frame / 60) * 10;
    const rotationX = Math.cos(frame / 50) * 5;

    return (
        <div style={{
            perspective: '1000px', width: '100%', height: '100%',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            transformStyle: 'preserve-3d'
        }}>
            <div style={{
                transform: `rotateY(${rotationY}deg) rotateX(${rotationX}deg) translateZ(${zTranslate}px)`,
                transformStyle: 'preserve-3d', position: 'relative', width: 200, height: 200
            }}>
                {/* 3D Elements */}
                {[...Array(15)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        left: (Math.sin(i * 123) * 800),
                        top: (Math.cos(i * 321) * 500),
                        transform: `translateZ(${(i * -300) + 1000}px)`,
                        fontSize: 60, fontFamily: 'Space Mono', color: `hsl(${i * 20}, 100%, 70%)`,
                        opacity: 0.8, filter: 'blur(2px)'
                    }}>
                        DATA_{i}
                    </div>
                ))}
                <div style={{
                    position: 'absolute', left: -300, top: -100, transform: 'translateZ(-500px)',
                    fontSize: 150, fontFamily: 'Syncopate', fontWeight: 'bold', color: '#fff',
                    textShadow: '0 0 40px rgba(255,255,255,0.8)'
                }}>
                    3D DEPTH
                </div>
            </div>
        </div>
    );
};

// 4. Procedural Glowing HUD & Dataviz
const ComplexHud: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const drawProgress = spring({ frame, fps, config: { damping: 20, mass: 2 } });

    // Generate a complex line chart
    const points = Array.from({ length: 30 }).map((_, i) => {
        const x = i * 50;
        const y = 200 + Math.sin(i * 0.5 + frame * 0.1) * 100 + Math.cos(i * 1.2) * 50;
        return `${x},${y}`;
    }).join(' ');

    const lineLength = 1500;
    const dashoffset = interpolate(drawProgress, [0, 1], [lineLength, 0]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <svg width="1500" height="400" viewBox="0 0 1500 400" style={{ filter: 'drop-shadow(0 0 20px #ff22a1)' }}>
                <polyline points={points} fill="none" stroke="#ff22a1" strokeWidth="8"
                    strokeDasharray={lineLength} strokeDashoffset={dashoffset} />

                {/* HUD Grid Overlay */}
                {[...Array(10)].map((_, i) => (
                    <line key={`v${i}`} x1={i * 150} y1="0" x2={i * 150} y2="400" stroke="#330022" strokeWidth="2" />
                ))}
                {[...Array(4)].map((_, i) => (
                    <line key={`h${i}`} x1="0" y1={i * 100} x2="1500" y2={i * 100} stroke="#330022" strokeWidth="2" />
                ))}
            </svg>
            <div style={{ position: 'absolute', bottom: 100, left: 200, fontFamily: 'Space Mono', color: '#ff22a1', fontSize: 40 }}>
                PROCESSING DATA: {Math.floor(frame * 4.23)} TB/s
            </div>
        </div>
    );
};

// 5. Cinematic Wipe / Transition Overlay
const CinematicaWipe: React.FC<{ progress: number }> = ({ progress }) => {
    // 0 to 1
    const clipPath = `circle(${progress * 150}% at 50% 50%)`;
    return (
        <AbsoluteFill style={{
            background: '#fff',
            clipPath,
            zIndex: 100,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <h1 style={{ fontFamily: 'Inter', fontSize: 200, color: '#000' }}>REMOTION</h1>
        </AbsoluteFill>
    )
}


export const MotionGraphicsDemo: React.FC = () => {
    const { fps } = useVideoConfig(); // 30fps
    // Total 900 frames = 30 seconds
    return (
        <AbsoluteFill style={{ backgroundColor: '#020202', overflow: 'hidden' }}>
            <FontStyles />

            {/* SCENE 1: Kinetic Glitch (0 - 150) */}
            <Sequence durationInFrames={150}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: 'radial-gradient(circle, #2a0000 0%, #000 100%)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <GlitchText text="A.E. LEVEL" />
                        <Sequence from={30}>
                            <GlitchText text="MOTION GRAPHICS" />
                        </Sequence>
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* SCENE 2: Masking & Typography (150 - 330) */}
            <Sequence from={150} durationInFrames={180}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: '#050a1a' }}>
                    <div style={{ borderLeft: '10px solid #00ffcc', paddingLeft: 40, height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Sequence durationInFrames={180}>
                            <MaskedReveal text="PRECISION" />
                        </Sequence>
                        <Sequence from={20} durationInFrames={160}>
                            <MaskedReveal text="TRACK MATTES" />
                        </Sequence>
                        <Sequence from={40} durationInFrames={140}>
                            <MaskedReveal text="& MASKING" />
                        </Sequence>
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* SCENE 3: 3D Camera Parallax (330 - 540) */}
            <Sequence from={330} durationInFrames={210}>
                <AbsoluteFill style={{ background: '#030011' }}>
                    <ParallaxSpace />
                </AbsoluteFill>
            </Sequence>

            {/* SCENE 4: Procedural HUD / Glow (540 - 750) */}
            <Sequence from={540} durationInFrames={210}>
                <AbsoluteFill style={{ background: '#0a0005' }}>
                    <h2 style={{ position: 'absolute', top: 100, left: '50%', transform: 'translateX(-50%)', fontFamily: 'Syncopate', color: '#fff', fontSize: 60, letterSpacing: 20 }}>
                        PROCEDURAL HUD
                    </h2>
                    <ComplexHud />
                </AbsoluteFill>
            </Sequence>

            {/* SCENE 5: The Cinematic Wipe Transition To Finale (750 - 900) */}
            <Sequence from={750} durationInFrames={150}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    {/* Background behind wipe */}
                    <AbsoluteFill style={{ background: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <GlitchText text="ENDLESS CAPABILITY" />
                    </AbsoluteFill>
                    {/* The wipe itself happens in the last 60 frames */}
                    <Sequence from={90}>
                        {({ frame }) => {
                            const p = spring({ frame, fps, config: { damping: 20 } });
                            return <CinematicaWipe progress={p} />;
                        }}
                    </Sequence>
                </AbsoluteFill>
            </Sequence>

            {/* CRT Overlay on everything */}
            <AbsoluteFill style={{
                pointerEvents: 'none',
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                backgroundSize: '100% 4px, 6px 100%',
                zIndex: 999
            }} />
        </AbsoluteFill>
    );
};
