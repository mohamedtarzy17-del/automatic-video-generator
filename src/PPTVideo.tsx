import React from 'react';
import {
    AbsoluteFill,
    useVideoConfig,
    Series,
    interpolate,
    useCurrentFrame,
    spring,
    staticFile,
    Img
} from 'remotion';
import slides from '../slides.json';

const THEME = {
    blue: '#2563eb',
    indigo: '#4f46e5',
    purple: '#7c3aed',
    slate: '#0f172a',
    accent: '#10b981',
    white: '#ffffff',
    text: '#f8fafc'
};

const FontStyles: React.FC = () => (
    <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&display=swap');
        `}
    </style>
);

const SlideContent: React.FC<{
    slide: typeof slides[0],
    index: number
}> = ({ slide, index }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const titleSpring = spring({
        frame,
        fps,
        config: { stiffness: 100 }
    });

    return (
        <AbsoluteFill style={{
            backgroundColor: THEME.slate,
            color: THEME.text,
            fontFamily: 'Outfit',
            padding: 60,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            overflow: 'hidden'
        }}>
            {/* Animated Background */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(circle at ${50 + Math.sin(frame / 60) * 10}% ${50 + Math.cos(frame / 60) * 10}%, rgba(37, 99, 235, 0.15) 0%, transparent 70%)`
            }} />

            {/* Header HUD */}
            <div style={{ position: 'absolute', top: 40, left: 60, opacity: 0.6 }}>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 18, color: THEME.accent }}>SLIDE_{String(slide.index).padStart(2, '0')} // PPT_CONVERSION</div>
                <div style={{ height: 2, background: THEME.accent, width: interpolate(frame, [0, 20], [0, 100], { extrapolateRight: 'clamp' }) + '%' }} />
            </div>

            <div style={{ transform: `translateY(${interpolate(titleSpring, [0, 1], [50, 0])}px)`, opacity: titleSpring }}>
                <h1 style={{ fontSize: 80, fontWeight: 900, marginBottom: 40, lineHeight: 1.1 }}>
                    {slide.title || slide.paragraphs[0] || "No Title"}
                </h1>

                <div style={{ display: 'flex', gap: 60, alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                        {slide.paragraphs.slice(slide.title ? 0 : 1).filter(p => p.length > 5).map((p, i) => {
                            const pSpring = spring({
                                frame: frame - (i * 5) - 10,
                                fps,
                                config: { stiffness: 100 }
                            });
                            return (
                                <div key={i} style={{
                                    fontSize: 28,
                                    marginBottom: 20,
                                    opacity: pSpring,
                                    transform: `translateX(${interpolate(pSpring, [0, 1], [20, 0])}px)`,
                                    borderLeft: `4px solid ${THEME.blue}`,
                                    paddingLeft: 20
                                }}>
                                    {p}
                                    {/* Sub-paragraphs or bullet points if any */}
                                </div>
                            );
                        })}
                    </div>

                    {slide.images.length > 0 && (
                        <div style={{ flex: 1, position: 'relative' }}>
                            {slide.images.map((img, i) => {
                                const imgSpring = spring({
                                    frame: frame - 20,
                                    fps,
                                    config: { stiffness: 80 }
                                });
                                return (
                                    <div key={i} style={{
                                        border: `10px solid ${THEME.white}22`,
                                        borderRadius: 20,
                                        overflow: 'hidden',
                                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                                        opacity: imgSpring,
                                        transform: `scale(${interpolate(imgSpring, [0, 1], [0.8, 1])}) rotate(${interpolate(imgSpring, [0, 1], [-2, 0])}deg)`
                                    }}>
                                        <Img src={staticFile(`assets/${img}`)} style={{ width: '100%', height: 'auto', display: 'block' }} />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AbsoluteFill>
    );
};

export const PPTVideo: React.FC = () => {
    const durationPerSlide = 150; // 5 seconds at 30fps

    return (
        <AbsoluteFill>
            <FontStyles />
            <Series>
                {slides.map((slide, i) => (
                    <Series.Sequence key={i} durationInFrames={durationPerSlide}>
                        <SlideContent slide={slide} index={i} />
                    </Series.Sequence>
                ))}
            </Series>
        </AbsoluteFill>
    );
};
