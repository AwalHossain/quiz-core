/* eslint-disable no-empty */
'use server';
import axios from 'axios';
import { cookies } from 'next/headers';

export const serverFetch = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

serverFetch.interceptors.request.use((config) => {
  const accessToken = cookies().get('access_token');
  config.headers.Authorization = `Bearer ${accessToken?.value}`;

  return config;
});

// Add a response interceptor to handle errors
serverFetch.interceptors.response.use((response) => {
  if (response.status === 401) {
  }
  return response;
});
