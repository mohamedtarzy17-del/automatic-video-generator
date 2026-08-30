import React from 'react';
import {
    AbsoluteFill,
    useCurrentFrame,
    interpolate,
    spring,
    Audio,
    staticFile,
    Sequence,
} from 'remotion';

const THEME = {
    pink: '#FF007A',
    blue: '#0070FF',
    yellow: '#FFE600',
    green: '#00FF66',
    white: '#FFFFFF',
    black: '#000000',
    red: '#FF3B30',
};

const FONTS = {
    bold: "'Inter', sans-serif",
    display: "'Bebas Neue', cursive",
};

// Audio durations in frames (at 30fps)
// v2_1: 11.935s = 358 frames
// v2_2: 11.935s = 358 frames
// v2_3: 11.993s = 360 frames
// v2_4: 11.831s = 355 frames
// Total: 90 (intro) + 358 + 358 + 360 + 355 = 1521 frames (~50.7s)

const CH1_FRAMES = 358;
const CH2_FRAMES = 358;
const CH3_FRAMES = 360;
const CH4_FRAMES = 355;
const INTRO_FRAMES = 90;

const CH1_START = INTRO_FRAMES;                    // 90
const CH2_START = CH1_START + CH1_FRAMES;           // 448
const CH3_START = CH2_START + CH2_FRAMES;           // 806
const CH4_START = CH3_START + CH3_FRAMES;           // 1166
const TOTAL_FRAMES = CH4_START + CH4_FRAMES;        // 1521

// Layout Helper for consistent centering
const Centered: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', ...style }}>
        {children}
    </AbsoluteFill>
);

const HugeText: React.FC<{ text: string; color?: string; bgColor?: string; subtext?: string }> = ({ text, color = 'white', bgColor, subtext }) => {
    const frame = useCurrentFrame();
    const anim = spring({ frame, fps: 30, config: { damping: 12 } });

    return (
        <Centered style={{ backgroundColor: bgColor }}>
            <div style={{
                fontSize: 260,
                fontWeight: 900,
                fontFamily: FONTS.display,
                color,
                textAlign: 'center',
                lineHeight: 0.8,
                transform: `scale(${interpolate(anim, [0, 1], [0.5, 1])}) rotate(${interpolate(anim, [0, 1], [-10, 0])}deg)`,
                opacity: anim,
                textShadow: '15px 15px 0px rgba(0,0,0,0.2)'
            }}>
                {text}
            </div>
            {subtext && (
                <div style={{
                    position: 'absolute',
                    bottom: '15%',
                    fontSize: 60,
                    fontWeight: 900,
                    fontFamily: FONTS.bold,
                    color: 'white',
                    backgroundColor: 'black',
                    padding: '10px 30px',
                    transform: `translateY(${interpolate(anim, [0, 1], [50, 0])}px)`,
                    opacity: anim
                }}>
                    {subtext}
                </div>
            )}
        </Centered>
    );
};

const SplitComparison: React.FC<{ leftText: string; rightText: string; leftVal: string; rightVal: string; leftColor: string; rightColor: string }> = ({
    leftText, rightText, leftVal, rightVal, leftColor, rightColor
}) => {
    const frame = useCurrentFrame();
    const slide = spring({ frame, fps: 30 });

    return (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{
                flex: interpolate(slide, [0, 1], [0, 1]),
                backgroundColor: leftColor,
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                borderRight: '10px solid black',
                overflow: 'hidden'
            }}>
                <div style={{ fontSize: 60, fontFamily: FONTS.bold, fontWeight: 900, marginBottom: 20 }}>{leftText}</div>
                <div style={{ fontSize: 200, fontFamily: FONTS.display, fontWeight: 900 }}>{leftVal}</div>
            </div>
            <div style={{
                flex: interpolate(slide, [0, 1], [0, 1]),
                backgroundColor: rightColor,
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                overflow: 'hidden'
            }}>
                <div style={{ fontSize: 60, fontFamily: FONTS.bold, fontWeight: 900, marginBottom: 20 }}>{rightText}</div>
                <div style={{ fontSize: 200, fontFamily: FONTS.display, fontWeight: 900 }}>{rightVal}</div>
            </div>
        </AbsoluteFill>
    );
};

