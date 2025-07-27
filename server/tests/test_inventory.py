import pytest
from httpx import AsyncClient, ASGITransport
from src.main import app
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from src.models import UserModel, SweetModel, CategoryModel
from src.utils.env import env_settings
import pytest_asyncio


# ----------- DATABASE CLEANUP -----------
@pytest_asyncio.fixture(scope="function", autouse=True)
async def clean_db():
    client = AsyncIOMotorClient(env_settings.MONGO_URI)
    await init_beanie(
        database=client.sweet_shop,
        document_models=[UserModel, SweetModel, CategoryModel],
    )
    await UserModel.find_all().delete()
    await SweetModel.find_all().delete()
    await CategoryModel.find_all().delete()


# ----------- HTTPX CLIENT -----------
@pytest_asyncio.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


# ----------- HELPERS -----------
async def register_and_login(client, is_admin=True):
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
    res = await client.post(
        "/api/sweets/categories",
        json={"name": name},
        headers={"Authorization": token},
    )
    if res.status_code == 201:
        return res.json()["data"]["name"]
    elif res.status_code == 400 and "already exists" in res.json().get("detail", ""):
        return name
    else:
        raise Exception(f"Failed to create category: {res.status_code} - {res.text}")


# ---------- NEW TEST: PURCHASE SWEET ----------
@pytest.mark.asyncio
async def test_purchase_sweet(client):
    token = await register_and_login(client)
    category = await create_category(client, token, "Buyable Sweets")

    create_res = await client.post(
        "/api/sweets",
        json={
            "name": "Rasgulla",
            "category": category,
            "price": 25,
            "quantity": 50,
        },
        headers={"Authorization": token},
    )
    sweet_id = create_res.json()["data"]["_id"]

    purchase_res = await client.post(
        f"/api/sweets/{sweet_id}/purchase",
        json={"quantity": 5},
        headers={"Authorization": token},
    )

    assert purchase_res.status_code == 200
    data = purchase_res.json()["data"]
    assert data["name"] == "Rasgulla"
    assert data["quantity"] == 45


# ---------- NEW TEST: RESTOCK (Admin) ----------
@pytest.mark.asyncio
async def test_restock_sweet_as_admin(client):
    admin_token = await register_and_login(client, is_admin=True)
    category = await create_category(client, admin_token, "Stockables")

    create_res = await client.post(
        "/api/sweets",
        json={
            "name": "Peda",
            "category": category,
            "price": 20,
            "quantity": 30,
        },
        headers={"Authorization": admin_token},
    )
    sweet_id = create_res.json()["data"]["_id"]

    restock_res = await client.post(
        f"/api/sweets/{sweet_id}/restock",
        json={"quantity": 10},
        headers={"Authorization": admin_token},
    )

    assert restock_res.status_code == 200
    data = restock_res.json()["data"]
    assert data["quantity"] == 40


# ---------- NEGATIVE TEST: Non-admin can't restock ----------
@pytest.mark.asyncio
async def test_restock_sweet_as_non_admin_should_fail(client):
    user_token = await register_and_login(client, is_admin=False)
    admin_token = await register_and_login(client, is_admin=True)
    category = await create_category(client, admin_token, "Protected")

    create_res = await client.post(
        "/api/sweets",
        json={
            "name": "Gulab Jamun",
            "category": category,
            "price": 15,
            "quantity": 20,
        },
        headers={"Authorization": admin_token},
    )
    sweet_id = create_res.json()["data"]["_id"]

    restock_res = await client.post(
        f"/api/sweets/{sweet_id}/restock",
        json={"quantity": 5},
        headers={"Authorization": user_token},
    )

    assert restock_res.status_code in [401, 403]
