import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, { email, password });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('userRole', response.data.role);
    return response.data.role;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const register = async (email, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/users/register`, { email, password, role }, {
      headers: { 'x-auth-token': localStorage.getItem('token') }
    });
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getUserRole = () => {
  return localStorage.getItem('userRole');
};