import React from 'react';
import {
    AbsoluteFill, useCurrentFrame, interpolate, spring,
    Audio, staticFile, Sequence
} from 'remotion';
import { FONT_IMPORT, FONT_STACK } from './components/PremiumKit';

// ─── COLOR PALETTE ────────────────────────────────────
const C = {
    bg: '#0B132B',
    cardBg: 'rgba(28, 37, 65, 0.9)',
    emerald: '#10B981',
    gold: '#F59E0B',
    cyan: '#06B6D4',
    white: '#FFFFFF',
    textMuted: '#94A3B8',
    red: '#EF4444',
    border: 'rgba(16, 185, 129, 0.3)'
};

// ─── 2D VECTOR SVG ILLUSTRATIONS ──────────────────────

// Vector Bank Vault Icon
const BankVaultSVG: React.FC<{ size?: number; color?: string }> = ({ size = 160, color = C.emerald }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <rect x="10" y="20" width="80" height="65" rx="8" fill="rgba(16,185,129,0.15)" stroke={color} strokeWidth="4" />
        <circle cx="50" cy="52" r="20" stroke={color} strokeWidth="4" fill="rgba(11,19,43,0.8)" />
        <circle cx="50" cy="52" r="6" fill={color} />
        <line x1="50" y1="32" x2="50" y2="40" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <line x1="50" y1="64" x2="50" y2="72" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <line x1="30" y1="52" x2="38" y2="52" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <line x1="62" y1="52" x2="70" y2="52" stroke={color} strokeWidth="4" strokeLinecap="round" />
        <rect x="75" y="44" width="8" height="16" rx="2" fill={color} />
    </svg>
);

// Vector Dollar Bill Stack
const MoneyBillSVG: React.FC<{ size?: number; text?: string; color?: string }> = ({ size = 180, text = "$100", color = C.emerald }) => (
    <div style={{
        width: size, height: size * 0.55, backgroundColor: 'rgba(16, 185, 129, 0.2)',
        border: `3px solid ${color}`, borderRadius: 16, display: 'flex',
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        boxShadow: '0 15px 35px rgba(16, 185, 129, 0.25)', position: 'relative'
    }}>
        <div style={{ position: 'absolute', top: 8, left: 12, fontFamily: FONT_STACK.mono, fontSize: 14, color }}>$</div>
        <div style={{ position: 'absolute', bottom: 8, right: 12, fontFamily: FONT_STACK.mono, fontSize: 14, color }}>$</div>
        <div style={{
            width: 48, height: 48, borderRadius: '50%', border: `2px stroke ${color}`,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            fontFamily: FONT_STACK.bebas, fontSize: 32, color: C.white, backgroundColor: 'rgba(16,185,129,0.3)'
        }}>
            {text}
        </div>
    </div>
);

// Animated Flow Arrow Component
const FlowArrowSVG: React.FC<{ progress: number; label: string; amount: string; color: string }> = ({ progress, label, amount, color }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 220 }}>
        <div style={{ fontFamily: FONT_STACK.mono, fontSize: 14, color: C.textMuted, marginBottom: 6 }}>{label}</div>
        <div style={{ fontFamily: FONT_STACK.bebas, fontSize: 36, color, marginBottom: 8 }}>{amount}</div>
        <svg width="180" height="30" viewBox="0 0 180 30">
            <line x1="10" y1="15" x2={10 + progress * 140} y2="15" stroke={color} strokeWidth="6" strokeLinecap="round" />
            {progress > 0.9 && (
                <polygon points="150,5 170,15 150,25" fill={color} />
            )}
        </svg>
    </div>
);

// ─── MAIN SCENE ───────────────────────────────────────

