from dostoevsky.tokenization import RegexTokenizer
from dostoevsky.models import FastTextSocialNetworkModel

class SentimentAnalyzer:
    def __init__(self):
        self.tokenizer = RegexTokenizer()
        self.model = FastTextSocialNetworkModel(tokenizer=self.tokenizer)
    
    def analyze(self, text):
        results = self.model.predict([text])[0]
        
        # Определяем преобладающую тональность
        max_score = max(results.items(), key=lambda x: x[1])
        
        # Маппинг меток на русский язык
        label_mapping = {
            'positive': 'положительный',
            'neutral': 'нейтральный',
            'negative': 'отрицательный'
        }
        
        return {
            'text': text,
            'sentiment_label': label_mapping[max_score[0]],
            'sentiment_score': max_score[1]
        } 