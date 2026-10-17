import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://api.wallgo.test',
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  //   'X-Requested-With': 'XMLHttpRequest',
});

export const api_url = "https://api.wallgo.test";

api.defaults.xsrfCookieName = 'XSRF-TOKEN';
api.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

export const getUser = async () => {
  const res = await api.get('/user');
  return res.data.user;
};