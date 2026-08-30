import React from 'react';
import {
    AbsoluteFill, useCurrentFrame, interpolate, spring,
    Audio, OffthreadVideo, staticFile, Sequence
} from 'remotion';
import { FONT_IMPORT, FONT_STACK, getFontForScene } from './components/PremiumKit';
import sceneBreakdown from '../scene_breakdown.json';

const C = {
    bg: '#080C14',
    gold: '#F59E0B',
    cyan: '#06B6D4',
    emerald: '#10B981',
    white: '#FFFFFF',
    textMuted: '#94A3B8',
    cardBg: 'rgba(15, 23, 42, 0.88)',
    border: 'rgba(255, 255, 255, 0.15)'
};

// ─── REMOTION MULTI-PLANE PARALLAX LAYER COMPONENT ──────

const LayeredParallaxScene: React.FC<{ scene: any; durationFrames: number }> = ({ scene, durationFrames }) => {
    const frame = useCurrentFrame();
    const font = getFontForScene(scene.scene_id - 1);

    const parallax = scene.parallax_config || { bg_speed: 0.05, char_speed: 0.12, fg_speed: 0.22 };

    const bgX = interpolate(frame, [0, durationFrames], [0, -100 * parallax.bg_speed]);
    const charX = interpolate(frame, [0, durationFrames], [0, 150 * parallax.char_speed]);
    const sprCard = spring({ frame: frame - 10, fps: 30 });

    const typeProg = interpolate(frame, [15, 140], [0, 1], { extrapolateRight: 'clamp' });
    const textToShow = scene.on_screen_text.slice(0, Math.floor(scene.on_screen_text.length * typeProg));

    return (
        <AbsoluteFill style={{ backgroundColor: C.bg, overflow: 'hidden' }}>
            {/* Background Layer with Parallax */}
            <div style={{
                position: 'absolute', inset: -50,
                transform: `translateX(${bgX}px)`,
                backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.12) 0%, transparent 70%)'
            }}>
                <OffthreadVideo
                    src={staticFile('broll_data_center.mp4')}
                    style={{ width: '110%', height: '110%', objectFit: 'cover' }}
                    muted
                />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,12,20,0.8)' }} />
            </div>

            {/* Foreground Content with Parallax Motion */}
            <div style={{
                position: 'absolute', inset: 0, padding: '90px 130px', display: 'flex',
                gap: 50, alignItems: 'center', boxSizing: 'border-box',
                transform: `translateX(${charX}px)`
            }}>
                <div style={{ flex: 1.2, boxSizing: 'border-box' }}>
                    <div style={{ fontFamily: FONT_STACK.handwritten, color: C.gold, fontSize: 36, marginBottom: 8 }}>
                        Beat Phase: {scene.beat_type.toUpperCase()}
                    </div>

                    <div style={{
                        fontFamily: font, fontSize: 80, color: C.white, lineHeight: 1.08,
                        maxWidth: 1100, wordBreak: 'break-word'
                    }}>
                        {textToShow}
                    </div>

                    <div style={{ fontFamily: FONT_STACK.inter, fontSize: 20, color: C.textMuted, marginTop: 22, lineHeight: 1.5, maxWidth: 900 }}>
                        {scene.narration_text}
                    </div>
                </div>

                <div style={{
                    flex: 1, backgroundColor: C.cardBg, padding: 36, borderRadius: 24,
                    border: `1px stroke ${C.border}`, backdropFilter: 'blur(20px)',
                    transform: `scale(${sprCard})`, textAlign: 'center', boxSizing: 'border-box'
                }}>
                    <div style={{ fontFamily: FONT_STACK.mono, fontSize: 14, color: C.cyan, marginBottom: 12 }}>PROMPT SEED: {scene.prompt_seed}</div>
                    <div style={{ fontFamily: FONT_STACK.handwritten, fontSize: 32, color: C.emerald }}>
                        {scene.character_prompt}
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── MAIN COMPOSITION ROOT ──────────────────────────────

export const PipelineVideoRenderer: React.FC = () => {
    let currentStartFrame = 0;

    return (
        <AbsoluteFill style={{ backgroundColor: C.bg }}>
            <style>{FONT_IMPORT}</style>

            {/* No ambient background audio */}

            {sceneBreakdown.scenes.map((scene: any, idx: number) => {
                const durationFrames = Math.round((scene.duration_estimate || 20) * 30);
                const startFrame = currentStartFrame;
                currentStartFrame += durationFrames;

                return (
                    <Sequence key={scene.scene_id} from={startFrame} durationInFrames={durationFrames}>
                        <LayeredParallaxScene scene={scene} durationFrames={durationFrames} />

                        {/* Mixed Audio & Narration */}
                        {scene.mixed_audio_file && (
                            <Audio src={staticFile(scene.mixed_audio_file)} />
                        )}

                        {/* SFX Triggers from JSON Contract */}
                        {scene.sfx_triggers && scene.sfx_triggers.map((trig: any, sIdx: number) => (
                            <Sequence key={sIdx} from={trig.frame} durationInFrames={60}>
                                <Audio src={staticFile(trig.sfx)} volume={trig.volume || 0.5} />
                            </Sequence>
                        ))}
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};
