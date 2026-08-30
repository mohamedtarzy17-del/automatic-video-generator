import React from 'react';
import {
    AbsoluteFill, useCurrentFrame, interpolate, spring,
    Audio, OffthreadVideo, staticFile, Sequence
} from 'remotion';
import { FONT_IMPORT, FONT_STACK, getFontForScene } from './components/PremiumKit';

// ─── COLOR PALETTE ────────────────────────────────────
const C = {
    bg: '#080C14',
    cardBg: 'rgba(15, 23, 42, 0.88)',
    cyan: '#06B6D4',
    gold: '#F59E0B',
    emerald: '#10B981',
    purple: '#8B5CF6',
    white: '#FFFFFF',
    textMuted: '#94A3B8',
    border: 'rgba(255, 255, 255, 0.16)'
};

// ─── TALKING HEAD PRESENTER AVATAR CARD ────────────────

const PresenterAvatarCard: React.FC<{ videoPath: string; name?: string; role?: string }> = ({ videoPath, name = "AI Presenter", role = "Systems Architect" }) => {
    const frame = useCurrentFrame();
    const wave = Math.sin(frame * 0.2) * 8 + 12;

    return (
        <div style={{
            width: 440, height: 560, backgroundColor: C.cardBg,
            borderRadius: 32, border: `2px stroke ${C.cyan}`,
            padding: 24, display: 'flex', flexDirection: 'column',
            alignItems: 'center', boxShadow: '0 30px 70px rgba(6, 182, 212, 0.25)',
            boxSizing: 'border-box', position: 'relative', overflow: 'hidden'
        }}>
            {/* Presenter Video Window */}
            <div style={{
                width: '100%', height: 420, borderRadius: 24, overflow: 'hidden',
                position: 'relative', border: `1px stroke ${C.border}`
            }}>
                <OffthreadVideo
                    src={staticFile(videoPath)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    muted
                />
                {/* Live Indicator Badge */}
                <div style={{
                    position: 'absolute', top: 16, left: 16, backgroundColor: 'rgba(16, 185, 129, 0.9)',
                    padding: '6px 14px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 8
                }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: C.white }} />
                    <span style={{ fontFamily: FONT_STACK.mono, fontSize: 12, color: C.white, fontWeight: 700 }}>PRESENTER</span>
                </div>
            </div>

            {/* Presenter Info & Audio Wave Visualizer */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, padding: '0 10px' }}>
                <div>
                    <div style={{ fontFamily: FONT_STACK.bebas, fontSize: 26, color: C.white }}>{name}</div>
                    <div style={{ fontFamily: FONT_STACK.mono, fontSize: 13, color: C.cyan }}>{role}</div>
                </div>

                {/* Animated Audio Wave Lines */}
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', height: 24 }}>
                    {[0.6, 1.2, 0.8, 1.5, 0.9].map((mult, idx) => (
                        <div key={idx} style={{
                            width: 4, height: Math.max(4, wave * mult),
                            backgroundColor: C.cyan, borderRadius: 2
                        }} />
                    ))}
                </div>
            </div>
        </div>
    );
};

// ─── SCENE 1: TALKING HEAD + DYNAMIC DIAGRAM ──────────

const SceneOne: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(0);

    const typeProg = interpolate(frame, [15, 160], [0, 1], { extrapolateRight: 'clamp' });
    const sprCard = spring({ frame: frame - 10, fps: 30 });

    const titleText = "HYPER-SCALABLE AI AGENTS";
    const charsToShow = Math.floor(titleText.length * typeProg);

    return (
        <AbsoluteFill style={{ backgroundColor: C.bg }}>
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 70%)'
            }} />

            {/* Typewriter Audio */}
            {frame > 15 && frame < 160 && (
                <Audio src={staticFile('sfx/typing.mp3')} volume={0.35} />
            )}

            <div style={{
                position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex',
                gap: 60, alignItems: 'center', boxSizing: 'border-box'
            }}>
                {/* Presenter Talking Head Frame */}
                <div style={{ transform: `scale(${sprCard})` }}>
                    <PresenterAvatarCard videoPath="broll_humanoid_1.mp4" name="AI Architect" role="Agentic Systems Lead" />
                </div>

                {/* Content & Typography */}
                <div style={{ flex: 1, boxSizing: 'border-box' }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, color: C.gold, fontSize: 38, marginBottom: 8 }}>
                        Multi-Agent Orchestration
                    </div>

                    <div style={{
                        fontFamily: font, fontSize: 78, color: C.white, lineHeight: 1.08,
                        maxWidth: 1000, wordBreak: 'break-word'
                    }}>
                        {titleText.slice(0, charsToShow)}
                    </div>

                    <div style={{ fontFamily: FONT_STACK.inter, fontSize: 20, color: C.textMuted, marginTop: 22, lineHeight: 1.5 }}>
                        Replacing monolithic LLM prompts with specialized parallel agent swarms.
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 2: B-ROLL CUTAWAY (Full-bleed Video + Typo) 

