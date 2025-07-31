from beanie import Document, Link
from pydantic import Field
from .category import CategoryModel
from bson import ObjectId
import datetime


class SweetModel(Document):
    """Sweet Model that is used to store the sweets to be sold.

    Inherits from:
        Document (Beanie): Enables asynchronous ODM features with MongoDB.

    Attributes:
        name (str): The name of the sweet, Not longer then 50 characters.
        category (Category): The link between the sweet and category, The category of the sweets.
        price (int): The price of the sweets, Greater then 0.
        quantity (int): The remaining quantity of the sweets, Greater then 0.
    """

    name: str = Field(..., max_length=50)
    category: Link[CategoryModel]
    price: float = Field(..., ge=0)
    quantity: int = Field(..., ge=0)
    expiry_date: datetime.date = Field(...)

    class Settings:
        name = "sweets"

    class Config:
        json_encoders = {ObjectId: str}
        allow_population_by_field_name = True
