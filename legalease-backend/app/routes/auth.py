from fastapi import APIRouter, HTTPException, Depends
from app.models.user import UserRegister, UserLogin
from app.config import db
from app.utils.auth_utils import hash_password, verify_password, create_token, get_current_user_id

router = APIRouter()


@router.post("/register")
async def register(data: UserRegister):
    # Check if email already exists
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered. Please login.")

    # Hash password and store user
    user_doc = {
        "name": data.name,
        "email": data.email,
        "password": hash_password(data.password),
    }
    result = await db.users.insert_one(user_doc)

    # Create JWT token
    token = create_token({"userId": str(result.inserted_id)})

    return {
        "message": "Account created successfully!",
        "token": token,
        "user": {"id": str(result.inserted_id), "name": data.name, "email": data.email},
    }


@router.post("/login")
async def login(data: UserLogin):
    user = await db.users.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=401, detail="No account found with this email.")

    if not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect password.")

    token = create_token({"userId": str(user["_id"])})

    return {
        "message": "Login successful!",
        "token": token,
        "user": {"id": str(user["_id"]), "name": user["name"], "email": user["email"]},
    }


@router.get("/me")
async def get_me(user_id: str = Depends(get_current_user_id)):
    from bson import ObjectId

    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    return {"id": str(user["_id"]), "name": user["name"], "email": user["email"]}
