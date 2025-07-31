from pydantic import BaseModel, Field
from typing import Optional
import datetime


class SweetCreate(BaseModel):
    """Schema for creating a new sweet item.

    Args:
        BaseModel (_type_): Pydantic base model used for request validation.
    """

    name: str
    category: str
    price: float
    quantity: int
    expiry_date: datetime.date = Field(
        default_factory=lambda: (
            datetime.datetime.today() + datetime.timedelta(days=1)
        ).date()
    )


class SweetUpdate(BaseModel):
    """Schema for updating an existing sweet item.

    All fields are optional to allow partial updates.

    Args:
        BaseModel (_type_): Pydantic base model used for request validation.
    """

    name: Optional[str]
    price: Optional[float]
    quantity: Optional[int]


class CategoryCreate(BaseModel):
    """Schema for creating a new category.

    Args:
        BaseModel (_type_): Pydantic base model used for request validation.
    """

    name: str = Field(
        ...,
        min_length=1,
        max_length=30,
        strip_whitespace=True,
        description="Name of the category (1-30 characters, no leading/trailing spaces)",
    )


class SweetPurchaseRequest(BaseModel):
    quantity: int = Field(..., gt=0)


class SweetRestockRequest(BaseModel):
    quantity: int = Field(..., gt=0)
