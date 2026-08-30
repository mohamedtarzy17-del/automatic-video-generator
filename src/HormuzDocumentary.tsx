import React from 'react';
import {
    AbsoluteFill,
    Sequence,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
    Audio,
    staticFile,
    Video,
} from 'remotion';
import { FONT_STACK, FONT_IMPORT, StickFigure } from './components/PremiumKit';

// --- CONFIG ---
const PACING = 30; // 1.0s visual heartbeat for ultra-aggressive high retention
const TOTAL_FRAMES = 9000; // Exactly 5 minutes (30 fps * 300s)

const HORMUZ_THEME = {
    bg: '#040206',
    gold: '#FBBF24',
    red: '#EF4444',
    cyan: '#06B6D4',
    green: '#10B981',
    white: '#FFFFFF',
    glassBg: 'rgba(15, 10, 25, 0.75)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
};

const CHAPTERS = [
    { id: 'ch1', start: 0, end: 1500, title: "THE CHOKE POINT" },
    { id: 'ch2', start: 1500, end: 3000, title: "THE BLACK GOLD FLOW" },
    { id: 'ch3', start: 3000, end: 4500, title: "THE IRANIAN SHADOW" },
    { id: 'ch4', start: 4500, end: 6000, title: "THE TANKER WARS" },
    { id: 'ch5', start: 6000, end: 7500, title: "THE $150 CRISIS" },
    { id: 'ch6', start: 7500, end: 9000, title: "THE SILENT WATCH" },
];

// --- COMPONENTS ---

const Background: React.FC<{ bgIndex: number; subIndex: number }> = ({ bgIndex, subIndex }) => {
    const frame = useCurrentFrame();
    
    // Constant slow camera drift + zoom to eliminate any staticity
    const scale = interpolate(frame % (PACING * 4), [0, PACING * 4], [1.0, 1.12], { extrapolateRight: 'clamp' });
    const brightness = interpolate(Math.sin(frame / 25), [-1, 1], [0.16, 0.26]);
    
    const videoSrc = staticFile(`hormuz_bg_${bgIndex}.mp4`);
    
    // Custom color grades for each chapter
    const grades = [
        'linear-gradient(135deg, rgba(15,20,50,0.85) 0%, rgba(4,2,6,0.95) 100%)', // Ch 1: Navy/Obsidian
        'linear-gradient(135deg, rgba(80,45,10,0.85) 0%, rgba(4,2,6,0.95) 100%)',  // Ch 2: Warm Gold/Obsidian
        'linear-gradient(135deg, rgba(70,10,15,0.85) 0%, rgba(4,2,6,0.95) 100%)',  // Ch 3: Blood Red/Obsidian
        'linear-gradient(135deg, rgba(50,20,70,0.85) 0%, rgba(4,2,6,0.95) 100%)',  // Ch 4: Violet/Obsidian
        'linear-gradient(135deg, rgba(10,50,30,0.85) 0%, rgba(4,2,6,0.95) 100%)',  // Ch 5: Deep Green/Obsidian
        'linear-gradient(135deg, rgba(15,50,55,0.85) 0%, rgba(4,2,6,0.95) 100%)',  // Ch 6: Cyan/Obsidian
    ];
    
    return (
        <AbsoluteFill style={{ backgroundColor: '#000', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', transform: `scale(${scale}) translate3d(0, 0, 0)`, willChange: 'transform' }}>
                <Video 
                    src={videoSrc}
                    muted
                    loop
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: `brightness(${brightness}) contrast(1.4) saturate(0.2)`,
                    }}
                />
            </div>
            {/* Ambient vignette and blending grade overlay */}
            <AbsoluteFill style={{
                background: grades[(bgIndex - 1) % grades.length],
                mixBlendMode: 'multiply'
            }} />
            <AbsoluteFill style={{
                background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.95) 90%)'
            }} />
        </AbsoluteFill>
    );
};

const KineticHeading: React.FC<{ text: string; color?: string }> = ({ text, color = HORMUZ_THEME.white }) => {
    const frame = useCurrentFrame();
    const anim = spring({ frame: frame % PACING, fps: 30, config: { damping: 14, stiffness: 90 } });
    const y = Math.round(interpolate(anim, [0, 1], [60, 0]));
    const blur = interpolate(anim, [0, 1], [12, 0]);
    const scale = interpolate(anim, [0, 1], [1.08, 1.0]);

    return (
        <div style={{
            fontFamily: FONT_STACK.display,
            fontSize: 130,
            color,
            textTransform: 'uppercase',
            textAlign: 'center',
            transform: `translateY(${y}px) scale(${scale})`,
            opacity: anim,
            letterSpacing: 16,
            fontWeight: 900,
            filter: `blur(${blur}px)`,
            width: '100%',
            textShadow: '0 10px 40px rgba(0,0,0,0.9)',
        }}>
            {text}
        </div>
    );
};

