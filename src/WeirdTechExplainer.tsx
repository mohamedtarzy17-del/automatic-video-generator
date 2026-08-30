import React, { Fragment } from 'react';
import {
    AbsoluteFill,
    Sequence,
    Audio,
    useCurrentFrame,
    useVideoConfig,
    spring,
    interpolate,
    Img,
    staticFile,
} from 'remotion';
import { FONT_IMPORT, getFontForScene } from './components/PremiumKit';

const AUDIO_DURATIONS = {
    seg1: 861,
    seg2: 1050,
    seg3: 1078,
    seg4: 879,
    seg5: 991,
    seg6: 986,
    seg7: 818,
};

const ST = {
    seg1: 0,
    seg2: 861,
    seg3: 1911,
    seg4: 2989,
    seg5: 3868,
    seg6: 4859,
    seg7: 5845,
};

const THEME = {
    bgDark: '#0a0a0c',
    bgPink: '#ff1493',
    bgYellow: '#ffe600',
    bgNeoGreen: '#00ff66',
    bgRed: '#ff003c',
    bgBlue: '#0026ff',
    white: '#ffffff',
    black: '#000000',
};

// --- CONSTANT MOTION HELPERS ---
const getFloat = (frame: number, speed = 0.05, amount = 10) => {
    return `translateY(${Math.sin(frame * speed) * amount}px)`;
};

// --- 2D SVGs & ANIMATIONS ---


