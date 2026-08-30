import React from 'react';
import {
    AbsoluteFill, useCurrentFrame, interpolate, spring,
    Audio, staticFile, Sequence
} from 'remotion';
import { FONT_IMPORT, FONT_STACK } from './components/PremiumKit';

// ─── UNSEEN SYSTEM BRAND COLOR PALETTE ─────────────────
const C = {
    bgSky: '#BAE6FD',       // Bright Soft Blue
    bgYellow: '#FEF08A',    // Pastel Yellow
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

// Segment frame constants
const S1 = 439, S2 = 456, S3 = 412, S4 = 423, S5 = 355;
const F1 = 0;
const F2 = F1 + S1;
const F3 = F2 + S2;
const F4 = F3 + S3;
const F5 = F4 + S4;
const TOTAL_FRAMES = F5 + S5; // 2085 frames (~69.5s)

// ─── UNSEEN SYSTEM CHANNEL BADGE HEADER ────────────────

const UnseenChannelHeader: React.FC = () => {
    return (
        <div style={{
            position: 'absolute', top: 40, left: 60, zIndex: 100,
            display: 'flex', alignItems: 'center', gap: 12,
            backgroundColor: '#0F172A', padding: '12px 24px', borderRadius: 30,
            border: `3px stroke ${C.gold}`, boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
        }}>
            <div style={{
                width: 14, height: 14, borderRadius: '50%', backgroundColor: C.gold
            }} />
            <span style={{
                fontFamily: FONT_STACK.mono, fontSize: 20, color: '#FFFFFF',
                fontWeight: 700, letterSpacing: '0.1em'
            }}>
                UNSEEN SYSTEM
            </span>
        </div>
    );
};

// ─── 1. RIGGED CARTOON BOB (Daily Spender) ──────────────

const CartoonBob: React.FC<{ frame: number; expression?: 'neutral' | 'sad' | 'shocked'; item?: 'coffee' | 'gadget' | 'none' }> = ({
    frame, expression = 'neutral', item = 'none'
}) => {
    const bobY = Math.sin(frame * 0.16) * 5;
    const isBlinking = frame % 85 < 5;
    const mouthH = Math.abs(Math.sin(frame * 0.45)) * 10 + 4;

    return (
        <svg width="180" height="240" viewBox="0 0 100 140" style={{ transform: `translateY(${bobY}px)` }}>
            {/* Body */}
            <path d="M 25,75 L 75,75 L 82,130 L 18,130 Z" fill={C.bobShirt} stroke={C.outline} strokeWidth="4" strokeLinejoin="round" />
            
            {/* Item */}
            {item === 'coffee' && (
                <rect x="75" y="95" width="16" height="22" rx="3" fill="#F97316" stroke={C.outline} strokeWidth="3" />
            )}
            {item === 'gadget' && (
                <rect x="75" y="95" width="20" height="28" rx="4" fill="#64748B" stroke={C.outline} strokeWidth="3" />
            )}

            {/* Head */}
            <circle cx="50" cy="45" r="26" fill={C.skin} stroke={C.outline} strokeWidth="4" />
            <path d="M 26,38 Q 32,15 50,15 Q 68,15 74,38 Z" fill="#78350F" stroke={C.outline} strokeWidth="3" />
            
            {/* Eyes */}
            {!isBlinking ? (
                <>
                    <circle cx="40" cy="42" r="4" fill={C.outline} />
                    <circle cx="60" cy="42" r="4" fill={C.outline} />
                </>
            ) : (
                <>
                    <line x1="36" y1="42" x2="44" y2="42" stroke={C.outline} strokeWidth="3" />
                    <line x1="56" y1="42" x2="64" y2="42" stroke={C.outline} strokeWidth="3" />
                </>
            )}

            {/* Mouth */}
            {expression === 'neutral' && <ellipse cx="50" cy="58" rx="7" ry={mouthH / 2} fill={C.outline} />}
            {expression === 'sad' && <path d="M 40,62 Q 50,54 60,62" fill="none" stroke={C.outline} strokeWidth="3" strokeLinecap="round" />}
            {expression === 'shocked' && <circle cx="50" cy="60" r="8" fill={C.outline} />}
        </svg>
    );
};

// ─── 2. RIGGED CARTOON ALICE (Smart Investor) ──────────

const CartoonAlice: React.FC<{ frame: number; expression?: 'happy' | 'confident'; item?: 'piggyBank' | 'chart' | 'none' }> = ({
    frame, expression = 'happy', item = 'none'
}) => {
    const bobY = Math.sin(frame * 0.16 + 1.5) * 5;
    const isBlinking = frame % 95 < 5;

    return (
        <svg width="180" height="240" viewBox="0 0 100 140" style={{ transform: `translateY(${bobY}px)` }}>
            {/* Body / Dress */}
            <path d="M 25,75 L 75,75 L 85,130 L 15,130 Z" fill={C.aliceDress} stroke={C.outline} strokeWidth="4" strokeLinejoin="round" />
            
            {/* Item */}
            {item === 'piggyBank' && (
                <circle cx="80" cy="105" r="14" fill="#EC4899" stroke={C.outline} strokeWidth="3" />
            )}

            {/* Head */}
            <circle cx="50" cy="45" r="26" fill={C.skin} stroke={C.outline} strokeWidth="4" />
            {/* Blond Hair */}
            <path d="M 20,45 Q 25,10 50,10 Q 75,10 80,45 Q 85,70 75,80 L 25,80 Q 15,70 20,45 Z" fill="#FACC15" stroke={C.outline} strokeWidth="3" />
            
            {/* Eyes */}
            {!isBlinking ? (
                <>
                    <circle cx="40" cy="44" r="4" fill={C.outline} />
                    <circle cx="60" cy="44" r="4" fill={C.outline} />
                </>
            ) : (
                <>
                    <line x1="36" y1="44" x2="44" y2="44" stroke={C.outline} strokeWidth="3" />
                    <line x1="56" y1="44" x2="64" y2="44" stroke={C.outline} strokeWidth="3" />
                </>
            )}

            {/* Mouth */}
            <path d="M 40,58 Q 50,68 60,58 Z" fill={C.red} stroke={C.outline} strokeWidth="3" />
        </svg>
    );
};

// ─── 3. PARALLAX BACKGROUND ────────────────────────────

const CartoonParallaxBackground: React.FC<{ frame: number; theme?: 'sky' | 'yellow' | 'purple' | 'mint' }> = ({ frame, theme = 'sky' }) => {
    const cloudX = interpolate(frame, [0, 500], [0, 60]);
    const bgColor = theme === 'sky' ? C.bgSky : theme === 'yellow' ? C.bgYellow : theme === 'purple' ? C.bgPurple : C.bgMint;

    return (
        <AbsoluteFill style={{ backgroundColor: bgColor, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 50, left: cloudX + 80 }}>
                <svg width="150" height="60" viewBox="0 0 100 50">
                    <path d="M 20,40 Q 10,20 30,20 Q 40,5 60,15 Q 80,5 85,25 Q 95,30 90,40 Z" fill={C.cardBg} stroke={C.outline} strokeWidth="3" />
                </svg>
            </div>
            <div style={{ position: 'absolute', bottom: 0, width: '100%', display: 'flex', justifyContent: 'space-around', opacity: 0.2 }}>
                {[130, 190, 160, 220, 150].map((h, idx) => (
                    <div key={idx} style={{ width: 150, height: h, backgroundColor: C.outline, borderTopLeftRadius: 16, borderTopRightRadius: 16 }} />
                ))}
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 1: BOB vs ALICE INTRO ───────────────────────

const SceneOne: React.FC = () => {
    const frame = useCurrentFrame();
    const typeProg = interpolate(frame, [15, 130], [0, 1], { extrapolateRight: 'clamp' });
    const sprBob = spring({ frame: frame - 10, fps: 30 });
    const sprAlice = spring({ frame: frame - 25, fps: 30 });

    const titleText = "BOB AND ALICE: TWO DESTINIES";
    const charsToShow = Math.floor(titleText.length * typeProg);

    return (
        <AbsoluteFill>
            <UnseenChannelHeader />
            <CartoonParallaxBackground frame={frame} theme="sky" />

            {frame > 15 && frame < 130 && <Audio src={staticFile('sfx/typing.mp3')} volume={0.35} />}

            <div style={{
                position: 'absolute', inset: 0, padding: '120px 130px 90px', display: 'flex',
                gap: 50, alignItems: 'center', boxSizing: 'border-box'
            }}>
                <div style={{ flex: 1.1, display: 'flex', gap: 30 }}>
                    <div style={{ transform: `scale(${sprBob})`, backgroundColor: C.cardBg, padding: 24, borderRadius: 28, border: `4px stroke ${C.outline}` }}>
                        <CartoonBob frame={frame} expression="neutral" />
                        <div style={{ textAlign: 'center', fontFamily: FONT_STACK.handwritten, fontSize: 28, color: C.outline, marginTop: 8 }}>Bob</div>
                    </div>

                    <div style={{ transform: `scale(${sprAlice})`, backgroundColor: C.cardBg, padding: 24, borderRadius: 28, border: `4px stroke ${C.outline}` }}>
                        <CartoonAlice frame={frame} expression="happy" />
                        <div style={{ textAlign: 'center', fontFamily: FONT_STACK.handwritten, fontSize: 28, color: C.outline, marginTop: 8 }}>Alice</div>
                    </div>
                </div>

                <div style={{ flex: 1, boxSizing: 'border-box' }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, color: C.outline, fontSize: 38, marginBottom: 8 }}>
                        Same Job. Same Salary.
                    </div>
                    <div style={{ fontFamily: FONT_STACK.display, fontSize: 75, color: C.outline, lineHeight: 1.05 }}>
                        {titleText.slice(0, charsToShow)}
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 2: THE DAILY $5 HABIT ───────────────────────

const SceneTwo: React.FC = () => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill>
            <UnseenChannelHeader />
            <CartoonParallaxBackground frame={frame} theme="yellow" />

            <div style={{
                position: 'absolute', inset: 0, padding: '120px 130px 90px', display: 'flex',
                gap: 50, alignItems: 'center', boxSizing: 'border-box'
            }}>
                <div style={{ flex: 1, backgroundColor: C.cardBg, padding: 36, borderRadius: 32, border: `4px stroke ${C.outline}` }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 36, color: C.red }}>Bob's Morning Routine</div>
                    <div style={{ fontFamily: FONT_STACK.display, fontSize: 54, color: C.outline, marginTop: 8 }}>$5 Coffee + $10 Gadgets</div>
                    <div style={{ fontFamily: FONT_STACK.mono, fontSize: 22, color: C.red, marginTop: 12 }}>DEPRECIATING ASSETS</div>
                </div>

                <div style={{ flex: 1, backgroundColor: C.cardBg, padding: 36, borderRadius: 32, border: `4px stroke ${C.outline}` }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 36, color: C.emerald }}>Alice's Morning Routine</div>
                    <div style={{ fontFamily: FONT_STACK.display, fontSize: 54, color: C.outline, marginTop: 8 }}>Automates $5/Day</div>
                    <div style={{ fontFamily: FONT_STACK.mono, fontSize: 22, color: C.emerald, marginTop: 12 }}>COMPOUNDING INDEX FUNDS</div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 3: 10 YEARS PASS ($25,000 MILESTONE) ────────

const SceneThree: React.FC = () => {
    const frame = useCurrentFrame();
    const sprVal = spring({ frame: frame - 15, fps: 30 });

    return (
        <AbsoluteFill>
            <UnseenChannelHeader />
            <CartoonParallaxBackground frame={frame} theme="purple" />

            <div style={{
                position: 'absolute', inset: 0, padding: '120px 130px 90px', display: 'flex',
                gap: 50, alignItems: 'center', boxSizing: 'border-box'
            }}>
                <div style={{ flex: 1 }}>
                    <CartoonBob frame={frame} expression="sad" item="gadget" />
                </div>

                <div style={{ flex: 1.2, backgroundColor: C.cardBg, padding: 40, borderRadius: 32, border: `5px stroke ${C.outline}`, textAlign: 'center' }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 38, color: C.outline }}>10 Years Later</div>
                    <div style={{ fontFamily: FONT_STACK.display, fontSize: 80, color: C.purple, transform: `scale(${sprVal})` }}>
                        ALICE: $25,000+
                    </div>
                    <div style={{ fontFamily: FONT_STACK.mono, fontSize: 20, color: C.outline, marginTop: 10 }}>Bob's Gadgets: $0 Value</div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 4: 30 YEARS PASS ($1,000,000 FORTUNE) ──────

const SceneFour: React.FC = () => {
    const frame = useCurrentFrame();
    const sprMain = spring({ frame: frame - 10, fps: 30, config: { damping: 10 } });

    return (
        <AbsoluteFill>
            <UnseenChannelHeader />
            <CartoonParallaxBackground frame={frame} theme="mint" />

            <div style={{
                position: 'absolute', inset: 0, padding: '120px 130px 90px', display: 'flex',
                flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                boxSizing: 'border-box', textAlign: 'center'
            }}>
                <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 44, color: C.outline, marginBottom: 8 }}>30 Years Later: Compounding Explodes</div>
                <div style={{
                    fontFamily: FONT_STACK.display, fontSize: 95, color: C.emerald, lineHeight: 1.05,
                    transform: `scale(${sprMain})`
                }}>
                    ALICE: <span style={{ color: C.gold }}>$1,200,000+</span>
                </div>
                <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 36, color: C.outline, marginTop: 20 }}>
                    Small $5 daily habits built complete financial freedom.
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 5: CALL TO ACTION & CONCLUSION ──────────────

const SceneFive: React.FC = () => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill>
            <UnseenChannelHeader />
            <CartoonParallaxBackground frame={frame} theme="sky" />

            <div style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '120px 130px 90px',
                boxSizing: 'border-box'
            }}>
                <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 44, color: C.outline, marginBottom: 12 }}>
                    Put Your Money To Work
                </div>
                <div style={{ fontFamily: FONT_STACK.display, fontSize: 80, color: C.outline, maxWidth: 1200 }}>
                    UNSEEN SYSTEM
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── MAIN COMPOSITION ROOT ──────────────────────────────

export const UnseenSystemStory: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: C.bgSky }}>
            <style>{FONT_IMPORT}</style>

            {/* Segment 1 */}
            <Sequence from={F1} durationInFrames={S1}>
                <SceneOne />
                <Audio src={staticFile('unseen_vo_1.mp3')} />
            </Sequence>

            {/* Segment 2 */}
            <Sequence from={F2} durationInFrames={S2}>
                <SceneTwo />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('unseen_vo_2.mp3')} />
            </Sequence>

            {/* Segment 3 */}
            <Sequence from={F3} durationInFrames={S3}>
                <SceneThree />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('sfx/pop.mp3')} volume={0.7} />
                <Audio src={staticFile('unseen_vo_3.mp3')} />
            </Sequence>

            {/* Segment 4 */}
            <Sequence from={F4} durationInFrames={S4}>
                <SceneFour />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('sfx/rise.mp3')} volume={0.8} />
                <Audio src={staticFile('unseen_vo_4.mp3')} />
            </Sequence>

            {/* Segment 5 */}
            <Sequence from={F5} durationInFrames={S5}>
                <SceneFive />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('unseen_vo_5.mp3')} />
            </Sequence>
        </AbsoluteFill>
    );
};
