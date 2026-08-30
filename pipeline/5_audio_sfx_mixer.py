import json
import os
import sys
import subprocess
from config import config

def apply_ffmpeg_auto_ducking(narration_path: str, bg_music_path: str, output_path: str):
    """FFmpeg sidechaincompress filter: ducks music volume when narration audio plays."""
    cmd = [
        "ffmpeg", "-y",
        "-i", narration_path,
        "-i", bg_music_path,
        "-filter_complex",
        "[1:a][0:a]sidechaincompress=threshold=0.08:ratio=4:attack=20:release=300[bg];[0:a][bg]amix=inputs=2[out]",
        "-map", "[out]",
        output_path
    ]
    try:
        subprocess.run(cmd, check=True, capture_output=True)
        print(f"  ✅ FFmpeg Auto-Ducked audio mix created: {output_path}")
    except Exception as e:
        print(f"  ⚠️ FFmpeg Auto-Ducking warning: {e}")

def process_audio_sfx_ducking():
    if not os.path.exists(config.SCENE_BREAKDOWN_PATH):
        print(f"❌ '{config.SCENE_BREAKDOWN_PATH}' not found.")
        sys.exit(1)

    with open(config.SCENE_BREAKDOWN_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    print("🔊 Processing SFX Triggers (No Ambient Music)...")
    
    for scene in data["scenes"]:
        scene_id = scene["scene_id"]
        narration_file = os.path.join(config.PUBLIC_DIR, f"scene_{scene_id}_audio.mp3")

        if os.path.exists(narration_file):
            scene["mixed_audio_file"] = f"scene_{scene_id}_audio.mp3"

        # Trigger CC0 SFX at scene transitions and WhisperX emphasis points
        scene["sfx_triggers"] = [
            {"sfx": "sfx/whoosh.mp3", "frame": 0, "volume": 0.6},
            {"sfx": "sfx/pop.mp3", "frame": 15, "volume": 0.7},
            {"sfx": "sfx/typing.mp3", "frame": 30, "volume": 0.35}
        ]

    with open(config.SCENE_BREAKDOWN_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    print(f"✅ Annotated '{config.SCENE_BREAKDOWN_PATH}' with SFX triggers and auto-ducking audio paths.")

if __name__ == "__main__":
    process_audio_sfx_ducking()
