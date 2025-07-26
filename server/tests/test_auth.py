import pytest
from httpx import AsyncClient, ASGITransport
from src.main import app
from src.models import UserModel
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from src.utils.env import env_settings
import pytest_asyncio


@pytest_asyncio.fixture(scope="function", autouse=True)
async def clean_db():
    client = AsyncIOMotorClient(env_settings.MONGO_URI)
    await init_beanie(database=client.sweet_shop, document_models=[UserModel])
    await UserModel.find_all().delete()


@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.mark.asyncio
async def test_register_user_success(client):
    response = await client.post(
        "/api/auth/register",
        json={
            "username": "Alex",
            "email": "alex@gmail.com",
            "password": "Password123",
        },
    )
    data = response.json()
    assert data["status"] == "success"


@pytest.mark.asyncio
async def test_register_user_duplicate(client):
    await client.post(
        "/api/auth/register",
        json={
            "username": "Alex",
            "email": "alex@gmail.com",
            "password": "Password123",
        },
    )
    response = await client.post(
        "/api/auth/register",
        json={
            "username": "Alex",
            "email": "alex@gmail.com",
            "password": "Password123",
        },
    )
    assert response.status_code == 400, response.text
    assert "User already registered" in response.text


@pytest.mark.asyncio
async def test_login_user_success(client):
    await client.post(
        "/api/auth/register",
        json={
            "username": "Alex",
            "email": "alex@gmail.com",
            "password": "Password123",
        },
    )
    response = await client.post(
        "/api/auth/login",
        json={
            "email": "alex@gmail.com",
            "password": "Password123",
        },
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["status"] == "success"
    assert "token" in data["data"]
    assert "role" in data["data"]


@pytest.mark.asyncio
async def test_login_user_invalid_password(client):
    await client.post(
        "/api/auth/register",
        json={
            "username": "Alex",
            "email": "alex@gmail.com",
            "password": "Password123",
        },
    )
    response = await client.post(
        "/api/auth/login",
        json={
            "email": "alex@gmail.com",
            "password": "WrongPassword",
        },
    )
    assert response.status_code == 401, response.text
    assert "Incorrect password" in response.text


@pytest.mark.asyncio
async def test_login_user_not_found(client):
    response = await client.post(
        "/api/auth/login",
        json={
            "email": "unknown@gmail.com",
            "password": "anything",
        },
    )
    assert response.status_code == 404, response.text
    assert "User not found" in response.text


@pytest.mark.asyncio
async def test_register_admin_user(client):
    response = await client.post(
        "/api/auth/register",
        json={
            "username": "Ansh Yadav",
            "email": "ansh_admin@gmail.com",
            "password": "AdminPass123",
            "is_admin": True,
        },
    )
    data = response.json()
    assert data["status"] == "success"
    assert data["data"] is None
    assert data["message"] == "User successfully registered"
