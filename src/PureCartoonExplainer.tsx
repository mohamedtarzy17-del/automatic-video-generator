import React from 'react';
import {
    AbsoluteFill, useCurrentFrame, interpolate, spring,
    Audio, staticFile, Sequence
} from 'remotion';
import { FONT_IMPORT, FONT_STACK } from './components/PremiumKit';

// ─── CARTOON COLOR PALETTE (Kurzgesagt / 2D Animation Theme) ───
const C = {
    bgSky: '#A5F3FC',       // Vibrant Soft Cyan
    bgYellow: '#FEF08A',    // Pastel Yellow
    bgPink: '#FBCFE8',      // Bubblegum Pink
    cardBg: '#FFFBEB',      // Cream White
    outline: '#1E293B',     // Bold Dark Outline
    bobShirt: '#3B82F6',    // Bright Blue
    bobSkin: '#FDBA74',     // Warm Peach
    thiefBlack: '#334155',  // Dark Slate
    emerald: '#10B981',
    gold: '#F59E0B',
    red: '#EF4444'
};

// ─── ANIMATED 2D CARTOON CHARACTER: BOB ─────────────────

const CartoonBobSVG: React.FC<{ frame: number; isSad?: boolean }> = ({ frame, isSad = false }) => {
    // Bobbing motion
    const bobY = Math.sin(frame * 0.15) * 6;
    // Eye blink
    const isBlinking = frame % 90 < 6;
    // Mouth talking
    const mouthHeight = Math.abs(Math.sin(frame * 0.4)) * 10 + 4;

    return (
        <svg width="180" height="240" viewBox="0 0 100 140" style={{ transform: `translateY(${bobY}px)` }}>
            {/* Body / Shirt */}
            <path d="M 25,75 L 75,75 L 82,130 L 18,130 Z" fill={C.bobShirt} stroke={C.outline} strokeWidth="4" strokeLinejoin="round" />
            
            {/* Head */}
            <circle cx="50" cy="45" r="28" fill={C.bobSkin} stroke={C.outline} strokeWidth="4" />
            
            {/* Hair */}
            <path d="M 24,38 Q 30,15 50,15 Q 70,15 76,38 Z" fill="#78350F" stroke={C.outline} strokeWidth="3" />
            
            {/* Eyes */}
            {!isBlinking ? (
                <>
                    <circle cx="40" cy="42" r="5" fill={C.outline} />
                    <circle cx="60" cy="42" r="5" fill={C.outline} />
                </>
            ) : (
                <>
                    <line x1="35" y1="42" x2="45" y2="42" stroke={C.outline} strokeWidth="3" />
                    <line x1="55" y1="42" x2="65" y2="42" stroke={C.outline} strokeWidth="3" />
                </>
            )}

            {/* Mouth */}
            {!isSad ? (
                <ellipse cx="50" cy="58" rx="8" ry={mouthHeight / 2} fill={C.outline} />
            ) : (
                <path d="M 40,62 Q 50,54 60,62" fill="none" stroke={C.outline} strokeWidth="3" strokeLinecap="round" />
            )}
        </svg>
    );
};

// ─── ANIMATED 2D CARTOON CHARACTER: INFLATION THIEF ───

const CartoonThiefSVG: React.FC<{ progress: number }> = ({ progress }) => {
    const xPos = interpolate(progress, [0, 1], [-150, 450]);
    const bobY = Math.abs(Math.sin(progress * 20)) * 10;

    return (
        <div style={{ position: 'absolute', left: xPos, bottom: 20, transform: `translateY(-${bobY}px)` }}>
            <svg width="160" height="200" viewBox="0 0 100 120">
                {/* Money Sack */}
                <path d="M 10,50 Q 5,100 45,100 Q 80,100 70,50 Z" fill={C.gold} stroke={C.outline} strokeWidth="4" />
                <text x="35" y="80" fontFamily={FONT_STACK.mono} fontSize="24" fill={C.outline} fontWeight="bold">$</text>
                
                {/* Thief Body */}
                <circle cx="50" cy="35" r="22" fill={C.thiefBlack} stroke={C.outline} strokeWidth="4" />
                {/* Mask */}
                <rect x="30" y="30" width="40" height="12" rx="4" fill={C.outline} />
                <circle cx="40" cy="36" r="3" fill={C.white} />
                <circle cx="60" cy="36" r="3" fill={C.white} />
            </svg>
        </div>
    );
};

// ─── ANIMATED SHRINKING DOLLAR BILL ───────────────────

