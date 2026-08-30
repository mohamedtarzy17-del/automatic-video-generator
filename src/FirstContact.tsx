import React, { useMemo } from 'react';
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
    Sequence,
    Audio,
    staticFile,
    Easing,
    Series
} from 'remotion';

const FontStyles: React.FC = () => (
    <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;400;900&display=swap');
        `}
    </style>
);

const THEME = {
    white: '#FFFFFF',
    black: '#000000',
    accent: '#00FFCC',
    danger: '#FF3366',
    warning: '#FFFF00',
    alien: '#BC13FE',
    blue: '#3B82F6',
    slate: '#0F172A'
};

// --- Utilities ---
const usePop = (delay: number, damping = 15) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    return spring({ frame: Math.max(0, frame - delay), fps, config: { damping } });
};

// --- Noun SVG Icons Library ---
const NounIcon: React.FC<{ name: string, color?: string, size?: number, delay?: number, style?: React.CSSProperties }> = ({ name, color = THEME.slate, size = 150, delay = 0, style }) => {
    const p = usePop(delay);
    const frame = useCurrentFrame();

    const renderSVG = () => {
        switch (name.toLowerCase()) {
            case 'clock': return <g stroke={color} fill="none" strokeWidth="8"><circle cx="100" cy="100" r="80" /><line x1="100" y1="100" x2="100" y2="50" style={{ transform: `rotate(${frame * 5}deg)`, transformOrigin: '100px 100px' }} /></g>;
            case 'sun': return <g fill={color}><circle cx="100" cy="100" r="40" />{Array(12).fill(0).map((_, i) => <rect key={i} x="95" y="10" width="10" height="30" rx="5" style={{ transform: `rotate(${i * 30 + frame}deg)`, transformOrigin: '100px 100px' }} />)}</g>;
            case 'radio': return <g stroke={color} fill="none" strokeWidth="6"><circle cx="100" cy="100" r="10" fill={color} /><circle cx="100" cy="100" r={40 + (frame % 30)} opacity={1 - (frame % 30) / 30} /><circle cx="100" cy="100" r={20 + (frame % 20)} opacity={1 - (frame % 20) / 20} /></g>;
            case 'screen': return <g stroke={color} fill="none" strokeWidth="10"><rect x="10" y="40" width="180" height="120" rx="10" /><path d="M40 70 L160 70 M40 100 L160 100" strokeWidth="4" opacity="0.3" /></g>;
            case 'helix': return <g stroke={color} fill="none" strokeWidth="12"><path d="M60 40 Q100 100 60 160 M140 40 Q100 100 140 160" /><circle cx="80" cy="60" r="10" fill={color} /><circle cx="120" cy="140" r="10" fill={color} /></g>;
            case 'map': return <g stroke={color} fill="none" strokeWidth="6"><circle cx="100" cy="100" r="80" /><path d="M20 100 L180 100 M100 20 L100 180" opacity="0.4" /><ellipse cx="100" cy="100" rx="40" ry="80" /></g>;
            case 'server': return <g stroke={color} fill="none" strokeWidth="8"><rect x="50" y="30" width="100" height="140" /><circle cx="75" cy="55" r="5" fill={color} /><circle cx="125" cy="55" r="5" fill={color} /><line x1="50" y1="80" x2="150" y2="80" /><line x1="50" y1="120" x2="150" y2="120" /></g>;
            case 'oil': return <g fill={color}><path d="M100 20 C60 80 40 120 40 150 C40 180 70 200 100 200 C130 200 160 180 160 150 C160 120 140 80 100 20 Z" /></g>;
            case 'lithium': return <g stroke={color} fill="none" strokeWidth="8"><circle cx="100" cy="100" r="40" /><circle cx="100" cy="30" r="15" fill={color} /><circle cx="40" cy="150" r="15" fill={color} /><circle cx="160" cy="150" r="15" fill={color} /></g>;
            case 'satellite': return <g stroke={color} fill="none" strokeWidth="8"><rect x="70" y="80" width="60" height="40" /><rect x="10" y="90" width="50" height="20" /><rect x="140" y="90" width="50" height="20" /></g>;
            case 'ufo': return <g fill={color}><ellipse cx="100" cy="120" rx="90" ry="25" /><path d="M60 105 Q100 40 140 105" opacity="0.6" /><circle cx="100" cy="110" r="10" fill="#fff" /></g>;
            case 'radar': return <g stroke={color} fill="none" strokeWidth="4"><circle cx="100" cy="100" r="80" /><circle cx="100" cy="100" r="50" opacity="0.3" /><line x1="100" y1="100" x2={100 + 80 * Math.cos(frame / 10)} y2={100 + 80 * Math.sin(frame / 10)} strokeWidth="8" /></g>;
            case 'airplane': return <g fill={color}><path d="M100 20 L40 100 L100 180 L160 100 Z" /><path d="M20 100 L180 100" stroke={color} strokeWidth="10" /></g>;
            case 'camera': return <g stroke={color} fill="none" strokeWidth="10"><rect x="20" y="60" width="160" height="100" rx="10" /><circle cx="100" cy="110" r="30" /></g>;
            case 'government': return <g stroke={color} fill="none" strokeWidth="8"><path d="M20 160 L180 160 L170 80 L100 30 L30 80 Z" /><rect x="85" y="110" width="30" height="50" /></g>;
            case 'robot': return <g stroke={color} fill="none" strokeWidth="8"><rect x="60" y="60" width="80" height="80" rx="10" /><circle cx="85" cy="85" r="5" fill={color} /><circle cx="115" cy="85" r="5" fill={color} /></g>;
            case 'brain': return <g fill={color}><path d="M100 40 C60 40 40 70 40 100 C40 130 60 160 100 160 C140 160 160 130 160 100 C160 70 140 40 100 40 Z" /></g>;
            case 'dna': return <g stroke={color} fill="none" strokeWidth="8"><path d="M60 20 Q100 100 60 180 M140 20 Q100 100 140 180" /><line x1="60" y1="60" x2="140" y2="60" strokeWidth="4" /></g>;
            case 'check': return <g stroke={color} fill="none" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round"><path d="M40 105 L85 150 L160 55" /></g>;
            case 'atom': return <g stroke={color} fill="none" strokeWidth="6"><circle cx="100" cy="100" r="30" fill={color} /><ellipse cx="100" cy="100" rx="80" ry="30" /><ellipse cx="100" cy="100" rx="80" ry="30" style={{ transform: 'rotate(60deg)', transformOrigin: '100px 100px' }} /><ellipse cx="100" cy="100" rx="80" ry="30" style={{ transform: 'rotate(120deg)', transformOrigin: '100px 100px' }} /></g>;
            case 'bolt': return <g fill={color}><path d="M120 20 L60 110 L100 110 L80 180 L140 90 L100 90 Z" /></g>;
            case 'alien': return <g fill={color}><path d="M100 40 C60 40 40 80 40 120 C40 160 70 180 100 180 C130 180 160 160 160 120 C160 80 140 40 100 40 Z" /><ellipse cx="70" cy="110" rx="15" ry="25" fill="#000" style={{ transform: 'rotate(-20deg)', transformOrigin: '70px 110px' }} /><ellipse cx="130" cy="110" rx="15" ry="25" fill="#000" style={{ transform: 'rotate(20deg)', transformOrigin: '130px 110px' }} /></g>;
            case 'chart': return <g fill={color}>{Array(5).fill(0).map((_, i) => <rect key={i} x={30 + i * 30} y={180 - (20 + i * 30)} width="20" height={20 + i * 30} rx="4" />)}</g>;
            case 'wifi': return <g stroke={color} fill="none" strokeWidth="10" strokeLinecap="round"><path d="M100 160 L100 160" /><path d="M70 130 Q100 100 130 130" /><path d="M50 110 Q100 60 150 110" /><path d="M30 90 Q100 20 170 90" /></g>;
            case 'star_map': return <g fill={color}>{Array(20).fill(0).map((_, i) => <circle key={i} cx={20 + Math.random() * 160} cy={20 + Math.random() * 160} r={1 + Math.random() * 3} opacity={0.4 + Math.random() * 0.6} />)}<path d="M40 40 L100 80 L160 40 M100 80 L100 160" stroke={color} strokeWidth="2" fill="none" opacity="0.3" /></g>;
            case 'watch': return <g stroke={color} fill="none" strokeWidth="8"><rect x="60" y="60" width="80" height="80" rx="15" /><path d="M80 60 L80 30 M120 60 L120 30 M80 140 L80 170 M120 140 L120 170" /><circle cx="100" cy="100" r="2" fill={color} /><line x1="100" y1="100" x2="100" y2="80" strokeWidth="4" /><line x1="100" y1="100" x2="120" y2="100" strokeWidth="4" /></g>;
            case 'billboard': return <g stroke={color} fill="none" strokeWidth="8"><rect x="20" y="40" width="160" height="100" /><line x1="50" y1="140" x2="40" y2="180" /><line x1="150" y1="140" x2="160" y2="180" /><path d="M40 70 L160 110 M40 110 L160 70" strokeWidth="2" opacity="0.3" /></g>;
            case 'screens_all': return <g fill={color}><rect x="20" y="20" width="40" height="60" rx="5" /><rect x="80" y="40" width="100" height="60" rx="5" /><rect x="40" y="110" width="80" height="50" rx="5" /><rect x="140" y="120" width="30" height="50" rx="2" /></g>;
            default: return <circle cx="100" cy="100" r="50" fill={color} />;
        }
    };

    return (
        <div style={{ transform: `scale(${p})`, ...style }}>
            <svg width={size} height={size} viewBox="0 0 200 200">{renderSVG()}</svg>
        </div>
    );
};

// --- Scene Container with Brighter Backgrounds ---
const ModernScene: React.FC<{ children: React.ReactNode, title: string, subtitle: string, bg: string, textColor?: string }> = ({ children, title, subtitle, bg, textColor = THEME.slate }) => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ backgroundColor: bg, overflow: 'hidden' }}>
            {/* Main Content Layout */}
            <AbsoluteFill style={{ padding: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', gap: 60, flexWrap: 'wrap', justifyContent: 'center', maxWidth: '80%' }}>
                    {children}
                </div>
            </AbsoluteFill>

            {/* Premium Typography Overlay */}
            <div style={{ position: 'absolute', bottom: 100, left: 100, zIndex: 100 }}>
                <h1 style={{ fontFamily: 'Outfit', fontSize: 130, color: textColor, fontWeight: 900, margin: 0, textTransform: 'uppercase', letterSpacing: -5, lineHeight: 0.9 }}>{title}</h1>
                <div style={{ background: textColor, color: bg, padding: '10px 20px', borderRadius: 8, display: 'inline-block', fontFamily: 'JetBrains Mono', fontSize: 28, fontWeight: '900', marginTop: 15 }}>{`> ${subtitle}_`}</div>
            </div>

            {/* Corner Decorative Panels */}
            <div style={{ position: 'absolute', top: 50, left: 50, borderLeft: `8px solid ${textColor}`, paddingLeft: 20 }}>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 18, color: textColor, fontWeight: 'bold' }}>GLOBAL_SIGNAL_MONITOR</div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: textColor, opacity: 0.6 }}>DECODING_XLR_STREAM // {Math.floor(frame / 30)}s</div>
            </div>

            <div style={{ position: 'absolute', top: 50, right: 50, textAlign: 'right', opacity: 0.4, color: textColor }}>
                {[...Array(3)].map((_, i) => <div key={i} style={{ fontFamily: 'JetBrains Mono', fontSize: 14 }}>{Math.random().toString(16).slice(2, 10).toUpperCase()}</div>)}
            </div>
        </AbsoluteFill>
    );
};

export const FirstContact: React.FC = () => {
    const { fps } = useVideoConfig();

    // Precise timing based on user feedback:
    // 0:00-0:07 (Tomorrow)
    // 0:07-0:14 (Deep Space/Radio)
    // 0:14-0:18 (Every Screen/Billboard) - 4s
    // 0:18-0:25 (Pattern/Helix)
    const cuts = [210, 210, 120, 210, 197, 197, 197, 197, 197, 197, 197, 197, 197, 197, 197, 197, 197, 197, 197, 197, 197];
    // Total frames will be slightly adjusted to match 2:18 total
    cuts[20] = 4140 - cuts.slice(0, 20).reduce((a, b) => a + b, 0);

    return (
        <AbsoluteFill style={{ backgroundColor: THEME.white }}>
            <FontStyles />
            <Audio src={staticFile("alien/aliens.wav")} />

            {/* Lowered background music volume to be less dominating */}
            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.15} />

            <Series>
                {/* 1. 6 AM Tomorrow */}
                <Series.Sequence durationInFrames={cuts[0]}>
                    <Audio src={staticFile("sfx/clock.mp3")} volume={0.5} />
                    <ModernScene title="TOMORROW" subtitle="6:00 AM" bg={THEME.white}>
                        <NounIcon name="clock" size={250} />
                        <NounIcon name="sun" size={200} color={THEME.warning} delay={20} />
                        <NounIcon name="watch" size={150} color={THEME.slate} delay={40} />
                    </ModernScene>
                </Series.Sequence>

                {/* 2. Deep Space Heartbeat (0:07 - 0:14) */}
                <Series.Sequence durationInFrames={cuts[1]}>
                    <Audio src={staticFile("sfx/rise.mp3")} volume={0.4} />
                    <ModernScene title="DEEP SPACE" subtitle="SIGNAL_IN" bg={THEME.blue} textColor="#fff">
                        <NounIcon name="radio" size={350} color="#fff" />
                        <NounIcon name="ufo" size={180} color={THEME.accent} delay={40} />
                    </ModernScene>
                </Series.Sequence>

                {/* 3. EVERY SCREEN / BILLBOARDS (0:14 - 0:18) */}
                <Series.Sequence durationInFrames={cuts[2]}>
                    <ModernScene title="OVERRIDE" subtitle="GLOBAL_SIGNAL" bg={THEME.slate} textColor={THEME.accent}>
                        <NounIcon name="billboard" size={220} color={THEME.accent} />
                        <NounIcon name="screens_all" size={180} color={THEME.accent} delay={20} />
                        <NounIcon name="watch" size={100} color={THEME.warning} delay={40} />
                    </ModernScene>
                </Series.Sequence>

                {/* 4. PATTERN / HELIX (0:18 - 0:25) */}
                <Series.Sequence durationInFrames={cuts[3]}>
                    <ModernScene title="PATTERN" subtitle="ALIEN_GEOMETRY" bg={THEME.white}>
                        <NounIcon name="helix" size={300} color={THEME.blue} />
                        <NounIcon name="star_map" size={250} color={THEME.slate} delay={30} />
                    </ModernScene>
                </Series.Sequence>

                {/* 5. Internet Slow */}
                <Series.Sequence durationInFrames={cuts[4]}>
                    <ModernScene title="INTERNET" subtitle="LATENCY_MAX" bg={THEME.white}>
                        <NounIcon name="wifi" size={300} color={THEME.danger} />
                        <NounIcon name="server" size={150} delay={30} />
                    </ModernScene>
                </Series.Sequence>

                {/* 6. Stock Market Chaos */}
                <Series.Sequence durationInFrames={cuts[5]}>
                    <Audio src={staticFile("sfx/rise.mp3")} startFrom={100} volume={0.4} />
                    <ModernScene title="MARKET" subtitle="CRASH_00" bg={THEME.danger} textColor="#fff">
                        <NounIcon name="chart" size={350} color="#fff" />
                        <NounIcon name="oil" size={200} color="#000" delay={30} />
                    </ModernScene>
                </Series.Sequence>

                {/* 7. Lithium Silicon */}
                <Series.Sequence durationInFrames={cuts[6]}>
                    <ModernScene title="MATERIALS" subtitle="TRI-VALUE" bg={THEME.warning}>
                        <NounIcon name="lithium" size={250} />
                        <NounIcon name="atom" size={250} delay={30} />
                    </ModernScene>
                </Series.Sequence>

                {/* 8. NASA ESA Anomaly */}
                <Series.Sequence durationInFrames={cuts[7]}>
                    <ModernScene title="NASA CONTROL" subtitle="ANOMALY" bg={THEME.white}>
                        <NounIcon name="satellite" size={300} color={THEME.blue} />
                        <NounIcon name="screen" size={100} delay={40} />
                    </ModernScene>
                </Series.Sequence>

                {/* 9. THE ARRIVAL */}
                <Series.Sequence durationInFrames={cuts[8]}>
                    <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.6} />
                    <ModernScene title="THE FLEET" subtitle="SILVER_NEEDLES" bg={THEME.slate} textColor={THEME.white}>
                        <NounIcon name="ufo" size={300} color={THEME.accent} />
                        <NounIcon name="ufo" size={250} color={THEME.accent} delay={20} />
                    </ModernScene>
                </Series.Sequence>

                {/* 10. Radar Airplanes */}
                <Series.Sequence durationInFrames={cuts[9]}>
                    <ModernScene title="DETECTION" subtitle="AIR_GROUNDED" bg={THEME.white}>
                        <NounIcon name="radar" size={350} color={THEME.danger} />
                        <NounIcon name="airplane" size={150} color={THEME.slate} delay={30} />
                    </ModernScene>
                </Series.Sequence>

                {/* 11. Ships Crowds */}
                <Series.Sequence durationInFrames={cuts[10]}>
                    <ModernScene title="CITIES" subtitle="EYEWITNESS" bg={THEME.white}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30 }}>
                            {[...Array(6)].map((_, i) => <NounIcon key={i} name="camera" size={100} delay={i * 10} />)}
                        </div>
                    </ModernScene>
                </Series.Sequence>

                {/* 12. Governments Leaders */}
                <Series.Sequence durationInFrames={cuts[11]}>
                    <ModernScene title="COUNCIL" subtitle="GLOBAL_SUMMIT" bg={THEME.white}>
                        <NounIcon name="government" size={400} />
                    </ModernScene>
                </Series.Sequence>

                {/* 13. Scientists Scramble */}
                <Series.Sequence durationInFrames={cuts[12]}>
                    <ModernScene title="ANALYSIS" subtitle="SUPERCOMPUTER" bg={THEME.blue} textColor="#fff">
                        <NounIcon name="brain" size={350} color="#fff" />
                    </ModernScene>
                </Series.Sequence>

                {/* 14. Robots Drones */}
                <Series.Sequence durationInFrames={cuts[13]}>
                    <ModernScene title="SURVEY" subtitle="RECON_DRONE" bg={THEME.white}>
                        <NounIcon name="robot" size={250} />
                        <NounIcon name="helix" size={200} color={THEME.alien} delay={30} />
                    </ModernScene>
                </Series.Sequence>

                {/* 15. Gift or Warning */}
                <Series.Sequence durationInFrames={cuts[14]}>
                    <Audio src={staticFile("sfx/rise.mp3")} volume={0.4} />
                    <ModernScene title="PURPOSE" subtitle="GIFT_OR_BOLT" bg={THEME.warning}>
                        <NounIcon name="bolt" size={300} color={THEME.danger} />
                        <NounIcon name="alien" size={200} delay={40} />
                    </ModernScene>
                </Series.Sequence>

                {/* 16. Dyson Sphere Charts */}
                <Series.Sequence durationInFrames={cuts[15]}>
                    <ModernScene title="TECH LEVEL" subtitle="DYSON_LEVEL" bg={THEME.white}>
                        <NounIcon name="chart" size={400} color={THEME.blue} />
                    </ModernScene>
                </Series.Sequence>

                {/* 17. Checklist DNA */}
                <Series.Sequence durationInFrames={cuts[16]}>
                    <ModernScene title="PROTOCOL" subtitle="CONTACT_CHECK" bg={THEME.accent} textColor={THEME.slate}>
                        <NounIcon name="check" size={200} />
                        <NounIcon name="dna" size={250} delay={30} />
                    </ModernScene>
                </Series.Sequence>

                {/* 18. History Obsolete */}
                <Series.Sequence durationInFrames={cuts[17]}>
                    <ModernScene title="OBSOLETE" subtitle="HISTORY_REWRITE" bg={THEME.danger} textColor="#fff">
                        <div style={{ fontSize: 180, fontWeight: 900 }}>VOID</div>
                    </ModernScene>
                </Series.Sequence>

                {/* 19. Brain Processing */}
                <Series.Sequence durationInFrames={cuts[18]}>
                    <ModernScene title="COGNITION" subtitle="SYNC_DATA" bg={THEME.white}>
                        <NounIcon name="brain" size={400} color={THEME.alien} />
                    </ModernScene>
                </Series.Sequence>

                {/* 20. DNA Upgrade */}
                <Series.Sequence durationInFrames={cuts[19]}>
                    <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.5} />
                    <ModernScene title="EVOLUTION" subtitle="DNA_SYNC" bg={THEME.alien} textColor="#fff">
                        <NounIcon name="dna" size={500} color="#fff" />
                    </ModernScene>
                </Series.Sequence>

                {/* 21. OUTRO - READY? */}
                <Series.Sequence durationInFrames={cuts[20]}>
                    <ModernScene title="DAY ONE" subtitle="READY?" bg={THEME.slate} textColor={THEME.accent}>
                        <NounIcon name="alien" size={400} color={THEME.accent} />
                    </ModernScene>
                </Series.Sequence>
            </Series>

        </AbsoluteFill>
    );
};
