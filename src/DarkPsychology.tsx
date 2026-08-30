import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Audio, staticFile, Sequence } from 'remotion';
import { FONT_IMPORT, FONT_STACK } from './components/PremiumKit';

// ─── VISUAL DNA: DARK PSYCHOLOGY / SELF-IMPROVEMENT ──────────
const C = {
    deepViolet: '#1a0a2e', violet: '#4C1D95', purple: '#7C3AED',
    gold: '#D4AF37', goldBright: '#FBBF24', amber: '#F59E0B',
    black: '#050508', darkGray: '#111118',
    white: '#F1F5F9', gray: '#94A3B8', grayDark: '#475569',
    red: '#DC2626', green: '#10B981', teal: '#14B8A6',
    crimson: '#991B1B',
};

// Single VO: 355.65s = 10670 frames. +75 intro = 10745 total
const S1 = 979, S2 = 1175, S3 = 1137, S4 = 1205, S5 = 1208, S6 = 1168, S7 = 1233, S8 = 1298, S9 = 1192;
const INTRO = 75;
const F1 = INTRO, F2 = F1 + S1, F3 = F2 + S2, F4 = F3 + S3, F5 = F4 + S4, F6 = F5 + S5, F7 = F6 + S6, F8 = F7 + S7, F9 = F8 + S8;

// ─── BRAIN SVG ──────────
const BrainPulse: React.FC<{ size?: number }> = ({ size = 500 }) => {
    const f = useCurrentFrame();
    const nodes = [[25, 20], [50, 15], [75, 20], [15, 40], [40, 35], [60, 35], [85, 40], [20, 60], [50, 55], [80, 60], [35, 80], [50, 75], [65, 80]];
    const edges = [[0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5], [5, 6], [3, 7], [4, 8], [5, 9], [7, 8], [8, 9], [7, 10], [8, 11], [9, 12], [10, 11], [11, 12]];
    return (
        <svg width={size} height={size} viewBox="0 0 100 100">
            {edges.map(([a, b], i) => {
                const pulse = 0.3 + 0.7 * Math.abs(Math.sin(f / 20 + i * 0.5));
                return <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={C.purple} strokeWidth="0.8" opacity={pulse} />;
            })}
            {nodes.map(([x, y], i) => {
                const s = 1.5 + Math.sin(f / 10 + i) * 0.8;
                const glow = Math.sin(f / 8 + i * 0.7) > 0.3;
                return <circle key={i} cx={x} cy={y} r={s} fill={glow ? C.goldBright : C.purple} opacity={0.6 + 0.4 * Math.sin(f / 12 + i)} />;
            })}
        </svg>
    );
};

// ─── TRICK CARD ──────────
const TrickCard: React.FC<{ num: number; title: string; icon: string; sub?: string }> = ({ num, title, icon, sub }) => {
    const f = useCurrentFrame();
    const a = spring({ frame: f, fps: 30, config: { damping: 14 } });
    return (
        <AbsoluteFill style={{ background: `linear-gradient(160deg,${C.deepViolet},${C.black})` }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 30% 50%, rgba(124,58,237,0.08) 0%, transparent 70%)' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 140px' }}>
                <div style={{ fontSize: 400, fontWeight: 900, fontFamily: FONT_STACK.display, color: `${C.purple}22`, lineHeight: 0.8, marginRight: 60, transform: `scale(${interpolate(a, [0, 1], [0.5, 1])})`, opacity: a }}>{num}</div>
                <div style={{ flex: 1, transform: `translateX(${interpolate(a, [0, 1], [80, 0])}px)`, opacity: a }}>
                    <div style={{ fontSize: 30, fontWeight: 800, color: C.gold, letterSpacing: 6, marginBottom: 15 }}>TRICK #{num}</div>
                    <div style={{ fontSize: 90, fontWeight: 900, fontFamily: FONT_STACK.display, color: C.white, lineHeight: 1 }}>{title}</div>
                    {sub && <div style={{ fontSize: 28, color: C.gray, marginTop: 20, fontWeight: 500 }}>{sub}</div>}
                    <div style={{ fontSize: 80, marginTop: 30 }}>{icon}</div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── POWER QUOTE ──────────
