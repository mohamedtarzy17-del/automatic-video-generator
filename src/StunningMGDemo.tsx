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

const FontStyles: React.FC = () => (
    <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        `}
    </style>
);

const THEME = {
    bg: '#FAF5EE',     // Warm off-white
    bgAlt: '#FDE4D8',  // Soft Peach
    text: '#2D3748',   // Slate
    accent: '#FF6B6B', // Coral Red
    teal: '#4ECDC4',   // Teal
    yellow: '#F7D05B', // Warm Yellow
};

// Generic Pop wrapper for bouncy SVGs
const Pop: React.FC<{ children: React.ReactNode; delay?: number, scaleBase?: number }> = ({ children, delay = 0, scaleBase = 1 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const progress = Math.max(0, frame - delay);
    const pop = spring({ frame: progress, fps, config: { damping: 12 } });
    return <div style={{ transform: `scale(${pop * scaleBase})`, display: 'inline-block' }}>{children}</div>;
};

// 1. Stick Figure Animation
const WalkingStickman: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
    const frame = useCurrentFrame();
    const progress = Math.max(0, frame - delay);

    // Wave animation using math
    const armWave = 140 + Math.sin(progress * 0.3) * 40;

    return (
        <svg width="250" height="300" viewBox="0 0 150 200" style={{ overflow: 'visible' }}>
            <circle cx="75" cy="40" r="20" fill={THEME.text} />
            <line x1="75" y1="60" x2="75" y2="130" stroke={THEME.text} strokeWidth="10" strokeLinecap="round" />

            {/* Waving Arm Right */}
            <g transform={`translate(75, 70) rotate(${armWave})`}>
                <line x1="0" y1="0" x2="0" y2="50" stroke={THEME.text} strokeWidth="10" strokeLinecap="round" />
            </g>

            {/* Arm Left */}
            <g transform={`translate(75, 70) rotate(45)`}>
                <line x1="0" y1="0" x2="0" y2="50" stroke={THEME.text} strokeWidth="10" strokeLinecap="round" />
            </g>

            {/* Legs */}
            <g transform={`translate(75, 130) rotate(-20)`}>
                <line x1="0" y1="0" x2="0" y2="60" stroke={THEME.text} strokeWidth="12" strokeLinecap="round" />
            </g>
            <g transform={`translate(75, 130) rotate(20)`}>
                <line x1="0" y1="0" x2="0" y2="60" stroke={THEME.text} strokeWidth="12" strokeLinecap="round" />
            </g>
        </svg>
    );
};

// 2. Animated Bar Graph
const BarGraph: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const p = Math.max(0, frame - delay);

    const h1 = interpolate(spring({ frame: p, fps }), [0, 1], [0, 100]);
    const h2 = interpolate(spring({ frame: Math.max(0, p - 10), fps }), [0, 1], [0, 180]);
    const h3 = interpolate(spring({ frame: Math.max(0, p - 20), fps }), [0, 1], [0, 250]);
    const h4 = interpolate(spring({ frame: Math.max(0, p - 30), fps }), [0, 1], [0, 140]);

    return (
        <svg width="400" height="300" viewBox="0 0 300 300" style={{ overflow: 'visible' }}>
            <line x1="20" y1="280" x2="280" y2="280" stroke={THEME.text} strokeWidth="6" strokeLinecap="round" />
            <rect x="40" y={280 - h1} width="40" height={h1} fill={THEME.teal} rx="8" />
            <rect x="100" y={280 - h2} width="40" height={h2} fill={THEME.yellow} rx="8" />
            <rect x="160" y={280 - h3} width="40" height={h3} fill={THEME.accent} rx="8" />
            <rect x="220" y={280 - h4} width="40" height={h4} fill={THEME.text} rx="8" />
        </svg>
    );
};

// 3. Animated Pie Chart
const PieChart: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const p = Math.max(0, frame - delay);

    const fillPop = spring({ frame: p, fps, config: { damping: 15 } });
    const dash1 = interpolate(fillPop, [0, 1], [628, 628 * 0.4]);
    const dash2 = interpolate(spring({ frame: Math.max(0, p - 15), fps }), [0, 1], [628, 628 * 0.75]);

    return (
        <svg width="300" height="300" viewBox="0 0 250 250" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
            <circle cx="125" cy="125" r="100" fill="none" stroke="#e0d7cd" strokeWidth="40" />
            <circle cx="125" cy="125" r="100" fill="none" stroke={THEME.accent} strokeWidth="40" strokeDasharray="628" strokeDashoffset={dash1} />
            <circle cx="125" cy="125" r="100" fill="none" stroke={THEME.teal} strokeWidth="40" strokeDasharray="628" strokeDashoffset={dash2} style={{ transformOrigin: 'center', transform: 'rotate(216deg)' }} />
        </svg>
    );
};

// 4. Animated Checklist
const Checklist: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const p = Math.max(0, frame - delay);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
            {[1, 2, 3].map((item, i) => {
                const itemP = Math.max(0, p - i * 15);
                const pop = spring({ frame: itemP, fps });
                const checkFill = spring({ frame: Math.max(0, itemP - 10), fps });
                return (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 20, transform: `scale(${pop})` }}>
                        <svg width="60" height="60" viewBox="0 0 50 50">
                            <rect x="5" y="5" width="40" height="40" rx="10" fill="none" stroke={THEME.text} strokeWidth="5" />
                            <path d="M 15 25 L 22 35 L 38 15" fill="none" stroke={THEME.accent} strokeWidth="6" strokeLinecap="round" strokeDasharray="50" strokeDashoffset={50 - checkFill * 50} />
                        </svg>
                        <div style={{ width: 250, height: 25, background: THEME.text, borderRadius: 10, opacity: 0.15 }} />
                    </div>
                );
            })}
        </div>
    );
};

// 5. Callout / Arrow Component
const Callout: React.FC<{ delay?: number, text: string, direction: 'left' | 'right' }> = ({ delay = 0, text, direction }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const p = Math.max(0, frame - delay);
    const lineDraw = spring({ frame: p, fps, config: { damping: 12 } });
    const textPop = spring({ frame: Math.max(0, p - 8), fps, config: { damping: 10 } });

    return (
        <div style={{ position: 'absolute', top: 0, left: direction === 'left' ? -350 : 150, zIndex: 10 }}>
            <svg width="350" height="200" viewBox="0 0 350 200" style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}>
                {direction === 'right' ? (
                    <path d="M 0 100 Q 150 100 250 50" fill="none" stroke={THEME.text} strokeWidth="6" strokeLinecap="round" strokeDasharray="300" strokeDashoffset={300 - lineDraw * 300} />
                ) : (
                    <path d="M 350 100 Q 200 100 100 50" fill="none" stroke={THEME.text} strokeWidth="6" strokeLinecap="round" strokeDasharray="300" strokeDashoffset={300 - lineDraw * 300} />
                )}
            </svg>
            <div style={{
                position: 'absolute',
                top: 5,
                left: direction === 'right' ? 100 : 20,
                transform: `scale(${textPop}) rotate(${direction === 'left' ? '-5deg' : '5deg'})`,
                background: THEME.text,
                color: '#fff',
                padding: '20px 40px',
                borderRadius: 30,
                fontFamily: 'Outfit',
                fontWeight: 900,
                fontSize: 35,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}>
                {text}
            </div>
        </div>
    );
};

export const StunningMGDemo: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Soft gradient moving from Peach to Off-White
    const bg = interpolateColors(
        Math.sin(frame / 60),
        [-1, 1],
        [THEME.bg, THEME.bgAlt]
    );

    return (
        <AbsoluteFill style={{ backgroundColor: bg, overflow: 'hidden' }}>
            <FontStyles />

            {/* SCENE 1 (0 - 210) Text Top, SVG Bottom */}
            <Sequence durationInFrames={210}>
                <AbsoluteFill style={{ top: 180, alignItems: 'center' }}>
                    <div style={{ overflow: 'hidden', paddingBottom: 20 }}>
                        <h1 style={{ fontFamily: 'Outfit', fontSize: 130, color: THEME.text, margin: 0, transform: `translateY(${interpolate(spring({ frame, fps }), [0, 1], [200, 0])}px)` }}>
                            WELCOME TO
                        </h1>
                    </div>
                    <div style={{ overflow: 'hidden', paddingBottom: 20 }}>
                        <h1 style={{ fontFamily: 'Outfit', fontSize: 130, color: THEME.accent, margin: 0, transform: `translateY(${interpolate(spring({ frame: Math.max(0, frame - 10), fps }), [0, 1], [200, 0])}px)` }}>
                            VISUAL SVGS.
                        </h1>
                    </div>
                </AbsoluteFill>

                <AbsoluteFill style={{ top: 600, alignItems: 'center' }}>
                    <Pop delay={20}>
                        <div style={{ position: 'relative' }}>
                            <WalkingStickman delay={20} />
                            {/* Pops exactly ~36 frames later (1.2s delay) */}
                            <Callout delay={56} text="SAY HELLO." direction="right" />
                        </div>
                    </Pop>
                </AbsoluteFill>
            </Sequence>

            {/* SCENE 2 (210 - 420) Clean Split Screen Layout */}
            <Sequence from={210} durationInFrames={210}>
                <AbsoluteFill style={{ left: 200, top: 400, width: '40%' }}>
                    <Pop delay={0}>
                        <h2 style={{ fontFamily: 'Outfit', fontSize: 90, color: THEME.text, lineHeight: 1.1, margin: 0 }}>
                            WATCH THIS<br /><span style={{ color: THEME.teal }}>GROW.</span>
                        </h2>
                    </Pop>
                    {/* 36 frames later (1.2s) */}
                    <Pop delay={36}>
                        <p style={{ fontFamily: 'Outfit', fontSize: 45, color: '#666', marginTop: 40, fontWeight: 700 }}>
                            Clear data visualization prevents viewers from swiping away.
                        </p>
                    </Pop>
                </AbsoluteFill>

                <AbsoluteFill style={{ left: 1100, top: 350 }}>
                    <BarGraph delay={20} />
                    <div style={{ position: 'absolute', top: -100, left: 180 }}>
                        {/* 72 frames later (2.4s) */}
                        <Callout delay={72} text="+450% ENGAGEMENT" direction="right" />
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* SCENE 3 (420 - 630) Split Reverse Layout */}
            <Sequence from={420} durationInFrames={210}>
                <AbsoluteFill style={{ left: 1100, top: 400, width: '40%' }}>
                    <Pop delay={0}>
                        <h2 style={{ fontFamily: 'Outfit', fontSize: 90, color: THEME.text, lineHeight: 1.1, margin: 0 }}>
                            MARKET<br /><span style={{ color: THEME.accent }}>SHARE.</span>
                        </h2>
                    </Pop>
                    <Pop delay={36}>
                        <div style={{ display: 'flex', gap: 30, alignItems: 'center', marginTop: 40 }}>
                            <div style={{ width: 40, height: 40, background: THEME.accent, borderRadius: '50%' }} />
                            <span style={{ fontFamily: 'Outfit', fontSize: 50, color: '#666', fontWeight: 700 }}>60% Domination</span>
                        </div>
                    </Pop>
                </AbsoluteFill>

                <AbsoluteFill style={{ left: 400, top: 350 }}>
                    <Pop delay={10}><PieChart delay={10} /></Pop>
                    <div style={{ position: 'absolute', top: 80, left: -50 }}>
                        <Callout delay={72} text="KEY METRIC" direction="left" />
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* SCENE 4 (630 - 840) Checklists and Action */}
            <Sequence from={630} durationInFrames={210}>
                <AbsoluteFill style={{ top: 250, alignItems: 'center' }}>
                    <Pop delay={0}>
                        <h2 style={{ fontFamily: 'Outfit', fontSize: 110, color: THEME.text, margin: 0 }}>
                            HOW WE DO IT:
                        </h2>
                    </Pop>
                </AbsoluteFill>

                <AbsoluteFill style={{ top: 450, left: 750 }}>
                    <Checklist delay={36} /> {/* Starts exactly 1.2s in */}
                </AbsoluteFill>

                <AbsoluteFill style={{ top: 600, left: 200 }}>
                    <Callout delay={108} text="EVERY. SINGLE. TIME." direction="right" />
                </AbsoluteFill>
            </Sequence>

            {/* SCENE 5 (840 - 900) Outro Fast Paced Pops */}
            <Sequence from={840} durationInFrames={60}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Pop scaleBase={1.2}>
                        <h1 style={{ fontFamily: 'Outfit', fontSize: 200, color: THEME.accent, margin: 0 }}>
                            STUNNING.
                        </h1>
                    </Pop>
                </AbsoluteFill>
            </Sequence>

        </AbsoluteFill>
    );
};