export const FinanceIllustrationSample: React.FC = () => {
    const frame = useCurrentFrame();

    // Sub-Scene Frames
    const isPhase1 = frame < 200;
    const isPhase2 = frame >= 200 && frame < 450;
    const isPhase3 = frame >= 450;

    // Animations
    const sprVault = spring({ frame: frame - 10, fps: 30 });
    const sprBill1 = spring({ frame: frame - 40, fps: 30 });

    // Phase 2 Arrows
    const flow1 = interpolate(frame, [220, 300], [0, 1], { extrapolateRight: 'clamp' });
    const flow2 = interpolate(frame, [310, 390], [0, 1], { extrapolateRight: 'clamp' });

    // Phase 3 Money Multiplier Counter
    const countMoney = Math.floor(interpolate(frame, [460, 680], [100, 1000], { extrapolateRight: 'clamp' }));
    const sprMulti = spring({ frame: frame - 450, fps: 30, config: { damping: 10 } });

    return (
        <AbsoluteFill style={{ backgroundColor: C.bg }}>
            <style>{FONT_IMPORT}</style>

            <Audio src={staticFile('fin_sample_vo.mp3')} />

            {/* Background Grid Pattern */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.12) 0%, transparent 70%), linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize: '100% 100%, 60px 60px, 60px 60px'
            }} />

            {/* Top Badge */}
            <div style={{
                position: 'absolute', top: 40, left: 60, display: 'flex', alignItems: 'center', gap: 15, zIndex: 10
            }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: C.emerald }} />
                <div style={{ fontFamily: FONT_STACK.mono, fontSize: 18, color: C.emerald, letterSpacing: 3 }}>
                    FINANCE EXPLAINER // FRACTIONAL RESERVE BANKING
                </div>
            </div>

            {/* PHASE 1: $100 Deposit into Vault */}
            {isPhase1 && (
                <div style={{
                    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                    justify: 'center', alignItems: 'center', zIndex: 10
                }}>
                    <div style={{
                        fontFamily: FONT_STACK.display, fontSize: 90, color: C.white, textAlign: 'center',
                        marginBottom: 40, textShadow: '0 10px 30px rgba(0,0,0,0.8)'
                    }}>
                        YOU DEPOSIT <span style={{ color: C.emerald }}>$100</span> IN A BANK
                    </div>

                    <div style={{ display: 'flex', gap: 60, alignItems: 'center' }}>
                        <div style={{ transform: `scale(${sprBill1})` }}>
                            <MoneyBillSVG text="$100" color={C.emerald} size={220} />
                            {frame === 40 && <Audio src={staticFile('sfx/pop.mp3')} volume={0.7} />}
                        </div>

                        <div style={{ fontFamily: FONT_STACK.bebas, fontSize: 60, color: C.textMuted }}>➔</div>

                        <div style={{ transform: `scale(${sprVault})` }}>
                            <BankVaultSVG size={200} color={C.emerald} />
                            {frame === 10 && <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />}
                        </div>
                    </div>
                </div>
            )}

            {/* PHASE 2: Lending Cascade Flow Diagram */}
            {isPhase2 && (
                <div style={{
                    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                    justify: 'center', alignItems: 'center', zIndex: 10, padding: 60
                }}>
                    <div style={{ fontFamily: FONT_STACK.display, fontSize: 80, color: C.white, marginBottom: 50, textAlign: 'center' }}>
                        THE LENDING CASCADE: <span style={{ color: C.gold }}>10% RESERVE RATIO</span>
                    </div>

                    <div style={{ display: 'flex', gap: 40, alignItems: 'center', justifyContent: 'center' }}>
                        {/* Bank A Reserve */}
                        <div style={{
                            backgroundColor: C.cardBg, padding: 30, borderRadius: 20,
                            border: `2px solid ${C.emerald}`, textAlign: 'center', minWidth: 200
                        }}>
                            <div style={{ fontFamily: FONT_STACK.mono, fontSize: 14, color: C.textMuted }}>BANK A VAULT</div>
                            <div style={{ fontFamily: FONT_STACK.bebas, fontSize: 50, color: C.emerald, margin: '10px 0' }}>$10 HELD</div>
                            <div style={{ fontFamily: FONT_STACK.inter, fontSize: 14, color: C.white }}>10% Legal Reserve</div>
                        </div>

                        <FlowArrowSVG progress={flow1} label="LEND OUT 90%" amount="$90" color={C.gold} />

                        {/* Bank B Deposit */}
                        <div style={{
                            backgroundColor: C.cardBg, padding: 30, borderRadius: 20,
                            border: `2px solid ${C.gold}`, textAlign: 'center', minWidth: 200
                        }}>
                            <div style={{ fontFamily: FONT_STACK.mono, fontSize: 14, color: C.textMuted }}>BANK B DEPOSIT</div>
                            <div style={{ fontFamily: FONT_STACK.bebas, fontSize: 50, color: C.gold, margin: '10px 0' }}>$90 NEW</div>
                            <div style={{ fontFamily: FONT_STACK.inter, fontSize: 14, color: C.white }}>Re-deposited Money</div>
                        </div>

                        <FlowArrowSVG progress={flow2} label="LEND OUT 90%" amount="$81" color={C.cyan} />

                        {/* Bank C Deposit */}
                        <div style={{
                            backgroundColor: C.cardBg, padding: 30, borderRadius: 20,
                            border: `2px solid ${C.cyan}`, textAlign: 'center', minWidth: 200
                        }}>
                            <div style={{ fontFamily: FONT_STACK.mono, fontSize: 14, color: C.textMuted }}>BANK C DEPOSIT</div>
                            <div style={{ fontFamily: FONT_STACK.bebas, fontSize: 50, color: C.cyan, margin: '10px 0' }}>$81 NEW</div>
                            <div style={{ fontFamily: FONT_STACK.inter, fontSize: 14, color: C.white }}>Secondary Credit</div>
                        </div>
                    </div>
                </div>
            )}

            {/* PHASE 3: 10x Money Multiplier Counter */}
            {isPhase3 && (
                <div style={{
                    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                    justify: 'center', alignItems: 'center', zIndex: 10, textAlign: 'center'
                }}>
                    <div style={{ fontFamily: FONT_STACK.mono, fontSize: 22, color: C.gold, letterSpacing: 4, marginBottom: 15 }}>
                        CREATING MONEY OUT OF THIN AIR
                    </div>

                    <div style={{
                        fontFamily: FONT_STACK.display, fontSize: 110, color: C.white, lineHeight: 0.95,
                        marginBottom: 30, textShadow: '0 20px 50px rgba(0,0,0,0.9)'
                    }}>
                        1 SINGLE $100 BILL BECOMES
                    </div>

                    <div style={{
                        backgroundColor: C.cardBg, padding: '40px 80px', borderRadius: 32,
                        border: `2px solid ${C.emerald}`, backdropFilter: 'blur(20px)',
                        transform: `scale(${sprMulti})`, boxShadow: '0 30px 80px rgba(16, 185, 129, 0.3)'
                    }}>
                        <div style={{ fontFamily: FONT_STACK.bebas, fontSize: 160, color: C.emerald, lineHeight: 1 }}>
                            ${countMoney.toLocaleString()}
                        </div>
                        <div style={{ fontFamily: FONT_STACK.inter, fontSize: 24, color: C.cyan, marginTop: 10, fontWeight: 600 }}>
                            10x Money Multiplier Effect
                        </div>
                        {frame === 460 && <Audio src={staticFile('sfx/rise.mp3')} volume={0.8} />}
                    </div>
                </div>
            )}
        </AbsoluteFill>
    );
};
