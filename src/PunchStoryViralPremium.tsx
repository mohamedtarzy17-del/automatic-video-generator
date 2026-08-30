import React from 'react';
import {
    AbsoluteFill,
    Sequence,
    Video,
    staticFile,
    useVideoConfig,
    useCurrentFrame,
    interpolate,
    spring,
    Audio,
} from 'remotion';
import {
    ZooIcon,
    HeartIcon,
    InternetIcon,
    ToyIcon,
    SocialIcon,
    ShieldIcon,
    FriendsIcon,
    RockIcon,
    THEME
} from './components/AnimatedSVG';

const SCENE_DURATION = 5.2;

const AudioSFX: React.FC<{ src: string; volume?: number; delay?: number }> = ({ src, volume = 0.5, delay = 0 }) => {
    return (
        <Sequence from={delay}>
            <Audio src={staticFile(`sfx/${src}`)} volume={volume} />
        </Sequence>
    );
};

const Overlay: React.FC<{ children: React.ReactNode; x?: string; y?: string }> = ({ children, x = '50%', y = '50%' }) => (
    <div style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        zIndex: 100,
    }}>
        {children}
    </div>
);

const WordHighlight: React.FC<{ text: string; color?: string }> = ({ text, color = 'white' }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const opacity = interpolate(frame, [0, 10, 140, 150], [0, 1, 1, 0]);
    const scale = spring({ frame, fps, config: { damping: 12 } });

    return (
        <div style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 160,
            fontWeight: 900,
            color,
            textTransform: 'uppercase',
            textShadow: `0 0 60px rgba(0,0,0,0.9), 0 0 20px ${color === 'white' ? 'rgba(255,255,255,0.3)' : color + '44'}`,
            opacity,
            transform: `scale(${scale})`,
            letterSpacing: -5
        }}>
            {text}
        </div>
    );
};

const LightLeak: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{
            background: `radial-gradient(circle at ${50 + Math.sin(frame / 50) * 30}% ${50 + Math.cos(frame / 40) * 30}%, rgba(0, 255, 204, 0.08) 0%, transparent 70%)`,
            mixBlendMode: 'screen',
            pointerEvents: 'none'
        }} />
    );
};

