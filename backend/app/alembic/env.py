from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))) # Добавляет путь к корневой директории проекта

from app.models import Base # Импортирует модель Base
from app.database import SQLALCHEMY_DATABASE_URL # Импортирует URL базы данных

config = context.config # Получает конфигурацию Alembic
fileConfig(config.config_file_name) # Конфигурирует Alembic

target_metadata = Base.metadata # Получает метаданные модели Base

def run_migrations_offline():
    url = SQLALCHEMY_DATABASE_URL # Получает URL базы данных
    context.configure(
        url=url, # Указывает URL базы данных
        target_metadata=target_metadata, # Указывает метаданные модели Base
        literal_binds=True, # Использует прямое сопоставление
        dialect_opts={"paramstyle": "named"}, # Использует именованные параметры
    )

    with context.begin_transaction(): # Начинает транзакцию
        context.run_migrations() # Выполняет миграции

def run_migrations_online():
    configuration = config.get_section(config.config_ini_section) # Получает секцию конфигурации
    configuration["sqlalchemy.url"] = SQLALCHEMY_DATABASE_URL # Указывает URL базы данных
    connectable = engine_from_config( # Создаёт движок для базы данных
        configuration, # Конфигурация
        prefix="sqlalchemy.", # Префикс
        poolclass=pool.NullPool, # Класс пула
    )

    with connectable.connect() as connection: # Подключается к базе данных
        context.configure(
            connection=connection, target_metadata=target_metadata # Указывает метаданные модели Base
        )

        with context.begin_transaction(): # Начинает транзакцию
            context.run_migrations() # Выполняет миграции

if context.is_offline_mode(): # Проверяет, является ли режим offline
    run_migrations_offline() # Выполняет миграции в offline режиме
else:
    run_migrations_online() # Выполняет миграции в online режиме