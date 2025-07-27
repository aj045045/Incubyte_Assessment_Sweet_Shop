from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional
from ..models import SweetModel, CategoryModel
from ..utils.auth import get_current_user, get_admin_user
from ..schemas.response import ResponseData
from ..schemas.sweets import SweetCreate, CategoryCreate, SweetUpdate

from typing import Optional

sweet_router = APIRouter(prefix="/api/sweets", tags=["Sweets"])


@sweet_router.post("", status_code=201, response_model=ResponseData)
async def add_sweet(data: SweetCreate, user=Depends(get_current_user)):
    """Add a new sweet item to the inventory.

    Args:
        data (SweetCreate): The data required to create a new sweet (name, category ID, price, quantity).
        user (_type_, optional): Authenticated user making the request. Defaults to Depends(get_current_user).

    Raises:
        HTTPException: If the provided category ID does not exist.

    Returns:
        ResponseData: Contains the created sweet object.
    """
    category = await CategoryModel.find_one(CategoryModel.name == data.category)
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
async def add_sweet_category(data: CategoryCreate, user=Depends(get_admin_user)):
    """Add a new sweet category.

    Args:
        data (CategoryCreate): The name of the category to create.
        user (_type_, optional): Authenticated user making the request. Defaults to Depends(get_current_user).

    Raises:
        HTTPException: If a category with the given name already exists.

    Returns:
        ResponseData: The created category object with its ID and name.
    """

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


@sweet_router.get(
    "/categories", status_code=status.HTTP_200_OK, response_model=ResponseData
)
async def get_sweet_categories(user=Depends(get_current_user)):
    """
    Retrieve all sweet categories.

    Args:
        user (_type_): Authenticated user making the request.

    Returns:
        ResponseData: A list of all sweet categories with their IDs and names.
    """
    categories = await CategoryModel.find_all().to_list()

    results = [{"id": str(cat.id), "name": cat.name} for cat in categories]
    return ResponseData(status="success", data=results)


@sweet_router.get("", status_code=200, response_model=ResponseData)
async def list_sweets(user=Depends(get_current_user)):
    """Retrieve a list of all sweets along with their category info.

    Returns:
        ResponseData: A list of all sweets, each including its name and category details.
    """
    sweets = await SweetModel.find_all().to_list()
    sweet_list = []

    for sweet in sweets:
        category_id = sweet.category.ref.id
        category = await CategoryModel.get(category_id)

        sweet_list.append(
            {
                "id": str(sweet.id),
                "name": sweet.name,
                "category": {
                    "id": str(category.id),
                    "name": category.name,
                },
                "price": sweet.price,
                "quantity": sweet.quantity,
            }
        )

    return ResponseData(status="success", data=sweet_list)


@sweet_router.get("/search", response_model=ResponseData)
async def search_sweets(
    name: Optional[str] = Query(
        None, description="Search sweets by name (partial match, case-insensitive)"
    ),
    category: Optional[str] = Query(None, description="Exact category name"),
    minPrice: Optional[float] = Query(None, ge=0, description="Minimum price"),
    maxPrice: Optional[float] = Query(None, ge=0, description="Maximum price"),
    min_quantity: Optional[int] = Query(
        None, ge=0, description="Minimum quantity available"
    ),
    user=Depends(get_current_user),
):
    """
    Search sweets by name, category, price range, and minimum quantity.
    Returns a list of sweets matching the criteria with populated category details.
    """
    # Start with a base query
    query = SweetModel.find()

    # Filter by name using regex
    if name:
        query = query.find({"name": {"$regex": f".*{name}.*", "$options": "i"}})

    # Filter by category (assuming category is a Link field)
    if category:
        category_doc = await CategoryModel.find_one(CategoryModel.name == category)
        if not category_doc:
            raise HTTPException(
                status_code=404, detail=f"Category '{category}' not found"
            )
        query = query.find(SweetModel.category.id == category_doc.id)
    # Filter by price range
    if minPrice is not None:
        query = query.find(SweetModel.price >= minPrice)
    if maxPrice is not None:
        query = query.find(SweetModel.price <= maxPrice)

    # Filter by minimum quantity
    if min_quantity is not None:
        query = query.find(SweetModel.quantity >= min_quantity)

    # Execute the query and return the results
    sweets = await query.to_list()
    sweet_list = []
    for sweet in sweets:
        category_id = sweet.category.ref.id
        category = await CategoryModel.get(category_id)
        print(category.name)

        sweet_list.append(
            {
                "id": str(sweet.id),
                "name": sweet.name,
                "category": {
                    "id": str(category.id),
                    "name": category.name,
                },
                "price": sweet.price,
                "quantity": sweet.quantity,
            }
        )
    return ResponseData(status="success", data=sweet_list)


@sweet_router.put("/{sweet_id}", response_model=ResponseData, status_code=200)
async def update_sweet(
    sweet_id: str,
    update_data: SweetUpdate,
    user=Depends(get_admin_user),
):
    """
    Update an existing sweet's details. Only accessible by admins.

    Args:
        sweet_id (str): ID of the sweet to update.
        update_data (SweetUpdate): Fields to update.
        user: Authenticated admin user.

    Raises:
        HTTPException: If the sweet doesn't exist or category is invalid.

    Returns:
        ResponseData: Updated sweet info.
    """
    sweet = await SweetModel.get(sweet_id)
    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")

    # Update fields only if they are provided
    if update_data.name is not None:
        sweet.name = update_data.name

    if update_data.price is not None:
        sweet.price = update_data.price

    if update_data.quantity is not None:
        sweet.quantity = update_data.quantity

    await sweet.save()

    return ResponseData(
        status="success",
        data={
            "id": str(sweet.id),
            "name": sweet.name,
            "price": sweet.price,
            "quantity": sweet.quantity,
        },
    )


@sweet_router.delete("/{sweet_id}", status_code=200, response_model=ResponseData)
async def delete_sweet(sweet_id: str, user=Depends(get_admin_user)):
    """Delete a sweet from the inventory (admin only).

    Args:
        sweet_id (str): The ID of the sweet to be deleted.
        user (_type_, optional): Authenticated admin user. Defaults to Depends(get_admin_user).

    Raises:
        HTTPException: If the sweet does not exist.

    Returns:
        ResponseData: Success message confirming deletion.
    """
    sweet = await SweetModel.get(sweet_id)
    if not sweet:
        raise HTTPException(status_code=404, detail="Sweet not found")

    await sweet.delete()
    return ResponseData(status="success", message="Sweet successfully deleted")
