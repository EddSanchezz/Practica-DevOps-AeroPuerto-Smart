from fastapi import APIRouter

from app.api import auth, flights, luggage, seed

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(flights.router)
api_router.include_router(luggage.router)
api_router.include_router(seed.router)
