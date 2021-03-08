import axios from 'axios';
import router from '../router';
import { setGlobalLoading } from '../store/global';
import AuthService from './auth';
import UserService from './users';
import FeedBackService from './feedbacks';

const API_ENVS = {
  local: 'http://localhost:3000/',
  production: '',
  development: ''
};

const httpClient = axios.create({
  baseURL: API_ENVS.local
});

httpClient.interceptors.request.use(config => {
  setGlobalLoading(true);

  const token = window.localStorage.getItem('token');
  if (token) {
    config.headers.common.Authorization = `Bearer ${token}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  response => {
    setGlobalLoading(false);
    return response;
  },
  error => {
    setGlobalLoading(false);
    const canThrowAnError = error.request.status === 0 || error.request.status === 500;
    if (canThrowAnError) {
      throw new Error(error.message);
    }

    if (error.response.status === 401) {
      router.push({ name: 'Home' });
    }

    return error;
  }
);

export default {
  auth: AuthService(httpClient),
  users: UserService(httpClient),
  feedbacks: FeedBackService(httpClient)
};
