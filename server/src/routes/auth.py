from fastapi import HTTPException, APIRouter
from ..models import UserModel
from ..schemas.user_login import UserLogin
from ..utils.auth import create_access_token
from ..utils.password import hash_password, verify_password
from datetime import timedelta
from ..utils.env import env_settings
from ..schemas.response import ResponseData
from ..schemas.token import Token

auth_router = APIRouter(prefix="/api/auth", tags=["Auth"])


# NOTE: Auth routes
@auth_router.post("/register", response_model=ResponseData[None])
async def register_user(user: UserModel):
    """
    Registers a new user.

    Args:
        user (UserModel): The user information from the request body.

    Raises:
        HTTPException: If the email is already registered.

    Returns:
        ResponseData[None]: Standard success message.
    """
    existing_user = await UserModel.find_one(UserModel.email == user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="User already registered")

    hashed_pw = hash_password(user.password)

    user_doc = UserModel(
        username=user.username,
        email=user.email,
        password=hashed_pw,
        is_admin=user.is_admin if user.is_admin else False,
    )
    await user_doc.insert()

    return ResponseData(status="success", message="User successfully registered")


@auth_router.post("/login", response_model=ResponseData[Token])
async def login_user(user: UserLogin):
    """
    Authenticates a user and returns a JWT access token.

    Args:
        user (UserLogin): Email and password credentials from request body.

    Raises:
        HTTPException: If user does not exist or password is incorrect.

    Returns:
        ResponseData[Token]: Success response with JWT token and role.
    """
    stored_user = await UserModel.find_one(UserModel.email == user.email)
    if not stored_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(user.password, stored_user.password):
        raise HTTPException(status_code=401, detail="Incorrect password")

    token_data = {
        "sub": user.email,
        "role": "admin" if stored_user.is_admin else "user",
    }

    access_token = create_access_token(
        data=token_data,
        expires_delta=timedelta(minutes=env_settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return ResponseData(
        status="success", data=Token(token=access_token, role=token_data["role"])
    )
