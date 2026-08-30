import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

// --- Theme and Types ---
export const MOTION_THEME = {
    accent: '#00FFCC',
    danger: '#FF3366',
    warning: '#FBBF24',
    water: '#3B82F6',
    oxygen: '#60A5FA',
    earth: '#F87171',
    white: '#FFFFFF',
    dark: '#000000',
};

export type VisualType = 'wave' | 'sun' | 'oxygen' | 'earthquake' | 'planet' | 'shield' | 'heart' | 'internet' | 'toy' | 'friends' | 'rock' | 'mask' | 'paw' | 'spirit' | 'chip' | 'chart-down' | 'money';

const GlobalFilter: React.FC = () => (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
            <filter id="hera-glow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
    </svg>
);

export const VisualIcon: React.FC<{ type: VisualType; size?: number; color?: string; delay?: number }> = ({ type, size = 300, color, delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const spr = spring({ frame: frame - delay, fps, config: { damping: 12 } });

    const finalColor = color || (
        type === 'wave' ? MOTION_THEME.water :
            type === 'sun' ? MOTION_THEME.warning :
                type === 'heart' ? MOTION_THEME.danger :
                    type === 'oxygen' ? MOTION_THEME.oxygen :
                        type === 'earthquake' ? MOTION_THEME.earth :
                            MOTION_THEME.white
    );

    const style = {
        transform: `scale(${spr})`,
        opacity: spr,
        filter: 'url(#hera-glow)'
    };

    return (
        <>
            <GlobalFilter />
            <div style={style}>
                {type === 'wave' && <OceanWave size={size} color={finalColor} />}
                {type === 'heart' && <Heart size={size} color={finalColor} />}
                {type === 'sun' && <Sun size={size} color={finalColor} />}
                {type === 'oxygen' && <Oxygen size={size} color={finalColor} />}
                {type === 'earthquake' && <Earthquake size={size} color={finalColor} />}
                {type === 'planet' && <Planet size={size} color={finalColor} />}
                {type === 'mask' && <Mask size={size} color={finalColor} />}
                {type === 'paw' && <Paw size={size} color={finalColor} />}
                {type === 'spirit' && <Spirit size={size} color={finalColor} />}
                {type === 'chip' && <Chip size={size} color={finalColor} />}
                {type === 'chart-down' && <ChartDown size={size} color={finalColor} />}
                {type === 'money' && <Money size={size} color={finalColor} />}
            </div>
        </>
    );
};

const Chip: React.FC<{ size: number, color: string }> = ({ size, color }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h2M1 15h2" />
    </svg>
);

const ChartDown: React.FC<{ size: number, color: string }> = ({ size, color }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
        <polyline points="17 18 23 18 23 12" />
    </svg>
);

const Money: React.FC<{ size: number, color: string }> = ({ size, color }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M6 12h.01M18 12h.01" />
    </svg>
);

const Mask: React.FC<{ size: number, color: string }> = ({ size, color }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21l-3-3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-3l-3 3z" />
        <path d="M8 8s.5 2 1.5 2 1.5-2 1.5-2" />
        <path d="M13 8s.5 2 1.5 2 1.5-2 1.5-2" />
        <path d="M12 14c1 0 1-1 1-1h-2s0 1 1 1z" />
    </svg>
);

const Paw: React.FC<{ size: number, color: string }> = ({ size, color }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
        <circle cx="12" cy="14" r="5" />
        <circle cx="6" cy="7" r="2.5" />
        <circle cx="18" cy="7" r="2.5" />
        <circle cx="10" cy="3" r="2.5" />
        <circle cx="14" cy="3" r="2.5" />
    </svg>
);

const Spirit: React.FC<{ size: number, color: string }> = ({ size, color }) => {
    const frame = useCurrentFrame();
    return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2">
            <circle cx="12" cy="12" r="8" strokeOpacity="0.3" />
            <circle cx="12" cy="12" r={interpolate(Math.sin(frame / 10), [-1, 1], [4, 7])} />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeOpacity="0.5" />
        </svg>
    );
};

const OceanWave: React.FC<{ size: number, color: string }> = ({ size, color }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
        <path d="M2 12c.6.5 1.2 1 2.5 1s1.9-.5 2.5-1 1.2-1 2.5-1 1.9.5 2.5 1 1.2 1 2.5 1 1.9-.5 2.5-1 1.2-1 2.5-1 1.9.5 2.5 1" />
    </svg>
);

const Heart: React.FC<{ size: number, color: string }> = ({ size, color }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
);

const Sun: React.FC<{ size: number, color: string }> = ({ size, color }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
);

const Oxygen: React.FC<{ size: number, color: string }> = ({ size, color }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2">
        <circle cx="7" cy="12" r="4" />
        <circle cx="17" cy="12" r="4" />
        <line x1="11" y1="10" x2="13" y2="10" />
        <line x1="11" y1="14" x2="13" y2="14" />
    </svg>
);

const Earthquake: React.FC<{ size: number, color: string }> = ({ size, color }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2">
        <path d="M2 20h20" />
        <path d="M12 20l-4-4 8-8-8-8" />
        <path d="M2 10h4l2 2 4-4 4 4 2-2h4" />
    </svg>
);

const Planet: React.FC<{ size: number, color: string }> = ({ size, color }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        <path d="M2 12h20" />
    </svg>
);
