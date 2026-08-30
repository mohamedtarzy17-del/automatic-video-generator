import React from 'react';
import {
    AbsoluteFill,
    useVideoConfig,
    useCurrentFrame,
    interpolate,
    spring,
    Audio,
    staticFile,
    Sequence,
} from 'remotion';

const THEME = {
    bg: '#ffffff',
    text: '#000000',
    accent: '#00FF00', // Vibrant Green
    secondary: '#f9f9f9',
    gray: '#666666',
};

const TitleScene: React.FC<{ text: string; subtext?: string }> = ({ text, subtext }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const words = text.split(' ');

    return (
        <AbsoluteFill style={{
            backgroundColor: THEME.bg,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 100
        }}>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                {words.map((word, i) => {
                    const anim = spring({
                        frame: frame - (i * 3),
                        fps,
                        config: { damping: 12 },
                    });
                    return (
                        <div key={i} style={{
                            fontSize: 120,
                            fontWeight: 900,
                            fontFamily: 'Inter, sans-serif',
                            color: THEME.text,
                            opacity: anim,
                            transform: `scale(${interpolate(anim, [0, 1], [0.5, 1])}) translateY(${interpolate(anim, [0, 1], [50, 0])}px)`,
                        }}>
                            {word}
                        </div>
                    );
                })}
            </div>
            {subtext && (
                <div style={{
                    fontSize: 48,
                    marginTop: 40,
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    color: THEME.gray,
                    opacity: spring({ frame: frame - 20, fps }),
                }}>
                    {subtext}
                </div>
            )}
        </AbsoluteFill>
    );
};

const AnalyticsScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const countAnim = spring({
        frame,
        fps,
        config: { damping: 15 },
    });

    const count = Math.round(interpolate(countAnim, [0, 1], [0, 1254302]));

    return (
        <AbsoluteFill style={{
            backgroundColor: THEME.secondary,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '60px 100px',
                borderRadius: 40,
                boxShadow: '0 20px 80px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 20,
                transform: `scale(${spring({ frame, fps, config: { damping: 12 } })})`,
            }}>
                <div style={{ fontSize: 32, fontWeight: 600, color: THEME.gray }}>Total Subscribers</div>
                <div style={{ fontSize: 160, fontWeight: 900, color: THEME.text }}>
                    {count.toLocaleString()}
                </div>
                <div style={{
                    backgroundColor: THEME.accent,
                    padding: '10px 30px',
                    borderRadius: 100,
                    fontSize: 24,
                    fontWeight: 700,
                    color: 'black',
                    transform: `translateY(${interpolate(frame, [0, 30], [20, 0], { extrapolateRight: 'clamp' })}px)`,
                    opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateRight: 'clamp' }),
                }}>
                    +1,250% Growth 🚀
                </div>
            </div>
        </AbsoluteFill>
    );
};

const ScreenshotScene: React.FC = () => {
    const frame = useCurrentFrame();

    const zoom = interpolate(frame, [0, 300], [1, 1.2]);
    const x = interpolate(frame, [0, 300], [0, -100]);
    const y = interpolate(frame, [0, 300], [0, -50]);

    return (
        <AbsoluteFill style={{ backgroundColor: THEME.bg }}>
            {/* Mock Dashboard */}
            <div style={{
                width: '120%',
                height: '120%',
                transform: `scale(${zoom}) translate(${x}px, ${y}px)`,
                padding: 100,
                display: 'grid',
                gridTemplateColumns: '1fr 3fr',
                gap: 40,
                opacity: 0.9
            }}>
                <div style={{ backgroundColor: '#eee', borderRadius: 20 }} />
                <div style={{ display: 'grid', gridTemplateRows: '1fr 4fr', gap: 40 }}>
                    <div style={{ backgroundColor: '#eee', borderRadius: 20 }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
                        <div style={{ backgroundColor: '#f0f0f0', borderRadius: 20, border: '1px solid #ddd' }} />
                        <div style={{ backgroundColor: '#f0f0f0', borderRadius: 20, border: '1px solid #ddd' }} />
                    </div>
                </div>
            </div>

            {/* Floating UI Elements */}
            <div style={{
                position: 'absolute',
                top: '20%',
                right: '15%',
                backgroundColor: 'white',
                padding: '30px 50px',
                borderRadius: 20,
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                transform: `translateY(${Math.sin(frame / 20) * 10}px)`,
                border: '4px solid ' + THEME.accent
            }}>
                <div style={{ fontSize: 40, fontWeight: 800 }}>AI ENABLED</div>
            </div>
        </AbsoluteFill>
    );
};

const AvatarScene: React.FC = () => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill style={{
            backgroundColor: THEME.bg,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            {/* Minimalist Green Avatar */}
            <div style={{
                width: 300,
                height: 300,
                backgroundColor: THEME.accent,
                borderRadius: 100,
                position: 'relative',
                transform: `scale(${spring({ frame, fps: 30 })}) rotate(${Math.sin(frame / 10) * 5}deg)`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {/* Eyes */}
                <div style={{ display: 'flex', gap: 60 }}>
                    <div style={{ width: 40, height: 40, backgroundColor: 'black', borderRadius: '50%' }} />
                    <div style={{ width: 40, height: 40, backgroundColor: 'black', borderRadius: '50%' }} />
                </div>
                {/* Smile */}
                <div style={{
                    position: 'absolute',
                    bottom: 80,
                    width: 100,
                    height: 50,
                    borderBottom: '10px solid black',
                    borderRadius: '0 0 50px 50px'
                }} />
            </div>

            <div style={{
                position: 'absolute',
                bottom: 150,
                fontSize: 64,
                fontWeight: 900,
                textAlign: 'center'
            }}>
                READY TO SCALE?
            </div>
        </AbsoluteFill>
    );
};

export const ViralExplainer: React.FC = () => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill style={{ backgroundColor: THEME.bg }}>
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');`}
            </style>

            {/* Background Music */}
            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.15} />

            <Sequence durationInFrames={60}>
                <TitleScene text="HOW TO GO VIRAL" subtext="The Secret AI Strategy" />
                <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.5} />
            </Sequence>

            <Sequence from={60} durationInFrames={90}>
                <AnalyticsScene />
                <Audio src={staticFile("sfx/pop.mp3")} volume={0.5} />
            </Sequence>

            <Sequence from={150} durationInFrames={90}>
                <ScreenshotScene />
                <Audio src={staticFile("sfx/typing.mp3")} volume={0.3} />
            </Sequence>

            <Sequence from={240} durationInFrames={120}>
                <AvatarScene />
                <Audio src={staticFile("sfx/pop.mp3")} volume={0.5} />
            </Sequence>

            {/* Global Transitions (Optional subtle film grain or overlays) */}
            <AbsoluteFill style={{
                pointerEvents: 'none',
                opacity: 0.03,
                backgroundColor: 'black',
                display: frame % 2 === 0 ? 'block' : 'none'
            }} />
        </AbsoluteFill>
    );
};
