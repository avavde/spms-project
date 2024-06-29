import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

const getAllUserActions = () => {
  return axios.get(`${API_URL}/user-actions`);
};

const getUserActionById = (id) => {
  return axios.get(`${API_URL}/user-actions/${id}`);
};

const createUserAction = (userActionData) => {
  return axios.post(`${API_URL}/user-actions`, userActionData);
};

const updateUserAction = (id, userActionData) => {
  return axios.put(`${API_URL}/user-actions/${id}`, userActionData);
};

const deleteUserAction = (id) => {
  return axios.delete(`${API_URL}/user-actions/${id}`);
};

export default {
  getAllUserActions,
  getUserActionById,
  createUserAction,
  updateUserAction,
  deleteUserAction,
};
