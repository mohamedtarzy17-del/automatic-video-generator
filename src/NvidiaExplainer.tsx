import React from 'react';
import {
    AbsoluteFill,
    Sequence,
    useVideoConfig,
    useCurrentFrame,
    interpolate,
    spring,
    Audio,
    staticFile,
} from 'remotion';

// --- Types ---
export type VisualType = 'chip' | 'chart-down' | 'chart-up' | 'money' | 'planet' | 'shield' | 'clock' | 'warning' | 'robot' | 'network' | 'bubble';

interface DataPoint {
    x: number;
    y: number;
}

interface MarketStat {
    label: string;
    value: string;
    trend: 'up' | 'down' | 'neutral';
}

interface NvidiaEvent {
    id: string;
    start: number;       // seconds
    duration: number;    // seconds
    type: 'headline' | 'subtext' | 'split' | 'big-icon';
    title?: string;
    description?: string;
    icon?: VisualType;
    color?: string;
    sfx?: string;
}

// --- Advanced Visualization Components ---

const Graph: React.FC<{ color: string; points: DataPoint[] }> = ({ color, points }) => {
    const frame = useCurrentFrame();
    const progress = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: 'clamp' });

    // Scale points to 800x400
    const pathData = points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x * 8} ${400 - (p.y * 4)}`)
        .join(' ');

    return (
        <svg width="800" height="400" viewBox="0 0 800 400" style={{ filter: `drop-shadow(0 0 15px ${color}aa)`, overflow: 'visible' }}>
            <path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth="4"
                strokeDasharray="2000"
                strokeDashoffset={2000 * (1 - progress)}
            />
            {/* Pulsing end point */}
            {points.length > 0 && (
                <circle
                    cx={points[points.length - 1].x * 8}
                    cy={400 - (points[points.length - 1].y * 4)}
                    r={6}
                    fill={color}
                />
            )}
        </svg>
    );
};

const Dashboard: React.FC<{ color: string; stats: MarketStat[] }> = ({ color, stats }) => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
            width: '100%',
            maxWidth: 1000,
        }}>
            {stats.map((stat, i) => (
                <div key={i} style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${color}33`,
                    padding: '20px 30px',
                    borderRadius: 12,
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                }}>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 18, textTransform: 'uppercase', marginBottom: 10 }}>{stat.label}</div>
                    <div style={{
                        color: stat.trend === 'up' ? '#76B900' : stat.trend === 'down' ? '#FF3366' : 'white',
                        fontSize: 32,
                        fontWeight: 700
                    }}>
                        {stat.value}
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- Pure Motion Graphics Background ---
const TechBackground: React.FC<{ color: string }> = ({ color }) => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ backgroundColor: '#050505', overflow: 'hidden' }}>
            {/* Moving Grid */}
            <div style={{
                position: 'absolute',
                width: '200%',
                height: '200%',
                backgroundImage: `
                    linear-gradient(to right, ${color}11 1px, transparent 1px),
                    linear-gradient(to bottom, ${color}11 1px, transparent 1px)
                `,
                backgroundSize: '100px 100px',
                transform: `rotate(15deg) translateY(${(frame % 100) * -1}px) translateX(${(frame % 100) * -1}px)`,
                opacity: 0.5,
            }} />

            {/* Glowing Orbs */}
            {[...Array(5)].map((_, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    width: 800,
                    height: 800,
                    background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
                    left: `${(Math.sin(frame / (50 + i * 10)) * 50) + 25}%`,
                    top: `${(Math.cos(frame / (60 + i * 10)) * 50) + 25}%`,
                    filter: 'blur(100px)',
                }} />
            ))}

            {/* Scanning Line */}
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '2px',
                background: `linear-gradient(to right, transparent, ${color}, transparent)`,
                top: `${(frame % 150) / 1.5}%`,
                opacity: 0.3,
                boxShadow: `0 0 20px ${color}`,
            }} />
        </AbsoluteFill>
    );
};

