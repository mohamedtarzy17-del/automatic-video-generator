import React from 'react';
import {
    AbsoluteFill, useCurrentFrame, interpolate, spring,
    Audio, staticFile, Sequence, Easing,
} from 'remotion';
import { FONT_IMPORT, FONT_STACK, getFontForScene, Callout, StickFigureScene } from './components/PremiumKit';

const C = {
    navy: '#0A0F1C', navyLight: '#131B32', darkRed: '#8B0000', red: '#DC2626',
    brightRed: '#EF4444', gold: '#D4AF37', goldBright: '#FBBF24', blue: '#1E40AF',
    blueLight: '#3B82F6', green: '#059669', greenBright: '#10B981', white: '#F1F5F9',
    gray: '#94A3B8', purple: '#7C3AED', orange: '#F97316', teal: '#14B8A6', black: '#000',
};

const S1 = 417, S2 = 426, S3 = 553, S4 = 506, S5 = 554, S6 = 523, S7 = 634, S8 = 498, S9 = 512, S10 = 587, S11 = 535, S12 = 536, S13 = 604, S14 = 851, S15 = 868;
const INTRO = 90;
const F1 = INTRO, F2 = F1 + S1, F3 = F2 + S2, F4 = F3 + S3, F5 = F4 + S4, F6 = F5 + S5, F7 = F6 + S6, F8 = F7 + S7, F9 = F8 + S8, F10 = F9 + S9, F11 = F10 + S10, F12 = F11 + S11, F13 = F12 + S12, F14 = F13 + S13, F15 = F14 + S14;

// ─── CORE HELPERS ──────────────────────
const Cen: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', ...style }}>{children}</AbsoluteFill>
);
const Grid: React.FC = () => <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />;
const Grad: React.FC<{ from: string; to: string; children: React.ReactNode }> = ({ from, to, children }) => (
    <AbsoluteFill style={{ background: `linear-gradient(135deg,${from},${to})` }}><Grid />{children}</AbsoluteFill>
);

// ─── RETENTION HELPERS ──────────────────────
const CameraWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const frame = useCurrentFrame();
    const scale = interpolate(frame, [0, 9000], [1, 1.05]);
    const rotate = Math.sin(frame * 0.01) * 0.15;
    return (
        <div style={{ width: '100%', height: '100%', transform: `scale(${scale}) rotate(${rotate}deg)` }}>
            {children}
        </div>
    );
};

const BeatManager: React.FC<{ frame: number; interval?: number }> = ({ frame, interval = 36 }) => {
    const isBeat = frame > 0 && frame % interval === 0;
    return (
        <>
            {isBeat && <Audio src={staticFile('sfx/pop.mp3')} volume={0.3} />}
        </>
    );
};

const FilmGrain: React.FC = () => (
    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none', mixBlendMode: 'overlay', zIndex: 100 }}>
        <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.4 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
);

const Flash: React.FC<{ frame: number; interval?: number }> = ({ frame, interval = 36 }) => {
    const opacity = interpolate(frame % interval, [0, 5], [0.3, 0], { extrapolateRight: 'clamp' });
    if (opacity <= 0) return null;
    return <AbsoluteFill style={{ backgroundColor: 'white', opacity, zIndex: 110 }} />;
};

// ─── NEWS TICKER ──────────────────────
const NewsTicker: React.FC<{ text: string; color?: string }> = ({ text, color = C.brightRed }) => {
    const frame = useCurrentFrame();
    return (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, backgroundColor: 'rgba(0,0,0,0.85)', borderTop: `3px solid ${color}`, display: 'flex', alignItems: 'center', overflow: 'hidden', zIndex: 10 }}>
            <div style={{ backgroundColor: color, padding: '0 20px', height: '100%', display: 'flex', alignItems: 'center', fontSize: 18, fontWeight: 900, color: 'white', fontFamily: FONT_STACK.body, letterSpacing: 2, whiteSpace: 'nowrap' }}>BREAKING</div>
            <div style={{ fontSize: 20, color: 'white', fontWeight: 600, fontFamily: FONT_STACK.body, whiteSpace: 'nowrap', transform: `translateX(${1920 - frame * 2}px)` }}>{text}</div>
        </div>
    );
};

// ─── LIVE INDICATOR ──────────────────────
const LiveBadge: React.FC = () => {
    const frame = useCurrentFrame();
    const pulse = Math.sin(frame / 8) > 0;
    return (
        <div style={{ position: 'absolute', top: 40, right: 40, display: 'flex', alignItems: 'center', gap: 10, backgroundColor: 'rgba(0,0,0,0.6)', padding: '8px 20px', borderRadius: 8, zIndex: 10 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: pulse ? C.brightRed : '#660000', boxShadow: pulse ? '0 0 10px red' : 'none' }} />
            <span style={{ color: 'white', fontSize: 18, fontWeight: 900, fontFamily: FONT_STACK.body, letterSpacing: 3 }}>LIVE</span>
        </div>
    );
};

// ─── NUCLEAR SYMBOL SVG ──────────────────────
const NuclearSVG: React.FC<{ size?: number }> = ({ size = 300 }) => {
    const frame = useCurrentFrame();
    const rot = frame * 0.5;
    const p = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: `rotate(${rot}deg)` }}>
            <circle cx="50" cy="50" r="8" fill={C.goldBright} opacity={p} />
            {[0, 120, 240].map((a, i) => <path key={i} d={`M 50 50 L ${50 + 40 * Math.cos((a - 30) * Math.PI / 180)} ${50 + 40 * Math.sin((a - 30) * Math.PI / 180)} A 40 40 0 0 1 ${50 + 40 * Math.cos((a + 30) * Math.PI / 180)} ${50 + 40 * Math.sin((a + 30) * Math.PI / 180)} Z`} fill={C.goldBright} opacity={p * 0.9} />)}
            <circle cx="50" cy="50" r="40" fill="none" stroke={C.goldBright} strokeWidth="3" opacity={p * 0.4} />
        </svg>
    );
};

