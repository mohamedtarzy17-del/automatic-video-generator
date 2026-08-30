import React from 'react';
import { AbsoluteFill, Video, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

const THEME = {
    blue: '#2E8AEA',
    dark: '#0a0a1a',
    accent: '#00f2ff',
    white: '#ffffff',
    glass: 'rgba(255, 255, 255, 0.1)',
};

const HUDPanel: React.FC<{ title: string; children: React.ReactNode; x: number; y: number; width: number; height: number; delay: number }> = ({ title, children, x, y, width, height, delay }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const entrance = spring({ frame: frame - delay, fps, config: { damping: 12 } });

    return (
        <div style={{
            position: 'absolute',
            left: x,
            top: y,
            width: width * entrance,
            height: height * entrance,
            opacity: entrance,
            backgroundColor: 'rgba(10, 10, 40, 0.7)',
            border: `2px solid ${THEME.accent}`,
            borderRadius: 12,
            backdropFilter: 'blur(10px)',
            overflow: 'hidden',
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: `0 0 20px ${THEME.accent}44`
        }}>
            <div style={{ color: THEME.accent, fontFamily: 'JetBrains Mono', fontSize: 14, marginBottom: 10, borderBottom: `1px solid ${THEME.accent}44` }}>
                {title} // SECURE_LINK
            </div>
            {children}
        </div>
    );
};

const BarGraph: React.FC<{ x: number, y: number, delay: number }> = ({ x, y, delay }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    return (
        <HUDPanel title="SIGNAL_STRENGTH_MONITOR" x={x} y={y} width={300} height={200} delay={delay}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: '100%' }}>
                {[60, 80, 45, 95, 70].map((h, i) => {
                    const progress = spring({ frame: frame - delay - (i * 5), fps, config: { damping: 15 } });
                    return (
                        <div key={i} style={{
                            width: 30,
                            height: `${h * progress}%`,
                            backgroundColor: THEME.accent,
                            borderRadius: '4px 4px 0 0',
                            boxShadow: `0 0 10px ${THEME.accent}`
                        }} />
                    );
                })}
            </div>
        </HUDPanel>
    );
};

export const TimeZoneEnhancement: React.FC = () => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill style={{ backgroundColor: THEME.dark }}>
            {/* The base "Manual" clip */}
            <Video src={staticFile("sample/timezone_base.mp4")} />

            {/* Programmatic Overlays */}

            {/* Title Overlay */}
            <div style={{
                position: 'absolute',
                top: 80,
                left: 100,
                opacity: interpolate(frame, [0, 20], [0, 1])
            }}>
                <div style={{ color: THEME.white, fontFamily: 'Outfit', fontSize: 80, fontWeight: 900, textTransform: 'uppercase', letterSpacing: -2 }}>
                    Global <span style={{ color: THEME.accent }}>Sync</span>
                </div>
                <div style={{ color: THEME.accent, fontFamily: 'JetBrains Mono', fontSize: 24 }}>
                    {"> COORDINATED_UNIVERSAL_TIME_ACTIVE"}
                </div>
            </div>

            {/* Sidebar Dashboard */}
            <HUDPanel title="TIMEZONE_ADAPTATION" x={1450} y={100} width={400} height={400} delay={60}>
                <div style={{ color: '#fff', fontFamily: 'JetBrains Mono', fontSize: 16, lineHeight: 2 }}>
                    UTC_OFFSET: <span style={{ color: THEME.accent }}>+05:30</span><br />
                    ACTIVE_NODES: 4,821<br />
                    DATA_DRIFT: 0.002ms<br />
                    SYNC_MODE: QUANTUM_CLOCK<br />
                    REGION: ASIA_PACIFIC
                </div>
                <div style={{ marginTop: 20, height: 100, border: '1px solid #444', position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, #00f2ff33)',
                        transform: `translateX(${(frame % 150) - 150}%)`
                    }} />
                    <div style={{ color: THEME.accent, fontSize: 10, padding: 5 }}>ALGORITHMIC_TIME_CALIBRATION...</div>
                </div>
            </HUDPanel>

            {/* Info Graph */}
            <BarGraph x={100} y={750} delay={90} />

            {/* Checklist Overlay */}
            <HUDPanel title="SYNC_PROTOCOLS" x={1500} y={700} width={350} height={250} delay={120}>
                {['MAP_COORD_FETCH', 'ISO_TIMESTAMP_CHECK', 'RTC_CALIBRATION', 'GLOBAL_BROADCAST'].map((text, i) => (
                    <div key={i} style={{ color: frame > 120 + i * 15 ? THEME.accent : '#444', fontFamily: 'JetBrains Mono', fontSize: 16, marginBottom: 5 }}>
                        {frame > 120 + i * 15 ? '✓' : '•'} {text}
                    </div>
                ))}
            </HUDPanel>

            {/* Bottom HUD */}
            <div style={{ position: 'absolute', bottom: 50, left: 100, color: THEME.accent, fontFamily: 'JetBrains Mono', opacity: 0.8 }}>
                [ SYSTEM_STRIATED_MONITOR_ACTIVE ]
            </div>
        </AbsoluteFill>
    );
};
