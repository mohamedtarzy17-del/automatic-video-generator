import React from 'react';
import {
    AbsoluteFill, useCurrentFrame, interpolate, spring,
    Audio, staticFile, Sequence
} from 'remotion';
import { FONT_IMPORT, FONT_STACK, getFontForScene } from './components/PremiumKit';

// ─── UNSEEN SYSTEM STUDIO COLOR PALETTE ─────────────────
const C = {
    bg: '#080C14',
    cardBg: '#FFFBEB',
    bgSky: '#BAE6FD',
    bgYellow: '#FEF08A',
    bgPurple: '#DDD6FE',
    bgMint: '#A7F3D0',
    outline: '#0F172A',
    bobShirt: '#3B82F6',
    aliceDress: '#EC4899',
    skin: '#FDBA74',
    emerald: '#10B981',
    gold: '#F59E0B',
    red: '#EF4444',
    purple: '#8B5CF6',
    white: '#FFFFFF',
    textMuted: '#94A3B8'
};

// Segment frame constants
const INTRO_F = 90;
const S1 = 523, S2 = 555, S3 = 455, S4 = 479, S5 = 511;
const S6 = 483, S7 = 446, S8 = 529, S9 = 380, S10 = 252;
const OUTRO_F = 120;

const F_INTRO = 0;
const F1 = F_INTRO + INTRO_F;
const F2 = F1 + S1;
const F3 = F2 + S2;
const F4 = F3 + S3;
const F5 = F4 + S4;
const F6 = F5 + S5;
const F7 = F6 + S6;
const F8 = F7 + S7;
const F9 = F8 + S8;
const F10 = F9 + S9;
const F_OUTRO = F10 + S10;

// ─── RIGGED CARTOON BOB CHARACTER ──────────────────────

const CartoonBob: React.FC<{ frame: number; expression?: 'neutral' | 'sad' | 'shocked'; item?: 'coffee' | 'gadget' | 'headphones' | 'wallet' }> = ({
    frame, expression = 'neutral', item = 'none'
}) => {
    const bobY = Math.sin(frame * 0.22) * 6;
    const isBlinking = frame % 70 < 5;
    const mouthH = Math.abs(Math.sin(frame * 0.55)) * 10 + 4;
    const eyebrowRot = expression === 'shocked' ? -14 : expression === 'sad' ? 12 : 0;

    return (
        <svg width="200" height="260" viewBox="0 0 100 140" style={{ transform: `translateY(${bobY}px)` }}>
            <path d="M 25,75 L 75,75 L 82,130 L 18,130 Z" fill={C.bobShirt} stroke={C.outline} strokeWidth="4" strokeLinejoin="round" />
            
            {item === 'coffee' && <rect x="74" y="94" width="18" height="24" rx="4" fill="#F97316" stroke={C.outline} strokeWidth="3" />}
            {item === 'gadget' && <rect x="74" y="94" width="22" height="28" rx="4" fill="#64748B" stroke={C.outline} strokeWidth="3" />}
            {item === 'headphones' && (
                <path d="M 22,35 Q 50,10 78,35" fill="none" stroke="#64748B" strokeWidth="6" strokeLinecap="round" />
            )}
            {item === 'wallet' && <rect x="74" y="96" width="20" height="18" rx="3" fill="#78350F" stroke={C.outline} strokeWidth="3" />}

            <circle cx="50" cy="45" r="26" fill={C.skin} stroke={C.outline} strokeWidth="4" />
            <path d="M 26,38 Q 32,15 50,15 Q 68,15 74,38 Z" fill="#78350F" stroke={C.outline} strokeWidth="3" />
            
            <line x1="34" y1="34" x2="46" y2="34" stroke={C.outline} strokeWidth="3.5" strokeLinecap="round" style={{ transform: `rotate(${eyebrowRot}deg)`, transformOrigin: '40px 34px' }} />
            <line x1="54" y1="34" x2="66" y2="34" stroke={C.outline} strokeWidth="3.5" strokeLinecap="round" style={{ transform: `rotate(${-eyebrowRot}deg)`, transformOrigin: '60px 34px' }} />

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

            {expression === 'neutral' && <ellipse cx="50" cy="58" rx="7" ry={mouthH / 2} fill={C.outline} />}
            {expression === 'sad' && <path d="M 40,62 Q 50,54 60,62" fill="none" stroke={C.outline} strokeWidth="3" strokeLinecap="round" />}
            {expression === 'shocked' && <circle cx="50" cy="60" r="9" fill={C.outline} />}
        </svg>
    );
};

