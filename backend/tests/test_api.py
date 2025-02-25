import io
import pytest
from fastapi.testclient import TestClient

class TestAPI:
    
    def test_root_endpoint(self, client):
        """Тест корневого эндпоинта"""
        response = client.get("/") # Отправляет GET-запрос на корневой эндпоинт
        assert response.status_code == 200 # Проверяет, что статус-код ответа равен 200
        assert response.json() == {"message": "API работает", "status": "active"} # Проверяет, что ответ соответствует ожидаемому
    
    def test_analyze_text_valid(self, client):
        """Тест анализа валидного текста"""
        response = client.post( # Отправляет POST-запрос на эндпоинт анализа текста
            "/analyze",
            json={"text": "Хороший день для тестирования API!"} # Отправляет JSON-данные в запросе
        )
        assert response.status_code == 200 # Проверяет, что статус-код ответа равен 200
        data = response.json() # Получает JSON-ответ
        assert data["status"] == "success" # Проверяет, что статус ответа равен "success"
        assert "result" in data # Проверяет, что в ответе есть ключ "result"
        assert isinstance(data["result"], dict) # Проверяет, что значение ключа "result" является словарём
    
    def test_analyze_text_empty(self, client):
        """Тест анализа пустого текста"""
        response = client.post( # Отправляет POST-запрос на эндпоинт анализа текста
            "/analyze",
            json={"text": ""} # Отправляет JSON-данные в запросе
        )
        assert response.status_code == 400 # Проверяет, что статус-код ответа равен 400
        assert "detail" in response.json() # Проверяет, что в ответе есть ключ "detail"
    
    def test_upload_file_valid(self, client):
        """Тест загрузки валидного файла"""
        file_content = "Тестовый текст для загрузки через файл." # Содержимое файла
        response = client.post( # Отправляет POST-запрос на эндпоинт загрузки файла
            "/upload",
            files={"file": ("test.txt", io.BytesIO(file_content.encode("utf-8")), "text/plain")} # Отправляет файл в запросе
        )
        assert response.status_code == 200 # Проверяет, что статус-код ответа равен 200
        data = response.json() # Получает JSON-ответ
        assert data["status"] == "success" # Проверяет, что статус ответа равен "success"
        assert "result" in data # Проверяет, что в ответе есть ключ "result"
    
    def test_upload_file_empty(self, client):
        """Тест загрузки пустого файла"""
        response = client.post( # Отправляет POST-запрос на эндпоинт загрузки файла
            "/upload",
            files={"file": ("empty.txt", io.BytesIO(b""), "text/plain")} # Отправляет пустой файл в запросе
        )
        assert response.status_code == 400 # Проверяет, что статус-код ответа равен 400
        assert "detail" in response.json() # Проверяет, что в ответе есть ключ "detail"
