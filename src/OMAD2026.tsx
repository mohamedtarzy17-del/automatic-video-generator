import React, { useMemo } from 'react';
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
    Sequence,
    interpolateColors,
    Audio,
    staticFile
} from 'remotion';

const FontStyles: React.FC = () => (
    <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        `}
    </style>
);

const THEME = {
    bg: '#0F172A',     // Very Dark Slate Blue (Biohacker Dark Mode)
    bgAlt: '#1E293B',  // Slightly Lighter Slate
    text: '#F8FAFC',   // Off-White
    accent: '#10B981', // Neon Biohacker Green
    red: '#EF4444',    // Danger Red (Sugar/Crash)
    yellow: '#F59E0B', // Fat Burn Orange
};

// Generic Pop wrapper for bouncy elements
const Pop: React.FC<{ children: React.ReactNode; delay?: number, scaleBase?: number }> = ({ children, delay = 0, scaleBase = 1 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const progress = Math.max(0, frame - delay);
    const pop = spring({ frame: progress, fps, config: { damping: 12 } });
    return <div style={{ transform: `scale(${pop * scaleBase})`, display: 'inline-block' }}>{children}</div>;
};

// --- Custom SVGs ---

const PlateSVG: React.FC = () => {
    return (
        <svg width="250" height="250" viewBox="0 0 250 250">
            {/* Outer Plate */}
            <circle cx="125" cy="125" r="100" fill="none" stroke={THEME.text} strokeWidth="8" />
            <circle cx="125" cy="125" r="70" fill="none" stroke={THEME.text} strokeWidth="4" strokeDasharray="10 10" />
            {/* One Meal */}
            <circle cx="125" cy="125" r="30" fill={THEME.accent} />
            {/* Fork */}
            <path d="M 40 100 L 40 40 M 30 50 L 30 40 M 50 50 L 50 40 M 40 70 C 30 70 30 60 30 50 M 40 70 C 50 70 50 60 50 50" stroke={THEME.text} strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Knife */}
            <path d="M 210 100 L 210 40 C 210 30 200 30 200 60 L 200 100 Z" fill="none" stroke={THEME.text} strokeWidth="4" strokeLinejoin="round" />
        </svg>
    );
};

const DNASVG: React.FC = () => {
    const frame = useCurrentFrame();
    // Simulate DNA rotation
    const rotation = (frame * 2) % 360;

    return (
        <svg width="200" height="300" viewBox="0 0 200 300" style={{ transform: `rotateY(${rotation}deg)` }}>
            <path d="M 50 50 Q 150 150 50 250" fill="none" stroke={THEME.accent} strokeWidth="12" strokeLinecap="round" />
            <path d="M 150 50 Q 50 150 150 250" fill="none" stroke={THEME.text} strokeWidth="12" strokeLinecap="round" />

            {/* Rungs */}
            <line x1="75" y1="80" x2="125" y2="80" stroke={THEME.text} strokeWidth="6" />
            <line x1="100" y1="150" x2="60" y2="150" stroke={THEME.accent} strokeWidth="6" />
            <line x1="75" y1="220" x2="125" y2="220" stroke={THEME.text} strokeWidth="6" />
        </svg>
    );
};

const BatterySVG: React.FC<{ mode: 'sugar' | 'fat' }> = ({ mode }) => {
    const frame = useCurrentFrame();
    // If fat mode, pulse the bar
    const pulse = mode === 'fat' ? interpolate(Math.sin(frame / 5), [-1, 1], [0.8, 1]) : 1;
    const color = mode === 'sugar' ? THEME.red : THEME.yellow;
    const level = mode === 'sugar' ? 40 : 120; // Fat is full, Sugar is low

    return (
        <svg width="150" height="250" viewBox="0 0 150 250">
            {/* Battery Body */}
            <rect x="25" y="50" width="100" height="180" rx="10" fill="none" stroke={THEME.text} strokeWidth="10" />
            {/* Battery Top */}
            <rect x="55" y="35" width="40" height="15" fill={THEME.text} />
            {/* Level Fill */}
            <rect x="35" y={230 - level} width="80" height={level} rx="5" fill={color} style={{ transform: `scaleY(${pulse})`, transformOrigin: 'bottom' }} />
        </svg>
    );
};

const BrainSVG: React.FC = () => {
    const frame = useCurrentFrame();
    const glow = interpolate(Math.sin(frame / 10), [-1, 1], [0.5, 1]);

    return (
        <svg width="250" height="200" viewBox="0 0 250 200">
            <path d="M 125 40 C 180 30 220 80 210 130 C 200 180 150 180 125 180 C 100 180 50 180 40 130 C 30 80 70 30 125 40" fill="none" stroke={THEME.text} strokeWidth="10" strokeLinejoin="round" />
            <path d="M 125 40 L 125 180" stroke={THEME.text} strokeWidth="8" strokeDasharray="10 10" />
            <circle cx="150" cy="100" r="15" fill={THEME.accent} style={{ transform: `scale(${glow})`, transformOrigin: '150px 100px' }} />
            <circle cx="80" cy="120" r="10" fill={THEME.accent} style={{ transform: `scale(${glow * 1.5})`, transformOrigin: '80px 120px' }} />
            <circle cx="100" cy="70" r="12" fill={THEME.accent} style={{ transform: `scale(${glow * 0.8})`, transformOrigin: '100px 70px' }} />
        </svg>
    );
};

// Callout Engine 2.0 (Relative Centered)
const CalloutBox: React.FC<{ delay?: number, text: string, type?: 'primary' | 'accent' | 'danger' }> = ({ delay = 0, text, type = 'primary' }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const p = Math.max(0, frame - delay);
    const pop = spring({ frame: p, fps, config: { damping: 10 } });

    let bg = THEME.bgAlt;
    let color = THEME.text;
    if (type === 'accent') { bg = THEME.accent; color = THEME.bg; }
    if (type === 'danger') { bg = THEME.red; color = '#fff'; }

    return (
        <div style={{
            transform: `scale(${pop})`,
            background: bg,
            color: color,
            padding: '15px 35px',
            borderRadius: 15,
            fontFamily: 'Outfit',
            fontWeight: 900,
            fontSize: 45,
            border: `4px solid ${THEME.text}`,
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            whiteSpace: 'nowrap',
            display: 'inline-block'
        }}>
            {text}
        </div>
    );
};

export const OMAD2026: React.FC = () => {
    const frame = useCurrentFrame();

    // Dark biohacker pulse gradient
    const bg = interpolateColors(
        Math.sin(frame / 60),
        [-1, 1],
        [THEME.bg, THEME.bgAlt]
    );

    return (
        <AbsoluteFill style={{ backgroundColor: bg, overflow: 'hidden' }}>
            <FontStyles />
            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.15} loop />

            {/* CUT 1: Intro (0 - 240) ~8s */}
            {/* "Eating one meal a day, or O MAD, might sound crazy, but your body was absolutely built for it." */}
            <Sequence durationInFrames={240}>
                <Audio src={staticFile("omad/01_intro.mp3")} />

                {/* 0-60: Plate */}
                <Sequence durationInFrames={90}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
                            <Pop><PlateSVG /></Pop>
                            <CalloutBox delay={20} text="ONE MEAL A DAY" type="primary" />
                        </div>
                    </AbsoluteFill>
                </Sequence>

                {/* 90-240: "Crazy but Built for it" */}
                <Sequence from={90} durationInFrames={150}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Pop><h1 style={{ fontFamily: 'Outfit', fontSize: 130, color: THEME.text, margin: 0, textAlign: 'center' }}>MIGHT SOUND <span style={{ color: THEME.red }}>CRAZY.</span></h1></Pop>
                        <div style={{ marginTop: 20 }}>
                            <Pop delay={30} scaleBase={1.2}>
                                <div style={{ background: THEME.accent, color: THEME.bg, padding: '20px 50px', borderRadius: 20, fontFamily: 'Outfit', fontSize: 130, fontWeight: 900, transform: 'rotate(-2deg)' }}>
                                    BUILT FOR IT.
                                </div>
                            </Pop>
                        </div>
                    </AbsoluteFill>
                </Sequence>
            </Sequence>

            {/* CUT 2: Autophagy (240 - 540) ~10s */}
            {/* "After 16 hours of fasting, a process called Autophagy kicks in. Your cells literally eat their own waste." */}
            <Sequence from={240} durationInFrames={300}>
                <Audio src={staticFile("omad/02_autophagy.mp3")} />

                <Sequence durationInFrames={300}>
                    <AbsoluteFill style={{ top: 120, alignItems: 'center' }}>
                        <Pop><h2 style={{ fontFamily: 'Outfit', fontSize: 100, color: THEME.text, margin: 0 }}>AFTER 16 HOURS</h2></Pop>
                    </AbsoluteFill>
                </Sequence>

                {/* 0-120: Huge Autophagy Text Drop */}
                <Sequence durationInFrames={120}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Pop delay={30}><h1 style={{ fontFamily: 'Outfit', fontSize: 200, color: THEME.accent, margin: 0, letterSpacing: '5px' }}>AUTOPHAGY</h1></Pop>
                    </AbsoluteFill>
                </Sequence>

                {/* 120-300: DNA / Recycling Waste */}
                <Sequence from={120} durationInFrames={180}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 150 }}>
                            <div style={{ position: 'relative' }}>
                                <Pop><DNASVG /></Pop>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                                <CalloutBox delay={20} text="CELLS RECYCLE" type="accent" />
                                <CalloutBox delay={40} text="EAT WASTE" type="primary" />
                            </div>
                        </div>
                    </AbsoluteFill>
                </Sequence>
            </Sequence>

            {/* CUT 3: Fat burning (540 - 780) ~8s */}
            {/* "By hour 20, insulin plunges. Your body switches from burning sugar to melting pure stored body fat for energy." */}
            <Sequence from={540} durationInFrames={240}>
                <Audio src={staticFile("omad/03_fat.mp3")} />

                {/* 0-90: Insulin Plunges */}
                <Sequence durationInFrames={90}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Pop><h1 style={{ fontFamily: 'Outfit', fontSize: 130, color: THEME.text, margin: 0 }}>INSULIN <span style={{ color: THEME.red }}>PLUNGES.</span></h1></Pop>
                    </AbsoluteFill>
                </Sequence>

                {/* 90-240: Battery Switch */}
                <Sequence from={90} durationInFrames={150}>
                    <AbsoluteFill style={{ top: 150, alignItems: 'center' }}>
                        <Pop><h2 style={{ fontFamily: 'Outfit', fontSize: 90, color: THEME.text, margin: 0 }}>ENERGY SWITCH</h2></Pop>
                    </AbsoluteFill>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 120 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
                                <Pop delay={0}><BatterySVG mode="sugar" /></Pop>
                                <CalloutBox delay={0} text="SUGAR (OFF)" type="danger" />
                            </div>
                            <Pop delay={30}><div style={{ fontSize: 100, color: THEME.text }}>→</div></Pop>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
                                <Pop delay={40}><BatterySVG mode="fat" /></Pop>
                                <CalloutBox delay={50} text="BODY FAT (ON)" type="accent" />
                            </div>
                        </div>
                    </AbsoluteFill>
                </Sequence>
            </Sequence>

            {/* CUT 4: Results (780 - 990) ~7s */}
            {/* "The result? Laser mental clarity, massive energy spikes, and zero afternoon crashes." */}
            <Sequence from={780} durationInFrames={210}>
                <Audio src={staticFile("omad/04_result.mp3")} />

                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 100 }}>
                        <div style={{ position: 'relative' }}>
                            <Pop><BrainSVG /></Pop>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 30, alignItems: 'flex-start' }}>
                            <CalloutBox delay={40} text="LASER CLARITY" type="primary" />
                            <CalloutBox delay={80} text="MASSIVE ENERGY" type="accent" />
                            <CalloutBox delay={120} text="ZERO CRASHES" type="primary" />
                        </div>
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* CUT 5: Outro (990 - 1140) ~5s */}
            {/* "Are you brave enough to try it? Subscribe for more biohacking truths." */}
            <Sequence from={990} durationInFrames={150}>
                <Audio src={staticFile("omad/05_outro.mp3")} />

                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Pop scaleBase={1.2}>
                        <h1 style={{ fontFamily: 'Outfit', fontSize: 130, color: THEME.text, margin: 0, textAlign: 'center' }}>
                            BRAVE ENOUGH<br />TO <span style={{ color: THEME.accent }}>TRY IT?</span>
                        </h1>
                    </Pop>

                    <div style={{ marginTop: 100 }}>
                        <Pop delay={50}>
                            <div style={{ padding: '30px 60px', background: THEME.text, color: THEME.bgAlt, borderRadius: 50, fontSize: 80, fontFamily: 'Outfit', fontWeight: 900 }}>
                                SUBSCRIBE
                            </div>
                        </Pop>
                    </div>
                </AbsoluteFill>
            </Sequence>
        </AbsoluteFill>
    );
};
