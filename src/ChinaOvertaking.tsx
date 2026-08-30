import React from 'react';
import {
    AbsoluteFill, useCurrentFrame, interpolate, spring,
    Audio, OffthreadVideo, staticFile, Sequence
} from 'remotion';
import { FONT_IMPORT, FONT_STACK, getFontForScene } from './components/PremiumKit';

// ─── COLOR PALETTE & STYLING ────────────────────────
const C = {
    crimson: '#DE2910',
    gold: '#FFDE00',
    slate: '#0F172A',
    darkOverlay: 'rgba(7, 12, 24, 0.72)',
    cardBg: 'rgba(15, 23, 42, 0.88)',
    cyan: '#00F0FF',
    emerald: '#10B981',
    white: '#FFFFFF',
    textMuted: '#CBD5E1',
    border: 'rgba(255, 255, 255, 0.18)'
};

// Segment frame constants measured via afinfo
const S1 = 652, S2 = 641, S3 = 489, S4 = 562, S5 = 511, S6 = 469;
const F1 = 0, F2 = F1 + S1, F3 = F2 + S2, F4 = F3 + S3, F5 = F4 + S4, F6 = F5 + S5;
const TOTAL_FRAMES = F6 + S6; // 3324 frames (~110.8s)

// ─── DYNAMIC CONTINUOUS CAMERA ZOOM & DRIFT ─────────

const DynamicCamera: React.FC<{ children: React.ReactNode; duration: number; mode?: 'zoomIn' | 'zoomOut' | 'panRight' }> = ({ children, duration, mode = 'zoomIn' }) => {
    const frame = useCurrentFrame();

    let scale = 1.0;
    let translateX = 0;
    let translateY = 0;

    if (mode === 'zoomIn') {
        scale = interpolate(frame, [0, duration], [1.0, 1.15], { extrapolateRight: 'clamp' });
        translateY = interpolate(frame, [0, duration], [0, -15], { extrapolateRight: 'clamp' });
    } else if (mode === 'zoomOut') {
        scale = interpolate(frame, [0, duration], [1.18, 1.02], { extrapolateRight: 'clamp' });
        translateX = interpolate(frame, [0, duration], [-20, 10], { extrapolateRight: 'clamp' });
    } else if (mode === 'panRight') {
        scale = 1.08;
        translateX = interpolate(frame, [0, duration], [-30, 30], { extrapolateRight: 'clamp' });
    }

    const rotate = Math.sin(frame * 0.04) * 0.2;

    return (
        <div style={{
            width: '100%', height: '100%',
            transform: `scale(${scale}) translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`,
            transition: 'transform 0.05s linear'
        }}>
            {children}
        </div>
    );
};

// ─── B-ROLL VIDEO CONTAINER WITH DYNAMIC GRADIENT OVERLAY ──

