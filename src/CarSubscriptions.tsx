import React from 'react';
import {
    AbsoluteFill, useCurrentFrame, interpolate, spring,
    Audio, OffthreadVideo, staticFile, Sequence
} from 'remotion';
import { FONT_IMPORT, FONT_STACK, getFontForScene } from './components/PremiumKit';

// ─── COLOR PALETTE & VISUAL STYLING ───────────────────
const C = {
    red: '#EF4444',
    gold: '#F59E0B',
    cyan: '#06B6D4',
    blue: '#3B82F6',
    purple: '#8B5CF6',
    emerald: '#10B981',
    darkNavy: '#080C14',
    cardBg: 'rgba(15, 23, 42, 0.88)',
    white: '#FFFFFF',
    textMuted: '#94A3B8',
    border: 'rgba(255, 255, 255, 0.16)'
};

// Segment frame constants measured via afinfo
const S1 = 755, S2 = 798, S3 = 718, S4 = 714, S5 = 702;
const S6 = 695, S7 = 690, S8 = 604, S9 = 680, S10 = 558;

const F1 = 0;
const F2 = F1 + S1;
const F3 = F2 + S2;
const F4 = F3 + S3;
const F5 = F4 + S4;
const F6 = F5 + S5;
const F7 = F6 + S6;
const F8 = F7 + S7;
const F9 = F8 + S8;
const F10 = F9 + S9;
const TOTAL_FRAMES = F10 + S10; // 6914 frames (~230.5s / 3.84 mins)

// ─── DYNAMIC CAMERA DRIFT & MOTION ───────────────────

const DynamicCamera: React.FC<{ children: React.ReactNode; duration: number; mode?: 'zoomIn' | 'zoomOut' | 'panRight' | 'tilt' }> = ({ children, duration, mode = 'zoomIn' }) => {
    const frame = useCurrentFrame();

    let scale = 1.0;
    let translateX = 0;
    let translateY = 0;
    let rotate = 0;

    if (mode === 'zoomIn') {
        scale = interpolate(frame, [0, duration], [1.0, 1.14], { extrapolateRight: 'clamp' });
        translateY = interpolate(frame, [0, duration], [0, -15], { extrapolateRight: 'clamp' });
    } else if (mode === 'zoomOut') {
        scale = interpolate(frame, [0, duration], [1.16, 1.02], { extrapolateRight: 'clamp' });
        translateX = interpolate(frame, [0, duration], [-20, 15], { extrapolateRight: 'clamp' });
    } else if (mode === 'panRight') {
        scale = 1.08;
        translateX = interpolate(frame, [0, duration], [-35, 35], { extrapolateRight: 'clamp' });
    } else if (mode === 'tilt') {
        scale = 1.1;
        rotate = Math.sin(frame * 0.03) * 0.35;
    }

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

// ─── B-ROLL VIDEO BACKGROUND ─────────────────────────

const BRollBackground: React.FC<{ videoPath: string; overlayOpacity?: number }> = ({ videoPath, overlayOpacity = 0.68 }) => {
    const frame = useCurrentFrame();
    const vScale = interpolate(frame, [0, 900], [1.03, 1.12]);

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
            {/* Dark Vignette Overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(135deg, rgba(8, 12, 20, 0.88) 0%, rgba(8, 12, 20, ${overlayOpacity}) 50%, rgba(8, 12, 20, 0.92) 100%)`
            }} />
        </AbsoluteFill>
    );
};

// ─── SEGMENT 1: THE DASHBOARD PAYWALL (B-Roll: Highway Drone) ───

const SceneOne: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(0);

    const sprAlert = spring({ frame: frame - 15, fps: 30, config: { damping: 12 } });

    return (
        <AbsoluteFill>
            <BRollBackground videoPath="broll_drone.mp4" overlayOpacity={0.65} />
            <DynamicCamera duration={S1} mode="zoomIn">
                <div style={{ position: 'absolute', inset: 80, display: 'flex', gap: 60, alignItems: 'center' }}>
                    <div style={{ flex: 1.1 }}>
                        <div style={{ fontFamily: FONT_STACK.mono, color: C.red, fontSize: 22, letterSpacing: 4 }}>
                            AUTOMOTIVE HARDWARE PAYWALLS
                        </div>
                        <div style={{
                            fontFamily: font, fontSize: 105, color: C.white, lineHeight: 0.95, marginTop: 12,
                            textShadow: '0 20px 50px rgba(0,0,0,0.9)'
                        }}>
                            THE $18 / MONTH <br />
                            <span style={{ color: C.red, backgroundColor: 'rgba(239, 68, 68, 0.2)', padding: '0 15px', borderRadius: 8 }}>
                                HEATED SEAT
                            </span>
                        </div>
                        <div style={{ fontFamily: FONT_STACK.inter, fontSize: 24, color: C.textMuted, marginTop: 24, lineHeight: 1.5 }}>
                            Physical heating coils built into your car seat—locked behind a software subscription.
                        </div>
                    </div>

                    {/* Dashboard Alert Mockup */}
                    <div style={{
                        flex: 1, backgroundColor: C.cardBg, padding: 48, borderRadius: 28,
                        border: `2px solid ${C.red}`, backdropFilter: 'blur(20px)',
                        transform: `scale(${sprAlert}) translateX(${interpolate(sprAlert, [0, 1], [60, 0])}px)`,
                        boxShadow: '0 30px 70px rgba(239, 68, 68, 0.3)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 20 }}>
                            <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: C.red }} />
                            <div style={{ fontFamily: FONT_STACK.mono, fontSize: 16, color: C.red, letterSpacing: 2 }}>DASHBOARD ALERT</div>
                        </div>
                        <div style={{ fontFamily: FONT_STACK.bebas, fontSize: 44, color: C.white }}>FEATURE LOCKED</div>
                        <div style={{ fontFamily: FONT_STACK.inter, fontSize: 20, color: C.textMuted, margin: '15px 0' }}>
                            Heated Front Seats subscription expired. Renew to unlock heating coils.
                        </div>
                        <div style={{
                            padding: '16px 24px', backgroundColor: C.red, borderRadius: 12, textAlign: 'center',
                            fontFamily: FONT_STACK.mono, fontSize: 20, color: C.white, fontWeight: 700
                        }}>
                            $18.00 / MONTH
                        </div>
                    </div>
                </div>
            </DynamicCamera>
        </AbsoluteFill>
    );
};

