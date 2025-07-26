from fastapi import APIRouter, Depends, HTTPException, status
from typing import Optional
from ..models import SweetModel, CategoryModel
from ..utils.auth import get_current_user, get_admin_user
from ..schemas.response import ResponseData
from ..schemas.sweets import SweetCreate, SweetUpdate, CategoryCreate
from beanie import PydanticObjectId

sweet_router = APIRouter(prefix="/api/sweets", tags=["Sweets"])


@sweet_router.post("", status_code=201, response_model=ResponseData)
async def add_sweet(data: SweetCreate, user=Depends(get_current_user)):
    category = await CategoryModel.get(data.category)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    sweet = SweetModel(
        name=data.name,
        category=category,
        price=data.price,
        quantity=data.quantity,
    )
    await sweet.insert()
    await sweet.fetch_link(SweetModel.category)
    return ResponseData(status="success", data=sweet)


@sweet_router.post(
    "/categories", status_code=status.HTTP_201_CREATED, response_model=ResponseData
)
async def add_sweet_category(data: CategoryCreate, user=Depends(get_current_user)):
    category_exists = await CategoryModel.find_one(CategoryModel.name == data.name)

    if category_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Category already exists."
        )

    category = CategoryModel(name=data.name)
    await category.insert()

    return ResponseData(
        status="success", data={"_id": str(category.id), "name": category.name}
    )


@sweet_router.get("", status_code=200, response_model=ResponseData)
async def list_sweets():
    sweets = await SweetModel.find_all().to_list()
    sweet_list = []

    for sweet in sweets:
        category_id = sweet.category.ref.id
        category = await CategoryModel.get(category_id)

        sweet_list.append(
            {
                "_id": str(sweet.id),
                "name": sweet.name,
                "category": {
                    "_id": str(category.id),
                    "name": category.name,
                },
            }
        )

    return ResponseData(status="success", data=sweet_list)


@sweet_router.get("/search", status_code=200, response_model=ResponseData)
async def search_sweets(
    name: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    user=Depends(get_current_user),
):
    query = {}
    if name:
        query["name"] = {"$regex": name, "$options": "i"}
    if category:
        category_doc = await CategoryModel.find_one(CategoryModel.name == category)
        if category_doc:
            query["category"] = category_doc.id
        else:
            return ResponseData(status="success", data=[])
    if min_price is not None or max_price is not None:
        price_range = {}
        if min_price is not None:
            price_range["$gte"] = min_price
        if max_price is not None:
            price_range["$lte"] = max_price
        query["price"] = price_range

    sweets = await SweetModel.find(query).to_list()

    for sweet in sweets:
        await sweet.fetch_link(SweetModel.category)
    return ResponseData(status="success", data=sweets)


@sweet_router.put("/{sweet_id}", status_code=200, response_model=ResponseData)
async def update_sweet(
    sweet_id: PydanticObjectId, data: SweetUpdate, user=Depends(get_current_user)
):
    # Get sweet by ID
    sweet = await SweetModel.get(sweet_id)
    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")

    update_data = data.dict(exclude_unset=True)

    # Handle category update separately
    if "category" in update_data:
        category_id = update_data["category"]
        category = await CategoryModel.get(category_id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        sweet.category = (
            category  # Assign the full document or just category.id if needed
        )
        del update_data["category"]

    for key, value in update_data.items():
        setattr(sweet, key, value)

    await sweet.save()
    await sweet.fetch_link(SweetModel.category)
    response = {
        "_id": str(sweet.id),
        "name": sweet.name,
        "category": {
            "_id": str(sweet.category.id),
            "name": sweet.category.name,
        },
        "quantity": sweet.quantity,
    }

    return ResponseData(status="success", data=response)


@sweet_router.delete("/{sweet_id}", status_code=200, response_model=ResponseData)
async def delete_sweet(sweet_id: str, user=Depends(get_admin_user)):
    sweet = await SweetModel.get(sweet_id)
    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")

    await sweet.delete()
    return ResponseData(status="success", message="Sweet successfully deleted")
