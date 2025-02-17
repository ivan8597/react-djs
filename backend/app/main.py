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
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
analyzer = SentimentAnalyzer()

# Настройка CORS с более широкими разрешениями
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешаем все источники (в продакшене лучше указать конкретные домены)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str

class AnalysisResponse(BaseModel):
    status: str
    result: Dict[str, Any]

try:
    logger.info("Инициализация модели...")
    tokenizer = RegexTokenizer()
    model = FastTextSocialNetworkModel(tokenizer=tokenizer)
    logger.info("Модель успешно инициализирована")
except Exception as e:
    logger.error(f"Ошибка при инициализации модели: {str(e)}")
    raise

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_text(request: TextRequest):
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Текст не может быть пустым")
    
    try:
        logger.info(f"Анализ текста: {request.text[:50]}...")
        results = model.predict([request.text.strip()])
        result = results[0] if results else {}
        logger.info(f"Результат анализа: {result}")
        return {"status": "success", "result": result}
    except Exception as e:
        logger.error(f"Ошибка при анализе текста: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze")
async def analyze_reviews(
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db)
):
    # Чтение CSV файла
    df = pd.read_csv(file.file)
    
    results = []
    for text in df["review"]:
        analysis = analyzer.analyze(text)
        
        # Сохранение в базу данных
        review = models.Review(
            text=text,
            sentiment_score=analysis["sentiment_score"],
            sentiment_label=analysis["sentiment_label"]
        )
        db.add(review)
        results.append(analysis)
    
    db.commit()
    
    # Подготовка статистики
    sentiment_counts = {
        "положительный": len([r for r in results if r["sentiment_label"] == "положительный"]),
        "нейтральный": len([r for r in results if r["sentiment_label"] == "нейтральный"]),
        "отрицательный": len([r for r in results if r["sentiment_label"] == "отрицательный"])
    }
    
    return {
        "results": results,
        "statistics": sentiment_counts
    }

@app.post("/upload", response_model=AnalysisResponse)
async def upload_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Файл пуст")
            
        try:
            text = content.decode('utf-8')
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="Файл должен быть текстовым в кодировке UTF-8")
            
        if not text.strip():
            raise HTTPException(status_code=400, detail="Файл пуст")
            
        results = model.predict([text.strip()])
        result = results[0] if results else {}
        return {"status": "success", "result": result}
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Ошибка при обработке файла: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "API работает", "status": "active"} 