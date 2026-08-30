import React from 'react';
import {
    AbsoluteFill, useCurrentFrame, interpolate, spring,
    Audio, staticFile, Sequence
} from 'remotion';
import { FONT_IMPORT, FONT_STACK } from './components/PremiumKit';

// ─── UNSEEN SYSTEM STUDIO COLOR PALETTE ─────────────────
const C = {
    bgSky: '#BAE6FD',       // Soft Cyan Sky
    bgYellow: '#FEF08A',    // Vibrant Pastel Yellow
    bgPurple: '#DDD6FE',    // Pastel Purple
    bgMint: '#A7F3D0',      // Pastel Mint
    cardBg: '#FFFBEB',      // Cream White
    outline: '#0F172A',     // Bold Dark Outline
    bobShirt: '#3B82F6',    // Bright Blue
    aliceDress: '#EC4899',  // Bright Pink
    skin: '#FDBA74',        // Warm Peach
    emerald: '#10B981',
    gold: '#F59E0B',
    red: '#EF4444',
    purple: '#8B5CF6'
};

// Segment frame constants with Intro (90f) and Outro (120f)
const INTRO_FRAMES = 90;
const S1 = 439, S2 = 456, S3 = 412, S4 = 423, S5 = 355;
const OUTRO_FRAMES = 120;

const F_INTRO = 0;
const F1 = F_INTRO + INTRO_FRAMES;
const F2 = F1 + S1;
const F3 = F2 + S2;
const F4 = F3 + S3;
const F5 = F4 + S4;
const F_OUTRO = F5 + S5;
const TOTAL_FRAMES = F_OUTRO + OUTRO_FRAMES; // 2295 frames (~76.5s)

// ─── 1. ANIMATED CARTOON INTRO CARD (UNSEEN SYSTEM) ────