// ─── RIGGED CARTOON ALICE CHARACTER ────────────────────

const CartoonAlice: React.FC<{ frame: number; expression?: 'happy' | 'confident'; item?: 'piggyBank' | 'chart' | 'mug' }> = ({
    frame, expression = 'happy', item = 'none'
}) => {
    const bobY = Math.sin(frame * 0.22 + 1.5) * 6;
    const isBlinking = frame % 80 < 5;

    return (
        <svg width="200" height="260" viewBox="0 0 100 140" style={{ transform: `translateY(${bobY}px)` }}>
            <path d="M 25,75 L 75,75 L 85,130 L 15,130 Z" fill={C.aliceDress} stroke={C.outline} strokeWidth="4" strokeLinejoin="round" />
            {item === 'piggyBank' && <circle cx="80" cy="105" r="14" fill="#EC4899" stroke={C.outline} strokeWidth="3" />}
            {item === 'mug' && <rect x="74" y="94" width="16" height="22" rx="3" fill="#10B981" stroke={C.outline} strokeWidth="3" />}

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
                    <line x1="56" y1="44" x2="64" y2="44" stroke={C.outline} strokeWidth="3" />
                </>
            )}
            <path d="M 40,58 Q 50,68 60,58 Z" fill={C.red} stroke={C.outline} strokeWidth="3" />
        </svg>
    );
};

// ─── CONFETTI SPARKLES ─────────────────────────────────

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
                const dy = Math.sin(frame * 0.2 + idx) * 25;
                const rot = (frame * 8 + idx * 45) % 360;
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

// ─── INTRO & OUTRO CARDS ───────────────────────────────

