import pytest
from sqlalchemy.exc import SQLAlchemyError
from app.database import get_db, Base

class TestDatabase:
    
    def test_db_connection(self, client):
        """Тест проверяет, что соединение с БД работает"""
        # Используем client для инициализации БД
        # и проверяем, что get_db возвращает сессию
        try:
            db = next(get_db()) # Получает сессию базы данных
            assert db is not None # Проверяет, что сессия базы данных не равна None
        except SQLAlchemyError as e:
            pytest.fail(f"Не удалось подключиться к БД: {e}") # Проверяет, что не удалось подключиться к БД
        except StopIteration:
            pytest.fail("get_db не вернул сессию") # Проверяет, что get_db не вернул сессию