const UnseenIntroCard: React.FC = () => {
    const frame = useCurrentFrame();
    const sprLogo = spring({ frame: frame - 10, fps: 30, config: { damping: 10 } });
    const sprText = spring({ frame: frame - 25, fps: 30 });

    return (
        <AbsoluteFill style={{ backgroundColor: '#0F172A', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            {frame === 10 && <Audio src={staticFile('sfx/pop.mp3')} volume={0.7} />}
            {frame === 25 && <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />}

            {/* Logo Badge */}
            <div style={{
                transform: `scale(${sprLogo})`, width: 100, height: 100, borderRadius: 30,
                backgroundColor: C.gold, display: 'flex', justifyContent: 'center', alignItems: 'center',
                boxShadow: '0 20px 50px rgba(245, 158, 11, 0.4)', marginBottom: 24, border: `4px stroke ${C.cardBg}`
            }}>
                <span style={{ fontFamily: FONT_STACK.bebas, fontSize: 60, color: '#0F172A' }}>U</span>
            </div>

            <div style={{ transform: `scale(${sprText})` }}>
                <div style={{ fontFamily: FONT_STACK.mono, fontSize: 24, color: C.gold, letterSpacing: '0.25em', marginBottom: 8 }}>
                    UNSEEN SYSTEM PRESENTS
                </div>
                <div style={{ fontFamily: FONT_STACK.display, fontSize: 80, color: '#FFFFFF', lineHeight: 1.05 }}>
                    THE $5 COMPOUNDING SECRET
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── 2. CARTOON CIRCLE WIPE TRANSITION ─────────────────

const CartoonCircleWipe: React.FC<{ progress: number }> = ({ progress }) => {
    const radius = interpolate(progress, [0, 1], [0, 1400]);

    return (
        <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 99,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <div style={{
                width: radius * 2, height: radius * 2, borderRadius: '50%',
                backgroundColor: C.outline, transform: 'scale(1)'
            }} />
        </div>
    );
};

// ─── 3. GOLD CONFETTI & SPARKLE PARTICLES ──────────────

const GoldConfettiBurst: React.FC<{ frame: number }> = ({ frame }) => {
    const particles = [
        { x: 300, y: 200, size: 14, color: C.gold },
        { x: 600, y: 150, size: 18, color: C.emerald },
        { x: 1200, y: 250, size: 16, color: C.red },
        { x: 1500, y: 180, size: 20, color: C.gold },
        { x: 450, y: 500, size: 15, color: C.purple },
        { x: 1350, y: 520, size: 18, color: C.emerald },
    ];

    return (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {particles.map((p, idx) => {
                const dy = Math.sin(frame * 0.15 + idx) * 20;
                const rot = (frame * 6 + idx * 45) % 360;
                return (
                    <div key={idx} style={{
                        position: 'absolute', left: p.x, top: p.y + dy,
                        width: p.size, height: p.size, backgroundColor: p.color,
                        borderRadius: idx % 2 === 0 ? '50%' : '3px',
                        transform: `rotate(${rot}deg)`, border: `2px stroke ${C.outline}`
                    }} />
                );
            })}
        </div>
    );
};

// ─── 4. RIGGED BOB & ALICE CARTOON CHARACTERS ──────────

const CartoonBob: React.FC<{ frame: number; expression?: 'neutral' | 'sad' | 'shocked'; armPos?: 'down' | 'coffee' | 'pointing' }> = ({
    frame, expression = 'neutral', armPos = 'down'
}) => {
    const bobY = Math.sin(frame * 0.2) * 6;
    const isBlinking = frame % 75 < 5;
    const mouthH = Math.abs(Math.sin(frame * 0.5)) * 10 + 4;
    const eyebrowRot = expression === 'shocked' ? -14 : expression === 'sad' ? 12 : 0;

    return (
        <svg width="180" height="240" viewBox="0 0 100 140" style={{ transform: `translateY(${bobY}px)` }}>
            {/* Shirt */}
            <path d="M 25,75 L 75,75 L 82,130 L 18,130 Z" fill={C.bobShirt} stroke={C.outline} strokeWidth="4" strokeLinejoin="round" />
            
            {/* Arms */}
            {armPos === 'coffee' && (
                <rect x="74" y="94" width="18" height="24" rx="4" fill="#F97316" stroke={C.outline} strokeWidth="3" />
            )}
            {armPos === 'pointing' && (
                <path d="M 75,85 L 95,70" stroke={C.outline} strokeWidth="5" strokeLinecap="round" />
            )}

            {/* Head */}
            <circle cx="50" cy="45" r="26" fill={C.skin} stroke={C.outline} strokeWidth="4" />
            <path d="M 26,38 Q 32,15 50,15 Q 68,15 74,38 Z" fill="#78350F" stroke={C.outline} strokeWidth="3" />
            
            {/* Eyebrows */}
            <line x1="34" y1="34" x2="46" y2="34" stroke={C.outline} strokeWidth="3.5" strokeLinecap="round" style={{ transform: `rotate(${eyebrowRot}deg)`, transformOrigin: '40px 34px' }} />
            <line x1="54" y1="34" x2="66" y2="34" stroke={C.outline} strokeWidth="3.5" strokeLinecap="round" style={{ transform: `rotate(${-eyebrowRot}deg)`, transformOrigin: '60px 34px' }} />

            {/* Eyes */}
            {!isBlinking ? (
                <>
                    <circle cx="40" cy="42" r="4.5" fill={C.outline} />
                    <circle cx="60" cy="42" r="4.5" fill={C.outline} />
                </>
            ) : (
                <>
                    <line x1="35" y1="42" x2="45" y2="42" stroke={C.outline} strokeWidth="3" />
                    <line x1="55" y1="42" x2="65" y2="42" stroke={C.outline} strokeWidth="3" />
                </>
            )}

            {/* Mouth */}
            {expression === 'neutral' && <ellipse cx="50" cy="58" rx="7" ry={mouthH / 2} fill={C.outline} />}
            {expression === 'sad' && <path d="M 40,62 Q 50,54 60,62" fill="none" stroke={C.outline} strokeWidth="3" strokeLinecap="round" />}
            {expression === 'shocked' && <circle cx="50" cy="60" r="9" fill={C.outline} />}
        </svg>
    );
};

const CartoonAlice: React.FC<{ frame: number; expression?: 'happy' | 'confident'; item?: 'piggyBank' | 'chart' | 'none' }> = ({
    frame, expression = 'happy', item = 'none'
}) => {
    const bobY = Math.sin(frame * 0.2 + 1.5) * 6;
    const isBlinking = frame % 85 < 5;

    return (
        <svg width="180" height="240" viewBox="0 0 100 140" style={{ transform: `translateY(${bobY}px)` }}>
            <path d="M 25,75 L 75,75 L 85,130 L 15,130 Z" fill={C.aliceDress} stroke={C.outline} strokeWidth="4" strokeLinejoin="round" />
            {item === 'piggyBank' && <circle cx="80" cy="105" r="14" fill="#EC4899" stroke={C.outline} strokeWidth="3" />}
            <circle cx="50" cy="45" r="26" fill={C.skin} stroke={C.outline} strokeWidth="4" />
            <path d="M 20,45 Q 25,10 50,10 Q 75,10 80,45 Q 85,70 75,80 L 25,80 Q 15,70 20,45 Z" fill="#FACC15" stroke={C.outline} strokeWidth="3" />
            {!isBlinking ? (
                <>
                    <circle cx="40" cy="44" r="4.5" fill={C.outline} />
                    <circle cx="60" cy="44" r="4.5" fill={C.outline} />
                </>
            ) : (
                <>
                    <line x1="35" y1="44" x2="45" y2="44" stroke={C.outline} strokeWidth="3" />
                    <line x1="55" y1="44" x2="65" y2="44" stroke={C.outline} strokeWidth="3" />
                </>
            )}
            <path d="M 40,58 Q 50,68 60,58 Z" fill={C.red} stroke={C.outline} strokeWidth="3" />
        </svg>
    );
};

// ─── SCENE 1: MEET BOB & ALICE (Sub-1.2s Motion Drops) ───

const SceneOne: React.FC = () => {
    const frame = useCurrentFrame();

    // Sub-1.2s Micro State Changes:
    // T1 (0.8s / frame 24): Bob coffee cup pops in
    // T2 (1.6s / frame 48): Alice piggy bank pops in
    // T3 (2.4s / frame 72): Expression shift Bob neutral -> sad
    // T4 (3.6s / frame 108): Typewriter text pop
    const hasCoffee = frame >= 24;
    const hasPiggy = frame >= 48;
    const bobExp = frame >= 72 ? 'sad' : 'neutral';

    const sprBob = spring({ frame: frame - 10, fps: 30 });
    const sprAlice = spring({ frame: frame - 25, fps: 30 });
    const typeProg = interpolate(frame, [15, 130], [0, 1], { extrapolateRight: 'clamp' });

    const titleText = "BOB AND ALICE: TWO DESTINIES";
    const charsToShow = Math.floor(titleText.length * typeProg);

    return (
        <AbsoluteFill style={{ backgroundColor: C.bgSky }}>
            {frame === 24 && <Audio src={staticFile('sfx/pop.mp3')} volume={0.7} />}
            {frame === 48 && <Audio src={staticFile('sfx/pop 2.mp3')} volume={0.7} />}
            {frame > 15 && frame < 130 && <Audio src={staticFile('sfx/typing.mp3')} volume={0.35} />}

            <div style={{
                position: 'absolute', inset: 0, padding: '100px 130px 90px', display: 'flex',
                gap: 50, alignItems: 'center', boxSizing: 'border-box'
            }}>
                <div style={{ flex: 1.1, display: 'flex', gap: 30 }}>
                    <div style={{ transform: `scale(${sprBob})`, backgroundColor: C.cardBg, padding: 24, borderRadius: 28, border: `4px stroke ${C.outline}` }}>
                        <CartoonBob frame={frame} expression={bobExp} armPos={hasCoffee ? 'coffee' : 'down'} />
                        <div style={{ textAlign: 'center', fontFamily: FONT_STACK.handwritten, fontSize: 28, color: C.outline, marginTop: 8 }}>Bob</div>
                    </div>

                    <div style={{ transform: `scale(${sprAlice})`, backgroundColor: C.cardBg, padding: 24, borderRadius: 28, border: `4px stroke ${C.outline}` }}>
                        <CartoonAlice frame={frame} expression="happy" item={hasPiggy ? 'piggyBank' : 'none'} />
                        <div style={{ textAlign: 'center', fontFamily: FONT_STACK.handwritten, fontSize: 28, color: C.outline, marginTop: 8 }}>Alice</div>
                    </div>
                </div>

                <div style={{ flex: 1, boxSizing: 'border-box' }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, color: C.outline, fontSize: 38, marginBottom: 8 }}>
                        Same Corporate Job. Same Salary.
                    </div>
                    <div style={{ fontFamily: FONT_STACK.display, fontSize: 75, color: C.outline, lineHeight: 1.05 }}>
                        {titleText.slice(0, charsToShow)}
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 2: THE $5 HABIT (Sub-1.2s Motion Drops) ──────

const SceneTwo: React.FC = () => {
    const frame = useCurrentFrame();

    // Micro State Shifts:
    // T1 (30f): Bob's card pops
    // T2 (60f): Alice's card pops
    // T3 (90f): Micro-Zoom shift
    const sprBobCard = spring({ frame: frame - 15, fps: 30 });
    const sprAliceCard = spring({ frame: frame - 40, fps: 30 });
    const camZoom = interpolate(frame, [0, S2], [1.0, 1.05]);

    return (
        <AbsoluteFill style={{ backgroundColor: C.bgYellow, transform: `scale(${camZoom})` }}>
            {frame === 15 && <Audio src={staticFile('sfx/pop.mp3')} volume={0.7} />}
            {frame === 40 && <Audio src={staticFile('sfx/pop 2.mp3')} volume={0.7} />}

            <div style={{
                position: 'absolute', inset: 0, padding: '100px 130px 90px', display: 'flex',
                gap: 50, alignItems: 'center', boxSizing: 'border-box'
            }}>
                <div style={{ flex: 1, transform: `scale(${sprBobCard})`, backgroundColor: C.cardBg, padding: 36, borderRadius: 32, border: `4px stroke ${C.outline}` }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 36, color: C.red }}>Bob's Morning Routine</div>
                    <div style={{ fontFamily: FONT_STACK.display, fontSize: 54, color: C.outline, marginTop: 8 }}>$5 Latte + $10 Gadgets</div>
                    <div style={{ fontFamily: FONT_STACK.mono, fontSize: 22, color: C.red, marginTop: 12 }}>DEPRECIATING ASSETS</div>
                </div>

                <div style={{ flex: 1, transform: `scale(${sprAliceCard})`, backgroundColor: C.cardBg, padding: 36, borderRadius: 32, border: `4px stroke ${C.outline}` }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 36, color: C.emerald }}>Alice's Morning Routine</div>
                    <div style={{ fontFamily: FONT_STACK.display, fontSize: 54, color: C.outline, marginTop: 8 }}>Automates $5/Day</div>
                    <div style={{ fontFamily: FONT_STACK.mono, fontSize: 22, color: C.emerald, marginTop: 12 }}>COMPOUNDING INDEX FUNDS</div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 3: 10 YEARS PASS (REAL-TIME COUNTING TICKER) ──

const SceneThree: React.FC = () => {
    const frame = useCurrentFrame();

    // Micro State Shifts:
    // T1 (10f): Count up starts
    // T2 (80f): Bob expression -> shocked
    const countVal = Math.min(25000, Math.floor(interpolate(frame, [10, 120], [0, 25000])));
    const bobExp = frame >= 80 ? 'shocked' : 'sad';

    return (
        <AbsoluteFill style={{ backgroundColor: C.bgPurple }}>
            <div style={{
                position: 'absolute', inset: 0, padding: '100px 130px 90px', display: 'flex',
                gap: 50, alignItems: 'center', boxSizing: 'border-box'
            }}>
                <div style={{ flex: 1 }}>
                    <CartoonBob frame={frame} expression={bobExp} armPos="pointing" />
                </div>

                <div style={{ flex: 1.2, backgroundColor: C.cardBg, padding: 40, borderRadius: 32, border: `5px stroke ${C.outline}`, textAlign: 'center' }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 38, color: C.outline }}>10 Years Later</div>
                    <div style={{ fontFamily: FONT_STACK.display, fontSize: 80, color: C.purple }}>
                        ALICE: ${countVal.toLocaleString()}
                    </div>
                    <div style={{ fontFamily: FONT_STACK.mono, fontSize: 20, color: C.red, marginTop: 10 }}>Bob's Gadgets: $0 Value</div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 4: 30 YEARS PASS ($1.2M PAYOFF + CONFETTI) ──

const SceneFour: React.FC = () => {
    const frame = useCurrentFrame();

    // Micro State Shifts:
    // T1 (10f): Count up $0 -> $1,200,000
    // T2 (90f): Confetti burst pops
    const countVal = Math.min(1200000, Math.floor(interpolate(frame, [10, 130], [25000, 1200000])));
    const hasConfetti = frame >= 90;

    return (
        <AbsoluteFill style={{ backgroundColor: C.bgMint }}>
            {hasConfetti && <GoldConfettiBurst frame={frame} />}

            <div style={{
                position: 'absolute', inset: 0, padding: '100px 130px 90px', display: 'flex',
                flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                boxSizing: 'border-box', textAlign: 'center'
            }}>
                <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 44, color: C.outline, marginBottom: 8 }}>30 Years Later: Compounding Explodes</div>
                <div style={{
                    fontFamily: FONT_STACK.display, fontSize: 95, color: C.emerald, lineHeight: 1.05
                }}>
                    ALICE: <span style={{ color: C.gold }}>${countVal.toLocaleString()}</span>
                </div>
                <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 36, color: C.outline, marginTop: 20 }}>
                    Small $5 daily habits built complete financial freedom.
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── 5. OUTRO END SCREEN (UNSEEN SYSTEM CTA) ────────────

const UnseenOutroCard: React.FC = () => {
    const frame = useCurrentFrame();
    const sprSub = spring({ frame: frame - 15, fps: 30, config: { damping: 10 } });

    return (
        <AbsoluteFill style={{ backgroundColor: '#0F172A', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            {frame === 15 && <Audio src={staticFile('sfx/pop.mp3')} volume={0.7} />}

            <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 40, color: C.gold, marginBottom: 12 }}>
                Put Your Money To Work
            </div>

            <div style={{ fontFamily: FONT_STACK.display, fontSize: 80, color: '#FFFFFF', marginBottom: 30 }}>
                UNSEEN SYSTEM
            </div>

            {/* Cartoon Subscribe Button */}
            <div style={{
                transform: `scale(${sprSub})`, backgroundColor: C.red, padding: '20px 48px',
                borderRadius: 40, border: `4px stroke ${C.cardBg}`, fontFamily: FONT_STACK.bebas,
                fontSize: 40, color: '#FFFFFF', boxShadow: '0 20px 50px rgba(239, 68, 68, 0.4)'
            }}>
                SUBSCRIBE FOR MORE STORIES
            </div>
        </AbsoluteFill>
    );
};

// ─── MAIN COMPOSITION ROOT ──────────────────────────────

export const MasterUnseenCartoonStory: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: C.bgSky }}>
            <style>{FONT_IMPORT}</style>

            {/* Intro Title Card */}
            <Sequence from={F_INTRO} durationInFrames={INTRO_FRAMES}>
                <UnseenIntroCard />
            </Sequence>

            {/* Act 1 */}
            <Sequence from={F1} durationInFrames={S1}>
                <SceneOne />
                <Audio src={staticFile('unseen_vo_1.mp3')} />
            </Sequence>

            {/* Act 2 */}
            <Sequence from={F2} durationInFrames={S2}>
                <SceneTwo />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('unseen_vo_2.mp3')} />
            </Sequence>

            {/* Act 3 */}
            <Sequence from={F3} durationInFrames={S3}>
                <SceneThree />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('unseen_vo_3.mp3')} />
            </Sequence>

            {/* Act 4 */}
            <Sequence from={F4} durationInFrames={S4}>
                <SceneFour />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('sfx/rise.mp3')} volume={0.8} />
                <Audio src={staticFile('unseen_vo_4.mp3')} />
            </Sequence>

            {/* Act 5 */}
            <Sequence from={F5} durationInFrames={S5}>
                <SceneFiveCTA />
                <Audio src={staticFile('unseen_vo_5.mp3')} />
            </Sequence>

            {/* Outro End Screen */}
            <Sequence from={F_OUTRO} durationInFrames={OUTRO_FRAMES}>
                <UnseenOutroCard />
            </Sequence>
        </AbsoluteFill>
    );
};

const SceneFiveCTA: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ backgroundColor: C.bgSky }}>
            <div style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                justify: 'center', alignItems: 'center', textAlign: 'center', padding: '120px 130px 90px',
                boxSizing: 'border-box'
            }}>
                <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 44, color: C.outline, marginBottom: 12 }}>
                    Small Daily Habits Compound Into Freedom
                </div>
                <div style={{ fontFamily: FONT_STACK.display, fontSize: 75, color: C.outline, maxWidth: 1200 }}>
                    CHOOSE YOUR DESTINY TODAY
                </div>
            </div>
        </AbsoluteFill>
    );
};
