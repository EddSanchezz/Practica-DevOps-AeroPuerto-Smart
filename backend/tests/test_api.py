def test_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_register_user(client):
    response = client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",
            "username": "testuser",
            "full_name": "Test User",
            "password": "testpass123",
        },
    )
    assert response.status_code == 201
    payload = response.json()
    assert payload["email"] == "test@example.com"
    assert payload["username"] == "testuser"


def test_login_user(client):
    client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",
            "username": "testuser",
            "full_name": "Test User",
            "password": "testpass123",
        },
    )
    response = client.post(
        "/api/auth/login", data={"username": "testuser", "password": "testpass123"}
    )
    assert response.status_code == 200
    payload = response.json()
    assert "access_token" in payload
    assert payload["token_type"] == "bearer"


def test_get_flights(client):
    response = client.get("/api/flights/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_flight_requires_auth(client):
    response = client.post(
        "/api/flights/",
        json={
            "flight_number": "AV123",
            "origin": "BOG",
            "destination": "MDE",
            "departure_time": "2026-05-07T10:00:00",
            "arrival_time": "2026-05-07T11:00:00",
            "gate": "A1",
            "status": "scheduled",
        },
    )
    assert response.status_code == 401