export const PunchStoryViralPremium: React.FC = () => {
    const { fps } = useVideoConfig();

    const getFrame = (seconds: number) => Math.floor(seconds * fps);

    return (
        <AbsoluteFill style={{ backgroundColor: 'black' }}>
            {/* Background Video Analysis: 5.2s Scene Changes */}
            <Video
                src={staticFile("videos/punch_story_manual_revised.mp4")}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            <LightLeak />

            {/* Cinematic Vignette */}
            <AbsoluteFill style={{
                background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.4) 110%)',
                pointerEvents: 'none'
            }} />

            {/* --- SCENE BY SCENE SYNC --- */}

            {/* Scene 0: Introduction (0-5.2s) */}
            <Sequence from={getFrame(0)} durationInFrames={getFrame(SCENE_DURATION)}>
                <Overlay x="85%" y="15%">
                    <ZooIcon size={120} />
                </Overlay>
                <Overlay y="80%">
                    <WordHighlight text="JAPAN ZOO" />
                </Overlay>
                <AudioSFX src="whoosh.mp3" />
            </Sequence>

            {/* Scene 1-2: Punch-kun (5.2-15.6s) */}
            <Sequence from={getFrame(10)} durationInFrames={getFrame(5)}>
                <Overlay>
                    <WordHighlight text="PUNCH-KUN" color={THEME.punch} />
                </Overlay>
                <AudioSFX src="pop.mp3" />
            </Sequence>

            {/* Scene 3: Rejected (15.6-20.8s) - SYNCED TO "His mother rejected him" */}
            <Sequence from={getFrame(15.6)} durationInFrames={getFrame(SCENE_DURATION)}>
                <Overlay x="50%" y="40%">
                    <HeartIcon color={THEME.danger} size={350} />
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) rotate(45deg)',
                        width: 400,
                        height: 30,
                        backgroundColor: 'black',
                        borderRadius: 15
                    }} />
                </Overlay>
                <Overlay y="85%">
                    <WordHighlight text="REJECTED" color={THEME.danger} />
                </Overlay>
                <AudioSFX src="whoosh.mp3" volume={0.8} />
            </Sequence>

            {/* Scene 4: Alone (20.8-26s) */}
            <Sequence from={getFrame(20.8)} durationInFrames={getFrame(SCENE_DURATION)}>
                <Overlay x="20%" y="20%">
                    <ShieldIcon size={150} />
                </Overlay>
                <Overlay y="80%">
                    <WordHighlight text="NO PROTECTION" />
                </Overlay>
                <AudioSFX src="pop 2.mp3" />
            </Sequence>

            {/* Scene 6: The Toy (31.2-36.4s) - SYNCED TO "They gave him a stuffed toy" */}
            <Sequence from={getFrame(31.2)} durationInFrames={getFrame(SCENE_DURATION)}>
                <Overlay x="75%" y="25%">
                    <ToyIcon size={250} />
                </Overlay>
                <Overlay y="75%">
                    <WordHighlight text="PLUSHIE" color={THEME.punch} />
                </Overlay>
                <AudioSFX src="pop.mp3" />
            </Sequence>

            {/* Scene 10: The Viral Moment (52s) - SYNCED TO "One video changed everything" */}
            <Sequence from={getFrame(52)} durationInFrames={getFrame(SCENE_DURATION)}>
                <Overlay>
                    <InternetIcon size={300} />
                </Overlay>
                <Overlay y="85%">
                    <WordHighlight text="VIRAL" color={THEME.accent} />
                </Overlay>
                <AudioSFX src="rise.mp3" volume={0.6} />
            </Sequence>

            {/* Scene 13: Heartbreak (67.6s) - SYNCED TO "Shattered millions of hearts" */}
            <Sequence from={getFrame(67.6)} durationInFrames={getFrame(SCENE_DURATION)}>
                <Overlay>
                    <HeartIcon size={500} />
                </Overlay>
                <Overlay y="85%">
                    <WordHighlight text="SHATTERED" color={THEME.danger} />
                </Overlay>
                <AudioSFX src="whoosh.mp3" volume={1} />
            </Sequence>

            {/* Scene 14: Hidden (72.8s) - SYNCED TO "hid behind a rock" */}
            <Sequence from={getFrame(72.8)} durationInFrames={getFrame(SCENE_DURATION)}>
                <Overlay x="20%" y="70%">
                    <RockIcon size={200} />
                </Overlay>
                <Overlay y="20%">
                    <WordHighlight text="HIDING" />
                </Overlay>
                <AudioSFX src="pop 2.mp3" />
            </Sequence>

            {/* Scene 16: Social Explosion (83.2s) - SYNCED TO "Exploded across social media" */}
            <Sequence from={getFrame(83.2)} durationInFrames={getFrame(SCENE_DURATION * 2)}>
                <AbsoluteFill>
                    {[...Array(12)].map((_, i) => (
                        <div key={i} style={{
                            position: 'absolute',
                            left: `${Math.random() * 80 + 10}%`,
                            top: `${Math.random() * 80 + 10}%`,
                        }}>
                            <SocialIcon delay={i * 3} size={100} />
                        </div>
                    ))}
                </AbsoluteFill>
                <Overlay>
                    <WordHighlight text="SUPPORT" color={THEME.accent} />
                </Overlay>
                <AudioSFX src="typing.mp3" volume={0.4} />
                <AudioSFX src="pop.mp3" delay={getFrame(0.5)} />
            </Sequence>

            {/* Scene 20: Connection (104s) - SYNCED TO "One even hugged him" */}
            <Sequence from={getFrame(104)} durationInFrames={getFrame(SCENE_DURATION)}>
                <Overlay x="50%" y="40%">
                    <div style={{ display: 'flex', gap: 150, alignItems: 'center' }}>
                        <FriendsIcon size={150} />
                        <div style={{ width: 100, height: 4, backgroundColor: 'white', opacity: 0.8 }} />
                        <HeartIcon size={150} color={THEME.accent} />
                    </div>
                </Overlay>
                <Overlay y="80%">
                    <WordHighlight text="CONNECTED" color={THEME.accent} />
                </Overlay>
                <AudioSFX src="pop.mp3" />
            </Sequence>

            {/* Scene 23: Finale (119.6s) - SYNCED TO "The internet... cared" */}
            <Sequence from={getFrame(119.6)} durationInFrames={getFrame(SCENE_DURATION)}>
                <Overlay>
                    <HeartIcon size={700} color={THEME.accent} />
                </Overlay>
                <Overlay>
                    <WordHighlight text="THEY CARED" />
                </Overlay>
                <AudioSFX src="whoosh.mp3" volume={0.6} />
            </Sequence>

        </AbsoluteFill>
    );
};