const IntroCard: React.FC = () => {
    const frame = useCurrentFrame();
    const sprLogo = spring({ frame: frame - 10, fps: 30, config: { damping: 10 } });
    const sprText = spring({ frame: frame - 25, fps: 30 });

    return (
        <AbsoluteFill style={{ backgroundColor: '#0F172A', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            {frame === 10 && <Audio src={staticFile('sfx/pop.mp3')} volume={0.7} />}
            {frame === 25 && <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />}

            <div style={{
                transform: `scale(${sprLogo})`, width: 100, height: 100, borderRadius: 30,
                backgroundColor: C.gold, display: 'flex', justifyContent: 'center', alignItems: 'center',
                boxShadow: '0 20px 50px rgba(245, 158, 11, 0.4)', marginBottom: 24
            }}>
                <span style={{ fontFamily: FONT_STACK.bebas, fontSize: 60, color: '#0F172A' }}>U</span>
            </div>

            <div style={{ transform: `scale(${sprText})` }}>
                <div style={{ fontFamily: FONT_STACK.mono, fontSize: 24, color: C.gold, letterSpacing: '0.25em', marginBottom: 8 }}>
                    UNSEEN SYSTEM PRESENTS
                </div>
                <div style={{ fontFamily: FONT_STACK.display, fontSize: 80, color: '#FFFFFF', lineHeight: 1.05 }}>
                    THE SECRET MONEY MULTIPLIER
                </div>
            </div>
        </AbsoluteFill>
    );
};

const OutroCard: React.FC = () => {
    const frame = useCurrentFrame();
    const sprSub = spring({ frame: frame - 15, fps: 30, config: { damping: 10 } });

    return (
        <AbsoluteFill style={{ backgroundColor: '#0F172A', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            {frame === 15 && <Audio src={staticFile('sfx/pop.mp3')} volume={0.7} />}

            <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 40, color: C.gold, marginBottom: 12 }}>
                Master The Unseen Systems
            </div>

            <div style={{ fontFamily: FONT_STACK.display, fontSize: 80, color: '#FFFFFF', marginBottom: 30 }}>
                UNSEEN SYSTEM
            </div>

            <div style={{
                transform: `scale(${sprSub})`, backgroundColor: C.red, padding: '20px 48px',
                borderRadius: 40, border: `4px stroke ${C.cardBg}`, fontFamily: FONT_STACK.bebas,
                fontSize: 40, color: '#FFFFFF', boxShadow: '0 20px 50px rgba(239, 68, 68, 0.4)'
            }}>
                SUBSCRIBE FOR NEW STORIES WEEKLY
            </div>
        </AbsoluteFill>
    );
};

// ─── 100% WORD-ACCURATE WORD-RELEVANT SUB-ACT SCENES ────

// ACT 1: "Two people can start at the exact same finish line..."
const RelevantAct1: React.FC = () => {
    const frame = useCurrentFrame();
    // 1A (0-160f): Finish Line Track Flag 🏁
    // 1B (160-340f): $75k Paycheck Envelope ✉️
    // 1C (340-523f): Treadmill vs Palm Tree Freedom 🌴
    const sub = frame < 160 ? '1A' : frame < 340 ? '1B' : '1C';

    return (
        <AbsoluteFill>
            {sub === '1A' && (
                <AbsoluteFill style={{ backgroundColor: C.bgSky }}>
                    <div style={{ position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex', gap: 50, alignItems: 'center' }}>
                        <div style={{ flex: 1, display: 'flex', gap: 20 }}>
                            <div style={{ backgroundColor: C.cardBg, padding: 18, borderRadius: 24, border: `4px stroke ${C.outline}` }}>
                                <CartoonBob frame={frame} expression="neutral" />
                                <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 28, color: C.outline }}>Bob</div>
                            </div>
                            <div style={{ backgroundColor: C.cardBg, padding: 18, borderRadius: 24, border: `4px stroke ${C.outline}` }}>
                                <CartoonAlice frame={frame} expression="happy" />
                                <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 28, color: C.outline }}>Alice</div>
                            </div>
                        </div>
                        <div style={{ flex: 1.2 }}>
                            <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 38, color: C.outline }}>Starting At The Same Finish Line 🏁</div>
                            <div style={{ fontFamily: FONT_STACK.display, fontSize: 70, color: C.outline }}>SAME JOB. SAME CITY.</div>
                        </div>
                    </div>
                </AbsoluteFill>
            )}

            {sub === '1B' && (
                <AbsoluteFill style={{ backgroundColor: C.bgYellow }}>
                    <div style={{ position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 40, color: C.outline }}>Earn The Exact Same Salary</div>
                        <div style={{ fontFamily: FONT_STACK.display, fontSize: 80, color: C.emerald, backgroundColor: C.cardBg, padding: '16px 44px', borderRadius: 24, border: `4px stroke ${C.outline}`, marginTop: 12 }}>
                            ✉️ $75,000 / YEAR PAYCHECK
                        </div>
                    </div>
                </AbsoluteFill>
            )}

            {sub === '1C' && (
                <AbsoluteFill style={{ backgroundColor: C.bgPurple }}>
                    <div style={{ position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex', gap: 50, alignItems: 'center' }}>
                        <div style={{ flex: 1, backgroundColor: C.cardBg, padding: 28, borderRadius: 28, border: `4px stroke ${C.outline}` }}>
                            <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 32, color: C.red }}>Bob: Trapped Working Forever 🏃</div>
                        </div>
                        <div style={{ flex: 1, backgroundColor: C.cardBg, padding: 28, borderRadius: 28, border: `4px stroke ${C.outline}` }}>
                            <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 32, color: C.emerald }}>Alice: Total Financial Freedom 🌴</div>
                        </div>
                    </div>
                </AbsoluteFill>
            )}
        </AbsoluteFill>
    );
};

// ACT 3: "Bob lives linearly. Every morning he stops at a cafe..."
const RelevantAct3: React.FC = () => {
    const frame = useCurrentFrame();
    // 3A (0-150f): Cafe $5 Latte ☕
    // 3B (150-300f): Unboxing $10 Gadgets & Headphones 🎧
    // 3C (300-455f): 90% Depreciation Red Trash Can 🗑️
    const sub = frame < 150 ? '3A' : frame < 300 ? '3B' : '3C';

    return (
        <AbsoluteFill>
            {sub === '3A' && (
                <AbsoluteFill style={{ backgroundColor: C.bgYellow }}>
                    <div style={{ position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex', gap: 50, alignItems: 'center' }}>
                        <CartoonBob frame={frame} expression="sad" item="coffee" />
                        <div style={{ flex: 1, backgroundColor: C.cardBg, padding: 36, borderRadius: 32, border: `4px stroke ${C.outline}` }}>
                            <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 36, color: C.red }}>Every Morning at the Cafe</div>
                            <div style={{ fontFamily: FONT_STACK.display, fontSize: 60, color: C.outline }}>☕ $5 GOURMET LATTE</div>
                        </div>
                    </div>
                </AbsoluteFill>
            )}

            {sub === '3B' && (
                <AbsoluteFill style={{ backgroundColor: C.bgSky }}>
                    <div style={{ position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex', gap: 50, alignItems: 'center' }}>
                        <CartoonBob frame={frame} expression="neutral" item="headphones" />
                        <div style={{ flex: 1, backgroundColor: C.cardBg, padding: 36, borderRadius: 32, border: `4px stroke ${C.outline}` }}>
                            <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 36, color: C.red }}>Every Weekend</div>
                            <div style={{ fontFamily: FONT_STACK.display, fontSize: 60, color: C.outline }}>🎧 $10 TECH GADGETS</div>
                        </div>
                    </div>
                </AbsoluteFill>
            )}

            {sub === '3C' && (
                <AbsoluteFill style={{ backgroundColor: C.bgPurple }}>
                    <div style={{ position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 40, color: C.red }}>Instant Loss of Value</div>
                        <div style={{ fontFamily: FONT_STACK.display, fontSize: 75, color: C.outline, backgroundColor: C.cardBg, padding: '16px 40px', borderRadius: 24, border: `4px stroke ${C.outline}`, marginTop: 12 }}>
                            🗑️ LOSES 90% UPON UNBOXING
                        </div>
                    </div>
                </AbsoluteFill>
            )}
        </AbsoluteFill>
    );
};

