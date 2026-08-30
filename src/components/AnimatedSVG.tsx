import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const THEME = {
    white: '#FFFFFF',
    accent: '#00FFCC',
    danger: '#FF3366',
    punch: '#FFD700',
    bg: '#000000',
};

interface SVGProps {
    color?: string;
    size?: number;
    delay?: number;
    duration?: number;
}

export const HeartIcon: React.FC<SVGProps> = ({ color = THEME.danger, size = 200, delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const spr = spring({ frame: frame - delay, fps, config: { damping: 12 } });
    const beat = Math.sin(frame / 5) * 0.1 + 1;

    return (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill={color}
            style={{
                transform: `scale(${spr * beat})`,
                opacity: spr,
                filter: 'drop-shadow(0 0 20px rgba(255, 51, 102, 0.4))'
            }}
        >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    );
};

export const ZooIcon: React.FC<SVGProps> = ({ color = THEME.white, size = 200, delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const spr = spring({ frame: frame - delay, fps });

    return (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            stroke={color}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
                transform: `translateY(${interpolate(spr, [0, 1], [40, 0])}px) scale(${spr})`,
                opacity: spr,
            }}
        >
            <path d="M3 21h18" />
            <path d="M5 21V7l8-4 8 4v14" />
            <path d="M9 21v-6h6v6" />
            <path d="M9 7l4-2 4 2" />
        </svg>
    );
};

export const InternetIcon: React.FC<SVGProps> = ({ color = THEME.accent, size = 200, delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const spr = spring({ frame: frame - delay, fps });

    return (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            stroke={color}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
                transform: `rotate(${interpolate(spr, [0, 1], [-15, 0])}deg) scale(${spr})`,
                opacity: spr,
            }}
        >
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
            <path d="M9 14h6" />
            <path d="M9 10h6" />
            <path d="M9 6h6" />
        </svg>
    );
};

export const ToyIcon: React.FC<SVGProps> = ({ color = THEME.punch, size = 200, delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const spr = spring({ frame: frame - delay, fps, config: { damping: 15 } });

    return (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill={color}
            style={{
                transform: `scale(${spr}) rotate(${Math.sin(frame / 5) * 5}deg)`,
                opacity: spr,
            }}
        >
            {/* Bear Face */}
            <circle cx="12" cy="13" r="8" />
            <circle cx="5" cy="6" r="4" />
            <circle cx="19" cy="6" r="4" />
            <circle cx="10" cy="11" r="1" fill="black" />
            <circle cx="14" cy="11" r="1" fill="black" />
            <path d="M10 15 q2 2 4 0" stroke="black" strokeWidth="1" fill="none" />
        </svg>
    );
};

export const ShieldIcon: React.FC<SVGProps> = ({ color = THEME.white, size = 200, delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const spr = spring({ frame: frame - delay, fps });

    return (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            stroke={color}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
                transform: `scale(${spr})`,
                opacity: spr,
            }}
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    );
};

export const FriendsIcon: React.FC<SVGProps> = ({ color = THEME.accent, size = 200, delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const spr = spring({ frame: frame - delay, fps });

    return (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            stroke={color}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
                transform: `scale(${spr}) translateX(${Math.sin(frame / 15) * 10}px)`,
                opacity: spr,
            }}
        >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
};

export const RockIcon: React.FC<SVGProps> = ({ color = THEME.white, size = 200, delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const spr = spring({ frame: frame - delay, fps });

    return (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill={color}
            style={{
                transform: `scale(${spr})`,
                opacity: spr,
            }}
        >
            <path d="M4 20l2-12 10-4 4 10-2 6z" />
        </svg>
    );
};

export const SocialIcon: React.FC<SVGProps> = ({ color = THEME.accent, size = 150, delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const spr = spring({ frame: frame - delay, fps });

    return (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            stroke={color}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
                transform: `scale(${spr}) translateY(${Math.sin(frame / 10) * 10}px)`,
                opacity: spr,
            }}
        >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.38 8.38 0 0 1 3.8.9L21 3l-1.9 4.1z" />
        </svg>
    );
};