// ─── SEGMENT 2: THE DEATH OF OWNERSHIP (B-Roll: Financial Motion) ───

const SceneTwo: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(1);

    const sprCard = spring({ frame: frame - 20, fps: 30 });

    return (
        <AbsoluteFill>
            <BRollBackground videoPath="debt_bg_1.mp4" overlayOpacity={0.7} />
            <DynamicCamera duration={S2} mode="panRight">
                <div style={{ position: 'absolute', inset: 80, display: 'flex', gap: 60, alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: FONT_STACK.mono, color: C.gold, fontSize: 22, letterSpacing: 4 }}>
                            THE CENTURY-OLD CONTRACT
                        </div>
                        <div style={{ fontFamily: font, fontSize: 100, color: C.white, lineHeight: 0.95, marginTop: 12 }}>
                            FROM BUYING A CAR <br />
                            <span style={{ color: C.gold }}>TO RENTING HARDWARE</span>
                        </div>
                        <div style={{ fontFamily: FONT_STACK.inter, fontSize: 24, color: C.textMuted, marginTop: 24, lineHeight: 1.5 }}>
                            Selling a car once earns one profit margin. Charging monthly subscriptions earns forever.
                        </div>
                    </div>

                    <div style={{
                        flex: 1.1, backgroundColor: C.cardBg, padding: 44, borderRadius: 28,
                        border: `1px solid ${C.border}`, backdropFilter: 'blur(20px)',
                        transform: `scale(${sprCard})`, boxShadow: '0 30px 60px rgba(0,0,0,0.7)'
                    }}>
                        <div style={{ fontFamily: FONT_STACK.mono, fontSize: 18, color: C.gold, marginBottom: 25 }}>
                            PROFIT MARGIN MODEL SHIFT
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div style={{ padding: 24, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderLeft: `6px solid ${C.textMuted}` }}>
                                <div style={{ fontFamily: FONT_STACK.mono, fontSize: 16, color: C.textMuted }}>TRADITIONAL MODEL</div>
                                <div style={{ fontFamily: FONT_STACK.inter, fontSize: 22, color: C.white, fontWeight: 600 }}>One-Time Hardware Sale</div>
                            </div>
                            <div style={{ padding: 24, borderRadius: 16, backgroundColor: 'rgba(245, 158, 11, 0.12)', borderLeft: `6px solid ${C.gold}` }}>
                                <div style={{ fontFamily: FONT_STACK.mono, fontSize: 16, color: C.gold }}>NEW AUTOMOTIVE MODEL</div>
                                <div style={{ fontFamily: FONT_STACK.inter, fontSize: 22, color: C.white, fontWeight: 600 }}>Recurring Micro-Transaction Billing</div>
                            </div>
                        </div>
                    </div>
                </div>
            </DynamicCamera>
        </AbsoluteFill>
    );
};

