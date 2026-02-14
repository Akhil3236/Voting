import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4002';

export const api = axios.create({
    baseURL: API_URL,
});

// Add interceptor to include token for host routes
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export const socket = io(API_URL);

// Helper for voterId (Fairness mechanism)
export const getVoterId = () => {
    if (typeof window !== 'undefined') {
        let id = localStorage.getItem('voterId');
        if (!id) {
            id = 'voter_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('voterId', id);
        }
        return id;
    }
    return null;
};
