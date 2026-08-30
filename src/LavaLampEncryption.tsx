import React from 'react';
import {
    AbsoluteFill, useCurrentFrame, interpolate, spring,
    Audio, OffthreadVideo, staticFile, Sequence
} from 'remotion';
import { FONT_IMPORT, FONT_STACK, getFontForScene } from './components/PremiumKit';

// ─── COLOR PALETTE ────────────────────────────────────
const C = {
    bg: '#080C14',
    cardBg: 'rgba(15, 23, 42, 0.88)',
    lavaRed: '#EF4444',
    lavaOrange: '#F59E0B',
    lavaCyan: '#06B6D4',
    emerald: '#10B981',
    purple: '#8B5CF6',
    white: '#FFFFFF',
    textMuted: '#94A3B8',
    border: 'rgba(255, 255, 255, 0.16)'
};

// Segment frame constants
const S1 = 415, S2 = 571, S3 = 554, S4 = 352, S5 = 320, S6 = 290;
const F1 = 0;
const F2 = F1 + S1;
const F3 = F2 + S2;
const F4 = F3 + S3;
const F5 = F4 + S4;
const F6 = F5 + S5;
const TOTAL_FRAMES = F6 + S6; // 2502 frames (~83.4s)

// ─── ANIMATED SVG LAVA LAMP VECTOR GRAPHIC ────────────

const AnimatedLavaLampSVG: React.FC<{ frame: number; color?: string }> = ({ frame, color = C.lavaOrange }) => {
    const y1 = Math.sin(frame * 0.08) * 15 + 45;
    const y2 = Math.cos(frame * 0.06) * 20 + 65;

    return (
        <svg width="140" height="220" viewBox="0 0 100 160">
            {/* Glass Container */}
            <path d="M 30,20 L 70,20 L 80,120 L 20,120 Z" fill="rgba(245,158,11,0.08)" stroke={color} strokeWidth="3" />
            {/* Top & Base */}
            <rect x="25" y="10" width="50" height="10" rx="3" fill={color} />
            <rect x="15" y="120" width="70" height="25" rx="4" fill={color} />
            {/* Animated Fluid Blobs */}
            <circle cx="50" cy={y1} r="14" fill={C.lavaRed} opacity="0.85" />
            <circle cx="42" cy={y2} r="18" fill={color} opacity="0.85" />
            <circle cx="58" cy={y1 + 10} r="10" fill={C.lavaCyan} opacity="0.75" />
        </svg>
    );
};

// ─── HAND-DRAWN UNDERLINE ──────────────────────────────

const HandDrawnUnderline: React.FC<{ progress: number; color?: string }> = ({ progress, color = C.lavaOrange }) => {
    const dash = 400;
    const offset = dash * (1 - progress);
    return (
        <svg width="340" height="24" viewBox="0 0 340 24" style={{ marginTop: 6 }}>
            <path
                d="M 10,12 Q 90,22 170,10 T 330,14"
                fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
                strokeDasharray={dash} strokeDashoffset={offset}
            />
        </svg>
    );
};

// ─── SCENE 1: THE LAVA LAMP WALL (San Francisco HQ) ────

