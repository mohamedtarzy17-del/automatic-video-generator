import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Series, Easing } from 'remotion';

const THEME = {
    sky: '#F0E68C',
    ground: '#8B4513',
    merchant: '#FFD700',
    poorMan: '#4B3621',
    judge: '#000080',
    danger: '#B22222',
};

// --- Enhanced Stick Figure ---
const Character: React.FC<{
    x: number,
    y: number,
    scale?: number,
    color?: string,
    width?: number,
    pose?: {
        leftArm?: number,
        rightArm?: number,
        leftLeg?: number,
        rightLeg?: number,
        headRotation?: number,
        isTalking?: number
    }
}> = ({ x, y, scale = 1, color = 'black', width = 5, pose = {} }) => {
    const {
        leftArm = Math.PI / 2,
        rightArm = Math.PI / 2,
        leftLeg = 0,
        rightLeg = 0,
        headRotation = 0,
        isTalking = 0
    } = pose;

    return (
        <g transform={`translate(${x}, ${y}) scale(${scale})`}>
            {/* Body */}
            <line x1="0" y1="0" x2="0" y2="50" stroke={color} strokeWidth={width} strokeLinecap="round" />
            {/* Head */}
            <g transform={`rotate(${headRotation})`}>
                <circle cx="0" cy="-20" r="15" fill="white" stroke={color} strokeWidth={width} />
                {/* Eyes */}
                <circle cx="-5" cy="-23" r="2" fill={color} />
                <circle cx="5" cy="-23" r="2" fill={color} />
                {/* Mouth */}
                <path d={`M-5 -13 Q 0 ${-13 + isTalking * 10}, 5 -13`} fill="none" stroke={color} strokeWidth="2" />
            </g>
            {/* Arms */}
            <line x1="0" y1="10" x2={25 * Math.cos(leftArm)} y2={10 + 25 * Math.sin(leftArm)} stroke={color} strokeWidth={width} strokeLinecap="round" />
            <line x1="0" y1="10" x2={25 * Math.cos(rightArm)} y2={10 + 25 * Math.sin(rightArm)} stroke={color} strokeWidth={width} strokeLinecap="round" />
            {/* Legs */}
            <line x1="0" y1="50" x2={20 * Math.cos(leftLeg + Math.PI / 2.5)} y2={50 + 30 * Math.sin(leftLeg + Math.PI / 2.5)} stroke={color} strokeWidth={width} strokeLinecap="round" />
            <line x1="0" y1="50" x2={20 * Math.cos(rightLeg + Math.PI / 1.6)} y2={50 + 30 * Math.sin(rightLeg + Math.PI / 1.6)} stroke={color} strokeWidth={width} strokeLinecap="round" />
        </g>
    );
};

const MoneyBag: React.FC<{ x: number, y: number, scale?: number }> = ({ x, y, scale = 1 }) => (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
        <path d="M-20,0 Q-25,20 0,25 Q25,20 20,0 L10,-10 L-10,-10 Z" fill="#DAA520" stroke="#8B4513" strokeWidth="2" />
        <text x="0" y="10" textAnchor="middle" style={{ fontSize: 15, fill: '#8B4513', fontWeight: 'bold' }}>$</text>
        <path d="M-10,-10 Q0,-15 10,-10" fill="none" stroke="#8B4513" strokeWidth="2" />
    </g>
);

const SceneWrapper: React.FC<{ children: React.ReactNode, title?: string }> = ({ children, title }) => (
    <AbsoluteFill style={{ backgroundColor: THEME.sky }}>
        <svg width="100%" height="100%" viewBox="0 0 1920 1080">
            <rect width="1920" height="750" fill={THEME.sky} />
            <rect y="750" width="1920" height="330" fill="#CD853F" />
            {children}
            {title && (
                <text x="960" y="150" textAnchor="middle" style={{ fontFamily: 'Outfit', fontSize: 70, fontWeight: 900, fill: '#4B3621' }}>
                    {title}
                </text>
            )}
        </svg>
    </AbsoluteFill>
);

// --- Scenes ---

const Scene1_Lost: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <SceneWrapper title="A greedy merchant lost 100 gold coins.">
            <Character
                x={700 + Math.sin(frame / 20) * 100}
                y={700}
                scale={3}
                color={THEME.merchant}
                pose={{
                    leftArm: -Math.PI / 2,
                    rightArm: -Math.PI / 2,
                    isTalking: Math.abs(Math.sin(frame / 4))
                }}
            />
            {/* Market Stall */}
            <rect x="1100" y="600" width="300" height="150" fill="#A0522D" />
            <rect x="1080" y="580" width="340" height="20" fill="#8B4513" />
        </SceneWrapper>
    );
};

