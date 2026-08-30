import React from 'react';
import {
    AbsoluteFill,
    Sequence,
    Audio,
    useCurrentFrame,
    spring,
    interpolate,
    staticFile
} from 'remotion';
import { FONT_IMPORT, getFontForScene, FONT_STACK, Callout, StickFigure } from './components/PremiumKit';

// --- CONSTANTS ---
export const FPS = 30;
export const TOTAL_FRAMES = 2796; // 93.2s * 30fps

// --- VIBRANT THEMES ---
const THEMES = [
    { bg1: '#FF2A2A', bg2: '#800000', text: '#FFFFFF', UI: '#FFCC00', border: 'rgba(255,255,255,0.2)' }, // Crimson Red
    { bg1: '#002B36', bg2: '#000d1a', text: '#00E5FF', UI: '#00FF66', border: 'rgba(0,229,255,0.2)' },   // Cyber Blue
    { bg1: '#FFCC00', bg2: '#A68A00', text: '#000000', UI: '#FF2A2A', border: 'rgba(0,0,0,0.2)' },       // Warning Yellow
    { bg1: '#00FF66', bg2: '#006622', text: '#000000', UI: '#FFFFFF', border: 'rgba(0,0,0,0.2)' },       // Radar Green
    { bg1: '#8A2BE2', bg2: '#4B0082', text: '#FFFFFF', UI: '#00FF66', border: 'rgba(255,255,255,0.2)' }, // Neon Purple
    { bg1: '#FFFFFF', bg2: '#CCCCCC', text: '#FF2A2A', UI: '#000000', border: 'rgba(255,0,0,0.2)' },     // Clinical White
];

// --- SOUND TRIGGER COMPONENT ---
const SFXTriggers: React.FC<{ triggers: { frame: number, file: string, vol?: number }[] }> = ({ triggers }) => {
    return (
        <>
            {triggers.map((t, i) => (
                <Sequence key={i} from={t.frame}>
                    <Audio src={staticFile(t.file)} volume={t.vol || 0.3} />
                </Sequence>
            ))}
        </>
    );
};

