import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import Base, engine
from app.core.config import settings

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_register_user():
    response = client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",
            "username": "testuser",
            "full_name": "Test User",
            "password": "testpass123",
        },
    )
    assert response.status_code in [201, 400]


def test_login_user():
    response = client.post(
        "/api/auth/login", data={"username": "testuser", "password": "testpass123"}
    )
    assert response.status_code in [200, 401]


def test_get_flights():
    response = client.get("/api/flights/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
