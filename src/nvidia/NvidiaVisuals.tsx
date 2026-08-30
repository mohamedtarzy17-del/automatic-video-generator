import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { NVIDIA_COLORS } from './NvidiaTheme';

// === SVG VISUAL ASSETS FOR NVIDIA EXPLAINER ===

export const AIChip: React.FC<{ size?: number; color?: string; delay?: number; rotate?: boolean; blueprint?: boolean }> = ({
    size = 300, color = NVIDIA_COLORS.green, delay = 0, rotate = false, blueprint = false,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const pop = spring({ frame: frame - delay, fps, config: { damping: 12 } });
    const rotation = rotate ? interpolate(frame, [0, 300], [0, 360]) : 0;
    const pulse = Math.sin(frame * 0.08) * 0.05 + 1;

    return (
        <div style={{ transform: `scale(${pop * pulse}) rotate(${rotation}deg)`, filter: `drop-shadow(0 0 40px ${color}88)`, opacity: pop }}>
            <svg width={size} height={size} viewBox="0 0 100 100">
                <rect x="20" y="20" width="60" height="60" rx="6" fill={blueprint ? 'none' : '#111'} stroke={color} strokeWidth="2.5" strokeDasharray={blueprint ? '4 2' : 'none'} />
                <rect x="32" y="32" width="36" height="36" rx="3" fill={blueprint ? 'none' : '#1a1a2e'} stroke={color} strokeWidth="1.5" opacity={0.8} />
                <rect x="40" y="40" width="20" height="20" rx="2" fill={color} opacity={0.3} />
                <rect x="44" y="44" width="12" height="12" rx="1" fill={color} opacity={0.6} />
                {[28, 38, 48, 58, 68].map(x => (
                    <React.Fragment key={`t${x}`}>
                        <line x1={x} y1="20" x2={x} y2="12" stroke={color} strokeWidth="2" opacity={0.7} />
                        <line x1={x} y1="80" x2={x} y2="88" stroke={color} strokeWidth="2" opacity={0.7} />
                    </React.Fragment>
                ))}
                {[28, 38, 48, 58, 68].map(y => (
                    <React.Fragment key={`l${y}`}>
                        <line x1="20" y1={y} x2="12" y2={y} stroke={color} strokeWidth="2" opacity={0.7} />
                        <line x1="80" y1={y} x2="88" y2={y} stroke={color} strokeWidth="2" opacity={0.7} />
                    </React.Fragment>
                ))}
                <text x="50" y="53" textAnchor="middle" fill={color} fontSize="6" fontFamily="Orbitron" fontWeight="bold">
                    {blueprint ? 'NEXT-GEN' : 'H200'}
                </text>
            </svg>
        </div>
    );
};

export const ServerRack: React.FC<{ delay?: number; color?: string }> = ({ delay = 0, color = NVIDIA_COLORS.green }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const pop = spring({ frame: frame - delay, fps, config: { damping: 12 } });
    const blink = Math.sin(frame * 0.3) > 0;

    return (
        <svg width={200} height={300} viewBox="0 0 80 120" style={{ transform: `scale(${pop})`, opacity: pop, filter: `drop-shadow(0 0 20px ${color}44)` }}>
            <rect x="10" y="5" width="60" height="110" rx="4" fill="#0a0a15" stroke={color} strokeWidth="1.5" opacity={0.8} />
            {[12, 28, 44, 60, 76, 92].map((y, i) => (
                <React.Fragment key={i}>
                    <rect x="15" y={y} width="50" height="12" rx="2" fill="#111125" stroke={`${color}55`} strokeWidth="0.8" />
                    <circle cx="22" cy={y + 6} r="2" fill={blink && i % 2 === 0 ? color : '#333'} />
                    <circle cx="28" cy={y + 6} r="2" fill={!blink && i % 2 === 1 ? '#FF3366' : '#222'} />
                    <rect x="35" y={y + 3} width="25" height="1" fill={`${color}33`} />
                    <rect x="35" y={y + 7} width="18" height="1" fill={`${color}22`} />
                </React.Fragment>
            ))}
        </svg>
    );
};

export const OilBarrel: React.FC<{ label?: string; delay?: number }> = ({ label = 'THE OIL OF AI', delay = 0 }) => {
    const { fps } = useVideoConfig();
    const frame = useCurrentFrame();
    const pop = spring({ frame: frame - delay, fps, config: { damping: 12 } });

    return (
        <svg width={180} height={220} viewBox="0 0 80 100" style={{ transform: `scale(${pop})`, filter: 'drop-shadow(0 0 25px #FFD70066)' }}>
            <ellipse cx="40" cy="15" rx="30" ry="10" fill="#1a1500" stroke={NVIDIA_COLORS.gold} strokeWidth="1.5" />
            <rect x="10" y="15" width="60" height="70" fill="#1a1500" stroke={NVIDIA_COLORS.gold} strokeWidth="1.5" />
            <ellipse cx="40" cy="85" rx="30" ry="10" fill="#1a1500" stroke={NVIDIA_COLORS.gold} strokeWidth="1.5" />
            <line x1="10" y1="35" x2="70" y2="35" stroke={NVIDIA_COLORS.goldDark} strokeWidth="1" opacity={0.5} />
            <line x1="10" y1="65" x2="70" y2="65" stroke={NVIDIA_COLORS.goldDark} strokeWidth="1" opacity={0.5} />
            <text x="40" y="55" textAnchor="middle" fill={NVIDIA_COLORS.gold} fontSize="6" fontFamily="Orbitron" fontWeight="bold">{label}</text>
        </svg>
    );
};

export const WorldMap: React.FC<{ rippleOrigin?: { x: number; y: number }; delay?: number }> = ({
    rippleOrigin = { x: 200, y: 250 }, delay = 0,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const pop = spring({ frame: frame - delay, fps, config: { damping: 14 } });
    const rippleR = interpolate(Math.max(0, frame - delay), [0, 120], [0, 800], { extrapolateRight: 'clamp' });

    return (
        <svg width={1200} height={600} viewBox="0 0 1200 600" style={{ opacity: pop * 0.8 }}>
            <ellipse cx="300" cy="250" rx="180" ry="120" fill="none" stroke="#ffffff11" strokeWidth="1" />
            <ellipse cx="600" cy="200" rx="200" ry="150" fill="none" stroke="#ffffff11" strokeWidth="1" />
            <ellipse cx="900" cy="260" rx="160" ry="100" fill="none" stroke="#ffffff11" strokeWidth="1" />
            {[
                { x: 200, y: 250, label: 'SV' }, { x: 890, y: 210, label: 'TKY' },
                { x: 850, y: 230, label: 'SEL' }, { x: 520, y: 180, label: 'LDN' },
            ].map((city, i) => (
                <React.Fragment key={i}>
                    <circle cx={city.x} cy={city.y} r={5} fill={NVIDIA_COLORS.red} opacity={interpolate(Math.max(0, frame - delay - i * 15), [0, 20], [0, 1], { extrapolateRight: 'clamp' })} />
                    <text x={city.x} y={city.y - 12} textAnchor="middle" fill="white" fontSize="12" fontFamily="Orbitron" opacity={0.7}>{city.label}</text>
                </React.Fragment>
            ))}
            <circle cx={rippleOrigin.x} cy={rippleOrigin.y} r={rippleR} fill="none" stroke={NVIDIA_COLORS.red} strokeWidth="2" opacity={interpolate(rippleR, [0, 800], [0.8, 0])} />
            <circle cx={rippleOrigin.x} cy={rippleOrigin.y} r={rippleR * 0.7} fill="none" stroke={NVIDIA_COLORS.red} strokeWidth="1" opacity={interpolate(rippleR, [0, 800], [0.5, 0])} />
        </svg>
    );
};

export const PieChart: React.FC<{ dominantSlice?: number; color?: string; delay?: number }> = ({
    dominantSlice = 0.35, color = NVIDIA_COLORS.green, delay = 0,
}) => {
    const { fps } = useVideoConfig();
    const frame = useCurrentFrame();
    const pop = spring({ frame: frame - delay, fps, config: { damping: 12 } });
    const r = 80;
    const c = 2 * Math.PI * r;
    const mainArc = c * dominantSlice;

    return (
        <svg width={220} height={220} viewBox="0 0 220 220" style={{ transform: `scale(${pop})`, filter: `drop-shadow(0 0 25px ${color}44)` }}>
            <circle cx="110" cy="110" r={r} fill="none" stroke="#ffffff11" strokeWidth="30" />
            <circle cx="110" cy="110" r={r} fill="none" stroke={color} strokeWidth="32"
                strokeDasharray={`${mainArc} ${c - mainArc}`} strokeDashoffset={c / 4} strokeLinecap="round" />
            <text x="110" y="115" textAnchor="middle" fill="white" fontSize="28" fontFamily="Orbitron" fontWeight="bold">
                {Math.round(dominantSlice * 100)}%
            </text>
        </svg>
    );
};

export const BalanceScale: React.FC<{ leftLabel: string; rightLabel: string; tilt?: number; delay?: number }> = ({
    leftLabel, rightLabel, tilt = 0, delay = 0,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const pop = spring({ frame: frame - delay, fps, config: { damping: 12 } });
    const angle = interpolate(Math.max(0, frame - delay), [0, 90], [0, tilt], { extrapolateRight: 'clamp' });

    return (
        <svg width={400} height={300} viewBox="0 0 200 150" style={{ transform: `scale(${pop})`, filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.3))' }}>
            <polygon points="85,140 115,140 100,120" fill="#333" stroke={NVIDIA_COLORS.gold} strokeWidth="1" />
            <line x1="100" y1="120" x2="100" y2="40" stroke={NVIDIA_COLORS.gold} strokeWidth="2" />
            <g transform={`rotate(${angle}, 100, 40)`}>
                <line x1="30" y1="40" x2="170" y2="40" stroke={NVIDIA_COLORS.gold} strokeWidth="2.5" />
                <line x1="30" y1="40" x2="30" y2="65" stroke="#888" strokeWidth="1" />
                <ellipse cx="30" cy="68" rx="25" ry="5" fill="#1a1a2e" stroke={NVIDIA_COLORS.cyan} strokeWidth="1" />
                <text x="30" y="90" textAnchor="middle" fill={NVIDIA_COLORS.cyan} fontSize="8" fontFamily="SpaceGrotesk">{leftLabel}</text>
                <line x1="170" y1="40" x2="170" y2="65" stroke="#888" strokeWidth="1" />
                <ellipse cx="170" cy="68" rx="25" ry="5" fill="#1a1a2e" stroke={NVIDIA_COLORS.red} strokeWidth="1" />
                <text x="170" y="90" textAnchor="middle" fill={NVIDIA_COLORS.red} fontSize="8" fontFamily="SpaceGrotesk">{rightLabel}</text>
            </g>
        </svg>
    );
};

export const FinancialBubble: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const pop = spring({ frame: frame - delay, fps, config: { damping: 12 } });
    const stretch = 1 + Math.sin(frame * 0.04) * 0.03;
    const shimmer = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.15, 0.35]);

    return (
        <svg width={400} height={400} viewBox="0 0 200 200" style={{ transform: `scale(${pop * stretch})`, filter: 'drop-shadow(0 0 30px rgba(255,100,150,0.3))' }}>
            <defs>
                <radialGradient id="bubbleGrad">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="85%" stopColor={`rgba(255,150,200,${shimmer})`} />
                    <stop offset="100%" stopColor="rgba(255,100,150,0.1)" />
                </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="85" fill="url(#bubbleGrad)" stroke="rgba(255,200,220,0.4)" strokeWidth="1.5" />
            <polyline points="40,140 60,130 75,120 90,100 105,85 120,60 140,35 155,25" fill="none" stroke={NVIDIA_COLORS.green} strokeWidth="2.5" opacity={0.7} />
            <ellipse cx="70" cy="60" rx="25" ry="15" fill="white" opacity={shimmer * 0.3} transform="rotate(-30, 70, 60)" />
        </svg>
    );
};

