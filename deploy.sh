#!/bin/bash

# Остановить текущий процесс
pm2 stop chernie-raboti

# Получить последние изменения
git pull

# Установить зависимости
npm install

# Собрать проект
npm run build

# Запустить с PM2
pm2 start ecosystem.config.cjs --env production

# Перезагрузить nginx
sudo systemctl reload nginx