const SceneTwo: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(1);

    const typeProg = interpolate(frame, [15, 170], [0, 1], { extrapolateRight: 'clamp' });
    const camScale = interpolate(frame, [0, 240], [1.0, 1.08]);

    const titleText = "PARALLEL TASK DECOMPOSITION";
    const charsToShow = Math.floor(titleText.length * typeProg);

    return (
        <AbsoluteFill>
            <OffthreadVideo
                src={staticFile('broll_code.mp4')}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${camScale})` }}
                muted
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(8,12,20,0.88) 0%, rgba(8,12,20,0.72) 50%, rgba(8,12,20,0.92) 100%)' }} />

            {frame > 15 && frame < 170 && (
                <Audio src={staticFile('sfx/typing.mp3')} volume={0.35} />
            )}

            <div style={{
                position: 'absolute', inset: 0, padding: '100px 140px', display: 'flex',
                flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box'
            }}>
                <div style={{ fontFamily: FONT_STACK.handwritten, color: C.emerald, fontSize: 38, marginBottom: 8 }}>
                    Divide & Conquer Logic
                </div>

                <div style={{
                    fontFamily: font, fontSize: 82, color: C.white, lineHeight: 1.08,
                    maxWidth: 1300, wordBreak: 'break-word'
                }}>
                    {titleText.slice(0, charsToShow)}
                </div>

                <div style={{ fontFamily: FONT_STACK.inter, fontSize: 22, color: C.textMuted, marginTop: 22, maxWidth: 950, lineHeight: 1.5 }}>
                    Autonomous agent nodes breaking down complex reasoning into sub-second execution threads.
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── SCENE 3: RETURN TO TALKING HEAD + CLOSING CARD ───

const SceneThree: React.FC = () => {
    const frame = useCurrentFrame();
    const font = getFontForScene(2);

    const sprMain = spring({ frame: frame - 10, fps: 30, config: { damping: 10 } });

    return (
        <AbsoluteFill style={{ backgroundColor: C.bg }}>
            <div style={{
                position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex',
                gap: 60, alignItems: 'center', boxSizing: 'border-box'
            }}>
                <PresenterAvatarCard videoPath="broll_humanoid_1.mp4" name="AI Architect" role="Agentic Systems Lead" />

                <div style={{ flex: 1, boxSizing: 'border-box' }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 38, color: C.gold, marginBottom: 8 }}>
                        Autonomous Agent Architecture
                    </div>

                    <div style={{
                        fontFamily: font, fontSize: 78, color: C.white, lineHeight: 1.08,
                        transform: `scale(${sprMain})`, textShadow: '0 25px 60px rgba(0,0,0,0.95)',
                        maxWidth: 1000, wordBreak: 'break-word'
                    }}>
                        UNDER THE HOOD <br />
                        <span style={{ color: C.cyan, backgroundColor: 'rgba(6, 182, 212, 0.2)', padding: '2px 14px', borderRadius: 8 }}>
                            PRODUCTION AGENTS
                        </span>
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── MAIN COMPOSITION ROOT ──────────────────────────────

export const TalkingHeadExplainer: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: C.bg }}>
            <style>{FONT_IMPORT}</style>

            <Audio src={staticFile('th_explainer_vo.mp3')} />

            {/* Segment 1: Presenter Talking Head */}
            <Sequence from={0} durationInFrames={230}>
                <SceneOne />
            </Sequence>

            {/* Segment 2: Full B-Roll Cutaway */}
            <Sequence from={230} durationInFrames={250}>
                <SceneTwo />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('sfx/pop.mp3')} volume={0.7} />
            </Sequence>

            {/* Segment 3: Return to Presenter */}
            <Sequence from={480} durationInFrames={270}>
                <SceneThree />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.6} />
                <Audio src={staticFile('sfx/rise.mp3')} volume={0.8} />
            </Sequence>
        </AbsoluteFill>
    );
};
