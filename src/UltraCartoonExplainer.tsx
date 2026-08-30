import React from 'react';
import {
    AbsoluteFill, useCurrentFrame, interpolate, spring,
    Audio, staticFile, Sequence
} from 'remotion';
import { FONT_IMPORT, FONT_STACK } from './components/PremiumKit';

// ─── STUDIO CARTOON COLOR PALETTE ──────────────────────
const C = {
    bgSky: '#BAE6FD',       // Bright Pastel Blue
    bgYellow: '#FEF08A',    // Pastel Yellow
    bgPurple: '#DDD6FE',    // Pastel Purple
    cardBg: '#FFFBEB',      // Cream White
    outline: '#0F172A',     // Bold Dark Outline
    bobShirt: '#3B82F6',    // Bright Blue
    bobSkin: '#FDBA74',     // Warm Peach
    emerald: '#10B981',
    gold: '#F59E0B',
    red: '#EF4444',
    purple: '#8B5CF6'
};

// ─── 1. STUDIO CARTOON CHARACTER: RIGGED BOB ──────────

const CartoonBobStudioSVG: React.FC<{
    frame: number;
    expression?: 'neutral' | 'shocked' | 'happy';
    holdingItem?: 'none' | 'coffee' | 'piggyBank' | 'chart';
}> = ({ frame, expression = 'neutral', holdingItem = 'none' }) => {
    // Bobbing & Breathing Physics
    const bobY = Math.sin(frame * 0.16) * 5;
    const isBlinking = frame % 80 < 5;
    const mouthH = Math.abs(Math.sin(frame * 0.45)) * 10 + 4;

    // Eyebrow tilts per expression
    const eyebrowRot = expression === 'shocked' ? -12 : expression === 'happy' ? 8 : 0;
    const eyebrowY = expression === 'shocked' ? -6 : 0;

    return (
        <svg width="220" height="280" viewBox="0 0 120 160" style={{ transform: `translateY(${bobY}px)` }}>
            {/* Shock Lines (when shocked) */}
            {expression === 'shocked' && (
                <g>
                    <line x1="20" y1="10" x2="10" y2="0" stroke={C.red} strokeWidth="4" strokeLinecap="round" />
                    <line x1="60" y1="5" x2="60" y2="-10" stroke={C.red} strokeWidth="4" strokeLinecap="round" />
                    <line x1="100" y1="10" x2="110" y2="0" stroke={C.red} strokeWidth="4" strokeLinecap="round" />
                </g>
            )}

            {/* Body / Shirt */}
            <path d="M 30,85 L 90,85 L 98,150 L 22,150 Z" fill={C.bobShirt} stroke={C.outline} strokeWidth="4" strokeLinejoin="round" />
            
            {/* Left Arm & Hand */}
            <path d="M 30,90 Q 15,110 20,130" fill="none" stroke={C.outline} strokeWidth="6" strokeLinecap="round" />
            <circle cx="20" cy="130" r="7" fill={C.bobSkin} stroke={C.outline} strokeWidth="3" />

            {/* Right Arm (Holding Item) */}
            {holdingItem === 'coffee' && (
                <g>
                    <path d="M 90,90 Q 105,105 95,120" fill="none" stroke={C.outline} strokeWidth="6" strokeLinecap="round" />
                    {/* Coffee Cup */}
                    <rect x="90" y="112" width="18" height="24" rx="4" fill="#F97316" stroke={C.outline} strokeWidth="3" />
                    <path d="M 108,118 Q 116,124 108,130" fill="none" stroke={C.outline} strokeWidth="3" />
                </g>
            )}
            {holdingItem === 'piggyBank' && (
                <g>
                    <path d="M 90,90 Q 108,100 100,115" fill="none" stroke={C.outline} strokeWidth="6" strokeLinecap="round" />
                    {/* Piggy Bank */}
                    <circle cx="102" cy="118" r="16" fill="#EC4899" stroke={C.outline} strokeWidth="3" />
                    <circle cx="96" cy="114" r="2" fill={C.outline} />
                </g>
            )}
            {holdingItem === 'none' && (
                <g>
                    <path d="M 90,90 Q 105,110 100,130" fill="none" stroke={C.outline} strokeWidth="6" strokeLinecap="round" />
                    <circle cx="100" cy="130" r="7" fill={C.bobSkin} stroke={C.outline} strokeWidth="3" />
                </g>
            )}

            {/* Head */}
            <circle cx="60" cy="50" r="30" fill={C.bobSkin} stroke={C.outline} strokeWidth="4" />
            
            {/* Hair */}
            <path d="M 32,42 Q 40,18 60,18 Q 80,18 88,42 Z" fill="#78350F" stroke={C.outline} strokeWidth="3" />
            
            {/* Eyebrows */}
            <g style={{ transform: `translateY(${eyebrowY}px)` }}>
                <line x1="42" y1="36" x2="54" y2="36" stroke={C.outline} strokeWidth="4" strokeLinecap="round" style={{ transform: `rotate(${eyebrowRot}deg)`, transformOrigin: '48px 36px' }} />
                <line x1="66" y1="36" x2="78" y2="36" stroke={C.outline} strokeWidth="4" strokeLinecap="round" style={{ transform: `rotate(${-eyebrowRot}deg)`, transformOrigin: '72px 36px' }} />
            </g>

            {/* Eyes */}
            {!isBlinking ? (
                <>
                    <circle cx="48" cy="46" r="5" fill={C.outline} />
                    <circle cx="72" cy="46" r="5" fill={C.outline} />
                </>
            ) : (
                <>
                    <line x1="43" y1="46" x2="53" y2="46" stroke={C.outline} strokeWidth="3" />
                    <line x1="67" y1="46" x2="77" y2="46" stroke={C.outline} strokeWidth="3" />
                </>
            )}

            {/* Mouth Expression */}
            {expression === 'neutral' && <ellipse cx="60" cy="62" rx="8" ry={mouthH / 2} fill={C.outline} />}
            {expression === 'shocked' && <circle cx="60" cy="64" r="10" fill={C.outline} />}
            {expression === 'happy' && <path d="M 48,60 Q 60,72 72,60 Z" fill={C.red} stroke={C.outline} strokeWidth="3" />}
        </svg>
    );
};

