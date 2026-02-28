from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, document

app = FastAPI(
    title="LegalEase API",
    description="AI-powered legal document summarizer",
    version="1.0.0",
)

# CORS — allow React frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",
        "https://*.vercel.app",   # Vercel deployment
        "*",                      # Allow all for development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(document.router, prefix="/api/document", tags=["Documents"])


@app.get("/")
async def root():
    return {"message": "LegalEase API is running!", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/test-models")
async def test_models():
    import google.generativeai as genai
    from app.config import GEMINI_API_KEY
    genai.configure(api_key=GEMINI_API_KEY)
    models = []
    for m in genai.list_models():
        if "generateContent" in m.supported_generation_methods:
            models.append(m.name)
    return {"available_models": models}
