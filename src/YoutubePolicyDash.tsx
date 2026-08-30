import React from 'react';
import {
    AbsoluteFill,
    useVideoConfig,
    Audio,
    staticFile,
    Series,
    Sequence,
    interpolate,
    useCurrentFrame,
    spring,
    Easing
} from 'remotion';

const THEME = {
    bg: '#05070A',
    panel: '#0F172A',
    text: '#F8FAFC',
    accent1: '#38BDF8', // Sky Blue
    accent2: '#818CF8', // Indigo
    accent3: '#34D399', // Emerald
    accent4: '#F472B6', // Pink
    border: 'rgba(255,255,255,0.1)'
};

const FontStyles: React.FC = () => (
    <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&display=swap');
        `}
    </style>
);

// --- Dashboard Widgets ---

const DashPanel: React.FC<{ children: React.ReactNode; title: string; delay?: number; colSpan?: number; rowSpan?: number }> = ({ children, title, delay = 0, colSpan = 1, rowSpan = 1 }) => {
    const frame = useCurrentFrame();
    const p = spring({ frame: Math.max(0, frame - delay), fps: 30, config: { damping: 12 } });

    return (
        <div style={{
            gridColumn: `span ${colSpan}`,
            gridRow: `span ${rowSpan}`,
            background: THEME.panel,
            border: `1px solid ${THEME.border}`,
            borderRadius: 24,
            padding: 25,
            display: 'flex',
            flexDirection: 'column',
            transform: `scale(${p}) translateY(${interpolate(p, [0, 1], [40, 0])}px)`,
            opacity: p,
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15, borderBottom: `1px solid ${THEME.border}`, paddingBottom: 10 }}>
                <div style={{ fontFamily: 'JetBrains Mono', color: THEME.accent1, fontSize: 14 }}>{title}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                    {[1, 2, 3].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: 3, background: i === 1 ? THEME.accent1 : THEME.border }} />)}
                </div>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>{children}</div>
        </div>
    );
};

const BarGraph: React.FC<{ count?: number; color?: string }> = ({ count = 8, color = THEME.accent1 }) => {
    const frame = useCurrentFrame();
    return (
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: '100%', paddingBottom: 10 }}>
            {[...Array(count)].map((_, i) => {
                const h = spring({ frame: frame - (i * 3), fps: 30 });
                const baseH = 20 + (Math.sin(i * 1.2 + frame / 10) * 20 + 40);
                return (
                    <div key={i} style={{
                        flex: 1,
                        background: color,
                        height: `${baseH * h}%`,
                        borderRadius: '4px 4px 2px 2px',
                        opacity: 0.7 + (i * 0.03)
                    }} />
                );
            })}
        </div>
    );
};

const Checklist: React.FC<{ items: string[]; delay?: number }> = ({ items, delay = 0 }) => {
    const frame = useCurrentFrame();
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            {items.map((item, i) => {
                const p = spring({ frame: Math.max(0, frame - delay - (i * 8)), fps: 30 });
                return (
                    <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        opacity: p,
                        transform: `translateX(${interpolate(p, [0, 1], [-15, 0])}px)`
                    }}>
                        <div style={{
                            width: 28, height: 28,
                            borderRadius: 6,
                            background: p > 0.9 ? THEME.accent3 : 'transparent',
                            border: `2px solid ${THEME.accent3}`,
                            display: 'flex', justifyContent: 'center', alignItems: 'center'
                        }}>
                            {p > 0.9 && <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke={THEME.bg} strokeWidth="4"><path d="M4 10 L8 14 L16 6" /></svg>}
                        </div>
                        <div style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 900, color: THEME.text }}>{item}</div>
                    </div>
                );
            })}
        </div>
    );
};

const PoppingCallout: React.FC<{ text: string; sub: string; color?: string; style?: React.CSSProperties }> = ({ text, sub, color = THEME.accent1, style }) => {
    const frame = useCurrentFrame();
    const p = spring({ frame, fps: 30, config: { stiffness: 200 } });

    return (
        <div style={{
            transform: `scale(${p})`,
            background: THEME.panel,
            border: `1px solid ${color}`,
            borderRadius: 16,
            padding: '12px 24px',
            boxShadow: `0 10px 30px -10px ${color}33`,
            ...style
        }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color, marginBottom: 2 }}>{sub}</div>
            <div style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 900, color: THEME.text }}>{text}</div>
        </div>
    );
};

const CharacterLoop: React.FC<{ pose: 'explaining' | 'shocked' | 'ready' }> = ({ pose }) => {
    const frame = useCurrentFrame();
    const bounce = Math.sin(frame / 6) * 4;
    const color = THEME.text;

    return (
        <svg width="150" height="150" viewBox="0 0 100 100">
            <g transform={`translate(50, 60) translateY(${bounce})`}>
                <line x1="0" y1="0" x2="0" y2="25" stroke={color} strokeWidth="6" strokeLinecap="round" />
                <circle cx="0" cy="-15" r="10" fill="none" stroke={color} strokeWidth="6" />
                {pose === 'explaining' && (
                    <>
                        <line x1="0" y1="5" x2="-25" y2="15" stroke={color} strokeWidth="6" strokeLinecap="round" />
                        <line x1="0" y1="5" x2="25" y2="-10" stroke={color} strokeWidth="6" strokeLinecap="round" />
                    </>
                )}
                {pose === 'shocked' && (
                    <>
                        <line x1="0" y1="5" x2="-20" y2="-15" stroke={color} strokeWidth="6" strokeLinecap="round" />
                        <line x1="0" y1="5" x2="20" y2="-15" stroke={color} strokeWidth="6" strokeLinecap="round" />
                    </>
                )}
                {pose === 'ready' && (
                    <>
                        <line x1="0" y1="5" x2="-25" y2="25" stroke={color} strokeWidth="6" strokeLinecap="round" />
                        <line x1="0" y1="5" x2="25" y2="25" stroke={color} strokeWidth="6" strokeLinecap="round" />
                    </>
                )}
            </g>
        </svg>
    );
};

const DashboardLayout: React.FC<{ children: React.ReactNode; activeSection: string }> = ({ children, activeSection }) => {
    return (
        <AbsoluteFill style={{
            backgroundColor: THEME.bg,
            padding: 50,
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header - Minimalist */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 40 }}>
                <div style={{ display: 'flex', gap: 15 }}>
                    {[THEME.accent1, THEME.accent2, THEME.accent3].map((c, i) => (
                        <div key={i} style={{ width: 12, height: 12, background: c, borderRadius: 6 }} />
                    ))}
                </div>
            </div>

            <div style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: '1fr 1.2fr',
                gridTemplateRows: '1fr 1fr',
                gap: 30,
                minHeight: 0 // Crucial for flex child grid
            }}>
                {children}
            </div>
        </AbsoluteFill>
    );
};

export const YoutubePolicyDash: React.FC = () => {
    const sceneDur = 200;

    return (
        <AbsoluteFill>
            <FontStyles />
            <Audio src={staticFile("sfx/ambient.mp3")} volume={0.08} />

            <Series>
                <Series.Sequence durationInFrames={sceneDur}>
                    <Audio src={staticFile("dash_intro.wav")} />
                    <DashboardLayout activeSection="TERMINATION_PROTOCOL">
                        <DashPanel title="SYSTEM_LOAD" delay={0}>
                            <BarGraph color={THEME.accent1} />
                        </DashPanel>
                        <DashPanel title="THREAT_LEVEL" delay={15}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <PoppingCallout text="AUTOMATION DIES" sub="CRITICAL_FAILURE" color={THEME.accent4} />
                            </div>
                        </DashPanel>
                        <DashPanel title="CREATOR_STATUS" delay={30}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <CharacterLoop pose="shocked" />
                            </div>
                        </DashPanel>
                        <DashPanel title="LOG_STREAM" delay={45}>
                            <div style={{ fontFamily: 'JetBrains Mono', color: THEME.text, opacity: 0.6, fontSize: 14 }}>
                                {`> ANALYZING_STREAMS...\n> DETECTED: AI_LOW_EFFORT\n> TRIGGERING: DEMONETIZATION\n> NULL_TOKEN_GENERATED`}
                            </div>
                        </DashPanel>
                    </DashboardLayout>
                </Series.Sequence>

                <Series.Sequence durationInFrames={sceneDur}>
                    <Audio src={staticFile("dash_timeline.wav")} />
                    <DashboardLayout activeSection="POLICY_UPDATE_2025">
                        <DashPanel title="TIMELINE" delay={0} colSpan={2}>
                            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '100%', padding: '0 40px' }}>
                                <PoppingCallout text="JAN 2025" sub="DECLARATION" color={THEME.accent2} />
                                <div style={{ flex: 1, height: 2, background: THEME.border, margin: '0 30px', position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: -5, left: '50%', width: 12, height: 12, borderRadius: 6, background: THEME.accent2 }} />
                                </div>
                                <PoppingCallout text="JULY 15" sub="THE PURGE" color={THEME.accent4} />
                            </div>
                        </DashPanel>
                        <DashPanel title="METRICS" delay={20}>
                            <BarGraph color={THEME.accent2} count={10} />
                        </DashPanel>
                        <DashPanel title="ALGO_STRENGTH" delay={40}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', fontSize: 90, fontWeight: 900, color: THEME.accent2, fontFamily: 'Outfit' }}>9.8x</div>
                        </DashPanel>
                    </DashboardLayout>
                </Series.Sequence>

                <Series.Sequence durationInFrames={sceneDur}>
                    <Audio src={staticFile("dash_soul.wav")} />
                    <DashboardLayout activeSection="AUTHENTICITY_VAL">
                        <DashPanel title="HUMAN_SOUL_INDEX" colSpan={1} rowSpan={2}>
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 15, padding: '10px 0' }}>
                                <div style={{ height: 35, background: THEME.accent3, width: '100%', borderRadius: 8, opacity: 0.9 }} />
                                <div style={{ height: 35, background: THEME.accent3, width: '88%', borderRadius: 8, opacity: 0.7 }} />
                                <div style={{ height: 35, background: THEME.accent3, width: '95%', borderRadius: 8, opacity: 0.5 }} />
                                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <PoppingCallout text="ADD A SOUL" sub="REQUIRED" color={THEME.accent3} />
                                </div>
                            </div>
                        </DashPanel>
                        <DashPanel title="CHARACTER" delay={20}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <CharacterLoop pose="explaining" />
                            </div>
                        </DashPanel>
                        <DashPanel title="VERIFICATION" delay={40}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', fontFamily: 'Outfit', color: THEME.accent3, fontSize: 48, fontWeight: 900 }}>PASS_OK</div>
                        </DashPanel>
                    </DashboardLayout>
                </Series.Sequence>

                <Series.Sequence durationInFrames={sceneDur}>
                    <Audio src={staticFile("dash_purge.wav")} />
                    <DashboardLayout activeSection="CHOPPING_BLOCK">
                        <DashPanel title="PURGE_TARGETS" rowSpan={2}>
                            <Checklist items={['AI VOICES', 'STOCK LOOPS', 'TEMPLATE RXN', 'LOW EFFORT']} delay={20} />
                        </DashPanel>
                        <DashPanel title="REMOVAL_STATS" delay={40}>
                            <BarGraph color={THEME.accent4} />
                        </DashPanel>
                        <DashPanel title="SYSTEM_ALERT" delay={60}>
                            <div style={{ display: 'flex', alignItems: 'center', height: '100%', color: THEME.accent4, fontFamily: 'JetBrains Mono', fontSize: 22 }}>
                                {`> WIPING_DATA...\n> [################] 100%`}
                            </div>
                        </DashPanel>
                    </DashboardLayout>
                </Series.Sequence>

                <Series.Sequence durationInFrames={sceneDur}>
                    <Audio src={staticFile("dash_gatekeeper.wav")} />
                    <DashboardLayout activeSection="GATEKEEPER">
                        <DashPanel title="REVIEW_QUEUE" colSpan={2}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', gap: 60 }}>
                                <div style={{ fontSize: 130, fontWeight: 900, color: THEME.text, fontFamily: 'Outfit' }}>24H</div>
                                <PoppingCallout text="SUITABILITY DELAY" sub="PENDING" color={THEME.accent1} />
                            </div>
                        </DashPanel>
                        <DashPanel title="AGENT_MONITOR" delay={30}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <CharacterLoop pose="ready" />
                            </div>
                        </DashPanel>
                        <DashPanel title="STATUS_REPORT" delay={50}>
                            <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'JetBrains Mono', fontSize: 18, color: THEME.accent1, textAlign: 'center' }}>MANUAL_REVIEW<br />STAGE_1_ACTIVE</div>
                        </DashPanel>
                    </DashboardLayout>
                </Series.Sequence>

                <Series.Sequence durationInFrames={sceneDur}>
                    <Audio src={staticFile("dash_survival.wav")} />
                    <DashboardLayout activeSection="SURVIVAL_GUIDE">
                        <DashPanel title="ACTIONS_REQUIRED" rowSpan={2}>
                            <Checklist items={['DISRUPT TEMPLATES', 'UNIQUE COMMENT', 'DISCLOSE AI', 'AUTHENTICITY']} delay={20} />
                        </DashPanel>
                        <DashPanel title="SUCCESS_CHANCE" delay={40}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', fontSize: 110, fontWeight: 900, color: THEME.accent3, fontFamily: 'Outfit' }}>99%</div>
                        </DashPanel>
                        <DashPanel title="FINAL_VERDICT" delay={60}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <PoppingCallout text="GO VIRAL" sub="STATUS" color={THEME.accent3} />
                            </div>
                        </DashPanel>
                    </DashboardLayout>
                </Series.Sequence>
            </Series>

            {[...Array(11)].map((_, i) => (
                <Sequence key={i} from={i * 200}>
                    <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.4} />
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};