const PQ: React.FC<{ quote: string; highlight?: string; bg?: string }> = ({ quote, highlight, bg = C.black }) => {
    const f = useCurrentFrame();
    const words = quote.split(' ');
    const vis = Math.floor(interpolate(f, [0, 70], [0, words.length], { extrapolateRight: 'clamp' }));
    return (
        <AbsoluteFill style={{ backgroundColor: bg }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(124,58,237,0.06) 0%, transparent 60%)' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 160px' }}>
                <div style={{ maxWidth: 1200 }}>
                    <div style={{ width: 80, height: 6, backgroundColor: C.gold, marginBottom: 40, borderRadius: 3 }} />
                    <div style={{ fontSize: 52, color: C.white, fontWeight: 600, lineHeight: 1.6 }}>
                        {words.map((w, i) => <span key={i} style={{ opacity: i < vis ? 1 : 0.1, color: highlight && w.toLowerCase().includes(highlight.toLowerCase()) ? C.goldBright : C.white }}>{w} </span>)}
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};

// ─── POWER METER ──────────
const PM: React.FC<{ label: string; value: number; maxLabel: string; bg?: string; sub?: string }> = ({ label, value, maxLabel, bg = C.deepViolet, sub }) => {
    const f = useCurrentFrame();
    const fill = spring({ frame: f, fps: 30, config: { damping: 20 } });
    return (
        <AbsoluteFill style={{ backgroundColor: bg }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.08) 0%, transparent 60%)' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ fontSize: 55, fontWeight: 900, fontFamily: FONT_STACK.display, color: C.white, marginBottom: 40 }}>{label}</div>
                <div style={{ width: 1000, height: 50, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 25, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ width: `${value * fill * 100 / 100}%`, height: '100%', background: `linear-gradient(90deg,${C.purple},${C.gold})`, borderRadius: 25, boxShadow: `0 0 30px ${C.purple}66` }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: 1000, marginTop: 15 }}>
                    <span style={{ fontSize: 20, color: C.gray }}>LOW</span>
                    <span style={{ fontSize: 24, fontWeight: 900, color: C.goldBright }}>{Math.round(value * fill)}%</span>
                    <span style={{ fontSize: 20, color: C.gray }}>{maxLabel}</span>
                </div>
                {sub && <div style={{ fontSize: 28, color: C.gray, marginTop: 30 }}>{sub}</div>}
            </div>
        </AbsoluteFill>
    );
};

// ─── CHESS PIECE ──────────
const CP: React.FC<{ piece: string; label: string; sub: string; bg?: string }> = ({ piece, label, sub, bg = C.black }) => {
    const f = useCurrentFrame();
    const a = spring({ frame: f, fps: 30 });
    const float = Math.sin(f / 15) * 10;
    return (
        <AbsoluteFill style={{ backgroundColor: bg }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 50% 40%, rgba(212,175,55,0.06) 0%, transparent 50%)' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ fontSize: 200, transform: `translateY(${float}px) scale(${interpolate(a, [0, 1], [0.3, 1])})`, opacity: a }}>{piece}</div>
                <div style={{ fontSize: 70, fontWeight: 900, fontFamily: FONT_STACK.display, color: C.gold, marginTop: 20, opacity: a }}>{label}</div>
                <div style={{ fontSize: 30, color: C.gray, marginTop: 15, opacity: a }}>{sub}</div>
            </div>
        </AbsoluteFill>
    );
};

