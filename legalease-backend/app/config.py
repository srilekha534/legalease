import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/legalease")
SECRET_KEY = os.getenv("SECRET_KEY", "changethissecretkeyinproduction123456")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME", "")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY", "")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET", "")

client = AsyncIOMotorClient(MONGO_URL)
db = client.legalease