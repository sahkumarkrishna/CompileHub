import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const authService = {
  login: async (email, password) => {
    const response = await axios.post(`${API_BASE}login`, { email, password });
    return response.data;
  },

  signup: async (name, email, password) => {
    const response = await axios.post(`${API_BASE}signup`, { name, email, password });
    return response.data;
  },

  updatePassword: async (password, currentPassword, token) => {
    const response = await axios.put(
      `${API_BASE}/update-profile`,
      { password, currentPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  }
};
