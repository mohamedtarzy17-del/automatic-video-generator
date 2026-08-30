import React from 'react';
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
    Sequence,
    interpolateColors,
    Audio,
    staticFile
} from 'remotion';

const FontStyles: React.FC = () => (
    <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700;900&display=swap');
        `}
    </style>
);

const THEME = {
    bg: '#0B0C10',       // Obsidian Deep Space
    bgAlt: '#121419',    // Slightly Lighter Void
    text: '#FFFFFF',     // Stark White
    primary: '#66FCF1',  // Cyber Teal
    secondary: '#45A29E',// Deep Teal
    alert: '#F2A900',    // Hazard Yellow
};

const Pop: React.FC<{ children: React.ReactNode; delay?: number, scaleBase?: number }> = ({ children, delay = 0, scaleBase = 1 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const progress = Math.max(0, frame - delay);
    const pop = spring({ frame: progress, fps, config: { damping: 12 } });

    // Hide entirely before delay
    if (frame < delay) return null;

    return <div style={{ transform: `scale(${pop * scaleBase})`, display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>{children}</div>;
};

// --- Custom Physics SVGs ---

const GlobeNetworkSVG: React.FC = () => {
    const frame = useCurrentFrame();
    const rotation = (frame * 1.5) % 360;
    const pulse = interpolate(Math.sin(frame / 10), [-1, 1], [0.8, 1.2]);

    return (
        <svg width="250" height="250" viewBox="0 0 250 250">
            <circle cx="125" cy="125" r="100" fill="none" stroke={THEME.secondary} strokeWidth="4" strokeDasharray="10 15" />
            <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '125px 125px' }}>
                <circle cx="125" cy="40" r="10" fill={THEME.primary} style={{ transform: `scale(${pulse})`, transformOrigin: '125px 40px' }} />
                <circle cx="210" cy="125" r="10" fill={THEME.primary} />
                <circle cx="125" cy="210" r="10" fill={THEME.primary} style={{ transform: `scale(${pulse})`, transformOrigin: '125px 210px' }} />
                <circle cx="40" cy="125" r="10" fill={THEME.primary} />
                <line x1="125" y1="40" x2="210" y2="125" stroke={THEME.primary} strokeWidth="3" />
                <line x1="210" y1="125" x2="125" y2="210" stroke={THEME.primary} strokeWidth="3" />
                <line x1="125" y1="210" x2="40" y2="125" stroke={THEME.primary} strokeWidth="3" />
                <line x1="40" y1="125" x2="125" y2="40" stroke={THEME.primary} strokeWidth="3" />
            </g>
            <circle cx="125" cy="125" r="15" fill={THEME.alert} />
            <line x1="125" y1="125" x2="125" y2="50" stroke={THEME.alert} strokeWidth="2" strokeDasharray="5" />
        </svg>
    );
};

const CyberChartSVG: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
    const frame = useCurrentFrame();
    const progress = Math.max(0, frame - delay);
    const draw = Math.max(0, interpolate(progress, [0, 40], [400, 0], { extrapolateRight: 'clamp' }));

    return (
        <svg width="300" height="250" viewBox="0 0 300 250">
            <polyline points="20,230 100,150 180,180 280,40" fill="none" stroke={THEME.primary} strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="400" strokeDashoffset={draw} />
            <circle cx="280" cy="40" r="15" fill={THEME.alert} />
            <line x1="20" y1="20" x2="20" y2="230" stroke={THEME.secondary} strokeWidth="6" strokeLinecap="round" />
            <line x1="20" y1="230" x2="280" y2="230" stroke={THEME.secondary} strokeWidth="6" strokeLinecap="round" />
        </svg>
    );
};

const AirplaneSVG: React.FC = () => (
    <svg width="250" height="250" viewBox="0 0 250 250" style={{ transform: 'rotate(45deg)' }}>
        <path d="M 125 30 L 140 80 L 220 120 L 140 140 L 125 220 L 110 140 L 30 120 L 110 80 Z" fill={THEME.primary} />
    </svg>
);

const MoleculeSVG: React.FC = () => {
    const frame = useCurrentFrame();
    const r1 = (frame * 3) % 360;
    const r2 = (-frame * 2) % 360;
    return (
        <svg width="250" height="250" viewBox="0 0 250 250">
            <circle cx="125" cy="125" r="25" fill={THEME.alert} />
            <ellipse cx="125" cy="125" rx="100" ry="30" fill="none" stroke={THEME.primary} strokeWidth="6" style={{ transform: `rotate(${r1}deg)`, transformOrigin: '125px 125px' }} />
            <ellipse cx="125" cy="125" rx="100" ry="30" fill="none" stroke={THEME.secondary} strokeWidth="6" style={{ transform: `rotate(${r2}deg)`, transformOrigin: '125px 125px' }} />
        </svg>
    );
};

const SplitBrainSVG: React.FC = () => {
    return (
        <svg width="300" height="250" viewBox="0 0 300 250">
            <path d="M 150 40 C 90 30 40 70 50 130 C 60 190 120 200 150 210 Z" fill={THEME.secondary} />
            <line x1="60" y1="130" x2="140" y2="80" stroke="#000" strokeWidth="4" />
            <line x1="60" y1="130" x2="140" y2="180" stroke="#000" strokeWidth="4" />
            <path d="M 150 40 C 210 30 260 70 250 130 C 240 190 180 200 150 210 Z" fill={THEME.primary} />
            <circle cx="200" cy="90" r="15" fill={THEME.alert} />
            <circle cx="220" cy="150" r="12" fill={THEME.text} />
            <line x1="150" y1="20" x2="150" y2="230" stroke={THEME.bg} strokeWidth="10" />
        </svg>
    );
};

const DeleteMatrixSVG: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
    const frame = useCurrentFrame();
    const progress = Math.max(0, frame - delay);
    const erase = interpolate(progress, [0, 45], [250, 0], { extrapolateRight: 'clamp' });

    return (
        <svg width="250" height="250" viewBox="0 0 250 250">
            <rect x="25" y="25" width="200" height="200" rx="10" fill="none" stroke={THEME.secondary} strokeWidth="8" />
            <text x="50" y="80" fill={THEME.text} fontFamily="Space Grotesk" fontSize="24">WORD</text>
            <text x="120" y="140" fill={THEME.primary} fontFamily="Space Grotesk" fontSize="24">CULT</text>
            <text x="60" y="200" fill={THEME.alert} fontFamily="Space Grotesk" fontSize="24">PHILOS</text>

            <rect x="25" y="25" width="200" height={erase} fill={THEME.bg} />
            {erase > 0 && erase < 250 && <line x1="10" y1={25 + erase} x2="240" y2={25 + erase} stroke={THEME.alert} strokeWidth="10" />}
        </svg>
    );
};

const PowerPyramidSVG: React.FC = () => {
    return (
        <svg width="250" height="250" viewBox="0 0 250 250">
            <polygon points="125,30 20,220 230,220" fill="none" stroke={THEME.primary} strokeWidth="8" />
            <polygon points="125,30 95,80 155,80" fill={THEME.alert} />
            <line x1="65" y1="140" x2="185" y2="140" stroke={THEME.secondary} strokeWidth="6" />
            <text x="125" y="190" fill={THEME.secondary} fontFamily="Space Grotesk" fontSize="24" textAnchor="middle" fontWeight="bold">7.8 BILLION</text>
        </svg>
    );
};

const FractureSVG: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const branchOut = Math.max(0, interpolate(frame - delay, [0, 30], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }));

    return (
        <svg width="300" height="250" viewBox="0 0 300 250">
            <line x1="0" y1="125" x2="100" y2="125" stroke={THEME.text} strokeWidth="8" />
            <circle cx="100" cy="125" r="10" fill={THEME.alert} />
            <line x1="100" y1="125" x2={100 + branchOut * 100} y2={125 - branchOut * 80} stroke={THEME.primary} strokeWidth="4" />
            <line x1="100" y1="125" x2={100 + branchOut * 120} y2={125 - branchOut * 30} stroke={THEME.secondary} strokeWidth="4" />
            <line x1="100" y1="125" x2={100 + branchOut * 140} y2={125 + branchOut * 10} stroke={THEME.primary} strokeWidth="4" />
            <line x1="100" y1="125" x2={100 + branchOut * 110} y2={125 + branchOut * 60} stroke={THEME.secondary} strokeWidth="4" />
            <line x1="100" y1="125" x2={100 + branchOut * 90} y2={125 + branchOut * 100} stroke={THEME.primary} strokeWidth="4" />
        </svg>
    );
};

const NeuralAiSVG: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
    const frame = useCurrentFrame();
    const progress = Math.max(0, frame - delay);
    const wave = interpolate(Math.sin(progress / 5), [-1, 1], [0.5, 1.5]);
    return (
        <svg width="250" height="250" viewBox="0 0 250 250">
            <rect x="50" y="50" width="150" height="150" rx="20" fill={THEME.bgAlt} stroke={THEME.primary} strokeWidth="10" />
            <circle cx="125" cy="125" r="30" fill={THEME.alert} style={{ transform: `scale(${wave})`, transformOrigin: '125px 125px' }} />
            <path d="M 20 125 A 100 100 0 0 1 230 125" fill="none" stroke={THEME.secondary} strokeWidth="6" strokeDasharray="15 15" style={{ transform: `rotate(${progress}deg)`, transformOrigin: '125px 125px' }} />
        </svg>
    );
};

const CyberCallout: React.FC<{ delay?: number, text: string, type?: 'primary' | 'alert' | 'white' }> = ({ delay = 0, text, type = 'primary' }) => {
    let bg = THEME.bgAlt;
    let color = THEME.primary;
    let borderC = THEME.primary;
    if (type === 'alert') { bg = THEME.alert; color = THEME.bg; borderC = THEME.alert; }
    if (type === 'white') { bg = THEME.text; color = THEME.bg; borderC = THEME.text; }

    return (
        <Pop delay={delay}>
            <div style={{
                background: bg,
                color: color,
                padding: '15px 30px', /* Reduced padding */
                borderRadius: 8,
                fontFamily: 'Space Grotesk',
                fontWeight: 900,
                fontSize: 32, /* Reduced from 40 */
                borderLeft: `8px solid ${borderC}`,
                boxShadow: `0 10px 30px rgba(0,0,0,0.8), 0 0 20px ${borderC}33`,
                whiteSpace: 'nowrap',
                display: 'inline-block'
            }}>
                {text.toUpperCase()}
            </div>
        </Pop>
    );
};

export const UniversalLanguage: React.FC = () => {
    const frame = useCurrentFrame();
    const bg = interpolateColors(
        Math.sin(frame / 90),
        [-1, 1],
        [THEME.bg, THEME.bgAlt]
    );

    return (
        <AbsoluteFill style={{ backgroundColor: bg, overflow: 'hidden' }}>
            <FontStyles />
            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.15} loop />

            {/* CUT 1: Intro (0-360) 12s */}
            <Sequence durationInFrames={360}>
                <Audio src={staticFile("language/01_intro.mp3")} />
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
                        <Pop delay={0}><h1 style={{ fontFamily: 'Space Grotesk', fontSize: 90, color: THEME.text, margin: 0, textAlign: 'center' }}>WHAT IF WE ALL</h1></Pop>
                        <Pop delay={60} scaleBase={1.2}><h1 style={{ fontFamily: 'Space Grotesk', fontSize: 100, color: THEME.primary, margin: 0, textAlign: 'center' }}>SPOKE EXACTLY ONE LANGUAGE?</h1></Pop>
                        <Pop delay={160}><GlobeNetworkSVG /></Pop>
                        <CyberCallout delay={220} text="NO TRANSLATION" type="white" />
                        <CyberCallout delay={280} text="INSTANT SYNC" type="alert" />
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* CUT 2: Economy (360-750) 13s */}
            <Sequence from={360} durationInFrames={390}>
                <Audio src={staticFile("language/02_trade.mp3")} />
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
                        <Pop delay={0}><h2 style={{ fontFamily: 'Space Grotesk', fontSize: 90, color: THEME.text, margin: 0, textAlign: 'center' }}>ECONOMIC HYPER-DRIVE</h2></Pop>
                        <Pop delay={80}><CyberChartSVG delay={80} /></Pop>
                        <CyberCallout delay={180} text="NO TOWER OF BABEL PENALTY" type="white" />
                        <CyberCallout delay={270} text="+40% EXPORT TRADE" type="primary" />
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* CUT 3: Safety (750-1170) 14s */}
            <Sequence from={750} durationInFrames={420}>
                <Audio src={staticFile("language/03_safety.mp3")} />
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
                        <Pop delay={0}><h1 style={{ fontFamily: 'Space Grotesk', fontSize: 120, color: THEME.alert, margin: 0, textAlign: 'center' }}>FATAL ERRORS VANISH.</h1></Pop>
                        <Pop delay={100}><AirplaneSVG /></Pop>
                        <CyberCallout delay={200} text="NO TRANSLATION CRASHES" type="primary" />
                        <CyberCallout delay={300} text="GLOBAL MEDICAL ACCURACY" type="white" />
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* CUT 4: Science (1170-1590) 14s */}
            <Sequence from={1170} durationInFrames={420}>
                <Audio src={staticFile("language/04_science.mp3")} />
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
                        <Pop delay={0}><h2 style={{ fontFamily: 'Space Grotesk', fontSize: 90, color: THEME.text, margin: 0, textAlign: 'center' }}>ZERO-DELAY SCIENCE</h2></Pop>
                        <Pop delay={80}><MoleculeSVG /></Pop>
                        <CyberCallout delay={180} text="MANDARIN TO GERMAN" type="secondary" />
                        <CyberCallout delay={280} text="INSTANT HUMAN COLLABORATION" type="primary" />
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* CUT 5: Cost hook (1590-1860) 9s */}
            <Sequence from={1590} durationInFrames={270}>
                <Audio src={staticFile("language/05_cost.mp3")} />
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                        <Pop delay={0}><h1 style={{ fontFamily: 'Space Grotesk', fontSize: 100, color: THEME.text, margin: 0, textAlign: 'center' }}>THE DEVASTATING</h1></Pop>
                        <Pop delay={90} scaleBase={1.2}><h1 style={{ fontFamily: 'Space Grotesk', fontSize: 120, color: THEME.alert, margin: 0, textAlign: 'center' }}>HIDDEN COST.</h1></Pop>
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* CUT 6: Brain Diversity (1860-2310) 15s */}
            <Sequence from={1860} durationInFrames={450}>
                <Audio src={staticFile("language/06_brain.mp3")} />
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
                        <Pop delay={0}><SplitBrainSVG /></Pop>
                        <CyberCallout delay={100} text="DIFFERENT NEURAL WIRING" type="primary" />
                        <CyberCallout delay={200} text="RUSSIAN BLUE = FASTER SIGHT" type="white" />
                        <CyberCallout delay={300} text="ABORIGINAL = SPATIAL MASTERY" type="secondary" />
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* CUT 7: Extinction (2310-2790) 16s */}
            <Sequence from={2310} durationInFrames={480}>
                <Audio src={staticFile("language/07_extinction.mp3")} />
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
                        <Pop delay={0} scaleBase={1.1}><h1 style={{ fontFamily: 'Space Grotesk', fontSize: 100, color: THEME.alert, margin: 0, textAlign: 'center' }}>DELETING 7,000 WORLDS</h1></Pop>
                        <Pop delay={120}><DeleteMatrixSVG delay={120} /></Pop>
                        <CyberCallout delay={240} text="ORAL HISTORIES LOST" type="alert" />
                        <CyberCallout delay={360} text="UNIQUE PHILOSOPHIES ERASED" type="white" />
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* CUT 8: Power (2790-3150) 12s */}
            <Sequence from={2790} durationInFrames={360}>
                <Audio src={staticFile("language/08_power.mp3")} />
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
                        <Pop delay={0}><h2 style={{ fontFamily: 'Space Grotesk', fontSize: 90, color: THEME.text, margin: 0, textAlign: 'center' }}>THE NEW RULING CLASS</h2></Pop>
                        <Pop delay={100}><PowerPyramidSVG /></Pop>
                        <CyberCallout delay={200} text="1% NATIVE SPEAKERS" type="primary" />
                        <CyberCallout delay={280} text="BILLIONS IN THE UNDERCLASS" type="alert" />
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* CUT 9: Fracture (3150-3660) 17s */}
            <Sequence from={3150} durationInFrames={510}>
                <Audio src={staticFile("language/09_fracture.mp3")} />
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
                        <Pop delay={0}><h1 style={{ fontFamily: 'Space Grotesk', fontSize: 120, color: THEME.text, margin: 0, textAlign: 'center' }}>LANGUAGE IS A VIRUS.</h1></Pop>
                        <Pop delay={100}><FractureSVG delay={100} /></Pop>
                        <CyberCallout delay={220} text="INTERNET SLANG MUTATIONS" type="primary" />
                        <CyberCallout delay={350} text="100 NEW DIALECTS IN A CENTURY" type="alert" />
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* CUT 10: Future (3660-3990) 11s */}
            <Sequence from={3660} durationInFrames={330}>
                <Audio src={staticFile("language/10_future.mp3")} />
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
                        <Pop delay={0}><h2 style={{ fontFamily: 'Space Grotesk', fontSize: 90, color: THEME.text, margin: 0, textAlign: 'center' }}>THE TRUE 2030 REALITY</h2></Pop>
                        <Pop delay={100}><NeuralAiSVG delay={100} /></Pop>
                        <CyberCallout delay={200} text="REAL-TIME NEURAL TRANSLATION" type="white" />
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* CUT 11: Outro (3990-4350) 12s */}
            <Sequence from={3990} durationInFrames={360}>
                <Audio src={staticFile("language/11_outro.mp3")} />
                <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: THEME.primary }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
                        <Pop delay={0} scaleBase={1.1}><h1 style={{ fontFamily: 'Space Grotesk', fontSize: 110, color: THEME.bg, margin: 0, textAlign: 'center' }}>SPEAK EVERY LANGUAGE</h1></Pop>
                        <Pop delay={120}>
                            <div style={{ padding: '25px 60px', background: THEME.bg, color: THEME.text, borderRadius: 10, fontSize: 80, fontFamily: 'Space Grotesk', fontWeight: 900, borderLeft: `10px solid ${THEME.alert}`, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                                SUBSCRIBE
                            </div>
                        </Pop>
                    </div>
                </AbsoluteFill>
            </Sequence>
        </AbsoluteFill>
    );
};
