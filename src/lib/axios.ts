// src/lib/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, 
  headers: {
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`, 
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
