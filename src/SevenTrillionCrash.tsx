import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
    Sequence,
    Audio,
    staticFile,
} from 'remotion';
import React from 'react';

const FontStyles: React.FC = () => {
    return (
        <style>
            {`
        @font-face { font-family: 'BebasNeue'; src: url('${staticFile('fonts/Bebas_Neue_0.ttf')}') format('truetype'); }
        @font-face { font-family: 'Inter'; src: url('${staticFile('fonts/Inter_0.ttf')}') format('truetype'); }
        @font-face { font-family: 'Orbitron'; src: url('${staticFile('fonts/Orbitron_0.ttf')}') format('truetype'); }
        @font-face { font-family: 'SpaceGrotesk'; src: url('${staticFile('fonts/Space_Grotesk_0.ttf')}') format('truetype'); }
        @font-face { font-family: 'Montserrat'; src: url('${staticFile('fonts/Montserrat_0.ttf')}') format('truetype'); }
      `}
        </style>
    );
};

const Title: React.FC<{ text: string; color?: string; fontFamily?: string; size?: number; yOffset?: number; delay?: number; position?: 'absolute' | 'relative' }> = ({
    text, color = 'white', fontFamily = 'Montserrat', size = 80, yOffset = 0, delay = 0, position = 'absolute'
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const opacity = spring({
        frame: frame - delay,
        fps,
        config: { damping: 12 },
    });

    const scale = spring({
        frame: frame - delay - 2,
        fps,
        config: { mass: 0.5, damping: 10 },
        from: 0.95,
        to: 1,
    });

    return (
        <div
            style={{
                position,
                opacity,
                transform: `translateY(${yOffset}px) scale(${scale})`,
                fontSize: size,
                fontWeight: 'bold',
                color,
                fontFamily,
                textAlign: 'center',
                textShadow: '0 5px 15px rgba(0,0,0,0.8)',
                width: position === 'absolute' ? '100%' : 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 40,
                padding: position === 'absolute' ? '0 50px' : 0,
                boxSizing: 'border-box'
            }}
        >
            {text}
        </div>
    );
};

const PopBlock: React.FC<{ children: React.ReactNode; delay?: number; style?: React.CSSProperties }> = ({ children, delay = 0, style }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const progress = Math.max(0, frame - delay);
    const pop = spring({ frame: progress, fps, config: { damping: 12 } });
    return <div style={{ transform: `scale(${pop})`, ...style }}>{children}</div>;
};

// Extremely subtle, professional camera drift
const HandheldCamera: React.FC<{ children: React.ReactNode; intensity?: number }> = ({ children, intensity = 0.5 }) => {
    const frame = useCurrentFrame();
    const x = Math.sin(frame * 0.05) * intensity * 5;
    const y = Math.cos(frame * 0.04) * intensity * 5;

    return (
        <div style={{ transform: `translate(${x}px, ${y}px)`, width: '100%', height: '100%', overflow: 'hidden' }}>
            {children}
        </div>
    );
};

/* --- SVG ASSETS & STICKMAN ANIMATIONS --- */

const StickmanPanic: React.FC<{ startFrame: number }> = ({ startFrame }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const progress = Math.max(0, frame - startFrame);
    // Hands shaking
    const handShake = Math.sin(progress * 1.5) * 10;
    const pop = spring({ frame: progress, fps, config: { damping: 12 } });

    return (
        <svg width="250" height="400" viewBox="0 0 100 200" style={{ filter: 'drop-shadow(0 0 10px rgba(255,0,0,0.5))', transform: `scale(${pop})` }}>
            <circle cx="50" cy="30" r="20" fill="none" stroke="white" strokeWidth="6" />
            <line x1="42" y1="25" x2="48" y2="30" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <line x1="58" y1="25" x2="52" y2="30" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <path d="M 40 40 Q 50 35 60 40" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="50" x2="50" y2="120" stroke="white" strokeWidth="6" strokeLinecap="round" />
            <line x1="50" y1="120" x2="25" y2="190" stroke="white" strokeWidth="6" strokeLinecap="round" />
            <line x1="50" y1="120" x2="75" y2="190" stroke="white" strokeWidth="6" strokeLinecap="round" />
            <path d={`M 50 70 Q 20 60 40 ${20 + handShake}`} fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" />
            <path d={`M 50 70 Q 80 60 60 ${20 - handShake}`} fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" />
        </svg>
    )
};

const StickmanRun: React.FC<{ startFrame: number }> = ({ startFrame }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const progress = Math.max(0, frame - startFrame);
    const pop = spring({ frame: progress, fps, config: { damping: 12 } });
    const cycle = progress * 0.3;
    const leg1 = Math.sin(cycle) * 30;
    const leg2 = Math.cos(cycle) * 30;
    const arm1 = Math.cos(cycle) * 20;
    const arm2 = Math.sin(cycle) * 20;

    return (
        <svg width="200" height="300" viewBox="0 0 100 150" style={{ transform: `translateX(${progress * 5}px) scale(${pop})` }}>
            <circle cx="50" cy="20" r="15" fill="none" stroke="white" strokeWidth="5" />
            <line x1="50" y1="35" x2="60" y2="80" stroke="white" strokeWidth="5" strokeLinecap="round" />
            <line x1="60" y1="80" x2={50 + leg1} y2="140" stroke="white" strokeWidth="5" strokeLinecap="round" />
            <line x1="60" y1="80" x2={60 + leg2} y2="140" stroke="white" strokeWidth="5" strokeLinecap="round" />
            <line x1="55" y1="45" x2={30 + arm1} y2="70" stroke="white" strokeWidth="5" strokeLinecap="round" />
            <line x1="55" y1="45" x2={80 + arm2} y2="70" stroke="white" strokeWidth="5" strokeLinecap="round" />
        </svg>
    )
};

const StickmanGreed: React.FC<{ startFrame: number }> = ({ startFrame }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const progress = Math.max(0, frame - startFrame);
    const pop = spring({ frame: progress, fps, config: { damping: 12 } });

    return (
        <svg width="200" height="250" viewBox="0 0 100 150" style={{ filter: 'drop-shadow(0 0 10px rgba(0,255,0,0.3))', transform: `scale(${pop})` }}>
            <circle cx="50" cy="25" r="15" fill="none" stroke="#aaffaa" strokeWidth="5" />
            <text x="38" y="30" fill="#aaffaa" fontSize="12" fontWeight="bold">$</text>
            <text x="54" y="30" fill="#aaffaa" fontSize="12" fontWeight="bold">$</text>
            <line x1="50" y1="40" x2="50" y2="90" stroke="#aaffaa" strokeWidth="5" strokeLinecap="round" />
            <line x1="50" y1="90" x2="30" y2="140" stroke="#aaffaa" strokeWidth="5" strokeLinecap="round" />
            <line x1="50" y1="90" x2="70" y2="140" stroke="#aaffaa" strokeWidth="5" strokeLinecap="round" />
            <line x1="50" y1="50" x2="20" y2="70" stroke="#aaffaa" strokeWidth="5" strokeLinecap="round" />
            <line x1="50" y1="50" x2="80" y2="70" stroke="#aaffaa" strokeWidth="5" strokeLinecap="round" />
            <circle cx="20" cy="80" r="15" fill="#44aa44" />
            <circle cx="80" cy="80" r="15" fill="#44aa44" />
            <text x="16" y="85" fill="white" fontSize="14" fontWeight="bold">$</text>
            <text x="76" y="85" fill="white" fontSize="14" fontWeight="bold">$</text>
        </svg>
    )
};

const MoneyBag: React.FC<{ scaleDown?: boolean; delay?: number }> = ({ scaleDown, delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const progress = Math.max(0, frame - delay);
    const pop = spring({ frame: progress, fps, config: { damping: 12 } });
    const s = scaleDown ? spring({ frame: progress, fps, config: { damping: 10 }, from: 1, to: 0.5 }) : pop;
    return (
        <div style={{ transform: `scale(${s})`, filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))' }}>
            <svg width="150" height="150" viewBox="0 0 100 100">
                <path d="M30 40 Q50 10 70 40 Q90 100 50 100 Q10 100 30 40 Z" fill="#2d862d" />
                <path d="M40 30 L60 30 L50 15 Z" fill="#1f5c1f" />
                <text x="35" y="80" fill="white" fontSize="40" fontWeight="bold" fontFamily="Arial">$</text>
            </svg>
        </div>
    );
};

const SvgBank: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const progress = Math.max(0, frame - delay);
    const pop = spring({ frame: progress, fps, config: { damping: 12 } });
    return (
        <svg width="200" height="200" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.8))', transform: `scale(${pop})` }}>
            <polygon points="10,40 50,10 90,40" fill="#cc3333" />
            <rect x="15" y="40" width="70" height="10" fill="#aaaaaa" />
            <rect x="20" y="50" width="10" height="40" fill="#dddddd" />
            <rect x="45" y="50" width="10" height="40" fill="#dddddd" />
            <rect x="70" y="50" width="10" height="40" fill="#dddddd" />
            <rect x="10" y="90" width="80" height="10" fill="#888888" />
        </svg>
    );
};

