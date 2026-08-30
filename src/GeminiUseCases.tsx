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

const Title: React.FC<{ text: string; color?: string; fontFamily: string }> = ({ text, color = 'white', fontFamily }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const opacity = spring({
        frame,
        fps,
        config: {
            damping: 12,
        },
    });

    const scale = spring({
        frame: frame - 5,
        fps,
        config: {
            mass: 0.5,
            damping: 10,
        },
        from: 0.8,
        to: 1,
    });

    const translateY = interpolate(opacity, [0, 1], [50, 0]);

    return (
        <div
            style={{
                opacity,
                transform: `translateY(${translateY}px) scale(${scale})`,
                fontSize: 120,
                fontWeight: 'bold',
                color,
                fontFamily,
                textAlign: 'center',
                textShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
        >
            {text}
        </div>
    );
};

const FloatingSVG: React.FC<{ delay: number; color: string; type: 'circle' | 'triangle' | 'square' }> = ({ delay, color, type }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const y = Math.sin((frame - delay) / 30) * 50;
    const rotation = (frame - delay) * 2;
    const opacity = spring({ frame: frame - delay, fps, config: { damping: 12 } });

    return (
        <div style={{ position: 'absolute', opacity, transform: `translateY(${y}px) rotate(${rotation}deg)` }}>
            <svg width="200" height="200" viewBox="0 0 100 100" fill={color}>
                {type === 'circle' && <circle cx="50" cy="50" r="40" />}
                {type === 'triangle' && <polygon points="50,10 90,90 10,90" />}
                {type === 'square' && <rect x="20" y="20" width="60" height="60" rx="10" />}
            </svg>
        </div>
    );
};

export const GeminiUseCases: React.FC = () => {
    const { durationInFrames } = useVideoConfig();

    return (
        <AbsoluteFill style={{ backgroundColor: '#0a0a1a', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
            <FontStyles />
            <Audio src={staticFile('sfx/ambient.mp3')} volume={0.3} />

            {/* Scene 1: Coding Use Case */}
            <Sequence from={0} durationInFrames={75}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Audio src={staticFile('sfx/whoosh.mp3')} />
                    <Audio src={staticFile('sfx/typing.mp3')} volume={0.5} startFrom={10} endAt={75} />
                    <div style={{ position: 'absolute', top: '10%', left: '10%' }}>
                        <FloatingSVG delay={10} color="rgba(46, 138, 234, 0.4)" type="circle" />
                    </div>
                    <div style={{ position: 'absolute', bottom: '20%', right: '15%' }}>
                        <FloatingSVG delay={30} color="rgba(197, 138, 249, 0.4)" type="square" />
                    </div>
                    <Title text="Code Smarter." fontFamily="Orbitron" color="#8ab4f8" />
                </AbsoluteFill>
            </Sequence>

            {/* Scene 2: Data Analysis Use Case */}
            <Sequence from={75} durationInFrames={75}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Audio src={staticFile('sfx/whoosh.mp3')} />
                    <Audio src={staticFile('sfx/pop.mp3')} />
                    <div style={{ position: 'absolute', top: '20%', right: '10%' }}>
                        <FloatingSVG delay={10} color="rgba(234, 67, 53, 0.4)" type="triangle" />
                    </div>
                    <div style={{ position: 'absolute', bottom: '15%', left: '15%' }}>
                        <FloatingSVG delay={25} color="rgba(251, 188, 5, 0.4)" type="circle" />
                    </div>
                    <Title text="Insightful Data." fontFamily="SpaceGrotesk" color="#fbbc05" />
                </AbsoluteFill>
            </Sequence>

            {/* Scene 3: Creativity Use Case */}
            <Sequence from={150} durationInFrames={75}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Audio src={staticFile('sfx/whoosh.mp3')} />
                    <Audio src={staticFile('sfx/rise.mp3')} volume={0.8} />
                    <div style={{ position: 'absolute', top: '30%', left: '30%' }}>
                        <FloatingSVG delay={5} color="rgba(52, 168, 83, 0.4)" type="square" />
                    </div>
                    <div style={{ position: 'absolute', bottom: '30%', right: '30%' }}>
                        <FloatingSVG delay={20} color="rgba(138, 43, 226, 0.4)" type="triangle" />
                    </div>
                    <Title text="Limitless Creativity." fontFamily="PlayfairDisplay" color="#c58af9" />
                </AbsoluteFill>
            </Sequence>

            {/* Scene 4: Conclusion & Logo */}
            <Sequence from={225} durationInFrames={150}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Audio src={staticFile('sfx/whoosh.mp3')} />
                    <Audio src={staticFile('sfx/pop 2.mp3')} />

                    <div style={{ position: 'absolute', top: '10%', right: '20%' }}>
                        <FloatingSVG delay={0} color="rgba(66, 133, 244, 0.3)" type="circle" />
                    </div>
                    <div style={{ position: 'absolute', bottom: '10%', left: '20%' }}>
                        <FloatingSVG delay={15} color="rgba(234, 67, 53, 0.3)" type="square" />
                    </div>
                    <div style={{ position: 'absolute', top: '15%', left: '10%' }}>
                        <FloatingSVG delay={30} color="rgba(251, 188, 5, 0.3)" type="triangle" />
                    </div>
                    <div style={{ position: 'absolute', bottom: '15%', right: '10%' }}>
                        <FloatingSVG delay={45} color="rgba(52, 168, 83, 0.3)" type="circle" />
                    </div>

                    <Title text="Google Gemini" fontFamily="BebasNeue" color="#ffffff" />
                    <Sequence from={240}>
                        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{
                                fontSize: 40,
                                color: '#8ab4f8',
                                marginTop: 180,
                                fontFamily: 'Montserrat',
                            }}>
                                The Future of Work.
                            </div>
                        </AbsoluteFill>
                    </Sequence>
                    <Sequence from={260}>
                        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{
                                fontSize: 30,
                                color: 'white',
                                marginTop: 280,
                                fontFamily: 'Outfit',
                                opacity: 0.7
                            }}>
                                Available Now
                            </div>
                        </AbsoluteFill>
                    </Sequence>
                </AbsoluteFill>
            </Sequence>
        </AbsoluteFill>
    );
};
