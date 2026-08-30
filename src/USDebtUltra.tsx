import React from 'react';
import {
    AbsoluteFill,
    Sequence,
    useCurrentFrame,
    interpolate,
    spring,
    Audio,
    staticFile,
    OffthreadVideo,
} from 'remotion';
import { FONT_STACK, FONT_IMPORT, StickFigure } from './components/PremiumKit';

// --- CONFIG ---
const PACING = 30; // 1.0s - Ultra aggressive visual heartbeat
const TOTAL_FRAMES = 8366;

const THEME = {
    navy: '#010204',
    gold: '#FFD700',
    red: '#FF1F1F',
    white: '#F0F0F0',
    border: 'rgba(255,255,255,0.08)',
    blue: '#00A2FF',
    green: '#00FF88',
};

// --- DATA ---
const CHAPTERS = [
    { id: 'intro', start: 0, end: 900, title: "THE DEBT CLOCK" },
    { id: 'visualize', start: 900, end: 1800, title: "THE $34T SCALE" },
    { id: 'explosive', start: 1800, end: 2700, title: "THE ACCELERATION" },
    { id: 'trapped', start: 2700, end: 3600, title: "THE INTEREST SPIRAL" },
    { id: 'comparison', start: 3600, end: 4500, title: "DEBT VS WORLD" },
    { id: 'holders', start: 4500, end: 5400, title: "WHO OWNS US?" },
    { id: 'inflation', start: 5400, end: 6300, title: "THE DEVALUATION" },
    { id: 'endgame', start: 6300, end: 7300, title: "SYSTEM RESET" },
    { id: 'final', start: 7300, end: TOTAL_FRAMES, title: "THE FINAL EXIT" },
];

// --- COMPONENTS ---

const Background: React.FC<{ chIndex: number; sIdx: number }> = ({ chIndex, sIdx }) => {
    const brolls = [
        'debt_bg_1.mp4', 'broll_data_center.mp4', 'debt_bg_2.mp4',
        'broll_crowd.mp4', 'debt_bg_3.mp4', 'broll_server_1.mp4',
        'debt_bg_4.mp4', 'broll_microchip.mp4', 'debt_bg_5.mp4',
        'broll_code.mp4', 'debt_bg_6.mp4', 'debt_bg_7.mp4',
        'debt_bg_8.mp4', 'debt_bg_9.mp4', 'debt_bg_10.mp4'
    ];
    const src = brolls[(chIndex * 7 + sIdx) % brolls.length];

    const frame = useCurrentFrame();
    // Constant slow drift + pulse
    const scale = interpolate(frame % (PACING * 4), [0, PACING * 4], [1.0, 1.15]);
    const brightness = interpolate(Math.sin(frame / 20), [-1, 1], [0.15, 0.25]);

    return (
        <AbsoluteFill style={{ backgroundColor: '#000' }}>
            <div style={{ width: '100%', height: '100%', transform: `scale(${scale})` }}>
                <OffthreadVideo
                    src={staticFile(src)}
                    muted
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: `brightness(${brightness}) contrast(1.5) saturate(0.1)`,
                    }}
                />
            </div>
            <AbsoluteFill style={{
                background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.95) 90%)',
            }} />
        </AbsoluteFill>
    );
};

const KineticHeading: React.FC<{ text: string; color?: string }> = ({ text, color = THEME.white }) => {
    const frame = useCurrentFrame();
    const anim = spring({ frame: frame % PACING, fps: 30, config: { damping: 12 } });
    const y = Math.round(interpolate(anim, [0, 1], [80, 0]));
    const blur = interpolate(anim, [0, 1], [15, 0]);

    return (
        <div style={{
            fontFamily: FONT_STACK.display,
            fontSize: 140,
            color,
            textTransform: 'uppercase',
            textAlign: 'center',
            transform: `translateY(${y}px) scale(${interpolate(anim, [0, 1], [1.1, 1])})`,
            opacity: anim,
            letterSpacing: 20,
            fontWeight: 900,
            filter: `blur(${blur}px)`,
            width: '100%',
            textShadow: '0 0 50px rgba(0,0,0,0.8)',
        }}>
            {text}
        </div>
    );
};

const DataModule: React.FC<{ label: string; value: string; sub?: string; color: string }> = ({ label, value, sub, color }) => {
    const frame = useCurrentFrame();
    const a = spring({ frame: frame % PACING, fps: 30 });
    return (
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: `2px solid ${color}66`,
            borderRadius: 30,
            padding: 60,
            width: 850,
            transform: `scale(${interpolate(a, [0, 1], [0.9, 1])})`,
            opacity: a,
            boxShadow: `0 40px 100px rgba(0,0,0,0.9), inset 0 0 50px ${color}15`,
            backdropFilter: 'blur(20px)',
            textAlign: 'center'
        }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 20, fontFamily: FONT_STACK.mono, textTransform: 'uppercase', letterSpacing: 8, marginBottom: 20 }}>{label}</div>
            <div style={{ color, fontSize: 100, fontFamily: FONT_STACK.display, fontWeight: 900, lineHeight: 0.9, letterSpacing: -2 }}>{value}</div>
            {sub && <div style={{ color: 'white', opacity: 0.6, fontSize: 24, marginTop: 30, fontFamily: FONT_STACK.condensed, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)' }}>{sub}</div>}
        </div>
    );
};

