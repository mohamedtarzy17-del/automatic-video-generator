import React from 'react';
import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { PureCartoonExplainer } from './PureCartoonExplainer';
import { StunningMGDemo } from './StunningMGDemo';
import { TalkingHeadExplainer } from './TalkingHeadExplainer';

export const ShowreelTeaser: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fast zoom transition effects between scenes
  const zoomIn1 = spring({ frame: frame - 140, fps, config: { damping: 12 } });
  const zoomIn2 = spring({ frame: frame - 290, fps, config: { damping: 12 } });

  const scale1 = interpolate(zoomIn1, [0, 1], [1, 1.2]);
  const scale2 = interpolate(zoomIn2, [0, 1], [1, 1.2]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#090d16', overflow: 'hidden' }}>
      {/* SCENE 1: CARTOON ANIMATION (0s - 5s / 0-150 frames) */}
      <Sequence from={0} durationInFrames={150}>
        <AbsoluteFill style={{ transform: `scale(${scale1})` }}>
          <PureCartoonExplainer />
          <div
            style={{
              position: 'absolute',
              top: 40,
              left: 40,
              backgroundColor: 'rgba(236, 72, 153, 0.95)',
              color: '#ffffff',
              padding: '14px 32px',
              borderRadius: 30,
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 900,
              fontSize: 26,
              letterSpacing: 2,
              boxShadow: '0 10px 30px rgba(236, 72, 153, 0.6)',
              zIndex: 100,
            }}
          >
            🎨 CARTOON STORY ENGINE
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 2: DYNAMIC MOTION GRAPHICS & DATA HUD (5s - 10s / 150-300 frames) */}
      <Sequence from={150} durationInFrames={150}>
        <AbsoluteFill style={{ transform: `scale(${scale2})` }}>
          <StunningMGDemo />
          <div
            style={{
              position: 'absolute',
              top: 40,
              left: 40,
              backgroundColor: 'rgba(59, 130, 246, 0.95)',
              color: '#ffffff',
              padding: '14px 32px',
              borderRadius: 30,
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 900,
              fontSize: 26,
              letterSpacing: 2,
              boxShadow: '0 10px 30px rgba(59, 130, 246, 0.6)',
              zIndex: 100,
            }}
          >
            📊 DYNAMIC MOTION GRAPHICS & DATA HUD
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* SCENE 3: KINETIC TYPOGRAPHY & WHISPERX SUBTITLE SYNC (10s - 15s / 300-450 frames) */}
      <Sequence from={300} durationInFrames={150}>
        <AbsoluteFill>
          <TalkingHeadExplainer />
          <div
            style={{
              position: 'absolute',
              top: 40,
              left: 40,
              backgroundColor: 'rgba(168, 85, 247, 0.95)',
              color: '#ffffff',
              padding: '14px 32px',
              borderRadius: 30,
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 900,
              fontSize: 26,
              letterSpacing: 2,
              boxShadow: '0 10px 30px rgba(168, 85, 247, 0.6)',
              zIndex: 100,
            }}
          >
            ⚡ WHISPERX KINETIC TYPOGRAPHY SYNC
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
