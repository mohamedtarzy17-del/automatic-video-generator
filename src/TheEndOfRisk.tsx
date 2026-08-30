import React from 'react';
import {
    AbsoluteFill,
    useVideoConfig,
    Audio,
    staticFile,
    Series,
    interpolate,
    useCurrentFrame,
    spring,
} from 'remotion';

const THEME = {
    bg: '#020617',
    primary: '#22D3EE', // Cyan
    secondary: '#818CF8', // Indigo
    accent: '#F472B6', // Pink
    data: '#34D399', // Emerald
    danger: '#F43F5E', // Rose
    white: '#F8FAF8',
    glass: 'rgba(255, 255, 255, 0.03)',
    glassBorder: 'rgba(255, 255, 255, 0.1)'
};

const FontStyles: React.FC = () => (
    <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;900&family=JetBrains+Mono:wght@700&family=Syne:wght@800&display=swap');
        
        .glass-morphism {
            background: ${THEME.glass};
            backdrop-filter: blur(20px);
            border: 1px solid ${THEME.glassBorder};
            border-radius: 32px;
        }

        .glow-text {
            text-shadow: 0 0 20px ${THEME.primary}aa;
        }
        
        @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
        }

        .scanner {
            position: absolute;
            width: 100%;
            height: 2px;
            background: linear-gradient(to bottom, transparent, ${THEME.primary}, transparent);
            animation: scan 4s linear infinite;
        }
        `}
    </style>
);

// --- Visual Primitives ---

const AI_Node: React.FC<{ size?: number; delay?: number }> = ({ size = 300, delay = 0 }) => {
    const frame = useCurrentFrame();
    const pulse = Math.sin((frame - delay) / 10) * 0.1 + 1;

    return (
        <div style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${THEME.primary}33 0%, transparent 70%)`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transform: `scale(${pulse})`,
            position: 'relative'
        }}>
            <div style={{
                width: size * 0.4,
                height: size * 0.4,
                borderRadius: '50%',
                background: THEME.primary,
                boxShadow: `0 0 60px ${THEME.primary}`
            }} />
            {[...Array(8)].map((_, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    width: 2,
                    height: size * 0.8,
                    background: `linear-gradient(to top, transparent, ${THEME.primary}, transparent)`,
                    transform: `rotate(${i * 45}deg)`,
                    opacity: 0.3
                }} />
            ))}
        </div>
    );
}