const MoneyBurst: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <Centered style={{ backgroundColor: THEME.green }}>
            <div style={{ fontSize: 300, transform: `scale(${interpolate(frame, [0, 20], [0, 1.5], { extrapolateRight: 'clamp' })})` }}>💰</div>
            <div style={{ fontSize: 150, fontFamily: FONTS.display, fontWeight: 900, marginTop: 40, color: 'black' }}>CASH IS KING</div>
        </Centered>
    );
};

const FloatingIcons: React.FC<{ icons: string[]; bgColor: string }> = ({ icons, bgColor }) => {
    const frame = useCurrentFrame();
    return (
        <Centered style={{ backgroundColor: bgColor }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 80 }}>
                {icons.map((icon, i) => (
                    <div key={i} style={{
                        fontSize: 200,
                        transform: `scale(${spring({ frame: frame - i * 5, fps: 30 })}) translateY(${Math.sin(frame / 10 + i) * 20}px)`
                    }}>
                        {icon}
                    </div>
                ))}
            </div>
        </Centered>
    );
};

const GrowthChart: React.FC<{ color: string; bgColor: string; label: string }> = ({ color, bgColor, label }) => {
    const frame = useCurrentFrame();
    return (
        <Centered style={{ backgroundColor: bgColor }}>
            <div style={{ width: '80%', height: '60%', borderLeft: '15px solid black', borderBottom: '15px solid black', position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 40, padding: '0 40px' }}>
                {[...Array(6)].map((_, i) => (
                    <div key={i} style={{
                        flex: 1,
                        backgroundColor: color,
                        height: `${10 + i * 15 * spring({ frame: frame - i * 4, fps: 30 })}%`,
                        border: '8px solid black',
                        boxShadow: '15px -15px 0px rgba(0,0,0,0.1)'
                    }} />
                ))}
                <div style={{ position: 'absolute', top: '-80px', right: 0, fontSize: 110, fontWeight: 900, fontFamily: FONTS.display, color: 'black' }}>{label}</div>
            </div>
        </Centered>
    );
};

const DecayVisual: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <Centered style={{ backgroundColor: '#1a1a1a' }}>
            <div style={{ fontSize: 400, transform: `scale(${1 + frame / 200}) rotate(${Math.sin(frame / 20) * 5}deg)` }}>🌉</div>
            <div style={{
                fontSize: 120,
                fontWeight: 900,
                fontFamily: FONTS.display,
                color: THEME.pink,
                border: '15px solid white',
                padding: '10px 40px',
                transform: `skewX(-10deg)`,
                backgroundColor: 'black'
            }}>SYSTEM FAILURE</div>
        </Centered>
    );
};