const DataModule: React.FC<{ label: string; value: string; sub?: string; color: string }> = ({ label, value, sub, color }) => {
    const frame = useCurrentFrame();
    const a = spring({ frame: frame % PACING, fps: 30, config: { damping: 13, stiffness: 100 } });
    const scale = interpolate(a, [0, 1], [0.92, 1.0]);
    
    return (
        <div style={{
            background: HORMUZ_THEME.glassBg,
            border: `2px solid ${color}4d`,
            borderRadius: 28,
            padding: '50px 70px',
            width: 900,
            transform: `scale(${scale}) translate3d(0, 0, 0)`,
            opacity: a,
            boxShadow: `0 30px 80px rgba(0,0,0,0.85), inset 0 0 30px ${color}0d`,
            backdropFilter: 'blur(16px)',
            textAlign: 'center',
            willChange: 'transform'
        }}>
            <div style={{ 
                color: 'rgba(255,255,255,0.4)', 
                fontSize: 22, 
                fontFamily: FONT_STACK.mono, 
                textTransform: 'uppercase', 
                letterSpacing: 6, 
                marginBottom: 16 
            }}>{label}</div>
            <div style={{ 
                color, 
                fontSize: 85, 
                fontFamily: FONT_STACK.impact, 
                fontWeight: 900, 
                lineHeight: 1.0, 
                letterSpacing: 2,
                textTransform: 'uppercase'
            }}>{value}</div>
            {sub && <div style={{ 
                color: 'white', 
                opacity: 0.65, 
                fontSize: 24, 
                marginTop: 24, 
                fontFamily: FONT_STACK.body, 
                paddingTop: 16, 
                borderTop: '1px solid rgba(255,255,255,0.1)' 
            }}>{sub}</div>}
        </div>
    );
};

const HighEndGraph: React.FC<{ points: { x: number; y: number }[]; color: string; title: string; maxVal: string }> = ({ points, color, title, maxVal }) => {
    const frame = useCurrentFrame();
    const progress = interpolate(frame % (PACING * 2), [0, 45], [0, 1], { extrapolateRight: 'clamp' });
    
    const W = 1100, H = 400;
    const maxX = Math.max(...points.map(p => p.x));
    const maxY = Math.max(...points.map(p => p.y));
    const scaled = points.map(p => ({ x: (p.x / maxX) * W, y: H - (p.y / maxY) * H }));
    
    const path = scaled.map((p, i) => `${i === 0 ? 'M' : 'L'} ${Math.round(p.x)} ${Math.round(p.y)}`).join(' ');

    return (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ color: HORMUZ_THEME.white, fontFamily: FONT_STACK.display, fontSize: 52, marginBottom: 30, letterSpacing: 8 }}>{title}</div>
            <div style={{ position: 'relative', width: W, height: H, background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 20 }}>
                <svg width={W} height={H} style={{ overflow: 'visible' }}>
                    {/* Grid lines */}
                    <line x1="0" y1={H/2} x2={W} y2={H/2} stroke="rgba(255,255,255,0.08)" strokeDasharray="5 5" />
                    <line x1={W/2} y1="0" x2={W/2} y2={H} stroke="rgba(255,255,255,0.08)" strokeDasharray="5 5" />
                    
                    {/* Main graph path */}
                    <path d={path} fill="none" stroke={color} strokeWidth="10" strokeDasharray="4000" strokeDashoffset={4000 * (1 - progress)} strokeLinecap="round" />
                    <path d={`${path} L ${W} ${H} L 0 ${H} Z`} fill={`${color}1a`} opacity={progress} />
                    
                    {/* Pulsing endpoint */}
                    {progress > 0.95 && (
                        <circle cx={scaled[scaled.length-1].x} cy={scaled[scaled.length-1].y} r="10" fill={color} style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
                    )}
                </svg>
                {/* Labels */}
                <div style={{ position: 'absolute', top: 10, left: 20, color, fontFamily: FONT_STACK.mono, fontSize: 18 }}>MAX: {maxVal}</div>
                <div style={{ position: 'absolute', bottom: 10, right: 20, color: 'rgba(255,255,255,0.4)', fontFamily: FONT_STACK.mono, fontSize: 18 }}>TIMELINE: 2026</div>
            </div>
        </div>
    );
};

