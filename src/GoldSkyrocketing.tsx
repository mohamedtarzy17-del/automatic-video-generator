import React from 'react';
import {
    AbsoluteFill, useCurrentFrame, interpolate, spring,
    Audio, staticFile, Sequence, Easing
} from 'remotion';
import { FONT_IMPORT, FONT_STACK, StickFigure } from './components/PremiumKit';

const C = {
    gold: '#F6AE2D', goldDark: '#B37D19',
    charcoal: '#111827', white: '#FFFFFF', black: '#000000',
    navy: '#0B132B', slate: '#1C1C21',
    red: '#E63946', pink: '#F20089',
    yellow: '#FFD166', emerald: '#06D6A0',
    teal: '#005C69', orange: '#FF8C42',
    purple: '#2D00F7', cyan: '#00F0FF'
};

// Durations based on whisper timings
const S1 = 655, S2 = 599, S3 = 659, S4 = 632, S5 = 609, S6 = 728;
const F1 = 0, F2 = F1 + S1, F3 = F2 + S2, F4 = F3 + S3, F5 = F4 + S4, F6 = F5 + S5;

// ─── EFFECTS & HELPERS ──────────────────────

const CameraWrapper: React.FC<{ children: React.ReactNode; zoom?: number; intensity?: number }> = ({ children, zoom = 1.03, intensity = 0.8 }) => {
    // Reduced zoom and intensity to stop elements going out of frame
    const frame = useCurrentFrame();
    const scale = interpolate(frame, [0, 1000], [1, zoom], { extrapolateRight: 'clamp' });
    const rotate = Math.sin(frame * 0.005) * 0.2 * intensity;
    const x = Math.cos(frame * 0.01) * 10 * intensity;
    const y = Math.sin(frame * 0.008) * 8 * intensity;
    return (
        <div style={{ width: '100%', height: '100%', transform: `scale(${scale}) rotate(${rotate}deg) translate(${x}px, ${y}px)` }}>
            {children}
        </div>
    );
};

const FilmGrain: React.FC = () => (
    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none', mixBlendMode: 'overlay', zIndex: 100 }}>
        <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.4 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
);

const BeatManager: React.FC<{ frame: number; interval?: number }> = ({ frame, interval = 24 }) => {
    const isBeat = frame > 0 && frame % interval === 0;
    return <>{isBeat && <Audio src={staticFile('sfx/pop.mp3')} volume={0.3} />}</>;
};

// ─── UI COMPONENTS ──────────────────────

const Cen: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', ...style }}>{children}</AbsoluteFill>
);