export const PokerChip: React.FC<{ label?: string; color?: string; delay?: number; size?: number }> = ({
    label = '$1T', color = NVIDIA_COLORS.gold, delay = 0, size = 150,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const pop = spring({ frame: frame - delay, fps, config: { damping: 12 } });

    return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: `scale(${pop})`, filter: `drop-shadow(0 0 15px ${color}66)` }}>
            <circle cx="50" cy="50" r="45" fill="#111" stroke={color} strokeWidth="3" />
            <circle cx="50" cy="50" r="38" fill="none" stroke={color} strokeWidth="1" strokeDasharray="8 4" />
            <circle cx="50" cy="50" r="28" fill="none" stroke={color} strokeWidth="1.5" />
            <text x="50" y="55" textAnchor="middle" fill={color} fontSize="16" fontFamily="Orbitron" fontWeight="bold">{label}</text>
        </svg>
    );
};

export const ChessMetaphor: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const pop = spring({ frame: frame - delay, fps, config: { damping: 12 } });

    return (
        <svg width={350} height={250} viewBox="0 0 160 100" style={{ transform: `scale(${pop})`, filter: 'drop-shadow(0 0 20px rgba(118,185,0,0.3))' }}>
            {[...Array(8)].map((_, r) => [...Array(8)].map((_, c) => (
                <rect key={`${r}${c}`} x={c * 20} y={r * 12} width={20} height={12}
                    fill={(r + c) % 2 === 0 ? '#1a1a2e' : '#0d0d1a'} stroke="#ffffff08" strokeWidth="0.3" />
            )))}
            <text x="70" y="55" textAnchor="middle" fill={NVIDIA_COLORS.green} fontSize="20" opacity={0.9 + Math.sin(frame * 0.05) * 0.1}>♚</text>
            <text x={30 + interpolate(Math.max(0, frame - delay), [0, 120], [0, 15], { extrapolateRight: 'clamp' })} y="70" fill={NVIDIA_COLORS.red} fontSize="14">♟</text>
            <text x={110 + interpolate(Math.max(0, frame - delay), [0, 120], [0, -15], { extrapolateRight: 'clamp' })} y="45" fill={NVIDIA_COLORS.red} fontSize="14">♜</text>
            <text x={50 + interpolate(Math.max(0, frame - delay), [0, 120], [0, 10], { extrapolateRight: 'clamp' })} y="80" fill={NVIDIA_COLORS.orange} fontSize="14">♞</text>
        </svg>
    );
};

