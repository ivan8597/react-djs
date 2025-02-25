from dostoevsky.tokenization import RegexTokenizer
from dostoevsky.models import FastTextSocialNetworkModel

class SentimentAnalyzer:
    def __init__(self):
        self.tokenizer = RegexTokenizer() # Инициализация токенизатора
        self.model = FastTextSocialNetworkModel(tokenizer=self.tokenizer) # Инициализация модели
    
    def analyze(self, text):
        results = self.model.predict([text])[0] # Анализ текста
        
        # Определяем преобладающую тональность
        max_score = max(results.items(), key=lambda x: x[1]) # Определение преобладающей тональности
        
        # Маппинг меток на русский язык
        label_mapping = {
            'positive': 'положительный', # Маппинг меток на русский язык
            'neutral': 'нейтральный', # Маппинг меток на русский язык
            'negative': 'отрицательный' # Маппинг меток на русский язык
        }
        
        return {
            'text': text, # Текст для анализа
            'sentiment_label': label_mapping[max_score[0]], # Метка тональности
            'sentiment_score': max_score[1] # Оценка тональности
        } 