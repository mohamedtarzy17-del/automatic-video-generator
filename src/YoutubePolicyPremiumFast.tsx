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

        @keyframes glitch {
            0% { transform: translate(0); }
            20% { transform: translate(-3px, 3px); }
            40% { transform: translate(-3px, -3px); }
            60% { transform: translate(3px, 3px); }
            80% { transform: translate(3px, -3px); }
            100% { transform: translate(0); }
        }

        .glitch-fast {
            animation: glitch 0.1s infinite;
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
    const progress = interpolate(frame, [0, 45], [0, 1], { extrapolateRight: 'clamp' });

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

// --- Fast Visuals for Phase 2 (After 30s) ---

const WordFlash: React.FC<{ words: string[] }> = ({ words }) => {
    const frame = useCurrentFrame();
    const index = Math.floor(frame / 10) % words.length;
    return (
        <div style={{ position: 'absolute', top: 100, left: 100 }}>
            <h1 className="glitch-fast" style={{ fontFamily: 'Syne', fontSize: 100, color: THEME.accent, fontWeight: 900 }}>{words[index]}</h1>
        </div>
    );
};

const DataStream: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <div style={{ position: 'absolute', right: 50, top: 0, bottom: 0, width: 200, opacity: 0.2, fontFamily: 'JetBrains Mono', color: THEME.primary, fontSize: 12, overflow: 'hidden' }}>
            {[...Array(50)].map((_, i) => (
                <div key={i} style={{ transform: `translateY(${(frame * 2 + i * 20) % 1080}px)` }}>
                    {Math.random().toString(16)}
                </div>
            ))}
        </div>
    );
};

// --- Scenes ---

const IntroScene: React.FC = () => (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: THEME.bg }}>
        <BigText text="THE" size={80} color={THEME.primary} />
        <BigText text="AI PURGE" delay={10} />
        <div style={{ marginTop: 40 }}><StickFigure pose="point" size={200} /></div>
    </AbsoluteFill>
);

const StatsScene: React.FC = () => (
    <AbsoluteFill style={{ padding: 100, background: THEME.bg }}>
        <div style={{ display: 'flex', gap: 100, alignItems: 'center', height: '100%' }}>
            <div style={{ flex: 1 }}>
                <BigText text="TRUST" size={100} color={THEME.accent} />
                <BigText text="IS DYING" size={80} delay={15} />
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <PieChart percentages={[0.49, 0.51]} colors={[THEME.danger, THEME.glassBorder]} size={500} />
            </div>
        </div>
    </AbsoluteFill>
);

// --- FAST PLACED SCENES (START AFTER 900 FRAMES / 30S) ---

const BrandsSceneFast: React.FC = () => (
    <AbsoluteFill style={{ background: THEME.bg, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ transform: `scale(${interpolate(useCurrentFrame(), [0, 30], [0.8, 1], { extrapolateRight: 'clamp' })})` }}>
            <BigText text="ADVERTISER" size={120} color={THEME.warning} />
            <div className="glitch-fast"><BigText text="WAKE-UP" size={150} delay={10} /></div>
        </div>
        <DataStream />
        <WordFlash words={["PANIC", "EXIT", "LOSS"]} />
    </AbsoluteFill>
);

const DetectionSceneFast: React.FC = () => (
    <AbsoluteFill style={{ background: THEME.black }}>
        <div style={{ opacity: 0.4 }}><LineGraph points={[0, 100, 20, 80, 40, 60, 100]} color={THEME.success} width={1920} height={1080} /></div>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ fontFamily: 'Syne', fontSize: 180, color: THEME.success, fontWeight: 900 }}>PRECISION</h1>
            <div style={{ display: 'flex', gap: 20 }}>
                {["AUDIT", "DETECT", "BAN"].map((w, i) => (
                    <div key={w} style={{ background: THEME.success, padding: '10px 40px', color: THEME.black, fontFamily: 'Outfit', fontWeight: 900, transform: `translateY(${i % 2 ? 20 : -20}px)` }}>{w}</div>
                ))}
            </div>
        </AbsoluteFill>
    </AbsoluteFill>
);

const WinnersSceneFast: React.FC = () => (
    <AbsoluteFill style={{ background: THEME.bg, display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: 1, background: THEME.danger, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ transform: 'rotate(-90deg)', fontFamily: 'Syne', fontSize: 160, color: THEME.black }}>LOSERS</h1>
        </div>
        <div style={{ flex: 1, background: THEME.success, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="rapid-pulse" style={{ textAlign: 'center' }}>
                <h1 style={{ fontFamily: 'Syne', fontSize: 160, color: THEME.black }}>WINNERS</h1>
                <StickFigure pose="celebrate" color={THEME.black} size={300} />
            </div>
        </div>
    </AbsoluteFill>
);

const OutroSceneFast: React.FC = () => (
    <AbsoluteFill style={{ background: THEME.black, justifyContent: 'center', alignItems: 'center' }}>
        <BigText text="SUBSTANCE" color={THEME.primary} />
        <div className="glitch-fast"><BigText text="OVER SPAM" delay={10} /></div>
        <PremiumTag text="START NOW" bg={THEME.primary} x={800} y={800} delay={30} />
    </AbsoluteFill>
);

// --- Main Composition ---

export const YoutubePolicyPremiumFast: React.FC = () => {
    const sceneDur = 210;
    const transitionPoint = 900; // 30 seconds

    return (
        <AbsoluteFill style={{ backgroundColor: THEME.bg }}>
            <FontStyles />
            <Audio src={staticFile("youtube_policy_v2_vo.wav")} />

            <Series>
                <Series.Sequence durationInFrames={sceneDur}><IntroScene /></Series.Sequence>
                <Series.Sequence durationInFrames={sceneDur}><StatsScene /></Series.Sequence>
                <Series.Sequence durationInFrames={480}><IntroScene /></Series.Sequence> {/* Filler or transition to 30s */}

                {/* AFTER 30S - FAST PACED */}
                <Series.Sequence durationInFrames={sceneDur}><BrandsSceneFast /></Series.Sequence>
                <Series.Sequence durationInFrames={sceneDur}><DetectionSceneFast /></Series.Sequence>
                <Series.Sequence durationInFrames={sceneDur}><WinnersSceneFast /></Series.Sequence>
                <Series.Sequence durationInFrames={sceneDur}><OutroSceneFast /></Series.Sequence>
            </Series>

            {/* Hyper-Fast Audio Triggers after 30s */}
            {[...Array(60)].map((_, i) => {
                const frame = i * 30;
                if (frame < transitionPoint) return null;
                return (
                    <Sequence key={i} from={frame}>
                        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.4} />
                    </Sequence>
                );
            })}

            {/* Ambient Background */}
            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.1} />
        </AbsoluteFill>
    );
};