const HighEndGraph: React.FC<{ points: { x: number; y: number }[]; color: string; title: string }> = ({ points, color, title }) => {
    const frame = useCurrentFrame();
    const progress = interpolate(frame % (PACING * 2), [0, 40], [0, 1], { extrapolateRight: 'clamp' });
    const W = 1200, H = 500;
    const maxX = Math.max(...points.map(p => p.x));
    const maxY = Math.max(...points.map(p => p.y));
    const scaled = points.map(p => ({ x: (p.x / maxX) * W, y: H - (p.y / maxY) * H }));
    const path = scaled.map((p, i) => `${i === 0 ? 'M' : 'L'} ${Math.round(p.x)} ${Math.round(p.y)}`).join(' ');

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ color: THEME.white, fontFamily: FONT_STACK.display, fontSize: 55, marginBottom: 40, letterSpacing: 10 }}>{title}</div>
            <svg width={W} height={H} style={{ overflow: 'visible' }}>
                <path d={path} fill="none" stroke={color} strokeWidth="12" strokeDasharray="4000" strokeDashoffset={4000 * (1 - progress)} strokeLinecap="round" />
                <path d={`${path} L ${W} ${H} L 0 ${H} Z`} fill={`${color}33`} opacity={progress * 0.4} />
            </svg>
        </div>
    );
};

const TerminalStress: React.FC<{ lines: string[] }> = ({ lines }) => {
    const frame = useCurrentFrame();
    return (
        <div style={{ width: 1100, background: '#050508', border: '1px solid #FF3333', borderRadius: 20, padding: 50, fontFamily: FONT_STACK.mono, fontSize: 24, boxShadow: '0 0 120px rgba(255,0,0,0.2)' }}>
            <div style={{ color: THEME.red, marginBottom: 30, fontWeight: 900, letterSpacing: 6 }}>[ FATAL ALERT: DEBT SPIRAL DETECTED ]</div>
            {lines.map((ln, i) => {
                const a = interpolate(frame % (PACING * 2), [i * 6, i * 6 + 3], [0, 1], { extrapolateRight: 'clamp' });
                return <div key={i} style={{ opacity: a, color: ln.includes('ERROR') || ln.includes('CRITICAL') ? THEME.red : '#77FF77', marginBottom: 10 }}>{ln}</div>;
            })}
        </div>
    );
};

// --- MAIN ENGINE ---

