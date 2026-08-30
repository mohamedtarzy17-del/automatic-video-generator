# Premium YouTube Video Style Guide (Established Feb 2026)

This document serves as the golden standard for all future Remotion videos generated for this channel (Niches: Finance, Health, Motivation, AI). The goal is to retain the **pacing, aesthetic quality, and engagement mechanics** of the "Lazy Money 2026" video while guaranteeing that **no two videos look identical.**

We do NOT use a single rigid template. We use a **Flexible Design Philosophy**.

## 1. Pacing & The "2-Second Rule" ⏱️
*   No visual layout, Callout, SVG state, or background element should remain static on screen for more than **60 frames (2 seconds)**.
*   Keep the viewer's eye bouncing around the screen by popping in elements sequentially (`delay={15}`, `delay={30}`).
*   Transition scenes cleanly just as the viewer finishes processing the information.

## 2. Dynamic Component Mathematics & Centering 📐
*   **NEVER rely on absolute screen coordinates (e.g., `left: 400`, `translateX(-250)`).** Absolute coordinates easily clip out of frame when SVGs resize or text expands.
*   **Always use Relative Locking Container (`flex-col`):** Wrap the subject (like an SVG) and its Callout labels in a tightly coupled `<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>`. This ensures the callouts stack cleanly and safely directly beneath or above the subject, immune to horizontal clipping.
*   **Absolute Canvas Containment:** Always place containers inside an `<AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>` so physics remain consistently mathematically centered at the `<0, 0>` anchor of the screen.

## 2.1. Dynamic Typography & Font Geometry Containment 🔠
*   Text is the number one cause of bounds-clipping. When animating pop scales (e.g., `scaleBase={1.2}` or `1.4`), the `fontSize` and scaling multiplier must be modeled dynamically so the longest theoretical word sequence NEVER exceeds `1920px` bounds.
*   Keep `CalloutBox` components tightly coded: `padding` should not exceed `15px 30px`, and font sizes inside standard pop callouts should safely range from `24` to `36`.
*   Headline Text (`<h1>` & `<h2>`) traversing the center of the screen must use `textAlign: 'center'` to guarantee text appropriately loops onto new lines instead of expanding outside X-axis boundaries.

## 3. Custom Procedural Vectors over Stock Art 🎨
*   Do not use standard boring generic images. Build custom, minimal, stylized SVGs using raw React math and coordinate geometry.
*   Elements must be "bouncy." All incoming assets must use Remotion's `spring()` physics with a damping value of `10-12` for organic, smooth introductions (`<Pop>` component).
*   Create visual metaphors. Don't just show a "Dollar Sign." Show a Line Graph that physically draws itself onto the screen, or a Stickman interacting with an AI Robot.

## 4. Sophisticated Color Theory 🎨
*   Avoid standard MS Paint colors (pure red `#ff0000`, pure blue `#0000ff`). 
*   Always define a bespoke `THEME` object for each video with a coordinated, premium palette (e.g., Warm Off-Whites, Slate Greys, Soft Peaches, Coral Reds, Teals).
*   Subtly animate backgrounds using `interpolateColors(Math.sin(frame/X), ...)` so the canvas is always breathing.

## 5. Audio Engineering 🎧
*   **Voiceover:** Use high-quality offline macOS TTS (like `say -v "Alex"`) or API-driven voices for a consistent narrator.
*   **BGM:** Layer a subtle, cinematic ambient track (`ambient.mp3` or similar) mixed very low (`volume={0.15}`) to give the video weight and remove "dead air."
*   **SFX:** Use subtle sound design (pops, whooshes, typing) perfectly synced to visual impacts. DO NOT overdo SFX to the point of annoyance.

## 6. Uniqueness & Flexibility 🌟
*   While these rules must be followed, the **layout structures must vary.**
*   Video 1 might use Split-Screens. Video 2 might use a chaotic Isometric 3D Space. Video 3 might use abstract geometric shapes masking real footage.
*   Every video must feel like a breathtaking, handcrafted masterpiece built specifically for its topic.
