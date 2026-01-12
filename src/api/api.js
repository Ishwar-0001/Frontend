const DataAPI = import.meta.env.VITE_NEW_SCRAPE_DATABASED;

const api = {
  Auth: {
    login: `${DataAPI}/auth/login`,
    logout: `${DataAPI}/auth/logout`,
    register: `${DataAPI}/auth/register`,
  },
  DateNumber: {
    getAll: `${DataAPI}/date-number`,
    add: `${DataAPI}/date-number`,
    update: (date) => `${DataAPI}/date-number/${date}`, 
  },
  NewScrapeData:{
    saveScrape:`${DataAPI}/v1/scrape`,
  }
};

export default api;
