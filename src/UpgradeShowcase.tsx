import React from 'react';
import {
  useCurrentFrame, useVideoConfig, Sequence, interpolate, spring, Easing,
  AbsoluteFill, Audio, staticFile,
} from 'remotion';
import { FONT_IMPORT, FONT_STACK, getFontForScene } from './components/PremiumKit';

/* ─── COLORS ─── */
const C = {
  bg: '#0a0a1a', accent: '#6366f1', cyan: '#22d3ee', lime: '#a3e635',
  pink: '#f472b6', orange: '#fb923c', dark: '#111827', glass: 'rgba(255,255,255,0.06)',
};

/* ─── Animated Grid Background ─── */
const GridBG: React.FC<{color?: string}> = ({color = C.accent}) => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.3) % 60;
  return (
    <AbsoluteFill style={{background: `linear-gradient(135deg, ${C.bg} 0%, #0f172a 50%, ${C.bg} 100%)`}}>
      <div style={{position:'absolute',inset:0,opacity:0.08,
        backgroundImage:`linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
        backgroundSize:'60px 60px', backgroundPosition:`${drift}px ${drift}px`}} />
    </AbsoluteFill>
  );
};

/* ─── Floating Particles ─── */
const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  const dots = Array.from({length: 12}, (_, i) => {
    const x = 100 + (i * 160) % 1800;
    const y = 80 + ((i * 97) % 900);
    const r = 2 + (i % 3);
    return (
      <circle key={i} cx={x + Math.sin(frame/20 + i)*15} cy={y + Math.cos(frame/25 + i)*10}
        r={r} fill={[C.accent, C.cyan, C.pink, C.lime][i%4]} opacity={0.3 + Math.sin(frame/15+i)*0.15} />
    );
  });
  return <svg style={{position:'absolute',inset:0,pointerEvents:'none'}} viewBox="0 0 1920 1080">{dots}</svg>;
};

/* ─── Glassmorphism Card ─── */
const GlassCard: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{background: C.glass, backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.1)',
    borderRadius:24, padding:'50px 60px', boxShadow:'0 25px 80px rgba(0,0,0,0.4)', ...style}}>
    {children}
  </div>
);

/* ─── Version Badge ─── */
const Badge: React.FC<{text: string; color: string}> = ({text, color}) => (
  <span style={{display:'inline-block', padding:'8px 20px', borderRadius:50, fontSize:20, fontWeight:700,
    fontFamily: FONT_STACK.mono, color, border:`2px solid ${color}`, background:`${color}22`, letterSpacing:1}}>
    {text}
  </span>
);

/* ════════════════════════════════════════
   SCENE 1: INTRO — Version Reveal
   ════════════════════════════════════════ */
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s = spring({frame, fps:30, config:{damping:12}});
  const glow = 0.4 + Math.sin(frame/10)*0.3;
  return (
    <AbsoluteFill>
      <GridBG color={C.accent} />
      <Particles />
      <AbsoluteFill style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <div style={{fontSize:28, fontFamily:FONT_STACK.mono, color:C.cyan, letterSpacing:6, marginBottom:30,
          opacity: interpolate(frame,[0,20],[0,1],{extrapolateRight:'clamp'}),
          transform:`translateY(${interpolate(frame,[0,20],[20,0],{extrapolateRight:'clamp'})}px)`}}>
          REMOTION UPGRADE
        </div>
        <div style={{fontSize:160, fontFamily:FONT_STACK.impact, color:'white', lineHeight:1,
          transform:`scale(${interpolate(s,[0,1],[0.3,1])})`, opacity:s,
          textShadow:`0 0 ${60*glow}px ${C.accent}, 0 0 ${120*glow}px ${C.accent}44`}}>
          4.0.463
        </div>
        <div style={{display:'flex', gap:15, marginTop:40,
          opacity: interpolate(frame,[25,45],[0,1],{extrapolateRight:'clamp'})}}>
          <Badge text="ARRAY EASING" color={C.cyan} />
          <Badge text="PRESERVES PITCH" color={C.pink} />
          <Badge text="HIDDEN SEQUENCES" color={C.lime} />
        </div>
        <div style={{fontSize:22, color:'rgba(255,255,255,0.4)', fontFamily:FONT_STACK.body, marginTop:30,
          opacity: interpolate(frame,[40,60],[0,1],{extrapolateRight:'clamp'})}}>
          What's new in your upgrade • 4.0.427 → 4.0.463
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ════════════════════════════════════════
   SCENE 2: ARRAY EASING DEMO
   ════════════════════════════════════════ */
const ArrayEasingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const localFrame = frame;
  const sTitle = spring({frame, fps:30, config:{damping:14}});

  // Demo: ball animated with array easing across 3 segments
  const ballX = interpolate(localFrame, [0, 60, 120, 180], [100, 700, 1200, 1750], {
    easing: [Easing.out(Easing.cubic), Easing.inOut(Easing.ease), Easing.in(Easing.cubic)],
    extrapolateLeft:'clamp', extrapolateRight:'clamp',
  });
  const ballY = interpolate(localFrame, [0, 60, 120, 180], [500, 300, 650, 400], {
    easing: [Easing.out(Easing.bounce), Easing.inOut(Easing.ease), Easing.out(Easing.elastic(1))],
    extrapolateLeft:'clamp', extrapolateRight:'clamp',
  });

  // Comparison: single easing (linear)
  const linearX = interpolate(localFrame, [0, 180], [100, 1750], {extrapolateRight:'clamp'});
  const linearY = 700;

  const codeOpacity = interpolate(frame, [30, 50], [0, 1], {extrapolateRight:'clamp'});

  return (
    <AbsoluteFill>
      <GridBG color={C.cyan} />
      <Particles />
      <AbsoluteFill style={{padding:80}}>
        {/* Title */}
        <div style={{display:'flex', alignItems:'center', gap:20, marginBottom:10,
          transform:`translateX(${interpolate(sTitle,[0,1],[-100,0])}px)`, opacity:sTitle}}>
          <div style={{width:8, height:50, borderRadius:4, background:C.cyan}} />
          <span style={{fontSize:24, fontFamily:FONT_STACK.mono, color:C.cyan, letterSpacing:4}}>FEATURE 01</span>
        </div>
        <div style={{fontSize:72, fontFamily:FONT_STACK.display, color:'white', marginBottom:10, marginLeft:28,
          transform:`translateX(${interpolate(sTitle,[0,1],[-80,0])}px)`, opacity:sTitle}}>
          Array Easing in interpolate()
        </div>
        <div style={{fontSize:24, fontFamily:FONT_STACK.body, color:'rgba(255,255,255,0.5)', marginLeft:28, marginBottom:30,
          opacity: interpolate(frame,[15,30],[0,1],{extrapolateRight:'clamp'})}}>
          Different easing per segment — one call, multiple curves
        </div>

        {/* Visual Demo Area */}
        <div style={{position:'relative', flex:1, marginLeft:28}}>
          {/* Code snippet */}
          <GlassCard style={{position:'absolute', right:40, top:20, width:560, opacity:codeOpacity,
            transform:`translateX(${interpolate(frame,[30,50],[40,0],{extrapolateRight:'clamp'})}px)`}}>
            <pre style={{fontFamily:FONT_STACK.mono, fontSize:16, color:'white', margin:0, lineHeight:1.6}}>
{`interpolate(frame,
  [0, 60, 120, 180],  // 4 keyframes
  [100, 700, 1200, 1750],
  { easing: [
      `}<span style={{color:C.cyan}}>Easing.out(Easing.cubic)</span>{`,
      `}<span style={{color:C.pink}}>Easing.inOut(Easing.ease)</span>{`,
      `}<span style={{color:C.lime}}>Easing.in(Easing.cubic)</span>{`
  ]}
)`}
            </pre>
          </GlassCard>

          {/* Array easing ball */}
          <svg style={{position:'absolute', left:0, top:80, width:1920, height:500}} viewBox="0 0 1920 800">
            {/* Segment markers */}
            {[0,60,120,180].map((seg, i) => {
              const x = interpolate(seg, [0,180], [100,1750]);
              return <React.Fragment key={i}>
                <line x1={x} y1={150} x2={x} y2={750} stroke="rgba(255,255,255,0.1)" strokeWidth={1} strokeDasharray="8 8" />
                <text x={x} y={140} fill="rgba(255,255,255,0.3)" fontSize={16} fontFamily={FONT_STACK.mono} textAnchor="middle">f={seg}</text>
              </React.Fragment>;
            })}
            {/* Segment labels */}
            <text x={400} y={770} fill={C.cyan} fontSize={14} fontFamily={FONT_STACK.mono} textAnchor="middle">ease-out cubic</text>
            <text x={950} y={770} fill={C.pink} fontSize={14} fontFamily={FONT_STACK.mono} textAnchor="middle">ease-in-out</text>
            <text x={1475} y={770} fill={C.lime} fontSize={14} fontFamily={FONT_STACK.mono} textAnchor="middle">ease-in cubic</text>

            {/* Trail for array easing */}
            {Array.from({length: Math.min(localFrame, 180)}, (_, f) => {
              const tx = interpolate(f, [0,60,120,180], [100,700,1200,1750], {
                easing:[Easing.out(Easing.cubic), Easing.inOut(Easing.ease), Easing.in(Easing.cubic)],
                extrapolateRight:'clamp',
              });
              const ty = interpolate(f, [0,60,120,180], [500,300,650,400], {
                easing:[Easing.out(Easing.bounce), Easing.inOut(Easing.ease), Easing.out(Easing.elastic(1))],
                extrapolateRight:'clamp',
              });
              return <circle key={f} cx={tx} cy={ty-100} r={2} fill={C.cyan} opacity={0.15 + (f/180)*0.3} />;
            })}

            {/* Main ball */}
            <circle cx={ballX} cy={ballY-100} r={18} fill={C.cyan}
              filter="url(#glow)" />
            <text x={ballX} y={ballY-130} fill="white" fontSize={14} fontFamily={FONT_STACK.mono} textAnchor="middle">Array Easing</text>

            {/* Linear comparison */}
            <circle cx={linearX} cy={linearY-100} r={12} fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
            <text x={linearX} y={linearY-125} fill="rgba(255,255,255,0.3)" fontSize={12} fontFamily={FONT_STACK.mono} textAnchor="middle">Linear</text>

            <defs>
              <filter id="glow"><feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
          </svg>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ════════════════════════════════════════
   SCENE 3: PRESERVES PITCH
   ════════════════════════════════════════ */
const PreservesPitchScene: React.FC = () => {
  const frame = useCurrentFrame();
  const sTitle = spring({frame, fps:30, config:{damping:14}});

  const rates = [
    {rate: 0.5, label: '0.5x Slow', color: C.accent, preserves: true},
    {rate: 1.0, label: '1.0x Normal', color: C.cyan, preserves: true},
    {rate: 2.0, label: '2.0x Fast', color: C.pink, preserves: true},
    {rate: 2.0, label: '2.0x No Preserve', color: C.orange, preserves: false},
  ];

  return (
    <AbsoluteFill>
      <GridBG color={C.pink} />
      <Particles />
      <AbsoluteFill style={{padding:80}}>
        <div style={{display:'flex', alignItems:'center', gap:20, marginBottom:10,
          transform:`translateX(${interpolate(sTitle,[0,1],[-100,0])}px)`, opacity:sTitle}}>
          <div style={{width:8, height:50, borderRadius:4, background:C.pink}} />
          <span style={{fontSize:24, fontFamily:FONT_STACK.mono, color:C.pink, letterSpacing:4}}>FEATURE 02</span>
        </div>
        <div style={{fontSize:72, fontFamily:getFontForScene(3), color:'white', marginBottom:10, marginLeft:28,
          transform:`translateX(${interpolate(sTitle,[0,1],[-80,0])}px)`, opacity:sTitle}}>
          preservesPitch Prop
        </div>
        <div style={{fontSize:24, fontFamily:FONT_STACK.body, color:'rgba(255,255,255,0.5)', marginLeft:28, marginBottom:50,
          opacity: interpolate(frame,[15,30],[0,1],{extrapolateRight:'clamp'})}}>
          Control audio pitch independently from playback speed
        </div>

        <div style={{display:'flex', gap:30, marginLeft:28, flexWrap:'wrap'}}>
          {rates.map((r, i) => {
            const delay = i * 12;
            const cardS = spring({frame: Math.max(0, frame - delay), fps:30, config:{damping:12}});
            const wave = Array.from({length: 40}, (_, w) => {
              const freq = r.preserves ? 1 : r.rate;
              const amp = 20 + Math.sin(frame/8 + w*0.3*freq) * 15;
              return `${w * 10},${50 - amp * Math.sin((frame + w * 5) * 0.05 * r.rate * freq)}`;
            }).join(' ');

            return (
              <GlassCard key={i} style={{width:390, transform:`scale(${interpolate(cardS,[0,1],[0.8,1])}) translateY(${interpolate(cardS,[0,1],[30,0])}px)`,
                opacity:cardS, borderColor: `${r.color}33`}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
                  <span style={{fontSize:28, fontWeight:800, color:'white', fontFamily:FONT_STACK.body}}>{r.label}</span>
                  <span style={{fontSize:14, fontFamily:FONT_STACK.mono, color: r.preserves ? C.lime : C.orange,
                    padding:'4px 12px', borderRadius:20, background: r.preserves ? `${C.lime}22` : `${C.orange}22`,
                    border:`1px solid ${r.preserves ? C.lime : C.orange}44`}}>
                    {r.preserves ? '✓ pitch preserved' : '✗ pitch shifted'}
                  </span>
                </div>
                <svg width="100%" height={60} viewBox="0 0 400 100" preserveAspectRatio="none">
                  <polyline points={wave} fill="none" stroke={r.color} strokeWidth={2.5} strokeLinecap="round" />
                </svg>
                <pre style={{fontFamily:FONT_STACK.mono, fontSize:13, color:'rgba(255,255,255,0.5)', marginTop:15, margin:0}}>
{`<Video playbackRate={${r.rate}}\n  preservesPitch={${r.preserves}} />`}
                </pre>
              </GlassCard>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ════════════════════════════════════════
   SCENE 4: HIDDEN SEQUENCE
   ════════════════════════════════════════ */
const HiddenSequenceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const sTitle = spring({frame, fps:30, config:{damping:14}});

  const sequences = [
    {name: 'Intro', color: C.accent, from: 0, dur: 90, hidden: false},
    {name: 'Chapter 1', color: C.cyan, from: 90, dur: 150, hidden: false},
    {name: 'Debug Layer', color: C.orange, from: 0, dur: 240, hidden: true},
    {name: 'Chapter 2', color: C.pink, from: 240, dur: 120, hidden: false},
    {name: 'Test Overlay', color: '#ef4444', from: 120, dur: 180, hidden: true},
    {name: 'Outro', color: C.lime, from: 360, dur: 90, hidden: false},
  ];

  const toggleFrame = 90;
  const isToggled = frame > toggleFrame;

  return (
    <AbsoluteFill>
      <GridBG color={C.lime} />
      <Particles />
      <AbsoluteFill style={{padding:80}}>
        <div style={{display:'flex', alignItems:'center', gap:20, marginBottom:10,
          transform:`translateX(${interpolate(sTitle,[0,1],[-100,0])}px)`, opacity:sTitle}}>
          <div style={{width:8, height:50, borderRadius:4, background:C.lime}} />
          <span style={{fontSize:24, fontFamily:FONT_STACK.mono, color:C.lime, letterSpacing:4}}>FEATURE 03</span>
        </div>
        <div style={{fontSize:72, fontFamily:getFontForScene(5), color:'white', marginBottom:10, marginLeft:28,
          transform:`translateX(${interpolate(sTitle,[0,1],[-80,0])}px)`, opacity:sTitle}}>
          Hidden Sequence Prop
        </div>
        <div style={{fontSize:24, fontFamily:FONT_STACK.body, color:'rgba(255,255,255,0.5)', marginLeft:28, marginBottom:40,
          opacity: interpolate(frame,[15,30],[0,1],{extrapolateRight:'clamp'})}}>
          Toggle sequence visibility in Studio timeline — perfect for debug layers
        </div>

        <div style={{display:'flex', gap:50, marginLeft:28}}>
          {/* Timeline mockup */}
          <GlassCard style={{flex:1, opacity: interpolate(frame,[20,40],[0,1],{extrapolateRight:'clamp'})}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:25}}>
              <span style={{fontSize:20, fontFamily:FONT_STACK.mono, color:'rgba(255,255,255,0.5)'}}>STUDIO TIMELINE</span>
              <span style={{fontSize:14, fontFamily:FONT_STACK.mono, color: isToggled ? C.lime : C.orange,
                padding:'6px 16px', borderRadius:20, background: isToggled ? `${C.lime}22` : `${C.orange}22`}}>
                {isToggled ? 'hidden=true applied' : 'all visible'}
              </span>
            </div>
            {sequences.map((seq, i) => {
              const isHidden = isToggled && seq.hidden;
              const barW = (seq.dur / 450) * 100;
              const barL = (seq.from / 450) * 100;
              const fadeOut = isHidden ? interpolate(frame, [toggleFrame, toggleFrame+20], [1, 0.15], {extrapolateLeft:'clamp', extrapolateRight:'clamp'}) : 1;

              return (
                <div key={i} style={{display:'flex', alignItems:'center', gap:15, marginBottom:12, opacity:fadeOut,
                  transition:'opacity 0.3s'}}>
                  <div style={{width:20, height:20, display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:14, cursor:'pointer'}}>
                    {isHidden ? '👁️‍🗨️' : '👁️'}
                  </div>
                  <span style={{width:120, fontSize:14, fontFamily:FONT_STACK.mono, color: seq.hidden ? C.orange : 'white',
                    textDecoration: isHidden ? 'line-through' : 'none'}}>{seq.name}</span>
                  <div style={{flex:1, height:28, background:'rgba(255,255,255,0.05)', borderRadius:6, position:'relative'}}>
                    <div style={{position:'absolute', left:`${barL}%`, width:`${barW}%`, height:'100%',
                      background: isHidden ? `${seq.color}33` : seq.color, borderRadius:6,
                      border: seq.hidden ? `1px dashed ${seq.color}` : 'none',
                      display:'flex', alignItems:'center', paddingLeft:8}}>
                      <span style={{fontSize:11, fontFamily:FONT_STACK.mono, color: isHidden ? 'transparent' : 'rgba(0,0,0,0.7)', fontWeight:700}}>
                        {seq.dur}f
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </GlassCard>

          {/* Code example */}
          <GlassCard style={{width:420, opacity: interpolate(frame,[35,55],[0,1],{extrapolateRight:'clamp'}),
            transform:`translateX(${interpolate(frame,[35,55],[30,0],{extrapolateRight:'clamp'})}px)`}}>
            <div style={{fontSize:16, fontFamily:FONT_STACK.mono, color:'rgba(255,255,255,0.4)', marginBottom:15}}>Usage:</div>
            <pre style={{fontFamily:FONT_STACK.mono, fontSize:15, color:'white', margin:0, lineHeight:1.8}}>
{`<Sequence from={0}
  durationInFrames={240}
  `}<span style={{color:C.lime}}>hidden</span>{`={true}
  name="Debug Layer"
>
  <DebugOverlay />
</Sequence>`}
            </pre>
            <div style={{marginTop:25, padding:'15px 20px', background:`${C.lime}11`, borderRadius:12, border:`1px solid ${C.lime}33`}}>
              <span style={{fontSize:14, fontFamily:FONT_STACK.body, color:C.lime}}>
                💡 Toggle via Studio timeline eye icon — persists across reloads
              </span>
            </div>
          </GlassCard>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ════════════════════════════════════════
   SCENE 5: OUTRO
   ════════════════════════════════════════ */
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const s = spring({frame, fps:30, config:{damping:10}});
  const pulse = 0.5 + Math.sin(frame/8)*0.3;
  return (
    <AbsoluteFill>
      <GridBG color={C.accent} />
      <Particles />
      <AbsoluteFill style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <div style={{fontSize:100, fontFamily:FONT_STACK.impact, color:'white',
          transform:`scale(${interpolate(s,[0,1],[0.5,1])})`, opacity:s,
          textShadow:`0 0 ${40*pulse}px ${C.accent}`}}>
          UPGRADED ✓
        </div>
        <div style={{fontSize:36, fontFamily:FONT_STACK.body, color:'rgba(255,255,255,0.6)', marginTop:20,
          opacity: interpolate(frame,[20,40],[0,1],{extrapolateRight:'clamp'})}}>
          Remotion 4.0.463 • Ready to create
        </div>
        <div style={{display:'flex', gap:20, marginTop:40,
          opacity: interpolate(frame,[30,50],[0,1],{extrapolateRight:'clamp'})}}>
          {['Array Easing ✓','preservesPitch ✓','Hidden Sequences ✓'].map((t,i) => (
            <div key={i} style={{padding:'12px 24px', borderRadius:12, background:C.glass,
              border:'1px solid rgba(255,255,255,0.15)', fontFamily:FONT_STACK.mono, fontSize:16, color:C.cyan}}>
              {t}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ════════════════════════════════════════
   MAIN COMPOSITION
   ════════════════════════════════════════ */
export const UpgradeShowcase: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <style>{FONT_IMPORT}</style>

      {/* Scene 1: Intro — 0 to 120 (4s) */}
      <Sequence from={0} durationInFrames={120} name="Intro">
        <IntroScene />
      </Sequence>

      {/* Scene 2: Array Easing — 120 to 330 (7s) */}
      <Sequence from={120} durationInFrames={210} name="Array Easing Demo">
        <ArrayEasingScene />
      </Sequence>

      {/* Scene 3: preservesPitch — 330 to 510 (6s) */}
      <Sequence from={330} durationInFrames={180} name="PreservesPitch Demo">
        <PreservesPitchScene />
      </Sequence>

      {/* Scene 4: Hidden Sequence — 510 to 690 (6s) */}
      <Sequence from={510} durationInFrames={180} name="Hidden Sequence Demo">
        <HiddenSequenceScene />
      </Sequence>

      {/* Scene 5: Outro — 690 to 810 (4s) */}
      <Sequence from={690} durationInFrames={120} name="Outro">
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
