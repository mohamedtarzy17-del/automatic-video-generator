import React from 'react';
import {
    AbsoluteFill,
    useVideoConfig,
    Audio,
    Video,
    staticFile,
    Series,
    Sequence,
    interpolate,
    useCurrentFrame,
    spring,
    Easing
} from 'remotion';

const THEME = {
    white: '#FFFFFF',
    accent: '#00FFCC',
    bg: '#000000',
    danger: '#FF3366',
    soft: 'rgba(255, 255, 255, 0.1)',
};

const FontStyles: React.FC = () => (
    <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&display=swap');
        `}
    </style>
);

// --- Motion Graphic Components ---

const KineticText: React.FC<{ text: string; delay?: number; color?: string }> = ({ text, delay = 0, color = THEME.white }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const p = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 10, stiffness: 100 } });

    return (
        <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 20,
            pointerEvents: 'none',
            transform: `scale(${interpolate(p, [0, 1], [0.8, 1.2])})`,
            opacity: interpolate(p, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
        }}>
            <h1 style={{
                fontFamily: 'Outfit',
                fontSize: 250,
                fontWeight: 900,
                color,
                textTransform: 'uppercase',
                margin: 0,
                letterSpacing: -10,
                textShadow: '0 10px 50px rgba(0,0,0,0.8)',
                filter: `blur(${interpolate(p, [0.8, 1], [0, 20])}px)`
            }}>
                {text}
            </h1>
        </div>
    );
};

const GrowthGraph: React.FC<{ delay?: number }> = ({ delay = 30 }) => {
    const frame = useCurrentFrame();
    const progress = interpolate(frame - delay, [0, 100], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

    return (
        <div style={{ position: 'absolute', bottom: 250, right: 100, width: 400, height: 200, zIndex: 30 }}>
            <div style={{ fontFamily: 'JetBrains Mono', color: THEME.accent, fontSize: 14, marginBottom: 10 }}>GLOBAL_SENTIMENT_TRACKER</div>
            <svg width="400" height="150" style={{ overflow: 'visible' }}>
                <path
                    d={`M 0 150 Q 100 ${150 - progress * 100} 400 ${150 - progress * 140}`}
                    stroke={THEME.accent}
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="1000"
                    strokeDashoffset={1000 - progress * 1000}
                />
                <circle cx={progress * 400} cy={150 - progress * 140} r="6" fill={THEME.accent} />
            </svg>
            <div style={{ color: THEME.white, fontFamily: 'Outfit', fontSize: 40, fontWeight: 900 }}>
                {Math.floor(progress * 100)}% <span style={{ fontSize: 16, opacity: 0.6 }}>SUPPORT</span>
            </div>
        </div>
    );
};

const SocialBlast: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
            {[...Array(15)].map((_, i) => {
                const p = interpolate(frame, [i * 5, i * 5 + 30], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
                return (
                    <div key={i} style={{
                        position: 'absolute',
                        left: `${(i * 27) % 100}%`,
                        top: `${(i * 31) % 100}%`,
                        fontSize: 40,
                        opacity: interpolate(p, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
                        transform: `scale(${p}) translateY(${interpolate(p, [0, 1], [20, -100])}px)`
                    }}>
                        {i % 3 === 0 ? '❤️' : i % 3 === 1 ? '👍' : '💬'}
                    </div>
                );
            })}
        </AbsoluteFill>
    );
};

const DonationImpact: React.FC = () => {
    const frame = useCurrentFrame();
    const grow = spring({ frame, fps: 30, config: { damping: 15 } });

    return (
        <div style={{ position: 'absolute', top: 200, right: 100, width: 300, zIndex: 100 }}>
            <div style={{ fontFamily: 'JetBrains Mono', color: THEME.bg, background: THEME.white, padding: '5px 10px', fontSize: 12 }}>ZOO_BUDGET_IMPACT</div>
            <div style={{ height: 400, width: 60, background: 'rgba(0,0,0,0.2)', position: 'relative', marginTop: 10 }}>
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    background: THEME.bg,
                    height: `${grow * 90}%`,
                    transition: 'height 0.5s ease-out'
                }} />
                <div style={{ position: 'absolute', top: -30, color: THEME.bg, fontWeight: 900, fontFamily: 'Outfit' }}>$100K</div>
            </div>
        </div>
    );
};

const ConnectionNode: React.FC = () => {
    const frame = useCurrentFrame();
    const pulse = Math.sin(frame / 5) * 0.2 + 1;
    return (
        <svg width="400" height="200" viewBox="0 0 400 200" style={{ position: 'absolute', top: 100, left: '50%', transform: 'translateX(-50%)' }}>
            <circle cx="100" cy="100" r={20 * pulse} fill={THEME.white} />
            <circle cx="300" cy="100" r={20 * pulse} fill={THEME.white} />
            <line
                x1="120" y1="100" x2="280" y2="100"
                stroke={THEME.white}
                strokeWidth="4"
                strokeDasharray="10 10"
                style={{ opacity: interpolate(frame, [0, 30], [0, 0.8]) }}
            />
            {frame > 60 && <line x1="190" y1="80" x2="210" y2="120" stroke={THEME.danger} strokeWidth="8" />}
        </svg>
    );
};

// --- Base Components ---

const Caption: React.FC<{ text: string }> = ({ text }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
    const y = spring({ frame, fps, config: { damping: 12 } });
    if (!text) return null;
    return (
        <div style={{ position: 'absolute', bottom: 120, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 10, opacity }}>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.8)', padding: '15px 35px', borderRadius: 12, transform: `translateY(${interpolate(y, [0, 1], [15, 0])}px)` }}>
                <span style={{ color: THEME.white, fontFamily: 'Outfit', fontSize: 42, fontWeight: 900, textAlign: 'center', textTransform: 'uppercase', letterSpacing: -1 }}>
                    {text}
                </span>
            </div>
        </div>
    );
};

const VideoClip: React.FC<{ src: string; caption: string; children?: React.ReactNode }> = ({ src, caption, children }) => {
    return (
        <AbsoluteFill>
            <Video src={staticFile(`punch_monkey/22-02/${src}`)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.6) 100%)' }} />
            <Caption text={caption} />
            {children}
        </AbsoluteFill>
    );
};

export const PunchStoryManual: React.FC = () => {
    const { fps } = useVideoConfig();
    const clipDuration = Math.floor(5.208 * fps);

    const clips = [
        { src: "1slow-cinematic-drone-push-in-toward-a-quiet-japane.mp4", text: "In a quiet zoo in Japan..." }, // i=0
        { src: "2_Cut-to-slow-handheld-push-in-toward-a-tiny-baby-ma_a.mp4", text: "Meet Punch-kun." },
        { src: "3_Match-cut-to-over-the-shoulder-shot-of-an-adult-ma_a.mp4", text: "His mother rejected him." },
        { src: "4_Downward-tilt-to-reveal-the-small-monkey-curled-in_a.mp4", text: "No warmth. No protection." },
        { src: "5_Soft-crossfade-to-close-shot-of-zookeeper-hands-pl_a.mp4", text: "Zookeepers did something unusual." },
        { src: "6_Tight-close-up-slow-zoom-as-the-baby-macaque-hugs-_a.mp4", text: "They gave him a stuffed toy." },
        { src: "7_Gentle-top-down-shot-of-the-monkey-sleeping-with-t_a.mp4", text: "He held onto it like his world." },
        { src: "8_Tracking-shot-following-the-monkey-dragging-the-to_a.mp4", text: "Without a mother, the toy became one." },
        { src: "9_Wide-shot-of-the-group-of-monkeys-as-the-baby-appr_a.mp4", text: "At first, nobody noticed." },
        { src: "10_Quick-cut-to-adult-monkey-brushing-past-slight-whi_a.mp4", text: "Then one video changed everything." }, // i=9
        { src: "11_Slow-motion-stumble-moment-camera-dips-slightly-as_a.mp4", text: "Punch approached the others..." },
        { src: "12_Extreme-close-up-of-anxious-face-slow-digital-zoom_a.mp4", text: "But he was pushed away." },
        { src: "13_Fast-snap-zoom-as-the-monkey-grabs-the-toy-speed-r_a.mp4", text: "Million of hearts shattered." }, // i=12
        { src: "14_Cut-to-low-angle-shot-of-monkey-hiding-behind-rock_a.mp4", text: "Punch grabbed his toy and hid." },
        { src: "15_Wide-isolation-shot-slow-zoom-out-to-make-the-monk_a.mp4", text: "Running to a parent who wasn't real." },
        { src: "16_Hard-cut-to-smartphone-screen-in-dark-room-camera-_a.mp4", text: "The clip exploded online." }, // i=15
        { src: "17_Fast-montage-transition-of-multiple-screens-slidin_a.mp4", text: "The world wanted to protect him." },
        { src: "18_Cut-to-crowd-at-enclosure-slow-horizontal-pan-acro_a.mp4", text: "Hang in there, Punch." },
        { src: "19_Medium-shot-of-monkey-looking-toward-visitors-slow_a.mp4", text: "Then, the unexpected happened." },
        { src: "20_Cut-to-tentative-interaction-with-another-young-mo_a.mp4", text: "Punch didn't stay alone." },
        { src: "21_Close-shot-of-grooming-behavior-slow-circular-orbi_a.mp4", text: "They began to groom him." },
        { src: "22_Two-monkeys-sitting-together-locked-off-shot-with-_a.mp4", text: "A real connection at last." },
        { src: "23_animate_a.mp4", text: "He doesn't face it alone." },
        { src: "24_Final-cinematic-close-up-of-the-monkey-hugging-the_a.mp4", text: "The internet just... cared." }
    ];

    return (
        <AbsoluteFill style={{ backgroundColor: '#000' }}>
            <FontStyles />
            <Audio src={staticFile("punch_monkey/22-02/punch.wav")} />
            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.1} />

            <Series>
                {clips.map((clip, i) => (
                    <Series.Sequence key={i} durationInFrames={clipDuration}>
                        {/* Audio SFX */}
                        {i === 0 && <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.6} />}
                        {i === 9 && <Audio src={staticFile("sfx/rise.mp3")} volume={0.5} />}
                        {i === 12 && <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.6} />}
                        {i === 15 && <Audio src={staticFile("sfx/pop.mp3")} volume={0.4} />}
                        {i === 23 && <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.4} startFrom={10} />}

                        <VideoClip src={clip.src} caption={clip.text}>
                            {/* Level 2 Visual Elements */}
                            {i === 2 && <KineticText text="REJECTED" color={THEME.danger} />}
                            {i === 3 && <ConnectionNode />}
                            {i === 12 && <KineticText text="SHATTERED" />}
                            {i === 15 && <SocialBlast />}
                            {i === 16 && <GrowthGraph />}
                            {i === 17 && <DonationImpact />}
                            {i === 23 && <KineticText text="BELONG" color={THEME.accent} />}
                        </VideoClip>
                    </Series.Sequence>
                ))}
            </Series>
        </AbsoluteFill>
    );
};
