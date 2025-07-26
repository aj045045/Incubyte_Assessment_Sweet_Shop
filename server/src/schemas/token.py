from pydantic import BaseModel


class Token(BaseModel):
    """
    Authentication token schema.

    Attributes:
        token (str): The access token string.
        role (str): The user's role.
    """

    token: str
    role: str
