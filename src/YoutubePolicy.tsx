import React from 'react';
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
    black: '#0F172A'
};

const FontStyles: React.FC = () => (
    <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&display=swap');
        `}
    </style>
);

// --- Motion Components ---

const KineticHeading: React.FC<{ text: string; bg?: string; color?: string }> = ({ text, bg = THEME.blue, color = THEME.white }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const p = spring({ frame, fps, config: { damping: 10 } });

    return (
        <AbsoluteFill style={{ backgroundColor: bg, justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
                transform: `scale(${interpolate(p, [0, 1], [0.5, 1.2])}) rotate(${interpolate(p, [0, 1], [-10, 0])}deg)`,
                opacity: p
            }}>
                <h1 style={{
                    fontFamily: 'Outfit',
                    fontSize: 180,
                    fontWeight: 900,
                    color,
                    margin: 0,
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    lineHeight: 0.8,
                    letterSpacing: -10
                }}>
                    {text}
                </h1>
            </div>
            {/* Background pattern */}
            <div style={{ position: 'absolute', opacity: 0.1, fontSize: 500, fontWeight: 900, color: THEME.white, zIndex: -1 }}>
                {text[0]}
            </div>
        </AbsoluteFill>
    );
};

const DemonetizedIcon: React.FC = () => {
    const frame = useCurrentFrame();
    const drop = spring({ frame, fps: 30, config: { stiffness: 200 } });
    const slash = spring({ frame: frame - 15, fps: 30 });

    return (
        <div style={{ transform: `scale(${drop})` }}>
            <svg width="400" height="400" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="80" fill="none" stroke={THEME.white} strokeWidth="15" />
                <text x="100" y="135" fontSize="120" fontWeight="900" fill={THEME.white} textAnchor="middle" fontFamily="Outfit">$</text>
                {frame > 15 && (
                    <line
                        x1="40" y1="40" x2="160" y2="160"
                        stroke={THEME.red}
                        strokeWidth="20"
                        strokeLinecap="round"
                        strokeDasharray="200"
                        strokeDashoffset={200 - slash * 200}
                    />
                )}
            </svg>
        </div>
    );
};

const ChartSection: React.FC<{ title: string; subtitle: string; bg: string }> = ({ title, subtitle, bg }) => {
    const frame = useCurrentFrame();
    const grow = spring({ frame, fps: 30 });

    return (
        <AbsoluteFill style={{ backgroundColor: bg, padding: 100 }}>
            <div style={{ position: 'absolute', top: 50, left: 50 }}>
                <div style={{ fontFamily: 'JetBrains Mono', color: THEME.white, fontSize: 24 }}>{title}</div>
                <div style={{ background: THEME.white, width: 200, height: 4, marginTop: 10 }} />
            </div>

            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 40, alignItems: 'flex-end', height: 400 }}>
                    {[0.4, 0.7, 0.5, 0.9, 0.2].map((v, i) => (
                        <div key={i} style={{
                            width: 80,
                            background: THEME.white,
                            height: `${v * grow * 100}%`,
                            borderRadius: '10px 10px 0 0',
                            opacity: 0.8 + (i * 0.05)
                        }} />
                    ))}
                </div>
            </div>

            <div style={{ position: 'absolute', bottom: 100, left: 100 }}>
                <h2 style={{ fontFamily: 'Outfit', fontSize: 80, color: THEME.white, fontWeight: 900, margin: 0 }}>{subtitle}</h2>
            </div>
        </AbsoluteFill>
    );
};

const RobotVsHuman: React.FC = () => {
    const frame = useCurrentFrame();
    const move = Math.sin(frame / 15) * 20;
    return (
        <div style={{ display: 'flex', gap: 200, alignItems: 'center' }}>
            {/* Robot */}
            <div style={{ textAlign: 'center', transform: `translateY(${move}px)` }}>
                <svg width="200" height="200" viewBox="0 0 100 100">
                    <rect x="20" y="30" width="60" height="50" fill={THEME.soft} stroke={THEME.white} strokeWidth="4" />
                    <circle cx="40" cy="50" r="5" fill={THEME.white} />
                    <circle cx="60" cy="50" r="5" fill={THEME.white} />
                    <line x1="50" y1="30" x2="50" y2="10" stroke={THEME.white} strokeWidth="4" />
                </svg>
                <div style={{ fontFamily: 'JetBrains Mono', color: THEME.white }}>AI_BOT</div>
            </div>
            {/* Divider */}
            <div style={{ fontSize: 100, color: THEME.white, fontWeight: 900 }}>VS</div>
            {/* Human */}
            <div style={{ textAlign: 'center', transform: `translateY(${-move}px)` }}>
                <svg width="200" height="200" viewBox="0 0 100 100">
                    <circle cx="50" cy="40" r="20" fill={THEME.white} />
                    <path d="M20 90 Q50 60 80 90" stroke={THEME.white} strokeWidth="4" fill="none" />
                </svg>
                <div style={{ fontFamily: 'JetBrains Mono', color: THEME.white }}>AUTHENTIC</div>
            </div>
        </div>
    );
};

// --- Main Composition ---

export const YoutubePolicy: React.FC = () => {
    const { fps } = useVideoConfig();
    const totalFrames = Math.floor(68.58 * fps);

    // Each scene roughly 6-7 seconds
    const sceneDur = Math.floor(6.8 * fps);

    return (
        <AbsoluteFill>
            <FontStyles />
            <Audio src={staticFile("youtube_policy_vo.wav")} />
            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.15} />

            <Series>
                {/* 1. Intro - The Death of Automation */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <Audio src={staticFile("sfx/whoosh.mp3")} />
                    <KineticHeading text="ERA OF AUTO" bg={THEME.purple} />
                </Series.Sequence>

                {/* 2. January 2025 - Global War */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <Audio src={staticFile("sfx/rise.mp3")} />
                    <AbsoluteFill style={{ backgroundColor: THEME.blue, justifyContent: 'center', alignItems: 'center' }}>
                        <DemonetizedIcon />
                        <div style={{ position: 'absolute', bottom: 100, textAlign: 'center' }}>
                            <h1 style={{ fontFamily: 'Outfit', color: THEME.white, fontSize: 80, fontWeight: 900 }}>GLOBAL WAR ON</h1>
                            <h2 style={{ background: THEME.white, color: THEME.blue, padding: '10px 30px', fontFamily: 'JetBrains Mono', display: 'inline-block' }}>INAUTHENTIC_CONTENT</h2>
                        </div>
                    </AbsoluteFill>
                </Series.Sequence>

                {/* 3. Soul of Video */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <AbsoluteFill style={{ backgroundColor: THEME.cyan, justifyContent: 'center', alignItems: 'center' }}>
                        <RobotVsHuman />
                        <div style={{ position: 'absolute', bottom: 100 }}>
                            <h1 style={{ fontFamily: 'Outfit', color: THEME.black, fontSize: 100, fontWeight: 900 }}>ADD A SOUL</h1>
                        </div>
                    </AbsoluteFill>
                </Series.Sequence>

                {/* 4. The Chopping Block */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <Audio src={staticFile("sfx/pop.mp3")} />
                    <ChartSection title="SYSTEM_PURGE" subtitle="THE CHOPPING BLOCK" bg={THEME.red} />
                </Series.Sequence>

                {/* 5. July 15th Algorithm */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <AbsoluteFill style={{ backgroundColor: THEME.amber, justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <h1 style={{ fontFamily: 'Outfit', fontSize: 150, color: THEME.black, fontWeight: 900 }}>JULY 15</h1>
                            <h2 style={{ fontFamily: 'JetBrains Mono', fontSize: 40, color: THEME.black }}>NEW_ALGORITHM_LIVE</h2>
                        </div>
                    </AbsoluteFill>
                </Series.Sequence>

                {/* 6. Human Gatekeepers */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <AbsoluteFill style={{ backgroundColor: THEME.black, justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <svg width="400" height="400" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" stroke={THEME.white} strokeWidth="2" fill="none" opacity="0.3" />
                                <path d="M50 20 L50 50 L80 50" stroke={THEME.accent} strokeWidth="4" strokeLinecap="round">
                                    <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="2s" repeatCount="indefinite" />
                                </path>
                            </svg>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: THEME.accent, fontFamily: 'Outfit', fontWeight: 900, fontSize: 40 }}>24H</div>
                        </div>
                        <h1 style={{ position: 'absolute', bottom: 100, color: THEME.white, fontFamily: 'Outfit', fontSize: 60, textAlign: 'center' }}>HUMAN_REVIEW_GATE</h1>
                    </AbsoluteFill>
                </Series.Sequence>

                {/* 7. Profanity Freedom */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <Audio src={staticFile("sfx/whoosh.mp3")} startFrom={20} />
                    <KineticHeading text="SPEAK_FREE" bg={THEME.green} color={THEME.black} />
                </Series.Sequence>

                {/* 8. 2026 Controversial */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <AbsoluteFill style={{ backgroundColor: THEME.blue, justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ transform: 'rotate(-5deg)' }}>
                            <h1 style={{ fontFamily: 'Outfit', fontSize: 120, color: THEME.white, fontWeight: 900 }}>2026 UPDATE</h1>
                            <div style={{ background: THEME.white, color: THEME.blue, fontSize: 40, padding: 10, fontFamily: 'JetBrains Mono' }}>MONETIZE_CONTROVERSY</div>
                        </div>
                    </AbsoluteFill>
                </Series.Sequence>

                {/* 9. Survival Guide */}
                <Series.Sequence durationInFrames={sceneDur}>
                    <AbsoluteFill style={{ backgroundColor: THEME.white, justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ width: '80%' }}>
                            <h1 style={{ fontFamily: 'Outfit', color: THEME.black, fontSize: 80, fontWeight: 900 }}>SURVIVAL_GUIDE:</h1>
                            <ul style={{ fontFamily: 'JetBrains Mono', fontSize: 30, color: THEME.black, listStyle: 'none', padding: 0 }}>
                                <li style={{ margin: '20px 0' }}>{'>'} DISRUPT_TEMPLATES</li>
                                <li style={{ margin: '20px 0' }}>{'>'} UNIQUE_COMMENTARY</li>
                                <li style={{ margin: '20px 0' }}>{'>'} DISCLOSE_AI</li>
                            </ul>
                        </div>
                    </AbsoluteFill>
                </Series.Sequence>

                {/* 10. Outro */}
                <Series.Sequence durationInFrames={totalFrames - (sceneDur * 9)}>
                    <Audio src={staticFile("sfx/rise.mp3")} />
                    <KineticHeading text="ARE YOU READY?" bg={THEME.black} color={THEME.accent} />
                </Series.Sequence>
            </Series>
        </AbsoluteFill>
    );
};
