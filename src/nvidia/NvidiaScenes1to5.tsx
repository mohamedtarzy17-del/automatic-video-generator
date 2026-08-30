import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Sequence } from 'remotion';
import {
    NVIDIA_COLORS, CinematicTitle, Subtitle, HandheldCamera, PopBlock,
    GrainOverlay, Vignette, ScanLine, GridBackground, FloatingOrbs,
    AnimatedGraph, CountUp, LowerThird,
} from './NvidiaTheme';
import { AIChip, ServerRack, OilBarrel, WorldMap, ChessMetaphor } from './NvidiaVisuals';

// =============================================
// SCENE 1: OPENING (0:00 – 0:20) — 600 frames
// =============================================
export const Scene01_Opening: React.FC = () => {
    const frame = useCurrentFrame();

    // Sunrise push-in
    const pushIn = interpolate(frame, [0, 300], [1, 1.15], { extrapolateRight: 'clamp' });
    // Glitch trigger at ~frame 350
    const isGlitch = frame > 350 && frame < 380;
    const glitchOffset = isGlitch ? Math.sin(frame * 7.3) * 20 : 0;
    const postGlitch = frame >= 380;

    // Confetti particles
    const confettiParticles = [...Array(40)].map((_, i) => ({
        x: (i * 137.5) % 1920,
        y: interpolate(frame, [100, 350], [-50, 1200 + (i % 5) * 100], { extrapolateRight: 'clamp' }),
        color: i % 3 === 0 ? NVIDIA_COLORS.green : i % 3 === 1 ? NVIDIA_COLORS.gold : '#ffffff',
        size: 4 + (i % 4) * 3,
        rotation: frame * (2 + i % 5),
    }));

    // Market cap counter dissolving
    const dissolveOpacity = postGlitch ? interpolate(frame, [380, 450], [1, 0], { extrapolateRight: 'clamp' }) : 1;

    return (
        <AbsoluteFill style={{ backgroundColor: NVIDIA_COLORS.darkBg, overflow: 'hidden' }}>
            <HandheldCamera intensity={isGlitch ? 3 : 0.3}>
                {/* Phase 1: Sunrise skyline */}
                <div style={{ transform: `scale(${pushIn})`, width: '100%', height: '100%', position: 'absolute' }}>
                    {/* Sunrise gradient */}
                    <div style={{
                        position: 'absolute', bottom: 0, width: '100%', height: '60%',
                        background: frame < 350
                            ? `linear-gradient(to top, ${NVIDIA_COLORS.green}22, ${NVIDIA_COLORS.gold}11, transparent)`
                            : `linear-gradient(to top, ${NVIDIA_COLORS.red}33, ${NVIDIA_COLORS.redDeep}11, transparent)`,
                        transition: 'background 0.3s',
                    }} />

                    {/* Stylized skyline */}
                    <svg width="1920" height="600" viewBox="0 0 1920 600" style={{ position: 'absolute', bottom: 0 }}>
                        {[
                            { x: 100, w: 80, h: 300 }, { x: 250, w: 60, h: 400 }, { x: 400, w: 100, h: 350 },
                            { x: 580, w: 70, h: 280 }, { x: 700, w: 120, h: 450 }, { x: 880, w: 90, h: 380 },
                            { x: 1020, w: 110, h: 500 }, { x: 1200, w: 80, h: 320 }, { x: 1350, w: 100, h: 420 },
                            { x: 1500, w: 70, h: 360 }, { x: 1620, w: 90, h: 440 }, { x: 1770, w: 60, h: 300 },
                        ].map((b, i) => (
                            <React.Fragment key={i}>
                                <rect x={b.x} y={600 - b.h} width={b.w} height={b.h} fill="#0a0e1a" stroke={`${postGlitch ? NVIDIA_COLORS.red : NVIDIA_COLORS.green}22`} strokeWidth="1" />
                                {/* Windows */}
                                {[...Array(Math.floor(b.h / 30))].map((_, j) => (
                                    <rect key={j} x={b.x + 10 + (j % 3) * 20} y={600 - b.h + 15 + j * 30} width={8} height={12}
                                        fill={Math.sin(frame * 0.05 + i + j) > 0 ? (postGlitch ? NVIDIA_COLORS.red : NVIDIA_COLORS.gold) : '#111'}
                                        opacity={0.4 + Math.sin(frame * 0.03 + j) * 0.3} />
                                ))}
                            </React.Fragment>
                        ))}
                    </svg>

                    <FloatingOrbs color={postGlitch ? NVIDIA_COLORS.red : NVIDIA_COLORS.green} count={3} />
                </div>

                {/* Earnings board */}
                {frame < 380 && (
                    <div style={{
                        position: 'absolute', top: 120, left: '50%', transform: `translateX(-50%) translateX(${glitchOffset}px)`,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
                    }}>
                        <PopBlock delay={30}>
                            <div style={{
                                background: 'rgba(0,0,0,0.7)', border: `2px solid ${NVIDIA_COLORS.green}44`,
                                borderRadius: 16, padding: '40px 80px', backdropFilter: 'blur(20px)',
                            }}>
                                <div style={{ fontFamily: 'Inter', fontSize: 28, color: NVIDIA_COLORS.gray, textTransform: 'uppercase', letterSpacing: 4, marginBottom: 20, textAlign: 'center' }}>
                                    NVIDIA Q4 EARNINGS
                                </div>
                                <CountUp target={3504} prefix="$" suffix="B" color={NVIDIA_COLORS.green} size={90} delay={60} duration={80} />
                                <div style={{ fontFamily: 'SpaceGrotesk', fontSize: 32, color: NVIDIA_COLORS.green, textAlign: 'center', marginTop: 10 }}>
                                    ▲ RECORD REVENUE
                                </div>
                            </div>
                        </PopBlock>
                    </div>
                )}

                {/* Confetti (before glitch) */}
                {frame > 100 && frame < 360 && confettiParticles.map((p, i) => (
                    <div key={i} style={{
                        position: 'absolute', left: p.x, top: p.y,
                        width: p.size, height: p.size * 2, backgroundColor: p.color,
                        transform: `rotate(${p.rotation}deg)`, opacity: 0.7,
                    }} />
                ))}

                {/* GLITCH TRANSITION */}
                {isGlitch && (
                    <AbsoluteFill style={{
                        background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${NVIDIA_COLORS.red}33 2px, ${NVIDIA_COLORS.red}33 4px)`,
                        mixBlendMode: 'screen', opacity: 0.8,
                    }} />
                )}

                {/* Post-glitch: RED CRASH */}
                {postGlitch && (
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)', textAlign: 'center', opacity: dissolveOpacity,
                    }}>
                        <CinematicTitle text="-5.5%" color={NVIDIA_COLORS.red} fontFamily="Orbitron" size={220} delay={0} position="relative" />
                        <div style={{ fontFamily: 'SpaceGrotesk', fontSize: 48, color: NVIDIA_COLORS.red, opacity: 0.8, marginTop: 20 }}>
                            ▼ STOCK CRASH
                        </div>
                    </div>
                )}

                {/* Dissolving particles */}
                {frame > 420 && [...Array(60)].map((_, i) => {
                    const prog = (frame - 420) / 60;
                    return (
                        <div key={i} style={{
                            position: 'absolute',
                            left: 960 + Math.cos(i * 0.5) * prog * 400,
                            top: 540 + Math.sin(i * 0.7) * prog * 300,
                            width: 4, height: 4, backgroundColor: NVIDIA_COLORS.red,
                            opacity: Math.max(0, 1 - prog), borderRadius: '50%',
                        }} />
                    );
                })}

                {/* Final: Market Cap evaporating */}
                {frame > 460 && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <CinematicTitle text="$87B MARKET CAP GONE" color={NVIDIA_COLORS.red} fontFamily="BebasNeue" size={100}
                            delay={0} position="relative" />
                    </div>
                )}
            </HandheldCamera>

            <LowerThird label="NVIDIA CORP" value="NASDAQ: NVDA" color={NVIDIA_COLORS.green} delay={40} />
            <Vignette />
            <ScanLine color={postGlitch ? NVIDIA_COLORS.red : NVIDIA_COLORS.green} />
            <GrainOverlay />
        </AbsoluteFill>
    );
};

// =============================================
// SCENE 2: GLOBAL IMPACT (0:20 – 0:40) — 600 frames
// =============================================
export const Scene02_GlobalImpact: React.FC = () => {
    const frame = useCurrentFrame();

    const zoomOut = interpolate(frame, [0, 120], [1.5, 1], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ backgroundColor: NVIDIA_COLORS.navyDeep, overflow: 'hidden' }}>
            <HandheldCamera intensity={0.5}>
                <GridBackground color={NVIDIA_COLORS.red} speed={0.5} />
                <FloatingOrbs color={NVIDIA_COLORS.red} count={3} />

                {/* World map with ripple */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: `translate(-50%, -50%) scale(${zoomOut})`,
                }}>
                    <WorldMap delay={10} />
                </div>

                {/* Stock exchange labels lighting up red */}
                {[
                    { label: 'NASDAQ', x: 250, y: 300, d: 60 }, { label: 'NYSE', x: 350, y: 380, d: 70 },
                    { label: 'NIKKEI', x: 1300, y: 280, d: 90 }, { label: 'KOSPI', x: 1250, y: 340, d: 100 },
                    { label: 'FTSE', x: 780, y: 250, d: 110 },
                ].map((ex, i) => (
                    <PopBlock key={i} delay={ex.d} style={{ position: 'absolute', left: ex.x, top: ex.y }}>
                        <div style={{
                            fontFamily: 'Orbitron', fontSize: 22, color: NVIDIA_COLORS.red,
                            background: 'rgba(255,20,20,0.1)', border: `1px solid ${NVIDIA_COLORS.red}44`,
                            padding: '8px 16px', borderRadius: 8, textShadow: `0 0 15px ${NVIDIA_COLORS.red}`,
                        }}>
                            {ex.label} ▼
                        </div>
                    </PopBlock>
                ))}

                {/* Kinetic Typography */}
                <Sequence from={300}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{
                            background: 'rgba(0,0,0,0.85)', padding: '40px 100px', borderRadius: 8,
                            border: `2px solid ${NVIDIA_COLORS.red}66`,
                        }}>
                            <CinematicTitle text="THE NVIDIA PARADOX" fontFamily="BebasNeue" size={160}
                                color={NVIDIA_COLORS.red} position="relative" delay={10} letterSpacing={-4} />
                        </div>
                    </AbsoluteFill>
                </Sequence>
            </HandheldCamera>

            <LowerThird label="GLOBAL MARKETS" value="SYNCHRONIZED SELLOFF" color={NVIDIA_COLORS.red} delay={20} />
            <Vignette intensity={0.9} />
            <GrainOverlay />
        </AbsoluteFill>
    );
};

// =============================================
// SCENE 3: SUCCESS PHASE (0:40 – 1:20) — 1200 frames
// =============================================
export const Scene03_SuccessPhase: React.FC = () => {
    const frame = useCurrentFrame();
    useVideoConfig();

    const revenueData = [15, 18, 20, 22, 28, 35, 42, 55, 65, 72, 78, 85, 92, 95, 98];
    const rocketY = interpolate(frame, [800, 1100], [600, -100], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ backgroundColor: NVIDIA_COLORS.navyDeep, overflow: 'hidden' }}>
            <HandheldCamera intensity={0.3}>
                <GridBackground color={NVIDIA_COLORS.green} speed={0.8} />
                <FloatingOrbs color={NVIDIA_COLORS.green} count={4} />

                {/* Phase A: Revenue Growth Graph (0-400) */}
                <Sequence durationInFrames={400}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 40 }}>
                        <CinematicTitle text="HISTORIC REVENUE GROWTH" fontFamily="Montserrat" size={72}
                            gradient={`linear-gradient(90deg, ${NVIDIA_COLORS.green}, ${NVIDIA_COLORS.gold})`}
                            position="relative" delay={10} />
                        <AnimatedGraph points={revenueData} color={NVIDIA_COLORS.green} width={900} height={350} delay={30} />
                        <div style={{ display: 'flex', gap: 60, marginTop: 20 }}>
                            {[{ l: 'Revenue', v: '$30.04B', c: NVIDIA_COLORS.green }, { l: 'Growth', v: '+262%', c: NVIDIA_COLORS.gold }, { l: 'Beat Est.', v: '+4.2%', c: NVIDIA_COLORS.cyan }].map((s, i) => (
                                <PopBlock key={i} delay={60 + i * 20}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontFamily: 'Inter', fontSize: 20, color: NVIDIA_COLORS.gray, textTransform: 'uppercase', letterSpacing: 2 }}>{s.l}</div>
                                        <div style={{ fontFamily: 'Orbitron', fontSize: 44, color: s.c, fontWeight: 700 }}>{s.v}</div>
                                    </div>
                                </PopBlock>
                            ))}
                        </div>
                    </AbsoluteFill>
                </Sequence>

                {/* Phase B: AI Data Centers (400-700) */}
                <Sequence from={400} durationInFrames={300}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', gap: 50 }}>
                        <CinematicTitle text="AI DATA CENTERS" fontFamily="Orbitron" size={80} color={NVIDIA_COLORS.cyan} position="relative" delay={10} />
                        <div style={{ display: 'flex', gap: 30, alignItems: 'flex-end' }}>
                            {[0, 1, 2, 3, 4].map(i => <ServerRack key={i} delay={20 + i * 15} color={NVIDIA_COLORS.green} />)}
                        </div>
                    </AbsoluteFill>
                </Sequence>

                {/* Phase C: Chip + Oil Barrel (700-950) */}
                <Sequence from={700} durationInFrames={250}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: 100, alignItems: 'center' }}>
                            <PopBlock delay={10}>
                                <AIChip size={350} color={NVIDIA_COLORS.green} rotate delay={10} />
                            </PopBlock>
                            <PopBlock delay={40}>
                                <div style={{ fontFamily: 'BebasNeue', fontSize: 120, color: NVIDIA_COLORS.gold, opacity: 0.3 }}>→</div>
                            </PopBlock>
                            <PopBlock delay={60}>
                                <OilBarrel delay={60} />
                            </PopBlock>
                        </div>
                        <CinematicTitle text='"THE OIL OF AI"' fontFamily="Montserrat" size={64}
                            color={NVIDIA_COLORS.gold} yOffset={280} delay={80} />
                    </AbsoluteFill>
                </Sequence>

                {/* Phase D: 75% Margin + Rocket (950-1200) */}
                <Sequence from={950} durationInFrames={250}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <CountUp target={75} suffix="%" color={NVIDIA_COLORS.gold} size={180} delay={10} duration={60} />
                        <Subtitle text="GROSS MARGIN" color={NVIDIA_COLORS.gold} delay={30} yOffset={120} size={48} />
                        {/* Rocket */}
                        <div style={{ position: 'absolute', left: '75%', top: rocketY }}>
                            <svg width={80} height={160} viewBox="0 0 40 80" style={{ filter: `drop-shadow(0 0 20px ${NVIDIA_COLORS.green})` }}>
                                <polygon points="20,0 30,30 10,30" fill={NVIDIA_COLORS.green} />
                                <rect x="12" y="30" width="16" height="30" fill="#1a1a2e" stroke={NVIDIA_COLORS.green} strokeWidth="1" />
                                <polygon points="10,60 20,80 30,60" fill={NVIDIA_COLORS.gold} opacity={0.8 + Math.sin(frame * 0.3) * 0.2} />
                                <text x="20" y="50" textAnchor="middle" fill="white" fontSize="6" fontFamily="Orbitron">HYPER</text>
                            </svg>
                        </div>
                    </AbsoluteFill>
                </Sequence>
            </HandheldCamera>

            <Vignette />
            <ScanLine color={NVIDIA_COLORS.green} />
            <GrainOverlay />
        </AbsoluteFill>
    );
};

// =============================================
// SCENE 4: EXPECTATION SHIFT (1:20 – 1:55) — 1050 frames
// =============================================
export const Scene04_ExpectationShift: React.FC = () => {
    const frame = useCurrentFrame();

    // Wall Street building stretching
    const buildingHeight = interpolate(frame, [0, 300], [400, 700], { extrapolateRight: 'clamp' });
    // Growth curve flattening
    const growthPoints = [20, 30, 42, 55, 68, 78, 85, 89, 91, 92, 92.5, 92.8, 93];

    return (
        <AbsoluteFill style={{ backgroundColor: NVIDIA_COLORS.navyDeep, overflow: 'hidden' }}>
            <HandheldCamera intensity={0.4}>
                <GridBackground color={NVIDIA_COLORS.gold} speed={0.5} />
                <FloatingOrbs color={NVIDIA_COLORS.gold} count={3} />

                {/* Phase A: Wall Street Tower (0-350) */}
                <Sequence durationInFrames={350}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <svg width={300} height={buildingHeight} viewBox={`0 0 100 ${buildingHeight / 3}`}
                            style={{ filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.2))' }}>
                            <rect x="20" y="0" width="60" height={buildingHeight / 3} fill="#0a0e1a" stroke={NVIDIA_COLORS.gold} strokeWidth="1.5" />
                            {[...Array(Math.floor(buildingHeight / 60))].map((_, i) => (
                                <rect key={i} x="30" y={10 + i * 20} width="40" height="8" fill={NVIDIA_COLORS.gold} opacity={0.15} rx="1" />
                            ))}
                        </svg>
                        <CinematicTitle text="EXPECTATIONS" fontFamily="BebasNeue" size={120}
                            color={NVIDIA_COLORS.gold} yOffset={-420} delay={20} />
                    </AbsoluteFill>
                </Sequence>

                {/* Phase B: Priced to Perfection (350-550) */}
                <Sequence from={350} durationInFrames={200}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <CinematicTitle text="PRICED TO PERFECTION" fontFamily="Orbitron" size={100}
                            gradient={`linear-gradient(90deg, ${NVIDIA_COLORS.gold}, white, ${NVIDIA_COLORS.gold})`}
                            position="relative" delay={10} />
                    </AbsoluteFill>
                </Sequence>

                {/* Phase C: Two lines - Analyst vs Whisper (550-800) */}
                <Sequence from={550} durationInFrames={250}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 30 }}>
                        <AnimatedGraph points={[20, 30, 40, 50, 60, 70, 80, 85, 88, 90]} color={NVIDIA_COLORS.cyan} width={800} height={250} delay={10} />
                        <AnimatedGraph points={[25, 38, 52, 65, 78, 88, 95, 98, 99, 100]} color={NVIDIA_COLORS.gold} width={800} height={250} delay={20} />
                        <div style={{ display: 'flex', gap: 80, marginTop: 10 }}>
                            <PopBlock delay={40}><div style={{ fontFamily: 'Inter', fontSize: 28, color: NVIDIA_COLORS.cyan }}>● Analyst Estimate</div></PopBlock>
                            <PopBlock delay={50}><div style={{ fontFamily: 'Inter', fontSize: 28, color: NVIDIA_COLORS.gold }}>● Whisper Number</div></PopBlock>
                        </div>
                    </AbsoluteFill>
                </Sequence>

                {/* Phase D: Growth flattening + EXIT buttons (800-1050) */}
                <Sequence from={800} durationInFrames={250}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 40 }}>
                        <AnimatedGraph points={growthPoints} color={NVIDIA_COLORS.gold} width={800} height={250} delay={0} />
                        <Subtitle text="GROWTH DECELERATION" color={NVIDIA_COLORS.gold} delay={30} yOffset={200} />
                        {/* EXIT buttons */}
                        <div style={{ display: 'flex', gap: 40, position: 'absolute', bottom: 150 }}>
                            {[0, 1, 2, 3].map(i => (
                                <PopBlock key={i} delay={100 + i * 20}>
                                    <div style={{
                                        fontFamily: 'Orbitron', fontSize: 28, color: 'white', fontWeight: 700,
                                        background: NVIDIA_COLORS.red, padding: '16px 32px', borderRadius: 8,
                                        boxShadow: `0 0 30px ${NVIDIA_COLORS.red}88`,
                                    }}>EXIT</div>
                                </PopBlock>
                            ))}
                        </div>
                    </AbsoluteFill>
                </Sequence>
            </HandheldCamera>

            <LowerThird label="WALL STREET" value="EXPECTATIONS VS REALITY" color={NVIDIA_COLORS.gold} delay={30} />
            <Vignette />
            <GrainOverlay />
        </AbsoluteFill>
    );
};

// =============================================
// SCENE 5: BLACKWELL & COMPETITION (1:55 – 2:20) — 750 frames
// =============================================
export const Scene05_BlackwellCompetition: React.FC = () => {
    const frame = useCurrentFrame();
    useVideoConfig();

    const flicker = Math.sin(frame * 0.15) > 0.7;
    // Calendar pages
    const calPage = Math.floor(interpolate(frame, [300, 500], [0, 6], { extrapolateRight: 'clamp' }));

    return (
        <AbsoluteFill style={{ backgroundColor: '#050510', overflow: 'hidden' }}>
            <HandheldCamera intensity={0.4}>
                <GridBackground color={NVIDIA_COLORS.purple} speed={0.6} />
                <FloatingOrbs color={NVIDIA_COLORS.purple} count={3} />

                {/* Phase A: Next-gen chip blueprint (0-350) */}
                <Sequence durationInFrames={350}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 40 }}>
                        <AIChip size={400} color={flicker ? NVIDIA_COLORS.red : NVIDIA_COLORS.cyan} delay={10} blueprint />
                        <CinematicTitle text="BLACKWELL ARCHITECTURE" fontFamily="Orbitron" size={64}
                            color={NVIDIA_COLORS.cyan} position="relative" delay={20} />
                        {/* Caution flicker */}
                        {flicker && (
                            <PopBlock delay={0}>
                                <div style={{
                                    fontFamily: 'Orbitron', fontSize: 36, color: NVIDIA_COLORS.gold,
                                    border: `2px solid ${NVIDIA_COLORS.gold}`, padding: '12px 24px', borderRadius: 8,
                                }}>⚠ PRODUCTION CONCERNS</div>
                            </PopBlock>
                        )}
                    </AbsoluteFill>
                </Sequence>

                {/* Phase B: Calendar delay (350-500) */}
                <Sequence from={350} durationInFrames={150}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 30 }}>
                        <PopBlock delay={10}>
                            <div style={{
                                background: 'rgba(255,255,255,0.05)', border: '1px solid #333',
                                borderRadius: 12, padding: '40px 60px', textAlign: 'center',
                            }}>
                                <div style={{ fontFamily: 'Orbitron', fontSize: 60, color: 'white' }}>Q{calPage + 1} 2025</div>
                                <div style={{ fontFamily: 'BebasNeue', fontSize: 80, color: NVIDIA_COLORS.red, marginTop: 20 }}>DELAY?</div>
                            </div>
                        </PopBlock>
                    </AbsoluteFill>
                </Sequence>

                {/* Phase C: Chessboard (500-750) */}
                <Sequence from={500} durationInFrames={250}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 40 }}>
                        <ChessMetaphor delay={10} />
                        <CinematicTitle text="COMPETITION ADVANCES" fontFamily="Montserrat" size={60}
                            color={NVIDIA_COLORS.red} position="relative" delay={40} />
                        {/* Tension pulse lines */}
                        <div style={{ position: 'absolute', bottom: 100, width: '80%', height: 3 }}>
                            {[...Array(20)].map((_, i) => (
                                <div key={i} style={{
                                    position: 'absolute', left: `${i * 5}%`, width: '4%',
                                    height: 2 + Math.sin(frame * 0.2 + i) * 8,
                                    backgroundColor: NVIDIA_COLORS.red, opacity: 0.4 + Math.sin(frame * 0.1 + i) * 0.3,
                                    bottom: 0,
                                }} />
                            ))}
                        </div>
                    </AbsoluteFill>
                </Sequence>
            </HandheldCamera>

            <LowerThird label="NEXT-GEN" value="BLACKWELL GPU ARCHITECTURE" color={NVIDIA_COLORS.purple} delay={20} />
            <Vignette />
            <ScanLine color={NVIDIA_COLORS.purple} />
            <GrainOverlay />
        </AbsoluteFill>
    );
};
