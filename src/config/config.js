const dotenv = require('dotenv');
const path = require('path');

// Загрузка переменных окружения из .env файла
dotenv.config();

// Конфигурационные параметры
const config = {
  // Порт для HTTP-сервера
  port: process.env.PORT || 3000,
  
  // Данные пользователя
  user: {
    name: process.env.USER_NAME || 'Пользователь',
    email: process.env.USER_EMAIL || 'example@mail.com',
    location: process.env.USER_LOCATION || 'Город, Страна',
    photoUrl: process.env.USER_PHOTO_URL || '',
    github: process.env.USER_GITHUB || 'https://github.com'
  },
  
  // API токены
  tokens: {
    github: process.env.GITHUB_TOKEN || ''
  },
  
  // Пути к файлам
  paths: {
    templates: path.join(__dirname, '..', 'templates')
  }
};

module.exports = config; 