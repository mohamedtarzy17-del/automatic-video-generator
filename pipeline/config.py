import os
from dataclasses import dataclass, field
from typing import Dict, Any

@dataclass
class PipelineConfig:
    # ─── FEATURE TOGGLE FLAGS (ALL FREE & OPEN-SOURCE) ───
    ENABLE_LLM_SCRIPTING: bool = True
    ENABLE_COMFYUI_ILLUSTRATIONS: bool = True
    ENABLE_LIVEPORTRAIT_ANIMATION: bool = True
    ENABLE_ANIMATEDIFF: bool = True
    ENABLE_WHISPERX_CAPTIONS: bool = True
    ENABLE_AUDIO_DUCKING: bool = True
    ENABLE_COLOR_GRADE_PASS: bool = False
    ENABLE_THUMBNAIL_GENERATOR: bool = True

    # ─── TOOL ENDPOINTS & LOCAL PATHS ───
    OLLAMA_ENDPOINT: str = os.getenv("OLLAMA_ENDPOINT", "http://127.0.0.1:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3:8b")
    
    COMFYUI_ENDPOINT: str = os.getenv("COMFYUI_ENDPOINT", "http://127.0.0.1:8188")
    COMFYUI_MODELS_PATH: str = os.getenv("COMFYUI_MODELS_PATH", "models/comfyui")
    
    LIVEPORTRAIT_PATH: str = os.getenv("LIVEPORTRAIT_PATH", "vendor/LivePortrait")
    WHISPERX_ENV: str = os.getenv("WHISPERX_ENV", "whisperx_env")

    # ─── SINGLE SOURCE OF TRUTH CONTRACT PATH ───
    SCENE_BREAKDOWN_PATH: str = "scene_breakdown.json"
    PUBLIC_DIR: str = "public"
    RENDERED_DIR: str = "rendered"

    # ─── GLOBAL STYLE GUIDE FOR CARTOON CONSISTENCY ───
    CARTOON_STYLE_PROMPT: str = (
        "2D vibrant cartoon illustration, bold clean vector outlines, "
        "flat graphic cel shading, rich saturated palette, studio quality art"
    )
    CARTOON_NEGATIVE_PROMPT: str = (
        "3d render, realistic photo, hyperrealistic, blurry, low contrast, "
        "distorted features, extra limbs, ugly, noisy"
    )

config = PipelineConfig()