// ─── 2. CARTOON THOUGHT BUBBLE ─────────────────────────

const CartoonThoughtBubble: React.FC<{ progress: number; iconText?: string }> = ({ progress, iconText = "💡" }) => {
    const scale = interpolate(progress, [0, 1], [0, 1]);

    return (
        <div style={{
            position: 'absolute', top: -110, right: -40,
            transform: `scale(${scale})`, transformOrigin: 'bottom left',
            display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>
            <div style={{
                backgroundColor: C.cardBg, padding: '16px 28px', borderRadius: 30,
                border: `4px stroke ${C.outline}`, boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                fontSize: 40
            }}>
                {iconText}
            </div>
            {/* Bubble Tail Clusters */}
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: C.cardBg, border: `3px stroke ${C.outline}` }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: C.cardBg, border: `2px stroke ${C.outline}`, marginTop: 6 }} />
            </div>
        </div>
    );
};

// ─── 3. COMIC STARBURST IMPACT EXPLOSION ────────────────

const ComicImpactBurst: React.FC<{ progress: number }> = ({ progress }) => {
    const scale = interpolate(progress, [0, 1], [0.2, 1.2]);
    const opacity = interpolate(progress, [0.8, 1], [1, 0]);

    return (
        <div style={{
            position: 'absolute', pointerEvents: 'none',
            transform: `scale(${scale})`, opacity
        }}>
            <svg width="200" height="200" viewBox="0 0 100 100">
                <polygon points="50,5 62,35 95,25 72,50 95,75 62,65 50,95 38,65 5,75 28,50 5,25 38,35" fill={C.gold} stroke={C.outline} strokeWidth="3" />
            </svg>
        </div>
    );
};

