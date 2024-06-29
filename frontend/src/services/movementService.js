import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getAllMovements = () => {
  return axios.get(`${API_URL}/movements`);
};

const getMovementById = (id) => {
  return axios.get(`${API_URL}/movements/${id}`);
};

const createMovement = (movementData) => {
  return axios.post(`${API_URL}/movements`, movementData);
};

const updateMovement = (id, movementData) => {
  return axios.put(`${API_URL}/movements/${id}`, movementData);
};

const deleteMovement = (id) => {
  return axios.delete(`${API_URL}/movements/${id}`);
};

export default {
  getAllMovements,
  getMovementById,
  createMovement,
  updateMovement,
  deleteMovement,
};
