import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';

// === NVIDIA EXPLAINER THEME & SHARED UTILITIES ===

export const NVIDIA_COLORS = {
    green: '#76B900',
    greenGlow: '#4AFF00',
    red: '#FF2244',
    redDeep: '#CC0033',
    gold: '#FFD700',
    goldDark: '#B8860B',
    navy: '#0A0E1A',
    navyDeep: '#050811',
    darkBg: '#030308',
    white: '#FFFFFF',
    gray: '#8A8A9A',
    cyan: '#00E5FF',
    pink: '#FF3399',
    purple: '#8B5CF6',
    orange: '#FF6B35',
};

export const FontStyles: React.FC = () => (
    <style>{`
        @font-face { font-family: 'BebasNeue'; src: url('${staticFile('fonts/Bebas_Neue_0.ttf')}') format('truetype'); }
        @font-face { font-family: 'Inter'; src: url('${staticFile('fonts/Inter_0.ttf')}') format('truetype'); }
        @font-face { font-family: 'Orbitron'; src: url('${staticFile('fonts/Orbitron_0.ttf')}') format('truetype'); }
        @font-face { font-family: 'SpaceGrotesk'; src: url('${staticFile('fonts/Space_Grotesk_0.ttf')}') format('truetype'); }
        @font-face { font-family: 'Montserrat'; src: url('${staticFile('fonts/Montserrat_0.ttf')}') format('truetype'); }
        @font-face { font-family: 'Outfit'; src: url('${staticFile('fonts/Outfit_0.ttf')}') format('truetype'); }
        @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins_0.ttf')}') format('truetype'); }
    `}</style>
);

// --- Reusable Components ---

export const CinematicTitle: React.FC<{
    text: string; color?: string; fontFamily?: string; size?: number;
    yOffset?: number; delay?: number; position?: 'absolute' | 'relative';
    letterSpacing?: number; gradient?: string;
}> = ({ text, color = 'white', fontFamily = 'Montserrat', size = 80, yOffset = 0, delay = 0, position = 'absolute', letterSpacing = -2, gradient }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const opacity = spring({ frame: frame - delay, fps, config: { damping: 12 } });
    const scale = spring({ frame: frame - delay - 2, fps, config: { mass: 0.5, damping: 10 }, from: 0.92, to: 1 });
    const slideY = interpolate(spring({ frame: frame - delay, fps, config: { damping: 15 } }), [0, 1], [40, 0]);

    return (
        <div style={{
            position, opacity, fontSize: size, fontWeight: 900, fontFamily, textAlign: 'center',
            transform: `translateY(${yOffset + slideY}px) scale(${scale})`,
            color: gradient ? 'transparent' : color, letterSpacing,
            textShadow: gradient ? 'none' : `0 0 60px ${color}44, 0 4px 20px rgba(0,0,0,0.8)`,
            width: position === 'absolute' ? '100%' : 'auto',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 40,
            padding: position === 'absolute' ? '0 60px' : 0, boxSizing: 'border-box',
            ...(gradient ? { background: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : {}),
        }}>
            {text}
        </div>
    );
};

export const Subtitle: React.FC<{ text: string; color?: string; delay?: number; yOffset?: number; size?: number }> = ({
    text, color = NVIDIA_COLORS.gray, delay = 0, yOffset = 0, size = 42,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const opacity = spring({ frame: frame - delay, fps, config: { damping: 14 } });
    return (
        <div style={{
            position: 'absolute', opacity, fontSize: size, fontWeight: 500, color,
            fontFamily: 'Inter', textAlign: 'center', letterSpacing: 2, textTransform: 'uppercase',
            transform: `translateY(${yOffset}px)`, width: '100%', zIndex: 40,
        }}>
            {text}
        </div>
    );
};

export const HandheldCamera: React.FC<{ children: React.ReactNode; intensity?: number }> = ({ children, intensity = 0.4 }) => {
    const frame = useCurrentFrame();
    const x = Math.sin(frame * 0.04) * intensity * 4;
    const y = Math.cos(frame * 0.035) * intensity * 3;
    return <div style={{ transform: `translate(${x}px, ${y}px)`, width: '100%', height: '100%', overflow: 'hidden' }}>{children}</div>;
};

export const PopBlock: React.FC<{ children: React.ReactNode; delay?: number; style?: React.CSSProperties }> = ({ children, delay = 0, style }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const pop = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 12 } });
    return <div style={{ transform: `scale(${pop})`, opacity: pop, ...style }}>{children}</div>;
};

export const GrainOverlay: React.FC = () => {
    return (
        <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 100, mixBlendMode: 'overlay',
            opacity: 0.04,
            background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, transparent 1px, transparent 2px)',
        }} />
    );
};

export const Vignette: React.FC<{ intensity?: number }> = ({ intensity = 0.85 }) => (
    <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 50,
        background: `radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,${intensity}) 100%)`,
    }} />
);

