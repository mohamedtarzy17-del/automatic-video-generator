#!/usr/bin/env python3
import sys
import os
import subprocess
from config import config

def run_step(step_name: str, script_name: str, args: list = None):
    print(f"\n=======================================================")
    print(f"🚀 PIPELINE STEP: {step_name}")
    print(f"=======================================================")
    cmd = ["python3", f"pipeline/{script_name}"]
    if args:
        cmd.extend(args)
    try:
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Error in step '{step_name}': {e}")
        sys.exit(1)

def main():
    topic = sys.argv[1] if len(sys.argv) > 1 else "Car Software Subscriptions"
    print(f"🎉 STARTING AUTOMATED OPEN-SOURCE VIDEO PIPELINE FOR TOPIC: '{topic}'")

    # Step 1: LLM Story-Beat Scripting Layer
    if config.ENABLE_LLM_SCRIPTING:
        run_step("1. LLM Story-Beat Scripting Layer", "1_story_beat_scripting.py", [topic])

    # Step 2: Cartoon Illustration Generation Layer
    if config.ENABLE_COMFYUI_ILLUSTRATIONS:
        run_step("2. ComfyUI Cartoon Illustration Generation", "2_comfyui_cartoon_gen.py")

    # Step 3: Animating Illustrations Engine
    if config.ENABLE_LIVEPORTRAIT_ANIMATION or config.ENABLE_ANIMATEDIFF:
        run_step("3. Animating Illustrations Engine (LivePortrait/AnimateDiff/Parallax)", "3_animation_engine.py")

    # Step 4: Voice & WhisperX Caption Alignment
    if config.ENABLE_WHISPERX_CAPTIONS:
        run_step("4. Voice Generation & WhisperX Word Alignment", "4_whisperx_caption_aligner.py")

    # Step 5: CC0 Background Music & SFX Ducking Mixer
    if config.ENABLE_AUDIO_DUCKING:
        run_step("5. CC0 Audio & SFX Auto-Ducking Mixer", "5_audio_sfx_mixer.py")

    # Step 6: Final Color Grade Pass
    if config.ENABLE_COLOR_GRADE_PASS:
        run_step("6. FFmpeg Cinematic Color Grade Pass", "6_color_grade_pass.py")

    # Step 7: Automated Thumbnail Generator
    if config.ENABLE_THUMBNAIL_GENERATOR:
        run_step("7. Automated Thumbnail Generator", "7_thumbnail_generator.py")

    print("\n=======================================================")
    print("🎉 FULL AUTOMATED PIPELINE EXECUTED SUCCESSFULLY!")
    print(f"📄 Central JSON Contract: {config.SCENE_BREAKDOWN_PATH}")
    print(f"🖼️ Thumbnails Output: {config.RENDERED_DIR}/thumbnails/")
    print("=======================================================\n")

if __name__ == "__main__":
    main()
