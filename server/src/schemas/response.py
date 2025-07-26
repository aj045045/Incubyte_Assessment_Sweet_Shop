from typing import Generic, TypeVar, Optional
from typing_extensions import Literal
from pydantic import BaseModel

T = TypeVar("T")


class ResponseData(BaseModel, Generic[T]):
    status: Literal["success", "fail"]
    data: Optional[T] = None
    message: Optional[str] = None