export const USDebtUltra: React.FC = () => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill style={{ backgroundColor: '#000' }}>
            <style>{FONT_IMPORT}</style>

            <Audio src={staticFile('debt.wav')} />
            <Audio src={staticFile('sfx/ambient.mp3')} volume={0.04} loop />

            {CHAPTERS.map((ch, i) => (
                <Sequence key={ch.id} from={ch.start} durationInFrames={ch.end - ch.start}>
                    {(() => {
                        const sIdx = Math.floor((frame - ch.start) / PACING);
                        return <Background chIndex={i} sIdx={sIdx} />;
                    })()}

                    <AbsoluteFill style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 80 }}>
                        {(() => {
                            const cFrame = frame - ch.start;
                            const sIdx = Math.floor(cFrame / PACING);
                            const tIdx = sIdx % 15; // Cycle of 15 sub-scenes to kill staticity

                            switch (ch.id) {
                                case 'intro':
                                    if (tIdx === 1) return <DataModule label="TOTAL DEBT" value="$34,621 TI" color={THEME.gold} sub="ESTIMATED TOTAL AT BROADCAST" />;
                                    if (tIdx === 2) return <DataModule label="PER SECOND" value="+$112,000" color={THEME.red} sub="IT GROWS WHILE YOU WATCH THIS" />;
                                    if (tIdx === 3) return <TerminalStress lines={["SCANNING TREASURY...", "> INCOMING DEBT: $1M / 9s", "> PROJECTED 2030: $45T", "CRITICAL: THRESHOLD EXCEEDED"]} />;
                                    if (tIdx === 4) return <DataModule label="PER CITIZEN" value="$102,964" color={THEME.white} sub="EVERY SINGLE AMERICAN HOUSEHOLD" />;
                                    if (tIdx === 5) return <KineticHeading text="IN DEBT WE TRUST" color={THEME.red} />;
                                    if (tIdx === 6) return <DataModule label="INTEREST ONLY" value="$2.4 BILLION" color={THEME.gold} sub="WE PAY THIS EVERY SINGLE DAY" />;
                                    if (tIdx === 7) return <DataModule label="THE GROWTH" value="EXPONENTIAL" color={THEME.red} sub="THERE IS NO BRAKE ON THIS TRAIN" />;
                                    if (tIdx === 8) return <TerminalStress lines={["ANALYZING BONDS...", "> RATING: AA+", "> STATUS: VOLATILE", "> DEFAULT PROBABILITY: LOW (FOR NOW)"]} />;
                                    if (tIdx === 9) return <KineticHeading text="FEDERAL RESERVE" />;
                                    if (tIdx === 10) return <DataModule label="DOLLAR VALUE" value="-96%" color={THEME.red} sub="SINCE THE FED WAS FOUNDED" />;
                                    if (tIdx === 11) return <StickFigure emotion="surprised" label="AVERAGE SAVER" />;
                                    if (tIdx === 12) return <DataModule label="DEFENSE RATIO" value="1:1" color={THEME.gold} sub="DEBT INTEREST NOW EQUALS MILITARY SPEND" />;
                                    if (tIdx === 13) return <TerminalStress lines={["SOCIAL SECURITY CHECK...", "> TRUST FUND: DEPLETING", "> YEAR: 2033", "> STATUS: INSOLVENT"]} />;
                                    if (tIdx === 14) return <KineticHeading text="THE CLIFF" color={THEME.gold} />;
                                    return <KineticHeading text={ch.title} />;

                                case 'visualize':
                                    if (tIdx === 1) return <DataModule label="100 DOLLAR BILLS" value="1,000 MILES" color={THEME.white} sub="IF STACKED VERTICALLY" />;
                                    if (tIdx === 2) return <StickFigure emotion="thinking" label="HOW BIG IS $34T?" />;
                                    if (tIdx === 3) return <DataModule label="NFL STADIUMS" value="1,200" color={THEME.blue} sub="FILLED TO THE TOP WITH CASH" />;
                                    if (tIdx === 4) return <KineticHeading text="THE MOON" color={THEME.white} />;
                                    if (tIdx === 5) return <DataModule label="DISTANCE" value="8 TRIPS" color={THEME.blue} sub="IF WE UNROLLED THE DOLLARS" />;
                                    return <KineticHeading text={ch.title} />;

                                case 'explosive':
                                    if (tIdx === 1) return <HighEndGraph title="THE HOCKEY STICK" color={THEME.red} points={[{ x: 0, y: 1 }, { x: 10, y: 1.2 }, { x: 20, y: 2 }, { x: 30, y: 6 }, { x: 40, y: 14 }, { x: 50, y: 34 }]} />;
                                    if (tIdx === 2) return <DataModule label="DOUBLING TIME" value="8 YEARS" color={THEME.gold} sub="IT IS SPEEDING UP" />;
                                    return <KineticHeading text={ch.title} />;

                                case 'trapped':
                                    if (tIdx === 1) return <DataModule label="INTEREST COST" value="$1,000,000,000,000" color={THEME.red} sub="ONE TRILLION DOLLARS PER YEAR" />;
                                    if (tIdx === 3) return <HighEndGraph title="INTEREST VS EDUCATION" color={THEME.gold} points={[{ x: 0, y: 100 }, { x: 20, y: 150 }, { x: 40, y: 400 }, { x: 60, y: 1000 }]} />;
                                    return <KineticHeading text={ch.title} />;

                                case 'endgame':
                                    if (tIdx === 1) return <TerminalStress lines={["CRASH_SIMULATION...", "DEBT: $54,000,000,000,000", "BOND_MARKET: SHUTDOWN", "SYSTEM_RESET: REQUIRED"]} />;
                                    if (tIdx === 2) return <KineticHeading text="THE RESET" color={THEME.red} />;
                                    return <DataModule label="2034" value="INSOLVENCY" color={THEME.red} sub="THE NEW AMERICAN REALITY" />;

                                default:
                                    return <KineticHeading text={ch.title} />;
                            }
                        })()}
                    </AbsoluteFill>
                </Sequence>
            ))}

            {/* Aggressive Audio Beats */}
            {frame > 0 && frame % PACING === 0 && (
                <>
                    <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.15} />
                    <Audio src={staticFile('sfx/rise.mp3')} volume={0.1} />
                </>
            )}

            {frame % 10 === 0 && Math.floor(frame / PACING) % 3 === 0 && (
                <Audio src={staticFile('sfx/pop.mp3')} volume={0.05} />
            )}

            <AbsoluteFill style={{ pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', inset: 40, border: '1px solid rgba(255,255,255,0.04)', borderRadius: 20 }} />
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
