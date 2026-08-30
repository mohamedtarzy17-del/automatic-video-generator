import React from 'react';
import {
    AbsoluteFill, useCurrentFrame, interpolate, spring,
    Audio, staticFile, Sequence
} from 'remotion';
import { FONT_IMPORT } from './components/PremiumKit';

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
    bobShirt: '#3B82F6',
    aliceDress: '#EC4899',
    skin: '#FDBA74',
    emerald: '#10B981',
    gold: '#F59E0B',
    red: '#EF4444',
    purple: '#8B5CF6',
    white: '#FFFFFF'
};

const S1 = 365, S2 = 552, S3 = 375, S4 = 264;
const F1 = 0;
const F2 = F1 + S1;
const F3 = F2 + S2;
const F4 = F3 + S3;
const TOTAL_FRAMES = F4 + S4; // 1556 frames (~52s)

// ─── RIGGED CARTOON BOB (TELUGU) ───────────────────────

const CartoonBob: React.FC<{ frame: number; expression?: 'neutral' | 'sad' }> = ({ frame, expression = 'neutral' }) => {
    const bobY = Math.sin(frame * 0.22) * 6;
    const isBlinking = frame % 70 < 5;
    const mouthH = Math.abs(Math.sin(frame * 0.55)) * 10 + 4;

    return (
        <svg width="180" height="240" viewBox="0 0 100 140" style={{ transform: `translateY(${bobY}px)` }}>
            <path d="M 25,75 L 75,75 L 82,130 L 18,130 Z" fill={C.bobShirt} stroke={C.outline} strokeWidth="4" strokeLinejoin="round" />
            <circle cx="50" cy="45" r="26" fill={C.skin} stroke={C.outline} strokeWidth="4" />
            <path d="M 26,38 Q 32,15 50,15 Q 68,15 74,38 Z" fill="#78350F" stroke={C.outline} strokeWidth="3" />
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
        </svg>
    );
};

