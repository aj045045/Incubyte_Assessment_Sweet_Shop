from pydantic import BaseModel, Field
from typing import Optional


class SweetCreate(BaseModel):
    name: str
    category: str
    price: float
    quantity: int


class SweetUpdate(BaseModel):
    name: Optional[str]
    category: Optional[str]
    price: Optional[float]
    quantity: Optional[int]


class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=30, strip_whitespace=True)
