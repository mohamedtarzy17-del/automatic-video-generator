import React from 'react';
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
    Sequence,
    interpolateColors,
    Audio,
    staticFile
} from 'remotion';

const FontStyles: React.FC = () => (
    <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&display=swap');
        `}
    </style>
);

const THEME = {
    bg: '#0D0518',       // Deep Void Purple
    bgAlt: '#1A0A30',    // Neon Shadow
    text: '#FFFFFF',     // Pure White
    primary: '#8A2BE2',  // Cyber Violet
    secondary: '#00FFFF',// Electric Cyan
    alert: '#FF0055',    // Matrix Red
};

const Pop: React.FC<{ children: React.ReactNode; delay?: number, scaleBase?: number }> = ({ children, delay = 0, scaleBase = 1 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const progress = Math.max(0, frame - delay);
    const pop = spring({ frame: progress, fps, config: { damping: 12 } });
    
    if (frame < delay) return null;
    return <div style={{ transform: `scale(${pop * scaleBase})`, display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>{children}</div>;
};

// --- Custom Cyber SVG Components ---

const ChatBoxDeadSVG: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
    const frame = useCurrentFrame();
    const progress = Math.max(0, frame - delay);
    const crossWidth = interpolate(progress, [0, 20], [0, 250], { extrapolateRight: 'clamp' });
    
    return (
        <svg width="300" height="150" viewBox="0 0 300 150">
            <rect x="10" y="40" width="280" height="70" rx="10" fill="none" stroke={THEME.text} strokeWidth="6" />
            <text x="30" y="85" fill={THEME.text} fontFamily="JetBrains Mono" fontSize="24">Type a prompt...</text>
            <line x1="10" y1="75" x2={10 + crossWidth} y2="75" stroke={THEME.alert} strokeWidth="12" strokeLinecap="round" />
        </svg>
    );
};

const AgentNetworkSVG: React.FC = () => {
    const frame = useCurrentFrame();
    const pulse1 = interpolate(Math.sin(frame / 8), [-1, 1], [0.8, 1.2]);
    const pulse2 = interpolate(Math.cos(frame / 6), [-1, 1], [0.8, 1.2]);
    const rotate = (frame * 1.5) % 360;

    return (
        <svg width="300" height="300" viewBox="0 0 300 300">
            <circle cx="150" cy="150" r="100" fill="none" stroke={THEME.primary} strokeWidth="4" strokeDasharray="10 20" style={{ transform: `rotate(${rotate}deg)`, transformOrigin: '150px 150px' }} />
            
            <line x1="150" y1="150" x2="150" y2="40" stroke={THEME.secondary} strokeWidth="4" />
            <line x1="150" y1="150" x2="260" y2="150" stroke={THEME.secondary} strokeWidth="4" />
            <line x1="150" y1="150" x2="40" y2="150" stroke={THEME.secondary} strokeWidth="4" />
            <line x1="150" y1="150" x2="150" y2="260" stroke={THEME.secondary} strokeWidth="4" />

            <circle cx="150" cy="150" r="30" fill={THEME.primary} style={{ transform: `scale(${pulse1})`, transformOrigin: '150px 150px' }} />
            <circle cx="150" cy="40" r="20" fill={THEME.alert} />
            <text x="150" y="47" fill={THEME.text} fontFamily="JetBrains Mono" fontSize="20" textAnchor="middle">API</text>
            
            <circle cx="260" cy="150" r="20" fill={THEME.secondary} style={{ transform: `scale(${pulse2})`, transformOrigin: '260px 150px' }} />
            <text x="260" y="157" fill={THEME.bg} fontFamily="JetBrains Mono" fontSize="20" textAnchor="middle">DB</text>

            <circle cx="40" cy="150" r="20" fill={THEME.secondary} style={{ transform: `scale(${pulse1})`, transformOrigin: '40px 150px' }} />
            <text x="40" y="157" fill={THEME.bg} fontFamily="JetBrains Mono" fontSize="20" textAnchor="middle">WEB</text>
            
            <circle cx="150" cy="260" r="20" fill={THEME.alert} />
            <text x="150" y="267" fill={THEME.text} fontFamily="JetBrains Mono" fontSize="20" textAnchor="middle">PY</text>
        </svg>
    );
};

const SwarmSVG: React.FC = () => {
    const frame = useCurrentFrame();
    const m1 = Math.sin(frame / 15) * 40;
    const m2 = Math.cos(frame / 10) * 30;
    return (
        <svg width="400" height="200" viewBox="0 0 400 200">
            <rect x={100 + m1} y="30" width="40" height="40" fill={THEME.secondary} rx="5" />
            <rect x={200 - m2} y="80" width="40" height="40" fill={THEME.primary} rx="5" />
            <rect x={300 + m1} y="130" width="40" height="40" fill={THEME.alert} rx="5" />
            <rect x={50 - m2} y="100" width="40" height="40" fill={THEME.text} rx="5" />
        </svg>
    );
};

const HyperautomationSVG: React.FC = () => {
    const frame = useCurrentFrame();
    const cycle = Math.max(0, interpolate(frame, [0, 30], [0, 400], { extrapolateRight: 'clamp' }));
    return (
        <svg width="350" height="200" viewBox="0 0 350 200">
            <path d="M 50 100 Q 175 -50 300 100 T 50 100" fill="none" stroke={THEME.primary} strokeWidth="10" strokeDasharray="400" strokeDashoffset={400 - cycle} />
            <circle cx="50" cy="100" r="15" fill={THEME.alert} />
            <circle cx="300" cy="100" r="15" fill={THEME.secondary} />
            <text x="175" y="110" fill={THEME.text} fontFamily="JetBrains Mono" fontSize="40" textAnchor="middle">1000x</text>
        </svg>
    );
};

// --- Flex-Bounded Callout UI ---

const AgentCallout: React.FC<{ delay?: number, text: string, type?: 'primary' | 'alert' | 'white' }> = ({ delay = 0, text, type = 'primary' }) => {
    let bg = THEME.bgAlt;
    let color = THEME.secondary;
    let borderC = THEME.secondary;
    if (type === 'alert') { bg = THEME.alert; color = THEME.text; borderC = THEME.alert; }
    if (type === 'white') { bg = THEME.text; color = THEME.bg; borderC = THEME.text; }

    return (
        <Pop delay={delay}>
            <div style={{
                background: bg,
                color: color,
                padding: '15px 30px',
                borderRadius: 4,
                fontFamily: 'JetBrains Mono',
                fontWeight: 700,
                fontSize: 32,
                borderLeft: `10px solid ${borderC}`,
                boxShadow: `0 10px 30px rgba(0,0,0,0.8), 0 0 20px ${borderC}33`,
                whiteSpace: 'nowrap',
                display: 'inline-block'
            }}>
                {`> ${text.toUpperCase()}_`}
            </div>
        </Pop>
    );
};

export const AgenticAI: React.FC = () => {
    const frame = useCurrentFrame();
    const bg = interpolateColors(
        Math.sin(frame / 60),
        [-1, 1],
        [THEME.bg, THEME.bgAlt]
    );

    return (
        <AbsoluteFill style={{ backgroundColor: bg, overflow: 'hidden' }}>
            <FontStyles />
            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.15} loop />

            {/* CUT 1: Chat is Dead (0-90) ~3s */}
            <Sequence durationInFrames={90}>
                <Audio src={staticFile("ai/01_chat_dead.mp3")} />
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
                        <Pop delay={0}><h1 style={{ fontFamily: 'Space Grotesk', fontSize: 130, color: THEME.alert, margin: 0, textAlign: 'center' }}>CHAT IS DEAD.</h1></Pop>
                        <Pop delay={30}><ChatBoxDeadSVG delay={30} /></Pop>
                        <AgentCallout delay={60} text="PROMPT BOX OBSOLETE" type="white" />
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* CUT 2: Agentic Era (90-210) ~4s */}
            <Sequence from={90} durationInFrames={120}>
                <Audio src={staticFile("ai/02_agentic_era.mp3")} />
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
                        <Pop delay={0}><h2 style={{ fontFamily: 'Space Grotesk', fontSize: 100, color: THEME.text, margin: 0, textAlign: 'center' }}>THE AGENTIC ERA</h2></Pop>
                        <Pop delay={50}><AgentNetworkSVG /></Pop>
                        <AgentCallout delay={80} text="SOFTWARE THAT ACTS" type="primary" />
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* CUT 3: Autonomous Swarm (210-330) ~4s */}
            <Sequence from={210} durationInFrames={120}>
                <Audio src={staticFile("ai/03_workers.mp3")} />
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
                        <Pop delay={0} scaleBase={1.1}><h1 style={{ fontFamily: 'Space Grotesk', fontSize: 110, color: THEME.secondary, margin: 0, textAlign: 'center' }}>DON'T HIRE. DEPLOY.</h1></Pop>
                        <Pop delay={50}><SwarmSVG /></Pop>
                        <AgentCallout delay={80} text="AUTONOMOUS SWARM" type="alert" />
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* CUT 4: Hyperautomation (330-480) ~5s */}
            <Sequence from={330} durationInFrames={150}>
                <Audio src={staticFile("ai/04_hyperautomation.mp3")} />
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
                        <Pop delay={0}><h2 style={{ fontFamily: 'Space Grotesk', fontSize: 90, color: THEME.text, margin: 0, textAlign: 'center' }}>HYPERAUTOMATION</h2></Pop>
                        <Pop delay={60}><HyperautomationSVG /></Pop>
                        <AgentCallout delay={100} text="MASSIVE NEURAL LABOUR" type="white" />
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* CUT 5: Outpacing (480-600) ~4s */}
            <Sequence from={480} durationInFrames={120}>
                <Audio src={staticFile("ai/05_outpacing.mp3")} />
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
                        <Pop delay={0} scaleBase={1.2}><h1 style={{ fontFamily: 'Space Grotesk', fontSize: 150, color: THEME.alert, margin: 0, textAlign: 'center' }}>ADAPT OR DIE.</h1></Pop>
                        <AgentCallout delay={60} text="1000X SPEED ADVANTAGE" type="primary" />
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* CUT 6: The Matrix (600-750) ~5s */}
            <Sequence from={600} durationInFrames={150}>
                <Audio src={staticFile("ai/06_matrix.mp3")} />
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: THEME.primary }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
                        <Pop delay={0}><h1 style={{ fontFamily: 'Space Grotesk', fontSize: 120, color: THEME.bg, margin: 0, textAlign: 'center' }}>BUILD THE MATRIX.</h1></Pop>
                        <Pop delay={80}>
                            <div style={{ padding: '25px 60px', background: THEME.bg, color: THEME.secondary, borderRadius: 10, fontSize: 80, fontFamily: 'JetBrains Mono', fontWeight: 900, borderLeft: `10px solid ${THEME.secondary}`, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                                SUBSCRIBE
                            </div>
                        </Pop>
                    </div>
                </AbsoluteFill>
            </Sequence>
        </AbsoluteFill>
    );
};
