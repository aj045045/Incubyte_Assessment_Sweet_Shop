from typing import Generic, TypeVar, Optional
from typing_extensions import Literal
from pydantic import BaseModel

T = TypeVar("T")


class ResponseData(BaseModel, Generic[T]):
    """
    Generic response schema for standardizing API responses.

    Type Args:
        T: The type of the `data` field. Allows flexibility for different response payloads.

    Attributes:
        status (Literal["success", "fail"]): Indicates the outcome of the request.
        data (Optional[T]): The actual payload of the response.
        message (Optional[str]): A human-readable message providing additional context.
    """

    status: Literal["success", "fail"]
    data: Optional[T] = None
    message: Optional[str] = None