const CrashingCandle: React.FC<{ startFrame: number; delay: number }> = ({ startFrame, delay }) => {
    const frame = useCurrentFrame();
    const progress = Math.max(0, frame - startFrame - delay);
    const drop = spring({ frame: progress, fps: 30, config: { damping: 12 } });

    return (
        <div style={{ transform: `translateY(${drop * 400 - 200}px)`, opacity: interpolate(progress, [0, 10], [0, 1]) }}>
            <svg width="60" height="300" viewBox="0 0 20 100">
                <rect x="9" y="0" width="2" height="100" fill="#ff2222" />
                <rect x="2" y="30" width="16" height="60" fill="#ff1111" stroke="#aa0000" strokeWidth="1" />
            </svg>
        </div>
    )
};

const GlobeIcon: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const progress = Math.max(0, frame - delay);
    const pop = spring({ frame: progress, fps, config: { damping: 12 } });
    return (
        <svg width="200" height="200" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 20px #2266ff)', transform: `scale(${pop})` }}>
            <circle cx="50" cy="50" r="45" fill="#001133" stroke="#2266ff" strokeWidth="3" />
            <path d="M 50 5 Q 70 50 50 95 Q 30 50 50 5 Z" fill="none" stroke="#2266ff" strokeWidth="2" />
            <path d="M 5 50 L 95 50" fill="none" stroke="#2266ff" strokeWidth="2" />
            <path d="M 15 25 L 85 25" fill="none" stroke="#2266ff" strokeWidth="1" opacity="0.5" />
            <path d="M 15 75 L 85 75" fill="none" stroke="#2266ff" strokeWidth="1" opacity="0.5" />
        </svg>
    );
};

