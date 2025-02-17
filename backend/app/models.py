from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from .database import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String)
    sentiment_score = Column(Float)
    sentiment_label = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now()) 