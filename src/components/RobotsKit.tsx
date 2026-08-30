import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, Video, staticFile, AbsoluteFill } from 'remotion';
import { FONT_STACK } from './PremiumKit';

// ─── COLORS ──────────────────────
export const RC = {
    bg: '#050508', neonCyan: '#00F0FF', neonPink: '#FF0055', neonGreen: '#39FF14',
    white: '#F0F0F0', gold: '#FFD700', glass: 'rgba(10,10,20,0.8)',
    border: 'rgba(255,255,255,0.1)', gray: '#6B7280', grayLight: '#9CA3AF',
    red: '#EF4444', blue: '#3B82F6',
};

// ─── GLITCH TITLE ──────────────────────
export const GlitchTitle: React.FC<{ text: string; color?: string; bg?: string; sub?: string }> = ({ text, color = RC.white, bg = RC.bg, sub }) => {
    const frame = useCurrentFrame();
    const a = spring({ frame, fps: 30, config: { damping: 10 } });
    const gx = frame < 10 ? (Math.random() - 0.5) * 25 : 0;
    const gy = frame < 10 ? (Math.random() - 0.5) * 12 : 0;
    return (
        <AbsoluteFill style={{ backgroundColor: bg }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.012) 3px,rgba(255,255,255,0.012) 4px)' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                {frame < 10 && <><div style={{ position: 'absolute', fontSize: 170, fontWeight: 900, fontFamily: FONT_STACK.display, color: 'cyan', opacity: 0.4, transform: `translate(${gx + 5}px,${gy - 3}px)`, mixBlendMode: 'screen' }}>{text}</div><div style={{ position: 'absolute', fontSize: 170, fontWeight: 900, fontFamily: FONT_STACK.display, color: 'red', opacity: 0.4, transform: `translate(${gx - 5}px,${gy + 3}px)`, mixBlendMode: 'screen' }}>{text}</div></>}
                <div style={{ fontSize: 170, fontWeight: 900, fontFamily: FONT_STACK.display, color, textAlign: 'center', lineHeight: 0.9, transform: `scale(${interpolate(a, [0, 1], [0.3, 1])})`, opacity: a, letterSpacing: -3 }}>{text}</div>
                {sub && <div style={{ fontSize: 34, fontWeight: 700, color: RC.grayLight, marginTop: 25, fontFamily: FONT_STACK.mono, opacity: a, letterSpacing: 5 }}>{sub}</div>}
            </div>
        </AbsoluteFill>
    );
};

// ─── STAT CARD ──────────────────────
export const StatCard: React.FC<{ value: string; label: string; bg?: string; color?: string; sub?: string }> = ({ value, label, bg = RC.bg, color = RC.neonCyan, sub }) => {
    const frame = useCurrentFrame();
    const a = spring({ frame, fps: 30, config: { damping: 12 } });
    return (
        <AbsoluteFill style={{ backgroundColor: bg }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.01) 3px,rgba(255,255,255,0.01) 4px)' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ fontSize: 260, fontWeight: 900, fontFamily: FONT_STACK.display, color, transform: `scale(${interpolate(a, [0, 1], [0.3, 1])})`, opacity: a, textShadow: `0 0 60px ${color}44` }}>{value}</div>
                <div style={{ fontSize: 48, fontWeight: 800, color: RC.grayLight, marginTop: 10 }}>{label}</div>
                {sub && <div style={{ fontSize: 26, color: RC.gray, marginTop: 20, fontFamily: FONT_STACK.mono }}>{sub}</div>}
            </div>
        </AbsoluteFill>
    );
};