const Scene2_Reward: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <SceneWrapper title='He promised a 10 coin reward for its return.'>
            <Character x={500} y={700} scale={3} color={THEME.merchant} />
            <rect x="900" y="300" width="400" height="200" fill="white" stroke="black" strokeWidth="5" />
            <text x="1100" y="400" textAnchor="middle" style={{ fontSize: 40, fontWeight: 'bold' }}>REWARD: 10 GOLD</text>
            <text x="1100" y="460" textAnchor="middle" style={{ fontSize: 30 }}>FOR LOST BAG</text>
        </SceneWrapper>
    );
};

const Scene3_Found: React.FC = () => {
    const frame = useCurrentFrame();
    const walk = interpolate(frame, [0, 80], [0, 600]);
    return (
        <SceneWrapper title="An honest poor man found the bag.">
            <Character
                x={walk}
                y={700}
                scale={3}
                color={THEME.poorMan}
                pose={{
                    leftLeg: Math.sin(frame / 5),
                    rightLeg: -Math.sin(frame / 5),
                    rightArm: 0
                }}
            />
            <MoneyBag x={walk + 60} y={730} />
        </SceneWrapper>
    );
};

const Scene4_Greed: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <SceneWrapper title='"You already took the reward!" lied the merchant.'>
            <Character x={700} y={700} scale={3} color={THEME.poorMan} pose={{ leftArm: -1, rightArm: -1 }} />
            <Character
                x={1200}
                y={700}
                scale={3}
                color={THEME.merchant}
                pose={{
                    leftArm: 0,
                    rightArm: Math.PI,
                    isTalking: Math.abs(Math.sin(frame / 3))
                }}
            />
            <MoneyBag x={950} y={700} scale={1.5} />
        </SceneWrapper>
    );
};

const Scene5_Judge: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <SceneWrapper title="They went to the wise Judge.">
            <Character x={400} y={700} scale={3} color={THEME.poorMan} />
            <Character x={1520} y={700} scale={3} color={THEME.merchant} />
            {/* Judge in the middle */}
            <rect x="860" y="400" width="200" height="350" fill={THEME.judge} />
            <Character x={960} y={450} scale={3.5} color="white" width={8} />
            <text x="960" y="350" textAnchor="middle" style={{ fontSize: 50, fontWeight: 'bold', fill: THEME.judge }}>THE JUDGE</text>
        </SceneWrapper>
    );
};

const Scene6_Justice: React.FC = () => {
    const frame = useCurrentFrame();
    const bagMove = interpolate(frame, [50, 100], [960, 400]);
    return (
        <SceneWrapper title='"This bag is not yours," said the Judge.'>
            <Character x={400} y={700} scale={3} color={THEME.poorMan} pose={{ rightArm: 0 }} />
            <Character x={1520} y={700} scale={3} color={THEME.merchant} pose={{ leftArm: 1, rightArm: 1 }} />
            <Character x={960} y={450} scale={3.5} color={THEME.judge} pose={{ isTalking: Math.abs(Math.sin(frame / 5)) }} />
            <MoneyBag x={bagMove} y={720} scale={1.5} />
        </SceneWrapper>
    );
};

const Scene7_Moral: React.FC = () => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', color: 'white', padding: 100 }}>
                <h2 style={{ color: THEME.merchant, fontSize: 60, marginBottom: 30 }}>MORAL OF THE STORY</h2>
                <h1 style={{ fontSize: 100, fontWeight: 900 }}>"GREED ALWAYS LEADS TO LOSS."</h1>
                <p style={{ fontSize: 40, opacity: 0.7, marginTop: 40 }}>The merchant lost all his gold by trying to save a small reward.</p>
            </div>
        </AbsoluteFill>
    );
};

export const GreedyMerchant: React.FC = () => {
    return (
        <Series>
            <Series.Sequence durationInFrames={150}><Scene1_Lost /></Series.Sequence>
            <Series.Sequence durationInFrames={150}><Scene2_Reward /></Series.Sequence>
            <Series.Sequence durationInFrames={150}><Scene3_Found /></Series.Sequence>
            <Series.Sequence durationInFrames={180}><Scene4_Greed /></Series.Sequence>
            <Series.Sequence durationInFrames={150}><Scene5_Judge /></Series.Sequence>
            <Series.Sequence durationInFrames={180}><Scene6_Justice /></Series.Sequence>
            <Series.Sequence durationInFrames={210}><Scene7_Moral /></Series.Sequence>
        </Series>
    );
};
