from beanie import Document
from pydantic import Field


class CategoryModel(Document):
    """Category Model that is used to manage the category of the sweets

    Inherits from:
        Document (Beanie): Enables asynchronous ODM features with MongoDB.

    Attributes:
        name (str): The name of the category, Unique and not longer then 30 characters.
    """

    name: str = Field(..., max_length=30, json_schema_extra={"unique": "True"})

    class Settings:
        name = "categories"