// ─── TERMINAL ──────────────────────
export const Terminal: React.FC<{ lines: string[]; title?: string; accent?: string }> = ({ lines, title = 'root@lab', accent = RC.neonGreen }) => {
    const frame = useCurrentFrame();
    const a = spring({ frame, fps: 30, config: { damping: 18 } });
    return (
        <div style={{ width: 1400, backgroundColor: '#0D1117', borderRadius: 16, overflow: 'hidden', transform: `scale(${interpolate(a, [0, 1], [0.92, 1])})`, opacity: a, boxShadow: '0 30px 90px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', backgroundColor: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#FF5F57' }} />
                <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#FFBD2E' }} />
                <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#28C840' }} />
                <span style={{ color: RC.grayLight, fontSize: 16, marginLeft: 15, fontFamily: FONT_STACK.mono }}>{title}</span>
            </div>
            <div style={{ padding: '35px 40px', fontFamily: FONT_STACK.mono, fontSize: 24, lineHeight: 1.8 }}>
                {lines.map((line, i) => {
                    const vis = interpolate(frame, [i * 12, i * 12 + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                    const isErr = line.includes('ERROR') || line.includes('CRITICAL') || line.includes('WARNING');
                    const isOk = line.includes('✓') || line.includes('ACTIVE') || line.includes('ONLINE');
                    const isCmd = line.startsWith('$') || line.startsWith('>');
                    return <div key={i} style={{ opacity: vis, transform: `translateX(${interpolate(vis, [0, 1], [20, 0])}px)`, color: isErr ? RC.red : isOk ? RC.neonGreen : isCmd ? accent : RC.grayLight }}>{line}</div>;
                })}
                <span style={{ color: accent, opacity: Math.sin(frame / 4) > 0 ? 1 : 0 }}>█</span>
            </div>
        </div>
    );
};

// ─── COMPANY CARDS ──────────────────────
export const CompanyCards: React.FC<{ items: { name: string; stat: string; color: string; icon: string; desc: string }[]; title: string; bg?: string }> = ({ items, title, bg = RC.bg }) => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ backgroundColor: bg }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.01) 3px,rgba(255,255,255,0.01) 4px)' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ fontSize: 55, fontWeight: 900, fontFamily: FONT_STACK.display, color: RC.white, marginBottom: 60 }}>{title}</div>
                <div style={{ display: 'flex', gap: 35 }}>
                    {items.map((c, i) => {
                        const a = spring({ frame: frame - i * 10, fps: 30 });
                        return <div key={i} style={{ width: 340, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 20, padding: '45px 30px', textAlign: 'center', transform: `translateY(${interpolate(a, [0, 1], [60, 0])}px)`, opacity: a, border: `2px solid ${c.color}33`, backdropFilter: 'blur(10px)' }}>
                            <div style={{ fontSize: 70, marginBottom: 15 }}>{c.icon}</div>
                            <div style={{ fontSize: 32, fontWeight: 900, color: RC.white }}>{c.name}</div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: c.color, marginTop: 10, fontFamily: FONT_STACK.mono, letterSpacing: 2 }}>{c.stat}</div>
                            <div style={{ fontSize: 16, color: RC.grayLight, marginTop: 15, lineHeight: 1.5 }}>{c.desc}</div>
                        </div>;
                    })}
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── HORIZONTAL BARS ──────────────────────
export const HBars: React.FC<{ items: { label: string; value: number; color: string }[]; title: string; suffix?: string; bg?: string }> = ({ items, title, suffix = '', bg = RC.bg }) => {
    const frame = useCurrentFrame();
    const mx = Math.max(...items.map(i => i.value));
    return (
        <AbsoluteFill style={{ backgroundColor: bg }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.01) 3px,rgba(255,255,255,0.01) 4px)' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 180px' }}>
                <div style={{ fontSize: 55, fontWeight: 900, fontFamily: FONT_STACK.display, color: RC.white, marginBottom: 55 }}>{title}</div>
                {items.map((item, i) => {
                    const w = spring({ frame: frame - i * 12, fps: 30 });
                    return <div key={i} style={{ marginBottom: 28 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                            <span style={{ fontSize: 24, fontWeight: 700, color: RC.white }}>{item.label}</span>
                            <span style={{ fontSize: 24, fontWeight: 900, color: item.color, fontFamily: FONT_STACK.mono }}>{item.value}{suffix}</span>
                        </div>
                        <div style={{ width: '100%', height: 40, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden' }}>
                            <div style={{ width: `${(item.value / mx) * 100 * w}%`, height: '100%', backgroundColor: item.color, borderRadius: 8, boxShadow: `0 0 20px ${item.color}44` }} />
                        </div>
                    </div>;
                })}
            </div>
        </AbsoluteFill>
    );
};

// ─── ANIMATED LINE GRAPH ──────────────────────
export const LineGraph: React.FC<{ points: { x: number; y: number }[]; color: string; title: string; xLabel?: string; yLabel?: string }> = ({ points, color, title, xLabel = '', yLabel = '' }) => {
    const frame = useCurrentFrame();
    const progress = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: 'clamp' });
    const a = spring({ frame, fps: 30 });
    const W = 1200, H = 500, PAD = 80;
    const maxX = Math.max(...points.map(p => p.x));
    const maxY = Math.max(...points.map(p => p.y));
    const scaled = points.map(p => ({ x: PAD + (p.x / maxX) * (W - PAD * 2), y: H - PAD - (p.y / maxY) * (H - PAD * 2) }));
    const pathData = scaled.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaData = `${pathData} L ${scaled[scaled.length - 1].x} ${H - PAD} L ${scaled[0].x} ${H - PAD} Z`;
    return (
        <div style={{ transform: `scale(${interpolate(a, [0, 1], [0.9, 1])})`, opacity: a }}>
            <div style={{ fontSize: 40, fontWeight: 900, fontFamily: FONT_STACK.display, color: RC.white, marginBottom: 20, textAlign: 'center' }}>{title}</div>
            <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ filter: `drop-shadow(0 0 20px ${color}33)` }}>
                {/* Grid lines */}
                {[0.25, 0.5, 0.75, 1].map((r, i) => <line key={i} x1={PAD} y1={H - PAD - r * (H - PAD * 2)} x2={W - PAD} y2={H - PAD - r * (H - PAD * 2)} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />)}
                {/* Area fill */}
                <path d={areaData} fill={`${color}15`} strokeDasharray="3000" strokeDashoffset={3000 * (1 - progress)} />
                {/* Line */}
                <path d={pathData} fill="none" stroke={color} strokeWidth="4" strokeDasharray="3000" strokeDashoffset={3000 * (1 - progress)} strokeLinecap="round" />
                {/* Points */}
                {scaled.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={6} fill={color} opacity={progress > (i / scaled.length) ? 1 : 0} />)}
                {/* Axis labels */}
                <text x={W / 2} y={H - 10} fill={RC.gray} fontSize="18" textAnchor="middle" fontFamily={FONT_STACK.mono}>{xLabel}</text>
                <text x={15} y={H / 2} fill={RC.gray} fontSize="18" textAnchor="middle" fontFamily={FONT_STACK.mono} transform={`rotate(-90, 15, ${H / 2})`}>{yLabel}</text>
            </svg>
        </div>
    );
};