// --- NEWS SCREENSHOT MOCKUP COMPONENT ---
// Perfectly mimics real news site captures as requested
const NewsScreenshot: React.FC<{
    source: 'Al Jazeera' | 'Washington Post' | 'Global News' | 'The Guardian',
    headline: string,
    author: string,
    date: string,
    theme: any
}> = ({ source, headline, author, date, theme }) => {
    const frame = useCurrentFrame();

    // Different visual styles for different sources to mimic real websites
    let sourceStyle = {};
    let logoStyle = {};
    let headlineStyle = {};

    switch (source) {
        case 'Al Jazeera':
            sourceStyle = { background: '#FFFFFF', color: '#000000', fontFamily: 'Arial, sans-serif' };
            logoStyle = { color: '#FA9014', fontWeight: 'bold', fontSize: 30 }; // Orange logo
            headlineStyle = { fontSize: 60, fontWeight: 'bold', lineHeight: 1.2, marginTop: 20 };
            break;
        case 'Washington Post':
            sourceStyle = { background: '#F8F8F8', color: '#1A1A1A', fontFamily: 'Georgia, serif' };
            logoStyle = { color: '#000000', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 'bold', fontSize: 35 };
            headlineStyle = { fontSize: 70, fontWeight: 'normal', lineHeight: 1.1, marginTop: 20, fontFamily: 'Georgia, serif' };
            break;
        case 'Global News':
            sourceStyle = { background: '#FFFFFF', color: '#333333', fontFamily: 'Helvetica, sans-serif' };
            logoStyle = { color: '#E31837', fontWeight: '900', fontSize: 35, letterSpacing: '-1px' }; // Red bold text
            headlineStyle = { fontSize: 65, fontWeight: 'bold', lineHeight: 1.1, marginTop: 20 };
            break;
        case 'The Guardian':
            sourceStyle = { background: '#052962', color: '#FFFFFF', fontFamily: 'Georgia, serif' };
            logoStyle = { color: '#FFFFFF', fontWeight: 'bold', fontSize: 30, letterSpacing: '1px' };
            headlineStyle = { fontSize: 60, fontWeight: 'bold', lineHeight: 1.1, marginTop: 20 };
            break;
    }

    const entranceScale = spring({ frame, fps: FPS, config: { damping: 12, stiffness: 100 } });
    const floatY = Math.sin(frame / 30) * 10;

    return (
        <div style={{
            transform: `scale(\${entranceScale}) translateY(\${floatY}px) rotateY(-5deg)`,
            transformStyle: 'preserve-3d',
            perspective: '1000px',
            width: 800,
            boxShadow: '0 40px 60px rgba(0,0,0,0.5)',
            borderRadius: 12,
            overflow: 'hidden',
            border: `2px solid \${theme.border}`
        }}>
            {/* The Article Content */}
            <div style={{ ...sourceStyle, padding: 50, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: source === 'The Guardian' ? '1px solid #FF7BAC' : '2px solid #EEE', paddingBottom: 20 }}>
                    <div style={logoStyle}>{source}</div>
                    <div style={{ fontSize: 16, color: source === 'The Guardian' ? '#A1C3E4' : '#888' }}>Live Updates</div>
                </div>
                
                <div style={headlineStyle}>{headline}</div>
                
                <div style={{ display: 'flex', gap: 20, marginTop: 30, fontSize: 18, color: source === 'The Guardian' ? '#FFF' : '#666', fontFamily: 'Arial' }}>
                    <strong>{author}</strong>
                    <span>|</span>
                    <span>{date}</span>
                </div>
                
                {/* Fake Image Placeholder mimicking an article photo */}
                <div style={{ width: '100%', height: 350, backgroundColor: source === 'The Guardian' ? '#001A4B' : '#DDD', marginTop: 30, borderRadius: 8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <svg width="100" height="100" viewBox="0 0 24 24" fill={source === 'The Guardian' ? '#052962' : '#AAA'}>
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                </div>
            </div>

            {/* Credit Source at Bottom (as requested) */}
            <div style={{
                backgroundColor: '#111', padding: '12px 20px', display: 'flex', justifyContent: 'flex-start',
                alignItems: 'center', borderTop: `1px solid \${theme.UI}`
            }}>
                <span style={{ color: '#888', fontSize: 14, fontFamily: 'monospace' }}>
                    CREDIT SOURCE: {source.toUpperCase()} // FAIR USE // {new Date().toLocaleDateString()}
                </span>
            </div>
        </div>
    );
};

// --- CUSTOM SVG ANIMATIONS & VISUALS ---

const MapStrikeSVG: React.FC<{ progress: number, theme: any, type: 'strike' | 'retaliation' }> = ({ progress, theme, type }) => {
    const pIsrael = { x: 250, y: 200 };
    const pUSBase1 = { x: 350, y: 350 };
    const pUSBase2 = { x: 500, y: 100 };
    const pIran = { x: 650, y: 250 };
    const pGulf = { x: 550, y: 350 };

    const arcs = type === 'strike' ? [
        { start: pIsrael, end: pIran, ctrl: { x: 450, y: 50 } },
        { start: pUSBase1, end: pIran, ctrl: { x: 500, y: 150 } }
    ] : [
        { start: pIran, end: pIsrael, ctrl: { x: 450, y: 50 } },
        { start: pIran, end: pUSBase1, ctrl: { x: 500, y: 450 } },
        { start: pIran, end: pUSBase2, ctrl: { x: 550, y: 100 } },
        { start: pIran, end: pGulf, ctrl: { x: 600, y: 300 } },
    ];

    const dashOffset = interpolate(progress, [0.1, 0.6], [800, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
    const explosionProg = progress > 0.6 ? (progress - 0.6) * 2.5 : 0;
    const explosionScale = spring({ frame: explosionProg * 30, fps: 30, config: { damping: 10 } });

    return (
        <svg width="100%" height="100%" viewBox="0 0 900 500" style={{ filter: `drop-shadow(0px 20px 30px rgba(0,0,0,0.5))` }}>
            <pattern id="gridPattern" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke={theme.border} strokeWidth="2"/>
            </pattern>
            <rect width="900" height="500" fill="url(#gridPattern)" rx="30" />
            <rect width="900" height="500" fill="transparent" stroke={theme.UI} strokeWidth="8" rx="30" />

            {/* Geography Lines */}
            <path d="M 100 300 Q 250 100 450 250 T 800 200" fill="none" stroke={theme.border} strokeWidth="3" strokeDasharray="10 10" />
            <path d="M 200 450 Q 350 200 650 400" fill="none" stroke={theme.border} strokeWidth="3" strokeDasharray="10 10" />

            {/* Target Nodes */}
            <circle cx={pIsrael.x} cy={pIsrael.y} r="18" fill={type === 'strike' ? theme.UI : theme.text} />
            <circle cx={pUSBase1.x} cy={pUSBase1.y} r="15" fill={type === 'strike' ? theme.UI : theme.text} />
            <circle cx={pUSBase2.x} cy={pUSBase2.y} r="15" fill={type === 'strike' ? theme.UI : theme.text} />
            <circle cx={pIran.x} cy={pIran.y} r="25" fill={type === 'retaliation' ? theme.UI : theme.text} />
            <circle cx={pGulf.x} cy={pGulf.y} r="15" fill={theme.text} />

            {/* Projectile Arcs */}
            {arcs.map((arc, i) => (
                <path key={`arc-\${i}`} d={`M \${arc.start.x} \${arc.start.y} Q \${arc.ctrl.x} \${arc.ctrl.y} \${arc.end.x} \${arc.end.y}`} 
                      fill="none" stroke={theme.text} strokeWidth="8" strokeDasharray="800" strokeDashoffset={dashOffset} strokeLinecap="round" />
            ))}

            {/* Impact Explosions */}
            {arcs.map((arc, i) => (
                <g key={`exp-\${i}`} transform={`translate(\${arc.end.x}, \${arc.end.y}) scale(\${explosionScale})`}>
                    <circle cx="0" cy="0" r="40" fill={theme.bg1} />
                    <circle cx="0" cy="0" r="25" fill={theme.UI} />
                    <circle cx="0" cy="0" r="10" fill="#FFF" />
                    <circle cx="0" cy="0" r={40 + (explosionScale * 20)} fill="none" stroke={theme.UI} strokeWidth="4" opacity={1 - Math.min(1, explosionScale * 0.5)} />
                </g>
            ))}
        </svg>
    )
};

const RadarHUD: React.FC<{ progress: number, theme: any }> = ({ progress, theme }) => {
    const frame = useCurrentFrame();
    const rotation = (frame * 3) % 360;
    
    return (
        <svg width="600" height="600" viewBox="0 0 400 400" style={{ filter: `drop-shadow(0 0 20px \${theme.border})` }}>
            <circle cx="200" cy="200" r="180" fill={theme.bg2} stroke={theme.UI} strokeWidth="6" />
            <circle cx="200" cy="200" r="120" fill="none" stroke={theme.UI} strokeWidth="2" strokeDasharray="10 10" />
            <circle cx="200" cy="200" r="60" fill="none" stroke={theme.UI} strokeWidth="2" strokeDasharray="10 10" />
            <line x1="20" y1="200" x2="380" y2="200" stroke={theme.UI} strokeWidth="2" opacity={0.6} />
            <line x1="200" y1="20" x2="200" y2="380" stroke={theme.UI} strokeWidth="2" opacity={0.6} />
            
            <g transform={`rotate(\${rotation}, 200, 200)`}>
                <path d="M 200 200 L 200 20 A 180 180 0 0 1 380 200 Z" fill="url(#radarSweep)" opacity={0.7}/>
            </g>

            <defs>
                <linearGradient id="radarSweep" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={theme.UI} stopOpacity="1" />
                    <stop offset="100%" stopColor={theme.UI} stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Target Blips */}
            <circle cx="280" cy="120" r="10" fill={theme.text} opacity={progress > 0.3 ? 1 : 0} />
            <circle cx="280" cy="120" r="24" fill="none" stroke={theme.text} strokeWidth={4} opacity={progress > 0.3 ? Math.max(0, 1 - (frame % 20) / 20) : 0} />
            <circle cx="100" cy="250" r="10" fill={theme.UI} opacity={progress > 0.6 ? 1 : 0} />
            <circle cx="100" cy="250" r="24" fill="none" stroke={theme.UI} strokeWidth={4} opacity={progress > 0.6 ? Math.max(0, 1 - (frame % 20) / 20) : 0} />
        </svg>
    );
};

const DroneSwarm: React.FC<{ progress: number, theme: any }> = ({ progress, theme }) => {
    return (
        <AbsoluteFill>
            {Array.from({ length: 18 }).map((_, i) => {
                const startX = -200 - (Math.random() * 400);
                const endX = 2200 + (Math.random() * 400);
                const currentX = interpolate(progress, [0, 1], [startX, endX]);
                const currentY = i * 60 + Math.sin((progress * 10) + i) * 50;
                const scale = 0.8 + Math.random() * 1.2;
                
                return (
                    <g key={i} style={{ transform: `translate(\${currentX}px, \${currentY}px) scale(\${scale})` }}>
                        <svg width="80" height="80" viewBox="-40 -40 80 80">
                            <path d="M -30 -30 L 30 30 M -30 30 L 30 -30" stroke={theme.border} strokeWidth="6" />
                            <circle cx="-30" cy="-30" r="10" fill={theme.UI} />
                            <circle cx="30" cy="30" r="10" fill={theme.UI} />
                            <circle cx="-30" cy="30" r="10" fill={theme.UI} />
                            <circle cx="30" cy="-30" r="10" fill={theme.UI} />
                            <rect x="-15" y="-15" width="30" height="30" fill={theme.text} rx="8" />
                        </svg>
                    </g>
                );
            })}
        </AbsoluteFill>
    );
};

const PlaneStatDash: React.FC<{ progress: number, theme: any }> = ({ progress, theme }) => {
    const val = interpolate(progress, [0, 0.4], [0, 800], { extrapolateRight: 'clamp' });
    const width = interpolate(val, [0, 800], [0, 100]);
    
    return (
        <div style={{ padding: 60, background: theme.bg2, borderRadius: 20, border: `4px solid \${theme.border}`, width: 800, color: theme.text }}>
            <div style={{ fontSize: 40, fontFamily: FONT_STACK.body, marginBottom: 20 }}>FLIGHTS CANCELLED</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill={theme.UI}>
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
                <div style={{ flex: 1, height: 40, background: 'rgba(0,0,0,0.3)', borderRadius: 20, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `\${width}%`, background: theme.UI }} />
                </div>
                <div style={{ fontSize: 60, fontWeight: 'bold', fontFamily: FONT_STACK.mono }}>{Math.floor(val)}+</div>
            </div>
        </div>
    );
};

// --- SCENES (Updated with Real News Screenshots & Credits) ---

const Scene1: React.FC<{ frames: number }> = ({ frames }) => {
    const frame = useCurrentFrame();
    const t = THEMES[0]; 
    
    const showScreenshot = frame > 60;
    const scale = interpolate(frame, [0, frames], [1, 1.05]);

    return (
        <AbsoluteFill style={{ background: `linear-gradient(135deg, \${t.bg1}, \${t.bg2})`, display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 100, transform: `scale(\${scale})` }}>
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 40 }}>
                 <div style={{ fontSize: 130, fontFamily: getFontForScene(0), color: t.text, lineHeight: 1 }}>
                    MARCH 2026<br/>
                    <span style={{ color: t.UI }}>GEOPOLITICAL<br/>FRACTURE</span>
                 </div>
                 <div style={{ fontSize: 40, fontFamily: FONT_STACK.body, color: t.text, background: t.bg2, padding: '20px 40px', alignSelf: 'flex-start', borderLeft: `8px solid \${t.UI}` }}>
                     Unprecedented Escalation
                 </div>
             </div>
             
             <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                 {showScreenshot && (
                     <NewsScreenshot 
                        source="Al Jazeera" 
                        headline="Middle East Tensions Escalate Following Khamenei's Death" 
                        author="By Regional Staff" 
                        date="March 2026" 
                        theme={t} 
                     />
                 )}
             </div>

             <SFXTriggers triggers={[
                 { frame: 60, file: 'sfx/whoosh.mp3', vol: 0.4 }
             ]} />
        </AbsoluteFill>
    );
};

const Scene2: React.FC<{ frames: number }> = ({ frames }) => {
    const frame = useCurrentFrame();
    const t = THEMES[1]; 
    const mapProgress = frame > 80 ? (frame - 80) / 386 : 0;
    
    const showCallout = frame > 20;
    const showMap = frame > 80;
    const showHeadline = frame > 200;

    return (
        <AbsoluteFill style={{ backgroundColor: t.bg1, padding: 80, display: 'flex', flexDirection: 'column', gap: 40 }}>
            {showCallout && (
                <div style={{ opacity: spring({ frame: frame - 20, fps: FPS }) }}>
                    <Callout type="danger" title="OPERATION EPIC FURY" body="U.S. & Israel launch comprehensive strikes against high-level Iranian targets." style={{ width: '80%', background: t.bg2 }} />
                </div>
            )}
            
            <div style={{ flex: 1, position: 'relative', marginTop: 20 }}>
                {showMap && <MapStrikeSVG progress={mapProgress * 1.5} theme={t} type="strike" />}
                
                {showHeadline && (
                    <div style={{ position: 'absolute', right: 50, top: 40, transform: `scale(\${spring({ frame: frame - 200, fps: FPS, config: { damping: 10 } })})` }}>
                        <NewsScreenshot 
                            source="Washington Post" 
                            headline="U.S. Military confirms deaths of three service members amid Iranian counterattacks" 
                            author="By Dan Lamothe" 
                            date="March 2026" 
                            theme={t} 
                        />
                    </div>
                )}
            </div>

            <SFXTriggers triggers={[
                { frame: 20, file: 'sfx/pop.mp3', vol: 0.3 },
                { frame: 200, file: 'sfx/whoosh.mp3', vol: 0.5 },
            ]} />
        </AbsoluteFill>
    );
};

const Scene3: React.FC<{ frames: number }> = ({ frames }) => {
    const frame = useCurrentFrame();
    const t = THEMES[2]; 
    const mapProgress = frame > 100 ? (frame - 100) / 366 : 0;
    const showRadar = frame > 200;

    return (
        <AbsoluteFill style={{ backgroundColor: t.bg1, padding: 80, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 80 }}>
             <div style={{ flex: 1, height: '100%', position: 'relative' }}>
                 {frame > 100 && <MapStrikeSVG progress={mapProgress * 1.5} theme={t} type="retaliation" />}
             </div>
             
             <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 60 }}>
                  <div style={{ 
                      fontSize: 100, fontFamily: getFontForScene(0), color: t.text, textShadow: `0 10px 0 \${t.UI}`, textAlign: 'center',
                      opacity: spring({ frame: frame - 20, fps: FPS })
                  }}>
                      MASSIVE<br/>RETALIATION
                  </div>
                  {showRadar && (
                      <div style={{ transform: `scale(\${spring({ frame: frame - 200, fps: FPS, config: { damping: 12 } })})` }}>
                          <RadarHUD progress={(frame - 200) / 266} theme={t} />
                      </div>
                  )}
             </div>

             <SFXTriggers triggers={[
                 { frame: 20, file: 'sfx/pop.mp3', vol: 0.3 },
                 { frame: 130, file: 'sfx/whoosh.mp3', vol: 0.4 }, 
                 { frame: 200, file: 'sfx/pop.mp3', vol: 0.3 },
             ]} />
        </AbsoluteFill>
    );
};