// ─── SEGMENT 3: BMW HEATED SEAT CASE STUDY (B-Roll: Factory Line) ───

const SceneThree: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(2);

    return (
        <AbsoluteFill>
            <BRollBackground videoPath="broll_factory.mp4" overlayOpacity={0.65} />
            <DynamicCamera duration={S3} mode="zoomOut">
                <div style={{ position: 'absolute', inset: 80, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ marginBottom: 40 }}>
                        <div style={{ fontFamily: FONT_STACK.mono, color: C.cyan, fontSize: 22, letterSpacing: 4 }}>
                            CASE STUDY // SOUTH KOREA & EUROPE
                        </div>
                        <div style={{ fontFamily: font, fontSize: 105, color: C.white, lineHeight: 0.95 }}>
                            BMW'S <span style={{ color: C.cyan }}>SOFTWARE-LOCKED</span> COILS
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 35 }}>
                        {[
                            { title: 'HARDWARE INSTALLED', desc: 'Coils & Wiring Fully Assembled', tag: '100% BUILT', color: C.emerald },
                            { title: 'CLOUD GATEWAY', desc: 'Server Verifies Monthly Card', tag: 'CELLULAR SYNC', color: C.cyan },
                            { title: 'MICROCONTROLLER', desc: 'Current Blocked Unless Paid', tag: 'DIGITAL LOCK', color: C.red }
                        ].map((card, idx) => {
                            const cFrame = frame - 15 - (idx * 15);
                            const cSpr = cFrame > 0 ? spring({ frame: cFrame, fps: 30 }) : 0;
                            return (
                                <div key={idx} style={{
                                    backgroundColor: C.cardBg, padding: 36, borderRadius: 24,
                                    border: `1px solid ${card.color}`, backdropFilter: 'blur(20px)',
                                    transform: `scale(${cSpr})`, textAlign: 'center',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
                                }}>
                                    <div style={{ fontFamily: FONT_STACK.mono, fontSize: 14, color: card.color, letterSpacing: 2 }}>{card.tag}</div>
                                    <div style={{ fontFamily: FONT_STACK.bebas, fontSize: 32, color: C.white, margin: '10px 0' }}>{card.title}</div>
                                    <div style={{ fontFamily: FONT_STACK.inter, fontSize: 18, color: C.textMuted }}>{card.desc}</div>
                                    {cFrame === 1 && <Audio src={staticFile('sfx/pop.mp3')} volume={0.6} />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </DynamicCamera>
        </AbsoluteFill>
    );
};

// ─── SEGMENT 4: MERCEDES ACCELERATION INCREASE (B-Roll: Robotic Motor) ───

const SceneFour: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(3);

    const boostSec = interpolate(frame, [20, 150], [5.8, 4.9], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill>
            <BRollBackground videoPath="broll_robotic.mp4" overlayOpacity={0.65} />
            <DynamicCamera duration={S4} mode="zoomIn">
                <div style={{ position: 'absolute', inset: 80, display: 'flex', gap: 60, alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: FONT_STACK.mono, color: C.gold, fontSize: 22, letterSpacing: 4 }}>
                            HORSEPOWER PAYWALLS
                        </div>
                        <div style={{ fontFamily: font, fontSize: 96, color: C.white, lineHeight: 0.95, marginTop: 12 }}>
                            MERCEDES <span style={{ color: C.gold }}>ACCELERATION BOOST</span>
                        </div>
                        <div style={{ fontFamily: FONT_STACK.inter, fontSize: 24, color: C.textMuted, marginTop: 24, lineHeight: 1.5 }}>
                            Charging $1,200/year to unlock motor output that is already installed in your electric vehicle.
                        </div>
                    </div>

                    <div style={{
                        flex: 1, backgroundColor: C.cardBg, padding: 50, borderRadius: 28,
                        border: `1px solid ${C.gold}`, backdropFilter: 'blur(20px)', textAlign: 'center',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.8)'
                    }}>
                        <div style={{ fontFamily: FONT_STACK.mono, fontSize: 18, color: C.gold, letterSpacing: 2 }}>
                            0 - 60 MPH ACCELERATION TIME
                        </div>
                        <div style={{ fontFamily: FONT_STACK.bebas, fontSize: 130, color: C.white, lineHeight: 1, margin: '15px 0' }}>
                            {boostSec.toFixed(1)}s
                        </div>
                        <div style={{
                            padding: '14px 24px', backgroundColor: 'rgba(245, 158, 11, 0.2)', borderRadius: 12,
                            fontFamily: FONT_STACK.mono, fontSize: 20, color: C.gold
                        }}>
                            $1,200 / YEAR SOFTWARE UNLOCK
                        </div>
                    </div>
                </div>
            </DynamicCamera>
        </AbsoluteFill>
    );
};

// ─── SEGMENT 5: TESLA BATTERY BIT FLIP (B-Roll: Code / Software) ───

const SceneFive: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(4);

    return (
        <AbsoluteFill>
            <BRollBackground videoPath="broll_code.mp4" overlayOpacity={0.65} />
            <DynamicCamera duration={S5} mode="tilt">
                <div style={{ position: 'absolute', inset: 80, display: 'flex', gap: 60, alignItems: 'center' }}>
                    <div style={{ flex: 1.1 }}>
                        <div style={{ fontFamily: FONT_STACK.mono, color: C.purple, fontSize: 22, letterSpacing: 4 }}>
                            OVER-THE-AIR LIMITERS
                        </div>
                        <div style={{ fontFamily: font, fontSize: 100, color: C.white, lineHeight: 0.95, marginTop: 12 }}>
                            TESLA'S SOFTWARE <br />
                            <span style={{ color: C.purple }}>BATTERY CAP</span>
                        </div>
                        <div style={{ fontFamily: FONT_STACK.inter, fontSize: 24, color: C.textMuted, marginTop: 24, lineHeight: 1.5 }}>
                            Identical 75 kWh battery packs capped at 60 kWh until thousands are paid for an OTA bit flip.
                        </div>
                    </div>

                    <div style={{
                        flex: 1, backgroundColor: C.cardBg, padding: 48, borderRadius: 28,
                        border: `1px solid ${C.purple}`, backdropFilter: 'blur(20px)',
                        boxShadow: '0 30px 60px rgba(139, 92, 246, 0.3)'
                    }}>
                        <div style={{ fontFamily: FONT_STACK.mono, fontSize: 16, color: C.purple, marginBottom: 20 }}>
                            BATTERY MANAGEMENT SYSTEM
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15, fontFamily: FONT_STACK.mono, fontSize: 18, color: C.white }}>
                            <span>PHYSICAL CAPACITY:</span>
                            <span style={{ color: C.emerald }}>75 kWh</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 25, fontFamily: FONT_STACK.mono, fontSize: 18, color: C.white }}>
                            <span>SOFTWARE CAP:</span>
                            <span style={{ color: C.red }}>60 kWh</span>
                        </div>
                        <div style={{
                            padding: '16px', backgroundColor: 'rgba(139, 92, 246, 0.2)', borderRadius: 12, textAlign: 'center',
                            fontFamily: FONT_STACK.mono, fontSize: 18, color: C.white
                        }}>
                            +40 MILES RANGE = OTA BIT FLIP
                        </div>
                    </div>
                </div>
            </DynamicCamera>
        </AbsoluteFill>
    );
};

