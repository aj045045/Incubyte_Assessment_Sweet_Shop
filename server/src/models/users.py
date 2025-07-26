from beanie import Document
from pydantic import Field, EmailStr


class UserModel(Document):
    """User Model that is used to manage users that can buy the sweets.

    Inherits from:
        Document (Beanie): Enables asynchronous ODM features with MongoDB.

    Attributes:
        username (str): The name of the users, Not longer then 50 characters.
        email (str): The email string, Must be unique.
        password (str): The password of the user.
        is_admin (bool): Define that it is admin, default false
    """

    username: str = Field(..., max_length=50)
    email: EmailStr = Field(..., json_schema_extra={"unique": "True"})
    password: str = Field(...)
    is_admin: bool = False

    class Settings:
        name = "users"
