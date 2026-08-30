---
description: Generate local AI voice (Punch Clone)
---
Use this workflow to generate high-quality voiceover using the locally installed OpenVoice model and the 'punch' voice clone.

1. Ensure the cloned voice reference is ready.
// turbo
2. Run the generation command:
   ```bash
   ./generate_punch_voice.sh "Your script text here" "output_filename.wav"
   ```
3. The generated file will be available in the `public/` directory for use in your Remotion project.
4. Reference the file in your Remotion code using `staticFile("output_filename.wav")`.
