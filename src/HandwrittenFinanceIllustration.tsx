import React from 'react';
import {
    AbsoluteFill, useCurrentFrame, interpolate, spring,
    Audio, staticFile
} from 'remotion';
import { FONT_IMPORT, FONT_STACK } from './components/PremiumKit';

// ─── COLOR PALETTE (Hand-Drawn Sketchbook / Chalkboard Theme) ───
const C = {
    paperBg: '#0F172A',
    inkPrimary: '#F8FAFC',
    inkGold: '#F59E0B',
    inkEmerald: '#10B981',
    inkCyan: '#06B6D4',
    inkRed: '#EF4444',
    sketchLine: '#38BDF8',
    cardBg: 'rgba(30, 41, 59, 0.85)',
    border: 'rgba(255, 255, 255, 0.15)'
};

// ─── DYNAMIC HAND-DRAWN PATH ANIMATIONS ────────────────

// Hand-drawn Sketch Circle Highlight
const HandDrawnCircle: React.FC<{ progress: number; color?: string }> = ({ progress, color = C.inkGold }) => {
    const dash = 380;
    const offset = dash * (1 - progress);
    return (
        <svg width="260" height="100" viewBox="0 0 260 100" style={{ position: 'absolute', pointerEvents: 'none' }}>
            <path
                d="M 20,50 C 30,15 220,10 240,45 C 255,80 30,90 15,55 C 5,30 180,18 245,40"
                fill="none"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={dash}
                strokeDashoffset={offset}
            />
        </svg>
    );
};

// Hand-drawn Squiggly Underline
const HandDrawnUnderline: React.FC<{ progress: number; color?: string }> = ({ progress, color = C.inkEmerald }) => {
    const dash = 400;
    const offset = dash * (1 - progress);
    return (
        <svg width="350" height="30" viewBox="0 0 350 30" style={{ marginTop: 5 }}>
            <path
                d="M 10,15 Q 90,25 175,12 T 340,18"
                fill="none"
                stroke={color}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={dash}
                strokeDashoffset={offset}
            />
        </svg>
    );
};

// Hand-drawn Bank Ledger Vector Illustration
const HandDrawnBankSVG: React.FC<{ progress: number }> = ({ progress }) => {
    const dash = 600;
    const offset = dash * (1 - progress);
    return (
        <svg width="180" height="180" viewBox="0 0 100 100">
            {/* Bank Roof */}
            <path d="M 10,35 L 50,15 L 90,35 Z" fill="none" stroke={C.sketchLine} strokeWidth="3" strokeDasharray={dash} strokeDashoffset={offset} />
            {/* Columns */}
            <path d="M 20,35 L 20,75 M 40,35 L 40,75 M 60,35 L 60,75 M 80,35 L 80,75" fill="none" stroke={C.inkPrimary} strokeWidth="3" strokeDasharray={dash} strokeDashoffset={offset} />
            {/* Base */}
            <path d="M 10,75 L 90,75 M 5,82 L 95,82" fill="none" stroke={C.sketchLine} strokeWidth="4" strokeDasharray={dash} strokeDashoffset={offset} />
        </svg>
    );
};

// ─── TYPEWRITER HANDWRITTEN TEXT REVEAL ───────────────

const TypewriterText: React.FC<{ text: string; progress: number; fontSize?: number; color?: string }> = ({ text, progress, fontSize = 48, color = C.inkPrimary }) => {
    const charsToShow = Math.floor(text.length * progress);
    const visibleText = text.slice(0, charsToShow);

    return (
        <span style={{
            fontFamily: FONT_STACK.handwritten,
            fontSize,
            color,
            lineHeight: 1.2
        }}>
            {visibleText}
            {progress < 1 && <span style={{ opacity: Math.floor(progress * 20) % 2 === 0 ? 1 : 0, color: C.inkGold }}>|</span>}
        </span>
    );
};

// ─── MAIN COMPOSITION ─────────────────────────────────

