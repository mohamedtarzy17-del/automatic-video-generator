import React from 'react';
import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
    Audio,
    staticFile,
    Video,
    Sequence,
    Easing,
} from 'remotion';
import { FONT_STACK, FONT_IMPORT, StickFigure } from './components/PremiumKit';

// --- CONFIG ---
const PACING = 30; // 1.0s visual heartbeat for ultra-aggressive retention
const TOTAL_FRAMES = 900; // Exactly 30 seconds

const C = {
    gold: '#FBBF24',
    charcoal: '#09070F',
    white: '#FFFFFF',
    red: '#EF4444',
    emerald: '#10B981',
    cyan: '#06B6D4',
    glassBg: 'rgba(15, 10, 25, 0.75)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
};

// --- DYNAMIC HELPERS ---
const DriftingCamera: React.FC<{ children: React.ReactNode; duration: number }> = ({ children, duration }) => {
    const frame = useCurrentFrame();
    const scale = interpolate(frame, [0, duration], [1.0, 1.15], { extrapolateRight: 'clamp' });
    return (
        <div style={{ 
            transform: `scale(${scale}) translate3d(0, 0, 0)`, 
            width: '100%', 
            height: '100%', 
            transformOrigin: 'center center',
            willChange: 'transform'
        }}>
            {children}
        </div>
    );
};

const KineticHeading: React.FC<{ text: string; color?: string }> = ({ text, color = C.white }) => {
    const frame = useCurrentFrame();
    const anim = spring({ frame: frame % PACING, fps: 30, config: { damping: 14, stiffness: 90 } });
    const y = Math.round(interpolate(anim, [0, 1], [60, 0]));
    const blur = interpolate(anim, [0, 1], [12, 0]);
    const scale = interpolate(anim, [0, 1], [1.08, 1.0]);

    return (
        <div style={{
            fontFamily: FONT_STACK.display,
            fontSize: 120,
            color,
            textTransform: 'uppercase',
            textAlign: 'center',
            transform: `translateY(${y}px) scale(${scale})`,
            opacity: anim,
            letterSpacing: 16,
            fontWeight: 900,
            filter: `blur(${blur}px)`,
            width: '100%',
            textShadow: '0 10px 40px rgba(0,0,0,0.9)',
        }}>
            {text}
        </div>
    );
};

const DataModule: React.FC<{ label: string; value: string; sub?: string; color: string }> = ({ label, value, sub, color }) => {
    const frame = useCurrentFrame();
    const a = spring({ frame: frame % PACING, fps: 30, config: { damping: 13, stiffness: 100 } });
    const scale = interpolate(a, [0, 1], [0.92, 1.0]);
    
    return (
        <div style={{
            background: C.glassBg,
            border: `2px solid ${color}4d`,
            borderRadius: 28,
            padding: '50px 70px',
            width: 900,
            transform: `scale(${scale}) translate3d(0, 0, 0)`,
            opacity: a,
            boxShadow: `0 30px 80px rgba(0,0,0,0.85), inset 0 0 30px ${color}0d`,
            backdropFilter: 'blur(16px)',
            textAlign: 'center',
            willChange: 'transform'
        }}>
            <div style={{ 
                color: 'rgba(255,255,255,0.4)', 
                fontSize: 22, 
                fontFamily: FONT_STACK.mono, 
                textTransform: 'uppercase', 
                letterSpacing: 6, 
                marginBottom: 16 
            }}>{label}</div>
            <div style={{ 
                color, 
                fontSize: 85, 
                fontFamily: FONT_STACK.impact, 
                fontWeight: 900, 
                lineHeight: 1.0, 
                letterSpacing: 2,
                textTransform: 'uppercase'
            }}>{value}</div>
            {sub && <div style={{ 
                color: 'white', 
                opacity: 0.65, 
                fontSize: 24, 
                marginTop: 24, 
                fontFamily: FONT_STACK.body, 
                paddingTop: 16, 
                borderTop: '1px solid rgba(255,255,255,0.1)' 
            }}>{sub}</div>}
        </div>
    );
};

