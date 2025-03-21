const axios = require('axios');
const config = require('../config/config');

// Сервис для работы с GitHub API
class GitHubService {
  constructor(token) {
    this.token = token;
    this.axiosInstance = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        'Authorization': token ? `token ${token}` : '',
        'Accept': 'application/vnd.github.v3+json'
      }
    });
  }

  // Получение данных о пользователе GitHub
  async getUserInfo(username) {
    try {
      // Извлекаем имя пользователя из URL
      const user = username.split('/').pop();
      
      if (!user) {
        throw new Error('Некорректный URL GitHub');
      }
      
      const response = await this.axiosInstance.get(`/users/${user}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении данных пользователя GitHub:', error.message);
      return null;
    }
  }

  // Получение репозиториев пользователя
  async getUserRepositories(username) {
    try {
      // Извлекаем имя пользователя из URL
      const user = username.split('/').pop();
      
      if (!user) {
        throw new Error('Некорректный URL GitHub');
      }
      
      const response = await this.axiosInstance.get(`/users/${user}/repos`, {
        params: {
          sort: 'updated',
          per_page: 10
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении репозиториев GitHub:', error.message);
      return [];
    }
  }
}

// Создание экземпляра сервиса с токеном из конфигурации
const githubService = new GitHubService(config.tokens.github);

module.exports = githubService; 