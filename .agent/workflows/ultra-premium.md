---
description: Create an ultra-premium documentary video with high-retention pacing, drifting cameras, animated SVG data dashboards, kinetic typography, and unique split-screen layouts.
---
# Ultra-Premium Video Workflow

Use this workflow when the user requests a premium/ultra-premium video. **Crucially, every video must be unique.** Treat this as a generative engine of techniques to combine, rather than a boilerplate template.

## ⚠️ Core Philosophy: The 1.2-Second Rule
The paramount goal is viewer retention. The visual state of the video MUST change every 24 to 36 frames (~0.8 to 1.2 seconds). This means:
1. No scene should remain completely static.
2. If text is held on screen, the camera must be moving, or background elements must be animating.
3. Overload the viewer with data points, rapid transitions, and heavy sound effects.

## 1. The Generative Engine (DO NOT COPY TEMPLATES)
To achieve the ultra-premium YouTube look, construct visually arresting scenes using the following architectural techniques. Mix and match these so no two videos look the same:

- **Kinetic Hook Typography:** Do not use basic fade-ins. Introduce massive, single-word or short-phrase hooks that slam onto the screen (e.g., `["ZERO", "COUNTERPARTY", "RISK"]`) using intense spring physics, perfectly synced to rapid `pop.mp3` bursts.
- **Geometric Split-Screen Panels (`LayoutSplit`):** Instead of centering content, divide the screen (e.g., 60/40 or 50/50). Place a complex animated SVG on one side, and frosted glassmorphic text panels or character reactions on the other.
- **Dynamic Color Sequencing:** Do NOT use one global color scheme. Change the background color drastically for *every single sequence* to instantly reset viewer attention (e.g., cycle through Navy -> Crisp White -> Warning Yellow -> Deep Red -> Neon Pink).
- **Custom Mechanism SVGs:** Build highly specific, animated SVGs that illustrate the script's core concepts (e.g., an animated printing press for inflation, a breaking wireframe globe for sanctions, a ticking dashboard odometer). 
- **Emotional Character Integration:** Use the `StickFigure` PremiumKit components (or similar bespoke SVGs) to react to the data on-screen (e.g., "surprised", "happy", "angry") to build a parasocial connection.
- **Tactical Overlays & Texture:** Wrap everything in a `CameraWrapper` for constant 2.5D drift. Apply `FilmGrain`. Inject `<Glitch>` wrapper components on severe data points, and use `<HUD>` overlays (binary code, coordinates, "REC" dots) to add technical depth.

## 2. Audio & Soundscape Engineering
- **BeatManager:** Implement a `BeatManager` component that triggers a `pop.mp3` or `typing.mp3` every 15 to 24 frames to subconsciously increase urgency.
- **Targeted SFX:** Play loud `pop.mp3` bursts *exactly* when charts spike, terminal errors occur, or kinetic words hit the screen.
- **Transitions:** Every major Sequence transition MUST be accompanied by a `whoosh.mp3`.
- **Ambient Pad:** Include a low-volume ambient layer (`ambient.mp3` at ~0.06 volume). Add `rise.mp3` sub-bass swooshes during high-tension conclusions.

## 3. Execution Steps
1. **Scripting:** Write a 6-10 segment script optimized for punchy delivery. Ensure hooks are short.
2. **Voice Generation:** Generate audio lines using `generate_punch_voice.sh`.
// turbo-all
3. **Audio Sizing:** Check the exact sizes of the audio files in seconds using `ffprobe` to determine the frame durations (duration * 30).
4. **Code Construction:** Build the `UltraPremium[Topic].tsx` composition, fiercely applying the generative techniques above. Custom-build SVGs that make sense ONLY for this specific video.
5. **Render Workaround (EPERM Bypass):** Render inside `/tmp/remotion_tmp` to bypass local permission errors:
    > `export TMPDIR=/tmp/remotion_tmp && rm -rf /tmp/remotion_project && mkdir -p /tmp/remotion_project/src /tmp/remotion_project/public/sfx && cp -R src/* /tmp/remotion_project/src/ && cp public/*.wav /tmp/remotion_project/public/ && cp public/sfx/* /tmp/remotion_project/public/sfx/ && cp package.json package-lock.json remotion.config.ts tsconfig.json /tmp/remotion_project/ && cd /tmp/remotion_project && npm ci --omit=peer && ./node_modules/.bin/remotion render [CompName] /Users/johnvictor/remotion_John/rendered/[movie_name].mp4 --overwrite --bundle --headless --gl=angle`
