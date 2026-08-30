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
    danger: '#EF4444',
    success: '#10B981',
    text: '#F8FAF8',
    muted: '#64748B',
    black: '#020617',
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

        .glow-text {
            text-shadow: 0 0 20px ${THEME.primary}44;
        }

        @keyframes grain {
            0%, 100% { transform: translate(0, 0); }
            10% { transform: translate(-5%, -10%); }
            20% { transform: translate(-15%, 5%); }
            30% { transform: translate(7%, -25%); }
            40% { transform: translate(-5%, 25%); }
            50% { transform: translate(-15%, 10%); }
            60% { transform: translate(15%, 0%); }
            70% { transform: translate(0%, 15%); }
            80% { transform: translate(3%, 35%); }
            90% { transform: translate(-10%, 10%); }
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
            background: radial-gradient(circle at center, transparent 0%, rgba(2, 6, 23, 0.4) 100%);
            pointer-events: none;
        }
        `}
    </style>
);

// --- Cinematic UI Components ---

const CinematicTitle: React.FC<{ text: string; subtext?: string; delay?: number }> = ({ text, subtext, delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const spr = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 100 } });
    const blur = interpolate(spr, [0, 1], [40, 0]);
    const letterSpacing = interpolate(spr, [0, 1], [20, -2]);

    return (
        <div style={{ textAlign: 'center', opacity: spr, transform: `scale(${interpolate(spr, [0, 1], [0.95, 1])})` }}>
            <h1 style={{
                fontFamily: 'Syne',
                fontSize: 140,
                fontWeight: 800,
                margin: 0,
                letterSpacing,
                filter: `blur(${blur}px)`,
                textTransform: 'uppercase',
                lineHeight: 0.85,
                background: `linear-gradient(to bottom, #FFFFFF, ${THEME.muted})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }}>
                {text}
            </h1>
            {subtext && (
                <p style={{
                    fontFamily: 'Outfit',
                    fontSize: 32,
                    fontWeight: 400,
                    marginTop: 20,
                    letterSpacing: 4,
                    color: THEME.primary,
                    textTransform: 'uppercase',
                    opacity: spr
                }}>
                    {subtext}
                </p>
            )}
        </div>
    );
};

const DataVisualization: React.FC<{ percentage: number; label: string; sublabel: string }> = ({ percentage, label, sublabel }) => {
    const frame = useCurrentFrame();
    const grow = spring({ frame, fps: 30, config: { damping: 20 } });

    return (
        <div className="glass-panel" style={{ padding: 60, display: 'flex', alignItems: 'center', gap: 60 }}>
            <div style={{ position: 'relative', width: 240, height: 240 }}>
                <svg width="240" height="240" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke={THEME.glassBorder} strokeWidth="6" />
                    <circle
                        cx="50" cy="50" r="45" fill="none"
                        stroke={THEME.primary} strokeWidth="6"
                        strokeDasharray="283"
                        strokeDashoffset={283 * (1 - grow * percentage)}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                        style={{ filter: `drop-shadow(0 0 12px ${THEME.primary}66)` }}
                    />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Syne', fontSize: 60, fontWeight: 900 }}>{Math.round(grow * percentage * 100)}%</span>
                </div>
            </div>
            <div>
                <h2 style={{ fontFamily: 'Syne', fontSize: 48, margin: 0 }}>{label}</h2>
                <p style={{ fontFamily: 'Outfit', fontSize: 24, margin: 0, opacity: 0.6 }}>{sublabel}</p>
            </div>
        </div>
    );
};

const BrandGrid: React.FC = () => {
    const frame = useCurrentFrame();
    const brands = ["AMAZON", "HBO", "ADOBE", "SAMSUNG", "APPLE", "GOOGLE"];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30, width: '100%' }}>
            {brands.map((b, i) => {
                const spr = spring({ frame: frame - i * 5, fps: 30, config: { damping: 15 } });
                return (
                    <div key={b} className="glass-panel" style={{
                        padding: '40px 20px',
                        textAlign: 'center',
                        opacity: spr,
                        transform: `translateY(${interpolate(spr, [0, 1], [40, 0])}px)`
                    }}>
                        <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 32, letterSpacing: 2 }}>{b}</span>
                    </div>
                );
            })}
        </div>
    );
};

// --- Scene Layouts ---

const SceneWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <AbsoluteFill style={{ padding: 100, backgroundColor: THEME.bg }}>
        <div className="vignette" />
        <div className="grain-overlay" />
        <AbsoluteFill style={{ padding: 120, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {children}
        </AbsoluteFill>
    </AbsoluteFill>
);

// --- Final Scenes ---

const IntroScene: React.FC = () => (
    <SceneWrapper>
        <CinematicTitle text="The Purge" subtext="YouTube's 2026 Strategy" />
        <div style={{ position: 'absolute', bottom: 150, width: 600, height: 2, background: `linear-gradient(to right, transparent, ${THEME.primary}, transparent)` }} />
    </SceneWrapper>
);

const TrustScene: React.FC = () => (
    <SceneWrapper>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 60, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontFamily: 'Syne', fontSize: 80, margin: 0 }}>TRUST EROSION</h1>
                <p style={{ fontFamily: 'Outfit', fontSize: 32, opacity: 0.5 }}>Viewer sentiment is reaching a breaking point.</p>
            </div>
            <DataVisualization percentage={0.49} label="Exit Risk" sublabel="Viewers ditching platform vs slop" />
        </div>
    </SceneWrapper>
);

