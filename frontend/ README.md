# Анализатор тональности текста

Веб-приложение для анализа эмоциональной окраски текста на русском языке. Приложение определяет тональность текста (позитивную, негативную или нейтральную) с использованием модели машинного обучения.

## Технологии

### Backend
- Python 3.9
- FastAPI
- Dostoevsky (для анализа тональности)
- PostgreSQL

### Frontend
- React 18
- CSS3
- Docker

## Требования

- Docker
- Docker Compose
- Node.js 16+ (для локальной разработки)
- Python 3.9+ (для локальной разработки)

## Установка и запуск

1. Клонируйте репозиторий:

git clone <url-репозитория>
cd <название-проекта>
2. Запустите приложение с помощью Docker Compose:

docker-compose up --build

3. После успешного запуска:
- Frontend будет доступен по адресу: http://localhost:3000
- Backend API будет доступен по адресу: http://localhost:8000
- Swagger документация API: http://localhost:8000/docs

## Локальная разработка

### Backend

1. Перейдите в директорию backend:
bash
cd backend
2. Создайте виртуальное окружение:
bash
python -m venv venv
source venv/bin/activate # для Linux/Mac
venv\Scripts\activate # для Windows
3. Установите зависимости:
bash
pip install -r requirements.txt
4. Запустите сервер для разработки:
bash
pip install -r requirements.txt
4. Запустите сервер для разработки:
bash
uvicorn app.main:app --reload

### Frontend

1. Перейдите в директорию frontend:
bash
cd frontend

2. Установите зависимости:
bash
npm install
3. Запустите сервер для разработки:
bash
npm start
4. Запуск тестов:
bash
npm test


## Использование

1. **Анализ текста**:
   - Введите текст в текстовое поле
   - Нажмите кнопку "Анализировать текст"
   - Результаты анализа будут показаны ниже

2. **Анализ файла**:
   - Загрузите текстовый файл (.txt)
   - Результаты анализа будут показаны автоматически

## Структура проекта
