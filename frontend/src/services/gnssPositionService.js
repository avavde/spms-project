import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getAllGNSSPositions = () => {
  return axios.get(`${API_URL}/gnss_positions`);
};

const getGNSSPositionById = (id) => {
  return axios.get(`${API_URL}/gnss_positions/${id}`);
};

const createGNSSPosition = (gnssPositionData) => {
  return axios.post(`${API_URL}/gnss_positions`, gnssPositionData);
};

const updateGNSSPosition = (id, gnssPositionData) => {
  return axios.put(`${API_URL}/gnss_positions/${id}`, gnssPositionData);
};

const deleteGNSSPosition = (id) => {
  return axios.delete(`${API_URL}/gnss_positions/${id}`);
};

export default {
  getAllGNSSPositions,
  getGNSSPositionById,
  createGNSSPosition,
  updateGNSSPosition,
  deleteGNSSPosition,
};