const RobotFace: React.FC<{ isEvil: boolean; delay?: number }> = ({ isEvil, delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const progress = Math.max(0, frame - delay);
    const pop = spring({ frame: progress, fps, config: { damping: 12 } });
    return (
        <svg width="180" height="180" viewBox="0 0 100 100" style={{ filter: isEvil ? 'drop-shadow(0 0 20px red)' : 'drop-shadow(0 0 20px #00ffcc)', transform: `scale(${pop})` }}>
            <rect x="15" y="20" width="70" height="60" rx="10" fill="#222" stroke={isEvil ? "#ff2222" : "#00ffcc"} strokeWidth="4" />
            <circle cx="35" cy="45" r="8" fill={isEvil ? "#ff2222" : "#00ffcc"} />
            <circle cx="65" cy="45" r="8" fill={isEvil ? "#ff2222" : "#00ffcc"} />
            <rect x="35" y="65" width="30" height="4" fill={isEvil ? "#ff2222" : "#00ffcc"} />
            <line x1="50" y1="20" x2="50" y2="5" stroke={isEvil ? "#ff2222" : "#00ffcc"} strokeWidth="4" />
            <circle cx="50" cy="5" r="4" fill={isEvil ? "#ff2222" : "#00ffcc"} />
        </svg>
    );
};

/* --- NEW DYNAMIC SVGs --- */

const Hourglass: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const progress = Math.max(0, frame - delay);
    const pop = spring({ frame: progress, fps, config: { damping: 12 } });

    // Sand dropping animation
    const sandY = interpolate(progress, [0, 60], [20, 80], { extrapolateRight: 'clamp' });
    const sandH = interpolate(progress, [0, 60], [60, 0], { extrapolateRight: 'clamp' });
    const bottomSandY = interpolate(progress, [0, 60], [80, 20], { extrapolateRight: 'clamp' });
    const bottomSandH = interpolate(progress, [0, 60], [0, 60], { extrapolateRight: 'clamp' });

    return (
        <svg width="200" height="200" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 20px #ffcc00)', transform: `scale(${pop})` }}>
            {/* Top Glass */}
            <polygon points="20,10 80,10 50,50" fill="rgba(255,255,255,0.1)" stroke="#555" strokeWidth="2" />
            {/* Bottom Glass */}
            <polygon points="50,50 80,90 20,90" fill="rgba(255,255,255,0.1)" stroke="#555" strokeWidth="2" />

            {/* Top Sand */}
            <polygon points={`30,${sandY} 70,${sandY} 50,50`} fill="#ffcc00" />
            {/* Bottom Sand */}
            <polygon points={`50,50 ${50 + bottomSandH / 2},${50 + bottomSandH} ${50 - bottomSandH / 2},${50 + bottomSandH}`} fill="#ffcc00" />

            {/* Sand stream */}
            <line x1="50" y1="50" x2="50" y2="90" stroke="#ffcc00" strokeWidth="2" opacity={progress > 0 && progress < 60 ? 1 : 0} />

            {/* Frames */}
            <rect x="10" y="5" width="80" height="5" fill="#333" />
            <rect x="10" y="90" width="80" height="5" fill="#333" />
        </svg>
    );
};