// ─── CENTRIFUGE ANIMATION ──────────────────────
const Centrifuge: React.FC<{ enrichment: number; label: string; bg: string }> = ({ enrichment, label, bg }) => {
    const frame = useCurrentFrame();
    const spin = frame * 6;
    const fillH = interpolate(frame, [0, 60], [0, enrichment], { extrapolateRight: 'clamp' });
    return (
        <Cen style={{ backgroundColor: bg }}><Grid />
            <div style={{ display: 'flex', gap: 80, alignItems: 'center' }}>
                <svg width={250} height={350} viewBox="0 0 100 140">
                    {/* Centrifuge body */}
                    <rect x="25" y="10" width="50" height="120" rx="8" fill="none" stroke={C.gray} strokeWidth="2" />
                    <rect x="30" y="15" width="40" height="110" rx="5" fill="rgba(255,255,255,0.05)" />
                    {/* Spinning rotor */}
                    <line x1="50" y1="40" x2={50 + 20 * Math.cos(spin * Math.PI / 180)} y2={40 + 20 * Math.sin(spin * Math.PI / 180)} stroke={C.goldBright} strokeWidth="2" strokeLinecap="round" />
                    <line x1="50" y1="40" x2={50 - 20 * Math.cos(spin * Math.PI / 180)} y2={40 - 20 * Math.sin(spin * Math.PI / 180)} stroke={C.goldBright} strokeWidth="2" strokeLinecap="round" />
                    <circle cx="50" cy="40" r="4" fill={C.goldBright} />
                    {/* Fill level */}
                    <rect x="32" y={125 - fillH} width="36" height={fillH} fill={enrichment > 50 ? C.brightRed : C.goldBright} opacity={0.6} rx="3" />
                    {/* Glow */}
                    <circle cx="50" cy="40" r="25" fill="none" stroke={C.goldBright} strokeWidth="1" opacity={0.2 + Math.sin(frame / 10) * 0.1} />
                </svg>
                <div>
                    <div style={{ fontSize: 200, fontFamily: FONT_STACK.display, fontWeight: 900, color: enrichment > 50 ? C.brightRed : C.goldBright }}>{Math.round(fillH)}%</div>
                    <div style={{ fontSize: 40, fontFamily: FONT_STACK.body, fontWeight: 700, color: C.gray }}>{label}</div>
                </div>
            </div>
        </Cen>
    );
};

// ─── EXPLOSION PARTICLES ──────────────────────
const ExplosionScene: React.FC<{ title: string; bg: string }> = ({ title, bg }) => {
    const frame = useCurrentFrame();
    const particles = Array.from({ length: 30 }, (_, i) => ({
        x: 960 + Math.cos(i * 0.7 + frame * 0.1) * interpolate(frame, [0, 60], [0, 600 + i * 20], { extrapolateRight: 'clamp' }),
        y: 540 + Math.sin(i * 1.1 + frame * 0.1) * interpolate(frame, [0, 60], [0, 400 + i * 15], { extrapolateRight: 'clamp' }),
        size: interpolate(frame, [0, 20, 60], [0, 15 + i % 10, 3], { extrapolateRight: 'clamp' }),
        opacity: interpolate(frame, [0, 10, 60], [0, 1, 0], { extrapolateRight: 'clamp' }),
        color: i % 3 === 0 ? C.brightRed : i % 3 === 1 ? C.orange : C.goldBright,
    }));
    const shockwave = interpolate(frame, [0, 40], [0, 800], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
    return (
        <Cen style={{ backgroundColor: bg }}><Grid />
            {/* Shockwave ring */}
            <div style={{ position: 'absolute', width: shockwave, height: shockwave, borderRadius: '50%', border: `3px solid rgba(255,100,0,${interpolate(frame, [0, 40], [0.6, 0], { extrapolateRight: 'clamp' })})`, boxShadow: `0 0 60px rgba(255,100,0,${interpolate(frame, [0, 40], [0.3, 0], { extrapolateRight: 'clamp' })})` }} />
            {/* Particles */}
            {particles.map((p, i) => <div key={i} style={{ position: 'absolute', left: p.x, top: p.y, width: p.size, height: p.size, borderRadius: '50%', backgroundColor: p.color, opacity: p.opacity, boxShadow: `0 0 10px ${p.color}` }} />)}
            {/* Title */}
            <div style={{ fontSize: 180, fontFamily: FONT_STACK.display, fontWeight: 900, color: C.white, textShadow: '0 0 40px rgba(255,0,0,0.5)', zIndex: 2, transform: `scale(${interpolate(frame, [0, 15], [0.3, 1], { extrapolateRight: 'clamp' })})` }}>{title}</div>
        </Cen>
    );
};

// ─── COUNTDOWN CLOCK ──────────────────────
const CountdownClock: React.FC<{ weeks: number; label: string; bg: string }> = ({ weeks, label, bg }) => {
    const frame = useCurrentFrame();
    const p = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: 'clamp' });
    const circ = 2 * Math.PI * 70;
    const tick = Math.sin(frame / 4) > 0;
    return (
        <Cen style={{ backgroundColor: bg }}><Grid />
            <svg width={400} height={400} viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                <circle cx="100" cy="100" r="70" fill="none" stroke={C.brightRed} strokeWidth="8" strokeDasharray={circ} strokeDashoffset={circ * (1 - p)} strokeLinecap="round" transform="rotate(-90 100 100)" />
                {/* Tick marks */}
                {Array.from({ length: 12 }, (_, i) => {
                    const a = (i * 30 - 90) * Math.PI / 180; return <line key={i} x1={100 + 65 * Math.cos(a)} y1={100 + 65 * Math.sin(a)} x2={100 + 75 * Math.cos(a)} y2={100 + 75 * Math.sin(a)} stroke="rgba(255,255,255,0.3)" strokeWidth="2" />;
                })}
                {/* Clock hand */}
                <line x1="100" y1="100" x2={100 + 55 * Math.cos((p * 360 - 90) * Math.PI / 180)} y2={100 + 55 * Math.sin((p * 360 - 90) * Math.PI / 180)} stroke={C.brightRed} strokeWidth="3" strokeLinecap="round" />
                <circle cx="100" cy="100" r="5" fill={C.brightRed} />
                <text x="100" y="145" textAnchor="middle" fill={C.white} fontSize="36" fontWeight="900" fontFamily={FONT_STACK.display}>{weeks} WEEKS</text>
            </svg>
            <div style={{ fontSize: 55, fontFamily: FONT_STACK.body, fontWeight: 800, color: tick ? C.brightRed : C.gray, marginTop: 30 }}>{label}</div>
        </Cen>
    );
};

