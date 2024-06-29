import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getAllZones = () => {
  return axios.get(`${API_URL}/zones`);
};

const getZoneById = (id) => {
  return axios.get(`${API_URL}/zones/${id}`);
};

const createZone = (zoneData) => {
  return axios.post(`${API_URL}/zones`, zoneData);
};

const updateZone = (id, zoneData) => {
  return axios.put(`${API_URL}/zones/${id}`, zoneData);
};

const deleteZone = (id) => {
  return axios.delete(`${API_URL}/zones/${id}`);
};

export default {
  getAllZones,
  getZoneById,
  createZone,
  updateZone,
  deleteZone,
};