// ─── SEGMENT 6: WALL STREET & RECURRING REVENUE (B-Roll: Data Center) ───

const SceneSix: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(5);

    const revTarget = Math.min(20, Math.floor(interpolate(frame, [20, 140], [0, 20])));

    return (
        <AbsoluteFill>
            <BRollBackground videoPath="broll_data_center.mp4" overlayOpacity={0.7} />
            <DynamicCamera duration={S6} mode="zoomOut">
                <div style={{ position: 'absolute', inset: 80, display: 'flex', gap: 60, alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: FONT_STACK.mono, color: C.emerald, fontSize: 22, letterSpacing: 4 }}>
                            2030 OEM STRATEGY
                        </div>
                        <div style={{ fontFamily: font, fontSize: 96, color: C.white, lineHeight: 0.95, marginTop: 12 }}>
                            CHASING TECH-STYLE <br />
                            <span style={{ color: C.emerald }}>RECURRING REVENUE</span>
                        </div>
                        <div style={{ fontFamily: FONT_STACK.inter, fontSize: 24, color: C.textMuted, marginTop: 24, lineHeight: 1.5 }}>
                            GM, Ford, and Stellantis target billions in annual software subscription revenue.
                        </div>
                    </div>

                    <div style={{
                        flex: 1, backgroundColor: C.cardBg, padding: 50, borderRadius: 28,
                        border: `1px solid ${C.emerald}`, backdropFilter: 'blur(20px)', textAlign: 'center',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.8)'
                    }}>
                        <div style={{ fontFamily: FONT_STACK.mono, fontSize: 18, color: C.emerald, letterSpacing: 2 }}>
                            ANNUAL SUBSCRIPTION TARGET (2030)
                        </div>
                        <div style={{ fontFamily: FONT_STACK.bebas, fontSize: 150, color: C.emerald, lineHeight: 1, margin: '15px 0' }}>
                            ${revTarget}B+
                        </div>
                        <div style={{ fontFamily: FONT_STACK.inter, fontSize: 20, color: C.white }}>
                            Transforming Cars into iPhones on Wheels
                        </div>
                    </div>
                </div>
            </DynamicCamera>
        </AbsoluteFill>
    );
};

