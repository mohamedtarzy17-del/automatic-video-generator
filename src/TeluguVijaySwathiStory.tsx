import React from 'react';
import {
    AbsoluteFill, useCurrentFrame, interpolate, spring,
    Audio, staticFile, Sequence
} from 'remotion';

// ─── TELUGU GOOGLE FONT IMPORT ─────────────────────────
const TELUGU_FONT = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400;700;900&display=swap');
`;

const FONT_TELUGU = "'Noto Sans Telugu', sans-serif";

const C = {
    bg: '#080C14',
    cardBg: '#FFFBEB',
    bgSky: '#BAE6FD',
    bgYellow: '#FEF08A',
    bgPurple: '#DDD6FE',
    bgMint: '#A7F3D0',
    outline: '#0F172A',
    vijayShirt: '#1E40AF',
    swathiSaree: '#DC2626',
    skin: '#FDBA74',
    emerald: '#10B981',
    gold: '#F59E0B',
    red: '#EF4444',
    purple: '#8B5CF6',
    white: '#FFFFFF'
};

const S1 = 362, S2 = 322, S3 = 213, S4 = 250, S5 = 255;
const F1 = 0;
const F2 = F1 + S1;
const F3 = F2 + S2;
const F4 = F3 + S3;
const F5 = F4 + S4;
const TOTAL_FRAMES = F5 + S5; // 1402 frames (~46.7s)

// ─── INDIAN CARTOON CHARACTER: VIJAY (విజయ్) ────────────────

const CartoonVijay: React.FC<{ frame: number; expression?: 'happy' | 'shocked' }> = ({ frame, expression = 'happy' }) => {
    const bobY = Math.sin(frame * 0.22) * 6;
    const isBlinking = frame % 70 < 5;

    return (
        <svg width="180" height="240" viewBox="0 0 100 140" style={{ transform: `translateY(${bobY}px)` }}>
            {/* Indian Kurta / Shirt */}
            <path d="M 22,75 L 78,75 L 85,130 L 15,130 Z" fill={C.vijayShirt} stroke={C.outline} strokeWidth="4" strokeLinejoin="round" />
            <circle cx="50" cy="45" r="26" fill={C.skin} stroke={C.outline} strokeWidth="4" />
            {/* Black Moustache & Hair */}
            <path d="M 24,38 Q 30,12 50,12 Q 70,12 76,38 Z" fill="#1E293B" stroke={C.outline} strokeWidth="3" />
            <path d="M 40,58 Q 50,54 60,58 Q 50,64 40,58 Z" fill="#1E293B" /> {/* Indian Moustache */}
            
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
            {expression === 'shocked' && <circle cx="50" cy="64" r="8" fill={C.outline} />}
        </svg>
    );
};

// ─── INDIAN CARTOON CHARACTER: SWATHI (స్వాతి) ──────────────

const CartoonSwathi: React.FC<{ frame: number; expression?: 'happy' }> = ({ frame, expression = 'happy' }) => {
    const bobY = Math.sin(frame * 0.22 + 1.5) * 6;
    const isBlinking = frame % 80 < 5;

    return (
        <svg width="180" height="240" viewBox="0 0 100 140" style={{ transform: `translateY(${bobY}px)` }}>
            {/* Saree Outfit */}
            <path d="M 22,75 L 78,75 L 88,130 L 12,130 Z" fill={C.swathiSaree} stroke={C.outline} strokeWidth="4" strokeLinejoin="round" />
            <path d="M 30,75 L 75,130" stroke={C.gold} strokeWidth="5" /> {/* Saree Pallu */}
            <circle cx="50" cy="45" r="26" fill={C.skin} stroke={C.outline} strokeWidth="4" />
            <circle cx="50" cy="34" r="3" fill={C.red} /> {/* Indian Bindi */}
            <path d="M 18,45 Q 22,10 50,10 Q 78,10 82,45 Q 88,70 78,80 L 22,80 Q 12,70 18,45 Z" fill="#0F172A" stroke={C.outline} strokeWidth="3" />
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

// ─── SCENE 1: VIJAY & SWATHI AT TECH PARK (₹80,000 PAYCHECK) ───

const SceneVijaySwathi1: React.FC = () => {
    const frame = useCurrentFrame();
    const sprCard = spring({ frame: frame - 10, fps: 30 });

    return (
        <AbsoluteFill style={{ backgroundColor: C.bgSky }}>
            <div style={{ position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex', gap: 50, alignItems: 'center' }}>
                <div style={{ flex: 1, display: 'flex', gap: 20 }}>
                    <div style={{ backgroundColor: C.cardBg, padding: 20, borderRadius: 28, border: `4px stroke ${C.outline}`, textAlign: 'center' }}>
                        <CartoonVijay frame={frame} expression="happy" />
                        <div style={{ fontFamily: FONT_TELUGU, fontSize: 32, fontWeight: 700, color: C.outline }}>విజయ్ (Vijay)</div>
                    </div>
                    <div style={{ backgroundColor: C.cardBg, padding: 20, borderRadius: 28, border: `4px stroke ${C.outline}`, textAlign: 'center' }}>
                        <CartoonSwathi frame={frame} expression="happy" />
                        <div style={{ fontFamily: FONT_TELUGU, fontSize: 32, fontWeight: 700, color: C.outline }}>స్వాతి (Swathi)</div>
                    </div>
                </div>

                <div style={{ flex: 1.2, transform: `scale(${sprCard})` }}>
                    <div style={{ fontFamily: FONT_TELUGU, fontSize: 36, fontWeight: 700, color: C.purple, marginBottom: 8 }}>హైదరాబాద్ IT పార్క్ 🏢</div>
                    <div style={{ fontFamily: FONT_TELUGU, fontSize: 60, fontWeight: 900, color: C.outline, lineHeight: 1.15 }}>
                        జీతం: ₹80,000 / నెల
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 2: VIJAY'S EMI & SPENDING HABITS (UNIQUE 3D CARDS) ───

const SceneVijaySwathi2: React.FC = () => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill style={{ backgroundColor: C.bgYellow }}>
            <div style={{ position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex', gap: 40, alignItems: 'center' }}>
                <CartoonVijay frame={frame} expression="shocked" />

                <div style={{ flex: 1, backgroundColor: C.cardBg, padding: 28, borderRadius: 28, border: `4px stroke ${C.outline}` }}>
                    <div style={{ fontFamily: FONT_TELUGU, fontSize: 32, fontWeight: 700, color: C.red }}>విజయ్ ఖర్చులు</div>
                    <div style={{ fontFamily: FONT_TELUGU, fontSize: 38, fontWeight: 900, color: C.outline, marginTop: 8 }}>
                        📱 iPhone 15 Pro EMI<br />
                        🏍️ లగ్జరీ బైక్ EMI<br />
                        🍛 బిర్యానీ & రెస్టారెంట్లు
                    </div>
                    <div style={{ fontFamily: FONT_TELUGU, fontSize: 28, fontWeight: 700, color: C.red, marginTop: 12 }}>
                        మిగిలిన సంపద: ₹0
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 3: SWATHI'S SIP MUTUAL FUND COMPOUNDING ───────────

const SceneVijaySwathi3: React.FC = () => {
    const frame = useCurrentFrame();
    const plantH = Math.min(100, frame * 0.8);

    return (
        <AbsoluteFill style={{ backgroundColor: C.bgMint }}>
            <div style={{ position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex', gap: 50, alignItems: 'center' }}>
                <CartoonSwathi frame={frame} expression="happy" />

                <div style={{ flex: 1, backgroundColor: C.cardBg, padding: 32, borderRadius: 28, border: `4px stroke ${C.outline}` }}>
                    <div style={{ fontFamily: FONT_TELUGU, fontSize: 34, fontWeight: 700, color: C.emerald }}>స్వాతి ఇన్వెస్ట్‌మెంట్</div>
                    <div style={{ fontFamily: FONT_TELUGU, fontSize: 48, fontWeight: 900, color: C.outline, marginTop: 8 }}>
                        📊 ₹10,000 / నెల SIP
                    </div>
                    <div style={{ fontFamily: FONT_TELUGU, fontSize: 28, fontWeight: 700, color: C.emerald, marginTop: 10 }}>
                        మ్యూచువల్ ఫండ్స్ కాంపౌండింగ్ 🌱
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 4: 2.5 CRORES PAYOFF (₹2,50,00,000) ─────────────────

const SceneVijaySwathi4: React.FC = () => {
    const frame = useCurrentFrame();
    const countVal = Math.min(25000000, Math.floor(interpolate(frame, [10, 100], [500000, 25000000])));

    return (
        <AbsoluteFill style={{ backgroundColor: C.bgPurple }}>
            <div style={{ position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ fontFamily: FONT_TELUGU, fontSize: 40, fontWeight: 700, color: C.outline }}>20 సంవత్సరాల తర్వాత...</div>
                <div style={{ fontFamily: FONT_TELUGU, fontSize: 75, fontWeight: 900, color: C.emerald, backgroundColor: C.cardBg, padding: '18px 44px', borderRadius: 28, border: `4px stroke ${C.outline}`, marginTop: 12 }}>
                    స్వాతి సంపద: ₹{countVal.toLocaleString()} (2.5 కోట్లు!)
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 5: UNSEEN SYSTEM TELUGU OUTRO ─────────────────────

const SceneVijaySwathi5: React.FC = () => {
    const frame = useCurrentFrame();
    const sprSub = spring({ frame: frame - 10, fps: 30 });

    return (
        <AbsoluteFill style={{ backgroundColor: '#0F172A', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontFamily: FONT_TELUGU, fontSize: 40, color: C.gold, marginBottom: 12 }}>
                మీరు విజయ్‌లా ఉంటారా, స్వాతిలా మారతారా?
            </div>
            <div style={{ fontFamily: FONT_TELUGU, fontSize: 75, fontWeight: 900, color: C.white, marginBottom: 24 }}>
                అన్సీన్ సిస్టమ్
            </div>
            <div style={{ transform: `scale(${sprSub})`, backgroundColor: C.red, padding: '18px 44px', borderRadius: 36, fontFamily: FONT_TELUGU, fontSize: 36, fontWeight: 700, color: C.white }}>
                సబ్‌స్క్రైబ్ చేసుకోండి! 🔔
            </div>
        </AbsoluteFill>
    );
};

// ─── MAIN COMPOSITION ROOT ──────────────────────────────

export const TeluguVijaySwathiStory: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: C.bg }}>
            <style>{TELUGU_FONT}</style>

            <Sequence from={F1} durationInFrames={S1}>
                <SceneVijaySwathi1 />
                <Audio src={staticFile('telugu_vs_1.mp3')} />
            </Sequence>

            <Sequence from={F2} durationInFrames={S2}>
                <SceneVijaySwathi2 />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('telugu_vs_2.mp3')} />
            </Sequence>

            <Sequence from={F3} durationInFrames={S3}>
                <SceneVijaySwathi3 />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('telugu_vs_3.mp3')} />
            </Sequence>

            <Sequence from={F4} durationInFrames={S4}>
                <SceneVijaySwathi4 />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('sfx/rise.mp3')} volume={0.8} />
                <Audio src={staticFile('telugu_vs_4.mp3')} />
            </Sequence>

            <Sequence from={F5} durationInFrames={S5}>
                <SceneVijaySwathi5 />
                <Audio src={staticFile('telugu_vs_5.mp3')} />
            </Sequence>
        </AbsoluteFill>
    );
};