export const ScanLine: React.FC<{ color?: string }> = ({ color = NVIDIA_COLORS.cyan }) => {
    const frame = useCurrentFrame();
    return (
        <div style={{
            position: 'absolute', width: '100%', height: 2, zIndex: 60,
            background: `linear-gradient(to right, transparent, ${color}, transparent)`,
            top: `${(frame * 0.8) % 110}%`, opacity: 0.15, boxShadow: `0 0 30px ${color}`,
        }} />
    );
};

export const GridBackground: React.FC<{ color: string; speed?: number }> = ({ color, speed = 1 }) => {
    const frame = useCurrentFrame();
    return (
        <div style={{
            position: 'absolute', width: '250%', height: '250%', left: '-75%', top: '-75%',
            backgroundImage: `linear-gradient(${color}0D 1px, transparent 1px), linear-gradient(90deg, ${color}0D 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
            transform: `perspective(600px) rotateX(55deg) translateY(${(frame * speed) % 80}px)`,
            opacity: 0.6,
        }} />
    );
};

export const FloatingOrbs: React.FC<{ color: string; count?: number }> = ({ color, count = 4 }) => {
    const frame = useCurrentFrame();
    return (
        <>
            {[...Array(count)].map((_, i) => (
                <div key={i} style={{
                    position: 'absolute', width: 600 + i * 100, height: 600 + i * 100, borderRadius: '50%',
                    background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
                    left: `${(Math.sin(frame / (40 + i * 15) + i * 2) * 40) + 30}%`,
                    top: `${(Math.cos(frame / (50 + i * 12) + i * 3) * 30) + 30}%`,
                    filter: 'blur(80px)', pointerEvents: 'none',
                }} />
            ))}
        </>
    );
};

export const AnimatedGraph: React.FC<{
    points: number[]; color: string; width?: number; height?: number;
    delay?: number; showGrid?: boolean;
}> = ({ points, color, width = 800, height = 300, delay = 0, showGrid = true }) => {
    const frame = useCurrentFrame();
    const progress = interpolate(Math.max(0, frame - delay), [0, 90], [0, 1], { extrapolateRight: 'clamp' });
    const visiblePoints = Math.floor(progress * points.length);

    const pathData = points.slice(0, visiblePoints).map((y, i) => {
        const px = (i / (points.length - 1)) * width;
        const py = height - (y / 100) * height;
        return `${i === 0 ? 'M' : 'L'} ${px} ${py}`;
    }).join(' ');

    return (
        <svg width={width} height={height + 40} viewBox={`-20 -20 ${width + 40} ${height + 60}`}
            style={{ filter: `drop-shadow(0 0 20px ${color}66)` }}>
            {showGrid && [...Array(5)].map((_, i) => (
                <line key={i} x1={0} y1={i * height / 4} x2={width} y2={i * height / 4}
                    stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            ))}
            <path d={pathData} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
            {visiblePoints > 0 && (
                <circle cx={(visiblePoints - 1) / (points.length - 1) * width}
                    cy={height - (points[visiblePoints - 1] / 100) * height}
                    r={6} fill={color}>
                    <animate attributeName="r" values="6;10;6" dur="1s" repeatCount="indefinite" />
                </circle>
            )}
        </svg>
    );
};

export const CountUp: React.FC<{
    target: number; prefix?: string; suffix?: string; color?: string;
    size?: number; delay?: number; duration?: number;
}> = ({ target, prefix = '', suffix = '', color = NVIDIA_COLORS.gold, size = 100, delay = 0, duration = 60 }) => {
    const frame = useCurrentFrame();
    const progress = interpolate(Math.max(0, frame - delay), [0, duration], [0, 1], { extrapolateRight: 'clamp' });
    const value = Math.floor(progress * target);
    const { fps } = useVideoConfig();
    const opacity = spring({ frame: frame - delay, fps, config: { damping: 12 } });

    return (
        <div style={{
            fontFamily: 'Orbitron', fontSize: size, fontWeight: 900, color, opacity,
            textShadow: `0 0 40px ${color}66`, letterSpacing: -2, textAlign: 'center',
        }}>
            {prefix}{value.toLocaleString()}{suffix}
        </div>
    );
};

export const LowerThird: React.FC<{ label: string; value: string; color?: string; delay?: number }> = ({
    label, value, color = NVIDIA_COLORS.cyan, delay = 0,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const slideIn = spring({ frame: frame - delay, fps, config: { damping: 14 } });
    const w = interpolate(slideIn, [0, 1], [0, 100]);

    return (
        <div style={{
            position: 'absolute', bottom: 80, left: 80, zIndex: 70,
            transform: `translateX(${interpolate(slideIn, [0, 1], [-100, 0])}px)`, opacity: slideIn,
        }}>
            <div style={{ width: `${w}%`, height: 3, background: color, marginBottom: 12 }} />
            <div style={{ fontFamily: 'Inter', fontSize: 22, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 3 }}>{label}</div>
            <div style={{ fontFamily: 'Montserrat', fontSize: 36, color: 'white', fontWeight: 700 }}>{value}</div>
        </div>
    );
};
