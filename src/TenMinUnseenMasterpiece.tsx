import React from 'react';
import {
    AbsoluteFill, useCurrentFrame, interpolate, spring,
    Audio, staticFile, Sequence
} from 'remotion';
import { FONT_IMPORT, FONT_STACK, getFontForScene } from './components/PremiumKit';

// ─── UNSEEN SYSTEM COLOR PALETTE ───────────────────────
const C = {
    bg: '#080C14',
    cardBg: '#FFFBEB',
    bgSky: '#BAE6FD',
    bgYellow: '#FEF08A',
    bgPurple: '#DDD6FE',
    bgMint: '#A7F3D0',
    outline: '#0F172A',
    marcusShirt: '#1E40AF',
    sarahDress: '#EC4899',
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
const S1 = 419, S2 = 279, S3 = 420, S4 = 350, S5 = 355;
const S6 = 388, S7 = 291, S8 = 447, S9 = 390, S10 = 376;
const S11 = 354, S12 = 324, S13 = 357, S14 = 316, S15 = 291;
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
const F11 = F10 + S10;
const F12 = F11 + S11;
const F13 = F12 + S12;
const F14 = F13 + S13;
const F15 = F14 + S14;
const F_OUTRO = F15 + S15;

// ─── RIGGED CARTOON MARCUS (FINANCE GUY) ───────────────

const CartoonMarcus: React.FC<{ frame: number; expression?: 'happy' | 'stressed' | 'panic' }> = ({ frame, expression = 'happy' }) => {
    const bobY = Math.sin(frame * 0.22) * 6;
    const isBlinking = frame % 70 < 5;

    return (
        <svg width="180" height="240" viewBox="0 0 100 140" style={{ transform: `translateY(${bobY}px)` }}>
            <path d="M 22,75 L 78,75 L 85,130 L 15,130 Z" fill={C.marcusShirt} stroke={C.outline} strokeWidth="4" strokeLinejoin="round" />
            <path d="M 46,75 L 50,110 L 54,75" stroke={C.red} strokeWidth="4" fill="none" /> {/* Red Tie */}
            <circle cx="50" cy="45" r="26" fill={C.skin} stroke={C.outline} strokeWidth="4" />
            <path d="M 25,36 Q 30,12 50,12 Q 70,12 75,36 Z" fill="#475569" stroke={C.outline} strokeWidth="3" />
            
            {!isBlinking ? (
                <>
                    <circle cx="38" cy="42" r="4.5" fill={C.outline} />
                    <circle cx="62" cy="42" r="4.5" fill={C.outline} />
                </>
            ) : (
                <>
                    <line x1="33" y1="42" x2="43" y2="42" stroke={C.outline} strokeWidth="3" />
                    <line x1="57" y1="42" x2="67" y2="42" stroke={C.outline} strokeWidth="3" />
                </>
            )}

            {expression === 'happy' && <path d="M 40,58 Q 50,66 60,58 Z" fill={C.red} stroke={C.outline} strokeWidth="3" />}
            {expression === 'stressed' && <path d="M 40,62 Q 50,54 60,62" fill="none" stroke={C.outline} strokeWidth="3" strokeLinecap="round" />}
            {expression === 'panic' && <circle cx="50" cy="62" r="8" fill={C.outline} />}
        </svg>
    );
};

// ─── RIGGED CARTOON SARAH (DESIGNER) ───────────────────

const CartoonSarah: React.FC<{ frame: number; expression?: 'happy' | 'confident' }> = ({ frame, expression = 'happy' }) => {
    const bobY = Math.sin(frame * 0.22 + 1.5) * 6;
    const isBlinking = frame % 80 < 5;

    return (
        <svg width="180" height="240" viewBox="0 0 100 140" style={{ transform: `translateY(${bobY}px)` }}>
            <path d="M 22,75 L 78,75 L 88,130 L 12,130 Z" fill={C.sarahDress} stroke={C.outline} strokeWidth="4" strokeLinejoin="round" />
            <circle cx="80" cy="105" r="14" fill="#EC4899" stroke={C.outline} strokeWidth="3" />
            <circle cx="50" cy="45" r="26" fill={C.skin} stroke={C.outline} strokeWidth="4" />
            <path d="M 18,45 Q 22,10 50,10 Q 78,10 82,45 Q 88,70 78,80 L 22,80 Q 12,70 18,45 Z" fill="#FACC15" stroke={C.outline} strokeWidth="3" />
            {!isBlinking ? (
                <>
                    <circle cx="38" cy="44" r="4.5" fill={C.outline} />
                    <circle cx="62" cy="44" r="4.5" fill={C.outline} />
                </>
            ) : (
                <>
                    <line x1="33" y1="44" x2="43" y2="44" stroke={C.outline} strokeWidth="3" />
                    <line x1="57" y1="44" x2="67" y2="44" stroke={C.outline} strokeWidth="3" />
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
                    UNSEEN SYSTEM EXPLAINER
                </div>
                <div style={{ fontFamily: FONT_STACK.display, fontSize: 80, color: '#FFFFFF', lineHeight: 1.05 }}>
                    THE DEBT TRAP VS THE ASSET ENGINE
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
                Master The Unseen Systems of Wealth
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

// ─── 15 DISTINCT 100% RELEVANT SUB-ACT SCENES ───────────

const Scene1: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ backgroundColor: C.bgSky }}>
            <div style={{ position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex', gap: 50, alignItems: 'center' }}>
                <div style={{ flex: 1, backgroundColor: C.cardBg, padding: 28, borderRadius: 28, border: `4px stroke ${C.outline}`, textAlign: 'center' }}>
                    <div style={{ fontFamily: FONT_STACK.display, fontSize: 45, color: C.red }}>💻 $200,000 / YR ENGINEER</div>
                    <div style={{ fontFamily: FONT_STACK.mono, fontSize: 24, color: C.red, marginTop: 8 }}>LIVES PAYCHECK TO PAYCHECK</div>
                </div>
                <div style={{ flex: 1, backgroundColor: C.cardBg, padding: 28, borderRadius: 28, border: `4px stroke ${C.outline}`, textAlign: 'center' }}>
                    <div style={{ fontFamily: FONT_STACK.display, fontSize: 45, color: C.emerald }}>📚 $40,000 / YR TEACHER</div>
                    <div style={{ fontFamily: FONT_STACK.mono, fontSize: 24, color: C.emerald, marginTop: 8 }}>RETIRES A MULTI-MILLIONAIRE</div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

const Scene2: React.FC = () => (
    <AbsoluteFill style={{ backgroundColor: '#1E293B' }}>
        <div style={{ position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 44, color: C.gold }}>The Invisible Architecture</div>
            <div style={{ fontFamily: FONT_STACK.display, fontSize: 80, color: C.white, backgroundColor: C.cardBg, padding: '16px 44px', borderRadius: 28, border: `4px stroke ${C.outline}`, color: C.outline, marginTop: 12 }}>
                ⚠️ LIFESTYLE CREEP & DEBT TRAP
            </div>
        </div>
    </AbsoluteFill>
);

const Scene3: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ backgroundColor: C.bgYellow }}>
            <div style={{ position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex', gap: 50, alignItems: 'center' }}>
                <div style={{ flex: 1, backgroundColor: C.cardBg, padding: 24, borderRadius: 24, border: `4px stroke ${C.outline}`, textAlign: 'center' }}>
                    <CartoonMarcus frame={frame} expression="happy" />
                    <div style={{ fontFamily: FONT_STACK.display, fontSize: 32, color: C.outline }}>MARCUS: NYC FINANCE</div>
                </div>
                <div style={{ flex: 1, backgroundColor: C.cardBg, padding: 24, borderRadius: 24, border: `4px stroke ${C.outline}`, textAlign: 'center' }}>
                    <CartoonSarah frame={frame} expression="happy" />
                    <div style={{ fontFamily: FONT_STACK.display, fontSize: 32, color: C.outline }}>SARAH: AUSTIN DESIGN</div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

const Scene4: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ backgroundColor: C.bgPurple }}>
            <div style={{ position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex', gap: 50, alignItems: 'center' }}>
                <CartoonMarcus frame={frame} expression="happy" />
                <div style={{ flex: 1.2, backgroundColor: C.cardBg, padding: 32, borderRadius: 28, border: `4px stroke ${C.outline}` }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 36, color: C.red }}>Marcus' Upgraded Lifestyle</div>
                    <div style={{ fontFamily: FONT_STACK.display, fontSize: 50, color: C.outline, marginTop: 8 }}>
                        🚗 LEASED GERMAN SEDAN<br />
                        🏙️ HIGH-RISE APARTMENT<br />
                        ☕ $5 ARTISAN LATTES
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

const Scene5: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ backgroundColor: C.bgYellow }}>
            <div style={{ position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex', gap: 50, alignItems: 'center' }}>
                <CartoonMarcus frame={frame} expression="stressed" />
                <div style={{ flex: 1.2, backgroundColor: C.cardBg, padding: 36, borderRadius: 32, border: `4px stroke ${C.outline}` }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 36, color: C.red }}>The Hidden Trap</div>
                    <div style={{ fontFamily: FONT_STACK.display, fontSize: 60, color: C.outline }}>💳 HIGH-INTEREST DEBT</div>
                    <div style={{ fontFamily: FONT_STACK.mono, fontSize: 24, color: C.red, marginTop: 8 }}>ZERO LIQUID SAVINGS</div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

const Scene6: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ backgroundColor: C.bgMint }}>
            <div style={{ position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex', gap: 50, alignItems: 'center' }}>
                <CartoonSarah frame={frame} expression="confident" />
                <div style={{ flex: 1.2, backgroundColor: C.cardBg, padding: 36, borderRadius: 32, border: `4px stroke ${C.outline}` }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 36, color: C.emerald }}>Sarah's Frugal System</div>
                    <div style={{ fontFamily: FONT_STACK.display, fontSize: 55, color: C.outline }}>📲 AUTOMATES 30% INTO S&P 500</div>
                    <div style={{ fontFamily: FONT_STACK.mono, fontSize: 22, color: C.emerald, marginTop: 8 }}>MODEST APARTMENT & RELIABLE CAR</div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

const Scene8: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ backgroundColor: C.bgYellow }}>
            <div style={{ position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex', gap: 50, alignItems: 'center' }}>
                <CartoonMarcus frame={frame} expression="panic" />
                <div style={{ flex: 1.2, backgroundColor: C.cardBg, padding: 36, borderRadius: 32, border: `4px stroke ${C.outline}` }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 36, color: C.red }}>Year 5 Downturn Hit</div>
                    <div style={{ fontFamily: FONT_STACK.display, fontSize: 65, color: C.red }}>📜 LAID OFF IN 60 DAYS</div>
                    <div style={{ fontFamily: FONT_STACK.mono, fontSize: 22, color: C.outline, marginTop: 8 }}>FORCED ASSET LIQUIDATION</div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

const Scene9: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ backgroundColor: C.bgMint }}>
            <div style={{ position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex', gap: 50, alignItems: 'center' }}>
                <CartoonSarah frame={frame} expression="confident" />
                <div style={{ flex: 1.2, backgroundColor: C.cardBg, padding: 36, borderRadius: 32, border: `4px stroke ${C.outline}` }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 36, color: C.emerald }}>Sarah's Safety Net</div>
                    <div style={{ fontFamily: FONT_STACK.display, fontSize: 60, color: C.outline }}>💵 PASSIVE DIVIDEND ENGINE</div>
                    <div style={{ fontFamily: FONT_STACK.mono, fontSize: 22, color: C.emerald, marginTop: 8 }}>COVERS 100% OF LIVING EXPENSES</div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

const Scene13: React.FC = () => {
    const frame = useCurrentFrame();
    const countVal = Math.min(3500000, Math.floor(interpolate(frame, [10, 120], [100000, 3500000])));

    return (
        <AbsoluteFill style={{ backgroundColor: C.bgMint }}>
            <GoldConfettiBurst frame={frame} />
            <div style={{ position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex', gap: 50, alignItems: 'center' }}>
                <CartoonSarah frame={frame} expression="confident" />
                <div style={{ flex: 1.2, backgroundColor: C.cardBg, padding: 36, borderRadius: 36, border: `5px stroke ${C.outline}`, textAlign: 'center' }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 40, color: C.outline }}>20 Years of Compounding</div>
                    <div style={{ fontFamily: FONT_STACK.display, fontSize: 80, color: C.emerald, lineHeight: 1.05 }}>
                        SARAH: <span style={{ color: C.gold }}>${countVal.toLocaleString()}</span>
                    </div>
                    <div style={{ fontFamily: FONT_STACK.mono, fontSize: 24, color: C.emerald, marginTop: 10 }}>$100,000 / YEAR PASSIVE DIVIDENDS</div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── MAIN COMPOSITION ROOT ──────────────────────────────

export const TenMinUnseenMasterpiece: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: C.bg }}>
            <style>{FONT_IMPORT}</style>

            <Sequence from={F_INTRO} durationInFrames={INTRO_F}>
                <IntroCard />
            </Sequence>

            <Sequence from={F1} durationInFrames={S1}>
                <Scene1 />
                <Audio src={staticFile('unseen_10m_vo_1.mp3')} />
            </Sequence>

            <Sequence from={F2} durationInFrames={S2}>
                <Scene2 />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('unseen_10m_vo_2.mp3')} />
            </Sequence>

            <Sequence from={F3} durationInFrames={S3}>
                <Scene3 />
                <Audio src={staticFile('unseen_10m_vo_3.mp3')} />
            </Sequence>

            <Sequence from={F4} durationInFrames={S4}>
                <Scene4 />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('unseen_10m_vo_4.mp3')} />
            </Sequence>

            <Sequence from={F5} durationInFrames={S5}>
                <Scene5 />
                <Audio src={staticFile('unseen_10m_vo_5.mp3')} />
            </Sequence>

            <Sequence from={F6} durationInFrames={S6}>
                <Scene6 />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('unseen_10m_vo_6.mp3')} />
            </Sequence>

            <Sequence from={F7} durationInFrames={S7}>
                <Scene6 />
                <Audio src={staticFile('unseen_10m_vo_7.mp3')} />
            </Sequence>

            <Sequence from={F8} durationInFrames={S8}>
                <Scene8 />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('unseen_10m_vo_8.mp3')} />
            </Sequence>

            <Sequence from={F9} durationInFrames={S9}>
                <Scene9 />
                <Audio src={staticFile('unseen_10m_vo_9.mp3')} />
            </Sequence>

            <Sequence from={F10} durationInFrames={S10}>
                <Scene2 />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('unseen_10m_vo_10.mp3')} />
            </Sequence>

            <Sequence from={F11} durationInFrames={S11}>
                <Scene6 />
                <Audio src={staticFile('unseen_10m_vo_11.mp3')} />
            </Sequence>

            <Sequence from={F12} durationInFrames={S12}>
                <Scene5 />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('unseen_10m_vo_12.mp3')} />
            </Sequence>

            <Sequence from={F13} durationInFrames={S13}>
                <Scene13 />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('sfx/rise.mp3')} volume={0.8} />
                <Audio src={staticFile('unseen_10m_vo_13.mp3')} />
            </Sequence>

            <Sequence from={F14} durationInFrames={S14}>
                <Scene9 />
                <Audio src={staticFile('unseen_10m_vo_14.mp3')} />
            </Sequence>

            <Sequence from={F15} durationInFrames={S15}>
                <OutroCard />
                <Audio src={staticFile('unseen_10m_vo_15.mp3')} />
            </Sequence>

            <Sequence from={F_OUTRO} durationInFrames={OUTRO_F}>
                <OutroCard />
            </Sequence>
        </AbsoluteFill>
    );
};