// ─── SEGMENT 7: 100 MILLION LINES OF CODE (B-Roll: Microchip) ───

const SceneSeven: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(6);

    return (
        <AbsoluteFill>
            <BRollBackground videoPath="broll_microchip.mp4" overlayOpacity={0.65} />
            <DynamicCamera duration={S7} mode="zoomIn">
                <div style={{ position: 'absolute', inset: 80, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ marginBottom: 40 }}>
                        <div style={{ fontFamily: FONT_STACK.mono, color: C.cyan, fontSize: 22, letterSpacing: 4 }}>
                            VEHICLE COMPUTER ARCHITECTURE
                        </div>
                        <div style={{ fontFamily: font, fontSize: 100, color: C.white, lineHeight: 0.95 }}>
                            ROLLING COMPUTER <span style={{ color: C.cyan }}>NETWORKS</span>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 40 }}>
                        <div style={{
                            backgroundColor: C.cardBg, padding: 44, borderRadius: 24,
                            border: `1px solid ${C.cyan}`, backdropFilter: 'blur(20px)'
                        }}>
                            <div style={{ fontFamily: FONT_STACK.bebas, fontSize: 80, color: C.cyan }}>100+ ECUs</div>
                            <div style={{ fontFamily: FONT_STACK.inter, fontSize: 22, color: C.white, fontWeight: 600 }}>Electronic Control Units</div>
                            <div style={{ fontFamily: FONT_STACK.mono, fontSize: 16, color: C.textMuted, marginTop: 8 }}>Controlling brakes, seats, motor output, and high beams.</div>
                        </div>

                        <div style={{
                            backgroundColor: C.cardBg, padding: 44, borderRadius: 24,
                            border: `1px solid ${C.gold}`, backdropFilter: 'blur(20px)'
                        }}>
                            <div style={{ fontFamily: FONT_STACK.bebas, fontSize: 80, color: C.gold }}>100M+ LINES</div>
                            <div style={{ fontFamily: FONT_STACK.inter, fontSize: 22, color: C.white, fontWeight: 600 }}>Software Codebase</div>
                            <div style={{ fontFamily: FONT_STACK.mono, fontSize: 16, color: C.textMuted, marginTop: 8 }}>More lines of code than a modern fighter jet.</div>
                        </div>
                    </div>
                </div>
            </DynamicCamera>
        </AbsoluteFill>
    );
};