const TerminalStress: React.FC<{ lines: string[]; statusText: string; statusColor: string }> = ({ lines, statusText, statusColor }) => {
    const frame = useCurrentFrame();
    return (
        <div style={{ 
            width: 1050, 
            background: '#040207', 
            border: `1.5px solid ${statusColor}`, 
            borderRadius: 24, 
            padding: 45, 
            fontFamily: FONT_STACK.mono, 
            fontSize: 22, 
            boxShadow: `0 0 100px ${statusColor}1f`,
            backdropFilter: 'blur(12px)'
        }}>
            <div style={{ color: statusColor, marginBottom: 25, fontWeight: 900, letterSpacing: 4, display: 'flex', alignItems: 'center', gap: 15 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: statusColor, animation: 'pulse 1s infinite' }} />
                [ {statusText} ]
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {lines.map((ln, i) => {
                    const a = interpolate(frame % (PACING * 2), [i * 5, i * 5 + 3], [0, 1], { extrapolateRight: 'clamp' });
                    return (
                        <div key={i} style={{ 
                            opacity: a, 
                            color: ln.includes('ALERT') || ln.includes('DANGER') || ln.includes('WARNING') ? HORMUZ_THEME.red : '#A855F7',
                            letterSpacing: 1
                        }}>
                            {`> ${ln}`}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- HIGH-END SVG STRAIT OF HORMUZ VECTOR MAP ---
const StraitMap: React.FC = () => {
    const frame = useCurrentFrame();
    
    // Tanker positioning variables
    const progressIn = (frame % 150) / 150;
    const progressOut = ((frame + 75) % 150) / 150;

    // Coastline shapes (highly stylized tactical map)
    const iranCoast = "M 50 120 Q 250 170 380 90 T 600 70 T 800 130 T 1100 110";
    const omanCoast = "M 420 540 Q 480 340 500 240 Q 520 340 560 540 Z"; // Musandam Peninsula
    const uaeCoast = "M 50 540 Q 250 520 420 540";
    
    // Shipping lanes
    const laneInbound = "M 200 340 Q 460 210 750 310";
    const laneOutbound = "M 200 380 Q 460 250 750 350";

    // Animated tanker coordinates on inbound lane
    const txIn = interpolate(progressIn, [0, 1], [200, 750]);
    const tyIn = interpolate(progressIn, [0, 1], [340, 310]) - (Math.sin(progressIn * Math.PI) * 40); // Curved offset

    // Animated tanker coordinates on outbound lane
    const txOut = interpolate(progressOut, [0, 1], [750, 200]);
    const tyOut = interpolate(progressOut, [0, 1], [350, 380]) - (Math.sin(progressOut * Math.PI) * 40);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ color: HORMUZ_THEME.white, fontFamily: FONT_STACK.display, fontSize: 50, marginBottom: 20, letterSpacing: 8 }}>TACTICAL RECONNAISSANCE MAP</div>
            <div style={{ 
                position: 'relative', 
                width: 1100, 
                height: 520, 
                background: '#040207', 
                border: '2px solid rgba(168, 85, 247, 0.2)', 
                borderRadius: 28,
                overflow: 'hidden',
                boxShadow: '0 40px 100px rgba(0,0,0,0.85)'
            }}>
                {/* Radar Grid Overlay */}
                <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <rect width="40" height="40" fill="none" />
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Main Vector Map Elements */}
                <svg width="1100" height="520" viewBox="0 0 1100 520" style={{ position: 'relative', zIndex: 5 }}>
                    {/* Land mass shaded polygons */}
                    {/* Iran (North) */}
                    <path d={`${iranCoast} L 1100 0 L 0 0 Z`} fill="rgba(168, 85, 247, 0.05)" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="3" />
                    {/* Oman / Musandam (South) */}
                    <path d={`${omanCoast} L 1100 520 L 0 520 Z`} fill="rgba(6, 182, 212, 0.04)" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="3" />
                    
                    {/* Dashed grid lines on boundaries */}
                    <path d={uaeCoast} stroke="rgba(6, 182, 212, 0.2)" strokeWidth="2" strokeDasharray="5 5" />

                    {/* Shipping Lanes (Red dashed paths representing Strait Lanes) */}
                    <path d={laneInbound} fill="none" stroke={HORMUZ_THEME.red} strokeWidth="3" strokeDasharray="12 8" opacity="0.6" />
                    <path d={laneOutbound} fill="none" stroke={HORMUZ_THEME.red} strokeWidth="3" strokeDasharray="12 8" opacity="0.6" />

                    {/* Shipping Lanes buffer zone border */}
                    <path d="M 200 360 Q 460 230 750 330" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

                    {/* Animated Tanker 1 (Inbound) */}
                    <circle cx={txIn} cy={tyIn} r="9" fill={HORMUZ_THEME.gold} style={{ filter: `drop-shadow(0 0 6px ${HORMUZ_THEME.gold})` }} />
                    <circle cx={txIn} cy={tyIn} r="18" fill="none" stroke={HORMUZ_THEME.gold} strokeWidth="1" opacity={interpolate(frame % 20, [0, 20], [1, 0])} />

                    {/* Animated Tanker 2 (Outbound) */}
                    <circle cx={txOut} cy={tyOut} r="9" fill={HORMUZ_THEME.cyan} style={{ filter: `drop-shadow(0 0 6px ${HORMUZ_THEME.cyan})` }} />
                    <circle cx={txOut} cy={tyOut} r="18" fill="none" stroke={HORMUZ_THEME.cyan} strokeWidth="1" opacity={interpolate((frame + 10) % 20, [0, 20], [1, 0])} />

                    {/* Text Annotations */}
                    {/* Iran Land Label */}
                    <text x="550" y="50" fill="rgba(168, 85, 247, 0.8)" fontFamily={FONT_STACK.mono} fontSize="22" fontWeight="bold" letterSpacing="4">IRAN (ISLAMIC REPUBLIC)</text>
                    {/* Oman Peninsula Label */}
                    <text x="490" y="470" fill="rgba(6, 182, 212, 0.8)" fontFamily={FONT_STACK.mono} fontSize="20" fontWeight="bold" textAnchor="middle" letterSpacing="3">OMAN</text>
                    {/* UAE Coast Label */}
                    <text x="180" y="490" fill="rgba(255,255,255,0.3)" fontFamily={FONT_STACK.mono} fontSize="18" letterSpacing="3">UNITED ARAB EMIRATES</text>
                    
                    {/* Persian Gulf Label */}
                    <text x="120" y="240" fill="rgba(255,255,255,0.2)" fontFamily={FONT_STACK.display} fontSize="34" letterSpacing="6">PERSIAN GULF</text>
                    {/* Gulf of Oman Label */}
                    <text x="880" y="400" fill="rgba(255,255,255,0.2)" fontFamily={FONT_STACK.display} fontSize="34" letterSpacing="6">GULF OF OMAN</text>

                    {/* 2-mile width measurement arrow */}
                    <line x1="475" y1="200" x2="495" y2="245" stroke={HORMUZ_THEME.red} strokeWidth="2" />
                    <circle cx="475" cy="200" r="3" fill={HORMUZ_THEME.red} />
                    <circle cx="495" cy="245" r="3" fill={HORMUZ_THEME.red} />
                    <text x="400" y="230" fill={HORMUZ_THEME.red} fontFamily={FONT_STACK.mono} fontSize="14" fontWeight="bold" letterSpacing="1">WIDTH: 2 MILES</text>

                    {/* Danger zone pulsing ring */}
                    <circle cx="485" cy="222" r="35" fill="none" stroke={`${HORMUZ_THEME.red}80`} strokeWidth="1.5" strokeDasharray="4 4" />
                </svg>

                {/* Radar sweeping scanline overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: 3,
                    backgroundColor: 'rgba(168, 85, 247, 0.4)',
                    boxShadow: '0 0 15px rgba(168, 85, 247, 0.8)',
                    left: `${interpolate(frame % 200, [0, 200], [0, 1100])}px`,
                    zIndex: 10
                }} />
            </div>
        </div>
    );
};

// --- MAIN ENGINE ---

export const HormuzDocumentary: React.FC = () => {
    const frame = useCurrentFrame();

    return (
        <AbsoluteFill style={{ backgroundColor: HORMUZ_THEME.bg, overflow: 'hidden' }}>
            <style>{FONT_IMPORT}</style>
            
            {/* Ambient background soundtrack bed */}
            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.04} loop />

            {/* Render 6 distinct sequences for the 6 documentary chapters */}
            {CHAPTERS.map((ch, i) => {
                const bgIndex = i + 1;
                return (
                    <Sequence key={ch.id} from={ch.start} durationInFrames={ch.end - ch.start}>
                        {/* Cloned Voiceover for the Chapter */}
                        <Audio src={staticFile(`hormuz_vo_${bgIndex}.mp3`)} />
                        
                        {/* Looping video B-Roll layer */}
                        {(() => {
                            const cFrame = frame - ch.start;
                            const subIndex = Math.floor(cFrame / PACING);
                            return <Background bgIndex={bgIndex} subIndex={subIndex} />;
                        })()}

                        {/* Visual graphic modules positioned overlay */}
                        <AbsoluteFill style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px 80px' }}>
                            {(() => {
                                const cFrame = frame - ch.start;
                                const sIdx = Math.floor(cFrame / PACING);
                                const tIdx = sIdx % 15; // Swaps graphics every 1s (30 frames) for aggressive retention pacing

                                switch (ch.id) {
                                    // CHAPTER 1: THE CHOKE POINT
                                    case 'ch1':
                                        if (tIdx === 1) return <DataModule label="STRATEGIC CHOKE POINT" value="STRAIT OF HORMUZ" color={HORMUZ_THEME.gold} sub="THE WORLD'S MOST SENSITIVE ENERGY PINCH POINT" />;
                                        if (tIdx === 2) return <DataModule label="CHANNEL WIDTH" value="2 MILES WIDE" color={HORMUZ_THEME.red} sub="AT THE SHARPEST CORNER OF THE SHIPPING LANE" />;
                                        if (tIdx === 3) return <StraitMap />;
                                        if (tIdx === 4) return <TerminalStress statusText="GEOPOLITICAL SATELLITE FEED" statusColor={HORMUZ_THEME.gold} lines={["SCANNING COORDINATES...", "> REGION: GULF OF OMAN", "> TARGET: 21-MILE PINCH POINT", "> STATUS: INTENSE PATROLS"]} />;
                                        if (tIdx === 5) return <DataModule label="DAILY OIL VOLUME" value="21M BARRELS" color={HORMUZ_THEME.cyan} sub="FLOWING CONSTANTLY THROUGH THE GATES" />;
                                        if (tIdx === 6) return <KineticHeading text="GEOPOLITICAL FUSE" color={HORMUZ_THEME.red} />;
                                        if (tIdx === 7) return <StraitMap />;
                                        if (tIdx === 8) return <DataModule label="GLOBAL SHARE" value="20-30% OF WORLD OIL" color={HORMUZ_THEME.gold} sub="REPRESENTS THE BULK OF SEA-BORNE PETROLEUM" />;
                                        if (tIdx === 9) return <TerminalStress statusText="TACTICAL TELEMETRY GRID" statusColor={HORMUZ_THEME.red} lines={["MONITORING CHOKE POINT...", "> SHIPPING LANE STATUS: ACTIVE", "> ALERT LEVEL: AMBER", "> PATROL CONCURRENCY: 100%"]} />;
                                        if (tIdx === 10) return <KineticHeading text="THE GATEWAY" />;
                                        if (tIdx === 11) return <StraitMap />;
                                        return <KineticHeading text={ch.title} color={HORMUZ_THEME.gold} />;

                                    // CHAPTER 2: THE BLACK GOLD FLOW
                                    case 'ch2':
                                        if (tIdx === 1) return <DataModule label="DAILY EXPORTS" value="20,500,000 BBL" color={HORMUZ_THEME.gold} sub="MORE THAN THE TOTAL DAILY CONSUMPTION OF THE U.S." />;
                                        if (tIdx === 2) return <DataModule label="SUPERTANKER CAPACITY" value="2,000,000 BARRELS" color={HORMUZ_THEME.white} sub="EACH VLCC SHIP HOLDS A MASSIVE GEOPOLITICAL FORTUNE" />;
                                        if (tIdx === 3) return <HighEndGraph title="GLOBAL SEA-BORNE OIL TRANSIT" color={HORMUZ_THEME.gold} points={[{ x: 0, y: 12 }, { x: 10, y: 15 }, { x: 20, y: 17 }, { x: 30, y: 19 }, { x: 40, y: 20.5 }]} maxVal="20.5M BBL/D" />;
                                        if (tIdx === 4) return <DataModule label="PRIMARY DESTINATION" value="EASTERN ASIA" color={HORMUZ_THEME.cyan} sub="80% OF ALL FLOWS HEADING TO CHINA, INDIA & JAPAN" />;
                                        if (tIdx === 5) return <KineticHeading text="BLACK GOLD" color={HORMUZ_THEME.gold} />;
                                        if (tIdx === 6) return <DataModule label="PIPELINE BYPASS CAPACITY" value="ONLY 15% OF FLOW" color={HORMUZ_THEME.red} sub="BYPASS ROUTE PIPELINES CANNOT COPING WITH CHOKE" />;
                                        if (tIdx === 7) return <HighEndGraph title="BYPASS PIPELINE DEFICIT" color={HORMUZ_THEME.red} points={[{ x: 0, y: 20 }, { x: 10, y: 15 }, { x: 20, y: 10 }, { x: 30, y: 5 }, { x: 40, y: 3.5 }]} maxVal="20.5M FLOWS vs 3.5M CAP" />;
                                        return <KineticHeading text={ch.title} color={HORMUZ_THEME.cyan} />;

                                    // CHAPTER 3: THE IRANIAN SHADOW
                                    case 'ch3':
                                        if (tIdx === 1) return <DataModule label="ASYMMETRIC FORCE" value="IRGC NAVY SWARM" color={HORMUZ_THEME.red} sub="Iranian fast-attack speedboats patrolling channels" />;
                                        if (tIdx === 2) return <TerminalStress statusText="MILITARY INTELLIGENCE REPORT" statusColor={HORMUZ_THEME.red} lines={["SWARM SENSORS ONLINE...", "> DETECTING ASYMMETRIC SPEEDBOATS", "> SUB-SURFACE MINES ARMED", "> ANTI-SHIP BATTERIES active"]} />;
                                        if (tIdx === 3) return <DataModule label="MISSILE RANGE" value="300 KILOMETERS" color={HORMUZ_THEME.gold} sub="CAPABLE OF TARGETING ANY VESSEL WITHIN SECONDS" />;
                                        if (tIdx === 4) return <KineticHeading text="ASYMMETRIC GAUNTLET" color={HORMUZ_THEME.red} />;
                                        if (tIdx === 5) return <TerminalStress statusText="COASTAL MISSILE TELEMETRY" statusColor={HORMUZ_THEME.red} lines={["TARGETING RADAR ACTIVE...", "> GADIR CRUISE BATTERIES ALIGNED", "> ACQUISITION CONCURRENCY: ACTIVE", "> RESPONSE WINDOW: SECONDS"]} />;
                                        if (tIdx === 6) return <StickFigure emotion="confused" label="COMMERCIAL CAPTAIN" color={HORMUZ_THEME.white} />;
                                        return <KineticHeading text={ch.title} color={HORMUZ_THEME.red} />;

                                    // CHAPTER 4: THE TANKER WARS
                                    case 'ch4':
                                        if (tIdx === 1) return <DataModule label="HISTORIC TANKER WAR" value="543 SHIPS HIT" color={HORMUZ_THEME.red} sub="1980s CRITICAL COMBAT ZONE IN THE PERSIAN GULF" />;
                                        if (tIdx === 2) return <DataModule label="US ESCORT CONVOY" value="OP. EARNEST WILL" color={HORMUZ_THEME.cyan} sub="LARGEST NAVAL CONVOY IN THE POST-WW2 ERA" />;
                                        if (tIdx === 3) return <TerminalStress statusText="TACTICAL HISTORY RECORD" statusColor={HORMUZ_THEME.cyan} lines={["OPERATION EARNEST WILL...", "> TANKER CONVOYS PROTECTED", "> USS SAMUEL B. ROBERTS MINED", "> MASSIVE RETALIATION: OP. PRAYING MANTIS"]} />;
                                        if (tIdx === 4) return <HighEndGraph title="HISTORIC TANKER CASUALTIES" color={HORMUZ_THEME.red} points={[{ x: 1981, y: 12 }, { x: 1984, y: 71 }, { x: 1987, y: 179 }, { x: 1988, y: 210 }]} maxVal="210 SHIPS HIT / YEAR" />;
                                        if (tIdx === 5) return <KineticHeading text="WARZONE HISTORY" color={HORMUZ_THEME.red} />;
                                        if (tIdx === 6) return <DataModule label="RECENT CONFLICTS" value="LIMPET MINE ATTACKS" color={HORMUZ_THEME.gold} sub="SURFACE EXPLOSIONS ON VLCC STEEL HULLS" />;
                                        return <KineticHeading text={ch.title} color={HORMUZ_THEME.gold} />;

                                    // CHAPTER 5: THE $150 CRISIS
                                    case 'ch5':
                                        if (tIdx === 1) return <DataModule label="OIL PRICE PROJECTION" value="OVER $150 / BBL" color={HORMUZ_THEME.red} sub="IMMEDIATE CRUDE SKYROCKET IN SUPPLY CHAIN SHOCK" />;
                                        if (tIdx === 2) return <HighEndGraph title="POTENTIAL CRUDE PRICE EXPLOSION" color={HORMUZ_THEME.red} points={[{ x: 0, y: 80 }, { x: 10, y: 90 }, { x: 20, y: 110 }, { x: 30, y: 150 }, { x: 40, y: 220 }]} maxVal="$220 / BARREL" />;
                                        if (tIdx === 3) return <TerminalStress statusText="ECONOMIC SYSTEM SIMULATION" statusColor={HORMUZ_THEME.red} lines={["SHOCKWAVE DETECTED...", "> OIL PRICE: +180%", "> S&P 500: -25% SHORT TERM", "> INFLATION THRESHOLD: BREACHED"]} />;
                                        if (tIdx === 4) return <DataModule label="INSURANCE SHOCK" value="+400% PREMIUMS" color={HORMUZ_THEME.gold} sub="MARITIME HULL PROTECTION BECOMES ASTRONOMICAL" />;
                                        if (tIdx === 5) return <KineticHeading text="ECONOMIC DOOMSDAY" color={HORMUZ_THEME.red} />;
                                        if (tIdx === 6) return <StickFigure emotion="surprised" label="CENTRAL BANKER" color={HORMUZ_THEME.white} />;
                                        return <KineticHeading text={ch.title} color={HORMUZ_THEME.green} />;

                                    // CHAPTER 6: THE SILENT WATCH
                                    case 'ch6':
                                        if (tIdx === 1) return <DataModule label="COALITION FORCE" value="INTERNATIONAL WATCH" color={HORMUZ_THEME.cyan} sub="MULTINATIONAL WARSHIPS ENFORCING FREE PASSAGE" />;
                                        if (tIdx === 2) return <StraitMap />;
                                        if (tIdx === 3) return <TerminalStress statusText="SATELLITE SURVEILLANCE FEED" statusColor={HORMUZ_THEME.cyan} lines={["ORBITING POSITION ACTIVE...", "> SENSOR CONCURRENCY: 100%", "> TARGET SECURED: STRAIT ENTRANCE", "> ESCORT CONVOY SIGHTED"]} />;
                                        if (tIdx === 4) return <DataModule label="DETERRENCE RATIO" value="MUTUAL BALANCE" color={HORMUZ_THEME.gold} sub="FREE FLOW MAINTAINED BY GLOBAL FORCE PATROLS" />;
                                        if (tIdx === 5) return <KineticHeading text="THE SILENT CHECKS" color={HORMUZ_THEME.cyan} />;
                                        if (tIdx === 6) return <StraitMap />;
                                        return <KineticHeading text={ch.title} color={HORMUZ_THEME.cyan} />;

                                    default:
                                        return <KineticHeading text={ch.title} />;
                                }
                            })()}
                        </AbsoluteFill>
                    </Sequence>
                );
            })}

            {/* Aggressive stacked sound design layered on heartbeats */}
            {frame > 0 && frame % PACING === 0 && (
                <>
                    <Audio src={staticFile('sfx/whoosh.mp3')} volume={0.14} />
                    <Audio src={staticFile('sfx/rise.mp3')} volume={0.08} />
                </>
            )}

            {frame % 10 === 0 && Math.floor(frame / PACING) % 3 === 0 && (
                <Audio src={staticFile('sfx/pop.mp3')} volume={0.04} />
            )}

            {/* Cinematic Outer framing border */}
            <AbsoluteFill style={{ pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', inset: 40, border: '1.5px solid rgba(255,255,255,0.03)', borderRadius: 24 }} />
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