const TargetScanner: React.FC = () => {
    const frame = useCurrentFrame();
    const x = Math.sin(frame * 0.05) * 300;
    const y = Math.cos(frame * 0.07) * 200;
    return (
        <svg width="400" height="400" viewBox="0 0 400 400" style={{ position: 'absolute', top: '50%', left: '50%', transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${frame * 2}deg)` }}>
            <path d="M 20 200 L 180 200 M 220 200 L 380 200 M 200 20 L 200 180 M 200 220 L 200 380" stroke={THEME.bgRed} strokeWidth="8" />
            <circle cx="200" cy="200" r="100" fill="none" stroke={THEME.bgRed} strokeWidth="4" strokeDasharray="20 40" />
            <circle cx="200" cy="200" r="10" fill={THEME.bgRed} />
        </svg>
    );
};

const RadarPulse: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <svg width="600" height="600" viewBox="0 0 600 600">
            <circle cx="300" cy="300" r={30 + (frame * 5) % 270} fill="none" stroke={THEME.bgPink} strokeWidth="10" opacity={1 - ((frame * 5) % 270) / 270} />
            <circle cx="300" cy="300" r={30 + ((frame + 54) * 5) % 270} fill="none" stroke={THEME.bgPink} strokeWidth="10" opacity={1 - (((frame + 54) * 5) % 270) / 270} />
            <path d="M 300 300 L 500 300" stroke={THEME.white} strokeWidth="5" style={{ transformOrigin: '300px 300px', transform: `rotate(${frame * 4}deg)` }} />
        </svg>
    );
};



const FilmGrain: React.FC = () => {
    return (
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none', mixBlendMode: 'overlay' }}>
            <filter id="noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
                <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.5 0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
    );
};

const GearSystem: React.FC<{ color?: string }> = ({ color = THEME.white }) => {
    const frame = useCurrentFrame();
    return (
        <svg width="200" height="200" viewBox="0 0 200 200">
            <g transform={`rotate(${frame * 2} 100 100)`}>
                <circle cx="100" cy="100" r="70" fill="none" stroke={color} strokeWidth="15" strokeDasharray="20 15" strokeLinecap="round" />
                <circle cx="100" cy="100" r="40" fill="none" stroke={color} strokeWidth="5" />
                <circle cx="100" cy="100" r="20" fill={color} />
            </g>
            <g transform={`translate(120, 120) rotate(${-frame * 3} 40 40) scale(0.6)`}>
                <circle cx="40" cy="40" r="70" fill="none" stroke={color} strokeWidth="15" strokeDasharray="20 15" strokeLinecap="round" />
                <circle cx="40" cy="40" r="20" fill={color} />
            </g>
        </svg>
    );
};

const HeartbeatECG: React.FC<{ color?: string, width?: number }> = ({ color = THEME.white, width = 400 }) => {
    const frame = useCurrentFrame();
    const length = 1000;
    const offset = length - ((frame * 15) % length);
    return (
        <svg width={width} height="100" viewBox="0 0 400 100" style={{ overflow: 'hidden' }}>
            <path
                d="M 0 50 L 100 50 L 120 20 L 140 90 L 160 10 L 180 60 L 200 50 L 400 50 M 400 50 L 500 50 L 520 20 L 540 90 L 560 10 L 580 60 L 600 50 L 800 50"
                fill="none"
                stroke={color}
                strokeWidth="10"
                strokeLinejoin="round"
                strokeDasharray={length}
                strokeDashoffset={offset}
            />
        </svg>
    );
};



const ElectricZap: React.FC = () => {
    const frame = useCurrentFrame();
    if (frame % 6 > 2) return null; // Strobe
    return (
        <svg width="100%" height="100%" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
            <path d={`M 0 ${Math.random() * 100}% L 20% ${Math.random() * 100}% L 40% ${Math.random() * 100}% L 60% ${Math.random() * 100}% L 80% ${Math.random() * 100}% L 100% ${Math.random() * 100}%`} fill="none" stroke={THEME.bgYellow} strokeWidth="25" />
            <path d={`M 0 ${Math.random() * 100}% L 30% ${Math.random() * 100}% L 50% ${Math.random() * 100}% L 70% ${Math.random() * 100}% L 100% ${Math.random() * 100}%`} fill="none" stroke={THEME.white} strokeWidth="30" />
        </svg>
    );
};

// --- NEW HIGH-RETENTION HELPERS ---



const FloatingAsset: React.FC<{ children: React.ReactNode, speed?: number, amount?: number }> = ({ children, speed = 0.05, amount = 30 }) => {
    const frame = useCurrentFrame();
    return (
        <div style={{ transform: getFloat(frame, speed, amount) }}>
            {children}
        </div>
    );
};

const CameraWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const frame = useCurrentFrame();
    const scale = interpolate(frame, [0, 9000], [1, 1.1]);
    const rotate = Math.sin(frame * 0.01) * 0.2;
    return (
        <div style={{ width: '100%', height: '100%', transform: `scale(${scale}) rotate(${rotate}deg)` }}>
            {children}
        </div>
    );
};

const BeatManager: React.FC<{ frame: number, interval?: number }> = ({ frame, interval = 36 }) => {
    const isBeat = frame > 0 && frame % interval === 0;
    const isSFXBeat = isBeat;

    return (
        <Fragment>
            {isSFXBeat && <Audio src={staticFile('sfx/pop.mp3')} volume={0.6} />}
        </Fragment>
    );
};

// --- UTILITIES ---
const TerminalText: React.FC<{ text: string }> = ({ text }) => {
    const frame = useCurrentFrame();
    const charsToShow = Math.floor(frame * 1.5);
    const visibleText = text.slice(0, Math.max(0, charsToShow));
    const showCursor = (frame % 30 < 15);
    return <span>{visibleText}{showCursor ? '█' : ''}</span>;
};

const KineticType: React.FC<{ text: string, color: string, stagger?: number, reverse?: boolean }> = ({ text, color, stagger = 2, reverse = false }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const words = text.split(' ');

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
            {words.map((word, i) => {
                const delay = i * stagger;
                const progress = spring({ frame: frame - delay, fps, config: { damping: 14 } });
                const yOffset = reverse ? -50 : 50;
                return (
                    <div key={i} style={{ transform: `translateY(${interpolate(progress, [0, 1], [yOffset, 0])}px) scale(${interpolate(progress, [0, 1], [0.8, 1])})`, opacity: progress, color }}>
                        {word}
                    </div>
                );
            })}
        </div>
    );
};



// --- SCENES ---

const Scene1Intro: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(0);
    const scale = interpolate(frame, [0, 861], [1, 1.4]); // More aggressive zoom
    const opacity = interpolate(frame, [0, 30, 830, 861], [0, 1, 1, 0]);

    return (
        <AbsoluteFill style={{ backgroundColor: THEME.black, overflow: 'hidden' }}>
            <BeatManager frame={frame} />
            <AbsoluteFill style={{ opacity }}>
                <Img
                    src={staticFile('assets/weird_tech_intro_cinematic_1772477983811.png')}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})` }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent, black)' }} />
            </AbsoluteFill>

            {/* Sub-scene logic: Change text every 120 frames (~4s) */}
            <div style={{ position: 'absolute', top: 100, left: 100, zIndex: 10 }}>
                {frame < 300 ? (
                    <div style={{ fontFamily: 'Space Mono', fontSize: 40, color: THEME.bgNeoGreen, textShadow: '0 0 15px #00ff66' }}>
                        <TerminalText text="> INITIATING_MARCH_2026_ANALYSIS..." />
                    </div>
                ) : (
                    <div style={{ fontFamily: 'Space Mono', fontSize: 30, color: THEME.bgYellow }}>
                        <TerminalText text="LOG... NEW HARDWARE DETECTED" />
                    </div>
                )}
            </div>

            <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
                <FloatingAsset amount={60}>
                    <h1 style={{ fontFamily: font, fontSize: 180, color: THEME.bgYellow, textAlign: 'center', margin: 0, textShadow: '0 10px 40px rgba(0,0,0,0.8)' }}>
                        <KineticType text="THE FUTURE OF TECH" color={THEME.bgYellow} stagger={3} />
                    </h1>
                    {frame > 36 && (
                        <h2 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 100, color: THEME.white, textAlign: 'center', marginTop: -20, fontStyle: 'italic', textShadow: '0 5px 20px black' }}>
                            IS BEYOND STRANGE
                        </h2>
                    )}
                </FloatingAsset>
            </AbsoluteFill>

            {frame % 36 === 0 && <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.5} />}
            <FilmGrain />
            {frame === 0 && <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.9} />}
        </AbsoluteFill>
    );
};

