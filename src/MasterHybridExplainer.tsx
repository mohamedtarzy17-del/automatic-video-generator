import React from 'react';
import {
    AbsoluteFill, useCurrentFrame, interpolate, spring,
    Audio, OffthreadVideo, staticFile, Sequence
} from 'remotion';
import { FONT_IMPORT, FONT_STACK, getFontForScene } from './components/PremiumKit';

// ─── COLOR PALETTE ────────────────────────────────────
const C = {
    gold: '#F59E0B',
    cyan: '#06B6D4',
    emerald: '#10B981',
    red: '#EF4444',
    white: '#FFFFFF',
    textMuted: '#94A3B8',
    cardBg: 'rgba(15, 23, 42, 0.82)',
    border: 'rgba(255, 255, 255, 0.18)'
};

// ─── HAND-DRAWN SVG PATH HIGHLIGHTS ───────────────────

const HandDrawnUnderline: React.FC<{ progress: number; color?: string }> = ({ progress, color = C.gold }) => {
    const dash = 400;
    const offset = dash * (1 - progress);
    return (
        <svg width="320" height="24" viewBox="0 0 320 24" style={{ marginTop: 6 }}>
            <path
                d="M 10,12 Q 80,22 160,10 T 310,14"
                fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
                strokeDasharray={dash} strokeDashoffset={offset}
            />
        </svg>
    );
};

// Vector 2D Server Node Diagram Overlay
const VectorServerNodes: React.FC<{ progress: number }> = ({ progress }) => {
    const dash = 500;
    const offset = dash * (1 - progress);
    return (
        <svg width="320" height="110" viewBox="0 0 340 120">
            {/* Connection Lines */}
            <path d="M 40,60 L 170,30 L 300,60 M 170,30 L 170,90" fill="none" stroke={C.cyan} strokeWidth="3" strokeDasharray={dash} strokeDashoffset={offset} />
            {/* Nodes */}
            <circle cx="40" cy="60" r="18" fill="rgba(6,182,212,0.2)" stroke={C.cyan} strokeWidth="3" />
            <circle cx="170" cy="30" r="22" fill="rgba(245,158,11,0.2)" stroke={C.gold} strokeWidth="3" />
            <circle cx="300" cy="60" r="18" fill="rgba(6,182,212,0.2)" stroke={C.cyan} strokeWidth="3" />
            <circle cx="170" cy="90" r="18" fill="rgba(16,185,129,0.2)" stroke={C.emerald} strokeWidth="3" />
        </svg>
    );
};

// ─── SCENE 1: HYBRID HOOK (Pexels Video + Hand-Drawn Typo + SFX) ───

