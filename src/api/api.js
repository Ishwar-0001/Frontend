const BaseUrl = import.meta.env.VITE_DATABASE_AUTH_API;
const Scrape = import.meta.env.VITE_DATABASE_SAVE_SCRAPE;
const CreateNew = import.meta.env.VITE_DATABASE_CREATE_NEW_DATA;
const ScrapeData = import.meta.env.VITE_DATABASE_DATA_READ_SCRAPE;

const api = {
  Auth: {
    register: `${BaseUrl}/register`,
    verifyEmail: `${BaseUrl}/verify-email`,
    requestLoginOTP: `${BaseUrl}/login/request-otp`,
    verifyLoginOTP: `${BaseUrl}/login/verify-otp`,
    loginWithPassword: `${BaseUrl}/login/password`,
    forgotPassword: `${BaseUrl}/forgot-password`,
    resetPassword: `${BaseUrl}/reset-password`,
    changePassword: `${BaseUrl}/change-password`,
    userProfile: `${BaseUrl}/profile`,
  },

  GameResults: {
    add: `${CreateNew}/game-results/add`,
    getAll: `${CreateNew}/game-results`,
  },

  ResponseData: {
    testing: `${Scrape}/`,
  },

  ReadScrapeData:{
    totalData:`${ScrapeData}/`
  }
};

export default api;
