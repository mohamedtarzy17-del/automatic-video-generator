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
    Video,
} from 'remotion';
import { FONT_IMPORT } from './components/PremiumKit';

const DYNAMIC_FONTS = (
    <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Teko:wght@600;700&family=Oswald:wght@600;700&family=Bebas+Neue&family=Fjalla+One&family=Roboto+Mono:wght@700&display=swap');
        `}
    </style>
);

// --- DATA & TIMING ---
const SCENE_CHANGE_FRAMES = 36; // 1.2s at 30fps rule

const CHAPTERS = [
    { title: "THE MOUNTAIN", start: 0, end: 840, color: "#0A192F" }, // 0 - 28s
    { title: "THE ACCELERATION", start: 840, end: 1680, color: "#111" }, // 28 - 56s
    { title: "THE INTEREST TRAP", start: 1680, end: 2520, color: "#B22222" }, // 56 - 84s
    { title: "DEBT TO GDP", start: 2520, end: 3360, color: "#0A192F" },
    { title: "CROWDING OUT", start: 3360, end: 4200, color: "#222" },
    { title: "HISTORY OF DEBT", start: 4200, end: 5040, color: "#000" },
    { title: "THE HOLDERS", start: 5040, end: 5880, color: "#1B2A4E" },
    { title: "INFLATION SHADOW", start: 5880, end: 6720, color: "#8B0000" },
    { title: "THE 2036 CLIFF", start: 6720, end: 7560, color: "#000" },
    { title: "THE FINAL CHOICE", start: 7560, end: 8366, color: "#0A192F" },
];



const Broll: React.FC<{ src: string }> = ({ src }) => {
    return (
        <AbsoluteFill>
            <Video
                src={staticFile(src)}
                muted
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.6) contrast(1.1) grayscale(0.2)',
                }}
            />
        </AbsoluteFill>
    );
};

const KineticWord: React.FC<{ word: string; index: number; fontFamily?: string }> = ({ word, index, fontFamily }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const spr = spring({
        frame: frame - (index * 2),
        fps,
        config: { damping: 10, stiffness: 100 }
    });

    return (
        <span style={{
            display: 'inline-block',
            fontFamily: fontFamily || 'Anton, sans-serif',
            fontSize: 120,
            color: 'white',
            textTransform: 'uppercase',
            marginRight: 25,
            transform: `translateY(${interpolate(spr, [0, 1], [50, 0])}px) scale(${interpolate(spr, [0, 1], [0.8, 1])})`,
            opacity: spr,
            textShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}>
            {word}
        </span>
    );
};

const BigText: React.FC<{ text: string }> = ({ text }) => {
    const fonts = ['Anton', '"Bebas Neue"', '"Fjalla One"', '"Oswald"', '"Teko"'];
    const frame = useCurrentFrame();

    // Choose font dynamically based on which chapter we are in (frame / 840) to keep it consistent within the chapter but varied across
    const chIndex = Math.floor(frame / 840);
    const selectedFont = fonts[chIndex % fonts.length];
    const words = text.split(' ');

    return (
        <div style={{
            padding: 100,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
        }}>
            {words.map((w, i) => <KineticWord key={i} word={w} index={i} fontFamily={selectedFont} />)}
        </div>
    );
};

const DebtClock: React.FC<{ startVal: number; rate: number }> = ({ startVal, rate }) => {
    const frame = useCurrentFrame();
    const current = startVal + (frame * rate);

    const fonts = ['"Space Mono", monospace', '"Roboto Mono", monospace'];
    const selectedFont = fonts[Math.floor(frame / 840) % fonts.length];

    return (
        <div style={{
            fontFamily: selectedFont,
            fontSize: 140,
            color: '#FFD700',
            fontWeight: 700,
            textAlign: 'center',
            textShadow: `0 0 40px rgba(255, 215, 0, 0.4)`,
        }}>
            ${current.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </div>
    );
};

const PieChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
    const frame = useCurrentFrame();
    const anim = spring({ frame, fps: 30, config: { damping: 12 } });

    let currentAngle = 0;
    return (
        <svg width="600" height="600" viewBox="0 0 100 100">
            {data.map((d, i) => {
                const angle = (d.value / 100) * 360 * anim;
                const path = `M 50 50 L ${50 + 40 * Math.cos(currentAngle * Math.PI / 180)} ${50 + 40 * Math.sin(currentAngle * Math.PI / 180)} A 40 40 0 ${angle > 180 ? 1 : 0} 1 ${50 + 40 * Math.cos((currentAngle + angle) * Math.PI / 180)} ${50 + 40 * Math.sin((currentAngle + angle) * Math.PI / 180)} Z`;
                currentAngle += angle;
                return <path key={i} d={path} fill={d.color} stroke="#000" strokeWidth="0.5" />;
            })}
            <circle cx="50" cy="50" r="20" fill="#0A192F" />
        </svg>
    );
};

const DataCard: React.FC<{ label: string; value: string; color: string; index: number }> = ({ label, value, color, index }) => {
    const frame = useCurrentFrame();
    const spr = spring({ frame: frame - (index * 10), fps: 30 });

    const fonts = ['Anton', '"Bebas Neue"', '"Oswald"', '"Fjalla One"'];
    const titleFonts = ['Inter', '"Oswald"'];
    const chIndex = Math.floor(frame / 840);
    const numFont = fonts[chIndex % fonts.length];
    const lblFont = titleFonts[chIndex % titleFonts.length];

    return (
        <div style={{
            background: 'rgba(15, 25, 45, 0.95)',
            borderLeft: `12px solid ${color}`,
            padding: '40px',
            borderRadius: '12px',
            minWidth: 400,
            transform: `scale(${interpolate(spr, [0, 1], [0.8, 1])}) translateX(${interpolate(spr, [0, 1], [100, 0])}px)`,
            opacity: spr,
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 28, textTransform: 'uppercase', letterSpacing: 4, marginBottom: 15, fontFamily: lblFont }}>{label}</div>
            <div style={{ color: 'white', fontSize: 80, fontWeight: 900, fontFamily: numFont }}>{value}</div>
        </div>
    );
};

// --- MAIN ENGINE ---

export const USDebtPro: React.FC = () => {
    const frame = useCurrentFrame();

    // SFX Logic: Playwhoosh every scene change (every 1.2s approximately if desired, but let's do it on major chapters)
    // For 1.2s rule, we'll swap the layout every 36 frames.

    const layoutIndex = Math.floor(frame / SCENE_CHANGE_FRAMES);

    return (
        <AbsoluteFill style={{ backgroundColor: '#050505' }}>
            {FONT_IMPORT}
            {DYNAMIC_FONTS}

            {/* Audio Layers */}
            <Audio src={staticFile('debt.wav')} />
            <Audio
                src={staticFile('sfx/ambient.mp3')}
                volume={interpolate(frame, [8000, 8366], [0.048, 0])}
                loop
            />

            {/* Background B-roll Transitions - Hard cuts to absolutely eliminate any crossfade/black strobe flashing */}
            {CHAPTERS.map((ch, i) => {
                const start = ch.start;
                const end = ch.end;
                const bgIdx = (i % 10) + 1;
                return (
                    <Sequence key={`bg-${i}`} from={start} durationInFrames={end - start}>
                        <Broll src={`debt_bg_${bgIdx}.mp4`} />
                    </Sequence>
                );
            })}

            {/* Color Overlays Per Chapter - Static gradients for maximum GPU stability without redraw jitter */}
            {CHAPTERS.map((ch, i) => {
                return (
                    <Sequence key={`overlay-${i}`} from={ch.start} durationInFrames={ch.end - ch.start}>
                        <AbsoluteFill style={{ background: `linear-gradient(135deg, ${ch.color}E6, transparent)` }} />
                    </Sequence>
                );
            })}

            {/* Render distinct data visualizers for each chapter to avoid repetition */}
            <AbsoluteFill>
                {(() => {
                    const chIndex = Math.min(Math.floor(frame / 840), 9);
                    const chFrame = frame - CHAPTERS[chIndex].start;

                    switch (chIndex) {
                        case 0: // Mountain
                            return (
                                <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <BigText text="THE INVISIBLE MOUNTAIN" />
                                    {chFrame > 90 && <div style={{ marginTop: 50 }}><DebtClock startVal={38860000000000} rate={115740 / 30} /></div>}
                                </AbsoluteFill>
                            );
                        case 1: // Acceleration
                            return (
                                <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 40 }}>
                                    {chFrame > 20 && <DataCard index={0} label="ACCRUAL RATE" value="$1T / 100 DAYS" color="#FF3366" />}
                                    {chFrame > 140 && <DataCard index={1} label="2026 TARGET" value="$39 TRILLION" color="#FFD700" />}
                                </AbsoluteFill>
                            );
                        case 2: // Interest Trap
                            return (
                                <AbsoluteFill style={{ display: 'flex', padding: 80, alignItems: 'center' }}>
                                    <div style={{ flex: 1 }}><BigText text="THE INTEREST BLACK HOLE" /></div>
                                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                        {chFrame > 80 && <DataCard index={0} label="ANNUAL EXPENSE" value="$1.0 TRILLION" color="#B22222" />}
                                    </div>
                                </AbsoluteFill>
                            );
                        case 3: // GDP
                            return (
                                <AbsoluteFill style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 100 }}>
                                    <PieChart data={[{ label: 'Debt', value: 122, color: '#FFD700' }, { label: 'GDP', value: 100, color: 'rgba(255,255,255,0.1)' }]} />
                                    <div style={{ color: 'white', fontSize: 130, fontFamily: 'Anton', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>122%<br />DEBT/GDP</div>
                                </AbsoluteFill>
                            );
                        case 4: // Crowding out
                            return (
                                <AbsoluteFill style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <BigText text="STEALING FROM TOMORROW" />
                                </AbsoluteFill>
                            );
                        case 5: // History
                            return (
                                <AbsoluteFill style={{ display: 'flex', padding: 120, alignItems: 'center' }}>
                                    <DataCard index={0} label="THE CHEAP MONEY ERA" value="IS OVER" color="#EF4444" />
                                </AbsoluteFill>
                            );
                        case 6: // Holders
                            return (
                                <AbsoluteFill style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 120 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ color: 'white', fontSize: 40, marginBottom: 20, fontFamily: 'Space Mono' }}>FOREIGN VS DOMESTIC</div>
                                        <PieChart data={[{ label: 'Public', value: 75, color: '#FFD700' }, { label: 'Intragov', value: 25, color: '#FF3366' }]} />
                                    </div>
                                    <BigText text="WHO HOLDS THE CHECK?" />
                                </AbsoluteFill>
                            );
                        case 7: // Inflation
                            return (
                                <AbsoluteFill style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <div style={{ color: '#FF4500', fontSize: 130, fontWeight: 900, fontFamily: 'Anton', textShadow: '0 0 50px red' }}>THE INFLATION SHADOW</div>
                                </AbsoluteFill>
                            );
                        case 8: // 2036
                            return (
                                <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 50 }}>
                                    <BigText text="THE 2036 CRITICAL POINT" />
                                    {chFrame > 100 && <DataCard index={0} label="PROJECTED INTEREST" value="$2 TRILLION" color="#B22222" />}
                                </AbsoluteFill>
                            );
                        case 9: // Choice
                            return (
                                <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <BigText text="THE CLOCK IS STILL TICKING" />
                                    <div style={{ marginTop: 60 }}>
                                        <DebtClock startVal={38950000000000} rate={250000 / 30} />
                                    </div>
                                </AbsoluteFill>
                            );
                        default:
                            return null;
                    }
                })()}
            </AbsoluteFill>

            {/* SFX Triggers (reduced frequency to match longer visual blocks) */}
            {layoutIndex > 0 && frame % 105 === 0 && (
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.15} />
            )}

            {/* Post Process */}
            <AbsoluteFill style={{
                boxShadow: 'inset 0 0 400px rgba(0,0,0,0.9)',
                pointerEvents: 'none',
                background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.5) 100%)'
            }} />
        </AbsoluteFill>
    );
};
