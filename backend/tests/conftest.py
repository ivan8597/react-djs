import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db

# Создаем тестовую базу данных в памяти
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine( # Создаем движок для тестовой базы данных
    SQLALCHEMY_DATABASE_URL, # URL тестовой базы данных
    connect_args={"check_same_thread": False}, # Параметры подключения
    poolclass=StaticPool, # Класс пула подключений
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Переопределяем зависимость get_db для тестов
def override_get_db():
    try:
        db = TestingSessionLocal() # Создаем сессию базы данных для тестов
        yield db # Возвращаем сессию базы данных для тестов
    finally:
        db.close() # Закрываем сессию базы данных для тестов

app.dependency_overrides[get_db] = override_get_db # Переопределяем зависимость get_db для тестов

@pytest.fixture # Фикстура для создания тестового клиента FastAPI
def client():
    """Создает тестовый клиент FastAPI"""
    Base.metadata.create_all(bind=engine) # Создаем все таблицы в тестовой базе данных
    yield TestClient(app) # Возвращаем тестовый клиент FastAPI
    Base.metadata.drop_all(bind=engine) # Удаляем все таблицы в тестовой базе данных

@pytest.fixture # Фикстура для создания сессии базы данных для тестов
def db_session():
    """Создает сессию базы данных для тестов"""
    db = TestingSessionLocal() # Создаем сессию базы данных для тестов
    try:
        yield db # Возвращаем сессию базы данных для тестов
    finally:
        db.close() # Закрываем сессию базы данных для тестов