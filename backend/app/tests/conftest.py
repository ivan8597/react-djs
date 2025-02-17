import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def mock_model(monkeypatch):
    class MockModel:
        def predict(self, texts):
            return [{"positive": 0.8, "negative": 0.1, "neutral": 0.1}]
    
    monkeypatch.setattr("app.main.model", MockModel()) 