import React from 'react';
import { useCurrentFrame, interpolate, spring } from 'remotion';

// ─── DYNAMIC FONT SYSTEM ─────────────────────────

export const FONT_STACK = {
    display: "'Bebas Neue', cursive",
    body: "'Inter', sans-serif",
    serif: "'Playfair Display', serif",
    mono: "'Space Mono', monospace",
    condensed: "'Oswald', sans-serif",
    rounded: "'Nunito', sans-serif",
    handwritten: "'Caveat', cursive",
    impact: "'Anton', sans-serif",
};

export const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Caveat:wght@400;700&family=Inter:wght@400;500;600;700;800;900&family=Nunito:wght@400;700;900&family=Oswald:wght@400;700&family=Playfair+Display:wght@400;700;900&family=Space+Mono:wght@400;700&display=swap');`;

// Rotate fonts per scene for visual variety
export const getFontForScene = (sceneIndex: number): string => {
    const fonts = [
        FONT_STACK.display,
        FONT_STACK.condensed,
        FONT_STACK.impact,
        FONT_STACK.serif,
        FONT_STACK.rounded,
        FONT_STACK.display,
        FONT_STACK.impact,
        FONT_STACK.condensed,
    ];
    return fonts[sceneIndex % fonts.length];
};

// ─── CALLOUT COMPONENTS ─────────────────────────

type CalloutType = 'info' | 'warning' | 'tip' | 'danger' | 'success' | 'quote';

const CALLOUT_STYLES: Record<CalloutType, { bg: string; border: string; icon: string; label: string }> = {
    info: { bg: 'rgba(33,150,243,0.15)', border: '#2196F3', icon: 'ℹ️', label: 'INFO' },
    warning: { bg: 'rgba(255,152,0,0.15)', border: '#FF9800', icon: '⚠️', label: 'WARNING' },
    tip: { bg: 'rgba(16,185,129,0.15)', border: '#10B981', icon: '💡', label: 'PRO TIP' },
    danger: { bg: 'rgba(239,68,68,0.15)', border: '#EF4444', icon: '🔴', label: 'CRITICAL' },
    success: { bg: 'rgba(16,185,129,0.15)', border: '#10B981', icon: '✅', label: 'SUCCESS' },
    quote: { bg: 'rgba(124,58,237,0.15)', border: '#7C3AED', icon: '💬', label: 'QUOTE' },
};

export const Callout: React.FC<{
    type: CalloutType;
    title: string;
    body: string;
    style?: React.CSSProperties;
}> = ({ type, title, body, style }) => {
    const frame = useCurrentFrame();
    const anim = spring({ frame, fps: 30 });
    const s = CALLOUT_STYLES[type];

    return (
        <div style={{
            width: 1200,
            backgroundColor: s.bg,
            borderLeft: `8px solid ${s.border}`,
            borderRadius: '0 20px 20px 0',
            padding: '40px 50px',
            transform: `translateX(${interpolate(anim, [0, 1], [-200, 0])}px)`,
            opacity: anim,
            boxShadow: `0 20px 60px rgba(0,0,0,0.3)`,
            ...style,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 15 }}>
                <span style={{ fontSize: 40 }}>{s.icon}</span>
                <span style={{ fontSize: 22, fontWeight: 900, color: s.border, letterSpacing: 3, fontFamily: FONT_STACK.body }}>{s.label}</span>
            </div>
            <div style={{ fontSize: 42, fontWeight: 800, color: 'white', fontFamily: FONT_STACK.body, marginBottom: 10 }}>{title}</div>
            <div style={{ fontSize: 28, fontWeight: 500, color: 'rgba(255,255,255,0.75)', fontFamily: FONT_STACK.body, lineHeight: 1.5 }}>{body}</div>
        </div>
    );
};