const CartoonShrinkingDollar: React.FC<{ scaleProgress: number }> = ({ scaleProgress }) => {
    const currentScale = interpolate(scaleProgress, [0, 1], [1.0, 0.45]);

    return (
        <div style={{
            transform: `scale(${currentScale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.1s linear'
        }}>
            <div style={{
                width: 260, height: 140, backgroundColor: C.emerald,
                borderRadius: 20, border: `5px stroke ${C.outline}`,
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                alignItems: 'center', boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
                position: 'relative'
            }}>
                <div style={{ position: 'absolute', top: 10, left: 14, fontFamily: FONT_STACK.mono, fontSize: 18, color: C.outline, fontWeight: 'bold' }}>$</div>
                <div style={{ position: 'absolute', bottom: 10, right: 14, fontFamily: FONT_STACK.mono, fontSize: 18, color: C.outline, fontWeight: 'bold' }}>$</div>
                <div style={{
                    width: 60, height: 60, borderRadius: '50%', border: `4px stroke ${C.outline}`,
                    backgroundColor: '#A7F3D0', display: 'flex', justifyContent: 'center', alignItems: 'center',
                    fontFamily: FONT_STACK.bebas, fontSize: 40, color: C.outline
                }}>
                    $100
                </div>
            </div>
        </div>
    );
};

// ─── SCENE 1: MEET BOB (2D Cartoon Intro) ──────────────

const SceneOne: React.FC = () => {
    const frame = useCurrentFrame();

    const sprBob = spring({ frame: frame - 10, fps: 30, config: { damping: 10 } });
    const typeProg = interpolate(frame, [15, 120], [0, 1], { extrapolateRight: 'clamp' });

    const titleText = "MEET BOB.";
    const charsToShow = Math.floor(titleText.length * typeProg);

    return (
        <AbsoluteFill style={{ backgroundColor: C.bgSky }}>
            {/* Typewriter Audio */}
            {frame > 15 && frame < 120 && (
                <Audio src={staticFile('sfx/typing.mp3')} volume={0.35} />
            )}

            <div style={{
                position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex',
                gap: 60, alignItems: 'center', boxSizing: 'border-box'
            }}>
                {/* 2D Cartoon Character Bob */}
                <div style={{ transform: `scale(${sprBob})` }}>
                    <div style={{
                        backgroundColor: C.cardBg, padding: 30, borderRadius: 32,
                        border: `5px stroke ${C.outline}`, boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                    }}>
                        <CartoonBobSVG frame={frame} isSad={false} />
                    </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, boxSizing: 'border-box' }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, color: C.outline, fontSize: 48, marginBottom: 8 }}>
                        2D Cartoon Explainer
                    </div>

                    <div style={{ fontFamily: FONT_STACK.display, fontSize: 100, color: C.outline, lineHeight: 1.05 }}>
                        {titleText.slice(0, charsToShow)}
                    </div>

                    <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 36, color: C.outline, marginTop: 20 }}>
                        Bob works hard and saves his money in the bank.
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 2: THE INVISIBLE INFLATION THIEF ───────────

const SceneTwo: React.FC = () => {
    const frame = useCurrentFrame();

    const thiefProg = interpolate(frame, [10, 160], [0, 1], { extrapolateRight: 'clamp' });
    const shrinkProg = interpolate(frame, [20, 150], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill style={{ backgroundColor: C.bgYellow, overflow: 'hidden' }}>
            <div style={{
                position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex',
                flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                boxSizing: 'border-box', textAlign: 'center'
            }}>
                <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 42, color: C.outline, marginBottom: 10 }}>
                    Every Night While Bob Sleeps...
                </div>

                <div style={{ fontFamily: FONT_STACK.display, fontSize: 80, color: C.red, lineHeight: 1.05, marginBottom: 30 }}>
                    INFLATION ACTS LIKE AN INVISIBLE THIEF
                </div>

                <div style={{ display: 'flex', gap: 50, alignItems: 'center' }}>
                    <CartoonShrinkingDollar scaleProgress={shrinkProg} />

                    <div style={{
                        backgroundColor: C.cardBg, padding: '20px 40px', borderRadius: 20,
                        border: `4px stroke ${C.outline}`, fontFamily: FONT_STACK.mono, fontSize: 24, color: C.red
                    }}>
                        PURCHASING POWER: -5% / YEAR
                    </div>
                </div>

                {/* Sneaking Cartoon Thief */}
                <CartoonThiefSVG progress={thiefProg} />
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 3: BOB'S PURCHASING POWER SHRINKING ────────

const SceneThree: React.FC = () => {
    const frame = useCurrentFrame();

    const sprMain = spring({ frame: frame - 10, fps: 30, config: { damping: 10 } });

    return (
        <AbsoluteFill style={{ backgroundColor: C.bgPink }}>
            <div style={{
                position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex',
                gap: 60, alignItems: 'center', boxSizing: 'border-box'
            }}>
                {/* Sad Bob */}
                <div style={{
                    backgroundColor: C.cardBg, padding: 30, borderRadius: 32,
                    border: `5px stroke ${C.outline}`, boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}>
                    <CartoonBobSVG frame={frame} isSad={true} />
                </div>

                <div style={{ flex: 1, boxSizing: 'border-box' }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 40, color: C.outline, marginBottom: 10 }}>
                        The Hidden Tax
                    </div>

                    <div style={{
                        fontFamily: FONT_STACK.display, fontSize: 85, color: C.outline, lineHeight: 1.05,
                        transform: `scale(${sprMain})`
                    }}>
                        SHRINKING THE VALUE OF <span style={{ color: C.red }}>EVERY DOLLAR</span>
                    </div>

                    <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 36, color: C.outline, marginTop: 20 }}>
                        Learn how to protect your purchasing power today!
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── MAIN COMPOSITION ROOT ──────────────────────────────

export const PureCartoonExplainer: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: C.bgSky }}>
            <style>{FONT_IMPORT}</style>

            <Audio src={staticFile('cartoon_vo.mp3')} />

            {/* Segment 1: Meet Bob */}
            <Sequence from={0} durationInFrames={180}>
                <SceneOne />
            </Sequence>

            {/* Segment 2: Inflation Thief */}
            <Sequence from={180} durationInFrames={220}>
                <SceneTwo />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('sfx/pop.mp3')} volume={0.7} />
            </Sequence>

            {/* Segment 3: Sad Bob & Callout */}
            <Sequence from={400} durationInFrames={260}>
                <SceneThree />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('sfx/rise.mp3')} volume={0.8} />
            </Sequence>
        </AbsoluteFill>
    );
};
