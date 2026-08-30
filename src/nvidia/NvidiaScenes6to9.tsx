import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Sequence } from 'remotion';
import {
    NVIDIA_COLORS, CinematicTitle, Subtitle, HandheldCamera, PopBlock,
    GrainOverlay, Vignette, ScanLine, GridBackground, FloatingOrbs,
    AnimatedGraph, LowerThird,
} from './NvidiaTheme';
import { AIChip, PieChart, EnginePiston, BalanceScale, FinancialBubble, ForkedRoad, PokerChip } from './NvidiaVisuals';

// =============================================
// SCENE 6: MARKET CONCENTRATION (2:20 – 2:45) — 750 frames
// =============================================
export const Scene06_MarketConcentration: React.FC = () => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill style={{ backgroundColor: '#040812', overflow: 'hidden' }}>
            <HandheldCamera intensity={0.4}>
                <GridBackground color={NVIDIA_COLORS.cyan} speed={0.5} />
                <FloatingOrbs color={NVIDIA_COLORS.cyan} count={3} />

                {/* Phase A: S&P 500 engine (0-350) */}
                <Sequence durationInFrames={350}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 40 }}>
                        <CinematicTitle text="THE S&P 500 ENGINE" fontFamily="Orbitron" size={80}
                            color={NVIDIA_COLORS.cyan} position="relative" delay={10} />
                        <EnginePiston delay={20} stuttering />
                        <Subtitle text="POWERED BY ONE CHIP" color={NVIDIA_COLORS.gray} delay={40} yOffset={250} size={36} />
                    </AbsoluteFill>
                </Sequence>

                {/* Phase B: Concentration pie chart (350-550) */}
                <Sequence from={350} durationInFrames={200}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 40 }}>
                        <CinematicTitle text="CONCENTRATION RISK" fontFamily="Montserrat" size={72}
                            color={NVIDIA_COLORS.red} position="relative" delay={10} />
                        <PieChart dominantSlice={0.35} color={NVIDIA_COLORS.green} delay={20} />
                        <Subtitle text="TOP 7 STOCKS = 35% OF S&P 500" color={NVIDIA_COLORS.gold} delay={40} yOffset={280} />
                    </AbsoluteFill>
                </Sequence>

                {/* Phase C: Liquidity vault (550-750) */}
                <Sequence from={550} durationInFrames={200}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 30 }}>
                        <PopBlock delay={10}>
                            <svg width={300} height={280} viewBox="0 0 120 110" style={{ filter: 'drop-shadow(0 0 25px rgba(255,215,0,0.3))' }}>
                                {/* Vault door */}
                                <rect x="10" y="10" width="100" height="90" rx="8" fill="#0a0a15" stroke={NVIDIA_COLORS.gold} strokeWidth="2" />
                                <circle cx="60" cy="55" r="20" fill="none" stroke={NVIDIA_COLORS.gold} strokeWidth="2" />
                                <circle cx="60" cy="55" r="3" fill={NVIDIA_COLORS.gold} />
                                <line x1="60" y1="35" x2="60" y2="42" stroke={NVIDIA_COLORS.gold} strokeWidth="2" />
                                <text x="60" y="100" textAnchor="middle" fill={NVIDIA_COLORS.gold} fontSize="8" fontFamily="Orbitron">LIQUIDITY</text>
                            </svg>
                        </PopBlock>
                        {/* Certificates flying out */}
                        {[...Array(8)].map((_, i) => {
                            const prog = interpolate(Math.max(0, frame - 550 - 30), [0, 120], [0, 1], { extrapolateRight: 'clamp' });
                            return (
                                <div key={i} style={{
                                    position: 'absolute',
                                    left: 960 + Math.cos(i * Math.PI / 4) * prog * 500,
                                    top: 400 + Math.sin(i * Math.PI / 4) * prog * 300,
                                    width: 60, height: 40, background: 'rgba(255,215,0,0.15)',
                                    border: `1px solid ${NVIDIA_COLORS.gold}44`, borderRadius: 4,
                                    opacity: Math.max(0, 1 - prog * 1.5),
                                    transform: `rotate(${i * 45 + prog * 180}deg)`,
                                    fontFamily: 'monospace', fontSize: 8, color: NVIDIA_COLORS.gold,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>NVDA</div>
                            );
                        })}
                        <CinematicTitle text="HEDGE FUND PIGGY BANK" fontFamily="BebasNeue" size={90}
                            color={NVIDIA_COLORS.gold} yOffset={300} delay={40} />
                    </AbsoluteFill>
                </Sequence>
            </HandheldCamera>

            <LowerThird label="MARKET RISK" value="INDEX CONCENTRATION AT HISTORIC HIGHS" color={NVIDIA_COLORS.cyan} delay={20} />
            <Vignette />
            <GrainOverlay />
        </AbsoluteFill>
    );
};

