from fastapi import FastAPI
from .utils.db import init_db
from contextlib import asynccontextmanager
from .routes.auth import auth_router
from .routes.sweets import sweet_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI lifespan event handler.

    Args:
        app (FastAPI): The FastAPI application instance.

    Yields:
        None
    """
    await init_db()
    print("📦 Beanie initialized with MongoDB.")
    yield
    print("👋 App is shutting down...")


app = FastAPI(lifespan=lifespan)

# NOTE - Auth router
app.include_router(auth_router)
app.include_router(sweet_router)
