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
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&display=swap');
        `}
    </style>
);

const THEME = {
    white: '#FFFFFF',
    red: '#FF3366',
    pink: '#EC4899',
    yellow: '#FFD700',
    textDark: '#0F172A',
    textLight: '#FFFFFF',
    blue: '#3B82F6',
    purple: '#8B5CF6',
    gray: '#E2E8F0',
};

// --- Utilities ---
const usePop = (delay: number, damping = 12) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    return spring({ frame: Math.max(0, frame - delay), fps, config: { damping } });
};

const HUDPanel: React.FC<{ children: React.ReactNode, delay: number, left: number | string, top: number | string, right?: number | string, bottom?: number | string, width: number | string, height: number, borderColor?: string, bg?: string, textColor?: string }> = ({ children, delay, left, top, right, bottom, width, height, borderColor = THEME.textDark, bg = 'rgba(255, 255, 255, 0.9)', textColor = THEME.textDark }) => {
    const p = usePop(delay);
    if (p === 0) return null;
    return (
        <div style={{
            position: 'absolute',
            left, top, right, bottom, width, height,
            transform: `scale(${p})`,
            background: bg,
            backdropFilter: 'blur(20px)',
            border: `4px solid ${borderColor}`,
            borderRadius: 16,
            boxShadow: `0 30px 60px rgba(0,0,0,0.1), 0 0 40px ${borderColor}22`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            color: textColor
        }}>
            {children}
            <div style={{ position: 'absolute', top: -10, left: -10, width: 30, height: 30, borderTop: `8px solid ${borderColor}`, borderLeft: `8px solid ${borderColor}` }} />
            <div style={{ position: 'absolute', bottom: -10, right: -10, width: 30, height: 30, borderBottom: `8px solid ${borderColor}`, borderRight: `8px solid ${borderColor}` }} />
        </div>
    );
};

const FastTitle: React.FC<{ title: string, subtitle: string, delay: number, left: number | string, top: number | string, color?: string, highlightCol?: string }> = ({ title, subtitle, delay, left, top, color = THEME.textDark, highlightCol = THEME.red }) => {
    const pop1 = usePop(delay);
    const pop2 = usePop(delay + 15);
    return (
        <div style={{ position: 'absolute', left, top, display: 'flex', flexDirection: 'column', zIndex: 10 }}>
            {pop1 > 0 && <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 130, color, textTransform: 'uppercase', lineHeight: 0.9, margin: 0, transform: `translateX(${(1 - pop1) * -100}px)`, opacity: pop1 }}>{title}</h1>}
            {pop2 > 0 && <h2 style={{ fontFamily: 'JetBrains Mono', fontSize: 50, color: '#fff', margin: 0, transform: `translateX(${(1 - pop2) * -50}px)`, opacity: pop2, background: highlightCol, padding: '10px 20px', borderRadius: 8, alignSelf: 'flex-start', boxShadow: `0 10px 30px ${highlightCol}66` }}>{`> ${subtitle}_`}</h2>}
        </div>
    );
};

// --- Immersive Graphics & SVGs ---

const NumberTicker: React.FC<{ target: number, delay: number, prefix?: string, suffix?: string, color: string }> = ({ target, delay, prefix = '', suffix = '', color }) => {
    const p = usePop(delay, 20);
    const val = Math.floor(interpolate(p, [0, 1], [0, target]));
    return (
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 70, fontWeight: 900, color }}>
            {prefix}{val.toLocaleString()}{suffix}
        </div>
    );
};

const DynamicWaveGraph: React.FC<{ color: string, delay: number, isCrash?: boolean, gridColor?: string }> = ({ color, delay, isCrash = false, gridColor = THEME.textDark }) => {
    const frame = useCurrentFrame();
    const progress = Math.max(0, frame - delay);
    const w = 400; const h = 200;
    const length = interpolate(progress, [0, 40], [0, w], { extrapolateRight: 'clamp' });

    let path = `M 0 ${h / 2}`;
    for (let x = 0; x <= length; x += 10) {
        let y = Math.sin((x + frame * 2) / 30) * 30 + (h / 2);
        if (isCrash && progress > 30) {
            y += (x / w) * Math.pow((progress - 30), 2) * 0.5;
        } else if (!isCrash) {
            y -= (x / w) * 50;
        }
        path += ` L ${x} ${Math.min(h, Math.max(0, y))}`;
    }

    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
            <path d={path} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            {length >= w && <circle cx={w} cy={isCrash ? h : h * 0.2} r="12" fill={color} />}
            <rect x="0" y="0" width={w} height={h} fill="none" stroke={gridColor} strokeWidth="1" strokeDasharray="10 10" opacity={0.2} />
        </svg>
    );
};

const RadarScanner: React.FC<{ delay: number, color?: string }> = ({ delay, color = THEME.blue }) => {
    const f = useCurrentFrame();
    const rot = (f * 5) % 360;
    const p = usePop(delay);
    return (
        <svg width="300" height="300" viewBox="0 0 300 300" style={{ transform: `scale(${p})` }}>
            <circle cx="150" cy="150" r="120" fill="none" stroke={color} strokeWidth="4" opacity={0.3} />
            <circle cx="150" cy="150" r="80" fill="none" stroke={color} strokeWidth="2" opacity={0.15} strokeDasharray="5 5" />
            <g style={{ transform: `rotate(${rot}deg)`, transformOrigin: '150px 150px' }}>
                <path d="M 150 150 L 150 30 A 120 120 0 0 1 270 150 Z" fill={color} opacity={0.2} />
                <line x1="150" y1="150" x2="150" y2="30" stroke={color} strokeWidth="6" strokeLinecap="round" />
            </g>
        </svg>
    );
};

const FlowChartSVG: React.FC<{ delay: number, color?: string }> = ({ delay, color = THEME.blue }) => {
    const f = useCurrentFrame();
    const p = Math.max(0, f - delay);
    const Node = ({ x, y, label, col, active }: any) => (
        <g style={{ transform: `scale(${usePop(delay)})`, transformOrigin: `${x}px ${y}px` }}>
            <rect x={x - 70} y={y - 30} width="140" height="60" rx="12" fill={active ? col : '#fff'} stroke={col} strokeWidth="4" />
            <text x={x} y={y + 8} fill={active ? '#fff' : '#000'} fontFamily="Space Grotesk" fontSize="18" fontWeight="900" textAnchor="middle">{label}</text>
        </g>
    );
    const Line = ({ x1, y1, x2, y2, active }: any) => {
        const draw = interpolate(Math.max(0, p - 10), [0, 15], [0, 100], { extrapolateRight: 'clamp' });
        const dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={active ? color : THEME.gray} strokeWidth="6" strokeLinecap="round" strokeDasharray={dist} strokeDashoffset={dist - (dist * draw / 100)} />
    };
    return (
        <svg width="500" height="300" viewBox="0 0 500 300">
            <Line x1={250} y1={60} x2={100} y2={150} active={p > 30} />
            <Line x1={250} y1={60} x2={400} y2={150} active={p > 30} />
            <Line x1={100} y1={150} x2={250} y2={240} active={p > 60} />
            <Line x1={400} y1={150} x2={250} y2={240} active={p > 60} />
            <Node x={250} y={60} label="AI STARTUP" col={THEME.blue} active={p > 0} />
            <Node x={100} y={150} label="CLOUD SVCS" col={THEME.purple} active={p > 30} />
            <Node x={400} y={150} label="HARDWARE" col={THEME.red} active={p > 30} />
            <Node x={250} y={240} label="BURN RATE" col={color} active={p > 60} />
        </svg>
    );
};

const BankSVG: React.FC<{ delay?: number, color?: string }> = ({ delay = 0, color = THEME.textDark }) => {
    const f = useCurrentFrame();
    const p = Math.max(0, f - delay);
    const build = spring({ frame: p, fps: 30, config: { damping: 15 } });
    const columnH = interpolate(build, [0, 1], [0, 80]);
    return (
        <svg width="300" height="200" viewBox="0 0 300 200">
            <g style={{ transform: `translateY(${interpolate(build, [0, 1], [50, 0])}px)` }}>
                <rect x="20" y="140" width="260" height="20" fill={color} rx="4" />
                <rect x="40" y="120" width="220" height="20" fill={THEME.blue} rx="4" />
                <rect x="50" y={120 - columnH} width="25" height={columnH} fill={THEME.pink} rx="4" />
                <rect x="100" y={120 - columnH} width="25" height={columnH} fill={THEME.yellow} rx="4" />
                <rect x="150" y={120 - columnH} width="25" height={columnH} fill={THEME.purple} rx="4" />
                <rect x="200" y={120 - columnH} width="25" height={columnH} fill={THEME.red} rx="4" />
            </g>
        </svg>
    );
};

const ServerStack: React.FC<{ delay: number, color?: string }> = ({ delay, color = THEME.blue }) => {
    const p = usePop(delay);
    const f = useCurrentFrame();
    return (
        <svg width="250" height="350" viewBox="0 0 250 350" style={{ transform: `scale(${p})` }}>
            {[0, 1, 2, 3].map(i => {
                const off = Math.max(0, f - delay - (i * 10));
                const glow = off > 15 ? (Math.sin(f / 3 + i) > 0 ? color : THEME.gray) : '#000';
                return (
                    <g key={i} style={{ transform: `translateY(${i * 80 + 20}px)` }}>
                        <rect x="25" y="0" width="200" height="60" rx="10" fill="#fff" stroke="#000" strokeWidth="4" />
                        <line x1="45" y1="30" x2="160" y2="30" stroke="#000" strokeWidth="3" strokeDasharray="10 10" opacity={0.3} />
                        <circle cx="200" cy="30" r="12" fill={glow} />
                    </g>
                );
            })}
        </svg>
    );
};

const ChecklistSVG: React.FC<{ delay?: number, color?: string }> = ({ delay = 0, color = THEME.red }) => {
    const frame = useCurrentFrame();
    const p1 = Math.max(0, frame - delay);
    const p2 = Math.max(0, frame - delay - 15);
    const pScale = usePop(delay);

    const Item = ({ y, label, checkP, isBad }: { y: number, label: string, checkP: number, isBad: boolean }) => {
        const draw = interpolate(checkP, [0, 15], [0, 50], { extrapolateRight: 'clamp' });
        return (
            <g style={{ transform: `translateY(${y}px)` }}>
                <rect x="20" y="0" width="35" height="35" rx="8" fill="#eee" stroke="#000" strokeWidth="3" />
                <text x="75" y="24" fill={checkP > 0 ? color : "#000"} fontFamily="JetBrains Mono" fontSize="22" fontWeight="900">[{label}]</text>
                {isBad ? (
                    <path d="M 25 7 L 45 27 M 45 7 L 25 27" fill="none" stroke={color} strokeWidth="8" strokeDasharray="50" strokeDashoffset={50 - draw} strokeLinecap="round" />
                ) : (
                    <path d="M 25 18 L 32 25 L 45 10" fill="none" stroke="#10B981" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="50" strokeDashoffset={50 - draw} />
                )}
            </g>
        );
    };

    return (
        <svg width="400" height="200" viewBox="0 0 400 200" style={{ transform: `scale(${pScale})` }}>
            <Item y={20} label="FUNDING" checkP={p1} isBad={false} />
            <Item y={100} label="PROFIT" checkP={p2} isBad={true} />
        </svg>
    );
};

export const AIBubbleBurst: React.FC = () => {
    const frame = useCurrentFrame();

    // Wordcount-based cuts scaled to 127 seconds (3810 frames)
    const cuts = [162, 378, 378, 337, 297, 337, 311, 324, 324, 311, 392, 359];
    let startFrame = 0;
    const breaks = cuts.map((cut) => {
        const current = startFrame;
        startFrame += cut;
        return current;
    });

    // Background color sequence: White, Red, Pink, Yellow
    const bgColors = [THEME.white, THEME.red, THEME.pink, THEME.yellow];

    const SceneBackground: React.FC<{ index: number }> = ({ index }) => {
        const color = bgColors[index % bgColors.length];
        return <AbsoluteFill style={{ backgroundColor: color }} />;
    };

    return (
        <AbsoluteFill style={{ backgroundColor: THEME.white, overflow: 'hidden' }}>
            <FontStyles />

            {/* Audio Layers */}
            <Audio src={staticFile("bubble/bubble.wav")} volume={1} />
            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.15} loop />

            {/* CUT 1: Intro (0) - White */}
            <Sequence from={breaks[0]} durationInFrames={cuts[0]}>
                <SceneBackground index={0} />
                <Sequence from={0}><Audio src={staticFile("sfx/whoosh.mp3")} volume={0.6} /></Sequence>
                <FastTitle title="AI BUBBLE" subtitle="2026_ANALYSIS" delay={10} left="10%" top="15%" />
                <HUDPanel delay={40} left="55%" top="10%" width={600} height={400}>
                    <DynamicWaveGraph color={THEME.blue} delay={50} />
                    <div style={{ position: 'absolute', bottom: 20, fontFamily: 'JetBrains Mono', fontWeight: '900' }}>VALUATION_SURGE</div>
                </HUDPanel>
            </Sequence>

            {/* CUT 2: The Bubble (1) - Red */}
            <Sequence from={breaks[1]} durationInFrames={cuts[1]}>
                <SceneBackground index={1} />
                <Sequence from={0}><Audio src={staticFile("sfx/rise.mp3")} volume={0.8} /></Sequence>
                <FastTitle title="TRILLIONS" subtitle="Capital Influx" delay={10} left="5%" top="10%" color={THEME.textLight} highlightCol={THEME.yellow} />
                <HUDPanel delay={50} right="5%" top="5%" width={600} height={400} borderColor={THEME.white}>
                    <BankSVG delay={60} color={THEME.white} />
                </HUDPanel>
                <HUDPanel delay={100} left="10%" bottom="10%" width={500} height={500} borderColor={THEME.white}>
                    <ServerStack delay={110} color={THEME.yellow} />
                </HUDPanel>
            </Sequence>

            {/* CUT 3: Missing Profits (2) - Pink */}
            <Sequence from={breaks[2]} durationInFrames={cuts[2]}>
                <SceneBackground index={2} />
                <Sequence from={10}><Audio src={staticFile("sfx/pop.mp3")} /></Sequence>
                <FastTitle title="NO PROFIT" subtitle="Burn Rate 100%" delay={10} left="10%" top="10%" color={THEME.textLight} />
                <HUDPanel delay={50} right="10%" top="20%" width={700} height={400} borderColor={THEME.white}>
                    <NumberTicker target={500} prefix="$" suffix="B" color={THEME.red} delay={60} />
                    <div style={{ fontFamily: 'JetBrains Mono', fontWeight: '900' }}>TOTAL_LOSSES</div>
                </HUDPanel>
            </Sequence>

            {/* CUT 4: Circular Economy (3) - Yellow */}
            <Sequence from={breaks[3]} durationInFrames={cuts[3]}>
                <SceneBackground index={3} />
                <Sequence from={0}><Audio src={staticFile("sfx/whoosh.mp3")} /></Sequence>
                <FastTitle title="CIRCULAR" subtitle="Economy_Loop" delay={10} left="5%" top="5%" />
                <HUDPanel delay={60} left="25%" top="25%" width={1000} height={600} borderColor={THEME.purple}>
                    <FlowChartSVG delay={70} color={THEME.purple} />
                </HUDPanel>
            </Sequence>

            {/* CUT 5: The Pop (4) - White */}
            <Sequence from={breaks[4]} durationInFrames={cuts[4]}>
                <SceneBackground index={0} />
                <Sequence from={0}><Audio src={staticFile("sfx/pop.mp3")} volume={1} /></Sequence>
                <FastTitle title="THE POP" subtitle="CRITICAL_FAILURE" delay={10} left="10%" top="10%" highlightCol={THEME.red} />
                <HUDPanel delay={50} right="10%" top="10%" width={600} height={600} borderColor={THEME.red}>
                    <DynamicWaveGraph color={THEME.red} delay={60} isCrash={true} />
                </HUDPanel>
            </Sequence>

            {/* CUT 6: Crash (5) - Red */}
            <Sequence from={breaks[5]} durationInFrames={cuts[5]}>
                <SceneBackground index={1} />
                <Sequence from={0}><Audio src={staticFile("sfx/whoosh.mp3")} /></Sequence>
                <FastTitle title="CRASH" subtitle="Market Plunge" delay={10} left="5%" top="5%" color={THEME.textLight} highlightCol={THEME.yellow} />
                <HUDPanel delay={60} left="25%" top="25%" width={1000} height={600} borderColor={THEME.white}>
                    <DynamicWaveGraph color={THEME.yellow} delay={70} isCrash={true} gridColor={THEME.white} />
                </HUDPanel>
            </Sequence>

            {/* CUT 7: Freeze (6) - Pink */}
            <Sequence from={breaks[6]} durationInFrames={cuts[6]}>
                <SceneBackground index={2} />
                <Sequence from={10}><Audio src={staticFile("sfx/pop.mp3")} /></Sequence>
                <FastTitle title="VC FREEZE" subtitle="Zero_Liquidity" delay={10} left="10%" top="10%" color={THEME.textLight} />
                <HUDPanel delay={60} right="10%" top="30%" width={600} height={600} borderColor={THEME.white}>
                    <ChecklistSVG delay={70} color={THEME.yellow} />
                </HUDPanel>
            </Sequence>

            {/* CUT 8: Graveyards (7) - Yellow */}
            <Sequence from={breaks[7]} durationInFrames={cuts[7]}>
                <SceneBackground index={3} />
                <Sequence from={0}><Audio src={staticFile("sfx/whoosh.mp3")} /></Sequence>
                <FastTitle title="GHOSTS" subtitle="Server Graveyards" delay={10} left="5%" top="5%" />
                <HUDPanel delay={60} left="20%" top="20%" width={1200} height={600} borderColor={THEME.purple}>
                    <div style={{ display: 'flex', gap: 50 }}>
                        <ServerStack delay={70} color={THEME.purple} />
                        <ServerStack delay={85} color={THEME.purple} />
                        <ServerStack delay={100} color={THEME.purple} />
                    </div>
                </HUDPanel>
            </Sequence>

            {/* CUT 9: Jobs (8) - White */}
            <Sequence from={breaks[8]} durationInFrames={cuts[8]}>
                <SceneBackground index={0} />
                <Sequence from={10}><Audio src={staticFile("sfx/pop.mp3")} /></Sequence>
                <FastTitle title="LAYOUTS" subtitle="Mass Layoffs" delay={10} left="10%" top="10%" highlightCol={THEME.red} />
                <HUDPanel delay={60} right="10%" bottom="10%" width={800} height={400} borderColor={THEME.red}>
                    <NumberTicker target={50000} color={THEME.red} delay={70} suffix=" JOBS" />
                </HUDPanel>
            </Sequence>

            {/* CUT 10: Contagion (9) - Red */}
            <Sequence from={breaks[9]} durationInFrames={cuts[9]}>
                <SceneBackground index={1} />
                <Sequence from={0}><Audio src={staticFile("sfx/rise.mp3")} /></Sequence>
                <FastTitle title="CONTAGION" subtitle="Global Network" delay={10} left="5%" top="5%" color={THEME.textLight} />
                <HUDPanel delay={60} left="15%" top="30%" width={900} height={500} borderColor={THEME.white}>
                    <RadarScanner delay={70} color={THEME.yellow} />
                </HUDPanel>
            </Sequence>

            {/* CUT 11: Correction (10) - Pink */}
            <Sequence from={breaks[10]} durationInFrames={cuts[10]}>
                <SceneBackground index={2} />
                <Sequence from={0}><Audio src={staticFile("sfx/whoosh.mp3")} /></Sequence>
                <FastTitle title="PURGE" subtitle="Market_Correction" delay={10} left="10%" top="10%" color={THEME.textLight} highlightCol={THEME.white} />
                <HUDPanel delay={60} left="30%" top="30%" width={800} height={500} borderColor={THEME.white}>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 60, fontWeight: '900' }}>SYSTEMS_OFFLINE</div>
                </HUDPanel>
            </Sequence>

            {/* CUT 12: Outro (11) - Yellow */}
            <Sequence from={breaks[11]} durationInFrames={cuts[11]}>
                <SceneBackground index={3} />
                <Sequence from={10}><Audio src={staticFile("sfx/pop.mp3")} /></Sequence>
                <AbsoluteFill style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ background: '#000', color: '#fff', padding: '50px 100px', borderRadius: 30 }}>
                        <h1 style={{ fontFamily: 'Space Grotesk', fontSize: 130, margin: 0 }}>SUBSCRIBE</h1>
                        <h2 style={{ fontFamily: 'JetBrains Mono', fontSize: 40, margin: 0, opacity: 0.7 }}>FOR THE NEXT BUBBLE_</h2>
                    </div>
                </AbsoluteFill>
            </Sequence>

        </AbsoluteFill>
    );
};
