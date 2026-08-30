import React from 'react';
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
    Sequence,
    Audio,
    staticFile,
    Video
} from 'remotion';

// Import font configurations from PremiumKit
import { FONT_IMPORT, FONT_STACK, Callout } from './components/PremiumKit';

// --- THEME ---
const AMETHYST_THEME = {
    bg: '#080512',
    purple: '#A855F7',
    cyan: '#06B6D4',
    rose: '#F43F5E',
    darkAmethyst: '#180B2B',
    white: '#FFFFFF',
    glassBorder: 'rgba(168, 85, 247, 0.4)',
    glassBg: 'rgba(15, 10, 25, 0.65)',
};

// --- DYNAMIC HELPERS ---
const DriftingCamera: React.FC<{ children: React.ReactNode; duration: number }> = ({ children, duration }) => {
    const frame = useCurrentFrame();
    const scale = interpolate(frame, [0, duration], [1.0, 1.15], { extrapolateRight: 'clamp' });
    return (
        <div style={{ transform: `scale(${scale}) translate3d(0, 0, 0)`, width: '100%', height: '100%', transformOrigin: 'center center', willChange: 'transform' }}>
            {children}
        </div>
    );
};

const PopIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const activeFrame = Math.max(0, frame - delay);
    const scale = spring({ frame: activeFrame, fps, config: { damping: 12, stiffness: 100 } });
    if (frame < delay) return null;
    return (
        <div style={{ transform: `scale(${scale})`, opacity: scale, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {children}
        </div>
    );
};

// --- SCENE 1: CUSTOM SVG (OBSOLETE CHAT) ---
const ObsoleteChatSVG: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    
    // Draw input bar outline
    const inputDraw = spring({ frame, fps, config: { damping: 15 } });
    
    // Strike line animation at frame 40
    const strikeProgress = spring({ frame: Math.max(0, frame - 40), fps, config: { damping: 10 } });
    const strikeWidth = interpolate(strikeProgress, [0, 1], [0, 480]);
    
    return (
        <svg width="500" height="200" viewBox="0 0 500 200" style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}>
            {/* Glassmorphic input box */}
            <rect 
                x="10" 
                y="60" 
                width="480" 
                height="80" 
                rx="20" 
                fill={AMETHYST_THEME.glassBg} 
                stroke={AMETHYST_THEME.purple} 
                strokeWidth="4"
                style={{ strokeDasharray: 1200, strokeDashoffset: 1200 * (1 - inputDraw) }}
            />
            {/* Text prompt inside */}
            <text 
                x="40" 
                y="110" 
                fill="rgba(255,255,255,0.4)" 
                fontFamily={FONT_STACK.mono} 
                fontSize="24" 
                fontWeight="bold"
            >
                Type a prompt...
            </text>
            
            {/* Spark cursor pulsing */}
            {frame % 20 < 10 && (
                <rect x="250" y="85" width="4" height="30" fill={AMETHYST_THEME.cyan} />
            )}

            {/* Glowing Red Slash representing OBSOLETE */}
            <line 
                x1="10" 
                y1="100" 
                x2={10 + strikeWidth} 
                y2="100" 
                stroke={AMETHYST_THEME.rose} 
                strokeWidth="12" 
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 10px #F43F5E)' }}
            />
            
            {strikeProgress > 0.1 && (
                <text 
                    x="250" 
                    y="112" 
                    fill="#FFFFFF" 
                    fontFamily={FONT_STACK.impact} 
                    fontSize="42" 
                    textAnchor="middle" 
                    style={{ letterSpacing: 6, textShadow: '0 0 15px #F43F5E' }}
                >
                    OBSOLETE
                </text>
            )}
        </svg>
    );
};

