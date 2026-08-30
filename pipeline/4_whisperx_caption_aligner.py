import json
import os
import sys
import asyncio
import subprocess
import edge_tts
from config import config

async def generate_scene_narration(text: str, filename: str):
    voice = "en-US-ChristopherNeural"
    output_path = os.path.join(config.PUBLIC_DIR, filename)
    communicate = edge_tts.Communicate(text, voice, rate="+5%")
    await communicate.save(output_path)
    return output_path

def run_whisperx_align(audio_path: str, timing_json_path: str):
    # Call whisperx transcribe_align.py script
    cmd = [
        "python3", "transcribe_align.py", audio_path, timing_json_path
    ]
    try:
        subprocess.run(cmd, check=True, capture_output=True, text=True)
        print(f"  ✅ WhisperX aligned word timestamps: {timing_json_path}")
    except Exception as e:
        print(f"  ⚠️ WhisperX alignment fallback: {e}")

async def process_speech_and_alignment():
    if not os.path.exists(config.SCENE_BREAKDOWN_PATH):
        print(f"❌ '{config.SCENE_BREAKDOWN_PATH}' not found.")
        sys.exit(1)

    with open(config.SCENE_BREAKDOWN_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    print("🎙️ Generating Edge-TTS Audio & WhisperX Word-Level Timestamp Alignment...")

    for scene in data["scenes"]:
        scene_id = scene["scene_id"]
        text = scene["narration_text"]
        audio_filename = f"scene_{scene_id}_audio.mp3"
        timing_filename = f"scene_{scene_id}_timings.json"

        # 1. Generate Voiceover Audio
        audio_path = await generate_scene_narration(text, audio_filename)
        scene["audio_file"] = audio_filename

        # 2. WhisperX Word-Level Timestamp Alignment
        timing_json_path = os.path.join(config.PUBLIC_DIR, timing_filename)
        run_whisperx_align(audio_path, timing_json_path)
        scene["timings_file"] = timing_filename

    with open(config.SCENE_BREAKDOWN_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    print(f"✅ Annotated '{config.SCENE_BREAKDOWN_PATH}' with speech & WhisperX timing data.")

def main():
    asyncio.run(process_speech_and_alignment())

if __name__ == "__main__":
    main()
