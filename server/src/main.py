from fastapi import FastAPI, HTTPException
from .models import UserModel
from .schemas.user_login import UserLogin
from .utils.auth import hash_password, verify_password, create_access_token
from datetime import timedelta
from .utils.env import env_settings
from .utils.db import init_db
from contextlib import asynccontextmanager
from .schemas.response import ResponseData
from .schemas.token import Token


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    print("📦 Beanie initialized with MongoDB.")
    yield
    print("👋 App is shutting down...")


app = FastAPI(lifespan=lifespan)


@app.post("/api/auth/register", response_model=ResponseData[None])
async def register_user(user: UserModel):
    existing_user = await UserModel.find_one(UserModel.email == user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="User already registered")

    hashed_pw = hash_password(user.password)
    if user.is_admin:
        user_doc = UserModel(
            username=user.username,
            email=user.email,
            password=hashed_pw,
            is_admin=user.is_admin,
        )
    else:
        user_doc = UserModel(
            username=user.username, email=user.email, password=hashed_pw
        )
    await user_doc.insert()
    return ResponseData(status="success", message="User successfully registered")


@app.post("/api/auth/login", response_model=ResponseData[Token])
async def login_user(user: UserLogin):
    stored_user = await UserModel.find_one(UserModel.email == user.email)
    if not stored_user:
        raise HTTPException(status_code=404, detail="User not found")
    if not verify_password(user.password, stored_user.password):
        raise HTTPException(status_code=401, detail="Incorrect password")

    if stored_user.is_admin:
        token_data = {"sub": user.email, "role": "admin"}
    else:
        token_data = {"sub": user.email, "role": "user"}

    access_token = create_access_token(
        data=token_data,
        expires_delta=timedelta(minutes=env_settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return ResponseData(
        status="success", data=Token(token=access_token, role=token_data["role"])
    )
