import cloudinary
import cloudinary.uploader
import io
from app.config import CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET,
)


def upload_to_cloudinary(file_bytes: bytes, filename: str) -> str:
    """Upload file bytes to Cloudinary and return the secure URL."""
    try:
        result = cloudinary.uploader.upload(
            io.BytesIO(file_bytes),
            resource_type="raw",
            folder="legalease",
            public_id=f"{filename.replace('.pdf', '')}_{id(file_bytes)}",
            format="pdf",
        )
        return result.get("secure_url", "")
    except Exception as e:
        # If Cloudinary not configured, return empty string (document still works)
        print(f"Cloudinary upload warning: {str(e)}")
        return ""
