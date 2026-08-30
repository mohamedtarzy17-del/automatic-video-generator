import json
import os
import sys
from PIL import Image, ImageDraw, ImageFont
from config import config

def generate_thumbnail_variants(title: str, topic: str):
    print("🖼️ Generating 3 High-CTR Thumbnail Variants (1280x720)...")
    os.makedirs(f"{config.RENDERED_DIR}/thumbnails", exist_ok=True)

    variants = [
        {"file": "thumbnail_variant_1.jpg", "bg_color": (15, 23, 42), "text": title.upper(), "accent": (245, 158, 11)},
        {"file": "thumbnail_variant_2.jpg", "bg_color": (8, 12, 20), "text": f"THE {topic.upper()} SCAM?", "accent": (239, 68, 68)},
        {"file": "thumbnail_variant_3.jpg", "bg_color": (10, 15, 29), "text": "DON'T BUY THIS!", "accent": (6, 182, 212)}
    ]

    for idx, var in enumerate(variants, 1):
        img = Image.new("RGB", (1280, 720), color=var["bg_color"])
        draw = ImageDraw.Draw(img)

        # Draw Accent Box
        draw.rectangle([60, 240, 1220, 480], fill=(30, 41, 59), outline=var["accent"], width=6)

        # Draw Headline Text
        text_content = var["text"]
        draw.text((100, 320), text_content[:40], fill=(255, 255, 255))

        out_path = f"{config.RENDERED_DIR}/thumbnails/{var['file']}"
        img.save(out_path, quality=95)
        print(f"  ✅ Saved Thumbnail #{idx}: {out_path}")

def main():
    if os.path.exists(config.SCENE_BREAKDOWN_PATH):
        with open(config.SCENE_BREAKDOWN_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            generate_thumbnail_variants(data.get("title", "SECRET SYSTEM"), data.get("topic", "TECH"))
    else:
        generate_thumbnail_variants("THE HIDDEN SYSTEM EXPOSED", "TECH")

if __name__ == "__main__":
    main()