export const NoTaxesWorld: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#000', fontFamily: 'Inter' }}>
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;900&family=Bebas+Neue&display=swap');`}
            </style>

            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.05} />

            {/* ===== INTRO (0 to 90) ===== */}
            <Sequence durationInFrames={INTRO_FRAMES}>
                <HugeText text="WORLD WITHOUT TAXES" bgColor={THEME.pink} />
                <Audio src={staticFile("sfx/rise.mp3")} volume={0.5} />
            </Sequence>

            {/* ===== CH 1: PROSPERITY (90 to 448) — 358 frames ===== */}
            <Sequence from={CH1_START} durationInFrames={CH1_FRAMES}>
                <Sequence durationInFrames={90}>
                    <HugeText text="+30% PAY RAISE" bgColor={THEME.blue} />
                </Sequence>
                <Sequence from={90} durationInFrames={90}>
                    <SplitComparison
                        leftText="EXISTING" rightText="ZERO TAX"
                        leftVal="$7,000" rightVal="$10,000"
                        leftColor="#eee" rightColor={THEME.green}
                    />
                    <Audio src={staticFile("sfx/pop.mp3")} />
                </Sequence>
                <Sequence from={180} durationInFrames={90}>
                    <MoneyBurst />
                    <Audio src={staticFile("sfx/whoosh.mp3")} />
                </Sequence>
                <Sequence from={270} durationInFrames={88}>
                    <FloatingIcons icons={['🏎️', '🏡', '💎', '⌚', '🚁', '🏝️']} bgColor={THEME.yellow} />
                </Sequence>
                <Audio src={staticFile("notax_v2_1.wav")} />
            </Sequence>

            {/* ===== CH 2: INNOVATION (448 to 806) — 358 frames ===== */}
            <Sequence from={CH2_START} durationInFrames={CH2_FRAMES}>
                <Sequence durationInFrames={90}>
                    <HugeText text="R&D EXPLOSION" bgColor={THEME.yellow} color="black" />
                    <Audio src={staticFile("sfx/typing.mp3")} />
                </Sequence>
                <Sequence from={90} durationInFrames={90}>
                    <GrowthChart color={THEME.blue} bgColor={THEME.white} label="INNOVATION" />
                </Sequence>
                <Sequence from={180} durationInFrames={90}>
                    <HugeText text="MARS 2028?" bgColor={THEME.pink} subtext="IT'S POSSIBLE" />
                    <Audio src={staticFile("sfx/rise.mp3")} volume={0.3} />
                </Sequence>
                <Sequence from={270} durationInFrames={88}>
                    <FloatingIcons icons={['🚀', '💉', '🛰️', '🤖', '⚛️', '🧬']} bgColor={THEME.green} />
                    <Audio src={staticFile("sfx/pop 2.mp3")} />
                </Sequence>
                <Audio src={staticFile("notax_v2_2.wav")} />
            </Sequence>

            {/* ===== CH 3: DECAY (806 to 1166) — 360 frames ===== */}
            <Sequence from={CH3_START} durationInFrames={CH3_FRAMES}>
                <Sequence durationInFrames={90}>
                    <HugeText text="THE CRACKS SHOW" bgColor={THEME.black} color={THEME.yellow} />
                    <Audio src={staticFile("sfx/whoosh.mp3")} />
                </Sequence>
                <Sequence from={90} durationInFrames={90}>
                    <DecayVisual />
                </Sequence>
                <Sequence from={180} durationInFrames={90}>
                    <HugeText text="WHO PAYS?" bgColor={THEME.pink} />
                    <Audio src={staticFile("sfx/clock.mp3")} />
                </Sequence>
                <Sequence from={270} durationInFrames={90}>
                    <HugeText text="DECAY" bgColor={THEME.black} color={THEME.white} subtext="SYSTEM OFFLINE" />
                </Sequence>
                <Audio src={staticFile("notax_v2_3.wav")} />
            </Sequence>

            {/* ===== CH 4: SAFETY (1166 to 1521) — 355 frames ===== */}
            <Sequence from={CH4_START} durationInFrames={CH4_FRAMES}>
                <Sequence durationInFrames={90}>
                    <HugeText text="SAFETY FOR SALE" bgColor={THEME.blue} />
                    <Audio src={staticFile("sfx/rise.mp3")} />
                </Sequence>
                <Sequence from={90} durationInFrames={90}>
                    <SplitComparison
                        leftText="PUBLIC" rightText="PRIVATE"
                        leftVal="POLICE ❌" rightVal="MERCENARY ✅"
                        leftColor="#000" rightColor={THEME.yellow}
                    />
                </Sequence>
                <Sequence from={180} durationInFrames={85}>
                    <HugeText text="TOTAL CHAOS?" bgColor={THEME.red} subtext="OR FREEDOM?" />
                    <Audio src={staticFile("sfx/whoosh.mp3")} />
                </Sequence>
                <Sequence from={265} durationInFrames={90}>
                    <HugeText text="THE CHOICE IS YOURS" bgColor={THEME.pink} />
                </Sequence>
                <Audio src={staticFile("notax_v2_4.wav")} />
            </Sequence>
        </AbsoluteFill>
    );
};