const BRollBackground: React.FC<{ videoPath: string; overlayOpacity?: number }> = ({ videoPath, overlayOpacity = 0.65 }) => {
    const frame = useCurrentFrame();
    const vScale = interpolate(frame, [0, 800], [1.02, 1.12]);

    return (
        <AbsoluteFill style={{ backgroundColor: '#000' }}>
            <OffthreadVideo
                src={staticFile(videoPath)}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `scale(${vScale})`
                }}
                muted
            />
            {/* Cinematic Gradient Overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(135deg, rgba(7, 12, 24, 0.88) 0%, rgba(7, 12, 24, ${overlayOpacity}) 50%, rgba(7, 12, 24, 0.92) 100%)`
            }} />
        </AbsoluteFill>
    );
};

// ─── SCENE 1: THE QUIET SHIFT (Asymmetric Left Hook + Sub-Scene Motion) ───

const SceneOne: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(0);

    // Sub-Scene Phases
    const isPhase1 = frame < 200;
    const isPhase2 = frame >= 200 && frame < 420;
    const isPhase3 = frame >= 420;

    const sprTitle = spring({ frame: frame - 10, fps: 30, config: { damping: 12 } });
    const sprCard1 = spring({ frame: frame - 200, fps: 30 });
    const sprCard2 = spring({ frame: frame - 420, fps: 30 });

    return (
        <AbsoluteFill>
            <BRollBackground videoPath="broll_drone.mp4" overlayOpacity={0.6} />

            <DynamicCamera duration={S1} mode="zoomIn">
                {/* PHASE 1: Asymmetric Left Headline Slam */}
                {isPhase1 && (
                    <div style={{ position: 'absolute', left: 100, top: 220, maxWidth: 1100 }}>
                        <div style={{
                            fontFamily: FONT_STACK.mono, fontSize: 24, color: C.gold, letterSpacing: 6,
                            marginBottom: 20, textTransform: 'uppercase'
                        }}>
                            Global Tech Shift
                        </div>
                        <div style={{
                            fontFamily: font, fontSize: 130, color: C.white, lineHeight: 0.95,
                            transform: `scale(${sprTitle}) translateX(${interpolate(sprTitle, [0, 1], [-100, 0])}px)`,
                            textShadow: '0 20px 60px rgba(0,0,0,0.9)'
                        }}>
                            HOW CHINA IS <br />
                            <span style={{ color: C.gold, backgroundColor: C.crimson, padding: '0 20px', borderRadius: 8 }}>
                                OVERTAKING
                            </span>
                        </div>
                        <div style={{ fontFamily: FONT_STACK.inter, fontSize: 32, color: C.cyan, marginTop: 30, fontWeight: 600 }}>
                            The Quiet Reversal of Manufacturing & Tech Power
                        </div>
                    </div>
                )}

                {/* PHASE 2: Asymmetric Split Screen Reveal */}
                {isPhase2 && (
                    <div style={{
                        position: 'absolute', left: 100, right: 100, top: 180, bottom: 180,
                        display: 'flex', gap: 60, alignItems: 'center',
                        transform: `scale(${sprCard1})`
                    }}>
                        <div style={{ flex: 1.2 }}>
                            <div style={{ fontFamily: FONT_STACK.mono, fontSize: 20, color: C.gold, letterSpacing: 4 }}>
                                PARADIGM SHIFT
                            </div>
                            <div style={{ fontFamily: font, fontSize: 90, color: C.white, lineHeight: 1, marginTop: 10 }}>
                                NO LONGER JUST THE <br />
                                <span style={{ color: C.gold }}>WORLD'S FACTORY FLOOR</span>
                            </div>
                            <div style={{ fontFamily: FONT_STACK.inter, fontSize: 26, color: C.textMuted, marginTop: 24, lineHeight: 1.5 }}>
                                Transitioning from low-cost assembly to high-margin industrial robotics and clean tech.
                            </div>
                        </div>

                        <div style={{
                            flex: 1, backgroundColor: C.cardBg, padding: 48, borderRadius: 24,
                            border: `1px solid ${C.gold}`, backdropFilter: 'blur(20px)',
                            boxShadow: '0 30px 70px rgba(0,0,0,0.7)'
                        }}>
                            <div style={{ fontFamily: FONT_STACK.mono, fontSize: 18, color: C.cyan, marginBottom: 20 }}>
                                INDUSTRIAL EPICENTER
                            </div>
                            <div style={{ fontFamily: FONT_STACK.bebas, fontSize: 64, color: C.white }}>
                                ADVANCED MANUFACTURING
                            </div>
                            <div style={{ fontFamily: FONT_STACK.inter, fontSize: 20, color: C.emerald, marginTop: 15, fontWeight: 600 }}>
                                Leading Clean Energy, Robotics & Microelectronics
                            </div>
                        </div>
                    </div>
                )}

                {/* PHASE 3: 3-Badge Dynamic Grid */}
                {isPhase3 && (
                    <div style={{
                        position: 'absolute', inset: 0, justifyContent: 'center', alignItems: 'center',
                        display: 'flex', flexDirection: 'column', gap: 40, padding: 100,
                        transform: `scale(${sprCard2})`
                    }}>
                        <div style={{ fontFamily: font, fontSize: 96, color: C.white, textAlign: 'center' }}>
                            THE THREE PILLARS OF <span style={{ color: C.gold }}>DOMINANCE</span>
                        </div>

                        <div style={{ display: 'flex', gap: 40, width: '100%' }}>
                            {[
                                { title: 'INDUSTRIAL TECH', desc: 'Robotics & Smart Factories', color: C.gold },
                                { title: 'CLEAN ENERGY', desc: 'Solar, Wind & Batteries', color: C.emerald },
                                { title: 'ADVANCED MANUFACTURING', desc: 'End-to-End Supply Chains', color: C.cyan }
                            ].map((pill, idx) => {
                                const pFrame = frame - 420 - (idx * 15);
                                const pSpr = pFrame > 0 ? spring({ frame: pFrame, fps: 30 }) : 0;
                                return (
                                    <div key={idx} style={{
                                        flex: 1, backgroundColor: C.cardBg, padding: 36, borderRadius: 20,
                                        border: `1px solid ${pill.color}`, backdropFilter: 'blur(16px)',
                                        transform: `translateY(${interpolate(pSpr, [0, 1], [40, 0])}px) scale(${pSpr})`,
                                        textAlign: 'center'
                                    }}>
                                        <div style={{ fontFamily: FONT_STACK.mono, fontSize: 16, color: pill.color, letterSpacing: 2 }}>0{idx + 1}</div>
                                        <div style={{ fontFamily: FONT_STACK.bebas, fontSize: 36, color: C.white, margin: '10px 0' }}>{pill.title}</div>
                                        <div style={{ fontFamily: FONT_STACK.inter, fontSize: 18, color: C.textMuted }}>{pill.desc}</div>
                                        {pFrame === 1 && <Audio src={staticFile('sfx/pop.mp3')} volume={0.7} />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </DynamicCamera>
        </AbsoluteFill>
    );
};

// ─── SCENE 2: EV & BATTERY MONOPOLIES (60/40 Split + Dynamic Push-In) ───

const SceneTwo: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(1);

    const isPhase1 = frame < 250;
    const barBYD = interpolate(frame, [20, 180], [0, 65], { extrapolateRight: 'clamp' });
    const barCATL = interpolate(frame, [180, 360], [0, 70], { extrapolateRight: 'clamp' });

    const sprCard = spring({ frame: frame - 15, fps: 30 });

    return (
        <AbsoluteFill>
            <BRollBackground videoPath="broll_factory.mp4" overlayOpacity={0.7} />

            <DynamicCamera duration={S2} mode="panRight">
                {/* 60/40 Split Screen Layout */}
                <div style={{
                    position: 'absolute', inset: 80, display: 'flex', gap: 60, alignItems: 'center'
                }}>
                    {/* Left Column */}
                    <div style={{ flex: 1.1 }}>
                        <div style={{ fontFamily: FONT_STACK.mono, color: C.emerald, fontSize: 22, letterSpacing: 4 }}>
                            SECTOR DOMINANCE
                        </div>
                        <div style={{
                            fontFamily: font, fontSize: 100, color: C.white, lineHeight: 0.95, marginTop: 12,
                            textShadow: '0 15px 40px rgba(0,0,0,0.9)'
                        }}>
                            EV & BATTERY <br />
                            <span style={{ color: C.gold }}>MONOPOLIES</span>
                        </div>
                        <div style={{ fontFamily: FONT_STACK.inter, fontSize: 24, color: C.textMuted, marginTop: 24, lineHeight: 1.5 }}>
                            BYD & CATL lead global scale, shifting the automotive center of gravity eastwards.
                        </div>
                    </div>

                    {/* Right Floating Card */}
                    <div style={{
                        flex: 1.3, backgroundColor: C.cardBg, padding: 50, borderRadius: 28,
                        border: `1px solid ${C.border}`, backdropFilter: 'blur(24px)',
                        transform: `scale(${sprCard}) translateX(${interpolate(sprCard, [0, 1], [60, 0])}px)`,
                        boxShadow: '0 30px 70px rgba(0,0,0,0.8)'
                    }}>
                        <div style={{ fontFamily: FONT_STACK.mono, fontSize: 18, color: C.cyan, marginBottom: 35, letterSpacing: 2 }}>
                            GLOBAL MARKET SHARE (%)
                        </div>

                        {/* EV Bar */}
                        <div style={{ marginBottom: 40 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_STACK.inter, fontSize: 22, color: C.white, marginBottom: 12 }}>
                                <span>Electric Vehicle Production</span>
                                <span style={{ fontFamily: FONT_STACK.mono, color: C.gold, fontWeight: 700 }}>{barBYD.toFixed(1)}%</span>
                            </div>
                            <div style={{ width: '100%', height: 36, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 18, overflow: 'hidden' }}>
                                <div style={{ width: `${barBYD}%`, height: '100%', backgroundColor: C.gold, borderRadius: 18 }} />
                            </div>
                        </div>

                        {/* Battery Bar */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_STACK.inter, fontSize: 22, color: C.white, marginBottom: 12 }}>
                                <span>Lithium-Ion Battery Cell Capacity</span>
                                <span style={{ fontFamily: FONT_STACK.mono, color: C.emerald, fontWeight: 700 }}>{barCATL.toFixed(1)}%</span>
                            </div>
                            <div style={{ width: '100%', height: 36, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 18, overflow: 'hidden' }}>
                                <div style={{ width: `${barCATL}%`, height: '100%', backgroundColor: C.emerald, borderRadius: 18 }} />
                            </div>
                        </div>
                    </div>
                </div>
            </DynamicCamera>
        </AbsoluteFill>
    );
};

// ─── SCENE 3: RARE EARTHS & RAW MATERIALS (3-Card Sequential Push) ───

const SceneThree: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(2);

    return (
        <AbsoluteFill>
            <BRollBackground videoPath="broll_microchip.mp4" overlayOpacity={0.65} />

            <DynamicCamera duration={S3} mode="zoomOut">
                <div style={{ position: 'absolute', inset: 80, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    {/* Top Header */}
                    <div style={{ marginBottom: 45 }}>
                        <div style={{ fontFamily: FONT_STACK.mono, color: C.cyan, fontSize: 22, letterSpacing: 4 }}>
                            CRITICAL SUPPLY CHAINS
                        </div>
                        <div style={{ fontFamily: font, fontSize: 105, color: C.white, lineHeight: 0.95, textShadow: '0 15px 40px rgba(0,0,0,0.9)' }}>
                            CONTROL OF <span style={{ color: C.cyan }}>RAW MATERIALS</span>
                        </div>
                    </div>

                    {/* 3 Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 35 }}>
                        {[
                            { title: 'RARE EARTHS', pct: '85%', detail: 'Defense & High-Tech Magnets', color: C.crimson },
                            { title: 'LITHIUM REFINING', pct: '72%', detail: 'EVs & Grid Storage', color: C.gold },
                            { title: 'COBALT PROCESSING', pct: '75%', detail: 'Electronics & Chemistry', color: C.cyan }
                        ].map((item, idx) => {
                            const itemFrame = frame - 15 - (idx * 18);
                            const itemSpr = itemFrame > 0 ? spring({ frame: itemFrame, fps: 30 }) : 0;
                            return (
                                <div key={idx} style={{
                                    backgroundColor: C.cardBg, padding: 40, borderRadius: 24,
                                    border: `1px solid ${item.color}`, backdropFilter: 'blur(20px)',
                                    transform: `scale(${itemSpr}) translateY(${interpolate(itemSpr, [0, 1], [50, 0])}px)`,
                                    boxShadow: '0 25px 50px rgba(0,0,0,0.7)'
                                }}>
                                    <div style={{ fontFamily: FONT_STACK.mono, fontSize: 16, color: C.textMuted, letterSpacing: 2 }}>{item.title}</div>
                                    <div style={{ fontFamily: FONT_STACK.bebas, fontSize: 100, color: item.color, margin: '10px 0', lineHeight: 1 }}>{item.pct}</div>
                                    <div style={{ fontFamily: FONT_STACK.inter, fontSize: 18, color: C.white }}>{item.detail}</div>
                                    {itemFrame === 1 && <Audio src={staticFile('sfx/rise.mp3')} volume={0.7} />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </DynamicCamera>
        </AbsoluteFill>
    );
};

// ─── SCENE 4: INDUSTRIAL ROBOTICS (Asymmetric Counter + Pan) ───

const SceneFour: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(3);

    const countRobots = Math.min(290, Math.floor(interpolate(frame, [15, 120], [0, 290])));
    const sprMain = spring({ frame: frame - 10, fps: 30 });

    return (
        <AbsoluteFill>
            <BRollBackground videoPath="broll_robotic.mp4" overlayOpacity={0.65} />

            <DynamicCamera duration={S4} mode="zoomIn">
                <div style={{ position: 'absolute', inset: 80, display: 'flex', gap: 60, alignItems: 'center' }}>
                    <div style={{ flex: 1.1 }}>
                        <div style={{ fontFamily: FONT_STACK.mono, color: C.gold, fontSize: 22, letterSpacing: 4 }}>
                            FACTORY AUTOMATION
                        </div>
                        <div style={{
                            fontFamily: font, fontSize: 96, color: C.white, lineHeight: 0.95, marginTop: 12,
                            textShadow: '0 15px 40px rgba(0,0,0,0.9)'
                        }}>
                            MORE ROBOTS THAN <br />
                            <span style={{ color: C.gold }}>THE REST OF THE WORLD</span>
                        </div>
                        <div style={{ fontFamily: FONT_STACK.inter, fontSize: 24, color: C.textMuted, marginTop: 24, lineHeight: 1.5 }}>
                            Annual installations of industrial robots in China outpace all other nations combined.
                        </div>
                    </div>

                    {/* Counter Box */}
                    <div style={{
                        flex: 1, backgroundColor: C.cardBg, padding: 50, borderRadius: 28,
                        border: `1px solid ${C.gold}`, backdropFilter: 'blur(20px)', textAlign: 'center',
                        transform: `scale(${sprMain})`, boxShadow: '0 30px 60px rgba(0,0,0,0.8)'
                    }}>
                        <div style={{ fontFamily: FONT_STACK.mono, fontSize: 20, color: C.cyan, letterSpacing: 2 }}>
                            ANNUAL INDUSTRIAL ROBOTS
                        </div>
                        <div style={{ fontFamily: FONT_STACK.bebas, fontSize: 150, color: C.gold, lineHeight: 1, margin: '15px 0' }}>
                            {countRobots}k+
                        </div>
                        <div style={{ fontFamily: FONT_STACK.inter, fontSize: 22, color: C.emerald, fontWeight: 600 }}>
                            24/7 Automated Smart Factory Output
                        </div>
                    </div>
                </div>
            </DynamicCamera>
        </AbsoluteFill>
    );
};

// ─── SCENE 5: BELT & ROAD LOGISTICS (Bottom Headline Bar + Grid) ───

const SceneFive: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(4);

    return (
        <AbsoluteFill>
            <BRollBackground videoPath="hormuz_bg_1.mp4" overlayOpacity={0.65} />

            <DynamicCamera duration={S5} mode="zoomOut">
                <div style={{ position: 'absolute', inset: 80, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ marginBottom: 45, textAlign: 'center' }}>
                        <div style={{ fontFamily: FONT_STACK.mono, color: C.cyan, fontSize: 22, letterSpacing: 4 }}>
                            INFRASTRUCTURE NETWORK
                        </div>
                        <div style={{ fontFamily: font, fontSize: 105, color: C.white, lineHeight: 0.95, textShadow: '0 15px 40px rgba(0,0,0,0.9)' }}>
                            BELT & ROAD <span style={{ color: C.cyan }}>GLOBAL LOGISTICS</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 35, justifyContent: 'center' }}>
                        {[
                            { num: '140+', label: 'Partner Nations', detail: 'Global Trade Networks' },
                            { num: '100+', label: 'Deepwater Ports', detail: 'Maritime Infrastructure' },
                            { num: '$1T+', label: 'Capital Invested', detail: 'Logistics Corridors' }
                        ].map((card, idx) => {
                            const cFrame = frame - 15 - (idx * 15);
                            const cSpr = cFrame > 0 ? spring({ frame: cFrame, fps: 30 }) : 0;
                            return (
                                <div key={idx} style={{
                                    flex: 1, backgroundColor: C.cardBg, padding: 40, borderRadius: 24,
                                    border: `1px solid ${C.cyan}`, backdropFilter: 'blur(20px)',
                                    transform: `scale(${cSpr})`, textAlign: 'center',
                                    boxShadow: '0 25px 50px rgba(0,0,0,0.7)'
                                }}>
                                    <div style={{ fontFamily: FONT_STACK.bebas, fontSize: 85, color: C.cyan, lineHeight: 1 }}>{card.num}</div>
                                    <div style={{ fontFamily: FONT_STACK.inter, fontSize: 22, color: C.white, fontWeight: 700, marginTop: 10 }}>{card.label}</div>
                                    <div style={{ fontFamily: FONT_STACK.mono, fontSize: 14, color: C.textMuted, marginTop: 6 }}>{card.detail}</div>
                                    {cFrame === 1 && <Audio src={staticFile('sfx/pop 2.mp3')} volume={0.7} />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </DynamicCamera>
        </AbsoluteFill>
    );
};

// ─── SCENE 6: THE MULTIPOLAR ERA (High-Impact Headline Slam) ───

const SceneSix: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(5);

    const sprMain = spring({ frame: frame - 10, fps: 30, config: { damping: 10 } });

    return (
        <AbsoluteFill>
            <BRollBackground videoPath="broll_data_center.mp4" overlayOpacity={0.65} />

            <DynamicCamera duration={S6} mode="zoomIn">
                <div style={{ position: 'absolute', inset: 0, justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', textAlign: 'center', padding: 80 }}>
                    <div style={{
                        fontFamily: FONT_STACK.mono, fontSize: 24, color: C.gold, letterSpacing: 6, marginBottom: 20,
                        textTransform: 'uppercase'
                    }}>
                        Strategic Conclusion
                    </div>

                    <div style={{
                        fontFamily: font, fontSize: 120, color: C.white, lineHeight: 0.95,
                        transform: `scale(${sprMain})`, textShadow: '0 25px 60px rgba(0,0,0,0.95)'
                    }}>
                        A NEW <span style={{ color: C.gold, backgroundColor: C.crimson, padding: '0 15px', borderRadius: 8 }}>MULTIPOLAR</span> ERA
                    </div>

                    <div style={{
                        fontFamily: FONT_STACK.inter, fontSize: 36, color: C.cyan, marginTop: 35, fontWeight: 600,
                        textShadow: '0 10px 30px rgba(0,0,0,0.8)'
                    }}>
                        Hardware, Clean Energy, and Global Supply Chains Redefined.
                    </div>
                </div>
            </DynamicCamera>
        </AbsoluteFill>
    );
};

// ─── MAIN COMPOSITION ROOT ──────────────────────────────

export const ChinaOvertaking: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#070C18' }}>
            <style>{FONT_IMPORT}</style>

            {/* Ambient Background Music */}
            <Audio src={staticFile('sfx/ambient.mp3')} volume={0.12} loop />

            {/* Segment 1 */}
            <Sequence from={F1} durationInFrames={S1}>
                <SceneOne />
                <Audio src={staticFile('china_vo_1.mp3')} />
            </Sequence>

            {/* Segment 2 */}
            <Sequence from={F2} durationInFrames={S2}>
                <SceneTwo />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('china_vo_2.mp3')} />
            </Sequence>

            {/* Segment 3 */}
            <Sequence from={F3} durationInFrames={S3}>
                <SceneThree />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('china_vo_3.mp3')} />
            </Sequence>

            {/* Segment 4 */}
            <Sequence from={F4} durationInFrames={S4}>
                <SceneFour />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('china_vo_4.mp3')} />
            </Sequence>

            {/* Segment 5 */}
            <Sequence from={F5} durationInFrames={S5}>
                <SceneFive />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('china_vo_5.mp3')} />
            </Sequence>

            {/* Segment 6 */}
            <Sequence from={F6} durationInFrames={S6}>
                <SceneSix />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('china_vo_6.mp3')} />
            </Sequence>
        </AbsoluteFill>
    );
};
