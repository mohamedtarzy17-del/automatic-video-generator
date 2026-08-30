---
description: Create an ultra-premium documentary video with high-retention pacing, drifting cameras, animated SVG data dashboards, kinetic typography, split-screen layouts, and Pexels B-Roll.
---

# Ultra-Premium Documentary Video Workflow

## ⚠️ TRIPLE-A STANDARDS: MOTION, B-ROLL, & TYPOGRAPHY COMBINED

This workflow produces **ultra-premium documentary-style** content. It fuses cinematic Pexels B-Roll footage, custom SVG data visualizations, drifting cameras, and kinetic typography. It relies heavily on high-retention pacing with constant visual evolution.

### 1. Visual Architecture & Composition
Every ultra-premium video MUST incorporate:
- **Split-Screen Layouts:** Combine Pexels B-Roll on one half of the screen with animated data dashboards or kinetic typography on the other half.
- **Drifting Cameras:** Use continuous slow pans or scales via standard Remotion `interpolate()` combined with `spring()` to give life to static assets and B-Roll (e.g., slowly zooming in from 1x to 1.1x). Constant micro-movements are mandatory.
- **Kinetic Typography:** Giant, screen-filling words that sync perfectly with the AI voiceover. Use `PremiumKit.tsx` (e.g. Anton, Bebas Neue, Space Mono) for fonts.
- **Data Dashboards & SVGs:** Clean, frosted-glass (glassmorphic) metrics, charts, and unique SVG elements perfectly composited alongside or over top of the footage.

### 2. Pexels B-Roll Integration (NEW)
Fetch high-quality, relevant background video using the local Pexels script:
- Command: `node fetch_broll.mjs "[Search Query]" "[output_name].mp4"`
- Fetch a dynamic number of specific vertical/cinematic clips tailored to the specific moments of the script. Determine the number of clips based on the total video length (e.g., fetch 1 clip for every 10-15 seconds of the overall video).
- Render these mp4s locally using `<Video src={staticFile('output_name.mp4')} style={{ objectFit: 'cover' }} />`.
- Apply colored gradient overlays, vignettes, or blur (`backdropFilter` or `filter`) over the B-Roll so that overlaid data or typography remains highly readable and the grade looks color-corrected.

### 3. Audio & Pacing
- **High Retention Pacing:** Visual changes every 1.5 - 2.5 seconds. Cut to a different layout, jump cut the B-Roll, spring in new typography, or shift the split-screen ratio entirely.
- **SFX Layering:** Heavy, deliberate sound design. Stack rises, whooshes, impacts, pop, and typing sounds for EVERY visual action. Background ambient beds should be mixed low (`0.05` volume).
- **Voiceover Engine:** Use the local punch clone AI via `generate_punch_voice.sh`. Always measure the exact length using `ffprobe` to eliminate dead air.

### 4. Technical Implementation Steps

1. **Research & Plan Scene Structure:**
   - Define the split-screen grid patterns and data dashboard elements needed.
   - Plan out the specific Pexels search keywords that will enhance the narrative.

// turbo-all
2. **Generate AI Voiceover & Measure:**
   ```bash
   ./generate_punch_voice.sh "Dramatic script part 1." "vo_part1.wav"
   ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 public/vo_part1.wav
   ```

3. **Fetch Contextual Pexels B-Roll:**
   ```bash
   node fetch_broll.mjs "epic cinematic business" "cinematic_bg1.mp4"
   node fetch_broll.mjs "dark technology server" "tech_bg2.mp4"
   ```

4. **Construct the Composition:**
   - Create `src/[TopicName]Ultra.tsx`.
   - Build out dynamic `DriftingCamera` wrapper components to simulate subtle zooms overlaying `<Video>`.
   - Script `<Sequence>` chains tightly timed to the voiceover metrics.
   - Construct Split-Screen blocks using layered flexbox or grid implementations.

5. **Register in `Root.tsx`:**
   - Import and add `<Composition id="[TopicName]Ultra" component={TopicNameUltra} durationInFrames={calculatedFrames} fps={30} width={1920} height={1080} />`

6. **Render (TMPDIR workaround + max concurrency):**
   ⚠️ The project's `node_modules` has macOS permission restrictions (`EPERM: lstat`).
   **Do NOT run `npx remotion` from the project root.** Instead, run from `src/` with `TMPDIR` override:
   ```bash
   export TMPDIR=/tmp/remotion_tmp && mkdir -p $TMPDIR && npx remotion render index.ts [CompositionId] ../rendered/[output].mp4 --overwrite --bundle --concurrency=100%
   ```
   - The `Cwd` for this command MUST be `/Users/johnvictor/remotion_John/src`
   - `--concurrency=100%` uses ALL available CPU cores for maximum speed.
   - `TMPDIR` redirects Chrome temp profiles to `/tmp` to avoid `/var/folders` permission errors.
   - The webpack cache warning (`EPERM ... 13.pack_`) is harmless and can be ignored.

## How to Request
> **"Create an ultra-premium documentary video on [TOPIC]"**

The agent will seamlessly synthesize AI voiceovers, Pexels cinematic footage, kinetic typography split-screens, and custom data dashboards.