// ─── 4. MULTI-LAYERED PARALLAX BACKGROUND ──────────────

const ParallaxBackground: React.FC<{ frame: number; bgType?: 'sky' | 'yellow' | 'purple' }> = ({ frame, bgType = 'sky' }) => {
    const cloudX1 = interpolate(frame, [0, 600], [0, 80]);
    const cloudX2 = interpolate(frame, [0, 600], [0, -100]);

    const bgColor = bgType === 'sky' ? C.bgSky : bgType === 'yellow' ? C.bgYellow : C.bgPurple;

    return (
        <AbsoluteFill style={{ backgroundColor: bgColor, overflow: 'hidden' }}>
            {/* Layer 1: Drifting Clouds */}
            <div style={{ position: 'absolute', top: 40, left: cloudX1 + 100 }}>
                <svg width="140" height="60" viewBox="0 0 100 50">
                    <path d="M 20,40 Q 10,20 30,20 Q 40,5 60,15 Q 80,5 85,25 Q 95,30 90,40 Z" fill={C.cardBg} stroke={C.outline} strokeWidth="3" />
                </svg>
            </div>
            <div style={{ position: 'absolute', top: 90, right: cloudX2 + 150 }}>
                <svg width="180" height="70" viewBox="0 0 100 50">
                    <path d="M 20,40 Q 10,20 30,20 Q 40,5 60,15 Q 80,5 85,25 Q 95,30 90,40 Z" fill={C.cardBg} stroke={C.outline} strokeWidth="3" />
                </svg>
            </div>

            {/* Layer 2: Cartoon City Skyline Midground */}
            <div style={{ position: 'absolute', bottom: 0, width: '100%', display: 'flex', justifyContent: 'space-around', opacity: 0.25 }}>
                {[120, 180, 150, 210, 140, 190].map((h, idx) => (
                    <div key={idx} style={{
                        width: 140, height: h, backgroundColor: C.outline,
                        borderTopLeftRadius: 12, borderTopRightRadius: 12
                    }} />
                ))}
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 1: SPENDING HABITS (Bob with Coffee) ────────

const SceneOne: React.FC = () => {
    const frame = useCurrentFrame();

    const sprBob = spring({ frame: frame - 10, fps: 30, config: { damping: 10 } });
    const typeProg = interpolate(frame, [15, 120], [0, 1], { extrapolateRight: 'clamp' });
    const thoughtProg = interpolate(frame, [40, 90], [0, 1], { extrapolateRight: 'clamp' });

    const titleText = "EVERYDAY SPENDING vs WEALTH";
    const charsToShow = Math.floor(titleText.length * typeProg);

    return (
        <AbsoluteFill>
            <ParallaxBackground frame={frame} bgType="sky" />

            {/* Typewriter Audio */}
            {frame > 15 && frame < 120 && (
                <Audio src={staticFile('sfx/typing.mp3')} volume={0.35} />
            )}

            <div style={{
                position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex',
                gap: 60, alignItems: 'center', boxSizing: 'border-box'
            }}>
                {/* Rigged Bob Holding Coffee + Thought Bubble */}
                <div style={{ transform: `scale(${sprBob})`, position: 'relative' }}>
                    <div style={{
                        backgroundColor: C.cardBg, padding: 30, borderRadius: 32,
                        border: `5px stroke ${C.outline}`, boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                    }}>
                        <CartoonBobStudioSVG frame={frame} expression="neutral" holdingItem="coffee" />
                        {frame > 40 && <CartoonThoughtBubble progress={thoughtProg} iconText="☕" />}
                        {frame === 40 && <Audio src={staticFile('sfx/pop.mp3')} volume={0.7} />}
                    </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, boxSizing: 'border-box' }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, color: C.outline, fontSize: 44, marginBottom: 8 }}>
                        Studio 2D Cartoon Animation
                    </div>

                    <div style={{ fontFamily: FONT_STACK.display, fontSize: 80, color: C.outline, lineHeight: 1.05 }}>
                        {titleText.slice(0, charsToShow)}
                    </div>

                    <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 34, color: C.outline, marginTop: 20 }}>
                        Most people buy items that lose value over time...
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 2: THE COMPOUNDING SECRET (Bob Shocked) ─────

