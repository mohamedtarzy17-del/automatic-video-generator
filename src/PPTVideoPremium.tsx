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

        @keyframes scan {
            0% { top: 0%; }
            100% { top: 100%; }
        }

        .scanner-line {
            position: absolute;
            left: 0;
            width: 100%;
            height: 4px;
            background: ${THEME.primary};
            box-shadow: 0 0 15px ${THEME.primary};
            animation: scan 3s linear infinite;
            z-index: 10;
        }
        `}
    </style>
);

// --- Visual Primitives (Reused from GodModeV2 for consistency) ---

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
                <line x1="0" y1="30" x2="20" y2="70" stroke={color} strokeWidth="6" strokeLinecap="round" />
                <line x1="0" y1="30" x2="-20" y2="70" stroke={color} strokeWidth="6" strokeLinecap="round" />
            </g>
        </svg>
    );
};

const BigText: React.FC<{ text: string; size?: number; color?: string; delay?: number; align?: 'center' | 'left' }> = ({ text, size = 120, color = THEME.white, delay = 0, align = 'center' }) => {
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
            textAlign: align
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

// --- Custom PPT Video Scenes ---

const Scene1_Intro: React.FC = () => (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: THEME.bg }}>
        <div style={{ position: 'relative' }}>
            <BigText text="STRATEGIC" size={100} color={THEME.primary} />
            <BigText text="SHIFT 2026" delay={15} />
            <div style={{ marginTop: 50 }}>
                <StickFigure pose="point" size={180} />
            </div>
        </div>
        <div className="scanner-line" />
    </AbsoluteFill>
);

const Scene2_CoreChange: React.FC = () => (
    <AbsoluteFill style={{ background: THEME.bg, padding: 100 }}>
        <div style={{ display: 'flex', gap: 60, alignItems: 'center', height: '100%' }}>
            <div style={{ flex: 1.5 }}>
                <BigText text="THE" size={60} color={THEME.secondary} align="left" />
                <BigText text="GREAT" size={120} align="left" delay={10} />
                <BigText text="RENAMING" size={80} color={THEME.accent} align="left" delay={20} />
            </div>
            <div style={{ flex: 1 }} className="glass-morphism">
                <div style={{ padding: 40, fontFamily: 'JetBrains Mono', fontSize: 24, color: THEME.white }}>
                    <div style={{ opacity: 0.5 }}>OLD_POLICY:</div>
                    <div style={{ textDecoration: 'line-through', color: THEME.danger }}>REPETITIOUS</div>
                    <div style={{ marginTop: 20, opacity: 0.5 }}>NEW_POLICY:</div>
                    <div style={{ color: THEME.success, fontWeight: 900 }}>INAUTHENTIC</div>
                </div>
            </div>
        </div>
        <PremiumTag text="JULY 15" bg={THEME.warning} x={1200} y={150} delay={45} />
    </AbsoluteFill>
);

const Scene3_ScaredBrands: React.FC = () => (
    <AbsoluteFill style={{ background: THEME.bg }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <BigText text="BRANDS" size={100} color={THEME.danger} />
            <BigText text="ARE SCARED" delay={15} />
            <div style={{ display: 'flex', gap: 40, marginTop: 60 }}>
                {['HBO', 'AMAZON', 'ADOBE'].map((b, i) => (
                    <div key={b} className="glass-morphism" style={{ padding: '20px 40px', fontFamily: 'Outfit', fontWeight: 900, fontSize: 32, color: THEME.white, opacity: interpolate(useCurrentFrame(), [i * 10 + 30, i * 10 + 45], [0, 1], { extrapolateRight: 'clamp' }) }}>
                        {b}
                    </div>
                ))}
            </div>
        </div>
        <div style={{ position: 'absolute', bottom: 100, right: 200 }}>
            <StickFigure pose="panic" size={150} />
        </div>
    </AbsoluteFill>
);

const Scene4_ExitRisk: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ background: THEME.bg, padding: 100 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                <div style={{ flex: 1 }}>
                    <BigText text="49%" size={200} color={THEME.danger} align="left" />
                    <BigText text="USER EXIT" size={80} align="left" delay={15} />
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <svg width="400" height="400" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke={THEME.glassBorder} strokeWidth="10" />
                        <circle cx="50" cy="50" r="45" fill="none" stroke={THEME.danger} strokeWidth="10" strokeDasharray="283" strokeDashoffset={283 * (1 - interpolate(frame, [0, 60], [0, 0.49], { extrapolateRight: 'clamp' }))} transform="rotate(-90 50 50)" />
                    </svg>
                </div>
            </div>
        </AbsoluteFill>
    );
};

const Scene5_HowToWin: React.FC = () => (
    <AbsoluteFill style={{ background: THEME.success + '11' }}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
            <BigText text="HOW TO" size={80} color={THEME.success} />
            <BigText text="SURVIVE" delay={15} />
            <div style={{ marginTop: 60, display: 'flex', gap: 30 }}>
                {['NARRATION', 'EDITING', 'VALUE'].map((item, i) => (
                    <div key={item} style={{
                        background: THEME.success,
                        padding: '15px 40px',
                        borderRadius: 20,
                        fontFamily: 'Outfit',
                        fontWeight: 900,
                        color: THEME.black,
                        transform: `translateY(${interpolate(useCurrentFrame(), [i * 15 + 45, i * 15 + 60], [100, 0], { extrapolateRight: 'clamp' })}px)`,
                        opacity: interpolate(useCurrentFrame(), [i * 15 + 45, i * 15 + 60], [0, 1], { extrapolateRight: 'clamp' })
                    }}>
                        {item}
                    </div>
                ))}
            </div>
        </AbsoluteFill>
        <div style={{ position: 'absolute', bottom: 100, left: 100 }}>
            <StickFigure pose="celebrate" color={THEME.success} size={150} />
        </div>
    </AbsoluteFill>
);

const Scene6_Final: React.FC = () => (
    <AbsoluteFill style={{ background: THEME.black, justifyContent: 'center', alignItems: 'center' }}>
        <BigText text="HUMANITY" color={THEME.primary} />
        <BigText text="FIRST" delay={15} />
        <div style={{ marginTop: 40, width: 400, height: 4, background: THEME.primary }} />
        <div style={{ marginTop: 100 }}>
            <StickFigure pose="thinking" size={120} />
        </div>
    </AbsoluteFill>
);

// --- Transition Component ---

const SwipeTransition: React.FC<{ trigger: number }> = ({ trigger }) => {
    const frame = useCurrentFrame();
    const { width } = useVideoConfig();
    const x = interpolate(frame, [trigger - 10, trigger + 10], [width, -width], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    if (frame < trigger - 10 || frame > trigger + 10) return null;

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            background: THEME.primary,
            transform: `translateX(${x}px)`,
            zIndex: 100
        }} />
    );
};

// --- Composition ---

export const PPTVideoPremium: React.FC = () => {
    const sceneDur = 300; // 10 seconds per scene to match narration pacing

    return (
        <AbsoluteFill style={{ backgroundColor: THEME.bg }}>
            <FontStyles />
            <Audio src={staticFile("ppt_video_full_vo.wav")} />
            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.15} />

            <Series>
                <Series.Sequence durationInFrames={sceneDur}><Scene1_Intro /></Series.Sequence>
                <Series.Sequence durationInFrames={sceneDur}><Scene2_CoreChange /></Series.Sequence>
                <Series.Sequence durationInFrames={sceneDur}><Scene3_ScaredBrands /></Series.Sequence>
                <Series.Sequence durationInFrames={sceneDur}><Scene4_ExitRisk /></Series.Sequence>
                <Series.Sequence durationInFrames={sceneDur}><Scene5_HowToWin /></Series.Sequence>
                <Series.Sequence durationInFrames={300}><Scene6_Final /></Series.Sequence>
            </Series>

            <SwipeTransition trigger={300} />
            <SwipeTransition trigger={600} />
            <SwipeTransition trigger={900} />
            <SwipeTransition trigger={1200} />
            <SwipeTransition trigger={1500} />

            {[...Array(6)].map((_, i) => (
                <Sequence key={i} from={i * 300 - 10}>
                    <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.4} />
                </Sequence>
            ))}

            {/* Global Texture */}
            <AbsoluteFill style={{ pointerEvents: 'none', opacity: 0.04, background: `url('https://www.transparenttextures.com/patterns/asfalt-dark.png')` }} />
        </AbsoluteFill>
    );
};
