import React from 'react';
import {
    AbsoluteFill, useCurrentFrame, interpolate, spring,
    Audio, staticFile, Sequence,
} from 'remotion';
import { FONT_IMPORT, FONT_STACK } from './components/PremiumKit';
import {
    RC, GlitchTitle, StatCard, Terminal, CompanyCards, HBars,
    LineGraph, SplitCompare, TypeQuote, CircuitBG, DriftBroll,
    GlassDashboard, RobotSVG,
} from './components/RobotsKit';

// ─── HELPER FOR TIMING (Seconds to Frames) ──────────────────────
const f = (s: number) => Math.floor(s * 30);

export const RobotsUltra: React.FC = () => (
    <AbsoluteFill style={{ backgroundColor: RC.bg, fontFamily: 'Inter' }}>
        <style>{FONT_IMPORT}</style>
        <Audio src={staticFile("robots.wav")} volume={1} />
        <Audio src={staticFile("sfx/ambient.mp3")} volume={0.15} loop />

        {/* ═══ S1: THE SOFTWARE ERA (0.0 - 17.44s) ═══ */}
        <Sequence from={f(0)} durationInFrames={f(5.28)}>
            <GlitchTitle text="2026" color={RC.neonCyan} sub="THE YEAR EVERYTHING CHANGED" />
            <Audio src={staticFile("sfx/whoosh.mp3")} />
        </Sequence>

        <Sequence from={f(5.28)} durationInFrames={f(10.8 - 5.28)}>
            <DriftBroll src="broll_server_1.mp4">
                <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GlassDashboard stats={[
                        { label: 'CHATBOTS', value: '✓', color: RC.gray, icon: '💬' },
                        { label: 'IMAGE GEN', value: '✓', color: RC.gray, icon: '🖼️' },
                        { label: 'CODE ASSIST', value: '✓', color: RC.gray, icon: '💻' },
                    ]} title="THE SOFTWARE ERA" />
                </AbsoluteFill>
            </DriftBroll>
        </Sequence>

        <Sequence from={f(10.8)} durationInFrames={f(17.44 - 10.8)}>
            <DriftBroll src="broll_code.mp4" overlay="rgba(0,0,30,0.7)">
                <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GlassDashboard stats={[
                        { label: 'AI TYPE', value: 'DIGITAL', color: RC.neonCyan },
                        { label: 'INTERFACE', value: 'KEYBOARD', color: RC.grayLight },
                    ]} title="WE TYPED INTO THE VOID" />
                </AbsoluteFill>
            </DriftBroll>
            <Audio src={staticFile("sfx/pop.mp3")} />
        </Sequence>

        {/* ═══ S2: PHYSICAL AI BREAKTHROUGH (17.44 - 51.04s) ═══ */}
        <Sequence from={f(17.44)} durationInFrames={f(24.56 - 17.44)}>
            <GlitchTitle text="METAL" color={RC.white} sub="ACTUATORS · SENSORS · STEEL" />
            <Audio src={staticFile("sfx/whoosh.mp3")} />
        </Sequence>

        <Sequence from={f(24.56)} durationInFrames={f(31.84 - 24.56)}>
            <CircuitBG color={RC.neonCyan}>
                <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 80 }}>
                    <RobotSVG color={RC.neonCyan} size={350} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                        <div style={{ fontFamily: FONT_STACK.display, fontSize: 100, color: RC.white, lineHeight: 0.9 }}>HUMANOID<br />ROBOTS</div>
                        <div style={{ fontFamily: FONT_STACK.mono, fontSize: 22, color: RC.neonCyan, letterSpacing: 4 }}>STEPPING INTO THE REAL WORLD</div>
                    </div>
                </AbsoluteFill>
            </CircuitBG>
        </Sequence>

        <Sequence from={f(31.84)} durationInFrames={f(39.2 - 31.84)}>
            <StatCard value="⚙️" label="THE PHYSICAL AI ERA HAS ARRIVED" color={RC.neonCyan} />
            <Audio src={staticFile("sfx/pop 2.mp3")} />
        </Sequence>

        <Sequence from={f(39.2)} durationInFrames={f(51.04 - 39.2)}>
            <DriftBroll src="broll_brain.mp4" overlay="rgba(10,0,20,0.7)">
                <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <LineGraph
                        title="NEURAL NET → PHYSICAL ACTION"
                        points={[{ x: 0, y: 5 }, { x: 15, y: 10 }, { x: 30, y: 18 }, { x: 45, y: 30 }, { x: 60, y: 55 }, { x: 75, y: 75 }, { x: 90, y: 92 }, { x: 100, y: 100 }]}
                        color={RC.neonPink}
                        xLabel="TEXT MODELS → VLA MODELS"
                        yLabel="CAPABILITY"
                    />
                </AbsoluteFill>
            </DriftBroll>
            <Audio src={staticFile("sfx/rise.mp3")} volume={0.5} />
        </Sequence>

        {/* ═══ S3: VLA EXPLAINED (51.04 - 75.52s) ═══ */}
        <Sequence from={f(51.04)} durationInFrames={f(58.0 - 51.04)}>
            <GlitchTitle text="V·L·A" color={RC.neonGreen} sub="VISION · LANGUAGE · ACTION" />
            <Audio src={staticFile("sfx/pop.mp3")} />
        </Sequence>

        <Sequence from={f(58.0)} durationInFrames={f(69.44 - 58.0)}>
            <AbsoluteFill style={{ backgroundColor: RC.bg }}>
                <AbsoluteFill style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Terminal title="vla-model.ai/inference" accent={RC.neonGreen} lines={[
                        '$ vla-model --input "pick up the apple"',
                        '> Processing visual scene...',
                        '> Object detected: Apple (confidence: 99.2%)',
                        '> Computing grasp trajectory...',
                        '> Motor plan: 6-DOF arm sequence generated',
                        '> Grip force: 2.3N (fragile mode)',
                        '✓ Action executed successfully',
                    ]} />
                </AbsoluteFill>
            </AbsoluteFill>
            <Audio src={staticFile("sfx/typing.mp3")} />
        </Sequence>

        <Sequence from={f(69.44)} durationInFrames={f(75.52 - 69.44)}>
            <TypeQuote
                quote="Just like a human child learning to grasp, the robot sees and acts."
                author="PHYSICAL AI RESEARCH, 2026"
            />
        </Sequence>

        {/* ═══ S4: THE GIANTS (75.52 - 115.28s) ═══ */}
        <Sequence from={f(75.52)} durationInFrames={f(82.0 - 75.52)}>
            <GlitchTitle text="GIANTS" color={RC.gold} sub="THE RACE HAS BEGUN" />
            <Audio src={staticFile("sfx/rise.mp3")} volume={0.5} />
        </Sequence>

        <Sequence from={f(82.0)} durationInFrames={f(88.48 - 82.0)}>
            <CompanyCards title="THE HUMANOID ARMS RACE" items={[
                { name: 'TESLA', stat: 'OPTIMUS GEN-3', color: RC.neonCyan, icon: '⚡', desc: 'From suit to autonomous factory worker' },
                { name: 'FIGURE', stat: '$2.6B RAISED', color: RC.neonGreen, icon: '🤖', desc: 'Backed by OpenAI, Nvidia, Microsoft' },
                { name: 'BOSTON', stat: 'ATLAS DEPLOY', color: RC.gold, icon: '🏗️', desc: 'Military-grade mobility & balance' },
            ]} />
            <Audio src={staticFile("sfx/pop 2.mp3")} />
        </Sequence>

        <Sequence from={f(88.48)} durationInFrames={f(102.32 - 88.48)}>
            <DriftBroll src="broll_factory.mp4" overlay="rgba(20,10,0,0.6)">
                <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GlassDashboard title="ACTIVE DEPLOYMENTS — 2026" stats={[
                        { label: 'BMW PLANTS', value: 'ACTIVE', color: RC.neonGreen, icon: '🏭' },
                        { label: 'AMAZON LOGISTICS', value: 'ACTIVE', color: RC.neonGreen, icon: '📦' },
                        { label: 'AEROSPACE', value: 'ACTIVE', color: RC.neonGreen, icon: '✈️' },
                    ]} />
                </AbsoluteFill>
            </DriftBroll>
            <Audio src={staticFile("sfx/whoosh.mp3")} />
        </Sequence>

        <Sequence from={f(102.32)} durationInFrames={f(115.28 - 102.32)}>
            <AbsoluteFill style={{ backgroundColor: RC.bg, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Terminal title="deployment-status.log" accent={RC.neonGreen} lines={[
                    '$ humanoid-fleet --status',
                    '> BMW Munich: 12 units ACTIVE ✓',
                    '> Amazon Warehouse TX: 48 units ACTIVE ✓',
                    '> SpaceX Assembly: 6 units ACTIVE ✓',
                    '> Total uptime: 99.97%',
                    '> Breaks taken: 0',
                    '> Learning rate: COLLECTIVE',
                ]} />
            </AbsoluteFill>
            <Audio src={staticFile("sfx/typing.mp3")} />
        </Sequence>

        {/* ═══ S5: ECONOMICS ($20k / $3/hr) (115.28 - 135.84s) ═══ */}
        <Sequence from={f(115.28)} durationInFrames={f(122.64 - 115.28)}>
            <GlitchTitle text="$20,000" color={RC.neonGreen} sub="PER UNIT PRODUCTION COST" />
            <Audio src={staticFile("sfx/pop 2.mp3")} />
        </Sequence>

        <Sequence from={f(122.64)} durationInFrames={f(129.2 - 122.64)}>
            <HBars title="COST PER HOUR — HUMAN vs ROBOT" items={[
                { label: 'US Minimum Wage', value: 15, color: RC.red },
                { label: 'German Factory Worker', value: 28, color: RC.gold },
                { label: 'Humanoid Robot (amortized)', value: 3, color: RC.neonGreen },
            ]} suffix="$/hr" />
            <Audio src={staticFile("sfx/rise.mp3")} volume={0.6} />
        </Sequence>

        <Sequence from={f(129.2)} durationInFrames={f(135.84 - 129.2)}>
            <StatCard value="$3/hr" label="THE NEW COST OF LABOR" color={RC.neonGreen} sub="FUNDAMENTAL DISRUPTION" />
            <Audio src={staticFile("sfx/pop.mp3")} />
        </Sequence>

        {/* ═══ S6: AGENTIC AI & REASONING (135.84 - 171.52s) ═══ */}
        <Sequence from={f(135.84)} durationInFrames={f(142.72 - 135.84)}>
            <GlitchTitle text="AGENTIC" color={RC.neonCyan} sub="REASON · PLAN · EXECUTE" />
            <Audio src={staticFile("sfx/whoosh.mp3")} />
        </Sequence>

        <Sequence from={f(142.72)} durationInFrames={f(153.92 - 142.72)}>
            <CircuitBG color={RC.neonPink}>
                <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GlassDashboard title="AGENTIC AI CAPABILITIES" stats={[
                        { label: 'REASONING', value: 'LIVE', color: RC.neonPink, icon: '🧠' },
                        { label: 'PLANNING', value: 'LIVE', color: RC.neonCyan, icon: '📋' },
                        { label: 'EXECUTION', value: 'LIVE', color: RC.neonGreen, icon: '⚡' },
                    ]} />
                </AbsoluteFill>
            </CircuitBG>
        </Sequence>

        <Sequence from={f(153.92)} durationInFrames={f(165.04 - 153.92)}>
            <AbsoluteFill style={{ backgroundColor: RC.bg, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Terminal title="kitchen-bot.local/inference" accent={RC.neonCyan} lines={[
                    '$ scan-environment --room kitchen',
                    '> Analyzing scene... 47 objects detected',
                    '> Task: Clean kitchen autonomously',
                    '> Glass detected → FRAGILE mode (grip: 1.2N)',
                    '> Cast iron pot → HEAVY mode (grip: 45N)',
                    '> Executing 23-step cleanup sequence...',
                    '✓ Kitchen cleaned in 8 minutes 23 seconds',
                ]} />
            </AbsoluteFill>
            <Audio src={staticFile("sfx/typing.mp3")} />
        </Sequence>

        <Sequence from={f(165.04)} durationInFrames={f(171.52 - 165.04)}>
            <StatCard value="🧠" label="NOT A DEMO. NOT A CONCEPT." color={RC.neonPink} sub="THIS IS 2026 REALITY" />
            <Audio src={staticFile("sfx/pop 2.mp3")} />
        </Sequence>

        {/* ═══ S7: GLOBAL RACE & CHINA (171.52 - 202.72s) ═══ */}
        <Sequence from={f(171.52)} durationInFrames={f(178.8 - 171.52)}>
            <GlitchTitle text="CHINA" color={RC.red} sub="NATIONAL STRATEGIC PRIORITY" />
            <Audio src={staticFile("sfx/whoosh.mp3")} />
        </Sequence>

        <Sequence from={f(178.8)} durationInFrames={f(185.36 - 178.8)}>
            <SplitCompare
                leftTitle="USA" rightTitle="CHINA"
                leftColor={RC.blue} rightColor={RC.red}
                leftIcon="🇺🇸" rightIcon="🇨🇳"
                leftSub="Private sector led. Tesla, Figure, Boston Dynamics."
                rightSub="State-backed. Massive subsidies. Mass production mandate."
            />
            <Audio src={staticFile("sfx/pop.mp3")} />
        </Sequence>

        <Sequence from={f(185.36)} durationInFrames={f(202.72 - 185.36)}>
            <DriftBroll src="broll_microchip.mp4" overlay="rgba(20,0,0,0.6)">
                <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GlassDashboard title="THE NEW SPACE RACE" stats={[
                        { label: 'TARGET', value: 'WORKFORCE', color: RC.red, icon: '🏭' },
                        { label: 'SUBSIDIES', value: 'MASSIVE', color: RC.gold, icon: '💰' },
                        { label: 'TIMELINE', value: '2026-2030', color: RC.neonCyan, icon: '📅' },
                    ]} />
                </AbsoluteFill>
            </DriftBroll>
            <Audio src={staticFile("sfx/rise.mp3")} volume={0.5} />
        </Sequence>

        {/* ═══ S8: NVIDIA GR00T (202.72 - 221.84s) ═══ */}
        <Sequence from={f(202.72)} durationInFrames={f(215.28 - 202.72)}>
            <CircuitBG color={RC.neonGreen}>
                <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 60 }}>
                    <RobotSVG color={RC.neonGreen} size={300} />
                    <div>
                        <div style={{ fontFamily: FONT_STACK.display, fontSize: 90, color: RC.white }}>PROJECT<br />GR00T</div>
                        <div style={{ fontFamily: FONT_STACK.mono, fontSize: 20, color: RC.neonGreen, marginTop: 20, letterSpacing: 3 }}>GENERAL PURPOSE ROBOTIC BRAIN</div>
                    </div>
                </AbsoluteFill>
            </CircuitBG>
            <Audio src={staticFile("sfx/pop 2.mp3")} />
        </Sequence>

        <Sequence from={f(215.28)} durationInFrames={f(221.84 - 215.28)}>
            <TypeQuote quote="It was the Android OS moment — but for actual physical androids." author="THE ROBOTICS REVOLUTION, 2026" />
            <Audio src={staticFile("sfx/clock.mp3")} volume={0.5} />
        </Sequence>

        {/* ═══ S9: ECONOMY & DISPLACEMENT (221.84 - 250.72s) ═══ */}
        <Sequence from={f(221.84)} durationInFrames={f(228.88 - 221.84)}>
            <GlitchTitle text="HUMAN?" color={RC.neonPink} sub="WHAT HAPPENS TO THE WORKER?" />
            <Audio src={staticFile("sfx/whoosh.mp3")} />
        </Sequence>

        <Sequence from={f(228.88)} durationInFrames={f(240.08 - 228.88)}>
            <DriftBroll src="broll_crowd.mp4" overlay="rgba(20,0,10,0.6)">
                <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LineGraph
                        title="PROJECTED LABOR DISPLACEMENT"
                        points={[{ x: 0, y: 2 }, { x: 15, y: 5 }, { x: 30, y: 12 }, { x: 45, y: 25 }, { x: 60, y: 45 }, { x: 75, y: 68 }, { x: 90, y: 82 }, { x: 100, y: 90 }]}
                        color={RC.neonPink}
                        xLabel="2024 → 2032"
                        yLabel="% AUTOMATED"
                    />
                </AbsoluteFill>
            </DriftBroll>
            <Audio src={staticFile("sfx/rise.mp3")} volume={0.6} />
        </Sequence>

        <Sequence from={f(240.08)} durationInFrames={f(250.72 - 240.08)}>
            <AbsoluteFill style={{ backgroundColor: RC.bg, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Terminal title="global-economy.forecast" accent={RC.gold} lines={[
                    '$ forecast --sector "manual-labor" --year 2030',
                    '> WARNING: Massive pushback expected',
                    '> WARNING: Regulatory battles pending',
                    '> WARNING: Societal friction imminent',
                    '',
                    '> Supply chains: MOVING.',
                ]} />
            </AbsoluteFill>
            <Audio src={staticFile("sfx/typing.mp3")} />
        </Sequence>

        {/* ═══ S10: HARDWARE BREAKTHROUGHS (250.72 - 292.96s) ═══ */}
        <Sequence from={f(250.72)} durationInFrames={f(267.76 - 250.72)}>
            <HBars title="BATTERY DENSITY REVOLUTION" items={[
                { label: 'Lithium Ion (Legacy)', value: 45, color: RC.red },
                { label: 'Sodium Ion (Scale)', value: 92, color: RC.neonGreen },
            ]} suffix="%" />
            <Audio src={staticFile("sfx/pop 2.mp3")} />
        </Sequence>

        <Sequence from={f(267.76)} durationInFrames={f(280.72 - 267.76)}>
            <DriftBroll src="broll_android.mp4" overlay="rgba(15,0,20,0.6)">
                <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GlassDashboard title="SYNTHETIC SKIN REVOLUTION" stats={[
                        { label: 'PRESSURE', value: '0.01N', color: RC.neonPink, icon: '👆' },
                        { label: 'TEMPERATURE', value: '±0.1°C', color: RC.neonCyan, icon: '🌡️' },
                    ]} />
                </AbsoluteFill>
            </DriftBroll>
        </Sequence>

        <Sequence from={f(280.72)} durationInFrames={f(292.96 - 280.72)}>
            <StatCard value="=" label="PRECISION MATCHES HUMAN DEXTERITY" color={RC.neonGreen} sub="2026 — THE CONVERGENCE POINT" />
            <Audio src={staticFile("sfx/pop.mp3")} />
        </Sequence>

        {/* ═══ S11: PERSONAL ROBOTS & OUTRO (292.96 - 326.65s) ═══ */}
        <Sequence from={f(292.96)} durationInFrames={f(304.72 - 292.96)}>
            <DriftBroll src="broll_humanoid_1.mp4">
                <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GlassDashboard title="PERSONAL DOMESTIC ERA" stats={[
                        { label: 'LAUNDRY', value: 'FOLDED', color: RC.neonCyan, icon: '👕' },
                        { label: 'COOKING', value: 'AUTOMATED', color: RC.gold, icon: '🍳' },
                    ]} />
                </AbsoluteFill>
            </DriftBroll>
            <Audio src={staticFile("sfx/pop 2.mp3")} />
        </Sequence>

        <Sequence from={f(304.72)} durationInFrames={f(317.6 - 304.72)}>
            <DriftBroll src="broll_data_center.mp4" overlay="rgba(0,5,15,0.7)">
                <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GlassDashboard title="WHO'S BETTING EVERYTHING?" stats={[
                        { label: 'TESLA', value: '$1T+', color: RC.neonCyan },
                        { label: 'NVIDIA', value: '$2T+', color: RC.neonGreen },
                    ]} />
                </AbsoluteFill>
            </DriftBroll>
            <Audio src={staticFile("sfx/clock.mp3")} />
        </Sequence>

        <Sequence from={f(317.6)} durationInFrames={f(326.65 - 317.6)}>
            <CircuitBG color={RC.neonCyan}>
                <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30 }}>
                    <RobotSVG color={RC.neonCyan} size={250} />
                    <div style={{ fontFamily: FONT_STACK.display, fontSize: 100, color: RC.white, textAlign: 'center' }}>SUBSCRIBE</div>
                    <div style={{ fontFamily: FONT_STACK.mono, fontSize: 24, color: RC.grayLight, letterSpacing: 4 }}>THE PHYSICAL AI ERA HAS BEGUN</div>
                </AbsoluteFill>
            </CircuitBG>
        </Sequence>

        {/* Global vignette */}
        <AbsoluteFill style={{ boxShadow: 'inset 0 0 400px rgba(0,0,0,0.9)', pointerEvents: 'none', zIndex: 100 }} />
    </AbsoluteFill>
);
