from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from .env import env_settings
from ..models import UserModel

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")


def create_access_token(data: dict, expires_delta: timedelta = None):
    """
    Generates a signed JWT access token.

    Args:
        data (dict): Payload to encode into the JWT (e.g., {"sub": user.email, "role": user.role}).
        expires_delta (timedelta, optional): Optional custom expiration time.

    Returns:
        str: Encoded JWT token string.
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=env_settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(
        to_encode, env_settings.SECRET_KEY, algorithm=env_settings.ALGORITHM
    )


def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Decodes the JWT and extracts user information from it.

    Args:
        token (str): JWT token extracted from the request Authorization header.

    Raises:
        HTTPException: If the token is invalid or missing required fields.

    Returns:
        dict: Dictionary containing user information such as email and role.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, env_settings.SECRET_KEY, algorithms=[env_settings.ALGORITHM]
        )
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if not email or not role:
            raise credentials_exception
        return {"email": email, "role": role}
    except JWTError:
        raise credentials_exception


async def get_admin_user(user: UserModel = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return user