// --- SCENE 2: CUSTOM SVG (SPARK AUTONOMY NEURAL HUB) ---
const SparkAutonomySVG: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Central hub pulse
    const pulse = interpolate(Math.sin(frame / 6), [-1, 1], [0.95, 1.05]);
    
    // Draw connections
    const lineDraw = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 15 } });
    
    // Pulse particles traversing lines
    const t = (frame % 45) / 45;
    const particleX = interpolate(t, [0, 1], [150, 260]);
    const particleY = interpolate(t, [0, 1], [150, 60]);

    return (
        <svg width="400" height="320" viewBox="0 0 400 320" style={{ filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.6))' }}>
            {/* Connection lines from center to outer apps */}
            <line x1="200" y1="160" x2={200 + (100 * lineDraw)} y2={160 - (100 * lineDraw)} stroke={AMETHYST_THEME.cyan} strokeWidth="4" strokeDasharray="5 5" />
            <line x1="200" y1="160" x2={200 - (100 * lineDraw)} y2={160 - (100 * lineDraw)} stroke={AMETHYST_THEME.cyan} strokeWidth="4" />
            <line x1="200" y1="160" x2={200 + (120 * lineDraw)} y2={160} stroke={AMETHYST_THEME.cyan} strokeWidth="4" />
            <line x1="200" y1="160" x2={200 - (120 * lineDraw)} y2="160" stroke={AMETHYST_THEME.cyan} strokeWidth="4" strokeDasharray="5 5" />

            {/* Central Spark Amethyst Core */}
            <circle 
                cx="200" 
                cy="160" 
                r={45 * pulse} 
                fill="url(#spark-glow-grad)" 
                stroke={AMETHYST_THEME.cyan} 
                strokeWidth="3"
                style={{ filter: 'drop-shadow(0 0 15px rgba(6, 182, 212, 0.8))' }}
            />
            <text x="200" y="168" fill="white" fontFamily={FONT_STACK.impact} fontSize="26" textAnchor="middle">SPARK</text>

            {/* Outer Apps with Glassmorphic circles */}
            {/* App 1: Docs (Top Right) */}
            <circle cx="300" cy="60" r="28" fill={AMETHYST_THEME.glassBg} stroke={AMETHYST_THEME.purple} strokeWidth="2" />
            <text x="300" y="67" fill="white" fontFamily={FONT_STACK.mono} fontSize="18" textAnchor="middle">DOC</text>

            {/* App 2: Mail (Top Left) */}
            <circle cx="100" cy="60" r="28" fill={AMETHYST_THEME.glassBg} stroke={AMETHYST_THEME.purple} strokeWidth="2" />
            <text x="100" y="67" fill="white" fontFamily={FONT_STACK.mono} fontSize="18" textAnchor="middle">MAIL</text>

            {/* App 3: Calendar (Right) */}
            <circle cx="320" cy="160" r="28" fill={AMETHYST_THEME.glassBg} stroke={AMETHYST_THEME.purple} strokeWidth="2" />
            <text x="320" y="167" fill="white" fontFamily={FONT_STACK.mono} fontSize="18" textAnchor="middle">CAL</text>

            {/* App 4: Code/Workspace (Left) */}
            <circle cx="80" cy="160" r="28" fill={AMETHYST_THEME.glassBg} stroke={AMETHYST_THEME.purple} strokeWidth="2" />
            <text x="80" y="167" fill="white" fontFamily={FONT_STACK.mono} fontSize="18" textAnchor="middle">CODE</text>

            {/* Pulses traveling (only if line is drawn) */}
            {lineDraw > 0.8 && (
                <>
                    <circle cx={200 + (particleX - 150)} cy={160 - (150 - particleY)} r="6" fill={AMETHYST_THEME.cyan} style={{ filter: 'drop-shadow(0 0 8px #06B6D4)' }} />
                    <circle cx={200 - (particleX - 150)} cy={160 - (150 - particleY)} r="6" fill={AMETHYST_THEME.cyan} style={{ filter: 'drop-shadow(0 0 8px #06B6D4)' }} />
                </>
            )}

            {/* Definitions for gradient */}
            <defs>
                <radialGradient id="spark-glow-grad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#A855F7" />
                    <stop offset="70%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#080512" />
                </radialGradient>
            </defs>
        </svg>
    );
};