const Scene2RobotPhone: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(1);
    const moveX = interpolate(frame, [0, 1050], [0, -200]); // Faster move
    const scale = interpolate(frame, [0, 1050], [1.1, 1]);

    return (
        <AbsoluteFill style={{ backgroundColor: THEME.black, overflow: 'hidden' }}>
            <BeatManager frame={frame} />
            <Img
                src={staticFile('assets/honor_robot_phone_visual_1772477999319.png')}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `translateX(${moveX}px) scale(${scale})`, opacity: 0.8 }}
            />

            <TargetScanner />

            <div style={{ position: 'absolute', bottom: 100, right: 100, width: '40%', zIndex: 30 }}>
                <div style={{ padding: 40, borderLeft: `20px solid ${THEME.bgNeoGreen}`, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                    <h1 style={{ fontFamily: font, fontSize: 140, color: THEME.white, margin: 0, lineHeight: 1 }}>ROBOT PHONE</h1>
                    <p style={{ fontFamily: 'Inter', fontSize: 60, color: THEME.bgNeoGreen, margin: 0, fontWeight: 700, textTransform: 'uppercase' }}>AI TRACKING AT 360°</p>
                </div>
            </div>

            {frame % 200 === 0 && <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.4} />}
            {frame === 0 && <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.8} />}
            {frame === 500 && <Audio src={staticFile('sfx/pop.mp3')} volume={0.8} />}
        </AbsoluteFill>
    );
};