// ─── SEGMENT 8: CONSUMER & LEGAL BACKLASH (B-Roll: Crowd) ───

const SceneEight: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(7);

    return (
        <AbsoluteFill>
            <BRollBackground videoPath="broll_crowd.mp4" overlayOpacity={0.7} />
            <DynamicCamera duration={S8} mode="panRight">
                <div style={{ position: 'absolute', inset: 80, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ fontFamily: FONT_STACK.mono, color: C.red, fontSize: 22, letterSpacing: 4, marginBottom: 15 }}>
                        RIGHT TO REPAIR LEGISLATION
                    </div>
                    <div style={{ fontFamily: font, fontSize: 110, color: C.white, lineHeight: 0.95, textShadow: '0 20px 50px rgba(0,0,0,0.9)' }}>
                        THE CONSUMER & LEGAL <span style={{ color: C.red }}>BACKLASH</span>
                    </div>
                    <div style={{ fontFamily: FONT_STACK.inter, fontSize: 26, color: C.textMuted, marginTop: 30, maxWidth: 1100 }}>
                        State legislatures and consumer groups are introducing bills to ban monthly fees on pre-installed hardware.
                    </div>
                </div>
            </DynamicCamera>
        </AbsoluteFill>
    );
};

// ─── SEGMENT 9: THE EXPANDING MONETIZATION MENU (B-Roll: Cyborg Tech) ───

