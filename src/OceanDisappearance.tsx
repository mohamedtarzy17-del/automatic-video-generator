import React from 'react';
import {
    AbsoluteFill,
    Sequence,
    Video,
    staticFile,
    useVideoConfig,
    useCurrentFrame,
    interpolate,
    spring,
    Audio,
} from 'remotion';
import {
    OceanWaveIcon,
    SunHeatIcon,
    OxygenIcon,
    EarthquakeIcon,
    PlanetDryIcon,
    OCEAN_THEME
} from './components/OceanIcons';


const AudioSFX: React.FC<{ src: string; volume?: number; delay?: number }> = ({ src, volume = 0.5, delay = 0 }) => {
    return (
        <Sequence from={delay}>
            <Audio src={staticFile(`sfx/${src}`)} volume={volume} />
        </Sequence>
    );
};

const HeatDistortion: React.FC = () => {
    const frame = useCurrentFrame();
    const baseFreq = interpolate(frame % 100, [0, 50, 100], [0.01, 0.02, 0.01]);
    return (
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <filter id="heat">
                <feTurbulence type="fractalNoise" baseFrequency={`${baseFreq} 0.05`} numOctaves="2" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" />
            </filter>
        </svg>
    );
};

const Overlay: React.FC<{ children: React.ReactNode; x?: string; y?: string; scale?: number }> = ({ children, x = '50%', y = '50%', scale = 1 }) => (
    <div style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        zIndex: 100,
    }}>
        {children}
    </div>
);

const WordHighlight: React.FC<{ text: string; color?: string; delay?: number }> = ({ text, color = 'white', delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const localFrame = frame - delay;
    const opacity = interpolate(localFrame, [0, 15, 120, 140], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const spr = spring({ frame: localFrame, fps, config: { damping: 10, stiffness: 100 } });
    const blur = interpolate(localFrame, [0, 10], [20, 0], { extrapolateRight: 'clamp' });

    return (
        <div style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 140,
            fontWeight: 900,
            color,
            textTransform: 'uppercase',
            textShadow: `0 0 80px rgba(0,0,0,1), 0 0 30px ${color === 'white' ? 'rgba(255,255,255,0.4)' : color + '77'}`,
            opacity,
            transform: `scale(${interpolate(spr, [0, 1], [0.8, 1])}) translateY(${interpolate(spr, [0, 1], [40, 0])}px)`,
            filter: `blur(${blur}px)`,
            letterSpacing: -8,
            textAlign: 'center'
        }}>
            {text}
        </div>
    );
};

