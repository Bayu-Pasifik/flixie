// src/lib/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com', // API publik
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
