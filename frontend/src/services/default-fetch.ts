import axios from 'axios';
import { cookies } from 'next/headers';

export const defaultFetch = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

defaultFetch.interceptors.request.use((config) => {
  const accessToken = cookies().get('access_token');
  config.headers.Authorization = `Bearer ${accessToken?.value}`;

  return config;
});