// ACT 4: "Alice understands compounding. She drinks home brewed coffee..."
const RelevantAct4: React.FC = () => {
    const frame = useCurrentFrame();
    // 4A (0-160f): Home brewed mug ☕
    // 4B (160-320f): Bank App $5 Auto Transfer 📲
    // 4C (320-479f): Burger ($5) vs Index Fund ($5) 🍔 vs 📈
    const sub = frame < 160 ? '4A' : frame < 320 ? '4B' : '4C';

    return (
        <AbsoluteFill>
            {sub === '4A' && (
                <AbsoluteFill style={{ backgroundColor: C.bgMint }}>
                    <div style={{ position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex', gap: 50, alignItems: 'center' }}>
                        <CartoonAlice frame={frame} expression="happy" item="mug" />
                        <div style={{ flex: 1, backgroundColor: C.cardBg, padding: 36, borderRadius: 32, border: `4px stroke ${C.outline}` }}>
                            <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 36, color: C.emerald }}>Home Brewed Coffee</div>
                            <div style={{ fontFamily: FONT_STACK.display, fontSize: 60, color: C.outline }}>COST: $0.30 / CUP</div>
                        </div>
                    </div>
                </AbsoluteFill>
            )}

            {sub === '4B' && (
                <AbsoluteFill style={{ backgroundColor: C.bgSky }}>
                    <div style={{ position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 40, color: C.emerald }}>Automated Daily Transfer</div>
                        <div style={{ fontFamily: FONT_STACK.display, fontSize: 70, color: C.outline, backgroundColor: C.cardBg, padding: '16px 40px', borderRadius: 24, border: `4px stroke ${C.outline}`, marginTop: 12 }}>
                            📲 $5.00 / DAY → S&P 500
                        </div>
                    </div>
                </AbsoluteFill>
            )}

            {sub === '4C' && (
                <AbsoluteFill style={{ backgroundColor: C.bgYellow }}>
                    <div style={{ position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex', gap: 50, alignItems: 'center' }}>
                        <div style={{ flex: 1, backgroundColor: C.cardBg, padding: 28, borderRadius: 28, border: `4px stroke ${C.outline}`, textAlign: 'center' }}>
                            <div style={{ fontFamily: FONT_STACK.display, fontSize: 50, color: C.red }}>🍔 1 FAST FOOD MEAL</div>
                        </div>
                        <div style={{ flex: 1, backgroundColor: C.cardBg, padding: 28, borderRadius: 28, border: `4px stroke ${C.outline}`, textAlign: 'center' }}>
                            <div style={{ fontFamily: FONT_STACK.display, fontSize: 50, color: C.emerald }}>📈 INDEX FUND SHARE</div>
                        </div>
                    </div>
                </AbsoluteFill>
            )}
        </AbsoluteFill>
    );
};

// ACT 8: "By year thirty, Alice's habit grew into $1,200,000..."
const RelevantAct8: React.FC = () => {
    const frame = useCurrentFrame();
    // 8A (0-175f): Ticker Count Up $25k -> $1.2M
    // 8B (175-350f): Confetti Explosion 🎉
    // 8C (350-529f): Bob empty wallet 👛
    const sub = frame < 175 ? '8A' : frame < 350 ? '8B' : '8C';
    const countVal = Math.min(1200000, Math.floor(interpolate(frame, [10, 160], [25000, 1200000])));

    return (
        <AbsoluteFill style={{ backgroundColor: C.bgMint }}>
            {sub === '8B' && <GoldConfettiBurst frame={frame} />}

            {sub === '8A' && (
                <AbsoluteFill>
                    <div style={{ position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex', gap: 50, alignItems: 'center' }}>
                        <CartoonAlice frame={frame} expression="confident" item="piggyBank" />
                        <div style={{ flex: 1.2, backgroundColor: C.cardBg, padding: 36, borderRadius: 36, border: `5px stroke ${C.outline}`, textAlign: 'center' }}>
                            <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 40, color: C.outline }}>30 Years Later</div>
                            <div style={{ fontFamily: FONT_STACK.display, fontSize: 85, color: C.emerald, lineHeight: 1.05 }}>
                                ALICE: <span style={{ color: C.gold }}>${countVal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </AbsoluteFill>
            )}

            {sub === '8B' && (
                <AbsoluteFill>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '90px 130px' }}>
                        <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 44, color: C.outline }}>Compounding Interest Explodes</div>
                        <div style={{ fontFamily: FONT_STACK.display, fontSize: 95, color: C.gold }}>$1,200,000+ PURE WEALTH</div>
                    </div>
                </AbsoluteFill>
            )}

            {sub === '8C' && (
                <AbsoluteFill style={{ backgroundColor: C.bgYellow }}>
                    <div style={{ position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex', gap: 50, alignItems: 'center' }}>
                        <CartoonBob frame={frame} expression="shocked" item="wallet" />
                        <div style={{ flex: 1, backgroundColor: C.cardBg, padding: 36, borderRadius: 32, border: `4px stroke ${C.outline}` }}>
                            <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 38, color: C.red }}>Bob: $50,000 Spent on Tech</div>
                            <div style={{ fontFamily: FONT_STACK.display, fontSize: 60, color: C.outline }}>NET WORTH: $0</div>
                        </div>
                    </div>
                </AbsoluteFill>
            )}
        </AbsoluteFill>
    );
};