const Background: React.FC<{ color: string; overlay?: string }> = ({ color, overlay }) => (
    <AbsoluteFill style={{ backgroundColor: color }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)`, backgroundSize: '100px 100px' }} />
        {overlay && <div style={{ position: 'absolute', inset: 0, background: overlay }} />}
    </AbsoluteFill>
);

const HUD: React.FC<{ color?: string }> = ({ color = C.emerald }) => {
    const frame = useCurrentFrame();
    return (
        <div style={{ position: 'absolute', inset: 40, border: `2px solid ${color}`, opacity: 0.3, pointerEvents: 'none', zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: 20 }}>
            <div style={{ fontFamily: FONT_STACK.mono, color, fontSize: 18 }}>SYS.OP // {(frame * 0.12).toFixed(2)}</div>
            <div style={{ width: 40, height: 40, borderRight: `4px solid ${color}`, borderTop: `4px solid ${color}` }} />
            <div style={{ position: 'absolute', bottom: 20, left: 20, width: 40, height: 40, borderLeft: `4px solid ${color}`, borderBottom: `4px solid ${color}` }} />
            <div style={{ position: 'absolute', bottom: 20, right: 20, fontFamily: FONT_STACK.mono, color, fontSize: 18 }}>[ REC ] <span style={{ opacity: frame % 30 > 15 ? 1 : 0 }}>●</span></div>
        </div>
    );
};

const KineticText: React.FC<{ words: string[]; colors: string[]; delay?: number; speed?: number; scale?: number }> = ({ words, colors, delay = 0, speed = 12, scale = 1 }) => {
    const frame = useCurrentFrame();
    return (
        <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap', justifyContent: 'center', transform: `scale(${scale})` }}>
            {words.map((word, i) => {
                const wFrame = frame - delay - (i * speed);
                const spr = wFrame > 0 ? spring({ frame: wFrame, fps: 30, config: { damping: 12 } }) : 0;
                const opacity = interpolate(wFrame, [0, 5], [0, 1], { extrapolateRight: 'clamp' });
                // Prevent long words from exceeding screen width bounds
                const fSize = word.length > 9 ? 110 : 160;
                return (
                    <div key={i} style={{
                        fontSize: fSize, fontWeight: 900, fontFamily: FONT_STACK.impact,
                        color: colors[i % colors.length],
                        transform: `scale(${spr}) translateY(${interpolate(spr, [0, 1], [100, 0])}px)`,
                        opacity,
                        textShadow: '0 20px 40px rgba(0,0,0,0.5)'
                    }}>
                        {word}
                        {wFrame === 1 && <Audio src={staticFile('sfx/pop.mp3')} volume={0.8} />}
                    </div>
                );
            })}
        </div>
    );
};

const LayoutSplit: React.FC<{ left: React.ReactNode; right: React.ReactNode; ratio?: number }> = ({ left, right, ratio = 60 }) => {
    const frame = useCurrentFrame();
    const spr = spring({ frame, fps: 30 });
    return (
        <AbsoluteFill style={{ flexDirection: 'row', display: 'flex' }}>
            <div style={{ width: `${ratio}%`, height: '100%', position: 'relative', overflow: 'hidden', transform: `translateX(${interpolate(spr, [0, 1], [-100, 0])}px)`, opacity: spr, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {left}
            </div>
            <div style={{ width: `${100 - ratio}%`, height: '100%', position: 'relative', backgroundColor: 'rgba(0,0,0,0.5)', borderLeft: '2px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', transform: `translateX(${interpolate(spr, [0, 1], [100, 0])}px)`, opacity: spr, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {right}
            </div>
        </AbsoluteFill>
    );
};

const DynamicCard: React.FC<{ title: string; body: string; color: string; bg?: string; width?: string }> = ({ title, body, color, bg = 'rgba(0,0,0,0.6)', width = '80%' }) => {
    const frame = useCurrentFrame();
    const spr = spring({ frame, fps: 30 });
    return (
        <div style={{
            width, backgroundColor: bg, backdropFilter: 'blur(30px)', border: `2px solid rgba(255,255,255,0.1)`,
            borderRadius: 24, padding: 50, boxShadow: '0 30px 60px rgba(0,0,0,0.5)', borderLeft: `8px solid ${color}`,
            transform: `scale(${interpolate(spr, [0, 1], [0.8, 1])})`, opacity: spr
        }}>
            <div style={{ fontSize: 28, fontWeight: 900, color, fontFamily: FONT_STACK.mono, textTransform: 'uppercase', letterSpacing: 4, marginBottom: 20 }}>{title}</div>
            <div style={{ fontSize: 40, fontWeight: 700, color: C.white, fontFamily: FONT_STACK.body, lineHeight: 1.5 }}>{body}</div>
        </div>
    )
};

const BoldText: React.FC<{ text: string, color?: string, delay?: number }> = ({ text, color = C.white, delay = 0 }) => {
    const frame = useCurrentFrame();
    const wFrame = frame - delay;
    const spr = wFrame > 0 ? spring({ frame: wFrame, fps: 30 }) : 0;
    return (
        <div style={{ transform: `scale(${spr})`, opacity: spr }}>
            {wFrame === 1 && <Audio src={staticFile('sfx/pop 2.mp3')} volume={0.8} />}
            <div style={{ fontSize: 140, color, fontFamily: FONT_STACK.impact, textShadow: '0 0 30px rgba(0,0,0,0.5)', textAlign: 'center' }}>
                {text}
            </div>
        </div>
    );
}

// ─── NEW CUSTOM SVG ASSETS ──────────────────────

const GoldVault: React.FC = () => {
    const frame = useCurrentFrame();
    const shut = interpolate(frame, [10, 30], [200, 0], { extrapolateRight: 'clamp', easing: Easing.bezier(0.2, 0.8, 0.2, 1) });
    return (
        <div style={{ position: 'relative', width: 400, height: 400, transform: 'scale(1.2)' }}>
            {/* Vault Body */}
            <div style={{ position: 'absolute', inset: 0, backgroundColor: '#222', borderRadius: '50%', border: '20px solid #444', boxShadow: '0 0 50px rgba(0,0,0,0.8)' }}>
                {/* Gold glowing inside */}
                <div style={{ position: 'absolute', inset: 40, backgroundColor: C.gold, borderRadius: '50%', boxShadow: '0 0 100px rgba(246,174,45,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ fontSize: 60, fontFamily: FONT_STACK.impact, color: '#996515' }}>99.99</div>
                </div>
                {/* Vault Doors */}
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '50%', backgroundColor: '#555', transform: `translateX(${-shut}px)`, borderRight: '10px solid #777' }} />
                <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '50%', backgroundColor: '#555', transform: `translateX(${shut}px)`, borderLeft: '10px solid #777' }} />
                {/* Wheel lock */}
                {frame > 30 && <div style={{ position: 'absolute', top: 150, left: 150, width: 100, height: 100, border: '15px solid #888', borderRadius: '50%', transform: `rotate(${frame * 5}deg)` }} />}
            </div>
            {frame === 30 && <Audio src={staticFile('sfx/pop.mp3')} volume={1} />}
        </div>
    );
};

const CrackedScreen: React.FC = () => {
    const frame = useCurrentFrame();
    const isCracked = frame > 30;
    return (
        <div style={{ width: 600, height: 400, backgroundColor: '#111', border: '5px solid #333', borderRadius: 20, position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ fontSize: 60, color: C.emerald, fontFamily: FONT_STACK.mono }}>{'>'} ONLINE_BAL: $0.00</div>
            {isCracked && (
                <>
                    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                        <path d="M 0 0 L 300 200 L 400 100 L 600 400" stroke={C.red} strokeWidth="10" fill="none" />
                        <path d="M 300 200 L 200 400" stroke={C.red} strokeWidth="8" fill="none" />
                        <path d="M 300 200 L 600 200" stroke={C.red} strokeWidth="6" fill="none" />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(230,57,70,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(5px)' }}>
                        <div style={{ fontSize: 80, fontWeight: 900, color: C.white, fontFamily: FONT_STACK.impact, textShadow: '0 0 20px #E63946' }}>SYSTEM FAULT</div>
                    </div>
                </>
            )}
            {frame === 30 && <Audio src={staticFile('sfx/whoosh.mp3')} volume={1} />}
        </div>
    );
};

const DollarizationGauge: React.FC = () => {
    const frame = useCurrentFrame();
    const rot = interpolate(frame, [0, 60], [-90, 90], { extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ fontSize: 40, fontFamily: FONT_STACK.display, color: C.white, letterSpacing: 5 }}>RESERVE SHIFT</div>
            <div style={{ position: 'relative', width: 400, height: 200, overflow: 'hidden' }}>
                <div style={{ width: 400, height: 400, border: '20px solid #333', borderTopColor: C.emerald, borderRightColor: C.gold, borderRadius: '50%', transform: 'rotate(-45deg)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 195, width: 10, height: 180, backgroundColor: C.white, transformOrigin: 'bottom center', transform: `rotate(${rot}deg)`, borderRadius: 5 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: 600, fontSize: 35, fontWeight: 800, fontFamily: FONT_STACK.body }}>
                <div style={{ color: C.emerald }}>$ USD</div>
                <div style={{ color: C.gold }}>GOLD</div>
            </div>
            {frame === 60 && <Audio src={staticFile('sfx/pop 2.mp3')} volume={1} />}
        </div>
    );
};

const PrintingPress: React.FC = () => {
    const frame = useCurrentFrame();
    const paperY = interpolate(frame % 45, [0, 45], [-50, 150]);
    const paperOpacity = interpolate(frame % 45, [30, 45], [1, 0], { extrapolateRight: 'clamp' });

    return (
        <svg width="400" height="400" viewBox="0 0 200 200" style={{ filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.5))' }}>
            <rect x="20" y="50" width="160" height="100" fill="#333" rx="10" />
            <rect x="65" y={paperY} width="70" height="40" fill={C.emerald} rx="5" opacity={paperOpacity} />
            <text x="80" y={paperY + 25} fill="#111" fontSize="15" fontWeight="900" fontFamily={FONT_STACK.mono}>$$$</text>
            <rect x="10" y="80" width="180" height="40" fill="#222" rx="5" />
            <rect x="50" y="40" width="100" height="20" fill="#555" />
        </svg>
    );
};

const AnimatedGlobeBreak: React.FC = () => {
    const frame = useCurrentFrame();
    const draw = interpolate(frame, [0, 60], [0, 300], { extrapolateRight: 'clamp' });
    const breakLine = interpolate(frame, [60, 90], [0, 200], { extrapolateRight: 'clamp' });
    const isBroken = frame > 60;

    return (
        <svg width="500" height="500" viewBox="0 0 200 200" style={{ filter: 'drop-shadow(0 0 30px rgba(230,57,70,0.4))' }}>
            <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
            <path d="M 40 80 Q 100 20 160 80" fill="none" stroke={C.red} strokeWidth="4" strokeDasharray="300" strokeDashoffset={300 - draw} opacity={isBroken ? 0.2 : 1} />
            <path d="M 30 120 Q 100 180 170 120" fill="none" stroke={C.red} strokeWidth="4" strokeDasharray="300" strokeDashoffset={300 - draw} opacity={isBroken ? 0.2 : 1} />
            {isBroken && (
                <path d="M 20 100 Q 100 100 180 100" fill="none" stroke={C.gold} strokeWidth="8" strokeLinecap="round" strokeDasharray="200" strokeDashoffset={200 - breakLine} style={{ filter: 'drop-shadow(0 0 10px rgba(246,174,45,0.8))' }} />
            )}
            <circle cx="20" cy="100" r="8" fill={C.gold} opacity={isBroken ? 1 : 0} />
            <circle cx="180" cy="100" r="8" fill={C.gold} opacity={isBroken ? 1 : 0} />
            {frame === 60 && <Audio src={staticFile('sfx/whoosh.mp3')} volume={1} />}
        </svg>
    );
};

const PriceTargetGauge: React.FC = () => {
    const frame = useCurrentFrame();
    const price = Math.floor(interpolate(frame, [0, 60], [2000, 5000], { easing: Easing.out(Easing.cubic) }));
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 50, color: C.white, fontFamily: FONT_STACK.display }}>ALL TIME HIGH</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, margin: '20px 0' }}>
                <div style={{ fontSize: 200, color: C.gold, fontFamily: FONT_STACK.impact }}>${price}</div>
            </div>
            {price === 5000 && (
                <div style={{ fontSize: 40, color: C.red, backgroundColor: 'rgba(230,57,70,0.2)', padding: '10px 30px', borderRadius: 10, animation: 'pulse 1s infinite', fontWeight: 'bold', transform: `scale(${spring({ frame: frame - 60, fps: 30 })})` }}>TARGET SURPASSED</div>
            )}
            {frame === 60 && <Audio src={staticFile('sfx/pop.mp3')} volume={1} />}
        </div>
    );
}

// ─── MAIN COMPOSITION ──────────────────────

export const GoldSkyrocketing: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: C.charcoal, color: C.white }}>
            <style>{FONT_IMPORT}</style>

            {/* Master Audio Track */}
            <Audio src={staticFile("gold.wav")} volume={1} />
            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.06} />

            {/* S1: NAVY & GOLD (655 frames) */}
            <Sequence from={F1} durationInFrames={S1}>
                <Background color={C.navy} overlay="radial-gradient(circle at 50% 100%, rgba(246,174,45,0.15), transparent 70%)" />
                <HUD color={C.gold} />
                <CameraWrapper intensity={1.5}>
                    <AbsoluteFill>
                        <BeatManager frame={useCurrentFrame()} interval={30} />

                        {/* Rapid cuts in S1 to maintain 1.2s rule */}
                        <Sequence durationInFrames={100}>
                            <Cen><KineticText words={["THE", "SILENT", "HEDGE"]} colors={[C.white, C.gold, C.white]} delay={5} speed={10} /></Cen>
                        </Sequence>

                        <Sequence from={100} durationInFrames={90}>
                            <Audio src={staticFile("sfx/rise.mp3")} volume={0.5} />
                            <Cen><KineticText words={["ZERO", "COUNTERPARTY", "RISK"]} colors={[C.gold, C.white, C.red]} speed={12} scale={0.8} /></Cen>
                        </Sequence>

                        <Sequence from={190} durationInFrames={100}>
                            <Audio src={staticFile("sfx/pop 2.mp3")} volume={0.8} />
                            <Cen><DynamicCard width="60%" color={C.gold} title="Trigger Alert" body="Gold screams when the first shot is fired." /></Cen>
                        </Sequence>

                        <Sequence from={290} durationInFrames={100}>
                            <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.8} />
                            <Cen><StickFigure emotion="surprised" color={C.gold} size={300} /></Cen>
                        </Sequence>

                        <Sequence from={390} durationInFrames={120}>
                            <Audio src={staticFile("sfx/pop 2.mp3")} volume={0.9} />
                            <LayoutSplit
                                ratio={50}
                                left={<Cen><GoldVault /></Cen>}
                                right={
                                    <Cen><BoldText text="PHYSICAL SAFETY" color={C.white} delay={10} /></Cen>
                                }
                            />
                        </Sequence>

                        <Sequence from={510} durationInFrames={145}>
                            <Audio src={staticFile("sfx/pop 2.mp3")} volume={0.8} />
                            <Cen><DynamicCard color={C.gold} title="Immediate Flows" body="Global instability drives immediate safe-haven flows." width="70%" /></Cen>
                        </Sequence>

                    </AbsoluteFill>
                </CameraWrapper>
            </Sequence>

            {/* S2: DEEP TEAL & ORANGE (599 frames) */}
            <Sequence from={F2} durationInFrames={S2}>
                <Background color={C.teal} />
                <HUD color={C.orange} />
                <CameraWrapper zoom={1.05}>
                    <AbsoluteFill>
                        <BeatManager frame={useCurrentFrame()} interval={25} />
                        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.9} />

                        <Sequence durationInFrames={110}>
                            <Cen><KineticText words={["5,000", "YEAR", "SHIELD"]} colors={[C.orange, C.white, C.white]} speed={10} scale={0.9} /></Cen>
                        </Sequence>

                        <Sequence from={110} durationInFrames={120}>
                            <Audio src={staticFile("sfx/pop 2.mp3")} volume={0.8} />
                            <Cen><DynamicCard width="60%" color={C.orange} title="The Fiat Illusion" body="Paper currency is a promise made by governments." /></Cen>
                        </Sequence>

                        <Sequence from={230} durationInFrames={130}>
                            <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.8} />
                            <LayoutSplit
                                ratio={55}
                                left={<Cen><PrintingPress /></Cen>}
                                right={<Cen><StickFigure emotion="sad" color={C.white} size={200} /></Cen>}
                            />
                        </Sequence>

                        <Sequence from={360} durationInFrames={110}>
                            <Audio src={staticFile("sfx/pop 2.mp3")} volume={1} />
                            <Cen><BoldText text="OUTSIDE THE BANKING SYSTEM" color={C.white} delay={5} /></Cen>
                        </Sequence>

                        <Sequence from={470} durationInFrames={129}>
                            <Audio src={staticFile("sfx/rise.mp3")} volume={0.8} />
                            <Cen>
                                <div style={{ fontSize: 130, color: C.white, fontFamily: FONT_STACK.impact, textShadow: '0 0 40px rgba(0,0,0,0.8)', textAlign: 'center' }}>
                                    WHEN EVERYTHING ELSE <br /><span style={{ color: C.red }}>BURNS</span>
                                </div>
                            </Cen>
                        </Sequence>
                    </AbsoluteFill>
                </CameraWrapper>
            </Sequence>

            {/* S3: BLACK & YELLOW (659 frames) */}
            <Sequence from={F3} durationInFrames={S3}>
                <Background color={C.black} overlay="radial-gradient(circle at 100% 50%, rgba(255,209,102,0.1), transparent 60%)" />
                <HUD color={C.yellow} />
                <CameraWrapper intensity={1.8}>
                    <AbsoluteFill>
                        <BeatManager frame={useCurrentFrame()} interval={30} />
                        <Audio src={staticFile("sfx/whoosh.mp3")} volume={1} />

                        <Sequence durationInFrames={90}>
                            <Cen><KineticText words={["1990", "GULF", "WAR"]} colors={[C.white, C.yellow, C.yellow]} speed={8} scale={0.9} /></Cen>
                        </Sequence>

                        <Sequence from={90} durationInFrames={120}>
                            <Audio src={staticFile("sfx/pop 2.mp3")} volume={0.8} />
                            <Cen>
                                <div style={{ width: 800, padding: 40, border: `2px solid #333`, borderRadius: 20 }}>
                                    <div style={{ color: C.white, fontSize: 24, marginBottom: 20, fontFamily: FONT_STACK.body }}>XAU/USD SURGE</div>
                                    <svg width="700" height="300" viewBox="0 0 700 300">
                                        <path d="M 0 250 L 200 220 L 400 240 L 500 180 L 700 50" fill="none" stroke={C.yellow} strokeWidth="8" />
                                        <circle cx="700" cy="50" r="15" fill={C.white} />
                                    </svg>
                                </div>
                            </Cen>
                        </Sequence>

                        <Sequence from={210} durationInFrames={120}>
                            <Audio src={staticFile("sfx/pop 2.mp3")} volume={0.9} />
                            <LayoutSplit
                                ratio={40}
                                left={<Cen><StickFigure emotion="happy" color={C.yellow} size={250} /></Cen>}
                                right={
                                    <Cen>
                                        <div style={{ fontSize: 200, color: C.yellow, fontFamily: FONT_STACK.display, fontWeight: 900, textShadow: '0 0 40px rgba(255,209,102,0.5)' }}>+15%</div>
                                        <div style={{ fontSize: 35, color: C.white, fontFamily: FONT_STACK.body, fontWeight: 700, letterSpacing: 6 }}>IN DAYS</div>
                                    </Cen>
                                }
                            />
                        </Sequence>

                        <Sequence from={330} durationInFrames={120}>
                            <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.9} />
                            <Cen><CrackedScreen /></Cen>
                        </Sequence>

                        <Sequence from={450} durationInFrames={110}>
                            <Audio src={staticFile("sfx/pop 2.mp3")} volume={0.8} />
                            <Cen><DynamicCard color={C.yellow} title="Electronic Fragility" body="Investors didn't want stocks or bonds. They realized digital digits are fragile." width="60%" /></Cen>
                        </Sequence>

                        <Sequence from={560} durationInFrames={99}>
                            <Audio src={staticFile("sfx/rise.mp3")} volume={0.8} />
                            <Cen><BoldText text="FINITE METAL" color={C.yellow} delay={10} /></Cen>
                        </Sequence>
                    </AbsoluteFill>
                </CameraWrapper>
            </Sequence>

            {/* S4: CHARCOAL & RED (632 frames) */}
            <Sequence from={F4} durationInFrames={S4}>
                <Background color={C.slate} overlay="linear-gradient(rgba(230,57,70,0.1), transparent)" />
                <HUD color={C.red} />
                <CameraWrapper>
                    <AbsoluteFill>
                        <BeatManager frame={useCurrentFrame()} interval={25} />
                        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.9} />

                        <Sequence durationInFrames={100}>
                            <Cen><KineticText words={["2022", "SANCTION", "BYPASS"]} colors={[C.white, C.red, C.white]} speed={10} scale={0.85} /></Cen>
                        </Sequence>

                        <Sequence from={100} durationInFrames={140}>
                            <Audio src={staticFile("sfx/pop 2.mp3")} volume={0.8} />
                            <LayoutSplit
                                ratio={50}
                                left={<Cen><AnimatedGlobeBreak /></Cen>}
                                right={
                                    <div style={{ padding: 50, display: 'flex', flexDirection: 'column', gap: 40 }}>
                                        <div style={{ fontSize: 40, color: C.red, fontFamily: FONT_STACK.mono, border: `2px solid ${C.red}`, padding: 20 }}>SYS.ERR.FROZEN</div>
                                    </div>
                                }
                            />
                        </Sequence>

                        <Sequence from={240} durationInFrames={130}>
                            <Audio src={staticFile("sfx/pop 2.mp3")} volume={0.9} />
                            <Cen><DynamicCard color={C.gold} title="Weaponized Finance" body="When dollar reserves are frozen, physical gold becomes the tool for national survival." width="70%" /></Cen>
                        </Sequence>

                        <Sequence from={370} durationInFrames={120}>
                            <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.9} />
                            <Cen><StickFigure emotion="happy" color={C.red} size={300} /></Cen>
                        </Sequence>

                        <Sequence from={490} durationInFrames={142}>
                            <Audio src={staticFile("sfx/rise.mp3")} volume={0.8} />
                            <Cen>
                                <div style={{ fontSize: 160, color: C.gold, fontFamily: FONT_STACK.impact, textAlign: 'center', lineHeight: 1.1, textShadow: '0 0 50px rgba(246,174,45,0.6)' }}>
                                    MASSIVE PIVOT<br /><span style={{ color: C.white, fontSize: 80, letterSpacing: 10 }}>ACROSS BORDERS</span>
                                </div>
                            </Cen>
                        </Sequence>
                    </AbsoluteFill>
                </CameraWrapper>
            </Sequence>

            {/* S5: PURPLE & PINK (609 frames) */}
            <Sequence from={F5} durationInFrames={S5}>
                <Background color={C.purple} />
                <HUD color={C.pink} />
                <CameraWrapper zoom={1.12}>
                    <AbsoluteFill>
                        <BeatManager frame={useCurrentFrame()} interval={20} />
                        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.9} />

                        <Sequence durationInFrames={110}>
                            <Cen><KineticText words={["CENTRAL", "BANK", "HOARDING"]} colors={[C.pink, C.white, C.cyan]} speed={12} scale={0.8} /></Cen>
                        </Sequence>

                        <Sequence from={110} durationInFrames={130}>
                            <Audio src={staticFile("sfx/pop 2.mp3")} volume={0.8} />
                            <Cen>
                                <div style={{ width: 1000, backgroundColor: 'rgba(0,0,0,0.5)', padding: 60, borderRadius: 30, border: `4px solid ${C.pink}`, backdropFilter: 'blur(20px)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontSize: 200, color: C.cyan, fontWeight: 900, fontFamily: FONT_STACK.impact }}>1000+</div>
                                        <div style={{ fontSize: 50, color: C.white, fontFamily: FONT_STACK.mono, fontWeight: 'bold' }}>TONS / YR</div>
                                    </div>
                                    <div style={{ height: 40, backgroundColor: '#333', marginTop: 40, borderRadius: 20, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `95%`, backgroundColor: C.pink }} />
                                    </div>
                                </div>
                            </Cen>
                        </Sequence>

                        <Sequence from={240} durationInFrames={120}>
                            <Audio src={staticFile("sfx/pop 2.mp3")} volume={0.9} />
                            <Cen><DollarizationGauge /></Cen>
                        </Sequence>

                        <Sequence from={360} durationInFrames={110}>
                            <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.9} />
                            <LayoutSplit
                                ratio={50}
                                left={<Cen><StickFigure emotion="happy" color={C.pink} size={250} /></Cen>}
                                right={<Cen><DynamicCard color={C.cyan} title="Diversifying" body="Moving away from the US dollar to prepare for financial warfare." width="80%" /></Cen>}
                            />
                        </Sequence>

                        <Sequence from={470} durationInFrames={139}>
                            <Audio src={staticFile("sfx/rise.mp3")} volume={0.8} />
                            <Cen><BoldText text="THE NEW NORMAL" color={C.cyan} delay={10} /></Cen>
                        </Sequence>
                    </AbsoluteFill>
                </CameraWrapper>
            </Sequence>

            {/* S6: BLACK & GOLD (728 frames) */}
            <Sequence from={F6} durationInFrames={S6}>
                <Background color={C.black} overlay="radial-gradient(circle at 50% 50%, rgba(246,174,45,0.1), transparent 80%)" />
                <HUD color={C.gold} />
                <CameraWrapper intensity={1.5}>
                    <AbsoluteFill>
                        <BeatManager frame={useCurrentFrame()} interval={24} />
                        <Audio src={staticFile("sfx/whoosh.mp3")} volume={1} />

                        <Sequence durationInFrames={120}>
                            <Cen><KineticText words={["ATOMS", "OVER", "BITS"]} colors={[C.white, C.gold, C.white]} delay={10} speed={15} scale={0.9} /></Cen>
                        </Sequence>

                        <Sequence from={120} durationInFrames={130}>
                            <Audio src={staticFile("sfx/pop 2.mp3")} volume={0.8} />
                            <Cen><PriceTargetGauge /></Cen>
                        </Sequence>

                        <Sequence from={250} durationInFrames={140}>
                            <Audio src={staticFile("sfx/pop 2.mp3")} volume={0.9} />
                            <Cen><DynamicCard color={C.gold} title="The Final Truth" body="In an age of digital digits, physical gold is the only money that isn't someone else's liability." width="70%" /></Cen>
                        </Sequence>

                        <Sequence from={390} durationInFrames={150}>
                            <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.9} />
                            <LayoutSplit
                                ratio={50}
                                left={<Cen><StickFigure emotion="happy" color={C.gold} size={250} /></Cen>}
                                right={<Cen><BoldText text="ULTIMATE ASSET" color={C.white} delay={5} /></Cen>}
                            />
                        </Sequence>

                        <Sequence from={540} durationInFrames={188}>
                            <Audio src={staticFile("sfx/rise.mp3")} volume={0.8} />
                            <Cen><div style={{ fontSize: 220, color: C.gold, fontFamily: FONT_STACK.impact, textShadow: '0 0 50px rgba(246,174,45,0.8)' }}>SUBSCRIBE</div></Cen>
                        </Sequence>
                    </AbsoluteFill>
                </CameraWrapper>
            </Sequence>

            <FilmGrain />
        </AbsoluteFill>
    );
};
