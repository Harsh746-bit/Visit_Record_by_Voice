import os
import sys
import base64
import argparse
from dotenv import load_dotenv

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# 1. Load environment variables from .env
load_dotenv()

api_key = os.getenv("SARVAM_API_KEY")

if not api_key:
    print("❌ Error: SARVAM_API_KEY is not set in your .env file.")
    sys.exit(1)

if "••••" in api_key:
    print("⚠️ Notice: SARVAM_API_KEY in .env contains placeholder bullets.")
    print("Please update your .env file with your active Sarvam API key.")
    print("Example: SARVAM_API_KEY=your_actual_key_here")
    sys.exit(1)

try:
    from sarvamai import SarvamAI
except ImportError:
    print("❌ Error: sarvamai SDK not installed. Run 'pip install sarvamai'.")
    sys.exit(1)

client = SarvamAI(api_subscription_key=api_key)

parser = argparse.ArgumentParser(description="Test Sarvam AI APIs for Visit Record by Voice")
parser.add_argument("--mode", choices=["tts", "stt", "chat", "all"], default="tts", help="Sarvam API mode to test")
parser.add_argument("--audio", type=str, default=None, help="Path to audio file for STT testing")
args = parser.parse_args()

def test_tts():
    print("\n--- [1] Testing Sarvam Text-to-Speech (Bulbul v3) in Marathi ---")
    tts_text = "नमस्ते, आवाज द्वारे आरोग्य भेट नोंदणी प्रणालीत आपले स्वागत आहे."
    print(f"Spoken Text (Marathi): \"{tts_text}\"")
    try:
        response = client.text_to_speech.convert(
            text=tts_text,
            language_code="mr-IN",
            model="bulbul:v3",
            speaker="ishita",
            output_audio_codec="wav"
        )
        print(f"✅ Success! Request ID: {response.request_id}")
        if response.audios:
            audio_bytes = base64.b64decode(response.audios[0])
            out_path = "output_sarvam_welcome.wav"
            with open(out_path, "wb") as f:
                f.write(audio_bytes)
            print(f"🔊 Audio saved to: {out_path} ({len(audio_bytes)} bytes)")
        return True
    except Exception as e:
        print(f"❌ TTS Failed: {e}")
        return False

def test_chat():
    print("\n--- [2] Testing Sarvam Chat Completion (sarvam-105b-conversations) ---")
    question = "सुनिता शिंदे यांचे बीपी १४०/९५ आहे. हा रक्तदाब सामान्य आहे का जोखीम आहे? एका वाक्यात मराठीत सांगा."
    print(f"Clinical Question (Marathi): \"{question}\"")
    messages = [
        {"role": "user", "content": question}
    ]
    try:
        response = client.chat.completions(
            model="sarvam-105b-conversations",
            messages=messages,
            max_tokens=150,
            temperature=0.2
        )
        reply = response.choices[0].message.content
        print(f"✅ Success! Response ID: {response.id}")
        print(f"🤖 Sarvam Indic Model Response:\n{reply.strip()}")
        return True
    except Exception as e:
        print(f"❌ Chat Failed: {e}")
        return False

def test_stt(audio_file):
    print("\n--- [3] Testing Sarvam Speech-to-Text (Saaras v3) in Marathi ---")
    if not audio_file or not os.path.exists(audio_file):
        print("⚠️ Audio file not found for STT test. Skipping.")
        return False
    try:
        with open(audio_file, "rb") as af:
            response = client.speech_to_text.transcribe(
                file=af,
                model="saaras:v3",
                language_code="mr-IN",
                with_timestamps=True
            )
        print(f"✅ Success! Request ID: {response.request_id}")
        print(f"📝 Transcript:\n{response.transcript}")
        if response.timestamps:
            print(f"⏱️ Timestamps extracted: {len(response.timestamps.words)} words")
        return True
    except Exception as e:
        print(f"❌ STT Failed: {e}")
        return False

if __name__ == "__main__":
    if args.mode in ["tts", "all"]:
        test_tts()
    if args.mode in ["chat", "all"]:
        test_chat()
    if args.mode in ["stt", "all"]:
        test_stt(args.audio or "output_sarvam_welcome.wav")
