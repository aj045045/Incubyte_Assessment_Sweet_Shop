import pytest
from httpx import AsyncClient, ASGITransport
from src.main import app
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from src.models import UserModel, SweetModel, CategoryModel
from src.utils.env import env_settings
import pytest_asyncio


@pytest_asyncio.fixture(scope="function", autouse=True)
async def clean_db():
    """Clean database before each test function.

    This fixture runs automatically before every test to:
    - Connect to MongoDB
    - Initialize Beanie ODM
    - Clear collections: User, Sweet, and Category
    """
    client = AsyncIOMotorClient(env_settings.MONGO_URI)
    await init_beanie(
        database=client.sweet_shop,
        document_models=[UserModel, SweetModel, CategoryModel],
    )
    await UserModel.find_all().delete()
    await SweetModel.find_all().delete()
    await CategoryModel.find_all().delete()


@pytest_asyncio.fixture
async def client():
    """Returns an HTTPX AsyncClient instance for making async API calls during tests."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


async def register_and_login(client, is_admin=True):
    """Registers and logs in a test user.

    Args:
        client (AsyncClient): Test client instance.
        is_admin (bool): Whether to register the user as admin.

    Returns:
        str: Bearer token for authorization.
    """
    user_data = {
        "username": "TestAdmin" if is_admin else "TestUser",
        "email": "admin@example.com" if is_admin else "user@example.com",
        "password": "Password123",
        "is_admin": is_admin,
    }
    await client.post("/api/auth/register", json=user_data)
    response = await client.post(
        "/api/auth/login",
        json={"email": user_data["email"], "password": user_data["password"]},
    )
    return f"Bearer {response.json()['data']['token']}"


async def create_category(client, token, name="Indian"):
    """Helper function to create a category if it doesn't exist. Requires admin token."""
    res = await client.post(
        "/api/sweets/categories",
        json={"name": name},
        headers={"Authorization": token},
    )

    # Return the name regardless of whether it already exists or not
    if res.status_code == 201:
        return res.json()["data"]["name"]
    elif res.status_code == 400 and "already exists" in res.json().get("detail", ""):
        return name
    else:
        print("CATEGORY CREATION FAILED:", res.status_code, res.json())
        raise Exception(f"Failed to create category: {res.status_code} - {res.text}")


@pytest.mark.asyncio
async def test_add_sweet(client):
    admin_token = await register_and_login(client, is_admin=True)
    category_name = await create_category(client, admin_token, name="Indian")

    response = await client.post(
        "/api/sweets",
        json={
            "name": "Ladoo",
            "category": category_name,
            "price": 10,
            "quantity": 100,
        },
        headers={"Authorization": admin_token},
    )

    assert response.status_code == 201
    data = response.json()["data"]
    assert data["name"] == "Ladoo"
    assert data["quantity"] == 100


@pytest.mark.asyncio
async def test_get_all_sweets(client):
    token = await register_and_login(client)
    category_name = "Test Category"
    await create_category(client, token, category_name)

    await client.post(
        "/api/sweets",
        json={
            "name": "Test Sweet",
            "price": 10.99,
            "quantity": 100,
            "category": category_name,
        },
        headers={"Authorization": token},
    )

    response = await client.get("/api/sweets", headers={"Authorization": token})
    assert response.status_code == 200
    assert len(response.json()["data"]) > 0


@pytest.mark.asyncio
async def test_search_sweets(client):
    token = await register_and_login(client)

    await create_category(client, token, "Indian")
    await create_category(client, token, "Street")

    await client.post(
        "/api/sweets",
        json={"name": "Kaju Katli", "category": "Indian", "price": 50, "quantity": 20},
        headers={"Authorization": token},
    )
    await client.post(
        "/api/sweets",
        json={"name": "Jalebi", "category": "Street", "price": 15, "quantity": 30},
        headers={"Authorization": token},
    )

    response = await client.get(
        "/api/sweets/search?category=Indian", headers={"Authorization": token}
    )

    assert response.status_code == 200
    for sweet in response.json()["data"]:
        assert sweet["category"]["name"] == "Indian"


@pytest.mark.asyncio
async def test_update_sweet(client):
    admin_token = await register_and_login(client, is_admin=True)
    category_name = await create_category(client, admin_token, "Traditional")

    create_res = await client.post(
        "/api/sweets",
        json={
            "name": "Barfi",
            "category": category_name,
            "price": 30,
            "quantity": 40,
        },
        headers={"Authorization": admin_token},
    )

    sweet_id = create_res.json()["data"]["_id"]

    update_res = await client.put(
        f"/api/sweets/{sweet_id}",
        json={"name": "Chocolate Barfi", "price": 35, "quantity": 45},
        headers={"Authorization": admin_token},
    )

    assert update_res.status_code == 200
    assert update_res.json()["data"]["name"] == "Chocolate Barfi"


@pytest.mark.asyncio
async def test_delete_sweet_as_admin(client):
    user_token = await register_and_login(client)
    admin_token = await register_and_login(client, is_admin=True)
    category_name = await create_category(client, admin_token, "Halwa Category")

    create_res = await client.post(
        "/api/sweets",
        json={
            "name": "Halwa",
            "category": category_name,
            "price": 40,
            "quantity": 10,
        },
        headers={"Authorization": user_token},
    )

    sweet_id = create_res.json()["data"]["_id"]

    delete_res = await client.delete(
        f"/api/sweets/{sweet_id}", headers={"Authorization": admin_token}
    )

    assert delete_res.status_code == 200
    assert "deleted" in delete_res.json()["message"].lower()
