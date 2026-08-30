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
        @font-face { font-family: 'Outfit'; src: url('${staticFile('fonts/Outfit_0.ttf')}') format('truetype'); }
        @font-face { font-family: 'PlayfairDisplay'; src: url('${staticFile('fonts/Playfair_Display_0.ttf')}') format('truetype'); }
        @font-face { font-family: 'Poppins'; src: url('${staticFile('fonts/Poppins_0.ttf')}') format('truetype'); }
        @font-face { font-family: 'Raleway'; src: url('${staticFile('fonts/Raleway_0.ttf')}') format('truetype'); }
      `}
        </style>
    );
};

const Title: React.FC<{ text: string; color?: string; fontFamily: string; size?: number; yOffset?: number; delay?: number }> = ({
    text, color = 'white', fontFamily, size = 100, yOffset = 0, delay = 0
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const opacity = spring({
        frame: frame - delay,
        fps,
        config: { damping: 12 },
    });

    const scale = spring({
        frame: frame - delay - 5,
        fps,
        config: { mass: 0.5, damping: 10 },
        from: 0.8,
        to: 1,
    });

    return (
        <div
            style={{
                position: 'absolute',
                opacity,
                transform: `translateY(${yOffset}px) scale(${scale})`,
                fontSize: size,
                fontWeight: 'bold',
                color,
                fontFamily,
                textAlign: 'center',
                textShadow: '0 10px 30px rgba(0,0,0,0.8)',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10,
            }}
        >
            {text}
        </div>
    );
};

const ShakeContainer: React.FC<{ children: React.ReactNode; intensity: number; active: boolean }> = ({ children, intensity, active }) => {
    const frame = useCurrentFrame();
    const x = active ? Math.sin(frame * 2.5) * intensity : 0;
    const y = active ? Math.cos(frame * 3.1) * intensity : 0;

    return (
        <div style={{ transform: `translate(${x}px, ${y}px)`, width: '100%', height: '100%' }}>
            {children}
        </div>
    );
};

const SpeedLine: React.FC<{ delay: number; y: number }> = ({ delay, y }) => {
    const frame = useCurrentFrame();
    const x = interpolate((frame - delay) % 60, [0, 40], [2500, -500], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    return (
        <div style={{
            position: 'absolute',
            top: y,
            left: x,
            width: 400,
            height: 4,
            background: 'rgba(255, 255, 255, 0.4)',
            boxShadow: '0 0 10px rgba(255,255,255,0.8)',
            transform: 'skewX(-45deg)'
        }} />
    );
};

const RadiatingPulse: React.FC<{ startFrame: number; color: string }> = ({ startFrame, color }) => {
    const frame = useCurrentFrame();
    const progress = Math.max(0, frame - startFrame);
    if (progress === 0 || progress > 90) return null;

    const scale = interpolate(progress, [0, 60], [1, 5], { extrapolateRight: 'clamp' });
    const opacity = interpolate(progress, [0, 30, 60], [0, 0.8, 0], { extrapolateRight: 'clamp' });

    return (
        <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: `translate(-50%, -50%) scale(${scale})`,
            width: 300, height: 300, borderRadius: '50%', border: `10px solid ${color}`, opacity, zIndex: 1
        }} />
    );
};

const TangentialArrows: React.FC<{ startFrame: number }> = ({ startFrame }) => {
    const frame = useCurrentFrame();
    const progress = Math.max(0, frame - startFrame);
    if (progress === 0 || progress > 150) return null;

    const xOffset = interpolate(progress, [0, 60], [0, 800], { extrapolateRight: 'clamp' });
    const opacity = interpolate(progress, [0, 10, 50, 60], [0, 1, 1, 0], { extrapolateRight: 'clamp' });

    return (
        <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, opacity, zIndex: 2 }}>
            {[...Array(6)].map((_, i) => (
                <div key={i} style={{
                    position: 'absolute', top: 200 + i * 150, left: 500 + xOffset + (i % 2 * 100),
                    width: 100, height: 10, backgroundColor: '#ffaa00',
                    boxShadow: '0 0 20px #ffaa00', borderRadius: 5
                }}>
                    <div style={{ content: '""', position: 'absolute', right: -10, top: -10, width: 0, height: 0, borderTop: '15px solid transparent', borderBottom: '15px solid transparent', borderLeft: '20px solid #ffaa00' }} />
                </div>
            ))}
        </div>
    );
};

const FlyingDebris: React.FC<{ startFrame: number; count: number }> = ({ startFrame, count }) => {
    const frame = useCurrentFrame();
    const progress = Math.max(0, frame - startFrame);
    if (progress === 0) return null;

    return (
        <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: 4 }}>
            {[...Array(count)].map((_, i) => {
                const speed = 10 + (i % 5) * 5;
                const x = (progress * speed + i * 200) % 2500;
                const y = (i * 73) % 1080;
                const rotate = progress * (i % 3 + 2);
                return (
                    <div key={i} style={{ position: 'absolute', top: y, left: x - 200, transform: `rotate(${rotate}deg)`, width: 20 + i % 30, height: 20 + i % 30, backgroundColor: i % 2 === 0 ? '#444' : '#777', opacity: 0.6 }} />
                );
            })}
        </div>
    );
};

const FlashingRedOverlay: React.FC<{ startFrame: number }> = ({ startFrame }) => {
    const frame = useCurrentFrame();
    if (frame < startFrame) return null;
    const opacity = (Math.sin((frame - startFrame) / 5) + 1) / 4; // Oscillates between 0 and 0.5
    return <AbsoluteFill style={{ backgroundColor: 'red', opacity, zIndex: 20, mixBlendMode: 'overlay' }} />;
};

const WaterDrainVisual: React.FC<{ startFrame: number }> = ({ startFrame }) => {
    const frame = useCurrentFrame();
    const progress = Math.min(1, Math.max(0, frame - startFrame) / 150); // Mapped 0 to 1 over 150 frames

    // Middle drops, edges rise
    const middleY = interpolate(progress, [0, 1], [500, 800]);
    const edgeY = interpolate(progress, [0, 1], [500, 200]);

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 3, display: 'flex', justifyContent: 'center' }}>
            <svg width="1920" height="1080" viewBox="0 0 1920 1080">
                {/* Earth core/land cross section */}
                <path d="M 0 1080 L 1920 1080 L 1920 800 Q 960 800 0 800 Z" fill="#332200" />
                {/* Draining Water */}
                <path d={`M 0 1080 L 1920 1080 L 1920 ${edgeY} Q 960 ${middleY} 0 ${edgeY} Z`} fill="rgba(0, 100, 200, 0.8)" />
                {/* Equator Line Indicator */}
                <line x1="960" y1="0" x2="960" y2="1080" stroke="#ff4444" strokeWidth="4" strokeDasharray="20, 20" opacity={0.5} />
                <text x="980" y="200" fill="#ff4444" fontSize="40" fontFamily="Orbitron">EQUATOR</text>
            </svg>
        </div>
    );
};

const CrackingSupercontinent: React.FC<{ startFrame: number }> = ({ startFrame }) => {
    const frame = useCurrentFrame();
    const progress = Math.max(0, frame - startFrame);
    if (progress === 0) return null;

    const landOpacity = interpolate(progress, [0, 60], [0, 1], { extrapolateRight: 'clamp' });
    const crackDraw = interpolate(progress, [60, 120], [0, 1000], { extrapolateRight: 'clamp' });

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 3 }}>
            <AbsoluteFill style={{ background: '#0a0a0a' }} />
            <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ opacity: landOpacity }}>
                {/* Arid Landmass */}
                <path d="M 200 600 Q 500 200 960 400 T 1700 700 Q 1500 1000 960 900 T 200 600" fill="#663300" />
                {/* Cracks drawing in */}
                <path d="M 400 500 Q 600 400 700 600 T 1100 550" fill="none" stroke="#ff2200" strokeWidth="8" strokeDasharray="1000" strokeDashoffset={1000 - crackDraw} />
                <path d="M 960 400 Q 1000 700 1300 800" fill="none" stroke="#ff2200" strokeWidth="6" strokeDasharray="1000" strokeDashoffset={1000 - crackDraw} />
            </svg>
        </div>
    );
}

const AnimatedGlobe: React.FC<{ stopSpinningAt: number; startSpinningAt?: number }> = ({ stopSpinningAt, startSpinningAt = 999999 }) => {
    const frame = useCurrentFrame();

    let rotation = 0;
    if (frame < stopSpinningAt) {
        rotation = frame * 3;
    } else if (frame >= stopSpinningAt && frame < startSpinningAt) {
        rotation = stopSpinningAt * 3 + interpolate(frame - stopSpinningAt, [0, 20], [0, 10], { extrapolateRight: 'clamp' });
    } else if (frame >= startSpinningAt) {
        rotation = (stopSpinningAt * 3 + 10) + (frame - startSpinningAt) * 3;
    }

    const shake = frame >= stopSpinningAt && frame < stopSpinningAt + 15 ? Math.sin(frame * 5) * 30 : 0;
    const filter = frame >= stopSpinningAt && frame < startSpinningAt ? 'invert(0.2) sepia(1) hue-rotate(-50deg) saturate(3)' : 'none';
    const scale = spring({ frame, fps: 30, config: { damping: 12 }, from: 0, to: 1 });

    return (
        <div style={{
            transform: `scale(${scale}) rotate(${rotation}deg) translateX(${shake}px)`,
            width: 500, height: 500,
            borderRadius: '50%',
            backgroundColor: '#1E90FF',
            boxShadow: 'inset -40px -40px 80px rgba(0,0,0,0.6), 0 0 50px rgba(30, 144, 255, 0.5)',
            overflow: 'hidden',
            position: 'relative',
            filter,
            zIndex: 5
        }}>
            <div style={{ position: 'absolute', width: 250, height: 180, backgroundColor: '#32CD32', borderRadius: '40% 60% 70% 30%', top: 60, left: 40 }} />
            <div style={{ position: 'absolute', width: 300, height: 200, backgroundColor: '#32CD32', borderRadius: '50% 50% 30% 70%', bottom: 30, right: -60 }} />
            <div style={{ position: 'absolute', width: 120, height: 80, backgroundColor: '#32CD32', borderRadius: '60% 40% 50% 50%', top: 300, left: 80 }} />
        </div>
    );
}

const FlyingStickFigure: React.FC<{ startFrame: number }> = ({ startFrame }) => {
    const frame = useCurrentFrame();
    const progress = Math.max(0, frame - startFrame);
    if (progress === 0) return null;

    const x = progress * 40;
    const rotate = progress * 15;

    return (
        <div style={{ position: 'absolute', transform: `translate(${x}px, ${Math.sin(progress / 5) * 100}px) rotate(${rotate}deg)`, left: '-10%', zIndex: 6 }}>
            <svg width="200" height="200" viewBox="0 0 100 100" stroke="#00ffff" strokeWidth="4" fill="none" strokeLinecap="round" style={{ filter: 'drop-shadow(0px 0px 10px #00ffff)' }}>
                <circle cx="50" cy="20" r="10" />
                <line x1="50" y1="30" x2="50" y2="60" />
                <line x1="50" y1="40" x2={50 - 30 * Math.sin(frame)} y2={30 + 10 * Math.cos(frame)} />
                <line x1="50" y1="40" x2={50 + 30 * Math.cos(frame)} y2={20 + 20 * Math.sin(frame)} />
                <line x1="50" y1="60" x2={40 - 20 * Math.cos(frame * 1.5)} y2={90 + 10 * Math.sin(frame)} />
                <line x1="50" y1="60" x2={60 + 20 * Math.sin(frame * 1.5)} y2={85 + 15 * Math.cos(frame)} />
            </svg>
        </div>
    );
};

const SpeedBarGraph: React.FC = () => {
    const frame = useCurrentFrame();
    const fps = 30;

    const h1 = spring({ frame: frame - 20, fps, config: { damping: 12 } }) * 100;
    const h2 = spring({ frame: frame - 40, fps, config: { damping: 12 } }) * 280;
    const h3 = spring({ frame: frame - 60, fps, config: { damping: 12 } }) * 600;

    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', height: 600, gap: 80, marginTop: 150, zIndex: 5 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ color: 'white', marginBottom: 20, fontFamily: 'Outfit', fontSize: 30 }}>70 mph</span>
                <div style={{ width: 120, height: h1, backgroundColor: '#555', borderRadius: '10px 10px 0 0' }} />
                <span style={{ color: '#aaa', marginTop: 20, fontFamily: 'Montserrat', fontSize: 24 }}>Cheetah</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ color: 'white', marginBottom: 20, fontFamily: 'Outfit', fontSize: 30 }}>200 mph</span>
                <div style={{ width: 120, height: h2, backgroundColor: '#888', borderRadius: '10px 10px 0 0' }} />
                <span style={{ color: '#aaa', marginTop: 20, fontFamily: 'Montserrat', fontSize: 24 }}>Bullet Train</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ color: '#00ffff', marginBottom: 20, fontFamily: 'Orbitron', fontSize: 40, fontWeight: 'bold' }}>1,000+ mph</span>
                <div style={{ width: 140, height: h3, backgroundColor: '#00ffff', boxShadow: '0 0 50px #00ffff', borderRadius: '10px 10px 0 0' }} />
                <span style={{ color: 'white', marginTop: 20, fontFamily: 'Montserrat', fontSize: 36, fontWeight: 'bold' }}>Earth's Spin</span>
            </div>
        </div>
    );
};

const CoastlineTsunami: React.FC = () => {
    const frame = useCurrentFrame();
    const waveHeight1 = 50 + Math.sin(frame / 6) * 40;
    const waveHeight2 = 70 + Math.cos(frame / 5) * 50;
    const waveLevel = interpolate(frame, [0, 450], [0, 900], { extrapolateRight: 'clamp' });

    return (
        <div style={{ position: 'absolute', bottom: 0, width: '100%', height: waveLevel, background: 'linear-gradient(to top, #001122, #005588)', opacity: 0.85, zIndex: 5 }}>
            <svg width="100%" height="200" preserveAspectRatio="none" viewBox="0 0 1000 200" style={{ position: 'absolute', top: -190, left: 0 }}>
                <path d={`M 0 120 Q 250 ${120 - waveHeight1} 500 120 T 1000 120 L 1000 200 L 0 200 Z`} fill="rgba(0, 100, 150, 0.6)" />
                <path d={`M 0 150 Q 250 ${150 + waveHeight2} 500 150 T 1000 150 L 1000 200 L 0 200 Z`} fill="#005588" />
                {/* Crashing particles */}
                {[...Array(20)].map((_, i) => (
                    <circle key={i} cx={(frame * (i + 2)) % 1000} cy={100 + Math.sin(frame + i) * 50} r={Math.random() * 10} fill="white" opacity={0.6} />
                ))}
            </svg>
            <div style={{ width: '100%', height: '100%', backgroundColor: '#003355', opacity: 0.5 }} />
        </div>
    );
};

const WindSwirls: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: 0.4 }}>
            {[...Array(12)].map((_, i) => (
                <div key={i} style={{ position: 'absolute', transform: `rotate(${frame * (i * 2 + 3)}deg) scale(2.5)` }}>
                    <svg width="800" height="800" viewBox="0 0 100 100" fill="none" stroke={i % 2 === 0 ? "#ffccaa" : "white"} strokeWidth="1">
                        <path d="M50 50 Q 80 20 50 10 T 20 30" strokeDasharray="150" strokeDashoffset={200 - (frame * 8)} strokeLinecap="round" />
                    </svg>
                </div>
            ))}
        </AbsoluteFill>
    )
};

const TidalLockedVisual: React.FC<{ startFrame: number }> = ({ startFrame }) => {
    const frame = useCurrentFrame();
    const progress = Math.max(0, frame - startFrame);
    if (progress === 0) return null;

    // Animate divider from left to center
    const dividerPosition = spring({ frame: progress, fps: 30, config: { damping: 20 } }) * 960;

    return (
        <AbsoluteFill style={{ flexDirection: 'row' }}>
            {/* Scorched Side */}
            <div style={{ width: dividerPosition, height: '100%', backgroundColor: '#330000', position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ position: 'absolute', width: 800, height: 800, backgroundColor: '#ff5500', borderRadius: '50%', boxShadow: '0 0 150px #ff2200', filter: 'blur(30px)' }} />
                <Title text="BURNING DAY SIDE" fontFamily="BebasNeue" color="#ffaa00" size={90} yOffset={250} delay={startFrame + 15} />
            </div>

            {/* Frozen Side */}
            <div style={{ width: 1920 - dividerPosition, height: '100%', backgroundColor: '#001133', position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', boxShadow: 'inset 0 0 300px rgba(0, 150, 255, 0.8)' }} />
                {[...Array(100)].map((_, i) => (
                    <div key={i} style={{ position: 'absolute', top: (i * 53 + progress * 5) % 1080, left: (i * 71) % 1920, width: 8, height: 8, backgroundColor: 'white', opacity: 0.8, borderRadius: '50%' }} />
                ))}
                <Title text="FROZEN NIGHT SIDE" fontFamily="BebasNeue" color="#66ccff" size={90} yOffset={250} delay={startFrame + 15} />
            </div>
        </AbsoluteFill>
    )
};

const DeadEcosystems: React.FC<{ startFrame: number }> = ({ startFrame }) => {
    const frame = useCurrentFrame();
    const progress = Math.max(0, frame - startFrame);
    if (progress === 0) return null;

    const emojis = ['☠️', '🥀', '🦴', '🏜️', '🔥'];

    return (
        <AbsoluteFill style={{ backgroundColor: '#1a0505', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' }}>
                {[...Array(60)].map((_, i) => {
                    const delay = Math.abs((i * 13) % 40);
                    const scale = spring({ frame: progress - delay, fps: 30, config: { damping: 12 } });
                    return (
                        <div key={i} style={{
                            fontSize: 120 + (i % 3) * 40,
                            position: 'absolute',
                            left: (i * 137) % 1920,
                            top: (i * 93) % 1080,
                            transform: `scale(${scale}) rotate(${(i % 2 === 0 ? 1 : -1) * (progress * 0.5)}deg)`,
                            filter: 'drop-shadow(0 0 20px rgba(255,50,0,0.5))',
                            opacity: scale,
                        }}>
                            {emojis[i % emojis.length]}
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    )
};

const BlowingTrees: React.FC<{ startFrame: number }> = ({ startFrame }) => {
    const frame = useCurrentFrame();
    const progress = Math.max(0, frame - startFrame);
    if (progress === 0) return null;

    return (
        <AbsoluteFill>
            {[...Array(20)].map((_, i) => {
                const x = ((i * 150) + progress * 30) % 2500 - 200;
                const y = 700 + Math.sin(i) * 150 + (progress > 50 ? (progress - 50) * 3 : 0);
                const rotate = 45 + progress * 4 + i * 20;
                return (
                    <div key={i} style={{ position: 'absolute', top: y, left: x, transform: `rotate(${rotate}deg)`, fontSize: 100, zIndex: 3, filter: 'drop-shadow(0px 0px 5px rgba(0,0,0,0.5))' }}>
                        🌲
                    </div>
                )
            })}
        </AbsoluteFill>
    )
};

const FlyingVehicles: React.FC<{ startFrame: number }> = ({ startFrame }) => {
    const frame = useCurrentFrame();
    const progress = Math.max(0, frame - startFrame);
    if (progress === 0) return null;

    const emojis = ['🚗', '🚕', '🚙', '🚌', '🚑', '🚜', '🛵', '🚛'];

    return (
        <AbsoluteFill>
            {[...Array(15)].map((_, i) => {
                const speed = 40 + (i % 5) * 15;
                const x = (progress * speed + i * 300) % 2800 - 300;
                const y = (i * 123) % 1080;
                const rotate = progress * (i % 3 + 5);
                const emoji = emojis[i % emojis.length];

                return (
                    <div key={i} style={{ position: 'absolute', top: y, left: x, transform: `rotate(${rotate}deg)`, fontSize: 130, zIndex: 4, filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.6))' }}>
                        {emoji}
                    </div>
                );
            })}
        </AbsoluteFill>
    );
};

const ShatteringBuildings: React.FC<{ startFrame: number }> = ({ startFrame }) => {
    const frame = useCurrentFrame();
    const progress = Math.max(0, frame - startFrame);
    if (progress === 0) return null;

    const emojis = ['🏢', '🏨', '🏦', '🏥', '🏛️', '🏬', '🏗️'];

    return (
        <AbsoluteFill style={{ alignItems: 'flex-start', justifyContent: 'center', paddingTop: 600 }}>
            <div style={{ display: 'flex', gap: 100 }}>
                {[...Array(15)].map((_, i) => {
                    const isFlying = progress > i * 8;
                    const flyProgress = isFlying ? progress - (i * 8) : 0;
                    const xOffset = flyProgress * 50;
                    const yOffset = -flyProgress * 20 + flyProgress ** 2 / 3;
                    const rotate = flyProgress * 8;

                    return (
                        <div key={i} style={{
                            fontSize: 200,
                            transform: `translate(${xOffset}px, ${yOffset}px) rotate(${rotate}deg)`,
                            zIndex: 2,
                            filter: 'drop-shadow(5px 5px 15px rgba(0,0,0,0.8))'
                        }}>
                            {emojis[i % emojis.length]}
                        </div>
                    )
                })}
            </div>
        </AbsoluteFill>
    )
};

export const EarthStopsSpinning: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#050505', overflow: 'hidden' }}>
            <FontStyles />
            <Audio src={staticFile('voiceovers/download.wav')} />
            <Audio src={staticFile('sfx/ambient.mp3')} volume={0.15} loop />

            {/* Scene 1: Introduction (0 - 640) ~21 seconds - ENHANCED VISUALS */}
            <Sequence from={0} durationInFrames={640}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: 'radial-gradient(circle, #2a0808 0%, #050505 100%)' }}>
                    <Sequence from={10}>
                        <Audio src={staticFile('sfx/rise.mp3')} volume={0.3} />
                    </Sequence>
                    <Title text="What if the Earth" fontFamily="BebasNeue" color="#ff4444" size={130} yOffset={-300} delay={30} />

                    {/* The Globe stops exactly at frame 130 */}
                    <AnimatedGlobe stopSpinningAt={130} />

                    {/* Immersive Impact Animations triggering rapidly between 4s - 21s */}
                    <RadiatingPulse startFrame={130} color="#ff0000" />
                    <TangentialArrows startFrame={180} />
                    <FlashingRedOverlay startFrame={220} />
                    <FlyingDebris startFrame={260} count={50} />

                    <Title text="Suddenly Stopped Spinning?" fontFamily="SpaceGrotesk" color="#ffffff" size={80} yOffset={320} delay={130} />

                    <Sequence from={240}>
                        <Title text="Science Fiction?" fontFamily="Inter" color="#aaaaaa" size={60} yOffset={-400} delay={0} />
                    </Sequence>
                    <Sequence from={350}>
                        <Title text="Physics are Terrifying." fontFamily="Orbitron" color="#ff0000" size={80} yOffset={-450} delay={0} />
                    </Sequence>
                    <Sequence from={420}>
                        <Title text="Planet Freezes in Place" fontFamily="Montserrat" color="#44aaff" size={90} yOffset={400} delay={0} />
                    </Sequence>
                </AbsoluteFill>
            </Sequence>

            {/* Scene 2: Air/Winds (640 - 1280) ~21 seconds */}
            <Sequence from={640} durationInFrames={640}>
                <ShakeContainer intensity={8} active={true}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: '#001133' }}>
                        <Audio src={staticFile('sfx/glitch.mp3')} volume={0.4} />
                        <Sequence durationInFrames={250}>
                            <Title text="Supersonic Winds" fontFamily="Montserrat" color="#aaaaaa" size={100} yOffset={-350} delay={10} />
                            <SpeedBarGraph />
                        </Sequence>
                        <Sequence from={250} durationInFrames={200}>
                            <AbsoluteFill style={{ background: '#220011' }}>
                                <Title text="Stripping Soil." fontFamily="BebasNeue" color="#ff4444" size={120} yOffset={-150} delay={0} />
                                <WindSwirls />
                                <BlowingTrees startFrame={0} />
                                <FlyingDebris startFrame={0} count={50} />
                            </AbsoluteFill>
                        </Sequence>
                        <Sequence from={450}>
                            <AbsoluteFill style={{ background: '#330000' }}>
                                <Title text="Shredding Cities." fontFamily="SpaceGrotesk" color="#ffccaa" size={140} yOffset={50} delay={0} />
                                <WindSwirls />
                                <FlyingVehicles startFrame={0} />
                                <BlowingTrees startFrame={0} />
                                <FlyingDebris startFrame={0} count={100} />
                            </AbsoluteFill>
                        </Sequence>
                    </AbsoluteFill>
                </ShakeContainer>
            </Sequence>

            {/* Scene 3: Debris & Tearing (1280 - 1920) ~21 seconds */}
            <Sequence from={1280} durationInFrames={640}>
                <ShakeContainer intensity={15} active={true}>
                    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: '#0a0a0a' }}>
                        <Sequence durationInFrames={200}>
                            {[...Array(40)].map((_, i) => (
                                <SpeedLine key={i} delay={i * 3} y={100 + Math.random() * 800} />
                            ))}
                            <ShatteringBuildings startFrame={0} />
                            <Title text="SWEPT AWAY" fontFamily="PlayfairDisplay" color="#ffaa00" size={200} yOffset={-300} delay={30} />
                        </Sequence>
                        <Sequence from={200} durationInFrames={200}>
                            <AbsoluteFill style={{ background: '#1a1a1a' }}>
                                <ShatteringBuildings startFrame={20} />
                                <FlyingVehicles startFrame={0} />
                                <Title text="Anything not bolted down." fontFamily="Orbitron" color="#ffffff" size={90} yOffset={100} delay={0} />
                            </AbsoluteFill>
                        </Sequence>
                        <Sequence from={400}>
                            <AbsoluteFill style={{ background: '#110000' }}>
                                {[...Array(30)].map((_, i) => (
                                    <SpeedLine key={i} delay={i * 2} y={100 + Math.random() * 800} />
                                ))}
                                <FlyingVehicles startFrame={0} />
                                <BlowingTrees startFrame={0} />
                                <FlyingStickFigure startFrame={20} />
                                <FlyingStickFigure startFrame={80} />
                                <Title text="Faster than any Hurricane." fontFamily="BebasNeue" color="#ff2222" size={150} yOffset={0} delay={0} />
                            </AbsoluteFill>
                        </Sequence>
                    </AbsoluteFill>
                </ShakeContainer>
            </Sequence>

            {/* Scene 4: Oceans (1920 - 2560) ~21 seconds - ENHANCED TSUNAMI */}
            <Sequence from={1920} durationInFrames={640}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: '#001a1a' }}>
                    <Sequence from={0}>
                        <Audio src={staticFile('sfx/rise.mp3')} volume={0.5} />
                    </Sequence>

                    <Sequence durationInFrames={300}>
                        <CoastlineTsunami />
                        <Title text="Miles High Tsunamis" fontFamily="PlayfairDisplay" color="#44aaff" size={150} yOffset={-250} delay={30} />
                        <Title text="Swallow coastal cities." fontFamily="Raleway" color="#ffffff" size={70} yOffset={-100} delay={120} />
                    </Sequence>

                    <Sequence from={300} durationInFrames={180}>
                        <AbsoluteFill style={{ background: '#220000' }}>
                            <CoastlineTsunami />
                            <ShatteringBuildings startFrame={0} />
                            <Title text="WATER HAS MASS" fontFamily="BebasNeue" color="#ff44aa" size={160} yOffset={-200} delay={0} />
                        </AbsoluteFill>
                    </Sequence>

                    <Sequence from={480}>
                        <AbsoluteFill style={{ background: '#000033' }}>
                            <CoastlineTsunami />
                            <FlyingVehicles startFrame={0} />
                            <Title text="Cities Vanish" fontFamily="Orbitron" color="#fff" size={120} yOffset={-150} delay={0} />
                        </AbsoluteFill>
                    </Sequence>
                </AbsoluteFill>
            </Sequence>

            {/* Scene 5: Water distribution / Equator (2560 - 3200) ~21 seconds - NEW VISUAL */}
            <Sequence from={2560} durationInFrames={640}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: '#050511' }}>
                    <Sequence durationInFrames={200}>
                        <WaterDrainVisual startFrame={30} />
                        <Title text="Gravity Pulls Oceans" fontFamily="BebasNeue" color="#ffaa00" size={140} yOffset={-350} delay={30} />
                    </Sequence>
                    <Sequence from={200} durationInFrames={200}>
                        <AbsoluteFill>
                            <WaterDrainVisual startFrame={30} />
                            <Title text="Toward the Poles" fontFamily="SpaceGrotesk" color="#88aaff" size={110} yOffset={-200} delay={0} />
                        </AbsoluteFill>
                    </Sequence>
                    <Sequence from={400}>
                        <AbsoluteFill style={{ background: '#100' }}>
                            <WaterDrainVisual startFrame={30} />
                            <Title text="Equator Drains Completely" fontFamily="Outfit" color="#ffffff" size={90} yOffset={100} delay={0} />
                        </AbsoluteFill>
                    </Sequence>
                </AbsoluteFill>
            </Sequence>

            {/* Scene 6: Supercontinent & Drowning (3200 - 3840) ~21 seconds - NEW VISUAL */}
            <Sequence from={3200} durationInFrames={640}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: '#111' }}>
                    <Sequence durationInFrames={200}>
                        <CrackingSupercontinent startFrame={30} />
                        <Title text="BARREN SUPERCONTINENT" fontFamily="Montserrat" color="#ff6644" size={120} yOffset={-350} delay={30} />
                    </Sequence>
                    <Sequence from={200} durationInFrames={200}>
                        <AbsoluteFill style={{ background: '#210' }}>
                            <CrackingSupercontinent startFrame={30} />
                            <Title text="New Deserts Emerge" fontFamily="PlayfairDisplay" color="#cc9966" size={100} yOffset={100} delay={0} />
                        </AbsoluteFill>
                    </Sequence>
                    <Sequence from={400}>
                        <AbsoluteFill style={{ background: '#002' }}>
                            <CoastlineTsunami />
                            <CrackingSupercontinent startFrame={30} />
                            <Title text="Entire Countries Drown" fontFamily="Raleway" color="#44aaff" size={100} yOffset={-200} delay={0} />
                        </AbsoluteFill>
                    </Sequence>
                </AbsoluteFill>
            </Sequence>

            {/* Scene 7: Collapse (3840 - 4400) ~18 seconds */}
            <Sequence from={3840} durationInFrames={560}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: '#050505' }}>
                    <Sequence durationInFrames={300}>
                        <AbsoluteFill>
                            <TidalLockedVisual startFrame={0} />
                            <Title text="Geography Permanently Transformed" fontFamily="SpaceGrotesk" color="#ffffff" size={90} yOffset={-350} delay={30} />
                        </AbsoluteFill>
                    </Sequence>
                    <Sequence from={300}>
                        <AbsoluteFill>
                            <DeadEcosystems startFrame={0} />
                            <Title text="Ecosystems Collapse." fontFamily="BebasNeue" color="#ffffff" size={150} yOffset={-300} delay={0} />
                        </AbsoluteFill>
                    </Sequence>
                </AbsoluteFill>
            </Sequence>

            {/* Scene 8: Hypothetical (4400 - 4950) ~18 seconds */}
            <Sequence from={4400} durationInFrames={550}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: 'radial-gradient(circle, #002200 0%, #050505 100%)' }}>
                    <Title text="PURELY HYPOTHETICAL" fontFamily="Orbitron" color="#55ff55" size={130} yOffset={-300} delay={30} />
                    <AnimatedGlobe stopSpinningAt={10} startSpinningAt={90} />
                    <Title text="It Cannot Happen." fontFamily="Poppins" color="#ffffff" size={80} yOffset={320} delay={200} />
                </AbsoluteFill>
            </Sequence>

            {/* Scene 9: Outro (4950 - 5446) ~16.5 seconds */}
            <Sequence from={4950} durationInFrames={496}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: '#0a0a1a' }}>
                    <Title text="A Delicate Cosmic Balance." fontFamily="Raleway" color="#8ab4f8" size={110} yOffset={-200} delay={30} />
                    <Title text="Keeping our world habitable." fontFamily="Inter" color="#ffffff" size={60} yOffset={50} delay={150} />

                    <Sequence from={300}>
                        <Audio src={staticFile('sfx/pop 2.mp3')} />
                        <Title text="SUBSCRIBE FOR MORE" fontFamily="BebasNeue" color="#ff0000" size={140} yOffset={250} delay={0} />
                    </Sequence>
                </AbsoluteFill>
            </Sequence>
        </AbsoluteFill>
    );
};