// --- SCENE 3: CUSTOM SVG (AUTONOMOUS COGNITIVE ENGINE) ---
const AgenticCtgSVG: React.FC = () => {
    const frame = useCurrentFrame();
    
    // Count up from 0 to 99.8%
    const progress = interpolate(frame, [0, 180], [0, 99.8], {
        extrapolateRight: 'clamp',
    });

    const angle = interpolate(progress, [0, 100], [0, 360]);

    return (
        <svg width="350" height="350" viewBox="0 0 200 200" style={{ filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.5))' }}>
            {/* Dashboard background circle */}
            <circle cx="100" cy="100" r="80" fill={AMETHYST_THEME.glassBg} stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            
            {/* Pulsing Outer Neon Cyan Rim */}
            <circle 
                cx="100" 
                cy="100" 
                r="80" 
                fill="none" 
                stroke={AMETHYST_THEME.cyan} 
                strokeWidth="6" 
                strokeDasharray="502" 
                strokeDashoffset={502 * (1 - angle / 360)}
                strokeLinecap="round"
                style={{ 
                    transform: 'rotate(-90deg)', 
                    transformOrigin: '100px 100px',
                    filter: 'drop-shadow(0 0 8px #06B6D4)' 
                }}
            />

            {/* Inner Purple ticks */}
            <circle 
                cx="100" 
                cy="100" 
                r="68" 
                fill="none" 
                stroke={AMETHYST_THEME.purple} 
                strokeWidth="2" 
                strokeDasharray="8 6" 
                opacity="0.6"
            />

            {/* Massive real-time percentage */}
            <text 
                x="100" 
                y="98" 
                fill="white" 
                fontFamily={FONT_STACK.mono} 
                fontSize="32" 
                textAnchor="middle"
                style={{ letterSpacing: 1, fontVariantNumeric: 'tabular-nums' }}
            >
                {progress.toFixed(1)}%
            </text>

            <text 
                x="100" 
                y="130" 
                fill={AMETHYST_THEME.cyan} 
                fontFamily={FONT_STACK.mono} 
                fontSize="12" 
                fontWeight="900"
                textAnchor="middle"
                style={{ letterSpacing: 2 }}
            >
                AUTONOMY
            </text>

            <text 
                x="100" 
                y="152" 
                fill="rgba(255,255,255,0.4)" 
                fontFamily={FONT_STACK.body} 
                fontSize="10" 
                textAnchor="middle"
                style={{ letterSpacing: 1 }}
            >
                SWARM ACTIVE
            </text>
        </svg>
    );
};