const HeartbeatMonitor: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const progress = Math.max(0, frame - delay);
    const pop = spring({ frame: progress, fps, config: { damping: 12 } });

    // Line draws left to right, goes crazy, then flatlines
    const drawLength = interpolate(progress, [0, 60], [0, 100], { extrapolateRight: 'clamp' });
    // SVG path total length is about 200

    return (
        <svg width="400" height="150" viewBox="0 0 200 50" style={{ filter: 'drop-shadow(0 0 15px #00ffcc)', transform: `scale(${pop})` }}>
            <path d="M 0 25 L 40 25 L 50 10 L 60 40 L 70 5 L 80 45 L 90 25 L 200 25"
                fill="none" stroke="#00ffcc" strokeWidth="3"
                strokeDasharray="200" strokeDashoffset={200 - (drawLength * 2)} />
            <circle cx={drawLength * 2} cy="25" r="3" fill="#ffffff" opacity={drawLength < 100 ? 1 : 0.2} />
        </svg>
    );
};

const Speedometer: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const progress = Math.max(0, frame - delay);
    const pop = spring({ frame: progress, fps, config: { damping: 12 } });

    // Needle revs from -90deg (left) to 90deg (right)
    const angle = interpolate(progress, [0, 20, 30, 40, 60], [-90, 60, 50, 80, 90], { extrapolateRight: 'clamp' });

    return (
        <svg width="250" height="150" viewBox="0 0 200 100" style={{ filter: 'drop-shadow(0 0 20px #ff2222)', transform: `scale(${pop})` }}>
            <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="#333" strokeWidth="20" />
            <path d="M 100 10 A 90 90 0 0 1 190 100" fill="none" stroke="#ff2222" strokeWidth="20" />
            {/* Ticks */}
            {[...Array(9)].map((_, i) => (
                <line key={i} x1="100" y1="100" x2={100 + 80 * Math.cos(Math.PI + i * Math.PI / 8)} y2={100 + 80 * Math.sin(Math.PI + i * Math.PI / 8)} stroke="white" strokeWidth={i % 2 === 0 ? 4 : 2} />
            ))}
            {/* Overlay cover for ticks */}
            <path d="M 30 100 A 70 70 0 0 1 170 100" fill="#020005" />

            {/* Needle */}
            <g transform={`translate(100, 100) rotate(${angle})`}>
                <polygon points="-5,-10 5,-10 0,-85" fill="#ffffff" />
                <circle cx="0" cy="0" r="10" fill="#ff2222" />
            </g>
        </svg>
    );
};

/* --- FULL COMPOSITION --- */