const SceneOne: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(0);

    const typeProg = interpolate(frame, [15, 140], [0, 1], { extrapolateRight: 'clamp' });
    const lineProg = interpolate(frame, [90, 160], [0, 1], { extrapolateRight: 'clamp' });
    const sprCard = spring({ frame: frame - 10, fps: 30 });
    const camScale = interpolate(frame, [0, S1], [1.0, 1.08]);

    const titleText = "100 REAL LAVA LAMPS";
    const charsToShow = Math.floor(titleText.length * typeProg);

    return (
        <AbsoluteFill>
            <OffthreadVideo
                src={staticFile('broll_data_center.mp4')}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${camScale})` }}
                muted
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(8,12,20,0.9) 0%, rgba(8,12,20,0.72) 50%, rgba(8,12,20,0.92) 100%)' }} />

            {frame > 15 && frame < 140 && (
                <Audio src={staticFile('sfx/typing.mp3')} volume={0.35} />
            )}

            <div style={{
                position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex',
                gap: 50, alignItems: 'center', boxSizing: 'border-box'
            }}>
                <div style={{ flex: 1.2, boxSizing: 'border-box' }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, color: C.lavaOrange, fontSize: 38, marginBottom: 8 }}>
                        Cloudflare San Francisco HQ
                    </div>

                    <div style={{
                        fontFamily: font, fontSize: 85, color: C.white, lineHeight: 1.08,
                        maxWidth: 1100, wordBreak: 'break-word'
                    }}>
                        {titleText.slice(0, charsToShow)}
                    </div>

                    <HandDrawnUnderline progress={lineProg} color={C.lavaOrange} />

                    <div style={{ fontFamily: FONT_STACK.inter, fontSize: 22, color: C.textMuted, marginTop: 22, maxWidth: 900, lineHeight: 1.5 }}>
                        Actively encrypting twenty percent of all internet traffic.
                    </div>
                </div>

                <div style={{
                    flex: 0.9, backgroundColor: C.cardBg, padding: 36, borderRadius: 28,
                    border: `1px stroke ${C.lavaOrange}`, backdropFilter: 'blur(20px)',
                    transform: `scale(${sprCard})`, display: 'flex', gap: 20, justifyContent: 'center',
                    alignItems: 'center', boxShadow: '0 30px 70px rgba(245, 158, 11, 0.25)', boxSizing: 'border-box'
                }}>
                    <AnimatedLavaLampSVG frame={frame} color={C.lavaRed} />
                    <AnimatedLavaLampSVG frame={frame + 30} color={C.lavaOrange} />
                    <AnimatedLavaLampSVG frame={frame + 60} color={C.lavaCyan} />
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 2: THE DETERMINISTIC RANDOMNESS PROBLEM ───

const SceneTwo: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(1);

    const sprCard = spring({ frame: frame - 15, fps: 30 });
    const camScale = interpolate(frame, [0, S2], [1.08, 1.01]);

    return (
        <AbsoluteFill>
            <OffthreadVideo
                src={staticFile('broll_code.mp4')}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${camScale})` }}
                muted
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,12,20,0.85)' }} />

            <div style={{
                position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex',
                gap: 50, alignItems: 'center', boxSizing: 'border-box'
            }}>
                <div style={{ flex: 1.1, boxSizing: 'border-box' }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, color: C.lavaRed, fontSize: 36 }}>
                        The Cybersecurity Flaw
                    </div>
                    <div style={{ fontFamily: font, fontSize: 80, color: C.white, lineHeight: 1.08, marginTop: 8, wordBreak: 'break-word' }}>
                        COMPUTERS CANNOT MAKE <span style={{ color: C.lavaRed }}>TRUE RANDOMNESS</span>
                    </div>
                    <div style={{ fontFamily: FONT_STACK.inter, fontSize: 20, color: C.textMuted, marginTop: 18, lineHeight: 1.5 }}>
                        Deterministic code follows rules—allowing hackers to predict pseudo-random numbers.
                    </div>
                </div>

                <div style={{
                    flex: 1, backgroundColor: C.cardBg, padding: 40, borderRadius: 24,
                    border: `1px stroke ${C.lavaRed}`, backdropFilter: 'blur(20px)',
                    transform: `scale(${sprCard})`, boxSizing: 'border-box', textAlign: 'center'
                }}>
                    <div style={{ fontFamily: FONT_STACK.mono, fontSize: 16, color: C.lavaRed, marginBottom: 12 }}>PSEUDO-RANDOM CODE FLAW</div>
                    <div style={{ fontFamily: FONT_STACK.mono, fontSize: 22, color: C.white, backgroundColor: 'rgba(239, 68, 68, 0.15)', padding: 20, borderRadius: 12 }}>
                        Math.random() == PREDICTABLE
                    </div>
                    <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 30, color: C.lavaOrange, marginTop: 15 }}>
                        Requires Physical Fluid Chaos
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 3: LAVARAND & PIXEL FLUID DYNAMICS ────────

const SceneThree: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(2);

    const sprCard = spring({ frame: frame - 15, fps: 30 });

    return (
        <AbsoluteFill>
            <OffthreadVideo
                src={staticFile('broll_cyborg.mp4')}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                muted
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,12,20,0.85)' }} />

            <div style={{
                position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex',
                gap: 50, alignItems: 'center', boxSizing: 'border-box'
            }}>
                <div style={{ flex: 1.1, boxSizing: 'border-box' }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, color: C.lavaCyan, fontSize: 36 }}>
                        High-Resolution Camera Sensor
                    </div>
                    <div style={{ fontFamily: font, fontSize: 80, color: C.white, lineHeight: 1.08, marginTop: 8, wordBreak: 'break-word' }}>
                        CAPTURING <span style={{ color: C.lavaCyan }}>LAVARAND</span> PIXEL FLUIDS
                    </div>
                    <div style={{ fontFamily: FONT_STACK.inter, fontSize: 20, color: C.textMuted, marginTop: 18, lineHeight: 1.5 }}>
                        Converting wax blob motions and room light shifts into true random seeds.
                    </div>
                </div>

                <div style={{
                    flex: 1, backgroundColor: C.cardBg, padding: 36, borderRadius: 24,
                    border: `1px stroke ${C.lavaCyan}`, backdropFilter: 'blur(20px)',
                    transform: `scale(${sprCard})`, display: 'flex', gap: 20, justifyContent: 'center'
                }}>
                    <AnimatedLavaLampSVG frame={frame * 1.5} color={C.lavaCyan} />
                    <AnimatedLavaLampSVG frame={frame * 1.8 + 40} color={C.emerald} />
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 4: CRYPTOGRAPHIC HASH GENERATION ───────────

