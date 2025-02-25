from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from sqlalchemy.orm import Session
from . import models, database
from .sentiment_analyzer import SentimentAnalyzer
from pydantic import BaseModel, Field
from dostoevsky.tokenization import RegexTokenizer
from dostoevsky.models import FastTextSocialNetworkModel
import logging
from typing import Dict, Any

# Настройка логирования
logging.basicConfig(level=logging.INFO) # Настраивает логирование на уровне INFO
logger = logging.getLogger(__name__) # Получает логгер для текущего модуля

app = FastAPI() # Создаёт FastAPI приложение
analyzer = SentimentAnalyzer() # Инициализирует анализатор

# Настройка CORS с более широкими разрешениями
app.add_middleware( 
    CORSMiddleware, # Добавляет middleware для CORS
    allow_origins=["*"],  # Разрешаем все источники (в продакшене лучше указать конкретные домены)
    allow_credentials=True, # Разрешаем использовать учетные данные
    allow_methods=["*"], # Разрешаем все методы
    allow_headers=["*"], # Разрешаем все заголовки
)

class TextRequest(BaseModel): # Модель для текстового запроса
    text: str # Текст для анализа

class AnalysisResponse(BaseModel): # Модель для ответа на анализ
    status: str # Статус анализа
    result: Dict[str, Any] # Результат анализа

try:
    logger.info("Инициализация модели...") # Логирование инициализации модели
    tokenizer = RegexTokenizer() # Инициализирует токенизатор
    model = FastTextSocialNetworkModel(tokenizer=tokenizer) # Инициализирует модель
    logger.info("Модель успешно инициализирована") # Логирование успешной инициализации модели
except Exception as e:
    logger.error(f"Ошибка при инициализации модели: {str(e)}") # Логирование ошибки инициализации модели
    raise

@app.post("/analyze", response_model=AnalysisResponse) # Эндпоинт для анализа текста
async def analyze_text(request: TextRequest): # Асинхронная функция для анализа текста
    if not request.text or not request.text.strip(): # Проверка на пустой текст
        raise HTTPException(status_code=400, detail="Текст не может быть пустым") # Логирование ошибки
    
    try:
        logger.info(f"Анализ текста: {request.text[:50]}...") # Логирование анализа текста
        results = model.predict([request.text.strip()]) # Анализ текста
        result = results[0] if results else {} # Получение результата анализа
        logger.info(f"Результат анализа: {result}") # Логирование результата анализа
        return {"status": "success", "result": result} # Возвращение результата анализа
    except Exception as e:
        logger.error(f"Ошибка при анализе текста: {str(e)}") # Логирование ошибки при анализе текста
        raise HTTPException(status_code=500, detail=str(e)) # Возвращение ошибки при анализе текста

@app.post("/analyze") # Эндпоинт для анализа отзывов
async def analyze_reviews(
    file: UploadFile = File(...), # Файл для анализа
    db: Session = Depends(database.get_db) # Зависимость от базы данных
):
    # Чтение CSV файла
    df = pd.read_csv(file.file) # Чтение CSV файла
    
    results = [] # Список для хранения результатов анализа
    for text in df["review"]: # Цикл по всем отзывам
        analysis = analyzer.analyze(text) # Анализ отзыва
        
        # Сохранение в базу данных
        review = models.Review(  # Создание объекта отзыва
            text=text, # Текст отзыва
            sentiment_score=analysis["sentiment_score"], # Оценка настроения
            sentiment_label=analysis["sentiment_label"] # Настроение
        )
        db.add(review) # Добавление отзыва в базу данных
        results.append(analysis) # Добавление результата анализа в список
    
    db.commit() # Сохранение изменений в базе данных
    
    # Подготовка статистики
    sentiment_counts = {  # Словарь для хранения статистики
        "положительный": len([r for r in results if r["sentiment_label"] == "положительный"]), # Количество положительных отзывов
        "нейтральный": len([r for r in results if r["sentiment_label"] == "нейтральный"]), # Количество нейтральных отзывов
        "отрицательный": len([r for r in results if r["sentiment_label"] == "отрицательный"]) # Количество отрицательных отзывов
    }
    
    return {
        "results": results, # Результаты анализа
        "statistics": sentiment_counts # Статистика
    }

@app.post("/upload", response_model=AnalysisResponse) # Эндпоинт для загрузки файла
async def upload_file(file: UploadFile = File(...)): # Асинхронная функция для загрузки файла
    try:
        content = await file.read() # Чтение содержимого файла
        if not content: # Проверка на пустое содержимое
            raise HTTPException(status_code=400, detail="Файл пуст") # Логирование ошибки
            
        try:
            text = content.decode('utf-8') # Декодирование содержимого файла
        except UnicodeDecodeError:  # Обработка ошибки декодирования
            raise HTTPException(status_code=400, detail="Файл должен быть текстовым в кодировке UTF-8") # Логирование ошибки
            
        if not text.strip(): # Проверка на пустое содержимое
            raise HTTPException(status_code=400, detail="Файл пуст") # Логирование ошибки
            
        results = model.predict([text.strip()]) # Анализ текста
        result = results[0] if results else {} # Получение результата анализа
        return {"status": "success", "result": result} # Возвращение результата анализа
    except HTTPException as he:
        raise he # Логирование ошибки
    except Exception as e:
        logger.error(f"Ошибка при обработке файла: {str(e)}") # Логирование ошибки
        raise HTTPException(status_code=500, detail=str(e)) # Логирование ошибки

@app.get("/") # Эндпоинт для проверки работы API
async def root(): # Асинхронная функция для проверки работы API
    return {"message": "API работает", "status": "active"} # Возвращение сообщения о работе API