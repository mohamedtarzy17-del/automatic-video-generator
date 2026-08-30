---
name: text-to-speech
description: >-
  Generate hyper-realistic natural AI voiceovers and speech audio using Kokoro-82M (SOTA local neural TTS), Edge-TTS (Microsoft Neural Voices), or OpenVoice.
  Use this skill when the user asks to generate voiceovers, convert text to speech, or produce natural voice narration with variations in voice, tone, speed, or language.
---

# Text-to-Speech (TTS) Skill

This skill provides access to the latest state-of-the-art (SOTA) AI text-to-speech engines.

---

## 🚀 Engine 1: Kokoro-82M TTS (Latest SOTA Open-Weight Model)

**Kokoro-82M** is currently the top open-weights text-to-speech model, producing human-level inflection, natural pauses, and studio-grade voice synthesis locally on CPU/GPU without third-party APIs.

### Available Kokoro Voices:
- `af_heart` (US Female — Ultra Natural & Warm)
- `am_michael` (US Male — Narrative & Professional)
- `bf_emma` (British Female — Refined Editorial)
- `bm_george` (British Male — Documentary Narrator)
- `af_bella`, `af_nicole`, `am_adam`

### Generate with Kokoro-82M (Python):
```python
from kokoro_onnx import Kokoro
import soundfile as sf

kokoro = Kokoro("models/kokoro/kokoro-v1.0.onnx", "models/kokoro/voices-v1.0.bin")
samples, sample_rate = kokoro.create("Your text here", voice="af_heart", speed=1.0, lang="en-us")
sf.write("public/output_kokoro.wav", samples, sample_rate)
```

---

## ⚡ Engine 2: Edge-TTS (Microsoft Neural Voices)

Provides **400+ broadcast-quality, human-sounding neural voices** with zero setup or API keys.

### Popular Voice Identifiers:
- `en-US-ChristopherNeural` (US Male — Documentary / News)
- `en-US-JennyNeural` (US Female — Engaging / Demos)
- `en-US-GuyNeural` (US Male — Warm Storytelling)
- `en-GB-RyanNeural` (British Male — Financial & Deep Analysis)

### Generate with Edge-TTS (CLI Helper):
```bash
python3 .agents/skills/text-to-speech/scripts/generate_tts.py --text "Your narration text here" --voice "en-US-ChristopherNeural" --output public/my_voiceover.mp3
```

---

## 🧬 Engine 3: OpenVoice / Punch Voice Clone

Local voice clone script using target embedding `punch_se.pth`:
```bash
./generate_punch_voice.sh "Your narration script" "output_filename.wav"
```
