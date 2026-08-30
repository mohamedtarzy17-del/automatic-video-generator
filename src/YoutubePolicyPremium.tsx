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
    blue: '#2979FF',
    red: '#FF1744',
    green: '#00E676',
    amber: '#FFC400',
    purple: '#6200EA',
    cyan: '#00E5FF',
    white: '#FFFFFF',
    black: '#0F172A',
    accent: '#00FFCC'
};

const FontStyles: React.FC = () => (
    <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&display=swap');
        `}
    </style>
);

// --- High-Retention Components (The 1-Second Rule) ---

const MicroPing: React.FC<{ frameTrigger: number }> = ({ frameTrigger }) => {
    const frame = useCurrentFrame();
    const active = frame >= frameTrigger && frame < frameTrigger + 15;
    const p = spring({ frame: Math.max(0, frame - frameTrigger), fps: 30, config: { stiffness: 200 } });

    if (!active) return null;
    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            border: `20px solid ${THEME.white}`,
            opacity: interpolate(p, [0, 1], [0.5, 0]),
            transform: `scale(${interpolate(p, [0, 1], [1, 1.5])})`,
            pointerEvents: 'none',
            zIndex: 100
        }} />
    );
};

const PieChart: React.FC<{ progress: number }> = ({ progress }) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress * circumference);

    return (
        <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="20" />
            <circle
                cx="100" cy="100" r={radius}
                fill="none" stroke={THEME.accent}
                strokeWidth="20"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
            />
        </svg>
    );
};

const Rotating3DIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const frame = useCurrentFrame();
    return (
        <div style={{
            perspective: '1000px',
            transform: `rotateY(${frame * 5}deg) rotateX(${Math.sin(frame / 10) * 20}deg)`
        }}>
            {children}
        </div>
    );
};

const BarGraph: React.FC<{ values: number[] }> = ({ values }) => {
    const frame = useCurrentFrame();
    return (
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', height: 200 }}>
            {values.map((v, i) => {
                const h = spring({ frame: frame - (i * 5), fps: 30 });
                return (
                    <div key={i} style={{
                        width: 40,
                        background: THEME.white,
                        height: `${v * h * 100}%`,
                        borderRadius: '5px 5px 0 0'
                    }} />
                );
            })}
        </div>
    );
};

// --- Scene Wrappers ---

const PremiumScene: React.FC<{
    children: React.ReactNode,
    bg: string,
    title: string,
    subtitle?: string
}> = ({ children, bg, title, subtitle }) => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill style={{ backgroundColor: bg, overflow: 'hidden' }}>
            {/* 1s Dynamic Background shift */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(circle at ${50 + Math.sin(frame / 30) * 20}% ${50 + Math.cos(frame / 30) * 20}%, rgba(255,255,255,0.1) 0%, transparent 70%)`
            }} />

            {/* Corner HUD - Persistent but animated */}
            <div style={{ position: 'absolute', top: 40, left: 40, zIndex: 50 }}>
                <div style={{ fontFamily: 'JetBrains Mono', color: THEME.white, fontSize: 18, opacity: 0.6 }}>SYSTEM_ALERT // {title}</div>
                <div style={{ background: THEME.white, width: interpolate(frame % 30, [0, 30], [0, 200]), height: 2, marginTop: 5 }} />
            </div>

            <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                {children}
            </AbsoluteFill>

            {/* Bottom Text */}
            {subtitle && (
                <div style={{ position: 'absolute', bottom: 80, width: '100%', textAlign: 'center' }}>
                    <h2 style={{
                        fontFamily: 'Outfit',
                        fontSize: 60,
                        color: THEME.white,
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        textShadow: '0 5px 20px rgba(0,0,0,0.3)'
                    }}>
                        {subtitle}
                    </h2>
                </div>
            )}

            {/* The 1-Second Pings (Something happens every 30 frames) */}
            {[0, 30, 60, 90, 120, 150, 180].map(t => <MicroPing key={t} frameTrigger={t} />)}
        </AbsoluteFill>
    );
};

// --- Main Composition ---

