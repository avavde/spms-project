#!/bin/bash

# Остановка скрипта при ошибке
set -e

# Переход в директорию проекта (замените на вашу директорию)
cd /home/spms-project

# Запуск проекта
/root/.nvm/versions/node/v20.15.1/bin/npm start

# Или если используется create-react-app:
# npm run start

# Сообщение об успешном запуске
echo "Frontend project is running successfully"