const CartoonAlice: React.FC<{ frame: number; expression?: 'happy' }> = ({ frame, expression = 'happy' }) => {
    const bobY = Math.sin(frame * 0.22 + 1.5) * 6;
    const isBlinking = frame % 80 < 5;

    return (
        <svg width="180" height="240" viewBox="0 0 100 140" style={{ transform: `translateY(${bobY}px)` }}>
            <path d="M 25,75 L 75,75 L 85,130 L 15,130 Z" fill={C.aliceDress} stroke={C.outline} strokeWidth="4" strokeLinejoin="round" />
            <circle cx="80" cy="105" r="14" fill="#EC4899" stroke={C.outline} strokeWidth="3" />
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

// ─── SCENE 1: TELUGU INTRO ─────────────────────────────

const SceneTelugu1: React.FC = () => {
    const frame = useCurrentFrame();
    const sprCard = spring({ frame: frame - 10, fps: 30 });

    return (
        <AbsoluteFill style={{ backgroundColor: C.bgSky }}>
            <div style={{ position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex', gap: 50, alignItems: 'center' }}>
                <div style={{ flex: 1, display: 'flex', gap: 20 }}>
                    <div style={{ backgroundColor: C.cardBg, padding: 20, borderRadius: 28, border: `4px stroke ${C.outline}`, textAlign: 'center' }}>
                        <CartoonBob frame={frame} expression="neutral" />
                        <div style={{ fontFamily: FONT_TELUGU, fontSize: 32, fontWeight: 700, color: C.outline }}>బాబ్</div>
                    </div>
                    <div style={{ backgroundColor: C.cardBg, padding: 20, borderRadius: 28, border: `4px stroke ${C.outline}`, textAlign: 'center' }}>
                        <CartoonAlice frame={frame} expression="happy" />
                        <div style={{ fontFamily: FONT_TELUGU, fontSize: 32, fontWeight: 700, color: C.outline }}>ఆలిస్</div>
                    </div>
                </div>

                <div style={{ flex: 1.2, transform: `scale(${sprCard})` }}>
                    <div style={{ fontFamily: FONT_TELUGU, fontSize: 36, fontWeight: 700, color: C.purple, marginBottom: 8 }}>నమస్కారం!</div>
                    <div style={{ fontFamily: FONT_TELUGU, fontSize: 64, fontWeight: 900, color: C.outline, lineHeight: 1.15 }}>
                        అన్సీన్ సిస్టమ్‌కి స్వాగతం
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 2: TELUGU HABITS COMPARISON ─────────────────

const SceneTelugu2: React.FC = () => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill style={{ backgroundColor: C.bgYellow }}>
            <div style={{ position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex', gap: 50, alignItems: 'center' }}>
                <div style={{ flex: 1, backgroundColor: C.cardBg, padding: 30, borderRadius: 28, border: `4px stroke ${C.outline}` }}>
                    <div style={{ fontFamily: FONT_TELUGU, fontSize: 34, fontWeight: 700, color: C.red }}>బాబ్ అలవాటు</div>
                    <div style={{ fontFamily: FONT_TELUGU, fontSize: 44, fontWeight: 900, color: C.outline, marginTop: 8 }}>కాఫీలు & గ్యాడ్జెట్స్ వేస్ట్</div>
                </div>

                <div style={{ flex: 1, backgroundColor: C.cardBg, padding: 30, borderRadius: 28, border: `4px stroke ${C.outline}` }}>
                    <div style={{ fontFamily: FONT_TELUGU, fontSize: 34, fontWeight: 700, color: C.emerald }}>ఆలిస్ అలవాటు</div>
                    <div style={{ fontFamily: FONT_TELUGU, fontSize: 44, fontWeight: 900, color: C.outline, marginTop: 8 }}>రోజూ ₹500 ఇన్వెస్ట్‌మెంట్</div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 3: TELUGU COMPOUNDING PAYOFF ────────────────

const SceneTelugu3: React.FC = () => {
    const frame = useCurrentFrame();
    const countVal = Math.min(10000000, Math.floor(interpolate(frame, [10, 120], [250000, 10000000])));

    return (
        <AbsoluteFill style={{ backgroundColor: C.bgMint }}>
            <div style={{ position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ fontFamily: FONT_TELUGU, fontSize: 42, fontWeight: 700, color: C.outline }}>ముప్పై సంవత్సరాల తర్వాత...</div>
                <div style={{ fontFamily: FONT_TELUGU, fontSize: 80, fontWeight: 900, color: C.emerald, backgroundColor: C.cardBg, padding: '16px 44px', borderRadius: 28, border: `4px stroke ${C.outline}`, marginTop: 12 }}>
                    ఆలిస్ సంపద: ₹{countVal.toLocaleString()}
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 4: TELUGU OUTRO ─────────────────────────────

const SceneTelugu4: React.FC = () => {
    const frame = useCurrentFrame();
    const sprSub = spring({ frame: frame - 10, fps: 30 });

    return (
        <AbsoluteFill style={{ backgroundColor: '#0F172A', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontFamily: FONT_TELUGU, fontSize: 40, color: C.gold, marginBottom: 12 }}>
                మీ డబ్బు మీకోసం పనిచేసేలా చేయండి
            </div>
            <div style={{ fontFamily: FONT_TELUGU, fontSize: 75, fontWeight: 900, color: C.white, marginBottom: 24 }}>
                అన్సీన్ సిస్టమ్
            </div>
            <div style={{ transform: `scale(${sprSub})`, backgroundColor: C.red, padding: '18px 44px', borderRadius: 36, fontFamily: FONT_TELUGU, fontSize: 36, fontWeight: 700, color: C.white }}>
                సబ్‌స్క్రైబ్ చేసుకోండి!
            </div>
        </AbsoluteFill>
    );
};

// ─── MAIN COMPOSITION ROOT ──────────────────────────────

export const TeluguUnseenStory: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: C.bg }}>
            <style>{FONT_IMPORT}</style>
            <style>{TELUGU_FONT}</style>

            <Sequence from={F1} durationInFrames={S1}>
                <SceneTelugu1 />
                <Audio src={staticFile('telugu_vo_1.mp3')} />
            </Sequence>

            <Sequence from={F2} durationInFrames={S2}>
                <SceneTelugu2 />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('telugu_vo_2.mp3')} />
            </Sequence>

            <Sequence from={F3} durationInFrames={S3}>
                <SceneTelugu3 />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('sfx/rise.mp3')} volume={0.8} />
                <Audio src={staticFile('telugu_vo_3.mp3')} />
            </Sequence>

            <Sequence from={F4} durationInFrames={S4}>
                <SceneTelugu4 />
                <Audio src={staticFile('telugu_vo_4.mp3')} />
            </Sequence>
        </AbsoluteFill>
    );
};