const AdvertiserScene: React.FC = () => (
    <SceneWrapper>
        <div style={{ width: '100%', maxWidth: 1200 }}>
            <div style={{ marginBottom: 60 }}>
                <h1 style={{ fontFamily: 'Syne', fontSize: 80, margin: 0, textAlign: 'center' }}>ADVERTISER PANIC</h1>
                <p style={{ fontFamily: 'Outfit', fontSize: 32, opacity: 0.5, textAlign: 'center' }}>Major brands are pulling spend from AI-flooded niches.</p>
            </div>
            <BrandGrid />
        </div>
    </SceneWrapper>
);

const PrecisionScene: React.FC = () => {
    const frame = useCurrentFrame();
    const scanPos = (frame * 10) % 1000;

    return (
        <SceneWrapper>
            <div style={{ width: '100%', maxWidth: 1200, position: 'relative' }}>
                <div className="glass-panel" style={{ padding: 100, height: 600, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', top: scanPos, left: 0, right: 0, height: 4, background: THEME.primary, boxShadow: `0 0 30px ${THEME.primary}`, zIndex: 10 }} />
                    <h1 style={{ fontFamily: 'Syne', fontSize: 160, margin: 0, opacity: 0.1 }}>AI SCAN</h1>
                    <div style={{ marginTop: -80 }}>
                        <CinematicTitle text="99.9%" subtext="Detection Accuracy" />
                    </div>
                    <div style={{ display: 'flex', gap: 40, marginTop: 60 }}>
                        <div className="glass-panel" style={{ padding: '20px 40px', borderColor: THEME.success }}>
                            <span style={{ color: THEME.success, fontWeight: 800 }}>AUDIT: PASS</span>
                        </div>
                        <div className="glass-panel" style={{ padding: '20px 40px', borderColor: THEME.danger }}>
                            <span style={{ color: THEME.danger, fontWeight: 800 }}>BOT_VOICE: DETECTED</span>
                        </div>
                    </div>
                </div>
            </div>
        </SceneWrapper>
    );
};

const FinalStatus: React.FC = () => (
    <SceneWrapper>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40, alignItems: 'center' }}>
            <CinematicTitle text="Survival" subtext="Authenticity > Automation" />
            <div className="glass-panel" style={{ padding: '40px 80px', display: 'flex', gap: 40 }}>
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ color: THEME.primary, margin: 0 }}>VALUE</h3>
                    <p style={{ margin: 10, opacity: 0.6 }}>High</p>
                </div>
                <div style={{ width: 1, background: THEME.glassBorder }} />
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ color: THEME.accent, margin: 0 }}>ORIGINAL</h3>
                    <p style={{ margin: 10, opacity: 0.6 }}>Verified</p>
                </div>
            </div>
        </div>
    </SceneWrapper>
);

// --- Composition ---

export const YoutubePolicyGodModeV3: React.FC = () => {
    const sceneDur = 300; // 10 seconds per scene

    return (
        <AbsoluteFill style={{ backgroundColor: THEME.bg }}>
            <FontStyles />
            <Audio src={staticFile("youtube_policy_v2_vo.wav")} />
            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.15} />

            <Series>
                <Series.Sequence durationInFrames={sceneDur}><IntroScene /></Series.Sequence>
                <Series.Sequence durationInFrames={sceneDur}><TrustScene /></Series.Sequence>
                <Series.Sequence durationInFrames={sceneDur}><AdvertiserScene /></Series.Sequence>
                <Series.Sequence durationInFrames={sceneDur}><PrecisionScene /></Series.Sequence>
                <Series.Sequence durationInFrames={sceneDur}><FinalStatus /></Series.Sequence>
                <Series.Sequence durationInFrames={300}>
                    <AbsoluteFill style={{ background: THEME.black, justifyContent: 'center', alignItems: 'center' }}>
                        <CinematicTitle text="Evolve" subtext="Don't just automate." />
                    </AbsoluteFill>
                </Series.Sequence>
            </Series>

            {/* Subtle Cinematic SFX only on major transitions (not every second) */}
            {[0, 1, 2, 4, 5].map((i) => (
                <Sequence key={i} from={i * 300 - 15}>
                    <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.2} />
                </Sequence>
            ))}

            {/* Global Grain/Noise Overlay */}
            <div className="grain-overlay" />
        </AbsoluteFill>
    );
};
