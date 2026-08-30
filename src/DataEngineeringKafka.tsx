import React from 'react';
import {
    AbsoluteFill, useCurrentFrame, interpolate, spring,
    Audio, OffthreadVideo, staticFile, Sequence
} from 'remotion';
import { FONT_IMPORT, FONT_STACK, getFontForScene } from './components/PremiumKit';

// ─── COLOR PALETTE ────────────────────────────────────
const C = {
    bg: '#0A0F1D',
    cardBg: 'rgba(15, 23, 42, 0.88)',
    emerald: '#10B981',
    cyan: '#06B6D4',
    gold: '#F59E0B',
    purple: '#8B5CF6',
    white: '#FFFFFF',
    textMuted: '#94A3B8',
    border: 'rgba(255, 255, 255, 0.15)'
};

// ─── VECTOR COMMIT LOG COMPONENT ──────────────────────

const CommitLogPartition: React.FC<{ partitionId: number; offsets: number[]; activeOffset: number; color: string }> = ({ partitionId, offsets, activeOffset, color }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16, width: '100%', boxSizing: 'border-box' }}>
            <div style={{
                fontFamily: FONT_STACK.mono, fontSize: 16, color, width: 150, fontWeight: 700, flexShrink: 0
            }}>
                PARTITION-{partitionId}
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {offsets.map((off, idx) => {
                    const isNew = off === activeOffset;
                    return (
                        <div key={idx} style={{
                            width: 90, height: 46, borderRadius: 10,
                            backgroundColor: isNew ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                            border: `2px stroke ${isNew ? C.emerald : C.border}`,
                            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                            boxShadow: isNew ? '0 0 20px rgba(16, 185, 129, 0.4)' : 'none',
                            boxSizing: 'border-box'
                        }}>
                            <div style={{ fontFamily: FONT_STACK.mono, fontSize: 10, color: C.textMuted }}>OFFSET</div>
                            <div style={{ fontFamily: FONT_STACK.mono, fontSize: 16, color: isNew ? C.emerald : C.white, fontWeight: 700 }}>
                                {off}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ─── TYPEWRITER TERMINAL CODE COMPONENT ───────────────

const TerminalCode: React.FC<{ progress: number }> = ({ progress }) => {
    const codeLines = [
        `df = spark.readStream \\`,
        `  .format("kafka") \\`,
        `  .option("kafka.bootstrap.servers", "cluster:9092") \\`,
        `  .option("subscribe", "user_events") \\`,
        `  .load()`
    ];

    const fullText = codeLines.join('\n');
    const charsToShow = Math.floor(fullText.length * progress);
    const visibleText = fullText.slice(0, charsToShow);

    return (
        <div style={{
            backgroundColor: '#0F172A', padding: '30px 35px', borderRadius: 20,
            border: `1px stroke ${C.cyan}`, fontFamily: FONT_STACK.mono,
            fontSize: 18, color: C.emerald, lineHeight: 1.5,
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)', whiteSpace: 'pre-wrap',
            maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden'
        }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#EF4444' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#10B981' }} />
                <span style={{ fontSize: 12, color: C.textMuted, marginLeft: 12 }}>kafka_consumer.py</span>
            </div>
            {visibleText}
            {progress < 1 && <span style={{ color: C.gold }}>█</span>}
        </div>
    );
};

// ─── SCENE 1: HOOK (Pexels Video + Responsive Typography) ─

const SceneOne: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(0);

    const sprTitle = spring({ frame: frame - 10, fps: 30 });
    const camScale = interpolate(frame, [0, 220], [1.0, 1.08]);

    return (
        <AbsoluteFill>
            <OffthreadVideo
                src={staticFile('broll_data_center.mp4')}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${camScale})` }}
                muted
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,15,29,0.9) 0%, rgba(10,15,29,0.78) 50%, rgba(10,15,29,0.92) 100%)' }} />

            <div style={{
                position: 'absolute', inset: 0, padding: '100px 140px', display: 'flex',
                flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box'
            }}>
                <div style={{ fontFamily: FONT_STACK.handwritten, color: C.cyan, fontSize: 38, marginBottom: 8 }}>
                    Distributed Streaming Systems
                </div>

                <div style={{
                    fontFamily: font, fontSize: 80, color: C.white, lineHeight: 1.08,
                    transform: `scale(${sprTitle})`, textShadow: '0 20px 50px rgba(0,0,0,0.9)',
                    maxWidth: 1400, wordBreak: 'break-word'
                }}>
                    HOW KAFKA PROCESSES <br />
                    <span style={{ color: C.emerald, backgroundColor: 'rgba(16, 185, 129, 0.2)', padding: '2px 14px', borderRadius: 8 }}>
                        10 TRILLION EVENTS / DAY
                    </span>
                </div>

                <div style={{ fontFamily: FONT_STACK.inter, fontSize: 22, color: C.textMuted, marginTop: 22, maxWidth: 1000, lineHeight: 1.5 }}>
                    Powering real-time event pipelines for Netflix, Uber, and LinkedIn without database bottlenecks.
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 2: 2D COMMIT LOG ANIMATION ─────────────────

const SceneTwo: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(1);

    const newOff = frame > 100 ? 104 : 103;

    return (
        <AbsoluteFill style={{ backgroundColor: C.bg }}>
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 70%)'
            }} />

            <div style={{
                position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex',
                flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box'
            }}>
                <div style={{ marginBottom: 30 }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, color: C.gold, fontSize: 34 }}>
                        Sequential I/O at Hardware Speed
                    </div>
                    <div style={{ fontFamily: font, fontSize: 72, color: C.white, lineHeight: 1.08, maxWidth: 1300 }}>
                        APPEND-ONLY <span style={{ color: C.cyan }}>COMMIT LOG</span> ARCHITECTURE
                    </div>
                </div>

                <div style={{
                    backgroundColor: C.cardBg, padding: 36, borderRadius: 24,
                    border: `1px stroke ${C.border}`, backdropFilter: 'blur(20px)',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.7)', maxWidth: 1400, boxSizing: 'border-box'
                }}>
                    <CommitLogPartition partitionId={0} offsets={[101, 102, 103, newOff]} activeOffset={newOff} color={C.emerald} />
                    <CommitLogPartition partitionId={1} offsets={[201, 202, 203, 204]} activeOffset={204} color={C.cyan} />
                    <CommitLogPartition partitionId={2} offsets={[301, 302, 303, 304]} activeOffset={304} color={C.purple} />

                    {frame === 100 && <Audio src={staticFile('sfx/pop.mp3')} volume={0.7} />}

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, fontFamily: FONT_STACK.mono, fontSize: 15, color: C.textMuted }}>
                        <span>PRODUCER: Appending Record to Disk</span>
                        <span style={{ color: C.emerald }}>CONSUMER OFFSET: 104</span>
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 3: CODE TERMINAL & HARDWARE SPEED ─────────

const SceneThree: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(2);

    const typeProg = interpolate(frame, [15, 180], [0, 1], { extrapolateRight: 'clamp' });
    const sprCard = spring({ frame: frame - 10, fps: 30 });

    return (
        <AbsoluteFill style={{ backgroundColor: C.bg }}>
            <div style={{
                position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex',
                gap: 50, alignItems: 'center', boxSizing: 'border-box'
            }}>
                <div style={{ flex: 1.1, boxSizing: 'border-box' }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, color: C.emerald, fontSize: 36 }}>
                        Zero-Copy Memory Transfer
                    </div>
                    <div style={{ fontFamily: font, fontSize: 75, color: C.white, lineHeight: 1.08, marginTop: 8, wordBreak: 'break-word' }}>
                        READING DATA AT <span style={{ color: C.emerald }}>DISK SPEED</span>
                    </div>
                    <div style={{ fontFamily: FONT_STACK.inter, fontSize: 20, color: C.textMuted, marginTop: 18, lineHeight: 1.5 }}>
                        Bypassing kernel user-space context switches to stream data straight to network sockets.
                    </div>
                </div>

                <div style={{ flex: 1, transform: `scale(${sprCard})`, boxSizing: 'border-box', maxWidth: '50%' }}>
                    <TerminalCode progress={typeProg} />
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── MAIN COMPOSITION ROOT ──────────────────────────────

export const DataEngineeringKafka: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: C.bg }}>
            <style>{FONT_IMPORT}</style>

            <Audio src={staticFile('de_kafka_vo.mp3')} />

            {/* Segment 1 */}
            <Sequence from={0} durationInFrames={220}>
                <SceneOne />
            </Sequence>

            {/* Segment 2 */}
            <Sequence from={220} durationInFrames={240}>
                <SceneTwo />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
            </Sequence>

            {/* Segment 3 */}
            <Sequence from={460} durationInFrames={260}>
                <SceneThree />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Sequence from={15} durationInFrames={165}>
                    <Audio src={staticFile('sfx/typing.mp3')} volume={0.35} />
                </Sequence>
            </Sequence>
        </AbsoluteFill>
    );
};
