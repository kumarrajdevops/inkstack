import client from './client';
import { jwtDecode } from 'jwt-decode';

export const authApi = {
    login: async (username, password) => {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        const res = await client.post('/auth/login', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        if (res.data.access_token) {
            localStorage.setItem('token', res.data.access_token);
        }
        return res.data;
    },
    signup: async (userData) => {
        const res = await client.post('/auth/signup', userData);
        return res.data;
    },
    logout: () => {
        localStorage.removeItem('token');
    },
    getCurrentUser: () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                return jwtDecode(token);
            } catch (e) {
                return null;
            }
        }
        return null;
    },
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

export const blogApi = {
    getAll: async (search = '', page = 1, limit = 6) => {
        const skip = (page - 1) * limit;
        const res = await client.get('/blogs', {
            params: {
                search: search || undefined,
                skip,
                limit
            }
        });
        return res.data;
    },
    create: async (blogData) => {
        const res = await client.post('/blogs', blogData);
        return res.data;
    },
    getById: async (id) => {
        const res = await client.get(`/blogs/${id}`);
        return res.data;
    },
    update: async (id, blogData) => {
        const res = await client.put(`/blogs/${id}`, blogData);
        return res.data;
    },
    delete: async (id) => {
        const res = await client.delete(`/blogs/${id}`);
        return res.data;
    }
};



export const configApi = {
    getFooter: async () => {
        const res = await client.get('/config/footer');
        return res.data;
    }
};

export const userApi = {
    getProfile: async (username) => {
        const res = await client.get(`/users/${username}`);
        return res.data;
    },
    updateProfile: async (userData) => {
        const res = await client.put('/users/me', userData);
        return res.data;
    }
};
