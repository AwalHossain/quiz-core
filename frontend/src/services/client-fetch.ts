import axios from 'axios';

export const clientFetch = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});
