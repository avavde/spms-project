import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getAllEmployeeZones = () => {
  return axios.get(`${API_URL}/employee-zones`);
};

const getEmployeeZoneById = (id) => {
  return axios.get(`${API_URL}/employee-zones/${id}`);
};

const createEmployeeZone = (employeeZoneData) => {
  return axios.post(`${API_URL}/employee-zones`, employeeZoneData);
};

const updateEmployeeZone = (id, employeeZoneData) => {
  return axios.put(`${API_URL}/employee-zones/${id}`, employeeZoneData);
};

const deleteEmployeeZone = (id) => {
  return axios.delete(`${API_URL}/employee-zones/${id}`);
};

export default {
  getAllEmployeeZones,
  getEmployeeZoneById,
  createEmployeeZone,
  updateEmployeeZone,
  deleteEmployeeZone,
};
