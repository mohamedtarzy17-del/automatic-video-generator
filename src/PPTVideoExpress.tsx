import React, { useMemo } from 'react';
import {
    AbsoluteFill,
    useVideoConfig,
    Audio,
    staticFile,
    Series,
    Sequence,
    interpolate,
    useCurrentFrame,
    spring,
    Easing
} from 'remotion';

const THEME = {
    bg: '#0F172A',
    primary: '#2DD4BF', // Teal
    secondary: '#818CF8', // Indigo
    accent: '#F472B6', // Pink
    warning: '#FBBF24', // Amber
    danger: '#F87171', // Red
    success: '#34D399', // Green
    white: '#F8FAF8',
    black: '#020617',
    glass: 'rgba(255, 255, 255, 0.05)',
    glassBorder: 'rgba(255, 255, 255, 0.1)'
};

const FontStyles: React.FC = () => (
    <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;900&family=JetBrains+Mono:wght@700&family=Syne:wght@800&display=swap');
        
        .premium-shadow {
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        }
        
        .glass-morphism {
            background: ${THEME.glass};
            backdrop-filter: blur(12px);
            border: 1px solid ${THEME.glassBorder};
            border-radius: 24px;
        }

        @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-5px, 5px); }
            40% { transform: translate(-5px, -5px); }
            60% { transform: translate(5px, 5px); }
            80% { transform: translate(5px, -5px); }
            100% { transform: translate(0); }
        }

        .glitch {
            animation: glitch 0.2s infinite;
            color: ${THEME.danger} !important;
        }

        @keyframes rapid-pulse {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 0.8; }
        }

        .rapid-pulse {
            animation: rapid-pulse 0.5s infinite;
        }
        `}
    </style>
);

// --- Fast Paced Sub-Components ---

const WordFlash: React.FC<{ words: string[]; delay: number; duration: number }> = ({ words, delay, duration }) => {
    const frame = useCurrentFrame();
    const wordIndex = Math.floor((frame - delay) / (duration / words.length));
    const currentWord = words[wordIndex % words.length];

    if (frame < delay || frame > delay + duration) return null;

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: THEME.black,
            zIndex: 50
        }}>
            <h1 style={{ fontFamily: 'Syne', fontSize: 180, color: THEME.primary, fontWeight: 900 }}>{currentWord}</h1>
        </div>
    );
};

const DataGrid: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 10, opacity: 0.3 }}>
            {[...Array(100)].map((_, i) => (
                <div key={i} style={{
                    height: 20,
                    background: (i + frame) % 5 === 0 ? THEME.primary : THEME.glassBorder,
                    borderRadius: 4
                }} />
            ))}
        </div>
    );
};

const RapidList: React.FC<{ items: string[] }> = ({ items }) => {
    const frame = useCurrentFrame();
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {items.map((item, i) => {
                const visible = frame > i * 15;
                return (
                    <div key={i} className="glass-morphism" style={{
                        padding: '15px 30px',
                        opacity: visible ? 1 : 0,
                        transform: `translateX(${visible ? 0 : -50}px)`,
                        color: THEME.white,
                        fontFamily: 'Outfit',
                        fontWeight: 900,
                        fontSize: 24,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 20
                    }}>
                        <div style={{ width: 10, height: 10, background: THEME.primary, borderRadius: '50%' }} />
                        {item}
                    </div>
                );
            })}
        </div>
    );
};

const StickFigure: React.FC<{
    pose: 'point' | 'shrug' | 'panic' | 'celebrate' | 'thinking';
    color?: string;
    size?: number;
}> = ({ pose, color = THEME.white, size = 150 }) => {
    const frame = useCurrentFrame();
    const bob = Math.sin(frame / 6) * 4;

    return (
        <svg width={size} height={size * 1.5} viewBox="0 0 100 150" style={{ overflow: 'visible' }}>
            <g transform="translate(50, 75)">
                <line x1="0" y1="-20" x2="0" y2="30" stroke={color} strokeWidth="6" strokeLinecap="round" />
                <circle cx="0" cy={-40 + bob} r="15" fill="none" stroke={color} strokeWidth="6" />
                {pose === 'point' && (
                    <><line x1="0" y1="-10" x2="40" y2="-10" stroke={color} strokeWidth="6" strokeLinecap="round" /><line x1="0" y1="-10" x2="-20" y2="10" stroke={color} strokeWidth="6" strokeLinecap="round" /></>
                )}
                {pose === 'shrug' && (
                    <><line x1="0" y1="-10" x2="30" y2="-30" stroke={color} strokeWidth="6" strokeLinecap="round" /><line x1="0" y1="-10" x2="-30" y2="-30" stroke={color} strokeWidth="6" strokeLinecap="round" /></>
                )}
                {pose === 'panic' && (
                    <><line x1="0" y1="-10" x2="35" y2="-50" stroke={color} strokeWidth="6" strokeLinecap="round" /><line x1="0" y1="-10" x2="-35" y2="-50" stroke={color} strokeWidth="6" strokeLinecap="round" /><path d="M -10 10 Q 0 0 10 10" fill="none" stroke={color} strokeWidth="3" transform="translate(0, -45)" /></>
                )}
                {pose === 'celebrate' && (
                    <><line x1="0" y1="-10" x2="35" y2="-60" stroke={color} strokeWidth="6" strokeLinecap="round" /><line x1="0" y1="-10" x2="-35" y2="-60" stroke={color} strokeWidth="6" strokeLinecap="round" /></>
                )}
                {pose === 'thinking' && (
                    <><line x1="0" y1="-10" x2="20" y2="10" stroke={color} strokeWidth="6" strokeLinecap="round" /><line x1="0" y1="-10" x2="-10" y2="-35" stroke={color} strokeWidth="6" strokeLinecap="round" /><path d="M -5 -60 Q 5 -70 15 -60" fill="none" stroke={THEME.accent} strokeWidth="4" /></>
                )}
                <line x1="0" y1="30" x2="20" y2="70" stroke={color} strokeWidth="6" strokeLinecap="round" />
                <line x1="0" y1="30" x2="-20" y2="70" stroke={color} strokeWidth="6" strokeLinecap="round" />
            </g>
        </svg>
    );
};

// --- Fast Scenes ---

const Scene1_Intro_Fast: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ background: THEME.bg, justifyContent: 'center', alignItems: 'center' }}>
            <DataGrid />
            <Sequence from={0} durationInFrames={15}>
                <h1 style={{ fontFamily: 'Syne', fontSize: 100, color: THEME.primary }}>LOADING...</h1>
            </Sequence>
            <Sequence from={15} durationInFrames={15}>
                <h1 style={{ fontFamily: 'Syne', fontSize: 150, color: THEME.white }}>YOUTUBE</h1>
            </Sequence>
            <Sequence from={30} durationInFrames={15}>
                <h1 className="glitch" style={{ fontFamily: 'Syne', fontSize: 150 }}>PURGE</h1>
            </Sequence>
            <Sequence from={45}>
                <StickFigure pose="point" size={200} />
            </Sequence>
        </AbsoluteFill>
    );
};

const Scene2_ThePolicy_Fast: React.FC = () => {
    return (
        <AbsoluteFill style={{ background: THEME.bg, padding: 80 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                <h1 style={{ fontFamily: 'Syne', fontSize: 60, color: THEME.warning }}>NEW RULES:</h1>
                <RapidList items={["NO REPETITION", "NO INAUTHENTICITY", "NO SLOP", "JULY 15, 2025"]} />
            </div>
            <div style={{ position: 'absolute', bottom: 50, right: 100 }}>
                <StickFigure pose="thinking" size={150} />
            </div>
        </AbsoluteFill>
    );
};

const Scene3_Advertisers_Fast: React.FC = () => {
    return (
        <AbsoluteFill style={{ background: THEME.danger + '22' }}>
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Sequence from={0} durationInFrames={30}>
                    <h1 style={{ fontFamily: 'Syne', fontSize: 120, color: THEME.danger }}>ADVERTISERS</h1>
                </Sequence>
                <Sequence from={30} durationInFrames={30}>
                    <h1 style={{ fontFamily: 'Syne', fontSize: 150, color: THEME.white }}>ARE</h1>
                </Sequence>
                <Sequence from={60}>
                    <h1 className="glitch" style={{ fontFamily: 'Syne', fontSize: 200 }}>TERRIFIED</h1>
                </Sequence>
                <div style={{ position: 'absolute', bottom: 100 }}>
                    <StickFigure pose="panic" size={200} />
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

const Scene4_Stats_Fast: React.FC = () => {
    return (
        <AbsoluteFill style={{ background: THEME.bg, padding: 100 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50, height: '100%' }}>
                <div style={{ background: THEME.danger, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: 30 }}>
                    <h1 style={{ fontFamily: 'Syne', fontSize: 120, color: THEME.black }}>49%</h1>
                    <p style={{ fontFamily: 'Outfit', fontSize: 30, color: THEME.white }}>WILL LEAVE</p>
                </div>
                <div style={{ background: THEME.warning, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: 30 }}>
                    <h1 style={{ fontFamily: 'Syne', fontSize: 120, color: THEME.black }}>85%</h1>
                    <p style={{ fontFamily: 'Outfit', fontSize: 30, color: THEME.white }}>DISRUPTED</p>
                </div>
            </div>
        </AbsoluteFill>
    );
};

const Scene5_Survival_Fast: React.FC = () => {
    return (
        <AbsoluteFill style={{ background: THEME.success + '22', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 40 }}>
                <div className="rapid-pulse" style={{ padding: 40, background: THEME.success, borderRadius: '50%', width: 300, height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'Syne', fontSize: 60, color: THEME.black, lineHeight: 1 }}>BE HUMAN</h1>
                </div>
                <div className="rapid-pulse" style={{ animationDelay: '0.2s', padding: 40, background: THEME.primary, borderRadius: '50%', width: 300, height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <h1 style={{ fontFamily: 'Syne', fontSize: 60, color: THEME.black, lineHeight: 1 }}>ADD VALUE</h1>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// --- Composition ---

export const PPTVideoExpress: React.FC = () => {
    const sceneDur = 150; // 5 seconds per scene, but inner sequences are fast

    return (
        <AbsoluteFill style={{ backgroundColor: THEME.bg }}>
            <FontStyles />
            <Audio src={staticFile("ppt_video_full_vo.wav")} />
            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.15} />

            <Series>
                <Series.Sequence durationInFrames={sceneDur}><Scene1_Intro_Fast /></Series.Sequence>
                <Series.Sequence durationInFrames={sceneDur}><Scene2_ThePolicy_Fast /></Series.Sequence>
                <Series.Sequence durationInFrames={sceneDur}><Scene3_Advertisers_Fast /></Series.Sequence>
                <Series.Sequence durationInFrames={sceneDur}><Scene4_Stats_Fast /></Series.Sequence>
                <Series.Sequence durationInFrames={sceneDur}><Scene5_Survival_Fast /></Series.Sequence>
                <Series.Sequence durationInFrames={1800 - 750}>
                    <AbsoluteFill style={{ background: THEME.black, justifyContent: 'center', alignItems: 'center' }}>
                        <h1 className="glitch" style={{ fontFamily: 'Syne', fontSize: 180, fontWeight: 900 }}>DONE</h1>
                        <StickFigure pose="celebrate" size={150} />
                    </AbsoluteFill>
                </Series.Sequence>
            </Series>

            {/* Fast Cuts Visual Glitch Overlay */}
            {[...Array(30)].map((_, i) => (
                <Sequence key={i} from={i * 60} durationInFrames={2}>
                    <AbsoluteFill style={{ background: THEME.white, opacity: 0.1 }} />
                </Sequence>
            ))}

            {/* Hyper-Frequent Whoosh SFX (every 1 second) */}
            {[...Array(60)].map((_, i) => (
                <Sequence key={i} from={i * 30}>
                    <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.4} />
                </Sequence>
            ))}

            <AbsoluteFill style={{ pointerEvents: 'none', opacity: 0.05, background: `url('https://www.transparenttextures.com/patterns/asfalt-dark.png')` }} />
        </AbsoluteFill>
    );
};