export const CalloutScene: React.FC<{
    type: CalloutType;
    title: string;
    body: string;
    bgColor: string;
}> = ({ type, title, body, bgColor }) => (
    <div style={{ position: 'absolute', inset: 0, backgroundColor: bgColor, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Callout type={type} title={title} body={body} />
    </div>
);

// ─── SVG STICK FIGURES WITH EMOTIONS ─────────────────────────

type Emotion = 'happy' | 'sad' | 'surprised' | 'thinking' | 'excited' | 'confused' | 'angry' | 'celebrating';

const emotionFaces: Record<Emotion, (cx: number, cy: number) => React.ReactNode> = {
    happy: (cx, cy) => (
        <>
            <circle cx={cx - 8} cy={cy - 5} r={3} fill="white" />
            <circle cx={cx + 8} cy={cy - 5} r={3} fill="white" />
            <path d={`M ${cx - 10} ${cy + 5} Q ${cx} ${cy + 18} ${cx + 10} ${cy + 5}`} stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
    ),
    sad: (cx, cy) => (
        <>
            <circle cx={cx - 8} cy={cy - 5} r={3} fill="white" />
            <circle cx={cx + 8} cy={cy - 5} r={3} fill="white" />
            <path d={`M ${cx - 10} ${cy + 12} Q ${cx} ${cy} ${cx + 10} ${cy + 12}`} stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
    ),
    surprised: (cx, cy) => (
        <>
            <circle cx={cx - 8} cy={cy - 5} r={4} fill="white" />
            <circle cx={cx + 8} cy={cy - 5} r={4} fill="white" />
            <ellipse cx={cx} cy={cy + 10} rx={5} ry={7} stroke="white" strokeWidth="2.5" fill="none" />
        </>
    ),
    thinking: (cx, cy) => (
        <>
            <circle cx={cx - 8} cy={cy - 5} r={3} fill="white" />
            <circle cx={cx + 8} cy={cy - 3} r={3} fill="white" />
            <line x1={cx - 8} y1={cy + 10} x2={cx + 8} y2={cy + 8} stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </>
    ),
    excited: (cx, cy) => (
        <>
            <line x1={cx - 11} y1={cy - 8} x2={cx - 5} y2={cy - 2} stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <line x1={cx - 5} y1={cy - 8} x2={cx - 11} y2={cy - 2} stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <line x1={cx + 5} y1={cy - 8} x2={cx + 11} y2={cy - 2} stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <line x1={cx + 11} y1={cy - 8} x2={cx + 5} y2={cy - 2} stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <path d={`M ${cx - 12} ${cy + 5} Q ${cx} ${cy + 20} ${cx + 12} ${cy + 5}`} stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
    ),
    confused: (cx, cy) => (
        <>
            <circle cx={cx - 8} cy={cy - 5} r={3} fill="white" />
            <circle cx={cx + 8} cy={cy - 3} r={4} fill="white" />
            <path d={`M ${cx - 8} ${cy + 10} Q ${cx} ${cy + 6} ${cx + 8} ${cy + 12}`} stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
    ),
    angry: (cx, cy) => (
        <>
            <line x1={cx - 12} y1={cy - 10} x2={cx - 4} y2={cy - 4} stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <line x1={cx + 4} y1={cy - 4} x2={cx + 12} y2={cy - 10} stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={cx - 8} cy={cy - 2} r={3} fill="white" />
            <circle cx={cx + 8} cy={cy - 2} r={3} fill="white" />
            <path d={`M ${cx - 10} ${cy + 12} Q ${cx} ${cy + 4} ${cx + 10} ${cy + 12}`} stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
    ),
    celebrating: (cx, cy) => (
        <>
            <circle cx={cx - 8} cy={cy - 5} r={3} fill="white" />
            <circle cx={cx + 8} cy={cy - 5} r={3} fill="white" />
            <path d={`M ${cx - 12} ${cy + 4} Q ${cx} ${cy + 20} ${cx + 12} ${cy + 4}`} stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
    ),
};

// Arm poses per emotion
const getArmPose = (emotion: Emotion, frame: number): { leftArm: string; rightArm: string } => {
    const wave = Math.sin(frame / 8) * 5;
    switch (emotion) {
        case 'happy': return { leftArm: 'M 50 85 L 25 75', rightArm: 'M 50 85 L 75 75' };
        case 'sad': return { leftArm: 'M 50 85 L 30 105', rightArm: 'M 50 85 L 70 105' };
        case 'surprised': return { leftArm: `M 50 85 L 20 ${65 + wave}`, rightArm: `M 50 85 L 80 ${65 + wave}` };
        case 'thinking': return { leftArm: 'M 50 85 L 42 55', rightArm: 'M 50 85 L 75 95' };
        case 'excited': return { leftArm: `M 50 85 L 15 ${50 + wave}`, rightArm: `M 50 85 L 85 ${50 + wave}` };
        case 'confused': return { leftArm: 'M 50 85 L 25 80', rightArm: `M 50 85 L 80 ${70 + wave}` };
        case 'angry': return { leftArm: 'M 50 85 L 20 70', rightArm: 'M 50 85 L 80 70' };
        case 'celebrating': return { leftArm: `M 50 85 L 15 ${45 + wave}`, rightArm: `M 50 85 L 85 ${45 + wave}` };
        default: return { leftArm: 'M 50 85 L 25 100', rightArm: 'M 50 85 L 75 100' };
    }
};

export const StickFigure: React.FC<{
    emotion: Emotion;
    color?: string;
    size?: number;
    label?: string;
}> = ({ emotion, color = '#FFFFFF', size = 200, label }) => {
    const frame = useCurrentFrame();
    const anim = spring({ frame, fps: 30 });
    const bounce = Math.sin(frame / 10) * 3;
    const arms = getArmPose(emotion, frame);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${anim})`, opacity: anim }}>
            <svg width={size} height={size * 1.2} viewBox="0 0 100 130" fill="none" style={{ transform: `translateY(${bounce}px)` }}>
                {/* Head */}
                <circle cx="50" cy="30" r="22" stroke={color} strokeWidth="3" fill="none" />
                {/* Face */}
                {emotionFaces[emotion](50, 30)}
                {/* Body */}
                <line x1="50" y1="52" x2="50" y2="95" stroke={color} strokeWidth="3" strokeLinecap="round" />
                {/* Arms */}
                <path d={arms.leftArm} stroke={color} strokeWidth="3" strokeLinecap="round" />
                <path d={arms.rightArm} stroke={color} strokeWidth="3" strokeLinecap="round" />
                {/* Legs */}
                <line x1="50" y1="95" x2="30" y2="125" stroke={color} strokeWidth="3" strokeLinecap="round" />
                <line x1="50" y1="95" x2="70" y2="125" stroke={color} strokeWidth="3" strokeLinecap="round" />
                {/* Celebration particles */}
                {(emotion === 'celebrating' || emotion === 'excited') && (
                    <>
                        <circle cx={15 + Math.sin(frame / 5) * 5} cy={20 + Math.cos(frame / 7) * 5} r={3} fill="#FBBF24" opacity={0.8} />
                        <circle cx={85 + Math.cos(frame / 5) * 5} cy={25 + Math.sin(frame / 6) * 5} r={3} fill="#EC4899" opacity={0.8} />
                        <circle cx={50 + Math.sin(frame / 4) * 10} cy={5 + Math.cos(frame / 8) * 5} r={2.5} fill="#10B981" opacity={0.8} />
                    </>
                )}
            </svg>
            {label && <div style={{ fontSize: 24, fontWeight: 800, color, marginTop: 10, fontFamily: FONT_STACK.body, textAlign: 'center' }}>{label}</div>}
        </div>
    );
};

export const StickFigureScene: React.FC<{
    figures: { emotion: Emotion; label?: string; color?: string }[];
    bgColor: string;
    title?: string;
}> = ({ figures, bgColor, title }) => {
    const frame = useCurrentFrame();
    const titleAnim = spring({ frame, fps: 30 });
    return (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: bgColor, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 40 }}>
            {title && <div style={{
                fontSize: 80, fontFamily: FONT_STACK.display, fontWeight: 900, color: 'white',
                textShadow: '8px 8px 0 rgba(0,0,0,0.2)',
                transform: `scale(${interpolate(titleAnim, [0, 1], [0.5, 1])})`, opacity: titleAnim
            }}>{title}</div>}
            <div style={{ display: 'flex', gap: 80, alignItems: 'flex-end' }}>
                {figures.map((fig, i) => (
                    <StickFigure key={i} emotion={fig.emotion} label={fig.label} color={fig.color || 'white'} size={180} />
                ))}
            </div>
        </div>
    );
};
