---
name: whisperx
description: >-
  Transcribe audio/video files, generate precise word-level timestamp alignments, and perform speaker diarization using WhisperX.
  Use this skill when processing voiceovers, subtitles, kinetic typography sync, or multi-speaker transcriptions.
---

# WhisperX Skill

WhisperX provides fast automatic speech recognition (ASR) powered by OpenAI's Whisper, coupled with forced phoneme alignment (wav2vec 2.0) for word-level timestamps and speaker diarization via PyAnnote.

---

## Environment & Setup

In this repository, WhisperX is managed inside a dedicated virtual environment (`whisperx_env`).

### Setup Verification / Installation
To set up or verify the environment, run:
```bash
./setup_whisperx.sh
```

This installs:
- Python 3.10 virtual environment at `./whisperx_env`
- `torch`, `torchaudio`, `torchvision`
- WhisperX directly from `git+https://github.com/m-bain/whisperx.git`

---

## Command Line (CLI) Usage

Run WhisperX CLI through the virtual environment python/bin:

```bash
# Basic Transcription with Word-level Timestamps
./whisperx_env/bin/whisperx audio.mp3 --model base --language en --output_format json --output_dir output/

# Model Sizes available: tiny, base, small, medium, large-v2, large-v3

# Multi-Speaker Diarization (Requires HuggingFace Token for pyannote)
./whisperx_env/bin/whisperx audio.mp3 --model large-v2 --diarize --hf_token <YOUR_HF_TOKEN>
```

---

## Python API Usage

Use the local repository script [`transcribe_align.py`](file:///Users/johnvictor/remotion_John/transcribe_align.py) or execute Python code within `whisperx_env`.

### Quick Execution via Local Script
```bash
./whisperx_env/bin/python transcribe_align.py public/audio.wav --model base --output public/audio_transcript.json
```

### Python Code Pattern
```python
import whisperx

device = "cuda" if torch.cuda.is_available() else "cpu"
compute_type = "float16" if device == "cuda" else "int8"

# 1. Transcribe audio with Whisper
model = whisperx.load_model("base", device, compute_type=compute_type)
audio = whisperx.load_audio("audio.wav")
result = model.transcribe(audio, batch_size=16)

# 2. Align transcription to audio for word-level timestamps
model_a, metadata = whisperx.load_align_model(
    language_code=result["language"], 
    device=device
)
aligned_result = whisperx.align(
    result["segments"], 
    model_a, 
    metadata, 
    audio, 
    device, 
    return_char_alignments=False
)

# Output contains aligned_result["word_segments"] with exact start and end times in seconds
```

---

## Best Practices & Integration

1. **Remotion Subtitle / Kinetic Typography Sync**:
   - Save word-level timestamps in JSON format (`[{"word": "Hello", "start": 0.12, "end": 0.45}, ...]`).
   - Use `frame = start_sec * fps` to map timestamps to Remotion video frames for frame-accurate subtitles.

2. **Compute Type**:
   - Use `float16` on CUDA GPUs for maximum speed.
   - Use `int8` or `float32` on CPU / Apple Silicon (Mac M-series).

3. **Alignment Models**:
   - WhisperX automatically selects the optimal phoneme alignment model (e.g. `WAV2VEC2_ASR_LARGE_LV60K_960H` for English) based on detected audio language.
