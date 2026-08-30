import React from 'react';
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
    Audio,
    staticFile,
    Series,
    Easing
} from 'remotion';

const THEME = {
    bg: '#0F172A',
    accent: '#00FFCC',
    punch: '#FFD700',
    danger: '#FF3366',
    white: '#FFFFFF',
    crypto: '#8A2BE2',
    heart: '#FF69B4'
};

const FontStyles: React.FC = () => (
    <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;400;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&display=swap');
        `}
    </style>
);

// --- Components ---

const PunchHero: React.FC<{
    scale?: number,
    withPlush?: boolean,
    isSad?: boolean,
    color?: string
}> = ({ scale = 1, withPlush = true, isSad = false, color = THEME.white }) => {
    const frame = useCurrentFrame();
    const bob = Math.sin(frame / 10) * 5;

    return (
        <g transform={`scale(${scale})`}>
            {/* The Baby Monkey (Silhouette) */}
            <circle cx="0" cy={-20 + bob} r="25" fill={color} />
            <ellipse cx="0" cy={35 + bob} rx="20" ry="30" fill={color} />
            {/* Arms hugging */}
            <path
                d={isSad ? "M-15 20 Q-30 40 -10 60" : "M-15 20 Q-35 30 15 30"}
                stroke={color}
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
            />

            {/* The Plush Toy */}
            {withPlush && (
                <g transform={`translate(20, ${30 + bob}) rotate(15)`}>
                    <circle cx="0" cy="0" r="15" fill={THEME.accent} />
                    <circle cx="-5" cy="-20" r="12" fill={THEME.accent} />
                    {/* Glow effect */}
                    <circle cx="-5" cy="-20" r="25" fill={THEME.accent} opacity="0.2" />
                </g>
            )}
        </g>
    );
};

const Header: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 20], [0, 1]);

    return (
        <div style={{ position: 'absolute', top: 100, left: 100, zIndex: 100, opacity }}>
            <h1 style={{
                fontFamily: 'Outfit',
                fontSize: 100,
                color: THEME.white,
                fontWeight: 900,
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: -2,
                lineHeight: 0.9
            }}>
                {title}
            </h1>
            <div style={{
                background: THEME.accent,
                color: THEME.bg,
                padding: '8px 20px',
                borderRadius: 4,
                display: 'inline-block',
                fontFamily: 'JetBrains Mono',
                fontSize: 24,
                fontWeight: '900',
                marginTop: 10
            }}>
                {`> ${subtitle}_`}
            </div>
        </div>
    );
};

const DataNode: React.FC<{ x: number, y: number, label: string, value: string }> = ({ x, y, label, value }) => (
    <div style={{
        position: 'absolute',
        left: x,
        top: y,
        borderLeft: `2px solid ${THEME.accent}`,
        paddingLeft: 10,
        fontFamily: 'JetBrains Mono',
        color: THEME.white
    }}>
        <div style={{ fontSize: 12, opacity: 0.6 }}>{label}</div>
        <div style={{ fontSize: 20, color: THEME.accent }}>{value}</div>
    </div>
);

// --- Scenes ---

const Scene1_Intro: React.FC = () => (
    <AbsoluteFill style={{ backgroundColor: THEME.bg }}>
        <Header title="THE PUNCH" subtitle="VILLAGE_REJECT" />
        <svg width="100%" height="100%" viewBox="0 0 1920 1080">
            <g transform="translate(960, 600)">
                <PunchHero scale={4} withPlush={false} isSad={true} color={THEME.white} />
            </g>
        </svg>
    </AbsoluteFill>
);

const Scene2_TheToy: React.FC = () => (
    <AbsoluteFill style={{ backgroundColor: THEME.bg }}>
        <Header title="SURROGATE" subtitle="PLUSH_SYNC_01" />
        <svg width="100%" height="100%" viewBox="0 0 1920 1080">
            <g transform="translate(960, 600)">
                <PunchHero scale={5} withPlush={true} />
            </g>
        </svg>
    </AbsoluteFill>
);

const Scene3_Viral: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ backgroundColor: '#fff' }}>
            <Header title="GOING VIRAL" subtitle="GLOBAL_EMPATHY" />
            <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
                {Array(20).fill(0).map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        left: (i * 150) % 1920,
                        top: (i * 100) % 1080,
                        fontSize: 40 + Math.sin(frame / 10 + i) * 20,
                        opacity: 0.1
                    }}>
                        ❤️
                    </div>
                ))}
            </div>
            <svg width="100%" height="100%" viewBox="0 0 1920 1080">
                <g transform="translate(960, 600)">
                    <PunchHero scale={4} color={THEME.bg} />
                </g>
            </svg>
        </AbsoluteFill>
    );
};

const Scene4_Crypto: React.FC = () => {
    const frame = useCurrentFrame();
    const chart = Array(10).fill(0).map((_, i) => (
        <rect
            key={i}
            x={i * 60}
            y={500 - (i * 40 * Math.random())}
            width="40"
            height={i * 40 * Math.random() + 50}
            fill={THEME.crypto}
        />
    ));

    return (
        <AbsoluteFill style={{ backgroundColor: THEME.bg }}>
            <Header title="THE PUNCH COIN" subtitle="NARRATIVE_FINANCE" />
            <div style={{ padding: 100, display: 'flex', gap: 50, alignItems: 'flex-end', height: '60%' }}>
                <svg width="600" height="600">{chart}</svg>
            </div>
            <DataNode x={1200} y={300} label="MARKET_CAP" value="$12.4M" />
            <DataNode x={1200} y={450} label="TRADING_VOL" value="HIGH" />
            <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: 'absolute' }}>
                <g transform="translate(1600, 800)">
                    <PunchHero scale={2} color={THEME.accent} />
                </g>
            </svg>
        </AbsoluteFill>
    );
};

const Scene5_Donation: React.FC = () => (
    <AbsoluteFill style={{ backgroundColor: THEME.accent }}>
        <Header title="$100,000" subtitle="JUSTIN_SUN_PLEDGE" />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: 200, color: THEME.bg, fontWeight: 900 }}>DONATED</h1>
                <p style={{ fontFamily: 'JetBrains Mono', fontSize: 40, color: THEME.bg }}>TO ICHIKAWA ZOO</p>
            </div>
        </div>
    </AbsoluteFill>
);

const Scene6_Outro: React.FC = () => (
    <AbsoluteFill style={{ backgroundColor: THEME.bg, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
            <h1 style={{ color: THEME.accent, fontSize: 80, fontWeight: 900 }}>STORY {'>'} PROFIT</h1>
            <p style={{ color: THEME.white, opacity: 0.6, fontSize: 30, maxWidth: 800, margin: '40px auto' }}>
                Punch found his mother in a toy. The internet found a fortune in his story.
                In 2026, empathy is the most valuable currency.
            </p>
            <svg width="200" height="200" viewBox="-100 -100 200 200">
                <PunchHero scale={1.5} />
            </svg>
        </div>
    </AbsoluteFill>
);

export const PunchStory: React.FC = () => {
    return (
        <Series>
            <Series.Sequence durationInFrames={450}><Scene1_Intro /></Series.Sequence>
            <Series.Sequence durationInFrames={450}><Scene2_TheToy /></Series.Sequence>
            <Series.Sequence durationInFrames={600}><Scene3_Viral /></Series.Sequence>
            <Series.Sequence durationInFrames={750}><Scene4_Crypto /></Series.Sequence>
            <Series.Sequence durationInFrames={600}><Scene5_Donation /></Series.Sequence>
            <Series.Sequence durationInFrames={750}><Scene6_Outro /></Series.Sequence>
        </Series>
    );
};
