from pydantic import BaseModel, EmailStr


class UserLogin(BaseModel):
    """
    Schema for user login credentials.

    Attributes:
        email (EmailStr): The user's email address. Must be a valid email format.
        password (str): The user's plain-text password.
    """

    email: EmailStr
    password: str
