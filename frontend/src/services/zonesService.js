import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getAllZones = async () => {
  const response = await axios.get(`${API_URL}/zones`);
  return response.data;
};

export const createZone = async (zone) => {
  const response = await axios.post(`${API_URL}/zones`, zone);
  return response.data;
};

export const updateZone = async (id, zone) => {
  const response = await axios.put(`${API_URL}/zones/${id}`, zone);
  return response.data;
};

export const deleteZone = async (id) => {
  await axios.delete(`${API_URL}/zones/${id}`);
};