export const YoutubePolicyPremium: React.FC = () => {
    const { fps } = useVideoConfig();
    const clipDur = 180; // Exactly 6 seconds per major scene to align with 1s rule

    return (
        <AbsoluteFill>
            <FontStyles />
            <Audio src={staticFile("youtube_policy_vo.wav")} />
            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.1} />

            <Series>
                {/* 0-6s: The Death of Automation */}
                <Series.Sequence durationInFrames={clipDur}>
                    <PremiumScene bg={THEME.purple} title="ERA_END" subtitle="Automation IS DYING">
                        <Rotating3DIcon>
                            <svg width="300" height="300" viewBox="0 0 100 100">
                                <rect x="20" y="20" width="60" height="60" fill="none" stroke={THEME.white} strokeWidth="4" />
                                <path d="M50 10 L50 30 M10 50 L30 50 M90 50 L70 50 M50 90 L50 70" stroke={THEME.white} strokeWidth="4" />
                                <circle cx="50" cy="50" r="10" fill={THEME.red} />
                            </svg>
                        </Rotating3DIcon>
                    </PremiumScene>
                </Series.Sequence>

                {/* 6-12s: Trillions into AI */}
                <Series.Sequence durationInFrames={clipDur}>
                    <PremiumScene bg={THEME.blue} title="FINANCE_SHIFT" subtitle="TRILLIONS IN SILICON">
                        <BarGraph values={[0.3, 0.5, 0.8, 0.6, 0.9, 0.4]} />
                    </PremiumScene>
                </Series.Sequence>

                {/* 12-18s: The Chopping Block */}
                <Series.Sequence durationInFrames={clipDur}>
                    <PremiumScene bg={THEME.red} title="SYSTEM_PURGE" subtitle="THE CHOPPING BLOCK">
                        <div style={{ display: 'flex', gap: 100, alignItems: 'center' }}>
                            <PieChart progress={interpolate(useCurrentFrame() % 180, [0, 100], [0, 0.85], { extrapolateRight: 'clamp' })} />
                            <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 80, color: THEME.white }}>85%<br /><span style={{ fontSize: 20 }}>REMOVED</span></div>
                        </div>
                    </PremiumScene>
                </Series.Sequence>

                {/* 18-24s: July 15th Algorithm */}
                <Series.Sequence durationInFrames={clipDur}>
                    <PremiumScene bg={THEME.amber} title="DATE_ACTIVE" subtitle="JULY 15: THE RESET">
                        <div style={{ position: 'relative' }}>
                            <div style={{ fontSize: 200, fontWeight: 900, color: THEME.black, fontFamily: 'Outfit' }}>15</div>
                            <div style={{ position: 'absolute', top: -40, right: -40, background: THEME.red, padding: '5px 15px', color: THEME.white, fontFamily: 'JetBrains Mono' }}>DEADLINE</div>
                        </div>
                    </PremiumScene>
                </Series.Sequence>

                {/* 24-30s: Human Gatekeepers */}
                <Series.Sequence durationInFrames={clipDur}>
                    <PremiumScene bg={THEME.black} title="HUMAN_GATE" subtitle="24H SUITABILITY CHECK">
                        <Rotating3DIcon>
                            <svg width="300" height="300" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" stroke={THEME.accent} strokeWidth="5" fill="none" />
                                <path d="M50 50 L50 25 M50 50 L75 50" stroke={THEME.white} strokeWidth="5" strokeLinecap="round" />
                            </svg>
                        </Rotating3DIcon>
                    </PremiumScene>
                </Series.Sequence>

                {/* 30-36s: Profanity Updates */}
                <Series.Sequence durationInFrames={clipDur}>
                    <PremiumScene bg={THEME.green} title="POLICY_SWAP" subtitle="PROFANITY UNLOCKED">
                        <div style={{ display: 'flex', flexWrap: 'wrap', width: 600, gap: 20, justifyContent: 'center' }}>
                            {['#$!%', '*&?@', '!!!!!', '????'].map((t, i) => (
                                <div key={i} style={{
                                    background: THEME.black,
                                    color: THEME.green,
                                    padding: '20px 40px',
                                    fontSize: 60,
                                    fontFamily: 'JetBrains Mono',
                                    transform: `rotate(${Math.sin(useCurrentFrame() / 10 + i) * 10}deg)`
                                }}>{t}</div>
                            ))}
                        </div>
                    </PremiumScene>
                </Series.Sequence>

                {/* 36-42s: Controversy Allowed */}
                <Series.Sequence durationInFrames={clipDur}>
                    <PremiumScene bg={THEME.purple} title="CONTENT_EXPAND" subtitle="CONTROVERSY ALLOWED">
                        <div style={{ position: 'relative' }}>
                            <svg width="400" height="200" viewBox="0 0 200 100">
                                <rect x="0" y="0" width="200" height="100" fill={THEME.white} />
                                <text x="100" y="65" fontSize="40" fontWeight="900" fill={THEME.purple} textAnchor="middle" fontFamily="Outfit">NEWS</text>
                            </svg>
                            <div style={{ position: 'absolute', top: -20, left: -20, background: THEME.green, padding: 10, color: THEME.black, fontWeight: 900 }}>AD_READY</div>
                        </div>
                    </PremiumScene>
                </Series.Sequence>

                {/* 42-48s: Survival Guide */}
                <Series.Sequence durationInFrames={clipDur}>
                    <PremiumScene bg={THEME.white} title="GUIDE" subtitle="THE SURVIVAL GUIDE">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {['DISRUPT', 'COMMENT', 'DISCLOSE'].map((t, i) => (
                                <div key={i} style={{
                                    background: THEME.black,
                                    color: THEME.white,
                                    padding: '10px 40px',
                                    fontSize: 40,
                                    fontFamily: 'Outfit',
                                    fontWeight: 900,
                                    transform: `translateX(${interpolate(useCurrentFrame(), [0, 30], [-100, 0], { extrapolateRight: 'clamp' })}px)`
                                }}>{t}</div>
                            ))}
                        </div>
                    </PremiumScene>
                </Series.Sequence>

                {/* 48-68s: Final Outro */}
                <Series.Sequence durationInFrames={2058 - (clipDur * 8)}>
                    <PremiumScene bg={THEME.black} title="READY_STATUS" subtitle="ARE YOU READY?">
                        <div style={{ fontSize: 120, fontWeight: 900, color: THEME.accent, fontFamily: 'Outfit' }}>BE AUTHENTIC.</div>
                    </PremiumScene>
                </Series.Sequence>
            </Series>

            {/* Global SFX layering for transitions */}
            {
                [...Array(12)].map((_, i) => (
                    <Sequence key={i} from={i * 180}>
                        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.4} />
                        <Audio src={staticFile("sfx/pop.mp3")} delay={30} volume={0.3} />
                    </Sequence>
                ))
            }
        </AbsoluteFill >
    );
};
