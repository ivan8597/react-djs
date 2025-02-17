import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "API работает", "status": "active"}

def test_analyze_empty_text():
    response = client.post("/analyze", json={"text": ""})
    assert response.status_code == 400
    assert "Текст не может быть пустым" in response.json()["detail"]

def test_analyze_valid_text():
    test_text = "Это очень хороший день!"
    response = client.post("/analyze", json={"text": test_text})
    assert response.status_code == 200
    result = response.json()
    assert "status" in result
    assert "result" in result
    assert isinstance(result["result"], dict)
    assert "positive" in result["result"]

def test_analyze_invalid_request():
    response = client.post("/analyze", json={})
    assert response.status_code == 422

@pytest.fixture
def text_file(tmp_path):
    file_path = tmp_path / "test.txt"
    file_path.write_text("Это тестовый текст для анализа.")
    return file_path

def test_upload_text_file(text_file):
    with open(text_file, "rb") as f:
        response = client.post("/upload", files={"file": ("test.txt", f, "text/plain")})
    assert response.status_code == 200
    result = response.json()
    assert "status" in result
    assert "result" in result

def test_upload_empty_file(tmp_path):
    empty_file = tmp_path / "empty.txt"
    empty_file.write_text("")
    with open(empty_file, "rb") as f:
        response = client.post("/upload", files={"file": ("empty.txt", f, "text/plain")})
    assert response.status_code == 400
    assert "Файл пуст" in response.json()["detail"]

def test_upload_no_file():
    response = client.post("/upload")
    assert response.status_code == 422

def test_analyze_long_text():
    long_text = "Это " * 1000 + "тест."
    response = client.post("/analyze", json={"text": long_text})
    assert response.status_code == 200
    assert "result" in response.json()

def test_analyze_special_characters():
    special_text = "Текст с !@#$%^&*()_+ символами"
    response = client.post("/analyze", json={"text": special_text})
    assert response.status_code == 200
    assert "result" in response.json() 