// ─── SPLIT COMPARISON ──────────────────────
export const SplitCompare: React.FC<{ leftTitle: string; rightTitle: string; leftColor: string; rightColor: string; leftIcon: string; rightIcon: string; leftSub: string; rightSub: string }> = ({ leftTitle, rightTitle, leftColor, rightColor, leftIcon, rightIcon, leftSub, rightSub }) => {
    const frame = useCurrentFrame();
    const s = spring({ frame, fps: 30 });
    return (
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1, backgroundColor: `${leftColor}22`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRight: `2px solid ${RC.border}`, opacity: s, transform: `translateX(${interpolate(s, [0, 1], [-100, 0])}px)` }}>
                <div style={{ fontSize: 120 }}>{leftIcon}</div>
                <div style={{ fontSize: 70, fontWeight: 900, fontFamily: FONT_STACK.display, color: leftColor, marginTop: 20 }}>{leftTitle}</div>
                <div style={{ fontSize: 24, color: RC.grayLight, marginTop: 15, textAlign: 'center', maxWidth: 400 }}>{leftSub}</div>
            </div>
            <div style={{ flex: 1, backgroundColor: `${rightColor}22`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: s, transform: `translateX(${interpolate(s, [0, 1], [100, 0])}px)` }}>
                <div style={{ fontSize: 120 }}>{rightIcon}</div>
                <div style={{ fontSize: 70, fontWeight: 900, fontFamily: FONT_STACK.display, color: rightColor, marginTop: 20 }}>{rightTitle}</div>
                <div style={{ fontSize: 24, color: RC.grayLight, marginTop: 15, textAlign: 'center', maxWidth: 400 }}>{rightSub}</div>
            </div>
        </AbsoluteFill>
    );
};