// =============================================
// SCENE 7: HISTORICAL PARALLEL (2:45 – 3:15) — 900 frames
// =============================================
export const Scene07_HistoricalParallel: React.FC = () => {
    const frame = useCurrentFrame();
    useVideoConfig();

    const retroStatic = frame < 30;
    const dotcomBubble = [20, 25, 32, 40, 52, 68, 82, 95, 100, 95, 60, 30, 15, 10, 8, 10, 12, 15, 20, 28, 35];
    const aiBoom = [15, 20, 28, 38, 50, 62, 75, 85, 92, 97, 100];

    return (
        <AbsoluteFill style={{ backgroundColor: '#080808', overflow: 'hidden' }}>
            <HandheldCamera intensity={0.3}>
                {/* Retro static transition */}
                {retroStatic && (
                    <AbsoluteFill style={{
                        background: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px)`,
                        opacity: 0.8,
                    }}>
                        {[...Array(100)].map((_, i) => (
                            <div key={i} style={{
                                position: 'absolute', width: ((i * 7 + 3) % 40) + 5, height: 2,
                                backgroundColor: `rgba(255,255,255,${((i * 13 + 7) % 30) / 100})`,
                                left: `${(i * 17 + 11) % 100}%`, top: `${(i * 23 + 5) % 100}%`,
                            }} />
                        ))}
                    </AbsoluteFill>
                )}

                <FloatingOrbs color={NVIDIA_COLORS.pink} count={2} />

                {/* Phase A: Year 2000 (30-400) */}
                <Sequence from={30} durationInFrames={370}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 30 }}>
                        <CinematicTitle text="YEAR 2000" fontFamily="Orbitron" size={140}
                            color={NVIDIA_COLORS.gold} position="relative" delay={10} />
                        <AnimatedGraph points={dotcomBubble} color={NVIDIA_COLORS.pink} width={900} height={300} delay={20} />
                        <Subtitle text="THE DOT-COM BUBBLE" color={NVIDIA_COLORS.pink} delay={40} yOffset={250} size={40} />
                    </AbsoluteFill>
                </Sequence>

                {/* Phase B: Crash with cracking (400-600) */}
                <Sequence from={400} durationInFrames={200}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <CinematicTitle text="THE CRASH" fontFamily="BebasNeue" size={200}
                            color={NVIDIA_COLORS.red} position="relative" delay={10} />
                        {/* Crack lines */}
                        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, opacity: interpolate(Math.max(0, frame - 430), [0, 60], [0, 0.6], { extrapolateRight: 'clamp' }) }}>
                            <path d="M 960 540 L 850 400 L 780 300 L 700 200" stroke={NVIDIA_COLORS.red} strokeWidth="3" fill="none" />
                            <path d="M 960 540 L 1050 380 L 1150 250" stroke={NVIDIA_COLORS.red} strokeWidth="2" fill="none" />
                            <path d="M 960 540 L 900 650 L 820 780" stroke={NVIDIA_COLORS.red} strokeWidth="2" fill="none" />
                            <path d="M 960 540 L 1080 600 L 1200 700" stroke={NVIDIA_COLORS.red} strokeWidth="2" fill="none" />
                        </svg>
                    </AbsoluteFill>
                </Sequence>

                {/* Phase C: Slow recovery calendar (600-700) */}
                <Sequence from={600} durationInFrames={100}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: 30 }}>
                            {['2000', '2005', '2010', '2015'].map((year, i) => (
                                <PopBlock key={i} delay={i * 15}>
                                    <div style={{
                                        fontFamily: 'Orbitron', fontSize: 48, color: i === 0 ? NVIDIA_COLORS.red : NVIDIA_COLORS.gray,
                                        background: 'rgba(255,255,255,0.03)', padding: '20px 30px', borderRadius: 8,
                                        border: `1px solid ${i === 0 ? NVIDIA_COLORS.red : '#333'}33`,
                                    }}>{year}</div>
                                </PopBlock>
                            ))}
                        </div>
                        <Subtitle text="15 YEARS TO RECOVER" color={NVIDIA_COLORS.red} delay={60} yOffset={120} size={44} />
                    </AbsoluteFill>
                </Sequence>

                {/* Phase D: Split screen comparison (700-900) */}
                <Sequence from={700} durationInFrames={200}>
                    <AbsoluteFill style={{ display: 'flex', flexDirection: 'row' }}>
                        {/* Left: 2000 */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRight: '2px solid #333', gap: 20 }}>
                            <CinematicTitle text="DOT-COM 2000" fontFamily="Orbitron" size={48} color={NVIDIA_COLORS.pink} position="relative" delay={10} />
                            <AnimatedGraph points={dotcomBubble.slice(0, 10)} color={NVIDIA_COLORS.pink} width={400} height={200} delay={20} />
                        </div>
                        {/* Right: Now */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
                            <CinematicTitle text="AI BOOM 2024" fontFamily="Orbitron" size={48} color={NVIDIA_COLORS.green} position="relative" delay={20} />
                            <AnimatedGraph points={aiBoom} color={NVIDIA_COLORS.green} width={400} height={200} delay={30} />
                        </div>
                    </AbsoluteFill>
                </Sequence>
            </HandheldCamera>

            <LowerThird label="HISTORY" value="CISCO SYSTEMS vs NVIDIA" color={NVIDIA_COLORS.pink} delay={40} />
            <Vignette />
            <GrainOverlay />
        </AbsoluteFill>
    );
};

// =============================================
// SCENE 8: BUBBLE QUESTION (3:15 – 3:40) — 750 frames
// =============================================
export const Scene08_BubbleQuestion: React.FC = () => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill style={{ backgroundColor: '#050510', overflow: 'hidden' }}>
            <HandheldCamera intensity={0.3}>
                <FloatingOrbs color={NVIDIA_COLORS.red} count={4} />

                {/* Phase A: Bubble forming (0-300) */}
                <Sequence durationInFrames={300}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 30 }}>
                        <FinancialBubble delay={10} />
                        <CinematicTitle text="ARE WE IN A BUBBLE?" fontFamily="BebasNeue" size={120}
                            color={NVIDIA_COLORS.pink} position="relative" delay={30} />
                    </AbsoluteFill>
                </Sequence>

                {/* Phase B: Balance scale (300-500) */}
                <Sequence from={300} durationInFrames={200}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 40 }}>
                        <BalanceScale leftLabel="TECHNOLOGY" rightLabel="VALUATION" tilt={15} delay={10} />
                        <CinematicTitle text="TECHNOLOGY vs VALUATION" fontFamily="SpaceGrotesk" size={56}
                            color={NVIDIA_COLORS.gold} position="relative" delay={30} />
                    </AbsoluteFill>
                </Sequence>

                {/* Phase C: Storm clouds + forked road (500-750) */}
                <Sequence from={500} durationInFrames={250}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                        {/* Storm clouds */}
                        <div style={{ position: 'absolute', top: 0, width: '100%', height: '40%' }}>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} style={{
                                    position: 'absolute', width: 400 + i * 80, height: 150,
                                    background: `radial-gradient(ellipse, rgba(20,20,40,0.8), transparent)`,
                                    left: `${(i * 200) % 1600}px`, top: `${20 + i * 15}px`,
                                    borderRadius: '50%', filter: 'blur(20px)',
                                }} />
                            ))}
                            {/* Lightning */}
                            {Math.sin(frame * 0.1) > 0.8 && (
                                <svg width={200} height={300} viewBox="0 0 100 150" style={{ position: 'absolute', left: '45%', top: 60, opacity: 0.7 }}>
                                    <polyline points="50,0 45,40 60,45 40,90 55,95 35,150" fill="none" stroke={NVIDIA_COLORS.gold} strokeWidth="3" />
                                </svg>
                            )}
                        </div>
                        <div style={{ marginTop: 100 }}>
                            <ForkedRoad leftLabel="MINOR CORRECTION" rightLabel="BEAR MARKET" delay={20} />
                        </div>
                    </AbsoluteFill>
                </Sequence>
            </HandheldCamera>

            <LowerThird label="THE QUESTION" value="CORRECTION OR CRASH?" color={NVIDIA_COLORS.pink} delay={20} />
            <Vignette intensity={0.9} />
            <ScanLine color={NVIDIA_COLORS.red} />
            <GrainOverlay />
        </AbsoluteFill>
    );
};

// =============================================
// SCENE 9: ENDING (3:40 – 3:56) — 480 frames
// =============================================
export const Scene09_Ending: React.FC = () => {
    const frame = useCurrentFrame();
    useVideoConfig();

    const finalZoom = interpolate(frame, [300, 480], [1, 1.3], { extrapolateRight: 'clamp' });
    const textFade = interpolate(frame, [350, 420], [0, 1], { extrapolateRight: 'clamp' });
    const chipGlow = 0.5 + Math.sin(frame * 0.06) * 0.3;

    return (
        <AbsoluteFill style={{ backgroundColor: '#020205', overflow: 'hidden' }}>
            <HandheldCamera intensity={0.2}>
                <FloatingOrbs color={NVIDIA_COLORS.green} count={3} />

                {/* Phase A: Futuristic AI city (0-180) */}
                <Sequence durationInFrames={180}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                        {/* Cityscape with holographic streams */}
                        <svg width={1400} height={700} viewBox="0 0 700 350" style={{ filter: 'drop-shadow(0 0 30px rgba(118,185,0,0.2))' }}>
                            {/* Buildings */}
                            {[
                                { x: 50, w: 60, h: 200 }, { x: 130, w: 40, h: 250 }, { x: 200, w: 80, h: 300 },
                                { x: 310, w: 50, h: 180 }, { x: 380, w: 70, h: 280 }, { x: 470, w: 90, h: 320 },
                                { x: 580, w: 60, h: 220 }, { x: 650, w: 40, h: 260 },
                            ].map((b, i) => (
                                <React.Fragment key={i}>
                                    <rect x={b.x} y={350 - b.h} width={b.w} height={b.h} fill="#0a0e1a" stroke={`${NVIDIA_COLORS.green}33`} strokeWidth="0.5" />
                                    {/* Holographic revenue stream */}
                                    <line x1={b.x + b.w / 2} y1={350 - b.h} x2={b.x + b.w / 2} y2={350 - b.h - 40}
                                        stroke={NVIDIA_COLORS.green} strokeWidth="1"
                                        opacity={0.3 + Math.sin(frame * 0.05 + i) * 0.3}
                                        strokeDasharray="4 4" />
                                </React.Fragment>
                            ))}
                        </svg>
                        <CinematicTitle text="THE AI ECONOMY" fontFamily="Orbitron" size={80}
                            color={NVIDIA_COLORS.green} yOffset={-400} delay={10} />
                    </AbsoluteFill>
                </Sequence>

                {/* Phase B: Poker table (180-320) */}
                <Sequence from={180} durationInFrames={140}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                        {/* Table felt */}
                        <div style={{
                            width: 900, height: 500, borderRadius: '50%', position: 'absolute',
                            background: 'radial-gradient(ellipse, #0a2a0a, #050f05)',
                            border: `3px solid ${NVIDIA_COLORS.gold}44`,
                            boxShadow: `inset 0 0 100px rgba(0,0,0,0.5), 0 0 60px rgba(118,185,0,0.1)`,
                        }} />
                        {/* Chips */}
                        <div style={{ display: 'flex', gap: 30, zIndex: 10 }}>
                            {[
                                { label: '$1T', color: NVIDIA_COLORS.gold, d: 10 },
                                { label: '$2T', color: NVIDIA_COLORS.green, d: 20 },
                                { label: '$3T', color: NVIDIA_COLORS.cyan, d: 30 },
                                { label: '$500B', color: NVIDIA_COLORS.red, d: 40 },
                            ].map((chip, i) => (
                                <PokerChip key={i} label={chip.label} color={chip.color} delay={chip.d} size={130} />
                            ))}
                        </div>
                        <CinematicTitle text="TRILLIONS ON THE TABLE" fontFamily="BebasNeue" size={90}
                            color={NVIDIA_COLORS.gold} yOffset={-350} delay={20} />
                    </AbsoluteFill>
                </Sequence>

                {/* Phase C: Single chip close-up with final text (320-480) */}
                <Sequence from={320} durationInFrames={160}>
                    <AbsoluteFill style={{
                        justifyContent: 'center', alignItems: 'center',
                        background: 'radial-gradient(circle, #0a0e1a 0%, #020205 80%)',
                        transform: `scale(${finalZoom})`,
                    }}>
                        {/* Spotlight */}
                        <div style={{
                            position: 'absolute', width: 600, height: 600,
                            background: `radial-gradient(circle, rgba(118,185,0,${chipGlow * 0.15}) 0%, transparent 70%)`,
                        }} />
                        {/* Single glowing chip */}
                        <AIChip size={350} color={NVIDIA_COLORS.green} delay={0} />
                        {/* Reflection on dark table */}
                        <div style={{
                            position: 'absolute', top: '65%', width: 500, height: 2,
                            background: `linear-gradient(to right, transparent, ${NVIDIA_COLORS.green}33, transparent)`,
                        }} />
                        {/* Final text */}
                        <div style={{
                            position: 'absolute', bottom: 180, opacity: textFade,
                            fontFamily: 'Montserrat', fontSize: 72, fontWeight: 800, color: 'white',
                            textShadow: `0 0 40px ${NVIDIA_COLORS.green}44`,
                            letterSpacing: 4, textAlign: 'center',
                        }}>
                            WHO'S STILL BETTING?
                        </div>
                    </AbsoluteFill>
                </Sequence>
            </HandheldCamera>

            <Vignette intensity={0.95} />
            <GrainOverlay />
        </AbsoluteFill>
    );
};
