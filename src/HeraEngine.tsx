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
import { VisualIcon, VisualType } from './components/MotionLibrary';

// --- TYPES ---

export interface HeraEvent {
    id: string;
    start: number;       // Start time in seconds
    duration: number;    // Duration in seconds
    type: 'highlight' | 'icon-only' | 'split';
    text?: string;
    icon?: VisualType;
    color?: string;
    sfx?: string;
    x?: string;
    y?: string;
}

export interface HeraManifest {
    bgVideo: string;
    events: HeraEvent[];
}

// --- SUB-COMPONENTS ---

const AutoWord: React.FC<{ text: string; color: string }> = ({ text, color }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const spr = spring({ frame, fps, config: { damping: 10, stiffness: 100 } });

    return (
        <div style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 140,
            fontWeight: 900,
            color,
            textTransform: 'uppercase',
            textShadow: '0 0 50px rgba(0,0,0,0.8)',
            opacity: interpolate(frame, [0, 10], [0, 1]),
            transform: `scale(${interpolate(spr, [0, 1], [0.8, 1])})`,
            letterSpacing: -8
        }}>
            {text}
        </div>
    );
};

const HeraScene: React.FC<HeraEvent> = (event) => {
    return (
        <AbsoluteFill>
            {/* Automatic SFX */}
            {event.sfx && <Audio src={staticFile(`sfx/${event.sfx}`)} volume={0.5} />}

            {/* Automatic Layouts */}
            <div style={{
                position: 'absolute',
                left: event.x || '50%',
                top: event.y || '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 40,
                zIndex: 100
            }}>
                {event.icon && <VisualIcon type={event.icon} size={400} color={event.color} />}
                {event.text && <AutoWord text={event.text} color={event.color || 'white'} />}
            </div>
        </AbsoluteFill>
    );
};

// --- THE ENGINE ---

export const HeraEngine: React.FC<{ manifest: HeraManifest }> = ({ manifest }) => {
    const { fps, durationInFrames } = useVideoConfig();
    const frame = useCurrentFrame();

    // Global Cinematic Zoom
    const zoom = interpolate(frame, [0, durationInFrames], [1, 1.1]);

    return (
        <AbsoluteFill style={{ backgroundColor: 'black', overflow: 'hidden' }}>
            {/* Background Layer */}
            <div style={{ transform: `scale(${zoom})`, width: '100%', height: '100%' }}>
                <Video
                    src={staticFile(manifest.bgVideo)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    delayRenderTimeoutInMilliseconds={60000}
                />
            </div>

            {/* Global Visual Polish */}
            <AbsoluteFill style={{
                background: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.6) 130%)',
                pointerEvents: 'none'
            }} />

            {/* AUTOMATED TIMELINE */}
            {manifest.events.map((event) => (
                <Sequence
                    key={event.id}
                    from={Math.floor(event.start * fps)}
                    durationInFrames={Math.floor(event.duration * fps)}
                >
                    <HeraScene {...event} />
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};
