const BaseUrl = import.meta.env.VITE_SERVER_API;
const DataURL = import.meta.env.VITE_DATA_SERVER_API;
const ApiData = import.meta.env.VITE_ADD_DATA;

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
    add: `${ApiData}/game-results/add`,
    getAll: `${ApiData}/game-results`,
  },

  ResponseData: {
    testing: `${DataURL}/testingwala`,
  },
};

export default api;
