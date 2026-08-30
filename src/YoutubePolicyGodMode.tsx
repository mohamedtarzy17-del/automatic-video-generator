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
    blue: '#2979FF',
    red: '#FF1744',
    green: '#00E676',
    amber: '#FFC400',
    purple: '#6200EA',
    cyan: '#00E5FF',
    white: '#FFFFFF',
    black: '#0F172A',
    accent: '#00FFCC',
    glow: 'rgba(0, 255, 204, 0.5)'
};

const FontStyles: React.FC = () => (
    <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&display=swap');
        @keyframes glowing {
            0% { filter: drop-shadow(0 0 5px ${THEME.accent}); }
            50% { filter: drop-shadow(0 0 20px ${THEME.accent}); }
            100% { filter: drop-shadow(0 0 5px ${THEME.accent}); }
        }
        .glowing-text {
            animation: glowing 2s infinite ease-in-out;
        }
        `}
    </style>
);

// --- High-End Components ---

const StickFigure: React.FC<{ pose: 'stressed' | 'working' | 'happy'; color?: string }> = ({ pose, color = THEME.white }) => {
    const frame = useCurrentFrame();
    const bob = Math.sin(frame / 5) * 5;

    return (
        <svg width="200" height="300" viewBox="0 0 100 150">
            <g transform={`translate(50, 70)`}>
                {/* Body */}
                <line x1="0" y1="0" x2="0" y2="40" stroke={color} strokeWidth="5" strokeLinecap="round" />
                {/* Head */}
                <circle cx="0" cy={-15 + bob} r="10" fill="none" stroke={color} strokeWidth="5" />
                {/* Arms */}
                {pose === 'stressed' ? (
                    <>
                        <line x1="0" y1="5" x2="-20" y2="-20" stroke={color} strokeWidth="5" strokeLinecap="round" />
                        <line x1="0" y1="5" x2="20" y2="-20" stroke={color} strokeWidth="5" strokeLinecap="round" />
                    </>
                ) : (
                    <>
                        <line x1="0" y1="10" x2="-20" y2="30" stroke={color} strokeWidth="5" strokeLinecap="round" />
                        <line x1="0" y1="10" x2="20" y2="30" stroke={color} strokeWidth="5" strokeLinecap="round" />
                    </>
                )}
                {/* Legs */}
                <line x1="0" y1="40" x2="-15" y2="70" stroke={color} strokeWidth="5" strokeLinecap="round" />
                <line x1="0" y1="40" x2="15" y2="70" stroke={color} strokeWidth="5" strokeLinecap="round" />
            </g>
        </svg>
    );
};

const Callout: React.FC<{ text: string; x: number; y: number; delay?: number }> = ({ text, x, y, delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const p = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 12 } });

    return (
        <div style={{
            position: 'absolute',
            left: x,
            top: y,
            opacity: p,
            transform: `scale(${p})`,
            zIndex: 100
        }}>
            <div style={{
                background: THEME.accent,
                color: THEME.black,
                padding: '10px 20px',
                borderRadius: '0 15px 15px 15px',
                fontFamily: 'JetBrains Mono',
                fontWeight: 900,
                fontSize: 20,
                boxShadow: `0 0 20px ${THEME.glow}`
            }}>
                {text}
            </div>
            <svg width="40" height="40" style={{ position: 'absolute', left: -20, top: 0 }}>
                <path d="M 40 0 L 0 40" stroke={THEME.accent} strokeWidth="4" />
            </svg>
        </div>
    );
};

const GlowingText: React.FC<{ text: string; size?: number }> = ({ text, size = 150 }) => {
    const frame = useCurrentFrame();
    const intensity = Math.sin(frame / 10) * 0.5 + 0.5;

    return (
        <h1 className="glowing-text" style={{
            fontFamily: 'Outfit',
            fontSize: size,
            fontWeight: 900,
            color: THEME.white,
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: -5,
            textShadow: `0 0 ${20 * intensity}px ${THEME.accent}`
        }}>
            {text}
        </h1>
    );
};

const TransitionOverlay: React.FC<{ trigger: number }> = ({ trigger }) => {
    const frame = useCurrentFrame();
    const { width } = useVideoConfig();
    const p = interpolate(frame, [trigger, trigger + 15], [width, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
    });
    const pOut = interpolate(frame, [trigger + 45, trigger + 60], [0, -width], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp'
    });

    if (frame < trigger || frame > trigger + 60) return null;

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: THEME.accent,
            transform: `translateX(${p + pOut}px)`,
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <h1 style={{ fontFamily: 'Outfit', fontSize: 100, color: THEME.black }}>SYSTEM_RESET</h1>
        </div>
    );
};

// --- Scene Builder ---

const GodScene: React.FC<{ children: React.ReactNode; bg: string }> = ({ children, bg }) => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ backgroundColor: bg, overflow: 'hidden' }}>
            {/* Dynamic Vignette */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.4) 100%)' }} />

            {/* 1s Pulse Background Elements */}
            {[...Array(5)].map((_, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    width: 200,
                    height: 200,
                    border: `1px solid ${THEME.white}`,
                    opacity: 0.1,
                    top: `${Math.sin(frame / 50 + i) * 100}%`,
                    left: `${Math.cos(frame / 50 + i) * 100}%`,
                    transform: `rotate(${frame + i * 45}deg)`
                }} />
            ))}

            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                {children}
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

export const YoutubePolicyGodMode: React.FC = () => {
    const { fps } = useVideoConfig();
    const sceneDur = 180;

    return (
        <AbsoluteFill>
            <FontStyles />
            <Audio src={staticFile("youtube_policy_vo.wav")} />
            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.15} />

            <Series>
                {/* 1. Intro - Stressed Creator */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <GodScene bg={THEME.purple}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 50 }}>
                            <StickFigure pose="stressed" />
                            <GlowingText text="AUTMATION_DIES" />
                        </div>
                        <Callout text="MONETIZATION: OFF" x={200} y={200} delay={30} />
                    </GodScene>
                </Series.Sequence>

                {/* 2. Trillions/Charts */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <GodScene bg={THEME.blue}>
                        <div style={{ position: 'relative' }}>
                            <svg width="600" height="300" viewBox="0 0 200 100">
                                <path
                                    d={`M 0 100 Q 50 ${interpolate(useCurrentFrame() % 180, [0, 90], [100, 0])} 200 20`}
                                    stroke={THEME.accent}
                                    strokeWidth="5"
                                    fill="none"
                                    className="glowing-line"
                                />
                            </svg>
                            <GlowingText text="TRILLIONS_IN" size={100} />
                        </div>
                        <Callout text="compute_lvl: max" x={1200} y={300} delay={45} />
                    </GodScene>
                </Series.Sequence>

                {/* 3. Soul of the Video */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <GodScene bg={THEME.cyan}>
                        <StickFigure pose="happy" color={THEME.black} />
                        <GlowingText text="ADD_SOUL" />
                        <Callout text="HUMAN_VALUE: 100%" x={800} y={700} delay={15} />
                    </GodScene>
                </Series.Sequence>

                {/* 4. The Purge */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <GodScene bg={THEME.red}>
                        <div style={{ transform: 'scale(1.5)' }}>
                            <GlowingText text="SYSTEM_PURGE" size={120} />
                        </div>
                        <div style={{ display: 'flex', gap: 10, marginTop: 40 }}>
                            {[...Array(10)].map((_, i) => (
                                <div key={i} style={{ width: 10, height: 100, background: THEME.white, opacity: interpolate(useCurrentFrame() % 10, [0, 10], [0, 1]) }} />
                            ))}
                        </div>
                    </GodScene>
                </Series.Sequence>

                {/* 5. July 15 Reset */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <GodScene bg={THEME.amber}>
                        <div style={{ perspective: '1000px' }}>
                            <div style={{ transform: `rotateY(${useCurrentFrame() * 5}deg)` }}>
                                <GlowingText text="JULY 15" size={200} />
                            </div>
                        </div>
                        <Callout text="ALGO_UPDATE_v15" x={400} y={150} delay={10} />
                    </GodScene>
                </Series.Sequence>

                {/* 6. Human Gatekeeper */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <GodScene bg={THEME.black}>
                        <svg width="400" height="400" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" stroke={THEME.accent} strokeWidth="2" fill="none" className="glowing-text" />
                            <path d="M50 50 L50 20" stroke={THEME.white} strokeWidth="5" transform={`rotate(${useCurrentFrame() * 2} 50 50)`} />
                        </svg>
                        <GlowingText text="24H_REVIEW" size={80} />
                    </GodScene>
                </Series.Sequence>

                {/* 7. Profanity Freedom */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <GodScene bg={THEME.green}>
                        <div style={{ transform: `scale(${1 + Math.sin(useCurrentFrame() / 5) * 0.1})` }}>
                            <GlowingText text="SPEAK_FREE" size={150} />
                        </div>
                        <Callout text="PROFANITY: OK" x={1000} y={100} delay={20} />
                    </GodScene>
                </Series.Sequence>

                {/* 8. 2026 Controversy */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <GodScene bg={THEME.blue}>
                        < StickFigure pose="happy" />
                        <GlowingText text="2026_UPDATE" size={100} />
                        <Callout text="CONTROVERSY: READY" x={300} y={500} delay={5} />
                    </GodScene>
                </Series.Sequence>

                {/* 9. Final Guide */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <GodScene bg={THEME.white}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                            {['DISRUPT', 'COMMENT', 'DISCLOSE'].map((t, i) => (
                                <h1 key={i} style={{ fontFamily: 'Outfit', background: THEME.black, color: THEME.white, padding: '10px 50px', transform: `translateX(${interpolate(useCurrentFrame() - i * 10, [0, 20], [200, 0], { extrapolateRight: 'clamp' })}px)` }}>{t}</h1>
                            ))}
                        </div>
                    </GodScene>
                </Series.Sequence>

                {/* 10. Outro */}
                <Series.Sequence durationInFrames={2058 - (sceneDur * 9)}>
                    <GodScene bg={THEME.black}>
                        <GlowingText text="AUTHENTIC" size={180} />
                        <StickFigure pose="happy" color={THEME.accent} />
                    </GodScene>
                </Series.Sequence>
            </Series>

            {/* Custom Transitions Spanning every scene change */}
            <TransitionOverlay trigger={180} />
            <TransitionOverlay trigger={180 * 3} />
            <TransitionOverlay trigger={180 * 5} />
            <TransitionOverlay trigger={180 * 7} />
            <TransitionOverlay trigger={180 * 9} />

            {/* Global SFX layering */}
            {[...Array(11)].map((_, i) => (
                <Sequence key={i} from={i * 180}>
                    <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.6} />
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};