// ─── TYPING QUOTE ──────────────────────
export const TypeQuote: React.FC<{ quote: string; author: string; bg?: string }> = ({ quote, author, bg = RC.bg }) => {
    const frame = useCurrentFrame();
    const chars = Math.floor(interpolate(frame, [0, 80], [0, quote.length], { extrapolateRight: 'clamp' }));
    return (
        <AbsoluteFill style={{ backgroundColor: bg }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.01) 3px,rgba(255,255,255,0.01) 4px)' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 200px' }}>
                <div style={{ fontSize: 28, color: RC.neonCyan, fontWeight: 900, marginBottom: 30, fontFamily: FONT_STACK.mono, letterSpacing: 4 }}>INSIGHT</div>
                <div style={{ fontSize: 44, color: RC.white, fontWeight: 600, lineHeight: 1.5, textAlign: 'center' }}>"{quote.slice(0, chars)}"<span style={{ color: RC.neonCyan, opacity: chars < quote.length && Math.sin(frame / 4) > 0 ? 1 : 0 }}>|</span></div>
                <div style={{ fontSize: 28, color: RC.neonCyan, fontWeight: 800, marginTop: 40, opacity: chars >= quote.length ? 1 : 0 }}>— {author}</div>
            </div>
        </AbsoluteFill>
    );
};

