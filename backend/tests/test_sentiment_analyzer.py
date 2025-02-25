import pytest
from app.sentiment_analyzer import SentimentAnalyzer

class TestSentimentAnalyzer:
    
    @pytest.fixture # Декоратор для инициализации анализатора
    def analyzer(self):
        return SentimentAnalyzer() # Инициализирует анализатор
    
    def test_analyzer_initialization(self, analyzer):
        """Тест проверяет, что анализатор корректно инициализируется"""
        assert analyzer.tokenizer is not None # Проверяет, что токенизатор не равен None
        assert analyzer.model is not None # Проверяет, что модель не равна None
    
    def test_analyze_positive_text(self, analyzer):
        """Тест проверяет анализ положительного текста"""
        result = analyzer.analyze("Я очень рад сегодня, всё просто замечательно!") # Анализирует положительный текст
        assert result is not None # Проверяет, что результат не равен None
        assert "sentiment_label" in result # Проверяет, что в результате есть ключ "sentiment_label"
        assert "sentiment_score" in result # Проверяет, что в результате есть ключ "sentiment_score"
        assert result["sentiment_score"] > 0.3  # Предполагаем, что положительный текст имеет высокий скор
    
    def test_analyze_negative_text(self, analyzer):
        """Тест проверяет анализ отрицательного текста"""  
        result = analyzer.analyze("Ужасный день, все плохо, ничего не получается.") # Анализирует отрицательный текст
        assert result is not None # Проверяет, что результат не равен None
        assert "sentiment_label" in result # Проверяет, что в результате есть ключ "sentiment_label"
        assert "sentiment_score" in result # Проверяет, что в результате есть ключ "sentiment_score"
    
    def test_analyze_neutral_text(self, analyzer):
        """Тест проверяет анализ нейтрального текста""" 
        result = analyzer.analyze("Сегодня вторник. Завтра будет среда.") # Анализирует нейтральный текст
        assert result is not None # Проверяет, что результат не равен None
        assert "sentiment_label" in result # Проверяет, что в результате есть ключ "sentiment_label"
        assert "sentiment_score" in result # Проверяет, что в результате есть ключ "sentiment_score"
