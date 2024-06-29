import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getAllDeviceZonePositions = () => {
  return axios.get(`${API_URL}/device-zones`);
};

const getDeviceZonePositionById = (id) => {
  return axios.get(`${API_URL}/device-zones/${id}`);
};

const createDeviceZonePosition = (deviceZonePositionData) => {
  return axios.post(`${API_URL}/device-zones`, deviceZonePositionData);
};

const updateDeviceZonePosition = (id, deviceZonePositionData) => {
  return axios.put(`${API_URL}/device-zones/${id}`, deviceZonePositionData);
};

const deleteDeviceZonePosition = (id) => {
  return axios.delete(`${API_URL}/device-zones/${id}`);
};

export default {
  getAllDeviceZonePositions,
  getDeviceZonePositionById,
  createDeviceZonePosition,
  updateDeviceZonePosition,
  deleteDeviceZonePosition,
};