export const EnginePiston: React.FC<{ delay?: number; stuttering?: boolean }> = ({ delay = 0, stuttering = false }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const pop = spring({ frame: frame - delay, fps, config: { damping: 12 } });
    const pistonY = stuttering
        ? 15 + Math.abs(Math.sin(frame * 0.15)) * 10
        : 15 + Math.sin(frame * 0.1) * 15;

    return (
        <svg width={250} height={200} viewBox="0 0 120 100" style={{ transform: `scale(${pop})`, filter: 'drop-shadow(0 0 20px rgba(0,229,255,0.3))' }}>
            <rect x="20" y="50" width="80" height="40" rx="5" fill="#0a0a1a" stroke={NVIDIA_COLORS.cyan} strokeWidth="1.5" />
            <text x="60" y="75" textAnchor="middle" fill={NVIDIA_COLORS.cyan} fontSize="8" fontFamily="Orbitron">S&P 500</text>
            <rect x="45" y={pistonY} width="30" height="35" rx="3" fill="#111" stroke={NVIDIA_COLORS.green} strokeWidth="1.5" />
            <rect x="52" y={pistonY + 8} width="16" height="16" rx="2" fill={NVIDIA_COLORS.green} opacity={0.4 + Math.sin(frame * 0.2) * 0.3} />
            <line x1="60" y1={pistonY + 35} x2="60" y2="50" stroke="#555" strokeWidth="2" />
        </svg>
    );
};

