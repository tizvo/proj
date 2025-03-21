const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const config = require('../config/config');
const githubService = require('./githubService');

// Сервис для формирования резюме
class ResumeService {
  constructor() {
    this.template = null;
    this.cachedPage = null;
    this.lastRenderTime = null;
  }

  // Загрузка шаблона резюме
  async loadTemplate() {
    try {
      const templatePath = path.join(config.paths.templates, 'resume.hbs');
      const templateContent = fs.readFileSync(templatePath, 'utf8');
      this.template = handlebars.compile(templateContent);
      return true;
    } catch (error) {
      console.error('Ошибка при загрузке шаблона резюме:', error.message);
      return false;
    }
  }

  // Получение данных для резюме
  async getResumeData() {
    // Получение базовых данных о пользователе из конфигурации
    const userData = { ...config.user };
    
    // Если указан GitHub, получаем информацию из GitHub API
    if (userData.github) {
      try {
        // Получение данных о пользователе GitHub
        const githubUser = await githubService.getUserInfo(userData.github);
        if (githubUser) {
          // Обновляем данные пользователя данными из GitHub
          userData.name = githubUser.name || userData.name;
          userData.email = githubUser.email || userData.email;
          userData.location = githubUser.location || userData.location;
          userData.photoUrl = githubUser.avatar_url || userData.photoUrl;
          
          userData.githubData = {
            name: githubUser.name,
            bio: githubUser.bio,
            followers: githubUser.followers,
            avatarUrl: githubUser.avatar_url,
            publicRepos: githubUser.public_repos,
            htmlUrl: githubUser.html_url,
            company: githubUser.company,
            blog: githubUser.blog,
            twitter: githubUser.twitter_username
          };
        }
        
        // Получение репозиториев пользователя
        const repositories = await githubService.getUserRepositories(userData.github);
        if (repositories && repositories.length > 0) {
          userData.repositories = repositories.map(repo => ({
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language
          }));
        }
      } catch (error) {
        console.error('Ошибка при получении данных из GitHub:', error.message);
      }
    }
    
    return userData;
  }

  // Формирование HTML страницы резюме
  async renderResume() {
    try {
      // Загружаем шаблон, если он еще не загружен
      if (!this.template) {
        const templateLoaded = await this.loadTemplate();
        if (!templateLoaded) {
          throw new Error('Не удалось загрузить шаблон резюме');
        }
      }
      
      // Получаем данные для резюме
      const resumeData = await this.getResumeData();
      
      // Добавляем дополнительные данные
      resumeData.renderDate = new Date().toLocaleString();
      
      // Рендерим шаблон с данными
      this.cachedPage = this.template(resumeData);
      this.lastRenderTime = new Date();
      
      return this.cachedPage;
    } catch (error) {
      console.error('Ошибка при формировании страницы резюме:', error.message);
      return `<h1>Ошибка при формировании резюме</h1><p>${error.message}</p>`;
    }
  }

  // Получение кешированной страницы резюме или рендер новой
  async getResumePage() {
    if (!this.cachedPage) {
      return await this.renderResume();
    }
    return this.cachedPage;
  }
}

// Создание экземпляра сервиса резюме
const resumeService = new ResumeService();

module.exports = resumeService; 