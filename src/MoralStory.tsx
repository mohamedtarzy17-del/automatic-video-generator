import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Series } from 'remotion';

const THEME = {
    sky: '#87CEEB',
    grass: '#7CFC00',
    wood: '#8B4513',
    skin: '#000000',
    danger: '#FF4500',
    white: '#FFFFFF',
};

// --- Stick Figure Component ---
const StickFigure: React.FC<{
    x: number,
    y: number,
    scale?: number,
    color?: string,
    pose?: {
        leftArm?: number,
        rightArm?: number,
        leftLeg?: number,
        rightLeg?: number,
        headBob?: number
    }
}> = ({ x, y, scale = 1, color = 'black', pose = {} }) => {
    const { leftArm = 0, rightArm = 0, leftLeg = 0, rightLeg = 0, headBob = 0 } = pose;

    return (
        <g transform={`translate(${x}, ${y}) scale(${scale})`}>
            {/* Outline/Shadow for visibility */}
            <g stroke={color} strokeWidth="6" strokeLinecap="round" fill="none">
                {/* Body */}
                <line x1="0" y1="0" x2="0" y2="50" />
                {/* Head */}
                <circle cx="0" cy={-15 + headBob} r="10" />
                {/* Arms */}
                <line x1="0" y1="10" x2={20 * Math.cos(leftArm)} y2={10 + 20 * Math.sin(leftArm)} />
                <line x1="0" y1="10" x2={20 * Math.cos(rightArm)} y2={10 + 20 * Math.sin(rightArm)} />
                {/* Legs */}
                <line x1="0" y1="50" x2={15 * Math.cos(leftLeg + Math.PI / 2)} y2={50 + 25 * Math.sin(leftLeg + Math.PI / 2)} />
                <line x1="0" y1="50" x2={15 * Math.cos(rightLeg + Math.PI / 2)} y2={50 + 25 * Math.sin(rightLeg + Math.PI / 2)} />
            </g>
        </g>
    );
};

const Sheep: React.FC<{ x: number, y: number, scale?: number }> = ({ x, y, scale = 1 }) => {
    const frame = useCurrentFrame();
    const jump = Math.sin(frame / 5 + x) * 3;
    return (
        <g transform={`translate(${x}, ${y + jump}) scale(${scale})`}>
            <ellipse cx="0" cy="0" rx="30" ry="22" fill="white" stroke="#999" strokeWidth="2" />
            <circle cx="22" cy="-15" r="12" fill="white" stroke="#999" strokeWidth="2" />
            <circle cx="25" cy="-17" r="2" fill="black" />
            <line x1="-15" y1="15" x2="-15" y2="28" stroke="black" strokeWidth="4" />
            <line x1="10" y1="15" x2="10" y2="28" stroke="black" strokeWidth="4" />
        </g>
    );
};

const Wolf: React.FC<{ x: number, y: number, scale?: number, mouthOpen?: number }> = ({ x, y, scale = 1, mouthOpen = 0 }) => {
    return (
        <g transform={`translate(${x}, ${y}) scale(${scale})`}>
            <path d="M-40,-15 L15,-8 L30,-25 L45,-15 L45,15 L15,8 L-40,15 Z" fill="#444" stroke="black" strokeWidth="2" />
            <circle cx="25" cy="-15" r="3" fill="red" />
            <path d={`M30,0 L50,${mouthOpen * 15} L30,15 Z`} fill="#222" />
            <line x1="-20" y1="15" x2="-20" y2="35" stroke="#222" strokeWidth="6" />
            <line x1="10" y1="15" x2="10" y2="35" stroke="#222" strokeWidth="6" />
        </g>
    );
};

// --- Full SVG Scene Wrapper ---
const SceneWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <AbsoluteFill>
            <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" style={{ backgroundColor: THEME.sky }}>
                {/* Fixed Background in SVG */}
                <rect width="1920" height="700" fill={THEME.sky} />
                <rect y="700" width="1920" height="380" fill={THEME.grass} />
                {children}
            </svg>
        </AbsoluteFill>
    );
};