const SceneNine: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(0);

    return (
        <AbsoluteFill>
            <BRollBackground videoPath="broll_cyborg.mp4" overlayOpacity={0.65} />
            <DynamicCamera duration={S9} mode="zoomOut">
                <div style={{ position: 'absolute', inset: 80, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ marginBottom: 40 }}>
                        <div style={{ fontFamily: FONT_STACK.mono, color: C.gold, fontSize: 22, letterSpacing: 4 }}>
                            FUTURE SUBSCRIPTION MENU
                        </div>
                        <div style={{ fontFamily: font, fontSize: 100, color: C.white, lineHeight: 0.95 }}>
                            EVERY FEATURE AS A <span style={{ color: C.gold }}>MICRO-TRANSACTION</span>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 25 }}>
                        {[
                            { name: 'Rear Steering', price: '$500 / yr', color: C.blue },
                            { name: 'Adaptive High Beams', price: '$25 / mo', color: C.gold },
                            { name: 'Hands-Free Pilot', price: '$200 / mo', color: C.cyan },
                            { name: 'Audio Equalizer', price: '$10 / mo', color: C.purple }
                        ].map((item, idx) => {
                            const iFrame = frame - 15 - (idx * 12);
                            const iSpr = iFrame > 0 ? spring({ frame: iFrame, fps: 30 }) : 0;
                            return (
                                <div key={idx} style={{
                                    backgroundColor: C.cardBg, padding: 30, borderRadius: 20,
                                    border: `1px solid ${item.color}`, backdropFilter: 'blur(20px)',
                                    transform: `scale(${iSpr})`, textAlign: 'center'
                                }}>
                                    <div style={{ fontFamily: FONT_STACK.bebas, fontSize: 28, color: C.white }}>{item.name}</div>
                                    <div style={{ fontFamily: FONT_STACK.mono, fontSize: 20, color: item.color, marginTop: 8 }}>{item.price}</div>
                                    {iFrame === 1 && <Audio src={staticFile('sfx/pop.mp3')} volume={0.6} />}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </DynamicCamera>
        </AbsoluteFill>
    );
};

// ─── SEGMENT 10: THE END OF OWNERSHIP (B-Roll: Financial Matrix) ───

const SceneTen: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(1);

    const sprMain = spring({ frame: frame - 10, fps: 30, config: { damping: 10 } });

    return (
        <AbsoluteFill>
            <BRollBackground videoPath="debt_bg_5.mp4" overlayOpacity={0.65} />
            <DynamicCamera duration={S10} mode="zoomIn">
                <div style={{ position: 'absolute', inset: 0, justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', textAlign: 'center', padding: 80 }}>
                    <div style={{
                        fontFamily: FONT_STACK.mono, fontSize: 24, color: C.red, letterSpacing: 6, marginBottom: 20,
                        textTransform: 'uppercase'
                    }}>
                        Conclusion
                    </div>

                    <div style={{
                        fontFamily: font, fontSize: 115, color: C.white, lineHeight: 0.95,
                        transform: `scale(${sprMain})`, textShadow: '0 25px 60px rgba(0,0,0,0.95)'
                    }}>
                        CAN YOU AFFORD THE <br />
                        <span style={{ color: C.gold, backgroundColor: C.red, padding: '0 15px', borderRadius: 8 }}>
                            MONTHLY RENT
                        </span> FOR YOUR OWN CAR?
                    </div>

                    <div style={{
                        fontFamily: FONT_STACK.inter, fontSize: 34, color: C.cyan, marginTop: 35, fontWeight: 600,
                        textShadow: '0 10px 30px rgba(0,0,0,0.8)'
                    }}>
                        The Boundary Between Owning and Licensing Has Erased.
                    </div>
                </div>
            </DynamicCamera>
        </AbsoluteFill>
    );
};

// ─── MAIN COMPOSITION ROOT ──────────────────────────────

export const CarSubscriptions: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#080C14' }}>
            <style>{FONT_IMPORT}</style>

            {/* Segment 1 */}
            <Sequence from={F1} durationInFrames={S1}>
                <SceneOne />
                <Audio src={staticFile('car_vo_1.mp3')} />
            </Sequence>

            {/* Segment 2 */}
            <Sequence from={F2} durationInFrames={S2}>
                <SceneTwo />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('car_vo_2.mp3')} />
            </Sequence>

            {/* Segment 3 */}
            <Sequence from={F3} durationInFrames={S3}>
                <SceneThree />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('car_vo_3.mp3')} />
            </Sequence>

            {/* Segment 4 */}
            <Sequence from={F4} durationInFrames={S4}>
                <SceneFour />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('car_vo_4.mp3')} />
            </Sequence>

            {/* Segment 5 */}
            <Sequence from={F5} durationInFrames={S5}>
                <SceneFive />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('car_vo_5.mp3')} />
            </Sequence>

            {/* Segment 6 */}
            <Sequence from={F6} durationInFrames={S6}>
                <SceneSix />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('car_vo_6.mp3')} />
            </Sequence>

            {/* Segment 7 */}
            <Sequence from={F7} durationInFrames={S7}>
                <SceneSeven />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('car_vo_7.mp3')} />
            </Sequence>

            {/* Segment 8 */}
            <Sequence from={F8} durationInFrames={S8}>
                <SceneEight />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('car_vo_8.mp3')} />
            </Sequence>

            {/* Segment 9 */}
            <Sequence from={F9} durationInFrames={S9}>
                <SceneNine />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('car_vo_9.mp3')} />
            </Sequence>

            {/* Segment 10 */}
            <Sequence from={F10} durationInFrames={S10}>
                <SceneTen />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('car_vo_10.mp3')} />
            </Sequence>
        </AbsoluteFill>
    );
};
