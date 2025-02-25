from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost/sentiment_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL) # Создаёт движок для базы данных
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) # Создаёт сессию для базы данных

Base = declarative_base() # Создаёт базовую модель для базы данных

def get_db():
    db = SessionLocal() # Создаёт сессию для базы данных
    try:
        yield db # Возвращает сессию для базы данных
    finally:
        db.close() # Закрывает сессию для базы данных