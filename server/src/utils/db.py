from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from .env import env_settings
from ..models import UserModel, CategoryModel, SweetModel


async def init_db():
    """
    Initializes the MongoDB connection and Beanie document models.

    Models registered:
        - UserModel
        - CategoryModel
        - SweetModel

    Environment Variables Required (via `env_settings`):
        - MONGO_URI (str): MongoDB connection URI (e.g., "mongodb://localhost:27017").
        - MONGO_DB (str): Name of the MongoDB database to use.
    """
    client = AsyncIOMotorClient(env_settings.MONGO_URI)
    database = client[env_settings.MONGO_DB]
    await init_beanie(
        database=database, document_models=[UserModel, CategoryModel, SweetModel]
    )