export const SevenTrillionCrash: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#050505', overflow: 'hidden' }}>
            <FontStyles />
            <Audio src={staticFile('voiceovers/7trill.wav')} />

            {/* We will break scenes into very short, dynamic cuts (< 150 frames) */}

            {/* CUT 1: 0 - 120 (4s) "Seven Trillion Dollars. Gone." */}
            <Sequence durationInFrames={120}>
                <HandheldCamera>
                    <AbsoluteFill style={{ background: 'radial-gradient(circle, #3a0000 0%, #050505 100%)', justifyContent: 'center', alignItems: 'center' }}>
                        <Title text="$7,000,000,000,000" fontFamily="Orbitron" size={120} color="#ff3333" yOffset={-120} delay={10} />
                        <Title text="GONE." fontFamily="BebasNeue" size={200} color="#ffffff" yOffset={100} delay={45} />
                    </AbsoluteFill>
                </HandheldCamera>
            </Sequence>

            {/* CUT 2: 120 - 300 (6s) "Not over a year. Not over a month. In just 36 hours." */}
            <Sequence from={120} durationInFrames={180}>
                <HandheldCamera intensity={0.8}>
                    <AbsoluteFill style={{ background: '#0a0a0f', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ position: 'absolute', top: 200, width: '100%', display: 'flex', gap: 50, justifyContent: 'center', alignItems: 'center' }}>
                            <Title position="relative" text="NOT A YEAR." size={80} color="#888" delay={10} yOffset={0} />
                            <Title position="relative" text="NOT A MONTH." size={80} color="#aaa" delay={40} yOffset={0} />
                        </div>
                        <Title text="36 HOURS." fontFamily="BebasNeue" size={220} color="#ff2222" yOffset={150} delay={100} />
                    </AbsoluteFill>
                </HandheldCamera>
            </Sequence>

            {/* CUT 3: 300 - 540 (8s) "GDP of Germany... wiped off the face of the earth" */}
            <Sequence from={300} durationInFrames={240}>
                <HandheldCamera>
                    <AbsoluteFill style={{ background: '#050a1a', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <GlobeIcon />
                        <Title text="GDP OF GERMANY" fontFamily="Montserrat" color="#ffffff" size={90} yOffset={-240} delay={10} />
                        <Sequence from={100}>
                            <Title text="WIPED OUT" fontFamily="SpaceGrotesk" color="#ff4444" size={160} yOffset={200} delay={0} />
                            {/* Falling red candles across the screen */}
                            <AbsoluteFill>
                                {[...Array(15)].map((_, i) => <CrashingCandle key={i} startFrame={0} delay={i * 5} />)}
                            </AbsoluteFill>
                        </Sequence>
                    </AbsoluteFill>
                </HandheldCamera>
            </Sequence>

            {/* CUT 4: 540 - 750 (7s) "Two trading days. Faster and more violent than 2008" */}
            <Sequence from={540} durationInFrames={210}>
                <HandheldCamera intensity={1}>
                    <AbsoluteFill style={{ background: '#110202', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ position: 'absolute', width: '100%', top: 300, display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 100 }}>
                            {/* 2008 small drop vs Today massive drop */}
                            <PopBlock delay={0} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                                <Title position="relative" text="2008" size={60} yOffset={0} />
                                <div style={{ width: 150, height: 100, backgroundColor: '#882222', borderTop: '5px solid red' }} />
                            </PopBlock>

                            <PopBlock delay={60} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                                <Title position="relative" text="TODAY" size={80} color="#ffcccc" yOffset={0} />
                                <div style={{ width: 150, height: 400, backgroundColor: '#ff0000', borderTop: '10px solid white', boxShadow: '0 0 50px red' }} />
                            </PopBlock>
                        </div>
                        <Title text="FASTER & MORE VIOLENT." fontFamily="BebasNeue" size={130} yOffset={-330} delay={90} />
                    </AbsoluteFill>
                </HandheldCamera>
            </Sequence>

            {/* CUT 5: 750 - 1000 (8s) "How does 7 trillion vanish? Who took it?" */}
            <Sequence from={750} durationInFrames={250}>
                <HandheldCamera>
                    <AbsoluteFill style={{ background: '#020202', justifyContent: 'center', alignItems: 'center' }}>
                        <StickmanPanic startFrame={30} />
                        <Title text="HOW DOES IT VANISH?" fontFamily="SpaceGrotesk" color="#aaffaa" size={100} yOffset={-280} delay={20} />
                        <Sequence from={120}>
                            <Title text="WHO TOOK IT?" fontFamily="BebasNeue" color="#ff4444" size={150} yOffset={300} delay={0} />
                        </Sequence>
                    </AbsoluteFill>
                </HandheldCamera>
            </Sequence>

            {/* CUT 6: 1000 - 1260 (8s) "Exactly what happened during the most terrifying 36 hours" */}
            <Sequence from={1000} durationInFrames={260}>
                <HandheldCamera>
                    <AbsoluteFill style={{ background: '#0d111a', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ position: 'absolute', top: 120 }}><Hourglass delay={20} /></div>
                        <Title text="THE MOST TERRIFYING" fontFamily="Montserrat" color="#ffffff" size={90} yOffset={-150} delay={10} />
                        <Title text="36 HOURS" fontFamily="Orbitron" color="#ff2222" size={200} yOffset={20} delay={60} />
                        <Title text="IN HISTORY." fontFamily="SpaceGrotesk" color="#888" size={100} yOffset={200} delay={120} />
                    </AbsoluteFill>
                </HandheldCamera>
            </Sequence>

            {/* CUT 7: 1260 - 1530 (9s) "Started quietly. Fragile market, borrowed money" */}
            <Sequence from={1260} durationInFrames={270}>
                <HandheldCamera>
                    <AbsoluteFill style={{ background: '#001a0a', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ position: 'absolute', top: 250, display: 'flex', justifyContent: 'space-evenly', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                            <StickmanGreed startFrame={0} />
                            {/* Add money bag */}
                            <div style={{ position: 'relative', top: 100, filter: 'drop-shadow(0 0 20px #00ff00)' }}> <MoneyBag delay={10} /> </div>
                        </div>
                        <Title text="A FRAGILE MARKET." color="#aaffaa" size={100} delay={20} yOffset={-380} />
                        <Title text="BORROWED MONEY." color="#fff" size={90} delay={90} yOffset={380} />
                    </AbsoluteFill>
                </HandheldCamera>
            </Sequence>

            {/* CUT 8: 1530 - 1770 (8s) "One bad piece of inflation data to strike the match" */}
            <Sequence from={1530} durationInFrames={240}>
                <HandheldCamera intensity={0.8}>
                    <AbsoluteFill style={{ background: '#220000', justifyContent: 'center', alignItems: 'center' }}>
                        {/* Huge match stick drawing */}
                        <PopBlock delay={10}>
                            <svg width="200" height="400" viewBox="0 0 50 200" style={{ transform: 'rotate(20deg)' }}>
                                <rect x="20" y="30" width="10" height="170" fill="#ccaa88" />
                                <circle cx="25" cy="20" r="15" fill="#ff4444" />
                                <path d="M 0 10 L 15 0 L 30 10 M -10 20 L 0 20 L -5 30" stroke="#ffaa00" strokeWidth="2" fill="none" />
                            </svg>
                        </PopBlock>
                        <Title text="INFLATION DATA:" fontFamily="Orbitron" size={100} yOffset={-280} delay={30} />
                        <Title text="THE IMPOSSIBLE SPARK." fontFamily="SpaceGrotesk" color="#ffaa00" size={90} yOffset={280} delay={100} />
                    </AbsoluteFill>
                </HandheldCamera>
            </Sequence>

            {/* CUT 9: 1770 - 2100 (11s) "Humans didn't start the sell-off. The machines did. Not guys in suits." */}
            <Sequence from={1770} durationInFrames={330}>
                <HandheldCamera>
                    <AbsoluteFill style={{ background: '#050a12', justifyContent: 'center', alignItems: 'center' }}>
                        <Sequence durationInFrames={150}>
                            <Title text="HUMANS DIDN'T START IT." fontFamily="Montserrat" color="#aaaaaa" size={90} delay={10} />
                            {/* Cross out symbol */}
                            <div style={{ position: 'absolute', width: 900, height: 10, background: 'red', transform: 'rotate(-10deg)', top: '50%', boxShadow: '0 0 20px red' }} />
                        </Sequence>
                        <Sequence from={150}>
                            <RobotFace isEvil={true} />
                            <Title text="THE MACHINES DID." fontFamily="Orbitron" color="#00ffcc" size={140} yOffset={-250} delay={0} />
                            <Title text="HIGH-FREQUENCY ALGORITHMS." fontFamily="Inter" color="#fff" size={70} yOffset={250} delay={60} />
                        </Sequence>
                    </AbsoluteFill>
                </HandheldCamera>
            </Sequence>

            {/* CUT 10: 2100 - 2520 (14s) "React in milliseconds. Exact same conclusion: Sell everything." */}
            <Sequence from={2100} durationInFrames={420}>
                <HandheldCamera intensity={1.5}>
                    <AbsoluteFill style={{ background: '#110000', justifyContent: 'center', alignItems: 'center' }}>
                        <AbsoluteFill style={{ opacity: 0.3 }}>
                            {[...Array(50)].map((_, i) => (
                                <div key={i} style={{ color: 'red', position: 'absolute', left: (i * 40) % 1920, fontSize: 30, fontFamily: 'monospace', transform: `translateY(${(i * 123) % 1080}px)` }}>
                                    01100101
                                </div>
                            ))}
                        </AbsoluteFill>
                        <Title text="MILLISECONDS." fontFamily="SpaceGrotesk" color="#ff4444" size={140} yOffset={-320} delay={30} />

                        <Sequence from={150}>
                            <Title text="SELL EVERYTHING" fontFamily="BebasNeue" color="#ffffff" size={200} yOffset={0} delay={0} />
                            <AbsoluteFill>
                                {[...Array(30)].map((_, i) => <CrashingCandle key={i} startFrame={0} delay={i * 2} />)}
                            </AbsoluteFill>
                        </Sequence>
                    </AbsoluteFill>
                </HandheldCamera>
            </Sequence>

            {/* CUT 11: 2520 - 2790 (9s) "Systematic liquidation across every asset class. Stocks, bonds, crypto, gold." */}
            <Sequence from={2520} durationInFrames={270}>
                <HandheldCamera>
                    <AbsoluteFill style={{ background: '#020511', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ position: 'absolute', top: 350, width: '100%', display: 'flex', gap: 60, flexWrap: 'wrap', justifyContent: 'center' }}>
                            {['STOCKS', 'BONDS', 'CRYPTO', 'GOLD'].map((asset, i) => (
                                <PopBlock key={asset} delay={10 + i * 20}>
                                    <div style={{ padding: '20px 40px', border: '4px solid #4466ff', borderRadius: 20, fontSize: 50, color: '#fff', fontFamily: 'Orbitron', backgroundColor: '#001133' }}>
                                        {asset}
                                    </div>
                                </PopBlock>
                            ))}
                        </div>
                        <Title text="SYSTEMIC LIQUIDATION" fontFamily="Montserrat" color="#ff44aa" size={110} yOffset={-250} delay={10} />
                    </AbsoluteFill>
                </HandheldCamera>
            </Sequence>

            {/* CUT 12: 2790 - 3200 (13s) "Margin Call. Forced to sell to cover debts." */}
            <Sequence from={2790} durationInFrames={410}>
                <HandheldCamera intensity={1.2}>
                    <AbsoluteFill style={{ background: '#1a0505', justifyContent: 'center', alignItems: 'center' }}>
                        <Sequence durationInFrames={200}>
                            <Title text="MARGIN CALL" fontFamily="BebasNeue" color="#ff0000" size={250} delay={20} />
                        </Sequence>
                        <Sequence from={200}>
                            <div style={{ position: 'absolute', top: 380, width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <StickmanRun startFrame={0} />
                            </div>
                            <Title text="FORCED TO SELL" fontFamily="SpaceGrotesk" color="#ffffff" size={120} yOffset={-280} />
                        </Sequence>
                    </AbsoluteFill>
                </HandheldCamera>
            </Sequence>

            {/* CUT 13: 3200 - 3500 (10s) "Unstoppable doom-loop of digital destruction." */}
            <Sequence from={3200} durationInFrames={300}>
                <HandheldCamera>
                    <AbsoluteFill style={{ background: '#050011', justifyContent: 'center', alignItems: 'center' }}>
                        <svg width="400" height="400" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 30px #ff00ff)' }}>
                            <path d="M 50 10 A 40 40 0 1 1 10 50 L 20 45 L 10 30 L 0 45 Z" fill="none" stroke="#ff00ff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <Title text="THE DOOM LOOP" fontFamily="Orbitron" color="#ff44aa" size={120} yOffset={-320} delay={20} />
                        <Title text="DIGITAL DESTRUCTION" fontFamily="Montserrat" color="#fff" size={80} yOffset={320} delay={80} />
                    </AbsoluteFill>
                </HandheldCamera>
            </Sequence>

            {/* CUT 14: 3500 - 4100 (20s) "Central banks panicked. Pledging unlimited support. Money printer not enough." */}
            <Sequence from={3500} durationInFrames={600}>
                <HandheldCamera>
                    <AbsoluteFill style={{ background: '#001a1a', justifyContent: 'center', alignItems: 'center' }}>
                        <Sequence durationInFrames={250}>
                            <SvgBank />
                            <Title text="CENTRAL BANKS PANIC" fontFamily="BebasNeue" color="#ffff00" size={140} yOffset={-300} delay={20} />
                        </Sequence>
                        <Sequence from={250}>
                            <div style={{ display: 'flex', gap: 50, flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center', width: '100%', height: '100%', padding: '300px 100px 100px' }}>
                                {[...Array(6)].map((_, i) => <MoneyBag key={i} delay={i * 5} />)}
                            </div>
                            <Title text="THE MONEY PRINTER..." fontFamily="SpaceGrotesk" color="#ffffff" size={100} yOffset={-350} delay={0} />
                            <Title text="FAILED." fontFamily="BebasNeue" color="#ff0000" size={250} yOffset={150} delay={100} />
                        </Sequence>
                    </AbsoluteFill>
                </HandheldCamera>
            </Sequence>

            {/* CUT 15: 4100 - 4600 (16s) "Where did it go? Wealth is perceived value. Ceases to exist." */}
            <Sequence from={4100} durationInFrames={500}>
                <HandheldCamera intensity={0.5}>
                    <AbsoluteFill style={{ background: '#080808', justifyContent: 'center', alignItems: 'center' }}>
                        <Title text="WHERE DID IT GO?" fontFamily="Montserrat" color="#aaffff" size={110} yOffset={-300} delay={30} />
                        <Title text="WEALTH IS PERCEIVED VALUE." fontFamily="Inter" color="#aaaaaa" size={80} yOffset={-100} delay={120} />
                        <Sequence from={250}>
                            <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-150px)' }}><HeartbeatMonitor delay={0} /></div>
                            <Title text="IT CEASES TO EXIST." fontFamily="Orbitron" color="#555555" size={120} yOffset={250} delay={0} />
                            <AbsoluteFill>
                                {[...Array(200)].map((_, i) => (
                                    <div key={i} style={{ position: 'absolute', top: (i * 53) % 1080, left: (i * 97) % 1920, width: 4, height: 4, backgroundColor: 'white', opacity: 0.3 }} />
                                ))}
                            </AbsoluteFill>
                        </Sequence>
                    </AbsoluteFill>
                </HandheldCamera>
            </Sequence>

            {/* CUT 16: 4600 - 5595 (33s) "Outro. Faster, leveraged, fragile. Machines still running." */}
            <Sequence from={4600} durationInFrames={995}>
                <HandheldCamera intensity={0.2}>
                    <AbsoluteFill style={{ background: '#020005', justifyContent: 'center', alignItems: 'center' }}>
                        <Sequence durationInFrames={350}>
                            <div style={{ position: 'absolute', top: 100 }}><Speedometer delay={10} /></div>
                            <Title text="FASTER." fontFamily="BebasNeue" color="#ff4444" size={180} yOffset={-280} delay={10} />
                            <Title text="MORE LEVERAGED." fontFamily="BebasNeue" color="#ffaaaa" size={180} yOffset={0} delay={60} />
                            <Title text="MORE FRAGILE." fontFamily="BebasNeue" color="#ffffff" size={180} yOffset={280} delay={110} />
                        </Sequence>
                        <Sequence from={350} durationInFrames={350}>
                            <RobotFace isEvil={false} />
                            <Title text="THE MACHINES ARE STILL RUNNING" fontFamily="SpaceGrotesk" color="#00ffcc" size={90} yOffset={300} delay={30} />
                        </Sequence>
                        <Sequence from={700}>
                            <Title text="SUBSCRIBE" fontFamily="Orbitron" color="#ff0000" size={180} yOffset={-140} delay={0} />
                            <Title text="TO SURVIVE" fontFamily="Montserrat" color="#ffffff" size={80} yOffset={20} delay={30} />
                            <Title text="THE ALGORITHMS." fontFamily="Montserrat" color="#ffffff" size={80} yOffset={120} delay={60} />
                        </Sequence>
                    </AbsoluteFill>
                </HandheldCamera>
            </Sequence>
        </AbsoluteFill>
    );
};
