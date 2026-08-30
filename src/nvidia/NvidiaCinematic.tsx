import React from 'react';
import { AbsoluteFill, Sequence, Audio, staticFile } from 'remotion';
import { FontStyles } from './NvidiaTheme';
import { Scene01_Opening } from './NvidiaScenes1to5';
import { Scene02_GlobalImpact } from './NvidiaScenes1to5';
import { Scene03_SuccessPhase } from './NvidiaScenes1to5';
import { Scene04_ExpectationShift } from './NvidiaScenes1to5';
import { Scene05_BlackwellCompetition } from './NvidiaScenes1to5';
import { Scene06_MarketConcentration } from './NvidiaScenes6to9';
import { Scene07_HistoricalParallel } from './NvidiaScenes6to9';
import { Scene08_BubbleQuestion } from './NvidiaScenes6to9';
import { Scene09_Ending } from './NvidiaScenes6to9';

/*
 * NVIDIA CINEMATIC EXPLAINER — 3:56 (236 seconds @ 30fps = 7080 frames)
 *
 * Timeline:
 *   Scene 1: Opening (0:00–0:20)       → 0–600 frames
 *   Scene 2: Global Impact (0:20–0:40) → 600–1200 frames
 *   Scene 3: Success Phase (0:40–1:20) → 1200–2400 frames
 *   Scene 4: Expectation Shift (1:20–1:55) → 2400–3450 frames
 *   Scene 5: Blackwell & Competition (1:55–2:20) → 3450–4200 frames
 *   Scene 6: Market Concentration (2:20–2:45) → 4200–4950 frames
 *   Scene 7: Historical Parallel (2:45–3:15) → 4950–5850 frames
 *   Scene 8: Bubble Question (3:15–3:40) → 5850–6600 frames
 *   Scene 9: Ending (3:40–3:56) → 6600–7080 frames
 */

export const NvidiaCinematicExplainer: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#020205', overflow: 'hidden' }}>
            <FontStyles />

            {/* Main Voiceover */}
            <Audio src={staticFile('nvidia_vo_hq.wav')} volume={1.0} />

            {/* Ambient background music */}
            <Audio src={staticFile('sfx/ambient.mp3')} volume={0.08} loop />

            {/* === SCENE TIMELINE === */}

            {/* Scene 1: Opening — Record profits + crash (0:00–0:20) */}
            <Sequence from={0} durationInFrames={600}>
                <Scene01_Opening />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.3} startFrom={0} />
                <Sequence from={350}>
                    <Audio src={staticFile('sfx/pop.mp3')} volume={0.5} />
                </Sequence>
            </Sequence>

            {/* Scene 2: Global Impact — World map ripple (0:20–0:40) */}
            <Sequence from={600} durationInFrames={600}>
                <Scene02_GlobalImpact />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.25} />
            </Sequence>

            {/* Scene 3: Success Phase — Revenue, AI centers, chips, margins (0:40–1:20) */}
            <Sequence from={1200} durationInFrames={1200}>
                <Scene03_SuccessPhase />
                <Audio src={staticFile('sfx/rise.mp3')} volume={0.2} />
            </Sequence>

            {/* Scene 4: Expectation Shift — Wall Street, whisper numbers (1:20–1:55) */}
            <Sequence from={2400} durationInFrames={1050}>
                <Scene04_ExpectationShift />
                <Sequence from={300}>
                    <Audio src={staticFile('sfx/pop.mp3')} volume={0.3} />
                </Sequence>
            </Sequence>

            {/* Scene 5: Blackwell & Competition (1:55–2:20) */}
            <Sequence from={3450} durationInFrames={750}>
                <Scene05_BlackwellCompetition />
                <Audio src={staticFile('sfx/clock.mp3')} volume={0.2} />
            </Sequence>

            {/* Scene 6: Market Concentration (2:20–2:45) */}
            <Sequence from={4200} durationInFrames={750}>
                <Scene06_MarketConcentration />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.2} />
            </Sequence>

            {/* Scene 7: Historical Parallel (2:45–3:15) */}
            <Sequence from={4950} durationInFrames={900}>
                <Scene07_HistoricalParallel />
                <Audio src={staticFile('sfx/rise.mp3')} volume={0.15} />
            </Sequence>

            {/* Scene 8: Bubble Question (3:15–3:40) */}
            <Sequence from={5850} durationInFrames={750}>
                <Scene08_BubbleQuestion />
                <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.2} />
            </Sequence>

            {/* Scene 9: Ending — AI city, poker, final chip (3:40–3:56) */}
            <Sequence from={6600} durationInFrames={480}>
                <Scene09_Ending />
                <Audio src={staticFile('sfx/rise.mp3')} volume={0.2} />
            </Sequence>

            {/* Global cinematic post-processing */}
            <AbsoluteFill style={{
                boxShadow: 'inset 0 0 400px rgba(0,0,0,0.6)',
                pointerEvents: 'none', zIndex: 90,
            }} />
        </AbsoluteFill>
    );
};
