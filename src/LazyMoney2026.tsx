import React from 'react';
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

// --- Custom SVGs ---

const ComputerSVG: React.FC = () => (
    <svg width="250" height="200" viewBox="0 0 250 200">
        <rect x="25" y="20" width="200" height="130" rx="10" fill="none" stroke={THEME.text} strokeWidth="12" />
        <line x1="25" y1="120" x2="225" y2="120" stroke={THEME.text} strokeWidth="10" />
        <rect x="100" y="150" width="50" height="30" fill={THEME.text} />
        <line x1="60" y1="180" x2="190" y2="180" stroke={THEME.text} strokeWidth="12" strokeLinecap="round" />
        <circle cx="125" cy="70" r="25" fill={THEME.teal} />
    </svg>
);

const RobotSVG: React.FC = () => {
    const frame = useCurrentFrame();
    const eyeBlink = frame % 60 < 5 ? 0 : 1;
    return (
        <svg width="200" height="200" viewBox="0 0 200 200">
            <rect x="50" y="50" width="100" height="100" rx="20" fill="none" stroke={THEME.text} strokeWidth="12" />
            {/* Eyes */}
            <circle cx="80" cy="90" r="10" fill={THEME.accent} style={{ transform: `scaleY(${eyeBlink})`, transformOrigin: '90px' }} />
            <circle cx="120" cy="90" r="10" fill={THEME.accent} style={{ transform: `scaleY(${eyeBlink})`, transformOrigin: '90px' }} />
            {/* Mouth */}
            <line x1="80" y1="120" x2="120" y2="120" stroke={THEME.text} strokeWidth="6" strokeLinecap="round" />
            {/* Antenna */}
            <line x1="100" y1="50" x2="100" y2="20" stroke={THEME.text} strokeWidth="8" />
            <circle cx="100" cy="15" r="10" fill={THEME.yellow} />
        </svg>
    );
};

const DocumentsSVG: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const p1 = Math.max(0, frame - delay);
    const p2 = Math.max(0, frame - delay - 10);
    const p3 = Math.max(0, frame - delay - 20);
    const pop1 = spring({ frame: p1, fps });
    const pop2 = spring({ frame: p2, fps });
    const pop3 = spring({ frame: p3, fps });

    return (
        <div style={{ position: 'relative', width: 250, height: 250 }}>
            <div style={{ position: 'absolute', top: 50, left: 10, transform: `scale(${pop3}) rotate(-15deg)` }}>
                <svg width="150" height="200" viewBox="0 0 150 200">
                    <rect x="5" y="5" width="140" height="190" fill={THEME.bg} stroke={THEME.text} strokeWidth="8" rx="5" />
                    <line x1="30" y1="40" x2="120" y2="40" stroke={THEME.teal} strokeWidth="8" strokeLinecap="round" />
                    <line x1="30" y1="70" x2="90" y2="70" stroke={THEME.text} strokeWidth="6" strokeLinecap="round" />
                </svg>
            </div>
            <div style={{ position: 'absolute', top: 30, left: 50, transform: `scale(${pop2}) rotate(5deg)` }}>
                <svg width="150" height="200" viewBox="0 0 150 200">
                    <rect x="5" y="5" width="140" height="190" fill={THEME.bgAlt} stroke={THEME.text} strokeWidth="8" rx="5" />
                    <line x1="30" y1="40" x2="120" y2="40" stroke={THEME.accent} strokeWidth="8" strokeLinecap="round" />
                    <line x1="30" y1="70" x2="100" y2="70" stroke={THEME.text} strokeWidth="6" strokeLinecap="round" />
                </svg>
            </div>
            <div style={{ position: 'absolute', top: 70, left: 90, transform: `scale(${pop1}) rotate(25deg)` }}>
                <svg width="150" height="200" viewBox="0 0 150 200">
                    <rect x="5" y="5" width="140" height="190" fill={THEME.yellow} stroke={THEME.text} strokeWidth="8" rx="5" />
                    <circle cx="75" cy="80" r="30" fill="none" stroke={THEME.text} strokeWidth="8" />
                    <line x1="45" y1="140" x2="105" y2="140" stroke={THEME.text} strokeWidth="8" strokeLinecap="round" />
                </svg>
            </div>
        </div>
    );
};

