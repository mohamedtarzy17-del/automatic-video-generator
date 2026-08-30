import React from 'react';
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
    bg: '#000000',
    text: '#FFFFFF',
    accent1: '#FF3D00', // Bold Red
    accent2: '#2979FF', // Electric Blue
    accent3: '#00E676', // Emerald Green
    accent4: '#FFC400', // Vivid Amber
    surface: '#121212',
    muted: '#404040'
};

const FontStyles: React.FC = () => (
    <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&display=swap');
        `}
    </style>
);

// --- Superior UI Components ---

const CleanStick: React.FC<{ pose: 'stressed' | 'explaining' | 'celebrating'; color?: string }> = ({ pose, color = THEME.text }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Smooth idle breathing
    const breath = Math.sin(frame / 6) * 3;

    return (
        <svg width="300" height="400" viewBox="0 0 100 150">
            <g transform={`translate(50, 80)`}>
                {/* Body - Physics based bounce */}
                <line x1="0" y1="0" x2="0" y2="40" stroke={color} strokeWidth="6" strokeLinecap="round" />
                {/* Head */}
                <circle cx="0" cy={-18 + breath} r="12" fill="none" stroke={color} strokeWidth="6" />

                {/* Arms - Pose Specific */}
                {pose === 'stressed' && (
                    <>
                        <line x1="0" y1="8" x2="-25" y2={-10 + Math.sin(frame / 4) * 5} stroke={color} strokeWidth="6" strokeLinecap="round" />
                        <line x1="0" y1="8" x2="25" y2={-10 + Math.cos(frame / 4) * 5} stroke={color} strokeWidth="6" strokeLinecap="round" />
                    </>
                )}
                {pose === 'explaining' && (
                    <>
                        <line x1="0" y1="10" x2="-30" y2={10 + Math.sin(frame / 10) * 15} stroke={color} strokeWidth="6" strokeLinecap="round" />
                        <line x1="0" y1="10" x2="30" y2={30} stroke={color} strokeWidth="6" strokeLinecap="round" />
                    </>
                )}
                {pose === 'celebrating' && (
                    <>
                        <line x1="0" y1="10" x2="-30" y2={-20} stroke={color} strokeWidth="6" strokeLinecap="round" />
                        <line x1="0" y1="10" x2="30" y2={-20} stroke={color} strokeWidth="6" strokeLinecap="round" />
                    </>
                )}

                {/* Legs */}
                <line x1="0" y1="40" x2="-15" y2="75" stroke={color} strokeWidth="6" strokeLinecap="round" />
                <line x1="0" y1="40" x2="15" y2="75" stroke={color} strokeWidth="6" strokeLinecap="round" />
            </g>
        </svg>
    );
};

const BoldTitle: React.FC<{ text: string; color?: string; sub?: string }> = ({ text, color = THEME.text, sub }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const words = text.split(' ');

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                {words.map((w, i) => {
                    const enter = spring({ frame: frame - (i * 3), fps, config: { damping: 12 } });
                    return (
                        <span key={i} style={{
                            fontFamily: 'Outfit',
                            fontSize: 160,
                            fontWeight: 900,
                            color,
                            textTransform: 'uppercase',
                            lineHeight: 0.8,
                            letterSpacing: -8,
                            transform: `translateY(${interpolate(enter, [0, 1], [100, 0])}px) scale(${enter})`,
                            opacity: enter,
                            display: 'inline-block'
                        }}>
                            {w}
                        </span>
                    );
                })}
            </div>
            {sub && (
                <div style={{
                    marginTop: 40,
                    background: color,
                    color: THEME.bg,
                    padding: '10px 30px',
                    fontFamily: 'JetBrains Mono',
                    fontSize: 32,
                    display: 'inline-block',
                    transform: `translateX(${interpolate(frame, [0, 20], [-100, 0], { extrapolateRight: 'clamp' })}px)`,
                    opacity: interpolate(frame, [0, 15], [0, 1])
                }}>
                    {`> ${sub}_`}
                </div>
            )}
        </div>
    );
};

const FlatCallout: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
    const frame = useCurrentFrame();
    const p = spring({ frame: Math.max(0, frame - delay), fps: 30 });

    return (
        <div style={{
            background: THEME.text,
            color: THEME.bg,
            padding: '15px 40px',
            fontFamily: 'Outfit',
            fontWeight: 900,
            fontSize: 45,
            borderRadius: 100,
            transform: `scale(${p}) translateY(${interpolate(p, [0, 1], [50, 0])}px)`,
            opacity: p,
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}>
            {text}
        </div>
    );
};

// --- Animations/Charts ---

const CleanPie: React.FC<{ progress: number }> = ({ progress }) => {
    const radius = 80;
    const circ = 2 * Math.PI * radius;
    const offset = circ - (progress * circ);

    return (
        <svg width="300" height="300" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r={radius} fill="none" stroke={THEME.muted} strokeWidth="15" />
            <circle
                cx="100" cy="100" r={radius}
                fill="none" stroke={THEME.accent1}
                strokeWidth="15"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
            />
        </svg>
    );
};

const TransitionWipe: React.FC<{ type: 'left' | 'right' }> = ({ type }) => {
    const frame = useCurrentFrame();
    const { width } = useVideoConfig();

    // Total transition is 30 frames
    // In: 0-12, Constant: 12-18, Out: 18-30
    const progressIn = spring({ frame, fps: 30, config: { stiffness: 200 } });
    const progressOut = spring({ frame: frame - 18, fps: 30, config: { stiffness: 200 } });

    const xIn = type === 'right' ? interpolate(progressIn, [0, 1], [width, 0]) : interpolate(progressIn, [0, 1], [-width, 0]);
    const xOut = type === 'right' ? interpolate(progressOut, [0, 1], [0, -width]) : interpolate(progressOut, [0, 1], [0, width]);

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: THEME.bg,
            transform: `translateX(${xIn + xOut}px)`,
            zIndex: 1000,
            borderLeft: type === 'right' ? `10px solid ${THEME.accent2}` : 'none',
            borderRight: type === 'left' ? `10px solid ${THEME.accent2}` : 'none',
        }} />
    );
};

// --- Scene Architecture ---

const MasterScene: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = THEME.bg }) => {
    const frame = useCurrentFrame();

    // The "1-Second Dynamic" shift
    const zoom = interpolate(frame % 30, [0, 30], [1, 1.02], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ backgroundColor: bg, overflow: 'hidden' }}>
            {/* Grid Background */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `radial-gradient(${THEME.muted} 1px, transparent 1px)`,
                backgroundSize: '100px 100px',
                opacity: 0.2
            }} />

            <AbsoluteFill style={{
                transform: `scale(${zoom})`,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 100
            }}>
                {children}
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

// --- Core Video Logic ---

export const YoutubePolicyFinal: React.FC = () => {
    const { fps } = useVideoConfig();
    const sceneDur = 180; // 6 Seconds

    return (
        <AbsoluteFill>
            <FontStyles />
            <Audio src={staticFile("youtube_policy_vo.wav")} />
            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.1} />

            <Series>
                {/* 1. Intro - Dead Automation */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <MasterScene>
                        <BoldTitle text="AUTOMATION IS DEAD" color={THEME.accent1} sub="STATUS: SHUTTING_DOWN" />
                        <div style={{ position: 'absolute', right: 200, bottom: 200 }}>
                            <CleanStick pose="stressed" />
                        </div>
                    </MasterScene>
                </Series.Sequence>

                {/* 2. Declaration of War */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <MasterScene bg={THEME.surface}>
                        <div style={{ transform: 'rotate(-5deg)' }}>
                            <BoldTitle text="YOUTUBE DECLARES WAR" color={THEME.accent2} sub="TARGET: INAUTHENTIC_CONTENT" />
                        </div>
                        <div style={{ position: 'absolute', top: 200, left: 300 }}>
                            <FlatCallout text="JULY 15 RESET" />
                        </div>
                    </MasterScene>
                </Series.Sequence>

                {/* 3. The Human Soul */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <MasterScene>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 100 }}>
                            <BoldTitle text="ADD A SOUL" color={THEME.accent3} />
                            <CleanStick pose="explaining" />
                        </div>
                        <div style={{ width: 600, height: 10, background: THEME.accent3, marginTop: 40 }} />
                    </MasterScene>
                </Series.Sequence>

                {/* 4. The Purge Chart */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <MasterScene bg={THEME.surface}>
                        <div style={{ display: 'flex', gap: 100, alignItems: 'center' }}>
                            <CleanPie progress={interpolate(useCurrentFrame(), [0, 60], [0, 0.9])} />
                            <BoldTitle text="90% CHOPPED" color={THEME.accent1} sub="LOW_EFFORT_PURGE" />
                        </div>
                    </MasterScene>
                </Series.Sequence>

                {/* 5. The Algorithm Update */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <MasterScene>
                        <div style={{ position: 'relative' }}>
                            <BoldTitle text="ALGORITHM RESET" color={THEME.accent4} />
                            <div style={{ position: 'absolute', bottom: -100, right: -100 }}>
                                <FlatCallout text="NEW_LOGIC_V2" />
                            </div>
                        </div>
                    </MasterScene>
                </Series.Sequence>

                {/* 6. Human Gatekeeper */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <MasterScene bg={THEME.surface}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ fontSize: 300, fontWeight: 900, color: THEME.text, fontFamily: 'Outfit', lineHeight: 1 }}>24H</div>
                            <BoldTitle text="HUMAN REVIEW" color={THEME.text} sub="PRECISION_GATEKEEPING" />
                        </div>
                    </MasterScene>
                </Series.Sequence>

                {/* 7. Profanity Freedom */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <MasterScene>
                        <BoldTitle text="SPEAK YOUR MIND" color={THEME.accent3} sub="PROFANITY_UNLOCKED" />
                        <div style={{ position: 'absolute', left: 200, bottom: 200 }}>
                            <CleanStick pose="celebrating" />
                        </div>
                    </MasterScene>
                </Series.Sequence>

                {/* 8. 2026 Dramatization */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <MasterScene bg={THEME.surface}>
                        <BoldTitle text="2026 ROADMAP" color={THEME.accent2} sub="CONTROVERSIAL_BUT_PAID" />
                        <div style={{ position: 'absolute', top: 200, right: 300 }}>
                            <FlatCallout text="AD_READY" />
                        </div>
                    </MasterScene>
                </Series.Sequence>

                {/* 9. Final Survival Guide */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <MasterScene>
                        <div style={{ width: '100%', maxWidth: 1000 }}>
                            <BoldTitle text="SURVIVAL GUIDE" color={THEME.text} />
                            <div style={{ marginTop: 60, display: 'flex', flexDirection: 'column', gap: 20 }}>
                                {['1. DISRUPT TEMPLATES', '2. ADD COMMENTARY', '3. DISCLOSE AI'].map((t, i) => (
                                    <div key={i} style={{
                                        background: THEME.text,
                                        color: THEME.bg,
                                        padding: '20px 40px',
                                        fontSize: 50,
                                        fontFamily: 'Outfit',
                                        fontWeight: 900,
                                        transform: `translateX(${interpolate(useCurrentFrame() - i * 15, [0, 30], [-200, 0], { extrapolateRight: 'clamp' })}px)`,
                                        opacity: interpolate(useCurrentFrame() - i * 15, [0, 20], [0, 1])
                                    }}>{t}</div>
                                ))}
                            </div>
                        </div>
                    </MasterScene>
                </Series.Sequence>

                {/* 10. Outro */}
                <Series.Sequence durationInFrames={2058 - (sceneDur * 9)}>
                    <MasterScene bg={THEME.bg}>
                        <BoldTitle text="STAY AUTHENTIC" color={THEME.accent3} />
                        <CleanStick pose="celebrating" color={THEME.accent3} />
                    </MasterScene>
                </Series.Sequence>
            </Series>

            {/* Global Smooth Transitions - Layered every scene change */}
            {[...Array(10)].map((_, i) => (
                <Sequence key={i} from={i * 180 + 170}>
                    <TransitionWipe type={i % 2 === 0 ? 'right' : 'left'} />
                </Sequence>
            ))}

            {/* High Impact SFX */}
            {[...Array(11)].map((_, i) => (
                <Sequence key={i} from={i * 180}>
                    <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.6} />
                    <Audio src={staticFile("sfx/rise.mp3")} durationInFrames={30} volume={0.2} />
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};
