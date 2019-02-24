import axios from 'axios';

const api = axios.create({
  baseURL: 'http://sistemaswe.sesc-ce.com.br/consultasaldo'
});

export default api;