// ─── BEFORE / AFTER ──────────
const BA: React.FC<{ before: { text: string; emoji: string }; after: { text: string; emoji: string }; bg?: string }> = ({ before, after, bg = C.deepViolet }) => {
    const f = useCurrentFrame();
    const s1 = spring({ frame: f, fps: 30 });
    const s2 = spring({ frame: f - 15, fps: 30 });
    return (
        <AbsoluteFill style={{ backgroundColor: bg, display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(220,38,38,0.08)', borderRight: '2px solid rgba(255,255,255,0.05)', opacity: s1, transform: `translateX(${interpolate(s1, [0, 1], [-80, 0])}px)` }}>
                <div style={{ fontSize: 100, marginBottom: 20 }}>{before.emoji}</div>
                <div style={{ fontSize: 30, color: C.red, fontWeight: 900, letterSpacing: 4, marginBottom: 15 }}>BEFORE</div>
                <div style={{ fontSize: 32, color: C.gray, textAlign: 'center', padding: '0 60px', lineHeight: 1.5 }}>{before.text}</div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(16,185,129,0.08)', opacity: s2, transform: `translateX(${interpolate(s2, [0, 1], [80, 0])}px)` }}>
                <div style={{ fontSize: 100, marginBottom: 20 }}>{after.emoji}</div>
                <div style={{ fontSize: 30, color: C.green, fontWeight: 900, letterSpacing: 4, marginBottom: 15 }}>AFTER</div>
                <div style={{ fontSize: 32, color: C.white, textAlign: 'center', padding: '0 60px', lineHeight: 1.5, fontWeight: 600 }}>{after.text}</div>
            </div>
        </AbsoluteFill>
    );
};

// ─── BIG STAT ──────────
const BS: React.FC<{ value: string; label: string; bg?: string; color?: string; sub?: string }> = ({ value, label, bg = C.black, color = C.gold, sub }) => {
    const f = useCurrentFrame();
    const a = spring({ frame: f, fps: 30, config: { damping: 12 } });
    return (
        <AbsoluteFill style={{ backgroundColor: bg }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.06) 0%, transparent 50%)' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ fontSize: 250, fontWeight: 900, fontFamily: FONT_STACK.display, color, transform: `scale(${interpolate(a, [0, 1], [0.3, 1])})`, opacity: a }}>{value}</div>
                <div style={{ fontSize: 45, fontWeight: 700, color: C.grayDark, marginTop: 10 }}>{label}</div>
                {sub && <div style={{ fontSize: 24, color: C.gray, marginTop: 15 }}>{sub}</div>}
            </div>
        </AbsoluteFill>
    );
};

// ─── CINEMATIC TITLE ──────────
const CT: React.FC<{ text: string; sub?: string; bg?: string; color?: string }> = ({ text, sub, bg = C.black, color = C.white }) => {
    const f = useCurrentFrame();
    const a = spring({ frame: f, fps: 30, config: { damping: 15 } });
    return (
        <AbsoluteFill style={{ background: `linear-gradient(160deg,${bg},${C.deepViolet})` }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 50%)' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ fontSize: 140, fontWeight: 900, fontFamily: FONT_STACK.display, color, textAlign: 'center', lineHeight: 0.95, transform: `scale(${interpolate(a, [0, 1], [0.4, 1])})`, opacity: a, letterSpacing: -2 }}>{text}</div>
                {sub && <div style={{ fontSize: 35, fontWeight: 600, color: C.gold, marginTop: 25, letterSpacing: 5, opacity: a }}>{sub}</div>}
            </div>
        </AbsoluteFill>
    );
};

// ─── EYE SVG ──────────
const Eye: React.FC<{ size?: number }> = ({ size = 300 }) => {
    const f = useCurrentFrame();
    const px = Math.sin(f / 20) * 12;
    const py = Math.cos(f / 15) * 5;
    const blink = Math.abs(Math.sin(f / 40)) > 0.95 ? 0.1 : 1;
    return (
        <svg width={size} height={size * 0.5} viewBox="0 0 200 100">
            <ellipse cx="100" cy="50" rx="90" ry={45 * blink} fill="none" stroke={C.gold} strokeWidth="3" opacity={0.6} />
            <circle cx={100 + px} cy={50 + py} r="25" fill={C.purple} />
            <circle cx={100 + px} cy={50 + py} r="12" fill={C.black} />
            <circle cx={100 + px + 5} cy={50 + py - 5} r="4" fill="rgba(255,255,255,0.6)" />
        </svg>
    );
};

// ═══ MAIN ═══
export const DarkPsychology: React.FC = () => (
    <AbsoluteFill style={{ backgroundColor: C.black, fontFamily: 'Inter' }}>
        <style>{FONT_IMPORT}</style>
        {/* Single VO file — delayed 24f (0.8s) to sync with visual intro */}
        <Sequence from={24}><Audio src={staticFile("dark.wav")} /></Sequence>
        {/* Ambient background — soothing, low volume */}
        <Audio src={staticFile("sfx/ambient.mp3")} volume={0.06} loop />

        {/* ═══ INTRO (75f) ═══ */}
        <Sequence durationInFrames={INTRO}>
            <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, ${C.deepViolet}, ${C.black})` }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <BrainPulse size={600} />
                    {(() => { const f = useCurrentFrame(); const a = spring({ frame: f, fps: 30 }); return <div style={{ position: 'absolute', fontSize: 90, fontWeight: 900, fontFamily: FONT_STACK.display, color: C.gold, opacity: a, textShadow: `0 0 60px ${C.gold}44` }}>DARK PSYCHOLOGY</div>; })()}
                </div>
            </AbsoluteFill>
            <Audio src={staticFile("sfx/rise.mp3")} volume={0.4} />
        </Sequence>

        {/* ═══ S1: INTRO (979f / ~32.6s) ═══ */}
        <Sequence from={F1} durationInFrames={S1}>
            <Sequence durationInFrames={45}><CT text="RESPECT" sub="ISN'T GIVEN. IT'S ENGINEERED." /></Sequence>
            <Sequence from={45} durationInFrames={45}><BS value="7" label="DARK PSYCHOLOGY TRICKS" bg={C.black} /><Audio src={staticFile("sfx/pop.mp3")} /></Sequence>
            <Sequence from={90} durationInFrames={120}><PQ quote="Most people spend their entire lives hoping to be respected when the most respected people are using subtle psychological tactics." highlight="tactics" /></Sequence>
            <Sequence from={210} durationInFrames={45}><CP piece="♔" label="KING ENERGY" sub="Engineered through psychology" /></Sequence>
            <Sequence from={255} durationInFrames={45}><BS value="⚡" label="FROM YOUR BOSS TO A STRANGER" bg={C.black} color={C.purple} /></Sequence>
            <Sequence from={300} durationInFrames={120}><PQ quote="These are not theory. These are battle-tested principles from behavioral psychology." highlight="battle-tested" /><Audio src={staticFile("sfx/whoosh.mp3")} /></Sequence>
            <Sequence from={420} durationInFrames={90}>
                <AbsoluteFill style={{ backgroundColor: C.black }}><div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><BrainPulse size={500} /></div>
                    {(() => { const f = useCurrentFrame(); return <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: 120 }}><div style={{ fontSize: 35, color: C.gray, fontWeight: 600, opacity: interpolate(f, [0, 20], [0, 1], { extrapolateRight: 'clamp' }) }}>YOUR MIND IS THE WEAPON</div></div>; })()}
                </AbsoluteFill>
            </Sequence>
            <Sequence from={510} durationInFrames={45}><PM label="RESPECT LEVEL" value={95} maxLabel="MAXIMUM" /></Sequence>
            <Sequence from={555} durationInFrames={45}><BS value="🧠" label="BEHAVIORAL PSYCHOLOGY" bg={C.deepViolet} color={C.gold} /></Sequence>
            <Sequence from={600} durationInFrames={45}>
                <AbsoluteFill style={{ backgroundColor: C.black }}><div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Eye size={500} /></div></AbsoluteFill>
            </Sequence>
            <Sequence from={645} durationInFrames={45}><CT text="LET'S BEGIN" color={C.goldBright} bg={C.deepViolet} /></Sequence>
            <Sequence from={690} durationInFrames={45}><CT text="7 TRICKS" sub="THAT CHANGE EVERYTHING" color={C.gold} /></Sequence>
            <Sequence from={735} durationInFrames={45}><BS value="♔" label="POWER OVER PERCEPTION" bg={C.deepViolet} color={C.gold} /></Sequence>
            <Sequence from={780} durationInFrames={45}><PM label="KNOWLEDGE IS POWER" value={100} maxLabel="UNLOCKED" /></Sequence>
            <Sequence from={825} durationInFrames={45}><PQ quote="Knowledge without application is wasted. Let's apply it." highlight="apply" /></Sequence>
            <Sequence from={870} durationInFrames={45}><CP piece="⚡" label="ACTIVATE" sub="Your psychological advantage" /></Sequence>
            <Sequence from={915} durationInFrames={64}><CT text="BEGIN" sub="THE TRANSFORMATION" color={C.goldBright} bg={C.deepViolet} /></Sequence>
        </Sequence>

        {/* ═══ S2: TRICK 1 — POWER PAUSE (1175f / ~39.2s) ═══ */}
        <Sequence from={F2} durationInFrames={S2}>
            <Sequence durationInFrames={90}><TrickCard num={1} title="THE POWER PAUSE" icon="⏸️" sub="Control the tempo of any conversation" /><Audio src={staticFile("sfx/rise.mp3")} volume={0.3} /></Sequence>
            <Sequence from={90} durationInFrames={45}><BS value="2-3" label="SECONDS OF SILENCE" sub="Before you respond" bg={C.black} color={C.gold} /></Sequence>
            <Sequence from={135} durationInFrames={120}><PQ quote="When someone challenges you, most people rush to respond. That's a mistake. Pause. Process. Then speak." highlight="Pause" /></Sequence>
            <Sequence from={255} durationInFrames={90}><BA before={{ text: 'Rushes to respond. Appears reactive and emotional.', emoji: '😰' }} after={{ text: 'Pauses 2-3 seconds. Signals control and authority.', emoji: '😎' }} /><Audio src={staticFile("sfx/whoosh.mp3")} /></Sequence>
            <Sequence from={345} durationInFrames={45}><PM label="PERCEIVED AUTHORITY" value={90} maxLabel="MAXIMUM" /></Sequence>
            <Sequence from={390} durationInFrames={120}><PQ quote="World leaders, CEOs, and top negotiators all use this. The silence creates a vacuum of authority." highlight="vacuum" /></Sequence>
            <Sequence from={510} durationInFrames={45}><CP piece="♜" label="STRATEGIC PATIENCE" sub="Silence is power" /></Sequence>
            <Sequence from={555} durationInFrames={45}><BS value="🕐" label="THE SLOWER YOU RESPOND" sub="The more powerful you appear" bg={C.deepViolet} color={C.gold} /></Sequence>
            <Sequence from={600} durationInFrames={120}><PQ quote="The slower you respond, the more powerful you appear. It's counterintuitive, but it works every single time." highlight="powerful" /><Audio src={staticFile("sfx/pop.mp3")} /></Sequence>
            <Sequence from={720} durationInFrames={45}><CT text="CONTROL" sub="IS THE FOUNDATION OF RESPECT" color={C.purple} /></Sequence>
            <Sequence from={765} durationInFrames={45}><BS value="💡" label="COUNTERINTUITIVE BUT PROVEN" bg={C.black} color={C.goldBright} /></Sequence>
            <Sequence from={810} durationInFrames={120}><PQ quote="The person waiting will automatically assign you more weight and credibility." highlight="credibility" /></Sequence>
            <Sequence from={930} durationInFrames={245}><PM label="POWER PAUSE EFFECTIVENESS" value={92} maxLabel="PROVEN" /></Sequence>
        </Sequence>

        {/* ═══ S3: TRICK 2 — NAME DROP (1137f / ~37.9s) ═══ */}
        <Sequence from={F3} durationInFrames={S3}>
            <Sequence durationInFrames={90}><TrickCard num={2} title="NAME DROP EFFECT" icon="🎯" sub="Activate the brain's reward center" /><Audio src={staticFile("sfx/rise.mp3")} volume={0.3} /></Sequence>
            <Sequence from={90} durationInFrames={120}><PQ quote="Use the other person's name strategically. Hearing your own name activates the brain's reward center." highlight="reward" /></Sequence>
            <Sequence from={210} durationInFrames={45}><BS value="🧪" label="NEUROLOGICAL TRIGGER" bg={C.black} color={C.purple} /><Audio src={staticFile("sfx/pop.mp3")} /></Sequence>
            <Sequence from={255} durationInFrames={120}><PQ quote="They are neurologically wired to pay more attention when you say their name." highlight="attention" /></Sequence>
            <Sequence from={375} durationInFrames={90}><BA before={{ text: 'Generic conversation: "Hey, I think we should..."', emoji: '😐' }} after={{ text: 'Strategic: "John, here\'s what I noticed..."', emoji: '🎯' }} /></Sequence>
            <Sequence from={465} durationInFrames={45}><PM label="ATTENTION CAPTURE" value={88} maxLabel="PROVEN" /></Sequence>
            <Sequence from={510} durationInFrames={120}><PQ quote="Use it at the beginning to establish authority and at the end to leave a lasting emotional impression." highlight="authority" /><Audio src={staticFile("sfx/whoosh.mp3")} /></Sequence>
            <Sequence from={630} durationInFrames={45}><BS value="1" label="TRICK TO SHIFT ANY CONVERSATION" bg={C.deepViolet} color={C.goldBright} /></Sequence>
            <Sequence from={675} durationInFrames={120}><PQ quote="Personal recognition is the deepest human need. Use it wisely." highlight="recognition" /></Sequence>
            <Sequence from={795} durationInFrames={342}><CT text="RECOGNITION" sub="THE DEEPEST HUMAN NEED" color={C.gold} /></Sequence>
        </Sequence>

        {/* ═══ S4: TRICK 3 — DISQUALIFICATION (1205f / ~40.2s) ═══ */}
        <Sequence from={F4} durationInFrames={S4}>
            <Sequence durationInFrames={90}><TrickCard num={3} title="DISQUALIFICATION FRAME" icon="🔄" sub="Flip the power dynamic completely" /><Audio src={staticFile("sfx/rise.mp3")} volume={0.3} /></Sequence>
            <Sequence from={90} durationInFrames={120}><PQ quote="Instead of proving your worth, subtly imply that they have to earn YOUR attention." highlight="YOUR" /></Sequence>
            <Sequence from={210} durationInFrames={90}><BA before={{ text: '"Let me tell you why I\'m the right person..."', emoji: '🙏' }} after={{ text: '"I\'m not sure this is the right fit for you."', emoji: '👑' }} /><Audio src={staticFile("sfx/pop 2.mp3")} /></Sequence>
            <Sequence from={300} durationInFrames={45}><BS value="⚔️" label="FLIPS THE POWER DYNAMIC" bg={C.black} color={C.crimson} /></Sequence>
            <Sequence from={345} durationInFrames={120}><PQ quote="Suddenly, THEY are the ones trying to qualify themselves to YOU." highlight="THEY" /></Sequence>
            <Sequence from={465} durationInFrames={45}><CP piece="♛" label="QUEEN'S GAMBIT" sub="Make them earn your time" /></Sequence>
            <Sequence from={510} durationInFrames={45}><BS value="🎯" label="WORKS IN INTERVIEWS, DATING, BUSINESS" bg={C.deepViolet} color={C.gold} /></Sequence>
            <Sequence from={555} durationInFrames={120}><PQ quote="You're not being arrogant. You're positioning yourself as someone whose time and energy are valuable." highlight="valuable" /><Audio src={staticFile("sfx/whoosh.mp3")} /></Sequence>
            <Sequence from={675} durationInFrames={45}><PM label="POWER FLIP EFFECTIVENESS" value={95} maxLabel="ELITE" /></Sequence>
            <Sequence from={720} durationInFrames={120}><PQ quote="The key is subtlety. Position yourself as the prize, not the contestant." highlight="prize" /></Sequence>
            <Sequence from={840} durationInFrames={365}><CT text="SUBTLETY" sub="IS THE KEY TO REAL POWER" color={C.gold} /></Sequence>
        </Sequence>

        {/* ═══ S5: TRICK 4 — VULNERABILITY (1208f / ~40.3s) ═══ */}
        <Sequence from={F5} durationInFrames={S5}>
            <Sequence durationInFrames={90}><TrickCard num={4} title="STRATEGIC VULNERABILITY" icon="🎭" sub="The Pratfall Effect in action" /><Audio src={staticFile("sfx/rise.mp3")} volume={0.3} /></Sequence>
            <Sequence from={90} durationInFrames={120}><PQ quote="Carefully chosen moments of vulnerability actually INCREASE respect. Psychologists call it the Pratfall Effect." highlight="INCREASE" /></Sequence>
            <Sequence from={210} durationInFrames={90}><BA before={{ text: '"I\'ve never made a mistake. I\'m perfect."', emoji: '🤥' }} after={{ text: '"I misjudged that market. Here\'s what I learned."', emoji: '💪' }} /><Audio src={staticFile("sfx/pop.mp3")} /></Sequence>
            <Sequence from={300} durationInFrames={45}><BS value="PRATFALL" label="EFFECT" sub="Competent + minor flaw = MORE likable" bg={C.deepViolet} color={C.purple} /></Sequence>
            <Sequence from={345} durationInFrames={120}><PQ quote="You don't reveal deep insecurities. You acknowledge a minor imperfection that humanizes you." highlight="humanizes" /></Sequence>
            <Sequence from={465} durationInFrames={45}><PM label="RELATABILITY BOOST" value={85} maxLabel="PROVEN" /></Sequence>
            <Sequence from={510} durationInFrames={45}><BS value="💡" label="STRATEGIC, NOT CARELESS" bg={C.black} color={C.goldBright} /></Sequence>
            <Sequence from={555} durationInFrames={120}><PQ quote="That one sentence builds more respect than a hundred humble brags." highlight="hundred" /><Audio src={staticFile("sfx/whoosh.mp3")} /></Sequence>
            <Sequence from={675} durationInFrames={120}><PQ quote="Think of a CEO admitting a mistake. That honesty makes them MORE respected, not less." highlight="MORE" /></Sequence>
            <Sequence from={795} durationInFrames={413}><CT text="STRENGTH" sub="IN STRATEGIC HONESTY" color={C.goldBright} /></Sequence>
        </Sequence>

        {/* ═══ S6: TRICK 5 — MIRROR & LEAD (1168f / ~38.9s) ═══ */}
        <Sequence from={F6} durationInFrames={S6}>
            <Sequence durationInFrames={90}><TrickCard num={5} title="MIRROR & LEAD" icon="🪞" sub="Advanced social engineering" /><Audio src={staticFile("sfx/rise.mp3")} volume={0.3} /></Sequence>
            <Sequence from={90} durationInFrames={120}><PQ quote="First, mirror their body language, speech, and energy. This creates unconscious rapport on a deep level." highlight="unconscious" /></Sequence>
            <Sequence from={210} durationInFrames={45}><BS value="STEP 1" label="MIRROR THEM" sub="Match body language + speech + energy" bg={C.black} color={C.teal} /><Audio src={staticFile("sfx/pop.mp3")} /></Sequence>
            <Sequence from={255} durationInFrames={45}><BS value="STEP 2" label="LEAD THEM" sub="Shift your posture, tone, pace" bg={C.deepViolet} color={C.gold} /></Sequence>
            <Sequence from={300} durationInFrames={120}><PQ quote="Once they feel the connection, you begin to lead. You shift, and THEY follow YOU." highlight="follow" /></Sequence>
            <Sequence from={420} durationInFrames={45}><CP piece="♞" label="THE KNIGHT'S MOVE" sub="Indirect. Unexpected. Powerful." /><Audio src={staticFile("sfx/whoosh.mp3")} /></Sequence>
            <Sequence from={465} durationInFrames={120}><PQ quote="This is how therapists, cult leaders, and master negotiators control rooms full of people." highlight="control" /></Sequence>
            <Sequence from={585} durationInFrames={45}><PM label="SOCIAL INFLUENCE" value={97} maxLabel="MASTER LEVEL" /></Sequence>
            <Sequence from={630} durationInFrames={120}><PQ quote="You match them first, then become the one they unconsciously follow. That is deep respect." highlight="deep" /></Sequence>
            <Sequence from={750} durationInFrames={418}><CT text="LEAD" sub="BY FIRST UNDERSTANDING" color={C.purple} /></Sequence>
        </Sequence>

        {/* ═══ S7: TRICK 6 — SCARCITY (1233f / ~41.1s) ═══ */}
        <Sequence from={F7} durationInFrames={S7}>
            <Sequence durationInFrames={90}><TrickCard num={6} title="THE SCARCITY PRINCIPLE" icon="💎" sub="Your availability is your value" /><Audio src={staticFile("sfx/rise.mp3")} volume={0.3} /></Sequence>
            <Sequence from={90} durationInFrames={120}><PQ quote="The easiest way to DESTROY respect is to always be available. Always reachable. Always saying yes." highlight="DESTROY" /></Sequence>
            <Sequence from={210} durationInFrames={90}><BA before={{ text: 'Always online. Responds in 30 seconds. Says yes to everything.', emoji: '📱' }} after={{ text: 'Genuinely busy. Responds when ready. Time is precious.', emoji: '💎' }} /><Audio src={staticFile("sfx/pop 2.mp3")} /></Sequence>
            <Sequence from={300} durationInFrames={120}><PQ quote="When your presence is a rare event, people psychologically assign you higher worth." highlight="rare" /></Sequence>
            <Sequence from={420} durationInFrames={45}><BS value="📉" label="ALWAYS AVAILABLE = LOW VALUE" bg={C.black} color={C.red} /></Sequence>
            <Sequence from={465} durationInFrames={45}><BS value="📈" label="SCARCE PRESENCE = HIGH VALUE" bg={C.deepViolet} color={C.green} /><Audio src={staticFile("sfx/whoosh.mp3")} /></Sequence>
            <Sequence from={510} durationInFrames={120}><PQ quote="Fill your life with purpose so availability becomes naturally scarce. It's a psychological law." highlight="law" /></Sequence>
            <Sequence from={630} durationInFrames={45}><PM label="PERCEIVED VALUE" value={93} maxLabel="DIAMOND" /></Sequence>
            <Sequence from={675} durationInFrames={120}><PQ quote="The most respected people in any field are the hardest to reach. That's not an accident." highlight="hardest" /></Sequence>
            <Sequence from={795} durationInFrames={438}><CT text="RARE" sub="IS ALWAYS MORE VALUABLE" color={C.gold} /></Sequence>
        </Sequence>

        {/* ═══ S8: TRICK 7 — EMOTIONAL CONTROL (1298f / ~43.3s) ═══ */}
        <Sequence from={F8} durationInFrames={S8}>
            <Sequence durationInFrames={90}><TrickCard num={7} title="CONTROLLED EMOTION" icon="🧊" sub="The ultimate signal of inner strength" /><Audio src={staticFile("sfx/rise.mp3")} volume={0.3} /></Sequence>
            <Sequence from={90} durationInFrames={120}><PQ quote="Most people wear emotions on their sleeve. They react instantly. The one who CONTROLS reactions becomes the most powerful." highlight="CONTROLS" /></Sequence>
            <Sequence from={210} durationInFrames={90}><BA before={{ text: 'Reacts to every insult, praise, and provocation instantly.', emoji: '😤' }} after={{ text: 'Chooses WHEN and HOW to express emotion. Strategic calm.', emoji: '🧊' }} /><Audio src={staticFile("sfx/pop.mp3")} /></Sequence>
            <Sequence from={300} durationInFrames={120}><PQ quote="When you remain calm while others panic, you become the anchor. You become the leader without saying a word." highlight="anchor" /></Sequence>
            <Sequence from={420} durationInFrames={45}><CP piece="♔" label="THE KING" sub="Calm in chaos. Power in stillness." /></Sequence>
            <Sequence from={465} durationInFrames={45}><BS value="🧊" label="EMOTIONAL MASTERY" sub="Choose when to feel, when to reveal" bg={C.black} color={C.purple} /></Sequence>
            <Sequence from={510} durationInFrames={120}><PQ quote="When you show genuine emotion at a carefully chosen moment, it lands with ten times the impact." highlight="ten" /><Audio src={staticFile("sfx/whoosh.mp3")} /></Sequence>
            <Sequence from={630} durationInFrames={45}><PM label="INNER STRENGTH" value={98} maxLabel="ULTIMATE" /></Sequence>
            <Sequence from={675} durationInFrames={45}><BS value="10×" label="THE IMPACT" sub="Of strategic emotional display" bg={C.black} color={C.goldBright} /></Sequence>
            <Sequence from={720} durationInFrames={120}><PQ quote="Emotional control is the ultimate signal of inner strength, and inner strength is the foundation of lasting respect." highlight="foundation" /></Sequence>
            <Sequence from={840} durationInFrames={458}><CT text="MASTERY" sub="EMOTIONAL CONTROL IS THE FOUNDATION" color={C.gold} /></Sequence>
        </Sequence>

        {/* ═══ S9: CONCLUSION (1192f / ~39.7s) ═══ */}
        <Sequence from={F9} durationInFrames={S9}>
            <Sequence durationInFrames={45}><CT text="RECAP" sub="ALL 7 TRICKS" color={C.gold} /></Sequence>
            <Sequence from={45} durationInFrames={45}><BS value="1" label="THE POWER PAUSE" bg={C.black} color={C.purple} /></Sequence>
            <Sequence from={90} durationInFrames={45}><BS value="2" label="THE NAME DROP EFFECT" bg={C.deepViolet} color={C.gold} /></Sequence>
            <Sequence from={135} durationInFrames={45}><BS value="3" label="DISQUALIFICATION FRAME" bg={C.black} color={C.purple} /></Sequence>
            <Sequence from={180} durationInFrames={45}><BS value="4" label="STRATEGIC VULNERABILITY" bg={C.deepViolet} color={C.gold} /><Audio src={staticFile("sfx/pop.mp3")} /></Sequence>
            <Sequence from={225} durationInFrames={45}><BS value="5" label="MIRROR & LEAD" bg={C.black} color={C.purple} /></Sequence>
            <Sequence from={270} durationInFrames={45}><BS value="6" label="THE SCARCITY PRINCIPLE" bg={C.deepViolet} color={C.gold} /></Sequence>
            <Sequence from={315} durationInFrames={45}><BS value="7" label="CONTROLLED EMOTION" bg={C.black} color={C.purple} /></Sequence>
            <Sequence from={360} durationInFrames={120}><PQ quote="These are not about manipulation. They are about understanding how the human mind works." highlight="understanding" /><Audio src={staticFile("sfx/whoosh.mp3")} /></Sequence>
            <Sequence from={480} durationInFrames={45}><CT text="PERCEPTION" sub="NOT PERFECTION" color={C.goldBright} /></Sequence>
            <Sequence from={525} durationInFrames={120}><PQ quote="Respect is not about being liked. It is about being valued. Value is created through perception." highlight="valued" /></Sequence>
            <Sequence from={645} durationInFrames={45}><BS value="🧠" label="YOUR GREATEST WEAPON" bg={C.black} color={C.gold} /></Sequence>
            <Sequence from={690} durationInFrames={90}>
                <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, ${C.deepViolet}, ${C.black})` }}>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><BrainPulse size={500} /></div>
                    {(() => {
                        const f = useCurrentFrame(); const a = spring({ frame: f, fps: 30 }); return <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ fontSize: 100, fontWeight: 900, fontFamily: FONT_STACK.display, color: C.gold, opacity: a }}>YOUR MIND</div>
                            <div style={{ fontSize: 40, color: C.gray, marginTop: 15, opacity: a }}>IS YOUR GREATEST WEAPON</div>
                        </div>;
                    })()}
                </AbsoluteFill>
                <Audio src={staticFile("sfx/rise.mp3")} volume={0.5} />
            </Sequence>
            <Sequence from={780} durationInFrames={412}>
                <AbsoluteFill style={{ background: `linear-gradient(180deg,${C.deepViolet},${C.black})` }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 50%)' }} />
                    {(() => {
                        const f = useCurrentFrame(); const a = spring({ frame: f, fps: 30 }); return <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ fontSize: 90, fontWeight: 900, fontFamily: FONT_STACK.display, color: C.white, opacity: a }}>SUBSCRIBE</div>
                            <div style={{ fontSize: 30, color: C.gold, marginTop: 15, letterSpacing: 5, opacity: a }}>PSYCHOLOGY OF POWER & INFLUENCE</div>
                        </div>;
                    })()}
                </AbsoluteFill>
            </Sequence>
        </Sequence>
    </AbsoluteFill>
);