export const OceanDisappearance: React.FC = () => {
    const { fps, durationInFrames } = useVideoConfig();
    const frame = useCurrentFrame();
    const getFrame = (s: number) => Math.floor(s * fps);

    // Global Camera Zoom
    const zoom = interpolate(frame, [0, durationInFrames], [1, 1.1]);

    return (
        <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
            <HeatDistortion />

            <div style={{ width: '100%', height: '100%', transform: `scale(${zoom})` }}>
                <Video
                    src={staticFile('videos/ocean_bg.mp4')}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    delayRenderTimeoutInMilliseconds={60000}
                />
            </div>

            {/* Cinematic Post-Processing */}
            <AbsoluteFill style={{
                background: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.7) 150%)',
                pointerEvents: 'none'
            }} />

            {/* Grain Overlay */}
            <AbsoluteFill style={{
                opacity: 0.05,
                backgroundColor: 'black',
                display: frame % 2 === 0 ? 'block' : 'none',
                pointerEvents: 'none'
            }} />

            {/* Layered Audio for Depth */}
            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.25} />
            <Audio src={staticFile("sfx/rise.mp3")} volume={0.1} startFrom={getFrame(30)} />

            {/* --- NARRATIVE SEQUENCE --- */}

            {/* 0-8s: The Beginning */}
            <Sequence from={getFrame(1)} durationInFrames={getFrame(8)}>
                <Overlay y="30%">
                    <OceanWaveIcon size={350} />
                </Overlay>
                <Overlay y="80%">
                    <WordHighlight text="WHAT IF?" color={OCEAN_THEME.white} />
                </Overlay>
                <AudioSFX src="whoosh.mp3" volume={0.7} />
            </Sequence>

            {/* 10-20s: Silence & Removal */}
            <Sequence from={getFrame(12)} durationInFrames={getFrame(8)}>
                <Overlay scale={1.2}>
                    <div style={{ position: 'relative', filter: 'drop-shadow(0 0 30px rgba(255,0,0,0.5))' }}>
                        <OceanWaveIcon size={400} />
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%',
                            transform: `translate(-50%, -50%) rotate(45deg) scale(${spring({ frame: frame - getFrame(13), fps })})`,
                            width: 550, height: 15, backgroundColor: '#EF4444', borderRadius: 10
                        }} />
                    </div>
                </Overlay>
                <Overlay y="85%">
                    <WordHighlight text="LOST SOUND" />
                </Overlay>
                <AudioSFX src="pop 2.mp3" volume={0.8} />
                <AudioSFX src="whoosh.mp3" delay={getFrame(1)} volume={0.4} />
            </Sequence>

            {/* 35-50s: The Disappearing Planet */}
            <Sequence from={getFrame(38)} durationInFrames={getFrame(14)}>
                <Overlay x="50%" y="40%" scale={interpolate(frame - getFrame(38), [0, 400], [1, 1.3])}>
                    <PlanetDryIcon size={500} />
                </Overlay>
                <Overlay y="88%">
                    <WordHighlight text="WITHOUT WATER" color={OCEAN_THEME.dry} />
                </Overlay>
                <AudioSFX src="clock.mp3" volume={0.6} />
                <AudioSFX src="rise.mp3" delay={getFrame(4)} volume={0.8} />
            </Sequence>

            {/* 70-85s: Temperature Nightmare - HEAT DISTORTION APPLIED */}
            <Sequence from={getFrame(72)} durationInFrames={getFrame(15)}>
                <AbsoluteFill style={{ filter: 'url(#heat)' }}>
                    <Overlay x="50%" y="35%">
                        <SunHeatIcon size={450} />
                    </Overlay>
                </AbsoluteFill>
                <Overlay y="80%">
                    <WordHighlight text="THERMAL COLLAPSE" color="#F59E0B" />
                </Overlay>
                <AudioSFX src="rise.mp3" volume={1} />
                <AudioSFX src="whoosh.mp3" delay={getFrame(0.5)} />
            </Sequence>

            {/* 105-120s: Oxygen Crisis */}
            <Sequence from={getFrame(110)} durationInFrames={getFrame(15)}>
                <Overlay y="30%" scale={interpolate(Math.sin(frame / 20), [-1, 1], [0.95, 1.05])}>
                    <OxygenIcon size={400} />
                </Overlay>
                <Overlay y="82%">
                    <WordHighlight text="BREATHLESS" color={OCEAN_THEME.oxygen} />
                </Overlay>
                <AudioSFX src="whoosh.mp3" volume={0.6} />
                <AudioSFX src="pop.mp3" delay={getFrame(1)} />
            </Sequence>

            {/* 135-148s: Crust Shift & Earthquakes */}
            <Sequence from={getFrame(136)} durationInFrames={getFrame(12)}>
                <AbsoluteFill style={{
                    transform: `translate(${Math.sin(frame * 1.5) * 10}px, ${Math.cos(frame * 1.5) * 10}px)`,
                    filter: frame % 3 === 0 ? 'contrast(1.5) brightness(1.2)' : 'none'
                }}>
                    <Overlay x="50%" y="40%">
                        <EarthquakeIcon size={500} />
                    </Overlay>
                </AbsoluteFill>
                <Overlay y="85%">
                    <WordHighlight text="THE CRUST SHIFTS" color={OCEAN_THEME.earth} />
                </Overlay>
                <AudioSFX src="whoosh.mp3" volume={1} />
                <AudioSFX src="rise.mp3" volume={0.5} />
            </Sequence>

            {/* Final Moment: Evaporation */}
            <Sequence from={getFrame(148)} durationInFrames={getFrame(6.6)}>
                <Overlay scale={interpolate(frame - getFrame(148), [0, 200], [1, 2], { extrapolateRight: 'clamp' })}>
                    <PlanetDryIcon size={600} />
                </Overlay>
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundColor: 'white',
                    opacity: interpolate(frame - getFrame(152), [0, 60], [0, 1])
                }} />
                <Overlay>
                    <WordHighlight text="EVAPORATION" color="#000" delay={getFrame(4)} />
                </Overlay>
                <AudioSFX src="rise.mp3" volume={1} />
            </Sequence>

        </AbsoluteFill>
    );
};