const SceneFour: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(0);

    const hashVal = (0x8F3A2C + Math.floor(frame * 137.5)).toString(16).toUpperCase();

    return (
        <AbsoluteFill style={{ backgroundColor: C.bg }}>
            <div style={{
                position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex',
                gap: 50, alignItems: 'center', boxSizing: 'border-box'
            }}>
                <div style={{ flex: 1.1, boxSizing: 'border-box' }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, color: C.emerald, fontSize: 36 }}>
                        Microsecond Seed Key Conversion
                    </div>
                    <div style={{ fontFamily: font, fontSize: 80, color: C.white, lineHeight: 1.08, marginTop: 8, wordBreak: 'break-word' }}>
                        MILITARY-GRADE <span style={{ color: C.emerald }}>CRYPTOGRAPHIC HASH</span>
                    </div>
                    <div style={{ fontFamily: FONT_STACK.inter, fontSize: 20, color: C.textMuted, marginTop: 18, lineHeight: 1.5 }}>
                        Translating random RGB pixel noise into unhackable encryption keys.
                    </div>
                </div>

                <div style={{
                    flex: 1, backgroundColor: C.cardBg, padding: 40, borderRadius: 24,
                    border: `1px stroke ${C.emerald}`, backdropFilter: 'blur(20px)',
                    boxSizing: 'border-box', textAlign: 'center'
                }}>
                    <div style={{ fontFamily: FONT_STACK.mono, fontSize: 16, color: C.emerald, marginBottom: 12 }}>LIVE SEED KEY GENERATOR</div>
                    <div style={{ fontFamily: FONT_STACK.mono, fontSize: 36, color: C.white, fontWeight: 700 }}>
                        0x{hashVal}99F4A
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 5: HUMAN FOOTSTEP ENTROPY ──────────────────

const SceneFive: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(1);

    return (
        <AbsoluteFill>
            <OffthreadVideo
                src={staticFile('broll_crowd.mp4')}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                muted
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,12,20,0.85)' }} />

            <div style={{
                position: 'absolute', inset: 0, padding: '100px 140px', display: 'flex',
                flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box'
            }}>
                <div style={{ fontFamily: FONT_STACK.handwritten, color: C.purple, fontSize: 38, marginBottom: 8 }}>
                    Human Interactivity & Shadows
                </div>

                <div style={{
                    fontFamily: font, fontSize: 82, color: C.white, lineHeight: 1.08,
                    maxWidth: 1300, wordBreak: 'break-word'
                }}>
                    HUMAN FOOTSTEPS ADD <span style={{ color: C.purple }}>EVEN MORE ENTROPY</span>
                </div>

                <div style={{ fontFamily: FONT_STACK.inter, fontSize: 22, color: C.textMuted, marginTop: 22, maxWidth: 950, lineHeight: 1.5 }}>
                    Visitors walking by create shadow shifts that make the keys even more impossible to predict.
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 6: CLOSING REVELATION ──────────────────────

const SceneSix: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(2);

    const sprMain = spring({ frame: frame - 10, fps: 30, config: { damping: 10 } });

    return (
        <AbsoluteFill>
            <OffthreadVideo
                src={staticFile('money_bg_1.mp4')}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                muted
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,12,20,0.88)' }} />

            <div style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                justify: 'center', alignItems: 'center', textAlign: 'center', padding: '100px 140px',
                boxSizing: 'border-box'
            }}>
                <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 40, color: C.lavaOrange, marginBottom: 12 }}>
                    Protecting Your Online Data
                </div>

                <div style={{
                    fontFamily: font, fontSize: 88, color: C.white, lineHeight: 1.08,
                    transform: `scale(${sprMain})`, textShadow: '0 25px 60px rgba(0,0,0,0.95)',
                    maxWidth: 1300, wordBreak: 'break-word'
                }}>
                    GUARDED BY <span style={{ color: C.lavaRed, backgroundColor: 'rgba(239, 68, 68, 0.2)', padding: '2px 14px', borderRadius: 10 }}>100 1960s LAVA LAMPS</span>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── MAIN COMPOSITION ROOT ──────────────────────────────

export const LavaLampEncryption: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: C.bg }}>
            <style>{FONT_IMPORT}</style>

            {/* Segment 1 */}
            <Sequence from={F1} durationInFrames={S1}>
                <SceneOne />
                <Audio src={staticFile('lava_vo_1.mp3')} />
            </Sequence>

            {/* Segment 2 */}
            <Sequence from={F2} durationInFrames={S2}>
                <SceneTwo />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('lava_vo_2.mp3')} />
            </Sequence>

            {/* Segment 3 */}
            <Sequence from={F3} durationInFrames={S3}>
                <SceneThree />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('lava_vo_3.mp3')} />
            </Sequence>

            {/* Segment 4 */}
            <Sequence from={F4} durationInFrames={S4}>
                <SceneFour />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('sfx/pop.mp3')} volume={0.7} />
                <Audio src={staticFile('lava_vo_4.mp3')} />
            </Sequence>

            {/* Segment 5 */}
            <Sequence from={F5} durationInFrames={S5}>
                <SceneFive />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('lava_vo_5.mp3')} />
            </Sequence>

            {/* Segment 6 */}
            <Sequence from={F6} durationInFrames={S6}>
                <SceneSix />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('sfx/rise.mp3')} volume={0.8} />
                <Audio src={staticFile('lava_vo_6.mp3')} />
            </Sequence>
        </AbsoluteFill>
    );
};
