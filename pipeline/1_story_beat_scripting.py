import json
import os
import sys
import requests
from config import config

SYSTEM_PROMPT = """You are an expert YouTube documentary scriptwriter and director.
Generate a structured JSON video production plan for a viral faceless video topic.

The script MUST follow a 4-beat narrative structure:
1. HOOK (0-15s): Instant curiosity gap, shock factor.
2. BUILD (15-45s): Context, mechanism, initial expansion.
3. TENSION (45-90s): Conflict, problem, corporate/hidden conflict.
4. PAYOFF (90-120s+): Resolution, big picture revelation.

OUTPUT ONLY VALID JSON matching this exact structure:
{
  "title": "Video Title",
  "topic": "Topic Name",
  "episodes_style": {
    "palette": "vibrant neon cyan and slate dark",
    "line_weight": "bold clean vector cartoon outline",
    "character_sheet": "tech reporter mascot in jacket"
  },
  "scenes": [
    {
      "scene_id": 1,
      "beat_type": "hook",
      "narration_text": "First sentence of narration...",
      "duration_estimate": 20.0,
      "visual_type": "illustration",
      "emotion_tag": "curiosity",
      "camera_move": "zoomIn",
      "on_screen_text": "TEXT OVERLAY",
      "prompt_seed": 42069,
      "character_prompt": "cartoon character looking shocked",
      "background_prompt": "futuristic data center background"
    }
  ]
}"""

def generate_script_with_ollama(topic: str) -> dict:
    url = f"{config.OLLAMA_ENDPOINT}/api/generate"
    prompt = f"Create a structured video production plan for the topic: '{topic}'"
    
    payload = {
        "model": config.OLLAMA_MODEL,
        "system": SYSTEM_PROMPT,
        "prompt": prompt,
        "stream": False,
        "format": "json"
    }
    
    try:
        print(f"🤖 Querying local Ollama ({config.OLLAMA_MODEL}) for topic: '{topic}'...")
        response = requests.post(url, json=payload, timeout=60)
        if response.status_code == 200:
            result_text = response.json().get("response", "")
            return json.loads(result_text)
    except Exception as e:
        print(f"⚠️ Ollama unavailable or failed ({e}). Using deterministic structured fallback generator.")
    
    # Deterministic Fallback Generator if Ollama is not running locally
    return {
        "title": f"The Hidden Truth Behind {topic}",
        "topic": topic,
        "episodes_style": {
            "palette": "vibrant neon cyan and dark slate",
            "line_weight": "bold clean vector cartoon outline",
            "character_sheet": "2D cartoon tech reporter mascot"
        },
        "scenes": [
            {
                "scene_id": 1,
                "beat_type": "hook",
                "narration_text": f"Behind every single piece of {topic} lies a secret financial mechanism that most people never see.",
                "duration_estimate": 22.0,
                "visual_type": "illustration",
                "emotion_tag": "curiosity",
                "camera_move": "zoomIn",
                "on_screen_text": f"THE SECRET OF {topic.upper()}",
                "prompt_seed": 100001,
                "character_prompt": "cartoon reporter mascot examining glowing server with magnifying glass",
                "background_prompt": "dark digital matrix background with neon green data streams"
            },
            {
                "scene_id": 2,
                "beat_type": "build",
                "narration_text": f"For over a decade, major institutions engineered {topic} to operate behind closed doors.",
                "duration_estimate": 25.0,
                "visual_type": "stock",
                "emotion_tag": "clarity",
                "camera_move": "panRight",
                "on_screen_text": "SYSTEM ARCHITECTURE",
                "prompt_seed": 100002,
                "character_prompt": "cartoon analyst presenting flow chart on digital whiteboard",
                "background_prompt": "modern corporate server room with spinning rack lights"
            },
            {
                "scene_id": 3,
                "beat_type": "tension",
                "narration_text": "Yet when software locks and paywalls were introduced, the entire model triggered a massive backlash.",
                "duration_estimate": 24.0,
                "visual_type": "illustration",
                "emotion_tag": "tension",
                "camera_move": "zoomOut",
                "on_screen_text": "HARDWARE PAYWALLS",
                "prompt_seed": 100003,
                "character_prompt": "cartoon character staring at red padlocked digital screen",
                "background_prompt": "industrial warehouse with warning lights and lock symbols"
            },
            {
                "scene_id": 4,
                "beat_type": "payoff",
                "narration_text": f"As {topic} shifts to software platforms, the line between buying a product and renting it has vanished.",
                "duration_estimate": 20.0,
                "visual_type": "text_card",
                "emotion_tag": "revelation",
                "camera_move": "tilt",
                "on_screen_text": "THE ERA OF RENTING EVERYTHING",
                "prompt_seed": 100004,
                "character_prompt": "cartoon mascot standing atop digital globe holding a key",
                "background_prompt": "futuristic city skyline at sunset with neon light trails"
            }
        ]
    }

def main():
    topic = sys.argv[1] if len(sys.argv) > 1 else "Car Software Subscriptions"
    data = generate_script_with_ollama(topic)
    
    with open(config.SCENE_BREAKDOWN_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    
    print(f"✅ Created single source of truth contract: '{config.SCENE_BREAKDOWN_PATH}' ({len(data['scenes'])} scenes)")

if __name__ == "__main__":
    main()
