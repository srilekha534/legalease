from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.config import db
from app.utils.auth_utils import get_current_user_id
from app.services.pdf_extractor import extract_text_from_pdf
from app.services.ai_summarizer import analyze_document
from app.services.cloudinary_svc import upload_to_cloudinary
from bson import ObjectId
from datetime import datetime

router = APIRouter()

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user_id),
):
    # Validate file type
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    # Read file
    file_bytes = await file.read()

    # Validate file size
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File size must be under 10MB.")

    try:
        # Extract text from PDF
        text = extract_text_from_pdf(file_bytes)
        if not text or len(text.strip()) < 100:
            raise HTTPException(
                status_code=422,
                detail="Could not extract readable text from this PDF. Please ensure it's not a scanned image PDF.",
            )

        # Upload to Cloudinary (optional, won't fail if not configured)
        file_url = upload_to_cloudinary(file_bytes, file.filename)

        # Analyze with AI
        analysis = analyze_document(text)

    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

    # Save to MongoDB
    doc = {
        "userId": ObjectId(user_id),
        "fileName": file.filename,
        "fileUrl": file_url,
        "documentType": analysis.get("documentType", "other"),
        "summary": analysis.get("summary", ""),
        "riskClauses": analysis.get("riskClauses", []),
        "keyTerms": analysis.get("keyTerms", []),
        "createdAt": datetime.utcnow(),
    }

    result = await db.documents.insert_one(doc)

    return {
        "id": str(result.inserted_id),
        "fileName": file.filename,
        "fileUrl": file_url,
        "documentType": analysis.get("documentType", "other"),
        "summary": analysis.get("summary", ""),
        "riskClauses": analysis.get("riskClauses", []),
        "keyTerms": analysis.get("keyTerms", []),
        "createdAt": doc["createdAt"].isoformat(),
    }


@router.get("/history")
async def get_history(user_id: str = Depends(get_current_user_id)):
    cursor = db.documents.find({"userId": ObjectId(user_id)}).sort("createdAt", -1)
    docs = []
    async for doc in cursor:
        docs.append({
            "id": str(doc["_id"]),
            "fileName": doc.get("fileName", ""),
            "documentType": doc.get("documentType", "other"),
            "summary": doc.get("summary", "")[:200] + "..." if len(doc.get("summary", "")) > 200 else doc.get("summary", ""),
            "createdAt": doc["createdAt"].isoformat() if doc.get("createdAt") else "",
        })
    return {"documents": docs}


@router.get("/{doc_id}")
async def get_document(doc_id: str, user_id: str = Depends(get_current_user_id)):
    try:
        oid = ObjectId(doc_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid document ID.")

    doc = await db.documents.find_one({"_id": oid, "userId": ObjectId(user_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    return {
        "id": str(doc["_id"]),
        "fileName": doc.get("fileName", ""),
        "fileUrl": doc.get("fileUrl", ""),
        "documentType": doc.get("documentType", "other"),
        "summary": doc.get("summary", ""),
        "riskClauses": doc.get("riskClauses", []),
        "keyTerms": doc.get("keyTerms", []),
        "createdAt": doc["createdAt"].isoformat() if doc.get("createdAt") else "",
    }


@router.delete("/{doc_id}")
async def delete_document(doc_id: str, user_id: str = Depends(get_current_user_id)):
    try:
        oid = ObjectId(doc_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid document ID.")

    result = await db.documents.delete_one({"_id": oid, "userId": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Document not found.")

    return {"message": "Document deleted successfully."}
