---
description: Create a premium explainer video with voiceover, SVGs, data viz, and SFX
---

# Premium Video Creation Workflow

## ⚠️ CRITICAL RULE: NO TEMPLATES — EVERY VIDEO IS UNIQUE

**Each premium video MUST have its own visual DNA.** Never reuse the same layout patterns, color schemes, or visual components across videos. Before building ANY scene, ask:

1. **What is the TOPIC's visual world?** A tech story should feel like tech. A geopolitical story should feel like news. A finance story should feel like Bloomberg.
2. **What BRAND or PRODUCT is involved?** Use their actual colors, typography, and UI patterns as the foundation.
3. **What UNIQUE custom components does THIS video need?** Every video should have 3-5 components that ONLY exist for that topic.

### Topic-Specific Visual Identity Checklist:
- [ ] **Unique color palette** derived from the topic/brand (NOT navy+red every time)
- [ ] **3-5 custom SVG components** that only make sense for THIS topic
- [ ] **Topic-authentic UI mockups** (social media posts, dashboards, terminals, chat interfaces)
- [ ] **Unique transition style** (glitch for tech, paper-tear for news, data-stream for finance)
- [ ] **Varied layouts** — NOT always centered. Use asymmetric, split, layered, sidebar compositions
- [ ] **Scene variety** — never repeat the same scene type more than twice
- [ ] **Custom animations** matching the story's energy (urgent=fast cuts, thoughtful=slow reveals)

### Visual Identity Examples By Category:

| Topic Category | Visual DNA | Custom Components | Color World |
|---|---|---|---|
| **Tech/AI** | Terminal aesthetics, code fonts, chat UIs, neural nets | CLI mockup, chat interface, model comparison cards | Brand colors + dark mode |
| **Geopolitical** | News broadcast, maps, satellite views, diplomatic tables | World map SVG, flag overlays, negotiation table | Deep navy + nation colors |
| **Finance** | Bloomberg terminal, candlestick charts, ticker tape | Stock dashboard, portfolio cards, market depth | Green/red + dark charcoal |
| **Science** | Lab aesthetics, molecular diagrams, data plots | Molecular SVG, experiment timeline, peer review cards | Clinical white + accent |
| **Social/Culture** | Social media UIs, meme aesthetics, comment threads | Platform mockups, viral metrics, engagement charts | Platform brand colors |
| **Product Demo** | Product's actual UI, feature cards, comparison grids | App screenshot mockup, feature highlight, pricing table | Product's brand palette |

### BANNED Patterns (things that make videos feel "template-y"):
- ❌ Using `BigTitle → Callout → StickFigure → BarChart` in every video
- ❌ Navy background with grid overlay as the default for everything
- ❌ Same centered layout for every scene
- ❌ Generic stick figures when the topic demands specific character representations
- ❌ Reusing the exact same component structure from a previous video
- ❌ Same news ticker style across different topic categories

## User Preferences (John's Standard)

### Visual Style
- **Full-bleed backgrounds** — vibrant, topic-appropriate colors — NO plain white or black
- **NO flashing** — smooth spring-physics transitions only
- **Gradient backgrounds** with topic-appropriate color combinations
- **Glassmorphism** on cards and panels (frosted glass with backdrop-blur)
- **Visual changes every 2-4 seconds** — never static

### Typography (DYNAMIC — rotate per scene)
Import ALL fonts from `PremiumKit.tsx` using `FONT_IMPORT`. Rotate fonts across scenes using `getFontForScene(sceneIndex)`:
- **Bebas Neue** — Bold aggressive titles
- **Inter** — Clean modern body text
- **Playfair Display** — Luxury/editorial headers
- **Space Mono** — Code/tech/data sections
- **Oswald** — Condensed impactful headlines
- **Nunito** — Friendly rounded text
- **Caveat** — Handwritten annotations/notes
- **Anton** — Ultra-bold impact statements

Rule: **Never use the same font for 2 consecutive scenes.** Mix for contrast.

### Data Visualization (Topic-Appropriate)
Choose visualizations that MATCH the topic:
- **SVG animations** with strokeDashoffset drawing effects
- **Animated bar/donut/line charts** for data-heavy topics
- **Dashboard mockups** that match the topic's world (Bloomberg for finance, IAEA for nuclear, etc.)
- **Count-up animations** for big numbers
- **Typing simulations** for tech/chat topics
- **Custom UI mockups** that look like real products

### Callouts (Sparingly — from PremiumKit.tsx)
Use **CalloutScene** or **Callout** for key moments only:
- `info`, `warning`, `tip`, `danger`, `success`, `quote`
- Rule: Max **2-3 callouts per video**. Don't overuse — they should feel like premium editorial moments.

### SVG Stick Figures (Only When Appropriate)
- Use for **lighthearted or educational** topics
- **Skip for serious political/tech topics** — use custom character representations instead
- Rule: Only if the topic benefits from personality. Never force them.

### Audio
- **AI Voiceover**: Punch voice clone via `./generate_punch_voice.sh`
- **SFX Layer**: `public/sfx/` (rise, whoosh, pop, typing, clock)
- **Ambient pad**: `sfx/ambient.mp3` at volume 0.04-0.05
- **SFX on transitions**: varied, not the same SFX every time

### Pacing
- **6-10 segments** (~12-25 seconds each) for a 3-minute video
- **3-5 sub-scenes per segment** (visual changes every 2-4 seconds)
- **Dynamic timing** — fast cuts for urgency, slow reveals for data
- NO static scenes longer than 4 seconds

### Technical
- **Import PremiumKit**: `import { FONT_IMPORT, getFontForScene, Callout, CalloutScene, StickFigure, StickFigureScene, FONT_STACK } from './components/PremiumKit';`
- **Render bypass**: Use `/tmp/remotion_project/` with `TMPDIR=/tmp/remotion_tmp` to avoid EPERM
- **Always copy new files** to temp project before rendering
- **Measure audio durations** with ffprobe and hardcode frame constants (no floating point math)
- **Register composition** in `Root.tsx` with exact frame count

## Steps

1. **Research the topic** — web search for latest facts, features, data points
2. **Define Visual Identity** — choose unique color palette, custom components, and layout style for THIS topic
3. **Write the script** — split into 6-10 segments, ~20-30 seconds each
4. **Generate voiceovers** — `./generate_punch_voice.sh` for each segment
5. **Measure durations** — `ffprobe` for exact lengths, calculate frames at 30fps
6. **Build custom components** — create 3-5 topic-specific visual components INLINE in the file
7. **Build the composition** — `src/[TopicName].tsx` with unique visual identity
8. **Register in Root.tsx** — add import and `<Composition>` with exact `durationInFrames`
// turbo
9. **Copy files to temp project** — `cp -R src/* /tmp/remotion_project/src/ 2>/dev/null && cp public/[prefix]_*.wav /tmp/remotion_project/public/ && cp public/sfx/* /tmp/remotion_project/public/sfx/`
// turbo
10. **Render** — `export TMPDIR=/tmp/remotion_tmp && mkdir -p $TMPDIR && cd /tmp/remotion_project && ./node_modules/.bin/remotion render [CompositionId] /Users/johnvictor/remotion_John/rendered/[output].mp4 --overwrite --bundle`
11. **Verify** — check file size and duration

## How to Request

> **"Create a premium video on [TOPIC] for [DURATION]"**

Examples:
- "Create a premium video on Tesla's new robots for 3 mins"
- "Create a premium video on why sleep is a superpower for 2 mins"
- "Create a premium video comparing ChatGPT vs Gemini for 3 mins"

The agent will automatically apply unique visual identity + all preferences above.