// --- Icons ---
const NvidiaIcon: React.FC<{ type: VisualType; size: number; color: string }> = ({ type, size, color }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const spr = spring({ frame, fps, config: { damping: 12 } });

    const style: React.CSSProperties = {
        width: size,
        height: size,
        transform: `scale(${spr})`,
        filter: `drop-shadow(0 0 20px ${color}66)`,
    };

    return (
        <div style={style}>
            {type === 'chip' && (
                <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <rect x="9" y="9" width="6" height="6" />
                    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h2M1 15h2" />
                </svg>
            )}
            {type === 'chart-down' && (
                <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                    <polyline points="17 18 23 18 23 12" />
                </svg>
            )}
            {type === 'chart-up' && (
                <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                </svg>
            )}
            {type === 'money' && (
                <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <circle cx="12" cy="12" r="2" />
                    <path d="M6 12h.01M18 12h.01" />
                </svg>
            )}
            {type === 'bubble' && (
                <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8a4 4 0 0 1 4 4" opacity="0.5" />
                </svg>
            )}
            {type === 'robot' && (
                <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <circle cx="12" cy="5" r="2" />
                    <path d="M12 7v4M8 16h.01M16 16h.01" />
                </svg>
            )}
            {/* Fallback for others */}
            {!['chip', 'chart-down', 'chart-up', 'money', 'bubble', 'robot'].includes(type) && (
                <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                </svg>
            )}
        </div>
    );
};