const SceneTwo: React.FC = () => {
    const frame = useCurrentFrame();

    const burstProg = interpolate(frame, [10, 50], [0, 1], { extrapolateRight: 'clamp' });
    const thoughtProg = interpolate(frame, [25, 75], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill>
            <ParallaxBackground frame={frame} bgType="yellow" />

            <div style={{
                position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex',
                gap: 60, alignItems: 'center', boxSizing: 'border-box'
            }}>
                {/* Shocked Bob Holding Piggy Bank */}
                <div style={{ position: 'relative' }}>
                    <div style={{
                        backgroundColor: C.cardBg, padding: 30, borderRadius: 32,
                        border: `5px stroke ${C.outline}`, boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                    }}>
                        <CartoonBobStudioSVG frame={frame} expression="shocked" holdingItem="piggyBank" />
                        {frame > 25 && <CartoonThoughtBubble progress={thoughtProg} iconText="🚀" />}
                    </div>
                    {frame > 10 && frame < 50 && <ComicImpactBurst progress={burstProg} />}
                </div>

                <div style={{ flex: 1, boxSizing: 'border-box' }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 42, color: C.outline, marginBottom: 10 }}>
                        The Compounding Secret
                    </div>

                    <div style={{ fontFamily: FONT_STACK.display, fontSize: 80, color: C.purple, lineHeight: 1.05 }}>
                        INVESTING $5 A DAY INTO PRODUCTIVE ASSETS
                    </div>

                    <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 34, color: C.outline, marginTop: 20 }}>
                        Watch daily habits transform into long-term financial freedom!
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 3: MASSIVE FORTUNE (Bob Happy) ──────────────

const SceneThree: React.FC = () => {
    const frame = useCurrentFrame();

    const sprMain = spring({ frame: frame - 10, fps: 30, config: { damping: 10 } });

    return (
        <AbsoluteFill>
            <ParallaxBackground frame={frame} bgType="purple" />

            <div style={{
                position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex',
                gap: 60, alignItems: 'center', boxSizing: 'border-box'
            }}>
                {/* Happy Bob */}
                <div style={{
                    backgroundColor: C.cardBg, padding: 30, borderRadius: 32,
                    border: `5px stroke ${C.outline}`, boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}>
                    <CartoonBobStudioSVG frame={frame} expression="happy" holdingItem="none" />
                </div>

                <div style={{ flex: 1, boxSizing: 'border-box' }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 42, color: C.outline, marginBottom: 10 }}>
                        Compound Interest Magic
                    </div>

                    <div style={{
                        fontFamily: FONT_STACK.display, fontSize: 88, color: C.emerald, lineHeight: 1.05,
                        transform: `scale(${sprMain})`
                    }}>
                        TURNS SMALL HABITS INTO A <span style={{ color: C.gold }}>MASSIVE FORTUNE</span>
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── MAIN COMPOSITION ROOT ──────────────────────────────

export const UltraCartoonExplainer: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: C.bgSky }}>
            <style>{FONT_IMPORT}</style>

            <Audio src={staticFile('ultra_cartoon_vo.mp3')} />

            {/* Segment 1: Bob with Coffee */}
            <Sequence from={0} durationInFrames={210}>
                <SceneOne />
            </Sequence>

            {/* Segment 2: Compounding Secret */}
            <Sequence from={210} durationInFrames={230}>
                <SceneTwo />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('sfx/pop.mp3')} volume={0.7} />
            </Sequence>

            {/* Segment 3: Massive Fortune */}
            <Sequence from={440} durationInFrames={250}>
                <SceneThree />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('sfx/rise.mp3')} volume={0.8} />
            </Sequence>
        </AbsoluteFill>
    );
};
