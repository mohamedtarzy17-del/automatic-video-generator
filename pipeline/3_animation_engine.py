import json
import os
import sys
import subprocess
from config import config

def process_animation_engine():
    if not os.path.exists(config.SCENE_BREAKDOWN_PATH):
        print(f"❌ '{config.SCENE_BREAKDOWN_PATH}' not found.")
        sys.exit(1)

    with open(config.SCENE_BREAKDOWN_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    os.makedirs(f"{config.PUBLIC_DIR}/animated_clips", exist_ok=True)

    print("🎬 Running Animation Engine (LivePortrait / AnimateDiff / Remotion Parallax)...")

    for scene in data["scenes"]:
        scene_id = scene["scene_id"]
        char_img = f"{config.PUBLIC_DIR}/illustrations/scene_{scene_id}_char.png"
        clip_out = f"{config.PUBLIC_DIR}/animated_clips/scene_{scene_id}_anim.mp4"

        # 1. LIVEPORTRAIT (Character Expressions / Talking Motion)
        if config.ENABLE_LIVEPORTRAIT_ANIMATION and os.path.exists(config.LIVEPORTRAIT_PATH):
            print(f"  🎭 Running LivePortrait on Scene #{scene_id} character image...")
            cmd = [
                "python3", f"{config.LIVEPORTRAIT_PATH}/inference.py",
                "-s", char_img,
                "-o", clip_out
            ]
            try:
                subprocess.run(cmd, check=True, capture_output=True)
                scene["animated_clip"] = f"animated_clips/scene_{scene_id}_anim.mp4"
                print(f"  ✅ LivePortrait rendered animation: {clip_out}")
                continue
            except Exception as e:
                print(f"  ⚠️ LivePortrait fallback: {e}")

        # 2. ANIMATEDIFF (ComfyUI Looping Video Clips)
        if config.ENABLE_ANIMATEDIFF:
            print(f"  🌀 AnimateDiff mode configured for Scene #{scene_id}")

        # 3. REMOTION MULTI-PLANE PARALLAX (Fallback)
        # Sets separate speed multipliers per layer via interpolate() in Remotion
        scene["animation_mode"] = "remotion_parallax"
        scene["parallax_config"] = {
            "bg_speed": 0.05,
            "char_speed": 0.12,
            "fg_speed": 0.22
        }
        print(f"  ✅ Scene #{scene_id} configured with Remotion Multi-Plane Parallax (bg: 0.05x, char: 0.12x, fg: 0.22x)")

    # Save updated contract
    with open(config.SCENE_BREAKDOWN_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    print(f"✅ Annotated '{config.SCENE_BREAKDOWN_PATH}' with animation metadata.")

if __name__ == "__main__":
    process_animation_engine()
