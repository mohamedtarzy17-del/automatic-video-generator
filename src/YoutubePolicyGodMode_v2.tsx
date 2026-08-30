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

        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
        }

        .floating {
            animation: float 4s ease-in-out infinite;
        }
        `}
    </style>
);

// --- Visual Primitives ---

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
                {/* Body */}
                <line x1="0" y1="-20" x2="0" y2="30" stroke={color} strokeWidth="6" strokeLinecap="round" />
                {/* Head */}
                <circle cx="0" cy={-40 + bob} r="15" fill="none" stroke={color} strokeWidth="6" />

                {/* Arms */}
                {pose === 'point' && (
                    <>
                        <line x1="0" y1="-10" x2="40" y2="-10" stroke={color} strokeWidth="6" strokeLinecap="round" />
                        <line x1="0" y1="-10" x2="-20" y2="10" stroke={color} strokeWidth="6" strokeLinecap="round" />
                    </>
                )}
                {pose === 'shrug' && (
                    <>
                        <line x1="0" y1="-10" x2="30" y2="-30" stroke={color} strokeWidth="6" strokeLinecap="round" />
                        <line x1="0" y1="-10" x2="-30" y2="-30" stroke={color} strokeWidth="6" strokeLinecap="round" />
                    </>
                )}
                {pose === 'panic' && (
                    <>
                        <line x1="0" y1="-10" x2="35" y2="-50" stroke={color} strokeWidth="6" strokeLinecap="round" />
                        <line x1="0" y1="-10" x2="-35" y2="-50" stroke={color} strokeWidth="6" strokeLinecap="round" />
                        <path d="M -10 10 Q 0 0 10 10" fill="none" stroke={color} strokeWidth="3" transform="translate(0, -45)" />
                    </>
                )}
                {pose === 'celebrate' && (
                    <>
                        <line x1="0" y1="-10" x2="35" y2="-60" stroke={color} strokeWidth="6" strokeLinecap="round" />
                        <line x1="0" y1="-10" x2="-35" y2="-60" stroke={color} strokeWidth="6" strokeLinecap="round" />
                    </>
                )}
                {pose === 'thinking' && (
                    <>
                        <line x1="0" y1="-10" x2="20" y2="10" stroke={color} strokeWidth="6" strokeLinecap="round" />
                        <line x1="0" y1="-10" x2="-10" y2="-35" stroke={color} strokeWidth="6" strokeLinecap="round" />
                        <path d="M -5 -60 Q 5 -70 15 -60" fill="none" stroke={THEME.accent} strokeWidth="4" />
                    </>
                )}

                {/* Legs */}
                <line x1="0" y1="30" x2="20" y2="70" stroke={color} strokeWidth="6" strokeLinecap="round" />
                <line x1="0" y1="30" x2="-20" y2="70" stroke={color} strokeWidth="6" strokeLinecap="round" />
            </g>
        </svg>
    );
};

const BarChart: React.FC<{
    data: number[];
    labels: string[];
    color?: string;
    width?: number;
    height?: number;
}> = ({ data, labels, color = THEME.primary, width = 600, height = 300 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const max = Math.max(...data);

    return (
        <div style={{ width, height, display: 'flex', alignItems: 'flex-end', gap: 20 }}>
            {data.map((val, i) => {
                const s = spring({
                    frame: frame - (i * 10),
                    fps,
                    config: { damping: 12 }
                });
                const h = (val / max) * height;
                return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                            width: '100%',
                            height: h * s,
                            background: `linear-gradient(to top, ${color}, ${color}88)`,
                            borderRadius: '12px 12px 2px 2px',
                            boxShadow: `0 0 20px ${color}44`
                        }} />
                        <span style={{
                            marginTop: 15,
                            fontFamily: 'JetBrains Mono',
                            fontSize: 14,
                            color: THEME.white,
                            opacity: s
                        }}>{labels[i]}</span>
                    </div>
                );
            })}
        </div>
    );
};

const PieChart: React.FC<{
    percentages: number[];
    colors: string[];
    size?: number;
}> = ({ percentages, colors, size = 400 }) => {
    const frame = useCurrentFrame();
    const progress = spring({ frame, fps: 30, config: { damping: 15 } });

    let cumulativePercent = 0;

    const paths = percentages.map((p, i) => {
        const startX = Math.cos(2 * Math.PI * cumulativePercent);
        const startY = Math.sin(2 * Math.PI * cumulativePercent);
        cumulativePercent += p;
        const endX = Math.cos(2 * Math.PI * cumulativePercent);
        const endY = Math.sin(2 * Math.PI * cumulativePercent);

        const largeArcFlag = p > 0.5 ? 1 : 0;

        return (
            <path
                key={i}
                d={`M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                fill={colors[i]}
                transform={`scale(${progress})`}
            />
        );
    });

    return (
        <svg width={size} height={size} viewBox="-1.2 -1.2 2.4 2.4" style={{ transform: 'rotate(-90deg)' }}>
            {paths}
        </svg>
    );
};

