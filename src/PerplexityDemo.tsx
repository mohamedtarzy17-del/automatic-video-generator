import React from 'react';
import {
    AbsoluteFill,
    useCurrentFrame,
    interpolate,
    spring,
    Audio,
    staticFile,
    Sequence,
    Img,
} from 'remotion';

// Perplexity brand palette
const C = {
    teal: '#20B2AA',
    darkTeal: '#1A8F89',
    navy: '#0F1729',
    navyLight: '#1A2744',
    white: '#FFFFFF',
    blue: '#2196F3',
    purple: '#7C3AED',
    pink: '#EC4899',
    yellow: '#FBBF24',
    green: '#10B981',
    orange: '#F97316',
    red: '#EF4444',
    gray: '#94A3B8',
    darkGray: '#334155',
};

const FONT = "'Inter', sans-serif";
const DISPLAY = "'Bebas Neue', cursive";

// Frame durations (30fps) — same as V1
const S1 = 379; const S2 = 424; const S3 = 514; const S4 = 431;
const S5 = 500; const S6 = 465; const S7 = 480; const S8 = 436;
const INTRO = 90;
const F1 = INTRO;
const F2 = F1 + S1;
const F3 = F2 + S2;
const F4 = F3 + S3;
const F5 = F4 + S4;
const F6 = F5 + S5;
const F7 = F6 + S6;
const F8 = F7 + S7;

// ─── UTILITY COMPONENTS ─────────────────────────

const Centered: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', ...style }}>{children}</AbsoluteFill>
);

const GradientBg: React.FC<{ from: string; to: string; children: React.ReactNode }> = ({ from, to, children }) => (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}>{children}</AbsoluteFill>
);

const GridOverlay: React.FC = () => (
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />
);

// ─── SVG COMPONENTS ─────────────────────────

