import React, { useMemo } from 'react';
import {
    AbsoluteFill,
    useVideoConfig,
    Audio,
    staticFile,
    Series,
    Sequence,
    interpolate,
    useCurrentFrame,
    spring,
    Easing
} from 'remotion';

const THEME = {
    bg: '#020617',
    surface: '#0F172A',
    primary: '#38BDF8', // Sky
    secondary: '#818CF8', // Indigo
    accent: '#F472B6', // Pink
    warning: '#FBBF24', // Amber
    danger: '#EF4444',
    success: '#10B981',
    text: '#F8FAF8',
    muted: '#64748B',
    glass: 'rgba(255, 255, 255, 0.03)',
    glassBorder: 'rgba(255, 255, 255, 0.08)'
};

const FontStyles: React.FC = () => (
    <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700;900&family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@200;800&display=swap');
        
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: ${THEME.text};
        }

        .glass-panel {
            background: ${THEME.glass};
            backdrop-filter: blur(20px);
            border: 1px solid ${THEME.glassBorder};
            border-radius: 32px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        @keyframes grain {
            0%, 100% { transform: translate(0, 0); }
            10% { transform: translate(-5%, -10%); }
            20% { transform: translate(-15%, 5%); }
        }

        .grain-overlay {
            position: absolute;
            inset: -100%;
            width: 300%;
            height: 300%;
            background-image: url("https://www.transparenttextures.com/patterns/60-lines.png");
            opacity: 0.04;
            pointer-events: none;
            animation: grain 8s steps(10) infinite;
        }

        .vignette {
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at center, transparent 0%, rgba(2, 6, 23, 0.6) 100%);
            pointer-events: none;
        }

        @keyframes rotate-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .spinner {
            animation: rotate-slow 10s linear infinite;
        }
        `}
    </style>
);

// --- Engagement SVGs (Every 1 Second Logic) ---

const RapidIcon: React.FC<{ type: 'play' | 'alert' | 'ad' | 'user' | 'brain'; delay: number }> = ({ type, delay }) => {
    const frame = useCurrentFrame();
    const active = Math.floor((frame - delay) / 30) % 2 === 0;
    const spr = spring({ frame: frame % 30, fps: 30, config: { damping: 10 } });

    if (!active) return null;

    return (
        <div style={{ opacity: spr * 0.4, transform: `scale(${spr})` }}>
            {type === 'play' && (
                <svg width="60" height="60" viewBox="0 0 24 24" fill={THEME.primary}>
                    <path d="M8 5v14l11-7z" />
                </svg>
            )}
            {type === 'alert' && (
                <svg width="60" height="60" viewBox="0 0 24 24" fill={THEME.danger}>
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                </svg>
            )}
            {type === 'ad' && (
                <svg width="60" height="60" viewBox="0 0 24 24" fill={THEME.warning}>
                    <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 8.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z" />
                </svg>
            )}
            {type === 'user' && (
                <svg width="60" height="60" viewBox="0 0 24 24" fill={THEME.text}>
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
            )}
            {type === 'brain' && (
                <svg width="60" height="60" viewBox="0 0 24 24" fill={THEME.accent}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
            )}
        </div>
    );
};

const UI_Reticle: React.FC = () => {
    const frame = useCurrentFrame();
    const rot = interpolate(frame, [0, 300], [0, 90]);
    return (
        <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: `rotate(${rot}deg)`, opacity: 0.2 }}>
            <path d="M 0 30 L 0 0 L 30 0" fill="none" stroke={THEME.primary} strokeWidth="2" />
            <path d="M 70 0 L 100 0 L 100 30" fill="none" stroke={THEME.primary} strokeWidth="2" />
            <path d="M 100 70 L 100 100 L 70 100" fill="none" stroke={THEME.primary} strokeWidth="2" />
            <path d="M 30 100 L 0 100 L 0 70" fill="none" stroke={THEME.primary} strokeWidth="2" />
        </svg>
    );
};

// --- Updated Cinematic Components ---

const EngagingTitle: React.FC<{ text: string; subtext?: string }> = ({ text, subtext }) => {
    const frame = useCurrentFrame();
    const spr = spring({ frame, fps: 30, config: { damping: 12 } });

    return (
        <div style={{ textAlign: 'center' }}>
            <h1 style={{
                fontFamily: 'Syne',
                fontSize: 140,
                fontWeight: 800,
                letterSpacing: interpolate(spr, [0, 1], [30, -2]),
                opacity: spr,
                transform: `scale(${interpolate(spr, [0, 1], [0.8, 1])})`,
                background: `linear-gradient(to bottom, #FFF, ${THEME.muted})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }}>
                {text}
            </h1>
            {subtext && <p style={{ fontFamily: 'Outfit', fontSize: 24, letterSpacing: 10, color: THEME.primary, opacity: spr }}>{subtext}</p>}
        </div>
    );
};

// --- Scene Layouts ---

const SceneLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ backgroundColor: THEME.bg }}>
            <div className="vignette" />
            <div className="grain-overlay" />

            {/* 1-Second Visual Ticks (Engagement Layer) */}
            {[...Array(10)].map((_, i) => (
                <div key={i} style={{ position: 'absolute', left: (i * 150 + 200) % 1920, top: (i * 250 + 100) % 1080 }}>
                    <RapidIcon type={['play', 'alert', 'ad', 'user', 'brain'][i % 5] as any} delay={i * 30} />
                </div>
            ))}

            {/* Corner Reticles */}
            <div style={{ position: 'absolute', top: 50, left: 50 }}><UI_Reticle /></div>
            <div style={{ position: 'absolute', top: 50, right: 50, transform: 'rotate(90deg)' }}><UI_Reticle /></div>
            <div style={{ position: 'absolute', bottom: 50, left: 50, transform: 'rotate(-90deg)' }}><UI_Reticle /></div>
            <div style={{ position: 'absolute', bottom: 50, right: 50, transform: 'rotate(180deg)' }}><UI_Reticle /></div>

            <AbsoluteFill style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {children}
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

// --- Scenes ---

const Intro: React.FC = () => (
    <SceneLayout>
        <EngagingTitle text="AI PURGE" subtext="YOUTUBE 2026 POLICY" />
    </SceneLayout>
);

const TrustDecline: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <SceneLayout>
            <div className="glass-panel" style={{ padding: 80, display: 'flex', gap: 60, alignItems: 'center' }}>
                <div style={{ width: 300, height: 300, position: 'relative' }}>
                    <svg width="300" height="300" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke={THEME.glassBorder} strokeWidth="4" />
                        <circle cx="50" cy="50" r="45" fill="none" stroke={THEME.danger} strokeWidth="4" strokeDasharray="283" strokeDashoffset={283 * (1 - interpolate(frame, [0, 60], [0, 0.49], { extrapolateRight: 'clamp' }))} transform="rotate(-90 50 50)" />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'Syne', fontSize: 60, fontWeight: 800 }}>49%</span>
                    </div>
                </div>
                <div>
                    <h1 style={{ fontFamily: 'Syne', fontSize: 60, margin: 0 }}>TRUST EROSION</h1>
                    <p style={{ fontFamily: 'Outfit', fontSize: 24, opacity: 0.6 }}>Audience exit velocity accelerating.</p>
                </div>
            </div>
        </SceneLayout>
    );
};

const BrandPanic: React.FC = () => (
    <SceneLayout>
        <div style={{ width: 1200 }}>
            <h1 style={{ fontFamily: 'Syne', fontSize: 80, textAlign: 'center', marginBottom: 60 }}>ADVERTISER FLIGHT</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
                {["AMAZON", "HBO", "ADOBE", "SAMSUNG", "APPLE", "GOOGLE"].map((b, i) => (
                    <div key={b} className="glass-panel" style={{ padding: 40, textAlign: 'center', opacity: interpolate(useCurrentFrame(), [i * 10, i * 10 + 20], [0, 1]) }}>
                        <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 32 }}>{b}</span>
                    </div>
                ))}
            </div>
        </div>
    </SceneLayout>
);

const DetectionAI: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <SceneLayout>
            <div className="glass-panel" style={{ padding: 100, width: 1000, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: (frame * 15) % 1000, width: 2, height: '100%', background: THEME.primary, boxShadow: `0 0 20px ${THEME.primary}` }} />
                <h1 style={{ fontFamily: 'Syne', fontSize: 160, margin: 0, opacity: 0.05 }}>SCANNING</h1>
                <div style={{ marginTop: -80 }}>
                    <h2 style={{ fontFamily: 'Syne', fontSize: 100, margin: 0 }}>99.9%</h2>
                    <p style={{ fontFamily: 'Outfit', fontSize: 24, color: THEME.success, letterSpacing: 8 }}>PRECISION DETECTED</p>
                </div>
            </div>
        </SceneLayout>
    );
};

const SuccessMatrix: React.FC = () => (
    <SceneLayout>
        <div style={{ display: 'flex', gap: 40 }}>
            <div className="glass-panel" style={{ padding: 60, textAlign: 'center' }}>
                <h2 style={{ color: THEME.primary }}>HUMAN</h2>
                <div style={{ height: 4, background: THEME.primary, width: 100, margin: '20px auto' }} />
                <p>APPROVED</p>
            </div>
            <div className="glass-panel" style={{ padding: 60, textAlign: 'center', opacity: 0.3 }}>
                <h2 style={{ color: THEME.danger }}>AI-SLOP</h2>
                <div style={{ height: 4, background: THEME.danger, width: 100, margin: '20px auto' }} />
                <p>REJECTED</p>
            </div>
        </div>
    </SceneLayout>
);

// --- Full Composition ---

export const YoutubePolicyGodModeV4: React.FC = () => {
    const sceneDur = 300;

    return (
        <AbsoluteFill style={{ backgroundColor: THEME.bg }}>
            <FontStyles />
            <Audio src={staticFile("youtube_policy_v2_vo.wav")} />
            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.15} />

            <Series>
                <Series.Sequence durationInFrames={sceneDur}><Intro /></Series.Sequence>
                <Series.Sequence durationInFrames={sceneDur}><TrustDecline /></Series.Sequence>
                <Series.Sequence durationInFrames={sceneDur}><BrandPanic /></Series.Sequence>
                <Series.Sequence durationInFrames={sceneDur}><DetectionAI /></Series.Sequence>
                <Series.Sequence durationInFrames={sceneDur}><SuccessMatrix /></Series.Sequence>
                <Series.Sequence durationInFrames={300}>
                    <SceneLayout>
                        <EngagingTitle text="ADAPT" subtext="THE FUTURE IS AUTHENTIC" />
                    </SceneLayout>
                </Series.Sequence>
            </Series>

            {/* Selective SFX only at scene starts */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
                <Sequence key={i} from={i * 300}>
                    <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.3} />
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};