const SceneOne: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(0);

    const typeProg = interpolate(frame, [15, 160], [0, 1], { extrapolateRight: 'clamp' });
    const lineProg = interpolate(frame, [100, 170], [0, 1], { extrapolateRight: 'clamp' });
    const camScale = interpolate(frame, [0, 240], [1.0, 1.06]);

    const titleText = "HIGH-SPEED DIGITAL WAR";
    const charsToShow = Math.floor(titleText.length * typeProg);

    return (
        <AbsoluteFill>
            <OffthreadVideo
                src={staticFile('money_bg_1.mp4')}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${camScale})` }}
                muted
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(8,12,20,0.85) 0%, rgba(8,12,20,0.68) 50%, rgba(8,12,20,0.92) 100%)' }} />

            {/* Typewriter Audio */}
            {frame > 15 && frame < 160 && (
                <Audio src={staticFile('sfx/typing.mp3')} volume={0.35} />
            )}

            {/* Content Layer (Fixed margins & layout bounds) */}
            <div style={{
                position: 'absolute', inset: 0, padding: '100px 140px', display: 'flex',
                flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box'
            }}>
                <div style={{ fontFamily: FONT_STACK.handwritten, color: C.gold, fontSize: 38, marginBottom: 8 }}>
                    Behind every financial transaction...
                </div>

                <div style={{
                    fontFamily: font, fontSize: 88, color: C.white, lineHeight: 1.08,
                    wordBreak: 'break-word', maxWidth: 1400
                }}>
                    {titleText.slice(0, charsToShow)}
                </div>

                <HandDrawnUnderline progress={lineProg} color={C.gold} />

                <div style={{ fontFamily: FONT_STACK.inter, fontSize: 22, color: C.textMuted, marginTop: 22, maxWidth: 950, lineHeight: 1.5 }}>
                    Tapping your credit card sends data through six global servers in less than 400 milliseconds.
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 2: 2D VECTOR DIAGRAM OVER PEXELS VIDEO ─────

const SceneTwo: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(1);

    const drawProg = interpolate(frame, [20, 180], [0, 1], { extrapolateRight: 'clamp' });
    const sprCard = spring({ frame: frame - 15, fps: 30 });
    const camScale = interpolate(frame, [0, 250], [1.08, 1.01]);

    return (
        <AbsoluteFill>
            <OffthreadVideo
                src={staticFile('broll_data_center.mp4')}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${camScale})` }}
                muted
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,12,20,0.82)' }} />

            <div style={{
                position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex',
                gap: 50, alignItems: 'center', boxSizing: 'border-box'
            }}>
                <div style={{ flex: 1.1, boxSizing: 'border-box' }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, color: C.cyan, fontSize: 36 }}>
                        400 Milliseconds Latency
                    </div>
                    <div style={{ fontFamily: font, fontSize: 80, color: C.white, lineHeight: 1.08, marginTop: 8, wordBreak: 'break-word' }}>
                        SIX GLOBAL <span style={{ color: C.cyan }}>SERVERS</span>
                    </div>
                    <div style={{ fontFamily: FONT_STACK.inter, fontSize: 20, color: C.textMuted, marginTop: 18, lineHeight: 1.5 }}>
                        Routing transactions across legacy 1970s infrastructure in milliseconds.
                    </div>
                </div>

                <div style={{
                    flex: 1, backgroundColor: C.cardBg, padding: 36, borderRadius: 24,
                    border: `1px stroke ${C.border}`, backdropFilter: 'blur(20px)',
                    transform: `scale(${sprCard})`, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', boxSizing: 'border-box'
                }}>
                    <div style={{ fontFamily: FONT_STACK.mono, fontSize: 15, color: C.gold, marginBottom: 12 }}>TRANSACTION ROUTING GRAPH</div>
                    <VectorServerNodes progress={drawProg} />
                    <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 28, color: C.emerald, marginTop: 12 }}>
                        Instant Credit Verification
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 3: KINETIC TYPOGRAPHY CLOSING ──────────────

const SceneThree: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(2);

    const sprMain = spring({ frame: frame - 10, fps: 30, config: { damping: 10 } });

    return (
        <AbsoluteFill>
            <OffthreadVideo
                src={staticFile('debt_bg_5.mp4')}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                muted
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,12,20,0.88)' }} />

            <div style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                justify: 'center', alignItems: 'center', textAlign: 'center', padding: '100px 140px',
                boxSizing: 'border-box'
            }}>
                <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 38, color: C.gold, marginBottom: 12 }}>
                    Light, Glass & Secret Algorithms
                </div>

                <div style={{
                    fontFamily: font, fontSize: 92, color: C.white, lineHeight: 1.08,
                    transform: `scale(${sprMain})`, textShadow: '0 25px 60px rgba(0,0,0,0.95)',
                    maxWidth: 1400, wordBreak: 'break-word'
                }}>
                    MOVING <span style={{ color: C.emerald, backgroundColor: 'rgba(16, 185, 129, 0.2)', padding: '2px 14px', borderRadius: 10 }}>TRILLIONS</span> IN SILENCE
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── MAIN COMPOSITION ROOT ──────────────────────────────

export const MasterHybridExplainer: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#080C14' }}>
            <style>{FONT_IMPORT}</style>

            <Audio src={staticFile('hybrid_vo.mp3')} />

            {/* Segment 1 */}
            <Sequence from={0} durationInFrames={240}>
                <SceneOne />
            </Sequence>

            {/* Segment 2 */}
            <Sequence from={240} durationInFrames={250}>
                <SceneTwo />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('sfx/pop.mp3')} volume={0.7} />
            </Sequence>

            {/* Segment 3 */}
            <Sequence from={490} durationInFrames={260}>
                <SceneThree />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('sfx/rise.mp3')} volume={0.8} />
            </Sequence>
        </AbsoluteFill>
    );
};
