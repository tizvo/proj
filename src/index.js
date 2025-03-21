const express = require('express');
const config = require('./config/config');
const resumeService = require('./services/resumeService');

// Создание экземпляра приложения Express
const app = express();

// Обработка GET запроса по основному маршруту "/"
app.get('/', async (req, res) => {
  try {
    // Получение страницы резюме (уже отрендеренной при старте или из кеша)
    const resumePage = await resumeService.getResumePage();
    
    // Установка заголовка Content-Type и отправка HTML страницы
    res.setHeader('Content-Type', 'text/html');
    res.send(resumePage);
  } catch (error) {
    // Обработка ошибок
    console.error('Ошибка при обработке запроса к главной странице:', error.message);
    res.status(500).send('Произошла ошибка при загрузке резюме');
  }
});

// Маршрут для принудительного обновления резюме
app.get('/refresh', async (req, res) => {
  try {
    // Повторный рендер страницы резюме
    const updatedResumePage = await resumeService.renderResume();
    
    // Установка заголовка Content-Type и отправка обновленной HTML страницы
    res.setHeader('Content-Type', 'text/html');
    res.send(updatedResumePage);
  } catch (error) {
    // Обработка ошибок
    console.error('Ошибка при обновлении резюме:', error.message);
    res.status(500).send('Произошла ошибка при обновлении резюме');
  }
});

// Запуск HTTP сервера
const startServer = async () => {
  try {
    // Инициализация сервиса резюме и первоначальный рендер страницы
    await resumeService.renderResume();
    console.log('Страница резюме успешно отрендерена');
    
    // Запуск сервера на указанном порте
    app.listen(config.port, () => {
      console.log(`Сервер запущен на порту ${config.port}`);
      console.log(`Откройте http://localhost:${config.port} в браузере для просмотра резюме`);
      console.log(`Для обновления данных резюме перейдите по адресу http://localhost:${config.port}/refresh`);
    });
  } catch (error) {
    console.error('Ошибка при запуске сервера:', error.message);
    process.exit(1);
  }
};

// Запуск сервера
startServer(); 