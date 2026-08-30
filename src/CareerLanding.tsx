import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Sequence } from 'remotion';

const FONT = "'Inter', sans-serif";
const DISPLAY = "'Bebas Neue', cursive";
const SERIF = "'Playfair Display', serif";
const MONO = "'Space Mono', monospace";

const C = {
  navy: '#0A0E27', deepPurple: '#1A0B3E', teal: '#00D4AA', gold: '#FFB800',
  coral: '#FF6B6B', sky: '#38BDF8', violet: '#8B5CF6', pink: '#EC4899',
  emerald: '#10B981', white: '#FFFFFF', gray: '#94A3B8', slate: '#1E293B',
  indigo: '#6366F1', amber: '#F59E0B', rose: '#F43F5E',
};

const Grid: React.FC = () => (
  <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize:'80px 80px', pointerEvents:'none' }} />
);

const GlassCard: React.FC<{children: React.ReactNode; style?: React.CSSProperties; delay?: number}> = ({children, style, delay=0}) => {
  const frame = useCurrentFrame();
  const a = spring({frame: frame - delay, fps:30});
  return (
    <div style={{ background:'rgba(255,255,255,0.06)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:24, padding:'40px 35px', transform:`scale(${a}) translateY(${interpolate(a,[0,1],[40,0])}px)`, opacity:a, boxShadow:'0 20px 60px rgba(0,0,0,0.3)', ...style }}>
      {children}
    </div>
  );
};

const FloatingOrb: React.FC<{x:number; y:number; size:number; color:string; speed?:number}> = ({x,y,size,color,speed=1}) => {
  const frame = useCurrentFrame();
  const dx = Math.sin(frame / (40*speed)) * 30;
  const dy = Math.cos(frame / (50*speed)) * 20;
  return <div style={{ position:'absolute', left:x+dx, top:y+dy, width:size, height:size, borderRadius:'50%', background:`radial-gradient(circle, ${color}44 0%, transparent 70%)`, filter:'blur(30px)', pointerEvents:'none' }} />;
};

// ─── HERO SECTION ───
const HeroSection: React.FC = () => {
  const frame = useCurrentFrame();
  const titleA = spring({frame, fps:30, config:{damping:12}});
  const subA = spring({frame: frame-15, fps:30});
  const btnA = spring({frame: frame-30, fps:30});
  const pulse = Math.sin(frame/20)*0.03+1;
  return (
    <AbsoluteFill style={{ background:`linear-gradient(135deg, ${C.navy} 0%, ${C.deepPurple} 50%, #0F172A 100%)` }}>
      <Grid />
      <FloatingOrb x={100} y={80} size={400} color={C.violet} speed={0.8} />
      <FloatingOrb x={1400} y={500} size={350} color={C.teal} speed={1.2} />
      <FloatingOrb x={800} y={200} size={300} color={C.pink} speed={0.6} />
      {/* Nav */}
      <div style={{ position:'absolute', top:0, width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', padding:'30px 80px', zIndex:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <svg width={44} height={44} viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm0 12.53L5.74 12l6.26-3.43L18.26 12 12 15.53z" fill={C.teal}/></svg>
          <span style={{ fontSize:32, fontFamily:DISPLAY, color:C.white, letterSpacing:3 }}>CAREERLAUNCH</span>
        </div>
        <div style={{ display:'flex', gap:40 }}>
          {['Courses','Mock Interviews','Tips','About'].map((t,i) => (
            <span key={i} style={{ fontSize:18, color:'rgba(255,255,255,0.7)', fontFamily:FONT, fontWeight:600, letterSpacing:1 }}>{t}</span>
          ))}
        </div>
      </div>
      {/* Title */}
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:`translate(-50%,-50%)`, textAlign:'center', width:'85%' }}>
        <div style={{ fontSize:22, fontFamily:MONO, color:C.teal, letterSpacing:6, marginBottom:30, opacity:subA, textTransform:'uppercase' }}>Your Career Starts Here</div>
        <div style={{ fontSize:120, fontFamily:DISPLAY, color:C.white, lineHeight:0.95, transform:`scale(${interpolate(titleA,[0,1],[0.6,1])})`, opacity:titleA, textShadow:'0 0 60px rgba(139,92,246,0.3)' }}>
          MASTER YOUR<br/><span style={{ background:`linear-gradient(90deg, ${C.teal}, ${C.violet}, ${C.pink})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>DREAM CAREER</span>
        </div>
        <div style={{ fontSize:28, fontFamily:FONT, color:'rgba(255,255,255,0.6)', marginTop:30, fontWeight:500, opacity:subA, maxWidth:900, margin:'30px auto 0' }}>
          Expert-led courses, mock interviews, and career guidance to land your dream job
        </div>
        <div style={{ display:'flex', gap:20, justifyContent:'center', marginTop:50, opacity:btnA, transform:`translateY(${interpolate(btnA,[0,1],[30,0])}px)` }}>
          <div style={{ padding:'18px 50px', borderRadius:16, background:`linear-gradient(135deg, ${C.teal}, ${C.emerald})`, fontSize:20, fontWeight:800, color:C.navy, fontFamily:FONT, transform:`scale(${pulse})`, boxShadow:`0 0 40px ${C.teal}44` }}>Start Learning Free</div>
          <div style={{ padding:'18px 50px', borderRadius:16, border:`2px solid ${C.violet}`, fontSize:20, fontWeight:700, color:C.violet, fontFamily:FONT, background:'rgba(139,92,246,0.1)' }}>Watch Demo</div>
        </div>
      </div>
      {/* Stats bar */}
      <div style={{ position:'absolute', bottom:50, width:'100%', display:'flex', justifyContent:'center', gap:80 }}>
        {[{n:'50K+', l:'Students'},{n:'200+', l:'Courses'},{n:'95%', l:'Success Rate'},{n:'4.9★', l:'Rating'}].map((s,i) => {
          const sa = spring({frame:frame-40-i*8, fps:30});
          const count = Math.round(interpolate(sa,[0,1],[0,1]) * parseInt(s.n) || 0);
          return (
            <div key={i} style={{ textAlign:'center', opacity:sa, transform:`translateY(${interpolate(sa,[0,1],[20,0])}px)` }}>
              <div style={{ fontSize:42, fontFamily:DISPLAY, color:C.teal }}>{s.n}</div>
              <div style={{ fontSize:16, color:C.gray, fontFamily:FONT, fontWeight:600, marginTop:4 }}>{s.l}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ─── COURSES SECTION ───
const CoursesSection: React.FC = () => {
  const frame = useCurrentFrame();
  const ta = spring({frame, fps:30});
  const courses = [
    {title:'Full-Stack Development', icon:'💻', color:C.teal, students:'12K', rating:'4.9', level:'Advanced'},
    {title:'Data Science & AI', icon:'🤖', color:C.violet, students:'8.5K', rating:'4.8', level:'Intermediate'},
    {title:'UI/UX Design Mastery', icon:'🎨', color:C.pink, students:'6.2K', rating:'4.9', level:'All Levels'},
    {title:'Cloud Architecture', icon:'☁️', color:C.sky, students:'5.1K', rating:'4.7', level:'Advanced'},
  ];
  return (
    <AbsoluteFill style={{ background:`linear-gradient(180deg, #0F172A 0%, ${C.deepPurple} 100%)` }}>
      <Grid />
      <FloatingOrb x={200} y={300} size={250} color={C.teal} />
      <FloatingOrb x={1500} y={100} size={300} color={C.violet} />
      <div style={{ position:'absolute', top:80, width:'100%', textAlign:'center' }}>
        <div style={{ fontSize:20, fontFamily:MONO, color:C.amber, letterSpacing:5, opacity:ta }}>POPULAR COURSES</div>
        <div style={{ fontSize:90, fontFamily:DISPLAY, color:C.white, marginTop:10, transform:`scale(${interpolate(ta,[0,1],[0.7,1])})`, opacity:ta }}>LEARN FROM THE BEST</div>
      </div>
      <div style={{ position:'absolute', top:280, width:'100%', display:'flex', justifyContent:'center', gap:30, padding:'0 60px' }}>
        {courses.map((c,i) => (
          <GlassCard key={i} delay={i*10} style={{ width:380, textAlign:'center' }}>
            <div style={{ fontSize:70, marginBottom:15 }}>{c.icon}</div>
            <div style={{ fontSize:28, fontWeight:800, color:C.white, fontFamily:FONT, marginBottom:8 }}>{c.title}</div>
            <div style={{ fontSize:14, color:c.color, fontWeight:700, letterSpacing:2, marginBottom:20 }}>{c.level}</div>
            <div style={{ width:'100%', height:1, background:'rgba(255,255,255,0.1)', marginBottom:20 }} />
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontSize:16, color:C.gray }}>👥 {c.students}</span>
              <span style={{ fontSize:16, color:C.amber }}>⭐ {c.rating}</span>
            </div>
            <div style={{ marginTop:20, padding:'12px 0', borderRadius:12, background:`linear-gradient(135deg, ${c.color}22, ${c.color}11)`, border:`1px solid ${c.color}33`, fontSize:16, fontWeight:700, color:c.color }}>Enroll Now →</div>
          </GlassCard>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── MOCK INTERVIEW SECTION ───
const MockInterviewSection: React.FC = () => {
  const frame = useCurrentFrame();
  const ta = spring({frame, fps:30});
  const typing = interpolate(frame,[0,90],[0,1],{extrapolateRight:'clamp'});
  const question = "Tell me about a time you led a challenging project...";
  const chars = Math.floor(typing * question.length);
  const cursor = frame % 16 < 10;
  return (
    <AbsoluteFill style={{ background:`linear-gradient(135deg, #0C0A1D 0%, #1A0B3E 50%, #0D1B2A 100%)` }}>
      <Grid />
      <FloatingOrb x={100} y={600} size={350} color={C.coral} speed={0.7} />
      <FloatingOrb x={1300} y={200} size={280} color={C.indigo} />
      {/* Left side */}
      <div style={{ position:'absolute', left:80, top:'50%', transform:'translateY(-50%)', width:'45%' }}>
        <div style={{ fontSize:20, fontFamily:MONO, color:C.coral, letterSpacing:5, opacity:ta }}>AI-POWERED</div>
        <div style={{ fontSize:85, fontFamily:DISPLAY, color:C.white, lineHeight:0.95, marginTop:15, transform:`translateX(${interpolate(ta,[0,1],[-80,0])}px)`, opacity:ta }}>MOCK<br/>INTERVIEWS</div>
        <div style={{ fontSize:22, color:'rgba(255,255,255,0.6)', fontFamily:FONT, marginTop:25, lineHeight:1.6, fontWeight:400, opacity:spring({frame:frame-15,fps:30}) }}>
          Practice with AI interviewers trained on real company questions. Get instant feedback on your answers.
        </div>
        <div style={{ display:'flex', gap:30, marginTop:40 }}>
          {[{n:'500+',l:'Questions'},{n:'50+',l:'Companies'},{n:'Real-time',l:'Feedback'}].map((s,i) => (
            <div key={i} style={{ opacity:spring({frame:frame-25-i*8,fps:30}) }}>
              <div style={{ fontSize:32, fontFamily:DISPLAY, color:C.coral }}>{s.n}</div>
              <div style={{ fontSize:14, color:C.gray, fontWeight:600 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Right side - Interview simulator mockup */}
      <div style={{ position:'absolute', right:80, top:'50%', transform:'translateY(-50%)', width:'45%' }}>
        <GlassCard delay={10} style={{ padding:'0', overflow:'hidden' }}>
          <div style={{ height:50, background:'rgba(255,255,255,0.05)', borderBottom:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', padding:'0 20px', gap:8 }}>
            <div style={{ width:12, height:12, borderRadius:'50%', background:'#FF5F57' }} />
            <div style={{ width:12, height:12, borderRadius:'50%', background:'#FEBC2E' }} />
            <div style={{ width:12, height:12, borderRadius:'50%', background:'#28C840' }} />
            <span style={{ flex:1, textAlign:'center', fontSize:14, color:C.gray }}>Interview Simulator</span>
          </div>
          <div style={{ padding:30 }}>
            <div style={{ display:'flex', gap:15, marginBottom:25 }}>
              <div style={{ width:50, height:50, borderRadius:'50%', background:`linear-gradient(135deg, ${C.violet}, ${C.pink})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>🤖</div>
              <div style={{ flex:1, background:'rgba(139,92,246,0.1)', borderRadius:'4px 16px 16px 16px', padding:'15px 20px', border:'1px solid rgba(139,92,246,0.2)' }}>
                <div style={{ fontSize:14, color:C.violet, fontWeight:700, marginBottom:8 }}>AI Interviewer</div>
                <div style={{ fontSize:18, color:C.white, fontFamily:FONT, lineHeight:1.5 }}>
                  {question.slice(0,chars)}{cursor && <span style={{ color:C.violet }}>|</span>}
                </div>
              </div>
            </div>
            {frame > 100 && (
              <div style={{ display:'flex', gap:10, flexWrap:'wrap', opacity:spring({frame:frame-100,fps:30}) }}>
                {['Behavioral','Technical','System Design','Leadership'].map((t,i) => (
                  <div key={i} style={{ padding:'8px 18px', borderRadius:20, background:`${C.teal}15`, border:`1px solid ${C.teal}33`, fontSize:14, color:C.teal, fontWeight:600 }}>{t}</div>
                ))}
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </AbsoluteFill>
  );
};

// ─── TIPS & GUIDANCE SECTION ───
const TipsSection: React.FC = () => {
  const frame = useCurrentFrame();
  const ta = spring({frame, fps:30});
  const tips = [
    {icon:'📝', title:'Resume Building', desc:'ATS-optimized templates & expert reviews', color:C.emerald},
    {icon:'🎯', title:'Career Roadmaps', desc:'Personalized learning paths for every role', color:C.amber},
    {icon:'🗣️', title:'Communication Skills', desc:'Master professional communication', color:C.sky},
    {icon:'💼', title:'Salary Negotiation', desc:'Data-driven negotiation strategies', color:C.rose},
    {icon:'🌐', title:'Networking Guide', desc:'Build meaningful professional connections', color:C.violet},
    {icon:'📊', title:'Industry Insights', desc:'Stay ahead with market trends & analysis', color:C.teal},
  ];
  return (
    <AbsoluteFill style={{ background:`linear-gradient(180deg, #0D1B2A 0%, ${C.navy} 100%)` }}>
      <Grid />
      <FloatingOrb x={900} y={500} size={400} color={C.emerald} speed={0.5} />
      <div style={{ position:'absolute', top:60, width:'100%', textAlign:'center' }}>
        <div style={{ fontSize:20, fontFamily:MONO, color:C.emerald, letterSpacing:5, opacity:ta }}>CAREER GUIDANCE</div>
        <div style={{ fontSize:85, fontFamily:DISPLAY, color:C.white, marginTop:10, opacity:ta, transform:`scale(${interpolate(ta,[0,1],[0.7,1])})` }}>TIPS THAT <span style={{ color:C.amber }}>WORK</span></div>
      </div>
      <div style={{ position:'absolute', top:260, width:'100%', display:'flex', flexWrap:'wrap', justifyContent:'center', gap:25, padding:'0 100px' }}>
        {tips.map((t,i) => (
          <GlassCard key={i} delay={i*8} style={{ width:520, display:'flex', gap:20, alignItems:'center', padding:'30px 35px' }}>
            <div style={{ width:70, height:70, borderRadius:18, background:`${t.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, flexShrink:0, border:`1px solid ${t.color}33` }}>{t.icon}</div>
            <div>
              <div style={{ fontSize:24, fontWeight:800, color:C.white, fontFamily:FONT }}>{t.title}</div>
              <div style={{ fontSize:16, color:'rgba(255,255,255,0.5)', marginTop:6, fontWeight:500 }}>{t.desc}</div>
            </div>
          </GlassCard>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── TESTIMONIALS SECTION ───
const TestimonialsSection: React.FC = () => {
  const frame = useCurrentFrame();
  const ta = spring({frame, fps:30});
  const testimonials = [
    {name:'Priya Sharma', role:'Software Engineer @ Google', text:'The mock interviews were game-changers. I felt completely prepared!', color:C.teal},
    {name:'Rahul Menon', role:'Data Scientist @ Amazon', text:'Best career platform I have used. The courses are incredibly practical.', color:C.violet},
    {name:'Ananya Reddy', role:'Product Manager @ Microsoft', text:'From zero experience to PM at Microsoft. This platform made it possible.', color:C.pink},
  ];
  return (
    <AbsoluteFill style={{ background:`linear-gradient(135deg, ${C.deepPurple} 0%, #0C0A1D 100%)` }}>
      <Grid />
      <FloatingOrb x={200} y={200} size={300} color={C.gold} speed={0.9} />
      <FloatingOrb x={1400} y={600} size={250} color={C.violet} />
      <div style={{ position:'absolute', top:100, width:'100%', textAlign:'center' }}>
        <div style={{ fontSize:20, fontFamily:MONO, color:C.gold, letterSpacing:5, opacity:ta }}>SUCCESS STORIES</div>
        <div style={{ fontSize:85, fontFamily:SERIF, color:C.white, marginTop:15, opacity:ta, fontStyle:'italic' }}>Our Students Shine</div>
      </div>
      <div style={{ position:'absolute', top:320, width:'100%', display:'flex', justifyContent:'center', gap:35, padding:'0 80px' }}>
        {testimonials.map((t,i) => (
          <GlassCard key={i} delay={i*12} style={{ width:500, textAlign:'center' }}>
            <div style={{ width:70, height:70, borderRadius:'50%', background:`linear-gradient(135deg, ${t.color}, ${t.color}88)`, margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:30, color:C.white, fontWeight:900, fontFamily:FONT }}>{t.name[0]}</div>
            <div style={{ fontSize:20, color:'rgba(255,255,255,0.7)', fontFamily:SERIF, fontStyle:'italic', lineHeight:1.6, marginBottom:25 }}>"{t.text}"</div>
            <div style={{ width:40, height:3, background:t.color, margin:'0 auto 15px', borderRadius:2 }} />
            <div style={{ fontSize:20, fontWeight:800, color:C.white }}>{t.name}</div>
            <div style={{ fontSize:15, color:t.color, fontWeight:600, marginTop:5 }}>{t.role}</div>
          </GlassCard>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── CTA / FOOTER SECTION ───
const CTASection: React.FC = () => {
  const frame = useCurrentFrame();
  const ta = spring({frame, fps:30, config:{damping:10}});
  const pulse = Math.sin(frame/15)*0.04+1;
  const shimmer = interpolate(frame % 120, [0,120], [-200,1200]);
  return (
    <AbsoluteFill style={{ background:`linear-gradient(135deg, ${C.navy} 0%, ${C.deepPurple} 50%, #1A0B3E 100%)` }}>
      <Grid />
      <FloatingOrb x={300} y={300} size={500} color={C.teal} speed={0.4} />
      <FloatingOrb x={1200} y={400} size={400} color={C.violet} speed={0.6} />
      <FloatingOrb x={700} y={100} size={300} color={C.pink} speed={0.8} />
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center', width:'80%' }}>
        <div style={{ fontSize:130, fontFamily:DISPLAY, color:C.white, lineHeight:0.9, opacity:ta, transform:`scale(${interpolate(ta,[0,1],[0.5,1])})` }}>
          YOUR FUTURE<br/><span style={{ background:`linear-gradient(90deg, ${C.teal}, ${C.gold}, ${C.pink})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>STARTS TODAY</span>
        </div>
        <div style={{ fontSize:26, color:'rgba(255,255,255,0.6)', fontFamily:FONT, marginTop:35, fontWeight:500, opacity:spring({frame:frame-15,fps:30}) }}>
          Join 50,000+ professionals who transformed their careers
        </div>
        <div style={{ display:'inline-block', marginTop:50, padding:'22px 70px', borderRadius:20, background:`linear-gradient(135deg, ${C.teal}, ${C.emerald})`, fontSize:26, fontWeight:900, color:C.navy, fontFamily:FONT, transform:`scale(${pulse})`, opacity:spring({frame:frame-25,fps:30}), boxShadow:`0 0 60px ${C.teal}44`, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:0, left:shimmer, width:100, height:'100%', background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', transform:'skewX(-20deg)' }} />
          Get Started — It's Free
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══ MAIN COMPOSITION ═══
export const CareerLanding: React.FC = () => {
  const SECTION = 150; // 5 seconds per section
  return (
    <AbsoluteFill style={{ backgroundColor:C.navy, fontFamily:FONT }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Caveat:wght@400;700&family=Inter:wght@400;500;600;700;800;900&family=Nunito:wght@400;700;900&family=Oswald:wght@400;700&family=Playfair+Display:wght@400;700;900&family=Space+Mono:wght@400;700&display=swap');`}</style>
      <Sequence durationInFrames={SECTION}><HeroSection /></Sequence>
      <Sequence from={SECTION} durationInFrames={SECTION}><CoursesSection /></Sequence>
      <Sequence from={SECTION*2} durationInFrames={SECTION}><MockInterviewSection /></Sequence>
      <Sequence from={SECTION*3} durationInFrames={SECTION}><TipsSection /></Sequence>
      <Sequence from={SECTION*4} durationInFrames={SECTION}><TestimonialsSection /></Sequence>
      <Sequence from={SECTION*5} durationInFrames={SECTION}><CTASection /></Sequence>
    </AbsoluteFill>
  );
};