const LineGraph: React.FC<{ points: number[]; color?: string; width?: number; height?: number }> = ({ points, color = THEME.accent, width = 800, height = 400 }) => {
    const frame = useCurrentFrame();
    const progress = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: 'clamp' });

    const d = useMemo(() => {
        const xStep = width / (points.length - 1);
        const max = Math.max(...points);
        return points.reduce((acc, p, i) => {
            const x = i * xStep;
            const y = height - (p / max) * height;
            return i === 0 ? `M 0 ${y}` : `${acc} L ${x} ${y}`;
        }, "");
    }, [points, width, height]);

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
            <path
                d={d}
                fill="none"
                stroke={color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={width * 3}
                strokeDashoffset={width * 3 * (1 - progress)}
                style={{ filter: `drop-shadow(0 0 15px ${color})` }}
            />
        </svg>
    );
};

const BigText: React.FC<{ text: string; size?: number; color?: string; delay?: number }> = ({ text, size = 120, color = THEME.white, delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const s = spring({
        frame: frame - delay,
        fps,
        config: { stiffness: 100, damping: 10 }
    });

    return (
        <h1 style={{
            fontFamily: 'Syne',
            fontSize: size,
            fontWeight: 800,
            color,
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: -4,
            opacity: s,
            transform: `scale(${s}) translateY(${interpolate(s, [0, 1], [50, 0])}px)`,
            lineHeight: 0.9,
            textAlign: 'center'
        }}>
            {text}
        </h1>
    );
};

const PremiumTag: React.FC<{ text: string; bg?: string; x: number; y: number; delay?: number }> = ({ text, bg = THEME.primary, x, y, delay = 0 }) => {
    const frame = useCurrentFrame();
    const p = spring({ frame: frame - delay, fps: 30, config: { damping: 12 } });

    return (
        <div style={{
            position: 'absolute',
            left: x,
            top: y,
            background: bg,
            color: THEME.black,
            padding: '15px 30px',
            borderRadius: '100px',
            fontFamily: 'Outfit',
            fontWeight: 900,
            fontSize: 32,
            transform: `scale(${p}) rotate(${interpolate(p, [0, 1], [-10, 0])}deg)`,
            opacity: p,
            boxShadow: `0 10px 30px ${bg}66`
        }}>
            {text}
        </div>
    );
};

// --- Scene Components ---

const IntroScene: React.FC = () => {
    return (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: `radial-gradient(circle at center, ${THEME.secondary}22 0%, ${THEME.bg} 100%)` }}>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <BigText text="THE" size={80} color={THEME.primary} />
                <BigText text="AI PURGE" delay={10} />
                <div style={{ marginTop: 40 }}>
                    <StickFigure pose="point" size={200} />
                </div>
            </div>
            <PremiumTag text="DEMONETIZED" bg={THEME.danger} x={200} y={200} delay={45} />
            <PremiumTag text="JULY 15, 2025" bg={THEME.warning} x={1300} y={700} delay={60} />
        </AbsoluteFill>
    );
};

const StatsScene: React.FC = () => {
    return (
        <AbsoluteFill style={{ padding: 100, background: THEME.bg }}>
            <div style={{ display: 'flex', gap: 100, alignItems: 'center', height: '100%' }}>
                <div style={{ flex: 1 }}>
                    <BigText text="TRUST" size={100} color={THEME.accent} />
                    <BigText text="IS DYING" size={80} delay={15} />
                    <p style={{ fontFamily: 'Outfit', fontSize: 40, color: THEME.white, marginTop: 40, opacity: 0.8 }}>
                        49% of viewers will leave if AI slop continues.
                    </p>
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <PieChart
                        percentages={[0.49, 0.51]}
                        colors={[THEME.danger, THEME.glassBorder]}
                        size={500}
                    />
                </div>
            </div>
            <PremiumTag text="49% EXIT RISK" bg={THEME.danger} x={1100} y={250} delay={30} />
        </AbsoluteFill>
    );
};