const RelaxSVG: React.FC = () => (
    // Waves and Sun
    <svg width="300" height="200" viewBox="0 0 300 200">
        <circle cx="150" cy="100" r="50" fill={THEME.yellow} />
        <path d="M 0 150 Q 50 100 100 150 T 200 150 T 300 150" fill="none" stroke={THEME.teal} strokeWidth="15" strokeLinecap="round" />
        <path d="M 0 180 Q 50 140 100 180 T 200 180 T 300 180" fill="none" stroke={THEME.text} strokeWidth="15" strokeLinecap="round" />
    </svg>
);

const HouseSVG: React.FC = () => (
    <svg width="200" height="200" viewBox="0 0 200 200">
        <polygon points="100,20 20,90 180,90" fill={THEME.accent} stroke={THEME.text} strokeWidth="12" strokeLinejoin="round" />
        <rect x="40" y="90" width="120" height="90" fill={THEME.bg} stroke={THEME.text} strokeWidth="12" />
        <rect x="80" y="130" width="40" height="50" fill={THEME.teal} stroke={THEME.text} strokeWidth="8" />
    </svg>
);

const BigLineGraph: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const p = spring({ frame, fps, config: { damping: 20 } });
    const dash = interpolate(p, [0, 1], [500, 0]);

    return (
        <svg width="400" height="300" viewBox="0 0 400 300">
            <line x1="20" y1="20" x2="20" y2="280" stroke={THEME.text} strokeWidth="8" strokeLinecap="round" />
            <line x1="20" y1="280" x2="380" y2="280" stroke={THEME.text} strokeWidth="8" strokeLinecap="round" />
            <path d="M 20 280 Q 100 200 200 220 T 350 40" fill="none" stroke={THEME.teal} strokeWidth="15" strokeLinecap="round" strokeDasharray="500" strokeDashoffset={dash} />
            {p > 0.9 && <circle cx="350" cy="40" r="15" fill={THEME.accent} />}
        </svg>
    );
};

// Callout
const Callout: React.FC<{ delay?: number, text: string, direction: 'left' | 'right' | 'straight' }> = ({ delay = 0, text, direction }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const p = Math.max(0, frame - delay);
    const lineDraw = spring({ frame: p, fps, config: { damping: 12 } });
    const textPop = spring({ frame: Math.max(0, p - 6), fps, config: { damping: 10 } });

    return (
        <div style={{ position: 'absolute', top: 0, left: direction === 'left' ? -350 : (direction === 'straight' ? -50 : 150), zIndex: 10 }}>
            {direction !== 'straight' && (
                <svg width="350" height="200" viewBox="0 0 350 200" style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}>
                    {direction === 'right' ? (
                        <path d="M 0 100 Q 150 100 250 50" fill="none" stroke={THEME.text} strokeWidth="6" strokeLinecap="round" strokeDasharray="300" strokeDashoffset={300 - lineDraw * 300} />
                    ) : (
                        <path d="M 350 100 Q 200 100 100 50" fill="none" stroke={THEME.text} strokeWidth="6" strokeLinecap="round" strokeDasharray="300" strokeDashoffset={300 - lineDraw * 300} />
                    )}
                </svg>
            )}
            <div style={{
                position: 'absolute',
                top: direction === 'straight' ? 100 : 5,
                left: direction === 'right' ? 100 : 20,
                transform: `scale(${textPop}) rotate(${direction === 'left' ? '-5deg' : (direction === 'straight' ? '0deg' : '5deg')})`,
                background: THEME.text,
                color: '#fff',
                padding: '20px 40px',
                borderRadius: 30,
                fontFamily: 'Outfit',
                fontWeight: 900,
                fontSize: 35,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                whiteSpace: 'nowrap'
            }}>
                {text}
            </div>
        </div>
    );
};