const Scene4: React.FC<{ frames: number }> = ({ frames }) => {
    const frame = useCurrentFrame();
    const t = THEMES[3]; 
    
    const showDash = frame > 80;
    const showNews = frame > 240;

    return (
        <AbsoluteFill style={{ background: `linear-gradient(\${t.bg1}, \${t.bg2})`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 80 }}>
            <div style={{ fontSize: 120, fontFamily: FONT_STACK.display, color: t.text, fontWeight: 'bold' }}>
                GLOBAL AVIATION <span style={{color: t.UI}}>CHAOS</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'row', gap: 60, alignItems: 'center' }}>
                {showDash && (
                    <div style={{ transform: `translateY(\${interpolate(spring({ frame: frame - 80, fps: FPS }), [0, 1], [50, 0])}px)`, opacity: spring({ frame: frame - 80, fps: FPS }) }}>
                        <PlaneStatDash progress={(frame - 80) / 386} theme={t} />
                    </div>
                )}
                
                {showNews && (
                    <NewsScreenshot 
                        source="Global News" 
                        headline="Global Flight Disruptions as Iranian Airspace Shut Down Amid Escalation" 
                        author="By Aviation Desk" 
                        date="March 2026" 
                        theme={t} 
                    />
                )}
            </div>

            <SFXTriggers triggers={[
                { frame: 80, file: 'sfx/whoosh.mp3', vol: 0.3 },
                { frame: 240, file: 'sfx/pop.mp3', vol: 0.5 },
            ]} />
        </AbsoluteFill>
    );
};