const PriceTargetGauge: React.FC = () => {
    const frame = useCurrentFrame();
    
    // Smooth counting Price animation
    const price = Math.floor(interpolate(frame % 150, [0, 90], [2000, 2685], { 
        easing: Easing.out(Easing.cubic),
        extrapolateRight: 'clamp'
    }));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 48, color: C.white, fontFamily: FONT_STACK.mono, letterSpacing: 4 }}>GOLD SPOT PRICE</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, margin: '20px 0' }}>
                <div style={{ 
                    fontSize: 160, 
                    color: C.gold, 
                    fontFamily: FONT_STACK.mono, // monospaced Space Mono for zero jitter
                    fontVariantNumeric: 'tabular-nums', // tabular-nums for stable layout
                    fontWeight: 'bold',
                    textShadow: '0 0 50px rgba(251,191,36,0.6)' 
                }}>
                    ${price.toLocaleString()}
                </div>
            </div>
            {price >= 2680 && (
                <div style={{ 
                    fontSize: 32, 
                    color: C.emerald, 
                    backgroundColor: 'rgba(16,185,129,0.15)', 
                    border: `1.5px solid ${C.emerald}`,
                    padding: '12px 36px', 
                    borderRadius: 16, 
                    fontWeight: 'bold', 
                    letterSpacing: 4,
                    transform: `scale(${spring({ frame: (frame % 150) - 90, fps: 30 })})` 
                }}>
                    ALL-TIME HIGH RECORD
                </div>
            )}
        </div>
    );
};

const HighEndGraph: React.FC = () => {
    const frame = useCurrentFrame();
    const progress = interpolate(frame % 150, [0, 90], [0, 1], { extrapolateRight: 'clamp' });
    
    const W = 1000, H = 350;
    const points = [{ x: 0, y: 1900 }, { x: 10, y: 2050 }, { x: 20, y: 2200 }, { x: 30, y: 2450 }, { x: 40, y: 2685 }];
    const maxX = 40;
    const maxY = 2800;
    const scaled = points.map(p => ({ x: (p.x / maxX) * W, y: H - (p.y / maxY) * H }));
    
    const path = scaled.map((p, i) => `${i === 0 ? 'M' : 'L'} ${Math.round(p.x)} ${Math.round(p.y)}`).join(' ');

    return (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ color: C.white, fontFamily: FONT_STACK.display, fontSize: 52, marginBottom: 30, letterSpacing: 8 }}>RESERVE ACCUMULATION CURVE</div>
            <div style={{ position: 'relative', width: W, height: H, background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 20 }}>
                <svg width={W} height={H} style={{ overflow: 'visible' }}>
                    <line x1="0" y1={H/2} x2={W} y2={H/2} stroke="rgba(255,255,255,0.08)" strokeDasharray="5 5" />
                    <line x1={W/2} y1="0" x2={W/2} y2={H} stroke="rgba(255,255,255,0.08)" strokeDasharray="5 5" />
                    
                    <path d={path} fill="none" stroke={C.gold} strokeWidth="10" strokeDasharray="4000" strokeDashoffset={4000 * (1 - progress)} strokeLinecap="round" />
                    <path d={`${path} L ${W} ${H} L 0 ${H} Z`} fill={`${C.gold}1a`} opacity={progress} />
                    
                    {progress > 0.95 && (
                        <circle cx={scaled[scaled.length-1].x} cy={scaled[scaled.length-1].y} r="10" fill={C.gold} style={{ filter: `drop-shadow(0 0 10px ${C.gold})` }} />
                    )}
                </svg>
            </div>
        </div>
    );
};

