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
import { FONT_IMPORT, Callout } from './components/PremiumKit';

// --- Configuration & Data ---
// --- Components ---

const DebtCounter: React.FC<{ startValue: number; speedPerSecond: number }> = ({ startValue, speedPerSecond }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const speedPerFrame = speedPerSecond / fps;
    const currentDebt = startValue + (frame * speedPerFrame);

    return (
        <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 120,
            color: '#FFD700',
            fontWeight: 700,
            textShadow: '0 0 30px rgba(255, 215, 0, 0.4)',
            letterSpacing: -2,
        }}>
            ${currentDebt.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </div>
    );
};

const BrollWrapper: React.FC<{ src: string; overlayColor: string }> = ({ src, overlayColor }) => {
    const frame = useCurrentFrame();
    const scale = interpolate(frame, [0, 900], [1, 1.15], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill>
            <Video
                src={staticFile(src)}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `scale(${scale})`,
                }}
                muted
            />
            {/* Dark Gradient Overlay */}
            <AbsoluteFill style={{
                background: `linear-gradient(to right, ${overlayColor}EE, ${overlayColor}77)`,
                mixBlendMode: 'multiply',
            }} />
            <AbsoluteFill style={{
                background: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.8) 120%)',
            }} />
        </AbsoluteFill>
    );
};

const KineticTypography: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const words = text.split(' ');

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            maxWidth: 1400,
            justifyContent: 'center',
        }}>
            {words.map((word, i) => {
                const wordSpr = spring({
                    frame: frame - delay - (i * 3),
                    fps,
                    config: { damping: 15, stiffness: 100 }
                });

                return (
                    <span key={i} style={{
                        fontFamily: 'Anton, sans-serif',
                        fontSize: 140,
                        color: 'white',
                        textTransform: 'uppercase',
                        transform: `translateY(${interpolate(wordSpr, [0, 1], [50, 0])}px)`,
                        opacity: wordSpr,
                        lineHeight: 0.9,
                    }}>
                        {word}
                    </span>
                );
            })}
        </div>
    );
};

const DataGrid: React.FC<{ stats: { label: string; value: string; color?: string }[] }> = ({ stats }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 40,
            width: 1000,
        }}>
            {stats.map((stat, i) => {
                const spr = spring({
                    frame: frame - (i * 10),
                    fps,
                    config: { damping: 12, stiffness: 100 }
                });

                return (
                    <div key={i} style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderLeft: `8px solid ${stat.color || '#FFD700'}`,
                        padding: '30px',
                        backdropFilter: 'blur(15px)',
                        borderRadius: '8px',
                        transform: `scale(${interpolate(spr, [0, 1], [0.8, 1])})`,
                        opacity: spr,
                    }}>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 24, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>{stat.label}</div>
                        <div style={{ color: 'white', fontSize: 64, fontWeight: 900, fontFamily: 'Anton' }}>{stat.value}</div>
                    </div>
                );
            })}
        </div>
    );
};

const NewsTicker: React.FC = () => {
    const frame = useCurrentFrame();
    const tickerText = " *** US NATIONAL DEBT SURGES PAST $38.9 TRILLION *** INTEREST PAYMENTS TO HIT $1T IN 2026 *** CBO WARNS OF 120% DEBT-TO-GDP RATIO BY 2036 *** PACING ADDS $1T EVERY 100 DAYS *** THE CHEAP MONEY ERA IS OFFICIALLY OVER *** ";

    return (
        <div style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: 60,
            background: 'rgba(178, 34, 34, 0.9)',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            borderTop: '2px solid gold',
            zIndex: 100,
        }}>
            <div style={{
                fontFamily: 'Space Mono',
                fontSize: 28,
                color: 'white',
                transform: `translateX(${1920 - (frame * 4) % 4000}px)`,
                fontWeight: 700,
                textTransform: 'uppercase',
            }}>
                {tickerText + tickerText}
            </div>
        </div>
    );
};

// --- Main Engine ---

