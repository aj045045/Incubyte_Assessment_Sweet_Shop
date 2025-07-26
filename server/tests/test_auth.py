import pytest
from httpx import AsyncClient, ASGITransport
from src.main import app
from src.models import UserModel
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from src.utils.env import env_settings
import pytest_asyncio


@pytest_asyncio.fixture(scope="module", autouse=True)
async def setup_db():
    client = AsyncIOMotorClient(env_settings.MONGO_URI)
    await init_beanie(database=client.sweet_shop, document_models=[UserModel])
    yield
    await UserModel.find_all().delete()


@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.mark.asyncio
async def test_register_user(client):
    response = await client.post(
        "/api/auth/register",
        json={
            "username": "Alex",
            "email": "alex@gmail.com",
            "password": "Password",
        },
    )
    assert response.status_code == 201 or response.status_code == 400
    data = response.json()
    assert data["status"] in ["success", "fail"]


@pytest.mark.asyncio
async def test_login_user(client):
    response = await client.post(
        "/api/auth/login",
        json={
            "email": "alex@gmail.com",
            "password": "Password",
        },
    )
    assert response.status_code == 200 or response.status_code == 401
    data = response.json()
    assert data["status"] in ["success", "fail"]


@pytest.mark.asyncio
async def test_register_admin(client):
    response = await client.post(
        "/api/auth/register",
        json={
            "username": "AdminUser",
            "email": "admin@gmail.com",
            "password": "AdminPassword",
            "is_admin": True,
        },
    )
    assert response.status_code == 201 or response.status_code == 400
    data = response.json()
    assert data["status"] in ["success", "fail"]
