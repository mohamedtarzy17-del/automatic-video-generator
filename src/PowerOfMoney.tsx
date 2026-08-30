import React from 'react';
import {
    AbsoluteFill,
    Sequence,
    useCurrentFrame,
    spring,
    interpolate,
    Audio,
    Video,
    staticFile,
} from 'remotion';
import { FONT_IMPORT, getFontForScene, FONT_STACK } from './components/PremiumKit';

// Ensure fonts are loaded
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.innerHTML = FONT_IMPORT;
    document.head.appendChild(style);
}

const COLORS = {
    darkCharcoal: '#0A0E17',
    goldAccent: '#F59E0B',
    greenMatrix: '#10B981',
    glassLight: 'rgba(255, 255, 255, 0.05)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
};

const VaultComponent: React.FC = () => {
    const frame = useCurrentFrame();
    const anim = spring({ frame, fps: 30, config: { damping: 200 } });

    const strokeAnim = interpolate(anim, [0, 1], [1000, 0], { extrapolateRight: 'clamp' });
    const spinAnim = interpolate(frame, [0, 150], [0, 180]);

    return (
        <svg width="400" height="400" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke={COLORS.goldAccent} strokeWidth="2" fill="none" strokeDasharray="1000" strokeDashoffset={strokeAnim} />
            <circle cx="50" cy="50" r="35" stroke={COLORS.greenMatrix} strokeWidth="4" fill="none" strokeDasharray="1000" strokeDashoffset={strokeAnim} />
            <g transform={`rotate(${spinAnim} 50 50)`}>
                <line x1="50" y1="15" x2="50" y2="85" stroke="rgba(255,255,255,0.8)" strokeWidth="6" strokeLinecap="round" />
                <line x1="15" y1="50" x2="85" y2="50" stroke="rgba(255,255,255,0.8)" strokeWidth="6" strokeLinecap="round" />
                <circle cx="50" cy="50" r="15" fill={COLORS.goldAccent} />
            </g>
        </svg>
    );
};

const GlassMetricCard: React.FC<{ targetValue: number; label: string; startFrame: number }> = ({ targetValue, label, startFrame }) => {
    const frame = useCurrentFrame();
    const anim = spring({ frame: frame - startFrame, fps: 30 });
    const value = Math.floor(interpolate(anim, [0, 1], [0, targetValue]));

    return (
        <div style={{
            background: COLORS.glassLight,
            border: `1px solid ${COLORS.glassBorder}`,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: 24,
            padding: '40px 60px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            transform: `translateY(${interpolate(anim, [0, 1], [100, 0])}px)`,
            opacity: anim,
        }}>
            <div style={{ fontSize: 30, color: 'rgba(255,255,255,0.6)', fontFamily: FONT_STACK.body, letterSpacing: 4 }}>
                {label.toUpperCase()}
            </div>
            <div style={{ fontSize: 80, fontWeight: 900, color: COLORS.greenMatrix, fontFamily: FONT_STACK.mono, marginTop: 15 }}>
                ${value.toLocaleString()}
            </div>
        </div>
    );
};

export const PowerOfMoneyVideo: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: COLORS.darkCharcoal, overflow: 'hidden' }}>
            {/* Ambient Background Audio */}
            <Audio src={staticFile('sfx/ambient.mp3')} volume={0.05} />

            {/* Scene 1: The Hook (0-150) */}
            <Sequence from={0} durationInFrames={150}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', opacity: 0.2 }}>
                        <VaultComponent />
                    </div>
                    {/* Dark gradient overlay */}
                    <AbsoluteFill style={{ background: 'linear-gradient(to bottom, rgba(10,14,23,0), rgba(10,14,23,1))' }} />
                    <TitleHook />
                </AbsoluteFill>
            </Sequence>

            {/* Scene 2: Segment 1 (150-450) */}
            <Sequence from={150} durationInFrames={300}>
                <AbsoluteFill>
                    <Video src={staticFile('money_bg_1.mp4')} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
                    <Audio src={staticFile('money_vo_1.wav')} volume={1} startFrom={0} />

                    <Sequence from={40} durationInFrames={260}>
                        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 80 }}>
                            <GlassMetricCard targetValue={1000000000} label="Stored Energy" startFrame={40} />
                        </AbsoluteFill>
                    </Sequence>

                    <Sequence from={180} durationInFrames={120}>
                        <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 100 }}>
                            <div style={{
                                fontSize: 60,
                                fontWeight: 900,
                                color: 'white',
                                fontFamily: getFontForScene(1),
                                textTransform: 'uppercase',
                                textAlign: 'center',
                                textShadow: '4px 4px 0px rgba(0,0,0,0.5)'
                            }}>
                                The Ultimate Amplifier
                            </div>
                        </AbsoluteFill>
                    </Sequence>
                </AbsoluteFill>
            </Sequence>


            {/* Scene 3: Segment 2 (450-780) */}
            <Sequence from={450} durationInFrames={330}>
                <AbsoluteFill>
                    <Video src={staticFile('money_bg_2.mp4')} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
                    <Audio src={staticFile('money_vo_2.wav')} volume={1} startFrom={0} />

                    <Sequence from={60} durationInFrames={270}>
                        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{
                                fontSize: 90,
                                fontFamily: getFontForScene(2),
                                color: COLORS.goldAccent,
                                fontWeight: 'bold',
                                textShadow: '0 10px 30px rgba(0,0,0,0.8)'
                            }}>
                                IT BUILDS EMPIRES
                            </div>
                        </AbsoluteFill>
                    </Sequence>

                    <Sequence from={150} durationInFrames={180}>
                        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', marginTop: 300 }}>
                            <div style={{
                                padding: '20px 40px',
                                background: COLORS.darkCharcoal,
                                color: 'white',
                                borderLeft: `8px solid ${COLORS.greenMatrix}`,
                                fontSize: 45,
                                fontFamily: FONT_STACK.body,
                                fontWeight: 800
                            }}>
                                TURNING DECADES INTO DAYS
                            </div>
                        </AbsoluteFill>
                    </Sequence>

                </AbsoluteFill>
            </Sequence>

            {/* Scene 4: Outro (780-900) */}
            <Sequence from={780} durationInFrames={120}>
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: COLORS.darkCharcoal }}>
                    <div style={{
                        fontSize: 100,
                        fontFamily: getFontForScene(0),
                        color: 'white',
                        letterSpacing: 8
                    }}>
                        UNDERSTAND IT
                    </div>
                </AbsoluteFill>
            </Sequence>

        </AbsoluteFill>
    );
};

const TitleHook: React.FC = () => {
    const frame = useCurrentFrame();
    const anim = spring({ frame, fps: 30 });

    return (
        <div style={{
            transform: `scale(${interpolate(anim, [0, 1], [0.8, 1])})`,
            opacity: anim,
            textAlign: 'center'
        }}>
            <h1 style={{
                margin: 0,
                fontSize: 140,
                fontFamily: getFontForScene(0),
                color: 'white',
                lineHeight: 1
            }}>
                THE POWER
            </h1>
            <h1 style={{
                margin: 0,
                fontSize: 160,
                fontFamily: getFontForScene(0),
                color: COLORS.greenMatrix,
                lineHeight: 1
            }}>
                OF MONEY
            </h1>
        </div>
    );
};