export const LazyMoney2026: React.FC = () => {
    const frame = useCurrentFrame();

    // Soft gradient moving
    const bg = interpolateColors(
        Math.sin(frame / 60),
        [-1, 1],
        [THEME.bg, THEME.bgAlt]
    );

    return (
        <AbsoluteFill style={{ backgroundColor: bg, overflow: 'hidden' }}>
            <FontStyles />
            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.15} loop />

            {/* CUT 1: Intro (0 - 240, duration 8s) */}
            {/* "Want to make money in 2026 without selling your soul? Here are the 3 laziest, completely ethical ways to generate passive income." */}
            <Sequence durationInFrames={300}>
                <Audio src={staticFile("lazy_money/01_intro.mp3")} />

                {/* 0-60: "Want to make money in 2026" */}
                <Sequence durationInFrames={70}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Pop><h1 style={{ fontFamily: 'Outfit', fontSize: 150, color: THEME.text, margin: 0 }}>MAKE MONEY</h1></Pop>
                        <Pop delay={15} scaleBase={1.2}><h1 style={{ fontFamily: 'Outfit', fontSize: 200, color: THEME.accent, margin: 0 }}>IN 2026</h1></Pop>
                    </AbsoluteFill>
                </Sequence>

                {/* 70-130: "Without selling your soul" */}
                <Sequence from={70} durationInFrames={70}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: THEME.text }}>
                        <Pop><h1 style={{ fontFamily: 'Outfit', fontSize: 120, color: THEME.bg, margin: 0 }}>WITHOUT SELLING</h1></Pop>
                        <Pop delay={10}><h1 style={{ fontFamily: 'Outfit', fontSize: 180, color: THEME.accent, margin: 0 }}>YOUR SOUL.</h1></Pop>
                    </AbsoluteFill>
                </Sequence>

                {/* 140-300: "3 laziest ethical ways to passive income" */}
                <Sequence from={140} durationInFrames={160}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: 50 }}>
                            <Pop delay={0}><div style={{ padding: 40, background: THEME.teal, borderRadius: 20, color: '#fff', fontSize: 80, fontFamily: 'Outfit', fontWeight: 900 }}>3 WAYS</div></Pop>
                            <Pop delay={30}><div style={{ padding: 40, background: THEME.yellow, borderRadius: 20, color: THEME.text, fontSize: 80, fontFamily: 'Outfit', fontWeight: 900 }}>LAZY</div></Pop>
                            <Pop delay={50}><div style={{ padding: 40, background: THEME.accent, borderRadius: 20, color: '#fff', fontSize: 80, fontFamily: 'Outfit', fontWeight: 900 }}>ETHICAL</div></Pop>
                        </div>
                    </AbsoluteFill>
                </Sequence>
            </Sequence>

            {/* CUT 2: Compute (300 - 640) */}
            {/* "Number 1. Fractional AI Compute. As AI models explode, data centers are full. You can now securely rent out your idle computer GPU power. You sleep, your machine works." */}
            <Sequence from={300} durationInFrames={360}>
                <Audio src={staticFile("lazy_money/02_compute.mp3")} />

                {/* Title */}
                <Sequence durationInFrames={360}>
                    <AbsoluteFill style={{ top: 150, alignItems: 'center' }}>
                        <Pop><h2 style={{ fontFamily: 'Outfit', fontSize: 120, color: THEME.text, margin: 0 }}>#1 FRACTIONAL AI</h2></Pop>
                    </AbsoluteFill>
                </Sequence>

                {/* Visuals change every 2 seconds (60 frames) */}
                {/* 0-90: Robot / AI Exploding */}
                <Sequence durationInFrames={90}>
                    <AbsoluteFill style={{ top: 400, alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <Pop><RobotSVG /></Pop>
                            <Callout delay={30} text="AI DEMAND" direction="right" />
                        </div>
                    </AbsoluteFill>
                </Sequence>

                {/* 90-180: Computer GPU */}
                <Sequence from={90} durationInFrames={90}>
                    <AbsoluteFill style={{ top: 400, alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <Pop><ComputerSVG /></Pop>
                            <Callout delay={20} text="RENT YOUR GPU" direction="straight" />
                        </div>
                    </AbsoluteFill>
                </Sequence>

                {/* 180-360: Stickman sleeping / Passive */}
                <Sequence from={180} durationInFrames={180}>
                    <AbsoluteFill style={{ top: 400, justifyContent: 'center', flexDirection: 'row', gap: 60 }}>
                        <Pop><h1 style={{ fontFamily: 'Outfit', fontSize: 100, color: THEME.text, margin: 0 }}>YOU <span style={{ color: THEME.accent }}>SLEEP.</span></h1></Pop>
                        <Pop delay={20}><h1 style={{ fontFamily: 'Outfit', fontSize: 100, color: THEME.teal, margin: 0 }}>IT <span style={{ color: THEME.text }}>EARNS.</span></h1></Pop>
                    </AbsoluteFill>
                </Sequence>
            </Sequence>

            {/* CUT 3: Digital Assets (660 - 920) */}
            {/* "Number 2. Digital Assets. Set up a store selling notion templates, budget sheets, or AI prompts. Build it once, sell it a thousand times while you relax." */}
            <Sequence from={660} durationInFrames={300}>
                <Audio src={staticFile("lazy_money/03_templates.mp3")} />

                <Sequence durationInFrames={300}>
                    <AbsoluteFill style={{ top: 150, alignItems: 'center' }}>
                        <Pop><h2 style={{ fontFamily: 'Outfit', fontSize: 120, color: THEME.text, margin: 0 }}>#2 DIGITAL ASSETS</h2></Pop>
                    </AbsoluteFill>
                </Sequence>

                {/* 0-100: Documents / Templates */}
                <Sequence durationInFrames={120}>
                    <AbsoluteFill style={{ top: 400, alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <DocumentsSVG />
                            <Callout delay={30} text="TEMPLATES" direction="right" />
                            <div style={{ position: 'absolute', top: 120, left: 0 }}>
                                <Callout delay={60} text="AI PROMPTS" direction="right" />
                            </div>
                        </div>
                    </AbsoluteFill>
                </Sequence>

                {/* 120-300: Sell 1000x / Waves */}
                <Sequence from={120} durationInFrames={180}>
                    <AbsoluteFill style={{ top: 450, alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <Pop><RelaxSVG /></Pop>
                            <Callout delay={20} text="SELL 1000x" direction="left" />
                        </div>
                    </AbsoluteFill>
                </Sequence>
            </Sequence>

            {/* CUT 4: Micro-Investing (960 - 1280) */}
            {/* "Number 3. Automated Micro-Investing. Platforms now sweep your digital change into fractional real estate or dividend ETFs. The ultimate set-and-forget." */}
            <Sequence from={960} durationInFrames={360}>
                <Audio src={staticFile("lazy_money/04_investing.mp3")} />

                <Sequence durationInFrames={360}>
                    <AbsoluteFill style={{ top: 150, alignItems: 'center' }}>
                        <Pop><h2 style={{ fontFamily: 'Outfit', fontSize: 120, color: THEME.text, margin: 0 }}>#3 MICRO-INVESTING</h2></Pop>
                    </AbsoluteFill>
                </Sequence>

                {/* 0-90: Fractional Real Estate (House) */}
                <Sequence durationInFrames={120}>
                    <AbsoluteFill style={{ top: 400, alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <Pop><HouseSVG /></Pop>
                            <Callout delay={30} text="REAL ESTATE" direction="right" />
                        </div>
                    </AbsoluteFill>
                </Sequence>

                {/* 120-360: Graph & Set and Forget */}
                <Sequence from={120} durationInFrames={240}>
                    <AbsoluteFill style={{ top: 400, justifyContent: 'center', flexDirection: 'row', gap: 100 }}>
                        <BigLineGraph />
                        <div style={{ marginTop: 50 }}>
                            <Pop delay={30}><div style={{ padding: '20px 40px', background: THEME.accent, color: '#fff', fontSize: 80, fontFamily: 'Outfit', fontWeight: 900, borderRadius: 20 }}>SET &<br />FORGET</div></Pop>
                        </div>
                    </AbsoluteFill>
                </Sequence>
            </Sequence>

            {/* CUT 5: Outro (1320 - 1470) */}
            {/* "Which one are you starting today? Subscribe for more 2026 trends." */}
            <Sequence from={1320} durationInFrames={150}>
                <Audio src={staticFile("lazy_money/05_outro.mp3")} />

                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Pop scaleBase={1.2}>
                        <h1 style={{ fontFamily: 'Outfit', fontSize: 130, color: THEME.text, margin: 0 }}>
                            WHICH ONE ARE YOU
                        </h1>
                    </Pop>
                    <Pop delay={20} scaleBase={1.2}>
                        <h1 style={{ fontFamily: 'Outfit', fontSize: 160, color: THEME.accent, margin: 0 }}>
                            STARTING TODAY?
                        </h1>
                    </Pop>

                    <div style={{ marginTop: 100 }}>
                        <Pop delay={50}>
                            <div style={{ padding: '30px 60px', background: THEME.teal, borderRadius: 50, color: '#fff', fontSize: 80, fontFamily: 'Outfit', fontWeight: 900 }}>
                                SUBSCRIBE
                            </div>
                        </Pop>
                    </div>
                </AbsoluteFill>
            </Sequence>
        </AbsoluteFill>
    );
};