const SearchIcon: React.FC<{ progress: number; color: string; size?: number }> = ({ progress, color, size = 200 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2"
            strokeDasharray={50} strokeDashoffset={50 * (1 - progress)} strokeLinecap="round" />
        <line x1="16.5" y1="16.5" x2="21" y2="21" stroke={color} strokeWidth="2"
            strokeDasharray={8} strokeDashoffset={8 * (1 - progress)} strokeLinecap="round" />
    </svg>
);

const CheckIcon: React.FC<{ progress: number; color: string; size?: number }> = ({ progress, color, size = 80 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" opacity={0.3} />
        <path d="M8 12l3 3 5-5" stroke={color} strokeWidth="2.5"
            strokeDasharray={20} strokeDashoffset={20 * (1 - progress)} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const DocumentIcon: React.FC<{ progress: number; color: string; size?: number }> = ({ progress, color, size = 120 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke={color} strokeWidth="1.5"
            strokeDasharray={80} strokeDashoffset={80 * (1 - progress)} />
        <polyline points="14,2 14,8 20,8" stroke={color} strokeWidth="1.5"
            strokeDasharray={20} strokeDashoffset={20 * (1 - progress)} />
        <line x1="8" y1="13" x2="16" y2="13" stroke={color} strokeWidth="1.5" opacity={progress > 0.5 ? 1 : 0} />
        <line x1="8" y1="17" x2="13" y2="17" stroke={color} strokeWidth="1.5" opacity={progress > 0.7 ? 1 : 0} />
    </svg>
);

const ScreenshotSlide: React.FC<{ bgImage: string; title: string }> = ({ bgImage, title }) => {
    const frame = useCurrentFrame();
    const anim = spring({ frame, fps: 30 });
    const zoom = interpolate(frame, [0, 150], [1, 1.05], { extrapolateRight: 'clamp' });

    return (
        <Centered style={{ backgroundColor: C.navy, overflow: 'hidden' }}>
            <Img src={staticFile(bgImage)} style={{ width: '100vw', height: '100vh', objectFit: 'cover', transform: `scale(${zoom})`, opacity: interpolate(anim, [0, 1], [0, 0.4]) }} />
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'linear-gradient(rgba(15,23,41,0.5), rgba(15,23,41,0.9))'
            }} />
            <div style={{
                position: 'absolute', width: '80%', height: '70%',
                borderRadius: 20, border: `2px solid ${C.teal}55`, overflow: 'hidden',
                boxShadow: '0 40px 100px rgba(0,0,0,0.8)', transform: `scale(${anim})`,
                opacity: anim
            }}>
                <Img src={staticFile(bgImage)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {title && (
                <div style={{
                    position: 'absolute', bottom: 60, fontSize: 60, fontFamily: DISPLAY,
                    color: 'white', backgroundColor: 'rgba(0,0,0,0.8)', padding: '20px 50px',
                    borderRadius: 20, transform: `translateY(${interpolate(anim, [0, 1], [100, 0])}px)`,
                    opacity: anim, border: `1px solid ${C.teal}88`
                }}>{title}</div>
            )}
        </Centered>
    );
};

// ─── ANIMATED BAR CHART ─────────────────────────

const BarChart: React.FC<{ data: { label: string; value: number; color: string }[]; title: string; bgColor: string }> = ({ data, title, bgColor }) => {
    const frame = useCurrentFrame();
    const maxVal = Math.max(...data.map(d => d.value));
    return (
        <Centered style={{ backgroundColor: bgColor }}>
            <GridOverlay />
            <div style={{ width: '85%', maxWidth: 1600 }}>
                <div style={{ fontSize: 70, fontFamily: DISPLAY, fontWeight: 900, color: 'white', marginBottom: 60, textAlign: 'center' }}>{title}</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 30, height: 450, borderLeft: '3px solid rgba(255,255,255,0.2)', borderBottom: '3px solid rgba(255,255,255,0.2)', padding: '0 20px 0 20px' }}>
                    {data.map((d, i) => {
                        const h = spring({ frame: frame - i * 8, fps: 30 });
                        const barHeight = (d.value / maxVal) * 400 * h;
                        return (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                                <div style={{ fontSize: 30, fontWeight: 900, color: 'white', opacity: h }}>{d.value}%</div>
                                <div style={{
                                    width: '100%', height: barHeight, backgroundColor: d.color,
                                    borderRadius: '12px 12px 0 0', boxShadow: `0 0 30px ${d.color}44`,
                                    background: `linear-gradient(180deg, ${d.color} 0%, ${d.color}88 100%)`
                                }} />
                                <div style={{ fontSize: 24, fontWeight: 700, color: C.gray, textAlign: 'center', marginTop: 8 }}>{d.label}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Centered>
    );
};

// ─── DONUT CHART ─────────────────────────

const DonutChart: React.FC<{ value: number; label: string; color: string; bgColor: string }> = ({ value, label, color, bgColor }) => {
    const frame = useCurrentFrame();
    const progress = interpolate(frame, [0, 60], [0, value / 100], { extrapolateRight: 'clamp' });
    const displayVal = Math.round(progress * 100);
    const circumference = 2 * Math.PI * 80;
    return (
        <Centered style={{ backgroundColor: bgColor }}>
            <GridOverlay />
            <svg width={500} height={500} viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="20" />
                <circle cx="100" cy="100" r="80" fill="none" stroke={color} strokeWidth="20"
                    strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress)}
                    strokeLinecap="round" transform="rotate(-90 100 100)" />
                <text x="100" y="90" textAnchor="middle" fill="white" fontSize="50" fontWeight="900" fontFamily={DISPLAY}>{displayVal}%</text>
                <text x="100" y="120" textAnchor="middle" fill={C.gray} fontSize="14" fontWeight="600" fontFamily={FONT}>ACCURACY</text>
            </svg>
            <div style={{ fontSize: 50, fontFamily: DISPLAY, color: 'white', marginTop: 30 }}>{label}</div>
        </Centered>
    );
};

// ─── TYPING SIMULATION ─────────────────────────

const SearchBarTyping: React.FC<{ query: string; bgColor: string }> = ({ query, bgColor }) => {
    const frame = useCurrentFrame();
    const progress = interpolate(frame, [0, 90], [0, 1], { extrapolateRight: 'clamp' });
    const charsToShow = Math.floor(progress * query.length);
    const showCursor = frame % 16 < 10;
    const svgProgress = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <Centered style={{ backgroundColor: bgColor }}>
            <GridOverlay />
            <div style={{ width: 1200, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
                {/* Search bar */}
                <div style={{
                    width: '100%', padding: '30px 40px', borderRadius: 20,
                    backgroundColor: 'rgba(255,255,255,0.08)', border: '2px solid rgba(255,255,255,0.15)',
                    display: 'flex', alignItems: 'center', gap: 20
                }}>
                    <SearchIcon progress={svgProgress} color={C.teal} size={40} />
                    <span style={{ fontSize: 36, fontFamily: FONT, color: 'white', fontWeight: 500 }}>
                        {query.slice(0, charsToShow)}
                        {showCursor && <span style={{ color: C.teal }}>|</span>}
                    </span>
                </div>
            </div>
        </Centered>
    );
};

// ─── ANSWER STREAMING ─────────────────────────

const AnswerStream: React.FC<{ answer: string; sources: string[]; bgColor: string }> = ({ answer, sources, bgColor }) => {
    const frame = useCurrentFrame();
    const answerProgress = interpolate(frame, [0, 80], [0, 1], { extrapolateRight: 'clamp' });
    const charsToShow = Math.floor(answerProgress * answer.length);

    return (
        <Centered style={{ backgroundColor: bgColor }}>
            <GridOverlay />
            <div style={{ width: 1400, padding: 60 }}>
                {/* Answer panel */}
                <div style={{
                    backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 24,
                    border: '1px solid rgba(255,255,255,0.1)', padding: '40px 50px'
                }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: C.teal, marginBottom: 20, textTransform: 'uppercase', letterSpacing: 3 }}>PERPLEXITY ANSWER</div>
                    <div style={{ fontSize: 32, fontFamily: FONT, color: 'white', lineHeight: 1.6, fontWeight: 400 }}>
                        {answer.slice(0, charsToShow)}
                        {answerProgress < 1 && <span style={{ color: C.teal, opacity: frame % 16 < 10 ? 1 : 0 }}>▋</span>}
                    </div>
                </div>
                {/* Sources */}
                <div style={{ display: 'flex', gap: 15, marginTop: 30, flexWrap: 'wrap' }}>
                    {sources.map((src, i) => {
                        const show = spring({ frame: frame - 60 - i * 10, fps: 30 });
                        return (
                            <div key={i} style={{
                                backgroundColor: 'rgba(32,178,170,0.15)', border: '1px solid rgba(32,178,170,0.3)',
                                borderRadius: 10, padding: '8px 20px', fontSize: 20, color: C.teal, fontWeight: 600,
                                transform: `scale(${show})`, display: 'flex', alignItems: 'center', gap: 8
                            }}>
                                <CheckIcon progress={show} color={C.teal} size={20} />
                                {src}
                            </div>
                        );
                    })}
                </div>
            </div>
        </Centered>
    );
};

// ─── DASHBOARD MOCKUP ─────────────────────────

const DashboardMockup: React.FC<{ bgColor: string }> = ({ bgColor }) => {
    const frame = useCurrentFrame();
    const slideIn = spring({ frame, fps: 30 });

    return (
        <Centered style={{ backgroundColor: bgColor }}>
            <GridOverlay />
            <div style={{
                width: 1500, height: 800, backgroundColor: 'rgba(255,255,255,0.04)',
                borderRadius: 30, border: '1px solid rgba(255,255,255,0.1)',
                overflow: 'hidden', transform: `scale(${interpolate(slideIn, [0, 1], [0.8, 1])})`,
                opacity: slideIn, boxShadow: '0 40px 100px rgba(0,0,0,0.5)'
            }}>
                {/* Top bar */}
                <div style={{ height: 60, backgroundColor: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', padding: '0 30px', gap: 10 }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#FF5F57' }} />
                    <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#FEBC2E' }} />
                    <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#28C840' }} />
                    <div style={{ flex: 1, textAlign: 'center', fontSize: 18, color: C.gray, fontWeight: 600 }}>perplexity.ai</div>
                </div>
                {/* Content */}
                <div style={{ display: 'flex', height: 740 }}>
                    {/* Sidebar */}
                    <div style={{ width: 250, borderRight: '1px solid rgba(255,255,255,0.08)', padding: 20 }}>
                        {['🏠 Home', '📂 Spaces', '🔬 Labs', '⚙️ Settings'].map((item, i) => (
                            <div key={i} style={{
                                padding: '14px 18px', borderRadius: 12, fontSize: 20, color: i === 0 ? C.teal : C.gray,
                                backgroundColor: i === 0 ? 'rgba(32,178,170,0.15)' : 'transparent', marginBottom: 6, fontWeight: 600,
                                opacity: spring({ frame: frame - i * 6, fps: 30 })
                            }}>{item}</div>
                        ))}
                    </div>
                    {/* Main area */}
                    <div style={{ flex: 1, padding: 40 }}>
                        <div style={{ fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 30 }}>Recent Research</div>
                        {['AI Market Analysis 2026', 'Quantum Computing Breakthroughs', 'Climate Tech Investment Report'].map((title, i) => (
                            <div key={i} style={{
                                backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 16, padding: '20px 30px',
                                marginBottom: 15, border: '1px solid rgba(255,255,255,0.07)',
                                transform: `translateX(${interpolate(spring({ frame: frame - 10 - i * 8, fps: 30 }), [0, 1], [100, 0])}px)`,
                                opacity: spring({ frame: frame - 10 - i * 8, fps: 30 }),
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontSize: 22, fontWeight: 700, color: 'white' }}>{title}</div>
                                    <div style={{ fontSize: 16, color: C.gray, marginTop: 6 }}>12 sources · Deep Research</div>
                                </div>
                                <div style={{ fontSize: 14, color: C.teal, fontWeight: 700, backgroundColor: 'rgba(32,178,170,0.15)', padding: '6px 14px', borderRadius: 8 }}>VIEW</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Centered>
    );
};

// ─── LINE CHART ─────────────────────────

const LineChart: React.FC<{ title: string; bgColor: string }> = ({ title, bgColor }) => {
    const frame = useCurrentFrame();
    const progress = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: 'clamp' });
    const points = [10, 15, 12, 25, 22, 40, 38, 55, 60, 75, 72, 90];

    const pathData = points.map((p, i) => {
        const x = 50 + (i / (points.length - 1)) * 700;
        const y = 380 - (p / 100) * 350;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    const totalLength = 1200;

    return (
        <Centered style={{ backgroundColor: bgColor }}>
            <GridOverlay />
            <div style={{ width: '85%', maxWidth: 1600, textAlign: 'center' }}>
                <div style={{ fontSize: 70, fontFamily: DISPLAY, color: 'white', marginBottom: 40 }}>{title}</div>
                <svg width={800} height={400} viewBox="0 0 800 400" style={{ overflow: 'visible' }}>
                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4].map(i => (
                        <line key={i} x1="50" y1={30 + i * 87.5} x2="750" y2={30 + i * 87.5} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                    ))}
                    {/* Gradient fill */}
                    <defs>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={C.teal} stopOpacity="0.3" />
                            <stop offset="100%" stopColor={C.teal} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {/* Line */}
                    <path d={pathData} fill="none" stroke={C.teal} strokeWidth="4"
                        strokeDasharray={totalLength} strokeDashoffset={totalLength * (1 - progress)}
                        strokeLinecap="round" strokeLinejoin="round" />
                    {/* Dots */}
                    {points.map((p, i) => {
                        const x = 50 + (i / (points.length - 1)) * 700;
                        const y = 380 - (p / 100) * 350;
                        const dotProgress = interpolate(progress, [i / points.length, (i + 1) / points.length], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                        return <circle key={i} cx={x} cy={y} r={dotProgress > 0.5 ? 6 : 0} fill={C.teal} />;
                    })}
                </svg>
            </div>
        </Centered>
    );
};

// ─── MODEL COMPARISON CARDS ─────────────────────────

const ModelCards: React.FC<{ bgColor: string }> = ({ bgColor }) => {
    const frame = useCurrentFrame();
    const models = [
        { name: 'GPT-4', icon: '🟢', desc: 'Reasoning & Analysis', color: '#10B981' },
        { name: 'CLAUDE', icon: '🟠', desc: 'Long Context & Code', color: '#F97316' },
        { name: 'GEMINI', icon: '🔵', desc: 'Multimodal & Search', color: '#2196F3' },
        { name: 'SONAR', icon: '🟣', desc: 'Speed & Real-time', color: '#7C3AED' },
    ];
    return (
        <Centered style={{ backgroundColor: bgColor }}>
            <GridOverlay />
            <div style={{ display: 'flex', gap: 30 }}>
                {models.map((m, i) => {
                    const anim = spring({ frame: frame - i * 8, fps: 30 });
                    return (
                        <div key={i} style={{
                            width: 320, padding: '50px 30px', borderRadius: 24,
                            backgroundColor: 'rgba(255,255,255,0.06)', border: `2px solid ${m.color}33`,
                            textAlign: 'center', transform: `scale(${anim}) translateY(${interpolate(anim, [0, 1], [60, 0])}px)`,
                            opacity: anim, boxShadow: `0 20px 60px ${m.color}22`
                        }}>
                            <div style={{ fontSize: 60, marginBottom: 20 }}>{m.icon}</div>
                            <div style={{ fontSize: 36, fontFamily: DISPLAY, color: 'white', fontWeight: 900 }}>{m.name}</div>
                            <div style={{ fontSize: 20, color: C.gray, marginTop: 10, fontWeight: 600 }}>{m.desc}</div>
                            <div style={{ width: 60, height: 4, backgroundColor: m.color, borderRadius: 2, margin: '20px auto 0' }} />
                        </div>
                    );
                })}
            </div>
        </Centered>
    );
};

// ─── PRICING CARD ─────────────────────────

const PricingDashboard: React.FC<{ bgColor: string }> = ({ bgColor }) => {
    const frame = useCurrentFrame();
    const tiers = [
        { name: 'FREE', price: '$0', features: ['5 queries/day', 'Basic Search', 'Standard Models'], color: C.gray, highlight: false },
        { name: 'PRO', price: '$20', features: ['Unlimited queries', 'Deep Research', 'All AI Models', 'File Uploads'], color: C.teal, highlight: true },
        { name: 'MAX', price: '$200', features: ['Everything in Pro', 'Model Council', 'Priority Speed', 'API Access'], color: C.purple, highlight: false },
    ];
    return (
        <Centered style={{ backgroundColor: bgColor }}>
            <GridOverlay />
            <div style={{ display: 'flex', gap: 30, alignItems: 'center' }}>
                {tiers.map((t, i) => {
                    const anim = spring({ frame: frame - i * 8, fps: 30 });
                    return (
                        <div key={i} style={{
                            width: t.highlight ? 400 : 350, padding: t.highlight ? '60px 40px' : '50px 35px',
                            borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.06)',
                            border: t.highlight ? `3px solid ${t.color}` : '1px solid rgba(255,255,255,0.1)',
                            textAlign: 'center', transform: `scale(${anim})`, opacity: anim,
                            boxShadow: t.highlight ? `0 0 60px ${t.color}33` : 'none'
                        }}>
                            <div style={{ fontSize: 24, fontWeight: 800, color: t.color, letterSpacing: 3, marginBottom: 10 }}>{t.name}</div>
                            <div style={{ fontSize: 80, fontFamily: DISPLAY, color: 'white' }}>{t.price}</div>
                            <div style={{ fontSize: 18, color: C.gray, marginBottom: 30 }}>/month</div>
                            {t.features.map((f, fi) => (
                                <div key={fi} style={{ fontSize: 20, color: 'rgba(255,255,255,0.7)', padding: '8px 0', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                                    <CheckIcon progress={spring({ frame: frame - 20 - fi * 5, fps: 30 })} color={t.color} size={22} /> {f}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </Centered>
    );
};

// ─── BIG TITLE (kept from V1) ─────────────────────────

const BigTitle: React.FC<{ text: string; color?: string; bgColor: string; subtext?: string; subtextColor?: string }> = ({ text, color = 'white', bgColor, subtext, subtextColor }) => {
    const frame = useCurrentFrame();
    const anim = spring({ frame, fps: 30, config: { damping: 12 } });
    return (
        <GradientBg from={bgColor} to={bgColor === C.navy ? C.navyLight : bgColor + 'cc'}>
            <GridOverlay />
            <Centered>
                <div style={{
                    fontSize: 240, fontWeight: 900, fontFamily: DISPLAY, color,
                    textAlign: 'center', lineHeight: 0.85,
                    transform: `scale(${interpolate(anim, [0, 1], [0.5, 1])})`,
                    opacity: anim, textShadow: '10px 10px 0 rgba(0,0,0,0.2)'
                }}>{text}</div>
                {subtext && <div style={{
                    position: 'absolute', bottom: '12%', fontSize: 55, fontWeight: 900,
                    fontFamily: FONT, color: subtextColor || 'rgba(255,255,255,0.8)',
                    backgroundColor: 'rgba(0,0,0,0.4)', padding: '12px 40px', borderRadius: 12,
                    backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)',
                    transform: `translateY(${interpolate(anim, [0, 1], [40, 0])}px)`, opacity: anim
                }}>{subtext}</div>}
            </Centered>
        </GradientBg>
    );
};

// ═══════════════════════════════════════════
// MAIN COMPOSITION
// ═══════════════════════════════════════════

export const PerplexityDemo: React.FC = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: C.navy, fontFamily: FONT }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Bebas+Neue&display=swap');`}</style>
            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.04} />

            {/* ═══ INTRO ═══ */}
            <Sequence durationInFrames={INTRO}>
                <GradientBg from={C.teal} to={C.darkTeal}>
                    <GridOverlay />
                    <Centered>
                        <Img src={staticFile("perplexity-logo.svg")} style={{ width: 300, height: 300, filter: 'invert(1)', objectFit: 'contain' }} />
                        <div style={{ fontSize: 200, fontFamily: DISPLAY, color: 'white', marginTop: 20, textShadow: '8px 8px 0 rgba(0,0,0,0.2)' }}>PERPLEXITY AI</div>
                    </Centered>
                </GradientBg>
                <Audio src={staticFile("sfx/rise.mp3")} volume={0.4} />
            </Sequence>

            {/* ═══ S1: THE HOOK (379 frames) ═══ */}
            <Sequence from={F1} durationInFrames={S1}>
                <Sequence durationInFrames={95}>
                    <SearchBarTyping query="What is the best AI search engine in 2026?" bgColor={C.navy} />
                </Sequence>
                <Sequence from={95} durationInFrames={95}>
                    <BarChart title="SEARCH EVOLUTION" bgColor={C.navy} data={[
                        { label: 'Google', value: 40, color: '#4285F4' },
                        { label: 'Bing', value: 25, color: '#00897B' },
                        { label: 'ChatGPT', value: 60, color: '#10A37F' },
                        { label: 'Perplexity', value: 95, color: C.teal },
                    ]} />
                    <Audio src={staticFile("sfx/pop.mp3")} />
                </Sequence>
                <Sequence from={190} durationInFrames={95}>
                    <BigTitle text="ANSWER ENGINE" bgColor={C.purple} subtext="NOT A SEARCH ENGINE" />
                </Sequence>
                <Sequence from={285} durationInFrames={94}>
                    <AnswerStream
                        answer="Perplexity AI is the leading answer engine that synthesizes information from across the web and delivers precise, cited answers."
                        sources={['Wikipedia', 'TechCrunch', 'MIT Review', 'Wired']}
                        bgColor={C.navy}
                    />
                </Sequence>
                <Audio src={staticFile("perplexity_1.wav")} />
            </Sequence>

            {/* ═══ S2: CITATIONS (424 frames) ═══ */}
            <Sequence from={F2} durationInFrames={S2}>
                <Sequence durationInFrames={106}>
                    <AnswerStream
                        answer="Unlike traditional search, every single claim in a Perplexity answer is backed by a verifiable source you can click."
                        sources={['Nature.com', 'ArXiv.org', 'Reuters', 'Bloomberg', 'IEEE']}
                        bgColor={C.navy}
                    />
                    <Audio src={staticFile("sfx/typing.mp3")} />
                </Sequence>
                <Sequence from={106} durationInFrames={106}>
                    <DonutChart value={97} label="PERPLEXITY ACCURACY" color={C.teal} bgColor={C.navy} />
                </Sequence>
                <Sequence from={212} durationInFrames={106}>
                    <BigTitle text="ZERO HALLUCINATIONS" bgColor={C.red} />
                    <Audio src={staticFile("sfx/whoosh.mp3")} />
                </Sequence>
                <Sequence from={318} durationInFrames={106}>
                    <BarChart title="ACCURACY COMPARISON" bgColor={C.navy} data={[
                        { label: 'ChatGPT', value: 72, color: '#10A37F' },
                        { label: 'Google AI', value: 68, color: '#4285F4' },
                        { label: 'Copilot', value: 65, color: '#00897B' },
                        { label: 'Perplexity', value: 97, color: C.teal },
                    ]} />
                </Sequence>
                <Audio src={staticFile("perplexity_2.wav")} />
            </Sequence>

            {/* ═══ S3: DEEP RESEARCH (514 frames) ═══ */}
            <Sequence from={F3} durationInFrames={S3}>
                <Sequence durationInFrames={103}>
                    <BigTitle text="DEEP RESEARCH" bgColor={C.purple} color={C.yellow} />
                    <Audio src={staticFile("sfx/rise.mp3")} volume={0.3} />
                </Sequence>
                <Sequence from={103} durationInFrames={103}>
                    <LineChart title="RESEARCH DEPTH OVER TIME" bgColor={C.navy} />
                </Sequence>
                <Sequence from={206} durationInFrames={103}>
                    <SearchBarTyping query="Compare quantum computing vs classical for drug discovery" bgColor={C.navy} />
                </Sequence>
                <Sequence from={309} durationInFrames={103}>
                    <BarChart title="TIME TO COMPLETE RESEARCH" bgColor={C.navy} data={[
                        { label: 'Manual', value: 95, color: C.red },
                        { label: 'Google', value: 75, color: '#4285F4' },
                        { label: 'ChatGPT', value: 50, color: '#10A37F' },
                        { label: 'Perplexity', value: 8, color: C.teal },
                    ]} />
                    <Audio src={staticFile("sfx/pop 2.mp3")} />
                </Sequence>
                <Sequence from={412} durationInFrames={102}>
                    <ScreenshotSlide bgImage="pshot1.png" title="REAL TIME RESEARCH" />
                </Sequence>
                <Audio src={staticFile("perplexity_3.wav")} />
            </Sequence>

            {/* ═══ S4: MULTIMODAL (431 frames) ═══ */}
            <Sequence from={F4} durationInFrames={S4}>
                <Sequence durationInFrames={108}>
                    <BigTitle text="UPLOAD ANYTHING" bgColor={C.orange} color="black" />
                    <Audio src={staticFile("sfx/whoosh.mp3")} />
                </Sequence>
                <Sequence from={108} durationInFrames={108}>
                    <MultimodalUpload bgColor={C.navy} />
                </Sequence>
                <Sequence from={216} durationInFrames={108}>
                    <BarChart title="FILE PROCESSING SPEED" bgColor={C.navy} data={[
                        { label: 'PDF', value: 95, color: C.red },
                        { label: 'Images', value: 90, color: C.blue },
                        { label: 'Sheets', value: 85, color: C.green },
                        { label: 'Docs', value: 92, color: C.purple },
                    ]} />
                </Sequence>
                <Sequence from={324} durationInFrames={107}>
                    <BigTitle text="100 PAGE PDF?" bgColor={C.teal} subtext="SUMMARIZED INSTANTLY" />
                </Sequence>
                <Audio src={staticFile("perplexity_4.wav")} />
            </Sequence>

            {/* ═══ S5: MODEL SELECTION (500 frames) ═══ */}
            <Sequence from={F5} durationInFrames={S5}>
                <Sequence durationInFrames={125}>
                    <BigTitle text="CHOOSE YOUR BRAIN" bgColor={C.navy} color={C.teal} />
                    <Audio src={staticFile("sfx/rise.mp3")} volume={0.3} />
                </Sequence>
                <Sequence from={125} durationInFrames={125}>
                    <ModelCards bgColor={C.navy} />
                </Sequence>
                <Sequence from={250} durationInFrames={125}>
                    <BigTitle text="MODEL COUNCIL" bgColor={C.teal} subtext="MULTIPLE BRAINS, ZERO ERRORS" />
                    <Audio src={staticFile("sfx/pop.mp3")} />
                </Sequence>
                <Sequence from={375} durationInFrames={125}>
                    <DonutChart value={99} label="COUNCIL ACCURACY" color={C.purple} bgColor={C.navy} />
                </Sequence>
                <Audio src={staticFile("perplexity_5.wav")} />
            </Sequence>

            {/* ═══ S6: SPACES & LABS (465 frames) ═══ */}
            <Sequence from={F6} durationInFrames={S6}>
                <Sequence durationInFrames={155}>
                    <DashboardMockup bgColor={C.navy} />
                    <Audio src={staticFile("sfx/typing.mp3")} />
                </Sequence>
                <Sequence from={155} durationInFrames={155}>
                    <ScreenshotSlide bgImage="pshot_error.png" title="CUSTOM WORKSPACES" />
                </Sequence>
                <Sequence from={310} durationInFrames={155}>
                    <LineChart title="PRODUCTIVITY MULTIPLIER" bgColor={C.navy} />
                    <Audio src={staticFile("sfx/pop 2.mp3")} />
                </Sequence>
                <Audio src={staticFile("perplexity_6.wav")} />
            </Sequence>

            {/* ═══ S7: PERPLEXITY COMPUTER (480 frames) ═══ */}
            <Sequence from={F7} durationInFrames={S7}>
                <Sequence durationInFrames={120}>
                    <BigTitle text="PERPLEXITY COMPUTER" bgColor={C.navy} color={C.yellow} />
                    <Audio src={staticFile("sfx/rise.mp3")} volume={0.5} />
                </Sequence>
                <Sequence from={120} durationInFrames={120}>
                    <AutonomousAgentViz bgColor={C.navy} />
                </Sequence>
                <Sequence from={240} durationInFrames={120}>
                    <BigTitle text="AUTONOMOUS AGENT" bgColor={C.purple} subtext="RUNS FOR HOURS, DAYS, MONTHS" />
                    <Audio src={staticFile("sfx/whoosh.mp3")} />
                </Sequence>
                <Sequence from={360} durationInFrames={120}>
                    <BarChart title="AGENT CAPABILITIES" bgColor={C.navy} data={[
                        { label: 'Browse', value: 95, color: C.teal },
                        { label: 'Code', value: 90, color: C.blue },
                        { label: 'Deploy', value: 85, color: C.green },
                        { label: 'Research', value: 98, color: C.purple },
                    ]} />
                </Sequence>
                <Audio src={staticFile("perplexity_7.wav")} />
            </Sequence>

            {/* ═══ S8: OUTRO (436 frames) ═══ */}
            <Sequence from={F8} durationInFrames={S8}>
                <Sequence durationInFrames={109}>
                    <BarChart title="THE EVOLUTION OF SEARCH" bgColor={C.navy} data={[
                        { label: 'Links', value: 30, color: '#4285F4' },
                        { label: 'Chat', value: 60, color: '#10A37F' },
                        { label: 'Answers', value: 95, color: C.teal },
                    ]} />
                    <Audio src={staticFile("sfx/pop.mp3")} />
                </Sequence>
                <Sequence from={109} durationInFrames={109}>
                    <PricingDashboard bgColor={C.navy} />
                </Sequence>
                <Sequence from={218} durationInFrames={109}>
                    <BigTitle text="NOT OPTIONAL" bgColor={C.red} subtext="IT'S ESSENTIAL" />
                    <Audio src={staticFile("sfx/rise.mp3")} volume={0.5} />
                </Sequence>
                <Sequence from={327} durationInFrames={109}>
                    <BigTitle text="TRY PERPLEXITY" bgColor={C.teal} subtext="PERPLEXITY.AI" subtextColor={C.yellow} />
                </Sequence>
                <Audio src={staticFile("perplexity_8.wav")} />
            </Sequence>
        </AbsoluteFill>
    );
};

// ─── MULTIMODAL UPLOAD VISUAL ─────────────────────────

const MultimodalUpload: React.FC<{ bgColor: string }> = ({ bgColor }) => {
    const frame = useCurrentFrame();
    const files = [
        { icon: '📄', label: 'research_paper.pdf', color: C.red },
        { icon: '📸', label: 'data_chart.png', color: C.blue },
        { icon: '📊', label: 'financials.xlsx', color: C.green },
        { icon: '📁', label: 'full_dataset.csv', color: C.orange },
    ];
    return (
        <Centered style={{ backgroundColor: bgColor }}>
            <GridOverlay />
            <div style={{ width: 1200 }}>
                <div style={{ fontSize: 50, fontFamily: DISPLAY, color: 'white', textAlign: 'center', marginBottom: 50 }}>DROP YOUR FILES</div>
                <div style={{ display: 'flex', gap: 25, justifyContent: 'center' }}>
                    {files.map((f, i) => {
                        const anim = spring({ frame: frame - i * 10, fps: 30 });
                        const svgProg = interpolate(anim, [0, 1], [0, 1]);
                        return (
                            <div key={i} style={{
                                width: 260, padding: '40px 20px', borderRadius: 20,
                                backgroundColor: 'rgba(255,255,255,0.06)', border: `2px dashed ${f.color}55`,
                                textAlign: 'center', transform: `scale(${anim}) translateY(${interpolate(anim, [0, 1], [50, 0])}px)`,
                                opacity: anim
                            }}>
                                <DocumentIcon progress={svgProg} color={f.color} size={80} />
                                <div style={{ fontSize: 18, color: 'white', marginTop: 15, fontWeight: 600 }}>{f.label}</div>
                                <div style={{ width: '80%', height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, margin: '15px auto 0', overflow: 'hidden' }}>
                                    <div style={{ width: `${anim * 100}%`, height: '100%', backgroundColor: f.color, borderRadius: 3 }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Centered>
    );
};

// ─── AUTONOMOUS AGENT VISUALIZATION ─────────────────────────

const AutonomousAgentViz: React.FC<{ bgColor: string }> = ({ bgColor }) => {
    const frame = useCurrentFrame();
    const steps = [
        { label: 'PLAN', icon: '📋', color: C.teal },
        { label: 'BROWSE', icon: '🌐', color: C.blue },
        { label: 'ANALYZE', icon: '🔬', color: C.purple },
        { label: 'BUILD', icon: '🔧', color: C.orange },
        { label: 'DEPLOY', icon: '🚀', color: C.green },
    ];
    return (
        <Centered style={{ backgroundColor: bgColor }}>
            <GridOverlay />
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                {steps.map((s, i) => {
                    const anim = spring({ frame: frame - i * 12, fps: 30 });
                    return (
                        <React.Fragment key={i}>
                            <div style={{
                                width: 200, padding: '30px 20px', borderRadius: 20,
                                backgroundColor: `${s.color}22`, border: `2px solid ${s.color}44`,
                                textAlign: 'center', transform: `scale(${anim})`, opacity: anim
                            }}>
                                <div style={{ fontSize: 60 }}>{s.icon}</div>
                                <div style={{ fontSize: 22, fontWeight: 800, color: 'white', marginTop: 10 }}>{s.label}</div>
                            </div>
                            {i < steps.length - 1 && (
                                <svg width={40} height={20} style={{ opacity: spring({ frame: frame - (i + 1) * 12, fps: 30 }) }}>
                                    <line x1="0" y1="10" x2="30" y2="10" stroke={C.teal} strokeWidth="3" />
                                    <polygon points="30,5 40,10 30,15" fill={C.teal} />
                                </svg>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </Centered>
    );
};
