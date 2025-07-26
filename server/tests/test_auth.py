import pytest
from httpx import AsyncClient, ASGITransport
from src.main import app
from src.models import UserModel
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from src.utils.env import env_settings
import pytest_asyncio

# ----------------------------
# FIXTURES
# ----------------------------

@pytest_asyncio.fixture(scope="function", autouse=True)
async def clean_db():
    """
    Fixture to clean the UserModel collection before each test.
    Ensures a fresh and isolated test environment.
    """
    client = AsyncIOMotorClient(env_settings.MONGO_URI)
    await init_beanie(database=client.sweet_shop, document_models=[UserModel])
    await UserModel.find_all().delete()


@pytest_asyncio.fixture
async def client():
    """
    Fixture to create an Async HTTP client for testing the FastAPI app
    using ASGITransport to avoid network overhead.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

# ----------------------------
# TEST CASES
# ----------------------------

@pytest.mark.asyncio
async def test_register_user_success(client):
    """
    Test that a user can register successfully.
    """
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
    """
    Test that registering with the same email twice results in an error.
    """
    # First registration
    await client.post(
        "/api/auth/register",
        json={
            "username": "Alex",
            "email": "alex@gmail.com",
            "password": "Password123",
        },
    )
    # Duplicate registration attempt
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
    """
    Test that a registered user can log in and receive a valid token and role.
    """
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
    """
    Test login fails if an incorrect password is provided.
    """
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
    """
    Test login fails for a non-existent user.
    """
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
    """
    Test successful registration of an admin user.
    """
    response = await client.post(
        "/api/auth/register",
        json={
            "username": "Ansh Yadav",
            "email": "ansh_admin@gmail.com",
            "password": "AdminPass123",
            "is_admin": True,  # Extra field to register as admin
        },
    )
    data = response.json()
    assert data["status"] == "success"
    assert data["data"] is None
    assert data["message"] == "User successfully registered"