const Scene3Soulmates: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(2);
    const zoom = interpolate(frame, [0, 1078], [1.3, 1]);

    return (
        <AbsoluteFill style={{ backgroundColor: THEME.black, overflow: 'hidden' }}>
            <BeatManager frame={frame} />
            <Img
                src={staticFile('assets/lepro_ami_ai_companion_1772478015670.png')}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})` }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, black, transparent, transparent, black)' }} />

            <div style={{ position: 'absolute', top: 100, left: 100, zIndex: 30 }}>
                <RadarPulse />
            </div>

            <div style={{ position: 'absolute', bottom: 150, left: 100, right: 100, zIndex: 40, textAlign: 'center' }}>
                <FloatingAsset amount={50}>
                    <h1 style={{ fontFamily: font, fontSize: 130, color: THEME.bgPink, margin: 0, textShadow: '0 0 30px rgba(255,20,147,0.5)' }}>DESKTOP SOULMATES</h1>
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '30px 0' }}>
                        <HeartbeatECG color={THEME.bgPink} width={800} />
                    </div>
                    <p style={{ fontFamily: 'Inter', fontSize: 70, color: THEME.white, fontWeight: 900, textTransform: 'uppercase', textShadow: '0 5px 20px black' }}>EMPATHETIC AI COMPANIONS</p>
                </FloatingAsset>
            </div>

            {frame % 45 === 0 && <Audio src={staticFile('sfx/pop.mp3')} volume={0.4} />}
            {frame % 120 === 0 && <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.3} />}
            {frame === 0 && <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.8} />}
            {frame === 500 && <Audio src={staticFile('sfx/pop.mp3')} volume={0.8} />}
        </AbsoluteFill>
    );
};

const Scene4Pavlok: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(3);
    const tilt = Math.sin(frame * 0.1) * 3;
    const isZapping = (frame > 200 && frame < 220) || (frame > 350 && frame < 370) || (frame > 500 && frame < 520) || (frame > 700 && frame < 720);

    return (
        <AbsoluteFill style={{ backgroundColor: THEME.black, overflow: 'hidden' }}>
            <BeatManager frame={frame} />
            <Img
                src={staticFile('assets/pavlok_electric_shocks_1772478033825.png')}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `rotate(${tilt}deg) scale(1.2)` }}
            />
            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)' }} />

            {isZapping && (
                <>
                    <ElectricZap />
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,230,0,0.3)', mixBlendMode: 'overlay' }} />
                    <Audio src={staticFile('sfx/pop 2.mp3')} volume={1} />
                </>
            )}

            <div style={{ position: 'absolute', top: 120, left: 100, right: 100, zIndex: 50 }}>
                <h1 style={{ fontFamily: font, fontSize: 160, color: THEME.white, textAlign: 'center', margin: 0, textShadow: '0 10px 30px black' }}>PAVLOK 3 PRO</h1>
                <p style={{ fontFamily: 'Inter', fontSize: 80, color: THEME.bgYellow, fontWeight: 900, textAlign: 'center', textTransform: 'uppercase', textShadow: '0 5px 20px black' }}>ZAPPING BAD HABITS AWAY</p>
            </div>

            {frame % 45 === 0 && <Audio src={staticFile('sfx/pop.mp3')} volume={0.5} />}
            {frame === 0 && <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.8} />}
        </AbsoluteFill>
    );
};

const Scene5Toilet: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(4);
    const panY = interpolate(frame, [0, 991], [0, -180]); // Faster pan

    return (
        <AbsoluteFill style={{ backgroundColor: THEME.black, overflow: 'hidden' }}>
            <BeatManager frame={frame} />
            <Img
                src={staticFile('assets/smart_toilet_medical_analysis_1772478051332.png')}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `translateY(${panY}px) scale(1.3)` }}
            />

            <div style={{ position: 'absolute', top: 100, right: 100, textAlign: 'right', zIndex: 60 }}>
                <h1 style={{ fontFamily: font, fontSize: 140, color: THEME.bgBlue, margin: 0, textShadow: '0 0 30px black' }}>SMART TOILET</h1>
                <p style={{ fontFamily: 'Inter', fontSize: 65, color: THEME.white, fontWeight: 900, textTransform: 'uppercase', textShadow: '0 0 20px black' }}>URINE ANALYSIS AI</p>
                <div style={{ height: 12, width: 450, backgroundColor: THEME.bgBlue, alignSelf: 'flex-end', marginTop: 20, boxShadow: '0 0 30px #0026ff' }} />
            </div>

            {frame % 45 === 0 && <Audio src={staticFile('sfx/pop.mp3')} volume={0.5} />}
            {frame % 90 === 0 && <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.4} />}
            <FilmGrain />
            {frame === 0 && <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.8} />}
            {frame === 450 && <Audio src={staticFile('sfx/pop.mp3')} volume={0.8} />}
        </AbsoluteFill>
    );
};

const Scene6Humanwashing: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(5);
    const scale = interpolate(frame, [0, 986], [1, 1.4]);
    const rotate = interpolate(frame, [0, 986], [0, -4]);

    return (
        <AbsoluteFill style={{ backgroundColor: THEME.black, overflow: 'hidden' }}>
            <BeatManager frame={frame} />
            <Img
                src={staticFile('assets/humanwashing_hygiene_pod_1772478067411.png')}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale}) rotate(${rotate}deg)` }}
            />

            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 350, background: 'linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)' }} />

            <div style={{ position: 'absolute', top: 100, left: 100, zIndex: 70 }}>
                <h1 style={{ fontFamily: font, fontSize: 160, color: THEME.white, margin: 0, letterSpacing: '0.1em', textShadow: '0 10px 40px black' }}>HUMANWASHING</h1>
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                    <p style={{ fontFamily: 'Inter', fontSize: 70, color: THEME.bgNeoGreen, margin: 0, fontWeight: 700, textShadow: '0 0 20px black', textTransform: 'uppercase' }}>AI HYGIENE PODS</p>
                    {frame % 40 < 20 && <div style={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: THEME.bgRed, boxShadow: '0 0 15px red' }} />}
                </div>
            </div>

            <div style={{ position: 'absolute', bottom: 100, right: 100, zIndex: 70, opacity: 0.6 }}>
                <GearSystem color={THEME.white} />
            </div>

            {frame % 45 === 0 && <Audio src={staticFile('sfx/pop.mp3')} volume={0.5} />}
            {frame % 120 === 0 && <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.4} />}
            {frame === 0 && <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.8} />}
            {frame === 400 && <Audio src={staticFile('sfx/pop.mp3')} volume={0.8} />}
        </AbsoluteFill>
    );
};

