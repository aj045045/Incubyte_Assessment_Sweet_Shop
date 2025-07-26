from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from .env import env_settings
from ..models import UserModel, CategoryModel, SweetModel


async def init_db():
    client = AsyncIOMotorClient(env_settings.MONGO_URI)
    database = client[env_settings.MONGO_DB]
    await init_beanie(
        database=database, document_models=[UserModel, CategoryModel, SweetModel]
    )
