import { AbsoluteFill, useVideoConfig, useCurrentFrame, interpolate, spring, Sequence } from 'remotion';
import React from 'react';

const NeuralNode: React.FC<{ x: number; y: number; delay: number }> = ({ x, y, delay }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const opacity = interpolate(
        frame,
        [delay, delay + 30, delay + 120, delay + 150],
        [0, 1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    const scale = spring({
        frame: frame - delay,
        fps,
        config: { stiffness: 100 },
    });

    return (
        <circle
            cx={x}
            cy={y}
            r={10 * scale}
            fill="#58a6ff"
            opacity={opacity}
        />
    );
};

const NeuralNetwork: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ backgroundColor: '#0d1117', justifyContent: 'center', alignItems: 'center' }}>
            <svg width="100%" height="100%" viewBox="0 0 1000 1000">
                <NeuralNode x={200} y={200} delay={0} />
                <NeuralNode x={400} y={300} delay={10} />
                <NeuralNode x={600} y={200} delay={20} />
                <NeuralNode x={800} y={400} delay={30} />
                <NeuralNode x={300} y={600} delay={40} />
                <NeuralNode x={500} y={500} delay={50} />
                <NeuralNode x={700} y={700} delay={60} />
            </svg>
            <h1 style={{
                position: 'absolute',
                color: 'white',
                fontFamily: 'Inter, sans-serif',
                fontSize: 80,
                fontWeight: 700,
                textAlign: 'center',
                opacity: interpolate(frame, [0, 60], [0, 1], { extrapolateRight: 'clamp' })
            }}>
                Why Humans Forget
            </h1>
        </AbsoluteFill>
    );
};

const EbbinghausGraph: React.FC = () => {
    const frame = useCurrentFrame();

    // The curve: y = 100 * e^(-t/S) -> simplified for animation
    const bars = [100, 80, 60, 45, 33, 25, 21];

    return (
        <AbsoluteFill style={{ backgroundColor: '#0d1117', padding: 100 }}>
            <h2 style={{ color: 'white', fontFamily: 'Inter', fontSize: 40, marginBottom: 40 }}>
                The Forgetting Curve
            </h2>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, height: 400 }}>
                {bars.map((height, i) => {
                    const progress = spring({
                        frame: frame - (i * 10),
                        fps: 30,
                        config: { damping: 12 }
                    });

                    // Melting effect: The bar shrinks downward
                    const currentHeight = interpolate(frame, [150 + (i * 5), 300], [height, height * 0.2], {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'clamp'
                    });

                    return (
                        <div key={i} style={{
                            width: 60,
                            height: `${currentHeight}%`,
                            background: 'linear-gradient(180deg, #58a6ff 0%, #1f6feb 100%)',
                            borderRadius: '8px 8px 0 0',
                            opacity: progress,
                            transform: `scaleY(${progress})`,
                            transformOrigin: 'bottom',
                            position: 'relative',
                            boxShadow: '0 0 20px rgba(88, 166, 255, 0.3)'
                        }}>
                            <span style={{
                                position: 'absolute',
                                top: -30,
                                width: '100%',
                                textAlign: 'center',
                                color: 'white',
                                fontSize: 14,
                                opacity: i === 0 ? 1 : 0.6
                            }}>
                                {i === 0 ? '100%' : `${Math.round(currentHeight)}%`}
                            </span>
                        </div>
                    );
                })}
            </div>
            <p style={{ color: '#8b949e', marginTop: 40, fontSize: 24, maxWidth: 600 }}>
                Within 1 hour, you've already lost over 50% of the data.
            </p>
        </AbsoluteFill>
    );
};

export const WhyHumansForget: React.FC = () => {
    return (
        <AbsoluteFill>
            <Sequence from={0} durationInFrames={150}>
                <NeuralNetwork />
            </Sequence>
            <Sequence from={150} durationInFrames={300}>
                <EbbinghausGraph />
            </Sequence>
        </AbsoluteFill>
    );
};