const BrandsScene: React.FC = () => {
    return (
        <AbsoluteFill style={{ background: THEME.bg, justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '80%', height: '60%', padding: 60 }} className="glass-morphism">
                <BigText text="ADVERTISER" size={60} color={THEME.warning} />
                <BigText text="WAKE-UP CALL" size={80} />
                <div style={{ marginTop: 80, display: 'flex', justifyContent: 'center' }}>
                    <BarChart
                        data={[80, 64, 50]}
                        labels={["Purchase Drop", "Ad Perception", "Trust Loss"]}
                        color={THEME.warning}
                        height={350}
                    />
                </div>
            </div>
            <div style={{ position: 'absolute', right: 100, bottom: 100 }}>
                <StickFigure pose="panic" size={120} />
            </div>
        </AbsoluteFill>
    );
};

const DetectionScene: React.FC = () => {
    return (
        <AbsoluteFill style={{ background: `linear-gradient(135deg, ${THEME.bg} 0%, ${THEME.primary}11 100%)` }}>
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                    <LineGraph points={[10, 20, 15, 35, 50, 45, 80, 100]} color={THEME.success} />
                    <BigText text="100% PRECISION" size={60} color={THEME.success} delay={30} />
                </div>
                <div style={{ display: 'flex', gap: 50, marginTop: 60 }}>
                    <div className="glass-morphism" style={{ padding: '20px 40px', fontFamily: 'JetBrains Mono', fontSize: 24, color: THEME.success }}>
                        PATTERN_REC: ACTIVE
                    </div>
                    <div className="glass-morphism" style={{ padding: '20px 40px', fontFamily: 'JetBrains Mono', fontSize: 24, color: THEME.success }}>
                        VOICE_AUDIT: 100%
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

const WinnersScene: React.FC = () => {
    return (
        <AbsoluteFill style={{ background: THEME.bg, justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 100 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <StickFigure pose="shrug" color={THEME.danger} size={150} />
                    <BigText text="FARMS" size={60} color={THEME.danger} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <StickFigure pose="celebrate" color={THEME.success} size={150} />
                    <BigText text="YOU" size={100} color={THEME.success} />
                </div>
            </div>
            <PremiumTag text="AUTHENTICITY" bg={THEME.success} x={800} y={700} delay={45} />
        </AbsoluteFill>
    );
};

const OutroScene: React.FC = () => {
    return (
        <AbsoluteFill style={{ background: THEME.black, justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ transform: 'scale(1.2)' }}>
                <BigText text="SUBSTANCE" color={THEME.primary} />
                <BigText text="OVER SPAM" />
                <div style={{ marginTop: 40, borderTop: `4px solid ${THEME.primary}`, width: 300, alignSelf: 'center' }} />
                <p style={{ fontFamily: 'Outfit', fontSize: 32, color: THEME.white, opacity: 0.6, textAlign: 'center', marginTop: 30 }}>
                    GENUINELY SERVE YOUR AUDIENCE
                </p>
            </div>
            <div style={{ position: 'absolute', bottom: 50 }}>
                <StickFigure pose="thinking" size={100} />
            </div>
        </AbsoluteFill>
    );
};

// --- Main Composition ---

export const YoutubePolicyGodModeV2: React.FC = () => {
    const sceneDur = 210; // 7 seconds per major scene

    return (
        <AbsoluteFill style={{ backgroundColor: THEME.bg }}>
            <FontStyles />
            <Audio src={staticFile("youtube_policy_v2_vo.wav")} />
            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.1} />

            <Series>
                {/* 1. Intro - The Purge */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <IntroScene />
                </Series.Sequence>

                {/* 2. Trust Decline */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <StatsScene />
                </Series.Sequence>

                {/* 3. Advertiser Concerns */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <BrandsScene />
                </Series.Sequence>

                {/* 4. Detection Mastery */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <DetectionScene />
                </Series.Sequence>

                {/* 5. Winners vs Losers */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <WinnersScene />
                </Series.Sequence>

                {/* 6. Final Message */}
                <Series.Sequence durationInFrames={1800 - (sceneDur * 5)}>
                    <OutroScene />
                </Series.Sequence>
            </Series>

            {/* SFX Triggers */}
            {[...Array(8)].map((_, i) => (
                <Sequence key={i} from={i * 210}>
                    <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.4} />
                </Sequence>
            ))}

            {/* Global Grain/Noise Overlay for Texture */}
            <AbsoluteFill style={{ pointerEvents: 'none', opacity: 0.03, background: `url('https://www.transparenttextures.com/patterns/asfalt-dark.png')` }} />
        </AbsoluteFill>
    );
};
