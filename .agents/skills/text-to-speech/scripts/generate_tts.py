#!/usr/bin/env python3
import argparse
import asyncio
import edge_tts

async def main():
    parser = argparse.ArgumentParser(description="Generate natural neural TTS voiceovers.")
    parser.add_argument("--text", required=True, help="Text to convert to speech.")
    parser.add_argument("--output", default="public/generated_tts.mp3", help="Output file path.")
    parser.add_argument("--voice", default="en-US-ChristopherNeural", help="Voice model ID.")
    parser.add_argument("--rate", default="+5%", help="Speed rate (e.g. +5%%, -10%%).")
    
    args = parser.parse_args()
    print(f"Generating TTS audio with voice '{args.voice}' (rate={args.rate})...")
    
    communicate = edge_tts.Communicate(args.text, args.voice, rate=args.rate)
    await communicate.save(args.output)
    print(f"✅ Audio successfully saved to: {args.output}")

if __name__ == "__main__":
    asyncio.run(main())
