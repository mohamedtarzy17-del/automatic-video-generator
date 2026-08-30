import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const OCEAN_THEME = {
    water: 'url(#waterGrad)',
    dry: 'url(#dryGrad)',
    heat: 'url(#heatGrad)',
    oxygen: 'url(#o2Grad)',
    earth: 'url(#earthGrad)',
    white: '#FFFFFF',
    glow: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.4))'
};

const IconFilter: React.FC = () => (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
            <linearGradient id="dryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#92400E" />
                <stop offset="100%" stopColor="#451A03" />
            </linearGradient>
            <linearGradient id="heatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
            <linearGradient id="o2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#DBEAFE" />
            </linearGradient>
            <linearGradient id="earthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F87171" />
                <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
    </svg>
);

interface SVGProps {
    color?: string;
    size?: number;
    delay?: number;
}

export const OceanWaveIcon: React.FC<SVGProps> = ({ color = OCEAN_THEME.water, size = 200, delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const spr = spring({ frame: frame - delay, fps });
    const waveShift = Math.sin(frame / 20) * 10;

    return (
        <>
            <IconFilter />
            <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{
                opacity: spr,
                transform: `scale(${spr})`,
                filter: 'url(#glow)'
            }}>
                <path d={`M2 12c.6.5 1.2 1 2.5 1s1.9-.5 2.5-1 1.2-1 2.5-1 1.9.5 2.5 1 1.2 1 2.5 1 1.9-.5 2.5-1 1.2-1 2.5-1 1.9.5 2.5 1`} transform={`translate(${waveShift}, 0)`} />
                <path d={`M2 17c.6.5 1.2 1 2.5 1s1.9-.5 2.5-1 1.2-1 2.5-1 1.9.5 2.5 1 1.2 1 2.5 1 1.9-.5 2.5-1 1.2-1 2.5-1 1.9.5 2.5 1`} transform={`translate(${-waveShift}, 0)`} />
                <path d={`M2 7c.6.5 1.2 1 2.5 1s1.9-.5 2.5-1 1.2-1 2.5-1 1.9.5 2.5 1 1.2 1 2.5 1 1.9-.5 2.5-1 1.2-1 2.5-1 1.9.5 2.5 1`} transform={`translate(${waveShift / 2}, 0)`} />
            </svg>
        </>
    );
};

export const SunHeatIcon: React.FC<SVGProps> = ({ color = OCEAN_THEME.heat, size = 200, delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const spr = spring({ frame: frame - delay, fps });
    const pulse = Math.sin(frame / 6) * 0.15 + 1;

    return (
        <>
            <IconFilter />
            <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{
                opacity: spr,
                transform: `scale(${spr * pulse})`,
                filter: 'url(#glow)'
            }}>
                <circle cx="12" cy="12" r="6" fill={color} fillOpacity="0.3" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                    <rect key={angle} x="11.5" y="1" width="1" height="4" rx="0.5" fill={color} transform={`rotate(${angle}, 12, 12)`} />
                ))}
            </svg>
        </>
    );
};

export const OxygenIcon: React.FC<SVGProps> = ({ color = OCEAN_THEME.oxygen, size = 200, delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const spr = spring({ frame: frame - delay, fps });
    const float = Math.sin(frame / 30) * 15;

    return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: spr, transform: `scale(${spr}) translateY(${float}px)` }}>
            <circle cx="7" cy="12" r="4" />
            <circle cx="17" cy="12" r="4" />
            <line x1="11" y1="10" x2="13" y2="10" />
            <line x1="11" y1="14" x2="13" y2="14" />
        </svg>
    );
};

export const EarthquakeIcon: React.FC<SVGProps> = ({ color = OCEAN_THEME.earth, size = 200, delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const spr = spring({ frame: frame - delay, fps });
    const shake = Math.sin(frame * 2) * 5 * spr;

    return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: spr, transform: `scale(${spr}) translateX(${shake}px)` }}>
            <path d="M2 20h20" />
            <path d="M12 20l-4-4 8-8-8-8" />
            <path d="M2 10h4l2 2 4-4 4 4 2-2h4" />
        </svg>
    );
};

export const PlanetDryIcon: React.FC<SVGProps> = ({ size = 200, delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const spr = spring({ frame: frame - delay, fps });
    const dry = interpolate(frame - delay, [0, 1500], [0, 1], { extrapolateRight: 'clamp' });
    const blue = `rgb(${interpolate(dry, [0, 1], [59, 146])}, ${interpolate(dry, [0, 1], [130, 64])}, ${interpolate(dry, [0, 1], [246, 14])})`;

    return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: spr, transform: `scale(${spr})` }}>
            <circle cx="12" cy="12" r="10" fill={blue} opacity="0.3" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <path d="M2 12h20" />
        </svg>
    );
};