// ─── HEADLINE MOCKUP ──────────────────────
const HeadlineMockup: React.FC<{ source: string; headline: string; detail: string; bg: string; accent: string }> = ({ source, headline, detail, bg, accent }) => {
    const frame = useCurrentFrame();
    const a = spring({ frame, fps: 30 });
    return (
        <Cen style={{ backgroundColor: bg }}><Grid />
            <div style={{ width: 1300, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', transform: `scale(${interpolate(a, [0, 1], [0.85, 1])})`, opacity: a, boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
                <div style={{ backgroundColor: accent, padding: '15px 40px', display: 'flex', alignItems: 'center', gap: 15 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: 'white' }} />
                    <span style={{ fontSize: 22, fontWeight: 900, color: 'white', fontFamily: FONT_STACK.body, letterSpacing: 3 }}>{source}</span>
                </div>
                <div style={{ padding: '50px 60px' }}>
                    <div style={{ fontSize: 65, fontWeight: 900, color: C.white, fontFamily: FONT_STACK.display, lineHeight: 1.1, marginBottom: 25 }}>{headline}</div>
                    <div style={{ fontSize: 26, color: C.gray, fontWeight: 500, fontFamily: FONT_STACK.body, lineHeight: 1.5 }}>{detail}</div>
                </div>
            </div>
        </Cen>
    );
};

// ─── BAR CHART / DONUT / COUNTER / SPLIT / TIMELINE (reused from V1 but compact) ──────
const Bar: React.FC<{ data: { l: string; v: number; c: string }[]; title: string; bg: string }> = ({ data, title, bg }) => {
    const frame = useCurrentFrame(); const mx = Math.max(...data.map(d => d.v));
    return (<Cen style={{ backgroundColor: bg }}><Grid /><div style={{ width: '85%', maxWidth: 1600 }}>
        <div style={{ fontSize: 60, fontFamily: FONT_STACK.display, fontWeight: 900, color: C.white, marginBottom: 45, textAlign: 'center' }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 22, height: 400, borderLeft: '3px solid rgba(255,255,255,0.12)', borderBottom: '3px solid rgba(255,255,255,0.12)', padding: '0 12px' }}>
            {data.map((d, i) => {
                const h = spring({ frame: frame - i * 8, fps: 30 }); return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <div style={{ fontSize: 26, fontWeight: 900, color: C.white, opacity: h }}>{d.v}%</div>
                        <div style={{ width: '100%', height: (d.v / mx) * 360 * h, background: `linear-gradient(180deg,${d.c},${d.c}88)`, borderRadius: '8px 8px 0 0', boxShadow: `0 0 20px ${d.c}44` }} />
                        <div style={{ fontSize: 18, fontWeight: 700, color: C.gray, textAlign: 'center', marginTop: 4 }}>{d.l}</div>
                    </div>);
            })}
        </div></div></Cen>);
};
const Donut: React.FC<{ value: number; label: string; color: string; bg: string }> = ({ value, label, color, bg }) => {
    const frame = useCurrentFrame(); const p = interpolate(frame, [0, 60], [0, value / 100], { extrapolateRight: 'clamp' }); const c = 2 * Math.PI * 80;
    return (<Cen style={{ backgroundColor: bg }}><Grid />
        <svg width={420} height={420} viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="16" />
            <circle cx="100" cy="100" r="80" fill="none" stroke={color} strokeWidth="16" strokeDasharray={c} strokeDashoffset={c * (1 - p)} strokeLinecap="round" transform="rotate(-90 100 100)" />
            <text x="100" y="90" textAnchor="middle" fill={C.white} fontSize="44" fontWeight="900" fontFamily={FONT_STACK.display}>{Math.round(p * 100)}%</text>
            <text x="100" y="116" textAnchor="middle" fill={C.gray} fontSize="12" fontWeight="700">{label}</text>
        </svg></Cen>);
};
const Counter: React.FC<{ value: number; suffix: string; label: string; bg: string; color: string }> = ({ value, suffix, label, bg, color }) => {
    const frame = useCurrentFrame(); const n = Math.round(interpolate(frame, [0, 50], [0, value], { extrapolateRight: 'clamp' }));
    return (<Cen style={{ backgroundColor: bg }}><Grid />
        <div style={{ fontSize: 300, fontFamily: FONT_STACK.display, fontWeight: 900, color }}>{n}{suffix}</div>
        <div style={{ fontSize: 50, fontFamily: FONT_STACK.body, fontWeight: 700, color: C.gray, marginTop: 10 }}>{label}</div>
    </Cen>);
};
const Split: React.FC<{ lL: string; rL: string; lI: string; rI: string; lC: string; rC: string; lS?: string; rS?: string }> = ({ lL, rL, lI, rI, lC, rC, lS, rS }) => {
    const frame = useCurrentFrame(); const s = spring({ frame, fps: 30 });
    return (<AbsoluteFill style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: interpolate(s, [0, 1], [0, 1]), backgroundColor: lC, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderRight: '6px solid black' }}>
            <div style={{ fontSize: 140 }}>{lI}</div><div style={{ fontSize: 55, fontFamily: FONT_STACK.display, fontWeight: 900, color: C.white, marginTop: 12 }}>{lL}</div>
            {lS && <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.7)', marginTop: 8, fontWeight: 600, textAlign: 'center', maxWidth: 300 }}>{lS}</div>}
        </div>
        <div style={{ flex: interpolate(s, [0, 1], [0, 1]), backgroundColor: rC, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
            <div style={{ fontSize: 140 }}>{rI}</div><div style={{ fontSize: 55, fontFamily: FONT_STACK.display, fontWeight: 900, color: C.white, marginTop: 12 }}>{rL}</div>
            {rS && <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.7)', marginTop: 8, fontWeight: 600, textAlign: 'center', maxWidth: 300 }}>{rS}</div>}
        </div>
    </AbsoluteFill>);
};
const TL: React.FC<{ events: { year: string; text: string; color: string }[]; bg: string }> = ({ events, bg }) => {
    const frame = useCurrentFrame();
    return (<Cen style={{ backgroundColor: bg }}><Grid /><div style={{ width: 1400, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 95, left: 0, right: 0, height: 4, backgroundColor: 'rgba(255,255,255,0.12)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {events.map((e, i) => {
                const a = spring({ frame: frame - i * 10, fps: 30 }); return (
                    <div key={i} style={{ textAlign: 'center', transform: `scale(${a})`, opacity: a, width: 180 }}>
                        <div style={{ fontSize: 36, fontWeight: 900, color: e.color, fontFamily: FONT_STACK.display }}>{e.year}</div>
                        <div style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: e.color, margin: '12px auto', boxShadow: `0 0 18px ${e.color}` }} />
                        <div style={{ fontSize: 16, color: C.white, fontWeight: 600, lineHeight: 1.3 }}>{e.text}</div>
                    </div>);
            })}
        </div></div></Cen>);
};
const MapDot: React.FC<{ label: string; color: string; delay: number }> = ({ label, color, delay }) => {
    const frame = useCurrentFrame(); const a = spring({ frame: frame - delay, fps: 30 }); const p = Math.sin(frame / 8) * 3;
    return (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${a})`, opacity: a }}>
        <div style={{ width: 28 + p, height: 28 + p, borderRadius: '50%', backgroundColor: color, boxShadow: `0 0 25px ${color},0 0 50px ${color}44` }} />
        <div style={{ fontSize: 20, fontWeight: 800, color: C.white, marginTop: 10 }}>{label}</div>
    </div>);
};
const BigT: React.FC<{ text: string; color?: string; bg: string; sub?: string; font?: string }> = ({ text, color = C.white, bg, sub, font }) => {
    const frame = useCurrentFrame(); const a = spring({ frame, fps: 30, config: { damping: 12 } });
    return (<Grad from={bg} to={bg + 'cc'}><Cen>
        <div style={{ fontSize: 210, fontWeight: 900, fontFamily: font || FONT_STACK.display, color, textAlign: 'center', lineHeight: 0.85, transform: `scale(${interpolate(a, [0, 1], [0.4, 1])})`, opacity: a, textShadow: '10px 10px 0 rgba(0,0,0,0.3)' }}>{text}</div>
        {sub && <div style={{ position: 'absolute', bottom: '12%', fontSize: 48, fontWeight: 800, fontFamily: FONT_STACK.body, color: C.gray, backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px 35px', borderRadius: 12, backdropFilter: 'blur(10px)', transform: `translateY(${interpolate(a, [0, 1], [40, 0])}px)`, opacity: a }}>{sub}</div>}
    </Cen></Grad>);
};

// ═══ MAIN COMPOSITION ═══
export const IranNuclearTalks: React.FC = () => (
    <AbsoluteFill style={{ backgroundColor: C.navy, fontFamily: FONT_STACK.body }}>
        <style>{FONT_IMPORT}</style>
        <CameraWrapper>
            <FilmGrain />
            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.04} />

            {/* INTRO */}
            <Sequence durationInFrames={INTRO}>
                <BeatManager frame={useCurrentFrame()} />
                <Grad from={C.darkRed} to={C.navy}><Cen><NuclearSVG size={400} /><div style={{ position: 'absolute', bottom: '18%', fontSize: 180, fontFamily: FONT_STACK.display, color: C.gold, textShadow: '8px 8px 0 rgba(0,0,0,0.4)' }}>NUCLEAR TALKS</div></Cen></Grad>
                <Audio src={staticFile("sfx/rise.mp3")} volume={0.5} />
            </Sequence>

            {/* S1: HOOK */}
            <Sequence from={F1} durationInFrames={S1}>
                <BeatManager frame={useCurrentFrame()} />
                <Flash frame={useCurrentFrame()} />
                <Sequence durationInFrames={72}><BigT text="THE MOST DANGEROUS DEAL" bg={C.navy} color={C.brightRed} font={getFontForScene(0)} sub="USA vs IRAN" /></Sequence>
                <Sequence from={72} durationInFrames={72}><BigT text="NUCLEAR STANDOFF" bg={C.darkRed} color={C.white} font={getFontForScene(1)} sub="NO ROOM FOR ERROR" /></Sequence>
                <Sequence from={144} durationInFrames={72}><Split lL="UNITED STATES" rL="IRAN" lI="🇺🇸" rI="🇮🇷" lC={C.blue} rC={C.darkRed} lS="Maximum Pressure" rS="60% Enrichment" /><Audio src={staticFile("sfx/whoosh.mp3")} /></Sequence>
                <Sequence from={216} durationInFrames={72}><StickFigureScene figures={[{ emotion: 'angry', label: 'USA', color: C.blueLight }, { emotion: 'angry', label: 'IRAN', color: C.brightRed }]} bgColor={C.navy} title="HIGH TENSION" /></Sequence>
                <Sequence from={288} durationInFrames={72}><HeadlineMockup source="BREAKING NEWS" headline="US-IRAN TENSIONS AT BOILING POINT" detail="Nuclear talks reach critical phase" bg={C.navy} accent={C.brightRed} /></Sequence>
                <Sequence from={360} durationInFrames={57}><BigT text="WAR OR PEACE?" bg={C.black} color={C.goldBright} font={FONT_STACK.impact} sub="GENEVA SUMMIT 2026" /></Sequence>
                <NewsTicker text="    ⚡ BREAKING: USA and Iran locked in critical nuclear negotiations — One wrong move could trigger new arms race or war    ⚡    " /><LiveBadge />
                <Audio src={staticFile("iran_1.wav")} />
            </Sequence>

            {/* S2: JCPOA */}
            <Sequence from={F2} durationInFrames={S2}>
                <BeatManager frame={useCurrentFrame()} />
                <Flash frame={useCurrentFrame()} />
                <Sequence durationInFrames={106}><BigT text="THE DEAL" bg={C.navy} color={C.gold} font={getFontForScene(1)} sub="JCPOA — 2015" /></Sequence>
                <Sequence from={106} durationInFrames={106}><TL bg={C.navy} events={[{ year: '2015', text: 'JCPOA Signed', color: C.greenBright }, { year: '2016', text: 'Sanctions Lifted', color: C.blueLight }, { year: '2017', text: 'Iran Compliant', color: C.greenBright }, { year: '2018', text: 'US EXITS', color: C.brightRed }]} /><Audio src={staticFile("sfx/pop.mp3")} /></Sequence>
                <Sequence from={212} durationInFrames={106}><Centrifuge enrichment={3.67} label="LIMIT: 3.67%" bg={C.navy} /></Sequence>
                <Sequence from={318} durationInFrames={108}><Split lL="LIFTED" rL="SANCTIONS" lI="💰" rI="🚢" lC={C.green} rC={C.blue} lS="Trade resumed" rS="Assets unfrozen" /></Sequence>
                <NewsTicker text="    📰 2015: Historic nuclear deal signed between Iran and world powers — Enrichment capped at 3.67%    " /><Audio src={staticFile("iran_2.wav")} />
            </Sequence>

            {/* S3: MAXIMUM PRESSURE */}
            <Sequence from={F3} durationInFrames={S3}>
                <BeatManager frame={useCurrentFrame()} />
                <Flash frame={useCurrentFrame()} />
                <Sequence durationInFrames={90}><BigT text="MAXIMUM PRESSURE" bg={C.darkRed} font={getFontForScene(2)} sub="TRUMP PULLS OUT — 2018" /><Audio src={staticFile("sfx/whoosh.mp3")} /></Sequence>
                <Sequence from={90} durationInFrames={90}><Centrifuge enrichment={60} label="RESPONSE: 60%" bg={C.navy} /></Sequence>
                <Sequence from={180} durationInFrames={90}><Bar title="ENRICHMENT ESCALATION" bg={C.navy} data={[{ l: 'JCPOA', v: 4, c: C.greenBright }, { l: '2019', v: 20, c: C.goldBright }, { l: '2021', v: 40, c: C.orange }, { l: '2024', v: 60, c: C.brightRed }, { l: 'Weapon', v: 90, c: '#FF0000' }]} /></Sequence>
                <Sequence from={270} durationInFrames={90}><Counter value={80} suffix="%" label="ECONOMY COLLAPSE" bg={C.black} color={C.brightRed} /></Sequence>
                <Sequence from={360} durationInFrames={90}><Cen style={{ backgroundColor: C.navy }}><Grid /><Callout type="danger" title="Currency -80%" body="Iran's Rial lost 80% value under maximum pressure." /></Cen></Sequence>
                <Sequence from={450} durationInFrames={103}><BigT text="60% ENRICHED" bg={C.brightRed} font={getFontForScene(3)} sub="ONE STEP FROM WEAPONS GRADE" /></Sequence>
                <NewsTicker text="    ⚠️ Iran begins enriching uranium to 60% — just a short technical step from weapons-grade 90%    " /><Audio src={staticFile("iran_3.wav")} />
            </Sequence>

            {/* S4: TERRIFYING NUMBERS */}
            <Sequence from={F4} durationInFrames={S4}>
                <BeatManager frame={useCurrentFrame()} />
                <Flash frame={useCurrentFrame()} />
                <Sequence durationInFrames={72}><Counter value={440} suffix="KG" label="URANIUM AT 60% PURITY" bg={C.navy} color={C.goldBright} /><Audio src={staticFile("sfx/rise.mp3")} volume={0.3} /></Sequence>
                <Sequence from={72} durationInFrames={72}><Counter value={10} suffix="" label="POTENTIAL NUCLEAR BOMBS" bg={C.darkRed} color={C.white} /></Sequence>
                <Sequence from={144} durationInFrames={72}><CountdownClock weeks={2} label="BREAKOUT TIME" bg={C.navy} /><Audio src={staticFile("sfx/clock.mp3")} /></Sequence>
                <Sequence from={216} durationInFrames={72}><Counter value={90} suffix="%" label="WEAPONS GRADE PATH" bg={C.black} color={C.brightRed} /></Sequence>
                <Sequence from={288} durationInFrames={72}><Cen style={{ backgroundColor: C.navy }}><Grid /><Callout type="warning" title="Breakout Time: 1-2 Weeks" body="Iran could enrich to weapons-grade in weeks." /></Cen></Sequence>
                <Sequence from={360} durationInFrames={72}><BigT text="POINT OF NO RETURN" bg={C.darkRed} color={C.goldBright} font={FONT_STACK.display} sub="INTELLIGENCE WARNING" /></Sequence>
                <Sequence from={432} durationInFrames={74}><StickFigureScene figures={[{ emotion: 'surprised', label: 'WORLD', color: C.white }, { emotion: 'angry', label: 'ISRAEL', color: C.blueLight }]} bgColor={C.navy} title="GLOBAL ALARM" /></Sequence>
                <NewsTicker text="    🔴 IAEA: Iran has 440kg of 60% enriched uranium — enough for 10 nuclear weapons    " /><LiveBadge /><Audio src={staticFile("iran_4.wav")} />
            </Sequence>

            {/* S5: JUNE 2025 */}
            <Sequence from={F5} durationInFrames={S5}>
                <Sequence durationInFrames={110}><BigT text="JUNE 2025" bg={C.black} color={C.brightRed} font={getFontForScene(4)} sub="EVERYTHING ESCALATES" /><Audio src={staticFile("sfx/whoosh.mp3")} /></Sequence>
                <Sequence from={110} durationInFrames={111}><ExplosionScene title="STRIKES" bg={C.navy} /></Sequence>
                <Sequence from={221} durationInFrames={111}><Cen style={{ backgroundColor: C.navy }}><Grid /><div style={{ display: 'flex', gap: 80 }}>{['ESFAHAN', 'FORDOW', 'NATANZ'].map((s, i) => <MapDot key={i} label={s} color={C.brightRed} delay={i * 12} />)}</div><div style={{ position: 'absolute', bottom: '15%', fontSize: 48, fontFamily: FONT_STACK.display, color: C.white }}>ISRAELI STRIKES ON NUCLEAR SITES</div></Cen></Sequence>
                <Sequence from={332} durationInFrames={111}><HeadlineMockup source="IAEA" headline="IRAN DECLARED IN BREACH" detail="June 12, 2025 — IAEA declares Iran in breach of non-proliferation obligations. Israel and US launch coordinated strikes." bg={C.navy} accent={C.brightRed} /></Sequence>
                <Sequence from={443} durationInFrames={111}><BigT text="TALKS SUSPENDED" bg={C.darkRed} font={getFontForScene(5)} sub="IRAN SUSPENDS NEGOTIATIONS INDEFINITELY" /></Sequence>
                <NewsTicker text="    💥 BREAKING: Israel launches massive airstrikes on Iranian nuclear facilities — US participates — Iran suspends talks    " /><LiveBadge /><Audio src={staticFile("iran_5.wav")} />
            </Sequence>

            {/* S6: TALKS RESUME 2026 */}
            <Sequence from={F6} durationInFrames={S6}>
                <Sequence durationInFrames={131}><BigT text="FEB 2026" bg={C.navy} color={C.teal} font={getFontForScene(6)} sub="TALKS RESUME IN GENEVA" /><Audio src={staticFile("sfx/typing.mp3")} /></Sequence>
                <Sequence from={131} durationInFrames={131}><Cen style={{ backgroundColor: C.navy }}><Grid /><div style={{ display: 'flex', gap: 80 }}>{[{ l: 'GENEVA', c: C.teal }, { l: 'OMAN', c: C.goldBright }, { l: 'VIENNA', c: C.purple }].map((loc, i) => <MapDot key={i} label={loc.l} color={loc.c} delay={i * 12} />)}</div><div style={{ position: 'absolute', bottom: '15%', fontSize: 42, fontFamily: FONT_STACK.display, color: C.white }}>NEGOTIATION LOCATIONS</div></Cen></Sequence>
                <Sequence from={262} durationInFrames={130}><StickFigureScene figures={[{ emotion: 'thinking', label: 'WITKOFF', color: C.blueLight }, { emotion: 'thinking', label: 'ARAGHCHI', color: C.goldBright }]} bgColor={C.navy} title="KEY NEGOTIATORS" /></Sequence>
                <Sequence from={392} durationInFrames={131}><HeadlineMockup source="THE GUARDIAN" headline="PROTESTS FORCE IRAN BACK TO TABLE" detail="Large-scale protests demanding economic relief push Iran's government back to nuclear negotiations in early 2026." bg={C.navy} accent={C.teal} /></Sequence>
                <Audio src={staticFile("iran_6.wav")} />
            </Sequence>

            {/* S7: THE DEMANDS */}
            <Sequence from={F7} durationInFrames={S7}>
                <Sequence durationInFrames={127}><BigT text="THE GAP" bg={C.navy} color={C.goldBright} font={getFontForScene(7)} sub="WHERE THEY DISAGREE" /></Sequence>
                <Sequence from={127} durationInFrames={127}><Split lL="US DEMANDS" rL="IRAN REFUSES" lI="🇺🇸" rI="🇮🇷" lC={C.blue} rC={C.darkRed} lS="Destroy sites • Ship uranium • Full ban" rS="Sovereign right • Keep facilities" /><Audio src={staticFile("sfx/pop.mp3")} /></Sequence>
                <Sequence from={254} durationInFrames={127}><Bar title="US DEMANDS vs IRAN POSITION" bg={C.navy} data={[{ l: 'Dismantle', v: 100, c: C.blueLight }, { l: 'Ship U235', v: 100, c: C.blueLight }, { l: 'Iran Accepts', v: 5, c: C.brightRed }, { l: 'Agreement', v: 10, c: C.goldBright }]} /><Audio src={staticFile("sfx/whoosh.mp3")} /></Sequence>
                <Sequence from={381} durationInFrames={127}><Cen style={{ backgroundColor: C.navy }}><Grid /><Callout type="warning" title="No Sunset Clause" body="US demands a permanent ban. Iran rejected the JCPOA's original sunset and now faces even harsher terms. Source: Washington Post." /></Cen></Sequence>
                <Sequence from={508} durationInFrames={126}><StickFigureScene figures={[{ emotion: 'angry', label: 'US', color: C.blueLight }, { emotion: 'angry', label: 'IRAN', color: C.brightRed }, { emotion: 'confused', label: 'EU', color: C.goldBright }]} bgColor={C.navy} title="DEADLOCKED" /></Sequence>
                <Audio src={staticFile("iran_7.wav")} />
            </Sequence>

            {/* S8: FEB 26 ROUND */}
            <Sequence from={F8} durationInFrames={S8}>
                <Sequence durationInFrames={166}><HeadlineMockup source="AP NEWS" headline="NO DEAL — FEB 26, 2026" detail="Latest round of US-Iran nuclear talks ends without agreement. Mediators claim 'significant progress' but US privately disappointed." bg={C.navy} accent={C.brightRed} /><Audio src={staticFile("sfx/whoosh.mp3")} /></Sequence>
                <Sequence from={166} durationInFrames={166}><Cen style={{ backgroundColor: C.navy }}><Grid /><Callout type="tip" title={'"Significant Progress"'} body="Omani mediators claim progress. More technical discussions planned for Vienna. But US envoys privately express disappointment with Iran's proposals." /></Cen></Sequence>
                <Sequence from={332} durationInFrames={166}><StickFigureScene figures={[{ emotion: 'sad', label: 'DIPLOMATS', color: C.gray }, { emotion: 'thinking', label: 'MEDIATORS', color: C.teal }]} bgColor={C.navy} title="THE GAP REMAINS" /><Audio src={staticFile("sfx/pop 2.mp3")} /></Sequence>
                <NewsTicker text="    📰 February 26, 2026: Nuclear talks end without breakthrough — More discussions planned in Vienna    " /><Audio src={staticFile("iran_8.wav")} />
            </Sequence>

            {/* S9: IAEA */}
            <Sequence from={F9} durationInFrames={S9}>
                <Sequence durationInFrames={128}><BigT text="RAFAEL GROSSI" bg={C.navy} color={C.teal} font={getFontForScene(1)} sub="IAEA DIRECTOR GENERAL" /></Sequence>
                <Sequence from={128} durationInFrames={128}><Cen style={{ backgroundColor: C.navy }}><Grid /><Callout type="info" title="The Verification Problem" body="Iran has restricted IAEA inspectors from accessing nuclear sites damaged in the 2025 strikes. Without full verification, no deal can work." /></Cen><Audio src={staticFile("sfx/typing.mp3")} /></Sequence>
                <Sequence from={256} durationInFrames={128}><Donut value={40} label="SITES ACCESSIBLE TO IAEA" color={C.brightRed} bg={C.navy} /></Sequence>
                <Sequence from={384} durationInFrames={128}><StickFigureScene figures={[{ emotion: 'thinking', label: 'GROSSI', color: C.teal }, { emotion: 'confused', label: 'INSPECTORS', color: C.goldBright }]} bgColor={C.navy} title="LIMITED ACCESS" /></Sequence>
                <Audio src={staticFile("iran_9.wav")} />
            </Sequence>

            {/* S10: THREE SCENARIOS */}
            <Sequence from={F10} durationInFrames={S10}>
                <Sequence durationInFrames={117}><BigT text="3 SCENARIOS" bg={C.navy} color={C.goldBright} font={getFontForScene(2)} sub="WHAT HAPPENS NEXT?" /><Audio src={staticFile("sfx/rise.mp3")} volume={0.4} /></Sequence>
                <Sequence from={117} durationInFrames={117}><Cen style={{ backgroundColor: C.navy }}><Grid /><Callout type="success" title="Scenario 1: Miracle Deal" body="Iran agrees to limits. Sanctions lifted. The world exhales. Probability: LOW." /></Cen></Sequence>
                <Sequence from={234} durationInFrames={118}><Cen style={{ backgroundColor: C.navy }}><Grid /><Callout type="danger" title="Scenario 2: Iran Goes Nuclear" body="Talks collapse. Iran enriches to 90%. New arms race: Saudi Arabia, Turkey, Egypt follow." /></Cen><Audio src={staticFile("sfx/whoosh.mp3")} /></Sequence>
                <Sequence from={352} durationInFrames={118}><ExplosionScene title="SCENARIO 3" bg={C.navy} /></Sequence>
                <Sequence from={470} durationInFrames={117}><Cen style={{ backgroundColor: C.navy }}><Grid /><Callout type="warning" title="Scenario 3: Military Action" body="Another wave of strikes. Full-scale war possible. Unprecedented escalation across the Middle East." /></Cen></Sequence>
                <Audio src={staticFile("iran_10.wav")} />
            </Sequence>

            {/* S11: SNAPBACK */}
            <Sequence from={F11} durationInFrames={S11}>
                <Sequence durationInFrames={134}><BigT text="SNAPBACK" bg={C.purple} font={getFontForScene(3)} sub="UN SANCTIONS REIMPOSED" /></Sequence>
                <Sequence from={134} durationInFrames={134}><Bar title="SECURITY COUNCIL SPLIT" bg={C.navy} data={[{ l: 'UK', v: 90, c: C.blueLight }, { l: 'France', v: 90, c: C.blueLight }, { l: 'Germany', v: 85, c: C.blueLight }, { l: 'Russia', v: 15, c: C.brightRed }, { l: 'China', v: 15, c: C.brightRed }]} /><Audio src={staticFile("sfx/pop.mp3")} /></Sequence>
                <Sequence from={268} durationInFrames={134}><Cen style={{ backgroundColor: C.navy }}><Grid /><Callout type="warning" title="Legal Dispute" body="Russia and China say the E3 snapback has no legal standing. International law itself is now part of the battlefield. Source: Opinio Juris." /></Cen></Sequence>
                <Sequence from={402} durationInFrames={133}><StickFigureScene figures={[{ emotion: 'happy', label: 'E3', color: C.blueLight }, { emotion: 'angry', label: 'RUSSIA', color: C.brightRed }, { emotion: 'angry', label: 'CHINA', color: C.brightRed }]} bgColor={C.navy} title="DIVIDED COUNCIL" /></Sequence>
                <Audio src={staticFile("iran_11.wav")} />
            </Sequence>

            {/* S12: IRANIAN PEOPLE */}
            <Sequence from={F12} durationInFrames={S12}>
                <Sequence durationInFrames={134}><BigT text="THE PEOPLE" bg={C.navy} color={C.goldBright} font={getFontForScene(4)} sub="CAUGHT IN THE MIDDLE" /><Audio src={staticFile("sfx/rise.mp3")} volume={0.3} /></Sequence>
                <Sequence from={134} durationInFrames={134}><StickFigureScene figures={[{ emotion: 'sad', label: 'HUNGER', color: C.brightRed }, { emotion: 'angry', label: 'PROTEST', color: C.goldBright }, { emotion: 'sad', label: 'POVERTY', color: C.orange }]} bgColor={C.navy} title="MILLIONS SUFFERING" /></Sequence>
                <Sequence from={268} durationInFrames={134}><Bar title="ECONOMIC COLLAPSE" bg={C.navy} data={[{ l: 'Currency -80%', v: 80, c: C.brightRed }, { l: 'Inflation', v: 70, c: C.orange }, { l: 'Poverty', v: 65, c: C.goldBright }, { l: 'Food Crisis', v: 55, c: C.brightRed }]} /><Audio src={staticFile("sfx/pop 2.mp3")} /></Sequence>
                <Sequence from={402} durationInFrames={134}><Cen style={{ backgroundColor: C.navy }}><Grid /><Callout type="quote" title={'"Pushed back to the table"'} body="Massive protests demanding economic relief forced Iran's government to resume nuclear negotiations in February 2026." /></Cen></Sequence>
                <Audio src={staticFile("iran_12.wav")} />
            </Sequence>

            {/* S13: US MILITARY */}
            <Sequence from={F13} durationInFrames={S13}>
                <Sequence durationInFrames={151}><BigT text="MILITARY OPTION" bg={C.blue} font={getFontForScene(5)} sub="IF DIPLOMACY FAILS" /><Audio src={staticFile("sfx/whoosh.mp3")} /></Sequence>
                <Sequence from={151} durationInFrames={151}><Bar title="US MILITARY ASSETS IN REGION" bg={C.navy} data={[{ l: 'Carriers', v: 85, c: C.blueLight }, { l: 'Bombers', v: 90, c: C.blueLight }, { l: 'Spec Ops', v: 75, c: C.teal }, { l: 'Drones', v: 95, c: C.blueLight }]} /></Sequence>
                <Sequence from={302} durationInFrames={151}><Counter value={50} suffix="" label="NUCLEAR TARGETS IDENTIFIED" bg={C.darkRed} color={C.white} /><Audio src={staticFile("sfx/rise.mp3")} volume={0.4} /></Sequence>
                <Sequence from={453} durationInFrames={151}><HeadlineMockup source="THE GUARDIAN" headline="PENTAGON PLANS READY" detail="Pentagon has reportedly drawn up precision strike plans for up to 50 Iranian nuclear targets." bg={C.navy} accent={C.blue} /></Sequence>
                <NewsTicker text="    ⚡ US maintains massive military presence in Middle East — Aircraft carriers, bomber squadrons, special forces positioned throughout region    " /><Audio src={staticFile("iran_13.wav")} />
            </Sequence>

            {/* S14: PROLIFERATION */}
            <Sequence from={F14} durationInFrames={S14}>
                <Sequence durationInFrames={170}><BigT text="ARMS RACE?" bg={C.navy} color={C.brightRed} font={getFontForScene(6)} sub="NUCLEAR PROLIFERATION CASCADE" /></Sequence>
                <Sequence from={170} durationInFrames={170}><Cen style={{ backgroundColor: C.navy }}><Grid /><Callout type="info" title="US Intel Assessment" body="Iran lacks a weaponization program. Building the bomb — trigger, delivery — would take at least 1 year. Source: Defense Priorities." /></Cen><Audio src={staticFile("sfx/typing.mp3")} /></Sequence>
                <Sequence from={340} durationInFrames={170}><Cen style={{ backgroundColor: C.navy }}><Grid /><div style={{ display: 'flex', gap: 60 }}>{[{ l: 'SAUDI', c: C.greenBright }, { l: 'TURKEY', c: C.brightRed }, { l: 'EGYPT', c: C.goldBright }, { l: 'UAE', c: C.blueLight }].map((c, i) => <MapDot key={i} label={c.l} color={c.c} delay={i * 12} />)}</div><div style={{ position: 'absolute', bottom: '15%', fontSize: 42, fontFamily: FONT_STACK.display, color: C.white }}>NATIONS THAT WOULD GO NUCLEAR</div></Cen><Audio src={staticFile("sfx/whoosh.mp3")} /></Sequence>
                <Sequence from={510} durationInFrames={170}><StickFigureScene figures={[{ emotion: 'excited', label: 'IRAN', color: C.brightRed }, { emotion: 'surprised', label: 'SAUDI', color: C.greenBright }, { emotion: 'surprised', label: 'TURKEY', color: C.orange }, { emotion: 'surprised', label: 'EGYPT', color: C.goldBright }]} bgColor={C.navy} title="DOMINO EFFECT" /></Sequence>
                <Sequence from={680} durationInFrames={171}><Donut value={90} label="ENRICHMENT CAPABILITY" color={C.brightRed} bg={C.navy} /><Audio src={staticFile("sfx/clock.mp3")} /></Sequence>
                <Audio src={staticFile("iran_14.wav")} />
            </Sequence>

            {/* S15: ICBM & FINALE */}
            <Sequence from={F15} durationInFrames={S15}>
                <Sequence durationInFrames={145}><BigT text="ICBM BY 2035" bg={C.darkRed} color={C.goldBright} font={getFontForScene(7)} sub="DIA ASSESSMENT" /><Audio src={staticFile("sfx/rise.mp3")} volume={0.5} /></Sequence>
                <Sequence from={145} durationInFrames={145}><HeadlineMockup source="DEFENSE INTELLIGENCE" headline="IRAN ICBM CAPABLE BY 2035" detail="DIA assessed Iran could develop an intercontinental ballistic missile by 2035 — capable of reaching American cities." bg={C.navy} accent={C.brightRed} /></Sequence>
                <Sequence from={290} durationInFrames={145}><TL bg={C.navy} events={[{ year: '2026', text: 'Current Talks', color: C.teal }, { year: '2028', text: 'Bomb Capable?', color: C.goldBright }, { year: '2030', text: 'IRBM Range', color: C.orange }, { year: '2035', text: 'ICBM', color: C.brightRed }]} /><Audio src={staticFile("sfx/whoosh.mp3")} /></Sequence>
                <Sequence from={435} durationInFrames={145}><Cen style={{ backgroundColor: C.navy }}><Grid /><Callout type="danger" title="Missiles & Proxies Off The Table" body="Iran refuses to negotiate on ballistic missiles or support for Hezbollah/Hamas. US sees threats. Iran calls them defensive." /></Cen></Sequence>
                <Sequence from={580} durationInFrames={144}><BigT text="THE CLOCK IS TICKING" bg={C.darkRed} color={C.gold} font={getFontForScene(0)} sub="THE WORLD IS WATCHING" /></Sequence>
                <Sequence from={724} durationInFrames={144}><Grad from={C.navy} to={C.darkRed}><Cen><NuclearSVG size={450} /><div style={{ position: 'absolute', bottom: '18%', fontSize: 60, fontFamily: FONT_STACK.display, color: C.gold }}>SUBSCRIBE FOR UPDATES</div></Cen></Grad><Audio src={staticFile("sfx/rise.mp3")} volume={0.3} /></Sequence>
                <NewsTicker text="    ⚡ This is the most consequential negotiation of our lifetime — Subscribe for the latest developments    " /><Audio src={staticFile("iran_15.wav")} />
            </Sequence>
        </CameraWrapper>
    </AbsoluteFill>
);
