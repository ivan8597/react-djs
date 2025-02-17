FROM python:3.9

WORKDIR /app

# Установка системных зависимостей
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Устанавливаем все зависимости включая тестовые
RUN pip install --no-cache-dir -r requirements.txt

# Установка моделей через pip
RUN pip install dostoevsky[fasttext]
RUN python -m dostoevsky download fasttext-social-network-model

COPY . .

# Добавляем команду для установки pytest и зависимостей для тестирования
RUN pip install pytest pytest-asyncio httpx

# Запускаем тесты при сборке образа
RUN python -m pytest

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"] 