// ─── MAIN COMPOSITION ROOT ──────────────────────────────

export const FiveMinUnseenMasterpiece: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: C.bg }}>
            <style>{FONT_IMPORT}</style>

            <Sequence from={F_INTRO} durationInFrames={INTRO_F}>
                <IntroCard />
            </Sequence>

            <Sequence from={F1} durationInFrames={S1}>
                <RelevantAct1 />
                <Audio src={staticFile('unseen_5m_vo_1.mp3')} />
            </Sequence>

            <Sequence from={F2} durationInFrames={S2}>
                <RelevantAct1 />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('unseen_5m_vo_2.mp3')} />
            </Sequence>

            <Sequence from={F3} durationInFrames={S3}>
                <RelevantAct3 />
                <Audio src={staticFile('unseen_5m_vo_3.mp3')} />
            </Sequence>

            <Sequence from={F4} durationInFrames={S4}>
                <RelevantAct4 />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('unseen_5m_vo_4.mp3')} />
            </Sequence>

            <Sequence from={F5} durationInFrames={S5}>
                <RelevantAct4 />
                <Audio src={staticFile('unseen_5m_vo_5.mp3')} />
            </Sequence>

            <Sequence from={F6} durationInFrames={S6}>
                <RelevantAct3 />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('unseen_5m_vo_6.mp3')} />
            </Sequence>

            <Sequence from={F7} durationInFrames={S7}>
                <RelevantAct4 />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('unseen_5m_vo_7.mp3')} />
            </Sequence>

            <Sequence from={F8} durationInFrames={S8}>
                <RelevantAct8 />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('sfx/rise.mp3')} volume={0.8} />
                <Audio src={staticFile('unseen_5m_vo_8.mp3')} />
            </Sequence>

            <Sequence from={F9} durationInFrames={S9}>
                <RelevantAct8 />
                <Audio src={staticFile('unseen_5m_vo_9.mp3')} />
            </Sequence>

            <Sequence from={F10} durationInFrames={S10}>
                <OutroCard />
                <Audio src={staticFile('unseen_5m_vo_10.mp3')} />
            </Sequence>

            <Sequence from={F_OUTRO} durationInFrames={OUTRO_F}>
                <OutroCard />
            </Sequence>
        </AbsoluteFill>
    );
};
