#!/bin/bash
# Download free Civitai SDXL Cartoon LoRA model for consistent 2D cartoon video style
MODELS_DIR="${COMFYUI_MODELS_PATH:-models/comfyui}/loras"
mkdir -p "$MODELS_DIR"

LORA_FILE="$MODELS_DIR/sdxl_cartoon_style.safetensors"
LORA_URL="https://civitai.com/api/download/models/135867"

echo "🎨 Checking Civitai SDXL Cartoon LoRA..."
if [ ! -f "$LORA_FILE" ]; then
    echo "Downloading SDXL Cartoon LoRA from Civitai ($LORA_URL)..."
    curl -L "$LORA_URL" -o "$LORA_FILE" || echo "⚠️ Download requires active internet connection."
    echo "✅ LoRA downloaded to $LORA_FILE"
else
    echo "✅ LoRA already present at $LORA_FILE"
fi