const Scene5: React.FC<{ frames: number }> = ({ frames }) => {
    const frame = useCurrentFrame();
    const t = THEMES[4]; 
    
    const showSwarms = frame > 30;
    const showStats = frame > 120;
    const showScreenshot = frame > 260;

    return (
        <AbsoluteFill style={{ backgroundColor: t.bg1, overflow: 'hidden' }}>
            {showSwarms && <DroneSwarm progress={(frame - 30) / 436} theme={t} />}
            
            <div style={{ position: 'absolute', inset: 100, pointerEvents: 'none', display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                    {showStats && (
                        <div style={{ 
                            background: t.bg2, padding: 80, borderRadius: 40, border: `8px solid \${t.UI}`, 
                            transform: `translateX(\${interpolate(spring({ frame: frame - 120, fps: FPS }), [0, 1], [200, 0])}px)`,
                            opacity: spring({ frame: frame - 120, fps: FPS }) 
                        }}>
                            <div style={{ fontSize: 70, fontFamily: FONT_STACK.body, color: t.text }}>UKRAINE-RUSSIA ATTRITION</div>
                            <div style={{ fontSize: 140, fontFamily: FONT_STACK.mono, color: t.UI, fontWeight: 'bold' }}>
                                {Math.floor(interpolate((frame - 120) / 300, [0, 0.5], [0, 1.2], { extrapolateRight: 'clamp' })).toFixed(1)}M+
                            </div>
                            <div style={{ fontSize: 50, fontFamily: FONT_STACK.body, color: t.text }}>CASUALTIES</div>
                        </div>
                    )}
                    
                    {showScreenshot && (
                        <div style={{ pointerEvents: 'auto' }}>
                            <NewsScreenshot 
                                source="The Guardian" 
                                headline="UN Security Council to hold emergency meeting over Middle East crisis" 
                                author="By World Affairs" 
                                date="March 2026" 
                                theme={t} 
                            />
                        </div>
                    )}
                </div>
            </div>

            <SFXTriggers triggers={[
                { frame: 30, file: 'sfx/whoosh.mp3', vol: 0.2 },
                { frame: 120, file: 'sfx/pop.mp3', vol: 0.4 },
                { frame: 260, file: 'sfx/typing.mp3', vol: 0.3 },
            ]} />
        </AbsoluteFill>
    );
};

const Scene6: React.FC<{ frames: number }> = ({ frames }) => {
    const frame = useCurrentFrame();
    const t = THEMES[5]; 
    const opacityFadeOut = interpolate(frame, [frames - 40, frames], [1, 0]);
    const scale = interpolate(frame, [0, frames], [1, 1.05]);

    const showShattered = frame > 80;
    const showAlliances = frame > 140;
    const showWeeks = frame > 200;

    return (
        <AbsoluteFill style={{ background: `radial-gradient(circle, \${t.bg2}, \${t.bg1})`, opacity: opacityFadeOut, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', transform: `scale(\${scale})` }}>
            <div style={{ fontSize: 150, fontFamily: FONT_STACK.impact, color: t.text, textTransform: 'uppercase', marginBottom: 80, opacity: spring({ frame, fps: FPS }) }}>
                The World on a <span style={{color: t.UI}}>Knife's Edge</span>
            </div>
            
            <div style={{ display: 'flex', gap: 150 }}>
                {showShattered && (
                    <div style={{ opacity: spring({ frame: frame - 80, fps: FPS }), transform: `translateY(\${interpolate(spring({ frame: frame - 80, fps: FPS }), [0, 1], [30, 0])}px)` }}>
                        <StickFigure emotion="sad" color={t.text} label="SHATTERED SKIES" size={250} />
                    </div>
                )}
                {showAlliances && (
                    <div style={{ opacity: spring({ frame: frame - 140, fps: FPS }), transform: `translateY(\${interpolate(spring({ frame: frame - 140, fps: FPS }), [0, 1], [30, 0])}px)` }}>
                        <StickFigure emotion="angry" color={t.UI} label="ALLIANCES SHIFT" size={250} />
                    </div>
                )}
                {showWeeks && (
                    <div style={{ opacity: spring({ frame: frame - 200, fps: FPS }), transform: `translateY(\${interpolate(spring({ frame: frame - 200, fps: FPS }), [0, 1], [30, 0])}px)` }}>
                        <StickFigure emotion="thinking" color={t.text} label="CRITICAL WEEKS" size={250} />
                    </div>
                )}
            </div>
            
            <div style={{ 
                marginTop: 100, fontSize: 60, fontFamily: FONT_STACK.mono, color: t.UI, background: t.text, padding: '20px 60px', borderRadius: 20, fontWeight: 'bold'
            }}>
                STAY AWAKE. STAY INFORMED.
            </div>
        </AbsoluteFill>
    );
};

export const WarNewsExplainer: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#000' }}>
            <style>{FONT_IMPORT}</style>
            <Audio src={staticFile('sfx/ambient.mp3')} volume={0.15} />
            <Audio src={staticFile('warupdate.wav')} volume={0.9} />

            <Sequence from={0} durationInFrames={466}><Scene1 frames={466} /></Sequence>
            <Sequence from={466} durationInFrames={466}><Scene2 frames={466} /></Sequence>
            <Sequence from={932} durationInFrames={466}><Scene3 frames={466} /></Sequence>
            <Sequence from={1398} durationInFrames={466}><Scene4 frames={466} /></Sequence>
            <Sequence from={1864} durationInFrames={466}><Scene5 frames={466} /></Sequence>
            <Sequence from={2330} durationInFrames={466}><Scene6 frames={466} /></Sequence>
        </AbsoluteFill>
    );
};
