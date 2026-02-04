import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: 'http://localhost:5198/api'
});


// Interceptor para peticiones (Request)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      const decoded: any = jwtDecode(token? token : "");
      const currentTime = Date.now() / 1000; 

      if(decoded.exp < currentTime){
          localStorage.removeItem('user_session');
          localStorage.removeItem('token'); 
          window.location.href = '/login';
          console.log("Token expirado");    
      }
      // Si hay token, lo añadimos al header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;