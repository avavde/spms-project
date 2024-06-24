# Указываем базовый образ
FROM node:14

# Создаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код приложения
COPY . .

# Устанавливаем порт для сервера
EXPOSE 5000

# Запускаем сервер
CMD ["npm", "start"]
