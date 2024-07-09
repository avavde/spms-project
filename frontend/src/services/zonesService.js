import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getAllZones = async () => {
  try {
    const response = await axios.get(`${API_URL}/zones`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении зон:', error);
    throw error;
  }
};
const createZone = async (zone) => {
  const response = await axios.post(`${API_URL}/zones`, zone);
  return response.data;
};

const updateZone = async (id, zone) => {
  const response = await axios.put(`${API_URL}/zones/${id}`, zone);
  return response.data;
};

const deleteZone = async (id) => {
  await axios.delete(`${API_URL}/zones/${id}`);
};

const getCurrentZone = async (employeeId) => {
  try {
    const response = await axios.get(`${API_URL}/zones/current/${employeeId}`);
    return response.data;
  } catch (error) {
    throw new Error('Ошибка при получении текущей зоны');
  }
};

export default {
  getAllZones,
  getCurrentZone, // Добавить этот метод
  createZone,
  updateZone,
  deleteZone,
};