const Scene7Outro: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(6);
    const scale = interpolate(frame, [0, 818], [1.2, 1]);

    return (
        <AbsoluteFill style={{ backgroundColor: THEME.black, overflow: 'hidden' }}>
            <BeatManager frame={frame} />
            <Img
                src={staticFile('assets/tech_human_merger_outro_1772478082527.png')}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})` }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent, black, black)' }} />

            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 100 }}>
                {frame < 300 && (
                    <FloatingAsset amount={40}>
                        <h1 style={{ fontFamily: font, fontSize: 130, color: THEME.white, textAlign: 'center', textShadow: '0 10px 40px black' }}>WELCOME TO THE FUTURE.</h1>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                            <GearSystem color={THEME.white} />
                        </div>
                    </FloatingAsset>
                )}

                {frame >= 300 && frame < 600 && (
                    <div style={{ padding: 60, backgroundColor: 'rgba(0,0,0,0.85)', border: `10px solid ${THEME.white}`, boxShadow: '0 0 60px rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                        <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 150, color: THEME.white, textAlign: 'center', margin: 0, textTransform: 'uppercase' }}>TOOL OR MASTER?</h1>
                        <div style={{ height: 10, width: '100%', backgroundColor: THEME.bgRed, marginTop: 20 }} />
                    </div>
                )}

                {frame >= 600 && (
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ fontFamily: font, fontSize: 180, color: THEME.bgYellow, margin: 0, textShadow: '0 0 50px rgba(255,230,0,0.5)' }}>YOU DECIDE.</h1>
                        <p style={{ fontFamily: 'Space Mono', fontSize: 70, color: THEME.bgNeoGreen, marginTop: 40, textShadow: '0 0 20px black' }}>SCANNING COMPLETED.</p>
                        {frame % 20 < 10 && <div style={{ height: 4, width: '100%', backgroundColor: THEME.bgNeoGreen, marginTop: 10 }} />}
                    </div>
                )}
            </div>

            {frame % 100 === 0 && <Audio src={staticFile('sfx/pop.mp3')} volume={0.5} />}
            <FilmGrain />
            {frame === 0 && <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.8} />}
            {frame === 600 && <Audio src={staticFile('sfx/pop 2.mp3')} volume={0.8} />}
        </AbsoluteFill>
    );
};

// --- MAIN COMPOSITION ---

export const WeirdTechExplainer: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: THEME.black }}>
            <style>{FONT_IMPORT}</style>

            <CameraWrapper>
                {/* Ambient Background */}
                <Audio src={staticFile('sfx/ambient.mp3')} volume={0.15} loop />

                {/* SINGLE VOICEOVER TRACK */}
                <Audio src={staticFile('download.wav')} volume={1} />

                <Sequence from={ST.seg1} durationInFrames={AUDIO_DURATIONS.seg1}>
                    <Scene1Intro />
                </Sequence>

                <Sequence from={ST.seg2} durationInFrames={AUDIO_DURATIONS.seg2}>
                    <Scene2RobotPhone />
                </Sequence>

                <Sequence from={ST.seg3} durationInFrames={AUDIO_DURATIONS.seg3}>
                    <Scene3Soulmates />
                </Sequence>

                <Sequence from={ST.seg4} durationInFrames={AUDIO_DURATIONS.seg4}>
                    <Scene4Pavlok />
                </Sequence>

                <Sequence from={ST.seg5} durationInFrames={AUDIO_DURATIONS.seg5}>
                    <Scene5Toilet />
                </Sequence>

                <Sequence from={ST.seg6} durationInFrames={AUDIO_DURATIONS.seg6}>
                    <Scene6Humanwashing />
                </Sequence>

                <Sequence from={ST.seg7} durationInFrames={AUDIO_DURATIONS.seg7}>
                    <Scene7Outro />
                </Sequence>
            </CameraWrapper>
        </AbsoluteFill>
    );
};