// ─── CIRCUIT BOARD BACKGROUND ──────────────────────
export const CircuitBG: React.FC<{ color?: string; children: React.ReactNode }> = ({ color = RC.neonCyan, children }) => {
    const frame = useCurrentFrame();
    return (
        <AbsoluteFill style={{ backgroundColor: RC.bg }}>
            <svg width="1920" height="1080" style={{ position: 'absolute', opacity: 0.12 }}>
                {[...Array(12)].map((_, i) => {
                    const y = 90 * i;
                    const len = interpolate(frame, [i * 5, i * 5 + 30], [0, 1920], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                    return <rect key={`h${i}`} x={0} y={y} width={len} height={1} fill={color} />;
                })}
                {[...Array(20)].map((_, i) => {
                    const x = 96 * i;
                    const len = interpolate(frame, [i * 3, i * 3 + 30], [0, 1080], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                    return <rect key={`v${i}`} x={x} y={0} width={1} height={len} fill={color} />;
                })}
                {[...Array(15)].map((_, i) => {
                    const cx = 128 * (i % 5) + 200;
                    const cy = 200 * Math.floor(i / 5) + 150;
                    const r = spring({ frame: frame - i * 4, fps: 30 }) * 6;
                    return <circle key={`c${i}`} cx={cx} cy={cy} r={r} fill={color} opacity={0.8} />;
                })}
            </svg>
            <AbsoluteFill style={{ background: 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.7) 100%)' }} />
            {children}
        </AbsoluteFill>
    );
};

// ─── DRIFTING CAMERA (over Broll) ──────────────────────
export const DriftBroll: React.FC<{ src: string; overlay?: string; children: React.ReactNode }> = ({ src, overlay = 'rgba(0,0,0,0.55)', children }) => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();
    const s = interpolate(frame, [0, durationInFrames], [1, 1.15], { extrapolateRight: 'clamp' });
    const tx = interpolate(frame, [0, durationInFrames], [0, 25]);
    return (
        <AbsoluteFill>
            <div style={{ position: 'absolute', inset: 0, transform: `scale(${s}) translateX(${tx}px)`, transformOrigin: 'center' }}>
                <Video src={staticFile(src)} style={{ objectFit: 'cover', width: '100%', height: '100%' }} muted loop />
            </div>
            <AbsoluteFill style={{ backgroundColor: overlay }} />
            <AbsoluteFill style={{ background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.8) 100%)' }} />
            {children}
        </AbsoluteFill>
    );
};

// ─── GLASSMORPHIC DASHBOARD ──────────────────────
export const GlassDashboard: React.FC<{ stats: { label: string; value: string; color: string; icon?: string }[]; title?: string }> = ({ stats, title }) => {
    const frame = useCurrentFrame();
    const a = spring({ frame, fps: 30 });
    return (
        <div style={{ width: 1400, transform: `scale(${interpolate(a, [0, 1], [0.9, 1])})`, opacity: a }}>
            {title && <div style={{ fontSize: 40, fontWeight: 900, fontFamily: FONT_STACK.display, color: RC.white, marginBottom: 40, textAlign: 'center' }}>{title}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(stats.length, 3)}, 1fr)`, gap: 25 }}>
                {stats.map((s, i) => {
                    const sa = spring({ frame: frame - i * 8, fps: 30 });
                    return <div key={i} style={{
                        background: 'rgba(255,255,255,0.04)', border: `1px solid ${s.color}44`, borderRadius: 20,
                        padding: '40px 35px', backdropFilter: 'blur(20px)', transform: `translateY(${interpolate(sa, [0, 1], [40, 0])}px)`, opacity: sa,
                        boxShadow: `inset 0 0 30px ${s.color}08, 0 20px 60px rgba(0,0,0,0.3)`
                    }}>
                        {s.icon && <div style={{ fontSize: 50, marginBottom: 15 }}>{s.icon}</div>}
                        <div style={{ fontFamily: FONT_STACK.mono, fontSize: 16, color: 'rgba(255,255,255,0.5)', letterSpacing: 3, marginBottom: 12, textTransform: 'uppercase' }}>{s.label}</div>
                        <div style={{ fontFamily: FONT_STACK.display, fontSize: 64, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    </div>;
                })}
            </div>
        </div>
    );
};

// ─── ROBOT SVG ──────────────────────
export const RobotSVG: React.FC<{ color?: string; size?: number }> = ({ color = RC.neonCyan, size = 400 }) => {
    const frame = useCurrentFrame();
    const a = spring({ frame, fps: 30, config: { damping: 12 } });
    const pulse = Math.sin(frame / 10) * 3;
    return (
        <div style={{ transform: `scale(${a})`, opacity: a }}>
            <svg width={size} height={size} viewBox="0 0 200 200" fill="none" style={{ filter: `drop-shadow(0 0 30px ${color}44)` }}>
                {/* Head */}
                <rect x="60" y="20" width="80" height="60" rx="15" stroke={color} strokeWidth="3" fill={`${color}11`} />
                {/* Eyes */}
                <circle cx="85" cy="45" r={8 + pulse * 0.3} fill={color} opacity={0.9} />
                <circle cx="115" cy="45" r={8 + pulse * 0.3} fill={color} opacity={0.9} />
                {/* Antenna */}
                <line x1="100" y1="20" x2="100" y2="5" stroke={color} strokeWidth="2" />
                <circle cx="100" cy="5" r="4" fill={color} opacity={Math.sin(frame / 6) > 0 ? 1 : 0.3} />
                {/* Neck */}
                <rect x="90" y="80" width="20" height="15" fill={`${color}33`} />
                {/* Body */}
                <rect x="50" y="95" width="100" height="60" rx="10" stroke={color} strokeWidth="3" fill={`${color}11`} />
                {/* Chest panel */}
                <rect x="70" y="105" width="60" height="20" rx="5" fill={`${color}22`} stroke={color} strokeWidth="1" />
                <circle cx="85" cy="115" r="3" fill={RC.neonGreen} />
                <circle cx="100" cy="115" r="3" fill={RC.gold} />
                <circle cx="115" cy="115" r="3" fill={RC.neonPink} />
                {/* Arms */}
                <line x1="50" y1="105" x2="25" y2={130 + pulse} stroke={color} strokeWidth="3" strokeLinecap="round" />
                <line x1="150" y1="105" x2="175" y2={130 + pulse} stroke={color} strokeWidth="3" strokeLinecap="round" />
                <circle cx="25" cy={130 + pulse} r="6" fill={`${color}44`} stroke={color} strokeWidth="2" />
                <circle cx="175" cy={130 + pulse} r="6" fill={`${color}44`} stroke={color} strokeWidth="2" />
                {/* Legs */}
                <line x1="75" y1="155" x2="75" y2="185" stroke={color} strokeWidth="3" strokeLinecap="round" />
                <line x1="125" y1="155" x2="125" y2="185" stroke={color} strokeWidth="3" strokeLinecap="round" />
                <rect x="60" y="185" width="30" height="10" rx="5" fill={`${color}33`} />
                <rect x="110" y="185" width="30" height="10" rx="5" fill={`${color}33`} />
            </svg>
        </div>
    );
};
