import os
from pathlib import Path

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


TEST_DB_PATH = Path(__file__).resolve().parent / "test.db"
TEST_DATABASE_URL = f"sqlite:///{TEST_DB_PATH.as_posix()}"

os.environ["DATABASE_URL"] = TEST_DATABASE_URL
os.environ["SECRET_KEY"] = "test-secret-key"
os.environ["DEBUG"] = "false"

from app.core.database import Base, get_db  # noqa: E402
from app.main import app  # noqa: E402


engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


def pytest_sessionstart(session):
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def pytest_sessionfinish(session, exitstatus):
    Base.metadata.drop_all(bind=engine)


def pytest_runtest_setup(item):
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def pytest_runtest_teardown(item, nextitem):
    Base.metadata.drop_all(bind=engine)


def _build_test_client():
    return TestClient(app)


import pytest  # noqa: E402


@pytest.fixture
def client():
    return _build_test_client()