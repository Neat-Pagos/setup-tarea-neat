import axios from 'axios';

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
export const api = axios.create({ baseURL: API_URL, withCredentials: true });