export const ForkedRoad: React.FC<{ leftLabel: string; rightLabel: string; delay?: number }> = ({
    leftLabel, rightLabel, delay = 0,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const pop = spring({ frame: frame - delay, fps, config: { damping: 12 } });

    return (
        <svg width={500} height={300} viewBox="0 0 250 150" style={{ transform: `scale(${pop})`, filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))' }}>
            <line x1="125" y1="140" x2="125" y2="80" stroke="#444" strokeWidth="8" strokeLinecap="round" />
            <line x1="125" y1="80" x2="50" y2="25" stroke={NVIDIA_COLORS.gold} strokeWidth="6" strokeLinecap="round" />
            <line x1="125" y1="80" x2="200" y2="25" stroke={NVIDIA_COLORS.red} strokeWidth="6" strokeLinecap="round" />
            <text x="50" y="15" textAnchor="middle" fill={NVIDIA_COLORS.gold} fontSize="7" fontFamily="SpaceGrotesk" fontWeight="bold">{leftLabel}</text>
            <text x="200" y="15" textAnchor="middle" fill={NVIDIA_COLORS.red} fontSize="7" fontFamily="SpaceGrotesk" fontWeight="bold">{rightLabel}</text>
            <circle cx="125" cy="80" r="6" fill="#222" stroke="white" strokeWidth="1.5" />
            <text x="125" y="83" textAnchor="middle" fill="white" fontSize="6">?</text>
        </svg>
    );
};
