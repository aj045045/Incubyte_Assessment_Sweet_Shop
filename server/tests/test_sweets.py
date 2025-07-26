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
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


async def register_and_login(client, is_admin=False):
    user_data = {
        "username": "TestAdmin" if is_admin else "TestUser",
        "email": "admin@example.com" if is_admin else "user@example.com",
        "password": "Password123",
        "is_admin": is_admin,
    }
    await client.post("/api/auth/register", json=user_data)
    response = await client.post(
        "/api/auth/login",
        json={
            "email": user_data["email"],
            "password": user_data["password"],
        },
    )
    return f"Bearer {response.json()['data']['token']}"


async def create_category(client, token, name="Indian"):
    res = await client.post(
        "/api/sweets/categories", json={"name": name}, headers={"Authorization": token}
    )
    return res.json()["data"]["_id"]


@pytest.mark.asyncio
async def test_add_sweet(client):
    token = await register_and_login(client)
    category_id = await create_category(client, token)

    response = await client.post(
        "/api/sweets",
        json={"name": "Ladoo", "category": category_id, "price": 10, "quantity": 100},
        headers={"Authorization": token},
    )
    assert response.status_code == 201
    data = response.json()

    assert data["data"]["name"] == "Ladoo"
    assert data["data"]["quantity"] == 100


@pytest.mark.asyncio
async def test_get_all_sweets(client):
    token = await register_and_login(client)
    sweet_data = {
        "name": "Test Sweet",
        "price": 10.99,
        "quantity": 100,
        "category": "some_valid_category_id",
    }

    category_resp = await client.post(
        "/api/sweets/categories",
        json={"name": "Test Category"},
        headers={"Authorization": token},
    )

    category_id = category_resp.json()["data"]["_id"]
    sweet_data["category"] = category_id

    response_sweet = await client.post(
        "/api/sweets",
        json=sweet_data,
        headers={"Authorization": token},
    )
    response = await client.get("/api/sweets", headers={"Authorization": token})
    assert response.status_code == 200
    assert len(response.json()["data"]) > 0


@pytest.mark.asyncio
async def test_search_sweets(client):
    token = await register_and_login(client)
    indian_id = await create_category(client, token, "Indian")
    street_id = await create_category(client, token, "Street")

    await client.post(
        "/api/sweets",
        json={"name": "Kaju Katli", "category": indian_id, "price": 50, "quantity": 20},
        headers={"Authorization": token},
    )
    await client.post(
        "/api/sweets",
        json={"name": "Jalebi", "category": street_id, "price": 15, "quantity": 30},
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
    token = await register_and_login(client)
    category_id = await create_category(client, token)
    updated_category_id = await create_category(client, token, "Fusion")

    create_res = await client.post(
        "/api/sweets",
        json={"name": "Barfi", "category": category_id, "price": 30, "quantity": 40},
        headers={"Authorization": token},
    )
    sweet_id = create_res.json()["data"]["_id"]
    print("Create response", create_res.json())

    update_res = await client.put(
        f"/api/sweets/{sweet_id}",
        json={
            "name": "Chocolate Barfi",
            "category": updated_category_id,
            "price": 35,
            "quantity": 45,
        },
        headers={"Authorization": token},
    )
    print("Update response", update_res.json())
    assert update_res.status_code == 200
    assert update_res.json()["data"]["name"] == "Chocolate Barfi"
    assert update_res.json()["data"]["quantity"] == 45


@pytest.mark.asyncio
async def test_delete_sweet_as_admin(client):
    token = await register_and_login(client)
    admin_token = await register_and_login(client, is_admin=True)
    category_id = await create_category(client, token)

    create_res = await client.post(
        "/api/sweets",
        json={"name": "Halwa", "category": category_id, "price": 40, "quantity": 10},
        headers={"Authorization": token},
    )
    sweet_id = create_res.json()["data"]["_id"]

    delete_res = await client.delete(
        f"/api/sweets/{sweet_id}", headers={"Authorization": admin_token}
    )
    assert delete_res.status_code == 200
    assert "deleted" in delete_res.json()["message"].lower()


@pytest.mark.asyncio
async def test_delete_sweet_as_non_admin(client):
    token = await register_and_login(client)
    category_id = await create_category(client, token)

    create_res = await client.post(
        "/api/sweets",
        json={"name": "Halwa", "category": category_id, "price": 40, "quantity": 10},
        headers={"Authorization": token},
    )
    sweet_id = create_res.json()["data"]["_id"]

    delete_res = await client.delete(
        f"/api/sweets/{sweet_id}", headers={"Authorization": token}
    )
    assert delete_res.status_code == 403
    assert "not authorized" in delete_res.text.lower()