export const HandwrittenFinanceIllustration: React.FC = () => {
    const frame = useCurrentFrame();

    // Sub-Scene Timing (Clean paper presentation, NO HUD)
    const isPhase1 = frame < 220;
    const isPhase2 = frame >= 220 && frame < 460;
    const isPhase3 = frame >= 460;

    // Progress animations
    const typeProg1 = interpolate(frame, [10, 180], [0, 1], { extrapolateRight: 'clamp' });
    const drawProg1 = interpolate(frame, [30, 160], [0, 1], { extrapolateRight: 'clamp' });
    const circleProg = interpolate(frame, [120, 190], [0, 1], { extrapolateRight: 'clamp' });

    const typeProg2 = interpolate(frame, [230, 420], [0, 1], { extrapolateRight: 'clamp' });
    const drawProg2 = interpolate(frame, [250, 400], [0, 1], { extrapolateRight: 'clamp' });

    const typeProg3 = interpolate(frame, [470, 680], [0, 1], { extrapolateRight: 'clamp' });
    const sprCard = spring({ frame: frame - 460, fps: 30, config: { damping: 12 } });

    // Camera Drift
    const camScale = interpolate(frame, [0, 720], [1.0, 1.12]);
    const camX = interpolate(frame, [0, 720], [-10, 15]);

    return (
        <AbsoluteFill style={{ backgroundColor: C.paperBg }}>
            <style>{FONT_IMPORT}</style>

            <Audio src={staticFile('handwritten_vo.mp3')} />

            {/* Play typing sound effect during active text typing phases */}
            {(isPhase1 && frame > 10 && frame < 180) && (
                <Audio src={staticFile('sfx/typing.mp3')} volume={0.4} />
            )}
            {(isPhase2 && frame > 230 && frame < 420) && (
                <Audio src={staticFile('sfx/typing.mp3')} volume={0.4} />
            )}

            {/* Chalkboard / Paper Texture Background (Clean, No HUD) */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.08) 0%, transparent 70%), linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
                backgroundSize: '100% 100%, 50px 50px, 50px 50px'
            }} />

            {/* Dynamic Camera Drift Wrapper */}
            <div style={{
                width: '100%', height: '100%',
                transform: `scale(${camScale}) translateX(${camX}px)`
            }}>

                {/* PHASE 1: Handwritten Hook + Vector Sketch */}
                {isPhase1 && (
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 80 }}>
                        <div style={{ display: 'flex', gap: 60, alignItems: 'center', maxWidth: 1400 }}>
                            <div style={{ flex: 1.3, position: 'relative' }}>
                                <div style={{ marginBottom: 15 }}>
                                    <TypewriterText
                                        text="HOW IS MONEY ACTUALLY CREATED?"
                                        progress={typeProg1}
                                        fontSize={64}
                                        color={C.inkGold}
                                    />
                                </div>
                                <div style={{ fontSize: 44, color: C.inkPrimary, fontFamily: FONT_STACK.handwritten }}>
                                    It isn't printed by central banks... 90% is sketched into existence by commercial banks.
                                </div>

                                {/* Hand-drawn Circle Highlight */}
                                {frame > 120 && (
                                    <div style={{ position: 'absolute', top: -10, left: -20 }}>
                                        <HandDrawnCircle progress={circleProg} color={C.inkGold} />
                                    </div>
                                )}
                            </div>

                            {/* Hand-Drawn Bank SVG */}
                            <div style={{ flex: 0.8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <HandDrawnBankSVG progress={drawProg1} />
                                {frame === 30 && <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />}
                            </div>
                        </div>
                    </AbsoluteFill>
                )}

                {/* PHASE 2: Hand-Drawn Ledger Trick */}
                {isPhase2 && (
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 80 }}>
                        <div style={{ textAlignment: 'center', maxWidth: 1300, textAlign: 'center' }}>
                            <div style={{ fontSize: 72, fontFamily: FONT_STACK.handwritten, color: C.inkCyan, marginBottom: 20 }}>
                                THE HANDWRITTEN LEDGER TRICK
                            </div>

                            <div style={{
                                backgroundColor: C.cardBg, padding: 50, borderRadius: 28,
                                border: `1px stroke ${C.border}`, backdropFilter: 'blur(16px)',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20
                            }}>
                                <div style={{ fontSize: 48, fontFamily: FONT_STACK.handwritten, color: C.inkPrimary }}>
                                    <TypewriterText
                                        text="When you take out a loan, the bank creates your debt AND your deposit at the exact same moment."
                                        progress={typeProg2}
                                        fontSize={46}
                                        color={C.inkPrimary}
                                    />
                                </div>

                                <HandDrawnUnderline progress={drawProg2} color={C.inkEmerald} />
                                {frame === 250 && <Audio src={staticFile('sfx/pop.mp3')} volume={0.7} />}
                            </div>
                        </div>
                    </AbsoluteFill>
                )}

                {/* PHASE 3: Sketched Into Existence */}
                {isPhase3 && (
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 80 }}>
                        <div style={{
                            backgroundColor: C.cardBg, padding: '60px 100px', borderRadius: 36,
                            border: `2px stroke ${C.inkEmerald}`, backdropFilter: 'blur(20px)',
                            transform: `scale(${sprCard})`, textAlign: 'center',
                            boxShadow: '0 30px 80px rgba(16, 185, 129, 0.25)'
                        }}>
                            <div style={{ fontSize: 84, fontFamily: FONT_STACK.handwritten, color: C.inkEmerald, marginBottom: 15 }}>
                                SKETCHED INTO EXISTENCE
                            </div>

                            <div style={{ fontSize: 48, fontFamily: FONT_STACK.handwritten, color: C.white }}>
                                <TypewriterText
                                    text="Money is simply a digital entry on a commercial ledger."
                                    progress={typeProg3}
                                    fontSize={48}
                                    color={C.white}
                                />
                            </div>
                            {frame === 460 && <Audio src={staticFile('sfx/rise.mp3')} volume={0.8} />}
                        </div>
                    </AbsoluteFill>
                )}

            </div>
        </AbsoluteFill>
    );
};