const BigText: React.FC<{ text: string; size?: number; color?: string; delay?: number; italic?: boolean }> = ({ text, size = 120, color = THEME.white, delay = 0, italic = false }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const s = spring({
        frame: frame - delay,
        fps,
        config: { stiffness: 100, damping: 12 }
    });

    return (
        <h1 style={{
            fontFamily: 'Syne',
            fontSize: size,
            fontWeight: 800,
            color,
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: -4,
            fontStyle: italic ? 'italic' : 'normal',
            opacity: s,
            transform: `scale(${interpolate(s, [0, 1], [0.8, 1])}) translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
            lineHeight: 0.9,
            textAlign: 'center'
        }}>
            {text}
        </h1>
    );
};

const AccuracyMeter: React.FC<{ value: number; size?: number }> = ({ value, size = 400 }) => {
    const frame = useCurrentFrame();
    const progress = spring({ frame, fps: 30, config: { damping: 15 } });
    const currentVal = interpolate(progress, [0, 1], [50, value]);

    return (
        <div style={{ position: 'relative', width: size, height: size, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <svg width={size} height={size} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke={THEME.glassBorder} strokeWidth="8" />
                <circle
                    cx="50" cy="50" r="45"
                    fill="none"
                    stroke={THEME.primary}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * (currentVal / 100))}
                    style={{ filter: `drop-shadow(0 0 10px ${THEME.primary})`, transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
            </svg>
            <div style={{ position: 'absolute', fontFamily: 'JetBrains Mono', fontSize: size * 0.15, color: THEME.white, fontWeight: 900 }}>
                {currentVal.toFixed(1)}%
            </div>
        </div>
    );
}

// --- Scene Components ---

const ExplainerScene1: React.FC = () => {
    return (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: THEME.bg }}>
            <FontStyles />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                <BigText text="THE END OF" size={60} color={THEME.primary} />
                <BigText text="RISK" size={180} delay={10} />
            </div>
            <div style={{ position: 'absolute', bottom: 100 }}>
                <AccuracyMeter value={100} size={300} />
            </div>
            <div className="scanner" />
        </AbsoluteFill>
    );
};

const ExplainerScene2: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ background: THEME.bg }}>
            <AbsoluteFill style={{ opacity: 0.1 }}>
                {[...Array(20)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        left: (i * 100) % 1920,
                        top: (i * 200 + frame) % 1080,
                        fontFamily: 'JetBrains Mono',
                        color: THEME.primary,
                        fontSize: 20
                    }}>
                        {Math.random() > 0.5 ? '0' : '1'}
                    </div>
                ))}
            </AbsoluteFill>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
                <AI_Node />
                <div style={{ marginTop: 40 }}>
                    <BigText text="SINGULARITY" size={100} delay={20} />
                    <p style={{ fontFamily: 'Outfit', color: THEME.white, opacity: 0.6, fontSize: 32, textAlign: 'center' }}>
                        Processing every transaction in real-time.
                    </p>
                </div>
            </div>
        </AbsoluteFill>
    );
};

const ExplainerScene3: React.FC = () => {
    const frame = useCurrentFrame();
    const darkness = interpolate(frame, [150, 210], [1, 0.2]);
    return (
        <AbsoluteFill style={{ background: THEME.bg, justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ opacity: darkness, display: 'flex', gap: 50 }}>
                {[1, 2, 3].map(i => (
                    <div key={i} className="glass-morphism" style={{ width: 300, height: 400, display: 'flex', flexDirection: 'column', padding: 30 }}>
                        <div style={{ height: 20, width: '60%', background: THEME.white, opacity: 0.2, borderRadius: 10 }} />
                        <div style={{ marginTop: 20, height: 150, width: '100%', background: THEME.primary, opacity: 0.1, borderRadius: 10 }} />
                        <div style={{ marginTop: 'auto', height: 40, width: '100%', background: THEME.danger, borderRadius: 10 }} />
                    </div>
                ))}
            </div>
            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: `rgba(0,0,0, ${interpolate(frame, [150, 210], [0, 0.8])})` }}>
                {frame > 160 && <BigText text="THE MARKET" size={80} color={THEME.danger} />}
                {frame > 180 && <BigText text="STOPS" size={120} color={THEME.white} />}
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

const ExplainerScene4: React.FC = () => {
    return (
        <AbsoluteFill style={{ background: THEME.bg, justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ borderTop: `2px solid ${THEME.primary}`, width: '80%', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', width: 20, height: 20, borderRadius: '50%', background: THEME.primary, boxShadow: `0 0 20px ${THEME.primary}` }} />
            </div>
            <div style={{ marginTop: 60 }}>
                <BigText text="POST-FINANCIAL" size={60} color={THEME.secondary} />
                <BigText text="ERA" size={140} delay={15} />
            </div>
        </AbsoluteFill>
    );
}

const OutroScene: React.FC = () => {
    return (
        <AbsoluteFill style={{ background: '#000', justifyContent: 'center', alignItems: 'center' }}>
            <BigText text="ARE YOU READY?" size={80} />
            <div style={{ marginTop: 40, padding: '20px 60px', borderRadius: 100, border: `2px solid ${THEME.primary}`, color: THEME.primary, fontFamily: 'Outfit', fontWeight: 900, fontSize: 32 }}>
                WATCH FULL VIDEO
            </div>
            <div style={{ position: 'absolute', bottom: 50, opacity: 0.4 }}>
                <BigText text="END GAME" size={30} />
            </div>
        </AbsoluteFill>
    );
}

// --- Main Composition ---

export const TheEndOfRisk: React.FC = () => {
    const sceneDur = 210; // 7 seconds

    return (
        <AbsoluteFill style={{ backgroundColor: THEME.bg }}>
            <FontStyles />
            {/* Audio placeholders - you'll need to generate these */}
            <Audio src={staticFile("audio/end_of_risk_vo.wav")} volume={1} />
            <Audio src={staticFile("sfx/rise.mp3")} volume={0.2} />

            <Series>
                <Series.Sequence durationInFrames={sceneDur}>
                    <ExplainerScene1 />
                </Series.Sequence>
                <Series.Sequence durationInFrames={sceneDur}>
                    <ExplainerScene2 />
                </Series.Sequence>
                <Series.Sequence durationInFrames={sceneDur}>
                    <ExplainerScene3 />
                </Series.Sequence>
                <Series.Sequence durationInFrames={sceneDur}>
                    <ExplainerScene4 />
                </Series.Sequence>
                <Series.Sequence durationInFrames={150}>
                    <OutroScene />
                </Series.Sequence>
            </Series>

            {/* Global Grain/Noise */}
            <AbsoluteFill style={{ pointerEvents: 'none', opacity: 0.05, background: `url('https://www.transparenttextures.com/patterns/asfalt-dark.png')` }} />
        </AbsoluteFill>
    );
};
