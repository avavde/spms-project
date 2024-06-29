import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getAllUsers = () => {
  return axios.get(`${API_URL}/users`);
};

const getUserById = (id) => {
  return axios.get(`${API_URL}/users/${id}`);
};

const createUser = (userData) => {
  return axios.post(`${API_URL}/users`, userData);
};

const updateUser = (id, userData) => {
  return axios.put(`${API_URL}/users/${id}`, userData);
};

const deleteUser = (id) => {
  return axios.delete(`${API_URL}/users/${id}`);
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
