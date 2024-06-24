#!/bin/bash

# Установка PostgreSQL
brew update
brew install postgresql

# Запуск службы PostgreSQL
brew services start postgresql

# Ожидание запуска службы
sleep 5

# Создание базы данных и пользователя
psql postgres -c "CREATE DATABASE spms;"
psql postgres -c "CREATE USER spmsuser WITH ENCRYPTED PASSWORD 'spmspass';"
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE spms TO spmsuser;"

# Выполнение SQL скрипта для инициализации структуры базы данных
psql -U spmsuser -d spms -f ./backend/init-bd.sql

echo "PostgreSQL setup completed. Database and tables created."