export const USDebtDocumentary: React.FC = () => {

    // In a real scenario, we'd use useMemo and calculate these from measured durations
    // Total duration is roughly 30s * 10 = 300s (5 mins)

    return (
        <AbsoluteFill style={{ backgroundColor: '#050505' }}>
            {FONT_IMPORT}
            <Audio src={staticFile('sfx/ambient.mp3')} volume={0.05} loop />

            {/* Segment 1: Intro */}
            <Sequence from={0} durationInFrames={900}>
                <BrollWrapper src="debt_bg_1.mp4" overlayColor="#0A192F" />
                <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <KineticTypography text="THE INVISIBLE MOUNTAIN" />
                    <div style={{ marginTop: 60 }}>
                        <DebtCounter startValue={38860000000000} speedPerSecond={115740} />
                    </div>
                </AbsoluteFill>
                <Audio src={staticFile('debt_vo_1.wav')} />
            </Sequence>

            {/* Segment 2: The Pace */}
            <Sequence from={900} durationInFrames={900}>
                <BrollWrapper src="debt_bg_2.mp4" overlayColor="#111" />
                <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <KineticTypography text="EXPONENTIAL ACCELERATION" />
                    <div style={{ marginTop: 80 }}>
                        <DataGrid stats={[
                            { label: 'RATE OF INCREASE', value: '$1T / 100 DAYS', color: '#FF3366' },
                            { label: 'MARCH 2026 TARGET', value: '$39 TRILLION' }
                        ]} />
                    </div>
                </AbsoluteFill>
                <Audio src={staticFile('debt_vo_2.wav')} />
            </Sequence>

            {/* Segment 3: Interest Trap */}
            <Sequence from={1800} durationInFrames={900}>
                <BrollWrapper src="debt_bg_3.mp4" overlayColor="#B22222" />
                <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <KineticTypography text="THE INTEREST BLACK HOLE" />
                    <div style={{ marginTop: 80 }}>
                        <DataGrid stats={[
                            { label: 'ANNUAL PAYMENTS', value: '$1.0 TRILLION', color: '#FFD700' },
                            { label: 'SHARE OF SPENDING', value: '14%' }
                        ]} />
                    </div>
                </AbsoluteFill>
                <Audio src={staticFile('debt_vo_3.wav')} />
            </Sequence>

            {/* Segment 4: Economy */}
            <Sequence from={2700} durationInFrames={900}>
                <BrollWrapper src="debt_bg_4.mp4" overlayColor="#0A192F" />
                <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <KineticTypography text="SYSTEMIC FRAGILITY" />
                    <div style={{ marginTop: 80 }}>
                        <DataGrid stats={[
                            { label: 'DEBT TO GDP', value: '122%+', color: '#FFD700' },
                            { label: 'WARNING LEVEL', value: '100%' }
                        ]} />
                    </div>
                </AbsoluteFill>
                <Audio src={staticFile('debt_vo_4.wav')} />
            </Sequence>

            {/* Segment 5: Crowding Out */}
            <Sequence from={3600} durationInFrames={900}>
                <BrollWrapper src="debt_bg_5.mp4" overlayColor="#4B0082" />
                <AbsoluteFill style={{ padding: 100, justifyContent: 'center' }}>
                    <KineticTypography text="STEALING FROM TOMORROW" />
                    <div style={{ marginTop: 60, fontSize: 40, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter', maxWidth: 1000, alignSelf: 'center' }}>
                        "Every dollar spent on yesterday's debt is a dollar stolen from tomorrow's innovation."
                    </div>
                </AbsoluteFill>
                <Audio src={staticFile('debt_vo_5.wav')} />
            </Sequence>

            {/* Segment 6: History */}
            <Sequence from={4500} durationInFrames={900}>
                <BrollWrapper src="debt_bg_6.mp4" overlayColor="#2F4F4F" />
                <AbsoluteFill style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Callout
                        type="info"
                        title="THE CHEAP MONEY ERA"
                        body="Decades of low rates allowed for massive borrowing. But with interest at 3.3%, the game has changed."
                    />
                </AbsoluteFill>
                <Audio src={staticFile('debt_vo_6.wav')} />
            </Sequence>

            {/* Segment 7: Holders */}
            <Sequence from={5400} durationInFrames={900}>
                <BrollWrapper src="debt_bg_7.mp4" overlayColor="#8B0000" />
                <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <KineticTypography text="WHO HOLDS THE CHECK?" />
                    <div style={{ marginTop: 80 }}>
                        <DataGrid stats={[
                            { label: 'PUBLIC HOLDERS', value: '75%', color: '#FFD700' },
                            { label: 'FOREIGN GOVTS', value: '25%' }
                        ]} />
                    </div>
                </AbsoluteFill>
                <Audio src={staticFile('debt_vo_7.wav')} />
            </Sequence>

            {/* Segment 8: Inflation */}
            <Sequence from={6300} durationInFrames={900}>
                <BrollWrapper src="debt_bg_8.mp4" overlayColor="#FF4500" />
                <AbsoluteFill style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Callout
                        type="danger"
                        title="INFLATIONARY RISK"
                        body="Printing money to pay interest risks a permanent devaluation of the United States Dollar."
                    />
                </AbsoluteFill>
                <Audio src={staticFile('debt_vo_8.wav')} />
            </Sequence>

            {/* Segment 9: 2036 */}
            <Sequence from={7200} durationInFrames={900}>
                <BrollWrapper src="debt_bg_9.mp4" overlayColor="#000" />
                <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <KineticTypography text="THE 2036 CRITICAL POINT" />
                    <div style={{ marginTop: 80 }}>
                        <DataGrid stats={[
                            { label: 'EST. INTEREST', value: '$2 TRILLION', color: '#FF3366' },
                            { label: 'DEBT TO GDP', value: '150%+' }
                        ]} />
                    </div>
                </AbsoluteFill>
                <Audio src={staticFile('debt_vo_9.wav')} />
            </Sequence>

            {/* Segment 10: Choice */}
            <Sequence from={8100} durationInFrames={900}>
                <BrollWrapper src="debt_bg_10.mp4" overlayColor="#0A192F" />
                <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <KineticTypography text="THE CLOCK IS STILL TICKING" />
                    <div style={{ marginTop: 60 }}>
                        <DebtCounter startValue={38950000000000} speedPerSecond={250000} />
                    </div>
                </AbsoluteFill>
                <Audio src={staticFile('debt_vo_10.wav')} />
            </Sequence>

            {/* News Ticker Global */}
            <NewsTicker />

            {/* Global Post-Process */}
            <AbsoluteFill style={{
                boxShadow: 'inset 0 0 300px rgba(0,0,0,0.8)',
                pointerEvents: 'none',
                opacity: 0.5
            }} />
        </AbsoluteFill>
    );
};