// --- MAIN GEMINI SPARK COMPOSITION ---
export const GeminiSpark: React.FC = () => {
    const frame = useCurrentFrame();
    
    // Setup durations (totaling exactly 900 frames / 30 seconds)
    const d1 = 210; // Sequence 1
    const d2 = 354; // Sequence 2
    const d3 = 336; // Sequence 3
    
    return (
        <AbsoluteFill style={{ backgroundColor: AMETHYST_THEME.bg, overflow: 'hidden' }}>
            {/* Load Google Fonts */}
            <style>{FONT_IMPORT}</style>
            
            {/* Background Ambient Bed */}
            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.04} loop />
            
            {/* DYNAMIC TOP BAR HEADER */}
            <div style={{
                position: 'absolute',
                top: 80,
                left: 0,
                right: 0,
                height: 60,
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 80px',
                alignItems: 'center',
                zIndex: 100,
                borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}>
                <span style={{ color: AMETHYST_THEME.purple, fontFamily: FONT_STACK.impact, fontSize: 32, letterSpacing: 2 }}>GOOGLE I/O 2026</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: AMETHYST_THEME.cyan, animation: 'pulse 1.5s infinite' }} />
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: FONT_STACK.mono, fontSize: 16 }}>AGENTIC_REPORT</span>
                </div>
            </div>

            {/* ==================== SEQUENCE 1: CHAT IS OBSOLETE (0 - 210) ==================== */}
            <Sequence durationInFrames={d1}>
                {/* Scene Voiceover */}
                <Audio src={staticFile("spark_vo1.wav")} />
                {/* Whoosh at transition start */}
                <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.4} />
                
                {/* Background Video with Purple Tint and Vignette Overlay */}
                <AbsoluteFill style={{ overflow: 'hidden' }}>
                    <DriftingCamera duration={d1}>
                        <Video 
                            src={staticFile("spark_bg1.mp4")} 
                            loop 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                    </DriftingCamera>
                    {/* Visual Color grading overlay */}
                    <div style={{ 
                        position: 'absolute', 
                        inset: 0, 
                        background: `linear-gradient(to bottom, rgba(8,5,18,0.7) 10%, rgba(24,11,43,0.85) 90%)`,
                        mixBlendMode: 'multiply' 
                    }} />
                    <div style={{ 
                        position: 'absolute', 
                        inset: 0, 
                        boxShadow: 'inset 0 0 150px rgba(0,0,0,0.9)' 
                    }} />
                </AbsoluteFill>

                {/* Content Overlay */}
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', zIndex: 10, padding: '160px 40px 100px 40px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%', width: '100%' }}>
                        
                        {/* Upper Section: Kinetic Headlines */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 100 }}>
                            <PopIn delay={0}>
                                <h1 style={{ 
                                    fontFamily: FONT_STACK.display, 
                                    fontSize: 100, 
                                    color: AMETHYST_THEME.white, 
                                    margin: 0, 
                                    textAlign: 'center',
                                    lineHeight: 1.0,
                                    letterSpacing: 4
                                }}>
                                    CHAT BOXES
                                </h1>
                            </PopIn>
                            <PopIn delay={18}>
                                <h1 style={{ 
                                    fontFamily: FONT_STACK.impact, 
                                    fontSize: 130, 
                                    color: AMETHYST_THEME.rose, 
                                    margin: 0, 
                                    textAlign: 'center',
                                    lineHeight: 1.0,
                                    letterSpacing: 6,
                                    textShadow: '0 0 30px rgba(244,63,94,0.6)'
                                }}>
                                    ARE DEAD.
                                </h1>
                            </PopIn>
                        </div>

                        {/* Mid Section: Custom Animation */}
                        <PopIn delay={30}>
                            <ObsoleteChatSVG />
                        </PopIn>

                        {/* Bottom Section: Premium Callout Card */}
                        <PopIn delay={75}>
                            <Callout 
                                type="danger" 
                                title="THE SHIFT IS REAL" 
                                body="ChatGPT made AI an assistant. But Google Spark operates in the background."
                                style={{ width: '90%', padding: '25px 35px', borderRadius: 20 }}
                            />
                        </PopIn>
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* ==================== SEQUENCE 2: ALWAYS-ON AGENT (210 - 564) ==================== */}
            <Sequence from={d1} durationInFrames={d2}>
                {/* Scene Voiceover */}
                <Audio src={staticFile("spark_vo2.wav")} />
                {/* Whoosh at transition start */}
                <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.4} />
                {/* Popup SFX on key visual entry */}
                <Audio src={staticFile("sfx/pop.mp3")} volume={0.3} startFrom={30} />
                
                {/* Background Video with Cyan/Purple Gradient Overlay */}
                <AbsoluteFill style={{ overflow: 'hidden' }}>
                    <DriftingCamera duration={d2}>
                        <Video 
                            src={staticFile("spark_bg2.mp4")} 
                            loop 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                    </DriftingCamera>
                    {/* Visual Color grading overlay */}
                    <div style={{ 
                        position: 'absolute', 
                        inset: 0, 
                        background: `linear-gradient(135deg, rgba(24,11,43,0.85) 0%, rgba(8,5,18,0.7) 100%)`,
                        mixBlendMode: 'multiply' 
                    }} />
                    <div style={{ 
                        position: 'absolute', 
                        inset: 0, 
                        boxShadow: 'inset 0 0 150px rgba(0,0,0,0.9)' 
                    }} />
                </AbsoluteFill>

                {/* Content Overlay */}
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', zIndex: 10, padding: '160px 40px 100px 40px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%', width: '100%' }}>
                        
                        {/* Upper Section: Kinetic Headlines */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 100 }}>
                            <PopIn delay={0}>
                                <span style={{ 
                                    fontFamily: FONT_STACK.condensed, 
                                    fontSize: 42, 
                                    color: AMETHYST_THEME.cyan, 
                                    textTransform: 'uppercase',
                                    fontWeight: 'bold',
                                    letterSpacing: 8,
                                    marginBottom: 5
                                }}>
                                    Introducing
                                </span>
                            </PopIn>
                            <PopIn delay={12}>
                                <h1 style={{ 
                                    fontFamily: FONT_STACK.impact, 
                                    fontSize: 110, 
                                    color: AMETHYST_THEME.white, 
                                    margin: 0, 
                                    textAlign: 'center',
                                    lineHeight: 1.0,
                                    letterSpacing: 2,
                                    textShadow: '0 0 30px rgba(168,85,247,0.4)'
                                }}>
                                    GEMINI SPARK
                                </h1>
                            </PopIn>
                        </div>

                        {/* Mid Section: Autonomy SVG Neural Hub */}
                        <PopIn delay={30}>
                            <SparkAutonomySVG />
                        </PopIn>

                        {/* Bottom Section: Glassmorphic Features */}
                        <PopIn delay={70}>
                            <div style={{
                                width: '90%',
                                backgroundColor: AMETHYST_THEME.glassBg,
                                border: `2px solid ${AMETHYST_THEME.glassBorder}`,
                                padding: '25px 35px',
                                borderRadius: 24,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 10,
                                backdropFilter: 'blur(12px)',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ fontSize: 24 }}>⚡</span>
                                    <span style={{ fontSize: 22, color: AMETHYST_THEME.cyan, fontFamily: FONT_STACK.mono, fontWeight: 'bold' }}>100% BACKGROUND EXECUTION</span>
                                </div>
                                <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', fontFamily: FONT_STACK.body, lineHeight: 1.4 }}>
                                    Runs constantly behind the scenes, integrating Docs, Gmail, Calendar, and APIs.
                                </div>
                            </div>
                        </PopIn>
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* ==================== SEQUENCE 3: DEPLOY OR DIE / THE AGENTIC ERA (564 - 900) ==================== */}
            <Sequence from={d1 + d2} durationInFrames={d3}>
                {/* Scene Voiceover (stops around frame 824, allowing outro buffer) */}
                <Audio src={staticFile("spark_vo3.wav")} />
                {/* Whoosh at transition start */}
                <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.4} />
                {/* Cyber pulse SFX on circular progress */}
                <Audio src={staticFile("sfx/pop.mp3")} volume={0.3} startFrom={10} />
                <Audio src={staticFile("sfx/clock.mp3")} volume={0.25} startFrom={60} />
                
                {/* Background Video with Deep Violet Grading */}
                <AbsoluteFill style={{ overflow: 'hidden' }}>
                    <DriftingCamera duration={d3}>
                        <Video 
                            src={staticFile("spark_bg3.mp4")} 
                            loop 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                    </DriftingCamera>
                    {/* Visual Color grading overlay */}
                    <div style={{ 
                        position: 'absolute', 
                        inset: 0, 
                        background: `linear-gradient(to bottom, rgba(8,5,18,0.75) 0%, rgba(24,11,43,0.9) 100%)`,
                        mixBlendMode: 'multiply' 
                    }} />
                    <div style={{ 
                        position: 'absolute', 
                        inset: 0, 
                        boxShadow: 'inset 0 0 150px rgba(0,0,0,0.95)' 
                    }} />
                </AbsoluteFill>

                {/* Content Overlay */}
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', zIndex: 10, padding: '160px 40px 100px 40px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%', width: '100%' }}>
                        
                        {/* Upper Section: Kinetic Headlines */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 100 }}>
                            <PopIn delay={0}>
                                <h1 style={{ 
                                    fontFamily: FONT_STACK.impact, 
                                    fontSize: 105, 
                                    color: AMETHYST_THEME.purple, 
                                    margin: 0, 
                                    textAlign: 'center',
                                    lineHeight: 0.9,
                                    letterSpacing: 4,
                                    textShadow: '0 0 25px rgba(168,85,247,0.4)'
                                }}>
                                    THE AGENTIC
                                </h1>
                            </PopIn>
                            <PopIn delay={15}>
                                <h1 style={{ 
                                    fontFamily: FONT_STACK.display, 
                                    fontSize: 135, 
                                    color: AMETHYST_THEME.white, 
                                    margin: 0, 
                                    textAlign: 'center',
                                    lineHeight: 1.0,
                                    letterSpacing: 8
                                }}>
                                    ERA IS HERE.
                                </h1>
                            </PopIn>
                        </div>

                        {/* Mid Section: Autonomous Circle Dashboard */}
                        <PopIn delay={30}>
                            <AgenticCtgSVG />
                        </PopIn>

                        {/* Bottom Section: Giant CTA Glassmorphic Button */}
                        <PopIn delay={80}>
                            <div style={{
                                width: '90%',
                                backgroundColor: AMETHYST_THEME.cyan,
                                border: '2px solid rgba(255,255,255,0.2)',
                                padding: '25px 0',
                                borderRadius: 28,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                boxShadow: '0 0 30px rgba(6, 182, 212, 0.6), 0 20px 40px rgba(0,0,0,0.5)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}>
                                <span style={{
                                    color: AMETHYST_THEME.bg,
                                    fontFamily: FONT_STACK.impact,
                                    fontSize: 48,
                                    letterSpacing: 6,
                                    textTransform: 'uppercase'
                                }}>
                                    DEPLOY SPARK
                                </span>
                            </div>
                        </PopIn>
                    </div>
                </AbsoluteFill>
            </Sequence>
        </AbsoluteFill>
    );
};
