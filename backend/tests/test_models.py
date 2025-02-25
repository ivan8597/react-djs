import pytest
from datetime import datetime
from app.models import Review
from sqlalchemy.orm import Session

class TestModels:
    
    def test_create_review(self, db_session: Session):
        """Тест создания записи в таблице Review"""
        # Создаем тестовую запись
        review = Review( # Создаём тестовую запись
            text="Тестовый текст для обзора", # Текст обзора
            sentiment_score=0.85, # Оценка настроения
            sentiment_label="положительный" # Настроение
        )
        
        # Добавляем в БД
        db_session.add(review) # Добавляем запись в БД
        db_session.commit() # Сохраняем запись в БД
        db_session.refresh(review) # Обновляем запись в БД
        
        # Проверяем, что запись создана корректно
        assert review.id is not None # Проверяем, что id не равен None
        assert review.text == "Тестовый текст для обзора" # Проверяем, что текст обзора равен "Тестовый текст для обзора"
        assert review.sentiment_score == 0.85 # Проверяем, что оценка настроения равна 0.85
        assert review.sentiment_label == "положительный" # Проверяем, что настроение равно "положительный"
        assert isinstance(review.created_at, datetime) # Проверяем, что created_at является datetime
    
    def test_query_reviews(self, db_session: Session):
        """Тест запроса записей из таблицы Review"""
        # Создаем несколько тестовых записей
        reviews = [
            Review(text="Первый тест", sentiment_score=0.7, sentiment_label="положительный"), # Создаём первую запись
            Review(text="Второй тест", sentiment_score=0.2, sentiment_label="отрицательный"), # Создаём вторую запись
            Review(text="Третий тест", sentiment_score=0.5, sentiment_label="нейтральный") # Создаём третью запись
        ]
        
        # Добавляем в БД
        for review in reviews:
            db_session.add(review) # Добавляем запись в БД
        db_session.commit() # Сохраняем запись в БД
        
        # Проверяем количество записей
        all_reviews = db_session.query(Review).all() # Получаем все записи из БД
        assert len(all_reviews) == 3 # Проверяем, что количество записей равно 3
        
        # Проверяем фильтрацию
        positive_reviews = db_session.query(Review).filter(Review.sentiment_label == "положительный").all() # Получаем все положительные записи из БД
        assert len(positive_reviews) == 1 # Проверяем, что количество положительных записей равно 1
        assert positive_reviews[0].text == "Первый тест" # Проверяем, что текст первой положительной записи равен "Первый тест" 