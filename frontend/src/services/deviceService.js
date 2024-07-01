import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getAllDevices = () => {
  return axios.get(`${API_URL}/devices`);
};

const getDeviceById = (id) => {
  return axios.get(`${API_URL}/devices/${id}`);
};

const createDevice = (deviceData) => {
  return axios.post(`${API_URL}/devices`, deviceData);
};

const updateDevice = (id, deviceData) => {
  return axios.put(`${API_URL}/devices/${id}`, deviceData);
};

const getAvailableBeacons = () => {
  return axios.get(`${API_URL}/devices/available/beacons`);
};

const deleteDevice = (id) => {
  return axios.delete(`${API_URL}/devices/${id}`);
};

export default {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  getAvailableBeacons
};



