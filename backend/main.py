import os
import io
from PIL import Image
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from faster_whisper import WhisperModel
from groq import Groq
from dotenv import load_dotenv
import pytesseract

# If using Windows, set this path to your local tesseract.exe
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

load_dotenv()

# Load Whisper for audio
whisper_model = WhisperModel("base")

# Setup Groq
groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
    raise RuntimeError("❌ GROQ_API_KEY not found.")
groq = Groq(api_key=groq_api_key)

# FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextInput(BaseModel):
    text: str

# ----------- OCR Function -----------
def get_text_from_image(file: UploadFile) -> str:
    image = Image.open(io.BytesIO(file.file.read())).convert("RGB")
    extracted_text = pytesseract.image_to_string(image).strip()
    return extracted_text if extracted_text else "No readable text found in the image."

# ----------- Audio Transcription -----------
def get_transcription_from_audio(file: UploadFile) -> str:
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(file.file.read())

    segments, _ = whisper_model.transcribe(temp_path)
    os.remove(temp_path)
    return " ".join([segment.text for segment in segments])

# ----------- Detect File Type -----------
def detect_file_type(file: UploadFile) -> str:
    if file.content_type.startswith("image/"):
        return "image"
    elif file.content_type.startswith("audio/"):
        return "audio"
    else:
        return "unknown"

# ----------- Main Route -----------
@app.post("/generate")
async def generate(file: UploadFile = File(None), prompt: str = Form(None)):
    final_input = prompt

    if file:
        file_type = detect_file_type(file)
        if file_type == "image":
            final_input = get_text_from_image(file)
        elif file_type == "audio":
            final_input = get_transcription_from_audio(file)
        else:
            return {"error": "Unsupported file type"}

    if not final_input:
        return {"error": "No input provided"}

    try:
        completion = groq.chat.completions.create(
            model="llama3-8b-8192",  # Updated from deprecated model
            messages=[{"role": "user", "content": final_input}],
            temperature=0.7
        )
        return {"response": completion.choices[0].message.content}
    except Exception as e:
        return {"error": str(e)}