const SceneBored: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <SceneWrapper>
            <Sheep x={500} y={850} />
            <Sheep x={800} y={900} scale={1.3} />
            <Sheep x={1100} y={860} />
            <StickFigure
                x={300 + Math.sin(frame / 50) * 80}
                y={750}
                scale={3}
                pose={{
                    leftArm: Math.PI / 2,
                    rightArm: Math.PI / 2,
                    headBob: Math.sin(frame / 15) * 4
                }}
            />
            <text x="960" y="200" textAnchor="middle" style={{ fontFamily: 'Outfit', fontSize: 90, fontWeight: 900, fill: '#000' }}>The boy was very bored...</text>
        </SceneWrapper>
    );
};

const SceneCryWolf: React.FC = () => {
    const frame = useCurrentFrame();
    const jump = Math.abs(Math.sin(frame / 5)) * 50;
    return (
        <SceneWrapper>
            <Sheep x={400} y={850} />
            <StickFigure
                x={960}
                y={700 - jump}
                scale={4}
                pose={{
                    leftArm: -Math.PI / 2 + Math.sin(frame),
                    rightArm: -Math.PI / 2 - Math.sin(frame),
                }}
            />
            <text x="960" y="250" textAnchor="middle" style={{ fontFamily: 'Outfit', fontSize: 150, fontWeight: 900, fill: THEME.danger }}>"WOLF! WOLF!"</text>
        </SceneWrapper>
    );
};

const SceneVillagers: React.FC = () => {
    const frame = useCurrentFrame();
    const run = (frame * 20) % 2400;
    return (
        <SceneWrapper>
            <text x="960" y="200" textAnchor="middle" style={{ fontFamily: 'Outfit', fontSize: 80, fontWeight: 900 }}>Villagers came running to help.</text>
            <StickFigure x={2000 - run} y={750} scale={2.5} pose={{ leftLeg: Math.sin(frame / 2), rightLeg: -Math.sin(frame / 2) }} color="#333" />
            <StickFigure x={2300 - run} y={720} scale={2.5} pose={{ leftLeg: -Math.sin(frame / 2), rightLeg: Math.sin(frame / 2) }} color="#555" />
            <StickFigure x={600} y={750} scale={3} pose={{ leftArm: 0, rightArm: Math.PI }} />
        </SceneWrapper>
    );
};

const SceneRealWolf: React.FC = () => {
    const frame = useCurrentFrame();
    const wolfX = interpolate(frame, [0, 40], [2200, 1500]);
    return (
        <SceneWrapper>
            <Sheep x={600} y={850} />
            <StickFigure x={400} y={750} scale={3} pose={{ leftArm: -1.2, rightArm: -1.2 }} />
            <Wolf x={wolfX} y={850} scale={4} mouthOpen={Math.abs(Math.sin(frame / 4))} />
            <text x="960" y="200" textAnchor="middle" style={{ fontFamily: 'Outfit', fontSize: 100, fontWeight: 900, fill: 'red' }}>A REAL wolf appeared!</text>
        </SceneWrapper>
    );
};

const SceneMoral: React.FC = () => {
    const frame = useCurrentFrame();
    const opacity = interpolate(frame, [0, 30], [0, 1]);
    return (
        <AbsoluteFill style={{ backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ opacity, textAlign: 'center', padding: 80, maxWidth: '80%' }}>
                <h2 style={{ color: THEME.danger, fontFamily: 'Outfit', fontSize: 70, marginBottom: 50, letterSpacing: 5 }}>MORAL</h2>
                <h1 style={{ color: '#fff', fontFamily: 'Outfit', fontSize: 110, fontWeight: 900, lineHeight: 1.1 }}>
                    "Nobody believes a liar,<br /> even when he tells the truth."
                </h1>
            </div>
        </AbsoluteFill>
    );
};

export const MoralStory: React.FC = () => {
    return (
        <AbsoluteFill>
            <Series>
                <Series.Sequence durationInFrames={120}>
                    <SceneBored />
                </Series.Sequence>
                <Series.Sequence durationInFrames={90}>
                    <SceneCryWolf />
                </Series.Sequence>
                <Series.Sequence durationInFrames={120}>
                    <SceneVillagers />
                </Series.Sequence>
                <Series.Sequence durationInFrames={150}>
                    <SceneRealWolf />
                </Series.Sequence>
                <Series.Sequence durationInFrames={200}>
                    <SceneMoral />
                </Series.Sequence>
            </Series>
        </AbsoluteFill>
    );
};
