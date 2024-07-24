#!/bin/bash

# Остановка скрипта при ошибке
set -e

PATH=/root/.nvm/versions/node/v20.15.1/bin:$PATH

cd /home/spms-project/frontend
# Установка зависимостей


# Запуск проекта
npm start


echo "Frontend project is running successfully"
