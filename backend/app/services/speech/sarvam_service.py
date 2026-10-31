import os
import base64
import logging
from typing import Optional, Dict, Any, Tuple
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

class SarvamSpeechService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("SARVAM_API_KEY")
        self._client = None
        if self.api_key and "••••" not in self.api_key:
            try:
                from sarvamai import SarvamAI
                self._client = SarvamAI(api_subscription_key=self.api_key)
                logger.info("SarvamAI client initialized successfully.")
            except Exception as e:
                logger.error(f"Failed to initialize SarvamAI client: {e}")

    @property
    def is_available(self) -> bool:
        return self._client is not None

    def transcribe_audio(
        self,
        audio_bytes: bytes,
        language_code: str = "mr-IN",
        file_name: str = "audio.wav"
    ) -> Dict[str, Any]:
        """
        Transcribes frontline healthcare audio using Sarvam Saaras v3.
        Supports Marathi (mr-IN) and Hindi (hi-IN) with mixed clinical English.
        """
        if not self.is_available:
            logger.warning("Sarvam API key not configured or client unavailable. Using offline fallback.")
            return {
                "transcript": "आज दिनांक ३१ ऑक्टोबरला मी सुनिता शिंदे यांच्या घरी भेट दिली. बीपी १४०/९५ भरला आहे. वजन ५४ किलो आहे. हिमोग्लोबिन १०.२ ग्रॅम भरले.",
                "language_code": language_code,
                "confidence": 0.95,
                "model": "sarvam-saaras-v3 (fallback)",
                "timestamps": None,
                "is_live": False
            }

        try:
            # Map simplified codes to official Sarvam format
            code = "mr-IN" if "mr" in language_code.lower() else "hi-IN"
            
            # File tuple: (filename, bytes, content_type)
            file_payload = (file_name, audio_bytes, "audio/wav")
            
            response = self._client.speech_to_text.transcribe(
                file=file_payload,
                model="saaras:v3",
                language_code=code,
                with_timestamps=True
            )

            words_data = []
            if response.timestamps and hasattr(response.timestamps, "words"):
                words_data = [
                    {
                        "word": w.word if hasattr(w, "word") else str(w),
                        "start_time": getattr(w, "start_time", 0.0),
                        "end_time": getattr(w, "end_time", 0.0)
                    }
                    for w in response.timestamps.words
                ]

            return {
                "request_id": response.request_id,
                "transcript": response.transcript,
                "language_code": getattr(response, "language_code", code),
                "confidence": getattr(response, "language_probability", 0.98),
                "model": "saaras:v3",
                "words": words_data,
                "is_live": True
            }
        except Exception as e:
            logger.error(f"Sarvam STT failed: {e}")
            raise e

    def synthesize_speech(
        self,
        text: str,
        language_code: str = "mr-IN",
        speaker: str = "ishita"
    ) -> Tuple[bytes, str]:
        """
        Converts text back to spoken audio using Sarvam Bulbul v3.
        """
        if not self.is_available:
            raise RuntimeError("Sarvam client not initialized. Check SARVAM_API_KEY in .env.")

        code = "mr-IN" if "mr" in language_code.lower() else "hi-IN"
        response = self._client.text_to_speech.convert(
            text=text,
            language_code=code,
            model="bulbul:v3",
            speaker=speaker,
            output_audio_codec="wav"
        )

        if not response.audios or len(response.audios) == 0:
            raise ValueError("No audio payload returned from Sarvam Bulbul.")

        audio_bytes = base64.b64decode(response.audios[0])
        return audio_bytes, response.request_id

sarvam_speech_service = SarvamSpeechService()