// --- Scene Components ---
const NvidiaScene: React.FC<NvidiaEvent> = (event) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const spr = spring({ frame, fps, config: { damping: 10, stiffness: 100 } });

    const colorMap: Record<string, string> = {
        'red': '#FF3366',
        'pink': '#EC4899',
        'yellow': '#FBBF24',
        'blue': '#3B82F6',
        'green': '#76B900',
    };

    const finalColor = colorMap[event.color || 'blue'] || colorMap['blue'];

    return (
        <AbsoluteFill>
            <TechBackground color={finalColor} />

            {/* Vignette Overlay */}
            <AbsoluteFill style={{
                background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.8) 120%)',
                pointerEvents: 'none'
            }} />

            {event.sfx && <Audio src={staticFile(`sfx/${event.sfx}`)} volume={0.4} />}

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: 60,
                transform: `scale(${interpolate(spr, [0, 1], [0.8, 1])})`,
                textAlign: 'center',
                padding: '0 100px',
                zIndex: 10
            }}>
                {event.icon && (
                    <div style={{
                        transform: `rotate(${interpolate(frame, [0, 150], [-5, 5])}deg)`
                    }}>
                        <NvidiaIcon type={event.icon} size={400} color={finalColor} />
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {event.title && (
                        <div style={{
                            fontFamily: 'Outfit, sans-serif',
                            fontSize: interpolate(spr, [0, 1], [120, 160]),
                            fontWeight: 900,
                            color: 'white',
                            textTransform: 'uppercase',
                            letterSpacing: -8,
                            lineHeight: 0.85,
                            textShadow: `0 0 40px ${finalColor}44`,
                        }}>
                            {event.title}
                        </div>
                    )}

                    {event.description && (
                        <div style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 48,
                            fontWeight: 600,
                            color: 'white',
                            opacity: spr,
                            letterSpacing: -1,
                            background: `linear-gradient(to right, white, ${finalColor}aa)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            {event.description}
                        </div>
                    )}
                </div>

                {/* Dynamic Data Viz based on Scene Color */}
                <div style={{ marginTop: 40, opacity: spr }}>
                    {event.color === 'red' && (
                        <Graph color="#FF3366" points={[
                            { x: 0, y: 80 }, { x: 20, y: 75 }, { x: 40, y: 85 }, { x: 60, y: 70 }, { x: 80, y: 30 }, { x: 100, y: 15 }
                        ]} />
                    )}
                    {event.color === 'green' && (
                        <Graph color="#76B900" points={[
                            { x: 0, y: 20 }, { x: 20, y: 35 }, { x: 40, y: 30 }, { x: 60, y: 55 }, { x: 80, y: 85 }, { x: 100, y: 95 }
                        ]} />
                    )}
                    {(event.color === 'blue' || event.color === 'yellow') && (
                        <Dashboard color={finalColor} stats={[
                            { label: 'Revenue', value: '$30.04B', trend: 'up' },
                            { label: 'Growth', value: '+262%', trend: 'up' },
                            { label: 'Margins', value: '78.4%', trend: 'neutral' }
                        ]} />
                    )}
                </div>
            </div>
        </AbsoluteFill>
    );
};

// --- Main Engine ---
export const NvidiaEpicExplainer: React.FC = () => {
    const { fps } = useVideoConfig();

    const timeline: NvidiaEvent[] = [
        { id: '1', start: 0, duration: 8, type: 'headline', title: 'THE NVIDIA PARADOX', description: 'RECORD PROFITS. SUDDEN CRASH. WHY?', color: 'red', icon: 'chip', sfx: 'whoosh.mp3' },
        { id: '2', start: 8, duration: 7, type: 'headline', title: 'PERFECT NUMBERS', description: 'NVIDIA BEAT EVERY EXPECTATION.', color: 'green', icon: 'money', sfx: 'pop.mp3' },
        { id: '3', start: 15, duration: 8, type: 'headline', title: '-5.5% BLOOD RED', description: 'WORST DROP SINCE APRIL. BILLIONS GONE.', color: 'red', icon: 'chart-down', sfx: 'whoosh.mp3' },
        { id: '4', start: 23, duration: 10, type: 'headline', title: 'THE OIL OF AI', description: 'H100 & H200 CHIPS RUN THE WORLD.', color: 'blue', icon: 'chip', sfx: 'rise.mp3' },
        { id: '5', start: 33, duration: 10, type: 'headline', title: 'PRICED TO PERFECTION', description: 'WHEN GROWTH ISN\'T FAST ENOUGH.', color: 'yellow', icon: 'chart-up', sfx: 'pop 2.mp3' },
        { id: '6', start: 43, duration: 10, type: 'headline', title: 'THE WHISPER NUMBERS', description: 'EXPECTATIONS ARE HIGHER THAN REALITY.', color: 'pink', icon: 'bubble' },
        { id: '7', start: 53, duration: 12, type: 'headline', title: 'LAW OF RETURN', description: 'GOD-LEVEL GROWTH IS SLOWING DOWN.', color: 'yellow', icon: 'chart-down', sfx: 'whoosh.mp3' },
        { id: '8', start: 65, duration: 12, type: 'headline', title: 'BLACKWELL DELAY', description: 'COMPETITION IS STARTING TO BREATHE.', color: 'red', icon: 'warning', sfx: 'clock.mp3' },
        { id: '9', start: 77, duration: 10, type: 'headline', title: 'THE S&P 500 ENGINE', description: 'IF NVIDIA SNEEZES, THE WORLD CATCHES COLD.', color: 'blue', icon: 'network', sfx: 'whoosh.mp3' },
        { id: '10', start: 87, duration: 13, type: 'headline', title: 'LIQUIDITY PROXY', description: 'HEDGE FUNDS USE NVIDIA AS A PIGGY BANK.', color: 'green', icon: 'money', sfx: 'pop.mp3' },
        { id: '11', start: 100, duration: 15, type: 'headline', title: 'YEAR 2000 GHOSTS', description: 'THE TALE OF CISCO SYSTEMS.', color: 'pink', icon: 'clock', sfx: 'rise.mp3' },
        { id: '12', start: 115, duration: 15, type: 'headline', title: 'THE DOT COM ECHO', description: 'RIGHT ABOUT FUTURE. WRONG ABOUT PRICE.', color: 'yellow', icon: 'bubble', sfx: 'whoosh.mp3' },
        { id: '13', start: 130, duration: 15, type: 'headline', title: 'THE NEW REALITY', description: 'GREATNESS IS NO LONGER ENOUGH.', color: 'green', icon: 'robot', sfx: 'pop 2.mp3' },
        { id: '14', start: 145, duration: 10, type: 'headline', title: 'WHO KEEPS BETTING?', description: 'THE CHIPS ARE ON THE TABLE.', color: 'blue', icon: 'chip', sfx: 'whoosh.mp3' },
    ];

    return (
        <AbsoluteFill style={{ backgroundColor: '#050505' }}>
            <Audio src={staticFile('nvidia_vo.wav')} volume={1.0} />
            <Audio src={staticFile('sfx/rise.mp3')} volume={0.1} />

            {/* The Timeline */}
            {timeline.map((event) => (
                <Sequence key={event.id} from={Math.floor(event.start * fps)} durationInFrames={Math.floor(event.duration * fps)}>
                    <NvidiaScene {...event} />
                </Sequence>
            ))}

            {/* Global Post-Process */}
            <AbsoluteFill style={{
                boxShadow: 'inset 0 0 300px rgba(0,0,0,0.8)',
                pointerEvents: 'none'
            }} />
        </AbsoluteFill>
    );
};