const TerminalStress: React.FC = () => {
    const frame = useCurrentFrame();
    const lines = [
        "DETECTION: GLOBAL CURRENCY TURMOIL",
        "FIAT RESERVES: RAPID DEPRECIATION",
        "CENTRAL BANKS: HOARDING PHYSICAL ATOMS",
        "ALERT: GOLD TO US DOLLAR CONVERGENCE"
    ];
    return (
        <div style={{ 
            width: 1000, 
            background: '#040207', 
            border: `1.5px solid ${C.gold}`, 
            borderRadius: 24, 
            padding: 45, 
            fontFamily: FONT_STACK.mono, 
            fontSize: 22, 
            boxShadow: `0 0 100px ${C.gold}1f`,
            backdropFilter: 'blur(12px)'
        }}>
            <div style={{ color: C.gold, marginBottom: 25, fontWeight: 900, letterSpacing: 4, display: 'flex', alignItems: 'center', gap: 15 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: C.gold, animation: 'pulse 1s infinite' }} />
                [ GOLD RESEARCH TELEMETRY ]
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {lines.map((ln, i) => {
                    const a = interpolate(frame % 120, [i * 8, i * 8 + 4], [0, 1], { extrapolateRight: 'clamp' });
                    return (
                        <div key={i} style={{ 
                            opacity: a, 
                            color: ln.includes('ALERT') ? C.red : '#FFFFFF',
                            letterSpacing: 1
                        }}>
                            {`> ${ln}`}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- MAIN ENGINE ---

export const GoldResearch30s: React.FC = () => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill style={{ backgroundColor: C.charcoal, overflow: 'hidden' }}>
            <style>{FONT_IMPORT}</style>
            
            {/* Master Audio layers */}
            <Audio src={staticFile("gold_research_vo.mp3")} />
            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.04} loop />

            {/* Background Looping B-Roll with Gold Graded Filter */}
            <AbsoluteFill style={{ overflow: 'hidden' }}>
                <DriftingCamera duration={TOTAL_FRAMES}>
                    <Video 
                        src={staticFile("gold_research_bg.mp4")}
                        muted
                        loop
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'brightness(0.2) contrast(1.3) saturate(0.3)',
                        }}
                    />
                </DriftingCamera>
                <AbsoluteFill style={{
                    background: 'linear-gradient(to bottom, rgba(9,7,15,0.7) 10%, rgba(20,15,5,0.85) 90%)',
                    mixBlendMode: 'multiply'
                }} />
                <AbsoluteFill style={{
                    background: 'radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.95) 90%)'
                }} />
            </AbsoluteFill>

            {/* Cinematic Outer framing border */}
            <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 100 }}>
                <div style={{ position: 'absolute', inset: 40, border: '1.5px solid rgba(255,255,255,0.03)', borderRadius: 24 }} />
            </AbsoluteFill>

            {/* Visual modules swapping on 30-frame heartbeats */}
            <AbsoluteFill style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px 80px', zIndex: 10 }}>
                {(() => {
                    const subIdx = Math.floor(frame / PACING);
                    const tIdx = subIdx % 30; // Cuts visual modules every second (30 frames) for high retention pacing

                    switch (tIdx) {
                        case 0: return <KineticHeading text="HISTORIC RALLY" color={C.gold} />;
                        case 1: return <DataModule label="PRICE BREAKOUT" value="GOLD SPOT SURGE" color={C.gold} sub="AGGRESSIVE DEMAND SHATTERING HISTORIC RECORDS" />;
                        case 2: return <PriceTargetGauge />;
                        case 3: return <PriceTargetGauge />;
                        case 4: return <PriceTargetGauge />;
                        case 5: return <KineticHeading text="INFLATION TRIGGER" color={C.red} />;
                        case 6: return <DataModule label="SYSTEMIC RISK" value="FIAT DEVALUATION" color={C.red} sub="WORLDWIDE FIAT VALUE EROSION DRIVING ASSET ACCUMULATION" />;
                        case 7: return <TerminalStress />;
                        case 8: return <TerminalStress />;
                        case 9: return <TerminalStress />;
                        case 10: return <KineticHeading text="CENTRAL BANK HOARDING" color={C.gold} />;
                        case 11: return <DataModule label="BUYING DEMAND" value="+1,037 METRIC TONS" color={C.cyan} sub="LEAD BY GLOBAL EASTERN POWERS DIVERSIFYING AWAY FROM USD" />;
                        case 12: return <HighEndGraph />;
                        case 13: return <HighEndGraph />;
                        case 14: return <HighEndGraph />;
                        case 15: return <KineticHeading text="THE SAFE HAVEN" color={C.gold} />;
                        case 16: return <DataModule label="ASSET TRUST" value="ZERO LIABILITIES" color={C.gold} sub="PHYSICAL GOLD STANDS WHEN VIRTUAL PROMISES DISSOLVE" />;
                        case 17: return <PriceTargetGauge />;
                        case 18: return <PriceTargetGauge />;
                        case 19: return <PriceTargetGauge />;
                        case 20: return <KineticHeading text="ATOMS OVER BITS" color={C.cyan} />;
                        case 21: return <DataModule label="THE GOLD RUSH" value="FINITE VALUE" color={C.emerald} sub="IN AN ERA OF DIGITAL METRICS, GOLD RECLAIMS THE THRONE" />;
                        case 22: return <HighEndGraph />;
                        case 23: return <HighEndGraph />;
                        case 24: return <TerminalStress />;
                        case 25: return <KineticHeading text="THE GOLD RUSH" color={C.gold} />;
                        case 26: return <DataModule label="GOLD PRICE ALERT" value="TIME IS TICKING" color={C.gold} sub="SECURE YOUR ASSETS OUTSIDE THE FRAGILE BANKING GRID" />;
                        case 27: return <StickFigure emotion="celebrating" color={C.gold} size={260} label="SECURE ASSET" />;
                        case 28: return <StickFigure emotion="excited" color={C.gold} size={260} label="SECURE ASSET" />;
                        default: return <KineticHeading text="SUBSCRIBE NOW" color={C.gold} />;
                    }
                })()}
            </AbsoluteFill>

            {/* Aggressive heartbeat sound effects */}
            {frame > 0 && frame % PACING === 0 && (
                <>
                    <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.14} />
                    <Audio src={staticFile('sfx/rise.mp3')} volume={0.08} />
                </>
            )}

            {frame % 10 === 0 && Math.floor(frame / PACING) % 3 === 0 && (
                <Audio src={staticFile('sfx/pop.mp3')} volume={0.04} />
            )}
        </AbsoluteFill>
    );
};
