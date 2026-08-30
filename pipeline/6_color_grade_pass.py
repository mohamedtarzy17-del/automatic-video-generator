import os
import sys
import subprocess
from config import config

def apply_cinematic_color_grade(input_video: str, output_video: str):
    """FFmpeg color grade pass (colorbalance + contrast + saturation) unifying stock, cartoon, and text visuals."""
    filter_chain = "colorbalance=rs=0.04:gs=-0.02:bs=0.06,eq=contrast=1.08:saturation=1.12"
    
    cmd = [
        "ffmpeg", "-y",
        "-i", input_video,
        "-vf", filter_chain,
        "-c:v", "libx264",
        "-crf", "18",
        "-preset", "fast",
        "-c:a", "copy",
        output_video
    ]
    
    print(f"🎬 Running Final Cinematic Color Grade Pass on '{input_video}' -> '{output_video}'...")
    try:
        subprocess.run(cmd, check=True, capture_output=True)
        print(f"✅ Color graded video saved to: '{output_video}'")
    except Exception as e:
        print(f"⚠️ Color grade pass warning: {e}")

def main():
    input_vid = sys.argv[1] if len(sys.argv) > 1 else f"{config.RENDERED_DIR}/raw_pipeline_render.mp4"
    output_vid = sys.argv[2] if len(sys.argv) > 2 else f"{config.RENDERED_DIR}/final_graded_pipeline_video.mp4"

    if os.path.exists(input_vid):
        apply_cinematic_color_grade(input_vid, output_vid)
    else:
        print(f"⚠️ Input video '{input_vid}' not found. Run Remotion render first.")

if __name__ == "__main__":
    main()
